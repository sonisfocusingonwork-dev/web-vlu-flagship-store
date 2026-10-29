<?php
/**
 * Cập nhật product-detail.php với các ID động và liên kết script chuẩn UTF-8
 */

$file = dirname(__DIR__, 2) . '/product-detail.php';
$content = file_get_contents($file);

// 1. Breadcrumbs
$content = preg_replace(
    '/<a href="category\.php\?cat=dien-thoai"[^>]*>.*?<\/a>/u',
    '<a id="pdBreadcrumbCat" href="category.php?cat=dien-thoai" class="hover:text-brand transition">Điện thoại</a>',
    $content
);
$content = preg_replace(
    '/<a href="search\.php\?q=Apple"[^>]*>.*?<\/a>/u',
    '<a id="pdBreadcrumbBrand" href="search.php?q=Apple" class="hover:text-brand transition">Apple iPhone</a>',
    $content
);
$content = preg_replace(
    '/<li class="text-slate-900 font-bold"[^>]*>iPhone 18 Pro Max<\/li>/u',
    '<li id="pdBreadcrumbName" class="text-slate-900 font-bold" aria-current="page">iPhone 18 Pro Max</li>',
    $content
);

// 2. Badges trên ảnh
$content = preg_replace(
    '/<div class="absolute left-4 top-4 z-10 flex flex-col gap-2">/u',
    '<div id="pdBadges" class="absolute left-4 top-4 z-10 flex flex-col gap-2">',
    $content
);

// 3. Eyebrow và Title
$content = preg_replace(
    '/<span class="text-xs font-black uppercase tracking-\[0\.2em\] text-brand">Apple · Flagship 2026<\/span>/u',
    '<span id="pdEyebrow" class="text-xs font-black uppercase tracking-[0.2em] text-brand">Apple · Flagship 2026</span>',
    $content
);
$content = preg_replace(
    '/<h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">\s*iPhone 18 Pro Max\s*<\/h1>/u',
    '<h1 id="pdName" class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">iPhone 18 Pro Max</h1>',
    $content
);

// 4. Installment
$content = preg_replace(
    '/<p class="mt-2 text-xs font-medium text-slate-600 flex items-center gap-1\.5">/u',
    '<p id="pdInstallment" class="mt-2 text-xs font-medium text-slate-600 flex items-center gap-1.5">',
    $content
);

// 5. Swatches
$content = preg_replace(
    '/<div class="flex items-center gap-3\.5" role="radiogroup" aria-label="Chọn màu sắc sản phẩm">/u',
    '<div id="colorSwatches" class="flex items-center gap-3.5" role="radiogroup" aria-label="Chọn màu sắc sản phẩm">',
    $content
);

// 6. Variant
$content = preg_replace(
    '/Dung lượng lưu trữ:\s*<strong id="selectedStorageName"[^>]*>256GB<\/strong>/u',
    '<span id="variantLabel">Dung lượng lưu trữ</span>: <strong id="selectedVariantName" class="text-slate-900 font-extrabold text-sm ml-1">256GB</strong>',
    $content
);
$content = preg_replace(
    '/<div class="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Chọn dung lượng bộ nhớ">/u',
    '<div id="variantGrid" class="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Chọn phiên bản">',
    $content
);

// 7. Perks
$content = preg_replace(
    '/<ul class="text-xs text-slate-700 space-y-1\.5 font-medium">/u',
    '<ul id="pdPerks" class="text-xs text-slate-700 space-y-1.5 font-medium">',
    $content
);

// 8. Bento
$content = preg_replace(
    '/<div class="spec-bento-grid mb-8">/u',
    '<div id="pdBento" class="spec-bento-grid mb-8">',
    $content
);

// 9. SKU & Specs table
$content = preg_replace(
    '/<span class="text-xs text-slate-500 font-medium">Mã sản phẩm: A3294 \(VN\/A\)<\/span>/u',
    '<span id="pdSku" class="text-xs text-slate-500 font-medium">Mã sản phẩm: A3294 (VN/A)</span>',
    $content
);
$content = preg_replace(
    '/<div class="divide-y divide-slate-100 text-sm">/u',
    '<div id="pdSpecTable" class="divide-y divide-slate-100 text-sm">',
    $content
);

// 10. Thay thế inline script bằng các file modular
$scriptReplacement = <<<HTML
  <!-- Client Script chung cho Header Mega-Menu & Drawer -->
  <script src="frontend/assets/js/main.js"></script>

  <!-- Dữ liệu catalog và image manifest cho Dynamic Product Detail -->
  <script src="frontend/assets/js/image-manifest.js"></script>
  <script src="frontend/assets/js/products-data.js"></script>
  <script src="frontend/assets/js/product-detail.js"></script>
HTML;

$content = preg_replace(
    '/\s*<!-- Client Script chung cho Header Mega-Menu & Drawer -->[\s\S]*?<\/script>\s*<\/body>/u',
    "\n" . $scriptReplacement . "\n</body>",
    $content
);

file_put_contents($file, $content);
echo "Đã cập nhật product-detail.php thành công!\n";
