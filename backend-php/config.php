<?php
/**
 * Murang'a County Government (021) - Public Service Request System
 * Database Configuration & Environment Constants
 */

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'muranga_public_services');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// System Information
define('COUNTY_NAME', "Murang'a County Government");
define('COUNTY_CODE', "021");
define('HOTLINE_AMBULANCE', "+254 716 017 296");
define('HOTLINE_CALL_CENTER', "+254 757 562 988");
define('CONTACT_EMAIL', "info@muranga.go.ke");

// CORS Headers helper
function set_api_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
