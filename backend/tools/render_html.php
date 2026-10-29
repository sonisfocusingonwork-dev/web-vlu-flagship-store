<?php
/**
 * VLU FLAGSHIP STORE – HTML Renderer
 * Render file tĩnh index.html và product-detail.html từ index.php và product-detail.php
 * Giữ nguyên 100% chuẩn mã hóa UTF-8 nhị phân, không qua pipeline giải mã sai của PowerShell.
 */

$root = dirname(__DIR__, 2);
chdir($root);

// 1. Render product-detail.html
$cmdDetail = '"' . PHP_BINARY . '" "' . $root . '/product-detail.php"';
$outputDetail = shell_exec($cmdDetail);
if ($outputDetail !== null && strlen($outputDetail) > 1000) {
    file_put_contents($root . '/product-detail.html', $outputDetail);
    echo "✓ product-detail.html: " . strlen($outputDetail) . " bytes [UTF-8 Chuẩn]\n";
} else {
    echo "✗ Lỗi khi render product-detail.html\n";
}

// 2. Render index.html
$cmdIndex = '"' . PHP_BINARY . '" "' . $root . '/index.php"';
$outputIndex = shell_exec($cmdIndex);
if ($outputIndex !== null && strlen($outputIndex) > 1000) {
    file_put_contents($root . '/index.html', $outputIndex);
    echo "✓ index.html: " . strlen($outputIndex) . " bytes [UTF-8 Chuẩn]\n";
} else {
    echo "✗ Lỗi khi render index.html\n";
}

// 3. Kiểm tra kiểm chứng chuỗi tiếng Việt chuẩn
$detailContent = file_get_contents($root . '/product-detail.html');
$indexContent = file_get_contents($root . '/index.html');

$checkWords = ['Ưu đãi', 'Điện thoại', 'Màu sắc', 'Còn hàng', 'Thêm vào giỏ hàng', 'Đánh giá'];
$detailPass = true;
foreach ($checkWords as $w) {
    if (strpos($detailContent, $w) === false) {
        echo "  [CẢNH BÁO] product-detail.html thiếu từ: '$w'\n";
        $detailPass = false;
    }
}
if ($detailPass) {
    echo "✓ product-detail.html ĐÃ ĐẠT 100% CHUẨN TIẾNG VIỆT UTF-8!\n";
}

$indexPass = true;
foreach (['Điện thoại', 'Sản phẩm mới ra mắt', 'Khám phá ngay'] as $w) {
    if (strpos($indexContent, $w) === false) {
        echo "  [CẢNH BÁO] index.html thiếu từ: '$w'\n";
        $indexPass = false;
    }
}
if ($indexPass) {
    echo "✓ index.html ĐÃ ĐẠT 100% CHUẨN TIẾNG VIỆT UTF-8!\n";
}
