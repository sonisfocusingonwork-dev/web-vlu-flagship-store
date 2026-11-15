<?php
// backend/tools/update_cache_buster.php
$htmlFiles = [
    'index.html',
    'category.html',
    'product-detail.html',
    'cart.html',
    'checkout.html',
    'account.html',
    'admin.html',
    'login.html',
    'register.html',
    // Also include php files for consistency
    'index.php',
    'category.php',
    'product-detail.php',
    'cart.php',
    'checkout.php',
    'account.php',
    'admin.php',
    'login.php',
    'register.php',
    'frontend/components/header.php'
];

$targetVersion = '2026_sync_ui_fix';

echo "Updating cache-busters to ?v={$targetVersion}...\n";

foreach ($htmlFiles as $relPath) {
    $fullPath = __DIR__ . '/../../' . $relPath;
    if (!file_exists($fullPath)) {
        echo "Skip (not found): {$relPath}\n";
        continue;
    }

    $content = file_get_contents($fullPath);
    $origContent = $content;

    // Replace existing ?v=... on .css and .js files
    $content = preg_replace('/(\.(css|js))\?v=[a-zA-Z0-9_.-]+/i', '$1?v=' . $targetVersion, $content);

    // Also add ?v=2026_final_v4 to local css/js links that don't have a version query parameter yet
    // Matches href="...css" or src="...js" that are local (frontend/assets/...)
    $content = preg_replace_callback('/(href|src)=("|\')(frontend\/assets\/[^"\']+\.(css|js))("|\')/i', function($m) use ($targetVersion) {
        return $m[1] . '=' . $m[2] . $m[3] . '?v=' . $targetVersion . $m[5];
    }, $content);

    if ($content !== $origContent) {
        file_put_contents($fullPath, $content);
        echo "Updated: {$relPath}\n";
    } else {
        echo "No changes: {$relPath}\n";
    }
}

echo "Done updating cache busters.\n";
