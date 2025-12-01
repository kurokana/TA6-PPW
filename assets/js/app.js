// Weather Dashboard App - WeatherAPI.com Integration
const API_PROXY = 'api.php';
let units = 'metric';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const favoritesEl = document.getElementById('favorites');
const locName = document.getElementById('locName');
const timestampEl = document.getElementById('timestamp');
const tempEl = document.getElementById('temp');
const condEl = document.getElementById('cond');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const feelsEl = document.getElementById('feels');
const forecastEl = document.getElementById('forecast');
const statusEl = document.getElementById('status');
const unitsToggle = document.getElementById('unitsToggle');
const themeToggle = document.getElementById('themeToggle');
const refreshBtn = document.getElementById('refreshBtn');
const clearFav = document.getElementById('clearFav');

let debounceTimer = null;
let currentLocation = null;
let refreshIntervalId = null;

// Helper Functions
function setStatus(txt, loading = false) {
  statusEl.textContent = txt;
  statusEl.className = loading 
    ? 'mt-2 text-sm text-slate-500 dark:text-slate-400 loading-dot' 
    : 'mt-2 text-sm text-slate-500 dark:text-slate-400';
}

function fetchJson(url) {
  return fetch(url).then(r => {
    if (!r.ok) throw new Error('Network error');
    return r.json();
  });
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.trim();
  suggestions.innerHTML = '';
  if (debounceTimer) clearTimeout(debounceTimer);
  if (q.length < 2) return;
  
  debounceTimer = setTimeout(() => {
    setStatus('Mencari...', true);
    fetchJson(`${API_PROXY}?action=search&q=${encodeURIComponent(q)}`)
      .then(data => {
        setStatus('');
        if (!data || data.length === 0) {
          suggestions.innerHTML = '<li class="p-2 text-sm text-slate-500">Tidak ada hasil</li>';
          return;
        }
        suggestions.innerHTML = data.map(item => {
          const name = `${item.name}${item.region ? ', ' + item.region : ''}, ${item.country}`;
          return `<li class="p-2 rounded hover:bg-pastel-200 dark:hover:bg-slate-700 cursor-pointer transition-colors" 
                      data-lat="${item.lat}" data-lon="${item.lon}" data-name="${name}">${name}</li>`;
        }).join('');
      })
      .catch(err => {
        setStatus('Gagal mencari kota.');
        console.error(err);
      });
  }, 350);
});

suggestions.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const lat = li.dataset.lat, lon = li.dataset.lon, name = li.dataset.name;
  setCurrentLocation({ name, lat, lon });
  suggestions.innerHTML = '';
  searchInput.value = '';
});

document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.innerHTML = '';
  }
});

