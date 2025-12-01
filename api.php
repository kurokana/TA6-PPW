<?php
define('WEATHERAPI_KEY', '675e7a1bc37a4190a6c123418250112');

header('Content-Type: application/json; charset=utf-8');

$action = isset($_GET['action']) ? $_GET['action'] : '';

function proxy_get($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'WeatherDashboard/1.0');
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($resp === false || $code >= 400) {
        http_response_code(502);
        echo json_encode(['error' => 'Bad gateway or request failed.', 'http_code' => $code, 'curl_err' => $err]);
        exit;
    }
    echo $resp;
    exit;
}

if ($action === 'search') {
    $q = isset($_GET['q']) ? rawurlencode($_GET['q']) : '';
    if ($q === '') { echo json_encode([]); exit; }
    $url = "https://api.weatherapi.com/v1/search.json?key=" . WEATHERAPI_KEY . "&q={$q}";
    proxy_get($url);
}

if ($action === 'weather') {
    $q = isset($_GET['q']) ? rawurlencode($_GET['q']) : '';
    $days = isset($_GET['days']) ? intval($_GET['days']) : 5; // default 5-day forecast
    $aqi = isset($_GET['aqi']) && $_GET['aqi'] === 'yes' ? 'yes' : 'no';
    $alerts = isset($_GET['alerts']) && $_GET['alerts'] === 'yes' ? 'yes' : 'no';
    if ($q === '') {
        http_response_code(400);
        echo json_encode(['error' => 'q (query) required']);
        exit;
    }
    $url = "https://api.weatherapi.com/v1/forecast.json?key=" . WEATHERAPI_KEY . "&q={$q}&days={$days}&aqi={$aqi}&alerts={$alerts}";
    proxy_get($url);
}

http_response_code(400);
echo json_encode(['error' => 'invalid action']);
