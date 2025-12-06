-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2025 at 03:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `helana_printers`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `status` enum('new','read','replied') DEFAULT 'new'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_ref` varchar(12) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(15) DEFAULT NULL,
  `order_description` text NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'Processing',
  `estimated_completion` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_ref`, `customer_name`, `customer_email`, `customer_phone`, `order_description`, `order_date`, `status`, `estimated_completion`, `notes`, `created_at`) VALUES
(5, 'HEL123456789', 'Dimath Ranawaka', 'john@example.com', '0712345678', 'Business cards', '2025-12-05 17:49:07', 'Ready for Pickup', '2024-02-15', 'Payment received', '2025-12-05 12:19:07'),
(6, 'HEL987654321', 'Mahinda', 'sarah@example.com', '0718765432', 'Hard Bind', '2025-12-05 17:49:07', 'In Production', '2024-02-20', 'Proof approved', '2025-12-05 12:19:07'),
(7, 'HEL456123789', 'Don John', 'david@example.com', '0711122334', 'Mug print', '2025-12-05 17:49:07', 'Completed', '2024-02-10', 'Delivered on 2024-02-12', '2025-12-05 12:19:07'),
(8, 'HEL789456123', 'Rajitha Bandara', 'maria@example.com', '0719988776', 'Brochures', '2025-12-05 17:49:07', 'Order Received', '2024-02-25', 'Awaiting design approval', '2025-12-05 12:19:07'),
(9, 'HEL234567890', 'Dimath Ranawaka', 'dimath@example.com', '0712345678', 'Business Cards - 1000 units with UV coating', '2025-12-05 18:33:17', 'Ready for Pickup', '2025-12-05', 'Payment received', '2025-12-05 13:03:17'),
(10, 'HEL345678901', 'Nimal Perera', 'nimal.p@gmail.com', '0771234567', 'Wedding Invitation Cards - 200 copies', '2025-12-05 18:33:17', 'In Production', '2025-12-08', 'Design approved, printing in progress', '2025-12-05 13:03:17'),
(11, 'HEL456789012', 'Sanduni Fernando', 'sanduni.f@yahoo.com', '0765432109', 'Thesis Hard Binding - 3 copies, 250 pages each', '2025-12-05 18:33:17', 'Processing', '2025-12-06', 'Awaiting final proof approval', '2025-12-05 13:03:17'),
(12, 'HEL567890123', 'Kasun Silva', 'kasun.silva@outlook.com', '0778901234', 'Company Brochures - 500 copies, full color', '2025-12-05 18:33:17', 'Ready for Pickup', '2025-12-04', 'Completed ahead of schedule', '2025-12-05 13:03:17'),
(13, 'HEL678901234', 'Amaya Jayasinghe', 'amaya.j@hotmail.com', '0712223334', 'Custom Mug Printing - 25 mugs with logo', '2025-12-05 18:33:17', 'In Production', '2025-12-07', 'Mugs received, printing scheduled', '2025-12-05 13:03:17'),
(14, 'HEL789012345', 'Ruwan Wickramasinghe', 'ruwan.w@example.com', '0769876543', 'UV Printing on Glass Bottles - 100 units', '2025-12-05 18:33:17', 'Order Received', '2025-12-10', 'Waiting for bottle delivery', '2025-12-05 13:03:17'),
(15, 'HEL890123456', 'Chamodi Rathnayake', 'chamodi.r@gmail.com', '0775554443', 'Poster Printing - A1 size, 50 copies', '2025-12-05 18:33:17', 'Ready for Pickup', '2025-12-05', 'Payment received, ready to collect', '2025-12-05 13:03:17'),
(16, 'HEL901234567', 'Tharindu Gunasekara', 'tharindu.g@example.com', '0711112223', 'Screen Printing on T-Shirts - 200 shirts', '2025-12-05 18:33:17', 'In Production', '2025-12-09', 'Shirts in stock, printing in progress', '2025-12-05 13:03:17'),
(17, 'HEL012345678', 'Ishara Dissanayake', 'ishara.d@yahoo.com', '0768889990', 'Plan Printing - A0 size, 10 architectural plans', '2025-12-05 18:33:17', 'Processing', '2025-12-06', 'Files received, preparing for print', '2025-12-05 13:03:17'),
(18, 'HEL112233445', 'Malith Bandara', 'malith.b@gmail.com', '0773334445', 'UV Keytags - 500 custom keytags', '2025-12-05 18:33:17', 'Completed', '2025-12-03', 'Delivered on 2025-12-04', '2025-12-05 13:03:17'),
(19, 'HEL223344556', 'Nethmi Rajapaksha', 'nethmi.r@example.com', '0716667778', 'Graphic Design + Business Card Printing - 500 cards', '2025-12-05 18:33:17', 'Order Received', '2025-12-12', 'Design phase - awaiting customer feedback', '2025-12-05 13:03:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_submitted_at` (`submitted_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_ref` (`order_ref`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
