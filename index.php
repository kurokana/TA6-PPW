<?php 
include __DIR__ . '/inc/header.php'; ?>

<div class="container">
  <header class="header">
    <div>
      <h1>Weather Dashboard</h1>
      <p class="subtitle">Real-time weather updates powered by WeatherAPI</p>
    </div>
    <div class="header-buttons">
      <button id="themeToggle" class="btn btn-header">🌙 Dark</button>
      <button id="unitsToggle" class="btn btn-header">°C</button>
    </div>
  </header>

  <main class="main-grid">
    <!-- Sidebar: Search & Favorites -->
    <section class="sidebar">
      <!-- Search Box -->
      <div class="card">
        <label class="card-label">🔍 Cari Kota</label>
        <div class="search-wrapper">
          <input 
            id="searchInput" 
            class="input-search" 
            placeholder="Ketik nama kota..." 
            autocomplete="off"
          />
          <ul id="suggestions" class="suggestions-list"></ul>
        </div>
      </div>

      <!-- Favorites -->
      <div class="card">
        <div class="favorites-header">
          <h3>⭐ Favorit</h3>
          <button id="clearFav" class="btn-text">Hapus Semua</button>
        </div>
        <div id="favorites" class="favorites-list"></div>
      </div>

      <!-- Refresh Button -->
      <div class="card">
        <button id="refreshBtn" class="btn btn-refresh">🔄 Refresh Data</button>
        <div id="status" class="status-text"></div>
      </div>
    </section>

    <!-- Main Weather Display -->
    <section class="main-content">
      <!-- Current Weather -->
      <div class="card card-large">
        <div class="weather-header">
          <div class="location-info">
            <div id="locName" class="location-name">—</div>
            <div id="timestamp" class="timestamp">—</div>
          </div>
          <div class="temp-section">
            <div id="temp" class="temperature">--°</div>
            <div id="cond" class="condition">—</div>
          </div>
        </div>

        <!-- Weather Details -->
        <div class="weather-details">
          <div class="detail-card card-blue">
            <div class="detail-label">💧 Humidity</div>
            <div id="humidity" class="detail-value">--%</div>
          </div>
          <div class="detail-card card-green">
            <div class="detail-label">💨 Wind</div>
            <div id="wind" class="detail-value">-- km/h</div>
          </div>
          <div class="detail-card card-purple">
            <div class="detail-label">🌡️ Feels Like</div>
            <div id="feels" class="detail-value">--°</div>
          </div>
        </div>
      </div>

      <!-- 5-Day Forecast -->
      <div class="card card-large">
        <h4 class="forecast-title">📅 5-Day Forecast</h4>
        <div id="forecast" class="forecast-grid"></div>
      </div>
    </section>
  </main>

  <!-- Footer Info -->
  <footer class="footer">
    <p>Data cuaca dari <a href="https://www.weatherapi.com/" target="_blank">WeatherAPI.com</a></p>
    <p>Auto-refresh setiap 5 menit • Data disimpan di localStorage</p>
  </footer>
</div>

<?php include __DIR__ . '/inc/footer.php'; ?>
