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
(101, 1, 'iPhone 18 Pro & iPhone 18 Pro Max', 34990000.00, 'Đỉnh cao công nghệ Titanium, chip A20 Pro siêu mạnh mẽ.', 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-18pro-202609?wid=680&hei=528&fmt=webp-alpha&qlt=90&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jcFNJalVlVHVCTjJxZkxGR3RXNmIrUkMxQXc4S3pBZE5lUDJlTzVYSUYydHY0MVFCSUNCeVRPb2RzNGdVbXhiNXhCbWE1TGhoSFp5aDJBOWRRNHhQSXNYcGtxWkc1RWF3UDE2eUN0RXBLM0I&traceId=1'),
(102, 1, 'iPhone Air', 26990000.00, 'Thiết kế siêu mỏng nhẹ đột phá, hiệu năng vượt trội.', 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-17air-202509?wid=680&hei=528&fmt=webp&qlt=90&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jci9mUU0zMkc5ekxlZHFEM05NWkp3NUMxQXc4S3pBZE5lUDJlTzVYSUYydGk5SGhrZjlNVDEvQUJHaFZKbmlDaXd1QXZyUkd1TjF3TkduY3c5MTZGSFk&traceId=1'),
(103, 1, 'iPhone 17', 22990000.00, 'Màu sắc trẻ trung, camera kép nâng cấp toàn diện.', 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-17-202509?wid=680&hei=528&fmt=webp&qlt=90&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jaVVYemprcUVJOVFFWHE5dFpoU3I4Sm5ML3J2aVFRb0EwSmJmUy8xMXRKRnNlcHVqbkRNcUJRcDlCTTlNKzAzbFBXc0NUZXVkT2dXaEhWWENVRDQ1SzA&traceId=1'),

-- Samsung
(201, 2, 'Galaxy S26 Ultra', 31990000.00, 'Flagship Android đỉnh cao với Galaxy AI thông minh, bút S Pen tích hợp và camera 200MP.', 'https://upload.wikimedia.org/wikipedia/commons/9/97/Samsung_Galaxy_S24_Ultra.jpg'),
(202, 2, 'Galaxy Z Fold8', 44990000.00, 'Thiết kế gập mở màn hình lớn như tablet, bản lề flex siêu mỏng không nếp gấp.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Samsung_Galaxy_Z_Fold6.png/800px-Samsung_Galaxy_Z_Fold6.png'),
(203, 2, 'Galaxy Z Flip8', 25990000.00, 'Gập vỏ sò nhỏ gọn bỏ túi, màn hình phụ Flex Window đa năng và chụp selfie rảnh tay.', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Samsung_Galaxy_Z_Flip_6.jpg'),
(204, 2, 'Galaxy S26', 22990000.00, 'Thiết kế phẳng nguyên khối đối xứng hoàn hảo, màn hình Dynamic AMOLED 2X rực rỡ.', 'https://upload.wikimedia.org/wikipedia/commons/4/46/Samsung_Galaxy_S24_%28webtekno%29_008.png'),

-- Xiaomi
(301, 3, 'Xiaomi 17 Ultra', 26990000.00, 'Kiệt tác quang học huyền thoại Leica, cảm biến 1-inch và hệ thống 4 camera chuyên nghiệp.', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Xiaomi_13_Ultra.jpg'),
(302, 3, 'Xiaomi 17 Pro Max', 24990000.00, 'Cấu hình Snapdragon đầu bảng, công nghệ sạc siêu tốc HyperCharge 120W.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/23116PN5BC.jpg/800px-23116PN5BC.jpg'),
(303, 3, 'Xiaomi 17 Pro', 21990000.00, 'Màn hình 2K siêu sáng với viền mỏng kỷ lục và hệ điều hành Xiaomi HyperOS mượt mà.', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Xiaomi_13_back.jpg'),
(304, 3, 'Xiaomi 17', 17990000.00, 'Thân máy nhỏ gọn cầm nắm đầm tay, camera tele 75mm chụp chân dung nghệ thuật.', 'https://upload.wikimedia.org/wikipedia/commons/2/22/Xiaomi_13_front.jpg'),

-- OPPO
(401, 4, 'OPPO Find X9 Ultra', 27990000.00, 'Camera tiềm vọng kép đầu tiên cùng hệ màu Hasselblad tự nhiên chân thực.', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Oppo_Find_X9_Ultra.jpg'),
(402, 4, 'OPPO Find X9 Pro', 22990000.00, 'Mặt lưng cong mềm mại cao cấp, chip xử lý hình ảnh độc quyền MariSilicon X.', 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Oppo_Find_X9_Titanium_Grey.jpg'),
(403, 4, 'OPPO Find X9', 19990000.00, 'Màn hình 1.5K sắc nét, pin dung lượng cao và sạc nhanh SuperVOOC bảo vệ pin.', 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Oppo_Find_X7_Ultra.jpg'),
(404, 4, 'OPPO Find N5', 39990000.00, 'Điện thoại màn gập tỷ lệ vàng không khe hở, trọng lượng siêu nhẹ và đa nhiệm trực quan.', 'https://upload.wikimedia.org/wikipedia/commons/7/70/OPPO_Find_N2.jpg');

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
