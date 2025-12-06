<?php
/**
 * Track Order API Endpoint
 * Retrieves order details by order reference number
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection
require_once 'config.php';

// Only allow GET and POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSONResponse([
        'success' => false,
        'error' => 'Invalid request method. Only GET and POST are allowed.'
    ], 405);
}

// Get order reference from request
$orderRef = '';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $orderRef = isset($_GET['order_ref']) ? trim($_GET['order_ref']) : '';
} else {
    // Handle POST request (JSON or form data)
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $orderRef = isset($data['order_ref']) ? trim($data['order_ref']) : '';
    } else {
        $orderRef = isset($_POST['order_ref']) ? trim($_POST['order_ref']) : '';
    }
}

// Validate order reference
if (empty($orderRef)) {
    sendJSONResponse([
        'success' => false,
        'error' => 'Order reference number is required.'
    ], 400);
}

// Validate format (HEL followed by 9 digits) - matching the HTML pattern
if (!preg_match('/^HEL\d{9}$/', $orderRef)) {
    sendJSONResponse([
        'success' => false,
        'error' => 'Invalid order reference format. Expected format: HEL123456789'
    ], 400);
}

// Get database connection
$conn = getDBConnection();

// Prepare SQL statement
$sql = "SELECT 
    id,
    order_ref,
    customer_name,
    customer_email,
    customer_phone,
    order_description,
    order_date,
    status,
    estimated_completion,
    notes,
    created_at
FROM orders 
WHERE order_ref = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    sendJSONResponse([
        'success' => false,
        'error' => 'Server error: Unable to prepare query.'
    ], 500);
}

// Bind parameters
$stmt->bind_param("s", $orderRef);

// Execute query
if (!$stmt->execute()) {
    error_log("Execute failed: " . $stmt->error);
    sendJSONResponse([
        'success' => false,
        'error' => 'Server error: Unable to execute query.'
    ], 500);
}

// Get result
$result = $stmt->get_result();

// Check if order exists
if ($result->num_rows === 0) {
    sendJSONResponse([
        'success' => false,
        'error' => 'Order not found.',
        'order_ref' => $orderRef
    ], 404);
}

// Fetch order data
$order = $result->fetch_assoc();

// Map database status to frontend status format
$statusMap = [
    'Order Received' => [
        'text' => 'Processing',
        'icon' => 'bi bi-gear',
        'color' => 'text-secondary',
        'badge' => 'status-processing',
        'description' => 'Your order has been received and is being processed'
    ],
    'Processing' => [
        'text' => 'Processing',
        'icon' => 'bi bi-gear',
        'color' => 'text-secondary',
        'badge' => 'status-processing',
        'description' => 'Your order is currently being processed'
    ],
    'In Production' => [
        'text' => 'In Production',
        'icon' => 'bi bi-tools', // Changed icon to tools for production
        'color' => 'text-warning',
        'badge' => 'status-production', // Changed badge class name
        'description' => 'Your order is currently in production'
    ],
    'Ready for Pickup' => [
        'text' => 'Ready for Pickup',
        'icon' => 'bi bi-box-seam',
        'color' => 'text-success',
        'badge' => 'status-ready',
        'description' => 'Your order is ready for pickup'
    ],
    'Completed' => [
        'text' => 'Completed',
        'icon' => 'bi bi-check-circle',
        'color' => 'text-success',
        'badge' => 'status-completed', // Changed
        'description' => 'Order has been completed'
    ]
];

// Get status info or use default
$statusInfo = isset($statusMap[$order['status']]) 
    ? $statusMap[$order['status']] 
    : [
        'text' => $order['status'],
        'icon' => 'bi bi-info-circle',
        'color' => 'text-info',
        'badge' => 'status-unknown',
        'description' => 'Status: ' . $order['status']
    ];

// Format the response
$response = [
    'success' => true,
    'order' => [
        'id' => $order['id'],
        'order_ref' => $order['order_ref'],
        'customer_name' => $order['customer_name'],
        'customer_email' => $order['customer_email'],
        'customer_phone' => $order['customer_phone'],
        'order_description' => $order['order_description'],
        'order_date' => $order['order_date'],
        'status' => $statusInfo,
        'estimated_completion' => $order['estimated_completion'],
        'notes' => $order['notes'],
        'created_at' => $order['created_at']
    ]
];

// Close statement and connection
$stmt->close();
$conn->close();

// Send successful response
sendJSONResponse($response, 200);
?>
