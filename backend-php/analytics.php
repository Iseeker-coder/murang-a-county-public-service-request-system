<?php
/**
 * Murang'a County Government - Real-time Analytics API Endpoint
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

set_api_headers();
$pdo = Database::getConnection();

// Overall counts
$countsStmt = $pdo->query("SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
    SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
    SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
FROM service_requests");
$counts = $countsStmt->fetch();

// Breakdown by category
$catStmt = $pdo->query("SELECT category, COUNT(*) as count FROM service_requests GROUP BY category ORDER BY count DESC");
$categories = $catStmt->fetchAll();

// Breakdown by sub-county
$scStmt = $pdo->query("SELECT sub_county, COUNT(*) as total, SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved FROM service_requests GROUP BY sub_county ORDER BY total DESC");
$subCounties = $scStmt->fetchAll();

$total = (int)($counts['total'] ?? 0);
$resolved = (int)($counts['resolved'] ?? 0);
$rate = $total > 0 ? round(($resolved / $total) * 100) : 0;

echo json_encode([
    "county" => COUNTY_NAME,
    "countyCode" => COUNTY_CODE,
    "total" => $total,
    "pending" => (int)($counts['pending'] ?? 0),
    "inProgress" => (int)($counts['in_progress'] ?? 0),
    "resolved" => $resolved,
    "rejected" => (int)($counts['rejected'] ?? 0),
    "resolvedRate" => $rate,
    "categoryBreakdown" => $categories,
    "subCountyBreakdown" => $subCounties
]);
