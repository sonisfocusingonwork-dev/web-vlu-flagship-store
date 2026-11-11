<?php
/**
 * VLU FLAGSHIP STORE – Orders & Admin Sync API Endpoint (backend/api/orders.php)
 * - Tạo đơn hàng vào bảng `orders` & `order_details` bằng PDO Transaction an toàn (hỗ trợ cả Member & Guest)
 * - Tra cứu danh sách đơn hàng từ MySQL cho `account-page.js` và `admin-engine.js`
 * - Cập nhật trạng thái đơn hàng (pending -> shipping -> completed / cancelled) & xóa đơn hàng
 * - Đồng bộ thêm/sửa/xóa sản phẩm từ Admin vào bảng `products`
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

require_once dirname(__DIR__) . '/config/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/**
 * Chuẩn hóa chuỗi định danh user/guest
 */
function vlu_normalize_identity($value): string {
    $str = strtolower(trim((string)$value));
    if ($str === '' || $str === '0' || $str === 'null') {
        return 'guest';
    }
    $clean = preg_replace('/[^a-z0-9._@-]+/', '_', $str);
    return ($clean !== null && $clean !== '') ? $clean : 'guest';
}

/**
 * Format 1 dòng đơn hàng từ MySQL kèm danh sách items chuẩn Frontend
 */
