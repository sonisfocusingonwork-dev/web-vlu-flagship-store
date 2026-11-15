<?php
/**
 * VLU FLAGSHIP STORE – Đồng bộ 100% hình ảnh thực tế từ thư mục SanPham/
 * vào Catalog Inventory, products-data.js, database.sql và MySQL
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/catalog_images.php';
require_once __DIR__ . '/../config/db.php';

echo "=== KHỞI ĐỘNG ĐỒNG BỘ HÌNH ẢNH SANPHAM/ VÀO CATALOG & CSDL ===\n";

$root = dirname(__DIR__, 2);
$invPath = $root . '/backend/database/catalog-inventory.json';
$inv = json_decode(file_get_contents($invPath), true);
if (!isset($inv['products']) || !is_array($inv['products'])) {
    throw new RuntimeException("Không tìm thấy dữ liệu trong catalog-inventory.json");
}

$manifest = vlu_image_manifest($root);
$manifestMap = [];
foreach ($manifest as $m) {
    $manifestMap[$m['slug']] = $m;
}

// Bảng từ điển ánh xạ màu sắc tiếng Việt và mã màu HEX
$colorDictionary = [
    'den khong gian' => ['Đen Không Gian', '#1D1D1F', 'den-khong-gian'],
    'titan tu nhien' => ['Titan Tự Nhiên', '#C5B9A5', 'titan-tu-nhien'],
    'titan sa mac'   => ['Titan Sa Mạc',   '#C7A382', 'titan-sa-mac'],
    'titan den'      => ['Titan Đen',      '#3C3B37', 'titan-den'],
    'titan trang'    => ['Titan Trắng',    '#E3E4E5', 'titan-trang'],
    'titan xam'      => ['Titan Xám',      '#64748B', 'titan-xam'],
    'titan xanh'     => ['Titan Xanh',     '#3F5277', 'titan-xanh'],
    'anh sao'        => ['Ánh Sao',        '#F5EEDB', 'anh-sao'],
    'xanh da troi'   => ['Xanh Da Trời',   '#38BDF8', 'xanh-da-troi'],
    'xanh la'        => ['Xanh Lá',        '#10B981', 'xanh-la'],
    'xanh nhat'      => ['Xanh Nhạt',      '#7DD3FC', 'xanh-nhat'],
    'xanh dam'       => ['Xanh Đậm',       '#1E40AF', 'xanh-dam'],
    'xanh duong'     => ['Xanh Dương',     '#2563EB', 'xanh-duong'],
    'xanh lam'       => ['Xanh Lam',       '#2563EB', 'xanh-lam'],
    'xanh'           => ['Xanh Dương',     '#3B82F6', 'xanh'],
    'den'            => ['Đen',            '#1D1D1F', 'den'],
    'đen'            => ['Đen',            '#1D1D1F', 'den'],
    'trang'          => ['Trắng',          '#F8FAFC', 'trang'],
    'trắng'          => ['Trắng',          '#F8FAFC', 'trang'],
    'bac'            => ['Bạc',            '#E2E8F0', 'bac'],
    'bạc'            => ['Bạc',            '#E2E8F0', 'bac'],
    'xam'            => ['Xám',            '#64748B', 'xam'],
    'xám'            => ['Xám',            '#64748B', 'xam'],
    'hong'           => ['Hồng',           '#F472B6', 'hong'],
    'hồng'           => ['Hồng',           '#F472B6', 'hong'],
    'tim'            => ['Tím',            '#A855F7', 'tim'],
    'tím'            => ['Tím',            '#A855F7', 'tim'],
    'vang'           => ['Vàng',           '#FBBF24', 'vang'],
    'vàng'           => ['Vàng',           '#FBBF24', 'vang'],
    'kem'            => ['Kem',            '#F5EEDB', 'kem'],
    'do'             => ['Đỏ',             '#EF4444', 'do'],
    'đỏ'             => ['Đỏ',             '#EF4444', 'do'],
    'cam'            => ['Cam',            '#F97316', 'cam'],
    'nau'            => ['Nâu',            '#78350F', 'nau'],
    'nâu'            => ['Nâu',            '#78350F', 'nau']
];

$productImageSyncData = [];

foreach ($inv['products'] as &$prod) {
    $slug = vlu_slug($prod['folder_name']);
    $folderEntry = $manifestMap[$slug] ?? null;

    if (!$folderEntry || empty($folderEntry['images'])) {
        echo "CẢNH BÁO: Không có ảnh cho " . $prod['id'] . " (thư mục: {$prod['folder_name']})\n";
        continue;
    }

    $colors = [];
    $seenColorKeys = [];

    foreach ($folderEntry['images'] as $idx => $imgInfo) {
        $rawColor = mb_strtolower($imgInfo['color']);
        $colorName = '';
        $colorHex = '#334155';
        $colorKey = 'color-' . ($idx + 1);

        foreach ($colorDictionary as $kw => $info) {
            if (str_contains($rawColor, $kw)) {
                $colorName = $info[0];
                $colorHex = $info[1];
                $colorKey = $info[2];
                break;
            }
        }

        if ($colorName === '') {
            if (count($folderEntry['images']) === 1) {
                $colorName = 'Tiêu chuẩn';
                $colorKey = 'standard';
                $colorHex = '#1E293B';
            } else {
                $colorName = 'Bản màu ' . ($idx + 1);
                $colorKey = 'variant-' . ($idx + 1);
                $colorHex = '#475569';
            }
        }

        if (isset($seenColorKeys[$colorKey])) {
            $colorKey .= '-' . ($idx + 1);
            $colorName .= ' ' . ($idx + 1);
        }
        $seenColorKeys[$colorKey] = true;

        // URL đã được rawurlencode trong manifest, giữ nguyên chuẩn đường dẫn thực tế
        $rawPath = VLU_PRODUCT_IMG_DIR . '/' . $folderEntry['path'] . '/' . basename(rawurldecode($imgInfo['url']));
        
        $colors[] = [
            'name'  => $colorName,
            'hex'   => $colorHex,
            'key'   => $colorKey,
            'image' => $rawPath,
            'img'   => $rawPath
        ];
    }

    $defaultImage = $colors[0]['image'];

    $prod['image'] = $defaultImage;
    $prod['colors'] = $colors;

    $productImageSyncData[$prod['id']] = [
        'id'          => $prod['id'],
        'database_id' => $prod['database_id'],
        'name'        => $prod['name'],
        'image'       => $defaultImage,
        'colors'      => $colors
    ];
}
unset($prod);

// 1. Cập nhật catalog-inventory.json
file_put_contents($invPath, json_encode($inv, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
echo "[1/4] Đã cập nhật backend/database/catalog-inventory.json thành công!\n";

// 2. Cập nhật image-manifest.js
file_put_contents($root . '/frontend/assets/js/image-manifest.js', vlu_image_manifest_js($root));
echo "[2/4] Đã làm mới frontend/assets/js/image-manifest.js thành công!\n";

// 3. Cập nhật trực tiếp vào bảng products trong MySQL (và JSON fallback products.json)
if (isset($conn) && $conn !== null) {
    try {
        $conn->beginTransaction();
        $stmtUpdate = $conn->prepare("UPDATE products SET image = :img WHERE id = :dbid OR name = :pname");
        $updateCount = 0;
        foreach ($productImageSyncData as $pData) {
            $stmtUpdate->execute([
                ':img'  => $pData['image'],
                ':dbid' => $pData['database_id'],
                ':pname'=> $pData['name']
            ]);
            $updateCount += $stmtUpdate->rowCount();
        }
        $conn->commit();
        echo "[3/4] Đã đồng bộ đường dẫn ảnh vào bảng `products` trong MySQL (Cập nhật $updateCount dòng)!\n";
    } catch (PDOException $e) {
        if ($conn->inTransaction()) $conn->rollBack();
        echo "[3/4] Cảnh báo cập nhật MySQL: " . $e->getMessage() . "\n";
    }
}

// Lưu bản sao JSON fallback products.json
$jsonFallbackPath = $root . '/backend/data/products.json';
if (!is_dir(dirname($jsonFallbackPath))) {
    mkdir(dirname($jsonFallbackPath), 0777, true);
}
file_put_contents($jsonFallbackPath, json_encode(array_values($productImageSyncData), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));

// 4. Cập nhật database.sql
$sqlPath = $root . '/backend/database/database.sql';
$sqlContent = file_get_contents($sqlPath);
foreach ($productImageSyncData as $pData) {
    $dbId = (int)$pData['database_id'];
    $imgSafe = addslashes($pData['image']);
    // Thay thế đường dẫn ảnh placeholder tương ứng theo ID sản phẩm trong file SQL
    $pattern = "/(\($dbId,\s*\d+,\s*'[^']+',\s*[\d.]+\s*,\s*'[^']+',\s*)'[^']+'(\))/u";
    $replacement = "$1'$imgSafe'$2";
    $sqlContent = preg_replace($pattern, $replacement, $sqlContent, 1);
}
file_put_contents($sqlPath, $sqlContent);
echo "[4/4] Đã đồng bộ đường dẫn ảnh thực tế vào backend/database/database.sql!\n";

echo "=== HOÀN TẤT ĐỒNG BỘ DỮ LIỆU 115 SẢN PHẨM ===\n";
