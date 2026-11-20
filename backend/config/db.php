<?php
/**
 * VLU FLAGSHIP STORE – Kết nối Cơ sở dữ liệu MySQL (PDO utf8mb4) & JSON Storage Fallback
 * Tự động kiểm tra & khởi tạo cấu trúc bảng/cột chuẩn:
 * - users: id, username (UNIQUE), password, email (UNIQUE), fullname, phone, role (TINYINT: 1 = Admin, 0 = User/Guest), created_at
 * - orders: id, order_code (UNIQUE), user_id (NULL/Guest), customer_name, customer_phone, customer_email,
 *           shipping_address, delivery_method, payment_method, installment_info, total_amount, status, created_at
 * - order_details: id, order_id, product_id, product_name, color, storage, price, quantity, image
 */

declare(strict_types=1);

$host = 'localhost';
$dbname = 'web_dien_tu';
$username = 'root';
$password = '';

$conn = null;

// ============================================================================
// 1. JSON STORAGE FALLBACK HELPERS (Dùng khi MySQL chưa bật hoặc ngoại tuyến)
// ============================================================================
if (!function_exists('vlu_get_data_dir')) {
    function vlu_get_data_dir(): string {
        $dir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        return $dir;
    }
}

if (!function_exists('vlu_read_json_file')) {
    function vlu_read_json_file(string $filename, array $default = []): array {
        $path = vlu_get_data_dir() . DIRECTORY_SEPARATOR . $filename;
        if (!file_exists($path)) {
            return $default;
        }
        $raw = @file_get_contents($path);
        if ($raw === false || $raw === '') {
            return $default;
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : $default;
    }
}

if (!function_exists('vlu_write_json_file')) {
    function vlu_write_json_file(string $filename, array $data): bool {
        $dir = vlu_get_data_dir();
        $path = $dir . DIRECTORY_SEPARATOR . $filename;
        $temp = $dir . DIRECTORY_SEPARATOR . $filename . '.' . uniqid('tmp_', true);
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            return false;
        }
        if (@file_put_contents($temp, $json, LOCK_EX) !== false) {
            return @rename($temp, $path);
        }
        return false;
    }
}

