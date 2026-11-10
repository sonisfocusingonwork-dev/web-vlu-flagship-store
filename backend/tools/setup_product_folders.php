<?php

$root = dirname(__DIR__, 2);
$baseDir = $root . '/SanPham';
$inventoryFile = $root . '/backend/database/catalog-inventory.json';
$inventory = json_decode((string)file_get_contents($inventoryFile), true);
if (!is_array($inventory) || !isset($inventory['categories'], $inventory['products'])) {
    throw new RuntimeException('Không thể tải danh mục sản phẩm: ' . $inventoryFile);
}

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

ensure_folder($baseDir);
$createdModels = 0;
$expectedDirectories = [$baseDir => true];
foreach ($inventory['categories'] as $category) {
    $categoryPath = $baseDir . '/' . folder_segment($category['folder']);
    ensure_folder($categoryPath);
    $expectedDirectories[$categoryPath] = true;
}

foreach ($inventory['products'] as $product) {
    foreach (['folder_category', 'folder_group', 'folder_name'] as $segment) {
        if (empty($product[$segment])) {
            throw new RuntimeException('Thiếu đường dẫn thư mục cho sản phẩm: ' . ($product['name'] ?? 'không rõ'));
        }
    }
    $productPath = $baseDir . '/' . folder_segment($product['folder_category']) . '/' .
        folder_segment($product['folder_group']) . '/' . folder_segment($product['folder_name']);
    $expectedDirectories[dirname($productPath)] = true;
    $expectedDirectories[$productPath] = true;
    ensure_folder($productPath);
    $createdModels++;
}

$directories = [];
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($baseDir, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::CHILD_FIRST
);
foreach ($iterator as $entry) {
    if ($entry->isDir()) {
        $directories[] = $entry->getPathname();
    }
}

$removedDirectories = 0;
foreach ($directories as $directory) {
    if (isset($expectedDirectories[$directory])) {
        continue;
    }
    $contents = array_values(array_diff(scandir($directory), ['.', '..']));
    $removable = true;
    foreach ($contents as $entry) {
        if ($entry !== '.gitkeep' || !is_file($directory . '/' . $entry)) {
            $removable = false;
            break;
        }
    }
    if (!$removable) {
        error_log('Giữ thư mục sản phẩm cũ có dữ liệu ngoài .gitkeep: ' . $directory);
        continue;
    }
    if (in_array('.gitkeep', $contents, true) && !unlink($directory . '/.gitkeep')) {
        throw new RuntimeException('Không thể xóa .gitkeep cũ trong: ' . $directory);
    }
    if (!rmdir($directory)) {
        throw new RuntimeException('Không thể xóa thư mục cũ: ' . $directory);
    }
    $removedDirectories++;
}

echo "Đã tạo/đảm bảo $createdModels thư mục model và .gitkeep; đã dọn $removedDirectories thư mục cũ không có dữ liệu sản phẩm.\n";
