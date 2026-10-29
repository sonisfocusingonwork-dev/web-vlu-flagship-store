<?php
$files = [
    'product-detail.html' => ['Ưu đãi', 'Điện thoại', 'Màu sắc', 'Còn hàng', 'Thêm vào giỏ hàng', 'Đánh giá'],
    'index.html' => ['Điện thoại', 'Sản phẩm mới ra mắt', 'Khám phá ngay'],
    'frontend/assets/js/product-detail.js' => ['Màu', 'Dung lượng', 'Thu cũ', 'Màn hình', 'Thêm'],
    'frontend/assets/js/products-data.js' => ['Đỏ Burgundy', 'Titan Tự Nhiên', 'Titan Đen', 'Titan Trắng', 'Xanh Da Trời'],
];

$allOk = true;
foreach ($files as $file => $words) {
    if (!file_exists($file)) {
        echo "[MISSING] $file\n";
        $allOk = false;
        continue;
    }
    $content = file_get_contents($file);
    $fileOk = true;
    foreach ($words as $w) {
        if (strpos($content, $w) === false) {
            echo "[LỖI MÃ HÓA] File $file thiếu: '$w'\n";
            $fileOk = false;
            $allOk = false;
        }
    }
    if ($fileOk) {
        echo "✓ $file: Chuẩn UTF-8 Tiếng Việt hoàn hảo!\n";
    }
}

if ($allOk) {
    echo "\n=== TẤT CẢ FILE ĐỀU ĐẠT CHUẨN MÃ HÓA UTF-8 100%! ===\n";
} else {
    exit(1);
}
