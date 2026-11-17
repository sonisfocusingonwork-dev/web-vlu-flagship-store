<?php
/**
 * VLU FLAGSHIP STORE – Orders & Admin Sync API Endpoint (backend/api/orders.php)
 * - Tạo đơn hàng vào bảng `orders` & `order_details` bằng PDO Transaction an toàn (hỗ trợ cả Member & Guest)
 * - Tra cứu danh sách đơn hàng từ MySQL cho `account-page.js` và `admin-engine.js`
 * - Fallback lưu trữ và đọc đơn hàng từ JSON server-side (backend/data/orders.json) khi MySQL chưa kết nối
 * - Cập nhật trạng thái đơn hàng (pending -> shipping -> completed / cancelled) & xóa đơn hàng
 * - Đồng bộ thêm/sửa/xóa sản phẩm từ Admin vào bảng `products`
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

require_once dirname(__DIR__) . '/config/db.php';

if (session_status() === PHP_SESSION_NONE) {
    @session_start();
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
 * Format 1 dòng đơn hàng từ MySQL/JSON kèm danh sách items chuẩn Frontend
 */
function vlu_format_order_row(array $row, array $items): array {
    $orderCode = !empty($row['order_code']) ? (string)$row['order_code'] : ('#VLU-' . ($row['id'] ?? '2026'));
    $userIdentity = !empty($row['user_identity'])
        ? (string)$row['user_identity']
        : (!empty($row['user_id']) ? (string)$row['user_id'] : 'guest');

    $address = (string)($row['shipping_address'] ?? ($row['customer_address'] ?? ''));
    $method = (string)($row['delivery_method'] ?? ($row['shipping_method'] ?? 'home'));
    $totalAmount = (float)($row['total_amount'] ?? ($row['total'] ?? 0));

    return [
        'id' => $orderCode,
        'db_id' => (int)($row['id'] ?? 0),
        'order_code' => $orderCode,
        'user_id' => $userIdentity,
        'db_user_id' => !empty($row['user_id']) && is_numeric($row['user_id']) ? (int)$row['user_id'] : null,
        'customer_name' => (string)($row['customer_name'] ?? 'Khách hàng VLU'),
        'customer_phone' => (string)($row['customer_phone'] ?? ''),
        'customer_email' => (string)($row['customer_email'] ?? ''),
        'customer_address' => $address,
        'shipping_address' => $address,
        'delivery_method' => $method,
        'shipping_method' => $method,
        'store_location' => (string)($row['store_location'] ?? ''),
        'customer_notes' => (string)($row['customer_notes'] ?? ''),
        'payment_method' => (string)($row['payment_method'] ?? 'Thanh toán khi nhận hàng (COD)'),
        'payment_key' => (string)($row['payment_key'] ?? 'cod'),
        'voucher_code' => (string)($row['voucher_code'] ?? ''),
        'installment_info' => (string)($row['installment_info'] ?? ''),
        'installment_term' => (int)($row['installment_term'] ?? 0),
        'installment_monthly' => (float)($row['installment_monthly'] ?? 0),
        'subtotal' => (float)($row['subtotal'] ?? 0),
        'discount' => (float)($row['discount'] ?? 0),
        'shipping_fee' => (float)($row['shipping_fee'] ?? 0),
        'total' => $totalAmount,
        'total_amount' => $totalAmount,
        'status' => (string)($row['status'] ?? 'pending'),
        'payment_status' => (string)($row['payment_status'] ?? ''),
        'cancel_reason' => (string)($row['cancel_reason'] ?? ''),
        'status_history' => (isset($row['status_history']) && is_array($row['status_history'])) ? $row['status_history'] : [],
        'internal_notes' => (isset($row['internal_notes']) && is_array($row['internal_notes'])) ? $row['internal_notes'] : [],
        'created_at' => (string)($row['created_at'] ?? date('c')),
        'updated_at' => (string)($row['updated_at'] ?? ''),
        'items' => $items
    ];
}

