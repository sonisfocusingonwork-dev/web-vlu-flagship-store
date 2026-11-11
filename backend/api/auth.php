<?php
/**
 * VLU FLAGSHIP STORE – Authentication API Endpoint
 * Xử lý đăng nhập / đăng ký chuẩn CSDL MySQL (bảng users) và chống SQL Injection với PDO Prepared Statements.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

require_once dirname(__DIR__) . '/config/db.php';

// Khởi tạo session PHP nếu cần
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$response = [
    'success' => false,
    'code' => 'BAD_REQUEST',
    'message' => 'Yêu cầu không hợp lệ.'
];

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'status';
    if ($action === 'status') {
        echo json_encode([
            'success' => true,
            'db_connected' => ($conn !== null),
            'message' => $conn ? 'CSDL kết nối thành công.' : 'CSDL chưa kết nối.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($action === 'users') {
        if ($conn === null) {
            echo json_encode([
                'success' => false,
                'code' => 'DB_CONNECTION_ERROR',
                'users' => []
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        try {
            $stmt = $conn->query("SELECT id, username, email, fullname, phone, role, created_at FROM users ORDER BY id DESC");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'success' => true,
                'users' => $rows
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'code' => 'SQL_ERROR',
                'users' => [],
                'message' => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}

if ($method === 'POST') {
    // Đọc payload từ form-data hoặc JSON raw
    $rawInput = file_get_contents('php://input');
    $jsonData = json_decode((string)$rawInput, true);

    $action = $_POST['action'] ?? ($jsonData['action'] ?? 'login');
    $identifier = trim((string)($_POST['username'] ?? ($jsonData['username'] ?? '')));
    $password = (string)($_POST['password'] ?? ($jsonData['password'] ?? ''));

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

        if ($conn === null) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'DB_CONNECTION_ERROR',
                'message' => 'Không thể kết nối CSDL MySQL.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        try {
            // Đối chiếu trực tiếp với bảng users (chống SQL Injection)
            $stmt = $conn->prepare("SELECT id, username, password, email, fullname, phone, role FROM users WHERE LOWER(username) = LOWER(:id1) OR LOWER(email) = LOWER(:id2) LIMIT 1");
            $stmt->execute([
                ':id1' => $identifier,
                ':id2' => $identifier
            ]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                // Tài khoản không tồn tại trong MySQL
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'code' => 'USER_NOT_FOUND',
                    'message' => 'Tài khoản không tồn tại, vui lòng đăng ký!'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            // Kiểm tra mật khẩu (hỗ trợ hash bcrypt chuẩn và fallback demo plain text)
            $dbHash = (string)$user['password'];
            $isPasswordValid = password_verify($password, $dbHash) || ($password === $dbHash);

            if (!$isPasswordValid) {
                // Tồn tại nhưng sai mật khẩu
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'code' => 'WRONG_PASSWORD',
                    'message' => 'Mật khẩu không chính xác!'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            // Đăng nhập thành công -> Lưu session PHP
            $roleText = strtolower(trim((string)$user['role']));
            $isAdmin = ($roleText === 'admin' || $roleText === '1' || strtolower((string)$user['username']) === 'admin');
            $sessionUser = [
                'id' => (int)$user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'fullname' => $user['fullname'] ?: $user['username'],
                'phone' => $user['phone'] ?? '',
                'role' => $isAdmin ? 1 : 0
            ];
            $_SESSION['vlu_user'] = $sessionUser;

            echo json_encode([
                'success' => true,
                'code' => 'LOGIN_SUCCESS',
                'message' => 'Đăng nhập thành công! Chào mừng ' . $sessionUser['fullname'] . ($isAdmin ? ' (Quản trị viên)' : '') . '.',
                'user' => $sessionUser
            ], JSON_UNESCAPED_UNICODE);
            exit;

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'SQL_ERROR',
                'message' => 'Lỗi truy vấn CSDL: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    if ($action === 'register') {
        $fullname = trim((string)($_POST['fullname'] ?? ($jsonData['fullname'] ?? '')));
        $phone = trim((string)($_POST['phone'] ?? ($jsonData['phone'] ?? '')));
        $email = trim((string)($_POST['email'] ?? ($jsonData['email'] ?? '')));
        $usernameInput = trim((string)($_POST['username'] ?? ($jsonData['username'] ?? '')));
        $regUsername = $usernameInput !== '' ? $usernameInput : $email;
        $regPassword = (string)($_POST['password'] ?? ($jsonData['password'] ?? ''));

        if ($email === '' || $regPassword === '' || $fullname === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'MISSING_FIELDS',
                'message' => 'Vui lòng điền đầy đủ các thông tin đăng ký!'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($conn === null) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'DB_CONNECTION_ERROR',
                'message' => 'Không thể kết nối CSDL MySQL.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        try {
            // Kiểm tra email hoặc username đã tồn tại chưa
            $checkStmt = $conn->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(:email) OR LOWER(username) = LOWER(:username) LIMIT 1");
            $checkStmt->execute([
                ':email' => $email,
                ':username' => $regUsername
            ]);
            if ($checkStmt->fetch()) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'code' => 'USER_EXISTS',
                    'message' => 'Email/Tài khoản này đã được đăng ký trên hệ thống!'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $hashedPassword = password_hash($regPassword, PASSWORD_DEFAULT);
            $role = (strtolower($email) === 'admin@vlu.edu.vn') ? 'admin' : 'customer';

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
            $isAdmin = ($role === 'admin');

            $newUser = [
                'id' => $newId,
                'username' => $regUsername,
                'email' => $email,
                'fullname' => $fullname,
                'phone' => $phone,
                'role' => $isAdmin ? 1 : 0
            ];
            $_SESSION['vlu_user'] = $newUser;

            echo json_encode([
                'success' => true,
                'code' => 'REGISTER_SUCCESS',
                'message' => 'Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.',
                'user' => $newUser
            ], JSON_UNESCAPED_UNICODE);
            exit;

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'code' => 'SQL_ERROR',
                'message' => 'Lỗi lưu thông tin: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}

http_response_code(400);
echo json_encode($response, JSON_UNESCAPED_UNICODE);
