<?php
$headerPath = dirname(__DIR__, 2) . '/frontend/components/header.php';
$content = file_get_contents($headerPath);

// Thêm require_once product_links.php nếu chưa có
if (strpos($content, 'product_links.php') === false) {
    $content = preg_replace(
        '/<\?php\s*/u',
        "<?php\nrequire_once dirname(__DIR__, 2) . '/backend/lib/product_links.php';\n",
        $content,
        1
    );
}

// Thay thế search.php?q=... trong Mega Menu
$content = str_replace(
    'href="search.php?q=<?= rawurlencode($item) ?>"',
    'href="<?= vlu_product_url($item, $slug) ?>"',
    $content
);

$content = str_replace(
    'href="search.php?q=<?= rawurlencode($it) ?>"',
    'href="<?= vlu_product_url($it, $slug) ?>"',
    $content
);

file_put_contents($headerPath, $content);
echo "Đã cập nhật liên kết trong header.php thành công!\n";
