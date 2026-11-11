<?php
require_once dirname(__DIR__, 2) . '/backend/lib/product_links.php';
/**
 * VLU FLAGSHIP STORE – Header Component
 * Chuẩn UI/UX Apple 2026: Tối giản, sang trọng, hiệu ứng kính mờ (glassmorphism).
 * Thanh điều hướng ngang gồm 6 danh mục chính (Điện thoại, Laptop, iPad, Tai nghe, Loa, Đồng hồ điện tử).
 * Tất cả 6 danh mục đều có Mega-Menu thả xuống toàn màn hình, hỗ trợ thanh cuộn dọc (max-height: 75vh).
 * Đã dọn dẹp sạch toàn bộ nhãn thừa, badge quảng cáo, chú thích phụ – chỉ hiển thị Tiêu đề nhóm/hãng và Tên dòng sản phẩm.
 */

if (!function_exists('e')) {
    function e($val): string {
        return htmlspecialchars((string)$val, ENT_QUOTES, 'UTF-8');
    }
}

$cartCount = isset($cartCount) ? (int)$cartCount : 0;

$catalogFile = dirname(__DIR__, 2) . '/backend/database/catalog-inventory.json';
$catalogInventory = json_decode((string)file_get_contents($catalogFile), true);
if (!is_array($catalogInventory) || !isset($catalogInventory['categories'], $catalogInventory['products'])) {
    throw new RuntimeException('Không thể tải danh mục menu: ' . $catalogFile);
}
$categoryIcons = [
    'dien-thoai' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
    'laptop' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M2 20h20"/></svg>',
    'ipad' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2"/><circle cx="12" cy="18" r="1"/></svg>',
    'tai-nghe' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>',
    'loa' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    'dong-ho-dien-tu' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" rx="3"/><path d="M9 2v3m6-3v3m-6 14v3m6-3v3"/></svg>',
];
$navMegaCategories = [];
foreach ($catalogInventory['categories'] as $category) {
    $slug = $category['slug'];
    $groups = [];
    foreach ($catalogInventory['products'] as $product) {
        if ($product['category'] !== $slug) continue;
        $groupTitle = $product['folder_group'];
        if (!isset($groups[$groupTitle])) $groups[$groupTitle] = ['title' => $groupTitle, 'items' => []];
        $groups[$groupTitle]['items'][] = $product['name'];
    }
    $navMegaCategories[$slug] = [
        'name' => $category['name'],
        'icon' => $categoryIcons[$slug] ?? '',
        'grid_class' => 'mega-grid-flow',
        'groups' => array_values($groups),
    ];
}
?>

<!-- ============================================================
     APPLE 2026 GLASSMORPHIC HEADER (STICKY CỐ ĐỊNH TẠI TOP: 0)
     Hàng 1: Logo khử nền nguyên khối | Thanh tìm kiếm | Giỏ hàng
     Hàng 2: Menu ngang 6 danh mục (Toàn bộ Mega-Menu với thanh cuộn)
     ============================================================ -->
