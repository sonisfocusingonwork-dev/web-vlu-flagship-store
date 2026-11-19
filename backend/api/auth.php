<?php
/**
 * VLU FLAGSHIP STORE – Authentication API Endpoint (backend/api/auth.php)
 * - Xử lý đăng nhập / đăng ký chuẩn CSDL MySQL (bảng users) và chống SQL Injection với PDO Prepared Statements.
 * - Hỗ trợ JSON storage fallback (backend/data/users.json) khi CSDL MySQL chưa bật.
 * - Phân quyền role chuẩn (1 = Admin, 0 = User/Guest).
 * - Tự động phát hiện và nâng cấp mật khẩu plaintext cũ lên bcrypt hash chuẩn an toàn.
 * - Kiểm tra dữ liệu đầu vào chặt chẽ (Validation regex SĐT 10 số, Họ tên, Email, Mật khẩu).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

require_once dirname(__DIR__) . '/config/db.php';

// Khởi tạo session PHP nếu cần
if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

$response = [
    'success' => false,
    'code' => 'BAD_REQUEST',
    'message' => 'Yêu cầu không hợp lệ.'
];

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
        parse_str($_SERVER['QUERY_STRING'], $_GET);
    }
    $action = $_GET['action'] ?? 'status';

    if ($action === 'status') {
        echo json_encode([
            'success' => true,
            'db_connected' => ($conn !== null),
            'storage_mode' => ($conn !== null) ? 'mysql' : 'json_fallback',
            'message' => $conn ? 'CSDL MySQL kết nối thành công.' : 'Đang sử dụng hệ thống lưu trữ JSON server-side fallback.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'users') {
        $jsonUsers = vlu_read_json_file('users.json', []);
        $jsonByKey = [];
        foreach ($jsonUsers as $ju) {
            $uKey = strtolower((string)($ju['username'] ?? ''));
            $eKey = strtolower((string)($ju['email'] ?? ''));
            if ($uKey !== '') $jsonByKey['u:' . $uKey] = $ju;
            if ($eKey !== '') $jsonByKey['e:' . $eKey] = $ju;
        }

        if ($conn !== null) {
            try {
                $stmt = $conn->query("SELECT id, username, email, fullname, phone, role, created_at FROM users ORDER BY id DESC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $sanitizedRows = [];
                foreach ($rows as $r) {
                    $uKey = strtolower((string)($r['username'] ?? ''));
                    $eKey = strtolower((string)($r['email'] ?? ''));
                    $meta = $jsonByKey['u:' . $uKey] ?? ($jsonByKey['e:' . $eKey] ?? []);
                    $isRoot = ((int)($r['id'] ?? 0) === 1 || $uKey === 'admin' || $eKey === 'admin@vluflagship.vn');
                    $isLocked = !$isRoot && ((($meta['status'] ?? 'active') === 'locked') || !empty($meta['is_locked']));
                    $sanitizedRows[] = [
                        'id' => (int)($r['id'] ?? 0),
                        'username' => (string)($r['username'] ?? ''),
                        'email' => (string)($r['email'] ?? ''),
                        'fullname' => (string)($r['fullname'] ?? ''),
                        'phone' => (string)($r['phone'] ?? ''),
                        'role' => ($isRoot || (int)($r['role'] ?? 0) === 1 || strtolower((string)($r['role'] ?? '')) === 'admin') ? 1 : 0,
                        'status' => $isLocked ? 'locked' : 'active',
                        'is_locked' => $isLocked,
                        'lock_reason' => $isLocked ? (string)($meta['lock_reason'] ?? '') : '',
                        'locked_at' => $isLocked ? (string)($meta['locked_at'] ?? '') : '',
                        'created_at' => (string)($r['created_at'] ?? ''),
                        'updated_at' => (string)($meta['updated_at'] ?? '')
                    ];
                }
                echo json_encode([
                    'success' => true,
                    'users' => $sanitizedRows
                ], JSON_UNESCAPED_UNICODE);
                exit;
            } catch (PDOException $e) {
                // Tiếp tục thử fallback JSON
            }
        }

        // Fallback đọc từ JSON (tuyệt đối không trả password / password_hash)
        $cleanUsers = [];
        foreach ($jsonUsers as $u) {
            $uKey = strtolower((string)($u['username'] ?? ''));
            $eKey = strtolower((string)($u['email'] ?? ''));
            $isRoot = ((int)($u['id'] ?? 0) === 1 || $uKey === 'admin' || $eKey === 'admin@vluflagship.vn');
            $isLocked = !$isRoot && ((($u['status'] ?? 'active') === 'locked') || !empty($u['is_locked']));
            $cleanUsers[] = [
                'id' => (int)($u['id'] ?? 0),
                'username' => (string)($u['username'] ?? ''),
                'email' => (string)($u['email'] ?? ''),
                'fullname' => (string)($u['fullname'] ?? ''),
                'phone' => (string)($u['phone'] ?? ''),
                'role' => ($isRoot || (int)($u['role'] ?? 0) === 1 || $uKey === 'admin') ? 1 : 0,
                'status' => $isLocked ? 'locked' : 'active',
                'is_locked' => $isLocked,
                'lock_reason' => $isLocked ? (string)($u['lock_reason'] ?? '') : '',
                'locked_at' => $isLocked ? (string)($u['locked_at'] ?? '') : '',
                'created_at' => (string)($u['created_at'] ?? ''),
                'updated_at' => (string)($u['updated_at'] ?? '')
            ];
        }
        echo json_encode([
            'success' => true,
            'users' => $cleanUsers
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if ($method === 'POST') {
    // Đọc payload từ form-data hoặc JSON raw (hỗ trợ cả CLI stdin)
    $rawInput = file_get_contents('php://input');
    if (($rawInput === '' || $rawInput === false) && PHP_SAPI === 'cli') {
        $rawInput = file_get_contents('php://stdin');
    }
    $jsonData = json_decode((string)$rawInput, true);
    if (!is_array($jsonData)) {
        $jsonData = [];
    }

    $action = $_POST['action'] ?? ($jsonData['action'] ?? 'login');
    $identifier = trim((string)($_POST['username'] ?? ($jsonData['username'] ?? '')));
    $password = (string)($_POST['password'] ?? ($jsonData['password'] ?? ''));

    // =========================================================================
    // 1. ACTION: LOGIN (Xác thực đăng nhập đối chiếu CSDL)
    // =========================================================================
    if ($action === 'login') {
        if ($identifier === '' || $password === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'EMPTY_CREDENTIALS',
                'message' => 'Vui lòng nhập đầy đủ Email/Tên đăng nhập và Mật khẩu!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (strtolower($identifier) === 'guest' || strtolower($identifier) === 'guest@vluflagship.vn') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'code' => 'GUEST_LOGIN_FORBIDDEN',
                'message' => 'Không hỗ trợ đăng nhập tài khoản Guest. Vui lòng đăng nhập hoặc đăng ký tài khoản chính thức!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $user = null;

        // 1.1. Tìm trong MySQL nếu có kết nối
        if ($conn !== null) {
            try {
                $stmt = $conn->prepare("SELECT id, username, password, email, fullname, phone, role FROM users WHERE LOWER(username) = LOWER(:id1) OR LOWER(email) = LOWER(:id2) LIMIT 1");
                $stmt->execute([
                    ':id1' => $identifier,
                    ':id2' => $identifier
                ]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                $user = null;
            }
        }

        // 1.2. Fallback tìm trong file JSON nếu MySQL không có hoặc ngoại tuyến
        if (!$user) {
            $jsonUsers = vlu_read_json_file('users.json', []);
            $cleanId = strtolower($identifier);
            foreach ($jsonUsers as $ju) {
                $uName = strtolower((string)($ju['username'] ?? ''));
                $uEmail = strtolower((string)($ju['email'] ?? ''));
                if ($uName === $cleanId || $uEmail === $cleanId) {
                    $user = $ju;
                    break;
                }
            }
        }

        // 1.3. Nếu tài khoản chưa tồn tại -> Báo lỗi đỏ và chặn đăng nhập
        if (!$user) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'code' => 'USER_NOT_FOUND',
                'message' => 'Tài khoản không tồn tại, vui lòng đăng ký!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 1.4. Kiểm tra mật khẩu (hỗ trợ hash bcrypt chuẩn và auto-upgrade nếu là plaintext)
        $dbHash = (string)($user['password'] ?? '');
        $isPasswordValid = false;

        if (password_verify($password, $dbHash)) {
            $isPasswordValid = true;
        } elseif ($password === $dbHash) {
            // Mật khẩu lưu dạng plaintext cũ -> Tự động mã hóa và nâng cấp lên bcrypt hash an toàn
            $isPasswordValid = true;
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            if ($conn !== null && isset($user['id'])) {
                try {
                    $upStmt = $conn->prepare("UPDATE users SET password = :pw WHERE id = :id");
                    $upStmt->execute([':pw' => $newHash, ':id' => $user['id']]);
                } catch (Throwable $e) {}
            }
            // Đồng bộ nâng cấp trong JSON fallback
            $jsonUsers = vlu_read_json_file('users.json', []);
            foreach ($jsonUsers as &$ju) {
                if (($ju['id'] ?? 0) == ($user['id'] ?? 0) || strtolower((string)($ju['username'] ?? '')) === strtolower((string)$user['username'])) {
                    $ju['password'] = $newHash;
                    break;
                }
            }
            unset($ju);
            vlu_write_json_file('users.json', $jsonUsers);
        }

        // 1.5. Nếu sai mật khẩu -> Báo lỗi đỏ và chặn đăng nhập
        if (!$isPasswordValid) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'code' => 'WRONG_PASSWORD',
                'message' => 'Mật khẩu không chính xác!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 1.6. Xác định vai trò Admin (role = 1) hoặc User thường (role = 0) & kiểm tra khóa tài khoản
        $roleRaw = strtolower(trim((string)($user['role'] ?? '0')));
        $uNameRaw = strtolower(trim((string)($user['username'] ?? '')));
        $uEmailRaw = strtolower(trim((string)($user['email'] ?? '')));
        $isRootAdmin = ((int)($user['id'] ?? 0) === 1 || $uNameRaw === 'admin' || $uEmailRaw === 'admin@vluflagship.vn');
        $isAdmin = ($isRootAdmin || $roleRaw === '1' || $roleRaw === 'admin');
        $finalRole = $isAdmin ? 1 : 0;

        // Đối chiếu trạng thái khóa trong users.json (đảm bảo đồng bộ khi chỉ bật JSON fallback)
        $isLocked = (($user['status'] ?? 'active') === 'locked') || !empty($user['is_locked']);
        if (!$isLocked) {
            $jsonUsers = vlu_read_json_file('users.json', []);
            foreach ($jsonUsers as $ju) {
                $juName = strtolower((string)($ju['username'] ?? ''));
                $juEmail = strtolower((string)($ju['email'] ?? ''));
                if (($uNameRaw !== '' && $juName === $uNameRaw) || ($uEmailRaw !== '' && $juEmail === $uEmailRaw)) {
                    if ((($ju['status'] ?? 'active') === 'locked') || !empty($ju['is_locked'])) {
                        $isLocked = true;
                    }
                    break;
                }
            }
        }
        if ($isLocked && !$isRootAdmin) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'code' => 'ACCOUNT_LOCKED',
                'message' => 'Tài khoản của bạn đang tạm khóa, vui lòng liên hệ CSKH VLU Flagship Store.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $sessionUser = [
            'id' => (int)($user['id'] ?? 1),
            'username' => (string)$user['username'],
            'email' => (string)($user['email'] ?? ''),
            'fullname' => (string)($user['fullname'] ?: $user['username']),
            'phone' => (string)($user['phone'] ?? ''),
            'role' => $finalRole,
            'status' => 'active'
        ];
        $_SESSION['vlu_user'] = $sessionUser;

        echo json_encode([
            'success' => true,
            'code' => 'LOGIN_SUCCESS',
            'message' => 'Đăng nhập thành công! Chào mừng ' . $sessionUser['fullname'] . ($isAdmin ? ' (Quản trị viên)' : '') . '.',
            'user' => $sessionUser
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // =========================================================================
    // 2. ACTION: REGISTER (Đăng ký tài khoản mới & Validation)
    // =========================================================================
    if ($action === 'register') {
        $fullname = trim((string)($_POST['fullname'] ?? ($jsonData['fullname'] ?? '')));
        $phone = trim((string)($_POST['phone'] ?? ($jsonData['phone'] ?? '')));
        $email = trim((string)($_POST['email'] ?? ($jsonData['email'] ?? '')));
        $usernameInput = trim((string)($_POST['username'] ?? ($jsonData['username'] ?? '')));
        $regUsername = $usernameInput !== '' ? $usernameInput : $email;
        $regPassword = (string)($_POST['password'] ?? ($jsonData['password'] ?? ''));

        // 2.1. Validate Họ và tên (tối thiểu 2 ký tự, không rỗng, không chứa ký tự đặc biệt nguy hiểm)
        if (mb_strlen($fullname) < 2 || preg_match('/[<>"\'`;=\\\\]/u', $fullname) || str_contains($fullname, '/')) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'INVALID_FULLNAME',
                'message' => 'Họ và tên không hợp lệ! Vui lòng nhập tối thiểu 2 ký tự và không chứa ký tự đặc biệt nguy hiểm.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 2.2. Validate Số điện thoại (10 chữ số chuẩn mạng di động Việt Nam)
        if (!preg_match('/^(0[3|5|7|8|9])+([0-9]{8})$/', $phone)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'INVALID_PHONE',
                'message' => 'Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động tại Việt Nam (ví dụ: 0912345678).'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 2.3. Validate Email & chặn định danh guest
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) ||
            strtolower($email) === 'guest@vluflagship.vn' ||
            strtolower($regUsername) === 'guest') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'INVALID_EMAIL',
                'message' => 'Địa chỉ Email hoặc Tên đăng nhập không hợp lệ!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 2.4. Validate Mật khẩu (tối thiểu 6 ký tự)
        if (strlen($regPassword) < 6) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'INVALID_PASSWORD',
                'message' => 'Mật khẩu phải chứa ít nhất 6 ký tự để đảm bảo an toàn!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 2.5. Kiểm tra email hoặc username đã tồn tại chưa
        $userExists = false;

        if ($conn !== null) {
            try {
                $checkStmt = $conn->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(:email) OR LOWER(username) = LOWER(:username) LIMIT 1");
                $checkStmt->execute([
                    ':email' => $email,
                    ':username' => $regUsername
                ]);
                if ($checkStmt->fetch()) {
                    $userExists = true;
                }
            } catch (Throwable $e) {}
        }

        if (!$userExists) {
            $jsonUsers = vlu_read_json_file('users.json', []);
            $cEmail = strtolower($email);
            $cUser = strtolower($regUsername);
            foreach ($jsonUsers as $ju) {
                if (strtolower((string)($ju['email'] ?? '')) === $cEmail || strtolower((string)($ju['username'] ?? '')) === $cUser) {
                    $userExists = true;
                    break;
                }
            }
        }

        if ($userExists) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'code' => 'USER_EXISTS',
                'message' => 'Email hoặc Tên đăng nhập này đã được đăng ký trên hệ thống!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 2.6. Mã hóa mật khẩu an toàn với bcrypt
        $hashedPassword = password_hash($regPassword, PASSWORD_DEFAULT);
        $role = 0; // Tài khoản đăng ký mới luôn là 0 (User/Guest)

        $newId = null;

        if ($conn !== null) {
            try {
                $insertStmt = $conn->prepare("INSERT INTO users (username, password, email, fullname, phone, role) VALUES (:username, :password, :email, :fullname, :phone, :role)");
                $insertStmt->execute([
                    ':username' => $regUsername,
                    ':password' => $hashedPassword,
                    ':email' => $email,
                    ':fullname' => $fullname,
                    ':phone' => $phone,
                    ':role' => $role
                ]);
                $newId = (int)$conn->lastInsertId();
            } catch (Throwable $e) {
                $newId = null;
            }
        }

        // Luôn lưu bản sao vào JSON fallback để dự phòng
        $jsonUsers = vlu_read_json_file('users.json', []);
        if ($newId === null || $newId <= 0) {
            $maxId = 0;
            foreach ($jsonUsers as $ju) {
                if (isset($ju['id']) && (int)$ju['id'] > $maxId) {
                    $maxId = (int)$ju['id'];
                }
            }
            $newId = $maxId + 1;
        }

        $jsonUsers[] = [
            'id' => $newId,
            'username' => $regUsername,
            'password' => $hashedPassword,
            'email' => $email,
            'fullname' => $fullname,
            'phone' => $phone,
            'role' => $role,
            'created_at' => date('Y-m-d H:i:s')
        ];
        vlu_write_json_file('users.json', $jsonUsers);

        $newUser = [
            'id' => $newId,
            'username' => $regUsername,
            'email' => $email,
            'fullname' => $fullname,
            'phone' => $phone,
            'role' => 0
        ];
        $_SESSION['vlu_user'] = $newUser;

        echo json_encode([
            'success' => true,
            'code' => 'REGISTER_SUCCESS',
            'message' => 'Đăng ký tài khoản thành công! Chào mừng ' . $fullname . '.',
            'user' => $newUser
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // =========================================================================
    // 3. ACTION: ADMIN_UPDATE_USER (Sửa thông tin, Khóa/Mở khóa & Phân quyền)
    // =========================================================================
    if ($action === 'admin_update_user') {
        $targetId = (string)($jsonData['id'] ?? '');
        $targetUsername = strtolower(trim((string)($jsonData['username'] ?? '')));
        $nextFullname = isset($jsonData['fullname']) ? trim((string)$jsonData['fullname']) : null;
        $nextEmail = isset($jsonData['email']) ? trim((string)$jsonData['email']) : null;
        $nextPhone = isset($jsonData['phone']) ? trim((string)$jsonData['phone']) : null;
        $nextRole = isset($jsonData['role']) ? (int)$jsonData['role'] : null;
        $nextStatus = isset($jsonData['status']) ? strtolower(trim((string)$jsonData['status'])) : null;
        $lockReason = isset($jsonData['lock_reason']) ? trim((string)$jsonData['lock_reason']) : '';

        if ($targetId === '' && $targetUsername === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_USER',
                'message' => 'Thiếu thông tin định danh tài khoản.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $jsonUsers = vlu_read_json_file('users.json', []);
        $foundIdx = -1;
        foreach ($jsonUsers as $idx => $ju) {
            if (($targetId !== '' && (string)($ju['id'] ?? '') === $targetId) ||
                ($targetUsername !== '' && strtolower((string)($ju['username'] ?? '')) === $targetUsername)) {
                $foundIdx = $idx;
                break;
            }
        }

        $isTargetRoot = ($targetId === '1' || $targetUsername === 'admin' || $targetUsername === 'admin@vluflagship.vn');
        if ($foundIdx >= 0) {
            $cur = $jsonUsers[$foundIdx];
            if ((int)($cur['id'] ?? 0) === 1 ||
                strtolower((string)($cur['username'] ?? '')) === 'admin' ||
                strtolower((string)($cur['email'] ?? '')) === 'admin@vluflagship.vn') {
                $isTargetRoot = true;
            }
        }

        // Bảo vệ tài khoản Quản trị viên gốc
        if ($isTargetRoot && (($nextStatus === 'locked') || ($nextRole !== null && $nextRole !== 1))) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'code' => 'ROOT_ADMIN_PROTECTED',
                'message' => 'Không được phép khóa hoặc hạ quyền tài khoản Quản trị viên gốc.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($conn !== null) {
            try {
                $fields = [];
                $params = [];
                if ($nextFullname !== null && $nextFullname !== '') { $fields[] = 'fullname = :fullname'; $params[':fullname'] = $nextFullname; }
                if ($nextEmail !== null && $nextEmail !== '') { $fields[] = 'email = :email'; $params[':email'] = $nextEmail; }
                if ($nextPhone !== null) { $fields[] = 'phone = :phone'; $params[':phone'] = $nextPhone; }
                if ($nextRole !== null && !$isTargetRoot) { $fields[] = 'role = :role'; $params[':role'] = ($nextRole === 1 ? 1 : 0); }
                if (!empty($fields)) {
                    $where = ($targetId !== '' && ctype_digit($targetId)) ? 'id = :tid' : 'LOWER(username) = LOWER(:tname)';
                    if ($where === 'id = :tid') $params[':tid'] = (int)$targetId;
                    else $params[':tname'] = $targetUsername;
                    $stmtUp = $conn->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE " . $where);
                    $stmtUp->execute($params);
                }
            } catch (Throwable $e) {}
        }

        if ($foundIdx >= 0) {
            if ($nextFullname !== null && $nextFullname !== '') $jsonUsers[$foundIdx]['fullname'] = $nextFullname;
            if ($nextEmail !== null && $nextEmail !== '') $jsonUsers[$foundIdx]['email'] = $nextEmail;
            if ($nextPhone !== null) $jsonUsers[$foundIdx]['phone'] = $nextPhone;
            if ($nextRole !== null && !$isTargetRoot) $jsonUsers[$foundIdx]['role'] = ($nextRole === 1 ? 1 : 0);
            if ($nextStatus === 'locked' || $nextStatus === 'active') {
                $jsonUsers[$foundIdx]['status'] = $nextStatus;
                $jsonUsers[$foundIdx]['is_locked'] = ($nextStatus === 'locked');
                $jsonUsers[$foundIdx]['lock_reason'] = ($nextStatus === 'locked') ? $lockReason : '';
                $jsonUsers[$foundIdx]['locked_at'] = ($nextStatus === 'locked') ? date('Y-m-d H:i:s') : '';
            }
            $jsonUsers[$foundIdx]['updated_at'] = date('Y-m-d H:i:s');
            vlu_write_json_file('users.json', $jsonUsers);
            $updated = $jsonUsers[$foundIdx];
            unset($updated['password'], $updated['password_hash']);
            echo json_encode([
                'success' => true,
                'code' => 'USER_UPDATED',
                'user' => $updated,
                'message' => 'Đã cập nhật tài khoản thành công.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        echo json_encode([
            'success' => true,
            'code' => 'USER_SYNCED',
            'message' => 'Đã ghi nhận đồng bộ tài khoản.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

http_response_code(400);
echo json_encode($response, JSON_UNESCAPED_UNICODE);
