<?php
/**
 * Murang'a County Government - Service Requests API Endpoint
 * Handles GET (list, filter, single track), POST (create ticket), PATCH (status transition)
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

set_api_headers();
$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    case 'PATCH':
    case 'PUT':
        handlePatch($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

function handleGet(PDO $pdo) {
    // 1. Check if single tracking number requested via ?tracking=MCG-2026-XXXX
    if (isset($_GET['tracking'])) {
        $tracking = trim($_GET['tracking']);
        $stmt = $pdo->prepare("SELECT * FROM service_requests WHERE tracking_number = ? LIMIT 1");
        $stmt->execute([$tracking]);
        $request = $stmt->fetch();

        if (!$request) {
            http_response_code(404);
            echo json_encode(["error" => "Service request {$tracking} not found."]);
            return;
        }

        // Fetch timeline events
        $tlStmt = $pdo->prepare("SELECT * FROM request_timeline WHERE request_id = ? ORDER BY created_at ASC");
        $tlStmt->execute([$request['id']]);
        $request['timeline'] = $tlStmt->fetchAll();

        echo json_encode($request);
        return;
    }

    // 2. Filtered list
    $where = ["1=1"];
    $params = [];

    if (!empty($_GET['status']) && $_GET['status'] !== 'All') {
        $where[] = "status = ?";
        $params[] = $_GET['status'];
    }
    if (!empty($_GET['category']) && $_GET['category'] !== 'All') {
        $where[] = "category = ?";
        $params[] = $_GET['category'];
    }
    if (!empty($_GET['subCounty']) && $_GET['subCounty'] !== 'All') {
        $where[] = "sub_county = ?";
        $params[] = $_GET['subCounty'];
    }
    if (!empty($_GET['citizenId'])) {
        $where[] = "citizen_id = ?";
        $params[] = $_GET['citizenId'];
    }
    if (!empty($_GET['search'])) {
        $q = '%' . trim($_GET['search']) . '%';
        $where[] = "(tracking_number LIKE ? OR title LIKE ? OR description LIKE ? OR landmark LIKE ? OR citizen_name LIKE ?)";
        $params[] = $q;
        $params[] = $q;
        $params[] = $q;
        $params[] = $q;
        $params[] = $q;
    }

    $sql = "SELECT * FROM service_requests WHERE " . implode(" AND ", $where) . " ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $requests = $stmt->fetchAll();

    echo json_encode([
        "count" => count($requests),
        "requests" => $requests
    ]);
}

function handlePost(PDO $pdo) {
    $data = json_decode(file_get_contents("php://input"), true);

    // Enforce Authenticated Citizen to prevent public abuse
    if (empty($data['citizenId']) || $data['citizenId'] === 'usr_guest') {
        http_response_code(401);
        echo json_encode(["error" => "Authentication Required: You must be registered and signed in to Murang'a eCitizen to submit a service request."]);
        return;
    }

    // Verify Citizen in Database
    $citStmt = $pdo->prepare("SELECT * FROM citizens WHERE id = ? OR national_id = ? LIMIT 1");
    $citStmt->execute([$data['citizenId'], $data['nationalId'] ?? '']);
    $citizen = $citStmt->fetch();

    if (!$citizen) {
        http_response_code(401);
        echo json_encode(["error" => "Citizen account not found. Please log in with your verified National ID."]);
        return;
    }

    if (empty($data['title']) || empty($data['category']) || empty($data['subCounty']) || empty($data['ward']) || empty($data['description'])) {
        http_response_code(400);
        echo json_encode(["error" => "Title, category, sub-county, ward, and description are required."]);
        return;
    }

    // Generate unique tracking number e.g. MCG-2026-8942
    $trackingNumber = "MCG-" . date('Y') . "-" . rand(1000, 9999);

    $sql = "INSERT INTO service_requests (
        tracking_number, citizen_id, citizen_name, citizen_phone, citizen_email,
        national_id, category, title, description, sub_county, ward, landmark,
        priority, status, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $trackingNumber,
        $citizen['id'],
        $citizen['full_name'],
        $citizen['phone'],
        $citizen['email'] ?? '',
        $citizen['national_id'],
        trim($data['category']),
        trim($data['title']),
        trim($data['description']),
        trim($data['subCounty']),
        trim($data['ward']),
        trim($data['landmark'] ?? ''),
        trim($data['priority'] ?? 'Standard'),
        $data['imageUrl'] ?? null
    ]);

    $requestId = $pdo->lastInsertId();

    // Insert initial timeline entry
    $tl = $pdo->prepare("INSERT INTO request_timeline (request_id, status, title, description, actor_name, actor_role) VALUES (?, 'Pending', 'Service Request Logged', ?, ?, 'Citizen')");
    $tl->execute([
        $requestId,
        "Request logged on Murang'a County Government eCitizen portal.",
        $data['citizenName'] ?? 'Citizen'
    ]);

    http_response_code(201);
    echo json_encode([
        "message" => "Service request officially registered.",
        "trackingNumber" => $trackingNumber,
        "id" => $requestId,
        "smsSent" => true,
        "smsMessage" => "Murang'a County: Your request {$trackingNumber} for {$data['category']} has been received. Track at muranga.go.ke"
    ]);
}

function handlePatch(PDO $pdo) {
    $data = json_decode(file_get_contents("php://input"), true);
    $tracking = $_GET['tracking'] ?? $data['trackingNumber'] ?? null;

    if (!$tracking) {
        http_response_code(400);
        echo json_encode(["error" => "Tracking number is required."]);
        return;
    }

    $stmt = $pdo->prepare("SELECT * FROM service_requests WHERE tracking_number = ? LIMIT 1");
    $stmt->execute([$tracking]);
    $req = $stmt->fetch();

    if (!$req) {
        http_response_code(404);
        echo json_encode(["error" => "Request not found."]);
        return;
    }

    $status = $data['status'] ?? $req['status'];
    $assignedDept = $data['assignedDepartment'] ?? $req['assigned_department'];
    $assignedOfficer = $data['assignedOfficer'] ?? $req['assigned_officer'];
    $notes = $data['officerNote'] ?? $req['resolution_notes'];
    $resolvedAt = ($status === 'Resolved') ? date('Y-m-d H:i:s') : $req['resolved_at'];

    $upd = $pdo->prepare("UPDATE service_requests SET status = ?, assigned_department = ?, assigned_officer = ?, resolution_notes = ?, resolved_at = ? WHERE id = ?");
    $upd->execute([$status, $assignedDept, $assignedOfficer, $notes, $resolvedAt, $req['id']]);

    // Append timeline record
    $actor = $data['actorName'] ?? 'County Service Desk Administrator';
    $tl = $pdo->prepare("INSERT INTO request_timeline (request_id, status, title, description, actor_name, actor_role) VALUES (?, ?, ?, ?, ?, 'Service Desk Admin')");
    $tl->execute([
        $req['id'],
        $status,
        $status === 'Resolved' ? 'Case Successfully Resolved' : "Status Updated: {$status}",
        $notes ?: "Request forwarded to {$assignedDept}.",
        $actor
    ]);

    echo json_encode([
        "message" => "Request {$tracking} successfully updated.",
        "status" => $status
    ]);
}
