<?php
/**
 * VLU FLAGSHIP STORE – Danh mục sản phẩm (Category Page)
 * Hiển thị sản phẩm theo phân loại danh mục, lọc theo hãng & giá tiền.
 */

require_once __DIR__ . '/backend/config/db.php';
require_once __DIR__ . '/backend/lib/product_links.php';

function e($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

$cat = trim((string)($_GET['cat'] ?? ''));
$sort = trim((string)($_GET['sort'] ?? 'moi-nhat'));

$categoryNames = [
    'dien-thoai' => 'Điện Thoại Flagship',
    'laptop' => 'Laptop & MacBook',
    'ipad' => 'Máy Tính Bảng iPad & Tablet',
    'tai-nghe' => 'Tai Nghe & Âm Thanh Cao Cấp',
    'loa' => 'Loa Bluetooth Chính Hãng',
    'phu-kien' => 'Phụ Kiện Công Nghệ',
    'dong-ho-dien-tu' => 'Đồng Hồ Thông Minh',
];

$title = $categoryNames[$cat] ?? 'Tất Cả Sản Phẩm';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($title) ?> | VLU FLAGSHIP STORE</title>
  <link rel="icon" type="image/png" href="frontend/assets/images/logo.png">
  <link rel="stylesheet" href="frontend/assets/css/style.css">
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap&subset=vietnamese" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
          colors: {
            brand: { DEFAULT: '#dc2626', dark: '#b91c1c', light: '#ef4444', soft: '#fef2f2' },
            ink: '#0B0F19'
          }
        }
      }
    };
  </script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-brand selection:text-white min-h-screen flex flex-col">

  <!-- Header -->
  <header class="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <div class="flex items-center gap-8">
        <a href="index.html" class="flex items-center gap-2">
          <img src="frontend/assets/images/logo.png" alt="VLU Store Logo" class="h-9 w-auto">
          <span class="text-lg font-black tracking-wider text-slate-900">VLU<span class="text-brand">STORE</span></span>
        </a>
        <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="category.html?cat=dien-thoai" class="hover:text-brand transition <?= $cat === 'dien-thoai' ? 'text-brand font-bold' : '' ?>">Điện thoại</a>
          <a href="category.html?cat=laptop" class="hover:text-brand transition <?= $cat === 'laptop' ? 'text-brand font-bold' : '' ?>">Laptop</a>
          <a href="category.html?cat=ipad" class="hover:text-brand transition <?= $cat === 'ipad' ? 'text-brand font-bold' : '' ?>">iPad</a>
          <a href="category.html?cat=tai-nghe" class="hover:text-brand transition <?= $cat === 'tai-nghe' ? 'text-brand font-bold' : '' ?>">Tai nghe</a>
          <a href="category.html?cat=loa" class="hover:text-brand transition <?= $cat === 'loa' ? 'text-brand font-bold' : '' ?>">Loa</a>
          <a href="category.html?cat=phu-kien" class="hover:text-brand transition <?= $cat === 'phu-kien' ? 'text-brand font-bold' : '' ?>">Phụ kiện</a>
          <a href="category.html?cat=dong-ho-dien-tu" class="hover:text-brand transition <?= $cat === 'dong-ho-dien-tu' ? 'text-brand font-bold' : '' ?>">Đồng hồ</a>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <a href="cart.html" class="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-brand/40 hover:text-brand">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span id="cartCount" class="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white shadow-sm">0</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Breadcrumb & Header Banner -->
  <main class="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 w-full">
    <nav class="mb-4 text-xs font-semibold text-slate-500">
      <a href="index.html" class="hover:text-brand">Trang chủ</a>
      <span class="mx-2">/</span>
      <span class="text-slate-800"><?= e($title) ?></span>
    </nav>

    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"><?= e($title) ?></h1>
        <p class="mt-2 text-sm text-slate-500">Khám phá các thiết bị công nghệ chính hãng với chế độ bảo hành 12 - 24 tháng toàn diện.</p>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap gap-2 text-xs font-bold">
        <a href="category.html" class="rounded-full px-4 py-2 border transition <?= empty($cat) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Tất cả</a>
        <a href="category.html?cat=dien-thoai" class="rounded-full px-4 py-2 border transition <?= $cat === 'dien-thoai' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Điện thoại</a>
        <a href="category.html?cat=laptop" class="rounded-full px-4 py-2 border transition <?= $cat === 'laptop' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Laptop</a>
        <a href="category.html?cat=ipad" class="rounded-full px-4 py-2 border transition <?= $cat === 'ipad' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">iPad</a>
        <a href="category.html?cat=tai-nghe" class="rounded-full px-4 py-2 border transition <?= $cat === 'tai-nghe' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Tai nghe</a>
        <a href="category.html?cat=loa" class="rounded-full px-4 py-2 border transition <?= $cat === 'loa' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Loa</a>
        <a href="category.html?cat=phu-kien" class="rounded-full px-4 py-2 border transition <?= $cat === 'phu-kien' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Phụ kiện</a>
        <a href="category.html?cat=dong-ho-dien-tu" class="rounded-full px-4 py-2 border transition <?= $cat === 'dong-ho-dien-tu' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Đồng hồ</a>
      </div>
    </div>

    <!-- Product Grid Container (Dynamic Rendering) -->
    <div id="categoryProductGrid" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
      <!-- Fallback static items or dynamically populated via JS -->
    </div>
  </main>

  <!-- Footer -->
  <footer class="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
    <p>© 2026 VLU FLAGSHIP STORE. Tất cả quyền được bảo lưu.</p>
  </footer>

  <script src="frontend/assets/js/products-data.js"></script>
  <script src="frontend/assets/js/image-manifest.js"></script>
  <script src="frontend/assets/js/cart-engine.js"></script>
  <script>
    (function() {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat') || '';
      const grid = document.getElementById('categoryProductGrid');
      const catalog = window.VLU_CATALOG || {};

      let products = Object.values(catalog);
      if (catParam) {
        products = products.filter(p => p.category === catParam);
      }

      function formatVND(n) {
        return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
      }

      if (products.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-16 text-center text-slate-400">Đang cập nhật sản phẩm cho danh mục này...</div>';
        return;
      }

      grid.innerHTML = products.map(p => {
        const img = p.image || (p.colors && p.colors[0] ? p.colors[0].image : '');
        const url = 'product-detail.html?id=' + encodeURIComponent(p.id) + '&name=' + encodeURIComponent(p.name);
        return `
          <article class="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
            <div class="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 p-4">
              <span class="absolute left-2.5 top-2.5 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">${p.brand}</span>
              <img src="${img}" alt="${p.name}" loading="lazy" class="h-full w-full object-contain transition duration-500 group-hover:scale-105">
            </div>
            <div class="mt-4 flex flex-1 flex-col">
              <h3 class="font-bold text-slate-900 group-hover:text-brand line-clamp-1">${p.name}</h3>
              <p class="mt-1 text-xs text-slate-500 line-clamp-1">${p.tagline || ''}</p>
              <div class="mt-auto pt-4 flex items-center justify-between">
                <div>
                  <span class="text-base font-extrabold text-brand">${formatVND(p.basePrice)}</span>
                  ${p.oldPrice ? `<span class="block text-xs text-slate-400 line-through">${formatVND(p.oldPrice)}</span>` : ''}
                </div>
                <a href="${url}" class="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand">Chi tiết</a>
              </div>
            </div>
          </article>
        `;
      }).join('');
    })();
  </script>
</body>
</html>
