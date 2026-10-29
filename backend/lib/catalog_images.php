<?php
/**
 * VLU FLAGSHIP STORE – Catalog image scanner
 * Quét thư mục SanPham/SanPham/<Danh mục hoặc Hãng>/<Tên sản phẩm>/<Tên màu>.(png|webp|jpg)
 * và trả về "image manifest" cho trang chi tiết sản phẩm động.
 *
 * Quy ước: tên file ảnh = tên màu (vd: "Bạc.png", "Xám Không Gian.webp").
 * Chỉ cần thả ảnh vào đúng thư mục → tải lại trang là ảnh thật tự hiển thị.
 */

require_once __DIR__ . '/product_links.php';

if (!defined('VLU_PRODUCT_IMG_DIR')) {
    define('VLU_PRODUCT_IMG_DIR', 'SanPham/SanPham');
}

if (!function_exists('vlu_image_manifest')) {
    function vlu_image_manifest(?string $projectRoot = null): array
    {
        $root = rtrim($projectRoot ?? dirname(__DIR__, 2), '/\\');
        $base = $root . '/' . VLU_PRODUCT_IMG_DIR;
        $entries = [];
        if (!is_dir($base)) {
            return $entries;
        }

        $isImage = function (string $f): bool {
            return (bool)preg_match('/\.(png|webp|jpe?g|avif|gif|svg)$/i', $f);
        };
        $encode = function (string $relPath): string {
            return implode('/', array_map('rawurlencode', explode('/', $relPath)));
        };

        foreach (scandir($base) as $top) {
            if ($top === '.' || $top === '..' || !is_dir("$base/$top")) {
                continue;
            }
            foreach (scandir("$base/$top") as $leaf) {
                if ($leaf === '.' || $leaf === '..' || !is_dir("$base/$top/$leaf")) {
                    continue;
                }
                $files = array_values(array_filter(scandir("$base/$top/$leaf"), $isImage));
                sort($files, SORT_NATURAL | SORT_FLAG_CASE);
                $rel = "$top/$leaf";
                $entries[] = [
                    'path'   => $rel,
                    'top'    => vlu_slug($top),
                    'slug'   => vlu_slug($leaf),
                    'images' => array_map(function ($f) use ($rel, $encode) {
                        return [
                            'url'   => $encode(VLU_PRODUCT_IMG_DIR . '/' . $rel . '/' . $f),
                            'color' => class_exists('Normalizer')
                                ? (Normalizer::normalize(pathinfo($f, PATHINFO_FILENAME), Normalizer::FORM_C) ?: pathinfo($f, PATHINFO_FILENAME))
                                : pathinfo($f, PATHINFO_FILENAME),
                        ];
                    }, $files),
                ];
            }
        }
        return $entries;
    }
}

if (!function_exists('vlu_image_manifest_js')) {
    function vlu_image_manifest_js(?string $projectRoot = null): string
    {
        $json = json_encode(vlu_image_manifest($projectRoot), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        return "/* VLU FLAGSHIP STORE – Image manifest (tự sinh, không sửa tay).\n"
             . "   Sinh lại bằng: php backend/tools/build_image_manifest.php */\n"
             . "window.VLU_IMAGE_MANIFEST = " . $json . ";\n";
    }
}
