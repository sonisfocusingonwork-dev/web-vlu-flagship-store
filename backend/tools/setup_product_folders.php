<?php

$root = dirname(__DIR__, 2);
$baseDir = $root . '/SanPham';
$categoryFolders = [
    'dien-thoai' => 'DienThoai',
    'laptop' => 'Laptop',
    'ipad' => 'iPad',
    'tai-nghe' => 'TaiNghe',
    'loa' => 'Loa',
    'phu-kien' => 'PhuKien',
    'dong-ho-dien-tu' => 'DongHoDienTu',
];
$accessoryFolders = [
    'Phu-Kien-Dien-Thoai',
    'Phu-Kien-Laptop-PC',
    'Phu-Kien-Tai-Nghe',
    'Phu-Kien-Loa',
    'Phu-Kien-iPad-Tablet',
    'Phu-Kien-Smartwatch',
    'Phu-Kien-Gaming',
    'Phu-Kien-Man-Hinh',
    'Luu-Tru-Ket-Noi',
    'Sac-Va-Nguon',
];

function folder_segment(string $name): string
{
    $name = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name) ?: $name;
    $name = preg_replace('/[^A-Za-z0-9]+/', '-', $name);
    return trim((string)$name, '-');
}

function ensure_folder(string $path): void
{
    if (!is_dir($path) && !mkdir($path, 0775, true) && !is_dir($path)) {
        throw new RuntimeException("Không thể tạo thư mục: $path");
    }
    if (!file_exists($path . '/.gitkeep') && !touch($path . '/.gitkeep')) {
        throw new RuntimeException("Không thể tạo .gitkeep trong: $path");
    }
}

if (!is_dir($baseDir)) {
    mkdir($baseDir, 0775, true);
}

$imageExtensions = ['png', 'webp', 'jpg', 'jpeg', 'avif', 'gif', 'svg', 'bmp'];
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($baseDir, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::CHILD_FIRST
);
$deletedImages = 0;
foreach ($iterator as $entry) {
    if ($entry->isFile() && in_array(strtolower($entry->getExtension()), $imageExtensions, true)) {
        if (!unlink($entry->getPathname())) {
            throw new RuntimeException('Không thể xóa ảnh cũ: ' . $entry->getPathname());
        }
        $deletedImages++;
    }
}

ob_start();
require $root . '/frontend/components/header.php';
ob_end_clean();

ensure_folder($baseDir);
$createdModels = 0;
foreach ($navMegaCategories as $slug => $category) {
    $categoryFolder = $categoryFolders[$slug] ?? folder_segment($category['name']);
    $categoryPath = $baseDir . '/' . $categoryFolder;
    ensure_folder($categoryPath);

    foreach ($category['groups'] as $groupIndex => $group) {
        $groupFolder = $slug === 'phu-kien'
            ? $accessoryFolders[$groupIndex]
            : folder_segment($group['title']);
        $groupPath = $categoryPath . '/' . $groupFolder;
        ensure_folder($groupPath);

        $items = $group['items'] ?? [];
        foreach ($group['sections'] ?? [] as $section) {
            $items = array_merge($items, $section['items'] ?? []);
        }

        foreach (array_unique($items) as $item) {
            $modelFolder = folder_segment(str_replace(['/', '\\'], '-', $item));
            if ($modelFolder === '') {
                continue;
            }
            ensure_folder($groupPath . '/' . $modelFolder);
            $createdModels++;
        }
    }
}

echo "Đã xóa $deletedImages file ảnh cũ.\n";
echo "Đã tạo/đảm bảo $createdModels thư mục model và .gitkeep cho toàn bộ các cấp.\n";
