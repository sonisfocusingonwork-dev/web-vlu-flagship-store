<?php
/**
 * VLU FLAGSHIP STORE – Xuất image manifest tĩnh
 * Chạy: php backend/tools/build_image_manifest.php
 * → ghi frontend/assets/js/image-manifest.js (dùng khi mở file .html không qua máy chủ PHP).
 */

require_once __DIR__ . '/../lib/catalog_images.php';

$root = dirname(__DIR__, 2);
$out = $root . '/frontend/assets/js/image-manifest.js';
file_put_contents($out, vlu_image_manifest_js($root));

$entries = vlu_image_manifest($root);
$imgCount = array_sum(array_map(function ($e) { return count($e['images']); }, $entries));
echo "Đã ghi " . count($entries) . " thư mục sản phẩm (" . $imgCount . " ảnh) vào frontend/assets/js/image-manifest.js" . PHP_EOL;
