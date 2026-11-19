<?php
/**
 * VLU FLAGSHIP STORE – Orders & Admin Sync API Endpoint (backend/api/orders.php)
 * - Tạo đơn hàng vào bảng `orders` & `order_details` bằng PDO Transaction an toàn (Chỉ dành cho tài khoản SQL đã đăng nhập)
 * - Tra cứu danh sách đơn hàng từ MySQL cho `account-page.js` và `admin-engine.js`
 * - Fallback lưu trữ và đọc đơn hàng từ JSON server-side (backend/data/orders.json) khi MySQL chưa kết nối
 * - Cập nhật trạng thái đơn hàng (pending -> shipping -> completed / cancelled) & xóa đơn hàng
 * - Đồng bộ thêm/sửa/xóa sản phẩm từ Admin vào bảng `products`
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

@date_default_timezone_set('Asia/Ho_Chi_Minh');

require_once dirname(__DIR__) . '/config/db.php';

if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/**
 * Chuẩn hóa khóa mã đơn hàng (loại bỏ toàn bộ dấu # ở đầu, trim, in hoa)
 */
function vlu_normalize_order_key($code): string {
    $str = trim((string)$code);
    if ($str === '') {
        return '';
    }
    $clean = preg_replace('/^#+/', '', $str);
    return strtoupper(trim((string)$clean));
}

/**
 * Chuẩn hóa hiển thị mã đơn hàng (luôn có duy nhất 1 dấu # ở đầu, VD: #VLU-2026-28506)
 */
function vlu_format_order_code($code): string {
    $key = vlu_normalize_order_key($code);
    return $key !== '' ? ('#' . $key) : '';
}

/**
 * Chuẩn hóa trạng thái đơn hàng khớp 1:1 giữa Admin và Account (6 bước + cancelled/returned)
 */
function vlu_normalize_order_status($status): string {
    $s = strtolower(trim((string)$status));
    if ($s === 'confirmed') return 'confirmed';
    if ($s === 'preparing' || $s === 'processing') return 'preparing';
    if ($s === 'handed_over' || $s === 'handedover' || $s === 'dispatched') return 'handed_over';
    if ($s === 'shipping' || $s === 'delivering') return 'shipping';
    if ($s === 'completed' || $s === 'delivered') return 'completed';
    if ($s === 'cancelled' || $s === 'canceled') return 'cancelled';
    if ($s === 'returned' || $s === 'return') return 'returned';
    return 'pending';
}

function vlu_order_status_label(string $status): string {
    $map = [
        'pending' => 'Chờ xác nhận',
        'confirmed' => 'Đã xác nhận',
        'preparing' => 'Đang chuẩn bị',
        'handed_over' => 'Đã bàn giao vận chuyển',
        'shipping' => 'Đang giao hàng',
        'completed' => 'Giao thành công',
        'cancelled' => 'Đã hủy',
        'returned' => 'Yêu cầu đổi trả'
    ];
    $norm = vlu_normalize_order_status($status);
    return $map[$norm] ?? 'Chờ xác nhận';
}