function vlu_format_order_row(array $row, array $items): array {
    $orderCode = !empty($row['order_code']) ? (string)$row['order_code'] : ('#VLU-' . $row['id']);
    $userIdentity = !empty($row['user_identity'])
        ? (string)$row['user_identity']
        : (!empty($row['user_id']) ? (string)$row['user_id'] : 'guest');

    return [
        'id' => $orderCode,
        'db_id' => (int)$row['id'],
        'order_code' => $orderCode,
        'user_id' => $userIdentity,
        'db_user_id' => $row['user_id'] !== null ? (int)$row['user_id'] : null,
        'customer_name' => (string)($row['customer_name'] ?? 'Khách hàng VLU'),
        'customer_phone' => (string)($row['customer_phone'] ?? ''),
        'customer_email' => (string)($row['customer_email'] ?? ''),
        'customer_address' => (string)($row['customer_address'] ?? ''),
        'shipping_method' => (string)($row['shipping_method'] ?? 'home'),
        'store_location' => (string)($row['store_location'] ?? ''),
        'customer_notes' => (string)($row['customer_notes'] ?? ''),
        'payment_method' => (string)($row['payment_method'] ?? 'Thanh toán khi nhận hàng (COD)'),
        'payment_key' => (string)($row['payment_key'] ?? 'cod'),
        'voucher_code' => (string)($row['voucher_code'] ?? ''),
        'installment_term' => (int)($row['installment_term'] ?? 0),
        'installment_monthly' => (float)($row['installment_monthly'] ?? 0),
        'subtotal' => (float)($row['subtotal'] ?? 0),
        'discount' => (float)($row['discount'] ?? 0),
        'total' => (float)($row['total'] ?? 0),
        'status' => (string)($row['status'] ?? 'pending'),
        'created_at' => (string)($row['created_at'] ?? date('c')),
        'items' => $items
    ];
}

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'list';

    if ($conn === null) {
        echo json_encode([
            'success' => false,
            'code' => 'DB_CONNECTION_ERROR',
            'message' => 'CSDL MySQL hiện chưa kết nối.',
            'orders' => []
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'list') {
        $isAdmin = !empty($_GET['is_admin']);
        $userIdParam = trim((string)($_GET['user_id'] ?? ''));
        $orderCodeParam = trim((string)($_GET['order_code'] ?? ''));

        try {
            if ($orderCodeParam !== '') {
                $stmt = $conn->prepare("SELECT * FROM orders WHERE order_code = :code LIMIT 1");
                $stmt->execute([':code' => $orderCodeParam]);
            } elseif ($isAdmin || $userIdParam === '') {
                $stmt = $conn->query("SELECT * FROM orders ORDER BY id DESC LIMIT 200");
            } else {
                $identity = vlu_normalize_identity($userIdParam);
                $numericId = ctype_digit($userIdParam) ? (int)$userIdParam : -1;
                if ($identity === 'guest') {
                    $stmt = $conn->prepare("SELECT * FROM orders WHERE user_identity = 'guest' OR user_id IS NULL OR user_id = 0 ORDER BY id DESC LIMIT 100");
                    $stmt->execute();
                } else {
                    $stmt = $conn->prepare("SELECT * FROM orders WHERE LOWER(user_identity) = LOWER(:identity) OR (user_id IS NOT NULL AND user_id = :uid) ORDER BY id DESC LIMIT 100");
                    $stmt->execute([
                        ':identity' => $identity,
                        ':uid' => $numericId
                    ]);
                }
            }

            $orderRows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!$orderRows) {
                echo json_encode([
                    'success' => true,
                    'orders' => []
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $orderIds = array_map(static function ($r) {
                return (int)$r['id'];
            }, $orderRows);

            $placeholders = implode(',', array_fill(0, count($orderIds), '?'));
            $detailStmt = $conn->prepare("SELECT * FROM order_details WHERE order_id IN ($placeholders) ORDER BY id ASC");
            $detailStmt->execute($orderIds);
            $detailRows = $detailStmt->fetchAll(PDO::FETCH_ASSOC);

            $itemsByOrderId = [];
            foreach ($detailRows as $d) {
                $oid = (int)$d['order_id'];
                if (!isset($itemsByOrderId[$oid])) {
                    $itemsByOrderId[$oid] = [];
                }
                $itemsByOrderId[$oid][] = [
                    'id' => (string)$d['product_id'],
                    'name' => (string)$d['product_name'],
                    'color' => (string)($d['color'] ?? 'Mặc định'),
                    'variant' => (string)($d['variant'] ?? 'Tiêu chuẩn'),
                    'price' => (float)($d['price'] ?? 0),
                    'quantity' => (int)($d['quantity'] ?? 1),
                    'image' => (string)($d['image'] ?? 'frontend/assets/images/logo.png')
                ];
            }

            $formattedOrders = [];
            foreach ($orderRows as $row) {
                $oid = (int)$row['id'];
                $formattedOrders[] = vlu_format_order_row($row, $itemsByOrderId[$oid] ?? []);
            }

            echo json_encode([
                'success' => true,
                'orders' => $formattedOrders
            ], JSON_UNESCAPED_UNICODE);
            exit;

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'SQL_ERROR',
                'message' => 'Lỗi truy vấn đơn hàng: ' . $e->getMessage(),
                'orders' => []
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $jsonData = json_decode((string)$rawInput, true);
    if (!is_array($jsonData)) {
        $jsonData = $_POST;
    }

    $action = (string)($jsonData['action'] ?? 'create');

    if ($conn === null) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'code' => 'DB_CONNECTION_ERROR',
            'message' => 'Không thể kết nối CSDL MySQL.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 1. TẠO ĐƠN HÀNG MỚI VÀO BẢNG orders & order_details (TRANSACTION)
    if ($action === 'create') {
        $orderPayload = isset($jsonData['order']) && is_array($jsonData['order']) ? $jsonData['order'] : $jsonData;

        $orderCode = trim((string)($orderPayload['id'] ?? ($orderPayload['order_code'] ?? '')));
        if ($orderCode === '') {
            $orderCode = '#VLU-2026-' . random_int(1000, 9999);
        }

        $rawUserId = $orderPayload['user_id'] ?? 'guest';
        $dbUserId = null;
        if (is_numeric($rawUserId) && (int)$rawUserId > 0) {
            $dbUserId = (int)$rawUserId;
        } elseif (!empty($_SESSION['vlu_user']['id']) && is_numeric($_SESSION['vlu_user']['id']) && (int)$_SESSION['vlu_user']['id'] > 0) {
            $dbUserId = (int)$_SESSION['vlu_user']['id'];
        }

        $userIdentity = vlu_normalize_identity($rawUserId);

        // Nếu user_id là chuỗi email/username của user đã đăng ký trong bảng users, tự động map sang id số của bảng users
        if ($dbUserId === null && $userIdentity !== 'guest') {
            try {
                $uStmt = $conn->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(:u1) OR LOWER(email) = LOWER(:u2) LIMIT 1");
                $uStmt->execute([':u1' => (string)$rawUserId, ':u2' => (string)$rawUserId]);
                $uRow = $uStmt->fetch(PDO::FETCH_ASSOC);
                if ($uRow && isset($uRow['id'])) {
                    $dbUserId = (int)$uRow['id'];
                }
            } catch (Throwable $ignore) {
            }
        }

        $customerName = trim((string)($orderPayload['customer_name'] ?? 'Khách vãng lai (Guest)'));
        $customerPhone = trim((string)($orderPayload['customer_phone'] ?? ''));
        $customerEmail = trim((string)($orderPayload['customer_email'] ?? ''));
        $customerAddress = trim((string)($orderPayload['customer_address'] ?? 'Nhận tại cửa hàng VLU Flagship Store'));
        $shippingMethod = trim((string)($orderPayload['shipping_method'] ?? 'home'));
        $storeLocation = trim((string)($orderPayload['store_location'] ?? ''));
        $customerNotes = trim((string)($orderPayload['customer_notes'] ?? ''));
        $paymentMethod = trim((string)($orderPayload['payment_method'] ?? 'Thanh toán khi nhận hàng (COD)'));
        $paymentKey = trim((string)($orderPayload['payment_key'] ?? 'cod'));
        $voucherCode = trim((string)($orderPayload['voucher_code'] ?? ''));
        $installmentTerm = (int)($orderPayload['installment_term'] ?? 0);
        $installmentMonthly = (float)($orderPayload['installment_monthly'] ?? 0);
        $subtotal = (float)($orderPayload['subtotal'] ?? 0);
        $discount = (float)($orderPayload['discount'] ?? 0);
        $total = (float)($orderPayload['total'] ?? 0);
        $status = trim((string)($orderPayload['status'] ?? 'pending'));
        $items = isset($orderPayload['items']) && is_array($orderPayload['items']) ? $orderPayload['items'] : [];

        if ($customerName === '' || $customerPhone === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_CUSTOMER_INFO',
                'message' => 'Vui lòng nhập đầy đủ Họ tên và Số điện thoại người nhận.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        try {
            $conn->beginTransaction();

            // Kiểm tra xem order_code đã tồn tại chưa để tránh lỗi UNIQUE
            $checkCode = $conn->prepare("SELECT id FROM orders WHERE order_code = :code LIMIT 1");
            $checkCode->execute([':code' => $orderCode]);
            $existingOrder = $checkCode->fetch(PDO::FETCH_ASSOC);

            if ($existingOrder) {
                $orderDbId = (int)$existingOrder['id'];
            } else {
                $insertOrder = $conn->prepare("INSERT INTO orders (
                    order_code, user_id, user_identity, customer_name, customer_phone, customer_email,
                    customer_address, shipping_method, store_location, customer_notes,
                    payment_method, payment_key, voucher_code, installment_term, installment_monthly,
                    subtotal, discount, total, status
                ) VALUES (
                    :order_code, :user_id, :user_identity, :customer_name, :customer_phone, :customer_email,
                    :customer_address, :shipping_method, :store_location, :customer_notes,
                    :payment_method, :payment_key, :voucher_code, :installment_term, :installment_monthly,
                    :subtotal, :discount, :total, :status
                )");

                $insertOrder->execute([
                    ':order_code' => $orderCode,
                    ':user_id' => $dbUserId,
                    ':user_identity' => $userIdentity,
                    ':customer_name' => $customerName,
                    ':customer_phone' => $customerPhone,
                    ':customer_email' => $customerEmail,
                    ':customer_address' => $customerAddress,
                    ':shipping_method' => $shippingMethod,
                    ':store_location' => $storeLocation,
                    ':customer_notes' => $customerNotes,
                    ':payment_method' => $paymentMethod,
                    ':payment_key' => $paymentKey,
                    ':voucher_code' => $voucherCode,
                    ':installment_term' => $installmentTerm,
                    ':installment_monthly' => $installmentMonthly,
                    ':subtotal' => $subtotal,
                    ':discount' => $discount,
                    ':total' => $total,
                    ':status' => $status !== '' ? $status : 'pending'
                ]);

                $orderDbId = (int)$conn->lastInsertId();

                $insertDetail = $conn->prepare("INSERT INTO order_details (
                    order_id, order_code, product_id, product_name, color, variant, price, quantity, image
                ) VALUES (
                    :order_id, :order_code, :product_id, :product_name, :color, :variant, :price, :quantity, :image
                )");

                foreach ($items as $item) {
                    if (!is_array($item)) {
                        continue;
                    }
                    $insertDetail->execute([
                        ':order_id' => $orderDbId,
                        ':order_code' => $orderCode,
                        ':product_id' => (string)($item['id'] ?? ''),
                        ':product_name' => (string)($item['name'] ?? 'Sản phẩm VLU'),
                        ':color' => (string)($item['color'] ?? 'Mặc định'),
                        ':variant' => (string)($item['variant'] ?? 'Tiêu chuẩn'),
                        ':price' => (float)($item['price'] ?? 0),
                        ':quantity' => max(1, (int)($item['quantity'] ?? 1)),
                        ':image' => (string)($item['image'] ?? 'frontend/assets/images/logo.png')
                    ]);
                }
            }

            $conn->commit();

            echo json_encode([
                'success' => true,
                'code' => 'ORDER_CREATED',
                'message' => 'Đơn hàng ' . $orderCode . ' đã được lưu vào CSDL MySQL thành công!',
                'order_id' => $orderDbId,
                'order_code' => $orderCode
            ], JSON_UNESCAPED_UNICODE);
            exit;

        } catch (PDOException $e) {
            if ($conn->inTransaction()) {
                $conn->rollBack();
            }
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'SQL_ERROR',
                'message' => 'Lỗi lưu đơn hàng vào MySQL: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (pending -> shipping -> completed / cancelled)
    if ($action === 'update_status') {
        $orderCode = trim((string)($jsonData['order_id'] ?? ($jsonData['order_code'] ?? '')));
        $newStatus = trim((string)($jsonData['status'] ?? 'pending'));

        if ($orderCode === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_ORDER_ID',
                'message' => 'Thiếu mã đơn hàng cần cập nhật.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        try {
            $stmt = $conn->prepare("UPDATE orders SET status = :status WHERE order_code = :code OR id = :id");
            $stmt->execute([
                ':status' => $newStatus,
                ':code' => $orderCode,
                ':id' => ctype_digit($orderCode) ? (int)$orderCode : 0
            ]);

            echo json_encode([
                'success' => true,
                'code' => 'STATUS_UPDATED',
                'order_code' => $orderCode,
                'status' => $newStatus,
                'message' => 'Đã cập nhật trạng thái đơn hàng trong MySQL.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'SQL_ERROR',
                'message' => 'Lỗi cập nhật trạng thái đơn hàng: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // 3. XÓA ĐƠN HÀNG
    if ($action === 'delete') {
        $orderCode = trim((string)($jsonData['order_id'] ?? ($jsonData['order_code'] ?? '')));
        if ($orderCode === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_ORDER_ID',
                'message' => 'Thiếu mã đơn hàng cần xóa.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        try {
            $conn->beginTransaction();
            $delDetails = $conn->prepare("DELETE FROM order_details WHERE order_code = :code OR order_id = :id");
            $delDetails->execute([
                ':code' => $orderCode,
                ':id' => ctype_digit($orderCode) ? (int)$orderCode : 0
            ]);

            $delOrder = $conn->prepare("DELETE FROM orders WHERE order_code = :code OR id = :id");
            $delOrder->execute([
                ':code' => $orderCode,
                ':id' => ctype_digit($orderCode) ? (int)$orderCode : 0
            ]);
            $conn->commit();

            echo json_encode([
                'success' => true,
                'code' => 'ORDER_DELETED',
                'order_code' => $orderCode,
                'message' => 'Đã xóa đơn hàng khỏi CSDL MySQL.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            if ($conn->inTransaction()) {
                $conn->rollBack();
            }
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'SQL_ERROR',
                'message' => 'Lỗi xóa đơn hàng: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // 4. ĐỒNG BỘ SẢN PHẨM TỪ ADMIN VÀO BẢNG products
    if ($action === 'save_product') {
        $prod = isset($jsonData['product']) && is_array($jsonData['product']) ? $jsonData['product'] : $jsonData;
        $prodId = isset($prod['id']) && is_numeric($prod['id']) ? (int)$prod['id'] : 0;
        $name = trim((string)($prod['name'] ?? ''));
        $price = (float)($prod['price'] ?? 0);
        $stock = (int)($prod['stock'] ?? 15);
        $image = trim((string)($prod['image'] ?? 'frontend/assets/images/logo.png'));
        $description = trim((string)($prod['description'] ?? ($name . ' chính hãng tại VLU FLAGSHIP STORE.')));

        if ($name === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Thiếu tên sản phẩm.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        try {
            if ($prodId > 0) {
                $checkProd = $conn->prepare("SELECT id FROM products WHERE id = :id LIMIT 1");
                $checkProd->execute([':id' => $prodId]);
                if ($checkProd->fetch()) {
                    $upd = $conn->prepare("UPDATE products SET name = :name, price = :price, image = :image, stock = :stock, description = :desc WHERE id = :id");
                    $upd->execute([
                        ':name' => $name,
                        ':price' => $price,
                        ':image' => $image,
                        ':stock' => $stock,
                        ':desc' => $description,
                        ':id' => $prodId
                    ]);
                } else {
                    $ins = $conn->prepare("INSERT INTO products (id, category_id, name, price, description, image, stock) VALUES (:id, 1, :name, :price, :desc, :image, :stock)");
                    $ins->execute([
                        ':id' => $prodId,
                        ':name' => $name,
                        ':price' => $price,
                        ':desc' => $description,
                        ':image' => $image,
                        ':stock' => $stock
                    ]);
                }
            } else {
                $ins = $conn->prepare("INSERT INTO products (category_id, name, price, description, image, stock) VALUES (1, :name, :price, :desc, :image, :stock)");
                $ins->execute([
                    ':name' => $name,
                    ':price' => $price,
                    ':desc' => $description,
                    ':image' => $image,
                    ':stock' => $stock
                ]);
                $prodId = (int)$conn->lastInsertId();
            }

            echo json_encode([
                'success' => true,
                'product_id' => $prodId,
                'message' => 'Đã đồng bộ sản phẩm vào MySQL.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Lỗi lưu sản phẩm vào MySQL: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    if ($action === 'delete_product') {
        $prodId = isset($jsonData['id']) && is_numeric($jsonData['id']) ? (int)$jsonData['id'] : 0;
        try {
            if ($prodId > 0) {
                $del = $conn->prepare("DELETE FROM products WHERE id = :id");
                $del->execute([':id' => $prodId]);
            }
            echo json_encode([
                'success' => true,
                'message' => 'Đã xóa sản phẩm khỏi MySQL.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Lỗi xóa sản phẩm: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}

http_response_code(400);
echo json_encode([
    'success' => false,
    'code' => 'INVALID_ACTION',
    'message' => 'Hành động API không hợp lệ.'
], JSON_UNESCAPED_UNICODE);
