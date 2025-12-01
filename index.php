<?php include __DIR__ . '/inc/header.php'; ?>

<div class="max-w-4xl mx-auto p-6">
  <header class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Weather Dashboard</h1>
    <div class="flex items-center gap-3">
      <button id="themeToggle" class="px-3 py-1 rounded-md shadow glass">Dark</button>
      <button id="unitsToggle" class="px-3 py-1 rounded-md shadow glass">°C</button>
    </div>
  </header>

  <main class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <section class="col-span-1 glass p-4 rounded-xl">
      <div>
        <label class="block text-sm font-medium mb-1">Cari kota</label>
        <input id="searchInput" class="w-full p-2 rounded border" placeholder="Ketik nama kota..." autocomplete="off"/>
        <ul id="suggestions" class="mt-2 space-y-1"></ul>
      </div>

      <div class="mt-4">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold">Favorite</h3>
          <button id="clearFav" class="text-sm text-slate-500">Clear</button>
        </div>
        <ul id="favorites" class="mt-2 space-y-2"></ul>
      </div>

      <div class="mt-4">
        <button id="refreshBtn" class="w-full py-2 rounded bg-pastel-300 hover:bg-pastel-400">Refresh</button>
      </div>
      <div id="status" class="mt-2 text-sm text-slate-500"></div>
    </section>

    <section class="col-span-1 md:col-span-2 glass p-6 rounded-xl">
      <div class="flex items-center justify-between">
        <div>
          <div id="locName" class="text-xl font-semibold">—</div>
          <div id="timestamp" class="text-sm text-slate-500">—</div>
        </div>
        <div class="text-right">
          <div id="temp" class="text-5xl font-bold">--°</div>
          <div id="cond" class="text-sm text-slate-600">—</div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-4 text-center">
        <div class="p-3 rounded bg-white/60">
          <div class="text-xs text-slate-500">Humidity</div>
          <div id="humidity" class="font-semibold">--%</div>
        </div>
        <div class="p-3 rounded bg-white/60">
          <div class="text-xs text-slate-500">Wind</div>
          <div id="wind" class="font-semibold">-- m/s</div>
        </div>
        <div class="p-3 rounded bg-white/60">
          <div class="text-xs text-slate-500">Feels</div>
          <div id="feels" class="font-semibold">--°</div>
        </div>
      </div>

      <div class="mt-6">
        <h4 class="font-semibold mb-2">5-Day Forecast</h4>
        <div id="forecast" class="grid grid-cols-5 gap-2"></div>
      </div>
    </section>
  </main>
</div>

<?php include __DIR__ . '/inc/footer.php'; ?>
