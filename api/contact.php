<?php
/**
 * Contact Form Handler for Helana.com Printers
 * 
 * This script handles contact form submissions by:
 * 1. Validating and sanitizing input data
 * 2. Storing messages in the database
 * 3. Returning a JSON response
 */

// Start output buffering to prevent header issues
ob_start();

// Set response header to JSON
header('Content-Type: application/json');

// Database configuration
require_once 'config.php';

// Response array
$response = [
    'success' => false,
    'message' => ''
];

try {
    // Check if request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Validate and sanitize input
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validation
    $errors = [];

    if (empty($name)) {
        $errors[] = 'Name is required';
    } elseif (strlen($name) > 100) {
        $errors[] = 'Name must be less than 100 characters';
    }

    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    } elseif (strlen($email) > 100) {
        $errors[] = 'Email must be less than 100 characters';
    }

    if (empty($subject)) {
        $errors[] = 'Subject is required';
    } elseif (strlen($subject) > 200) {
        $errors[] = 'Subject must be less than 200 characters';
    }

    if (empty($message)) {
        $errors[] = 'Message is required';
    } elseif (strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters';
    }

    if (!empty($errors)) {
        throw new Exception(implode(', ', $errors));
    }

    // Sanitize input
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // Get user's IP address
    $ip_address = $_SERVER['REMOTE_ADDR'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }

    // Create database connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed. Please try again later.');
    }

    // Set charset
    $conn->set_charset("utf8mb4");

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message, ip_address, status) VALUES (?, ?, ?, ?, ?, 'new')");
    
    if (!$stmt) {
        throw new Exception('Database error. Please try again later.');
    }

    $stmt->bind_param("sssss", $name, $email, $subject, $message, $ip_address);

    // Execute statement
    if (!$stmt->execute()) {
        throw new Exception('Failed to save message. Please try again later.');
    }

    $stmt->close();
    $conn->close();

    $response['success'] = true;
    $response['message'] = 'Your message has been sent. Thank you!';

} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

// Clear output buffer and send response
ob_end_clean();
echo json_encode($response);
exit;
?>