<header id="site-header" class="site-header sticky top-0 z-50">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">

    <!-- [HÀNG TRÊN]: Logo + Tìm kiếm + Giỏ hàng -->
    <div class="flex items-center justify-between gap-4 py-3 md:gap-8">

      <!-- 1. Logo khử nền hòa trộn nguyên khối (không khung viền) -->
      <a href="index.php" class="site-logo" aria-label="VLU FLAGSHIP STORE – Trang chủ">
        <img src="frontend/assets/images/logo.png" onerror="this.onerror=null;this.src='image_2c97c5.png';" alt="VLU FLAGSHIP STORE" width="243" height="171">
      </a>

      <!-- 2. Thanh tìm kiếm trung tâm phong cách kính mờ Apple -->
      <form action="search.php" method="GET" role="search" class="relative hidden sm:block flex-1 max-w-2xl">
        <label for="search-input" class="sr-only">Tìm kiếm sản phẩm</label>
        <div class="relative flex items-center">
          <svg class="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="search-input" name="q" type="search" placeholder="Bạn cần tìm iPhone, Galaxy, MacBook, iPad, tai nghe, loa…" autocomplete="off"
                 class="glass-search-input h-11 w-full rounded-full pl-11 pr-12 text-sm font-medium placeholder:text-slate-400 transition-all focus:outline-none">
          <button type="submit" class="absolute right-1.5 h-8 px-4 rounded-full bg-brand text-xs font-bold text-white shadow-sm hover:bg-brand-dark transition-colors">Tìm</button>
        </div>
      </form>

      <!-- 3. Tài khoản, Giỏ hàng & Nút mở menu di động -->
      <div class="flex items-center gap-2">
        
        <!-- Nút Tài khoản / Đăng nhập (Auth Container) -->
        <div id="headerAuthContainer" class="relative">
          <!-- Trạng thái chưa đăng nhập -->
          <a href="login.html" id="headerLoginBtn" class="flex items-center gap-1.5 h-10 px-3 rounded-full text-slate-700 transition hover:bg-slate-100/80 active:scale-95 text-xs font-bold" aria-label="Đăng nhập tài khoản">
            <svg class="h-4.5 w-4.5 text-slate-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
            <span class="hidden sm:inline">Đăng nhập</span>
          </a>

          <!-- Trạng thái đã đăng nhập (Dropdown Menu) -->
          <div id="headerUserDropdown" class="hidden relative">
            <button type="button" id="headerUserBtn" class="flex items-center gap-2 h-10 px-3 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-900 transition active:scale-95 text-xs font-bold" aria-expanded="false" aria-haspopup="true">
              <span class="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-slate-200 text-slate-500 ring-1 ring-white" id="headerUserAvatar" aria-hidden="true">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.1 0-7.5 2.1-7.5 4.7V21h15v-2.3c0-2.6-3.4-4.7-7.5-4.7Z"/></svg>
              </span>
              <span id="headerUserName" class="max-w-[100px] truncate">Người dùng</span>
              <svg class="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
            </button>

            <!-- Dropdown Menu Box -->
            <div id="headerUserMenu" class="hidden absolute right-0 mt-3 w-72 min-w-[280px] rounded-3xl border border-white/70 bg-white/90 p-3.5 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5 backdrop-blur-2xl z-50">
              <div class="flex items-center gap-3.5 border-b border-slate-100 px-2 pb-4 pt-1">
                <span id="menuUserAvatar" class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 text-slate-500 ring-4 ring-slate-100" aria-hidden="true">
                  <svg class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.1 0-7.5 2.1-7.5 4.7V21h15v-2.3c0-2.6-3.4-4.7-7.5-4.7Z"/></svg>
                </span>
                <div class="min-w-0 flex-1">
                  <p id="menuUserFullName" class="truncate text-sm font-extrabold text-slate-900">Họ và tên</p>
                  <p id="menuUserEmail" class="mt-1 truncate text-xs text-slate-500"></p>
                  <span id="menuUserRoleBadge" class="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-600">Khách hàng</span>
                </div>
              </div>
              <div class="space-y-1 py-3">
                <a href="admin.html" id="menuAdminBtn" class="hidden flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold text-brand hover:bg-brand-soft transition">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/></svg>
                  <span>Trang quản trị (Admin)</span>
                </a>
                <a href="account.php?tab=orders" class="flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                  <span>Đơn hàng của tôi</span>
                </a>
                <a href="account.php" class="flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                  <span class="grid h-4 w-4 place-items-center text-slate-400">●</span>
                  <span>Tài khoản của tôi</span>
                </a>
              </div>
              <div class="border-t border-slate-100 pt-2">
                <button type="button" id="headerLogoutBtn" class="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút Giỏ hàng -->
        <a href="cart.html" class="relative grid h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100/80 active:scale-95" aria-label="Giỏ hàng, hiện có <?= $cartCount ?> sản phẩm">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>
          </svg>
          <span id="cartCount" class="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white"><?= $cartCount ?></span>
        </a>

        <!-- Nút Menu Hamburger (Mobile) -->
        <button type="button" id="mobileMenuBtn" class="grid lg:hidden h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100 active:scale-95" aria-label="Mở menu danh mục" aria-expanded="false" aria-controls="mobileDrawer">
          <svg class="h-5 w-5 icon-burger" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
          <svg class="h-5 w-5 icon-close hidden" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

    </div>

    <!-- [HÀNG DƯỚI]: THANH MENU NGANG 7 DANH MỤC CHÍNH -->
    <nav class="main-nav hidden lg:block border-t border-slate-200/60 py-1.5" aria-label="Danh mục sản phẩm">
      <ul class="nav-list flex items-center justify-between">

        <?php foreach ($navMegaCategories as $slug => $cat): ?>
          <li class="nav-item-mega" id="menuItem-<?= e($slug) ?>">
            <button type="button" class="nav-link-btn" aria-expanded="false" aria-controls="megaPanel-<?= e($slug) ?>">
              <?= $cat['icon'] ?>
              <span><?= e($cat['name']) ?></span>
              <svg class="nav-chev" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>

            <!-- BẢNG MEGA-MENU THẢ XUỐNG VỚI THANH CUỘN (MAX-HEIGHT: 75VH) -->
            <div id="megaPanel-<?= e($slug) ?>" class="mega-panel" role="region" aria-label="Bảng phân loại <?= e($cat['name']) ?>">
              <div class="mega-menu-scroll">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 py-6">

                  <!-- Tiêu đề bảng menu tinh giản -->
                  <div class="flex items-center justify-between pb-3.5 border-b border-slate-200/70 mb-5">
                    <h3 class="text-base font-extrabold text-slate-900 tracking-tight"><?= e($cat['name']) ?> chính hãng</h3>
                    <a href="category.php?cat=<?= e($slug) ?>" class="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark px-3 py-1 rounded-full bg-brand-soft hover:bg-brand-soft/80 transition-colors">
                      Xem tất cả <?= e(mb_strtolower($cat['name'], 'UTF-8')) ?>
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                  </div>

                  <!-- Lưới các nhóm/cột phân loại -->
                  <div class="<?= e($cat['grid_class']) ?>">
                    <?php foreach ($cat['groups'] as $grp): ?>
                      <div class="mega-brand-col">
                        <!-- Tiêu đề nhóm/hãng thuần túy -->
                        <h4 class="text-xs font-extrabold text-slate-900 pb-2 mb-2.5 border-b border-slate-200/80 leading-tight">
                          <?= e($grp['title']) ?>
                        </h4>

                        <!-- Danh sách tên dòng sản phẩm thuần túy -->
                        <?php if (!empty($grp['sections'])): ?>
                          <div class="space-y-3">
                            <?php foreach ($grp['sections'] as $sec): ?>
                              <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1"><?= e($sec['title']) ?></p>
                                <ul class="space-y-0.5">
                                  <?php foreach ($sec['items'] as $item): ?>
                                    <li>
                                      <a href="<?= vlu_product_url($item, $slug) ?>" class="mega-item-link" title="<?= e($item) ?>">
                                        <?= e($item) ?>
                                      </a>
                                    </li>
                                  <?php endforeach; ?>
                                </ul>
                              </div>
                            <?php endforeach; ?>
                          </div>
                        <?php else: ?>
                          <ul class="space-y-0.5">
                            <?php foreach ($grp['items'] as $item): ?>
                              <li>
                                <a href="<?= vlu_product_url($item, $slug) ?>" class="mega-item-link" title="<?= e($item) ?>">
                                  <?= e($item) ?>
                                </a>
                              </li>
                            <?php endforeach; ?>
                          </ul>
                        <?php endif; ?>

                      </div>
                    <?php endforeach; ?>
                  </div>

                  <!-- Footer bảo đảm chân menu -->
                  <div class="mt-6 pt-3.5 border-t border-slate-200/70 -mx-4 -mb-6 px-6 py-3 bg-slate-50/70 rounded-b-[24px] flex items-center justify-between text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-6">
                      <span class="flex items-center gap-1.5 text-slate-700 font-bold">
                        <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        100% Chính hãng · Bảo hành 12 - 24 tháng
                      </span>
                      <span class="flex items-center gap-1.5 text-slate-700 font-bold">
                        <svg class="h-4 w-4 text-brand" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Thu cũ đổi mới trợ giá cao
                      </span>
                      <span class="flex items-center gap-1.5 text-slate-700 font-bold">
                        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Giao hàng hỏa tốc trong 2 giờ
                      </span>
                    </div>
                    <span class="text-slate-400">Cam kết máy mới nguyên seal 100%</span>
                  </div>

                </div>
              </div>
            </div>
          </li>
        <?php endforeach; ?>

      </ul>
    </nav>

  </div>
