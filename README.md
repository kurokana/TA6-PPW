Weather Dashboard (PHP + Tailwind + Vanilla JS)

1) Siapkan folder sesuai struktur di atas.
2) Ganti API key di api.php:
   define('OPENWEATHER_API_KEY', 'PASTE_YOUR_API_KEY_HERE');

3) Jalankan di server PHP (local: XAMPP, MAMP, PHP built-in).
   contoh: php -S localhost:8000
   lalu buka http://localhost:8000/index.php

Catatan:
- API proxy menyembunyikan key; jangan commit ke repo publik.
- Favorites disimpan di localStorage.
- Auto-refresh setiap 5 menit.