if (!function_exists('vlu_ensure_json_defaults')) {
    function vlu_ensure_json_defaults(): void {
        try {
            $users = vlu_read_json_file('users.json', []);
            $hasAdmin = false;
            foreach ($users as &$u) {
                if (isset($u['username']) && (strtolower((string)$u['username']) === 'admin' || strtolower((string)($u['email'] ?? '')) === 'admin@vluflagship.vn')) {
                    $hasAdmin = true;
                    $u['role'] = 1;
                    $u['email'] = 'admin@vluflagship.vn';
                    if (!password_verify('admin123', (string)($u['password'] ?? ''))) {
                        $u['password'] = password_hash('admin123', PASSWORD_DEFAULT);
                    }
                    break;
                }
            }
            unset($u);

            if (!$hasAdmin) {
                array_unshift($users, [
                    'id' => 1,
                    'username' => 'admin',
                    'password' => password_hash('admin123', PASSWORD_DEFAULT),
                    'email' => 'admin@vluflagship.vn',
                    'fullname' => 'Quản trị viên VLU',
                    'phone' => '02871059999',
                    'role' => 1,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }
            vlu_write_json_file('users.json', $users);

            if (!file_exists(vlu_get_data_dir() . DIRECTORY_SEPARATOR . 'orders.json')) {
                vlu_write_json_file('orders.json', []);
            }
        } catch (Throwable $e) {
            // Không làm gián đoạn hệ thống
        }
    }
}

// Luôn bảo đảm sẵn file JSON fallback
vlu_ensure_json_defaults();

// ============================================================================
// 2. MYSQL SCHEMA & MIGRATION HELPERS (PDO)
// ============================================================================
if (!function_exists('vlu_ensure_column')) {
    function vlu_ensure_column(PDO $pdo, string $table, string $column, string $definition): void {
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :tbl AND COLUMN_NAME = :col");
            $stmt->execute([':tbl' => $table, ':col' => $column]);
            if (((int)$stmt->fetchColumn()) === 0) {
                $pdo->exec("ALTER TABLE `$table` ADD COLUMN `$column` $definition");
            }
        } catch (Throwable $e) {
            // Bỏ qua lỗi ALTER nếu môi trường bị giới hạn quyền
        }
    }
}

if (!function_exists('vlu_ensure_database_schema')) {
    function vlu_ensure_database_schema(PDO $pdo): void {
        try {
            // 1. Khởi tạo & chuẩn hóa bảng `users` (role TINYINT: 1 = Admin, 0 = User/Guest)
            $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `username` VARCHAR(50) NOT NULL UNIQUE,
                `password` VARCHAR(255) NOT NULL,
                `email` VARCHAR(100) NOT NULL UNIQUE,
                `fullname` VARCHAR(100) DEFAULT NULL,
                `phone` VARCHAR(20) DEFAULT NULL,
                `role` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Admin, 0 = User/Guest',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            vlu_ensure_column($pdo, 'users', 'phone', "VARCHAR(20) DEFAULT NULL AFTER `fullname`");
            try {
                // Đảm bảo role là kiểu TINYINT(1)
                $pdo->exec("ALTER TABLE `users` MODIFY COLUMN `role` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Admin, 0 = User/Guest'");
            } catch (Throwable $ignoredRole) {}

            // 2. Khởi tạo & đảm bảo bảng `products`
            $pdo->exec("CREATE TABLE IF NOT EXISTS `products` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `category_id` INT(11) DEFAULT NULL,
                `name` VARCHAR(255) NOT NULL,
                `price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                `description` TEXT DEFAULT NULL,
                `image` VARCHAR(500) DEFAULT NULL,
                `stock` INT(11) NOT NULL DEFAULT 15,
                `colors_json` LONGTEXT DEFAULT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
            vlu_ensure_column($pdo, 'products', 'stock', "INT(11) NOT NULL DEFAULT 15");
            vlu_ensure_column($pdo, 'products', 'colors_json', "LONGTEXT DEFAULT NULL");

            // Tự động kiểm tra và nâng cấp hình ảnh sản phẩm thực tế từ SanPham/ nếu còn lưu placeholder
            try {
                $checkPlaceholder = $pdo->query("SELECT COUNT(*) FROM products WHERE image LIKE '%placeholders%' OR image IS NULL OR image = ''");
                if ($checkPlaceholder && (int)$checkPlaceholder->fetchColumn() > 0) {
                    $jsonInvPath = dirname(__DIR__) . '/database/catalog-inventory.json';
                    if (file_exists($jsonInvPath)) {
                        $invData = json_decode(file_get_contents($jsonInvPath), true);
                        if (!empty($invData['products'])) {
                            $updateStmt = $pdo->prepare("UPDATE products SET image = :img WHERE id = :dbid OR name = :pname");
                            foreach ($invData['products'] as $ip) {
                                if (!empty($ip['image'])) {
                                    $updateStmt->execute([
                                        ':img' => $ip['image'],
                                        ':dbid' => $ip['database_id'] ?? 0,
                                        ':pname' => $ip['name'] ?? ''
                                    ]);
                                }
                            }
                        }
                    }
                }
            } catch (Throwable $eSync) {}

            // 3. Khởi tạo & đảm bảo bảng `orders` (Hỗ trợ cả Thành viên & Khách Guest user_id NULL/0)
            $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `order_code` VARCHAR(50) NOT NULL UNIQUE,
                `user_id` VARCHAR(100) DEFAULT NULL COMMENT 'NULL hoặc 0 / guest nếu là Khách Guest',
                `user_identity` VARCHAR(100) DEFAULT 'guest',
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
                `payment_status` VARCHAR(30) DEFAULT 'pending',
                `cancel_reason` TEXT DEFAULT NULL,
                `status_history` LONGTEXT DEFAULT NULL,
                `internal_notes` LONGTEXT DEFAULT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_orders_user_id` (`user_id`),
                KEY `idx_orders_user_identity` (`user_identity`),
                KEY `idx_orders_status` (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            // Đồng bộ các cột quan trọng của bảng orders
            vlu_ensure_column($pdo, 'orders', 'user_identity', "VARCHAR(100) DEFAULT 'guest' AFTER `user_id`");
            vlu_ensure_column($pdo, 'orders', 'shipping_address', "TEXT DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'customer_address', "TEXT DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'delivery_method', "VARCHAR(50) DEFAULT 'home'");
            vlu_ensure_column($pdo, 'orders', 'shipping_method', "VARCHAR(50) DEFAULT 'home'");
            vlu_ensure_column($pdo, 'orders', 'installment_info', "TEXT DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'installment_term', "INT(11) DEFAULT 0");
            vlu_ensure_column($pdo, 'orders', 'installment_monthly', "DECIMAL(15,2) DEFAULT 0.00");
            vlu_ensure_column($pdo, 'orders', 'total_amount', "DECIMAL(15,2) NOT NULL DEFAULT 0.00");
            vlu_ensure_column($pdo, 'orders', 'total', "DECIMAL(15,2) NOT NULL DEFAULT 0.00");
            vlu_ensure_column($pdo, 'orders', 'store_location', "VARCHAR(255) DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'payment_key', "VARCHAR(50) DEFAULT 'cod'");
            vlu_ensure_column($pdo, 'orders', 'voucher_code', "VARCHAR(50) DEFAULT NULL");
            vlu_ensure_column($pdo, 'orders', 'payment_status', "VARCHAR(30) DEFAULT 'pending' AFTER `status`");
            vlu_ensure_column($pdo, 'orders', 'cancel_reason', "TEXT DEFAULT NULL AFTER `payment_status`");
            vlu_ensure_column($pdo, 'orders', 'status_history', "LONGTEXT DEFAULT NULL AFTER `cancel_reason`");
            vlu_ensure_column($pdo, 'orders', 'internal_notes', "LONGTEXT DEFAULT NULL AFTER `status_history`");
            vlu_ensure_column($pdo, 'orders', 'updated_at', "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            // 4. Khởi tạo & đảm bảo bảng `order_details`
            $pdo->exec("CREATE TABLE IF NOT EXISTS `order_details` (
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
                KEY `idx_order_details_order_id` (`order_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            vlu_ensure_column($pdo, 'order_details', 'order_code', "VARCHAR(50) DEFAULT NULL AFTER `order_id`");
            vlu_ensure_column($pdo, 'order_details', 'storage', "VARCHAR(100) DEFAULT 'Tiêu chuẩn'");
            vlu_ensure_column($pdo, 'order_details', 'variant', "VARCHAR(100) DEFAULT 'Tiêu chuẩn'");
            vlu_ensure_column($pdo, 'order_details', 'color', "VARCHAR(100) DEFAULT 'Mặc định'");
            vlu_ensure_column($pdo, 'order_details', 'image', "VARCHAR(500) DEFAULT NULL");

            // 5. Tự động kiểm tra & cập nhật tài khoản Admin mặc định chuẩn (admin / admin123 / role = 1)
            $checkAdmin = $pdo->prepare("SELECT id, username, password, email, role FROM users WHERE LOWER(username) = 'admin' OR LOWER(email) = 'admin@vluflagship.vn' LIMIT 1");
            $checkAdmin->execute();
            $adminRow = $checkAdmin->fetch(PDO::FETCH_ASSOC);

            $adminHash = password_hash('admin123', PASSWORD_DEFAULT);

            if (!$adminRow) {
                // Tạo mới nếu chưa có
                $insAdmin = $pdo->prepare("INSERT INTO users (username, password, email, fullname, phone, role) VALUES ('admin', :pw, 'admin@vluflagship.vn', 'Quản trị viên VLU', '02871059999', 1)");
                $insAdmin->execute([':pw' => $adminHash]);
            } else {
                $curPw = (string)$adminRow['password'];
                $needsRepair = false;

                // Nếu mật khẩu chưa khớp admin123 hoặc đang ở dạng plaintext cũ -> sửa lại hash bcrypt chuẩn
                if (!password_verify('admin123', $curPw) || $curPw === 'admin123') {
                    $needsRepair = true;
                }

                // Nếu role chưa phải 1 hoặc email chưa chuẩn admin@vluflagship.vn -> sửa lại
                if ((int)$adminRow['role'] !== 1 || strtolower((string)$adminRow['email']) !== 'admin@vluflagship.vn') {
                    $needsRepair = true;
                }

                if ($needsRepair) {
                    $upAdmin = $pdo->prepare("UPDATE users SET password = :pw, email = 'admin@vluflagship.vn', role = 1 WHERE id = :id");
                    $upAdmin->execute([':pw' => $adminHash, ':id' => $adminRow['id']]);
                }
            }

        } catch (Throwable $e) {
            // Không in lỗi ra ngoài để bảo toàn phản hồi JSON API
        }
    }
}

// ============================================================================
// 3. THỰC HIỆN KẾT NỐI PDO MYSQL
// ============================================================================
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
    // Nếu MySQL không hoạt động, $conn giữ giá trị null và hệ thống tự dùng JSON fallback
    $conn = null;
}
