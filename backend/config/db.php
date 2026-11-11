<?php
/**
 * VLU FLAGSHIP STORE – Kết nối Cơ sở dữ liệu MySQL (PDO utf8mb4)
 * Tự động kiểm tra & khởi tạo cấu trúc bảng/cột còn thiếu (users, products, orders, order_details)
 */
$host = 'localhost';
$dbname = 'web_dien_tu';
$username = 'root';
$password = '';

$conn = null;

if (!function_exists('vlu_ensure_column')) {
    function vlu_ensure_column(PDO $pdo, string $table, string $column, string $definition): void {
        try {
            $stmt = $pdo->prepare("SHOW COLUMNS FROM `$table` LIKE :col");
            $stmt->execute([':col' => $column]);
            if (!$stmt->fetch()) {
                $pdo->exec("ALTER TABLE `$table` ADD COLUMN `$column` $definition");
            }
        } catch (Throwable $e) {
            // Bỏ qua lỗi quyền ALTER nếu môi trường hạn chế
        }
    }
}

if (!function_exists('vlu_ensure_database_schema')) {
    function vlu_ensure_database_schema(PDO $pdo): void {
        try {
            // 1. Đảm bảo bảng users và cột phone
            $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `username` VARCHAR(50) NOT NULL UNIQUE,
                `password` VARCHAR(255) NOT NULL,
                `email` VARCHAR(100) NOT NULL UNIQUE,
                `fullname` VARCHAR(100) DEFAULT NULL,
                `phone` VARCHAR(20) DEFAULT NULL,
                `role` ENUM('admin', 'customer') DEFAULT 'customer',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
            vlu_ensure_column($pdo, 'users', 'phone', "VARCHAR(20) DEFAULT NULL AFTER `fullname`");

            // 2. Đảm bảo bảng products và cột stock
            $pdo->exec("CREATE TABLE IF NOT EXISTS `products` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `category_id` INT(11) DEFAULT NULL,
                `name` VARCHAR(255) NOT NULL,
                `price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                `description` TEXT DEFAULT NULL,
                `image` VARCHAR(500) DEFAULT NULL,
                `stock` INT(11) NOT NULL DEFAULT 15,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
            vlu_ensure_column($pdo, 'products', 'stock', "INT(11) NOT NULL DEFAULT 15");

            // 3. Đảm bảo bảng orders (hỗ trợ cả thành viên và Tài khoản Khách user_id NULL/0)
            $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `order_code` VARCHAR(50) NOT NULL UNIQUE,
                `user_id` INT(11) DEFAULT NULL,
                `user_identity` VARCHAR(100) DEFAULT 'guest',
                `customer_name` VARCHAR(150) NOT NULL,
                `customer_phone` VARCHAR(30) NOT NULL,
                `customer_email` VARCHAR(150) DEFAULT NULL,
                `customer_address` TEXT NOT NULL,
                `shipping_method` VARCHAR(30) DEFAULT 'home',
                `store_location` VARCHAR(255) DEFAULT NULL,
                `customer_notes` TEXT DEFAULT NULL,
                `payment_method` VARCHAR(150) DEFAULT 'Thanh toán khi nhận hàng (COD)',
                `payment_key` VARCHAR(50) DEFAULT 'cod',
                `voucher_code` VARCHAR(50) DEFAULT NULL,
                `installment_term` INT(11) DEFAULT 0,
                `installment_monthly` DECIMAL(15,2) DEFAULT 0.00,
                `subtotal` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                `discount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                `total` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                `status` VARCHAR(30) NOT NULL DEFAULT 'pending',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_orders_user_id` (`user_id`),
                KEY `idx_orders_user_identity` (`user_identity`),
                KEY `idx_orders_status` (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
            vlu_ensure_column($pdo, 'orders', 'order_code', "VARCHAR(50) DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'user_identity', "VARCHAR(100) DEFAULT 'guest'");
            vlu_ensure_column($pdo, 'orders', 'shipping_method', "VARCHAR(30) DEFAULT 'home'");
            vlu_ensure_column($pdo, 'orders', 'store_location', "VARCHAR(255) DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'payment_key', "VARCHAR(50) DEFAULT 'cod'");
            vlu_ensure_column($pdo, 'orders', 'voucher_code', "VARCHAR(50) DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'installment_term', "INT(11) DEFAULT 0");
            vlu_ensure_column($pdo, 'orders', 'installment_monthly', "DECIMAL(15,2) DEFAULT 0.00");

            // 4. Đảm bảo bảng order_details
            $pdo->exec("CREATE TABLE IF NOT EXISTS `order_details` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `order_id` INT(11) NOT NULL,
                `order_code` VARCHAR(50) DEFAULT NULL,
                `product_id` VARCHAR(50) NOT NULL,
                `product_name` VARCHAR(255) NOT NULL,
                `color` VARCHAR(100) DEFAULT 'Mặc định',
                `variant` VARCHAR(100) DEFAULT 'Tiêu chuẩn',
                `price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                `quantity` INT(11) NOT NULL DEFAULT 1,
                `image` VARCHAR(500) DEFAULT NULL,
                PRIMARY KEY (`id`),
                KEY `idx_order_details_order_id` (`order_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
            vlu_ensure_column($pdo, 'order_details', 'order_code', "VARCHAR(50) DEFAULT NULL");
            vlu_ensure_column($pdo, 'order_details', 'color', "VARCHAR(100) DEFAULT 'Mặc định'");
            vlu_ensure_column($pdo, 'order_details', 'variant', "VARCHAR(100) DEFAULT 'Tiêu chuẩn'");
        } catch (Throwable $e) {
            // Không in lỗi ra ngoài để bảo toàn JSON response của các API
        }
    }
}

try {
    $conn = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    vlu_ensure_database_schema($conn);
} catch (PDOException $e) {
    // Không in trạng thái CSDL ra ngoài giao diện / JSON API
    $conn = null;
}