</header>

<!-- ================= MENU DI ĐỘNG (MOBILE DRAWER SHEET) ================= -->
<div id="mobileDrawer" class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu danh mục di động">
  <div class="mobile-drawer-inner p-4 space-y-3">

    <!-- Thanh tiêu đề & Nút đóng Menu Mobile -->
    <div id="mobileDrawerTopBar" class="flex items-center justify-between pb-3 border-b border-slate-200/80">
      <div class="flex items-center gap-2">
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-brand"></span>
        <span class="text-xs font-black uppercase tracking-wider text-slate-900">Danh mục &amp; Tiện ích</span>
      </div>
      <button type="button" id="mobileDrawerCloseBtn" aria-label="Đóng menu di động" class="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 hover:bg-brand hover:text-white transition">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Khung Tài khoản Mobile -->
    <div class="pb-2 border-b border-slate-200/80">
      <!-- Khi chưa đăng nhập -->
      <a href="login.html" id="mobileLoginBtn" class="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-brand text-white font-extrabold text-xs shadow-md shadow-brand/20 active:scale-98">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
        <span>Đăng nhập / Đăng ký</span>
      </a>

      <!-- Khi đã đăng nhập -->
      <div id="mobileUserBox" class="hidden p-2.5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            <span id="mobileUserAvatar" class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-white">V</span>
            <div class="min-w-0">
              <p id="mobileUserName" class="text-xs font-bold text-slate-900 truncate">Người dùng</p>
              <p id="mobileUserRole" class="text-[10px] font-bold text-emerald-600">Khách hàng VLU</p>
            </div>
          </div>
          <button type="button" id="mobileLogoutBtn" class="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1">Đăng xuất</button>
        </div>
        <a href="admin.html" id="mobileAdminBtn" class="hidden flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-brand/10 text-brand font-bold text-xs hover:bg-brand-soft transition">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/></svg>
          <span>Trang quản trị (Admin)</span>
        </a>
        <a href="account.php" class="block rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-brand-soft hover:text-brand">Tài khoản của tôi</a>
        <a href="account.php?tab=orders" class="block rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-brand-soft hover:text-brand">Đơn hàng của tôi</a>
      </div>
    </div>

    <!-- Ô tìm kiếm mobile -->
    <form action="search.php" method="GET" class="relative">
      <svg class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input name="q" type="search" placeholder="Tìm kiếm sản phẩm…" class="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand">
    </form>

    <!-- Accordion 6 danh mục chính trên Mobile -->
    <div class="space-y-2 pb-6">
      <?php foreach ($navMegaCategories as $slug => $cat): ?>
        <div class="mobile-brand-card">
          <button type="button" aria-expanded="false" class="mobile-accordion-toggle flex w-full items-center justify-between p-3.5 rounded-2xl bg-white/80 font-bold text-slate-900 text-left transition">
            <span class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <?= $cat['icon'] ?>
              <?= e($cat['name']) ?>
            </span>
            <svg class="h-4 w-4 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="mobile-accordion-body hidden px-3 pt-2 pb-3 space-y-3">
            <a href="category.php?cat=<?= e($slug) ?>" class="flex items-center justify-between rounded-xl bg-brand/10 px-3 py-2 text-xs font-extrabold text-brand hover:bg-brand hover:text-white transition">
              <span>Xem tất cả <?= e($cat['name']) ?></span>
              <span>→</span>
            </a>
            <?php foreach ($cat['groups'] as $grp): ?>
              <div class="pl-2.5 border-l-2 border-slate-200">
                <p class="text-xs font-black text-slate-800 mb-0.5"><?= e($grp['title']) ?></p>
                <?php if (!empty($grp['sections'])): ?>
                  <?php foreach ($grp['sections'] as $sec): ?>
                    <p class="text-[10px] font-bold text-slate-400 uppercase mt-1.5"><?= e($sec['title']) ?></p>
                    <div class="mt-0.5 space-y-0.5">
                      <?php foreach ($sec['items'] as $it): ?>
                        <a href="<?= vlu_product_url($it, $slug) ?>" class="block py-1 text-xs font-semibold text-slate-700 hover:text-brand">
                          <?= e($it) ?>
                        </a>
                      <?php endforeach; ?>
                    </div>
                  <?php endforeach; ?>
                <?php else: ?>
                  <div class="mt-1 space-y-0.5">
                    <?php foreach ($grp['items'] as $it): ?>
                      <a href="<?= vlu_product_url($it, $slug) ?>" class="block py-1 text-xs font-semibold text-slate-700 hover:text-brand">
                        <?= e($it) ?>
                      </a>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>

  </div>
</div>

<!-- Lớp phủ mờ nền trang (Scrim Blur) NẰM SAU HEADER (z-index 40 < header 50) -->
<div id="megaScrim" class="mega-scrim" aria-hidden="true"></div>
<script src="frontend/assets/js/products-data.js"></script>
<script src="frontend/assets/js/catalog-menu.js"></script>
<!-- Central Cart Engine 2026 -->
<script src="frontend/assets/js/cart-engine.js"></script>
<!-- Central Auth Engine 2026 -->
<script src="frontend/assets/js/auth-engine.js"></script>
