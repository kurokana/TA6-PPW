// app.js
const API_PROXY = 'api.php';
let units = 'metric';

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

function setStatus(txt, loading=false) {
  statusEl.textContent = txt;
  statusEl.className = loading ? 'mt-2 text-sm text-slate-500 loading-dot' : 'mt-2 text-sm text-slate-500';
}

function fetchJson(url) {
  return fetch(url).then(r => {
    if (!r.ok) throw new Error('Network error');
    return r.json();
  });
}

function formatDate(dt, tzOffsetSecs=0) {
  const d = new Date((dt + tzOffsetSecs) * 1000);
  return d.toLocaleString();
}

searchInput.addEventListener('input', (e) => {
  const q = e.target.value.trim();
  suggestions.innerHTML = '';
  if (debounceTimer) clearTimeout(debounceTimer);
  if (q.length < 2) return;
  debounceTimer = setTimeout(() => {
    setStatus('Mencari...', true);
    fetchJson(`${API_PROXY}?action=geocode&q=${encodeURIComponent(q)}&limit=6`)
      .then(data => {
        setStatus('');
        suggestions.innerHTML = data.map(item => {
          const name = `${item.name}${item.state ? ', '+item.state: ''}, ${item.country}`;
          return `<li class="p-2 rounded hover:bg-pastel-100 cursor-pointer" data-lat="${item.lat}" data-lon="${item.lon}" data-name="${name}">${name}</li>`;
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
  setCurrentLocation({name, lat, lon});
  suggestions.innerHTML = '';
  searchInput.value = '';
});

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
    favoritesEl.innerHTML = '<div class="text-sm text-slate-500">Belum ada favorit</div>';
    return;
  }
  favoritesEl.innerHTML = arr.map((c, i) => `
    <div class="flex items-center justify-between bg-white/60 p-2 rounded">
      <div>
        <div class="font-medium">${c.name}</div>
        <div class="text-xs text-slate-500">${c.lat.toFixed(2)}, ${c.lon.toFixed(2)}</div>
      </div>
      <div class="flex gap-2">
        <button data-idx="${i}" class="fav-go px-2 py-1 rounded text-sm glass">Go</button>
        <button data-idx="${i}" class="fav-del px-2 py-1 rounded text-sm glass">Del</button>
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
    arr.splice(idx,1);
    saveFavorites(arr);
  }
});

document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.innerHTML = '';
  }
});

clearFav.addEventListener('click', () => {
  localStorage.removeItem('favCities');
  renderFavorites();
});

function setCurrentLocation(loc) {
  currentLocation = {name: loc.name, lat: parseFloat(loc.lat), lon: parseFloat(loc.lon)};
  const save = confirm(`Simpan "${loc.name}" ke Favorites? Tekan Cancel kalau tidak.`);
  if (save) {
    const arr = loadFavorites();
    if (!arr.some(c => c.lat === currentLocation.lat && c.lon === currentLocation.lon)) {
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
  fetchJson(`${API_PROXY}?action=weather&lat=${currentLocation.lat}&lon=${currentLocation.lon}&units=${units}`)
    .then(data => {
      setStatus('');
      renderWeather(data);
    })
    .catch(err => {
      console.error(err);
      setStatus('Gagal ambil data cuaca.');
    });
}

function renderWeather(data) {
  const tzoff = data.timezone_offset || 0;
  const cur = data.current;
  const daily = data.daily || [];

  locName.textContent = currentLocation.name;
  timestampEl.textContent = formatDate(cur.dt, tzoff);
  const temp = Math.round(cur.temp);
  tempEl.textContent = `${temp}°${units === 'metric' ? 'C' : 'F'}`;
  condEl.textContent = cur.weather && cur.weather[0] ? cur.weather[0].description : '';
  humidityEl.textContent = `${cur.humidity}%`;
  windEl.textContent = `${cur.wind_speed} ${units === 'metric' ? 'm/s' : 'mph'}`;
  feelsEl.textContent = `${Math.round(cur.feels_like)}°`;

  const five = daily.slice(0,5);
  forecastEl.innerHTML = five.map(d => {
    const dt = new Date((d.dt + tzoff)*1000);
    const day = dt.toLocaleDateString(undefined, { weekday: 'short' });
    const icon = d.weather && d.weather[0] ? d.weather[0].icon : '';
    const desc = d.weather && d.weather[0] ? d.weather[0].description : '';
    const min = Math.round(d.temp.min);
    const max = Math.round(d.temp.max);
    return `
      <div class="p-2 rounded text-center bg-white/60">
        <div class="text-xs text-slate-500">${day}</div>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" class="mx-auto" />
        <div class="text-sm font-medium">${max}° / ${min}°</div>
        <div class="text-xs text-slate-500">${desc}</div>
      </div>
    `;
  }).join('');
}

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
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.textContent = 'Light';
  } else {
    themeToggle.textContent = 'Dark';
  }
});

refreshBtn.addEventListener('click', () => {
  updateWeather();
});

function startAutoRefresh() {
  if (refreshIntervalId) clearInterval(refreshIntervalId);
  refreshIntervalId = setInterval(() => {
    if (currentLocation) updateWeather();
  }, 5 * 60 * 1000);
}

function tryGeo() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    setStatus('Mendeteksi lokasi...', true);
    fetchJson(`${API_PROXY}?action=reverse&lat=${lat}&lon=${lon}`)
      .then(data => {
        setStatus('');
        if (data && data.length) {
          const entry = data[0];
          const name = `${entry.name}${entry.state? ', '+entry.state : ''}, ${entry.country}`;
          setCurrentLocation({name, lat, lon});
        } else {
          currentLocation = null;
          setStatus('Tidak dapat menentukan nama lokasi.');
        }
      })
      .catch(err => {
        setStatus('Gagal reverse geocode.');
      });
  }, err => {
    setStatus('Geolocation tidak tersedia/ditolak.');
    renderFavorites();
  });
}

renderFavorites();
tryGeo();
startAutoRefresh();