// Favorites Management
function loadFavorites() {
  const raw = localStorage.getItem('favCities');
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveFavorites(arr) {
  localStorage.setItem('favCities', JSON.stringify(arr));
  renderFavorites();
}

function renderFavorites() {
  const arr = loadFavorites();
  if (arr.length === 0) {
    favoritesEl.innerHTML = '<div class="text-sm text-slate-500 dark:text-slate-400">Belum ada favorit</div>';
    return;
  }
  favoritesEl.innerHTML = arr.map((c, i) => `
    <div class="flex items-center justify-between bg-white/60 dark:bg-slate-800/60 p-2 rounded transition-colors">
      <div class="flex-1 min-w-0">
        <div class="font-medium truncate">${c.name}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400">${parseFloat(c.lat).toFixed(2)}, ${parseFloat(c.lon).toFixed(2)}</div>
      </div>
      <div class="flex gap-2 flex-shrink-0">
        <button data-idx="${i}" class="fav-go px-3 py-1 rounded text-sm glass hover:bg-pastel-300 dark:hover:bg-slate-700 transition-colors">Go</button>
        <button data-idx="${i}" class="fav-del px-3 py-1 rounded text-sm glass hover:bg-red-200 dark:hover:bg-red-900 transition-colors">Del</button>
      </div>
    </div>
  `).join('');
}

favoritesEl.addEventListener('click', (e) => {
  const go = e.target.closest('.fav-go');
  const del = e.target.closest('.fav-del');
  if (go) {
    const idx = go.dataset.idx;
    const arr = loadFavorites();
    setCurrentLocation(arr[idx]);
  }
  if (del) {
    const idx = del.dataset.idx;
    const arr = loadFavorites();
    arr.splice(idx, 1);
    saveFavorites(arr);
  }
});

clearFav.addEventListener('click', () => {
  if (confirm('Hapus semua favorit?')) {
    localStorage.removeItem('favCities');
    renderFavorites();
  }
});

// Location & Weather
function setCurrentLocation(loc) {
  currentLocation = { 
    name: loc.name, 
    lat: parseFloat(loc.lat), 
    lon: parseFloat(loc.lon) 
  };
  
  const arr = loadFavorites();
  const exists = arr.some(c => 
    Math.abs(c.lat - currentLocation.lat) < 0.01 && 
    Math.abs(c.lon - currentLocation.lon) < 0.01
  );
  
  if (!exists) {
    const save = confirm(`Simpan "${loc.name}" ke Favorites?`);
    if (save) {
      arr.unshift(currentLocation);
      if (arr.length > 10) arr.pop();
      saveFavorites(arr);
    }
  }
  
  updateWeather();
}

function updateWeather() {
  if (!currentLocation) return setStatus('Pilih kota dulu.');
  setStatus('Mengambil data cuaca...', true);
  
  const query = `${currentLocation.lat},${currentLocation.lon}`;
  fetchJson(`${API_PROXY}?action=weather&q=${encodeURIComponent(query)}&days=5`)
    .then(data => {
      setStatus('');
      if (data.error) {
        setStatus('Error: ' + (data.error.message || 'Gagal ambil data'));
        return;
      }
      renderWeather(data);
    })
    .catch(err => {
      console.error(err);
      setStatus('Gagal ambil data cuaca.');
    });
}

function renderWeather(data) {
  const loc = data.location;
  const cur = data.current;
  const forecast = data.forecast && data.forecast.forecastday ? data.forecast.forecastday : [];

  locName.textContent = `${loc.name}${loc.region ? ', ' + loc.region : ''}, ${loc.country}`;
  timestampEl.textContent = loc.localtime || new Date().toLocaleString();

  const tempVal = units === 'metric' ? Math.round(cur.temp_c) : Math.round(cur.temp_f);
  tempEl.textContent = `${tempVal}°${units === 'metric' ? 'C' : 'F'}`;

  let iconUrl = cur.condition && cur.condition.icon ? cur.condition.icon : '';
  if (iconUrl && iconUrl.startsWith('//')) iconUrl = 'https:' + iconUrl;
  
  condEl.innerHTML = cur.condition ? 
    `<div class="flex items-center justify-end gap-2"><img src="${iconUrl}" alt="${cur.condition.text}" class="w-8 h-8" /><span>${cur.condition.text}</span></div>` 
    : '';

  humidityEl.textContent = `${cur.humidity}%`;
  
  const windSpeed = units === 'metric' ? cur.wind_kph : cur.wind_mph;
  const windUnit = units === 'metric' ? 'km/h' : 'mph';
  windEl.textContent = `${windSpeed} ${windUnit}`;
  
  const feelsVal = units === 'metric' ? Math.round(cur.feelslike_c) : Math.round(cur.feelslike_f);
  feelsEl.textContent = `${feelsVal}°`;

  forecastEl.innerHTML = forecast.map(day => {
    const dateObj = new Date(day.date + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
    let ic = day.day && day.day.condition && day.day.condition.icon ? day.day.condition.icon : '';
    if (ic && ic.startsWith('//')) ic = 'https:' + ic;
    const desc = day.day.condition && day.day.condition.text ? day.day.condition.text : '';
    const min = units === 'metric' ? Math.round(day.day.mintemp_c) : Math.round(day.day.mintemp_f);
    const max = units === 'metric' ? Math.round(day.day.maxtemp_c) : Math.round(day.day.maxtemp_f);
    return `
      <div class="p-3 rounded text-center bg-white/60 dark:bg-slate-800/60 transition-all hover:scale-105 hover:shadow-lg">
        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">${dayName}</div>
        <img src="${ic}" alt="${desc}" class="mx-auto w-12 h-12" />
        <div class="text-sm font-semibold mt-1">${max}° / ${min}°</div>
        <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate" title="${desc}">${desc}</div>
      </div>
    `;
  }).join('');
}

// Controls
unitsToggle.addEventListener('click', () => {
  if (units === 'metric') {
    units = 'imperial';
    unitsToggle.textContent = '°F';
  } else {
    units = 'metric';
    unitsToggle.textContent = '°C';
  }
  if (currentLocation) updateWeather();
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
});

refreshBtn.addEventListener('click', () => {
  if (currentLocation) {
    updateWeather();
  } else {
    setStatus('Pilih kota terlebih dahulu');
  }
});

// Auto-refresh every 5 minutes
function startAutoRefresh() {
  if (refreshIntervalId) clearInterval(refreshIntervalId);
  refreshIntervalId = setInterval(() => {
    if (currentLocation) updateWeather();
  }, 5 * 60 * 1000);
}

// Geolocation
function tryGeo() {
  if (!navigator.geolocation) {
    setStatus('Cari kota atau pilih dari favorit.');
    renderFavorites();
    return;
  }
  
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(4);
    const lon = pos.coords.longitude.toFixed(4);
    setStatus('Mendeteksi lokasi Anda...', true);
    
    const query = `${lat},${lon}`;
    fetchJson(`${API_PROXY}?action=weather&q=${encodeURIComponent(query)}&days=1`)
      .then(data => {
        setStatus('');
        if (data.location) {
          const name = `${data.location.name}${data.location.region ? ', ' + data.location.region : ''}, ${data.location.country}`;
          setCurrentLocation({ name, lat: parseFloat(lat), lon: parseFloat(lon) });
        } else {
          setStatus('Tidak dapat menentukan lokasi. Pilih kota secara manual.');
        }
      })
      .catch(err => {
        setStatus('Gagal mendapatkan lokasi. Pilih kota secara manual.');
        console.error(err);
      });
  }, err => {
    setStatus('Geolocation ditolak. Pilih kota secara manual.');
    renderFavorites();
  });
}

// Initialize
function init() {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Light';
  } else {
    themeToggle.textContent = '🌙 Dark';
  }
  
  renderFavorites();
  tryGeo();
  startAutoRefresh();
}

init();
