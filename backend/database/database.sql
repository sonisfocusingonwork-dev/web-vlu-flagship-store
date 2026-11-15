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

-- Dữ liệu bảng `categories` (hãng trong danh mục sản phẩm)
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Apple'),
(2, 'Samsung'),
(3, 'Xiaomi'),
(4, 'OPPO'),
(5, 'vivo'),
(6, 'ASUS'),
(7, 'Lenovo'),
(8, 'HP'),
(9, 'Acer'),
(10, 'MSI'),
(11, 'Dell'),
(12, 'JBL'),
(13, 'Marshall'),
(14, 'Soundcore');

-- --------------------------------------------------------
-- Cấu trúc bảng `products` (Danh mục sản phẩm Flagship)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `category_id` INT(11) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `stock` INT(11) NOT NULL DEFAULT 15,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu bảng `products` (115 mẫu thuộc đúng 6 danh mục)
INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `description`, `image`) VALUES
(1001, 1, 'iPhone 18 Pro Max', 34990000.00, 'iPhone 18 Pro Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png'),
(1002, 1, 'iPhone 18 Pro', 29990000.00, 'iPhone 18 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Bac.jpg'),
(1003, 1, 'iPhone Fold', 0.00, 'iPhone Fold chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-Fold/iPhone-Duo-Den.jpg'),
(1004, 1, 'iPhone 17 Pro Max', 33990000.00, 'iPhone 17 Pro Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-17-Pro-Max/iPhone-17-Pro-Max-Cam.png'),
(1005, 1, 'iPhone 17 Pro', 28990000.00, 'iPhone 17 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Cam.jpg'),
(1006, 1, 'iPhone 17 Air', 0.00, 'iPhone 17 Air chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Den.jpg'),
(1007, 1, 'iPhone 17', 21990000.00, 'iPhone 17 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Den.jpg'),
(1008, 1, 'iPhone 16 Pro Max', 31990000.00, 'iPhone 16 Pro Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max--Trang.jpg'),
(1009, 1, 'iPhone 16 Pro', 26990000.00, 'iPhone 16 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Den.jpg'),
(1010, 1, 'iPhone 16 Plus', 23990000.00, 'iPhone 16 Plus chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Den.jpg'),
(1011, 1, 'iPhone 16', 20490000.00, 'iPhone 16 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Den.jpg'),
(1012, 2, 'Samsung Galaxy Z Fold7', 41990000.00, 'Samsung Galaxy Z Fold7 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Den.webp'),
(1013, 2, 'Samsung Galaxy Z Flip7', 23990000.00, 'Samsung Galaxy Z Flip7 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Den.webp'),
(1014, 2, 'Samsung Galaxy S26 Ultra', 31990000.00, 'Samsung Galaxy S26 Ultra chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Den.webp'),
(1015, 2, 'Samsung Galaxy S26+', 25990000.00, 'Samsung Galaxy S26+ chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Den.webp'),
(1016, 2, 'Samsung Galaxy S26', 25990000.00, 'Samsung Galaxy S26 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Den.webp'),
(1017, 2, 'Samsung Galaxy S25 Ultra', 29990000.00, 'Samsung Galaxy S25 Ultra chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Den.webp'),
(1018, 2, 'Samsung Galaxy S25+', 23990000.00, 'Samsung Galaxy S25+ chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xam.webp'),
(1019, 2, 'Samsung Galaxy S25', 23990000.00, 'Samsung Galaxy S25 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Bac.webp'),
(1020, 2, 'Samsung Galaxy S25 FE', 0.00, 'Samsung Galaxy S25 FE chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Den.webp'),
(1021, 2, 'Samsung Galaxy A56 5G', 0.00, 'Samsung Galaxy A56 5G chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Den.webp'),
(1022, 2, 'Samsung Galaxy A36 5G', 0.00, 'Samsung Galaxy A36 5G chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Den.webp'),
(1023, 2, 'Samsung Galaxy A16 5G', 0.00, 'Samsung Galaxy A16 5G chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Den.png'),
(1024, 3, 'Xiaomi 15 Ultra', 23990000.00, 'Xiaomi 15 Ultra chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-37.webp'),
(1025, 3, 'Xiaomi 15 Pro', 19990000.00, 'Xiaomi 15 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Den.webp'),
(1026, 3, 'Xiaomi 15', 15490000.00, 'Xiaomi 15 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Den.jpg'),
(1027, 3, 'Xiaomi MIX Fold 4', 0.00, 'Xiaomi MIX Fold 4 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4.webp'),
(1028, 3, 'Xiaomi MIX Flip', 0.00, 'Xiaomi MIX Flip chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Flip/xiaomi_mi_mix_flip.webp'),
(1029, 3, 'Redmi Note 14 Pro+ 5G', 0.00, 'Redmi Note 14 Pro+ 5G chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-den.webp'),
(1030, 3, 'Redmi Note 14 Pro 5G', 0.00, 'Redmi Note 14 Pro 5G chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_1_.png'),
(1031, 3, 'Redmi Note 14', 4990000.00, 'Redmi Note 14 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Den.webp'),
(1032, 3, 'Redmi K80 Pro', 14990000.00, 'Redmi K80 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Den.png'),
(1033, 3, 'Redmi K80', 10990000.00, 'Redmi K80 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/Redmi-K80/dien-thoai-xiaomi-redmi-k80-12gb-256gb-cu-dep.jpg'),
(1034, 3, 'POCO F7 Ultra', 0.00, 'POCO F7 Ultra chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/POCO-F7-Ultra/dien-thoai-xiaomi-poco-f7-ultra.webp'),
(1035, 3, 'POCO F7 Pro', 0.00, 'POCO F7 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/Xiaomi/POCO-F7-Pro/dien-thoai-xiaomi-poco-f7-pro.webp'),
(1036, 4, 'OPPO Find X8 Ultra', 25990000.00, 'OPPO Find X8 Ultra chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-Find-X8-Ultra/Find-X8-Ultra-Nau.png'),
(1037, 4, 'OPPO Find X8 Pro', 20990000.00, 'OPPO Find X8 Pro chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Hồng.webp'),
(1038, 4, 'OPPO Find X8', 16990000.00, 'OPPO Find X8 chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-Find-X8/Find-X8-Xám.webp'),
(1039, 4, 'OPPO Find N4', 0.00, 'OPPO Find N4 chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-Find-N4/Oppo-Find-N#-Vang.webp'),
(1040, 4, 'OPPO Find N4 Flip', 0.00, 'OPPO Find N4 Flip chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-Find-N4-Flip/Oppo-Find-N4-Flip-Hong.webp'),
(1041, 4, 'OPPO Reno13 Pro 5G', 16990000.00, 'OPPO Reno13 Pro 5G chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-Reno13-Pro-5G/Reno13-Pro-5G-Trắng.webp'),
(1042, 4, 'OPPO Reno13 5G', 11990000.00, 'OPPO Reno13 5G chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-Reno13-5G/Reno13-5G-Tím.webp'),
(1043, 4, 'OPPO A5 Pro', 0.00, 'OPPO A5 Pro chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-A5-Pro/Oppo-A5-Pro-Den.png'),
(1044, 4, 'OPPO A3', 0.00, 'OPPO A3 chính hãng OPPO tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/OPPO/OPPO-A3/Oppo-A3-Den.webp'),
(1045, 5, 'vivo X200 Ultra', 0.00, 'vivo X200 Ultra chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-X200-Ultra/dien-thoai-vivo-x200-ultra.webp'),
(1046, 5, 'vivo X200 Pro', 0.00, 'vivo X200 Pro chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-X200-Pro/dien-thoai-vivo-x200-pro-mini-5g-16gb-512gb-cu-xuoc-can_1.webp'),
(1047, 5, 'vivo X200', 0.00, 'vivo X200 chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-X200/vivo-X200-den.webp'),
(1048, 5, 'vivo X Fold4', 0.00, 'vivo X Fold4 chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-X-Fold4/vivo-X-Fold4.webp'),
(1049, 5, 'vivo X Fold3 Pro', 0.00, 'vivo X Fold3 Pro chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-X-Fold3-Pro/vivo-X-Fold3-Pro-Den.png'),
(1050, 5, 'vivo V50 Pro', 0.00, 'vivo V50 Pro chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-V50-Pro/vivo-V50-Pro-Den.webp'),
(1051, 5, 'vivo V50', 0.00, 'vivo V50 chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-V50/vivo-v50.jpg'),
(1052, 5, 'vivo V40', 0.00, 'vivo V40 chính hãng vivo tại VLU FLAGSHIP STORE.', 'SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Den.png'),
(1053, 1, 'MacBook Air M5', 0.00, 'MacBook Air M5 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/MacBook/MacBook-Air-M5/01_6_4.png'),
(1054, 1, 'MacBook Pro 14 M5', 0.00, 'MacBook Pro 14 M5 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_2__11_1.png'),
(1055, 1, 'MacBook Pro 16 M5 Pro', 0.00, 'MacBook Pro 16 M5 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/02_1__1.png'),
(1056, 1, 'MacBook Pro 16 M5 Max', 0.00, 'MacBook Pro 16 M5 Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/ma5ac1_1.webp'),
(1057, 6, 'ASUS Vivobook S 15', 0.00, 'ASUS Vivobook S 15 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_10__4_17_1_1_1_1.png'),
(1058, 6, 'ASUS Zenbook S 14', 0.00, 'ASUS Zenbook S 14 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VONG0A.jpg'),
(1059, 6, 'ASUS ROG Zephyrus G14', 0.00, 'ASUS ROG Zephyrus G14 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_2_65.webp'),
(1060, 6, 'ASUS ROG Zephyrus G16', 0.00, 'ASUS ROG Zephyrus G16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027148_453728186523740223_453728186523740223_d8a51a29162bba852cc8d09a6c4a5f63.jpg'),
(1061, 6, 'ASUS ROG Strix G16', 0.00, 'ASUS ROG Strix G16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_3__28.webp'),
(1062, 6, 'ASUS ROG Strix Scar 16', 0.00, 'ASUS ROG Strix Scar 16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_1__7_8_1.png'),
(1063, 6, 'ASUS ProArt P16', 0.00, 'ASUS ProArt P16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-01_2_10_1.webp'),
(1064, 6, 'ASUS ProArt PX13', 0.00, 'ASUS ProArt PX13 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_1__1_114.png'),
(1065, 7, 'Lenovo IdeaPad Slim 5', 0.00, 'Lenovo IdeaPad Slim 5 chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_1__1_147.png'),
(1066, 7, 'Lenovo Legion Pro 7i', 0.00, 'Lenovo Legion Pro 7i chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OCX896.jpg'),
(1067, 7, 'Lenovo Legion 7i', 0.00, 'Lenovo Legion 7i chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_4__8_101.png'),
(1068, 7, 'Lenovo Yoga Pro 9i', 0.00, 'Lenovo Yoga Pro 9i chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-03_2_38.webp'),
(1069, 8, 'HP OmniBook 7', 0.00, 'HP OmniBook 7 chính hãng HP tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_1_94.png'),
(1070, 8, 'HP ZBook Studio G11', 0.00, 'HP ZBook Studio G11 chính hãng HP tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_1__1_74_1.webp'),
(1071, 9, 'Acer Swift Go 14', 0.00, 'Acer Swift Go 14 chính hãng Acer tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_2_36.webp'),
(1072, 9, 'Acer Predator Helios Neo 16', 0.00, 'Acer Predator Helios Neo 16 chính hãng Acer tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_1__10_1.png'),
(1073, 10, 'MSI Vector 16 HX', 0.00, 'MSI Vector 16 HX chính hãng MSI tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_15__7_160_1.png'),
(1074, 10, 'MSI Creator Z16', 0.00, 'MSI Creator Z16 chính hãng MSI tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0000_msi-creator-z16-a11uet-217vn-i7_1_.jpg'),
(1075, 11, 'Dell XPS 14', 0.00, 'Dell XPS 14 chính hãng Dell tại VLU FLAGSHIP STORE.', 'SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_21__4_48.png'),
(1076, 1, 'iPad Pro M5', 0.00, 'iPad Pro M5 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-2.webp'),
(1077, 1, 'iPad Air M4', 0.00, 'iPad Air M4 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Den.jpg'),
(1078, 1, 'iPad Gen 11 A16', 0.00, 'iPad Gen 11 A16 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Hong.webp'),
(1079, 1, 'iPad mini 7 A17 Pro', 0.00, 'iPad mini 7 A17 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Den.jpg'),
(1080, 2, 'Samsung Galaxy Tab S11 Ultra', 0.00, 'Samsung Galaxy Tab S11 Ultra chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11-Ultra/Samsung-Galaxy-Tab-S11-Ultra-Den.webp'),
(1081, 2, 'Samsung Galaxy Tab S11', 0.00, 'Samsung Galaxy Tab S11 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11/may-tinh-bang-samsung-galaxy-tab-s11_4_1.webp'),
(1082, 2, 'Samsung Galaxy Tab S10 FE+', 0.00, 'Samsung Galaxy Tab S10 FE+ chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Den.webp'),
(1083, 3, 'Xiaomi Pad 9 Pro Max', 0.00, 'Xiaomi Pad 9 Pro Max chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro-Max/may-tinh-bang-xiaomi-pad-9-pro-max.webp'),
(1084, 3, 'Xiaomi Pad 9 Pro', 0.00, 'Xiaomi Pad 9 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro/may-tinh-bang-xiaomi-pad-9.webp'),
(1085, 3, 'Xiaomi Pad 8 Pro', 0.00, 'Xiaomi Pad 8 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Den.webp'),
(1086, 1, 'AirPods Pro 3', 0.00, 'AirPods Pro 3 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_1__vn-vi_1.webp'),
(1087, 1, 'AirPods Max 2', 0.00, 'AirPods Max 2 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2.webp'),
(1088, 1, 'AirPods 4 ANC', 0.00, 'AirPods 4 ANC chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-1.webp'),
(1089, 1, 'AirPods 4', 0.00, 'AirPods 4 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/Apple/AirPods-4/airpods-4-1.webp'),
(1090, 2, 'Samsung Galaxy Buds4 Pro', 0.00, 'Samsung Galaxy Buds4 Pro chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4-Pro/61SXWLsmy-L._AC_SL1500_.jpg'),
(1091, 2, 'Samsung Galaxy Buds4', 0.00, 'Samsung Galaxy Buds4 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4/51QEHqsjzPL._AC_SL1500_.jpg'),
(1092, 2, 'Samsung Galaxy Buds3 FE', 0.00, 'Samsung Galaxy Buds3 FE chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/51-nqf6rkil.jpg'),
(1093, 12, 'JBL Tour Pro 3', 0.00, 'JBL Tour Pro 3 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3-latte.webp'),
(1094, 12, 'JBL Live Beam 3', 0.00, 'JBL Live Beam 3 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/JBL/JBL-Live-Beam-3/image_-_2024-12-18t203627.288.webp'),
(1095, 12, 'JBL Live Buds 3', 0.00, 'JBL Live Buds 3 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/TaiNghe/JBL/JBL-Live-Buds-3/tai-nghe-bluetooth-jbl-live-buds-3-0_1.png'),
(1096, 12, 'JBL Go 5', 0.00, 'JBL Go 5 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_3_.webp'),
(1097, 12, 'JBL Flip 7', 0.00, 'JBL Flip 7 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-cm.webp'),
(1098, 12, 'JBL Charge 6', 0.00, 'JBL Charge 6 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/Loa/JBL/JBL-Charge-6/bluetooth-jbl-charge-6-den-cam.webp'),
(1099, 12, 'JBL Xtreme 5', 0.00, 'JBL Xtreme 5 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5-den_2__1.webp'),
(1100, 12, 'JBL Boombox 4', 0.00, 'JBL Boombox 4 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/Loa/JBL/JBL-Boombox-4/bb6_1.webp'),
(1101, 12, 'JBL PartyBox Encore Essential 2', 0.00, 'JBL PartyBox Encore Essential 2 chính hãng JBL tại VLU FLAGSHIP STORE.', 'SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_1_.webp'),
(1102, 13, 'Marshall Emberton III', 0.00, 'Marshall Emberton III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Marshall/Marshall-Emberton-III/emiii.webp'),
(1103, 13, 'Marshall Willen II', 0.00, 'Marshall Willen II chính hãng Marshall tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii-den.webp'),
(1104, 13, 'Marshall Kilburn III', 0.00, 'Marshall Kilburn III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Marshall/Marshall-Kilburn-III/kilburn3-kem.webp'),
(1105, 13, 'Marshall Acton III', 0.00, 'Marshall Acton III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Marshall/Marshall-Acton-III/act-iii.webp'),
(1106, 13, 'Marshall Stanmore III', 0.00, 'Marshall Stanmore III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_10_.webp'),
(1107, 14, 'Soundcore Boom 2', 0.00, 'Soundcore Boom 2 chính hãng Soundcore tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Anker-Soundcore/Soundcore-Boom-2/loa-anker-soundcore-motion-boom-2-se-a3148-1.webp'),
(1108, 14, 'Soundcore Boom 3i', 0.00, 'Soundcore Boom 3i chính hãng Soundcore tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_1_.png'),
(1109, 14, 'Soundcore Motion X600', 0.00, 'Soundcore Motion X600 chính hãng Soundcore tại VLU FLAGSHIP STORE.', 'SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_1__3.webp'),
(1110, 1, 'Apple Watch Ultra 3', 21990000.00, 'Apple Watch Ultra 3 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/Apple-Watch-Ultra-3-Den.jpg'),
(1111, 1, 'Apple Watch Series 11', 0.00, 'Apple Watch Series 11 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-den.webp'),
(1112, 1, 'Apple Watch SE 3', 0.00, 'Apple Watch SE 3 chính hãng Apple tại VLU FLAGSHIP STORE.', 'SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-SE-3/Apple-Watch-SE-3-den.webp'),
(1113, 2, 'Samsung Galaxy Watch Ultra 2', 0.00, 'Samsung Galaxy Watch Ultra 2 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Cam.jpg'),
(1114, 2, 'Samsung Galaxy Watch 9 Classic', 0.00, 'Samsung Galaxy Watch 9 Classic chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9-Classic/Samsung-Galaxy-Watch-9-Classic-Den.jpg'),
(1115, 2, 'Samsung Galaxy Watch 9', 0.00, 'Samsung Galaxy Watch 9 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-Den.jpg');

