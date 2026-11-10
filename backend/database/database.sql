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

-- Dữ liệu bảng `products` (115 mẫu thuộc đúng 6 danh mục)
INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `description`, `image`) VALUES
(1001, 1, 'iPhone 18 Pro Max', 34990000.00, 'iPhone 18 Pro Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1002, 1, 'iPhone 18 Pro', 29990000.00, 'iPhone 18 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1003, 1, 'iPhone Fold', 0.00, 'iPhone Fold chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1004, 1, 'iPhone 17 Pro Max', 33990000.00, 'iPhone 17 Pro Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1005, 1, 'iPhone 17 Pro', 28990000.00, 'iPhone 17 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1006, 1, 'iPhone 17 Air', 0.00, 'iPhone 17 Air chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1007, 1, 'iPhone 17', 21990000.00, 'iPhone 17 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1008, 1, 'iPhone 16 Pro Max', 31990000.00, 'iPhone 16 Pro Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1009, 1, 'iPhone 16 Pro', 26990000.00, 'iPhone 16 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1010, 1, 'iPhone 16 Plus', 23990000.00, 'iPhone 16 Plus chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1011, 1, 'iPhone 16', 20490000.00, 'iPhone 16 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1012, 2, 'Samsung Galaxy Z Fold7', 41990000.00, 'Samsung Galaxy Z Fold7 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1013, 2, 'Samsung Galaxy Z Flip7', 23990000.00, 'Samsung Galaxy Z Flip7 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1014, 2, 'Samsung Galaxy S26 Ultra', 31990000.00, 'Samsung Galaxy S26 Ultra chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1015, 2, 'Samsung Galaxy S26+', 25990000.00, 'Samsung Galaxy S26+ chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1016, 2, 'Samsung Galaxy S26', 25990000.00, 'Samsung Galaxy S26 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1017, 2, 'Samsung Galaxy S25 Ultra', 29990000.00, 'Samsung Galaxy S25 Ultra chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1018, 2, 'Samsung Galaxy S25+', 23990000.00, 'Samsung Galaxy S25+ chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1019, 2, 'Samsung Galaxy S25', 23990000.00, 'Samsung Galaxy S25 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1020, 2, 'Samsung Galaxy S25 FE', 0.00, 'Samsung Galaxy S25 FE chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1021, 2, 'Samsung Galaxy A56 5G', 0.00, 'Samsung Galaxy A56 5G chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1022, 2, 'Samsung Galaxy A36 5G', 0.00, 'Samsung Galaxy A36 5G chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1023, 2, 'Samsung Galaxy A16 5G', 0.00, 'Samsung Galaxy A16 5G chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1024, 3, 'Xiaomi 15 Ultra', 23990000.00, 'Xiaomi 15 Ultra chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1025, 3, 'Xiaomi 15 Pro', 19990000.00, 'Xiaomi 15 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1026, 3, 'Xiaomi 15', 15490000.00, 'Xiaomi 15 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1027, 3, 'Xiaomi MIX Fold 4', 0.00, 'Xiaomi MIX Fold 4 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1028, 3, 'Xiaomi MIX Flip', 0.00, 'Xiaomi MIX Flip chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1029, 3, 'Redmi Note 14 Pro+ 5G', 0.00, 'Redmi Note 14 Pro+ 5G chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1030, 3, 'Redmi Note 14 Pro 5G', 0.00, 'Redmi Note 14 Pro 5G chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1031, 3, 'Redmi Note 14', 4990000.00, 'Redmi Note 14 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1032, 3, 'Redmi K80 Pro', 14990000.00, 'Redmi K80 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1033, 3, 'Redmi K80', 10990000.00, 'Redmi K80 chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1034, 3, 'POCO F7 Ultra', 0.00, 'POCO F7 Ultra chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1035, 3, 'POCO F7 Pro', 0.00, 'POCO F7 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1036, 4, 'OPPO Find X8 Ultra', 25990000.00, 'OPPO Find X8 Ultra chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1037, 4, 'OPPO Find X8 Pro', 20990000.00, 'OPPO Find X8 Pro chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1038, 4, 'OPPO Find X8', 16990000.00, 'OPPO Find X8 chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1039, 4, 'OPPO Find N4', 0.00, 'OPPO Find N4 chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1040, 4, 'OPPO Find N4 Flip', 0.00, 'OPPO Find N4 Flip chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1041, 4, 'OPPO Reno13 Pro 5G', 16990000.00, 'OPPO Reno13 Pro 5G chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1042, 4, 'OPPO Reno13 5G', 11990000.00, 'OPPO Reno13 5G chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1043, 4, 'OPPO A5 Pro', 0.00, 'OPPO A5 Pro chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1044, 4, 'OPPO A3', 0.00, 'OPPO A3 chính hãng OPPO tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1045, 5, 'vivo X200 Ultra', 0.00, 'vivo X200 Ultra chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1046, 5, 'vivo X200 Pro', 0.00, 'vivo X200 Pro chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1047, 5, 'vivo X200', 0.00, 'vivo X200 chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1048, 5, 'vivo X Fold4', 0.00, 'vivo X Fold4 chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1049, 5, 'vivo X Fold3 Pro', 0.00, 'vivo X Fold3 Pro chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1050, 5, 'vivo V50 Pro', 0.00, 'vivo V50 Pro chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1051, 5, 'vivo V50', 0.00, 'vivo V50 chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1052, 5, 'vivo V40', 0.00, 'vivo V40 chính hãng vivo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/phone.svg'),
(1053, 1, 'MacBook Air M5', 0.00, 'MacBook Air M5 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1054, 1, 'MacBook Pro 14 M5', 0.00, 'MacBook Pro 14 M5 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1055, 1, 'MacBook Pro 16 M5 Pro', 0.00, 'MacBook Pro 16 M5 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1056, 1, 'MacBook Pro 16 M5 Max', 0.00, 'MacBook Pro 16 M5 Max chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1057, 6, 'ASUS Vivobook S 15', 0.00, 'ASUS Vivobook S 15 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1058, 6, 'ASUS Zenbook S 14', 0.00, 'ASUS Zenbook S 14 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1059, 6, 'ASUS ROG Zephyrus G14', 0.00, 'ASUS ROG Zephyrus G14 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1060, 6, 'ASUS ROG Zephyrus G16', 0.00, 'ASUS ROG Zephyrus G16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1061, 6, 'ASUS ROG Strix G16', 0.00, 'ASUS ROG Strix G16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1062, 6, 'ASUS ROG Strix Scar 16', 0.00, 'ASUS ROG Strix Scar 16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1063, 6, 'ASUS ProArt P16', 0.00, 'ASUS ProArt P16 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1064, 6, 'ASUS ProArt PX13', 0.00, 'ASUS ProArt PX13 chính hãng ASUS tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1065, 7, 'Lenovo IdeaPad Slim 5', 0.00, 'Lenovo IdeaPad Slim 5 chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1066, 7, 'Lenovo Legion Pro 7i', 0.00, 'Lenovo Legion Pro 7i chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1067, 7, 'Lenovo Legion 7i', 0.00, 'Lenovo Legion 7i chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1068, 7, 'Lenovo Yoga Pro 9i', 0.00, 'Lenovo Yoga Pro 9i chính hãng Lenovo tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1069, 8, 'HP OmniBook 7', 0.00, 'HP OmniBook 7 chính hãng HP tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1070, 8, 'HP ZBook Studio G11', 0.00, 'HP ZBook Studio G11 chính hãng HP tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1071, 9, 'Acer Swift Go 14', 0.00, 'Acer Swift Go 14 chính hãng Acer tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1072, 9, 'Acer Predator Helios Neo 16', 0.00, 'Acer Predator Helios Neo 16 chính hãng Acer tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1073, 10, 'MSI Vector 16 HX', 0.00, 'MSI Vector 16 HX chính hãng MSI tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1074, 10, 'MSI Creator Z16', 0.00, 'MSI Creator Z16 chính hãng MSI tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1075, 11, 'Dell XPS 14', 0.00, 'Dell XPS 14 chính hãng Dell tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/laptop.svg'),
(1076, 1, 'iPad Pro M5', 0.00, 'iPad Pro M5 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1077, 1, 'iPad Air M4', 0.00, 'iPad Air M4 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1078, 1, 'iPad Gen 11 A16', 0.00, 'iPad Gen 11 A16 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1079, 1, 'iPad mini 7 A17 Pro', 0.00, 'iPad mini 7 A17 Pro chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1080, 2, 'Samsung Galaxy Tab S11 Ultra', 0.00, 'Samsung Galaxy Tab S11 Ultra chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1081, 2, 'Samsung Galaxy Tab S11', 0.00, 'Samsung Galaxy Tab S11 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1082, 2, 'Samsung Galaxy Tab S10 FE+', 0.00, 'Samsung Galaxy Tab S10 FE+ chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1083, 3, 'Xiaomi Pad 9 Pro Max', 0.00, 'Xiaomi Pad 9 Pro Max chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1084, 3, 'Xiaomi Pad 9 Pro', 0.00, 'Xiaomi Pad 9 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1085, 3, 'Xiaomi Pad 8 Pro', 0.00, 'Xiaomi Pad 8 Pro chính hãng Xiaomi tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/ipad.svg'),
(1086, 1, 'AirPods Pro 3', 0.00, 'AirPods Pro 3 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1087, 1, 'AirPods Max 2', 0.00, 'AirPods Max 2 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1088, 1, 'AirPods 4 ANC', 0.00, 'AirPods 4 ANC chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1089, 1, 'AirPods 4', 0.00, 'AirPods 4 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1090, 2, 'Samsung Galaxy Buds4 Pro', 0.00, 'Samsung Galaxy Buds4 Pro chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1091, 2, 'Samsung Galaxy Buds4', 0.00, 'Samsung Galaxy Buds4 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1092, 2, 'Samsung Galaxy Buds3 FE', 0.00, 'Samsung Galaxy Buds3 FE chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1093, 12, 'JBL Tour Pro 3', 0.00, 'JBL Tour Pro 3 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1094, 12, 'JBL Live Beam 3', 0.00, 'JBL Live Beam 3 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1095, 12, 'JBL Live Buds 3', 0.00, 'JBL Live Buds 3 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/headphones.svg'),
(1096, 12, 'JBL Go 5', 0.00, 'JBL Go 5 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1097, 12, 'JBL Flip 7', 0.00, 'JBL Flip 7 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1098, 12, 'JBL Charge 6', 0.00, 'JBL Charge 6 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1099, 12, 'JBL Xtreme 5', 0.00, 'JBL Xtreme 5 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1100, 12, 'JBL Boombox 4', 0.00, 'JBL Boombox 4 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1101, 12, 'JBL PartyBox Encore Essential 2', 0.00, 'JBL PartyBox Encore Essential 2 chính hãng JBL tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1102, 13, 'Marshall Emberton III', 0.00, 'Marshall Emberton III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1103, 13, 'Marshall Willen II', 0.00, 'Marshall Willen II chính hãng Marshall tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1104, 13, 'Marshall Kilburn III', 0.00, 'Marshall Kilburn III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1105, 13, 'Marshall Acton III', 0.00, 'Marshall Acton III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1106, 13, 'Marshall Stanmore III', 0.00, 'Marshall Stanmore III chính hãng Marshall tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1107, 14, 'Soundcore Boom 2', 0.00, 'Soundcore Boom 2 chính hãng Soundcore tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1108, 14, 'Soundcore Boom 3i', 0.00, 'Soundcore Boom 3i chính hãng Soundcore tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1109, 14, 'Soundcore Motion X600', 0.00, 'Soundcore Motion X600 chính hãng Soundcore tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/loa.svg'),
(1110, 1, 'Apple Watch Ultra 3', 21990000.00, 'Apple Watch Ultra 3 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/dong-ho.svg'),
(1111, 1, 'Apple Watch Series 11', 0.00, 'Apple Watch Series 11 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/dong-ho.svg'),
(1112, 1, 'Apple Watch SE 3', 0.00, 'Apple Watch SE 3 chính hãng Apple tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/dong-ho.svg'),
(1113, 2, 'Samsung Galaxy Watch Ultra 2', 0.00, 'Samsung Galaxy Watch Ultra 2 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/dong-ho.svg'),
(1114, 2, 'Samsung Galaxy Watch 9 Classic', 0.00, 'Samsung Galaxy Watch 9 Classic chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/dong-ho.svg'),
(1115, 2, 'Samsung Galaxy Watch 9', 0.00, 'Samsung Galaxy Watch 9 chính hãng Samsung tại VLU FLAGSHIP STORE.', 'frontend/assets/images/placeholders/dong-ho.svg');

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
