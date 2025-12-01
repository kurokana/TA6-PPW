<?php
define('OPENWEATHER_API_KEY', 'PASTE_YOUR_API_KEY_HERE');
header('Content-Type: application/json; charset=utf-8');

$action = isset($_GET['action']) ? $_GET['action'] : '';

function proxy_get($url) {
    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "User-Agent: WeatherDashboard/1.0\r\n"
        ]
    ];
    $context = stream_context_create($opts);
    $resp = @file_get_contents($url, false, $context);
    if ($resp === FALSE) {
        http_response_code(502);
        echo json_encode(['error' => 'Bad gateway or request failed.']);
        exit;
    }
    echo $resp;
    exit;
}

if ($action === 'geocode') {
    $q = isset($_GET['q']) ? rawurlencode($_GET['q']) : '';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;
    if ($q === '') { echo json_encode([]); exit; }
    $url = "http://api.openweathermap.org/geo/1.0/direct?q={$q}&limit={$limit}&appid=" . OPENWEATHER_API_KEY;
    proxy_get($url);
}

if ($action === 'reverse') {
    $lat = isset($_GET['lat']) ? rawurlencode($_GET['lat']) : '';
    $lon = isset($_GET['lon']) ? rawurlencode($_GET['lon']) : '';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 1;
    if ($lat === '' || $lon === '') { echo json_encode([]); exit; }
    $url = "http://api.openweathermap.org/geo/1.0/reverse?lat={$lat}&lon={$lon}&limit={$limit}&appid=" . OPENWEATHER_API_KEY;
    proxy_get($url);
}

if ($action === 'weather') {
    $lat = isset($_GET['lat']) ? rawurlencode($_GET['lat']) : '';
    $lon = isset($_GET['lon']) ? rawurlencode($_GET['lon']) : '';
    $units = isset($_GET['units']) && $_GET['units'] === 'imperial' ? 'imperial' : 'metric';
    if ($lat === '' || $lon === '') {
        http_response_code(400);
        echo json_encode(['error' => 'lat & lon required']);
        exit;
    }
    $exclude = 'minutely,alerts';
    $url = "https://api.openweathermap.org/data/2.5/onecall?lat={$lat}&lon={$lon}&units={$units}&exclude={$exclude}&appid=" . OPENWEATHER_API_KEY;
    proxy_get($url);
}

http_response_code(400);
echo json_encode(['error' => 'invalid action']);
