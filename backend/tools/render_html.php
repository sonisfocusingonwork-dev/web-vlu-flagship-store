<?php
/**
 * VLU FLAGSHIP STORE – HTML Renderer
 * Render toàn bộ các file tĩnh (index, product-detail, cart, checkout, login, register, admin, category)
 * Giữ nguyên 100% chuẩn mã hóa UTF-8 nhị phân, không qua pipeline giải mã sai của PowerShell.
 */

$root = dirname(__DIR__, 2);
chdir($root);

$pages = [
    'product-detail.php' => [
        'dest' => 'product-detail.html',
        'keywords' => ['Ưu đãi', 'Điện thoại', 'Màu sắc', 'Còn hàng', 'Thêm vào giỏ hàng', 'Đánh giá']
    ],
    'index.php' => [
        'dest' => 'index.html',
        'keywords' => ['Điện thoại', 'Sản phẩm mới ra mắt', 'Khám phá ngay']
    ],
    'cart.php' => [
        'dest' => 'cart.html',
        'keywords' => ['Giỏ hàng', 'Tạm tính', 'Tổng thanh toán', 'Tiến hành thanh toán']
    ],
    'checkout.php' => [
        'dest' => 'checkout.html',
        'keywords' => ['Thanh toán', 'Thông tin giao hàng', 'VietQR', 'Hoàn tất đặt hàng']
    ],
    'login.php' => [
        'dest' => 'login.html',
        'keywords' => ['Đăng nhập tài khoản', 'Email hoặc Tên đăng nhập', 'Mật khẩu', 'Ghi nhớ đăng nhập']
    ],
    'register.php' => [
        'dest' => 'register.html',
        'keywords' => ['Tạo tài khoản mới', 'Họ và tên', 'Số điện thoại', 'Xác nhận lại mật khẩu']
    ],
    'admin.php' => [
        'dest' => 'admin.html',
        'keywords' => ['Bảng điều khiển Quản trị', 'Tổng quan hệ thống', 'Quản lý Sản phẩm', 'Quản lý Đơn hàng', 'Quản lý Danh mục']
    ],
    'category.php' => [
        'dest' => 'category.html',
        'keywords' => ['VLU', 'Trang chủ', 'Chi tiết']
    ]
];

foreach ($pages as $src => $info) {
    $cmd = '"' . PHP_BINARY . '" "' . $root . '/' . $src . '"';
    $output = shell_exec($cmd);
    $dest = $info['dest'];
    if ($output !== null && strlen($output) > 500) {
        file_put_contents($root . '/' . $dest, $output);
        echo "✓ {$dest}: " . strlen($output) . " bytes [UTF-8 Chuẩn]\n";
        
        $content = file_get_contents($root . '/' . $dest);
        $pass = true;
        foreach ($info['keywords'] as $kw) {
            if (strpos($content, $kw) === false) {
                echo "  [CẢNH BÁO] {$dest} thiếu từ khóa: '{$kw}'\n";
                $pass = false;
            }
        }
        if ($pass) {
            echo "  -> ĐẠT 100% CHUẨN TIẾNG VIỆT UTF-8!\n";
        }
    } else {
        echo "✗ Thất bại khi biên dịch {$src}!\n";
    }
}

echo "\nHoàn tất render toàn bộ các trang HTML tĩnh!\n";
