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
            brand: { DEFAULT: '#C8102E', dark: '#A00D25', light: '#DC2626', soft: '#FDECEF' },
            ink: '#0B0F19'
          }
        }
      }
    };
  </script>
</head>
<body class="bg-[#FBFBFE] font-sans text-ink antialiased selection:bg-brand selection:text-white min-h-screen flex flex-col">

  <?php require __DIR__ . '/frontend/components/header.php'; ?>

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
        <a href="category.html?cat=dong-ho-dien-tu" class="rounded-full px-4 py-2 border transition <?= $cat === 'dong-ho-dien-tu' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-brand/50' ?>">Đồng hồ</a>
      </div>
      <label class="flex items-center gap-2 text-xs font-bold text-slate-600">
        Hãng
        <select id="brandFilter" class="rounded-full border border-slate-200 bg-white px-3 py-2">
          <option value="">Tất cả hãng</option>
        </select>
      </label>
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
  <script src="frontend/assets/js/main.js"></script>
  <script>
    (function() {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat') || '';
      const grid = document.getElementById('categoryProductGrid');
      const catalog = window.VLU_CATALOG || {};
      const productsByKey = new Map();
      const categoryFallbacks = {
        'dien-thoai': 'phone.svg',
        laptop: 'laptop.svg',
        ipad: 'ipad.svg',
        'tai-nghe': 'tai-nghe.svg',
        loa: 'loa.svg',
        'dong-ho-dien-tu': 'dong-ho.svg'
      };

      Object.values(catalog).forEach(function(product) {
        if (!catParam || product.category === catParam) {
          productsByKey.set(product.category + ':' + product.id, product);
        }
      });

      const products = Array.from(productsByKey.values());
      const brandFilter = document.getElementById('brandFilter');
      const brands = Array.from(new Set(products.map(function(product) { return product.brand; }).filter(Boolean))).sort();
      brands.forEach(function(brand) {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
      });

      function formatVND(n) {
        return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
      }

      function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function(char) {
          return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char];
        });
      }

      if (products.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-16 text-center text-slate-400">Đang cập nhật sản phẩm cho danh mục này...</div>';
        return;
      }

      grid.innerHTML = products.map(p => {
        const img = p.image || (p.colors && p.colors[0] ? p.colors[0].image : '');
        const category = p.category || catParam;
        const fallbackImage = 'frontend/assets/images/placeholders/' + (categoryFallbacks[category] || 'phone.svg');
        const imageUrl = img || fallbackImage;
        const url = 'product-detail.html?id=' + encodeURIComponent(p.id) + '&name=' + encodeURIComponent(p.name) + '&cat=' + encodeURIComponent(category);
        const price = Number(p.basePrice) > 0 ? formatVND(p.basePrice) : 'Liên hệ';
        const addButton = Number(p.basePrice) > 0
          ? `<button type="button" data-add data-id="${escapeHtml(p.id)}" data-name="${escapeHtml(p.name)}" data-price="${Number(p.basePrice)}" aria-label="Thêm ${escapeHtml(p.name)} vào giỏ hàng" class="relative z-30 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-white transition hover:bg-brand"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>`
          : '<span class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Chi tiết</span>';
        return `
          <article class="product-card group relative flex flex-col rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-4" data-brand="${escapeHtml(p.brand || '')}">
            <a href="${url}" class="absolute inset-0 z-20 rounded-xl" aria-label="Xem ${escapeHtml(p.name)}"></a>
            <div class="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50 p-4">
              <span class="absolute left-2.5 top-2.5 z-10 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">${escapeHtml(p.brand || 'VLU Store')}</span>
              <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}';" class="h-full w-full object-contain transition duration-500 group-hover:scale-105">
            </div>
            <div class="relative z-10 mt-3 flex flex-1 flex-col sm:mt-4">
              <h3 class="font-bold text-slate-900 group-hover:text-brand line-clamp-2">${escapeHtml(p.name)}</h3>
              <p class="mt-1 min-h-4 text-xs text-slate-500 line-clamp-1">${escapeHtml(p.tagline || 'Sản phẩm chính hãng')}</p>
              <div class="pointer-events-none mt-auto flex items-center justify-between gap-2 pt-4">
                <div>
                  <span class="text-sm font-extrabold text-brand sm:text-base">${price}</span>
                  ${p.oldPrice ? `<span class="block text-xs text-slate-400 line-through">${formatVND(p.oldPrice)}</span>` : ''}
                </div>
                ${addButton}
              </div>
            </div>
          </article>
        `;
      }).join('');
      brandFilter.addEventListener('change', function() {
        grid.querySelectorAll('.product-card').forEach(function(card) {
          card.hidden = Boolean(brandFilter.value && card.dataset.brand !== brandFilter.value);
        });
      });
    })();
  </script>
</body>
</html>