-- Cấu trúc bảng `users` (Tài khoản người dùng / quản trị: role 1 = Admin, 0 = User/Guest)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `fullname` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Admin, 0 = User/Guest',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tài khoản quản trị mặc định (Mật khẩu: admin123, mã hóa bằng password_hash)
INSERT INTO `users` (`id`, `username`, `password`, `email`, `fullname`, `phone`, `role`) VALUES
(1, 'admin', '$2y$10$X8YEmExFjGS7K9Q6WnJ8b.do6BruKoC/TEetZy9tlIc85WdNOVhO.', 'admin@vluflagship.vn', 'Quản trị viên VLU', '02871059999', 1);

-- --------------------------------------------------------
-- Cấu trúc bảng `orders` (Đơn đặt hàng của thành viên & Khách Guest)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_code` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` VARCHAR(100) DEFAULT NULL COMMENT 'NULL hoặc 0 / guest nếu là Tài khoản Khách',
  `user_identity` VARCHAR(100) DEFAULT 'guest' COMMENT 'Định danh tài khoản hoặc guest',
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `customer_email` VARCHAR(150) DEFAULT NULL,
  `shipping_address` TEXT NOT NULL,
  `customer_address` TEXT DEFAULT NULL,
  `delivery_method` VARCHAR(50) DEFAULT 'home',
  `shipping_method` VARCHAR(50) DEFAULT 'home',
  `store_location` VARCHAR(255) DEFAULT NULL,
  `customer_notes` TEXT DEFAULT NULL,
  `payment_method` VARCHAR(150) DEFAULT 'Thanh toán khi nhận hàng (COD)',
  `payment_key` VARCHAR(50) DEFAULT 'cod',
  `voucher_code` VARCHAR(50) DEFAULT NULL,
  `installment_info` TEXT DEFAULT NULL,
  `installment_term` INT(11) DEFAULT 0,
  `installment_monthly` DECIMAL(15,2) DEFAULT 0.00,
  `subtotal` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(30) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_orders_user_id` (`user_id`),
  KEY `idx_orders_user_identity` (`user_identity`),
  KEY `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `order_details` (Chi tiết sản phẩm trong đơn hàng)
-- --------------------------------------------------------
CREATE TABLE `order_details` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `order_code` VARCHAR(50) DEFAULT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `color` VARCHAR(100) DEFAULT 'Mặc định',
  `storage` VARCHAR(100) DEFAULT 'Tiêu chuẩn',
  `variant` VARCHAR(100) DEFAULT 'Tiêu chuẩn',
  `price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `quantity` INT(11) NOT NULL DEFAULT 1,
  `image` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_details_order_id` (`order_id`),
  CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
