<?php
/**
 * Get Order API Endpoint
 * Retrieves order details by order reference number
 */

// Enable CORS for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include database configuration
require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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

// Validate format (HEL followed by 9 digits)
if (!preg_match('/^HEL\d{9}$/', $orderRef)) {
    sendJSONResponse([
        'success' => false,
        'error' => 'Invalid order reference format. Expected format: HEL123456789'
    ], 400);
}

// Get database connection
$conn = getDBConnection();

// Prepare SQL statement to prevent SQL injection
$stmt = $conn->prepare("SELECT 
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
WHERE order_ref = ?");

if (!$stmt) {
    sendJSONResponse([
        'success' => false,
        'error' => 'Database query preparation failed.'
    ], 500);
}

// Bind parameters
$stmt->bind_param("s", $orderRef);

// Execute query
if (!$stmt->execute()) {
    sendJSONResponse([
        'success' => false,
        'error' => 'Failed to execute query.'
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
        'text' => 'Finalising',
        'icon' => 'bi bi-hourglass-split',
        'color' => 'text-warning',
        'badge' => 'status-finalising',
        'description' => 'Quality check in progress'
    ],
    'Ready for Pickup' => [
        'text' => 'Ready for Collection',
        'icon' => 'bi bi-box-seam',
        'color' => 'text-success',
        'badge' => 'status-ready',
        'description' => 'Please come to premises to collect'
    ],
    'Completed' => [
        'text' => 'Ready for Collection',
        'icon' => 'bi bi-box-seam',
        'color' => 'text-success',
        'badge' => 'status-ready',
        'description' => 'Order completed and ready for pickup'
    ],
    'Out for Delivery' => [
        'text' => 'Out for Delivery',
        'icon' => 'bi bi-truck',
        'color' => 'text-primary',
        'badge' => 'status-shipped',
        'description' => 'Sent to delivery service'
    ]
];

// Get status info or use default
$statusInfo = isset($statusMap[$order['status']]) 
    ? $statusMap[$order['status']] 
    : [
        'text' => $order['status'],
        'icon' => 'bi bi-info-circle',
        'color' => 'text-info',
        'badge' => 'status-processing',
        'description' => 'Order status: ' . $order['status']
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
