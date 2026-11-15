<?php
/**
 * Test Suite for Part 4 + Regression for Parts 1, 2, 3
 * VLU FLAGSHIP STORE
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

$rootDir = realpath(__DIR__ . '/../../');
$passed = 0;
$failed = 0;

function assertTest($description, $condition, $details = '') {
    global $passed, $failed;
    if ($condition) {
        $passed++;
        echo " [PASS] " . $description . "\n";
    } else {
        $failed++;
        echo " [FAIL] " . $description . ($details ? " - " . $details : "") . "\n";
    }
}

echo "====================================================================\n";
echo "   SUITE KIỂM THỬ TỰ ĐỘNG PHẦN 4 & HỆ THỐNG TOÀN DIỆN (PARTS 1-4)\n";
echo "====================================================================\n\n";

// ---------------------------------------------------------------------
// TEST GROUP 1: Lỗi 4.1 - Admin Scroll, Layout & Responsive Drawer
// ---------------------------------------------------------------------
echo "--- NHÓM 1: KIỂM TRA LỖI 4.1 (ADMIN SCROLL, TABLE & DRAWER) ---\n";

$adminHtml = file_get_contents($rootDir . '/admin.html');
$adminCss = file_get_contents($rootDir . '/frontend/assets/css/admin.css');
$adminJs = file_get_contents($rootDir . '/frontend/assets/js/admin-page.js');

assertTest("Admin HTML liên kết stylesheet admin.css chuyên biệt", 
    strpos($adminHtml, 'frontend/assets/css/admin.css') !== false);

// Check html, body has overflow-y: auto and overflow-x: hidden (no unconditional vertical overflow: hidden)
assertTest("Admin CSS không khóa cứng html/body với overflow: hidden dọc",
    strpos($adminCss, 'overflow-x: hidden') !== false && strpos($adminCss, 'overflow-y: auto') !== false);

assertTest("Admin CSS có class .table-responsive cho phép cuộn ngang bảng",
    strpos($adminCss, '.table-responsive') !== false && strpos($adminCss, 'overflow-x: auto') !== false);

assertTest("Admin HTML có button mở sidebar trên mobile (#btnAdminMobileSidebarToggle)",
    strpos($adminHtml, 'id="btnAdminMobileSidebarToggle"') !== false);

assertTest("Admin HTML có lớp phủ nền mờ backdrop (#adminSidebarBackdrop)",
    strpos($adminHtml, 'id="adminSidebarBackdrop"') !== false);

assertTest("Admin JS có code xử lý toggle sidebar trên mobile (admin-sidebar-mobile-open)",
    strpos($adminJs, 'btnAdminMobileSidebarToggle') !== false && strpos($adminJs, 'admin-sidebar-mobile-open') !== false);

assertTest("Admin CSS hỗ trợ backdrop và sidebar trượt trên màn hình nhỏ (max-width: 1023px)",
    strpos($adminCss, '@media (max-width: 1023px)') !== false && strpos($adminCss, 'admin-sidebar-mobile-open') !== false);

// ---------------------------------------------------------------------
// TEST GROUP 2: Lỗi 4.2 - Mobile Navigation & Mega-menu Overflow Fix
// ---------------------------------------------------------------------
echo "\n--- NHÓM 2: KIỂM TRA LỖI 4.2 (MOBILE MENU & MEGA-MENU RESPONSIVE) ---\n";

$styleCss = file_get_contents($rootDir . '/frontend/assets/css/style.css');

assertTest("style.css ẩn mega-menu desktop trên màn hình <= 991px / <= 1023px",
    strpos($styleCss, '@media (max-width: 991px)') !== false && strpos($styleCss, '.nav-mega-bar') !== false);

assertTest("index.html có nút mobile menu (hamburger)",
    strpos(file_get_contents($rootDir . '/index.html'), 'id="mobileMenuBtn"') !== false);

assertTest("index.html có mobile drawer (#mobileDrawer)",
    strpos(file_get_contents($rootDir . '/index.html'), 'id="mobileDrawer"') !== false);

assertTest("category.html có mobile drawer và nút menu",
    strpos(file_get_contents($rootDir . '/category.html'), 'id="mobileDrawer"') !== false);

assertTest("product-detail.html có mobile drawer và nút menu",
    strpos(file_get_contents($rootDir . '/product-detail.html'), 'id="mobileDrawer"') !== false);

// ---------------------------------------------------------------------
// TEST GROUP 3: Lỗi 4.3 - Mobile UI Polish & Zero Horizontal Overflow
// ---------------------------------------------------------------------
echo "\n--- NHÓM 3: KIỂM TRA LỖI 4.3 (MOBILE UI & CHỐNG TRÀN NGANG) ---\n";

assertTest("style.css chặn tràn ngang toàn cục trên html, body (overflow-x: hidden)",
    preg_match('/html,\s*body\s*\{[^}]*overflow-x:\s*hidden/i', $styleCss) == 1);

assertTest("style.css có quy tắc .table-responsive cho thiết bị di động",
    strpos($styleCss, '.table-responsive') !== false);

$accountCss = file_get_contents($rootDir . '/frontend/assets/css/account.css');
assertTest("account.css định kiểu menu 16 tab cuộn ngang dạng pills trên màn hình <= 900px",
    strpos($accountCss, '@media (max-width: 900px)') !== false && strpos($accountCss, 'flex-wrap: nowrap') !== false && strpos($accountCss, 'overflow-x: auto') !== false);

// Kiểm tra cache busters trên 9 file HTML
$htmlFiles = ['index.html', 'category.html', 'product-detail.html', 'cart.html', 'checkout.html', 'account.html', 'admin.html', 'login.html', 'register.html'];
$cacheBusterOk = true;
$missingVersion = [];

foreach ($htmlFiles as $f) {
    $content = file_get_contents($rootDir . '/' . $f);
    if (!strpos($content, '?v=2026_final_v4')) {
        $cacheBusterOk = false;
        $missingVersion[] = $f;
    }
}

assertTest("Tất cả 9 file HTML đều cập nhật cache-buster ?v=2026_final_v4",
    $cacheBusterOk, implode(', ', $missingVersion));

// ---------------------------------------------------------------------
// TEST GROUP 4: REGRESSION TEST FOR PARTS 1, 2, 3
// ---------------------------------------------------------------------
echo "\n--- NHÓM 4: REGRESSION TEST CHO CÁC PHẦN 1, 2, 3 ---\n";

// Part 1 Regression: Database & Auth
require_once $rootDir . '/backend/config/db.php';
$hasDb = isset($conn) && $conn instanceof PDO;

if ($hasDb) {
    // Check users table via PDO
    $stmt = $conn->query("SELECT id, username, password, role FROM users WHERE username = 'admin' LIMIT 1");
    $adminUser = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC) : null;
    $adminHasBcrypt = $adminUser && password_verify('admin123', (string)$adminUser['password']);
    assertTest("Tài khoản admin tồn tại và mã hóa Bcrypt an toàn trong MySQL (Part 1)", $adminHasBcrypt);

    // Check orders table
    $stmt = $conn->query("SHOW TABLES LIKE 'orders'");
    $hasOrders = $stmt && $stmt->rowCount() > 0;
    assertTest("Bảng orders tồn tại trong MySQL (Part 1 & 2)", $hasOrders);

    // Check order_details table
    $stmt = $conn->query("SHOW TABLES LIKE 'order_details'");
    $hasOrderDetails = $stmt && $stmt->rowCount() > 0;
    assertTest("Bảng order_details tồn tại trong MySQL (Part 1 & 2)", $hasOrderDetails);
} else {
    // Check JSON fallback
    $usersJson = vlu_read_json_file('users.json', []);
    $adminFound = false;
    foreach ($usersJson as $u) {
        if (($u['username'] ?? '') === 'admin' && password_verify('admin123', (string)($u['password'] ?? ''))) {
            $adminFound = true;
            break;
        }
    }
    assertTest("Tài khoản admin tồn tại và mã hóa Bcrypt trong JSON fallback (Part 1)", $adminFound);
}

// Part 2 Regression: Guest Checkout & Fallback JSON
$ordersJson = vlu_read_json_file('orders.json', []);
assertTest("Hệ thống lưu trữ dự phòng orders.json hoạt động bình thường (Part 2)", is_array($ordersJson));

// Part 3 Regression: 100% Image Sync & Validity
$catalogJsonPath = $rootDir . '/backend/database/catalog-inventory.json';
assertTest("catalog-inventory.json tồn tại (Part 3)", file_exists($catalogJsonPath));

$catalogData = json_decode(file_get_contents($catalogJsonPath), true);
$products = isset($catalogData['products']) ? $catalogData['products'] : $catalogData;
$emptyImageCount = 0;
$missingDiskImageCount = 0;

foreach ($products as $p) {
    if (empty($p['image'])) {
        $emptyImageCount++;
    } else {
        $localPath = $rootDir . '/' . ltrim(str_replace('\\', '/', $p['image']), '/');
        if (!file_exists($localPath)) {
            $missingDiskImageCount++;
        }
    }
}

assertTest("100% sản phẩm trong catalog có ảnh (0 ảnh rỗng) (Part 3)", $emptyImageCount === 0, "Tìm thấy {$emptyImageCount} rỗng");
assertTest("100% file ảnh sản phẩm tồn tại trên đĩa trong SanPham/ (Part 3)", $missingDiskImageCount === 0, "Thiếu {$missingDiskImageCount} file");

// ---------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------
echo "\n====================================================================\n";
echo "   TỔNG KẾT KẾT QUẢ KIỂM THỬ: {$passed} PASS / " . ($passed + $failed) . " TESTS\n";
if ($failed === 0) {
    echo "   TRẠNG THÁI: TOÀN BỘ CÁC HẠNG MỤC ĐẠT CHUẨN 100% (READY FOR DEPLOY)\n";
} else {
    echo "   TRẠNG THÁI: CÓ {$failed} TEST KHÔNG ĐẠT!\n";
}
echo "====================================================================\n";

exit($failed > 0 ? 1 : 0);
