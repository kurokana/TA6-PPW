<?php 
include __DIR__ . '/inc/header.php'; ?>

<div class="max-w-6xl mx-auto p-4 md:p-6">
  <header class="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
    <div>
      <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
        Weather Dashboard
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time weather updates powered by WeatherAPI</p>
    </div>
    <div class="flex items-center gap-3">
      <button id="themeToggle" class="px-4 py-2 rounded-lg shadow-md glass hover:bg-pastel-200 dark:hover:bg-slate-700 font-medium">
        🌙 Dark
      </button>
      <button id="unitsToggle" class="px-4 py-2 rounded-lg shadow-md glass hover:bg-pastel-200 dark:hover:bg-slate-700 font-medium">
        °C
      </button>
    </div>
  </header>

  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Sidebar: Search & Favorites -->
    <section class="lg:col-span-1 space-y-6">
      <!-- Search Box -->
      <div class="glass p-5 rounded-2xl shadow-lg">
        <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
          🔍 Cari Kota
        </label>
        <div class="relative">
          <input 
            id="searchInput" 
            class="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-pastel-400" 
            placeholder="Ketik nama kota..." 
            autocomplete="off"
          />
          <ul id="suggestions" class="absolute w-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-10 overflow-hidden"></ul>
        </div>
      </div>

      <!-- Favorites -->
      <div class="glass p-5 rounded-2xl shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-lg text-slate-700 dark:text-slate-300">⭐ Favorit</h3>
          <button id="clearFav" class="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
            Hapus Semua
          </button>
        </div>
        <div id="favorites" class="space-y-2 max-h-96 overflow-y-auto pr-1"></div>
      </div>

      <!-- Refresh Button -->
      <div class="glass p-4 rounded-2xl shadow-lg">
        <button id="refreshBtn" class="w-full py-3 rounded-lg bg-gradient-to-r from-pastel-400 to-pastel-500 hover:from-pastel-500 hover:to-pastel-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
          🔄 Refresh Data
        </button>
        <div id="status" class="mt-3 text-sm text-center text-slate-600 dark:text-slate-400 min-h-[20px]"></div>
      </div>
    </section>

    <!-- Main Weather Display -->
    <section class="lg:col-span-2 space-y-6">
      <!-- Current Weather -->
      <div class="glass p-6 md:p-8 rounded-2xl shadow-lg">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex-1">
            <div id="locName" class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">—</div>
            <div id="timestamp" class="text-sm text-slate-500 dark:text-slate-400 mt-1">—</div>
          </div>
          <div class="text-left md:text-right">
            <div id="temp" class="text-6xl md:text-7xl font-bold text-transparent bg-gradient-to-br from-orange-400 to-pink-500 bg-clip-text">
              --°
            </div>
            <div id="cond" class="text-base text-slate-600 dark:text-slate-300 mt-2 flex items-center justify-start md:justify-end gap-2">—</div>
          </div>
        </div>

        <!-- Weather Details -->
        <div class="mt-6 grid grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-center shadow-sm">
            <div class="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">💧 Humidity</div>
            <div id="humidity" class="text-xl font-bold text-blue-700 dark:text-blue-300">--%</div>
          </div>
          <div class="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-center shadow-sm">
            <div class="text-xs font-medium text-green-600 dark:text-green-400 mb-1">💨 Wind</div>
            <div id="wind" class="text-xl font-bold text-green-700 dark:text-green-300">-- km/h</div>
          </div>
          <div class="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 text-center shadow-sm">
            <div class="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">🌡️ Feels Like</div>
            <div id="feels" class="text-xl font-bold text-purple-700 dark:text-purple-300">--°</div>
          </div>
        </div>
      </div>

      <!-- 5-Day Forecast -->
      <div class="glass p-6 md:p-8 rounded-2xl shadow-lg">
        <h4 class="font-bold text-xl mb-4 text-slate-800 dark:text-slate-100">📅 5-Day Forecast</h4>
        <div id="forecast" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"></div>
      </div>
    </section>
  </main>

  <!-- Footer Info -->
  <footer class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
    <p>Data cuaca dari <a href="https://www.weatherapi.com/" target="_blank" class="text-pastel-600 dark:text-pastel-400 hover:underline">WeatherAPI.com</a></p>
    <p class="mt-1">Auto-refresh setiap 5 menit • Data disimpan di localStorage</p>
  </footer>
</div>

<?php include __DIR__ . '/inc/footer.php'; ?>
