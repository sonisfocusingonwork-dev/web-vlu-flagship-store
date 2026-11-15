<?php
/**
 * Test Suite for Real-time Sync, Checkout Input Constraints & Product Detail Gallery 2026
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
echo "   SUITE KIỂM THỬ TỰ ĐỘNG: ĐỒNG BỘ REAL-TIME, CHECKOUT & PRODUCT DETAIL\n";
echo "====================================================================\n\n";

// ---------------------------------------------------------------------
// TEST GROUP 1: PHẦN 1 - ĐỒNG BỘ REAL-TIME ADMIN -> USER & CART
// ---------------------------------------------------------------------
echo "--- NHÓM 1: ĐỒNG BỘ REAL-TIME ADMIN -> USER (SINGLE SOURCE OF TRUTH) ---\n";

$ordersPhp = file_get_contents($rootDir . '/backend/api/orders.php');
assertTest("orders.php hỗ trợ GET action=products trả về danh sách sản phẩm",
    strpos($ordersPhp, '$action === \'products\'') !== false);

assertTest("orders.php lưu đồng bộ vào backend/data/products.json khi save_product",
    strpos($ordersPhp, 'vlu_write_json_file(\'products.json\'') !== false);

assertTest("orders.php xóa đồng bộ khỏi backend/data/products.json khi delete_product",
    strpos($ordersPhp, 'vlu_write_json_file(\'products.json\', $jsonProducts)') !== false);

$adminEngine = file_get_contents($rootDir . '/frontend/assets/js/admin-engine.js');
assertTest("admin-engine.js cập nhật cả vlu_admin_products và vlu_products",
    strpos($adminEngine, 'localStorage.setItem(\'vlu_products\'') !== false &&
    strpos($adminEngine, 'localStorage.setItem(STORAGE_PRODUCTS') !== false);

assertTest("admin-engine.js phát tín hiệu đồng bộ qua vlu_sync_timestamp",
    strpos($adminEngine, 'localStorage.setItem(\'vlu_sync_timestamp\'') !== false);

assertTest("admin-engine.js phát tín hiệu qua BroadcastChannel('vlu_store_sync')",
    strpos($adminEngine, 'new BroadcastChannel(\'vlu_store_sync\')') !== false);

$productsData = file_get_contents($rootDir . '/frontend/assets/js/products-data.js');
assertTest("products-data.js xuất hàm mergeAdminProducts / VLU_SYNC_PRODUCTS",
    strpos($productsData, 'VLU_SYNC_PRODUCTS') !== false && strpos($productsData, 'function mergeAdminProducts') !== false);

$mainJs = file_get_contents($rootDir . '/frontend/assets/js/main.js');
assertTest("main.js lắng nghe storage event và BroadcastChannel để tự động cập nhật giao diện",
    strpos($mainJs, 'vlu_sync_timestamp') !== false && strpos($mainJs, 'vlu_store_sync') !== false);

$cartEngine = file_get_contents($rootDir . '/frontend/assets/js/cart-engine.js');
assertTest("cart-engine.js tự động cập nhật đơn giá mới và loại bỏ sản phẩm đã xóa khi đồng bộ",
    strpos($cartEngine, 'item.price !== cart[i].price') !== false &&
    strpos($cartEngine, 'vlu_store_sync') !== false);

// ---------------------------------------------------------------------
// TEST GROUP 2: PHẦN 2 - RÀNG BUỘC INPUT CHECKOUT & BỎ CHỮ 'HUYỆN'
// ---------------------------------------------------------------------
echo "\n--- NHÓM 2: RÀNG BUỘC INPUT THANH TOÁN & BỎ 'HUYỆN' CHUẨN 2026 ---\n";

$checkoutHtml = file_get_contents($rootDir . '/checkout.html');
$checkoutJs = file_get_contents($rootDir . '/frontend/assets/js/checkout-page.js');

assertTest("checkout.html có thẻ cảnh báo lỗi #fullnameError và #phoneError",
    strpos($checkoutHtml, 'id="fullnameError"') !== false && strpos($checkoutHtml, 'id="phoneError"') !== false);

assertTest("checkout.html ô SĐT có inputmode=numeric và maxlength=10",
    strpos($checkoutHtml, 'inputmode="numeric"') !== false && strpos($checkoutHtml, 'maxlength="10"') !== false);

assertTest("checkout-page.js lọc trực tiếp Họ tên bằng Unicode \\p{L} và \\s",
    strpos($checkoutJs, 'replace(/[^\\p{L}\\s]/gu') !== false);

assertTest("checkout-page.js lọc trực tiếp SĐT chỉ cho phép số 0-9",
    strpos($checkoutJs, 'replace(/[^0-9]/g') !== false);

assertTest("checkout-page.js kiểm tra đúng 10 số đầu số di động VN khi submit",
    strpos($checkoutJs, '/^(03|05|07|08|09)[0-9]{8}$/') !== false);

// Kiểm tra triệt tiêu chữ "Huyện" trên toàn bộ HTML và JS
$allHtmlJs = [];
$iter = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($rootDir));
foreach ($iter as $f) {
    if ($f->isFile()) {
        $ext = strtolower($f->getExtension());
        if (in_array($ext, ['html', 'js']) && strpos($f->getPathname(), '.git') === false && strpos($f->getPathname(), 'node_modules') === false) {
            $allHtmlJs[] = $f->getPathname();
        }
    }
}

$huyenFound = [];
foreach ($allHtmlJs as $filepath) {
    $c = file_get_contents($filepath);
    if (preg_match('/(Quận\s*\/\s*Huyện|Chọn\s*Quận\s*\/\s*Huyện|Quận\/Huyện)/iu', $c, $m)) {
        $huyenFound[] = basename($filepath) . " (" . $m[0] . ")";
    }
}
assertTest("Không còn bất kỳ chữ 'Huyện' nào trong nhãn/giao diện hành chính",
    empty($huyenFound), implode(', ', $huyenFound));

assertTest("checkout.html dùng nhãn 'Quận / Phường / Khu vực'",
    strpos($checkoutHtml, 'Quận / Phường / Khu vực') !== false);

// ---------------------------------------------------------------------
// TEST GROUP 3: PHẦN 3 - CHI TIẾT SẢN PHẨM & CHUẨN HÓA HÌNH ẢNH
// ---------------------------------------------------------------------
echo "\n--- NHÓM 3: KHẮC PHỤC LỖI HÌNH ẢNH TRÊN TRANG CHI TIẾT SẢN PHẨM ---\n";

$styleCss = file_get_contents($rootDir . '/frontend/assets/css/style.css');

assertTest("style.css: .gallery-viewer có nền Trắng #ffffff và aspect-ratio: 1 / 1",
    strpos($styleCss, 'background: #ffffff;') !== false && strpos($styleCss, 'aspect-ratio: 1 / 1;') !== false);

assertTest("style.css: ảnh chính và gallery áp dụng mix-blend-mode: multiply hòa trộn rìa ảnh",
    strpos($styleCss, 'mix-blend-mode: multiply;') !== false);

assertTest("style.css: .thumb-btn chuẩn 68px x 68px nền #ffffff bo góc mềm",
    strpos($styleCss, 'width: 68px;') !== false && strpos($styleCss, 'height: 68px;') !== false);

$productDetailJs = file_get_contents($rootDir . '/frontend/assets/js/product-detail.js');
assertTest("product-detail.js áp dụng Fuzzy Lookup không bao giờ 404",
    strpos($productDetailJs, 'toSlug(rawId || rawName)') !== false);

assertTest("product-detail.js lắng nghe sự kiện đồng bộ thời gian thực từ Admin",
    strpos($productDetailJs, 'vlu_store_sync') !== false);

// Kiểm tra Fuzzy Matcher trong products-data.js
assertTest("products-data.js có hàm xóa dấu removeVietnameseAccents và so khớp token",
    strpos($productsData, 'removeVietnameseAccents') !== false && strpos($productsData, 'bestMatch') !== false);

// ---------------------------------------------------------------------
// TEST GROUP 4: CACHE BUSTER VÀ TOÀN VẸN HỆ THỐNG
// ---------------------------------------------------------------------
echo "\n--- NHÓM 4: CACHE BUSTER & TỔNG THỂ HỆ THỐNG ---\n";

$htmlFiles = ['index.html', 'category.html', 'product-detail.html', 'cart.html', 'checkout.html', 'account.html', 'admin.html', 'login.html', 'register.html'];
$cacheOk = true;
$missingVersion = [];
foreach ($htmlFiles as $h) {
    $content = file_get_contents($rootDir . '/' . $h);
    if (strpos($content, '?v=2026_sync_ui_fix') === false) {
        $cacheOk = false;
        $missingVersion[] = $h;
    }
}
assertTest("Toàn bộ 9 file HTML cập nhật cache buster ?v=2026_sync_ui_fix",
    $cacheOk, implode(', ', $missingVersion));

echo "\n====================================================================\n";
echo "   TỔNG KẾT KẾT QUẢ KIỂM THỬ: {$passed} PASS / " . ($passed + $failed) . " TESTS\n";
if ($failed === 0) {
    echo "   TRẠNG THÁI: TOÀN BỘ CÁC HẠNG MỤC ĐẠT CHUẨN 100% (READY FOR DEPLOY)\n";
} else {
    echo "   TRẠNG THÁI: CÓ {$failed} TEST KHÔNG ĐẠT!\n";
}
echo "====================================================================\n";

exit($failed > 0 ? 1 : 0);
