<?php
/**
 * Database Configuration File
 * This file contains the database connection settings for Helana Printers
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');           // Default XAMPP username
define('DB_PASS', '');               // Default XAMPP password (empty)
define('DB_NAME', 'helana_printers');

// Set timezone
date_default_timezone_set('Asia/Colombo');

// Error reporting - TURN OFF display_errors for API production
// Displaying errors breaks JSON responses
error_reporting(E_ALL);
ini_set('display_errors', 0); // Changed to 0 to prevent breaking JSON

/**
 * Get database connection
 * @return mysqli Database connection object
 */
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        // Log the error instead of showing it
        error_log("Connection failed: " . $conn->connect_error);
        
        // Return JSON error and stop
        die(json_encode([
            'success' => false,
            'error' => 'Database connection failed'
        ]));
    }
    
    // Set charset to utf8mb4 for full character support
    $conn->set_charset("utf8mb4");
    
    return $conn;
}

/**
 * Send JSON response
 * @param array $data Data to send
 * @param int $statusCode HTTP status code
 */
function sendJSONResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>
