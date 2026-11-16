<?php
/**
 * Automated Syntax & Linter Check for PHP and JS files
 */

$rootDir = realpath(__DIR__ . '/../../');

echo "--- 1. KIỂM TRA CÚ PHÁP TẤT CẢ FILE PHP (php -l) ---\n";
$phpFiles = [];
$dirIter = new RecursiveDirectoryIterator($rootDir);
$iter = new RecursiveIteratorIterator($dirIter);

foreach ($iter as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        // Skip vendor if any
        if (strpos($file->getPathname(), 'vendor') === false) {
            $phpFiles[] = $file->getPathname();
        }
    }
}

$phpErrorCount = 0;
foreach ($phpFiles as $file) {
    $cmd = '"C:\\Project\\php\\php.exe" -l ' . escapeshellarg($file) . ' 2>&1';
    $output = shell_exec($cmd);
    if (strpos($output, 'No syntax errors detected') === false) {
        echo "[ERROR] " . $file . "\n" . $output . "\n";
        $phpErrorCount++;
    }
}
echo "Tổng số file PHP: " . count($phpFiles) . " | Lỗi cú pháp: " . $phpErrorCount . "\n\n";

echo "--- 2. KIỂM TRA CÚ PHÁP TẤT CẢ FILE JAVASCRIPT (node -c) ---\n";
$jsFiles = [];
foreach ($iter as $file) {
    if ($file->isFile() && $file->getExtension() === 'js') {
        // Bỏ qua thư viện bên thứ ba dạng ES Module (frontend/assets/vendor/three) vì không phải mã nguồn của dự án
        if (strpos($file->getPathname(), 'node_modules') === false && strpos($file->getPathname(), '.git') === false && strpos($file->getPathname(), DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR) === false) {
            $jsFiles[] = $file->getPathname();
        }
    }
}

$jsErrorCount = 0;
foreach ($jsFiles as $file) {
    $cmd = 'node -c ' . escapeshellarg($file) . ' 2>&1';
    $output = shell_exec($cmd);
    if (!empty(trim((string)$output))) {
        echo "[ERROR] " . $file . "\n" . $output . "\n";
        $jsErrorCount++;
    }
}
echo "Tổng số file JS: " . count($jsFiles) . " | Lỗi cú pháp: " . $jsErrorCount . "\n\n";

if ($phpErrorCount === 0 && $jsErrorCount === 0) {
    echo ">>> TOÀN BỘ FILE PHP VÀ JAVASCRIPT ĐẠT CHUẨN CÚ PHÁP (0 ERRORS) <<<\n";
    exit(0);
} else {
    echo ">>> CÓ LỖI CÚ PHÁP CẦN XỬ LÝ! <<<\n";
    exit(1);
}
