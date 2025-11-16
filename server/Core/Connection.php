<?php
require_once __DIR__ . '/../config/database.php';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    $response = ['error' => 'Falha ao conectar ao banco de dados.'];
    if (APP_DEBUG) {
        $response['details'] = $e->getMessage();
    }
    echo json_encode($response);
    exit;
}

return $pdo;
