<?php
$indexPath = dirname(__DIR__, 2) . '/index.php';
$content = file_get_contents($indexPath);

// Require product_links.php
if (strpos($content, 'product_links.php') === false) {
    $content = preg_replace(
        '/require_once __DIR__ \. \x27\/backend\/config\/db\.php\x27;/u',
        "require_once __DIR__ . '/backend/config/db.php';\nrequire_once __DIR__ . '/backend/lib/product_links.php';",
        $content,
        1
    );
}

// Banners link
$oldBanners = <<<'PHP'
$banners = [
    [
        'eyebrow' => 'Apple · Flagship',
        'title' => 'iPhone 18 Pro Max',
        'text' => 'Đỉnh cao công nghệ Titanium cùng chip A20 Pro siêu mạnh mẽ.',
        'image' => 'Banner/iphone-18-pro_overview__bl9no3txkonm_og.png',
        'position' => 'center',
        'link' => 'product-detail.html',
    ],
    [
        'eyebrow' => 'Samsung · Flagship',
        'title' => 'Galaxy S26 Ultra',
        'text' => 'Galaxy AI, bút S Pen tích hợp và camera zoom xa ấn tượng.',
        'image' => 'Banner/1793210573792_6690802098732450037_6690802098732450037_e1d1abf703bca13b2c04877bec2a6237.jpg',
        'position' => 'center',
    ],
    [
        'eyebrow' => 'Xiaomi · Flagship',
        'title' => 'Xiaomi 17 Ultra',
        'text' => 'Ống kính Leica, cảm biến 1-inch cho nhiếp ảnh di động chuyên nghiệp.',
        'image' => 'Banner/1793210880061_6690802098732450037_6690802098732450037_6a8b3b4c8e68135516fb3c5dc26fc679.jpg',
        'position' => 'center',
    ],
    [
        'eyebrow' => 'OPPO · Flagship',
        'title' => 'OPPO Find X9 Ultra',
        'text' => 'Camera tiềm vọng kép hợp tác Hasselblad, sạc nhanh SuperVOOC.',
        'image' => 'Banner/1793210675516_6690802098732450037_6690802098732450037_a8855076415c152f1279d1ae05c669e9.jpg',
        'position' => 'center',
    ],
];
PHP;

$newBanners = <<<'PHP'
$banners = [
    [
        'eyebrow' => 'Apple · Flagship',
        'title' => 'iPhone 18 Pro Max',
        'text' => 'Đỉnh cao công nghệ Titanium cùng chip A20 Pro siêu mạnh mẽ.',
        'image' => 'Banner/iphone-18-pro_overview__bl9no3txkonm_og.png',
        'position' => 'center',
        'link' => 'product-detail.html?id=iphone-18-pro-max',
    ],
    [
        'eyebrow' => 'Samsung · Flagship',
        'title' => 'Galaxy S26 Ultra',
        'text' => 'Galaxy AI, bút S Pen tích hợp và camera zoom xa ấn tượng.',
        'image' => 'Banner/1793210573792_6690802098732450037_6690802098732450037_e1d1abf703bca13b2c04877bec2a6237.jpg',
        'position' => 'center',
        'link' => 'product-detail.html?id=galaxy-s26-ultra',
    ],
    [
        'eyebrow' => 'Xiaomi · Flagship',
        'title' => 'Xiaomi 17 Ultra',
        'text' => 'Ống kính Leica, cảm biến 1-inch cho nhiếp ảnh di động chuyên nghiệp.',
        'image' => 'Banner/1793210880061_6690802098732450037_6690802098732450037_6a8b3b4c8e68135516fb3c5dc26fc679.jpg',
        'position' => 'center',
        'link' => 'product-detail.html?id=xiaomi-17-ultra',
    ],
    [
        'eyebrow' => 'OPPO · Flagship',
        'title' => 'OPPO Find X9 Ultra',
        'text' => 'Camera tiềm vọng kép hợp tác Hasselblad, sạc nhanh SuperVOOC.',
        'image' => 'Banner/1793210675516_6690802098732450037_6690802098732450037_a8855076415c152f1279d1ae05c669e9.jpg',
        'position' => 'center',
        'link' => 'product-detail.html?id=oppo-find-x9-ultra',
    ],
];
PHP;

$content = str_replace($oldBanners, $newBanners, $content);

// Cập nhật link thẻ sản phẩm (dòng 814)
$content = preg_replace(
    '/<a href="product-detail\.html\?id=<\?= \(int\)\$p\[\x27id\x27\] \?>"/u',
    '<a href="<?= vlu_product_url($p[\'name\'], $p[\'brand\'] ?? \'\', $p[\'slug\'] ?? (string)$p[\'id\']) ?>"',
    $content
);

// Thêm slug vào $defaultProducts
$slugMap = [
    101 => 'iphone-18-pro-max',
    102 => 'iphone-air',
    103 => 'iphone-17',
    201 => 'galaxy-s26-ultra',
    202 => 'galaxy-z-fold8',
    203 => 'galaxy-z-flip8',
    204 => 'galaxy-s26',
    301 => 'xiaomi-17-ultra',
    302 => 'xiaomi-17-pro-max',
    401 => 'oppo-find-x9-ultra',
    402 => 'oppo-find-x9-pro',
    404 => 'oppo-find-n5',
];

foreach ($slugMap as $id => $slug) {
    $content = preg_replace(
        "/'id' => $id,/",
        "'id' => $id, 'slug' => '$slug',",
        $content,
        1
    );
}

file_put_contents($indexPath, $content);
echo "Đã cập nhật index.php thành công!\n";
