<?php
/**
 * VLU FLAGSHIP STORE – Catalog image scanner
 * Quét thư mục SanPham/<Danh mục>/<Tên sản phẩm>/<Tên màu>.(png|webp|jpg)
 * và trả về "image manifest" cho trang chi tiết sản phẩm động.
 *
 * Quy ước: tên file ảnh = tên màu (vd: "Titan Sa Mạc.webp", "Đen Onyx.webp").
 * Chỉ cần thả ảnh vào đúng thư mục → tải lại trang là ảnh thật tự hiển thị.
 */

require_once __DIR__ . '/product_links.php';

if (!defined('VLU_PRODUCT_IMG_DIR')) {
    define('VLU_PRODUCT_IMG_DIR', 'SanPham');
}

if (!function_exists('vlu_image_manifest')) {
    function vlu_image_manifest(?string $projectRoot = null): array
    {
        $root = rtrim($projectRoot ?? dirname(__DIR__, 2), '/\\');
        $base = $root . '/' . VLU_PRODUCT_IMG_DIR;
        $entries = [];
        $seenSlugs = [];
        if (!is_dir($base)) {
            return $entries;
        }

        $isImage = function (string $f): bool {
            return (bool)preg_match('/\.(png|webp|jpe?g|avif|gif|svg)$/i', $f);
        };
        $encode = function (string $relPath): string {
            return implode('/', array_map('rawurlencode', explode('/', $relPath)));
        };

        // Hàm quét thư mục đệ quy tìm các folder chứa ảnh sản phẩm
        $scan = function (string $dir, string $relPrefix = '', string $topCategory = '') use (&$scan, &$entries, &$seenSlugs, $isImage, $encode) {
            $items = scandir($dir);
            if ($items === false) return;

            $images = [];
            $subdirs = [];

            foreach ($items as $item) {
                if ($item === '.' || $item === '..' || $item === '.git') continue;
                $full = "$dir/$item";
                if (is_dir($full)) {
                    $subdirs[] = $item;
                } elseif ($isImage($item)) {
                    $images[] = $item;
                }
            }

            // Nếu folder này có chứa ảnh sản phẩm
            if (!empty($images) && !empty($relPrefix)) {
                $leafName = basename($relPrefix);
                $leafSlug = vlu_slug($leafName);
                
                // Chỉ nhận mỗi model 1 lần (ưu tiên thư mục ngắn nhất)
                if (!isset($seenSlugs[$leafSlug])) {
                    $seenSlugs[$leafSlug] = true;
                    sort($images, SORT_NATURAL | SORT_FLAG_CASE);

                    $entries[] = [
                        'path'   => $relPrefix,
                        'top'    => vlu_slug($topCategory ?: $leafName),
                        'slug'   => $leafSlug,
                        'images' => array_map(function ($f) use ($relPrefix, $encode) {
                            return [
                                'url'   => $encode(VLU_PRODUCT_IMG_DIR . '/' . $relPrefix . '/' . $f),
                                'color' => class_exists('Normalizer')
                                    ? (Normalizer::normalize(pathinfo($f, PATHINFO_FILENAME), Normalizer::FORM_C) ?: pathinfo($f, PATHINFO_FILENAME))
                                    : pathinfo($f, PATHINFO_FILENAME),
                            ];
                        }, $images),
                    ];
                }
            }

            // Tiếp tục quét các thư mục con
            foreach ($subdirs as $sub) {
                $nextTop = $topCategory ?: $sub;
                $nextRel = $relPrefix ? "$relPrefix/$sub" : $sub;
                $scan("$dir/$sub", $nextRel, $nextTop);
            }
        };

        $scan($base);
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
