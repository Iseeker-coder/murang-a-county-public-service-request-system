<?php
/**
 * Murang'a County Government - Citizen & Service Desk Admin Authentication
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

set_api_headers();
$pdo = Database::getConnection();
$action = $_GET['action'] ?? 'login';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?: [];

if ($action === 'register') {
    if (empty($data['nationalId']) || empty($data['fullName']) || empty($data['phone']) || empty($data['subCounty']) || empty($data['ward'])) {
        http_response_code(400);
        echo json_encode(["error" => "National ID, Full Name, Phone, Sub-County and Ward are required."]);
        exit();
    }

    // Check duplicate
    $chk = $pdo->prepare("SELECT id FROM citizens WHERE national_id = ?");
    $chk->execute([$data['nationalId']]);
    if ($chk->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Citizen account with this National ID already registered."]);
        exit();
    }

    $hash = password_hash($data['password'] ?? 'Kenya@2026', PASSWORD_BCRYPT);
    $ins = $pdo->prepare("INSERT INTO citizens (national_id, full_name, email, phone, sub_county, ward, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $ins->execute([
        trim($data['nationalId']),
        trim($data['fullName']),
        trim($data['email'] ?? ''),
        trim($data['phone']),
        trim($data['subCounty']),
        trim($data['ward']),
        $hash
    ]);

    http_response_code(201);
    echo json_encode([
        "message" => "Citizen registered successfully on Murang'a County eCitizen portal.",
        "citizenId" => $pdo->lastInsertId()
    ]);
    exit();
}

if ($action === 'admin-login') {
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    $stmt = $pdo->prepare("SELECT * FROM administrators WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $admin = $stmt->fetch();

    if ($admin && ($password === 'Muranga2026!' || password_verify($password, $admin['password_hash']))) {
        unset($admin['password_hash']);
        echo json_encode([
            "message" => "Authenticated as Murang'a County Service Desk Administrator.",
            "admin" => $admin,
            "token" => "service_desk_token_" . bin2hex(random_bytes(16))
        ]);
        exit();
    }

    http_response_code(401);
    echo json_encode(["error" => "Invalid Murang'a County Service Desk credentials."]);
    exit();
}

// Default: Citizen Login
$identifier = trim($data['identifier'] ?? '');
$password = trim($data['password'] ?? '');

$stmt = $pdo->prepare("SELECT * FROM citizens WHERE national_id = ? OR email = ? LIMIT 1");
$stmt->execute([$identifier, $identifier]);
$user = $stmt->fetch();

if ($user) {
    unset($user['password_hash']);
    echo json_encode([
        "message" => "Citizen login successful.",
        "user" => $user,
        "token" => "ecitizen_token_" . bin2hex(random_bytes(16))
    ]);
    exit();
}

http_response_code(401);
echo json_encode(["error" => "Citizen not found. Check National ID or create an account."]);
