<img width="1919" height="979" alt="image" src="https://github.com/user-attachments/assets/1aaeba77-bb48-437e-b566-6b3506e6c710" />
<img width="1918" height="980" alt="image" src="https://github.com/user-attachments/assets/d63799b2-4971-4fbf-9364-140f02a31c1a" />



# Weather Dashboard (PHP + Tailwind + Vanilla JS)

Dashboard cuaca real-time dengan fitur pencarian kota, favorit, dan forecast 5 hari menggunakan WeatherAPI.com.

## 🚀 Fitur

- ✅ Pencarian kota dengan autocomplete
- ✅ Data cuaca real-time (suhu, kelembaban, kecepatan angin, dll)
- ✅ Forecast 5 hari ke depan
- ✅ Simpan kota favorit (localStorage)
- ✅ Toggle dark/light mode
- ✅ Switch unit °C/°F
- ✅ Auto-refresh setiap 5 menit
- ✅ Deteksi lokasi otomatis (geolocation)
- ✅ UI responsive & modern

## 📦 Instalasi

### 1. Clone atau Download Repositori

```bash
git clone <repository-url>
cd TA6
```

### 2. Setup API Key

1. Daftar gratis di [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Copy API key Anda
3. Buka file `api.php`
4. Ganti `WEATHERAPI_KEY` dengan API key Anda:

```php
define('WEATHERAPI_KEY', 'PASTE_YOUR_API_KEY_HERE');
```

### 3. Jalankan Server PHP

#### Opsi 1: PHP Built-in Server (Recommended)

```bash
php -S localhost:8000
```

Lalu buka browser: `http://localhost:8000/index.php`

#### Opsi 2: XAMPP/MAMP

- Pindahkan folder ke `htdocs` (XAMPP) atau `htdocs` (MAMP)
- Akses via `http://localhost/TA6/index.php`

## 📁 Struktur Folder

```
TA6/
├── api.php              # API proxy (menyembunyikan API key)
├── index.php            # Halaman utama
├── README.md            # Dokumentasi
├── assets/
│   ├── css/
│   │   └── styles.css   # Custom CSS & dark mode
│   └── js/
│       └── app.js       # Logic aplikasi (search, weather, favorites)
└── inc/
    ├── header.php       # HTML header & Tailwind config
    └── footer.php       # HTML footer
```

## 🔑 API Endpoints

### 1. Search Kota

```
GET api.php?action=search&q=Jakarta
```

Response: Array objek dengan `name`, `region`, `country`, `lat`, `lon`

### 2. Weather & Forecast

```
GET api.php?action=weather&q=Jakarta&days=5
```

Response: Objek dengan `location`, `current`, `forecast`

## 🛠️ Teknologi

- **Backend**: PHP 7.4+ (cURL untuk HTTP requests)
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **API**: [WeatherAPI.com](https://www.weatherapi.com/)

## ⚙️ Konfigurasi

### Dark Mode

Dark mode disimpan di localStorage. Toggle dengan tombol di header.

### Favorites

Maks 10 kota favorit, disimpan di `localStorage` dengan key `favCities`.

### Auto-refresh

Data cuaca otomatis refresh setiap 5 menit saat ada lokasi aktif.

## 🐛 Troubleshooting

### Error: "Bad gateway or request failed"

- Pastikan API key valid
- Cek koneksi internet
- Pastikan cURL aktif di PHP (`php -m | grep curl`)

### Geolocation tidak bekerja

- Pastikan browser mendukung geolocation
- Akses via HTTPS atau localhost
- Izinkan akses lokasi saat diminta browser

### Data tidak muncul

- Buka Console browser (F12) untuk melihat error
- Pastikan endpoint `api.php` dapat diakses
- Cek response API di Network tab

## 📝 Catatan

- **Keamanan**: API key disembunyikan di server-side (jangan commit ke repo publik!)
- **Rate Limit**: Free tier WeatherAPI: 1 juta calls/bulan
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran Praktikum Pemrograman Web.

---

Made with ❤️ for Tugas Akhir Praktikum Pemrograman Web
