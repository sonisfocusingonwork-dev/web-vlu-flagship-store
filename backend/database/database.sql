-- =====================================================================
-- CƠ SỞ DỮ LIỆU DỰ ÁN: VLU FLAGSHIP STORE
-- Tên Database: web_dien_tu
-- Phiên bản: MySQL 5.7+ / MariaDB 10.3+ / 2026
-- Hướng dẫn: Mở phpMyAdmin -> Tạo CSDL `web_dien_tu` -> Import file này
-- =====================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `web_dien_tu` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `web_dien_tu`;

-- --------------------------------------------------------
-- Cấu trúc bảng `categories` (Danh mục hãng / thiết bị)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu bảng `categories`
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Apple'),
(2, 'Samsung'),
(3, 'Xiaomi'),
(4, 'OPPO');

-- --------------------------------------------------------
-- Cấu trúc bảng `products` (Sản phẩm)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `category_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `description` TEXT DEFAULT NULL,
  `image` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu bảng `products`
INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `description`, `image`) VALUES
-- Apple
(101, 1, 'iPhone 18 Pro & iPhone 18 Pro Max', 34990000.00, 'Đỉnh cao công nghệ Titanium, chip A20 Pro siêu mạnh mẽ.', 'SanPham/SanPham/Iphone/Ip 18 pro max/Đỏ Burgundy.png'),
(102, 1, 'iPhone Air', 26990000.00, 'Thiết kế siêu mỏng nhẹ đột phá, hiệu năng vượt trội.', 'SanPham/SanPham/Iphone/Ip Air/Trắng Mây.png'),
(103, 1, 'iPhone 17', 22990000.00, 'Màu sắc trẻ trung, camera kép nâng cấp toàn diện.', 'SanPham/SanPham/Iphone/Ip 17/Trắng.png'),

-- Samsung
(201, 2, 'Galaxy S26 Ultra', 31990000.00, 'Flagship Android đỉnh cao với Galaxy AI thông minh, bút S Pen tích hợp và camera 200MP.', 'SanPham/SanPham/Samsung/SS S26 Ultra/Trắng.webp'),
(202, 2, 'Galaxy Z Fold8', 44990000.00, 'Thiết kế gập mở màn hình lớn như tablet, bản lề flex siêu mỏng không nếp gấp.', 'SanPham/SanPham/Samsung/SS Galaxy Z Fold8/Cream.webp'),
(203, 2, 'Galaxy Z Flip8', 25990000.00, 'Gập vỏ sò nhỏ gọn bỏ túi, màn hình phụ Flex Window đa năng và chụp selfie rảnh tay.', 'SanPham/SanPham/Samsung/SS Galaxy Flip8/Mint.webp'),
(204, 2, 'Galaxy S26', 22990000.00, 'Thiết kế phẳng nguyên khối đối xứng hoàn hảo, màn hình Dynamic AMOLED 2X rực rỡ.', 'SanPham/SanPham/Samsung/SS Galaxy S26/White.webp'),

-- Xiaomi
(301, 3, 'Xiaomi 17 Ultra', 26990000.00, 'Kiệt tác quang học huyền thoại Leica, cảm biến 1-inch và hệ thống 4 camera chuyên nghiệp.', 'SanPham/SanPham/Xiaomi/Xiaomi 17 ultra/Trắng.webp'),
(302, 3, 'Xiaomi 17 Pro Max', 24990000.00, 'Cấu hình Snapdragon đầu bảng, công nghệ sạc siêu tốc HyperCharge 120W.', 'SanPham/SanPham/Xiaomi/Xiaomi 17 pro max/Trắng.webp'),
(303, 3, 'Xiaomi 17 Pro', 21990000.00, 'Màn hình 2K siêu sáng với viền mỏng kỷ lục và hệ điều hành Xiaomi HyperOS mượt mà.', 'SanPham/SanPham/Xiaomi/Xiaomi 17 pro/Tím.webp'),
(304, 3, 'Xiaomi 17', 17990000.00, 'Thân máy nhỏ gọn cầm nắm đầm tay, camera tele 75mm chụp chân dung nghệ thuật.', 'SanPham/SanPham/Xiaomi/Xiaomi 17/Cam.webp'),

-- OPPO
(401, 4, 'OPPO Find X9 Ultra', 27990000.00, 'Camera tiềm vọng kép đầu tiên cùng hệ màu Hasselblad tự nhiên chân thực.', 'SanPham/SanPham/Oppo/OPPO Find X9 Ultra/Cam.png'),
(402, 4, 'OPPO Find X9 Pro', 22990000.00, 'Mặt lưng cong mềm mại cao cấp, chip xử lý hình ảnh độc quyền MariSilicon X.', 'SanPham/SanPham/Oppo/OPPO Find X9 Pro/Trắng.png'),
(403, 4, 'OPPO Find X9', 19990000.00, 'Màn hình 1.5K sắc nét, pin dung lượng cao và sạc nhanh SuperVOOC bảo vệ pin.', 'SanPham/SanPham/Oppo/OPPO Find X9/Xám.png'),
(404, 4, 'OPPO Find N5', 39990000.00, 'Điện thoại màn gập tỷ lệ vàng không khe hở, trọng lượng siêu nhẹ và đa nhiệm trực quan.', 'SanPham/SanPham/Oppo/OPPO Find N5/Trắng.png');

-- --------------------------------------------------------
-- Cấu trúc bảng `users` (Tài khoản người dùng / quản trị)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `fullname` VARCHAR(100) DEFAULT NULL,
  `role` ENUM('admin', 'customer') DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tài khoản quản trị mặc định (Mật khẩu: admin123)
INSERT INTO `users` (`id`, `username`, `password`, `email`, `fullname`, `role`) VALUES
(1, 'admin', '$2y$10$e8wVdI6G95t8kGvEshOaMe7f/o/sN0Q9K3E21b7s0lY1eK4P3qZ0e', 'admin@vluflagship.vn', 'Quản trị viên VLU', 'admin');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
