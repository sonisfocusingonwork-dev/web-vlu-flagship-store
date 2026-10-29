<?php
/**
 * VLU FLAGSHIP STORE – Live image manifest API
 * GET backend/api/image-manifest.php            → JSON
 * GET backend/api/image-manifest.php?format=js  → window.VLU_IMAGE_MANIFEST = [...]
 * product-detail.html nạp file này để ảnh mới thả vào SanPham/ hiển thị ngay, không cần build lại.
 */

require_once __DIR__ . '/../lib/catalog_images.php';

header('Cache-Control: no-store, max-age=0');

if (($_GET['format'] ?? '') === 'js') {
    header('Content-Type: application/javascript; charset=utf-8');
    echo vlu_image_manifest_js();
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode(vlu_image_manifest(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