// ============================================================================
// 1. HTTP GET: TRA CỨU ĐƠN HÀNG (Hỗ trợ Admin, Khách hàng & Guest)
// ============================================================================
if ($method === 'GET') {
    if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
        parse_str($_SERVER['QUERY_STRING'], $_GET);
    }
    $action = $_GET['action'] ?? 'list';

    if ($action === 'list') {
        $isAdmin = !empty($_GET['is_admin']);
        $userIdParam = trim((string)($_GET['user_id'] ?? ''));
        $orderCodeParam = trim((string)($_GET['order_code'] ?? ''));

        // 1.1. Nếu có kết nối MySQL -> Truy vấn từ MySQL
        if ($conn !== null) {
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
                        $stmt = $conn->prepare("SELECT * FROM orders WHERE user_identity = 'guest' OR user_id IS NULL OR user_id = '0' OR user_id = 'guest' OR LOWER(user_id) = 'guest' ORDER BY id DESC LIMIT 100");
                        $stmt->execute();
                    } else {
                        $stmt = $conn->prepare("SELECT * FROM orders WHERE user_id = :uid OR user_id = :numid OR user_identity = :ident OR LOWER(customer_email) = LOWER(:email) ORDER BY id DESC LIMIT 100");
                        $stmt->execute([
                            ':uid' => $userIdParam,
                            ':numid' => (string)$numericId,
                            ':ident' => $identity,
                            ':email' => $userIdParam
                        ]);
                    }
                }

                $orderRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if (empty($orderRows)) {
                    echo json_encode([
                        'success' => true,
                        'orders' => []
                    ], JSON_UNESCAPED_UNICODE);
                    exit;
                }

                $orderIds = array_map(function ($r) { return (int)$r['id']; }, $orderRows);
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
                    $storageVal = (string)($d['storage'] ?? ($d['variant'] ?? 'Tiêu chuẩn'));
                    $itemsByOrderId[$oid][] = [
                        'id' => (string)$d['product_id'],
                        'name' => (string)$d['product_name'],
                        'color' => (string)($d['color'] ?? 'Mặc định'),
                        'storage' => $storageVal,
                        'variant' => $storageVal,
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
                // Tiếp tục thử fallback JSON
            }
        }

        // 1.2. Fallback đọc từ JSON server-side (backend/data/orders.json)
        $jsonOrders = vlu_read_json_file('orders.json', []);
        $matched = [];
        $identity = vlu_normalize_identity($userIdParam);

        foreach ($jsonOrders as $ord) {
            $code = (string)($ord['order_code'] ?? ($ord['id'] ?? ''));
            if ($orderCodeParam !== '') {
                if ($code === $orderCodeParam) {
                    $matched[] = $ord;
                    break;
                }
                continue;
            }
            if ($isAdmin || $userIdParam === '') {
                $matched[] = $ord;
                continue;
            }
            $oUser = strtolower((string)($ord['user_id'] ?? 'guest'));
            $oIdent = strtolower((string)($ord['user_identity'] ?? 'guest'));
            $oEmail = strtolower((string)($ord['customer_email'] ?? ''));
            if ($identity === 'guest') {
                if ($oUser === 'guest' || $oIdent === 'guest' || $oUser === '' || $oUser === '0') {
                    $matched[] = $ord;
                }
            } else {
                if ($oUser === strtolower($userIdParam) || $oIdent === $identity || $oEmail === strtolower($userIdParam)) {
                    $matched[] = $ord;
                }
            }
        }

        $formatted = [];
        foreach ($matched as $m) {
            $items = isset($m['items']) && is_array($m['items']) ? $m['items'] : [];
            $formatted[] = vlu_format_order_row($m, $items);
        }

        echo json_encode([
            'success' => true,
            'orders' => $formatted
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // =========================================================================
    // 1.2. HTTP GET: TRA CỨU DANH SÁCH SẢN PHẨM MỚI NHẤT (Single Source of Truth)
    // =========================================================================
    if ($action === 'products') {
        $products = [];
        if ($conn !== null) {
            try {
                $stmt = $conn->query("SELECT * FROM products ORDER BY id ASC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($rows)) {
                    $products = $rows;
                }
            } catch (Throwable $e) {}
        }

        if (empty($products)) {
            $jsonProducts = vlu_read_json_file('products.json', []);
            if (!empty($jsonProducts)) {
                $products = $jsonProducts;
            } else {
                $catInvPath = dirname(__DIR__) . '/database/catalog-inventory.json';
                if (file_exists($catInvPath)) {
                    $catData = json_decode(file_get_contents($catInvPath), true);
                    $products = $catData['products'] ?? $catData ?? [];
                }
            }
        }

        echo json_encode([
            'success' => true,
            'count' => count($products),
            'products' => $products
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// ============================================================================
// 2. HTTP POST: TẠO ĐƠN HÀNG, CẬP NHẬT TRẠNG THÁI & ĐỒNG BỘ
// ============================================================================
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    if (($rawInput === '' || $rawInput === false) && PHP_SAPI === 'cli') {
        $rawInput = file_get_contents('php://stdin');
    }
    $jsonData = json_decode((string)$rawInput, true);
    if (!is_array($jsonData)) {
        $jsonData = $_POST;
    }

    $action = (string)($jsonData['action'] ?? 'create');

    // =========================================================================
    // 2.1. ACTION: CREATE ORDER (Tạo đơn hàng mới)
    // =========================================================================
    if ($action === 'create') {
        $orderPayload = isset($jsonData['order']) && is_array($jsonData['order']) ? $jsonData['order'] : $jsonData;

        $orderCode = trim((string)($orderPayload['id'] ?? ($orderPayload['order_code'] ?? '')));
        if ($orderCode === '') {
            $orderCode = '#VLU-2026-' . random_int(1000, 9999);
        }

        $rawUserId = $orderPayload['user_id'] ?? 'guest';
        $dbUserId = null;
        if (is_numeric($rawUserId) && (int)$rawUserId > 0) {
            $dbUserId = (string)(int)$rawUserId;
        } elseif (!empty($_SESSION['vlu_user']['id'])) {
            $dbUserId = (string)$_SESSION['vlu_user']['id'];
        }

        $userIdentity = vlu_normalize_identity($rawUserId);

        $customerName = trim((string)($orderPayload['customer_name'] ?? 'Khách vãng lai (Guest)'));
        $customerPhone = trim((string)($orderPayload['customer_phone'] ?? ''));
        $customerEmail = trim((string)($orderPayload['customer_email'] ?? ''));
        $customerAddress = trim((string)($orderPayload['customer_address'] ?? ($orderPayload['shipping_address'] ?? '')));
        $shippingMethod = trim((string)($orderPayload['shipping_method'] ?? ($orderPayload['delivery_method'] ?? 'home')));
        $storeLocation = trim((string)($orderPayload['store_location'] ?? ''));
        $customerNotes = trim((string)($orderPayload['customer_notes'] ?? ''));
        $paymentMethod = trim((string)($orderPayload['payment_method'] ?? 'Thanh toán khi nhận hàng (COD)'));
        $paymentKey = trim((string)($orderPayload['payment_key'] ?? 'cod'));
        $voucherCode = trim((string)($orderPayload['voucher_code'] ?? ''));
        $installmentInfo = trim((string)($orderPayload['installment_info'] ?? ''));
        $installmentTerm = (int)($orderPayload['installment_term'] ?? 0);
        $installmentMonthly = (float)($orderPayload['installment_monthly'] ?? 0);
        $subtotal = (float)($orderPayload['subtotal'] ?? 0);
        $discount = (float)($orderPayload['discount'] ?? 0);
        $total = (float)($orderPayload['total'] ?? ($orderPayload['total_amount'] ?? 0));
        $status = trim((string)($orderPayload['status'] ?? 'pending'));
        $items = isset($orderPayload['items']) && is_array($orderPayload['items']) ? $orderPayload['items'] : [];

        // Validate Họ tên (tối thiểu 2 ký tự, không rỗng, không chứa ký tự đặc biệt nguy hiểm)
        if (mb_strlen($customerName) < 2 || preg_match('/[<>"\'`;=\\\\]/u', $customerName) || str_contains($customerName, '/')) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'INVALID_CUSTOMER_NAME',
                'message' => 'Họ và tên người nhận không hợp lệ (tối thiểu 2 ký tự và không chứa ký tự đặc biệt)!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Validate Số điện thoại 10 số di động chuẩn Việt Nam
        if (!preg_match('/^(0[3|5|7|8|9])+([0-9]{8})$/', $customerPhone)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'INVALID_CUSTOMER_PHONE',
                'message' => 'Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động tại Việt Nam.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Validate Địa chỉ giao hàng khi chọn giao tận nơi
        if ($shippingMethod !== 'pickup' && $customerAddress === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_SHIPPING_ADDRESS',
                'message' => 'Địa chỉ nhận hàng là bắt buộc khi chọn giao hàng tận nơi!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($shippingMethod === 'pickup' && $customerAddress === '') {
            $customerAddress = $storeLocation ?: 'Nhận tại cửa hàng VLU Flagship Store';
        }

        $orderDbId = 0;

        // Lưu vào MySQL nếu có kết nối
        if ($conn !== null) {
            try {
                $conn->beginTransaction();

                $checkCode = $conn->prepare("SELECT id FROM orders WHERE order_code = :code LIMIT 1");
                $checkCode->execute([':code' => $orderCode]);
                $existingOrder = $checkCode->fetch(PDO::FETCH_ASSOC);

                if ($existingOrder) {
                    $orderDbId = (int)$existingOrder['id'];
                } else {
                    $insertOrder = $conn->prepare("INSERT INTO orders (
                        order_code, user_id, user_identity, customer_name, customer_phone, customer_email,
                        shipping_address, customer_address, delivery_method, shipping_method, store_location, customer_notes,
                        payment_method, payment_key, voucher_code, installment_info, installment_term, installment_monthly,
                        subtotal, discount, total_amount, total, status
                    ) VALUES (
                        :order_code, :user_id, :user_identity, :customer_name, :customer_phone, :customer_email,
                        :shipping_address, :customer_address, :delivery_method, :shipping_method, :store_location, :customer_notes,
                        :payment_method, :payment_key, :voucher_code, :installment_info, :installment_term, :installment_monthly,
                        :subtotal, :discount, :total_amount, :total, :status
                    )");

                    $insertOrder->execute([
                        ':order_code' => $orderCode,
                        ':user_id' => $dbUserId,
                        ':user_identity' => $userIdentity,
                        ':customer_name' => $customerName,
                        ':customer_phone' => $customerPhone,
                        ':customer_email' => $customerEmail,
                        ':shipping_address' => $customerAddress,
                        ':customer_address' => $customerAddress,
                        ':delivery_method' => $shippingMethod,
                        ':shipping_method' => $shippingMethod,
                        ':store_location' => $storeLocation,
                        ':customer_notes' => $customerNotes,
                        ':payment_method' => $paymentMethod,
                        ':payment_key' => $paymentKey,
                        ':voucher_code' => $voucherCode,
                        ':installment_info' => $installmentInfo,
                        ':installment_term' => $installmentTerm,
                        ':installment_monthly' => $installmentMonthly,
                        ':subtotal' => $subtotal,
                        ':discount' => $discount,
                        ':total_amount' => $total,
                        ':total' => $total,
                        ':status' => $status !== '' ? $status : 'pending'
                    ]);

                    $orderDbId = (int)$conn->lastInsertId();

                    $insertDetail = $conn->prepare("INSERT INTO order_details (
                        order_id, order_code, product_id, product_name, color, storage, variant, price, quantity, image
                    ) VALUES (
                        :order_id, :order_code, :product_id, :product_name, :color, :storage, :variant, :price, :quantity, :image
                    )");

                    foreach ($items as $item) {
                        if (!is_array($item)) continue;
                        $storageText = (string)($item['storage'] ?? ($item['variant'] ?? 'Tiêu chuẩn'));
                        $insertDetail->execute([
                            ':order_id' => $orderDbId,
                            ':order_code' => $orderCode,
                            ':product_id' => (string)($item['id'] ?? ''),
                            ':product_name' => (string)($item['name'] ?? 'Sản phẩm VLU'),
                            ':color' => (string)($item['color'] ?? 'Mặc định'),
                            ':storage' => $storageText,
                            ':variant' => $storageText,
                            ':price' => (float)($item['price'] ?? 0),
                            ':quantity' => max(1, (int)($item['quantity'] ?? 1)),
                            ':image' => (string)($item['image'] ?? 'frontend/assets/images/logo.png')
                        ]);
                    }
                }

                $conn->commit();

            } catch (PDOException $e) {
                if ($conn->inTransaction()) {
                    $conn->rollBack();
                }
            }
        }

        // Luôn đồng bộ vào file JSON fallback (backend/data/orders.json)
        $jsonOrders = vlu_read_json_file('orders.json', []);
        $jsonOrderEntry = [
            'id' => $orderDbId ?: (count($jsonOrders) + 1),
            'order_code' => $orderCode,
            'user_id' => $dbUserId ?: $rawUserId,
            'user_identity' => $userIdentity,
            'customer_name' => $customerName,
            'customer_phone' => $customerPhone,
            'customer_email' => $customerEmail,
            'shipping_address' => $customerAddress,
            'customer_address' => $customerAddress,
            'delivery_method' => $shippingMethod,
            'shipping_method' => $shippingMethod,
            'store_location' => $storeLocation,
            'customer_notes' => $customerNotes,
            'payment_method' => $paymentMethod,
            'payment_key' => $paymentKey,
            'voucher_code' => $voucherCode,
            'installment_info' => $installmentInfo,
            'installment_term' => $installmentTerm,
            'installment_monthly' => $installmentMonthly,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total_amount' => $total,
            'total' => $total,
            'status' => $status !== '' ? $status : 'pending',
            'created_at' => date('Y-m-d H:i:s'),
            'items' => $items
        ];

        // Tránh trùng order_code trong JSON
        $existsIndex = -1;
        foreach ($jsonOrders as $idx => $jo) {
            if (($jo['order_code'] ?? '') === $orderCode) {
                $existsIndex = $idx;
                break;
            }
        }
        if ($existsIndex >= 0) {
            $jsonOrders[$existsIndex] = $jsonOrderEntry;
        } else {
            array_unshift($jsonOrders, $jsonOrderEntry);
        }
        vlu_write_json_file('orders.json', $jsonOrders);

        echo json_encode([
            'success' => true,
            'code' => 'ORDER_CREATED',
            'message' => 'Đơn hàng ' . $orderCode . ' đã được ghi nhận thành công!',
            'order_id' => $orderDbId ?: $orderCode,
            'order_code' => $orderCode
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // =========================================================================
    // 2.2. ACTION: UPDATE STATUS / ORDER METADATA (Cập nhật trạng thái, thanh toán, ghi chú)
    // =========================================================================
    if ($action === 'update_status' || $action === 'update_order_meta') {
        $orderCode = trim((string)($jsonData['order_id'] ?? ($jsonData['order_code'] ?? '')));
        $newStatus = isset($jsonData['status']) ? trim((string)$jsonData['status']) : '';
        $paymentStatus = isset($jsonData['payment_status']) ? trim((string)$jsonData['payment_status']) : null;
        $cancelReason = isset($jsonData['cancel_reason']) ? trim((string)$jsonData['cancel_reason']) : null;
        $statusHistory = (isset($jsonData['status_history']) && is_array($jsonData['status_history'])) ? $jsonData['status_history'] : null;
        $internalNotes = (isset($jsonData['internal_notes']) && is_array($jsonData['internal_notes'])) ? $jsonData['internal_notes'] : null;

        if ($orderCode === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_ORDER_ID',
                'message' => 'Thiếu mã đơn hàng cần cập nhật.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($conn !== null && $newStatus !== '') {
            try {
                $stmt = $conn->prepare("UPDATE orders SET status = :status WHERE order_code = :code OR id = :id");
                $stmt->execute([
                    ':status' => $newStatus,
                    ':code' => $orderCode,
                    ':id' => ctype_digit($orderCode) ? (int)$orderCode : 0
                ]);
            } catch (Throwable $e) {}
        }

        // Cập nhật trong JSON fallback
        $jsonOrders = vlu_read_json_file('orders.json', []);
        foreach ($jsonOrders as &$jo) {
            if (($jo['order_code'] ?? '') === $orderCode || (string)($jo['id'] ?? '') === $orderCode) {
                if ($newStatus !== '') {
                    $jo['status'] = $newStatus;
                }
                if ($paymentStatus !== null && $paymentStatus !== '') {
                    $jo['payment_status'] = $paymentStatus;
                }
                if ($cancelReason !== null) {
                    $jo['cancel_reason'] = $cancelReason;
                }
                if ($statusHistory !== null) {
                    $jo['status_history'] = $statusHistory;
                }
                if ($internalNotes !== null) {
                    $jo['internal_notes'] = $internalNotes;
                }
                $jo['updated_at'] = date('Y-m-d H:i:s');
                break;
            }
        }
        unset($jo);
        vlu_write_json_file('orders.json', $jsonOrders);

        echo json_encode([
            'success' => true,
            'code' => 'STATUS_UPDATED',
            'order_code' => $orderCode,
            'status' => $newStatus,
            'message' => 'Đã cập nhật thông tin đơn hàng thành công.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // =========================================================================
    // 2.3. ACTION: DELETE ORDER (Khóa xóa cứng đơn hàng đã phát sinh giao dịch)
    // =========================================================================
    if ($action === 'delete') {
        $orderCode = trim((string)($jsonData['order_id'] ?? ($jsonData['order_code'] ?? '')));
        if ($orderCode === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_ORDER_ID',
                'message' => 'Thiếu mã đơn hàng.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $jsonOrders = vlu_read_json_file('orders.json', []);
        foreach ($jsonOrders as $jo) {
            if (($jo['order_code'] ?? '') === $orderCode || (string)($jo['id'] ?? '') === $orderCode) {
                $hasTx = ((float)($jo['total'] ?? ($jo['total_amount'] ?? 0)) > 0) || !empty($jo['items']);
                if ($hasTx) {
                    http_response_code(403);
                    echo json_encode([
                        'success' => false,
                        'code' => 'CANNOT_DELETE_TRANSACTION_ORDER',
                        'message' => 'Không được phép xóa cứng đơn hàng đã phát sinh giao dịch. Hãy dùng chức năng Hủy đơn có lưu vết lịch sử.'
                    ], JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }

        if ($conn !== null) {
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
            } catch (Throwable $e) {
                if ($conn->inTransaction()) {
                    $conn->rollBack();
                }
            }
        }

        // Xóa trong JSON fallback nếu không có giao dịch
        $jsonOrders = array_values(array_filter($jsonOrders, function ($jo) use ($orderCode) {
            return ($jo['order_code'] ?? '') !== $orderCode && (string)($jo['id'] ?? '') !== $orderCode;
        }));
        vlu_write_json_file('orders.json', $jsonOrders);

        echo json_encode([
            'success' => true,
            'code' => 'ORDER_DELETED',
            'order_code' => $orderCode,
            'message' => 'Đã xử lý thành công.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // =========================================================================
    // 2.4. ACTION: SAVE PRODUCT & DELETE PRODUCT (Đồng bộ sản phẩm)
    // =========================================================================
    if ($action === 'save_product') {
        $prod = isset($jsonData['product']) && is_array($jsonData['product']) ? $jsonData['product'] : $jsonData;
        $prodId = isset($prod['id']) && is_numeric($prod['id']) ? (int)$prod['id'] : 0;
        $rawId = (string)($prod['id'] ?? '');
        $name = trim((string)($prod['name'] ?? ''));
        $price = (float)($prod['price'] ?? 0);
        $oldPrice = isset($prod['old_price']) ? (float)$prod['old_price'] : null;
        $stock = (int)($prod['stock'] ?? 15);
        $image = trim((string)($prod['image'] ?? 'frontend/assets/images/logo.png'));
        $description = trim((string)($prod['description'] ?? ($name . ' chính hãng tại VLU FLAGSHIP STORE.')));
        $categoryName = (string)($prod['category_name'] ?? '');
        $categorySlug = trim((string)($prod['category'] ?? ($prod['category_slug'] ?? '')));

        if ($name === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Thiếu tên sản phẩm.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 1. Lưu vào MySQL nếu có kết nối
        if ($conn !== null) {
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
            } catch (Throwable $e) {}
        }

        // 2. Luôn đồng bộ vào file backend/data/products.json (Single Source of Truth)
        $jsonProducts = vlu_read_json_file('products.json', []);
        $found = false;
        foreach ($jsonProducts as &$jp) {
            if ((!empty($rawId) && (string)($jp['id'] ?? '') === $rawId) ||
                ($prodId > 0 && (int)($jp['database_id'] ?? 0) === $prodId) ||
                (strtolower(trim((string)($jp['name'] ?? ''))) === strtolower($name))) {
                $jp['name'] = $name;
                $jp['price'] = $price;
                $jp['basePrice'] = $price;
                if ($oldPrice) $jp['oldPrice'] = $oldPrice;
                $jp['image'] = $image;
                $jp['stock'] = $stock;
                $jp['description'] = $description;
                if ($categoryName) $jp['brand'] = $categoryName;
                if ($categorySlug !== '') $jp['category'] = $categorySlug;
                $found = true;
                break;
            }
        }
        unset($jp);

        if (!$found) {
            $newEntry = [
                'id' => $rawId ?: ('vlu-prod-' . ($prodId ?: time())),
                'database_id' => $prodId ?: time(),
                'name' => $name,
                'price' => $price,
                'basePrice' => $price,
                'oldPrice' => $oldPrice,
                'image' => $image,
                'stock' => $stock,
                'description' => $description,
                'brand' => $categoryName ?: 'Apple',
                'category' => $categorySlug !== '' ? $categorySlug : 'dien-thoai',
                'colors' => [
                    ['name' => 'Tiêu chuẩn', 'hex' => '#334155', 'key' => 'standard', 'image' => $image, 'img' => $image]
                ]
            ];
            array_unshift($jsonProducts, $newEntry);
        }
        vlu_write_json_file('products.json', $jsonProducts);

        echo json_encode([
            'success' => true,
            'product_id' => $prodId ?: $rawId,
            'message' => 'Đã đồng bộ sản phẩm vào MySQL và products.json.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete_product') {
        $rawId = (string)($jsonData['id'] ?? '');
        $prodId = isset($jsonData['id']) && is_numeric($jsonData['id']) ? (int)$jsonData['id'] : 0;
        if ($conn !== null && $prodId > 0) {
            try {
                $del = $conn->prepare("DELETE FROM products WHERE id = :id");
                $del->execute([':id' => $prodId]);
            } catch (Throwable $e) {}
        }

        // Xóa khỏi backend/data/products.json
        $jsonProducts = vlu_read_json_file('products.json', []);
        $jsonProducts = array_values(array_filter($jsonProducts, function ($jp) use ($rawId, $prodId) {
            if ($rawId !== '' && (string)($jp['id'] ?? '') === $rawId) return false;
            if ($prodId > 0 && (int)($jp['database_id'] ?? 0) === $prodId) return false;
            return true;
        }));
        vlu_write_json_file('products.json', $jsonProducts);

        echo json_encode([
            'success' => true,
            'message' => 'Đã xóa sản phẩm thành công từ MySQL và products.json.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

http_response_code(400);
echo json_encode([
    'success' => false,
    'code' => 'INVALID_ACTION',
    'message' => 'Hành động API không hợp lệ.'
], JSON_UNESCAPED_UNICODE);
