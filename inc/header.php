<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Weather Dashboard</title>
<!-- Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          pastel: {
            50: '#f6fbff',
            100: '#e9f5ff',
            200: '#cfeeff',
            300: '#b8e8ff',
            400: '#9fe0ff',
            500: '#87d8ff',
            600: '#5fbfed',
            700: '#3aa0d9',
          }
        }
      }
    }
  }
</script>
<link rel="stylesheet" href="assets/css/styles.css">
</head>
<body class="min-h-screen bg-pastel-50 text-slate-700 transition-colors">
