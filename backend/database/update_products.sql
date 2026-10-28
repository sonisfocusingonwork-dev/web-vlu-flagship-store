-- =====================================================================
-- BỘ LỆNH CẬP NHẬT DATABASE `web_dien_tu` - VLU FLAGSHIP STORE
-- Thực thi trực tiếp trong phpMyAdmin (Chọn CSDL `web_dien_tu` -> Tab "SQL")
-- =====================================================================

USE `web_dien_tu`;

-- 1. MỞ RỘNG CỘT `image` THÀNH KIỂU TEXT (tránh bị cắt đứt link Apple CDN dài hơn 255 ký tự)
ALTER TABLE `products` MODIFY `image` TEXT;

-- Đảm bảo có bảng categories và danh mục Apple (id = 1)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`) VALUES
  (1, 'Apple'),
  (2, 'Samsung'),
  (3, 'Xiaomi'),
  (4, 'OPPO')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. XÓA CÁC SẢN PHẨM CŨ CỦA HÃNG APPLE ĐỂ CẬP NHẬT CHUẨN 3 SẢN PHẨM MỚI
DELETE FROM `products` WHERE `category_id` = 1 OR `name` LIKE '%iPhone%';

-- 3. INSERT ĐÚNG 3 SẢN PHẨM APPLE MỚI VỚI LINK ẢNH APPLE CDN (680x528)
INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `description`, `image`) VALUES
(
  101, 
  1, 
  'iPhone 18 Pro & iPhone 18 Pro Max', 
  34990000, 
  'Đỉnh cao công nghệ Titanium, chip A20 Pro siêu mạnh mẽ.', 
  'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-18pro-202609?wid=680&hei=528&fmt=webp-alpha&qlt=90&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jcFNJalVlVHVCTjJxZkxGR3RXNmIrUkMxQXc4S3pBZE5lUDJlTzVYSUYydHY0MVFCSUNCeVRPb2RzNGdVbXhiNXhCbWE1TGhoSFp5aDJBOWRRNHhQSXNYcGtxWkc1RWF3UDE2eUN0RXBLM0I&traceId=1'
),
(
  102, 
  1, 
  'iPhone Air', 
  26990000, 
  'Thiết kế siêu mỏng nhẹ đột phá, hiệu năng vượt trội.', 
  'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-17air-202509?wid=680&hei=528&fmt=webp&qlt=90&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jci9mUU0zMkc5ekxlZHFEM05NWkp3NUMxQXc4S3pBZE5lUDJlTzVYSUYydGk5SGhrZjlNVDEvQUJHaFZKbmlDaXd1QXZyUkd1TjF3TkduY3c5MTZGSFk&traceId=1'
),
(
  103, 
  1, 
  'iPhone 17', 
  22990000, 
  'Màu sắc trẻ trung, camera kép nâng cấp toàn diện.', 
  'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-17-202509?wid=680&hei=528&fmt=webp&qlt=90&.v=WVVFRzUzVk1oblJhbW9PbGNSU25jaVVYemprcUVJOVFFWHE5dFpoU3I4Sm5ML3J2aVFRb0EwSmJmUy8xMXRKRnNlcHVqbkRNcUJRcDlCTTlNKzAzbFBXc0NUZXVkT2dXaEhWWENVRDQ1SzA&traceId=1'
);

-- 4. BỔ SUNG / ĐỒNG BỘ CÁC SẢN PHẨM FLAGSHIP CHO CÁC HÃNG KHÁC (SAMSUNG, XIAOMI, OPPO)
INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `description`, `image`) VALUES
  -- Samsung
  (201, 2, 'Galaxy S26 Ultra', 31990000, 'Flagship Android đỉnh cao với Galaxy AI thông minh, bút S Pen tích hợp và camera 200MP.', 'https://upload.wikimedia.org/wikipedia/commons/9/97/Samsung_Galaxy_S24_Ultra.jpg'),
  (202, 2, 'Galaxy Z Fold8', 44990000, 'Thiết kế gập mở màn hình lớn như tablet, bản lề flex siêu mỏng không nếp gấp.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Samsung_Galaxy_Z_Fold6.png/800px-Samsung_Galaxy_Z_Fold6.png'),
  (203, 2, 'Galaxy Z Flip8', 25990000, 'Gập vỏ sò nhỏ gọn bỏ túi, màn hình phụ Flex Window đa năng và chụp selfie rảnh tay.', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Samsung_Galaxy_Z_Flip_6.jpg'),
  (204, 2, 'Galaxy S26', 22990000, 'Thiết kế phẳng nguyên khối đối xứng hoàn hảo, màn hình Dynamic AMOLED 2X rực rỡ.', 'https://upload.wikimedia.org/wikipedia/commons/4/46/Samsung_Galaxy_S24_%28webtekno%29_008.png'),

  -- Xiaomi
  (301, 3, 'Xiaomi 17 Ultra', 26990000, 'Kiệt tác quang học huyền thoại Leica, cảm biến 1-inch và hệ thống 4 camera chuyên nghiệp.', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Xiaomi_13_Ultra.jpg'),
  (302, 3, 'Xiaomi 17 Pro Max', 24990000, 'Cấu hình Snapdragon đầu bảng, công nghệ sạc siêu tốc HyperCharge 120W.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/23116PN5BC.jpg/800px-23116PN5BC.jpg'),
  (303, 3, 'Xiaomi 17 Pro', 21990000, 'Màn hình 2K siêu sáng với viền mỏng kỷ lục và hệ điều hành Xiaomi HyperOS mượt mà.', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Xiaomi_13_back.jpg'),
  (304, 3, 'Xiaomi 17', 17990000, 'Thân máy nhỏ gọn cầm nắm đầm tay, camera tele 75mm chụp chân dung nghệ thuật.', 'https://upload.wikimedia.org/wikipedia/commons/2/22/Xiaomi_13_front.jpg'),

  -- OPPO
  (401, 4, 'OPPO Find X9 Ultra', 27990000, 'Camera tiềm vọng kép đầu tiên cùng hệ màu Hasselblad tự nhiên chân thực.', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Oppo_Find_X9_Ultra.jpg'),
  (402, 4, 'OPPO Find X9 Pro', 22990000, 'Mặt lưng cong mềm mại cao cấp, chip xử lý hình ảnh độc quyền MariSilicon X.', 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Oppo_Find_X9_Titanium_Grey.jpg'),
  (403, 4, 'OPPO Find X9', 19990000, 'Màn hình 1.5K sắc nét, pin dung lượng cao và sạc nhanh SuperVOOC bảo vệ pin.', 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Oppo_Find_X7_Ultra.jpg'),
  (404, 4, 'OPPO Find N5', 39990000, 'Điện thoại màn gập tỷ lệ vàng không khe hở, trọng lượng siêu nhẹ và đa nhiệm trực quan.', 'https://upload.wikimedia.org/wikipedia/commons/7/70/OPPO_Find_N2.jpg')
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `image` = VALUES(`image`),
  `description` = VALUES(`description`);