function vlu_decode_json_array($value): array {
    if (is_array($value)) {
        return $value;
    }
    if (is_string($value) && trim($value) !== '') {
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return [];
}

/**
 * Kiểm tra 1 bản ghi đơn hàng có khớp mã đơn / id / db_id hay không (bỏ mọi tiền tố #)
 */
function vlu_order_matches_identifier(array $ord, string $rawTarget, int $targetDbId = 0): bool {
    $targetKey = vlu_normalize_order_key($rawTarget);
    $numericTarget = $targetDbId > 0 ? $targetDbId : (ctype_digit($targetKey) ? (int)$targetKey : 0);

    $ordCodeKey = vlu_normalize_order_key($ord['order_code'] ?? '');
    $ordIdKey = vlu_normalize_order_key($ord['id'] ?? '');

    if ($targetKey !== '' && ($ordCodeKey === $targetKey || $ordIdKey === $targetKey)) {
        return true;
    }
    if ($numericTarget > 0) {
        $ordDbId = (int)($ord['db_id'] ?? 0);
        $ordRawId = is_numeric($ord['id'] ?? null) ? (int)$ord['id'] : 0;
        if ($ordDbId === $numericTarget || $ordRawId === $numericTarget) {
            return true;
        }
    }
    return false;
}

/**
 * Hợp nhất lịch sử chuyển trạng thái khi cập nhật trạng thái đơn hàng
 */
function vlu_append_status_history(
    array $existingHistory,
    string $newStatus,
    string $nowIso,
    string $actor,
    string $note = '',
    string $cancelReason = '',
    string $createdAt = ''
): array {
    $history = array_values(array_filter($existingHistory, 'is_array'));
    $hasPending = false;
    foreach ($history as &$ev) {
        if (isset($ev['status'])) {
            $ev['status'] = vlu_normalize_order_status($ev['status']);
            if ($ev['status'] === 'pending') {
                $hasPending = true;
            }
        }
    }
    unset($ev);

    if (!$hasPending) {
        array_unshift($history, [
            'status' => 'pending',
            'label' => vlu_order_status_label('pending'),
            'timestamp' => $createdAt !== '' ? $createdAt : $nowIso,
            'actor' => 'Hệ thống VLU',
            'note' => 'Đơn hàng được khởi tạo'
        ]);
    }

    if ($newStatus !== '') {
        $norm = vlu_normalize_order_status($newStatus);
        $last = !empty($history) ? $history[count($history) - 1] : null;
        if (!$last || ($last['status'] ?? '') !== $norm) {
            $entryNote = $note;
            if ($norm === 'cancelled' && $cancelReason !== '') {
                $entryNote = 'Lý do hủy: ' . $cancelReason;
            }
            $history[] = [
                'status' => $norm,
                'label' => vlu_order_status_label($norm),
                'timestamp' => $nowIso,
                'actor' => $actor !== '' ? $actor : 'Quản trị viên VLU',
                'note' => $entryNote
            ];
        }
    }
    return $history;
}

/**
 * Chuẩn hóa chuỗi định danh tài khoản (tuyệt đối không fallback sang 'guest')
 */
function vlu_normalize_identity($value): string {
    $str = strtolower(trim((string)$value));
    if ($str === '' || $str === '0' || $str === 'null' || $str === 'guest') {
        return '';
    }
    $clean = preg_replace('/[^a-z0-9._@-]+/', '_', $str);
    return ($clean !== null && $clean !== '' && $clean !== 'guest') ? $clean : '';
}

/**
 * Tra cứu tài khoản thực từ bảng `users` (MySQL hoặc JSON fallback) theo ID nguyên dương > 0
 */
function vlu_find_real_user(?PDO $conn, int $uid): ?array {
    if ($uid <= 0) {
        return null;
    }
    if ($conn !== null) {
        try {
            $stmt = $conn->prepare("SELECT id, username, email, fullname, role FROM users WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $uid]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row && strtolower(trim((string)($row['username'] ?? ''))) !== 'guest') {
                return $row;
            }
        } catch (Throwable $e) {}
    }
    $jsonUsers = vlu_read_json_file('users.json', []);
    foreach ($jsonUsers as $ju) {
        if ((int)($ju['id'] ?? 0) === $uid && strtolower(trim((string)($ju['username'] ?? ''))) !== 'guest') {
            return $ju;
        }
    }
    return null;
}

/**
 * Format 1 dòng đơn hàng từ MySQL/JSON kèm danh sách items chuẩn Frontend
 */
function vlu_format_order_row(array $row, array $items): array {
    $rawCode = !empty($row['order_code']) ? (string)$row['order_code'] : ('VLU-' . ($row['id'] ?? '2026'));
    $orderCode = vlu_format_order_code($rawCode);
    $rawUserId = trim((string)($row['user_id'] ?? ''));
    $rawIdentity = trim((string)($row['user_identity'] ?? ''));
    $userIdentity = ($rawIdentity !== '' && strtolower($rawIdentity) !== 'guest')
        ? $rawIdentity
        : (($rawUserId !== '' && strtolower($rawUserId) !== 'guest') ? $rawUserId : '');
    $cleanUserId = ($rawUserId !== '' && strtolower($rawUserId) !== 'guest') ? $rawUserId : $userIdentity;

    $address = (string)($row['shipping_address'] ?? ($row['customer_address'] ?? ''));
    $method = (string)($row['delivery_method'] ?? ($row['shipping_method'] ?? 'home'));
    $totalAmount = (float)($row['total_amount'] ?? ($row['total'] ?? 0));
    $status = vlu_normalize_order_status($row['status'] ?? 'pending');
    $paymentStatus = trim((string)($row['payment_status'] ?? ''));
    if ($paymentStatus === '') {
        $paymentStatus = ($status === 'completed') ? 'paid' : 'pending';
    }
    $createdAt = (string)($row['created_at'] ?? date('c'));
    $updatedAt = trim((string)($row['updated_at'] ?? ''));

    return [
        'id' => $orderCode,
        'db_id' => (int)($row['db_id'] ?? (is_numeric($row['id'] ?? null) ? (int)$row['id'] : 0)),
        'order_code' => $orderCode,
        'user_id' => $cleanUserId,
        'user_identity' => $userIdentity,
        'db_user_id' => ($rawUserId !== '' && is_numeric($rawUserId) && (int)$rawUserId > 0) ? (int)$rawUserId : null,
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
        'status' => $status,
        'payment_status' => $paymentStatus,
        'cancel_reason' => (string)($row['cancel_reason'] ?? ''),
        'status_history' => vlu_decode_json_array($row['status_history'] ?? []),
        'internal_notes' => vlu_decode_json_array($row['internal_notes'] ?? []),
        'created_at' => $createdAt,
        'updated_at' => $updatedAt !== '' ? $updatedAt : $createdAt,
        'items' => $items
    ];
}

// ============================================================================
// 1. HTTP GET: TRA CỨU ĐƠN HÀNG (Admin xem toàn bộ; Khách chỉ xem đơn của chính mình)
// ============================================================================
if ($method === 'GET') {
    if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
        parse_str($_SERVER['QUERY_STRING'], $_GET);
    }
    $action = $_GET['action'] ?? 'list';

    if ($action === 'list') {
        $isAdmin = !empty($_GET['is_admin']);
        $userIdParam = trim((string)($_GET['user_id'] ?? ''));
        $userIdentityParam = trim((string)($_GET['user_identity'] ?? ''));
        $orderCodeParam = trim((string)($_GET['order_code'] ?? ''));

        if (!$isAdmin && $orderCodeParam === '') {
            $lowerUid = strtolower($userIdParam);
            $lowerIdent = strtolower($userIdentityParam);
            if ($userIdParam === '' || $lowerUid === 'guest' || $lowerUid === '0' || $lowerIdent === 'guest') {
                echo json_encode([
                    'success' => true,
                    'orders' => []
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }

        $resolvedIdentity = vlu_normalize_identity($userIdentityParam);
        if ($resolvedIdentity === '' && $userIdParam !== '') {
            if (ctype_digit($userIdParam) && (int)$userIdParam > 0) {
                $matchedUser = vlu_find_real_user($conn, (int)$userIdParam);
                if ($matchedUser) {
                    $resolvedIdentity = vlu_normalize_identity($matchedUser['username'] ?? ($matchedUser['email'] ?? ''));
                }
            } else {
                $resolvedIdentity = vlu_normalize_identity($userIdParam);
            }
        }

        // 1.1. Nếu có kết nối MySQL -> Truy vấn từ MySQL
        if ($conn !== null) {
            try {
                if ($orderCodeParam !== '') {
                    $cleanCodeParam = vlu_normalize_order_key($orderCodeParam);
                    $numCodeId = ctype_digit($cleanCodeParam) ? (int)$cleanCodeParam : 0;
                    $stmt = $conn->prepare("SELECT * FROM orders WHERE UPPER(TRIM(LEADING '#' FROM order_code)) = :clean_code OR (:num_id > 0 AND id = :num_id2) LIMIT 1");
                    $stmt->execute([
                        ':clean_code' => $cleanCodeParam,
                        ':num_id' => $numCodeId,
                        ':num_id2' => $numCodeId
                    ]);
                } elseif ($isAdmin) {
                    $stmt = $conn->query("SELECT * FROM orders ORDER BY id DESC LIMIT 200");
                } else {
                    $stmt = $conn->prepare("SELECT * FROM orders WHERE user_id IS NOT NULL AND user_id != '' AND user_id != '0' AND LOWER(user_id) != 'guest' AND LOWER(COALESCE(user_identity, '')) != 'guest' AND (user_id = :uid OR (:ident1 != '' AND LOWER(user_identity) = LOWER(:ident2))) ORDER BY id DESC LIMIT 100");
                    $stmt->execute([
                        ':uid' => $userIdParam,
                        ':ident1' => $resolvedIdentity,
                        ':ident2' => $resolvedIdentity
                    ]);
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

        foreach ($jsonOrders as $ord) {
            if ($orderCodeParam !== '') {
                if (vlu_order_matches_identifier($ord, $orderCodeParam)) {
                    $matched[] = $ord;
                    break;
                }
                continue;
            }
            if ($isAdmin) {
                $matched[] = $ord;
                continue;
            }
            $oUserRaw = trim((string)($ord['user_id'] ?? ''));
            $oIdentRaw = trim((string)($ord['user_identity'] ?? ''));
            $oUserLower = strtolower($oUserRaw);
            $oIdentNorm = vlu_normalize_identity($oIdentRaw);
            if ($oUserLower === '' || $oUserLower === '0' || $oUserLower === 'guest' || strtolower($oIdentRaw) === 'guest') {
                continue;
            }
            $matchById = ($userIdParam !== '' && $oUserLower === strtolower($userIdParam));
            $matchByIdent = ($resolvedIdentity !== '' && $oIdentNorm === $resolvedIdentity);
            if ($matchById || $matchByIdent) {
                $matched[] = $ord;
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

        $orderCodeRaw = trim((string)($orderPayload['order_code'] ?? ($orderPayload['id'] ?? '')));
        if ($orderCodeRaw === '') {
            $orderCodeRaw = '#VLU-2026-' . random_int(1000, 9999);
        }
        $orderCode = vlu_format_order_code($orderCodeRaw);
        if ($orderCode === '') {
            $orderCode = '#VLU-2026-' . random_int(1000, 9999);
        }
        $orderCodeCleanKey = vlu_normalize_order_key($orderCode);

        $rawUserId = $orderPayload['db_user_id'] ?? ($orderPayload['user_id'] ?? ($_SESSION['vlu_user']['id'] ?? null));
        $rawOrderUserIdField = trim((string)($orderPayload['user_id'] ?? ''));
        $rawIdentity = trim((string)($orderPayload['user_identity'] ?? ($orderPayload['username'] ?? ($_SESSION['vlu_user']['username'] ?? ''))));

        if (($rawOrderUserIdField !== '' && strtolower($rawOrderUserIdField) === 'guest') ||
            strtolower($rawIdentity) === 'guest' ||
            $rawUserId === null ||
            $rawUserId === '' ||
            !is_numeric($rawUserId) ||
            (int)$rawUserId <= 0) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'code' => 'AUTH_REQUIRED',
                'message' => 'Bắt buộc đăng nhập tài khoản hợp lệ trước khi đặt hàng!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $numericUserId = (int)$rawUserId;
        $matchedDbUser = vlu_find_real_user($conn, $numericUserId);
        if (!$matchedDbUser) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'code' => 'USER_NOT_FOUND_IN_SQL',
                'message' => 'Tài khoản đặt hàng không tồn tại trong hệ thống SQL!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $dbUserId = (string)$numericUserId;
        $userIdentity = vlu_normalize_identity($rawIdentity !== '' ? $rawIdentity : ($matchedDbUser['username'] ?? ($matchedDbUser['email'] ?? $dbUserId)));
        if ($userIdentity === '') {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'code' => 'INVALID_USER_IDENTITY',
                'message' => 'Định danh tài khoản đặt hàng không hợp lệ!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $customerName = trim((string)($orderPayload['customer_name'] ?? ''));
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
        $status = vlu_normalize_order_status($orderPayload['status'] ?? 'pending');
        $paymentStatusInit = trim((string)($orderPayload['payment_status'] ?? 'pending'));
        if ($paymentStatusInit === '') {
            $paymentStatusInit = ($status === 'completed') ? 'paid' : 'pending';
        }
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
        $nowSql = date('Y-m-d H:i:s');
        $nowIso = date('c');
        $initialHistory = vlu_append_status_history(
            vlu_decode_json_array($orderPayload['status_history'] ?? []),
            $status,
            $nowIso,
            $customerName,
            'Đơn hàng được khởi tạo',
            '',
            $nowIso
        );

        // Lưu vào MySQL nếu có kết nối
        if ($conn !== null) {
            try {
                $conn->beginTransaction();

                $checkCode = $conn->prepare("SELECT id FROM orders WHERE UPPER(TRIM(LEADING '#' FROM order_code)) = :clean_code LIMIT 1");
                $checkCode->execute([':clean_code' => $orderCodeCleanKey]);
                $existingOrder = $checkCode->fetch(PDO::FETCH_ASSOC);

                if ($existingOrder) {
                    $orderDbId = (int)$existingOrder['id'];
                } else {
                    try {
                        $insertOrder = $conn->prepare("INSERT INTO orders (
                            order_code, user_id, user_identity, customer_name, customer_phone, customer_email,
                            shipping_address, customer_address, delivery_method, shipping_method, store_location, customer_notes,
                            payment_method, payment_key, voucher_code, installment_info, installment_term, installment_monthly,
                            subtotal, discount, total_amount, total, status, payment_status, cancel_reason, status_history, updated_at
                        ) VALUES (
                            :order_code, :user_id, :user_identity, :customer_name, :customer_phone, :customer_email,
                            :shipping_address, :customer_address, :delivery_method, :shipping_method, :store_location, :customer_notes,
                            :payment_method, :payment_key, :voucher_code, :installment_info, :installment_term, :installment_monthly,
                            :subtotal, :discount, :total_amount, :total, :status, :payment_status, :cancel_reason, :status_history, :updated_at
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
                            ':status' => $status,
                            ':payment_status' => $paymentStatusInit,
                            ':cancel_reason' => '',
                            ':status_history' => json_encode($initialHistory, JSON_UNESCAPED_UNICODE),
                            ':updated_at' => $nowSql
                        ]);
                    } catch (PDOException $eCol) {
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
                            ':status' => $status
                        ]);
                    }

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
            'db_id' => $orderDbId ?: (count($jsonOrders) + 1),
            'order_code' => $orderCode,
            'user_id' => $dbUserId,
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
            'status' => $status,
            'payment_status' => $paymentStatusInit,
            'cancel_reason' => '',
            'status_history' => $initialHistory,
            'internal_notes' => [],
            'created_at' => $nowSql,
            'updated_at' => $nowIso,
            'items' => $items
        ];

        // Tránh trùng order_code trong JSON (so sánh bỏ dấu #)
        $existsIndex = -1;
        foreach ($jsonOrders as $idx => $jo) {
            if (vlu_order_matches_identifier($jo, $orderCode)) {
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
        $rawOrderId = trim((string)($jsonData['order_id'] ?? ($jsonData['id'] ?? '')));
        $rawOrderCode = trim((string)($jsonData['order_code'] ?? ''));
        $dbIdParam = isset($jsonData['db_id']) && is_numeric($jsonData['db_id']) ? (int)$jsonData['db_id'] : 0;
        $searchRef = $rawOrderId !== '' ? $rawOrderId : $rawOrderCode;

        $hasStatusInput = isset($jsonData['status']) && trim((string)$jsonData['status']) !== '';
        $newStatus = $hasStatusInput ? vlu_normalize_order_status($jsonData['status']) : '';
        $paymentStatus = isset($jsonData['payment_status']) ? trim((string)$jsonData['payment_status']) : null;
        $cancelReason = isset($jsonData['cancel_reason']) ? trim((string)$jsonData['cancel_reason']) : null;
        $statusHistory = (isset($jsonData['status_history']) && is_array($jsonData['status_history'])) ? $jsonData['status_history'] : null;
        $internalNotes = (isset($jsonData['internal_notes']) && is_array($jsonData['internal_notes'])) ? $jsonData['internal_notes'] : null;
        $actor = trim((string)($jsonData['actor'] ?? 'Quản trị viên VLU'));
        $note = trim((string)($jsonData['note'] ?? ''));

        if ($searchRef === '' && $dbIdParam <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_ORDER_ID',
                'message' => 'Thiếu mã đơn hàng cần cập nhật.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $cleanKey = vlu_normalize_order_key($searchRef !== '' ? $searchRef : $rawOrderCode);
        $altCleanKey = ($rawOrderCode !== '' && vlu_normalize_order_key($rawOrderCode) !== $cleanKey)
            ? vlu_normalize_order_key($rawOrderCode)
            : $cleanKey;
        $numericId = $dbIdParam > 0 ? $dbIdParam : (ctype_digit($cleanKey) ? (int)$cleanKey : 0);
        $nowSql = date('Y-m-d H:i:s');
        $nowIso = date('c');

        $dbUpdated = false;
        $jsonUpdated = false;
        $finalOrderCode = vlu_format_order_code($rawOrderCode !== '' ? $rawOrderCode : $searchRef);
        $finalStatus = $newStatus;
        $finalPaymentStatus = ($paymentStatus !== null) ? $paymentStatus : '';
        $finalCancelReason = ($cancelReason !== null) ? $cancelReason : '';
        $finalStatusHistory = ($statusHistory !== null) ? $statusHistory : [];
        $updatedOrderRecord = null;

        // 2.2.1. Cập nhật chính xác trong MySQL bảng `orders` theo cả id lẫn order_code (bỏ dấu # / ##)
        if ($conn !== null) {
            try {
                $findStmt = $conn->prepare(
                    "SELECT * FROM orders
                     WHERE UPPER(TRIM(LEADING '#' FROM order_code)) = :clean1
                        OR UPPER(TRIM(LEADING '#' FROM order_code)) = :clean2
                        OR (:num_id > 0 AND id = :num_id2)
                     LIMIT 1"
                );
                $findStmt->execute([
                    ':clean1' => $cleanKey,
                    ':clean2' => $altCleanKey,
                    ':num_id' => $numericId,
                    ':num_id2' => $numericId
                ]);
                $dbRow = $findStmt->fetch(PDO::FETCH_ASSOC);

                if ($dbRow) {
                    $matchedDbId = (int)$dbRow['id'];
                    $dbOrderCode = vlu_format_order_code($dbRow['order_code'] ?? $finalOrderCode);
                    if ($dbOrderCode !== '') {
                        $finalOrderCode = $dbOrderCode;
                    }
                    $resolvedStatus = $newStatus !== '' ? $newStatus : vlu_normalize_order_status($dbRow['status'] ?? 'pending');
                    $existingPay = trim((string)($dbRow['payment_status'] ?? ''));
                    if ($paymentStatus !== null && $paymentStatus !== '') {
                        $resolvedPay = $paymentStatus;
                    } elseif ($resolvedStatus === 'completed' && ($existingPay === '' || $existingPay === 'pending')) {
                        $resolvedPay = 'paid';
                    } else {
                        $resolvedPay = $existingPay !== '' ? $existingPay : 'pending';
                    }
                    $resolvedCancelReason = ($cancelReason !== null)
                        ? $cancelReason
                        : (string)($dbRow['cancel_reason'] ?? '');
                    if ($statusHistory !== null) {
                        $resolvedHistory = $statusHistory;
                    } else {
                        $resolvedHistory = vlu_append_status_history(
                            vlu_decode_json_array($dbRow['status_history'] ?? []),
                            $newStatus,
                            $nowIso,
                            $actor,
                            $note,
                            $resolvedCancelReason,
                            (string)($dbRow['created_at'] ?? $nowIso)
                        );
                    }
                    $resolvedNotes = ($internalNotes !== null)
                        ? $internalNotes
                        : vlu_decode_json_array($dbRow['internal_notes'] ?? []);

                    try {
                        $updStmt = $conn->prepare(
                            "UPDATE orders
                             SET status = :status,
                                 payment_status = :payment_status,
                                 cancel_reason = :cancel_reason,
                                 status_history = :status_history,
                                 internal_notes = :internal_notes,
                                 updated_at = :updated_at
                             WHERE id = :id"
                        );
                        $updStmt->execute([
                            ':status' => $resolvedStatus,
                            ':payment_status' => $resolvedPay,
                            ':cancel_reason' => $resolvedCancelReason,
                            ':status_history' => json_encode($resolvedHistory, JSON_UNESCAPED_UNICODE),
                            ':internal_notes' => json_encode($resolvedNotes, JSON_UNESCAPED_UNICODE),
                            ':updated_at' => $nowSql,
                            ':id' => $matchedDbId
                        ]);
                    } catch (PDOException $eColUpd) {
                        $updFallback = $conn->prepare("UPDATE orders SET status = :status, updated_at = :updated_at WHERE id = :id");
                        $updFallback->execute([
                            ':status' => $resolvedStatus,
                            ':updated_at' => $nowSql,
                            ':id' => $matchedDbId
                        ]);
                    }

                    $dbUpdated = true;
                    $finalStatus = $resolvedStatus;
                    $finalPaymentStatus = $resolvedPay;
                    $finalCancelReason = $resolvedCancelReason;
                    $finalStatusHistory = $resolvedHistory;

                    $dbRow['order_code'] = $finalOrderCode;
                    $dbRow['status'] = $resolvedStatus;
                    $dbRow['payment_status'] = $resolvedPay;
                    $dbRow['cancel_reason'] = $resolvedCancelReason;
                    $dbRow['status_history'] = $resolvedHistory;
                    $dbRow['internal_notes'] = $resolvedNotes;
                    $dbRow['updated_at'] = $nowIso;
                    $updatedOrderRecord = vlu_format_order_row($dbRow, []);
                }
            } catch (Throwable $e) {}
        }

        // 2.2.2. Luôn đồng bộ cập nhật trong JSON fallback (backend/data/orders.json)
        $jsonOrders = vlu_read_json_file('orders.json', []);
        foreach ($jsonOrders as &$jo) {
            $isMatch = vlu_order_matches_identifier($jo, $searchRef, $numericId) ||
                ($rawOrderCode !== '' && vlu_order_matches_identifier($jo, $rawOrderCode, $numericId)) ||
                ($finalOrderCode !== '' && vlu_order_matches_identifier($jo, $finalOrderCode, $numericId));

            if ($isMatch) {
                $canonicalCode = vlu_format_order_code($jo['order_code'] ?? ($jo['id'] ?? $finalOrderCode));
                if ($canonicalCode !== '') {
                    $jo['order_code'] = $canonicalCode;
                    $finalOrderCode = $canonicalCode;
                }

                $resolvedStatus = $newStatus !== '' ? $newStatus : vlu_normalize_order_status($jo['status'] ?? 'pending');
                $jo['status'] = $resolvedStatus;

                $existingPay = trim((string)($jo['payment_status'] ?? ''));
                if ($paymentStatus !== null && $paymentStatus !== '') {
                    $jo['payment_status'] = $paymentStatus;
                } elseif ($resolvedStatus === 'completed' && ($existingPay === '' || $existingPay === 'pending')) {
                    $jo['payment_status'] = 'paid';
                } elseif ($existingPay === '') {
                    $jo['payment_status'] = 'pending';
                }

                if ($cancelReason !== null) {
                    $jo['cancel_reason'] = $cancelReason;
                } elseif (!isset($jo['cancel_reason'])) {
                    $jo['cancel_reason'] = '';
                }

                if ($statusHistory !== null) {
                    $jo['status_history'] = $statusHistory;
                } else {
                    $jo['status_history'] = vlu_append_status_history(
                        vlu_decode_json_array($jo['status_history'] ?? []),
                        $newStatus,
                        $nowIso,
                        $actor,
                        $note,
                        (string)($jo['cancel_reason'] ?? ''),
                        (string)($jo['created_at'] ?? $nowIso)
                    );
                }

                if ($internalNotes !== null) {
                    $jo['internal_notes'] = $internalNotes;
                } elseif (!isset($jo['internal_notes'])) {
                    $jo['internal_notes'] = [];
                }

                $jo['updated_at'] = $nowIso;
                $jsonUpdated = true;

                $finalStatus = $jo['status'];
                $finalPaymentStatus = (string)$jo['payment_status'];
                $finalCancelReason = (string)$jo['cancel_reason'];
                $finalStatusHistory = $jo['status_history'];
                $updatedOrderRecord = vlu_format_order_row($jo, isset($jo['items']) && is_array($jo['items']) ? $jo['items'] : []);
                break;
            }
        }
        unset($jo);
        if ($jsonUpdated) {
            vlu_write_json_file('orders.json', $jsonOrders);
        }

        echo json_encode([
            'success' => true,
            'code' => 'STATUS_UPDATED',
            'updated' => $dbUpdated || $jsonUpdated,
            'order_code' => $finalOrderCode,
            'status' => $finalStatus,
            'payment_status' => $finalPaymentStatus,
            'cancel_reason' => $finalCancelReason,
            'status_history' => $finalStatusHistory,
            'updated_at' => $nowIso,
            'order' => $updatedOrderRecord,
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

        $cleanDeleteKey = vlu_normalize_order_key($orderCode);
        $deleteNumericId = ctype_digit($cleanDeleteKey) ? (int)$cleanDeleteKey : 0;

        $jsonOrders = vlu_read_json_file('orders.json', []);
        foreach ($jsonOrders as $jo) {
            if (vlu_order_matches_identifier($jo, $orderCode, $deleteNumericId)) {
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
                $delDetails = $conn->prepare("DELETE FROM order_details WHERE UPPER(TRIM(LEADING '#' FROM order_code)) = :clean_code OR (:id > 0 AND order_id = :id2)");
                $delDetails->execute([
                    ':clean_code' => $cleanDeleteKey,
                    ':id' => $deleteNumericId,
                    ':id2' => $deleteNumericId
                ]);

                $delOrder = $conn->prepare("DELETE FROM orders WHERE UPPER(TRIM(LEADING '#' FROM order_code)) = :clean_code OR (:id > 0 AND id = :id2)");
                $delOrder->execute([
                    ':clean_code' => $cleanDeleteKey,
                    ':id' => $deleteNumericId,
                    ':id2' => $deleteNumericId
                ]);
                $conn->commit();
            } catch (Throwable $e) {
                if ($conn->inTransaction()) {
                    $conn->rollBack();
                }
            }
        }

        // Xóa trong JSON fallback nếu không có giao dịch
        $jsonOrders = array_values(array_filter($jsonOrders, function ($jo) use ($orderCode, $deleteNumericId) {
            return !vlu_order_matches_identifier($jo, $orderCode, $deleteNumericId);
        }));
        vlu_write_json_file('orders.json', $jsonOrders);

        echo json_encode([
            'success' => true,
            'code' => 'ORDER_DELETED',
            'order_code' => vlu_format_order_code($orderCode),
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
