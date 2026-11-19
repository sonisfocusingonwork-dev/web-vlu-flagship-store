/**
 * VLU FLAGSHIP STORE – Enterprise Admin Page Controller 2026
 * Điều khiển toàn diện: Auth Gate, Sidebar 6 nhóm & Thu gọn + Tooltip, Header Ngữ cảnh,
 * Global Quick Search, Dark Mode, Dashboard dữ liệu thực (8 KPI, Biểu đồ Doanh thu, Donut, Phân bố tách biệt),
 * CRUD Sản phẩm / Danh mục / Thương hiệu / Kho hàng / Đơn hàng / Thành viên / Thông báo / Nhật ký.
 */
(function (window, document) {
  'use strict';

  var currentTab = 'dashboard';
  var editingProductId = null;
  var editingCategoryId = null;
  var editingBrandId = null;
  var currentViewingOrderId = null;
  var currentPreviewProductId = null;

  var productsPage = 1;
  var PRODUCTS_PER_PAGE = 20;
  var selectedProductIds = {};
  var productSearchTimer = null;

  var categoryViewMode = 'table';
  var brandViewMode = 'grid';
  try {
    categoryViewMode = localStorage.getItem('vlu_admin_cat_view') || 'table';
    brandViewMode = localStorage.getItem('vlu_admin_brand_view') || 'grid';
  } catch (eView) {}

  var activeProductFormTab = 'basic';
  var productFormDirty = false;
  var prodSlugManuallyEdited = false;
  var catSlugManuallyEdited = false;
  var brandSlugManuallyEdited = false;
  var prodFormGallery = [];
  var prodFormColors = [];
  var prodFormVariants = [];
  var prodFormSpecs = [];
  var confirmModalCallback = null;

  var inventoryPage = 1;
  var INVENTORY_PER_PAGE = 15;
  var inventoryViewMode = 'stock';
  var inventoryLogsPage = 1;
  var ordersPage = 1;
  var ORDERS_PER_PAGE = 20;
  var usersPage = 1;
  var USERS_PER_PAGE = 20;
  var paymentsPage = 1;
  var returnsPage = 1;
  var membersPage = 1;
  var reviewsPage = 1;

  var pendingCancelOrderId = null;
  var currentViewingUserId = null;
  var editingUserId = null;
  var pendingLockUserId = null;
  var editingVoucherId = null;
  var editingPromotionId = null;
  var pendingReplyTarget = null;
  var editingReturnUid = null;
  var pendingPointsUserId = null;

  function emptyRowHtml(colspan, title, desc) {
    return '<tr><td colspan="' + colspan + '">' +
      '<div class="vlu-empty-state">' +
        '<svg class="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6m-3-3h6M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>' +
        '<p class="text-xs font-bold" style="color: var(--admin-text-primary);">' + escapeHtml(title) + '</p>' +
        (desc ? '<p class="text-[11px]" style="color: var(--admin-text-secondary);">' + escapeHtml(desc) + '</p>' : '') +
      '</div>' +
    '</td></tr>';
  }

  var orderFilterStatus = 'all';
  var userKpiQuickFilter = 'all';
  var revState = { granularity: 'day', startDate: '', endDate: '', compare: true };
  var activeProdAnalyticsTab = 'topSelling';

  var TAB_META = {
    'dashboard':     { group: 'Tổng quan',         title: 'Dashboard tổng quan',       breadcrumb: 'Dashboard' },
    'products':      { group: 'Quản lý cửa hàng',  title: 'Quản lý sản phẩm',          breadcrumb: 'Quản lý sản phẩm' },
    'categories':    { group: 'Quản lý cửa hàng',  title: 'Quản lý danh mục',          breadcrumb: 'Quản lý danh mục' },
    'brands':        { group: 'Quản lý cửa hàng',  title: 'Quản lý thương hiệu',       breadcrumb: 'Quản lý thương hiệu' },
    'inventory':     { group: 'Quản lý cửa hàng',  title: 'Quản lý kho hàng',          breadcrumb: 'Quản lý kho hàng' },
    'orders':        { group: 'Quản lý bán hàng',  title: 'Quản lý đơn hàng',          breadcrumb: 'Quản lý đơn hàng' },
    'payments':      { group: 'Quản lý bán hàng',  title: 'Quản lý thanh toán',        breadcrumb: 'Quản lý thanh toán' },
    'returns':       { group: 'Quản lý bán hàng',  title: 'Quản lý đổi trả',           breadcrumb: 'Quản lý đổi trả' },
    'users':         { group: 'Khách hàng',        title: 'Quản lý tài khoản',         breadcrumb: 'Quản lý tài khoản' },
    'members':       { group: 'Khách hàng',        title: 'Quản lý thành viên',        breadcrumb: 'Quản lý thành viên' },
    'reviews':       { group: 'Khách hàng',        title: 'Quản lý đánh giá',          breadcrumb: 'Quản lý đánh giá' },
    'vouchers':      { group: 'Marketing',         title: 'Quản lý voucher',           breadcrumb: 'Quản lý voucher' },
    'promotions':    { group: 'Marketing',         title: 'Quản lý khuyến mãi',        breadcrumb: 'Quản lý khuyến mãi' },
    'notifications': { group: 'Hệ thống',          title: 'Trung tâm thông báo',       breadcrumb: 'Trung tâm thông báo' },
    'activity-log':  { group: 'Hệ thống',          title: 'Nhật ký hoạt động',         breadcrumb: 'Nhật ký hoạt động' },
    'settings':      { group: 'Hệ thống',          title: 'Cài đặt hệ thống',          breadcrumb: 'Cài đặt' }
  };

  function escapeHtml(val) {
    return String(val == null ? '' : val).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function normalizeOrderKey(code) {
    if (window.VLU_ADMIN && typeof window.VLU_ADMIN.normalizeOrderKey === 'function') {
      return window.VLU_ADMIN.normalizeOrderKey(code);
    }
    return String(code == null ? '' : code).replace(/^#+/, '').trim().toUpperCase();
  }

  function formatOrderCode(code) {
    if (window.VLU_ADMIN && typeof window.VLU_ADMIN.formatOrderCode === 'function') {
      return window.VLU_ADMIN.formatOrderCode(code);
    }
    var key = normalizeOrderKey(code);
    return key ? ('#' + key) : '';
  }

  function safeImage(url, category) {
    var resolver = window.resolveProductImageUrl || function (u) { return u; };
    return resolver(url || 'frontend/assets/images/logo.png', category || 'phone');
  }

  /* ==========================================================================
     1. KHỞI TẠO HỆ THỐNG & KIỂM TRA PHÂN QUYỀN
     ========================================================================== */
  function initAdmin() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    // Bảo đảm trạng thái cuộn không bị kẹt khi tải trang
    document.body.classList.remove('overflow-hidden');
    if (document.documentElement) document.documentElement.classList.remove('overflow-hidden');

    function syncGateState() {
      var auth = engine.checkAuth();
      var gate = document.getElementById('accessDeniedGate');
      var adminLayout = document.getElementById('adminLayout');

      if (!auth.isAuthorized) {
        if (gate) gate.classList.remove('hidden');
        if (adminLayout) adminLayout.classList.add('blur-sm', 'pointer-events-none');
      } else {
        if (gate) gate.classList.add('hidden');
        if (adminLayout) adminLayout.classList.remove('blur-sm', 'pointer-events-none');
        updateAdminProfile(auth.user);
        try {
          if (!sessionStorage.getItem('vlu_admin_session_logged')) {
            sessionStorage.setItem('vlu_admin_session_logged', '1');
            engine.logActivity('admin_login', 'Truy cập Admin Portal', 'Phiên làm việc Quản trị viên (' + (auth.user.email || auth.user.username) + ')', 'dashboard');
          }
        } catch (eLog) {}
      }
      return auth;
    }

    // 1. Kiểm tra Auth Admin (role === 1 hoặc admin@vluflagship.vn)
    syncGateState();

    var btnQuickAdmin = document.getElementById('btnQuickAdminLogin');
    if (btnQuickAdmin) {
      btnQuickAdmin.addEventListener('click', function () {
        Promise.resolve(engine.quickLoginAdmin()).then(function (res) {
          var newAuth = syncGateState();
          if (!newAuth.isAuthorized) {
            engine.showToast((res && res.message) || 'Không thể đăng nhập quyền Admin.', true);
            return;
          }
          engine.showToast('Chào mừng Quản trị viên VLU! Đã mở khóa bảng điều khiển.');
          switchTab('dashboard');
        });
      });
    }

    // 2. Khôi phục trạng thái Sidebar & Dark Mode
    initSidebarState();
    initThemeToggle();
    initHeaderPopovers();
    initGlobalSearch();
    initDashboardControls();

    // 3. Khởi tạo Tab Router
    initTabRouter();
    var initialTab = 'dashboard';
    try {
      var hashTab = (window.location.hash || '').replace('#', '');
      if (hashTab && document.getElementById('tabPanel-' + hashTab)) initialTab = hashTab;
    } catch (e) {}
    switchTab(initialTab);

    // 4. Đồng bộ badges & lắng nghe cập nhật thời gian thực
    syncSidebarAndHeaderBadges();

    window.addEventListener('vlu:admin-updated', function () {
      syncSidebarAndHeaderBadges();
      renderCurrentTab();
    });

    window.addEventListener('storage', function (e) {
      if (e.key === 'vlu_user') {
        syncGateState();
      }
      if (e.key === 'vlu_orders' || (e.key && e.key.indexOf('vlu_orders_') === 0) ||
          e.key === 'vlu_admin_products' || e.key === 'vlu_user' || e.key === 'vlu_sync_timestamp') {
        syncSidebarAndHeaderBadges();
        renderCurrentTab();
      }
    });

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        var syncChannel = new BroadcastChannel('vlu_store_sync');
        syncChannel.onmessage = function () {
          syncSidebarAndHeaderBadges();
          renderCurrentTab();
        };
      }
    } catch (eBc) {}

    // 5. Đăng xuất Admin (Sidebar & Header Dropdown) — dùng chung hàm chuẩn AuthEngine.logout() về index.html
    function handleAdminLogout(e) {
      if (e) e.preventDefault();
      if (window.VLU_AUTH && typeof window.VLU_AUTH.logout === 'function') {
        window.VLU_AUTH.logout();
        return;
      }
      try {
        localStorage.removeItem('vlu_user');
        if (window.sessionStorage && typeof window.sessionStorage.removeItem === 'function') {
          window.sessionStorage.removeItem('vlu_admin_session_logged');
        }
      } catch (err) {}
      if (window.location && typeof window.location.replace === 'function') {
        window.location.replace('index.html');
      } else if (window.location) {
        window.location.href = 'index.html';
      }
    }
    var btnLogout = document.getElementById('adminLogoutBtn');
    var headerLogout = document.getElementById('headerAdminLogoutBtn');
    if (btnLogout) btnLogout.addEventListener('click', handleAdminLogout);
    if (headerLogout) headerLogout.addEventListener('click', handleAdminLogout);

    // 6. Mobile Sidebar Drawer Toggle
    var btnSidebarToggle = document.getElementById('btnAdminMobileSidebarToggle');
    var sidebarBackdrop = document.getElementById('adminSidebarBackdrop');
    if (btnSidebarToggle) {
      btnSidebarToggle.addEventListener('click', function () {
        document.body.classList.toggle('admin-sidebar-mobile-open');
      });
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', function () {
        document.body.classList.remove('admin-sidebar-mobile-open');
      });
    }

    // 7. Reset Catalog mặc định
    var btnResetProducts = document.getElementById('btnResetProducts');
    if (btnResetProducts) {
      btnResetProducts.addEventListener('click', function () {
        openConfirmModal({
          title: 'Khôi phục Catalog mặc định?',
          message: 'Khôi phục toàn bộ danh sách sản phẩm về dữ liệu flagship mặc định của VLU Flagship Store?',
          warning: 'Lưu ý: Mọi thay đổi thủ công hoặc sản phẩm mới thêm tạm thời trong trình duyệt có thể bị ghi đè.',
          confirmLabel: 'Khôi phục Catalog',
          onConfirm: function () {
            engine.resetProducts();
            selectedProductIds = {};
            engine.showToast('Đã khôi phục toàn bộ sản phẩm mặc định!');
          }
        });
      });
    }
  }

  function updateAdminProfile(user) {
    if (!user) return;
    var displayName = user.fullname || user.username || 'Quản trị viên VLU';
    var email = user.email || 'admin@vluflagship.vn';
    var initial = displayName.charAt(0).toUpperCase();

    var map = {
      sidebarAdminName: displayName,
      topAdminName: displayName,
      dropdownAdminName: displayName,
      dropdownAdminEmail: email,
      sidebarAdminAvatar: initial,
      topAdminAvatar: initial
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = map[id];
    });
    var emailSide = document.getElementById('sidebarAdminEmail');
    if (emailSide) emailSide.textContent = 'Quản trị viên · Online';
  }

  /* ==========================================================================
     2. SIDEBAR COLLAPSE, FLOATING TOOLTIP & DARK MODE
     ========================================================================== */
  function initSidebarState() {
    try {
      if (localStorage.getItem('vlu_admin_sidebar_collapsed') === '1') {
        document.body.classList.add('admin-sidebar-collapsed');
      }
    } catch (e) {}

    function toggleCollapse() {
      var collapsed = document.body.classList.toggle('admin-sidebar-collapsed');
      try { localStorage.setItem('vlu_admin_sidebar_collapsed', collapsed ? '1' : '0'); } catch (e) {}
      var tip = document.getElementById('sidebarFloatingTooltip');
      if (tip) tip.classList.remove('is-visible');
    }

    var btnCollapse = document.getElementById('btnSidebarCollapse');
    if (btnCollapse) btnCollapse.addEventListener('click', toggleCollapse);

    var btnSettingsCollapse = document.getElementById('btnSettingsCollapseSidebar');
    if (btnSettingsCollapse) btnSettingsCollapse.addEventListener('click', toggleCollapse);

    // Tooltip khi Sidebar thu gọn
    var tooltip = document.getElementById('sidebarFloatingTooltip');
    var navBtns = document.querySelectorAll('#adminSidebar [data-tooltip]');
    if (tooltip && navBtns.length) {
      function hideTooltip() {
        tooltip.classList.remove('is-visible');
      }
      navBtns.forEach(function (btn) {
        btn.addEventListener('mouseenter', function () {
          if (!document.body.classList.contains('admin-sidebar-collapsed') || window.innerWidth < 1024) return;
          var label = btn.getAttribute('data-tooltip');
          if (!label) return;
          var rect = btn.getBoundingClientRect();
          tooltip.textContent = label;
          tooltip.style.left = Math.round(rect.right + 12) + 'px';
          var safeTop = Math.max(24, Math.min(window.innerHeight - 24, Math.round(rect.top + rect.height / 2)));
          tooltip.style.top = safeTop + 'px';
          tooltip.style.transform = 'translateY(-50%)';
          tooltip.classList.add('is-visible');
        });
        btn.addEventListener('mouseleave', hideTooltip);
        btn.addEventListener('click', hideTooltip);
      });
      var navScroll = document.querySelector('.sidebar-nav-scroll');
      if (navScroll) navScroll.addEventListener('scroll', hideTooltip, { passive: true });
      window.addEventListener('scroll', hideTooltip, { passive: true });
    }
  }

  function syncThemeIcons() {
    var isDark = document.documentElement.classList.contains('admin-dark');
    var sun = document.getElementById('themeIconSun');
    var moon = document.getElementById('themeIconMoon');
    if (sun) sun.classList.toggle('hidden', !isDark);
    if (moon) moon.classList.toggle('hidden', isDark);
  }

  function toggleDarkMode() {
    var nextDark = !document.documentElement.classList.contains('admin-dark');
    document.documentElement.classList.toggle('admin-dark', nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    try { localStorage.setItem('vlu_admin_theme', nextDark ? 'dark' : 'light'); } catch (e) {}
    syncThemeIcons();
    if (currentTab === 'dashboard') {
      renderRevenueSection();
    }
  }

  function initThemeToggle() {
    syncThemeIcons();
    var btnTheme = document.getElementById('btnAdminThemeToggle');
    var btnSettingsTheme = document.getElementById('btnSettingsDarkMode');
    if (btnTheme) btnTheme.addEventListener('click', toggleDarkMode);
    if (btnSettingsTheme) btnSettingsTheme.addEventListener('click', toggleDarkMode);
  }

  /* ==========================================================================
     3. HEADER POPOVERS, GLOBAL SEARCH & CONTEXTUAL PRIMARY ACTION BUTTON
     ========================================================================== */
  function closeHeaderPopovers() {
    ['adminNotifPopover', 'headerAdminDropdownMenu', 'globalAdminSearchDropdown', 'headerQuickActionMenu'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    var notifBtn = document.getElementById('btnAdminNotifToggle');
    var adminBtn = document.getElementById('headerAdminDropdownBtn');
    if (notifBtn) notifBtn.setAttribute('aria-expanded', 'false');
    if (adminBtn) adminBtn.setAttribute('aria-expanded', 'false');
  }

  function initHeaderPopovers() {
    var notifBtn = document.getElementById('btnAdminNotifToggle');
    var notifPop = document.getElementById('adminNotifPopover');
    var adminBtn = document.getElementById('headerAdminDropdownBtn');
    var adminMenu = document.getElementById('headerAdminDropdownMenu');

    if (notifBtn && notifPop) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = notifPop.classList.contains('hidden');
        closeHeaderPopovers();
        if (willOpen) {
          renderHeaderNotifications();
          notifPop.classList.remove('hidden');
          notifBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    if (adminBtn && adminMenu) {
      adminBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = adminMenu.classList.contains('hidden');
        closeHeaderPopovers();
        if (willOpen) {
          adminMenu.classList.remove('hidden');
          adminBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    var markAllBtn = document.getElementById('btnHeaderMarkAllRead');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.VLU_ADMIN) window.VLU_ADMIN.markAllNotificationsRead();
        renderHeaderNotifications();
      });
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.vlu-popover') &&
          !e.target.closest('#btnAdminNotifToggle') &&
          !e.target.closest('#headerAdminDropdownBtn') &&
          !e.target.closest('.global-search-wrap') &&
          !e.target.closest('#btnQuickActionMenuToggle')) {
        closeHeaderPopovers();
      }
    });
  }

  function renderHeaderNotifications() {
    var engine = window.VLU_ADMIN;
    var listEl = document.getElementById('headerNotifList');
    var subEl = document.getElementById('headerNotifSub');
    if (!engine || !listEl) return;

    var notifs = engine.getAdminNotifications();
    var unread = notifs.filter(function (n) { return !n.read; }).length;
    if (subEl) subEl.textContent = unread > 0 ? (unread + ' thông báo chưa đọc') : 'Tất cả thông báo đã được xem';

    if (!notifs.length) {
      listEl.innerHTML = '<div class="p-6 text-center text-xs" style="color: var(--admin-text-secondary);">Chưa có thông báo nào.</div>';
      return;
    }

    listEl.innerHTML = notifs.slice(0, 7).map(function (n) {
      var dotColor = n.type === 'danger' ? 'bg-red-500' : (n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500');
      return '<button type="button" class="header-notif-item w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-start gap-2.5 ' + (n.read ? 'opacity-70' : '') + '" data-nid="' + escapeHtml(n.id) + '" data-tab="' + escapeHtml(n.targetTab || 'dashboard') + '" data-filter="' + escapeHtml(n.targetFilter || '') + '">' +
        '<span class="mt-1.5 h-2 w-2 rounded-full shrink-0 ' + dotColor + '"></span>' +
        '<div class="min-w-0 flex-1">' +
          '<p class="text-xs font-bold truncate" style="color: var(--admin-text-primary);">' + escapeHtml(n.title) + '</p>' +
          '<p class="text-[11px] line-clamp-2 mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(n.message) + '</p>' +
          '<span class="text-[10px] text-slate-400 mt-1 block">' + escapeHtml(engine.formatRelativeTime(n.created_at)) + '</span>' +
        '</div>' +
      '</button>';
    }).join('');

    listEl.querySelectorAll('.header-notif-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nid = btn.getAttribute('data-nid');
        var tab = btn.getAttribute('data-tab');
        var flt = btn.getAttribute('data-filter');
        engine.markNotificationRead(nid);
        closeHeaderPopovers();
        navigateWithFilter(tab, flt);
      });
    });
  }

  function initGlobalSearch() {
    var input = document.getElementById('globalAdminSearchInput');
    var dropdown = document.getElementById('globalAdminSearchDropdown');
    if (!input || !dropdown) return;

    function renderResults() {
      var q = input.value.trim();
      if (!q) {
        dropdown.classList.add('hidden');
        return;
      }
      var engine = window.VLU_ADMIN;
      if (!engine) return;
      var res = engine.globalSearch(q);
      var total = res.products.length + res.orders.length + res.users.length;

      if (total === 0) {
        dropdown.innerHTML = '<div class="p-5 text-center text-xs" style="color: var(--admin-text-secondary);">Không tìm thấy kết quả phù hợp cho "<strong>' + escapeHtml(q) + '</strong>"</div>';
        dropdown.classList.remove('hidden');
        return;
      }

      var html = '';
      if (res.products.length) {
        html += '<div class="px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider border-b border-slate-100" style="color: var(--admin-text-secondary); background: var(--admin-bg-sub);">Sản phẩm (' + res.products.length + ')</div>';
        res.products.forEach(function (p) {
          html += '<button type="button" class="gs-item-product w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-left" data-id="' + escapeHtml(p.id) + '" data-name="' + escapeHtml(p.name) + '">' +
            '<img src="' + escapeHtml(safeImage(p.image, p.category)) + '" class="h-8 w-8 rounded-lg object-contain bg-white border border-slate-100 p-0.5 shrink-0" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';">' +
            '<div class="min-w-0 flex-1">' +
              '<p class="text-xs font-bold truncate" style="color: var(--admin-text-primary);">' + escapeHtml(p.name) + '</p>' +
              '<p class="text-[11px]" style="color: var(--admin-text-secondary);">' + escapeHtml(p.brand || p.category_name) + ' · ' + escapeHtml(p.product_category_name || '') + '</p>' +
            '</div>' +
            '<span class="text-xs font-extrabold text-brand shrink-0">' + escapeHtml(engine.formatVND(p.price)) + '</span>' +
          '</button>';
        });
      }

      if (res.orders.length) {
        html += '<div class="px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider border-y border-slate-100" style="color: var(--admin-text-secondary); background: var(--admin-bg-sub);">Đơn hàng (' + res.orders.length + ')</div>';
        res.orders.forEach(function (o) {
          var ordCode = formatOrderCode(o.order_code || o.id);
          html += '<button type="button" class="gs-item-order w-full px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-left" data-id="' + escapeHtml(ordCode) + '">' +
            '<div class="min-w-0">' +
              '<p class="text-xs font-bold font-mono text-brand">' + escapeHtml(ordCode) + '</p>' +
              '<p class="text-[11px] truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(o.customer_name) + ' · ' + escapeHtml(o.customer_phone) + '</p>' +
            '</div>' +
            '<span class="text-xs font-bold shrink-0" style="color: var(--admin-text-primary);">' + escapeHtml(engine.formatVND(o.total)) + '</span>' +
          '</button>';
        });
      }

      if (res.users.length) {
        html += '<div class="px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider border-y border-slate-100" style="color: var(--admin-text-secondary); background: var(--admin-bg-sub);">Khách hàng (' + res.users.length + ')</div>';
        res.users.forEach(function (u) {
          html += '<button type="button" class="gs-item-user w-full px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-left" data-query="' + escapeHtml(u.fullname || u.email || u.username) + '">' +
            '<div class="min-w-0">' +
              '<p class="text-xs font-bold truncate" style="color: var(--admin-text-primary);">' + escapeHtml(u.fullname || u.username) + '</p>' +
              '<p class="text-[11px] truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(u.email || u.username) + '</p>' +
            '</div>' +
            '<span class="vlu-badge vlu-badge-neutral shrink-0">' + (Number(u.role) === 1 ? 'Admin' : 'Khách hàng') + '</span>' +
          '</button>';
        });
      }

      dropdown.innerHTML = html;
      dropdown.classList.remove('hidden');

      dropdown.querySelectorAll('.gs-item-product').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var pName = btn.getAttribute('data-name');
          var searchEl = document.getElementById('productSearchInput');
          var catSel = document.getElementById('productDeviceCategoryFilter');
          var brandSel = document.getElementById('productCategoryFilter');
          var stockSel = document.getElementById('productStockFilter');
          if (searchEl) searchEl.value = pName;
          if (catSel) catSel.value = 'all';
          if (brandSel) brandSel.value = 'all';
          if (stockSel) stockSel.value = 'all';
          productsPage = 1;
          closeHeaderPopovers();
          switchTab('products');
        });
      });

      dropdown.querySelectorAll('.gs-item-order').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var oId = btn.getAttribute('data-id');
          closeHeaderPopovers();
          switchTab('orders');
          openOrderDetailModal(oId);
        });
      });

      dropdown.querySelectorAll('.gs-item-user').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var uq = btn.getAttribute('data-query');
          var uInput = document.getElementById('userSearchInput');
          var uFilter = document.getElementById('userFilterSelect');
          if (uInput) uInput.value = uq;
          if (uFilter) uFilter.value = 'all';
          closeHeaderPopovers();
          switchTab('users');
        });
      });
    }

    var mobileSearchBtn = document.getElementById('btnMobileSearchToggle');
    var searchWrap = document.getElementById('globalSearchWrap');
    if (mobileSearchBtn && searchWrap) {
      mobileSearchBtn.addEventListener('click', function () {
        var willOpen = searchWrap.classList.contains('hidden');
        searchWrap.classList.toggle('hidden', !willOpen);
        if (willOpen) {
          input.focus();
          input.select();
        }
      });
    }

    input.addEventListener('input', renderResults);
    input.addEventListener('focus', function () {
      if (input.value.trim()) renderResults();
    });

    document.addEventListener('keydown', function (e) {
      if ((e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) ||
          ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        if (searchWrap && searchWrap.classList.contains('hidden')) {
          searchWrap.classList.remove('hidden');
        }
        input.focus();
        input.select();
      }
    });
  }

  /**
   * SỬA DỨT ĐIỂM NÚT HÀNH ĐỘNG NGỮ CẢNH TRÊN HEADER (MỤC 4)
   */
  function renderContextualHeaderActions(tabId) {
    var container = document.getElementById('headerContextualActions');
    if (!container) return;

    var engine = window.VLU_ADMIN;
    var html = '';

    if (tabId === 'dashboard') {
      html =
        '<div class="relative">' +
          '<button type="button" id="btnQuickActionMenuToggle" class="vlu-btn vlu-btn-primary">' +
            '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>' +
            '<span class="hidden sm:inline">Hành động nhanh</span>' +
            '<svg class="h-3.5 w-3.5 opacity-80" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>' +
          '</button>' +
          '<div id="headerQuickActionMenu" class="vlu-popover hidden w-56 p-1.5">' +
            '<button type="button" data-quick-action="add-product" class="vlu-dropdown-item font-bold">+ Thêm sản phẩm mới</button>' +
            '<button type="button" data-quick-action="add-category" class="vlu-dropdown-item">+ Thêm danh mục thiết bị</button>' +
            '<button type="button" data-quick-action="add-brand" class="vlu-dropdown-item">+ Thêm thương hiệu</button>' +
            '<div class="my-1 border-t border-slate-100"></div>' +
            '<button type="button" data-quick-action="pending-orders" class="vlu-dropdown-item !text-amber-600">Xem đơn chờ xử lý</button>' +
            '<button type="button" data-quick-action="refresh" class="vlu-dropdown-item" style="color: var(--admin-text-secondary);">Làm mới dữ liệu</button>' +
          '</div>' +
        '</div>';
    } else if (tabId === 'products') {
      html =
        '<button type="button" id="btnHeaderAddProduct" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Thêm sản phẩm</span>' +
        '</button>';
    } else if (tabId === 'categories') {
      html =
        '<button type="button" id="btnHeaderAddCategory" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Thêm danh mục</span>' +
        '</button>';
    } else if (tabId === 'brands') {
      html =
        '<button type="button" id="btnHeaderAddBrand" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Thêm thương hiệu</span>' +
        '</button>';
    } else if (tabId === 'orders') {
      // TUYỆT ĐỐI KHÔNG hiển thị nút Thêm sản phẩm khi ở Quản lý đơn hàng
      html =
        '<button type="button" id="btnHeaderExportOrders" class="vlu-btn vlu-btn-secondary">' +
          '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>' +
          '<span class="hidden sm:inline">Xuất danh sách đơn</span>' +
          '<span class="sm:hidden">Xuất CSV</span>' +
        '</button>' +
        '<button type="button" id="btnHeaderRefreshData" class="vlu-btn vlu-btn-primary">' +
          '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>' +
          '<span class="hidden sm:inline">Làm mới dữ liệu</span>' +
        '</button>';
    } else if (tabId === 'users') {
      // TUYỆT ĐỐI KHÔNG hiển thị nút Thêm sản phẩm khi ở Quản lý tài khoản
      html =
        '<button type="button" id="btnHeaderRefreshData" class="vlu-btn vlu-btn-secondary">' +
          '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>' +
          '<span>Làm mới tài khoản</span>' +
        '</button>';
    } else if (tabId === 'inventory') {
      html =
        '<button type="button" id="btnHeaderExportInventory" class="vlu-btn vlu-btn-secondary">' +
          '<span>Xuất Báo cáo Kho</span>' +
        '</button>' +
        '<button type="button" id="btnHeaderAddInventoryMove" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Lập phiếu Kho</span>' +
        '</button>';
    } else if (tabId === 'payments') {
      html =
        '<button type="button" id="btnHeaderExportPayments" class="vlu-btn vlu-btn-primary">' +
          '<span>Xuất Báo cáo Tài chính</span>' +
        '</button>';
    } else if (tabId === 'returns') {
      html =
        '<button type="button" id="btnHeaderAddReturn" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Tiếp nhận Đổi trả / BH</span>' +
        '</button>';
    } else if (tabId === 'vouchers') {
      html =
        '<button type="button" id="btnHeaderAddVoucher" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Thêm Voucher mới</span>' +
        '</button>';
    } else if (tabId === 'promotions') {
      html =
        '<button type="button" id="btnHeaderAddPromotion" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Tạo Chiến dịch Flash Sale</span>' +
        '</button>';
    } else if (tabId === 'notifications') {
      html =
        '<button type="button" id="btnHeaderNotifReadAll" class="vlu-btn vlu-btn-secondary">' +
          '<span>Đánh dấu đã đọc</span>' +
        '</button>' +
        '<button type="button" id="btnHeaderSendCustomerNotif" class="vlu-btn vlu-btn-primary">' +
          '<span>+ Gửi thông báo khách</span>' +
        '</button>';
    } else if (tabId === 'activity-log') {
      html =
        '<button type="button" id="btnHeaderExportActivity" class="vlu-btn vlu-btn-primary">' +
          '<span>Xuất Nhật ký CSV</span>' +
        '</button>';
    } else {
      html =
        '<button type="button" id="btnHeaderRefreshData" class="vlu-btn vlu-btn-secondary">' +
          '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>' +
          '<span class="hidden sm:inline">Làm mới dữ liệu</span>' +
        '</button>';
    }

    container.innerHTML = html;

    // Wire contextual action events
    var qaToggle = document.getElementById('btnQuickActionMenuToggle');
    var qaMenu = document.getElementById('headerQuickActionMenu');
    if (qaToggle && qaMenu) {
      qaToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = qaMenu.classList.contains('hidden');
        closeHeaderPopovers();
        if (open) qaMenu.classList.remove('hidden');
      });
      qaMenu.querySelectorAll('[data-quick-action]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var act = btn.getAttribute('data-quick-action');
          closeHeaderPopovers();
          if (act === 'add-product') openAddProductModal();
          else if (act === 'add-category') openAddCategoryModal();
          else if (act === 'add-brand') openAddBrandModal();
          else if (act === 'pending-orders') navigateWithFilter('orders', 'pending');
          else if (act === 'refresh') refreshAllData();
        });
      });
    }

    var addProd = document.getElementById('btnHeaderAddProduct');
    if (addProd) addProd.addEventListener('click', openAddProductModal);

    var addCat = document.getElementById('btnHeaderAddCategory');
    if (addCat) addCat.addEventListener('click', openAddCategoryModal);

    var addBrand = document.getElementById('btnHeaderAddBrand');
    if (addBrand) addBrand.addEventListener('click', openAddBrandModal);

    var addInvMv = document.getElementById('btnHeaderAddInventoryMove');
    if (addInvMv) addInvMv.addEventListener('click', function () { openInventoryMovementModal(); });

    var expInv = document.getElementById('btnHeaderExportInventory');
    if (expInv) expInv.addEventListener('click', exportInventoryCSV);

    var expPay = document.getElementById('btnHeaderExportPayments');
    if (expPay) expPay.addEventListener('click', exportPaymentsCSV);

    var addRet = document.getElementById('btnHeaderAddReturn');
    if (addRet) addRet.addEventListener('click', function () { openReturnTicketModal(); });

    var addVch = document.getElementById('btnHeaderAddVoucher');
    if (addVch) addVch.addEventListener('click', function () { openVoucherModal(); });

    var addPromo = document.getElementById('btnHeaderAddPromotion');
    if (addPromo) addPromo.addEventListener('click', function () { openPromotionModal(); });

    var expOrd = document.getElementById('btnHeaderExportOrders');
    if (expOrd) expOrd.addEventListener('click', exportOrdersCSV);

    var refBtn = document.getElementById('btnHeaderRefreshData');
    if (refBtn) refBtn.addEventListener('click', refreshAllData);

    var notifReadBtn = document.getElementById('btnHeaderNotifReadAll');
    if (notifReadBtn && engine) {
      notifReadBtn.addEventListener('click', function () {
        engine.markAllNotificationsRead();
        engine.showToast('Đã đánh dấu tất cả thông báo là đã đọc.');
      });
    }

    var sendCustNotifBtn = document.getElementById('btnHeaderSendCustomerNotif');
    if (sendCustNotifBtn) sendCustNotifBtn.addEventListener('click', openSendNotificationModal);

    var expActBtn = document.getElementById('btnHeaderExportActivity');
    if (expActBtn) expActBtn.addEventListener('click', exportActivityLogsCSV);
  }

  function refreshAllData() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    engine.showToast('Đang đồng bộ dữ liệu hệ thống...');
    Promise.resolve(engine.syncWithBackend()).then(function () {
      syncSidebarAndHeaderBadges();
      renderCurrentTab();
      engine.showToast('Dữ liệu đã được cập nhật mới nhất.');
    });
  }

  function triggerDownload(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function toCsvString(rows) {
    return '\uFEFF' + rows.map(function (r) {
      return r.map(function (cell) {
        return '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"';
      }).join(',');
    }).join('\r\n');
  }

  function exportOrdersCSV() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var orders = typeof getFilteredSortedOrders === 'function' && currentTab === 'orders'
      ? getFilteredSortedOrders()
      : engine.getOrders();
    if (!orders.length) {
      engine.showToast('Không có đơn hàng nào để xuất.', true);
      return;
    }
    var rows = [['Ma don', 'Ngay dat', 'Khach hang', 'Loai khach', 'SDT', 'Email', 'Dia chi', 'PT thanh toan', 'TT thanh toan', 'Tong tien', 'Trang thai don', 'Cap nhat cuoi', 'Ly do huy']];
    orders.forEach(function (o) {
      var isGuest = (!o.user_id || String(o.user_id).toLowerCase() === 'guest') && (!o.user_identity || String(o.user_identity).toLowerCase() === 'guest');
      var paySt = engine.resolveOrderPaymentStatus(o);
      rows.push([
        o.id || '',
        engine.formatDateTime ? engine.formatDateTime(o.created_at) : engine.formatDate(o.created_at),
        o.customer_name || '',
        isGuest ? 'Khách vãng lai' : 'Thành viên',
        o.customer_phone || '',
        o.customer_email || '',
        (o.customer_address || '').replace(/[\r\n]+/g, ' '),
        o.payment_method || 'COD',
        engine.getOrderPaymentStatusLabel(paySt),
        o.total || 0,
        engine.getOrderStatusLabel(o.status),
        o.updated_at ? (engine.formatDateTime ? engine.formatDateTime(o.updated_at) : o.updated_at) : '',
        (o.cancel_reason || '').replace(/[\r\n]+/g, ' ')
      ]);
    });
    triggerDownload('vlu-orders-' + new Date().toISOString().slice(0, 10) + '.csv', toCsvString(rows), 'text/csv;charset=utf-8;');
    engine.showToast('Đã xuất ' + orders.length + ' đơn hàng ra file CSV!');
  }

  function exportOrdersJSON() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var orders = typeof getFilteredSortedOrders === 'function' && currentTab === 'orders'
      ? getFilteredSortedOrders()
      : engine.getOrders();
    if (!orders.length) {
      engine.showToast('Không có đơn hàng nào để xuất.', true);
      return;
    }
    triggerDownload('vlu-orders-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(orders, null, 2), 'application/json;charset=utf-8;');
    engine.showToast('Đã xuất ' + orders.length + ' đơn hàng ra file JSON!');
  }

  function exportInventoryCSV() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var products = engine.getProducts();
    var logs = engine.getInventoryLogs();
    var inMap = {}, outMap = {};
    logs.forEach(function (lg) {
      var pid = String(lg.productId || '');
      if (!pid) return;
      if (lg.type === 'inbound') inMap[pid] = (inMap[pid] || 0) + Math.abs(Number(lg.delta) || 0);
      else if (lg.type === 'outbound') outMap[pid] = (outMap[pid] || 0) + Math.abs(Number(lg.delta) || 0);
    });
    var rows = [['Ma SKU', 'Ten san pham', 'Danh muc', 'Thuong hieu', 'Ton hien tai', 'Tong nhap kho', 'Tong xuat kho', 'Nguong canh bao', 'Bien the / Mau sac', 'Cap nhat cuoi']];
    products.forEach(function (p) {
      var pid = String(p.id);
      var colorsText = (Array.isArray(p.colors) ? p.colors : []).map(function (c) {
        return (c.name || c.key) + (c.stock !== undefined ? ('(' + c.stock + ')') : '');
      }).join('; ');
      rows.push([
        p.sku || pid,
        p.name || '',
        p.product_category_name || p.category || '',
        p.brand || p.category_name || '',
        Number(p.stock) || 0,
        inMap[pid] || 0,
        outMap[pid] || 0,
        Number(p.stock_threshold) || engine.getSystemSettings().defaultLowStockThreshold || 5,
        colorsText,
        p.updated_at || p.created_at || ''
      ]);
    });
    triggerDownload('vlu-inventory-report-' + new Date().toISOString().slice(0, 10) + '.csv', toCsvString(rows), 'text/csv;charset=utf-8;');
    engine.showToast('Đã xuất báo cáo Nhập - Xuất - Tồn (' + products.length + ' SKU)!');
  }

  function exportInventoryJSON() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var payload = {
      exportedAt: new Date().toISOString(),
      kpis: engine.calculateInventoryKpis(),
      products: engine.getProducts(),
      movements: engine.getInventoryLogs()
    };
    triggerDownload('vlu-inventory-report-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8;');
    engine.showToast('Đã xuất báo cáo kho JSON thành công!');
  }

  function exportPaymentsCSV() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var orders = engine.getOrders();
    var rows = [['Ma don', 'Khach hang', 'PT Thanh toan', 'Voucher', 'Tong tien', 'TT Thanh toan', 'TT Don hang', 'Ma doi soat', 'Ngay dat']];
    orders.forEach(function (o) {
      rows.push([
        o.id || '',
        o.customer_name || '',
        o.payment_method || 'COD',
        o.voucher_code || '',
        Number(o.total) || 0,
        engine.getOrderPaymentStatusLabel(engine.resolveOrderPaymentStatus(o)),
        engine.getOrderStatusLabel(o.status),
        o.payment_ref || '',
        engine.formatDateTime ? engine.formatDateTime(o.created_at) : engine.formatDate(o.created_at)
      ]);
    });
    triggerDownload('vlu-payments-' + new Date().toISOString().slice(0, 10) + '.csv', toCsvString(rows), 'text/csv;charset=utf-8;');
    engine.showToast('Đã xuất báo cáo Tài chính / Thanh toán (' + orders.length + ' giao dịch)!');
  }

  function exportActivityLogsCSV() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var events = engine.getRecentActivityFeed(120);
    var rows = [['Thoi gian', 'Nhom', 'Loai su kien', 'Tieu de', 'Chi tiet', 'Nguoi thuc hien']];
    events.forEach(function (ev) {
      rows.push([
        ev.created_at || '',
        ev.source || '',
        ev.type || '',
        ev.title || '',
        ev.detail || '',
        ev.actor || ''
      ]);
    });
    triggerDownload('vlu-activity-logs-' + new Date().toISOString().slice(0, 10) + '.csv', toCsvString(rows), 'text/csv;charset=utf-8;');
    engine.showToast('Đã xuất ' + events.length + ' dòng nhật ký hoạt động!');
  }

  function exportFullSystemBackupFile() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var backup = engine.exportFullSystemBackup();
    triggerDownload('vlu-flagship-backup-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(backup, null, 2), 'application/json;charset=utf-8;');
    engine.showToast('Đã xuất sao lưu JSON toàn bộ hệ thống (không bao gồm mật khẩu)!');
  }

  /* ==========================================================================
     4. TAB ROUTER & ĐIỀU HƯỚNG KÈM BỘ LỌC
     ========================================================================== */
  function initTabRouter() {
    document.addEventListener('click', function (e) {
      var targetBtn = e.target.closest('[data-tab-target]');
      if (!targetBtn) return;
      var target = targetBtn.getAttribute('data-tab-target');
      if (target) {
        closeHeaderPopovers();
        switchTab(target);
      }
    });
  }

  function navigateWithFilter(tabId, filterVal) {
    if (tabId === 'orders' && filterVal) {
      orderFilterStatus = filterVal;
      ordersPage = 1;
      syncOrderFilterButtons();
    } else if (tabId === 'products' && filterVal) {
      populateProductSelects();
      var searchEl = document.getElementById('productSearchInput');
      var stockSel = document.getElementById('productStockFilter');
      var brandSel = document.getElementById('productCategoryFilter');
      var catSel = document.getElementById('productDeviceCategoryFilter');
      var priceSel = document.getElementById('productPriceRangeFilter');
      var statusSel = document.getElementById('productStatusFilter');
      var customPriceWrap = document.getElementById('productCustomPriceWrap');
      var priceMinEl = document.getElementById('productPriceMinInput');
      var priceMaxEl = document.getElementById('productPriceMaxInput');

      if (searchEl) searchEl.value = '';
      if (priceSel) priceSel.value = 'all';
      if (statusSel) statusSel.value = 'all';
      if (priceMinEl) priceMinEl.value = '';
      if (priceMaxEl) priceMaxEl.value = '';
      if (customPriceWrap) customPriceWrap.classList.add('hidden');

      if (filterVal === 'low_stock' || filterVal === 'out_of_stock' || filterVal === 'all') {
        if (stockSel) stockSel.value = filterVal;
        if (brandSel) brandSel.value = 'all';
        if (catSel) catSel.value = 'all';
      } else if (filterVal.indexOf('brand:') === 0) {
        if (brandSel) brandSel.value = filterVal.replace('brand:', '');
        if (stockSel) stockSel.value = 'all';
        if (catSel) catSel.value = 'all';
      } else if (filterVal.indexOf('cat:') === 0) {
        if (catSel) catSel.value = filterVal.replace('cat:', '');
        if (brandSel) brandSel.value = 'all';
        if (stockSel) stockSel.value = 'all';
      }
      productsPage = 1;
    } else if (tabId === 'inventory' && filterVal) {
      inventoryViewMode = 'stock';
      inventoryPage = 1;
      var invFlt = document.getElementById('inventoryFilterSelect');
      if (invFlt) invFlt.value = filterVal;
    } else if (tabId === 'users' && filterVal) {
      userKpiQuickFilter = filterVal;
      usersPage = 1;
    }
    switchTab(tabId);
  }

  function switchTab(tabId) {
    if (!TAB_META[tabId]) tabId = 'dashboard';
    currentTab = tabId;
    document.body.classList.remove('admin-sidebar-mobile-open');

    // Update Sidebar Active State (#D10D32)
    var navItems = document.querySelectorAll('#adminSidebar [data-tab-target]');
    navItems.forEach(function (btn) {
      var target = btn.getAttribute('data-tab-target');
      btn.classList.toggle('is-active', target === tabId);
    });

    // Switch Tab Panel
    var panels = document.querySelectorAll('.admin-tab-panel');
    panels.forEach(function (p) {
      p.classList.add('hidden');
      p.classList.remove('animate-tab-in');
    });
    var activePanel = document.getElementById('tabPanel-' + tabId);
    if (activePanel) {
      activePanel.classList.remove('hidden');
      activePanel.classList.add('animate-tab-in');
    }

    // Update Breadcrumb & Page Title
    var meta = TAB_META[tabId];
    var groupEl = document.getElementById('topbarBreadcrumbGroup');
    var crumbEl = document.getElementById('topbarBreadcrumb');
    var titleEl = document.getElementById('topbarPageTitle');
    if (groupEl) groupEl.textContent = meta.group;
    if (crumbEl) crumbEl.textContent = meta.breadcrumb;
    if (titleEl) titleEl.textContent = meta.title;

    // Update Contextual Primary Action Button on Header
    renderContextualHeaderActions(tabId);

    // Sync from Backend when entering key views
    if ((tabId === 'dashboard' || tabId === 'orders' || tabId === 'users') && window.VLU_ADMIN && typeof window.VLU_ADMIN.syncWithBackend === 'function') {
      window.VLU_ADMIN.syncWithBackend();
    }

    renderCurrentTab();

    if (window.scrollY > 120) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function renderCurrentTab() {
    switch (currentTab) {
      case 'dashboard':     renderDashboard(); break;
      case 'products':      renderProducts(); break;
      case 'categories':    renderCategories(); break;
      case 'brands':        renderBrands(); break;
      case 'inventory':     renderInventory(); break;
      case 'orders':        renderOrders(); break;
      case 'payments':      renderPayments(); break;
      case 'returns':       renderReturns(); break;
      case 'users':         renderUsers(); break;
      case 'members':       renderMembers(); break;
      case 'reviews':       renderReviews(); break;
      case 'vouchers':      renderVouchers(); break;
      case 'promotions':    renderPromotions(); break;
      case 'notifications': renderNotifications(); break;
      case 'activity-log':  renderActivityLog(); break;
      case 'settings':      renderSettings(); break;
    }
  }

  function syncSidebarAndHeaderBadges() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var stats = engine.calculateStats();
    var notifs = engine.getAdminNotifications();
    var unreadNotifs = notifs.filter(function (n) { return !n.read; }).length;

    var prodBadge = document.getElementById('sidebarProdCount');
    if (prodBadge) prodBadge.textContent = stats.productCount;

    var pendBadge = document.getElementById('sidebarOrderPendingBadge');
    var pendDot = document.getElementById('sidebarOrderPendingDot');
    if (pendBadge) {
      pendBadge.textContent = stats.pendingOrders;
      pendBadge.classList.toggle('hidden', stats.pendingOrders <= 0);
    }
    if (pendDot) pendDot.classList.toggle('has-count', stats.pendingOrders > 0);

    var lowBadge = document.getElementById('sidebarLowStockBadge');
    var lowDot = document.getElementById('sidebarLowStockDot');
    if (lowBadge) {
      lowBadge.textContent = stats.lowStockCount;
      lowBadge.classList.toggle('hidden', stats.lowStockCount <= 0);
    }
    if (lowDot) lowDot.classList.toggle('has-count', stats.lowStockCount > 0);

    var sideNotif = document.getElementById('sidebarNotifBadge');
    var sideNotifDot = document.getElementById('sidebarNotifDot');
    var headNotif = document.getElementById('headerNotifBadge');
    if (sideNotif) {
      sideNotif.textContent = unreadNotifs;
      sideNotif.classList.toggle('hidden', unreadNotifs <= 0);
    }
    if (sideNotifDot) sideNotifDot.classList.toggle('has-count', unreadNotifs > 0);
    if (headNotif) {
      headNotif.textContent = unreadNotifs > 99 ? '99+' : unreadNotifs;
      headNotif.classList.toggle('hidden', unreadNotifs <= 0);
    }
  }

  /* ==========================================================================
     5. DASHBOARD RENDERER (8 KPI + BIỂU ĐỒ + PHÂN BỐ TÁCH BIỆT + FEED)
     ========================================================================== */
  function formatGrowthHtml(growthObj, compareText) {
    if (!growthObj) return '<span style="color: var(--admin-text-secondary);">' + escapeHtml(compareText) + '</span>';
    if (!growthObj.hasBaseline) {
      return '<span class="text-emerald-600 font-bold">● ' + escapeHtml(growthObj.label) + '</span> <span style="color: var(--admin-text-secondary);">' + escapeHtml(compareText) + '</span>';
    }
    var arrow = growthObj.direction === 'up' ? '↑ ' : (growthObj.direction === 'down' ? '↓ ' : '• ');
    var clr = growthObj.direction === 'up' ? 'text-emerald-600' : (growthObj.direction === 'down' ? 'text-red-500' : 'text-slate-500');
    return '<span class="' + clr + ' font-bold tabular-nums">' + arrow + escapeHtml(growthObj.label) + '</span> <span style="color: var(--admin-text-secondary);">' + escapeHtml(compareText) + '</span>';
  }

  function initDashboardControls() {
    // KPI Cards Click Navigation
    document.querySelectorAll('[data-kpi-nav]').forEach(function (card) {
      card.addEventListener('click', function () {
        var nav = card.getAttribute('data-kpi-nav');
        var flt = card.getAttribute('data-kpi-filter') || '';
        navigateWithFilter(nav, flt);
      });
    });

    // Revenue Chart Granularity Buttons
    document.querySelectorAll('[data-rev-granularity]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var gran = btn.getAttribute('data-rev-granularity');
        revState.granularity = gran;
        revState.startDate = '';
        revState.endDate = '';
        document.querySelectorAll('[data-rev-granularity]').forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('bg-brand', active);
          b.classList.toggle('text-white', active);
          b.classList.toggle('text-slate-500', !active);
        });
        renderRevenueSection();
      });
    });

    var startInput = document.getElementById('revStartDate');
    var endInput = document.getElementById('revEndDate');
    var compareToggle = document.getElementById('revCompareToggle');
    var resetBtn = document.getElementById('btnRevResetRange');

    if (startInput) {
      startInput.addEventListener('change', function () {
        revState.startDate = startInput.value;
        renderRevenueSection();
      });
    }
    if (endInput) {
      endInput.addEventListener('change', function () {
        revState.endDate = endInput.value;
        renderRevenueSection();
      });
    }
    if (compareToggle) {
      compareToggle.addEventListener('change', function () {
        revState.compare = compareToggle.checked;
        renderRevenueSection();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        revState.startDate = '';
        revState.endDate = '';
        renderRevenueSection();
      });
    }

    // Brand / Category distribution mode selectors
    var brandMode = document.getElementById('brandDistMode');
    var catMode = document.getElementById('catDistMode');
    if (brandMode) brandMode.addEventListener('change', renderBrandDistribution);
    if (catMode) catMode.addEventListener('change', renderCategoryDistribution);

    // Product Analytics sub-tabs
    document.querySelectorAll('[data-prod-analytics-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeProdAnalyticsTab = btn.getAttribute('data-prod-analytics-tab');
        document.querySelectorAll('[data-prod-analytics-tab]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        renderProductAnalytics();
      });
    });
  }

  function renderDashboard() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    var m = engine.calculateDashboardMetrics();

    // 1. Update 8 KPI Cards
    var elRev = document.getElementById('statTotalRevenue');
    var elRevG = document.getElementById('statRevenueGrowth');
    var elToday = document.getElementById('statTodayRevenue');
    var elTodayG = document.getElementById('statTodayGrowth');
    var elOrd = document.getElementById('statTotalOrders');
    var elOrdG = document.getElementById('statOrdersGrowth');
    var elPendCnt = document.getElementById('statPendingOrdersCount');
    var elPendSub = document.getElementById('statPendingOrders');
    var elProd = document.getElementById('statTotalProducts');
    var elProdMeta = document.getElementById('statProductsMeta');
    var elLow = document.getElementById('statLowStockProducts');
    var elLowMeta = document.getElementById('statLowStockMeta');
    var elUser = document.getElementById('statTotalUsers');
    var elUserG = document.getElementById('statUsersGrowth');
    var elNewU = document.getElementById('statNewUsersMonth');
    var elNewUG = document.getElementById('statNewUsersGrowth');

    if (elRev) elRev.textContent = engine.formatVND(m.totalRevenue);
    if (elRevG) elRevG.innerHTML = formatGrowthHtml(m.revenueGrowth, 'so với tháng trước');

    if (elToday) elToday.textContent = engine.formatVND(m.todayRevenue);
    if (elTodayG) elTodayG.innerHTML = formatGrowthHtml(m.todayGrowth, 'so với hôm qua (' + m.todayOrders + ' đơn)');

    if (elOrd) elOrd.textContent = m.totalOrders + ' đơn';
    if (elOrdG) elOrdG.innerHTML = formatGrowthHtml(m.ordersGrowth, 'so với tháng trước');

    if (elPendCnt) elPendCnt.textContent = m.pendingOrders + ' đơn';
    if (elPendSub) {
      elPendSub.innerHTML = m.pendingOrders > 0
        ? '<span class="text-amber-600 font-bold">' + m.pendingSharePct + '% tổng đơn · Nhấn để duyệt →</span>'
        : '<span class="text-emerald-600 font-bold">Đã xử lý toàn bộ đơn chờ</span>';
    }

    if (elProd) elProd.textContent = m.totalProducts + ' sản phẩm';
    if (elProdMeta) elProdMeta.textContent = m.activeCategoriesCount + ' danh mục · ' + m.activeBrandsCount + ' thương hiệu';

    if (elLow) elLow.textContent = m.lowStockProducts + ' sản phẩm';
    if (elLowMeta) {
      if (m.lowStockProducts > 0) {
        elLowMeta.innerHTML = '<span class="text-red-500 font-bold">' + m.outOfStockCount + ' hết hàng · ' + m.lowStockOnlyCount + ' sắp hết (≤5)</span>';
      } else {
        elLowMeta.innerHTML = '<span class="text-emerald-600 font-bold">Kho hàng ổn định (100% > 5)</span>';
      }
    }

    if (elUser) elUser.textContent = m.totalCustomers + ' khách hàng';
    if (elUserG) elUserG.innerHTML = formatGrowthHtml(m.customersGrowth, 'so với tháng trước · ' + m.totalAccounts + ' TK');

    if (elNewU) elNewU.textContent = m.newCustomersThisMonth + ' khách mới';
    if (elNewUG) elNewUG.innerHTML = formatGrowthHtml(m.newCustomersGrowth, 'so với tháng trước');

    // 2. Render Revenue Chart, Order Status Donut, Separated Distributions, Product Analytics, Activity Feed, Recent Orders
    renderRevenueSection();
    renderOrderStatusSection();
    renderBrandDistribution();
    renderCategoryDistribution();
    renderProductAnalytics();
    renderRecentActivityFeed();
    renderDashboardRecentOrders();
  }

  function renderRevenueSection() {
    var engine = window.VLU_ADMIN;
    var charts = window.VLU_ADMIN_CHARTS;
    if (!engine || !charts) return;

    var series = engine.getRevenueSeries(revState);

    var startInput = document.getElementById('revStartDate');
    var endInput = document.getElementById('revEndDate');
    if (startInput && !revState.startDate) startInput.value = series.startKey;
    if (endInput && !revState.endDate) endInput.value = series.endKey;

    var deltaBadge = document.getElementById('revPeriodDeltaBadge');
    if (deltaBadge) {
      if (series.compare && series.growth.hasBaseline) {
        var dirCls = series.growth.direction === 'up' ? 'vlu-badge-success' : (series.growth.direction === 'down' ? 'vlu-badge-danger' : 'vlu-badge-neutral');
        deltaBadge.className = 'vlu-badge ' + dirCls;
        deltaBadge.textContent = (series.growth.direction === 'up' ? '↑ ' : (series.growth.direction === 'down' ? '↓ ' : '')) + series.growth.label + ' vs kỳ trước';
      } else if (series.compare && !series.growth.hasBaseline) {
        deltaBadge.className = 'vlu-badge vlu-badge-success';
        deltaBadge.textContent = 'Mới phát sinh doanh thu';
      } else {
        deltaBadge.className = 'vlu-badge vlu-badge-neutral';
        deltaBadge.textContent = series.buckets.length + ' mốc thời gian';
      }
    }

    var summaryEl = document.getElementById('revSummaryStats');
    if (summaryEl) {
      summaryEl.innerHTML =
        '<div>' +
          '<p class="text-[11px] font-semibold" style="color: var(--admin-text-secondary);">Doanh thu kỳ chọn</p>' +
          '<p class="text-sm font-extrabold text-brand tabular-nums mt-0.5">' + escapeHtml(engine.formatVND(series.totalRevenue)) + '</p>' +
        '</div>' +
        '<div>' +
          '<p class="text-[11px] font-semibold" style="color: var(--admin-text-secondary);">Đơn hợp lệ</p>' +
          '<p class="text-sm font-extrabold tabular-nums mt-0.5" style="color: var(--admin-text-primary);">' + series.orderCount + ' đơn</p>' +
        '</div>' +
        '<div>' +
          '<p class="text-[11px] font-semibold" style="color: var(--admin-text-secondary);">Giá trị đơn TB (AOV)</p>' +
          '<p class="text-sm font-extrabold tabular-nums mt-0.5" style="color: var(--admin-text-primary);">' + escapeHtml(engine.formatVND(series.avgOrderValue)) + '</p>' +
        '</div>' +
        '<div>' +
          '<p class="text-[11px] font-semibold" style="color: var(--admin-text-secondary);">Doanh thu kỳ trước</p>' +
          '<p class="text-sm font-extrabold tabular-nums mt-0.5" style="color: var(--admin-text-secondary);">' + (series.compare ? escapeHtml(engine.formatVND(series.prevTotalRevenue)) : 'Đang tắt') + '</p>' +
        '</div>';
    }

    charts.renderRevenueChart(
      document.getElementById('revenueChartContainer'),
      document.getElementById('revenueChartTooltip'),
      series
    );
  }

  function renderOrderStatusSection() {
    var engine = window.VLU_ADMIN;
    var charts = window.VLU_ADMIN_CHARTS;
    if (!engine || !charts) return;
    var breakdown = engine.getOrderStatusBreakdown();
    charts.renderOrderStatusDonut(
      document.getElementById('orderStatusDonutContainer'),
      breakdown,
      function (statusKey) {
        navigateWithFilter('orders', statusKey);
      }
    );
  }

  function renderBrandDistribution() {
    var engine = window.VLU_ADMIN;
    var container = document.getElementById('brandBreakdownContainer');
    var sumBadge = document.getElementById('brandDistSummaryBadge');
    if (!engine || !container) return;

    var modeSel = document.getElementById('brandDistMode');
    var mode = modeSel ? modeSel.value : 'products';
    var data = engine.getBrandDistribution();

    if (sumBadge) sumBadge.textContent = data.length + ' thương hiệu';

    if (!data.length) {
      container.innerHTML = '<div class="vlu-empty-state py-8"><p class="text-xs">Chưa có dữ liệu thương hiệu.</p></div>';
      return;
    }

    var sorted = data.slice();
    var totalVal = 0;
    if (mode === 'sales') {
      sorted.sort(function (a, b) {
        if (b.salesRevenue !== a.salesRevenue) return b.salesRevenue - a.salesRevenue;
        return b.salesUnits - a.salesUnits;
      });
      totalVal = sorted.reduce(function (s, x) { return s + x.salesRevenue; }, 0);
      var soldBrands = sorted.filter(function (x) { return x.salesUnits > 0; });
      if (sumBadge) sumBadge.textContent = soldBrands.length + ' hãng phát sinh bán';
    } else {
      totalVal = sorted.reduce(function (s, x) { return s + x.count; }, 0);
    }

    var palette = ['#D10D32', '#151B2B', '#2563EB', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6', '#0EA5E9'];
    var brands = engine.getBrands();

    container.innerHTML = sorted.map(function (item, idx) {
      var val = mode === 'sales' ? item.salesRevenue : item.count;
      var pct = totalVal > 0 ? Math.round((val / totalVal) * 1000) / 10 : 0;
      var color = palette[idx % palette.length];
      var rightText = mode === 'sales'
        ? (item.salesUnits + ' SP · ' + engine.formatVND(item.salesRevenue) + ' (' + pct + '%)')
        : (item.count + ' SP (' + pct + '%)');
      var matchedBrand = brands.find(function (b) { return b.name.toLowerCase() === item.name.toLowerCase(); });

      return '<button type="button" class="dist-brand-row w-full text-left space-y-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition" data-brand-id="' + (matchedBrand ? matchedBrand.id : 'all') + '">' +
        '<div class="flex justify-between items-center text-xs gap-2">' +
          '<span class="font-bold truncate flex items-center gap-2" style="color: var(--admin-text-primary);">' +
            '<span class="h-2 w-2 rounded-full shrink-0" style="background:' + color + ';"></span>' +
            '<span>' + escapeHtml(item.name) + '</span>' +
          '</span>' +
          '<span class="font-semibold text-[11px] tabular-nums shrink-0" style="color: var(--admin-text-secondary);">' + escapeHtml(rightText) + '</span>' +
        '</div>' +
        '<div class="h-2 w-full rounded-full overflow-hidden" style="background: var(--admin-bg-main);">' +
          '<div class="h-full rounded-full transition-all duration-500" style="width: ' + pct + '%; background: ' + color + ';"></div>' +
        '</div>' +
      '</button>';
    }).join('');

    container.querySelectorAll('.dist-brand-row').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var bId = btn.getAttribute('data-brand-id');
        navigateWithFilter('products', 'brand:' + bId);
      });
    });
  }

  function renderCategoryDistribution() {
    var engine = window.VLU_ADMIN;
    var container = document.getElementById('categoryBreakdownContainer');
    var sumBadge = document.getElementById('catDistSummaryBadge');
    if (!engine || !container) return;

    var modeSel = document.getElementById('catDistMode');
    var mode = modeSel ? modeSel.value : 'products';
    var data = engine.getCategoryDistribution();

    if (sumBadge) sumBadge.textContent = data.length + ' danh mục';

    if (!data.length) {
      container.innerHTML = '<div class="vlu-empty-state py-8"><p class="text-xs">Chưa có dữ liệu danh mục.</p></div>';
      return;
    }

    var sorted = data.slice();
    var totalVal = 0;
    if (mode === 'sales') {
      sorted.sort(function (a, b) {
        if (b.salesRevenue !== a.salesRevenue) return b.salesRevenue - a.salesRevenue;
        return b.salesUnits - a.salesUnits;
      });
      totalVal = sorted.reduce(function (s, x) { return s + x.salesRevenue; }, 0);
      var soldCats = sorted.filter(function (x) { return x.salesUnits > 0; });
      if (sumBadge) sumBadge.textContent = soldCats.length + ' nhóm phát sinh bán';
    } else {
      totalVal = sorted.reduce(function (s, x) { return s + x.count; }, 0);
    }

    var palette = ['#2563EB', '#10B981', '#D10D32', '#F59E0B', '#6366F1', '#0D9488'];

    container.innerHTML = sorted.map(function (item, idx) {
      var val = mode === 'sales' ? item.salesRevenue : item.count;
      var pct = totalVal > 0 ? Math.round((val / totalVal) * 1000) / 10 : 0;
      var color = palette[idx % palette.length];
      var rightText = mode === 'sales'
        ? (item.salesUnits + ' SP · ' + engine.formatVND(item.salesRevenue) + ' (' + pct + '%)')
        : (item.count + ' SP (' + pct + '%)');

      return '<button type="button" class="dist-cat-row w-full text-left space-y-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition" data-cat-slug="' + escapeHtml(item.slug) + '">' +
        '<div class="flex justify-between items-center text-xs gap-2">' +
          '<span class="font-bold flex items-center gap-2 truncate" style="color: var(--admin-text-primary);">' +
            '<span class="h-2 w-2 rounded-full shrink-0" style="background:' + color + ';"></span>' +
            '<span>' + escapeHtml(item.name) + '</span>' +
          '</span>' +
          '<span class="font-semibold text-[11px] tabular-nums shrink-0" style="color: var(--admin-text-secondary);">' + escapeHtml(rightText) + '</span>' +
        '</div>' +
        '<div class="h-2 w-full rounded-full overflow-hidden" style="background: var(--admin-bg-main);">' +
          '<div class="h-full rounded-full transition-all duration-500" style="width: ' + pct + '%; background: ' + color + ';"></div>' +
        '</div>' +
      '</button>';
    }).join('');

    container.querySelectorAll('.dist-cat-row').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slug = btn.getAttribute('data-cat-slug');
        navigateWithFilter('products', 'cat:' + slug);
      });
    });
  }

  function renderProductAnalytics() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var analytics = engine.getProductAnalytics();

    var topCatEl = document.getElementById('topCategoryHighlight');
    var topBrandEl = document.getElementById('topBrandHighlight');
    var listEl = document.getElementById('productAnalyticsListContainer');
    var lowBadge = document.getElementById('lowStockTabCount');
    if (lowBadge) {
      lowBadge.textContent = '(' + (analytics.lowStockTotal != null ? analytics.lowStockTotal : analytics.lowStock.length) + ')';
    }

    if (topCatEl) {
      if (analytics.topCategory) {
        topCatEl.innerHTML =
          '<button type="button" class="w-full text-left group" data-nav-cat="' + escapeHtml(analytics.topCategory.slug) + '">' +
            '<p class="text-[10px] font-extrabold uppercase tracking-wider text-brand">Danh mục bán chạy nhất</p>' +
            '<p class="text-sm font-extrabold mt-1 group-hover:text-brand transition" style="color: var(--admin-text-primary);">' + escapeHtml(analytics.topCategory.name) + ' →</p>' +
            '<p class="text-xs mt-0.5 tabular-nums" style="color: var(--admin-text-secondary);">' + analytics.topCategory.units + ' đã bán · ' + escapeHtml(engine.formatVND(analytics.topCategory.revenue)) + '</p>' +
          '</button>';
        var catBtn = topCatEl.querySelector('[data-nav-cat]');
        if (catBtn) {
          catBtn.addEventListener('click', function () {
            navigateWithFilter('products', 'cat:' + catBtn.getAttribute('data-nav-cat'));
          });
        }
      } else {
        topCatEl.innerHTML = '<p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Danh mục bán chạy nhất</p><p class="text-xs mt-1" style="color: var(--admin-text-secondary);">Chưa có dữ liệu bán hàng</p>';
      }
    }

    if (topBrandEl) {
      if (analytics.topBrand) {
        var brandsList = engine.getBrands();
        var topBrObj = brandsList.find(function (b) { return b.name.toLowerCase() === String(analytics.topBrand.name).toLowerCase(); });
        topBrandEl.innerHTML =
          '<button type="button" class="w-full text-left group" data-nav-brand="' + (topBrObj ? topBrObj.id : 'all') + '">' +
            '<p class="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">Thương hiệu mua nhiều nhất</p>' +
            '<p class="text-sm font-extrabold mt-1 group-hover:text-indigo-600 transition" style="color: var(--admin-text-primary);">' + escapeHtml(analytics.topBrand.name) + ' →</p>' +
            '<p class="text-xs mt-0.5 tabular-nums" style="color: var(--admin-text-secondary);">' + analytics.topBrand.units + ' đã bán · ' + escapeHtml(engine.formatVND(analytics.topBrand.revenue)) + '</p>' +
          '</button>';
        var brBtn = topBrandEl.querySelector('[data-nav-brand]');
        if (brBtn) {
          brBtn.addEventListener('click', function () {
            navigateWithFilter('products', 'brand:' + brBtn.getAttribute('data-nav-brand'));
          });
        }
      } else {
        topBrandEl.innerHTML = '<p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Thương hiệu mua nhiều nhất</p><p class="text-xs mt-1" style="color: var(--admin-text-secondary);">Chưa có dữ liệu bán hàng</p>';
      }
    }

    if (!listEl) return;
    var items = analytics[activeProdAnalyticsTab] || [];

    if (!items.length) {
      var emptyMsg = activeProdAnalyticsTab === 'lowStock'
        ? 'Tuyệt vời! Hiện không có sản phẩm nào sắp hết hàng (≤ 5).'
        : 'Chưa có dữ liệu đơn hàng cho mục thống kê này.';
      listEl.innerHTML = '<div class="vlu-empty-state py-8"><p class="text-xs font-semibold">' + escapeHtml(emptyMsg) + '</p></div>';
      return;
    }

    listEl.innerHTML = items.map(function (item, idx) {
      var img = safeImage(item.image, item.category);
      var rightCol = '';
      if (activeProdAnalyticsTab === 'topSelling') {
        rightCol = '<p class="text-xs font-extrabold text-brand tabular-nums">' + item.unitsSold + ' đã bán</p><p class="text-[11px] tabular-nums" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatVND(item.revenue)) + '</p>';
      } else if (activeProdAnalyticsTab === 'topRevenue') {
        rightCol = '<p class="text-xs font-extrabold text-brand tabular-nums">' + escapeHtml(engine.formatVND(item.revenue)) + '</p><p class="text-[11px] tabular-nums" style="color: var(--admin-text-secondary);">' + item.unitsSold + ' đã bán</p>';
      } else if (activeProdAnalyticsTab === 'lowStock') {
        var stClr = Number(item.stock) <= 0 ? 'vlu-badge-danger' : 'vlu-badge-warning';
        rightCol = '<span class="vlu-badge ' + stClr + '">' + (Number(item.stock) <= 0 ? 'Hết hàng (0)' : 'Còn ' + item.stock) + '</span>';
      } else {
        var stockVal = (Number(item.stock) || 0) * (Number(item.price) || 0);
        rightCol = '<p class="text-xs font-extrabold text-emerald-600 tabular-nums">Tồn: ' + item.stock + '</p><p class="text-[11px] tabular-nums" style="color: var(--admin-text-secondary);">' + (stockVal > 0 ? escapeHtml(engine.formatCompactVND(stockVal)) : 'Giá liên hệ') + '</p>';
      }

      return '<button type="button" class="btn-edit-product w-full text-left py-2.5 px-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition flex items-center justify-between gap-3" data-id="' + escapeHtml(item.id) + '">' +
        '<div class="flex items-center gap-3 min-w-0">' +
          '<span class="w-5 text-center text-xs font-extrabold tabular-nums" style="color: var(--admin-text-secondary);">#' + (idx + 1) + '</span>' +
          '<img src="' + escapeHtml(img) + '" alt="" class="h-10 w-10 rounded-xl bg-white border border-slate-100 p-1 object-contain shrink-0" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';">' +
          '<div class="min-w-0">' +
            '<p class="text-xs font-bold truncate" style="color: var(--admin-text-primary);">' + escapeHtml(item.name) + '</p>' +
            '<p class="text-[11px] truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(item.brand || item.category_name || '') + ' · ' + escapeHtml(item.categoryName || item.product_category_name || '') + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="text-right shrink-0">' + rightCol + '</div>' +
      '</button>';
    }).join('');
  }

  function renderRecentActivityFeed() {
    var engine = window.VLU_ADMIN;
    var container = document.getElementById('dashboardActivityFeed');
    if (!engine || !container) return;

    var feed = engine.getRecentActivityFeed(12);
    if (!feed.length) {
      container.innerHTML = '<div class="vlu-empty-state py-8"><p class="text-xs">Chưa có hoạt động nào được ghi nhận.</p></div>';
      return;
    }

    var svgCart = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>';
    var svgTruck = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>';
    var svgTrash = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>';
    var svgUser = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/></svg>';
    var svgBox = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>';
    var svgEdit = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"/></svg>';
    var svgShield = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>';
    var svgBolt = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>';

    var iconMap = {
      order_new:       { bg: 'bg-emerald-500/10 text-emerald-600', icon: svgCart },
      order_status:    { bg: 'bg-blue-500/10 text-blue-600',       icon: svgTruck },
      order_delete:    { bg: 'bg-red-500/10 text-red-600',         icon: svgTrash },
      user_register:   { bg: 'bg-violet-500/10 text-violet-600',   icon: svgUser },
      product_add:     { bg: 'bg-brand/10 text-brand',             icon: svgBox },
      product_edit:    { bg: 'bg-amber-500/10 text-amber-600',     icon: svgEdit },
      product_delete:  { bg: 'bg-red-500/10 text-red-600',         icon: svgTrash },
      product_reset:   { bg: 'bg-indigo-500/10 text-indigo-600',   icon: svgBolt },
      stock_update:    { bg: 'bg-teal-500/10 text-teal-600',       icon: svgBox },
      category_add:    { bg: 'bg-blue-500/10 text-blue-600',       icon: svgBox },
      category_edit:   { bg: 'bg-amber-500/10 text-amber-600',     icon: svgEdit },
      category_delete: { bg: 'bg-red-500/10 text-red-600',         icon: svgTrash },
      brand_add:       { bg: 'bg-indigo-500/10 text-indigo-600',   icon: svgBox },
      brand_edit:      { bg: 'bg-amber-500/10 text-amber-600',     icon: svgEdit },
      brand_delete:    { bg: 'bg-red-500/10 text-red-600',         icon: svgTrash },
      admin_login:     { bg: 'bg-slate-500/10 text-slate-600',     icon: svgShield }
    };

    container.innerHTML = feed.map(function (ev) {
      var meta = iconMap[ev.type] || { bg: 'bg-slate-500/10 text-slate-500', icon: svgBolt };
      return '<button type="button" class="feed-item-btn w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition" data-tab="' + escapeHtml(ev.targetTab || 'dashboard') + '" data-id="' + escapeHtml(ev.targetId || '') + '">' +
        '<span class="h-8 w-8 rounded-lg grid place-items-center shrink-0 ' + meta.bg + '">' + meta.icon + '</span>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-center justify-between gap-2">' +
            '<p class="text-xs font-bold truncate" style="color: var(--admin-text-primary);">' + escapeHtml(ev.title) + '</p>' +
            '<span class="text-[10px] shrink-0" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatRelativeTime(ev.created_at)) + '</span>' +
          '</div>' +
          '<p class="text-[11px] truncate mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(ev.detail) + '</p>' +
        '</div>' +
      '</button>';
    }).join('');

    container.querySelectorAll('.feed-item-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-tab');
        var id = btn.getAttribute('data-id');
        if (tab === 'orders' && id) {
          switchTab('orders');
          openOrderDetailModal(id);
        } else if (tab) {
          switchTab(tab);
        }
      });
    });
  }

  function renderDashboardRecentOrders() {
    var engine = window.VLU_ADMIN;
    var recentTbody = document.getElementById('dashboardRecentOrdersBody');
    if (!engine || !recentTbody) return;

    var orders = engine.getOrders().slice(0, 5);
    if (!orders.length) {
      recentTbody.innerHTML = emptyRowHtml(6, 'Chưa có đơn hàng nào', 'Các đơn đặt mới từ cửa hàng hoặc MySQL sẽ tự động hiển thị tại đây.');
      return;
    }

    recentTbody.innerHTML = orders.map(function (o) {
      var ordCode = formatOrderCode(o.order_code || o.id);
      return '<tr>' +
        '<td class="font-mono font-bold text-xs">' + escapeHtml(ordCode) + '</td>' +
        '<td class="font-semibold">' + escapeHtml(o.customer_name) + '</td>' +
        '<td class="text-xs whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDate(o.created_at)) + '</td>' +
        '<td class="font-extrabold text-brand tabular-nums whitespace-nowrap">' + escapeHtml(engine.formatVND(o.total)) + '</td>' +
        '<td>' + engine.getStatusBadge(o.status) + '</td>' +
        '<td class="text-right"><button type="button" class="btn-view-order vlu-btn vlu-btn-secondary vlu-btn-sm" data-id="' + escapeHtml(ordCode) + '">Xem</button></td>' +
      '</tr>';
    }).join('');
  }

  /* ==========================================================================
     6. QUẢN LÝ SẢN PHẨM CHUYÊN SÂU (LỌC ĐA TIÊU CHÍ, BULK, PREVIEW, EXPORT)
     ========================================================================== */
  function populateProductSelects() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var brands = engine.getBrands();
    var prodCats = engine.getProductCategories();

    // Filter Danh mục thiết bị
    var catFilter = document.getElementById('productDeviceCategoryFilter');
    if (catFilter) {
      var curCat = catFilter.value || 'all';
      catFilter.innerHTML = '<option value="all">Tất cả danh mục</option>';
      prodCats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.slug;
        opt.textContent = c.name;
        catFilter.appendChild(opt);
      });
      catFilter.value = curCat;
    }

    // Filter Thương hiệu (giữ ID productCategoryFilter cho tương thích)
    var brandFilter = document.getElementById('productCategoryFilter');
    if (brandFilter) {
      var curBrand = brandFilter.value || 'all';
      brandFilter.innerHTML = '<option value="all">Tất cả thương hiệu</option>';
      brands.forEach(function (b) {
        var opt = document.createElement('option');
        opt.value = String(b.id);
        opt.textContent = b.name;
        brandFilter.appendChild(opt);
      });
      brandFilter.value = curBrand;
    }

    // Modal Select Danh mục thiết bị
    var modalProdCat = document.getElementById('prodModalProductCategory');
    if (modalProdCat) {
      var curModalCat = modalProdCat.value;
      modalProdCat.innerHTML = '';
      prodCats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.slug;
        opt.textContent = c.name;
        modalProdCat.appendChild(opt);
      });
      if (curModalCat) modalProdCat.value = curModalCat;
    }

    // Modal Select Thương hiệu
    var formBrand = document.getElementById('prodModalCategory');
    if (formBrand) {
      var curVal = formBrand.value;
      formBrand.innerHTML = '';
      brands.forEach(function (b) {
        var opt = document.createElement('option');
        opt.value = String(b.id);
        opt.textContent = b.name;
        formBrand.appendChild(opt);
      });
      if (curVal) formBrand.value = curVal;
    }

    // Bulk Action Move Category Select
    var bulkMoveCat = document.getElementById('bulkMoveCategorySelect');
    if (bulkMoveCat) {
      var curBulkCat = bulkMoveCat.value;
      bulkMoveCat.innerHTML = '';
      prodCats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.slug;
        opt.textContent = c.name;
        bulkMoveCat.appendChild(opt);
      });
      if (curBulkCat) bulkMoveCat.value = curBulkCat;
    }
  }

  function renderPagination(container, totalItems, currentPage, pageSize, onPageChange) {
    if (!container) return;
    var effectiveSize = pageSize >= totalItems && totalItems > 0 ? totalItems : Math.max(1, pageSize || 15);
    var totalPages = Math.max(1, Math.ceil(totalItems / effectiveSize));
    if (currentPage > totalPages) currentPage = totalPages;

    var start = totalItems === 0 ? 0 : (currentPage - 1) * effectiveSize + 1;
    var end = Math.min(totalItems, currentPage * effectiveSize);

    var btns = '<button type="button" class="vlu-page-btn" data-page="' + (currentPage - 1) + '"' + (currentPage <= 1 ? ' disabled' : '') + '>‹</button>';
    var maxVisible = 5;
    var startP = Math.max(1, currentPage - 2);
    var endP = Math.min(totalPages, startP + maxVisible - 1);
    if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);

    for (var p = startP; p <= endP; p++) {
      btns += '<button type="button" class="vlu-page-btn ' + (p === currentPage ? 'is-active' : '') + '" data-page="' + p + '">' + p + '</button>';
    }
    btns += '<button type="button" class="vlu-page-btn" data-page="' + (currentPage + 1) + '"' + (currentPage >= totalPages ? ' disabled' : '') + '>›</button>';

    container.innerHTML =
      '<span>Hiển thị <strong>' + start + '–' + end + '</strong> trong tổng số <strong>' + totalItems + '</strong> mục</span>' +
      '<div class="flex items-center gap-1">' + btns + '</div>';

    container.querySelectorAll('.vlu-page-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        var nextP = parseInt(btn.getAttribute('data-page'), 10);
        if (nextP >= 1 && nextP <= totalPages) onPageChange(nextP);
      });
    });
  }

  function getFilteredSortedProducts() {
    var engine = window.VLU_ADMIN;
    if (!engine) return [];
    var products = engine.getProducts();

    var searchInput = document.getElementById('productSearchInput');
    var catFilter = document.getElementById('productDeviceCategoryFilter');
    var brandFilter = document.getElementById('productCategoryFilter');
    var priceFilter = document.getElementById('productPriceRangeFilter');
    var minPriceEl = document.getElementById('productPriceMinInput');
    var maxPriceEl = document.getElementById('productPriceMaxInput');
    var stockFilter = document.getElementById('productStockFilter');
    var statusFilter = document.getElementById('productStatusFilter');
    var sortSelect = document.getElementById('productSortSelect');

    var query = searchInput ? engine.normalizeText(searchInput.value) : '';
    var selectedCat = catFilter ? catFilter.value : 'all';
    var selectedBrand = brandFilter ? brandFilter.value : 'all';
    var selectedPrice = priceFilter ? priceFilter.value : 'all';
    var minCustom = minPriceEl && minPriceEl.value !== '' ? Number(minPriceEl.value) : null;
    var maxCustom = maxPriceEl && maxPriceEl.value !== '' ? Number(maxPriceEl.value) : null;
    var selectedStock = stockFilter ? stockFilter.value : 'all';
    var selectedStatus = statusFilter ? statusFilter.value : 'all';
    var sortKey = sortSelect ? sortSelect.value : 'newest';

    var indexed = products.map(function (p, i) { return { p: p, idx: i }; });

    var filtered = indexed.filter(function (entry) {
      var p = entry.p;
      var price = Number(p.price) || 0;
      var stock = Number(p.stock) || 0;
      var threshold = Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : 5;
      var status = p.status || 'active';

      var matchSearch = !query ||
        engine.normalizeText(p.name).indexOf(query) !== -1 ||
        engine.normalizeText(p.sku || '').indexOf(query) !== -1 ||
        String(p.id).toLowerCase().indexOf(query) !== -1 ||
        engine.normalizeText(p.brand || p.category_name).indexOf(query) !== -1;

      var matchCat = selectedCat === 'all' || String(p.category || p.category_slug) === selectedCat;
      var matchBrand = selectedBrand === 'all' ||
        String(p.category_id) === selectedBrand ||
        String(p.brand || p.category_name || '').toLowerCase() === selectedBrand.toLowerCase();

      var matchPrice = true;
      if (selectedPrice === 'under_5m') matchPrice = price > 0 && price < 5000000;
      else if (selectedPrice === '5_15m') matchPrice = price >= 5000000 && price <= 15000000;
      else if (selectedPrice === '15_30m') matchPrice = price > 15000000 && price <= 30000000;
      else if (selectedPrice === 'over_30m') matchPrice = price > 30000000;
      else if (selectedPrice === 'custom') {
        if (minCustom !== null && !isNaN(minCustom) && price < minCustom) matchPrice = false;
        if (maxCustom !== null && !isNaN(maxCustom) && price > maxCustom) matchPrice = false;
      }

      var matchStock = selectedStock === 'all' ||
        (selectedStock === 'in_stock' && stock > threshold) ||
        (selectedStock === 'low_stock' && stock > 0 && stock <= threshold) ||
        (selectedStock === 'out_of_stock' && stock <= 0);

      var matchStatus = selectedStatus === 'all' ||
        (selectedStatus === 'active' && status !== 'hidden') ||
        (selectedStatus === 'hidden' && status === 'hidden') ||
        (selectedStatus === 'contact_price' && price <= 0);

      return matchSearch && matchCat && matchBrand && matchPrice && matchStock && matchStatus;
    });

    filtered.sort(function (aWrap, bWrap) {
      var a = aWrap.p, b = bWrap.p;
      if (sortKey === 'updated_desc') {
        var ta = engine.parseDateSafe(a.updated_at || a.created_at);
        var tb = engine.parseDateSafe(b.updated_at || b.created_at);
        var diff = (tb ? tb.getTime() : 0) - (ta ? ta.getTime() : 0);
        return diff !== 0 ? diff : aWrap.idx - bWrap.idx;
      }
      if (sortKey === 'price_asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortKey === 'price_desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortKey === 'stock_asc') return (Number(a.stock) || 0) - (Number(b.stock) || 0);
      if (sortKey === 'stock_desc') return (Number(b.stock) || 0) - (Number(a.stock) || 0);
      if (sortKey === 'name_asc') return String(a.name || '').localeCompare(String(b.name || ''), 'vi');
      // newest
      if (Boolean(a.is_custom) !== Boolean(b.is_custom)) return a.is_custom ? -1 : 1;
      var ca = engine.parseDateSafe(a.created_at);
      var cb = engine.parseDateSafe(b.created_at);
      if (ca || cb) {
        var cDiff = (cb ? cb.getTime() : 0) - (ca ? ca.getTime() : 0);
        if (cDiff !== 0) return cDiff;
      }
      return aWrap.idx - bWrap.idx;
    });

    return filtered.map(function (entry) { return entry.p; });
  }

  function syncBulkActionBar(visibleSlice) {
    var engine = window.VLU_ADMIN;
    var existingMap = {};
    if (engine) {
      engine.getProducts().forEach(function (p) { existingMap[String(p.id)] = true; });
    }
    var activeIds = Object.keys(selectedProductIds).filter(function (id) {
      if (!selectedProductIds[id]) return false;
      if (engine && !existingMap[String(id)]) {
        delete selectedProductIds[id];
        return false;
      }
      return true;
    });

    var bar = document.getElementById('productsBulkActionBar');
    var countEl = document.getElementById('bulkSelectedCount');
    if (countEl) countEl.textContent = String(activeIds.length);
    if (bar) bar.classList.toggle('hidden', activeIds.length === 0);

    var selectAll = document.getElementById('prodSelectAllCheckbox');
    if (selectAll) {
      if (!visibleSlice || !visibleSlice.length) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
      } else {
        var checkedOnPage = visibleSlice.filter(function (p) { return Boolean(selectedProductIds[String(p.id)]); }).length;
        selectAll.checked = checkedOnPage === visibleSlice.length;
        selectAll.indeterminate = checkedOnPage > 0 && checkedOnPage < visibleSlice.length;
      }
    }
    return activeIds;
  }

  function resetProductFilters() {
    var ids = {
      productSearchInput: '',
      productDeviceCategoryFilter: 'all',
      productCategoryFilter: 'all',
      productPriceRangeFilter: 'all',
      productPriceMinInput: '',
      productPriceMaxInput: '',
      productStockFilter: 'all',
      productStatusFilter: 'all',
      productSortSelect: 'newest'
    };
    Object.keys(ids).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = ids[id];
    });
    var wrap = document.getElementById('productCustomPriceWrap');
    if (wrap) wrap.classList.add('hidden');
    productsPage = 1;
    renderProducts();
  }

  function downloadFile(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportProductsCSV() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var items = getFilteredSortedProducts();
    if (!items.length) {
      engine.showToast('Không có sản phẩm nào trong bộ lọc để xuất.', true);
      return;
    }
    var rows = [['ID', 'SKU', 'Ten san pham', 'Thuong hieu', 'Danh muc', 'Gia ban', 'Gia goc', 'Ton kho', 'Trang thai', 'Ngay cap nhat']];
    items.forEach(function (p) {
      rows.push([
        p.id || '',
        p.sku || '',
        p.name || '',
        p.brand || p.category_name || '',
        p.product_category_name || p.category || '',
        p.price || 0,
        p.old_price || '',
        p.stock || 0,
        p.status === 'hidden' ? 'Đang ẩn' : 'Đang bán',
        p.updated_at ? engine.formatDate(p.updated_at) : ''
      ]);
    });
    var csv = '\uFEFF' + rows.map(function (r) {
      return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');
    downloadFile('vlu-products-' + new Date().toISOString().slice(0, 10) + '.csv', csv, 'text/csv;charset=utf-8;');
    engine.showToast('Đã xuất ' + items.length + ' sản phẩm ra file CSV!');
  }

  function exportProductsJSON() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var items = getFilteredSortedProducts();
    if (!items.length) {
      engine.showToast('Không có sản phẩm nào trong bộ lọc để xuất.', true);
      return;
    }
    downloadFile('vlu-products-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(items, null, 2), 'application/json;charset=utf-8;');
    engine.showToast('Đã xuất ' + items.length + ' sản phẩm ra file JSON!');
  }

  function renderProducts() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    populateProductSelects();

    var allProducts = engine.getProducts();
    var filtered = getFilteredSortedProducts();
    var tbody = document.getElementById('productsTableBody');
    var countBadge = document.getElementById('productsCountBadge');
    var pageSizeSel = document.getElementById('productsPageSizeSelect');
    var sizeRaw = pageSizeSel ? pageSizeSel.value : String(PRODUCTS_PER_PAGE);
    var pageSize = sizeRaw === 'all' ? Math.max(1, filtered.length) : (parseInt(sizeRaw, 10) || 20);
    PRODUCTS_PER_PAGE = pageSize;

    if (countBadge) countBadge.textContent = filtered.length + ' / ' + allProducts.length + ' sản phẩm';
    if (!tbody) return;

    var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (productsPage > totalPages) productsPage = 1;
    var slice = sizeRaw === 'all' ? filtered : filtered.slice((productsPage - 1) * pageSize, productsPage * pageSize);

    syncBulkActionBar(slice);

    if (slice.length === 0) {
      tbody.innerHTML = emptyRowHtml(10, 'Không tìm thấy sản phẩm nào khớp với bộ lọc', 'Thử thay đổi từ khóa hoặc nhấn "Đặt lại lọc" để xem toàn bộ kho.');
      renderPagination(document.getElementById('productsPagination'), 0, 1, pageSize, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (p) {
      var img = safeImage(p.image, p.category);
      var stock = Number(p.stock) || 0;
      var threshold = Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : 5;
      var stockBadge = stock <= 0
        ? '<span class="vlu-badge vlu-badge-danger">Hết hàng (0)</span>'
        : (stock <= threshold
          ? '<span class="vlu-badge vlu-badge-warning">Sắp hết (' + stock + ')</span>'
          : '<span class="vlu-badge vlu-badge-success">Còn hàng (' + stock + ')</span>');

      var isHidden = p.status === 'hidden';
      var isChecked = Boolean(selectedProductIds[String(p.id)]);
      var has3D = typeof engine.hasEffective3D === 'function' ? engine.hasEffective3D(p) : false;
      var cfg3D = (has3D && typeof engine.getProduct3DConfig === 'function') ? engine.getProduct3DConfig(p.id, p.sku) : null;
      var badge3DTitle = cfg3D && cfg3D.modelUrl
        ? ('Mô hình 3D đã kiểm duyệt: ' + cfg3D.modelUrl + (cfg3D.supportsExplodedView ? ' · Hỗ trợ Tách lớp' : ''))
        : 'Mô hình 3D đã kiểm duyệt';
      var price = Number(p.price) || 0;
      var oldPrice = Number(p.old_price) || 0;
      var discountPct = (price > 0 && oldPrice > price) ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

      return '<tr data-id="' + escapeHtml(p.id) + '">' +
        '<td><input type="checkbox" class="prod-row-checkbox h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30 cursor-pointer" data-id="' + escapeHtml(p.id) + '"' + (isChecked ? ' checked' : '') + '></td>' +
        '<td class="min-w-[260px]">' +
          '<div class="flex items-center gap-3">' +
            '<div class="vlu-prod-thumb-lg shrink-0"><img src="' + escapeHtml(img) + '" alt="' + escapeHtml(p.name) + '" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';"></div>' +
            '<div class="min-w-0">' +
              '<div class="flex items-center gap-1.5">' +
                '<button type="button" class="btn-preview-product text-left font-bold hover:text-brand transition line-clamp-1" data-id="' + escapeHtml(p.id) + '">' + escapeHtml(p.name) + '</button>' +
                (has3D ? '<span class="vlu-badge vlu-badge-info !py-0 !px-1.5 !text-[10px] shrink-0" title="' + escapeHtml(badge3DTitle) + '">3D Đã duyệt</span>' : '') +
              '</div>' +
              (p.description ? '<p class="text-[11px] line-clamp-1 mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(p.description) + '</p>' : '') +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td><code class="vlu-sku-tag">' + escapeHtml(p.sku || String(p.id).toUpperCase()) + '</code></td>' +
        '<td class="font-semibold whitespace-nowrap">' + escapeHtml(p.brand || p.category_name || 'Khác') + '</td>' +
        '<td><span class="vlu-badge vlu-badge-neutral">' + escapeHtml(p.product_category_name || engine.getProductCategoryName(p.category)) + '</span></td>' +
        '<td class="whitespace-nowrap tabular-nums">' +
          '<span class="font-extrabold text-brand">' + (price > 0 ? escapeHtml(engine.formatVND(price)) : '<span class="vlu-badge vlu-badge-warning">Giá liên hệ</span>') + '</span>' +
          (discountPct > 0 ? '<div class="flex items-center gap-1 mt-0.5"><span class="text-[10px] text-slate-400 line-through">' + escapeHtml(engine.formatVND(oldPrice)) + '</span><span class="text-[10px] font-extrabold text-emerald-600">-' + discountPct + '%</span></div>' : '') +
        '</td>' +
        '<td>' + stockBadge + '</td>' +
        '<td class="whitespace-nowrap">' +
          '<div class="flex items-center gap-2">' +
            '<button type="button" class="vlu-switch btn-toggle-product-status ' + (!isHidden ? 'is-on' : '') + '" data-id="' + escapeHtml(p.id) + '" title="' + (!isHidden ? 'Nhấn để ẩn sản phẩm' : 'Nhấn để bật bán') + '" aria-pressed="' + (!isHidden ? 'true' : 'false') + '"></button>' +
            '<span class="text-[11px] font-bold ' + (!isHidden ? 'text-emerald-600' : 'text-slate-400') + '">' + (!isHidden ? 'Đang bán' : 'Đang ẩn') + '</span>' +
          '</div>' +
        '</td>' +
        '<td class="text-xs whitespace-nowrap" style="color: var(--admin-text-secondary);">' + (p.updated_at ? escapeHtml(engine.formatDate(p.updated_at)) : '<span class="opacity-60">Catalog gốc</span>') + '</td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<div class="inline-flex items-center gap-1">' +
            '<button type="button" class="btn-preview-product p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition" data-id="' + escapeHtml(p.id) + '" title="Xem nhanh (Quick Preview)">' +
              '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' +
            '</button>' +
            '<button type="button" class="btn-edit-product p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition" data-id="' + escapeHtml(p.id) + '" title="Chỉnh sửa sản phẩm">' +
              '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg>' +
            '</button>' +
            '<button type="button" class="btn-delete-product p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-id="' + escapeHtml(p.id) + '" title="Xóa sản phẩm">' +
              '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>' +
            '</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('productsPagination'), filtered.length, productsPage, pageSize, function (nextP) {
      productsPage = nextP;
      renderProducts();
    });
  }

  /* ==========================================================================
     7. QUẢN LÝ DANH MỤC (`vlu_admin_categories`) & THƯƠNG HIỆU (`vlu_admin_brands`)
     ========================================================================== */
  function syncViewModeButtons(mode, gridBtnId, tableBtnId, gridElId, tableElId) {
    var gridBtn = document.getElementById(gridBtnId);
    var tableBtn = document.getElementById(tableBtnId);
    var gridEl = document.getElementById(gridElId);
    var tableEl = document.getElementById(tableElId);
    if (gridBtn) gridBtn.classList.toggle('is-active', mode === 'grid');
    if (tableBtn) tableBtn.classList.toggle('is-active', mode === 'table');
    if (gridEl) gridEl.classList.toggle('hidden', mode !== 'grid');
    if (tableEl) tableEl.classList.toggle('hidden', mode !== 'table');
  }

  function renderCategories() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var allCats = engine.getProductCategories();
    var products = engine.getProducts();
    var catById = {};
    allCats.forEach(function (c) { catById[Number(c.id)] = c; });

    var searchEl = document.getElementById('categorySearchInput');
    var statusEl = document.getElementById('categoryStatusFilter');
    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var stFilter = statusEl ? statusEl.value : 'all';

    var filtered = allCats.filter(function (c) {
      var matchQ = !q || engine.normalizeText(c.name).indexOf(q) !== -1 || engine.normalizeText(c.slug).indexOf(q) !== -1 || engine.normalizeText(c.description || '').indexOf(q) !== -1;
      var status = c.status === 'inactive' ? 'inactive' : 'active';
      var matchSt = stFilter === 'all' || status === stFilter;
      return matchQ && matchSt;
    });

    var countBadge = document.getElementById('categoriesCountBadge');
    if (countBadge) countBadge.textContent = filtered.length + ' / ' + allCats.length + ' danh mục';

    syncViewModeButtons(categoryViewMode, 'catViewGridBtn', 'catViewTableBtn', 'categoriesGridView', 'categoriesTableView');

    var canReorder = !q && stFilter === 'all';
    var gridEl = document.getElementById('categoriesGridView');
    var tbody = document.getElementById('categoriesTableBody');

    var rowsData = filtered.map(function (c, idx) {
      var pCount = products.filter(function (p) {
        return String(p.category || p.category_slug) === String(c.slug);
      }).length;
      var parentCat = c.parent_id ? catById[Number(c.parent_id)] : null;
      var isActive = c.status !== 'inactive';
      return { c: c, idx: idx, pCount: pCount, parentName: parentCat ? parentCat.name : '--', isActive: isActive };
    });

    if (gridEl) {
      if (!rowsData.length) {
        gridEl.innerHTML = '<div class="col-span-full vlu-card">' + emptyRowHtml(1, 'Không tìm thấy danh mục phù hợp', 'Thử từ khóa khác hoặc bấm + Thêm danh mục mới.').replace(/^<tr><td[^>]*>|<\/td><\/tr>$/g, '') + '</div>';
      } else {
        gridEl.innerHTML = rowsData.map(function (item) {
          var c = item.c;
          var thumbHtml = c.image
            ? '<img src="' + escapeHtml(safeImage(c.image, c.slug)) + '" alt="' + escapeHtml(c.name) + '" class="h-11 w-11 rounded-xl object-contain bg-white border border-slate-200 p-1" onerror="this.style.display=\'none\';">'
            : '<div class="vlu-brand-monogram text-xl">' + escapeHtml(c.icon || '📦') + '</div>';
          return '<div class="vlu-taxonomy-card">' +
            '<div class="space-y-3">' +
              '<div class="flex items-start justify-between gap-3">' +
                '<div class="flex items-center gap-3 min-w-0">' +
                  thumbHtml +
                  '<div class="min-w-0">' +
                    '<h4 class="font-extrabold text-sm truncate" style="color: var(--admin-text-primary);">' + escapeHtml(c.name) + '</h4>' +
                    '<p class="text-[11px] font-mono" style="color: var(--admin-text-secondary);">/' + escapeHtml(c.slug) + '</p>' +
                  '</div>' +
                '</div>' +
                '<button type="button" class="vlu-switch btn-toggle-category-status ' + (item.isActive ? 'is-on' : '') + '" data-id="' + escapeHtml(c.id) + '" title="Đổi trạng thái hoạt động"></button>' +
              '</div>' +
              '<p class="text-xs line-clamp-2 min-h-[2rem]" style="color: var(--admin-text-secondary);">' + escapeHtml(c.description || 'Chưa có mô tả chi tiết.') + '</p>' +
              '<div class="flex flex-wrap items-center gap-2">' +
                '<span class="vlu-badge vlu-badge-brand">' + item.pCount + ' sản phẩm</span>' +
                (item.parentName !== '--' ? '<span class="vlu-badge vlu-badge-neutral">Cha: ' + escapeHtml(item.parentName) + '</span>' : '') +
                '<span class="vlu-badge ' + (item.isActive ? 'vlu-badge-success' : 'vlu-badge-neutral') + '">' + (item.isActive ? 'Hoạt động' : 'Tạm ẩn') + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">' +
              '<div class="flex items-center gap-1">' +
                '<button type="button" class="vlu-order-btn btn-move-category" data-id="' + escapeHtml(c.id) + '" data-dir="up"' + (!canReorder || item.idx === 0 ? ' disabled' : '') + ' title="Đưa lên">▲</button>' +
                '<button type="button" class="vlu-order-btn btn-move-category" data-id="' + escapeHtml(c.id) + '" data-dir="down"' + (!canReorder || item.idx === rowsData.length - 1 ? ' disabled' : '') + ' title="Đưa xuống">▼</button>' +
              '</div>' +
              '<div class="flex items-center gap-1.5">' +
                '<button type="button" class="vlu-btn vlu-btn-secondary vlu-btn-sm btn-preview-category" data-id="' + escapeHtml(c.id) + '">Xem trước</button>' +
                '<button type="button" class="p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition btn-edit-category" data-id="' + escapeHtml(c.id) + '" title="Sửa danh mục"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg></button>' +
                '<button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition btn-delete-category" data-id="' + escapeHtml(c.id) + '" title="Xóa danh mục"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    if (tbody) {
      if (!rowsData.length) {
        tbody.innerHTML = emptyRowHtml(9, 'Không có danh mục nào phù hợp', 'Thử xóa bộ lọc tìm kiếm hoặc tạo danh mục mới.');
        return;
      }
      tbody.innerHTML = rowsData.map(function (item) {
        var c = item.c;
        var avatar = c.image
          ? '<img src="' + escapeHtml(safeImage(c.image, c.slug)) + '" alt="" class="h-10 w-10 rounded-xl bg-white border border-slate-200 p-1 object-contain" onerror="this.style.display=\'none\';">'
          : '<span class="vlu-brand-monogram !h-10 !w-10 text-lg">' + escapeHtml(c.icon || '📦') + '</span>';
        return '<tr>' +
          '<td><div class="inline-flex items-center gap-1">' +
            '<button type="button" class="vlu-order-btn btn-move-category" data-id="' + escapeHtml(c.id) + '" data-dir="up"' + (!canReorder || item.idx === 0 ? ' disabled' : '') + ' title="Lên">▲</button>' +
            '<button type="button" class="vlu-order-btn btn-move-category" data-id="' + escapeHtml(c.id) + '" data-dir="down"' + (!canReorder || item.idx === rowsData.length - 1 ? ' disabled' : '') + ' title="Xuống">▼</button>' +
          '</div></td>' +
          '<td class="font-mono text-xs text-slate-400">#' + escapeHtml(c.id) + '</td>' +
          '<td><div class="flex items-center gap-2.5">' + avatar + '<div><p class="font-bold">' + escapeHtml(c.name) + '</p><p class="text-[11px] font-mono text-slate-400">/' + escapeHtml(c.slug) + '</p></div></div></td>' +
          '<td class="text-xs">' + escapeHtml(item.parentName) + '</td>' +
          '<td class="text-xs max-w-xs truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(c.description || '--') + '</td>' +
          '<td><button type="button" class="vlu-badge vlu-badge-brand hover:opacity-80 transition btn-preview-category" data-id="' + escapeHtml(c.id) + '">' + item.pCount + ' sản phẩm</button></td>' +
          '<td><div class="flex items-center gap-2"><button type="button" class="vlu-switch btn-toggle-category-status ' + (item.isActive ? 'is-on' : '') + '" data-id="' + escapeHtml(c.id) + '"></button><span class="text-xs font-semibold ' + (item.isActive ? 'text-emerald-600' : 'text-slate-400') + '">' + (item.isActive ? 'Hoạt động' : 'Tạm ẩn') + '</span></div></td>' +
          '<td class="text-xs whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDate(c.updated_at || c.created_at)) + '</td>' +
          '<td class="text-right whitespace-nowrap"><div class="inline-flex items-center gap-1">' +
            '<button type="button" class="btn-preview-category p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition" data-id="' + escapeHtml(c.id) + '" title="Xem trước danh mục"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>' +
            '<button type="button" class="btn-edit-category p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition" data-id="' + escapeHtml(c.id) + '" title="Sửa danh mục"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg></button>' +
            '<button type="button" class="btn-delete-category p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-id="' + escapeHtml(c.id) + '" title="Xóa danh mục"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    }
  }

  function renderBrands() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var allBrands = engine.getBrands();
    var products = engine.getProducts();

    var searchEl = document.getElementById('brandSearchInput');
    var statusEl = document.getElementById('brandStatusFilter');
    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var stFilter = statusEl ? statusEl.value : 'all';

    var filtered = allBrands.filter(function (b) {
      var matchQ = !q ||
        engine.normalizeText(b.name).indexOf(q) !== -1 ||
        engine.normalizeText(b.slug || '').indexOf(q) !== -1 ||
        engine.normalizeText(b.shortCode || '').indexOf(q) !== -1 ||
        engine.normalizeText(b.description || '').indexOf(q) !== -1;
      var status = b.status === 'inactive' ? 'inactive' : 'active';
      var matchSt = stFilter === 'all' || status === stFilter;
      return matchQ && matchSt;
    });

    var countBadge = document.getElementById('brandsCountBadge');
    if (countBadge) countBadge.textContent = filtered.length + ' / ' + allBrands.length + ' thương hiệu';

    syncViewModeButtons(brandViewMode, 'brandViewGridBtn', 'brandViewTableBtn', 'brandsGridView', 'brandsTableView');

    var canReorder = !q && stFilter === 'all';
    var gridEl = document.getElementById('brandsGridView');
    var tbody = document.getElementById('brandsTableBody');

    var rowsData = filtered.map(function (b, idx) {
      var pCount = products.filter(function (p) {
        return Number(p.category_id) === Number(b.id) || String(p.brand || p.category_name || '').toLowerCase() === String(b.name).toLowerCase();
      }).length;
      var isActive = b.status !== 'inactive';
      return { b: b, idx: idx, pCount: pCount, isActive: isActive };
    });

    if (gridEl) {
      if (!rowsData.length) {
        gridEl.innerHTML = '<div class="col-span-full vlu-card">' + emptyRowHtml(1, 'Không tìm thấy thương hiệu phù hợp', 'Thử từ khóa khác hoặc bấm + Thêm thương hiệu mới.').replace(/^<tr><td[^>]*>|<\/td><\/tr>$/g, '') + '</div>';
      } else {
        gridEl.innerHTML = rowsData.map(function (item) {
          var b = item.b;
          var badgeHtml = b.logo
            ? '<div class="vlu-brand-monogram p-1 bg-white"><img src="' + escapeHtml(b.logo) + '" alt="' + escapeHtml(b.name) + '" class="max-h-full max-w-full object-contain" onerror="this.parentNode.textContent=\'' + escapeHtml(b.shortCode || 'BR') + '\';"></div>'
            : '<div class="vlu-brand-monogram">' + escapeHtml(b.shortCode || String(b.name || 'BR').slice(0, 3).toUpperCase()) + '</div>';
          return '<div class="vlu-taxonomy-card">' +
            '<div class="space-y-3">' +
              '<div class="flex items-start justify-between gap-2.5">' +
                '<div class="flex items-center gap-3 min-w-0">' +
                  badgeHtml +
                  '<div class="min-w-0">' +
                    '<h4 class="font-extrabold text-sm truncate" style="color: var(--admin-text-primary);">' + escapeHtml(b.name) + '</h4>' +
                    '<p class="text-[11px] font-mono" style="color: var(--admin-text-secondary);">/' + escapeHtml(b.slug || '') + ' · #' + escapeHtml(b.id) + '</p>' +
                  '</div>' +
                '</div>' +
                '<button type="button" class="vlu-switch btn-toggle-brand-status ' + (item.isActive ? 'is-on' : '') + '" data-id="' + escapeHtml(b.id) + '" title="Đổi trạng thái thương hiệu"></button>' +
              '</div>' +
              '<p class="text-xs line-clamp-2 min-h-[2rem]" style="color: var(--admin-text-secondary);">' + escapeHtml(b.description || 'Đối tác phân phối chính hãng VLU Store.') + '</p>' +
              '<div class="flex flex-wrap items-center gap-2">' +
                '<span class="vlu-badge ' + (item.pCount > 0 ? 'vlu-badge-brand' : 'vlu-badge-neutral') + '">' + item.pCount + ' sản phẩm</span>' +
                '<span class="vlu-badge ' + (item.isActive ? 'vlu-badge-success' : 'vlu-badge-neutral') + '">' + (item.isActive ? 'Đang hợp tác' : 'Tạm ngừng') + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">' +
              '<div class="flex items-center gap-1">' +
                '<button type="button" class="vlu-order-btn btn-move-brand" data-id="' + escapeHtml(b.id) + '" data-dir="up"' + (!canReorder || item.idx === 0 ? ' disabled' : '') + ' title="Đưa lên">▲</button>' +
                '<button type="button" class="vlu-order-btn btn-move-brand" data-id="' + escapeHtml(b.id) + '" data-dir="down"' + (!canReorder || item.idx === rowsData.length - 1 ? ' disabled' : '') + ' title="Đưa xuống">▼</button>' +
              '</div>' +
              '<div class="flex items-center gap-1.5">' +
                '<button type="button" class="vlu-btn vlu-btn-secondary vlu-btn-sm btn-preview-brand" data-id="' + escapeHtml(b.id) + '">Xem trước</button>' +
                '<button type="button" class="p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition btn-edit-brand" data-id="' + escapeHtml(b.id) + '" title="Sửa thương hiệu"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg></button>' +
                '<button type="button" class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition btn-delete-brand" data-id="' + escapeHtml(b.id) + '" title="Xóa thương hiệu"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    if (tbody) {
      if (!rowsData.length) {
        tbody.innerHTML = emptyRowHtml(8, 'Không có thương hiệu phù hợp', 'Thử từ khóa khác hoặc tạo mới thương hiệu.');
        return;
      }
      tbody.innerHTML = rowsData.map(function (item) {
        var b = item.b;
        var badgeHtml = b.logo
          ? '<span class="vlu-brand-monogram !h-10 !w-10 p-1 bg-white"><img src="' + escapeHtml(b.logo) + '" alt="" class="max-h-full max-w-full object-contain"></span>'
          : '<span class="vlu-brand-monogram !h-10 !w-10">' + escapeHtml(b.shortCode || 'BR') + '</span>';
        return '<tr>' +
          '<td><div class="inline-flex items-center gap-1">' +
            '<button type="button" class="vlu-order-btn btn-move-brand" data-id="' + escapeHtml(b.id) + '" data-dir="up"' + (!canReorder || item.idx === 0 ? ' disabled' : '') + ' title="Lên">▲</button>' +
            '<button type="button" class="vlu-order-btn btn-move-brand" data-id="' + escapeHtml(b.id) + '" data-dir="down"' + (!canReorder || item.idx === rowsData.length - 1 ? ' disabled' : '') + ' title="Xuống">▼</button>' +
          '</div></td>' +
          '<td class="font-mono text-xs text-slate-400">#' + escapeHtml(b.id) + '</td>' +
          '<td><div class="flex items-center gap-2.5">' + badgeHtml + '<div><p class="font-bold">' + escapeHtml(b.name) + '</p><p class="text-[11px] font-mono text-slate-400">/' + escapeHtml(b.slug || '') + ' · ' + escapeHtml(b.shortCode || '') + '</p></div></div></td>' +
          '<td class="text-xs max-w-xs truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(b.description || '--') + '</td>' +
          '<td><button type="button" class="vlu-badge vlu-badge-brand hover:opacity-80 transition btn-preview-brand" data-id="' + escapeHtml(b.id) + '">' + item.pCount + ' sản phẩm</button></td>' +
          '<td><div class="flex items-center gap-2"><button type="button" class="vlu-switch btn-toggle-brand-status ' + (item.isActive ? 'is-on' : '') + '" data-id="' + escapeHtml(b.id) + '"></button><span class="text-xs font-semibold ' + (item.isActive ? 'text-emerald-600' : 'text-slate-400') + '">' + (item.isActive ? 'Đang hợp tác' : 'Tạm ngừng') + '</span></div></td>' +
          '<td class="text-xs whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDate(b.created_at)) + '</td>' +
          '<td class="text-right whitespace-nowrap"><div class="inline-flex items-center gap-1">' +
            '<button type="button" class="btn-preview-brand p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition" data-id="' + escapeHtml(b.id) + '" title="Xem trước thương hiệu"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>' +
            '<button type="button" class="btn-edit-brand p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition" data-id="' + escapeHtml(b.id) + '" title="Sửa thương hiệu"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg></button>' +
            '<button type="button" class="btn-delete-brand p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-id="' + escapeHtml(b.id) + '" title="Xóa thương hiệu"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    }
  }

  /* ==========================================================================
     8. QUẢN LÝ KHO HÀNG BIẾN THỂ & PHIẾU NHẬP / XUẤT / ĐIỀU CHỈNH (INVENTORY)
     ========================================================================== */
  function syncSelectOptionsPreserve(sel, items, defaultLabel) {
    if (!sel) return;
    var prev = sel.value || 'all';
    var html = '<option value="all">' + escapeHtml(defaultLabel) + '</option>' + items.map(function (it) {
      return '<option value="' + escapeHtml(it.value) + '">' + escapeHtml(it.label) + '</option>';
    }).join('');
    sel.innerHTML = html;
    if (Array.prototype.some.call(sel.options, function (o) { return o.value === prev; })) {
      sel.value = prev;
    } else {
      sel.value = 'all';
    }
  }

  function populateInventoryFilterSelects(products) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var cats = engine.getProductCategories();
    var brands = engine.getBrands();
    var colorSet = {}, variantSet = {};

    products.forEach(function (p) {
      (Array.isArray(p.colors) ? p.colors : []).forEach(function (c) {
        if (c && (c.name || c.key)) colorSet[c.name || c.key] = true;
      });
      (Array.isArray(p.variants) ? p.variants : []).forEach(function (v) {
        if (v && v.label) variantSet[v.label] = true;
      });
    });

    syncSelectOptionsPreserve(
      document.getElementById('inventoryCategoryFilter'),
      cats.map(function (c) { return { value: c.slug, label: c.name }; }),
      'Danh mục: Tất cả'
    );
    syncSelectOptionsPreserve(
      document.getElementById('inventoryBrandFilter'),
      brands.map(function (b) { return { value: b.name, label: b.name }; }),
      'Thương hiệu: Tất cả'
    );
    syncSelectOptionsPreserve(
      document.getElementById('inventoryColorFilter'),
      Object.keys(colorSet).sort().map(function (c) { return { value: c, label: c }; }),
      'Màu sắc: Tất cả'
    );
    syncSelectOptionsPreserve(
      document.getElementById('inventoryVariantFilter'),
      Object.keys(variantSet).sort().map(function (v) { return { value: v, label: v }; }),
      'Tất cả phiên bản'
    );
  }

  function syncInventoryViewSubtabs() {
    document.querySelectorAll('#inventoryViewTabs [data-inv-view]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-inv-view') === inventoryViewMode);
    });
  }

  function renderInventory() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var products = engine.getProducts();
    populateInventoryFilterSelects(products);
    syncInventoryViewSubtabs();

    var sumEl = document.getElementById('inventorySummaryCards');
    var stockView = document.getElementById('inventoryStockView');
    var logsView = document.getElementById('inventoryLogsView');
    var tbody = document.getElementById('inventoryTableBody');
    var logsTbody = document.getElementById('inventoryLogsTableBody');
    var countBadge = document.getElementById('inventoryCountBadge');

    var searchEl = document.getElementById('inventorySearchInput');
    var catEl = document.getElementById('inventoryCategoryFilter');
    var brandEl = document.getElementById('inventoryBrandFilter');
    var colorEl = document.getElementById('inventoryColorFilter');
    var variantEl = document.getElementById('inventoryVariantFilter');
    var filterEl = document.getElementById('inventoryFilterSelect');

    var kpis = engine.calculateInventoryKpis();
    var defaultThresh = engine.getSystemSettings().defaultLowStockThreshold || 5;
    var activeFilter = filterEl ? filterEl.value : 'all';

    if (sumEl) {
      var cards = [
        { kpi: 'all', label: 'Tổng tồn kho', val: kpis.totalUnits.toLocaleString('vi-VN') + ' SP', sub: kpis.skuCount + ' mã SKU thực tế', tone: 'text-ink', active: inventoryViewMode === 'stock' && activeFilter === 'all' },
        { kpi: 'low_stock', label: 'Sản phẩm sắp hết', val: kpis.lowStockCount + ' SKU', sub: 'Dưới ngưỡng cảnh báo', tone: 'text-amber-600', active: (inventoryViewMode === 'low_alert' || activeFilter === 'low_stock') },
        { kpi: 'out_of_stock', label: 'Sản phẩm hết hàng', val: kpis.outOfStockCount + ' SKU', sub: 'Tồn kho = 0', tone: 'text-red-600', active: activeFilter === 'out_of_stock' },
        { kpi: 'recent_inbound', label: 'Sản phẩm mới nhập', val: kpis.recentInboundCount + ' SKU', sub: 'Nhập kho 30 ngày gần đây', tone: 'text-emerald-600', active: inventoryViewMode === 'inbound' }
      ];
      sumEl.innerHTML = cards.map(function (c) {
        return '<button type="button" data-inv-kpi="' + escapeHtml(c.kpi) + '" class="vlu-kpi-filter-card ' + (c.active ? 'is-active' : '') + '">' +
          '<p class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--admin-text-secondary);">' + escapeHtml(c.label) + '</p>' +
          '<p class="text-xl sm:text-2xl font-extrabold mt-1 tabular-nums ' + c.tone + '">' + escapeHtml(c.val) + '</p>' +
          '<p class="text-[10px] mt-0.5 truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(c.sub) + '</p>' +
        '</button>';
      }).join('');
    }

    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var catF = catEl ? catEl.value : 'all';
    var brandF = brandEl ? brandEl.value : 'all';
    var colorF = colorEl ? colorEl.value : 'all';
    var variantF = variantEl ? variantEl.value : 'all';

    var isLogsMode = (inventoryViewMode === 'inbound' || inventoryViewMode === 'outbound' || inventoryViewMode === 'adjustment');
    if (stockView) stockView.classList.toggle('hidden', isLogsMode);
    if (logsView) logsView.classList.toggle('hidden', !isLogsMode);

    if (isLogsMode) {
      var allLogs = engine.getInventoryLogs().filter(function (lg) {
        if (!lg || lg.type !== inventoryViewMode) return false;
        var matchQ = !q ||
          engine.normalizeText(lg.productName).indexOf(q) !== -1 ||
          engine.normalizeText(lg.sku).indexOf(q) !== -1 ||
          engine.normalizeText(lg.code).indexOf(q) !== -1;
        var matchBrand = brandF === 'all' || engine.normalizeText(lg.brand) === engine.normalizeText(brandF);
        var matchCat = catF === 'all' || String(lg.category) === catF;
        return matchQ && matchBrand && matchCat;
      });
      if (countBadge) countBadge.textContent = allLogs.length + ' phiếu kho';
      if (!logsTbody) return;

      var totalLogPages = Math.max(1, Math.ceil(allLogs.length / INVENTORY_PER_PAGE));
      if (inventoryLogsPage > totalLogPages) inventoryLogsPage = 1;
      var logSlice = allLogs.slice((inventoryLogsPage - 1) * INVENTORY_PER_PAGE, inventoryLogsPage * INVENTORY_PER_PAGE);

      if (!logSlice.length) {
        logsTbody.innerHTML = emptyRowHtml(9, 'Chưa có phiếu giao dịch kho trong mục này', 'Nhấn "+ Lập phiếu Kho" để tạo phiếu Nhập, Xuất hoặc Điều chỉnh kiểm kê.');
        renderPagination(document.getElementById('inventoryLogsPagination'), 0, 1, INVENTORY_PER_PAGE, function () {});
        return;
      }

      logsTbody.innerHTML = logSlice.map(function (lg) {
        var typeBadge = lg.type === 'inbound'
          ? '<span class="vlu-badge vlu-badge-success">Nhập kho</span>'
          : (lg.type === 'outbound' ? '<span class="vlu-badge vlu-badge-warning">Xuất kho</span>' : '<span class="vlu-badge vlu-badge-info">Điều chỉnh</span>');
        var deltaTxt = lg.delta > 0 ? ('+' + lg.delta) : String(lg.delta);
        var deltaCls = lg.delta > 0 ? 'text-emerald-600' : (lg.delta < 0 ? 'text-red-600' : 'text-slate-500');
        return '<tr>' +
          '<td class="font-mono font-bold text-xs whitespace-nowrap">' + escapeHtml(lg.code) + '</td>' +
          '<td class="whitespace-nowrap">' + typeBadge + '</td>' +
          '<td><p class="font-bold text-xs">' + escapeHtml(lg.productName) + '</p><p class="text-[10px] font-mono" style="color: var(--admin-text-secondary);">SKU: ' + escapeHtml(lg.sku) + '</p></td>' +
          '<td class="text-xs" style="color: var(--admin-text-secondary);">' + escapeHtml((lg.colorKey || 'Tất cả') + ' · ' + (lg.variantLabel || 'Tiêu chuẩn')) + '</td>' +
          '<td class="text-center tabular-nums text-xs">' + escapeHtml(lg.prevStock) + '</td>' +
          '<td class="text-center font-extrabold tabular-nums ' + deltaCls + '">' + escapeHtml(deltaTxt) + '</td>' +
          '<td class="text-center font-extrabold tabular-nums">' + escapeHtml(lg.afterStock) + '</td>' +
          '<td class="text-xs max-w-xs"><p class="font-semibold truncate" title="' + escapeHtml(lg.reason) + '">' + escapeHtml(lg.reason) + '</p>' + (lg.note ? '<p class="text-[10px] truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(lg.note) + '</p>' : '') + '</td>' +
          '<td class="text-xs whitespace-nowrap"><p class="font-mono">' + escapeHtml(engine.formatDateTime ? engine.formatDateTime(lg.created_at) : engine.formatDate(lg.created_at)) + '</p><p class="text-[10px]" style="color: var(--admin-text-secondary);">' + escapeHtml(lg.actor || 'Admin') + '</p></td>' +
        '</tr>';
      }).join('');

      renderPagination(document.getElementById('inventoryLogsPagination'), allLogs.length, inventoryLogsPage, INVENTORY_PER_PAGE, function (nextP) {
        inventoryLogsPage = nextP;
        renderInventory();
      });
      return;
    }

    var filtered = products.filter(function (p) {
      var matchQ = !q ||
        engine.normalizeText(p.name).indexOf(q) !== -1 ||
        engine.normalizeText(p.sku || p.id).indexOf(q) !== -1 ||
        engine.normalizeText(p.brand).indexOf(q) !== -1;
      var matchCat = catF === 'all' || String(p.category || p.category_slug) === catF;
      var matchBrand = brandF === 'all' || engine.normalizeText(p.brand || p.category_name) === engine.normalizeText(brandF);
      var matchColor = colorF === 'all' || (Array.isArray(p.colors) && p.colors.some(function (c) {
        return c && engine.normalizeText(c.name || c.key) === engine.normalizeText(colorF);
      }));
      var matchVar = variantF === 'all' || (Array.isArray(p.variants) && p.variants.some(function (v) {
        return v && engine.normalizeText(v.label) === engine.normalizeText(variantF);
      }));

      var s = Number(p.stock) || 0;
      var thresh = Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : defaultThresh;
      var effFlt = inventoryViewMode === 'low_alert' ? 'low_alert' : activeFilter;
      var matchStock = effFlt === 'all' ||
        (effFlt === 'low_alert' && s <= thresh) ||
        (effFlt === 'low_stock' && s > 0 && s <= thresh) ||
        (effFlt === 'out_of_stock' && s <= 0) ||
        (effFlt === 'healthy' && s > thresh);

      return matchQ && matchCat && matchBrand && matchColor && matchVar && matchStock;
    });

    if (countBadge) countBadge.textContent = filtered.length + ' / ' + products.length + ' sản phẩm';
    if (!tbody) return;

    var totalPages = Math.max(1, Math.ceil(filtered.length / INVENTORY_PER_PAGE));
    if (inventoryPage > totalPages) inventoryPage = 1;
    var slice = filtered.slice((inventoryPage - 1) * INVENTORY_PER_PAGE, inventoryPage * INVENTORY_PER_PAGE);

    if (!slice.length) {
      tbody.innerHTML = emptyRowHtml(7, 'Không có sản phẩm nào khớp bộ lọc kho hàng', 'Thử nhấn Đặt lại lọc hoặc kiểm tra lại từ khóa SKU.');
      renderPagination(document.getElementById('inventoryPagination'), 0, 1, INVENTORY_PER_PAGE, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (p) {
      var s = Number(p.stock) || 0;
      var thresh = Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : defaultThresh;
      var badge = s <= 0
        ? '<span class="vlu-badge vlu-badge-danger">Hết hàng</span>'
        : (s <= thresh ? '<span class="vlu-badge vlu-badge-warning">Sắp hết (≤' + thresh + ')</span>' : '<span class="vlu-badge vlu-badge-success">Còn hàng</span>');

      var colors = Array.isArray(p.colors) ? p.colors : [];
      var variants = Array.isArray(p.variants) ? p.variants : [];
      var chipsHtml = '' +
        (colors.length ? ('<div class="flex flex-wrap gap-1">' + colors.slice(0, 3).map(function (c) {
          var cs = c.stock !== undefined && c.stock !== '' ? (': ' + c.stock) : '';
          return '<span class="vlu-variant-chip"><span class="h-2 w-2 rounded-full border border-slate-300" style="background:' + escapeHtml(c.hex || '#334155') + '"></span>' + escapeHtml((c.name || 'Mặc định') + cs) + '</span>';
        }).join('') + (colors.length > 3 ? '<span class="vlu-variant-chip">+' + (colors.length - 3) + ' màu</span>' : '') + '</div>') : '') +
        (variants.length ? ('<div class="flex flex-wrap gap-1 mt-1">' + variants.slice(0, 3).map(function (v) {
          var vs = v.stock !== undefined && v.stock !== '' ? (': ' + v.stock) : '';
          return '<span class="vlu-variant-chip">' + escapeHtml((v.label || 'Tiêu chuẩn') + vs) + '</span>';
        }).join('') + '</div>') : '');

      return '<tr>' +
        '<td>' +
          '<div class="flex items-center gap-2.5">' +
            '<img src="' + escapeHtml(safeImage(p.image, p.category)) + '" class="h-11 w-11 rounded-lg bg-white border border-slate-100 p-0.5 object-contain shrink-0" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';">' +
            '<div><p class="font-bold text-xs">' + escapeHtml(p.name) + '</p><p class="text-[10px] font-mono" style="color: var(--admin-text-secondary);">SKU: ' + escapeHtml(p.sku || p.id) + '</p></div>' +
          '</div>' +
        '</td>' +
        '<td class="text-xs" style="color: var(--admin-text-secondary);">' + escapeHtml((p.product_category_name || '') + ' · ' + (p.brand || p.category_name || '')) + '</td>' +
        '<td>' + (chipsHtml || '<span class="text-xs text-slate-400">Phiên bản tiêu chuẩn</span>') + '</td>' +
        '<td class="text-center font-extrabold tabular-nums">' + s + '</td>' +
        '<td class="text-center text-xs font-mono" style="color: var(--admin-text-secondary);">' + thresh + '</td>' +
        '<td class="whitespace-nowrap">' + badge + '</td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<div class="inline-flex items-center gap-1">' +
            '<button type="button" class="btn-inv-movement vlu-btn vlu-btn-secondary vlu-btn-sm !px-2 !py-1 text-emerald-700" data-type="inbound" data-id="' + escapeHtml(p.id) + '">+ Nhập</button>' +
            '<button type="button" class="btn-inv-movement vlu-btn vlu-btn-secondary vlu-btn-sm !px-2 !py-1 text-amber-700" data-type="outbound" data-id="' + escapeHtml(p.id) + '">- Xuất</button>' +
            '<button type="button" class="btn-inv-movement vlu-btn vlu-btn-navy vlu-btn-sm !px-2 !py-1" data-type="adjustment" data-id="' + escapeHtml(p.id) + '">Kiểm kê</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('inventoryPagination'), filtered.length, inventoryPage, INVENTORY_PER_PAGE, function (nextP) {
      inventoryPage = nextP;
      renderInventory();
    });
  }

  /* ==========================================================================
     9. QUẢN LÝ ĐƠN HÀNG (7 KPI, BỘ LỌC ĐA TIÊU CHÍ, PIPELINE 6 BƯỚC & IN HÓA ĐƠN)
     ========================================================================== */
  function syncOrderFilterButtons() {
    document.querySelectorAll('[data-order-filter]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-order-filter') === orderFilterStatus);
    });
  }

  function isGuestOrderRecord(o) {
    if (!o) return true;
    var uid = String(o.user_id || '').trim().toLowerCase();
    var ident = String(o.user_identity || '').trim().toLowerCase();
    return (!uid || uid === 'guest') && (!ident || ident === 'guest');
  }

  function getPaymentStatusBadgeHtml(payStatus) {
    var s = String(payStatus || 'pending').toLowerCase();
    if (s === 'paid') return '<span class="vlu-badge vlu-badge-success">Đã thanh toán</span>';
    if (s === 'refunded') return '<span class="vlu-badge vlu-badge-purple">Đã hoàn tiền</span>';
    if (s === 'failed') return '<span class="vlu-badge vlu-badge-danger">Thất bại</span>';
    return '<span class="vlu-badge vlu-badge-warning">Chờ thanh toán</span>';
  }

  function matchesOrderPaymentMethod(order, filterVal) {
    if (!filterVal || filterVal === 'all') return true;
    var methodStr = String((order && (order.payment_key || '')) + ' ' + (order && (order.payment_method || ''))).toLowerCase();
    if (filterVal === 'COD') return methodStr.indexOf('cod') !== -1 || methodStr.indexOf('nhận hàng') !== -1 || methodStr.indexOf('tiền mặt') !== -1;
    if (filterVal === 'VietQR') return methodStr.indexOf('vietqr') !== -1 || methodStr.indexOf('chuyển khoản') !== -1 || methodStr.indexOf('qr') !== -1 || methodStr.indexOf('bank') !== -1;
    if (filterVal === 'Credit') return methodStr.indexOf('credit') !== -1 || methodStr.indexOf('thẻ') !== -1 || methodStr.indexOf('apple') !== -1 || methodStr.indexOf('visa') !== -1 || methodStr.indexOf('card') !== -1;
    if (filterVal === 'BNPL') return methodStr.indexOf('bnpl') !== -1 || methodStr.indexOf('trả góp') !== -1 || methodStr.indexOf('kredivo') !== -1;
    return true;
  }

  function toOrderDateKey(rawDate) {
    var engine = window.VLU_ADMIN;
    var d = engine && engine.parseDateSafe ? engine.parseDateSafe(rawDate) : (rawDate ? new Date(rawDate) : null);
    if (!d || isNaN(d.getTime())) return '';
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function getFilteredSortedOrders() {
    var engine = window.VLU_ADMIN;
    if (!engine) return [];
    var orders = engine.getOrders();

    var searchEl = document.getElementById('orderSearchInput');
    var payStatusEl = document.getElementById('orderPaymentStatusFilter');
    var payMethodEl = document.getElementById('orderPaymentMethodFilter');
    var totalRangeEl = document.getElementById('orderTotalRangeFilter');
    var minEl = document.getElementById('orderTotalMinInput');
    var maxEl = document.getElementById('orderTotalMaxInput');
    var dateFromEl = document.getElementById('orderDateFrom');
    var dateToEl = document.getElementById('orderDateTo');
    var sortEl = document.getElementById('orderSortSelect');

    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var payStatusF = payStatusEl ? payStatusEl.value : 'all';
    var payMethodF = payMethodEl ? payMethodEl.value : 'all';
    var totalRangeF = totalRangeEl ? totalRangeEl.value : 'all';
    var dateFrom = dateFromEl ? String(dateFromEl.value || '').trim() : '';
    var dateTo = dateToEl ? String(dateToEl.value || '').trim() : '';
    var sortBy = sortEl ? sortEl.value : 'newest';

    var filtered = orders.filter(function (o) {
      if (!o) return false;
      var normStatus = engine.normalizeOrderStatus(o.status);
      var grp = engine.getOrderDashboardGroup(normStatus);

      var matchStatus = orderFilterStatus === 'all' ||
        normStatus === orderFilterStatus ||
        (orderFilterStatus === 'preparing_group' && grp === 'confirmed') ||
        (orderFilterStatus === 'shipping_group' && grp === 'shipping') ||
        (orderFilterStatus === 'cancelled' && grp === 'cancelled');

      var matchQ = !q ||
        String(o.id || '').toLowerCase().indexOf(q) !== -1 ||
        engine.normalizeText(o.customer_name).indexOf(q) !== -1 ||
        String(o.customer_phone || '').indexOf(q) !== -1;

      var resolvedPay = engine.resolveOrderPaymentStatus(o);
      var matchPaySt = payStatusF === 'all' || resolvedPay === payStatusF;
      var matchPayM = matchesOrderPaymentMethod(o, payMethodF);

      var amt = Number(o.total) || 0;
      var matchTotal = true;
      if (totalRangeF === 'lt5') matchTotal = amt < 5000000;
      else if (totalRangeF === '5_20') matchTotal = amt >= 5000000 && amt <= 20000000;
      else if (totalRangeF === 'gt20') matchTotal = amt > 20000000;
      else if (totalRangeF === 'custom') {
        var minV = minEl && minEl.value !== '' ? Number(minEl.value) : null;
        var maxV = maxEl && maxEl.value !== '' ? Number(maxEl.value) : null;
        if (minV !== null && !isNaN(minV) && amt < minV) matchTotal = false;
        if (maxV !== null && !isNaN(maxV) && amt > maxV) matchTotal = false;
      }

      var oDateKey = toOrderDateKey(o.created_at);
      var matchDate = true;
      if (dateFrom && (!oDateKey || oDateKey < dateFrom)) matchDate = false;
      if (dateTo && (!oDateKey || oDateKey > dateTo)) matchDate = false;

      return matchStatus && matchQ && matchPaySt && matchPayM && matchTotal && matchDate;
    });

    filtered.sort(function (a, b) {
      if (sortBy === 'oldest') {
        return (new Date(a.created_at || 0).getTime() || 0) - (new Date(b.created_at || 0).getTime() || 0);
      }
      if (sortBy === 'total_desc') return (Number(b.total) || 0) - (Number(a.total) || 0);
      if (sortBy === 'total_asc') return (Number(a.total) || 0) - (Number(b.total) || 0);
      return (new Date(b.created_at || 0).getTime() || 0) - (new Date(a.created_at || 0).getTime() || 0);
    });

    return filtered;
  }

  function renderOrderKpis(orders) {
    var engine = window.VLU_ADMIN;
    var wrap = document.getElementById('ordersKpiCards');
    if (!engine || !wrap) return;
    var k = engine.calculateOrderKpis(orders);
    var cards = [
      { filter: 'all', label: 'Tổng đơn hàng', value: k.totalOrders, tone: 'text-ink', sub: 'Toàn hệ thống' },
      { filter: 'pending', label: 'Chờ xác nhận', value: k.pendingOrders, tone: 'text-amber-600', sub: 'Cần duyệt ngay' },
      { filter: 'preparing_group', label: 'Đang chuẩn bị', value: k.preparingOrders, tone: 'text-indigo-600', sub: 'Xác nhận & Đóng gói' },
      { filter: 'shipping_group', label: 'Đang giao hàng', value: k.shippingOrders, tone: 'text-sky-600', sub: 'Bàn giao & Vận chuyển' },
      { filter: 'completed', label: 'Hoàn thành', value: k.completedOrders, tone: 'text-emerald-600', sub: 'Giao thành công' },
      { filter: 'cancelled', label: 'Đã hủy', value: k.cancelledOrders, tone: 'text-red-600', sub: 'Kèm lý do hủy' },
      { filter: 'revenue', label: 'Doanh thu hợp lệ', value: engine.formatVND(k.validRevenue), tone: 'text-brand', sub: 'Không tính đơn hủy', isMoney: true }
    ];

    wrap.innerHTML = cards.map(function (c) {
      var isActive = c.filter !== 'revenue' && orderFilterStatus === c.filter;
      return '<button type="button" data-order-kpi="' + escapeHtml(c.filter) + '" class="vlu-kpi-filter-card ' + (isActive ? 'is-active' : '') + '">' +
        '<p class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--admin-text-secondary);">' + escapeHtml(c.label) + '</p>' +
        '<p class="' + (c.isMoney ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl') + ' font-extrabold mt-1 tabular-nums ' + c.tone + '">' + escapeHtml(c.value) + '</p>' +
        '<p class="text-[10px] mt-0.5 truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(c.sub) + '</p>' +
      '</button>';
    }).join('');
  }

  function resetOrderFilters() {
    orderFilterStatus = 'all';
    ordersPage = 1;
    var ids = ['orderSearchInput', 'orderDateFrom', 'orderDateTo', 'orderTotalMinInput', 'orderTotalMaxInput'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['orderPaymentStatusFilter', 'orderPaymentMethodFilter', 'orderTotalRangeFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = 'all';
    });
    var sortEl = document.getElementById('orderSortSelect');
    if (sortEl) sortEl.value = 'newest';
    var customWrap = document.getElementById('orderTotalCustomWrap');
    if (customWrap) customWrap.classList.add('hidden');
    renderOrders();
  }

  function printOrderInvoice(orderId) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var targetKey = normalizeOrderKey(orderId);
    var o = engine.getOrders().find(function (item) { return item && normalizeOrderKey(item.order_code || item.id) === targetKey; });
    if (!o) return;
    var ordCode = formatOrderCode(o.order_code || o.id);
    var payStatus = engine.resolveOrderPaymentStatus(o);
    var shipFee = Number(o.shipping_fee) || 0;
    var itemsHtml = (o.items || []).map(function (it, idx) {
      var matched = engine.resolveItemProduct ? engine.resolveItemProduct(it) : null;
      var sku = it.sku || (matched && matched.sku) || '--';
      var qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      var unit = Number(it.price) || 0;
      return '<tr>' +
        '<td>' + (idx + 1) + '</td>' +
        '<td><strong>' + escapeHtml(it.name) + '</strong><br><small>SKU: ' + escapeHtml(sku) + ' | ' + escapeHtml(it.color || 'Mặc định') + ' ' + escapeHtml(it.variant || '') + '</small></td>' +
        '<td style="text-align:center">' + qty + '</td>' +
        '<td style="text-align:right">' + escapeHtml(engine.formatVND(unit)) + '</td>' +
        '<td style="text-align:right"><strong>' + escapeHtml(engine.formatVND(unit * qty)) + '</strong></td>' +
      '</tr>';
    }).join('');

    var html = '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Hóa đơn ' + escapeHtml(ordCode) + ' - VLU FLAGSHIP STORE</title>' +
      '<style>body{font-family:Arial,sans-serif;color:#172033;padding:28px;max-width:820px;margin:0 auto;}h1{color:#D10D32;margin:0 0 4px;font-size:20px;}table{width:100%;border-collapse:collapse;margin:16px 0;}th,td{border:1px solid #e2e8f0;padding:8px 10px;font-size:13px;}th{background:#f8fafc;text-align:left;}.meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#f8fafc;padding:12px;border-radius:8px;margin:14px 0;font-size:13px;}.totals{width:300px;margin-left:auto;font-size:13px;}.totals div{display:flex;justify-content:space-between;padding:4px 0;}.grand{border-top:2px solid #151B2B;margin-top:6px;padding-top:8px;font-size:16px;font-weight:700;color:#D10D32;}@media print{.no-print{display:none;}}</style></head><body>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #D10D32;padding-bottom:12px;">' +
        '<div><h1>VLU FLAGSHIP STORE</h1><div style="font-size:12px;color:#64748b;">Hóa đơn bán hàng điện tử · Premium Retail</div></div>' +
        '<div style="text-align:right;"><strong>Mã đơn: ' + escapeHtml(ordCode) + '</strong><div style="font-size:12px;">Ngày đặt: ' + escapeHtml(engine.formatDateTime ? engine.formatDateTime(o.created_at) : engine.formatDate(o.created_at)) + '</div><div style="font-size:12px;">Trạng thái: ' + escapeHtml(engine.getOrderStatusLabel(o.status)) + '</div></div>' +
      '</div>' +
      '<div class="meta">' +
        '<div><strong>Khách hàng:</strong> ' + escapeHtml(o.customer_name) + '<br><strong>SĐT:</strong> ' + escapeHtml(o.customer_phone) + '<br><strong>Email:</strong> ' + escapeHtml(o.customer_email || '--') + '</div>' +
        '<div><strong>Địa chỉ nhận hàng:</strong> ' + escapeHtml(o.customer_address || '--') + '<br><strong>PT Thanh toán:</strong> ' + escapeHtml(o.payment_method || 'COD') + '<br><strong>TT Thanh toán:</strong> ' + escapeHtml(engine.getOrderPaymentStatusLabel(payStatus)) + '</div>' +
      '</div>' +
      '<table><thead><tr><th>#</th><th>Sản phẩm / SKU</th><th style="text-align:center">SL</th><th style="text-align:right">Đơn giá</th><th style="text-align:right">Thành tiền</th></tr></thead><tbody>' + itemsHtml + '</tbody></table>' +
      '<div class="totals">' +
        '<div><span>Tạm tính:</span><span>' + escapeHtml(engine.formatVND(o.subtotal || o.total)) + '</span></div>' +
        '<div><span>Giảm giá Voucher:</span><span>-' + escapeHtml(engine.formatVND(o.discount || 0)) + '</span></div>' +
        '<div><span>Phí vận chuyển:</span><span>' + (shipFee > 0 ? escapeHtml(engine.formatVND(shipFee)) : 'Miễn phí') + '</span></div>' +
        '<div class="grand"><span>Tổng thanh toán:</span><span>' + escapeHtml(engine.formatVND(o.total)) + '</span></div>' +
      '</div>' +
      '<div class="no-print" style="margin-top:24px;text-align:center;"><button onclick="window.print()" style="padding:10px 22px;background:#D10D32;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">In hóa đơn ngay</button></div>' +
      '</body></html>';

    var win = window.open('', '_blank', 'width=860,height=920');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      win.focus();
    } else {
      engine.showToast('Trình duyệt đang chặn cửa sổ in. Vui lòng cho phép popup để in hóa đơn.', true);
    }
  }

  function renderOrders() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var orders = engine.getOrders();
    var tbody = document.getElementById('ordersTableBody');
    var countBadge = document.getElementById('ordersCountBadge');
    var pageSizeSel = document.getElementById('ordersPageSizeSelect');

    renderOrderKpis(orders);
    syncOrderFilterButtons();

    var filtered = getFilteredSortedOrders();
    var sizeVal = pageSizeSel ? pageSizeSel.value : String(ORDERS_PER_PAGE);
    var pageSize = sizeVal === 'all' ? Math.max(1, filtered.length) : (parseInt(sizeVal, 10) || 20);
    ORDERS_PER_PAGE = sizeVal === 'all' ? 20 : pageSize;

    if (countBadge) countBadge.textContent = filtered.length + ' / ' + orders.length + ' đơn hàng';
    if (!tbody) return;

    var totalPages = sizeVal === 'all' ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
    if (ordersPage > totalPages) ordersPage = 1;
    var slice = sizeVal === 'all' ? filtered : filtered.slice((ordersPage - 1) * pageSize, ordersPage * pageSize);

    if (slice.length === 0) {
      tbody.innerHTML = emptyRowHtml(10, 'Không tìm thấy đơn hàng nào', 'Thử đặt lại bộ lọc hoặc thay đổi từ khóa tìm kiếm.');
      renderPagination(document.getElementById('ordersPagination'), 0, 1, pageSize, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (o) {
      var ordCode = formatOrderCode(o.order_code || o.id);
      var st = engine.normalizeOrderStatus(o.status);
      var paySt = engine.resolveOrderPaymentStatus(o);
      var isGuest = isGuestOrderRecord(o);
      var allowed = engine.getAllowedNextOrderStatuses(st);
      var nextForward = allowed.find(function (s) { return s !== 'cancelled'; }) || '';
      var canCancel = allowed.indexOf('cancelled') !== -1;
      var addr = String(o.customer_address || '').trim();
      var isPickup = addr.toLowerCase().indexOf('nhận tại cửa hàng') !== -1;

      return '<tr data-id="' + escapeHtml(ordCode) + '">' +
        '<td class="font-mono font-bold text-xs whitespace-nowrap">' + escapeHtml(ordCode) + '</td>' +
        '<td class="text-xs whitespace-nowrap font-mono" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDateTime ? engine.formatDateTime(o.created_at) : engine.formatDate(o.created_at)) + '</td>' +
        '<td>' +
          '<div class="flex flex-col gap-0.5">' +
            '<span class="font-bold text-xs">' + escapeHtml(o.customer_name || 'Khách hàng') + '</span>' +
            '<span>' + (isGuest ? '<span class="vlu-badge vlu-badge-guest !text-[10px] !py-0">Khách vãng lai</span>' : '<span class="vlu-badge vlu-badge-brand !text-[10px] !py-0">Thành viên</span>') + '</span>' +
          '</div>' +
        '</td>' +
        '<td class="text-xs font-mono whitespace-nowrap">' + escapeHtml(o.customer_phone || '--') + '</td>' +
        '<td class="text-xs max-w-[200px] truncate" style="color: var(--admin-text-secondary);" title="' + escapeHtml(addr) + '">' +
          (isPickup ? '<span class="vlu-badge vlu-badge-info !text-[10px]">Nhận tại cửa hàng</span>' : escapeHtml(addr || '--')) +
        '</td>' +
        '<td class="text-xs whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(o.payment_method || 'COD') + '</td>' +
        '<td class="font-extrabold text-brand tabular-nums whitespace-nowrap">' + escapeHtml(engine.formatVND(o.total)) + '</td>' +
        '<td class="whitespace-nowrap">' + getPaymentStatusBadgeHtml(paySt) + '</td>' +
        '<td class="whitespace-nowrap">' + engine.getStatusBadge(st) + '</td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<div class="inline-flex items-center gap-1">' +
            '<button type="button" class="btn-view-order vlu-btn vlu-btn-secondary vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(ordCode) + '" title="Xem chi tiết &amp; Timeline">Chi tiết</button>' +
            (nextForward ? '<button type="button" class="btn-advance-order vlu-btn vlu-btn-navy vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(ordCode) + '" data-next="' + escapeHtml(nextForward) + '" title="Chuyển sang: ' + escapeHtml(engine.getOrderStatusLabel(nextForward)) + '">→ ' + escapeHtml(engine.getOrderStatusLabel(nextForward)) + '</button>' : '') +
            (canCancel ? '<button type="button" class="btn-cancel-order p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition" data-id="' + escapeHtml(ordCode) + '" title="Hủy đơn hàng"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>' : '') +
            '<button type="button" class="btn-print-order p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition" data-id="' + escapeHtml(ordCode) + '" title="In hóa đơn"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659"/></svg></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('ordersPagination'), filtered.length, ordersPage, pageSize, function (nextP) {
      ordersPage = nextP;
      renderOrders();
    });
  }

  /* ==========================================================================
     10. THANH TOÁN & ĐỐI SOÁT, ĐỔI TRẢ & BẢO HÀNH, THÀNH VIÊN, ĐÁNH GIÁ/Q&A,
         VOUCHER, KHUYẾN MÃI, THÔNG BÁO, NHẬT KÝ HOẠT ĐỘNG & CÀI ĐẶT
     ========================================================================== */
  function renderPayments() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var orders = engine.getOrders();
    var sumEl = document.getElementById('paymentsSummaryCards');
    var tbody = document.getElementById('paymentsTableBody');
    var methodFilter = document.getElementById('paymentMethodFilter');
    var payStatusFilter = document.getElementById('paymentStatusFilter');
    var filterVal = methodFilter ? methodFilter.value : 'all';
    var payStVal = payStatusFilter ? payStatusFilter.value : 'all';

    var totals = { cod: 0, vietqr: 0, credit: 0, bnpl: 0, refunded: 0 };
    orders.forEach(function (o) {
      var pst = engine.resolveOrderPaymentStatus(o);
      if (pst === 'refunded') {
        totals.refunded += Number(o.total) || 0;
        return;
      }
      if (engine.normalizeOrderStatus(o.status) === 'cancelled') return;
      var mStr = String((o.payment_key || '') + ' ' + (o.payment_method || '')).toLowerCase();
      if (mStr.indexOf('vietqr') !== -1 || mStr.indexOf('chuyển khoản') !== -1 || mStr.indexOf('qr') !== -1) totals.vietqr += Number(o.total) || 0;
      else if (mStr.indexOf('credit') !== -1 || mStr.indexOf('thẻ') !== -1 || mStr.indexOf('apple') !== -1) totals.credit += Number(o.total) || 0;
      else if (mStr.indexOf('bnpl') !== -1 || mStr.indexOf('trả góp') !== -1) totals.bnpl += Number(o.total) || 0;
      else totals.cod += Number(o.total) || 0;
    });

    if (sumEl) {
      sumEl.innerHTML =
        '<div class="vlu-card p-4"><p class="text-xs font-semibold" style="color: var(--admin-text-secondary);">Thanh toán COD</p><p class="text-lg font-extrabold mt-1 tabular-nums">' + escapeHtml(engine.formatVND(totals.cod)) + '</p></div>' +
        '<div class="vlu-card p-4"><p class="text-xs font-semibold text-blue-600">Chuyển khoản VietQR</p><p class="text-lg font-extrabold mt-1 tabular-nums text-blue-600">' + escapeHtml(engine.formatVND(totals.vietqr)) + '</p></div>' +
        '<div class="vlu-card p-4"><p class="text-xs font-semibold text-emerald-600">Thẻ / Apple Pay</p><p class="text-lg font-extrabold mt-1 tabular-nums text-emerald-600">' + escapeHtml(engine.formatVND(totals.credit)) + '</p></div>' +
        '<div class="vlu-card p-4"><p class="text-xs font-semibold text-violet-600">Trả góp BNPL</p><p class="text-lg font-extrabold mt-1 tabular-nums text-violet-600">' + escapeHtml(engine.formatVND(totals.bnpl)) + '</p></div>' +
        '<div class="vlu-card p-4"><p class="text-xs font-semibold text-red-600">Đã hoàn tiền</p><p class="text-lg font-extrabold mt-1 tabular-nums text-red-600">' + escapeHtml(engine.formatVND(totals.refunded)) + '</p></div>';
    }

    if (!tbody) return;
    var filtered = orders.filter(function (o) {
      var pst = engine.resolveOrderPaymentStatus(o);
      var mOk = filterVal === 'all' || matchesOrderPaymentMethod(o, filterVal.toUpperCase() === 'VIETQR' ? 'VietQR' : (filterVal.toUpperCase() === 'COD' ? 'COD' : (filterVal.toUpperCase() === 'CREDIT' ? 'Credit' : 'BNPL')));
      var pOk = payStVal === 'all' || pst === payStVal;
      return mOk && pOk;
    });

    var perPage = 20;
    var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (paymentsPage > totalPages) paymentsPage = 1;
    var slice = filtered.slice((paymentsPage - 1) * perPage, paymentsPage * perPage);

    if (!slice.length) {
      tbody.innerHTML = emptyRowHtml(9, 'Chưa có giao dịch thanh toán phù hợp', 'Thử chọn phương thức hoặc trạng thái thanh toán khác.');
      renderPagination(document.getElementById('paymentsPagination'), 0, 1, perPage, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (o) {
      var ordCode = formatOrderCode(o.order_code || o.id);
      var paySt = engine.resolveOrderPaymentStatus(o);
      return '<tr>' +
        '<td><p class="font-mono font-bold text-xs">' + escapeHtml(ordCode) + '</p>' + (o.payment_ref ? '<p class="text-[10px] font-mono text-emerald-600">Ref: ' + escapeHtml(o.payment_ref) + '</p>' : '') + '</td>' +
        '<td class="font-semibold text-xs">' + escapeHtml(o.customer_name) + '</td>' +
        '<td class="text-xs">' + escapeHtml(o.payment_method || 'COD') + '</td>' +
        '<td>' + (o.voucher_code ? '<span class="vlu-badge vlu-badge-brand font-mono">' + escapeHtml(o.voucher_code) + '</span>' : '<span class="text-slate-400">--</span>') + '</td>' +
        '<td class="text-right font-extrabold text-brand tabular-nums whitespace-nowrap">' + escapeHtml(engine.formatVND(o.total)) + '</td>' +
        '<td>' + getPaymentStatusBadgeHtml(paySt) + '</td>' +
        '<td>' + engine.getStatusBadge(o.status) + '</td>' +
        '<td class="text-xs font-mono whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDate(o.created_at)) + '</td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<div class="inline-flex items-center gap-1">' +
            (paySt !== 'paid' ? '<button type="button" class="btn-reconcile-payment vlu-btn vlu-btn-navy vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(ordCode) + '" data-status="paid">Xác nhận thu tiền</button>' : '') +
            '<button type="button" class="btn-view-order vlu-btn vlu-btn-secondary vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(ordCode) + '">Chi tiết</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('paymentsPagination'), filtered.length, paymentsPage, perPage, function (nextP) {
      paymentsPage = nextP;
      renderPayments();
    });
  }

  function renderReturns() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var kpiWrap = document.getElementById('returnsKpiCards');
    var tbody = document.getElementById('returnsTableBody');
    var badge = document.getElementById('returnsCountBadge');
    var searchEl = document.getElementById('returnsSearchInput');
    var typeEl = document.getElementById('returnsTypeFilter');
    var statusEl = document.getElementById('returnsStatusFilter');

    var tickets = engine.getAllReturnWarrantyTickets();
    var orders = engine.getOrders();
    var combined = tickets.slice();

    // Bổ sung các đơn hủy đã thanh toán / hoàn trả chưa có phiếu riêng để theo dõi đối soát
    orders.forEach(function (o) {
      var st = engine.normalizeOrderStatus(o.status);
      var paySt = engine.resolveOrderPaymentStatus(o);
      if (st === 'returned' || (st === 'cancelled' && (paySt === 'paid' || paySt === 'refunded'))) {
        var alreadyLinked = combined.some(function (t) { return String(t.orderId || '') === String(o.id); });
        if (!alreadyLinked) {
          combined.push({
            uid: 'ORDER::' + o.id,
            id: o.id,
            orderId: o.id,
            customerName: o.customer_name || 'Khách hàng',
            type: paySt === 'refunded' || st === 'cancelled' ? 'refund' : 'return',
            typeLabel: st === 'cancelled' ? 'Hoàn tiền đơn hủy' : 'Đổi trả đơn hàng',
            subject: (o.cancel_reason || 'Đơn hàng yêu cầu đổi trả / hoàn tiền'),
            message: o.customer_notes || '',
            amount: Number(o.total) || 0,
            status: paySt === 'refunded' ? 'Đã hoàn tiền' : 'Đã tiếp nhận',
            createdAt: o.updated_at || o.created_at,
            isOrderDerived: true
          });
        }
      }
    });

    if (kpiWrap) {
      var totalCount = combined.length;
      var pendingCount = combined.filter(function (t) { return t.status === 'Đã tiếp nhận' || t.status === 'Đang kiểm tra kỹ thuật'; }).length;
      var warrantyCount = combined.filter(function (t) { return t.type === 'warranty'; }).length;
      var refundDoneCount = combined.filter(function (t) { return t.status === 'Hoàn tất' || t.status === 'Đã hoàn tiền'; }).length;
      kpiWrap.innerHTML =
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase" style="color: var(--admin-text-secondary);">Tổng hồ sơ</p><p class="text-2xl font-extrabold mt-1 tabular-nums">' + totalCount + '</p></div>' +
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase text-amber-600">Chờ kiểm tra / Xử lý</p><p class="text-2xl font-extrabold mt-1 text-amber-600 tabular-nums">' + pendingCount + '</p></div>' +
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase text-blue-600">Phiếu bảo hành KT</p><p class="text-2xl font-extrabold mt-1 text-blue-600 tabular-nums">' + warrantyCount + '</p></div>' +
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase text-emerald-600">Hoàn tất / Đã hoàn tiền</p><p class="text-2xl font-extrabold mt-1 text-emerald-600 tabular-nums">' + refundDoneCount + '</p></div>';
    }

    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var typeF = typeEl ? typeEl.value : 'all';
    var stF = statusEl ? statusEl.value : 'all';

    var filtered = combined.filter(function (t) {
      var mQ = !q ||
        engine.normalizeText(t.id).indexOf(q) !== -1 ||
        engine.normalizeText(t.orderId).indexOf(q) !== -1 ||
        engine.normalizeText(t.customerName).indexOf(q) !== -1 ||
        engine.normalizeText(t.subject).indexOf(q) !== -1;
      var mT = typeF === 'all' || t.type === typeF;
      var mS = stF === 'all' || t.status === stF;
      return mQ && mT && mS;
    });

    if (badge) badge.textContent = filtered.length + ' / ' + combined.length + ' yêu cầu';
    if (!tbody) return;

    var perPage = 15;
    var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (returnsPage > totalPages) returnsPage = 1;
    var slice = filtered.slice((returnsPage - 1) * perPage, returnsPage * perPage);

    if (!slice.length) {
      tbody.innerHTML = emptyRowHtml(7, 'Chưa có yêu cầu đổi trả / bảo hành nào', 'Các yêu cầu từ trang Tài khoản hoặc Admin tiếp nhận sẽ hiển thị tại đây.');
      renderPagination(document.getElementById('returnsPagination'), 0, 1, perPage, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (t) {
      var tBadge = t.type === 'warranty'
        ? '<span class="vlu-badge vlu-badge-info">Bảo hành</span>'
        : (t.type === 'refund' ? '<span class="vlu-badge vlu-badge-purple">Hoàn tiền</span>' : '<span class="vlu-badge vlu-badge-warning">Đổi trả 1-1</span>');
      var stBadgeCls = (t.status === 'Hoàn tất' || t.status === 'Đã hoàn tiền')
        ? 'vlu-badge-success'
        : (t.status === 'Từ chối' ? 'vlu-badge-danger' : 'vlu-badge-warning');

      return '<tr>' +
        '<td><p class="font-mono font-bold text-xs">' + escapeHtml(t.id) + '</p>' + (t.orderId ? '<p class="text-[10px] font-mono text-brand">Đơn: ' + escapeHtml(t.orderId) + '</p>' : '') + '</td>' +
        '<td class="font-semibold text-xs">' + escapeHtml(t.customerName || 'Khách hàng') + '</td>' +
        '<td>' + tBadge + '</td>' +
        '<td class="text-xs max-w-sm"><p class="font-bold truncate">' + escapeHtml(t.subject) + '</p>' + (t.message ? '<p class="text-[11px] truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(t.message) + '</p>' : '') + (t.adminNote ? '<p class="text-[10px] text-emerald-600 truncate">VLU: ' + escapeHtml(t.adminNote) + '</p>' : '') + '</td>' +
        '<td class="text-right font-bold tabular-nums whitespace-nowrap">' + escapeHtml(engine.formatVND(t.amount || t.refundAmount || 0)) + '</td>' +
        '<td class="whitespace-nowrap"><span class="vlu-badge ' + stBadgeCls + '">' + escapeHtml(t.status || 'Đã tiếp nhận') + '</span></td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<div class="inline-flex items-center gap-1">' +
            (t.isOrderDerived
              ? '<button type="button" class="btn-view-order vlu-btn vlu-btn-secondary vlu-btn-sm" data-id="' + escapeHtml(t.orderId) + '">Xem đơn</button>'
              : '<button type="button" class="btn-process-return vlu-btn vlu-btn-navy vlu-btn-sm" data-uid="' + escapeHtml(t.uid) + '">Xử lý phiếu</button>') +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('returnsPagination'), filtered.length, returnsPage, perPage, function (nextP) {
      returnsPage = nextP;
      renderReturns();
    });
  }

  function getUserTierBadgeHtml(tierKey, tierLabel) {
    if (tierKey === 'diamond') return '<span class="vlu-badge vlu-badge-purple">' + escapeHtml(tierLabel || 'VLU Diamond') + '</span>';
    if (tierKey === 'gold') return '<span class="vlu-badge vlu-badge-warning">' + escapeHtml(tierLabel || 'Gold') + '</span>';
    if (tierKey === 'silver') return '<span class="vlu-badge vlu-badge-info">' + escapeHtml(tierLabel || 'Silver') + '</span>';
    return '<span class="vlu-badge vlu-badge-neutral">' + escapeHtml(tierLabel || 'Member') + '</span>';
  }

  function renderUserKpis(allUsers) {
    var engine = window.VLU_ADMIN;
    var wrap = document.getElementById('usersKpiCards');
    if (!engine || !wrap) return;
    var k = engine.calculateUserKpis(allUsers);
    var cards = [
      { filter: 'all', label: 'Tổng tài khoản', value: k.totalAccounts, tone: 'text-ink', sub: k.totalCustomers + ' khách hàng' },
      { filter: 'new_month', label: 'Mới trong tháng', value: k.newThisMonth, tone: 'text-blue-600', sub: 'Đăng ký tháng này' },
      { filter: 'active', label: 'Đang hoạt động', value: k.activeCount, tone: 'text-emerald-600', sub: 'Cho phép mua & ĐN' },
      { filter: 'locked', label: 'Đang bị khóa', value: k.lockedCount, tone: 'text-red-600', sub: 'Chặn đăng nhập' },
      { filter: 'member', label: 'Khách thành viên', value: k.memberCount, tone: 'text-indigo-600', sub: k.tieredMemberCount + ' đã tích điểm' },
      { filter: 'returning', label: 'Khách quay lại', value: k.returningCount, tone: 'text-brand', sub: 'Từ 2 đơn hợp lệ' }
    ];

    wrap.innerHTML = cards.map(function (c) {
      var isActive = userKpiQuickFilter === c.filter;
      return '<button type="button" data-user-kpi="' + escapeHtml(c.filter) + '" class="vlu-kpi-filter-card ' + (isActive ? 'is-active' : '') + '">' +
        '<p class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--admin-text-secondary);">' + escapeHtml(c.label) + '</p>' +
        '<p class="text-xl sm:text-2xl font-extrabold mt-1 tabular-nums ' + c.tone + '">' + escapeHtml(c.value) + '</p>' +
        '<p class="text-[10px] mt-0.5 truncate" style="color: var(--admin-text-secondary);">' + escapeHtml(c.sub) + '</p>' +
      '</button>';
    }).join('');
  }

  function getFilteredSortedUsers(allUsers) {
    var engine = window.VLU_ADMIN;
    if (!engine) return [];
    var list = Array.isArray(allUsers) ? allUsers : engine.getUserInsightsList();

    var searchEl = document.getElementById('userSearchInput');
    var roleEl = document.getElementById('userRoleFilter');
    var statusEl = document.getElementById('userStatusFilter');
    var tierEl = document.getElementById('userTierFilter');
    var dateFromEl = document.getElementById('userDateFrom');
    var dateToEl = document.getElementById('userDateTo');

    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var roleF = roleEl ? roleEl.value : 'all';
    var statusF = statusEl ? statusEl.value : 'all';
    var tierF = tierEl ? tierEl.value : 'all';
    var dateFrom = dateFromEl ? String(dateFromEl.value || '').trim() : '';
    var dateTo = dateToEl ? String(dateToEl.value || '').trim() : '';

    var now = new Date();
    var curMonthKey = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2);

    return list.filter(function (u) {
      if (!u) return false;
      var isAdm = Number(u.role) === 1;
      var uDateKey = String(u.created_at || '').slice(0, 10);
      var mKey = uDateKey.slice(0, 7);

      var matchQ = !q ||
        engine.normalizeText(u.fullname).indexOf(q) !== -1 ||
        engine.normalizeText(u.username).indexOf(q) !== -1 ||
        engine.normalizeText(u.email).indexOf(q) !== -1 ||
        engine.normalizeText(u.user_code).indexOf(q) !== -1 ||
        String(u.phone || '').indexOf(q) !== -1;

      var matchRole = roleF === 'all' || (roleF === 'admin' && isAdm) || (roleF === 'customer' && !isAdm);
      var matchStatus = statusF === 'all' || String(u.status || 'active') === statusF;
      var matchTier = tierF === 'all' || String(u.tierKey || 'member') === tierF;

      var matchKpi = userKpiQuickFilter === 'all' ||
        (userKpiQuickFilter === 'new_month' && mKey === curMonthKey) ||
        (userKpiQuickFilter === 'active' && String(u.status || 'active') === 'active') ||
        (userKpiQuickFilter === 'locked' && String(u.status || 'active') === 'locked') ||
        (userKpiQuickFilter === 'member' && !isAdm) ||
        (userKpiQuickFilter === 'returning' && !isAdm && (Number(u.orderCount) || 0) >= 2);

      var matchDate = true;
      if (dateFrom && (!uDateKey || uDateKey < dateFrom)) matchDate = false;
      if (dateTo && (!uDateKey || uDateKey > dateTo)) matchDate = false;

      return matchQ && matchRole && matchStatus && matchTier && matchKpi && matchDate;
    });
  }

  function resetUserFilters() {
    userKpiQuickFilter = 'all';
    usersPage = 1;
    ['userSearchInput', 'userDateFrom', 'userDateTo'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['userRoleFilter', 'userStatusFilter', 'userTierFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = 'all';
    });
    renderUsers();
  }

  function renderUsers() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var allUsers = engine.getUserInsightsList();
    renderUserKpis(allUsers);

    var tbody = document.getElementById('usersTableBody');
    var countBadge = document.getElementById('usersCountBadge');
    var pageSizeSel = document.getElementById('usersPageSizeSelect');

    var filtered = getFilteredSortedUsers(allUsers);
    var sizeVal = pageSizeSel ? pageSizeSel.value : String(USERS_PER_PAGE);
    var pageSize = sizeVal === 'all' ? Math.max(1, filtered.length) : (parseInt(sizeVal, 10) || 20);
    USERS_PER_PAGE = sizeVal === 'all' ? 20 : pageSize;

    if (countBadge) countBadge.textContent = filtered.length + ' / ' + allUsers.length + ' tài khoản';
    if (!tbody) return;

    var totalPages = sizeVal === 'all' ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
    if (usersPage > totalPages) usersPage = 1;
    var slice = sizeVal === 'all' ? filtered : filtered.slice((usersPage - 1) * pageSize, usersPage * pageSize);

    if (!slice.length) {
      tbody.innerHTML = emptyRowHtml(11, 'Không có tài khoản phù hợp', 'Thử đặt lại bộ lọc hoặc xóa từ khóa tìm kiếm.');
      renderPagination(document.getElementById('usersPagination'), 0, 1, pageSize, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (u) {
      var isAdmin = Number(u.role) === 1;
      var isLocked = String(u.status || 'active') === 'locked';
      var isRoot = Boolean(u.is_protected_root);
      var name = u.fullname || u.username;
      var uKey = String(u.id || u.username);

      return '<tr>' +
        '<td class="font-mono text-xs font-bold whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(u.user_code || ('#USR-' + u.id)) + '</td>' +
        '<td>' +
          '<div class="flex items-center gap-2.5">' +
            '<span class="grid h-8 w-8 place-items-center rounded-full ' + (isAdmin ? 'bg-brand text-white' : (isLocked ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700')) + ' text-xs font-extrabold shrink-0">' + escapeHtml(name.charAt(0).toUpperCase()) + '</span>' +
            '<div class="min-w-0">' +
              '<p class="font-bold text-xs truncate">' + escapeHtml(name) + '</p>' +
              '<p class="text-[11px] font-mono truncate" style="color: var(--admin-text-secondary);">@' + escapeHtml(u.username) + '</p>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td class="text-xs max-w-[180px] truncate" title="' + escapeHtml(u.email || '--') + '">' + escapeHtml(u.email || '--') + '</td>' +
        '<td class="text-xs font-mono whitespace-nowrap">' + escapeHtml(u.phone || '--') + '</td>' +
        '<td class="whitespace-nowrap">' + (isAdmin ? '<span class="vlu-badge vlu-badge-brand">Admin' + (isRoot ? ' gốc' : '') + '</span>' : '<span class="vlu-badge vlu-badge-neutral">Khách hàng</span>') + '</td>' +
        '<td class="text-xs font-mono whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(u.created_at || '--') + '</td>' +
        '<td class="text-center font-bold tabular-nums">' + escapeHtml(u.orderCount || 0) + '</td>' +
        '<td class="text-right font-extrabold text-brand tabular-nums whitespace-nowrap">' + escapeHtml(engine.formatVND(u.totalSpent || 0)) + '</td>' +
        '<td class="whitespace-nowrap">' + (isAdmin ? '<span class="vlu-badge vlu-badge-neutral">Hệ thống</span>' : getUserTierBadgeHtml(u.tierKey, u.tier)) + '</td>' +
        '<td class="whitespace-nowrap">' +
          (isLocked
            ? '<span class="vlu-badge vlu-badge-locked" title="' + escapeHtml(u.lock_reason || '') + '"><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>Đang khóa</span>'
            : '<span class="vlu-badge vlu-badge-success"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Hoạt động</span>') +
        '</td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<div class="inline-flex items-center gap-1">' +
            '<button type="button" class="btn-view-customer-360 vlu-btn vlu-btn-secondary vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(uKey) + '" title="Hồ sơ Khách hàng 360°">360°</button>' +
            '<button type="button" class="btn-edit-user vlu-btn vlu-btn-secondary vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(uKey) + '" title="Sửa liên hệ &amp; Vai trò">Sửa</button>' +
            '<button type="button" class="btn-toggle-user-lock vlu-btn ' + (isLocked ? 'vlu-btn-navy' : 'vlu-btn-danger') + ' vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(uKey) + '"' + (isRoot ? ' disabled title="Không thể khóa tài khoản Quản trị viên gốc"' : (' title="' + (isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản') + '"')) + '>' + (isLocked ? 'Mở' : 'Khóa') + '</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('usersPagination'), filtered.length, usersPage, pageSize, function (nextP) {
      usersPage = nextP;
      renderUsers();
    });
  }

  function renderMembers() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var members = engine.getMemberInsights();
    var tierGrid = document.getElementById('membersTierConfigGrid');
    var tbody = document.getElementById('membersTableBody');
    var badge = document.getElementById('membersCountBadge');
    var searchEl = document.getElementById('memberSearchInput');
    var tierSel = document.getElementById('memberTierFilterSelect');

    if (tierGrid) {
      var countsByTier = { member: 0, silver: 0, gold: 0, diamond: 0 };
      members.forEach(function (m) {
        countsByTier[m.tierKey || 'member'] = (countsByTier[m.tierKey || 'member'] || 0) + 1;
      });
      tierGrid.innerHTML =
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase" style="color: var(--admin-text-secondary);">Member / Mới (&lt; 1đ)</p><p class="text-xl font-extrabold mt-1 tabular-nums">' + countsByTier.member + ' TV</p><p class="text-[10px] mt-0.5" style="color: var(--admin-text-secondary);">Tích 1 điểm / 100.000₫</p></div>' +
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase text-blue-600">Silver (&gt; 0đ – &lt; 20tr)</p><p class="text-xl font-extrabold mt-1 text-blue-600 tabular-nums">' + countsByTier.silver + ' TV</p><p class="text-[10px] mt-0.5" style="color: var(--admin-text-secondary);">Ưu đãi đổi voucher 100 điểm</p></div>' +
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase text-amber-600">Gold (20tr – &lt; 50tr)</p><p class="text-xl font-extrabold mt-1 text-amber-600 tabular-nums">' + countsByTier.gold + ' TV</p><p class="text-[10px] mt-0.5" style="color: var(--admin-text-secondary);">Ưu tiên giao hàng &amp; CSKH</p></div>' +
        '<div class="vlu-card p-4"><p class="text-[11px] font-bold uppercase text-brand">VLU Diamond (≥ 50tr)</p><p class="text-xl font-extrabold mt-1 text-brand tabular-nums">' + countsByTier.diamond + ' TV</p><p class="text-[10px] mt-0.5" style="color: var(--admin-text-secondary);">Đặc quyền VIP Flagship</p></div>';
    }

    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var tierF = tierSel ? tierSel.value : 'all';
    var filtered = members.filter(function (m) {
      var mQ = !q ||
        engine.normalizeText(m.fullname).indexOf(q) !== -1 ||
        engine.normalizeText(m.username).indexOf(q) !== -1 ||
        engine.normalizeText(m.email).indexOf(q) !== -1 ||
        String(m.phone || '').indexOf(q) !== -1;
      var mT = tierF === 'all' || String(m.tierKey || 'member') === tierF;
      return mQ && mT;
    });

    if (badge) badge.textContent = filtered.length + ' / ' + members.length + ' thành viên';
    if (!tbody) return;

    var perPage = 15;
    var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (membersPage > totalPages) membersPage = 1;
    var slice = filtered.slice((membersPage - 1) * perPage, membersPage * perPage);

    if (!slice.length) {
      tbody.innerHTML = emptyRowHtml(6, 'Chưa có thành viên phù hợp', 'Thử xóa từ khóa hoặc đổi hạng thành viên.');
      renderPagination(document.getElementById('membersPagination'), 0, 1, perPage, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (m) {
      var uKey = String(m.id || m.username);
      var tierCls = m.tierKey === 'diamond' ? 'vlu-badge-purple' : (m.tierKey === 'gold' ? 'vlu-badge-warning' : (m.tierKey === 'silver' ? 'vlu-badge-info' : 'vlu-badge-neutral'));
      return '<tr>' +
        '<td><p class="font-bold text-xs">' + escapeHtml(m.fullname || m.username) + '</p><p class="text-[11px]" style="color: var(--admin-text-secondary);">' + escapeHtml(m.email || m.username) + '</p></td>' +
        '<td class="text-center font-bold tabular-nums">' + m.orderCount + ' đơn</td>' +
        '<td class="text-right font-extrabold text-brand tabular-nums">' + escapeHtml(engine.formatVND(m.totalSpent)) + '</td>' +
        '<td class="text-center font-extrabold text-indigo-600 tabular-nums">' + escapeHtml(m.points) + ' điểm</td>' +
        '<td><span class="vlu-badge ' + tierCls + '">' + escapeHtml(m.tier) + '</span></td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<button type="button" class="btn-adjust-member-points vlu-btn vlu-btn-navy vlu-btn-sm" data-id="' + escapeHtml(uKey) + '">Thưởng / Sửa điểm</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('membersPagination'), filtered.length, membersPage, perPage, function (nextP) {
      membersPage = nextP;
      renderMembers();
    });
  }

  function renderReviews() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var tbody = document.getElementById('reviewsTableBody');
    var badge = document.getElementById('reviewsCountBadge');
    var searchEl = document.getElementById('reviewsSearchInput');
    var kindEl = document.getElementById('reviewsKindFilter');
    var starEl = document.getElementById('reviewsStarFilter');
    var replyEl = document.getElementById('reviewsReplyFilter');

    var reviews = engine.getAllProductReviews();
    var qas = engine.getAllProductQAs();
    var allItems = reviews.concat(qas).sort(function (a, b) {
      return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
    });

    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var kindF = kindEl ? kindEl.value : 'all';
    var starF = starEl ? starEl.value : 'all';
    var replyF = replyEl ? replyEl.value : 'all';

    var filtered = allItems.filter(function (it) {
      var mQ = !q ||
        engine.normalizeText(it.productName).indexOf(q) !== -1 ||
        engine.normalizeText(it.authorName).indexOf(q) !== -1 ||
        engine.normalizeText(it.comment || it.question).indexOf(q) !== -1;
      var mKind = kindF === 'all' || it.kind === kindF;
      var mStar = starF === 'all' || (it.kind === 'review' && String(it.rating) === String(starF));
      var hasReply = it.kind === 'review' ? Boolean(it.adminReply && it.adminReply.text) : Boolean(it.answer && it.answer.text);
      var mRep = replyF === 'all' ||
        (replyF === 'replied' && hasReply) ||
        (replyF === 'unanswered' && !hasReply) ||
        (replyF === 'hidden' && Boolean(it.hidden));
      return mQ && mKind && mStar && mRep;
    });

    if (badge) badge.textContent = filtered.length + ' / ' + allItems.length + ' mục (' + reviews.length + ' đánh giá · ' + qas.length + ' Q&A)';
    if (!tbody) return;

    var perPage = 15;
    var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (reviewsPage > totalPages) reviewsPage = 1;
    var slice = filtered.slice((reviewsPage - 1) * perPage, reviewsPage * perPage);

    if (!slice.length) {
      tbody.innerHTML = emptyRowHtml(7, 'Không có đánh giá hoặc câu hỏi Q&A phù hợp', 'Các đánh giá và câu hỏi từ khách hàng trên trang Chi tiết sản phẩm sẽ đồng bộ về đây.');
      renderPagination(document.getElementById('reviewsPagination'), 0, 1, perPage, function () {});
      return;
    }

    tbody.innerHTML = slice.map(function (it) {
      var isQa = it.kind === 'qa';
      var bodyText = isQa ? it.question : it.comment;
      var replyObj = isQa ? it.answer : it.adminReply;
      var kindBadge = isQa
        ? '<span class="vlu-badge vlu-badge-info">Q&amp;A</span>'
        : '<span class="vlu-badge vlu-badge-warning">Đánh giá</span>';
      var statusBadge = it.hidden
        ? '<span class="vlu-badge vlu-badge-danger">Đang ẩn</span>'
        : (replyObj && replyObj.text ? '<span class="vlu-badge vlu-badge-success">Đã phản hồi</span>' : '<span class="vlu-badge vlu-badge-neutral">Chờ phản hồi</span>');

      return '<tr class="' + (it.hidden ? 'opacity-65' : '') + '">' +
        '<td><div class="flex flex-col gap-1">' + kindBadge + '<span class="font-bold text-xs">' + escapeHtml(it.productName) + '</span></div></td>' +
        '<td class="text-xs font-semibold">' + escapeHtml(it.authorName || 'Khách hàng') + '</td>' +
        '<td class="whitespace-nowrap">' + (isQa ? '<span class="text-xs font-semibold text-slate-500">' + escapeHtml(it.topic || 'Tư vấn') + '</span>' : '<span class="text-amber-500 font-bold">' + ('★'.repeat(it.rating)) + '</span>') + '</td>' +
        '<td class="text-xs max-w-md space-y-1">' +
          '<p>' + escapeHtml(bodyText || '--') + '</p>' +
          (replyObj && replyObj.text ? '<p class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-2 py-1">↳ Admin: ' + escapeHtml(replyObj.text) + '</p>' : '') +
        '</td>' +
        '<td class="whitespace-nowrap">' + statusBadge + '</td>' +
        '<td class="text-xs font-mono whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(it.createdAt ? String(it.createdAt).slice(0, 10) : '--') + '</td>' +
        '<td class="text-right whitespace-nowrap">' +
          '<div class="inline-flex items-center gap-1">' +
            '<button type="button" class="btn-reply-review-qa vlu-btn vlu-btn-navy vlu-btn-sm !px-2.5 !py-1" data-kind="' + escapeHtml(it.kind) + '" data-uid="' + escapeHtml(it.uid) + '">' + (replyObj ? 'Sửa trả lời' : 'Phản hồi') + '</button>' +
            '<button type="button" class="btn-toggle-review-qa-hide vlu-btn vlu-btn-secondary vlu-btn-sm !px-2 !py-1" data-kind="' + escapeHtml(it.kind) + '" data-uid="' + escapeHtml(it.uid) + '">' + (it.hidden ? 'Hiện' : 'Ẩn') + '</button>' +
            '<button type="button" class="btn-delete-review-qa p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-kind="' + escapeHtml(it.kind) + '" data-uid="' + escapeHtml(it.uid) + '" title="Xóa"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    renderPagination(document.getElementById('reviewsPagination'), filtered.length, reviewsPage, perPage, function (nextP) {
      reviewsPage = nextP;
      renderReviews();
    });
  }

  function renderVouchers() {
    var engine = window.VLU_ADMIN;
    var tbody = document.getElementById('vouchersTableBody');
    var badge = document.getElementById('vouchersCountBadge');
    if (!engine || !tbody) return;

    var searchEl = document.getElementById('voucherSearchInput');
    var typeEl = document.getElementById('voucherTypeFilter');
    var statusEl = document.getElementById('voucherStatusFilter');
    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var typeF = typeEl ? typeEl.value : 'all';
    var stF = statusEl ? statusEl.value : 'all';

    var allVouchers = engine.getVouchers();
    var filtered = allVouchers.filter(function (v) {
      var mQ = !q || engine.normalizeText(v.code).indexOf(q) !== -1 || engine.normalizeText(v.label).indexOf(q) !== -1;
      var mT = typeF === 'all' || String(v.type) === typeF;
      var mS = stF === 'all' || String(v.status || 'active') === stF;
      return mQ && mT && mS;
    });

    if (badge) badge.textContent = filtered.length + ' / ' + allVouchers.length + ' mã voucher';
    if (!filtered.length) {
      tbody.innerHTML = emptyRowHtml(8, 'Chưa có mã Voucher phù hợp', 'Nhấn "+ Thêm Voucher mới" để tạo mã ưu đãi đồng bộ trực tiếp với giỏ hàng.');
      return;
    }

    tbody.innerHTML = filtered.map(function (v) {
      var isActive = String(v.status || 'active') === 'active';
      var valText = v.type === 'percent'
        ? ('-' + v.value + '%' + (v.maxDiscount > 0 ? (' (Tối đa ' + engine.formatVND(v.maxDiscount) + ')') : ''))
        : (v.type === 'freeship' || v.value === 0 ? 'Miễn phí vận chuyển' : '-' + engine.formatVND(v.value));
      var scopeText = [];
      if (v.brandFilter && v.brandFilter !== 'all') scopeText.push('Hãng: ' + v.brandFilter);
      if (v.categoryFilter && v.categoryFilter !== 'all') scopeText.push('DM: ' + v.categoryFilter);
      var usageLimitTxt = Number(v.usageLimit) > 0 ? (' / ' + v.usageLimit) : ' / KGH';

      return '<tr>' +
        '<td><span class="vlu-badge vlu-badge-brand font-mono font-extrabold">' + escapeHtml(v.code) + '</span></td>' +
        '<td class="text-xs max-w-xs"><p class="font-semibold">' + escapeHtml(v.label) + '</p>' + (scopeText.length ? '<p class="text-[10px] text-indigo-600 font-semibold">' + escapeHtml(scopeText.join(' · ')) + '</p>' : '') + '</td>' +
        '<td class="font-extrabold text-emerald-600 text-xs whitespace-nowrap">' + escapeHtml(valText) + '</td>' +
        '<td class="text-xs tabular-nums whitespace-nowrap">' + escapeHtml(engine.formatVND(v.minOrder || 0)) + '</td>' +
        '<td class="text-center font-bold text-xs tabular-nums">' + escapeHtml(v.usedCount) + escapeHtml(usageLimitTxt) + '</td>' +
        '<td class="text-xs font-mono whitespace-nowrap" style="color: var(--admin-text-secondary);">' + escapeHtml(v.expiresAt || '2026-12-31') + '</td>' +
        '<td><div class="flex items-center gap-2"><button type="button" class="vlu-switch btn-toggle-voucher ' + (isActive ? 'is-on' : '') + '" data-id="' + escapeHtml(v.id) + '"></button><span class="text-xs font-semibold ' + (isActive ? 'text-emerald-600' : 'text-slate-400') + '">' + (isActive ? 'Bật' : 'Tắt') + '</span></div></td>' +
        '<td class="text-right whitespace-nowrap"><div class="inline-flex items-center gap-1">' +
          '<button type="button" class="btn-edit-voucher vlu-btn vlu-btn-secondary vlu-btn-sm !px-2.5 !py-1" data-id="' + escapeHtml(v.id) + '">Sửa</button>' +
          '<button type="button" class="btn-delete-voucher p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-id="' + escapeHtml(v.id) + '" title="Xóa Voucher"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderPromotions() {
    var engine = window.VLU_ADMIN;
    var tbody = document.getElementById('promotionsTableBody');
    var campGrid = document.getElementById('promotionsCampaignsGrid');
    var badge = document.getElementById('promotionsCountBadge');
    var searchInput = document.getElementById('promoProductSearchInput');
    if (!engine) return;

    var campaigns = engine.getPromotions();
    if (campGrid) {
      campGrid.innerHTML = campaigns.length ? campaigns.map(function (c) {
        var isAct = String(c.status || 'active') === 'active';
        var discTxt = c.discountType === 'custom' ? 'Giá giảm tùy chỉnh' : (c.discountType === 'percent' ? ('Giảm ' + c.discountValue + '%') : ('Giảm ' + engine.formatVND(c.discountValue)));
        return '<div class="vlu-card p-5 space-y-3">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<div><span class="vlu-badge ' + (isAct ? 'vlu-badge-brand' : 'vlu-badge-neutral') + '">' + escapeHtml(c.badge || 'FLASH SALE') + '</span>' +
            '<h4 class="text-sm font-extrabold mt-1.5">' + escapeHtml(c.name) + '</h4>' +
            '<p class="text-xs mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(discTxt) + ' · ' + (c.productIds ? c.productIds.length : 0) + ' sản phẩm · ' + escapeHtml(c.startAt || '') + ' → ' + escapeHtml(c.endAt || '') + '</p></div>' +
            '<button type="button" class="vlu-switch btn-toggle-promo ' + (isAct ? 'is-on' : '') + '" data-id="' + escapeHtml(c.id) + '" title="Bật / Tắt chiến dịch"></button>' +
          '</div>' +
          '<div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">' +
            '<button type="button" class="btn-edit-promo vlu-btn vlu-btn-secondary vlu-btn-sm" data-id="' + escapeHtml(c.id) + '">Sửa chiến dịch</button>' +
            '<button type="button" class="btn-delete-promo vlu-btn vlu-btn-danger vlu-btn-sm" data-id="' + escapeHtml(c.id) + '">Xóa</button>' +
          '</div>' +
        '</div>';
      }).join('') : '<div class="lg:col-span-2 vlu-card p-6 text-center text-xs" style="color: var(--admin-text-secondary);">Chưa có chiến dịch khuyến mãi nào. Nhấn "+ Tạo Chiến dịch Flash Sale" để áp dụng giảm giá hàng loạt lên Storefront.</div>';
    }

    var q = searchInput ? engine.normalizeText(searchInput.value) : '';
    var promos = engine.getProducts().filter(function (p) {
      var hasDisc = Number(p.price) > 0 && Number(p.old_price) > Number(p.price);
      var mQ = !q || engine.normalizeText(p.name).indexOf(q) !== -1 || engine.normalizeText(p.brand).indexOf(q) !== -1;
      return hasDisc && mQ;
    });
    if (badge) badge.textContent = promos.length + ' sản phẩm khuyến mãi';
    if (!tbody) return;

    if (!promos.length) {
      tbody.innerHTML = emptyRowHtml(6, 'Chưa có sản phẩm nào đang giảm giá', 'Tạo chiến dịch hoặc chỉnh giá niêm yết trên sản phẩm để xuất hiện tại #san-pham-khuyen-mai.');
      return;
    }

    tbody.innerHTML = promos.map(function (p) {
      var pct = Math.round(((p.old_price - p.price) / p.old_price) * 100);
      return '<tr>' +
        '<td class="font-bold text-xs">' + escapeHtml(p.name) + '</td>' +
        '<td class="text-xs">' + escapeHtml(p.brand || p.category_name) + '</td>' +
        '<td class="text-xs text-slate-400 line-through tabular-nums">' + escapeHtml(engine.formatVND(p.old_price)) + '</td>' +
        '<td class="font-extrabold text-brand tabular-nums">' + escapeHtml(engine.formatVND(p.price)) + '</td>' +
        '<td><span class="vlu-badge vlu-badge-danger">-' + pct + '%</span></td>' +
        '<td class="text-right"><button type="button" class="btn-edit-product vlu-btn vlu-btn-secondary vlu-btn-sm" data-id="' + escapeHtml(p.id) + '">Chỉnh giá</button></td>' +
      '</tr>';
    }).join('');
  }

  function renderNotifications() {
    var engine = window.VLU_ADMIN;
    var container = document.getElementById('notificationsListContainer');
    var filterEl = document.getElementById('notifFilterSelect');
    if (!engine || !container) return;

    var notifs = engine.getAdminNotifications();
    var flt = filterEl ? filterEl.value : 'all';
    var filtered = flt === 'unread' ? notifs.filter(function (n) { return !n.read; }) : notifs;

    if (!filtered.length) {
      container.innerHTML = '<div class="vlu-empty-state py-12"><p class="text-xs font-semibold">Không có thông báo vận hành nào.</p></div>';
      return;
    }

    container.innerHTML = filtered.map(function (n) {
      var badgeCls = n.type === 'danger' ? 'vlu-badge-danger' : (n.type === 'warning' ? 'vlu-badge-warning' : 'vlu-badge-info');
      return '<div class="p-4 flex flex-wrap items-center justify-between gap-3 ' + (n.read ? 'opacity-65' : '') + '">' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-center gap-2">' +
            '<span class="vlu-badge ' + badgeCls + '">' + (n.read ? 'Đã đọc' : 'Mới') + '</span>' +
            '<h4 class="text-xs font-extrabold">' + escapeHtml(n.title) + '</h4>' +
          '</div>' +
          '<p class="text-xs mt-1" style="color: var(--admin-text-secondary);">' + escapeHtml(n.message) + '</p>' +
        '</div>' +
        '<div class="flex items-center gap-2">' +
          '<span class="text-[11px]" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatRelativeTime(n.created_at)) + '</span>' +
          '<button type="button" class="btn-notif-open vlu-btn vlu-btn-secondary vlu-btn-sm" data-nid="' + escapeHtml(n.id) + '" data-tab="' + escapeHtml(n.targetTab || 'dashboard') + '" data-filter="' + escapeHtml(n.targetFilter || '') + '">Mở</button>' +
        '</div>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.btn-notif-open').forEach(function (btn) {
      btn.addEventListener('click', function () {
        engine.markNotificationRead(btn.getAttribute('data-nid'));
        navigateWithFilter(btn.getAttribute('data-tab'), btn.getAttribute('data-filter'));
      });
    });
  }

  function renderActivityLog() {
    var engine = window.VLU_ADMIN;
    var container = document.getElementById('activityLogContainer');
    var filterEl = document.getElementById('activityTypeFilter');
    var searchEl = document.getElementById('activitySearchInput');
    if (!engine || !container) return;

    var flt = filterEl ? filterEl.value : 'all';
    var q = searchEl ? engine.normalizeText(searchEl.value) : '';
    var items = engine.getRecentActivityFeed(80).filter(function (ev) {
      var mT = flt === 'all' || ev.source === flt;
      var mQ = !q || engine.normalizeText(ev.title).indexOf(q) !== -1 || engine.normalizeText(ev.detail).indexOf(q) !== -1 || engine.normalizeText(ev.actor).indexOf(q) !== -1;
      return mT && mQ;
    });

    if (!items.length) {
      container.innerHTML = '<div class="vlu-empty-state py-12"><p class="text-xs">Chưa có nhật ký hoạt động phù hợp.</p></div>';
      return;
    }

    container.innerHTML = items.map(function (ev) {
      var srcBadge = ev.source === 'inventory' ? 'vlu-badge-indigo' : (ev.source === 'security' ? 'vlu-badge-danger' : (ev.source === 'order' ? 'vlu-badge-warning' : 'vlu-badge-neutral'));
      return '<div class="p-4 flex items-center justify-between gap-4">' +
        '<div class="min-w-0">' +
          '<div class="flex items-center gap-2"><span class="vlu-badge ' + srcBadge + ' !text-[10px]">' + escapeHtml(ev.source || 'admin') + '</span><p class="text-xs font-bold truncate">' + escapeHtml(ev.title) + '</p></div>' +
          '<p class="text-[11px] mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(ev.detail) + ' · Bởi <strong>' + escapeHtml(ev.actor || 'Hệ thống') + '</strong></p>' +
        '</div>' +
        '<span class="text-[11px] font-mono shrink-0" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDateTime ? engine.formatDateTime(ev.created_at) : engine.formatDate(ev.created_at)) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderSettings() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var settings = engine.getSystemSettings();

    var sStore = document.getElementById('settingStoreName');
    var sHot = document.getElementById('settingHotline');
    var sMail = document.getElementById('settingSupportEmail');
    var sAddr = document.getElementById('settingAddress');
    var sLow = document.getElementById('settingLowStockThreshold');
    var sFee = document.getElementById('settingShippingFee');
    var sFree = document.getElementById('settingFreeShipThreshold');
    if (sStore) sStore.value = settings.storeName || '';
    if (sHot) sHot.value = settings.hotline || '';
    if (sMail) sMail.value = settings.supportEmail || '';
    if (sAddr) sAddr.value = settings.address || '';
    if (sLow) sLow.value = settings.defaultLowStockThreshold || 5;
    if (sFee) sFee.value = settings.standardShippingFee || 0;
    if (sFree) sFree.value = settings.freeShippingThreshold || 2000000;

    var profileBox = document.getElementById('settingsAdminProfileBox');
    if (profileBox) {
      var auth = engine.checkAuth();
      var user = auth && auth.user ? auth.user : {};
      var displayName = user.fullname || user.full_name || user.name || 'Quản trị viên VLU';
      var email = user.email || 'admin@vluflagship.vn';
      var phone = user.phone || 'Chưa cập nhật';
      var roleLabel = (Number(user.role) === 1 || email.toLowerCase() === 'admin@vluflagship.vn')
        ? 'Quản trị viên cấp cao (Admin)'
        : 'Người dùng';
      profileBox.innerHTML =
        '<div class="p-3.5 rounded-xl border" style="border-color: var(--admin-border); background: var(--admin-bg-sub);">' +
          '<p class="text-[11px] font-bold uppercase tracking-wider mb-1" style="color: var(--admin-text-muted);">Họ tên &amp; Tài khoản</p>' +
          '<p class="text-sm font-bold" style="color: var(--admin-text-primary);">' + escapeHtml(displayName) + '</p>' +
        '</div>' +
        '<div class="p-3.5 rounded-xl border" style="border-color: var(--admin-border); background: var(--admin-bg-sub);">' +
          '<p class="text-[11px] font-bold uppercase tracking-wider mb-1" style="color: var(--admin-text-muted);">Email quản trị</p>' +
          '<p class="text-sm font-semibold break-all" style="color: var(--admin-text-primary);">' + escapeHtml(email) + '</p>' +
        '</div>' +
        '<div class="p-3.5 rounded-xl border" style="border-color: var(--admin-border); background: var(--admin-bg-sub);">' +
          '<p class="text-[11px] font-bold uppercase tracking-wider mb-1" style="color: var(--admin-text-muted);">Số điện thoại</p>' +
          '<p class="text-sm font-semibold" style="color: var(--admin-text-primary);">' + escapeHtml(phone) + '</p>' +
        '</div>' +
        '<div class="p-3.5 rounded-xl border" style="border-color: var(--admin-border); background: var(--admin-bg-sub);">' +
          '<p class="text-[11px] font-bold uppercase tracking-wider mb-1" style="color: var(--admin-text-muted);">Vai trò &amp; Phiên</p>' +
          '<p class="text-sm font-semibold text-emerald-600">● ' + escapeHtml(roleLabel) + '</p>' +
        '</div>';
    }

    var box = document.getElementById('settingsBackendStatusBox');
    if (!box) return;
    box.innerHTML =
      '<div class="space-y-2">' +
        '<div class="vlu-skeleton h-4 w-48"></div>' +
        '<div class="vlu-skeleton h-3.5 w-64"></div>' +
      '</div>';

    fetch('backend/api/auth.php?action=status', { headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        box.innerHTML =
          '<p class="font-bold text-emerald-600">● API Backend phản hồi bình thường</p>' +
          '<p>Chế độ lưu trữ: <strong>' + escapeHtml(data.storage_mode === 'mysql' ? 'MySQL PDO + JSON Fallback' : 'JSON Server-Side Fallback') + '</strong></p>' +
          '<p style="color: var(--admin-text-secondary);">' + escapeHtml(data.message || '') + '</p>';
      })
      .catch(function () {
        box.innerHTML =
          '<div class="vlu-error-state">' +
            '<p class="font-bold mb-1">Không thể kết nối Backend API trực tiếp</p>' +
            '<p class="text-xs opacity-90">Hệ thống đang tự đồng bộ an toàn qua localStorage &amp; BroadcastChannel(vlu_store_sync).</p>' +
          '</div>';
      });
  }

  /* ==========================================================================
     11. SỰ KIỆN TOÀN CỤC & MODAL CRUD
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initAdmin();
    var engine = window.VLU_ADMIN;

    // Mở Modal thêm
    var btnOpenAddProduct = document.getElementById('btnOpenAddProduct');
    if (btnOpenAddProduct) btnOpenAddProduct.addEventListener('click', openAddProductModal);

    var btnOpenAddCategory = document.getElementById('btnOpenAddCategory');
    if (btnOpenAddCategory) btnOpenAddCategory.addEventListener('click', openAddCategoryModal);

    var btnOpenAddBrand = document.getElementById('btnOpenAddBrand');
    if (btnOpenAddBrand) btnOpenAddBrand.addEventListener('click', openAddBrandModal);

    // Filter Sản phẩm đa tiêu chí (debounce tìm kiếm + khoảng giá + trạng thái + sắp xếp)
    var prodSearchEl = document.getElementById('productSearchInput');
    if (prodSearchEl) {
      prodSearchEl.addEventListener('input', function () {
        if (productSearchTimer) clearTimeout(productSearchTimer);
        productSearchTimer = setTimeout(function () {
          productsPage = 1;
          renderProducts();
        }, 160);
      });
    }

    var priceRangeEl = document.getElementById('productPriceRangeFilter');
    if (priceRangeEl) {
      priceRangeEl.addEventListener('change', function () {
        var wrap = document.getElementById('productCustomPriceWrap');
        if (wrap) wrap.classList.toggle('hidden', priceRangeEl.value !== 'custom');
        productsPage = 1;
        renderProducts();
      });
    }

    ['productPriceMinInput', 'productPriceMaxInput'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () {
        productsPage = 1;
        renderProducts();
      });
    });

    ['productDeviceCategoryFilter', 'productCategoryFilter', 'productStockFilter', 'productStatusFilter', 'productSortSelect', 'productsPageSizeSelect'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', function () {
        productsPage = 1;
        renderProducts();
      });
    });

    var btnResetFilters = document.getElementById('btnResetProductFilters');
    if (btnResetFilters) btnResetFilters.addEventListener('click', resetProductFilters);

    var btnExpProdCsv = document.getElementById('btnExportProductsCSV');
    if (btnExpProdCsv) btnExpProdCsv.addEventListener('click', exportProductsCSV);

    var btnExpProdJson = document.getElementById('btnExportProductsJSON');
    if (btnExpProdJson) btnExpProdJson.addEventListener('click', exportProductsJSON);

    // Select All & Bulk Actions Sản phẩm
    var prodSelectAll = document.getElementById('prodSelectAllCheckbox');
    if (prodSelectAll) {
      prodSelectAll.addEventListener('change', function () {
        var checked = Boolean(prodSelectAll.checked);
        document.querySelectorAll('#productsTableBody .prod-row-checkbox').forEach(function (cb) {
          var pid = cb.getAttribute('data-id');
          cb.checked = checked;
          if (checked) selectedProductIds[pid] = true;
          else delete selectedProductIds[pid];
        });
        syncBulkActionBar(getFilteredSortedProducts().slice((productsPage - 1) * PRODUCTS_PER_PAGE, productsPage * PRODUCTS_PER_PAGE));
      });
    }

    var btnBulkClear = document.getElementById('btnBulkClearSelection');
    if (btnBulkClear) {
      btnBulkClear.addEventListener('click', function () {
        selectedProductIds = {};
        renderProducts();
      });
    }

    var btnBulkShow = document.getElementById('btnBulkShow');
    if (btnBulkShow) {
      btnBulkShow.addEventListener('click', function () {
        var ids = Object.keys(selectedProductIds).filter(function (k) { return selectedProductIds[k]; });
        if (!ids.length) return;
        var n = engine.bulkUpdateProducts(ids, { status: 'active' });
        engine.showToast('Đã bật hiển thị cho ' + n + ' sản phẩm.');
      });
    }

    var btnBulkHide = document.getElementById('btnBulkHide');
    if (btnBulkHide) {
      btnBulkHide.addEventListener('click', function () {
        var ids = Object.keys(selectedProductIds).filter(function (k) { return selectedProductIds[k]; });
        if (!ids.length) return;
        var n = engine.bulkUpdateProducts(ids, { status: 'hidden' });
        engine.showToast('Đã ẩn ' + n + ' sản phẩm khỏi storefront.');
      });
    }

    var btnBulkMoveCat = document.getElementById('btnBulkMoveCategory');
    if (btnBulkMoveCat) {
      btnBulkMoveCat.addEventListener('click', function () {
        var ids = Object.keys(selectedProductIds).filter(function (k) { return selectedProductIds[k]; });
        var sel = document.getElementById('bulkMoveCategorySelect');
        if (!ids.length || !sel || !sel.value) return;
        var n = engine.bulkUpdateProducts(ids, { category: sel.value });
        engine.showToast('Đã chuyển danh mục cho ' + n + ' sản phẩm.');
      });
    }

    var btnBulkDelete = document.getElementById('btnBulkDelete');
    if (btnBulkDelete) {
      btnBulkDelete.addEventListener('click', function () {
        var ids = Object.keys(selectedProductIds).filter(function (k) { return selectedProductIds[k]; });
        if (!ids.length) return;
        openConfirmModal({
          title: 'Xóa ' + ids.length + ' sản phẩm đã chọn?',
          message: 'Bạn có chắc chắn muốn xóa hàng loạt ' + ids.length + ' sản phẩm khỏi hệ thống không?',
          warning: 'Sản phẩm bị xóa sẽ đồng thời ngừng hiển thị trên toàn bộ Storefront và giỏ hàng.',
          confirmLabel: 'Xóa ' + ids.length + ' sản phẩm',
          onConfirm: function () {
            var n = engine.bulkDeleteProducts(ids);
            selectedProductIds = {};
            engine.showToast('Đã xóa thành công ' + n + ' sản phẩm.');
          }
        });
      });
    }

    // Filter & View Switcher Danh mục + Thương hiệu
    var catSearch = document.getElementById('categorySearchInput');
    if (catSearch) catSearch.addEventListener('input', renderCategories);
    var catStFilter = document.getElementById('categoryStatusFilter');
    if (catStFilter) catStFilter.addEventListener('change', renderCategories);
    document.querySelectorAll('[data-cat-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        categoryViewMode = btn.getAttribute('data-cat-view') || 'table';
        try { localStorage.setItem('vlu_admin_cat_view', categoryViewMode); } catch (e) {}
        renderCategories();
      });
    });

    var brandSearch = document.getElementById('brandSearchInput');
    if (brandSearch) brandSearch.addEventListener('input', renderBrands);
    var brandStFilter = document.getElementById('brandStatusFilter');
    if (brandStFilter) brandStFilter.addEventListener('change', renderBrands);
    document.querySelectorAll('[data-brand-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        brandViewMode = btn.getAttribute('data-brand-view') || 'grid';
        try { localStorage.setItem('vlu_admin_brand_view', brandViewMode); } catch (e) {}
        renderBrands();
      });
    });

    // Filter Kho hàng (SKU, Danh mục, Hãng, Màu, Dung lượng, Chế độ Nhập/Xuất/Kiểm kê)
    ['inventorySearchInput', 'inventoryCategoryFilter', 'inventoryBrandFilter', 'inventoryColorFilter', 'inventoryVariantFilter', 'inventoryFilterSelect'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener(id === 'inventorySearchInput' ? 'input' : 'change', function () {
        inventoryPage = 1;
        inventoryLogsPage = 1;
        renderInventory();
      });
    });
    document.querySelectorAll('#inventoryViewTabs [data-inv-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        inventoryViewMode = btn.getAttribute('data-inv-view') || 'stock';
        inventoryPage = 1;
        inventoryLogsPage = 1;
        renderInventory();
      });
    });
    var btnOpenInvMv = document.getElementById('btnOpenInventoryMovement');
    if (btnOpenInvMv) btnOpenInvMv.addEventListener('click', function () { openInventoryMovementModal(); });
    var btnExpInvCsv = document.getElementById('btnExportInventoryCSV');
    if (btnExpInvCsv) btnExpInvCsv.addEventListener('click', exportInventoryCSV);
    var btnExpInvJson = document.getElementById('btnExportInventoryJSON');
    if (btnExpInvJson) btnExpInvJson.addEventListener('click', exportInventoryJSON);
    var btnResetInv = document.getElementById('btnResetInventoryFilters');
    if (btnResetInv) btnResetInv.addEventListener('click', function () {
      inventoryViewMode = 'stock';
      inventoryPage = 1;
      inventoryLogsPage = 1;
      var sEl = document.getElementById('inventorySearchInput');
      if (sEl) sEl.value = '';
      ['inventoryCategoryFilter', 'inventoryBrandFilter', 'inventoryColorFilter', 'inventoryVariantFilter', 'inventoryFilterSelect'].forEach(function (fid) {
        var fel = document.getElementById(fid);
        if (fel) fel.value = 'all';
      });
      renderInventory();
    });

    // Filter Đơn hàng (đa tiêu chí + KPI cards + sắp xếp + phân trang)
    var orderSearch = document.getElementById('orderSearchInput');
    if (orderSearch) {
      orderSearch.addEventListener('input', function () {
        ordersPage = 1;
        renderOrders();
      });
    }
    [
      'orderPaymentStatusFilter',
      'orderPaymentMethodFilter',
      'orderTotalRangeFilter',
      'orderSortSelect',
      'orderDateFrom',
      'orderDateTo',
      'ordersPageSizeSelect'
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', function () {
        if (id === 'orderTotalRangeFilter') {
          var customWrap = document.getElementById('orderTotalCustomWrap');
          if (customWrap) customWrap.classList.toggle('hidden', el.value !== 'custom');
        }
        ordersPage = 1;
        renderOrders();
      });
    });
    ['orderTotalMinInput', 'orderTotalMaxInput'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { ordersPage = 1; renderOrders(); });
    });
    var btnResetOrdFlt = document.getElementById('btnResetOrderFilters');
    if (btnResetOrdFlt) btnResetOrdFlt.addEventListener('click', resetOrderFilters);
    var btnExpOrdCsv = document.getElementById('btnExportOrdersCSV');
    if (btnExpOrdCsv) btnExpOrdCsv.addEventListener('click', exportOrdersCSV);
    var btnExpOrdJson = document.getElementById('btnExportOrdersJSON');
    if (btnExpOrdJson) btnExpOrdJson.addEventListener('click', exportOrdersJSON);

    document.querySelectorAll('[data-order-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        orderFilterStatus = btn.getAttribute('data-order-filter');
        ordersPage = 1;
        renderOrders();
      });
    });

    // Filter Thanh toán, Đổi trả, Tài khoản, Thành viên, Đánh giá, Marketing, Thông báo, Nhật ký, Cài đặt
    ['paymentMethodFilter', 'paymentStatusFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', function () { paymentsPage = 1; renderPayments(); });
    });
    var btnExpPay = document.getElementById('btnExportPaymentsCSV');
    if (btnExpPay) btnExpPay.addEventListener('click', exportPaymentsCSV);

    ['returnsSearchInput', 'returnsTypeFilter', 'returnsStatusFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener(id === 'returnsSearchInput' ? 'input' : 'change', function () { returnsPage = 1; renderReturns(); });
    });
    var btnCreateRet = document.getElementById('btnOpenCreateReturnModal');
    if (btnCreateRet) btnCreateRet.addEventListener('click', function () { openReturnTicketModal(); });

    ['memberSearchInput', 'memberTierFilterSelect'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener(id === 'memberSearchInput' ? 'input' : 'change', function () { membersPage = 1; renderMembers(); });
    });

    ['reviewsSearchInput', 'reviewsKindFilter', 'reviewsStarFilter', 'reviewsReplyFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener(id === 'reviewsSearchInput' ? 'input' : 'change', function () { reviewsPage = 1; renderReviews(); });
    });

    ['voucherSearchInput', 'voucherTypeFilter', 'voucherStatusFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener(id === 'voucherSearchInput' ? 'input' : 'change', renderVouchers);
    });
    var btnAddVch = document.getElementById('btnOpenAddVoucher');
    if (btnAddVch) btnAddVch.addEventListener('click', function () { openVoucherModal(); });

    var btnAddPromo = document.getElementById('btnOpenAddPromotion');
    if (btnAddPromo) btnAddPromo.addEventListener('click', function () { openPromotionModal(); });
    var promoProdSearch = document.getElementById('promoProductSearchInput');
    if (promoProdSearch) promoProdSearch.addEventListener('input', renderPromotions);

    [
      'userSearchInput',
      'userRoleFilter',
      'userStatusFilter',
      'userTierFilter',
      'userDateFrom',
      'userDateTo',
      'usersPageSizeSelect'
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener(id === 'userSearchInput' ? 'input' : 'change', function () {
        usersPage = 1;
        renderUsers();
      });
    });
    var btnResetUsrFlt = document.getElementById('btnResetUserFilters');
    if (btnResetUsrFlt) btnResetUsrFlt.addEventListener('click', resetUserFilters);

    var btnOpenSendNotif = document.getElementById('btnOpenSendCustomerNotif');
    if (btnOpenSendNotif) btnOpenSendNotif.addEventListener('click', openSendNotificationModal);
    var notifFilter = document.getElementById('notifFilterSelect');
    if (notifFilter) notifFilter.addEventListener('change', renderNotifications);
    var btnMarkAll = document.getElementById('btnMarkAllNotifsRead');
    if (btnMarkAll && engine) {
      btnMarkAll.addEventListener('click', function () {
        engine.markAllNotificationsRead();
        renderNotifications();
      });
    }
    var actFilter = document.getElementById('activityTypeFilter');
    if (actFilter) actFilter.addEventListener('change', renderActivityLog);
    var actSearch = document.getElementById('activitySearchInput');
    if (actSearch) actSearch.addEventListener('input', renderActivityLog);
    var btnExpAct = document.getElementById('btnExportActivityCSV');
    if (btnExpAct) btnExpAct.addEventListener('click', exportActivityLogsCSV);

    // Settings buttons
    var btnSaveSettings = document.getElementById('btnSaveSystemSettings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', function () {
        var res = engine.saveSystemSettings({
          storeName: (document.getElementById('settingStoreName') || {}).value,
          hotline: (document.getElementById('settingHotline') || {}).value,
          supportEmail: (document.getElementById('settingSupportEmail') || {}).value,
          address: (document.getElementById('settingAddress') || {}).value,
          defaultLowStockThreshold: (document.getElementById('settingLowStockThreshold') || {}).value,
          standardShippingFee: (document.getElementById('settingShippingFee') || {}).value,
          freeShippingThreshold: (document.getElementById('settingFreeShipThreshold') || {}).value
        });
        if (res.ok) engine.showToast('Đã lưu cấu hình cửa hàng & ngưỡng tồn kho!');
      });
    }
    var btnForceSync = document.getElementById('btnSettingsForceSync');
    if (btnForceSync) btnForceSync.addEventListener('click', refreshAllData);
    var btnExportOrders = document.getElementById('btnSettingsExportOrders');
    if (btnExportOrders) btnExportOrders.addEventListener('click', exportOrdersCSV);
    var btnBackupJson = document.getElementById('btnSettingsBackupJSON');
    if (btnBackupJson) btnBackupJson.addEventListener('click', exportFullSystemBackupFile);

    // Event Delegation cho bảng & modal
    document.addEventListener('click', function (e) {
      var invKpiBtn = e.target.closest('[data-inv-kpi]');
      if (invKpiBtn) {
        var ik = invKpiBtn.getAttribute('data-inv-kpi');
        var invFltEl = document.getElementById('inventoryFilterSelect');
        if (ik === 'recent_inbound') {
          inventoryViewMode = 'inbound';
        } else if (ik === 'low_stock') {
          inventoryViewMode = 'stock';
          if (invFltEl) invFltEl.value = 'low_stock';
        } else if (ik === 'out_of_stock') {
          inventoryViewMode = 'stock';
          if (invFltEl) invFltEl.value = 'out_of_stock';
        } else {
          inventoryViewMode = 'stock';
          if (invFltEl) invFltEl.value = 'all';
        }
        inventoryPage = 1;
        renderInventory();
        return;
      }

      var invMvBtn = e.target.closest('.btn-inv-movement');
      if (invMvBtn) {
        openInventoryMovementModal(invMvBtn.getAttribute('data-id'), invMvBtn.getAttribute('data-type'));
        return;
      }

      var recPayBtn = e.target.closest('.btn-reconcile-payment');
      if (recPayBtn) {
        var pOrdId = recPayBtn.getAttribute('data-id');
        var nextPaySt = recPayBtn.getAttribute('data-status') || 'paid';
        var recRes = engine.reconcileOrderPayment(pOrdId, nextPaySt, 'REC-' + String(Date.now()).slice(-6));
        if (recRes.ok) engine.showToast('Đã đối soát thanh toán cho đơn ' + pOrdId + '.');
        return;
      }

      var procRetBtn = e.target.closest('.btn-process-return');
      if (procRetBtn) {
        openReturnTicketModal(procRetBtn.getAttribute('data-uid'));
        return;
      }

      var adjPtsBtn = e.target.closest('.btn-adjust-member-points');
      if (adjPtsBtn) {
        openMemberPointsModal(adjPtsBtn.getAttribute('data-id'));
        return;
      }

      var repRevQaBtn = e.target.closest('.btn-reply-review-qa');
      if (repRevQaBtn) {
        openReplyReviewQaModal(repRevQaBtn.getAttribute('data-kind'), repRevQaBtn.getAttribute('data-uid'));
        return;
      }

      var togHideRevBtn = e.target.closest('.btn-toggle-review-qa-hide');
      if (togHideRevBtn) {
        var hKind = togHideRevBtn.getAttribute('data-kind');
        var hUid = togHideRevBtn.getAttribute('data-uid');
        if (hKind === 'qa') engine.toggleQAVisibility(hUid);
        else engine.toggleReviewVisibility(hUid);
        engine.showToast('Đã cập nhật trạng thái hiển thị.');
        return;
      }

      var delRevQaBtn = e.target.closest('.btn-delete-review-qa');
      if (delRevQaBtn) {
        var dKind = delRevQaBtn.getAttribute('data-kind');
        var dUid = delRevQaBtn.getAttribute('data-uid');
        openConfirmModal({
          title: dKind === 'qa' ? 'Xóa câu hỏi Q&A?' : 'Xóa đánh giá khách hàng?',
          message: 'Mục này sẽ bị xóa khỏi Storefront và hồ sơ tài khoản khách.',
          confirmLabel: 'Xác nhận xóa',
          onConfirm: function () {
            if (dKind === 'qa') engine.deleteProductQA(dUid);
            else engine.deleteProductReview(dUid);
            engine.showToast('Đã xóa thành công.');
          }
        });
        return;
      }

      var togVchBtn = e.target.closest('.btn-toggle-voucher');
      if (togVchBtn) {
        var vObj = engine.toggleVoucherStatus(togVchBtn.getAttribute('data-id'));
        if (vObj) engine.showToast((vObj.status === 'active' ? 'Đã kích hoạt' : 'Đã tạm ngưng') + ' Voucher ' + vObj.code);
        return;
      }

      var editVchBtn = e.target.closest('.btn-edit-voucher');
      if (editVchBtn) {
        openVoucherModal(editVchBtn.getAttribute('data-id'));
        return;
      }

      var delVchBtn = e.target.closest('.btn-delete-voucher');
      if (delVchBtn) {
        var vidDel = delVchBtn.getAttribute('data-id');
        openConfirmModal({
          title: 'Xóa mã Voucher?',
          message: 'Khách hàng sẽ không còn nhìn thấy hoặc áp dụng mã giảm giá này nữa.',
          confirmLabel: 'Xóa Voucher',
          onConfirm: function () {
            engine.deleteVoucher(vidDel);
            engine.showToast('Đã xóa Voucher.');
          }
        });
        return;
      }

      var togPromoBtn = e.target.closest('.btn-toggle-promo');
      if (togPromoBtn) {
        var pCamp = engine.togglePromotionStatus(togPromoBtn.getAttribute('data-id'));
        if (pCamp) engine.showToast((pCamp.status === 'active' ? 'Đã bật chiến dịch: ' : 'Đã tạm ngưng: ') + pCamp.name);
        return;
      }

      var editPromoBtn = e.target.closest('.btn-edit-promo');
      if (editPromoBtn) {
        openPromotionModal(editPromoBtn.getAttribute('data-id'));
        return;
      }

      var delPromoBtn = e.target.closest('.btn-delete-promo');
      if (delPromoBtn) {
        var prId = delPromoBtn.getAttribute('data-id');
        openConfirmModal({
          title: 'Xóa chiến dịch khuyến mãi?',
          message: 'Giá gốc niêm yết của các sản phẩm thuộc chiến dịch này sẽ được hoàn lại tự động.',
          confirmLabel: 'Xóa chiến dịch',
          onConfirm: function () {
            engine.deletePromotionCampaign(prId);
            engine.showToast('Đã xóa chiến dịch khuyến mãi.');
          }
        });
        return;
      }

      var ordKpiBtn = e.target.closest('[data-order-kpi]');
      if (ordKpiBtn) {
        var kf = ordKpiBtn.getAttribute('data-order-kpi');
        orderFilterStatus = (kf === 'revenue') ? 'all' : kf;
        ordersPage = 1;
        renderOrders();
        return;
      }

      var usrKpiBtn = e.target.closest('[data-user-kpi]');
      if (usrKpiBtn) {
        userKpiQuickFilter = usrKpiBtn.getAttribute('data-user-kpi') || 'all';
        usersPage = 1;
        renderUsers();
        return;
      }

      var previewProdBtn = e.target.closest('.btn-preview-product');
      if (previewProdBtn) { openProductQuickPreviewModal(previewProdBtn.getAttribute('data-id')); return; }

      var toggleProdBtn = e.target.closest('.btn-toggle-product-status');
      if (toggleProdBtn) {
        var toggledProd = engine.toggleProductStatus(toggleProdBtn.getAttribute('data-id'));
        if (toggledProd) {
          engine.showToast((toggledProd.status === 'active' ? 'Đã bật hiển thị: ' : 'Đã ẩn sản phẩm: ') + toggledProd.name);
        }
        return;
      }

      var editProdBtn = e.target.closest('.btn-edit-product');
      if (editProdBtn) { openEditProductModal(editProdBtn.getAttribute('data-id')); return; }

      var delProdBtn = e.target.closest('.btn-delete-product');
      if (delProdBtn) {
        var pIdDel = delProdBtn.getAttribute('data-id');
        var prodObj = engine.getProducts().find(function (x) { return String(x.id) === String(pIdDel); });
        openConfirmModal({
          title: 'Xóa sản phẩm?',
          message: 'Bạn có chắc chắn muốn xóa "' + (prodObj ? prodObj.name : ('#' + pIdDel)) + '" khỏi hệ thống không?',
          warning: 'Hành động này sẽ gỡ sản phẩm khỏi storefront và đồng bộ qua BroadcastChannel.',
          confirmLabel: 'Xác nhận xóa',
          onConfirm: function () {
            engine.deleteProduct(pIdDel);
            delete selectedProductIds[String(pIdDel)];
            engine.showToast('Đã xóa sản phẩm thành công.');
          }
        });
        return;
      }

      var saveStockBtn = e.target.closest('.btn-save-stock');
      if (saveStockBtn) {
        var sId = saveStockBtn.getAttribute('data-id');
        var row = saveStockBtn.closest('tr');
        var input = row ? row.querySelector('.inv-stock-input') : null;
        if (input) {
          engine.updateProductStock(sId, input.value);
          engine.showToast('Đã cập nhật tồn kho sản phẩm.');
        }
        return;
      }

      var previewCatBtn = e.target.closest('.btn-preview-category');
      if (previewCatBtn) { openTaxonomyPreviewModal('category', previewCatBtn.getAttribute('data-id')); return; }

      var toggleCatBtn = e.target.closest('.btn-toggle-category-status');
      if (toggleCatBtn) {
        var tCat = engine.toggleProductCategoryStatus(toggleCatBtn.getAttribute('data-id'));
        if (tCat) engine.showToast((tCat.status === 'active' ? 'Đã kích hoạt danh mục: ' : 'Đã tạm ẩn danh mục: ') + tCat.name);
        return;
      }

      var moveCatBtn = e.target.closest('.btn-move-category');
      if (moveCatBtn) {
        engine.moveProductCategory(moveCatBtn.getAttribute('data-id'), moveCatBtn.getAttribute('data-dir'));
        return;
      }

      var editCatBtn = e.target.closest('.btn-edit-category');
      if (editCatBtn) { openEditCategoryModal(editCatBtn.getAttribute('data-id')); return; }

      var delCatBtn = e.target.closest('.btn-delete-category');
      if (delCatBtn) {
        var cIdDel = delCatBtn.getAttribute('data-id');
        var cats = engine.getProductCategories();
        var catObj = cats.find(function (x) { return Number(x.id) === Number(cIdDel); });
        var linkedCount = catObj ? engine.getProducts().filter(function (p) { return String(p.category || p.category_slug) === String(catObj.slug); }).length : 0;
        openConfirmModal({
          title: 'Xóa danh mục "' + (catObj ? catObj.name : ('#' + cIdDel)) + '"?',
          message: 'Danh mục này sẽ bị gỡ khỏi danh sách phân loại thiết bị.',
          warning: linkedCount > 0 ? ('Cảnh báo an toàn: Hiện có ' + linkedCount + ' sản phẩm đang thuộc danh mục này. Các sản phẩm sẽ vẫn giữ nguyên trong kho.') : '',
          confirmLabel: 'Xóa danh mục',
          onConfirm: function () {
            engine.deleteProductCategory(cIdDel);
            engine.showToast('Đã xóa danh mục.');
          }
        });
        return;
      }

      var previewBrandBtn = e.target.closest('.btn-preview-brand');
      if (previewBrandBtn) { openTaxonomyPreviewModal('brand', previewBrandBtn.getAttribute('data-id')); return; }

      var toggleBrandBtn = e.target.closest('.btn-toggle-brand-status');
      if (toggleBrandBtn) {
        var tBrand = engine.toggleBrandStatus(toggleBrandBtn.getAttribute('data-id'));
        if (tBrand) engine.showToast((tBrand.status === 'active' ? 'Đã kích hoạt thương hiệu: ' : 'Đã tạm ngừng thương hiệu: ') + tBrand.name);
        return;
      }

      var moveBrandBtn = e.target.closest('.btn-move-brand');
      if (moveBrandBtn) {
        engine.moveBrand(moveBrandBtn.getAttribute('data-id'), moveBrandBtn.getAttribute('data-dir'));
        return;
      }

      var editBrandBtn = e.target.closest('.btn-edit-brand');
      if (editBrandBtn) { openEditBrandModal(editBrandBtn.getAttribute('data-id')); return; }

      var delBrandBtn = e.target.closest('.btn-delete-brand');
      if (delBrandBtn) {
        var bIdDel = delBrandBtn.getAttribute('data-id');
        var brObj = engine.getBrands().find(function (x) { return Number(x.id) === Number(bIdDel); });
        var bCount = brObj ? engine.getProducts().filter(function (p) { return Number(p.category_id) === Number(brObj.id) || engine.normalizeText(p.brand || p.category_name) === engine.normalizeText(brObj.name); }).length : 0;
        openConfirmModal({
          title: 'Xóa thương hiệu "' + (brObj ? brObj.name : ('#' + bIdDel)) + '"?',
          message: 'Thương hiệu sẽ bị xóa khỏi danh sách quản lý thương hiệu.',
          warning: bCount > 0 ? ('Cảnh báo an toàn: Hiện có ' + bCount + ' sản phẩm đang liên kết với thương hiệu này.') : '',
          confirmLabel: 'Xóa thương hiệu',
          onConfirm: function () {
            engine.deleteBrand(bIdDel);
            engine.showToast('Đã xóa thương hiệu.');
          }
        });
        return;
      }

      var viewOrderBtn = e.target.closest('.btn-view-order, .c360-open-order');
      if (viewOrderBtn) { openOrderDetailModal(viewOrderBtn.getAttribute('data-id')); return; }

      var advOrderBtn = e.target.closest('.btn-advance-order');
      if (advOrderBtn) {
        var oIdAdv = advOrderBtn.getAttribute('data-id');
        var nextStAdv = advOrderBtn.getAttribute('data-next');
        var resAdv = engine.tryUpdateOrderStatus(oIdAdv, nextStAdv);
        if (!resAdv.ok) {
          engine.showToast(resAdv.message || 'Không thể chuyển trạng thái đơn hàng.', true);
        } else {
          engine.showToast('Đơn ' + formatOrderCode(oIdAdv) + ' đã chuyển sang "' + engine.getOrderStatusLabel(nextStAdv) + '".');
          if (currentViewingOrderId && normalizeOrderKey(currentViewingOrderId) === normalizeOrderKey(oIdAdv)) {
            openOrderDetailModal(oIdAdv);
          }
        }
        return;
      }

      var cancelOrderBtn = e.target.closest('.btn-cancel-order');
      if (cancelOrderBtn) {
        openCancelOrderModal(cancelOrderBtn.getAttribute('data-id'));
        return;
      }

      var printOrderBtn = e.target.closest('.btn-print-order');
      if (printOrderBtn) {
        printOrderInvoice(printOrderBtn.getAttribute('data-id'));
        return;
      }

      var presetCancelBtn = e.target.closest('.cancel-reason-preset');
      if (presetCancelBtn) {
        var reasonInp = document.getElementById('cancelOrderReasonInput');
        if (reasonInp) {
          reasonInp.value = presetCancelBtn.getAttribute('data-reason') || '';
          reasonInp.focus();
        }
        return;
      }

      var view360Btn = e.target.closest('.btn-view-customer-360');
      if (view360Btn) {
        openCustomer360Modal(view360Btn.getAttribute('data-id'));
        return;
      }

      var editUserBtn = e.target.closest('.btn-edit-user');
      if (editUserBtn) {
        openEditUserModal(editUserBtn.getAttribute('data-id'));
        return;
      }

      var lockUserBtn = e.target.closest('.btn-toggle-user-lock');
      if (lockUserBtn && !lockUserBtn.disabled) {
        openLockUserModal(lockUserBtn.getAttribute('data-id'));
        return;
      }

      if (e.target.classList.contains('modal-backdrop')) {
        var subBackdropIds = [
          'orderCancelReasonModal', 'userEditModal', 'userLockModal', 'adminConfirmModal',
          'inventoryMovementModal', 'voucherModal', 'promotionModal', 'reviewQaReplyModal',
          'returnTicketModal', 'memberPointsModal', 'sendNotificationModal'
        ];
        if (e.target.id === 'adminConfirmModal') {
          closeConfirmModal();
        } else if (subBackdropIds.indexOf(e.target.id) !== -1) {
          closeModalById(e.target.id);
        } else if (e.target.id === 'productModal') {
          requestCloseProductModal();
        } else {
          closeAllModals(true);
        }
      }
    });

    // Checkbox từng dòng sản phẩm
    document.addEventListener('change', function (e) {
      var prodCb = e.target.closest('.prod-row-checkbox');
      if (prodCb) {
        var pid = prodCb.getAttribute('data-id');
        if (prodCb.checked) selectedProductIds[pid] = true;
        else delete selectedProductIds[pid];
        syncBulkActionBar(getFilteredSortedProducts().slice((productsPage - 1) * PRODUCTS_PER_PAGE, productsPage * PRODUCTS_PER_PAGE));
      }
    });

    // Confirm modal buttons
    var btnConfCancel = document.getElementById('btnConfirmModalCancel');
    var btnConfOk = document.getElementById('btnConfirmModalOk');
    if (btnConfCancel) btnConfCancel.addEventListener('click', closeConfirmModal);
    if (btnConfOk) {
      btnConfOk.addEventListener('click', function () {
        var cb = confirmModalCallback;
        closeConfirmModal();
        if (typeof cb === 'function') cb();
      });
    }

    // Khởi tạo event cho Product Modal chuyên sâu (Tabs, Repeater, Slug, Preview, Dirty tracking)
    initProductModalControls();
    initCategoryAndBrandModalControls();

    // Order Detail Modal actions (State Machine, Payment Status, Internal Notes, Cancel, Print)
    var btnSaveOrderStatus = document.getElementById('btnSaveOrderStatus');
    var modalStatusSelect = document.getElementById('modalOrderStatusSelect');
    if (btnSaveOrderStatus && modalStatusSelect) {
      btnSaveOrderStatus.addEventListener('click', function () {
        if (!currentViewingOrderId || modalStatusSelect.disabled || !modalStatusSelect.value) return;
        var nextStatus = modalStatusSelect.value;
        if (nextStatus === 'cancelled') {
          openCancelOrderModal(currentViewingOrderId);
          return;
        }
        var res = engine.tryUpdateOrderStatus(currentViewingOrderId, nextStatus);
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể chuyển trạng thái đơn hàng.', true);
          return;
        }
        engine.showToast('Đã chuyển đơn ' + currentViewingOrderId + ' sang "' + engine.getOrderStatusLabel(nextStatus) + '".');
        openOrderDetailModal(currentViewingOrderId);
      });
    }

    var btnSavePaySt = document.getElementById('btnSaveOrderPaymentStatus');
    if (btnSavePaySt) {
      btnSavePaySt.addEventListener('click', function () {
        if (!currentViewingOrderId) return;
        var sel = document.getElementById('detailModalPaymentStatusSelect');
        if (!sel) return;
        var res = engine.updateOrderPaymentStatus(currentViewingOrderId, sel.value);
        if (res.ok) {
          engine.showToast('Đã cập nhật trạng thái thanh toán: ' + engine.getOrderPaymentStatusLabel(sel.value));
          openOrderDetailModal(currentViewingOrderId);
        } else {
          engine.showToast(res.message || 'Không thể cập nhật trạng thái thanh toán.', true);
        }
      });
    }

    var btnAddNote = document.getElementById('btnAddOrderInternalNote');
    var noteInput = document.getElementById('orderInternalNoteInput');
    if (btnAddNote && noteInput) {
      btnAddNote.addEventListener('click', function () {
        if (!currentViewingOrderId) return;
        var res = engine.addOrderInternalNote(currentViewingOrderId, noteInput.value);
        if (!res.ok) {
          engine.showToast(res.message || 'Vui lòng nhập ghi chú.', true);
          return;
        }
        noteInput.value = '';
        engine.showToast('Đã lưu ghi chú nội bộ.');
        openOrderDetailModal(currentViewingOrderId);
      });
    }

    var btnPrintDetail = document.getElementById('btnPrintOrderInvoice');
    if (btnPrintDetail) {
      btnPrintDetail.addEventListener('click', function () {
        if (currentViewingOrderId) printOrderInvoice(currentViewingOrderId);
      });
    }

    var btnOpenCancelModal = document.getElementById('btnOpenCancelOrderModal');
    if (btnOpenCancelModal) {
      btnOpenCancelModal.addEventListener('click', function () {
        if (currentViewingOrderId) openCancelOrderModal(currentViewingOrderId);
      });
    }

    var btnConfirmCancelOrd = document.getElementById('btnConfirmCancelOrder');
    if (btnConfirmCancelOrd) {
      btnConfirmCancelOrd.addEventListener('click', function () {
        if (!pendingCancelOrderId) return;
        var reasonEl = document.getElementById('cancelOrderReasonInput');
        var reason = reasonEl ? reasonEl.value.trim() : '';
        var res = engine.tryUpdateOrderStatus(pendingCancelOrderId, 'cancelled', { cancelReason: reason });
        if (!res.ok) {
          engine.showToast(res.message || 'Vui lòng nhập lý do hủy đơn.', true);
          if (reasonEl) reasonEl.focus();
          return;
        }
        var targetId = formatOrderCode(pendingCancelOrderId);
        pendingCancelOrderId = null;
        closeModalById('orderCancelReasonModal');
        engine.showToast('Đã hủy đơn hàng ' + targetId + ' với lý do ghi nhận.');
        if (currentViewingOrderId && normalizeOrderKey(currentViewingOrderId) === normalizeOrderKey(targetId)) {
          openOrderDetailModal(targetId);
        }
      });
    }

    // User Edit & Lock Modal handlers
    var btnSaveUsrEdit = document.getElementById('btnSaveUserEdit');
    if (btnSaveUsrEdit) {
      btnSaveUsrEdit.addEventListener('click', function () {
        if (!editingUserId) return;
        var fullname = (document.getElementById('editUserFullname') && document.getElementById('editUserFullname').value) || '';
        var email = (document.getElementById('editUserEmail') && document.getElementById('editUserEmail').value) || '';
        var phone = (document.getElementById('editUserPhone') && document.getElementById('editUserPhone').value) || '';
        var roleEl = document.getElementById('editUserRole');
        var patch = { fullname: fullname, email: email, phone: phone };
        if (roleEl && !roleEl.disabled) patch.role = Number(roleEl.value);

        var res = engine.updateUserAccount(editingUserId, patch);
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể cập nhật tài khoản.', true);
          return;
        }
        var refreshedId = editingUserId;
        editingUserId = null;
        closeModalById('userEditModal');
        engine.showToast('Đã cập nhật hồ sơ tài khoản thành công.');
        if (currentViewingUserId && String(currentViewingUserId) === String(refreshedId)) {
          openCustomer360Modal(currentViewingUserId);
        }
      });
    }

    // PART 4 Modal Form Handlers
    var invMvTypeSel = document.getElementById('invMvTypeSelect');
    var invMvProdSel = document.getElementById('invMvProductSelect');
    if (invMvTypeSel) {
      invMvTypeSel.addEventListener('change', syncInvMovementTypeUI);
    }
    if (invMvProdSel) {
      invMvProdSel.addEventListener('change', function () { syncInvMovementProductVariants(invMvProdSel.value); });
    }
    var btnSaveInvMv = document.getElementById('btnSaveInventoryMovement');
    if (btnSaveInvMv) {
      btnSaveInvMv.addEventListener('click', function () {
        var typeVal = (document.getElementById('invMvTypeSelect') || {}).value || 'inbound';
        var prodVal = (document.getElementById('invMvProductSelect') || {}).value || '';
        var colVal = (document.getElementById('invMvColorSelect') || {}).value || 'all';
        var varVal = (document.getElementById('invMvVariantSelect') || {}).value || 'all';
        var qtyRaw = (document.getElementById('invMvQtyInput') || {}).value;
        var reasonVal = (document.getElementById('invMvReasonInput') || {}).value || '';
        var noteVal = (document.getElementById('invMvNoteInput') || {}).value || '';

        var payload = {
          productId: prodVal,
          type: typeVal,
          colorKey: colVal,
          variantLabel: varVal,
          reason: reasonVal,
          note: noteVal
        };
        if (typeVal === 'adjustment') payload.newStock = qtyRaw;
        else payload.quantity = qtyRaw;

        var res = engine.recordInventoryMovement(payload);
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu phiếu kho.', true);
          return;
        }
        closeModalById('inventoryMovementModal');
        engine.showToast('Đã ghi ' + res.log.code + ' cho ' + res.product.name + ' (Tồn: ' + res.log.afterStock + ')');
      });
    }

    var vchTypeSel = document.getElementById('vchInputType');
    if (vchTypeSel) {
      vchTypeSel.addEventListener('change', function () {
        var valEl = document.getElementById('vchInputValue');
        var maxEl = document.getElementById('vchInputMaxDiscount');
        if (valEl) valEl.disabled = vchTypeSel.value === 'freeship';
        if (maxEl) maxEl.disabled = vchTypeSel.value !== 'percent';
      });
    }
    var btnSaveVch = document.getElementById('btnSaveVoucherModal');
    if (btnSaveVch) {
      btnSaveVch.addEventListener('click', function () {
        var res = engine.saveVoucher({
          id: editingVoucherId || '',
          code: (document.getElementById('vchInputCode') || {}).value,
          label: (document.getElementById('vchInputLabel') || {}).value,
          type: (document.getElementById('vchInputType') || {}).value,
          value: (document.getElementById('vchInputValue') || {}).value,
          maxDiscount: (document.getElementById('vchInputMaxDiscount') || {}).value,
          minOrder: (document.getElementById('vchInputMinOrder') || {}).value,
          brandFilter: (document.getElementById('vchInputBrandFilter') || {}).value,
          categoryFilter: (document.getElementById('vchInputCategoryFilter') || {}).value,
          usageLimit: (document.getElementById('vchInputUsageLimit') || {}).value,
          expiresAt: (document.getElementById('vchInputExpiresAt') || {}).value,
          status: (document.getElementById('vchInputStatus') || {}).value
        });
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu Voucher.', true);
          return;
        }
        editingVoucherId = null;
        closeModalById('voucherModal');
        engine.showToast('Đã lưu Voucher ' + res.voucher.code + ' & đồng bộ Storefront!');
      });
    }

    var promoModalSearch = document.getElementById('promoProductSearchInModal');
    if (promoModalSearch) {
      promoModalSearch.addEventListener('input', function () {
        var q = engine.normalizeText(promoModalSearch.value);
        document.querySelectorAll('#promoProductCheckboxList label[data-pname]').forEach(function (lbl) {
          var name = lbl.getAttribute('data-pname') || '';
          lbl.classList.toggle('hidden', Boolean(q) && name.indexOf(q) === -1);
        });
      });
    }
    var btnSavePromo = document.getElementById('btnSavePromotionModal');
    if (btnSavePromo) {
      btnSavePromo.addEventListener('click', function () {
        var checkedIds = [];
        document.querySelectorAll('#promoProductCheckboxList input[type="checkbox"]:checked').forEach(function (cb) {
          checkedIds.push(cb.value);
        });
        var res = engine.savePromotionCampaign({
          id: editingPromotionId || '',
          name: (document.getElementById('promoInputName') || {}).value,
          badge: (document.getElementById('promoInputBadge') || {}).value,
          discountType: (document.getElementById('promoInputDiscountType') || {}).value,
          discountValue: (document.getElementById('promoInputDiscountValue') || {}).value,
          startAt: (document.getElementById('promoInputStartAt') || {}).value,
          endAt: (document.getElementById('promoInputEndAt') || {}).value,
          status: (document.getElementById('promoInputStatus') || {}).value,
          productIds: checkedIds
        });
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu chiến dịch khuyến mãi.', true);
          return;
        }
        editingPromotionId = null;
        closeModalById('promotionModal');
        engine.showToast('Đã lưu chiến dịch "' + res.campaign.name + '" & đồng bộ giá Storefront!');
      });
    }

    var btnSaveReply = document.getElementById('btnSaveReviewQaReply');
    if (btnSaveReply) {
      btnSaveReply.addEventListener('click', function () {
        if (!pendingReplyTarget) return;
        var text = (document.getElementById('replyModalTextarea') || {}).value || '';
        var res = pendingReplyTarget.kind === 'qa'
          ? engine.replyToProductQA(pendingReplyTarget.uid, text)
          : engine.replyToProductReview(pendingReplyTarget.uid, text);
        if (!res.ok) {
          engine.showToast(res.message || 'Vui lòng nhập nội dung phản hồi.', true);
          return;
        }
        pendingReplyTarget = null;
        closeModalById('reviewQaReplyModal');
        engine.showToast('Đã đăng phản hồi chính thức lên trang sản phẩm!');
      });
    }

    var btnSaveRet = document.getElementById('btnSaveReturnTicket');
    if (btnSaveRet) {
      btnSaveRet.addEventListener('click', function () {
        var res;
        if (editingReturnUid) {
          res = engine.updateReturnWarrantyTicket(editingReturnUid, {
            status: (document.getElementById('retInputStatus') || {}).value,
            refundAmount: (document.getElementById('retInputRefundAmount') || {}).value,
            adminNote: (document.getElementById('retInputAdminNote') || {}).value
          });
        } else {
          res = engine.createReturnWarrantyTicket({
            type: (document.getElementById('retInputType') || {}).value,
            orderId: (document.getElementById('retInputOrderId') || {}).value,
            customerName: (document.getElementById('retInputCustomerName') || {}).value,
            subject: (document.getElementById('retInputSubject') || {}).value,
            message: (document.getElementById('retInputMessage') || {}).value,
            refundAmount: (document.getElementById('retInputRefundAmount') || {}).value,
            adminNote: (document.getElementById('retInputAdminNote') || {}).value
          });
        }
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu phiếu đổi trả / bảo hành.', true);
          return;
        }
        editingReturnUid = null;
        closeModalById('returnTicketModal');
        engine.showToast('Đã lưu & gửi thông báo cập nhật tới khách hàng!');
      });
    }

    var btnSavePts = document.getElementById('btnSaveMemberPoints');
    if (btnSavePts) {
      btnSavePts.addEventListener('click', function () {
        if (!pendingPointsUserId) return;
        var delta = (document.getElementById('ptsInputDelta') || {}).value;
        var reason = (document.getElementById('ptsInputReason') || {}).value || '';
        var res = engine.adjustMemberPoints(pendingPointsUserId, delta, reason);
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể điều chỉnh điểm.', true);
          return;
        }
        pendingPointsUserId = null;
        closeModalById('memberPointsModal');
        engine.showToast('Đã cập nhật điểm thành viên thành công (Tổng mới: ' + res.newPoints + ' điểm)!');
      });
    }

    var btnSendNotifSub = document.getElementById('btnSendCustomerNotifSubmit');
    if (btnSendNotifSub) {
      btnSendNotifSub.addEventListener('click', function () {
        var res = engine.sendCustomerNotification({
          target: (document.getElementById('notifSendTarget') || {}).value || 'all',
          type: (document.getElementById('notifSendType') || {}).value || 'promotion',
          title: (document.getElementById('notifSendTitle') || {}).value,
          message: (document.getElementById('notifSendMessage') || {}).value
        });
        if (!res.ok) {
          engine.showToast(res.message || 'Vui lòng nhập đầy đủ thông báo.', true);
          return;
        }
        closeModalById('sendNotificationModal');
        engine.showToast('Đã phát thông báo tới ' + res.deliveredCount + ' tài khoản khách hàng!');
      });
    }

    var btnConfirmUsrLock = document.getElementById('btnConfirmUserLock');
    if (btnConfirmUsrLock) {
      btnConfirmUsrLock.addEventListener('click', function () {
        if (!pendingLockUserId) return;
        var reasonEl = document.getElementById('lockUserReasonInput');
        var reason = reasonEl ? reasonEl.value.trim() : '';
        var res = engine.toggleUserLock(pendingLockUserId, reason);
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể thay đổi trạng thái tài khoản.', true);
          if (reasonEl) reasonEl.focus();
          return;
        }
        var refreshedId = pendingLockUserId;
        pendingLockUserId = null;
        closeModalById('userLockModal');
        engine.showToast(res.user.status === 'locked' ? ('Đã tạm khóa tài khoản @' + res.user.username) : ('Đã mở khóa tài khoản @' + res.user.username));
        if (currentViewingUserId && String(currentViewingUserId) === String(refreshedId)) {
          openCustomer360Modal(currentViewingUserId);
        }
      });
    }

    // PART 4 Modal Form Handlers
    var invMvTypeSel = document.getElementById('invMvTypeSelect');
    var invMvProdSel = document.getElementById('invMvProductSelect');
    if (invMvTypeSel) {
      invMvTypeSel.addEventListener('change', syncInvMovementTypeUI);
    }
    if (invMvProdSel) {
      invMvProdSel.addEventListener('change', function () { syncInvMovementProductVariants(invMvProdSel.value); });
    }
    var btnSaveInvMv = document.getElementById('btnSaveInventoryMovement');
    if (btnSaveInvMv) {
      btnSaveInvMv.addEventListener('click', function () {
        var typeVal = (document.getElementById('invMvTypeSelect') || {}).value || 'inbound';
        var prodVal = (document.getElementById('invMvProductSelect') || {}).value || '';
        var colVal = (document.getElementById('invMvColorSelect') || {}).value || 'all';
        var varVal = (document.getElementById('invMvVariantSelect') || {}).value || 'all';
        var qtyRaw = (document.getElementById('invMvQtyInput') || {}).value;
        var reasonVal = (document.getElementById('invMvReasonInput') || {}).value || '';
        var noteVal = (document.getElementById('invMvNoteInput') || {}).value || '';

        var payload = {
          productId: prodVal,
          type: typeVal,
          colorKey: colVal,
          variantLabel: varVal,
          reason: reasonVal,
          note: noteVal
        };
        if (typeVal === 'adjustment') payload.newStock = qtyRaw;
        else payload.quantity = qtyRaw;

        var res = engine.recordInventoryMovement(payload);
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu phiếu kho.', true);
          return;
        }
        closeModalById('inventoryMovementModal');
        engine.showToast('Đã ghi ' + res.log.code + ' cho ' + res.product.name + ' (Tồn: ' + res.log.afterStock + ')');
      });
    }

    var vchTypeSel = document.getElementById('vchInputType');
    if (vchTypeSel) {
      vchTypeSel.addEventListener('change', function () {
        var valEl = document.getElementById('vchInputValue');
        var maxEl = document.getElementById('vchInputMaxDiscount');
        if (valEl) valEl.disabled = vchTypeSel.value === 'freeship';
        if (maxEl) maxEl.disabled = vchTypeSel.value !== 'percent';
      });
    }
    var btnSaveVch = document.getElementById('btnSaveVoucherModal');
    if (btnSaveVch) {
      btnSaveVch.addEventListener('click', function () {
        var res = engine.saveVoucher({
          id: editingVoucherId || '',
          code: (document.getElementById('vchInputCode') || {}).value,
          label: (document.getElementById('vchInputLabel') || {}).value,
          type: (document.getElementById('vchInputType') || {}).value,
          value: (document.getElementById('vchInputValue') || {}).value,
          maxDiscount: (document.getElementById('vchInputMaxDiscount') || {}).value,
          minOrder: (document.getElementById('vchInputMinOrder') || {}).value,
          brandFilter: (document.getElementById('vchInputBrandFilter') || {}).value,
          categoryFilter: (document.getElementById('vchInputCategoryFilter') || {}).value,
          usageLimit: (document.getElementById('vchInputUsageLimit') || {}).value,
          expiresAt: (document.getElementById('vchInputExpiresAt') || {}).value,
          status: (document.getElementById('vchInputStatus') || {}).value
        });
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu Voucher.', true);
          return;
        }
        editingVoucherId = null;
        closeModalById('voucherModal');
        engine.showToast('Đã lưu Voucher ' + res.voucher.code + ' & đồng bộ Storefront!');
      });
    }

    var promoModalSearch = document.getElementById('promoProductSearchInModal');
    if (promoModalSearch) {
      promoModalSearch.addEventListener('input', function () {
        var q = engine.normalizeText(promoModalSearch.value);
        document.querySelectorAll('#promoProductCheckboxList label[data-pname]').forEach(function (lbl) {
          var name = lbl.getAttribute('data-pname') || '';
          lbl.classList.toggle('hidden', Boolean(q) && name.indexOf(q) === -1);
        });
      });
    }
    var btnSavePromo = document.getElementById('btnSavePromotionModal');
    if (btnSavePromo) {
      btnSavePromo.addEventListener('click', function () {
        var checkedIds = [];
        document.querySelectorAll('#promoProductCheckboxList input[type="checkbox"]:checked').forEach(function (cb) {
          checkedIds.push(cb.value);
        });
        var res = engine.savePromotionCampaign({
          id: editingPromotionId || '',
          name: (document.getElementById('promoInputName') || {}).value,
          badge: (document.getElementById('promoInputBadge') || {}).value,
          discountType: (document.getElementById('promoInputDiscountType') || {}).value,
          discountValue: (document.getElementById('promoInputDiscountValue') || {}).value,
          startAt: (document.getElementById('promoInputStartAt') || {}).value,
          endAt: (document.getElementById('promoInputEndAt') || {}).value,
          status: (document.getElementById('promoInputStatus') || {}).value,
          productIds: checkedIds
        });
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu chiến dịch khuyến mãi.', true);
          return;
        }
        editingPromotionId = null;
        closeModalById('promotionModal');
        engine.showToast('Đã lưu chiến dịch "' + res.campaign.name + '" & đồng bộ giá Storefront!');
      });
    }

    var btnSaveReply = document.getElementById('btnSaveReviewQaReply');
    if (btnSaveReply) {
      btnSaveReply.addEventListener('click', function () {
        if (!pendingReplyTarget) return;
        var text = (document.getElementById('replyModalTextarea') || {}).value || '';
        var res = pendingReplyTarget.kind === 'qa'
          ? engine.replyToProductQA(pendingReplyTarget.uid, text)
          : engine.replyToProductReview(pendingReplyTarget.uid, text);
        if (!res.ok) {
          engine.showToast(res.message || 'Vui lòng nhập nội dung phản hồi.', true);
          return;
        }
        pendingReplyTarget = null;
        closeModalById('reviewQaReplyModal');
        engine.showToast('Đã đăng phản hồi chính thức lên trang sản phẩm!');
      });
    }

    var btnSaveRet = document.getElementById('btnSaveReturnTicket');
    if (btnSaveRet) {
      btnSaveRet.addEventListener('click', function () {
        var res;
        if (editingReturnUid) {
          res = engine.updateReturnWarrantyTicket(editingReturnUid, {
            status: (document.getElementById('retInputStatus') || {}).value,
            refundAmount: (document.getElementById('retInputRefundAmount') || {}).value,
            adminNote: (document.getElementById('retInputAdminNote') || {}).value
          });
        } else {
          res = engine.createReturnWarrantyTicket({
            type: (document.getElementById('retInputType') || {}).value,
            orderId: (document.getElementById('retInputOrderId') || {}).value,
            customerName: (document.getElementById('retInputCustomerName') || {}).value,
            subject: (document.getElementById('retInputSubject') || {}).value,
            message: (document.getElementById('retInputMessage') || {}).value,
            refundAmount: (document.getElementById('retInputRefundAmount') || {}).value,
            adminNote: (document.getElementById('retInputAdminNote') || {}).value
          });
        }
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể lưu phiếu đổi trả / bảo hành.', true);
          return;
        }
        editingReturnUid = null;
        closeModalById('returnTicketModal');
        engine.showToast('Đã lưu & gửi thông báo cập nhật tới khách hàng!');
      });
    }

    var btnSavePts = document.getElementById('btnSaveMemberPoints');
    if (btnSavePts) {
      btnSavePts.addEventListener('click', function () {
        if (!pendingPointsUserId) return;
        var delta = (document.getElementById('ptsInputDelta') || {}).value;
        var reason = (document.getElementById('ptsInputReason') || {}).value || '';
        var res = engine.adjustMemberPoints(pendingPointsUserId, delta, reason);
        if (!res.ok) {
          engine.showToast(res.message || 'Không thể điều chỉnh điểm.', true);
          return;
        }
        pendingPointsUserId = null;
        closeModalById('memberPointsModal');
        engine.showToast('Đã cập nhật điểm thành viên thành công (Tổng mới: ' + res.newPoints + ' điểm)!');
      });
    }

    var btnSendNotifSub = document.getElementById('btnSendCustomerNotifSubmit');
    if (btnSendNotifSub) {
      btnSendNotifSub.addEventListener('click', function () {
        var res = engine.sendCustomerNotification({
          target: (document.getElementById('notifSendTarget') || {}).value || 'all',
          type: (document.getElementById('notifSendType') || {}).value || 'promotion',
          title: (document.getElementById('notifSendTitle') || {}).value,
          message: (document.getElementById('notifSendMessage') || {}).value
        });
        if (!res.ok) {
          engine.showToast(res.message || 'Vui lòng nhập đầy đủ thông báo.', true);
          return;
        }
        closeModalById('sendNotificationModal');
        engine.showToast('Đã phát thông báo tới ' + res.deliveredCount + ' tài khoản khách hàng!');
      });
    }

    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetModal = btn.getAttribute('data-close-modal');
        if (targetModal === 'productModal') {
          requestCloseProductModal();
        } else if (targetModal && targetModal !== '') {
          closeModalById(targetModal);
        } else {
          closeAllModals(true);
        }
      });
    });
  });

  /* ==========================================================================
     12. MODAL & DRAWER CONTROLS (CONFIRM, QUICK PREVIEW, DEEP PRODUCT FORM, TAXONOMY)
     ========================================================================== */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    if (document.documentElement) document.documentElement.classList.add('overflow-hidden');
  }

  function openConfirmModal(opts) {
    var modal = document.getElementById('adminConfirmModal');
    if (!modal) {
      if (opts && typeof opts.onConfirm === 'function' && confirm((opts.title || '') + '\n' + (opts.message || ''))) {
        opts.onConfirm();
      }
      return;
    }
    var titleEl = document.getElementById('confirmModalTitle');
    var msgEl = document.getElementById('confirmModalMessage');
    var warnEl = document.getElementById('confirmModalWarningBox');
    var okBtn = document.getElementById('btnConfirmModalOk');
    var iconBox = document.getElementById('confirmModalIconBox');

    if (titleEl) titleEl.textContent = (opts && opts.title) || 'Xác nhận thao tác';
    if (msgEl) msgEl.textContent = (opts && opts.message) || '';
    if (warnEl) {
      if (opts && opts.warning) {
        warnEl.textContent = opts.warning;
        warnEl.classList.remove('hidden');
      } else {
        warnEl.textContent = '';
        warnEl.classList.add('hidden');
      }
    }
    if (okBtn) {
      okBtn.textContent = (opts && opts.confirmLabel) || 'Xác nhận';
      okBtn.className = (opts && opts.variant === 'primary')
        ? 'vlu-btn vlu-btn-primary vlu-btn-sm'
        : 'vlu-btn vlu-btn-danger vlu-btn-sm';
    }
    if (iconBox) {
      iconBox.className = (opts && opts.variant === 'primary')
        ? 'h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0'
        : 'h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0';
    }
    confirmModalCallback = opts && opts.onConfirm ? opts.onConfirm : null;
    openModal(modal);
  }

  function closeConfirmModal() {
    var modal = document.getElementById('adminConfirmModal');
    confirmModalCallback = null;
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    var anyOpen = document.querySelector('.admin-modal:not(.hidden)');
    if (!anyOpen) {
      document.body.classList.remove('overflow-hidden');
      if (document.documentElement) document.documentElement.classList.remove('overflow-hidden');
    }
  }

  function markProductFormDirty(dirty) {
    productFormDirty = Boolean(dirty);
    var badge = document.getElementById('prodModalDirtyBadge');
    if (badge) badge.classList.toggle('hidden', !productFormDirty);
  }

  function requestCloseProductModal() {
    if (!productFormDirty) {
      closeAllModals(true);
      return;
    }
    openConfirmModal({
      title: 'Thoát mà không lưu thay đổi?',
      message: 'Biểu mẫu sản phẩm hiện đang có thông tin vừa chỉnh sửa chưa được lưu.',
      warning: 'Nếu thoát ngay bây giờ, các chỉnh sửa vừa nhập sẽ bị hủy bỏ.',
      confirmLabel: 'Thoát không lưu',
      onConfirm: function () {
        markProductFormDirty(false);
        closeAllModals(true);
      }
    });
  }

  function switchProductFormTab(tabKey) {
    activeProductFormTab = tabKey || 'basic';
    document.querySelectorAll('[data-pform-tab]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-pform-tab') === activeProductFormTab);
    });
    document.querySelectorAll('[data-pform-pane]').forEach(function (pane) {
      pane.classList.toggle('hidden', pane.getAttribute('data-pform-pane') !== activeProductFormTab);
    });
  }

  function updateProductDiscountAndSeoPreview() {
    var engine = window.VLU_ADMIN;
    var name = (document.getElementById('prodModalName') && document.getElementById('prodModalName').value.trim()) || '';
    var slugEl = document.getElementById('prodModalSlug');
    var price = Number((document.getElementById('prodModalPrice') && document.getElementById('prodModalPrice').value) || 0);
    var oldPrice = Number((document.getElementById('prodModalOldPrice') && document.getElementById('prodModalOldPrice').value) || 0);
    var desc = (document.getElementById('prodModalDesc') && document.getElementById('prodModalDesc').value.trim()) || '';
    var badge = document.getElementById('prodModalDiscountBadge');

    if (badge) {
      if (price > 0 && oldPrice > price) {
        var pct = Math.round(((oldPrice - price) / oldPrice) * 100);
        badge.textContent = '-' + pct + '%';
        badge.className = 'vlu-badge vlu-badge-success';
      } else {
        badge.textContent = price <= 0 ? 'Liên hệ' : '0%';
        badge.className = 'vlu-badge vlu-badge-neutral';
      }
    }

    var seoTitleEl = document.getElementById('prodModalSeoTitle');
    var seoSlugEl = document.getElementById('prodModalSeoSlug');
    var seoDescEl = document.getElementById('prodModalSeoDesc');
    var pSlug = (seoSlugEl && seoSlugEl.value.trim()) || (slugEl && slugEl.value.trim()) || (engine ? engine.slugify(name || 'san-pham') : 'san-pham');
    var pTitle = (seoTitleEl && seoTitleEl.value.trim()) || (name ? (name + ' Chính Hãng | VLU FLAGSHIP STORE') : 'Tên sản phẩm | VLU FLAGSHIP STORE');
    var pDesc = (seoDescEl && seoDescEl.value.trim()) || desc || 'Sản phẩm chính hãng Apple, Samsung, Xiaomi... giá tốt tại VLU FLAGSHIP STORE.';

    var uEl = document.getElementById('prodSeoPreviewUrl');
    var tEl = document.getElementById('prodSeoPreviewTitle');
    var dEl = document.getElementById('prodSeoPreviewDesc');
    if (uEl) uEl.textContent = 'https://vluflagship.vn/product-detail.html?id=' + pSlug;
    if (tEl) tEl.textContent = pTitle;
    if (dEl) dEl.textContent = pDesc;
  }

  function renderProdGalleryRows() {
    var box = document.getElementById('prodGalleryRowsContainer');
    if (!box) return;
    if (!prodFormGallery.length) {
      box.innerHTML = '<p class="text-xs italic py-2" style="color: var(--admin-text-secondary);">Chưa có ảnh gallery phụ nào. Bấm "+ Thêm ảnh" để bổ sung góc chụp.</p>';
      return;
    }
    box.innerHTML = prodFormGallery.map(function (url, idx) {
      var prev = safeImage(url);
      return '<div class="vlu-repeater-row flex items-center gap-2.5">' +
        '<div class="h-10 w-10 shrink-0 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center"><img src="' + escapeHtml(prev) + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'frontend/assets/images/logo.png\';"></div>' +
        '<input type="text" class="vlu-input flex-1 text-xs pform-gallery-input" data-idx="' + idx + '" value="' + escapeHtml(url) + '" placeholder="SanPham/.../gallery-' + (idx + 1) + '.jpg">' +
        '<button type="button" class="btn-remove-gallery-row p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-idx="' + idx + '" title="Xóa ảnh">✕</button>' +
      '</div>';
    }).join('');
  }

  function renderProdColorRows() {
    var box = document.getElementById('prodColorRowsContainer');
    if (!box) return;
    if (!prodFormColors.length) {
      box.innerHTML = '<p class="text-xs italic py-2" style="color: var(--admin-text-secondary);">Chưa có biến thể màu. Bấm "+ Thêm màu" để thêm tùy chọn màu sắc.</p>';
      return;
    }
    box.innerHTML = prodFormColors.map(function (c, idx) {
      var hexVal = /^#[0-9a-f]{6}$/i.test(String(c.hex || '')) ? c.hex : '#334155';
      return '<div class="vlu-repeater-row grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">' +
        '<div class="sm:col-span-3"><input type="text" class="vlu-input !py-1.5 text-xs pform-color-name" data-idx="' + idx + '" value="' + escapeHtml(c.name || '') + '" placeholder="Tên màu (VD: Titan Đen)"></div>' +
        '<div class="sm:col-span-3 flex items-center gap-1.5">' +
          '<input type="color" class="h-8 w-9 shrink-0 rounded border border-slate-200 cursor-pointer pform-color-picker" data-idx="' + idx + '" value="' + escapeHtml(hexVal) + '">' +
          '<input type="text" class="vlu-input !py-1.5 text-xs font-mono uppercase pform-color-hex" data-idx="' + idx + '" value="' + escapeHtml(hexVal) + '" maxlength="7">' +
        '</div>' +
        '<div class="sm:col-span-4"><input type="text" class="vlu-input !py-1.5 text-xs pform-color-img" data-idx="' + idx + '" value="' + escapeHtml(c.image || c.img || '') + '" placeholder="SanPham/... (ảnh màu)"></div>' +
        '<div class="sm:col-span-1"><input type="number" min="0" class="vlu-input !py-1.5 text-xs pform-color-stock" data-idx="' + idx + '" value="' + (c.stock !== undefined && c.stock !== '' ? escapeHtml(c.stock) : '') + '" placeholder="Kho"></div>' +
        '<div class="sm:col-span-1 text-right"><button type="button" class="btn-remove-color-row p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-idx="' + idx + '" title="Xóa màu">✕</button></div>' +
      '</div>';
    }).join('');
  }

  function renderProdVariantRows() {
    var box = document.getElementById('prodVariantRowsContainer');
    var engine = window.VLU_ADMIN;
    if (!box) return;
    if (!prodFormVariants.length) {
      box.innerHTML = '<p class="text-xs italic py-2" style="color: var(--admin-text-secondary);">Chưa có cấu hình dung lượng/RAM. Bấm "+ Thêm phiên bản" để thêm.</p>';
      return;
    }
    var basePrice = Number((document.getElementById('prodModalPrice') && document.getElementById('prodModalPrice').value) || 0);
    box.innerHTML = prodFormVariants.map(function (v, idx) {
      var delta = Number(v.delta) || 0;
      var computed = basePrice > 0 ? Math.max(0, basePrice + delta) : (Number(v.price) || 0);
      return '<div class="vlu-repeater-row grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">' +
        '<div class="sm:col-span-4"><input type="text" class="vlu-input !py-1.5 text-xs pform-var-label" data-idx="' + idx + '" value="' + escapeHtml(v.label || '') + '" placeholder="VD: 256GB / 16GB-512GB"></div>' +
        '<div class="sm:col-span-3"><input type="number" step="50000" class="vlu-input !py-1.5 text-xs pform-var-delta" data-idx="' + idx + '" value="' + delta + '" placeholder="Chênh lệch VNĐ (+)"></div>' +
        '<div class="sm:col-span-3"><input type="number" min="0" step="50000" class="vlu-input !py-1.5 text-xs pform-var-price" data-idx="' + idx + '" value="' + (computed || '') + '" placeholder="Giá riêng VNĐ" title="Nhập giá riêng sẽ tự tính chênh lệch"></div>' +
        '<div class="sm:col-span-1 text-[10px] font-bold text-brand truncate tabular-nums" title="Giá hiển thị">' + (engine ? (computed > 0 ? engine.formatVND(computed) : 'Liên hệ') : computed) + '</div>' +
        '<div class="sm:col-span-1 text-right"><button type="button" class="btn-remove-var-row p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-idx="' + idx + '" title="Xóa phiên bản">✕</button></div>' +
      '</div>';
    }).join('');
  }

  function renderProdSpecRows() {
    var box = document.getElementById('prodSpecRowsContainer');
    if (!box) return;
    if (!prodFormSpecs.length) {
      box.innerHTML = '<p class="text-xs italic py-2" style="color: var(--admin-text-secondary);">Chưa có dòng thông số nào. Bấm "+ Thêm dòng thông số" hoặc "Điền mẫu theo danh mục".</p>';
      return;
    }
    box.innerHTML = prodFormSpecs.map(function (pair, idx) {
      return '<div class="vlu-repeater-row grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">' +
        '<div class="sm:col-span-5"><input type="text" class="vlu-input !py-1.5 text-xs font-semibold pform-spec-key" data-idx="' + idx + '" value="' + escapeHtml((pair && pair[0]) || '') + '" placeholder="Tên thông số (VD: Màn hình)"></div>' +
        '<div class="sm:col-span-6"><input type="text" class="vlu-input !py-1.5 text-xs pform-spec-val" data-idx="' + idx + '" value="' + escapeHtml((pair && pair[1]) || '') + '" placeholder="Giá trị (VD: OLED 6.9 inch 120Hz)"></div>' +
        '<div class="sm:col-span-1 text-right"><button type="button" class="btn-remove-spec-row p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-idx="' + idx + '" title="Xóa thông số">✕</button></div>' +
      '</div>';
    }).join('');
  }

  function applySpecTemplateForCategory() {
    var catEl = document.getElementById('prodModalProductCategory');
    var catSlug = catEl ? catEl.value : 'dien-thoai';
    var templates = {
      'dien-thoai': [['Màn hình', 'OLED 6.7–6.9 inch 120Hz'], ['Chip xử lý', ''], ['RAM / Bộ nhớ', ''], ['Camera sau', ''], ['Pin & Sạc', '']],
      'laptop': [['Màn hình', ''], ['CPU', ''], ['RAM', ''], ['Ổ cứng SSD', ''], ['Card đồ họa', ''], ['Pin & Trọng lượng', '']],
      'ipad': [['Màn hình', ''], ['Chip xử lý', ''], ['RAM / Lưu trữ', ''], ['Hỗ trợ bút & bàn phím', ''], ['Pin', '']],
      'tai-nghe': [['Công nghệ âm thanh', 'Chống ồn chủ động ANC'], ['Kết nối', 'Bluetooth 5.3 / 5.4'], ['Thời lượng pin', ''], ['Chống nước', 'IPX4 / IP54']],
      'loa': [['Công suất đầu ra', ''], ['Kết nối', 'Bluetooth / AUX'], ['Thời lượng pin', ''], ['Kháng nước bụi', 'IP67']],
      'dong-ho-dien-tu': [['Màn hình', ''], ['Cảm biến sức khỏe', 'Nhịp tim, SpO2, ECG'], ['Kháng nước', '5ATM'], ['Thời lượng pin', '']],
      'phu-kien': [['Loại phụ kiện', ''], ['Tương thích', ''], ['Công suất / Tốc độ', ''], ['Bảo hành', '12 tháng chính hãng']]
    };
    var tpl = templates[catSlug] || templates['dien-thoai'];
    var existingKeys = {};
    prodFormSpecs.forEach(function (pair) {
      if (pair && pair[0]) existingKeys[String(pair[0]).toLowerCase().trim()] = true;
    });
    tpl.forEach(function (pair) {
      if (!existingKeys[pair[0].toLowerCase()]) prodFormSpecs.push([pair[0], pair[1]]);
    });
    renderProdSpecRows();
    markProductFormDirty(true);
  }

  function renderProductLivePreviewCard() {
    var engine = window.VLU_ADMIN;
    var body = document.getElementById('prodFormPreviewBody');
    if (!body) return;
    var name = (document.getElementById('prodModalName') && document.getElementById('prodModalName').value.trim()) || 'Tên sản phẩm mới';
    var catEl = document.getElementById('prodModalProductCategory');
    var brandEl = document.getElementById('prodModalCategory');
    var catText = catEl && catEl.selectedIndex >= 0 ? catEl.options[catEl.selectedIndex].text : 'Danh mục';
    var brandText = brandEl && brandEl.selectedIndex >= 0 ? brandEl.options[brandEl.selectedIndex].text : 'Thương hiệu';
    var price = Number((document.getElementById('prodModalPrice') && document.getElementById('prodModalPrice').value) || 0);
    var oldPrice = Number((document.getElementById('prodModalOldPrice') && document.getElementById('prodModalOldPrice').value) || 0);
    var stock = Number((document.getElementById('prodModalStock') && document.getElementById('prodModalStock').value) || 0);
    var img = safeImage((document.getElementById('prodModalImage') && document.getElementById('prodModalImage').value.trim()) || '', catEl ? catEl.value : 'dien-thoai');
    var desc = (document.getElementById('prodModalDesc') && document.getElementById('prodModalDesc').value.trim()) || 'Chưa có mô tả chi tiết.';
    var has3D = Boolean(document.getElementById('prodModalHas3D') && document.getElementById('prodModalHas3D').checked && document.getElementById('prodModalModelUrl').value.trim());

    var colorsHtml = prodFormColors.slice(0, 6).map(function (c) {
      return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-slate-200 bg-white">' +
        '<span class="h-2.5 w-2.5 rounded-full border border-slate-300" style="background:' + escapeHtml(c.hex || '#334155') + ';"></span>' +
        escapeHtml(c.name || 'Màu') +
      '</span>';
    }).join('');
    var varsHtml = prodFormVariants.slice(0, 5).map(function (v) {
      return '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">' + escapeHtml(v.label || 'Tiêu chuẩn') + '</span>';
    }).join('');

    body.innerHTML =
      '<div class="vlu-live-preview-card grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">' +
        '<div class="sm:col-span-4 aspect-square max-h-40 mx-auto w-full rounded-xl bg-white border border-slate-200 p-3 flex items-center justify-center">' +
          '<img src="' + escapeHtml(img) + '" alt="" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'frontend/assets/images/logo.png\';">' +
        '</div>' +
        '<div class="sm:col-span-8 space-y-2">' +
          '<div class="flex flex-wrap items-center gap-1.5">' +
            '<span class="vlu-badge vlu-badge-neutral">' + escapeHtml(brandText) + '</span>' +
            '<span class="vlu-badge vlu-badge-brand">' + escapeHtml(catText) + '</span>' +
            (has3D ? '<span class="vlu-badge vlu-badge-info">3D View Ready</span>' : '') +
            (stock <= 0 ? '<span class="vlu-badge vlu-badge-danger">Hết hàng</span>' : '<span class="vlu-badge vlu-badge-success">Tồn: ' + stock + '</span>') +
          '</div>' +
          '<h4 class="font-extrabold text-base" style="color: var(--admin-text-primary);">' + escapeHtml(name) + '</h4>' +
          '<p class="text-xs line-clamp-2" style="color: var(--admin-text-secondary);">' + escapeHtml(desc) + '</p>' +
          '<div class="flex items-baseline gap-2.5">' +
            '<span class="text-lg font-extrabold text-brand tabular-nums">' + (price > 0 ? (engine ? engine.formatVND(price) : price) : 'Giá liên hệ') + '</span>' +
            (oldPrice > price ? '<span class="text-xs text-slate-400 line-through">' + (engine ? engine.formatVND(oldPrice) : oldPrice) + '</span>' : '') +
          '</div>' +
          (colorsHtml ? '<div class="flex flex-wrap gap-1.5 pt-1">' + colorsHtml + '</div>' : '') +
          (varsHtml ? '<div class="flex flex-wrap gap-1.5">' + varsHtml + '</div>' : '') +
        '</div>' +
      '</div>';
  }

  function updateModel3DHintState() {
    var engine = window.VLU_ADMIN;
    var urlEl = document.getElementById('prodModalModelUrl');
    var hasEl = document.getElementById('prodModalHas3D');
    var hintEl = document.getElementById('prodModalModel3DHint');
    if (!urlEl || !hintEl || !engine) return true;
    var raw = urlEl.value.trim();
    var has3D = Boolean(hasEl && hasEl.checked);
    if (!raw) {
      hintEl.className = has3D ? 'mt-1 text-[11px] font-bold text-amber-600' : 'mt-1 text-[11px] font-semibold text-slate-500';
      hintEl.textContent = has3D
        ? 'Vui lòng nhập đường dẫn tệp .glb / .gltf hợp lệ trong thư mục models3d/.'
        : 'Đường dẫn an toàn phải nằm trong thư mục models3d/ và có đuôi .glb hoặc .gltf.';
      return !has3D;
    }
    var clean = engine.normalizeModel3DPath(raw);
    if (!clean) {
      hintEl.className = 'mt-1 text-[11px] font-bold text-red-600';
      hintEl.textContent = 'Đường dẫn không hợp lệ: chỉ chấp nhận đường dẫn nội bộ models3d/...(.glb | .gltf).';
      return false;
    }
    hintEl.className = 'mt-1 text-[11px] font-bold text-emerald-600';
    hintEl.textContent = 'Đường dẫn hợp lệ (' + clean + '). Trình xem 3D sẽ tự động xác minh tệp tồn tại thực tế.';
    return true;
  }

  function initProductModalControls() {
    var engine = window.VLU_ADMIN;
    var modal = document.getElementById('productModal');
    var form = document.getElementById('productForm');
    if (!modal || !form || !engine) return;

    // Tab switching inside Product Modal
    document.querySelectorAll('[data-pform-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchProductFormTab(btn.getAttribute('data-pform-tab'));
      });
    });

    // Live Form Preview Toggle
    var previewPane = document.getElementById('prodFormPreviewPane');
    var btnTogglePrev = document.getElementById('btnToggleProductFormPreview');
    var btnClosePrev = document.getElementById('btnCloseProductFormPreview');
    if (btnTogglePrev && previewPane) {
      btnTogglePrev.addEventListener('click', function () {
        var willShow = previewPane.classList.contains('hidden');
        if (willShow) renderProductLivePreviewCard();
        previewPane.classList.toggle('hidden', !willShow);
      });
    }
    if (btnClosePrev && previewPane) {
      btnClosePrev.addEventListener('click', function () {
        previewPane.classList.add('hidden');
      });
    }

    // Dirty tracking & live calculations
    form.addEventListener('input', function (e) {
      markProductFormDirty(true);
      if (e.target.id === 'prodModalName' && !prodSlugManuallyEdited) {
        var slugEl = document.getElementById('prodModalSlug');
        var seoSlugEl = document.getElementById('prodModalSeoSlug');
        var s = engine.slugify(e.target.value);
        if (slugEl && !editingProductId) slugEl.value = s;
        if (seoSlugEl && !editingProductId) seoSlugEl.value = s;
      }
      if (e.target.id === 'prodModalSlug') prodSlugManuallyEdited = true;
      if (e.target.id === 'prodModalImage') {
        var prev = document.getElementById('prodModalImagePreview');
        if (prev) prev.src = e.target.value.trim() || 'frontend/assets/images/logo.png';
      }
      if (e.target.id === 'prodModalPrice') renderProdVariantRows();
      updateProductDiscountAndSeoPreview();
      if (previewPane && !previewPane.classList.contains('hidden')) renderProductLivePreviewCard();
    });
    form.addEventListener('change', function () {
      markProductFormDirty(true);
      updateProductDiscountAndSeoPreview();
      if (previewPane && !previewPane.classList.contains('hidden')) renderProductLivePreviewCard();
    });

    var modelUrlInput = document.getElementById('prodModalModelUrl');
    var has3DCheckbox = document.getElementById('prodModalHas3D');
    if (modelUrlInput) modelUrlInput.addEventListener('input', updateModel3DHintState);
    if (has3DCheckbox) has3DCheckbox.addEventListener('change', updateModel3DHintState);

    // Gallery repeater actions
    var btnAddGal = document.getElementById('btnAddProdGalleryRow');
    if (btnAddGal) {
      btnAddGal.addEventListener('click', function () {
        prodFormGallery.push('');
        renderProdGalleryRows();
        markProductFormDirty(true);
      });
    }
    var galContainer = document.getElementById('prodGalleryRowsContainer');
    if (galContainer) {
      galContainer.addEventListener('input', function (e) {
        if (e.target.classList.contains('pform-gallery-input')) {
          var idx = parseInt(e.target.getAttribute('data-idx'), 10);
          prodFormGallery[idx] = e.target.value;
          markProductFormDirty(true);
        }
      });
      galContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-remove-gallery-row');
        if (btn) {
          prodFormGallery.splice(parseInt(btn.getAttribute('data-idx'), 10), 1);
          renderProdGalleryRows();
          markProductFormDirty(true);
        }
      });
    }

    // Color repeater actions
    var btnAddCol = document.getElementById('btnAddProdColorRow');
    if (btnAddCol) {
      btnAddCol.addEventListener('click', function () {
        prodFormColors.push({ name: '', hex: '#334155', key: 'color-' + (prodFormColors.length + 1), image: '', stock: '' });
        renderProdColorRows();
        markProductFormDirty(true);
      });
    }
    var colContainer = document.getElementById('prodColorRowsContainer');
    if (colContainer) {
      colContainer.addEventListener('input', function (e) {
        var idx = parseInt(e.target.getAttribute('data-idx'), 10);
        if (isNaN(idx) || !prodFormColors[idx]) return;
        if (e.target.classList.contains('pform-color-name')) {
          prodFormColors[idx].name = e.target.value;
          prodFormColors[idx].key = engine.slugify(e.target.value || ('color-' + idx));
        } else if (e.target.classList.contains('pform-color-picker')) {
          prodFormColors[idx].hex = e.target.value.toUpperCase();
          var hexInp = colContainer.querySelector('.pform-color-hex[data-idx="' + idx + '"]');
          if (hexInp) hexInp.value = prodFormColors[idx].hex;
        } else if (e.target.classList.contains('pform-color-hex')) {
          prodFormColors[idx].hex = e.target.value;
        } else if (e.target.classList.contains('pform-color-img')) {
          prodFormColors[idx].image = e.target.value;
          prodFormColors[idx].img = e.target.value;
        } else if (e.target.classList.contains('pform-color-stock')) {
          prodFormColors[idx].stock = e.target.value;
        }
        markProductFormDirty(true);
      });
      colContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-remove-color-row');
        if (btn) {
          prodFormColors.splice(parseInt(btn.getAttribute('data-idx'), 10), 1);
          renderProdColorRows();
          markProductFormDirty(true);
        }
      });
    }

    // Variant repeater actions
    var btnAddVar = document.getElementById('btnAddProdVariantRow');
    if (btnAddVar) {
      btnAddVar.addEventListener('click', function () {
        prodFormVariants.push({ label: '', delta: 0, discount: '' });
        renderProdVariantRows();
        markProductFormDirty(true);
      });
    }
    var varContainer = document.getElementById('prodVariantRowsContainer');
    if (varContainer) {
      varContainer.addEventListener('input', function (e) {
        var idx = parseInt(e.target.getAttribute('data-idx'), 10);
        if (isNaN(idx) || !prodFormVariants[idx]) return;
        var basePrice = Number((document.getElementById('prodModalPrice') && document.getElementById('prodModalPrice').value) || 0);
        if (e.target.classList.contains('pform-var-label')) {
          prodFormVariants[idx].label = e.target.value;
        } else if (e.target.classList.contains('pform-var-delta')) {
          prodFormVariants[idx].delta = parseInt(e.target.value, 10) || 0;
          var prInput = varContainer.querySelector('.pform-var-price[data-idx="' + idx + '"]');
          if (prInput && basePrice > 0) prInput.value = Math.max(0, basePrice + prodFormVariants[idx].delta);
        } else if (e.target.classList.contains('pform-var-price')) {
          var customPr = parseInt(e.target.value, 10) || 0;
          prodFormVariants[idx].price = customPr;
          if (basePrice > 0) {
            prodFormVariants[idx].delta = customPr - basePrice;
            var dInput = varContainer.querySelector('.pform-var-delta[data-idx="' + idx + '"]');
            if (dInput) dInput.value = prodFormVariants[idx].delta;
          }
        }
        markProductFormDirty(true);
      });
      varContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-remove-var-row');
        if (btn) {
          prodFormVariants.splice(parseInt(btn.getAttribute('data-idx'), 10), 1);
          renderProdVariantRows();
          markProductFormDirty(true);
        }
      });
    }

    // Spec repeater actions
    var btnAddSpec = document.getElementById('btnAddProdSpecRow');
    var btnTplSpec = document.getElementById('btnApplySpecTemplate');
    if (btnAddSpec) {
      btnAddSpec.addEventListener('click', function () {
        prodFormSpecs.push(['', '']);
        renderProdSpecRows();
        markProductFormDirty(true);
      });
    }
    if (btnTplSpec) btnTplSpec.addEventListener('click', applySpecTemplateForCategory);
    var specContainer = document.getElementById('prodSpecRowsContainer');
    if (specContainer) {
      specContainer.addEventListener('input', function (e) {
        var idx = parseInt(e.target.getAttribute('data-idx'), 10);
        if (isNaN(idx) || !prodFormSpecs[idx]) return;
        if (e.target.classList.contains('pform-spec-key')) prodFormSpecs[idx][0] = e.target.value;
        else if (e.target.classList.contains('pform-spec-val')) prodFormSpecs[idx][1] = e.target.value;
        markProductFormDirty(true);
      });
      specContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-remove-spec-row');
        if (btn) {
          prodFormSpecs.splice(parseInt(btn.getAttribute('data-idx'), 10), 1);
          renderProdSpecRows();
          markProductFormDirty(true);
        }
      });
    }

    // Validate & Submit Product Form
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valBox = document.getElementById('prodModalValidationBox');
      if (valBox) { valBox.classList.add('hidden'); valBox.innerHTML = ''; }

      var errors = [];
      var focusTab = null;

      var name = document.getElementById('prodModalName').value.trim();
      var slug = document.getElementById('prodModalSlug').value.trim();
      var sku = document.getElementById('prodModalSku').value.trim();
      var prodCatSlug = document.getElementById('prodModalProductCategory').value;
      var brandId = document.getElementById('prodModalCategory').value;
      var statusVal = document.getElementById('prodModalStatus').value;
      var rawPrice = document.getElementById('prodModalPrice').value.trim();
      var rawOldPrice = document.getElementById('prodModalOldPrice').value.trim();
      var rawStock = document.getElementById('prodModalStock').value.trim();
      var rawThreshold = document.getElementById('prodModalStockThreshold').value.trim();
      var image = document.getElementById('prodModalImage').value.trim();
      var desc = document.getElementById('prodModalDesc').value.trim();

      var has3DEl = document.getElementById('prodModalHas3D');
      var modelUrlEl = document.getElementById('prodModalModelUrl');
      var sku3DEl = document.getElementById('prodModalSku3D');
      var exp3DEl = document.getElementById('prodModalExploded3D');

      var priceNum = rawPrice === '' ? NaN : Number(rawPrice);
      var oldPriceNum = rawOldPrice === '' ? null : Number(rawOldPrice);
      var stockNum = rawStock === '' ? 15 : Number(rawStock);

      if (!name || name.length < 2) {
        errors.push('Tên sản phẩm phải có ít nhất 2 ký tự.');
        focusTab = focusTab || 'basic';
      }
      if (isNaN(priceNum) || priceNum < 0) {
        errors.push('Giá bán phải là số >= 0 (nhập 0 cho "Giá liên hệ").');
        focusTab = focusTab || 'basic';
      }
      if (oldPriceNum !== null && (isNaN(oldPriceNum) || oldPriceNum < 0 || (priceNum > 0 && oldPriceNum < priceNum))) {
        errors.push('Giá gốc niêm yết phải lớn hơn hoặc bằng giá bán hiện tại.');
        focusTab = focusTab || 'basic';
      }
      if (isNaN(stockNum) || stockNum < 0) {
        errors.push('Số lượng tồn kho không được âm.');
        focusTab = focusTab || 'basic';
      }
      if (!updateModel3DHintState()) {
        errors.push('Đường dẫn mô hình 3D phải nằm trong thư mục models3d/ và kết thúc bằng .glb hoặc .gltf.');
        focusTab = focusTab || '3d_seo';
      }

      if (errors.length) {
        if (focusTab) switchProductFormTab(focusTab);
        if (valBox) {
          valBox.innerHTML = '<p class="font-bold mb-1">Vui lòng kiểm tra lại dữ liệu:</p><ul class="list-disc pl-4 space-y-0.5 text-xs">' +
            errors.map(function (err) { return '<li>' + escapeHtml(err) + '</li>'; }).join('') + '</ul>';
          valBox.classList.remove('hidden');
        }
        engine.showToast(errors[0], true);
        return;
      }

      var fallbackMainImg = image || 'frontend/assets/images/logo.png';
      var cleanGallery = prodFormGallery.map(function (u) { return String(u || '').trim(); }).filter(Boolean);
      var cleanColors = prodFormColors
        .filter(function (c) { return c && String(c.name || '').trim(); })
        .map(function (c, i) {
          var ci = String(c.image || c.img || '').trim() || fallbackMainImg;
          return {
            name: String(c.name).trim(),
            hex: /^#[0-9a-f]{6}$/i.test(String(c.hex || '')) ? String(c.hex).toUpperCase() : '#334155',
            key: c.key || engine.slugify(c.name) || ('color-' + i),
            image: ci,
            img: ci,
            stock: c.stock !== undefined && c.stock !== '' ? Math.max(0, parseInt(c.stock, 10) || 0) : undefined
          };
        });
      var cleanVariants = prodFormVariants
        .filter(function (v) { return v && String(v.label || '').trim(); })
        .map(function (v) {
          return {
            label: String(v.label).trim(),
            delta: parseInt(v.delta, 10) || 0,
            discount: v.discount || ''
          };
        });
      var cleanSpecs = prodFormSpecs
        .filter(function (pair) { return Array.isArray(pair) && String(pair[0] || '').trim(); })
        .map(function (pair) { return [String(pair[0]).trim(), String(pair[1] || '').trim()]; });

      var seoTitle = (document.getElementById('prodModalSeoTitle') && document.getElementById('prodModalSeoTitle').value.trim()) || '';
      var seoSlug = (document.getElementById('prodModalSeoSlug') && document.getElementById('prodModalSeoSlug').value.trim()) || '';
      var seoDesc = (document.getElementById('prodModalSeoDesc') && document.getElementById('prodModalSeoDesc').value.trim()) || '';

      var prodData = {
        name: name,
        slug: slug || engine.slugify(name),
        sku: sku,
        category: prodCatSlug,
        category_slug: prodCatSlug,
        category_id: brandId,
        status: statusVal === 'hidden' ? 'hidden' : 'active',
        price: Math.max(0, parseInt(priceNum, 10) || 0),
        old_price: oldPriceNum ? parseInt(oldPriceNum, 10) : null,
        image: fallbackMainImg,
        extraImages: cleanGallery,
        description: desc,
        stock: Math.max(0, parseInt(stockNum, 10) || 0),
        stock_threshold: Math.max(1, parseInt(rawThreshold, 10) || 5),
        colors: cleanColors.length ? cleanColors : [{ name: 'Mặc định', hex: '#334155', key: 'default', image: fallbackMainImg, img: fallbackMainImg }],
        variants: cleanVariants.length ? cleanVariants : [{ label: 'Tiêu chuẩn', delta: 0 }],
        specs: cleanSpecs,
        seo: {
          title: seoTitle || (name + ' | VLU FLAGSHIP STORE'),
          slug: seoSlug || slug || engine.slugify(name),
          description: seoDesc || desc
        }
      };

      var savedProduct = null;
      if (editingProductId) {
        savedProduct = engine.updateProduct(editingProductId, prodData);
        engine.showToast('Cập nhật sản phẩm thành công!');
      } else {
        savedProduct = engine.addProduct(prodData);
        engine.showToast('Thêm sản phẩm mới thành công!');
      }

      var targetProdId = (savedProduct && savedProduct.id) || editingProductId;
      if (targetProdId && typeof engine.saveProduct3DConfig === 'function') {
        engine.saveProduct3DConfig(targetProdId, {
          has3D: Boolean(has3DEl && has3DEl.checked),
          modelUrl: modelUrlEl ? modelUrlEl.value.trim() : '',
          sku: sku3DEl ? sku3DEl.value.trim() : '',
          supportsExplodedView: Boolean(exp3DEl && exp3DEl.checked)
        }, savedProduct && savedProduct.sku);
      }

      markProductFormDirty(false);
      closeAllModals(true);
    });

    window.addEventListener('beforeunload', function (e) {
      if (productFormDirty && modal && !modal.classList.contains('hidden')) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  function initCategoryAndBrandModalControls() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    // Auto slug for Category
    var catNameEl = document.getElementById('catModalName');
    var catSlugEl = document.getElementById('catModalSlug');
    var catImgEl = document.getElementById('catModalImage');
    var catPrevEl = document.getElementById('catModalImagePreview');
    if (catNameEl && catSlugEl) {
      catNameEl.addEventListener('input', function () {
        if (!catSlugManuallyEdited && !editingCategoryId) {
          catSlugEl.value = engine.slugify(catNameEl.value);
        }
      });
      catSlugEl.addEventListener('input', function () { catSlugManuallyEdited = true; });
    }
    if (catImgEl && catPrevEl) {
      catImgEl.addEventListener('input', function () {
        catPrevEl.src = catImgEl.value.trim() || 'frontend/assets/images/logo.png';
      });
    }

    var categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
      categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('catModalName').value.trim();
        var slug = document.getElementById('catModalSlug').value.trim();
        var icon = document.getElementById('catModalIcon').value.trim();
        var image = (document.getElementById('catModalImage') && document.getElementById('catModalImage').value.trim()) || '';
        var parentId = (document.getElementById('catModalParent') && document.getElementById('catModalParent').value) || '';
        var status = (document.getElementById('catModalStatus') && document.getElementById('catModalStatus').value) || 'active';
        var desc = document.getElementById('catModalDesc').value.trim();

        if (!name) {
          engine.showToast('Vui lòng nhập tên danh mục!', true);
          return;
        }
        var catData = {
          name: name,
          slug: slug || engine.slugify(name),
          icon: icon || '📦',
          image: image,
          parent_id: parentId ? Number(parentId) : null,
          status: status === 'inactive' ? 'inactive' : 'active',
          description: desc
        };
        if (editingCategoryId) {
          engine.updateProductCategory(editingCategoryId, catData);
          engine.showToast('Cập nhật danh mục thành công!');
        } else {
          engine.addProductCategory(catData);
          engine.showToast('Thêm danh mục mới thành công!');
        }
        closeAllModals(true);
      });
    }

    // Auto slug & shortCode for Brand
    var brandNameEl = document.getElementById('brandModalName');
    var brandSlugEl = document.getElementById('brandModalSlug');
    var brandShortEl = document.getElementById('brandModalShortCode');
    var brandLogoEl = document.getElementById('brandModalLogo');
    var brandLogoPrev = document.getElementById('brandModalLogoPreview');
    if (brandNameEl) {
      brandNameEl.addEventListener('input', function () {
        if (!brandSlugManuallyEdited && !editingBrandId && brandSlugEl) {
          brandSlugEl.value = engine.slugify(brandNameEl.value);
        }
        if (!editingBrandId && brandShortEl && !brandShortEl.dataset.manual) {
          var clean = engine.normalizeText(brandNameEl.value).replace(/[^a-z0-9]/g, '').toUpperCase();
          brandShortEl.value = clean.slice(0, 3);
        }
      });
    }
    if (brandSlugEl) brandSlugEl.addEventListener('input', function () { brandSlugManuallyEdited = true; });
    if (brandShortEl) brandShortEl.addEventListener('input', function () { brandShortEl.dataset.manual = '1'; });
    if (brandLogoEl && brandLogoPrev) {
      brandLogoEl.addEventListener('input', function () {
        brandLogoPrev.src = brandLogoEl.value.trim() || 'frontend/assets/images/logo.png';
      });
    }

    var brandForm = document.getElementById('brandForm');
    if (brandForm) {
      brandForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('brandModalName').value.trim();
        var slug = document.getElementById('brandModalSlug').value.trim();
        var shortCode = (document.getElementById('brandModalShortCode') && document.getElementById('brandModalShortCode').value.trim()) || '';
        var icon = document.getElementById('brandModalIcon').value.trim();
        var logo = (document.getElementById('brandModalLogo') && document.getElementById('brandModalLogo').value.trim()) || '';
        var status = (document.getElementById('brandModalStatus') && document.getElementById('brandModalStatus').value) || 'active';
        var desc = document.getElementById('brandModalDesc').value.trim();

        if (!name) {
          engine.showToast('Vui lòng nhập tên thương hiệu!', true);
          return;
        }
        var brandData = {
          name: name,
          slug: slug || engine.slugify(name),
          shortCode: shortCode,
          icon: icon || '🏷️',
          logo: logo,
          status: status === 'inactive' ? 'inactive' : 'active',
          description: desc
        };
        if (editingBrandId) {
          engine.updateBrand(editingBrandId, brandData);
          engine.showToast('Cập nhật thương hiệu thành công!');
        } else {
          engine.addBrand(brandData);
          engine.showToast('Thêm thương hiệu mới thành công!');
        }
        closeAllModals(true);
      });
    }
  }

  function fillProduct3DModalFields(cfg) {
    var hasEl = document.getElementById('prodModalHas3D');
    var urlEl = document.getElementById('prodModalModelUrl');
    var skuEl = document.getElementById('prodModalSku3D');
    var expEl = document.getElementById('prodModalExploded3D');
    var hintEl = document.getElementById('prodModalModel3DHint');
    if (hasEl) hasEl.checked = Boolean(cfg && cfg.has3D);
    if (urlEl) urlEl.value = (cfg && cfg.modelUrl) ? cfg.modelUrl : '';
    if (skuEl) skuEl.value = (cfg && cfg.sku) ? cfg.sku : '';
    if (expEl) expEl.checked = Boolean(cfg && cfg.supportsExplodedView);
    if (hintEl) {
      hintEl.className = 'mt-1 text-[11px] font-semibold text-slate-500';
      hintEl.textContent = (cfg && cfg.modelUrl)
        ? 'Đường dẫn hợp lệ (' + cfg.modelUrl + '). Trình xem 3D sẽ tự động xác minh tệp tồn tại thực tế.'
        : 'Đường dẫn an toàn phải nằm trong thư mục models3d/ và có đuôi .glb hoặc .gltf.';
    }
  }

  function openAddProductModal() {
    editingProductId = null;
    prodSlugManuallyEdited = false;
    populateProductSelects();
    var form = document.getElementById('productForm');
    if (form) form.reset();
    var valBox = document.getElementById('prodModalValidationBox');
    if (valBox) { valBox.classList.add('hidden'); valBox.innerHTML = ''; }
    var prevPane = document.getElementById('prodFormPreviewPane');
    if (prevPane) prevPane.classList.add('hidden');
    var title = document.getElementById('productModalTitle');
    if (title) title.textContent = 'Thêm sản phẩm mới';
    var imgPreview = document.getElementById('prodModalImagePreview');
    if (imgPreview) imgPreview.src = 'frontend/assets/images/logo.png';
    var stockInput = document.getElementById('prodModalStock');
    if (stockInput) stockInput.value = 15;
    var thrInput = document.getElementById('prodModalStockThreshold');
    if (thrInput) thrInput.value = 5;
    var stInput = document.getElementById('prodModalStatus');
    if (stInput) stInput.value = 'active';
    var slugEl = document.getElementById('prodModalSlug');
    if (slugEl) slugEl.disabled = false;

    prodFormGallery = [];
    prodFormColors = [{ name: 'Mặc định', hex: '#334155', key: 'default', image: '', stock: '' }];
    prodFormVariants = [{ label: 'Tiêu chuẩn', delta: 0, discount: '' }];
    prodFormSpecs = [];
    renderProdGalleryRows();
    renderProdColorRows();
    renderProdVariantRows();
    renderProdSpecRows();

    fillProduct3DModalFields(null);
    switchProductFormTab('basic');
    updateProductDiscountAndSeoPreview();
    markProductFormDirty(false);
    openModal(document.getElementById('productModal'));
  }

  function openEditProductModal(id) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    populateProductSelects();
    var products = engine.getProducts();
    var p = products.find(function (item) { return String(item.id) === String(id); });
    if (!p) return;

    editingProductId = p.id;
    prodSlugManuallyEdited = true;
    var valBox = document.getElementById('prodModalValidationBox');
    if (valBox) { valBox.classList.add('hidden'); valBox.innerHTML = ''; }
    var prevPane = document.getElementById('prodFormPreviewPane');
    if (prevPane) prevPane.classList.add('hidden');

    var title = document.getElementById('productModalTitle');
    if (title) title.textContent = 'Chỉnh sửa sản phẩm: ' + p.name;

    document.getElementById('prodModalName').value = p.name || '';
    var slugEl = document.getElementById('prodModalSlug');
    if (slugEl) { slugEl.value = p.slug || p.id || ''; slugEl.disabled = !p.is_custom; }
    var skuEl = document.getElementById('prodModalSku');
    if (skuEl) skuEl.value = p.sku || '';

    var prodCatEl = document.getElementById('prodModalProductCategory');
    if (prodCatEl) prodCatEl.value = p.category || p.category_slug || 'dien-thoai';
    document.getElementById('prodModalCategory').value = String(p.category_id || 1);
    var stEl = document.getElementById('prodModalStatus');
    if (stEl) stEl.value = p.status === 'hidden' ? 'hidden' : 'active';

    document.getElementById('prodModalPrice').value = p.price !== undefined ? p.price : '';
    document.getElementById('prodModalOldPrice').value = p.old_price || '';
    document.getElementById('prodModalImage').value = p.image || '';
    document.getElementById('prodModalDesc').value = p.description || '';
    document.getElementById('prodModalStock').value = p.stock !== undefined ? p.stock : 15;
    var thrEl = document.getElementById('prodModalStockThreshold');
    if (thrEl) thrEl.value = p.stock_threshold || 5;

    var imgPreview = document.getElementById('prodModalImagePreview');
    if (imgPreview) imgPreview.src = safeImage(p.image, p.category);

    prodFormGallery = Array.isArray(p.extraImages) ? p.extraImages.slice() : [];
    prodFormColors = Array.isArray(p.colors) && p.colors.length
      ? p.colors.map(function (c) { return Object.assign({}, c); })
      : [{ name: 'Mặc định', hex: '#334155', key: 'default', image: p.image || '', stock: '' }];
    prodFormVariants = Array.isArray(p.variants) && p.variants.length
      ? p.variants.map(function (v) { return Object.assign({}, v); })
      : [{ label: 'Tiêu chuẩn', delta: 0 }];
    prodFormSpecs = Array.isArray(p.specs) ? p.specs.map(function (s) { return Array.isArray(s) ? [s[0], s[1]] : ['', '']; }) : [];

    renderProdGalleryRows();
    renderProdColorRows();
    renderProdVariantRows();
    renderProdSpecRows();

    var seo = p.seo || {};
    var seoT = document.getElementById('prodModalSeoTitle');
    var seoS = document.getElementById('prodModalSeoSlug');
    var seoD = document.getElementById('prodModalSeoDesc');
    if (seoT) seoT.value = seo.title || '';
    if (seoS) seoS.value = seo.slug || p.slug || p.id || '';
    if (seoD) seoD.value = seo.description || '';

    var cfg3D = typeof engine.getProduct3DConfig === 'function' ? engine.getProduct3DConfig(p.id, p.sku) : null;
    fillProduct3DModalFields(cfg3D);

    switchProductFormTab('basic');
    updateProductDiscountAndSeoPreview();
    markProductFormDirty(false);
    openModal(document.getElementById('productModal'));
  }

  function openProductQuickPreviewModal(id) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var p = engine.getProducts().find(function (item) { return String(item.id) === String(id); });
    if (!p) return;

    currentPreviewProductId = p.id;
    var modal = document.getElementById('productQuickPreviewModal');
    var nameEl = document.getElementById('qpProductName');
    var body = document.getElementById('qpBodyContent');
    var storeLink = document.getElementById('qpOpenStorefrontLink');
    var editBtn = document.getElementById('btnQpEditProduct');
    if (!modal || !body) return;

    if (nameEl) nameEl.textContent = p.name;
    if (storeLink) storeLink.href = 'product-detail.html?id=' + encodeURIComponent(p.id);
    if (editBtn) {
      editBtn.onclick = function () {
        closeAllModals(true);
        openEditProductModal(p.id);
      };
    }

    var colors = Array.isArray(p.colors) && p.colors.length ? p.colors : [{ name: 'Mặc định', hex: '#334155', image: p.image }];
    var variants = Array.isArray(p.variants) && p.variants.length ? p.variants : [{ label: 'Tiêu chuẩn', delta: 0 }];
    var specs = Array.isArray(p.specs) ? p.specs : [];
    var extraImgs = Array.isArray(p.extraImages) ? p.extraImages : [];
    var basePrice = Number(p.price) || 0;
    var oldPrice = Number(p.old_price) || 0;
    var has3D = typeof engine.hasEffective3D === 'function' ? engine.hasEffective3D(p) : false;
    var cfg3D = typeof engine.getProduct3DConfig === 'function' ? engine.getProduct3DConfig(p.id, p.sku) : null;
    var firstImg = safeImage((colors[0] && (colors[0].image || colors[0].img)) || p.image, p.category);
    var stock = Number(p.stock) || 0;
    var threshold = Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : 5;

    body.innerHTML =
      '<div class="rounded-2xl border border-slate-200 p-4 bg-white flex flex-col items-center gap-3">' +
        '<div class="h-52 w-full flex items-center justify-center">' +
          '<img id="qpMainPreviewImg" src="' + escapeHtml(firstImg) + '" alt="' + escapeHtml(p.name) + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';">' +
        '</div>' +
        '<div class="flex flex-wrap items-center justify-center gap-2">' +
          colors.map(function (c, i) {
            var cImg = safeImage(c.image || c.img || p.image, p.category);
            return '<button type="button" class="qp-color-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition ' + (i === 0 ? 'border-brand bg-brand-soft text-brand' : 'border-slate-200 bg-white text-slate-700') + '" data-img="' + escapeHtml(cImg) + '">' +
              '<span class="h-3 w-3 rounded-full border border-slate-300" style="background:' + escapeHtml(c.hex || '#334155') + ';"></span>' +
              '<span>' + escapeHtml(c.name || 'Mặc định') + (c.stock !== undefined && c.stock !== '' ? ' (' + c.stock + ')' : '') + '</span>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">' +
        '<div class="p-3 rounded-xl border border-slate-200" style="background: var(--admin-bg-sub);">' +
          '<p class="text-[10px] font-bold uppercase" style="color: var(--admin-text-muted);">Mã SKU</p>' +
          '<p class="text-xs font-mono font-bold mt-0.5">' + escapeHtml(p.sku || String(p.id).toUpperCase()) + '</p>' +
        '</div>' +
        '<div class="p-3 rounded-xl border border-slate-200" style="background: var(--admin-bg-sub);">' +
          '<p class="text-[10px] font-bold uppercase" style="color: var(--admin-text-muted);">Thương hiệu / Danh mục</p>' +
          '<p class="text-xs font-bold mt-0.5">' + escapeHtml(p.brand || p.category_name) + ' · ' + escapeHtml(p.product_category_name || engine.getProductCategoryName(p.category)) + '</p>' +
        '</div>' +
        '<div class="p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1" style="background: var(--admin-bg-sub);">' +
          '<p class="text-[10px] font-bold uppercase" style="color: var(--admin-text-muted);">Kho &amp; Trạng thái</p>' +
          '<p class="text-xs font-bold mt-0.5">' + (stock <= 0 ? 'Hết hàng (0)' : (stock <= threshold ? 'Sắp hết (' + stock + ')' : 'Còn hàng (' + stock + ')')) + ' · ' + (p.status === 'hidden' ? 'Đang ẩn' : 'Đang bán') + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="p-4 rounded-2xl border border-slate-200 space-y-3" style="background: var(--admin-bg-sub);">' +
        '<div class="flex flex-wrap items-baseline justify-between gap-2">' +
          '<div>' +
            '<p class="text-[11px] font-bold" style="color: var(--admin-text-secondary);">Giá bán theo phiên bản đang chọn</p>' +
            '<div class="flex items-baseline gap-2.5">' +
              '<span id="qpDynamicPrice" class="text-xl font-extrabold text-brand tabular-nums">' + (basePrice > 0 ? escapeHtml(engine.formatVND(basePrice + (Number(variants[0].delta) || 0))) : 'Giá liên hệ') + '</span>' +
              (oldPrice > basePrice ? '<span class="text-xs text-slate-400 line-through">' + escapeHtml(engine.formatVND(oldPrice)) + '</span>' : '') +
            '</div>' +
          '</div>' +
          (has3D ? '<span class="vlu-badge vlu-badge-info">Hỗ trợ Xem 3D' + (cfg3D && cfg3D.modelUrl ? ': ' + escapeHtml(cfg3D.modelUrl) : '') + '</span>' : '') +
        '</div>' +
        '<div class="flex flex-wrap gap-2">' +
          variants.map(function (v, idx) {
            var delta = Number(v.delta) || 0;
            var vp = basePrice > 0 ? Math.max(0, basePrice + delta) : 0;
            return '<button type="button" class="qp-var-btn px-3 py-1.5 rounded-xl border text-xs font-bold transition ' + (idx === 0 ? 'border-brand bg-brand-soft text-brand' : 'border-slate-200 bg-white text-slate-700') + '" data-price="' + vp + '">' +
              escapeHtml(v.label || 'Tiêu chuẩn') + (vp > 0 ? ' · ' + escapeHtml(engine.formatVND(vp)) : '') +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +

      (extraImgs.length ? '<div class="space-y-2"><p class="text-xs font-extrabold">Ảnh Gallery (' + extraImgs.length + ')</p><div class="flex gap-2 overflow-x-auto pb-1">' +
        extraImgs.map(function (u) {
          return '<img src="' + escapeHtml(safeImage(u, p.category)) + '" class="h-14 w-14 shrink-0 rounded-lg border border-slate-200 bg-white p-1 object-contain cursor-pointer qp-color-btn" data-img="' + escapeHtml(safeImage(u, p.category)) + '">';
        }).join('') +
      '</div></div>' : '') +

      (p.description ? '<div class="space-y-1"><p class="text-xs font-extrabold">Mô tả sản phẩm</p><p class="text-xs leading-relaxed" style="color: var(--admin-text-secondary);">' + escapeHtml(p.description) + '</p></div>' : '') +

      '<div class="space-y-2">' +
        '<p class="text-xs font-extrabold">Thông số kỹ thuật (' + specs.length + ')</p>' +
        (specs.length ? '<div class="rounded-xl border border-slate-200 overflow-hidden"><table class="w-full text-xs">' +
          specs.map(function (pair, i) {
            return '<tr class="' + (i % 2 === 0 ? 'bg-slate-50/75' : 'bg-white') + ' border-b border-slate-100 last:border-0">' +
              '<td class="py-2 px-3 font-semibold w-2/5" style="color: var(--admin-text-secondary);">' + escapeHtml(pair[0] || '') + '</td>' +
              '<td class="py-2 px-3 font-bold">' + escapeHtml(pair[1] || '--') + '</td>' +
            '</tr>';
          }).join('') +
        '</table></div>' : '<p class="text-xs italic" style="color: var(--admin-text-secondary);">Chưa cập nhật bảng thông số kỹ thuật.</p>') +
      '</div>';

    body.querySelectorAll('.qp-color-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mainImg = document.getElementById('qpMainPreviewImg');
        if (mainImg) mainImg.src = btn.getAttribute('data-img');
        body.querySelectorAll('.qp-color-btn').forEach(function (b) {
          b.classList.remove('border-brand', 'bg-brand-soft', 'text-brand');
        });
        btn.classList.add('border-brand', 'bg-brand-soft', 'text-brand');
      });
    });

    body.querySelectorAll('.qp-var-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var vp = Number(btn.getAttribute('data-price') || 0);
        var dp = document.getElementById('qpDynamicPrice');
        if (dp) dp.textContent = vp > 0 ? engine.formatVND(vp) : 'Giá liên hệ';
        body.querySelectorAll('.qp-var-btn').forEach(function (b) {
          b.classList.remove('border-brand', 'bg-brand-soft', 'text-brand');
        });
        btn.classList.add('border-brand', 'bg-brand-soft', 'text-brand');
      });
    });

    openModal(modal);
  }

  function openTaxonomyPreviewModal(kind, id) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var modal = document.getElementById('taxonomyPreviewModal');
    var badgeEl = document.getElementById('taxPreviewBadge');
    var titleEl = document.getElementById('taxPreviewTitle');
    var bodyEl = document.getElementById('taxPreviewBody');
    var filterBtn = document.getElementById('btnTaxPreviewFilterProducts');
    if (!modal || !bodyEl) return;

    var products = engine.getProducts();
    var matchedProducts = [];
    var headerHtml = '';

    if (kind === 'category') {
      var cats = engine.getProductCategories();
      var cat = cats.find(function (c) { return Number(c.id) === Number(id); });
      if (!cat) return;
      var parent = cat.parent_id ? cats.find(function (c) { return Number(c.id) === Number(cat.parent_id); }) : null;
      matchedProducts = products.filter(function (p) { return String(p.category || p.category_slug) === String(cat.slug); });
      if (badgeEl) badgeEl.textContent = 'Xem trước Danh mục sản phẩm';
      if (titleEl) titleEl.textContent = cat.name;
      headerHtml =
        '<div class="p-4 rounded-2xl border border-slate-200 flex items-start gap-3" style="background: var(--admin-bg-sub);">' +
          '<div class="vlu-brand-monogram text-2xl">' + escapeHtml(cat.icon || '📦') + '</div>' +
          '<div class="flex-1 text-xs space-y-1">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<code class="vlu-sku-tag">/' + escapeHtml(cat.slug) + '</code>' +
              '<span class="vlu-badge ' + (cat.status === 'inactive' ? 'vlu-badge-neutral' : 'vlu-badge-success') + '">' + (cat.status === 'inactive' ? 'Tạm ẩn' : 'Hoạt động') + '</span>' +
              (parent ? '<span class="vlu-badge vlu-badge-neutral">Cha: ' + escapeHtml(parent.name) + '</span>' : '') +
            '</div>' +
            '<p style="color: var(--admin-text-secondary);">' + escapeHtml(cat.description || 'Chưa có mô tả.') + '</p>' +
            '<p class="text-[11px] font-semibold" style="color: var(--admin-text-muted);">Tạo: ' + escapeHtml(engine.formatDate(cat.created_at)) + (cat.updated_at ? ' · Cập nhật: ' + escapeHtml(engine.formatDate(cat.updated_at)) : '') + '</p>' +
          '</div>' +
        '</div>';
      if (filterBtn) {
        filterBtn.onclick = function () {
          closeAllModals(true);
          navigateWithFilter('products', 'cat:' + cat.slug);
        };
      }
    } else {
      var brands = engine.getBrands();
      var brand = brands.find(function (b) { return Number(b.id) === Number(id); });
      if (!brand) return;
      matchedProducts = products.filter(function (p) {
        return Number(p.category_id) === Number(brand.id) || engine.normalizeText(p.brand || p.category_name) === engine.normalizeText(brand.name);
      });
      if (badgeEl) badgeEl.textContent = 'Xem trước Thương hiệu đối tác';
      if (titleEl) titleEl.textContent = brand.name;
      headerHtml =
        '<div class="p-4 rounded-2xl border border-slate-200 flex items-start gap-3" style="background: var(--admin-bg-sub);">' +
          '<div class="vlu-brand-monogram">' + escapeHtml(brand.shortCode || 'BR') + '</div>' +
          '<div class="flex-1 text-xs space-y-1">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<code class="vlu-sku-tag">/' + escapeHtml(brand.slug) + '</code>' +
              '<span class="vlu-badge ' + (brand.status === 'inactive' ? 'vlu-badge-neutral' : 'vlu-badge-success') + '">' + (brand.status === 'inactive' ? 'Tạm ngừng' : 'Đang hợp tác') + '</span>' +
              '<span class="vlu-badge vlu-badge-brand">' + matchedProducts.length + ' sản phẩm liên kết</span>' +
            '</div>' +
            '<p style="color: var(--admin-text-secondary);">' + escapeHtml(brand.description || 'Chưa có mô tả thương hiệu.') + '</p>' +
          '</div>' +
        '</div>';
      if (filterBtn) {
        filterBtn.onclick = function () {
          closeAllModals(true);
          navigateWithFilter('products', 'brand:' + brand.id);
        };
      }
    }

    var listHtml = matchedProducts.length
      ? '<div class="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-100 border border-slate-200 rounded-xl">' +
          matchedProducts.slice(0, 40).map(function (p) {
            return '<div class="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/75">' +
              '<div class="flex items-center gap-2.5 min-w-0">' +
                '<img src="' + escapeHtml(safeImage(p.image, p.category)) + '" class="h-9 w-9 rounded-lg border border-slate-200 bg-white p-0.5 object-contain shrink-0">' +
                '<div class="min-w-0"><p class="text-xs font-bold truncate">' + escapeHtml(p.name) + '</p><p class="text-[11px] font-mono text-slate-400">' + escapeHtml(p.sku || p.id) + '</p></div>' +
              '</div>' +
              '<div class="text-right shrink-0"><p class="text-xs font-extrabold text-brand">' + (Number(p.price) > 0 ? escapeHtml(engine.formatVND(p.price)) : 'Liên hệ') + '</p><p class="text-[10px] text-slate-400">Kho: ' + (Number(p.stock) || 0) + '</p></div>' +
            '</div>';
          }).join('') +
        '</div>'
      : '<div class="vlu-empty-state"><p class="text-xs font-bold">Chưa có sản phẩm nào thuộc mục này</p></div>';

    bodyEl.innerHTML = headerHtml + '<div class="space-y-2"><p class="text-xs font-extrabold">Sản phẩm đang liên kết (' + matchedProducts.length + ')</p>' + listHtml + '</div>';
    openModal(modal);
  }

  function populateCategoryParentOptions(excludeId) {
    var engine = window.VLU_ADMIN;
    var sel = document.getElementById('catModalParent');
    if (!engine || !sel) return;
    var cats = engine.getProductCategories();
    sel.innerHTML = '<option value="">-- Danh mục gốc --</option>';
    cats.forEach(function (c) {
      if (excludeId && Number(c.id) === Number(excludeId)) return;
      var opt = document.createElement('option');
      opt.value = String(c.id);
      opt.textContent = c.name;
      sel.appendChild(opt);
    });
  }

  function openAddCategoryModal() {
    editingCategoryId = null;
    catSlugManuallyEdited = false;
    var form = document.getElementById('categoryForm');
    if (form) form.reset();
    populateCategoryParentOptions(null);
    var title = document.getElementById('categoryModalTitle');
    if (title) title.textContent = 'Thêm danh mục thiết bị';
    var prev = document.getElementById('catModalImagePreview');
    if (prev) prev.src = 'frontend/assets/images/logo.png';
    var st = document.getElementById('catModalStatus');
    if (st) st.value = 'active';
    openModal(document.getElementById('categoryModal'));
  }

  function openEditCategoryModal(id) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var cats = engine.getProductCategories();
    var numId = parseInt(id, 10);
    var c = cats.find(function (item) { return Number(item.id) === numId; });
    if (!c) return;

    editingCategoryId = numId;
    catSlugManuallyEdited = true;
    populateCategoryParentOptions(numId);
    var title = document.getElementById('categoryModalTitle');
    if (title) title.textContent = 'Sửa danh mục: ' + c.name;

    document.getElementById('catModalName').value = c.name;
    document.getElementById('catModalSlug').value = c.slug || '';
    document.getElementById('catModalIcon').value = c.icon || '';
    document.getElementById('catModalDesc').value = c.description || '';
    var imgEl = document.getElementById('catModalImage');
    var prevEl = document.getElementById('catModalImagePreview');
    if (imgEl) imgEl.value = c.image || '';
    if (prevEl) prevEl.src = c.image ? safeImage(c.image, c.slug) : 'frontend/assets/images/logo.png';
    var parEl = document.getElementById('catModalParent');
    if (parEl) parEl.value = c.parent_id ? String(c.parent_id) : '';
    var stEl = document.getElementById('catModalStatus');
    if (stEl) stEl.value = c.status === 'inactive' ? 'inactive' : 'active';
    openModal(document.getElementById('categoryModal'));
  }

  function openAddBrandModal() {
    editingBrandId = null;
    brandSlugManuallyEdited = false;
    var form = document.getElementById('brandForm');
    if (form) form.reset();
    var title = document.getElementById('brandModalTitle');
    if (title) title.textContent = 'Thêm thương hiệu mới';
    var shortEl = document.getElementById('brandModalShortCode');
    if (shortEl) { shortEl.value = ''; delete shortEl.dataset.manual; }
    var prev = document.getElementById('brandModalLogoPreview');
    if (prev) prev.src = 'frontend/assets/images/logo.png';
    var st = document.getElementById('brandModalStatus');
    if (st) st.value = 'active';
    openModal(document.getElementById('brandModal'));
  }

  function openEditBrandModal(id) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var brands = engine.getBrands();
    var numId = parseInt(id, 10);
    var b = brands.find(function (item) { return Number(item.id) === numId; });
    if (!b) return;

    editingBrandId = numId;
    brandSlugManuallyEdited = true;
    var title = document.getElementById('brandModalTitle');
    if (title) title.textContent = 'Sửa thương hiệu: ' + b.name;

    document.getElementById('brandModalName').value = b.name;
    document.getElementById('brandModalSlug').value = b.slug || '';
    document.getElementById('brandModalIcon').value = b.icon || '';
    document.getElementById('brandModalDesc').value = b.description || '';
    var shortEl = document.getElementById('brandModalShortCode');
    if (shortEl) { shortEl.value = b.shortCode || ''; shortEl.dataset.manual = '1'; }
    var logoEl = document.getElementById('brandModalLogo');
    var logoPrev = document.getElementById('brandModalLogoPreview');
    if (logoEl) logoEl.value = b.logo || '';
    if (logoPrev) logoPrev.src = b.logo || 'frontend/assets/images/logo.png';
    var stEl = document.getElementById('brandModalStatus');
    if (stEl) stEl.value = b.status === 'inactive' ? 'inactive' : 'active';
    openModal(document.getElementById('brandModal'));
  }

  function closeModalById(modalId) {
    var modal = modalId ? document.getElementById(modalId) : null;
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    if (modalId === 'orderCancelReasonModal') pendingCancelOrderId = null;
    if (modalId === 'userEditModal') editingUserId = null;
    if (modalId === 'userLockModal') pendingLockUserId = null;
    if (modalId === 'customer360Modal') currentViewingUserId = null;
    if (modalId === 'voucherModal') editingVoucherId = null;
    if (modalId === 'promotionModal') editingPromotionId = null;
    if (modalId === 'reviewQaReplyModal') pendingReplyTarget = null;
    if (modalId === 'returnTicketModal') editingReturnUid = null;
    if (modalId === 'memberPointsModal') pendingPointsUserId = null;

    var stillOpen = document.querySelectorAll('.admin-modal.flex').length > 0;
    if (!stillOpen) {
      document.body.classList.remove('overflow-hidden');
      document.body.style.overflow = '';
      if (document.documentElement) {
        document.documentElement.classList.remove('overflow-hidden');
        document.documentElement.style.overflow = '';
      }
    }
  }

  function openCancelOrderModal(orderId) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var targetKey = normalizeOrderKey(orderId);
    var o = engine.getOrders().find(function (item) { return item && normalizeOrderKey(item.order_code || item.id) === targetKey; });
    if (!o) return;
    var curSt = engine.normalizeOrderStatus(o.status);
    if (!engine.canTransitionOrderStatus(curSt, 'cancelled')) {
      engine.showToast('Không thể hủy đơn ở trạng thái "' + engine.getOrderStatusLabel(curSt) + '".', true);
      return;
    }
    var ordCode = formatOrderCode(o.order_code || o.id);
    pendingCancelOrderId = ordCode;
    var idLabel = document.getElementById('cancelModalOrderId');
    var reasonEl = document.getElementById('cancelOrderReasonInput');
    if (idLabel) idLabel.textContent = ordCode;
    if (reasonEl) reasonEl.value = '';
    openModal(document.getElementById('orderCancelReasonModal'));
  }

  function openOrderDetailModal(orderId) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var orders = engine.getOrders();
    var targetKey = normalizeOrderKey(orderId);
    var o = orders.find(function (item) { return item && normalizeOrderKey(item.order_code || item.id) === targetKey; });
    if (!o) return;

    var ordCode = formatOrderCode(o.order_code || o.id);
    currentViewingOrderId = ordCode;
    var curNorm = engine.normalizeOrderStatus(o.status);
    var payStatus = engine.resolveOrderPaymentStatus(o);
    var isGuest = isGuestOrderRecord(o);
    var shipFee = Number(o.shipping_fee) || 0;

    document.getElementById('detailModalOrderId').textContent = ordCode;
    var statusBadgeEl = document.getElementById('detailModalStatusBadge');
    if (statusBadgeEl) statusBadgeEl.innerHTML = engine.getStatusBadge(curNorm);
    var custBadgeEl = document.getElementById('detailModalCustomerBadge');
    if (custBadgeEl) {
      custBadgeEl.innerHTML = isGuest
        ? '<span class="vlu-badge vlu-badge-guest">Khách vãng lai</span>'
        : '<span class="vlu-badge vlu-badge-brand">Thành viên</span>';
    }
    var updatedAtEl = document.getElementById('detailModalUpdatedAt');
    if (updatedAtEl) {
      updatedAtEl.textContent = 'Cập nhật: ' + (engine.formatDateTime ? engine.formatDateTime(o.updated_at || o.created_at) : engine.formatDate(o.updated_at || o.created_at));
    }

    document.getElementById('detailModalDate').textContent = engine.formatDateTime ? engine.formatDateTime(o.created_at) : engine.formatDate(o.created_at);
    document.getElementById('detailModalName').textContent = o.customer_name || 'Khách hàng';
    document.getElementById('detailModalPhone').textContent = o.customer_phone || '--';
    document.getElementById('detailModalEmail').textContent = o.customer_email || 'Không cung cấp';
    document.getElementById('detailModalAddress').textContent = o.customer_address || '--';
    document.getElementById('detailModalNotes').textContent = o.customer_notes || 'Không có';
    document.getElementById('detailModalPayment').textContent = o.payment_method || 'COD';

    var paySel = document.getElementById('detailModalPaymentStatusSelect');
    if (paySel) paySel.value = payStatus;

    document.getElementById('detailModalSubtotal').textContent = engine.formatVND(o.subtotal || o.total);
    document.getElementById('detailModalDiscount').textContent = o.discount ? '-' + engine.formatVND(o.discount) : '0₫';
    var shipFeeEl = document.getElementById('detailModalShippingFee');
    if (shipFeeEl) {
      shipFeeEl.textContent = shipFee > 0 ? engine.formatVND(shipFee) : 'Miễn phí';
      shipFeeEl.className = shipFee > 0 ? 'font-bold' : 'font-bold text-emerald-600';
    }
    document.getElementById('detailModalTotal').textContent = engine.formatVND(o.total);

    // Render 6-step visual timeline
    var tlWrap = document.getElementById('detailModalTimelineWrap');
    var history = engine.getOrderStatusHistory(o);
    var historyMap = {};
    history.forEach(function (ev) { historyMap[ev.status] = ev; });
    var steps = engine.ORDER_PIPELINE_STEPS || [];
    var curIdx = steps.findIndex(function (s) { return s.key === curNorm; });
    var isCancelled = curNorm === 'cancelled' || curNorm === 'returned';

    if (tlWrap) {
      tlWrap.innerHTML = steps.map(function (step, idx) {
        var ev = historyMap[step.key];
        var cls = 'vlu-tl-step';
        if (isCancelled) {
          cls += ev ? ' is-done' : ' is-cancelled';
        } else if (idx < curIdx) {
          cls += ' is-done';
        } else if (idx === curIdx) {
          cls += ' is-current';
        }
        var ts = ev ? (engine.formatDateTime ? engine.formatDateTime(ev.timestamp) : engine.formatDate(ev.timestamp)) : 'Chờ xử lý';
        return '<div class="' + cls + '">' +
          '<div class="vlu-tl-dot">' + (idx < curIdx && !isCancelled ? '✓' : (idx + 1)) + '</div>' +
          '<p class="text-[11px] font-extrabold leading-tight">' + escapeHtml(step.label) + '</p>' +
          '<p class="text-[10px] mt-1 font-mono" style="color: var(--admin-text-secondary);">' + escapeHtml(ts) + '</p>' +
        '</div>';
      }).join('');
    }

    var cancelBanner = document.getElementById('detailModalCancelBanner');
    var cancelReasonTxt = document.getElementById('detailModalCancelReasonText');
    if (cancelBanner) {
      if (isCancelled) {
        cancelBanner.classList.remove('hidden');
        if (cancelReasonTxt) cancelReasonTxt.textContent = o.cancel_reason || 'Không có ghi chú lý do';
      } else {
        cancelBanner.classList.add('hidden');
      }
    }

    var tlLogsEl = document.getElementById('detailModalTimelineLogs');
    if (tlLogsEl) {
      tlLogsEl.innerHTML = history.slice().reverse().map(function (ev) {
        return '<div class="flex flex-wrap items-center justify-between gap-2 py-1">' +
          '<div><span class="font-bold">' + escapeHtml(ev.label) + '</span>' +
          (ev.note ? ' <span style="color: var(--admin-text-secondary);">· ' + escapeHtml(ev.note) + '</span>' : '') + '</div>' +
          '<div class="font-mono text-[10px]" style="color: var(--admin-text-secondary);">' + escapeHtml(ev.actor || 'Hệ thống') + ' · ' + escapeHtml(engine.formatDateTime ? engine.formatDateTime(ev.timestamp) : engine.formatDate(ev.timestamp)) + '</div>' +
        '</div>';
      }).join('');
    }

    // Items table with resolveItemProduct
    var itemsTbody = document.getElementById('detailModalItemsBody');
    if (itemsTbody) {
      itemsTbody.innerHTML = (o.items || []).map(function (it) {
        var matched = engine.resolveItemProduct ? engine.resolveItemProduct(it) : null;
        var imgUrl = safeImage((matched && matched.image) || it.image, matched ? matched.category : it.category);
        var sku = it.sku || (matched && matched.sku) || '--';
        var qty = Math.max(1, parseInt(it.quantity, 10) || 1);
        var unitPrice = parseInt(it.price, 10) || (matched ? Number(matched.price) : 0);
        var lineTotal = unitPrice * qty;
        return '<tr class="border-b border-slate-100">' +
          '<td class="py-2.5 px-3"><div class="flex items-center gap-2.5">' +
            '<div class="h-11 w-11 shrink-0 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center"><img src="' + escapeHtml(imgUrl) + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';"></div>' +
            '<div><p class="text-xs font-bold">' + escapeHtml(it.name || (matched && matched.name) || 'Sản phẩm') + '</p><p class="text-[10px] font-mono" style="color: var(--admin-text-secondary);">SKU: ' + escapeHtml(sku) + '</p></div>' +
          '</div></td>' +
          '<td class="py-2.5 px-3 text-xs" style="color: var(--admin-text-secondary);">' + escapeHtml(it.color || 'Mặc định') + (it.variant || it.storage ? (' · ' + escapeHtml(it.variant || it.storage)) : '') + '</td>' +
          '<td class="py-2.5 px-3 text-xs text-center font-bold">x' + escapeHtml(qty) + '</td>' +
          '<td class="py-2.5 px-3 text-xs text-right font-semibold">' + escapeHtml(engine.formatVND(unitPrice)) + '</td>' +
          '<td class="py-2.5 px-3 text-xs text-right font-extrabold text-brand">' + escapeHtml(engine.formatVND(lineTotal)) + '</td>' +
        '</tr>';
      }).join('');
    }

    // Internal notes
    var notesListEl = document.getElementById('detailModalInternalNotesList');
    var noteInputEl = document.getElementById('orderInternalNoteInput');
    if (noteInputEl) noteInputEl.value = '';
    if (notesListEl) {
      var notes = Array.isArray(o.internal_notes) ? o.internal_notes : [];
      notesListEl.innerHTML = notes.length ? notes.map(function (nt) {
        return '<div class="p-2 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200/70">' +
          '<p class="font-medium">' + escapeHtml(nt.text) + '</p>' +
          '<p class="text-[10px] font-mono mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(nt.author || 'Admin') + ' · ' + escapeHtml(engine.formatDateTime ? engine.formatDateTime(nt.created_at) : engine.formatDate(nt.created_at)) + '</p>' +
        '</div>';
      }).join('') : '<p class="text-[11px] italic" style="color: var(--admin-text-secondary);">Chưa có ghi chú nội bộ cho đơn hàng này.</p>';
    }

    // State Machine Transition Controls
    var allowedNext = engine.getAllowedNextOrderStatuses(curNorm);
    var forwardNext = allowedNext.filter(function (s) { return s !== 'cancelled'; });
    var canCancel = allowedNext.indexOf('cancelled') !== -1;

    var quickActionsEl = document.getElementById('detailModalQuickNextActions');
    if (quickActionsEl) {
      if (forwardNext.length) {
        quickActionsEl.innerHTML = '<span class="text-xs font-bold">Bước kế tiếp:</span>' + forwardNext.map(function (st) {
          return '<button type="button" class="btn-advance-order vlu-btn vlu-btn-primary vlu-btn-sm" data-id="' + escapeHtml(ordCode) + '" data-next="' + escapeHtml(st) + '">→ ' + escapeHtml(engine.getOrderStatusLabel(st)) + '</button>';
        }).join('');
      } else {
        quickActionsEl.innerHTML = '<span class="vlu-badge vlu-badge-neutral">Trạng thái cuối đã khóa — không thể chuyển tiếp hoặc quay lui</span>';
      }
    }

    var statusSelect = document.getElementById('modalOrderStatusSelect');
    var btnSaveStatus = document.getElementById('btnSaveOrderStatus');
    var btnCancelModal = document.getElementById('btnOpenCancelOrderModal');
    if (statusSelect) {
      if (forwardNext.length) {
        statusSelect.innerHTML = forwardNext.map(function (st) {
          return '<option value="' + escapeHtml(st) + '">' + escapeHtml(engine.getOrderStatusLabel(st)) + '</option>';
        }).join('');
        statusSelect.disabled = false;
      } else {
        statusSelect.innerHTML = '<option value="">' + escapeHtml(engine.getOrderStatusLabel(curNorm)) + ' (Đã khóa)</option>';
        statusSelect.disabled = true;
      }
    }
    if (btnSaveStatus) btnSaveStatus.disabled = !forwardNext.length;
    if (btnCancelModal) {
      btnCancelModal.disabled = !canCancel;
      btnCancelModal.classList.toggle('hidden', !canCancel);
    }

    openModal(document.getElementById('orderDetailModal'));
  }

  function openCustomer360Modal(userIdentifier) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var profile = engine.getCustomer360Profile(userIdentifier);
    if (!profile || !profile.user) {
      engine.showToast('Không tìm thấy hồ sơ khách hàng.', true);
      return;
    }

    var u = profile.user;
    var st = profile.stats;
    currentViewingUserId = String(u.id || u.username);
    var isAdmin = Number(u.role) === 1;
    var isLocked = String(u.status || 'active') === 'locked';
    var name = u.fullname || u.username;

    document.getElementById('c360Avatar').textContent = name.charAt(0).toUpperCase();
    document.getElementById('c360Fullname').textContent = name;
    document.getElementById('c360UserCode').textContent = u.user_code || ('#USR-' + u.id);
    document.getElementById('c360RoleBadge').innerHTML = isAdmin ? '<span class="vlu-badge vlu-badge-brand">Admin</span>' : '<span class="vlu-badge vlu-badge-neutral">Khách hàng</span>';
    document.getElementById('c360StatusBadge').innerHTML = isLocked ? '<span class="vlu-badge vlu-badge-locked">Đang khóa</span>' : '<span class="vlu-badge vlu-badge-success">Hoạt động</span>';
    document.getElementById('c360Username').textContent = '@' + u.username;
    document.getElementById('c360Email').textContent = u.email || 'Chưa có email';
    document.getElementById('c360Phone').textContent = u.phone || 'Chưa có SĐT';
    document.getElementById('c360JoinDate').textContent = u.created_at || '--';

    var lockNoticeEl = document.getElementById('c360LockNotice');
    if (lockNoticeEl) {
      if (isLocked) {
        lockNoticeEl.classList.remove('hidden');
        lockNoticeEl.textContent = 'Lý do khóa: ' + (u.lock_reason || 'Tạm khóa bởi quản trị viên');
      } else {
        lockNoticeEl.classList.add('hidden');
      }
    }

    var actionBtnsEl = document.getElementById('c360ActionButtons');
    if (actionBtnsEl) {
      var uKey = String(u.id || u.username);
      actionBtnsEl.innerHTML =
        '<button type="button" class="btn-edit-user vlu-btn vlu-btn-secondary vlu-btn-sm" data-id="' + escapeHtml(uKey) + '">Sửa hồ sơ &amp; Role</button>' +
        '<button type="button" class="btn-toggle-user-lock vlu-btn ' + (isLocked ? 'vlu-btn-navy' : 'vlu-btn-danger') + ' vlu-btn-sm" data-id="' + escapeHtml(uKey) + '"' + (u.is_protected_root ? ' disabled title="Tài khoản Quản trị viên gốc được bảo vệ"' : '') + '>' + (isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản') + '</button>';
    }

    document.getElementById('c360KpiGrid').innerHTML =
      '<div class="vlu-card p-3.5"><p class="text-[11px] font-bold" style="color: var(--admin-text-secondary);">Tổng đơn hợp lệ</p><p class="text-lg font-extrabold mt-1 tabular-nums">' + escapeHtml(st.orderCount) + ' <span class="text-xs font-normal">/ ' + escapeHtml(st.allOrderCount) + ' đơn</span></p></div>' +
      '<div class="vlu-card p-3.5"><p class="text-[11px] font-bold" style="color: var(--admin-text-secondary);">Tổng chi tiêu thực tế</p><p class="text-lg font-extrabold text-brand mt-1 tabular-nums">' + escapeHtml(engine.formatVND(st.totalSpent)) + '</p></div>' +
      '<div class="vlu-card p-3.5"><p class="text-[11px] font-bold" style="color: var(--admin-text-secondary);">Điểm tích lũy</p><p class="text-lg font-extrabold text-indigo-600 mt-1 tabular-nums">' + escapeHtml(st.points) + ' điểm</p></div>' +
      '<div class="vlu-card p-3.5"><p class="text-[11px] font-bold" style="color: var(--admin-text-secondary);">Hạng thành viên</p><div class="mt-1.5">' + getUserTierBadgeHtml(st.tierKey, st.tier) + '</div></div>';

    var addrEl = document.getElementById('c360AddressesList');
    if (addrEl) {
      addrEl.innerHTML = profile.addresses.length ? profile.addresses.map(function (a) {
        return '<div class="p-2.5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200/70">' +
          '<div class="flex items-center justify-between gap-2"><strong class="font-bold">' + escapeHtml(a.recipient) + ' · ' + escapeHtml(a.phone || '--') + '</strong>' +
          '<span class="vlu-badge ' + (a.isDefault ? 'vlu-badge-brand' : 'vlu-badge-neutral') + ' !text-[10px]">' + escapeHtml(a.label) + '</span></div>' +
          '<p class="mt-1" style="color: var(--admin-text-secondary);">' + escapeHtml(a.fullAddress) + '</p>' +
        '</div>';
      }).join('') : '<p class="italic" style="color: var(--admin-text-secondary);">Chưa có địa chỉ giao hàng lưu trên tài khoản.</p>';
    }

    var itemsEl = document.getElementById('c360ItemsList');
    if (itemsEl) {
      itemsEl.innerHTML = profile.purchasedItems.length ? profile.purchasedItems.map(function (it) {
        return '<div class="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200/70">' +
          '<img src="' + escapeHtml(safeImage(it.image)) + '" class="h-9 w-9 rounded-lg object-contain bg-white border border-slate-100 p-0.5 shrink-0" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';">' +
          '<div class="flex-1 min-w-0"><p class="font-bold truncate">' + escapeHtml(it.name) + '</p><p class="text-[10px] font-mono" style="color: var(--admin-text-secondary);">Đơn ' + escapeHtml(formatOrderCode(it.orderId)) + ' · x' + escapeHtml(it.quantity) + ' · ' + escapeHtml(engine.formatVND(it.price)) + '</p></div>' +
        '</div>';
      }).join('') : '<p class="italic" style="color: var(--admin-text-secondary);">Khách hàng chưa có sản phẩm mua thành công.</p>';
    }

    var ordBody = document.getElementById('c360OrdersList');
    if (ordBody) {
      ordBody.innerHTML = profile.orders.length ? profile.orders.map(function (o) {
        var ordCode = formatOrderCode(o.order_code || o.id);
        var paySt = engine.resolveOrderPaymentStatus(o);
        return '<tr class="border-b border-slate-100">' +
          '<td class="py-2 px-3"><button type="button" class="c360-open-order font-mono font-bold text-brand hover:underline" data-id="' + escapeHtml(ordCode) + '">' + escapeHtml(ordCode) + '</button></td>' +
          '<td class="py-2 px-3 font-mono" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDate(o.created_at)) + '</td>' +
          '<td class="py-2 px-3">' + escapeHtml(o.payment_method || 'COD') + '</td>' +
          '<td class="py-2 px-3">' + getPaymentStatusBadgeHtml(paySt) + '</td>' +
          '<td class="py-2 px-3">' + engine.getStatusBadge(o.status) + '</td>' +
          '<td class="py-2 px-3 text-right font-extrabold text-brand tabular-nums">' + escapeHtml(engine.formatVND(o.total)) + '</td>' +
        '</tr>';
      }).join('') : '<tr><td colspan="6" class="py-4 text-center italic" style="color: var(--admin-text-secondary);">Chưa có đơn hàng nào.</td></tr>';
    }

    var revEl = document.getElementById('c360ReviewsList');
    if (revEl) {
      revEl.innerHTML = profile.reviews.length ? profile.reviews.map(function (rv) {
        return '<div class="p-2.5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200/70">' +
          '<div class="flex justify-between font-bold"><span>' + escapeHtml(rv.productName || rv.product_name || 'Sản phẩm') + '</span><span class="text-amber-500">' + escapeHtml(rv.rating || 5) + '★</span></div>' +
          '<p class="mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(rv.comment || rv.content || '') + '</p>' +
        '</div>';
      }).join('') : '<p class="italic" style="color: var(--admin-text-secondary);">Chưa có đánh giá sản phẩm từ khách hàng này.</p>';
    }

    var auditEl = document.getElementById('c360AuditLogsList');
    if (auditEl) {
      auditEl.innerHTML = profile.auditLogs.length ? profile.auditLogs.map(function (lg) {
        return '<div class="p-2.5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200/70">' +
          '<p class="font-bold">' + escapeHtml(lg.detail) + '</p>' +
          '<p class="text-[10px] font-mono mt-0.5" style="color: var(--admin-text-secondary);">' + escapeHtml(lg.actor) + ' · ' + escapeHtml(engine.formatDateTime ? engine.formatDateTime(lg.created_at) : engine.formatDate(lg.created_at)) + '</p>' +
        '</div>';
      }).join('') : '<p class="italic" style="color: var(--admin-text-secondary);">Chưa có thay đổi hồ sơ hoặc khóa tài khoản được ghi nhận.</p>';
    }

    openModal(document.getElementById('customer360Modal'));
  }

  function openEditUserModal(userIdentifier) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var needle = String(userIdentifier || '').trim().toLowerCase();
    var u = engine.getUsers().find(function (item) {
      return String(item.id || '').toLowerCase() === needle || String(item.username || '').toLowerCase() === needle;
    });
    if (!u) return;

    editingUserId = String(u.id || u.username);
    document.getElementById('editUserCodeLabel').textContent = u.user_code || ('@' + u.username);
    document.getElementById('editUserFullname').value = u.fullname || '';
    document.getElementById('editUserEmail').value = u.email || '';
    document.getElementById('editUserPhone').value = u.phone || '';
    var roleSel = document.getElementById('editUserRole');
    var rootHint = document.getElementById('editUserRootHint');
    if (roleSel) {
      roleSel.value = Number(u.role) === 1 ? '1' : '0';
      roleSel.disabled = Boolean(u.is_protected_root);
    }
    if (rootHint) rootHint.classList.toggle('hidden', !u.is_protected_root);

    openModal(document.getElementById('userEditModal'));
  }

  function openLockUserModal(userIdentifier) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var needle = String(userIdentifier || '').trim().toLowerCase();
    var u = engine.getUsers().find(function (item) {
      return String(item.id || '').toLowerCase() === needle || String(item.username || '').toLowerCase() === needle;
    });
    if (!u) return;
    if (u.is_protected_root) {
      engine.showToast('Không thể khóa tài khoản Quản trị viên gốc.', true);
      return;
    }

    var isCurrentlyLocked = String(u.status || 'active') === 'locked';
    pendingLockUserId = String(u.id || u.username);
    document.getElementById('lockModalTitle').textContent = isCurrentlyLocked ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản';
    document.getElementById('lockModalTargetDesc').textContent = isCurrentlyLocked
      ? ('Xác nhận mở khóa cho ' + (u.fullname || u.username) + ' (@' + u.username + ') để khôi phục quyền đăng nhập và đặt hàng.')
      : ('Tạm khóa ' + (u.fullname || u.username) + ' (@' + u.username + '). Tài khoản bị khóa sẽ bị chặn đăng nhập ngay lập tức trên Storefront.');

    var reasonGroup = document.getElementById('lockReasonGroup');
    var reasonInput = document.getElementById('lockUserReasonInput');
    var btnConfirm = document.getElementById('btnConfirmUserLock');
    if (reasonGroup) reasonGroup.classList.toggle('hidden', isCurrentlyLocked);
    if (reasonInput) reasonInput.value = '';
    if (btnConfirm) {
      btnConfirm.textContent = isCurrentlyLocked ? 'Xác nhận mở khóa' : 'Xác nhận khóa';
      btnConfirm.className = 'vlu-btn vlu-btn-sm ' + (isCurrentlyLocked ? 'vlu-btn-navy' : 'vlu-btn-danger');
    }

    openModal(document.getElementById('userLockModal'));
  }

  function syncInvMovementTypeUI() {
    var typeSel = document.getElementById('invMvTypeSelect');
    var lblEl = document.getElementById('invMvQtyLabel');
    var reasonEl = document.getElementById('invMvReasonInput');
    if (!typeSel) return;
    var t = typeSel.value || 'inbound';
    if (lblEl) {
      lblEl.innerHTML = (t === 'inbound' ? 'Số lượng nhập' : (t === 'outbound' ? 'Số lượng xuất' : 'Tồn kho thực tế sau kiểm kê')) + ' <span class="text-red-500">*</span>';
    }
    if (reasonEl && !reasonEl.value.trim()) {
      reasonEl.placeholder = t === 'inbound' ? 'VD: Nhập lô hàng mới từ nhà cung cấp' : (t === 'outbound' ? 'VD: Xuất bán / Xuất chuyển kho' : 'VD: Kiểm kê thực tế cuối kỳ');
    }
  }

  function syncInvMovementProductVariants(productId) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var p = engine.getProducts().find(function (item) { return String(item.id) === String(productId); });
    var colSel = document.getElementById('invMvColorSelect');
    var varSel = document.getElementById('invMvVariantSelect');
    var infoEl = document.getElementById('invMvCurrentStockInfo');
    var qtyEl = document.getElementById('invMvQtyInput');
    var typeSel = document.getElementById('invMvTypeSelect');

    if (colSel) {
      var colors = p && Array.isArray(p.colors) ? p.colors : [];
      colSel.innerHTML = '<option value="all">Tất cả màu sắc</option>' + colors.map(function (c) {
        var cname = c.name || c.key || 'Mặc định';
        return '<option value="' + escapeHtml(cname) + '">' + escapeHtml(cname) + (c.stock !== undefined && c.stock !== '' ? (' (Tồn: ' + c.stock + ')') : '') + '</option>';
      }).join('');
    }
    if (varSel) {
      var variants = p && Array.isArray(p.variants) ? p.variants : [];
      varSel.innerHTML = '<option value="all">Tất cả phiên bản</option>' + variants.map(function (v) {
        return '<option value="' + escapeHtml(v.label) + '">' + escapeHtml(v.label) + (v.stock !== undefined && v.stock !== '' ? (' (Tồn: ' + v.stock + ')') : '') + '</option>';
      }).join('');
    }
    if (infoEl) {
      infoEl.textContent = (p ? (Number(p.stock) || 0) : 0) + ' sản phẩm';
    }
    if (qtyEl && typeSel && typeSel.value === 'adjustment' && p) {
      qtyEl.value = Number(p.stock) || 0;
    }
  }

  function openInventoryMovementModal(productId, mvType) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var products = engine.getProducts();
    var prodSel = document.getElementById('invMvProductSelect');
    var typeSel = document.getElementById('invMvTypeSelect');
    var qtyEl = document.getElementById('invMvQtyInput');
    var reasonEl = document.getElementById('invMvReasonInput');
    var noteEl = document.getElementById('invMvNoteInput');

    if (prodSel) {
      prodSel.innerHTML = products.map(function (p) {
        return '<option value="' + escapeHtml(p.id) + '">' + escapeHtml((p.sku || p.id) + ' — ' + p.name + ' (Tồn: ' + (Number(p.stock) || 0) + ')') + '</option>';
      }).join('');
      if (productId) prodSel.value = String(productId);
    }
    if (typeSel) typeSel.value = mvType || 'inbound';
    if (reasonEl) reasonEl.value = '';
    if (noteEl) noteEl.value = '';
    if (qtyEl) qtyEl.value = mvType === 'adjustment' ? '0' : '10';

    syncInvMovementTypeUI();
    syncInvMovementProductVariants(prodSel ? prodSel.value : productId);
    openModal(document.getElementById('inventoryMovementModal'));
  }

  function openVoucherModal(voucherId) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var brands = engine.getBrands();
    var cats = engine.getProductCategories();
    var brandSel = document.getElementById('vchInputBrandFilter');
    var catSel = document.getElementById('vchInputCategoryFilter');
    if (brandSel) {
      brandSel.innerHTML = '<option value="all">Tất cả thương hiệu</option>' + brands.map(function (b) {
        return '<option value="' + escapeHtml(b.name) + '">' + escapeHtml(b.name) + '</option>';
      }).join('');
    }
    if (catSel) {
      catSel.innerHTML = '<option value="all">Tất cả danh mục</option>' + cats.map(function (c) {
        return '<option value="' + escapeHtml(c.slug) + '">' + escapeHtml(c.name) + '</option>';
      }).join('');
    }

    var existing = voucherId ? engine.getVouchers().find(function (v) { return String(v.id) === String(voucherId); }) : null;
    editingVoucherId = existing ? String(existing.id) : null;

    document.getElementById('voucherModalTitle').textContent = existing ? ('Cập nhật Voucher ' + existing.code) : 'Thêm Voucher mới';
    document.getElementById('vchInputCode').value = existing ? existing.code : '';
    document.getElementById('vchInputLabel').value = existing ? existing.label : '';
    document.getElementById('vchInputType').value = existing ? (existing.type || 'fixed') : 'fixed';
    document.getElementById('vchInputValue').value = existing ? (Number(existing.value) || 0) : 500000;
    document.getElementById('vchInputMaxDiscount').value = existing ? (Number(existing.maxDiscount) || 0) : 0;
    document.getElementById('vchInputMinOrder').value = existing ? (Number(existing.minOrder) || 0) : 1000000;
    document.getElementById('vchInputBrandFilter').value = existing ? (existing.brandFilter || 'all') : 'all';
    document.getElementById('vchInputCategoryFilter').value = existing ? (existing.categoryFilter || 'all') : 'all';
    document.getElementById('vchInputUsageLimit').value = existing ? (Number(existing.usageLimit) || 0) : 0;
    document.getElementById('vchInputExpiresAt').value = existing ? (existing.expiresAt || '2026-12-31') : '2026-12-31';
    document.getElementById('vchInputStatus').value = existing ? (existing.status || 'active') : 'active';

    var vType = document.getElementById('vchInputType').value;
    document.getElementById('vchInputValue').disabled = vType === 'freeship';
    document.getElementById('vchInputMaxDiscount').disabled = vType !== 'percent';

    openModal(document.getElementById('voucherModal'));
  }

  function openPromotionModal(campaignId) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var existing = campaignId ? engine.getPromotions().find(function (c) { return String(c.id) === String(campaignId); }) : null;
    editingPromotionId = existing ? String(existing.id) : null;

    document.getElementById('promoModalTitle').textContent = existing ? ('Chỉnh sửa: ' + existing.name) : 'Tạo Chiến dịch Khuyến mãi';
    document.getElementById('promoInputName').value = existing ? existing.name : '';
    document.getElementById('promoInputBadge').value = existing ? (existing.badge || 'FLASH SALE') : 'FLASH SALE';
    document.getElementById('promoInputDiscountType').value = existing ? (existing.discountType || 'percent') : 'percent';
    document.getElementById('promoInputDiscountValue').value = existing ? (Number(existing.discountValue) || 10) : 10;
    document.getElementById('promoInputStartAt').value = existing ? (existing.startAt || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10);
    document.getElementById('promoInputEndAt').value = existing ? (existing.endAt || '2026-12-31') : '2026-12-31';
    document.getElementById('promoInputStatus').value = existing ? (existing.status || 'active') : 'active';

    var searchBox = document.getElementById('promoProductSearchInModal');
    if (searchBox) searchBox.value = '';
    var selectedMap = {};
    if (existing && Array.isArray(existing.productIds)) {
      existing.productIds.forEach(function (id) { selectedMap[String(id)] = true; });
    }

    var listWrap = document.getElementById('promoProductCheckboxList');
    if (listWrap) {
      listWrap.innerHTML = engine.getProducts().map(function (p) {
        var pid = String(p.id);
        var checked = selectedMap[pid] ? ' checked' : '';
        return '<label data-pname="' + escapeHtml(engine.normalizeText(p.name + ' ' + p.brand + ' ' + (p.sku || ''))) + '" class="flex items-center gap-2 p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">' +
          '<input type="checkbox" value="' + escapeHtml(pid) + '"' + checked + ' class="accent-brand shrink-0">' +
          '<span class="truncate font-semibold">' + escapeHtml(p.name) + '</span>' +
          '<span class="ml-auto text-[10px] font-mono text-brand shrink-0">' + escapeHtml(engine.formatVND(p.price)) + '</span>' +
        '</label>';
      }).join('');
    }

    openModal(document.getElementById('promotionModal'));
  }

  function openReplyReviewQaModal(kind, uid) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var items = kind === 'qa' ? engine.getAllProductQAs() : engine.getAllProductReviews();
    var target = items.find(function (it) { return it.uid === uid; });
    if (!target) return;

    pendingReplyTarget = { kind: kind, uid: uid };
    document.getElementById('replyModalTitle').textContent = kind === 'qa' ? 'Trả lời Câu hỏi Q&A' : 'Phản hồi Đánh giá khách hàng';
    document.getElementById('replyModalTargetPreview').innerHTML =
      '<p class="font-bold">' + escapeHtml(target.productName) + ' · ' + escapeHtml(target.authorName) + '</p>' +
      '<p class="mt-1 italic" style="color: var(--admin-text-secondary);">"' + escapeHtml(kind === 'qa' ? target.question : target.comment) + '"</p>';
    var existingReply = kind === 'qa' ? (target.answer && target.answer.text) : (target.adminReply && target.adminReply.text);
    document.getElementById('replyModalTextarea').value = existingReply || '';
    openModal(document.getElementById('reviewQaReplyModal'));
  }

  function openReturnTicketModal(uid) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var existing = uid ? engine.getAllReturnWarrantyTickets().find(function (t) { return t.uid === uid; }) : null;
    editingReturnUid = existing ? existing.uid : null;

    document.getElementById('returnModalTitle').textContent = existing ? ('Xử lý phiếu ' + existing.id) : 'Tiếp nhận Phiếu Đổi trả / Bảo hành';
    document.getElementById('retInputType').value = existing ? (existing.type || 'warranty') : 'warranty';
    document.getElementById('retInputOrderId').value = existing ? (existing.orderId || '') : '';
    document.getElementById('retInputCustomerName').value = existing ? (existing.customerName || '') : '';
    document.getElementById('retInputSubject').value = existing ? (existing.subject || '') : '';
    document.getElementById('retInputMessage').value = existing ? (existing.message || '') : '';
    document.getElementById('retInputRefundAmount').value = existing ? (Number(existing.amount || existing.refundAmount) || 0) : 0;
    document.getElementById('retInputStatus').value = existing ? (existing.status || 'Đã tiếp nhận') : 'Đã tiếp nhận';
    document.getElementById('retInputAdminNote').value = existing ? (existing.adminNote || '') : '';

    ['retInputType', 'retInputOrderId', 'retInputCustomerName', 'retInputSubject', 'retInputMessage'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.disabled = Boolean(existing);
    });
    var statusGrp = document.getElementById('retStatusGroup');
    if (statusGrp) statusGrp.classList.toggle('hidden', !existing);

    openModal(document.getElementById('returnTicketModal'));
  }

  function openMemberPointsModal(userIdentifier) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var needle = String(userIdentifier || '').trim().toLowerCase();
    var m = engine.getMemberInsights().find(function (item) {
      return String(item.id || '').toLowerCase() === needle || String(item.username || '').toLowerCase() === needle;
    });
    if (!m) return;

    pendingPointsUserId = String(m.id || m.username);
    document.getElementById('ptsModalMemberName').textContent = (m.fullname || m.username) + ' (' + (m.email || m.username) + ')';
    document.getElementById('ptsModalCurrentInfo').innerHTML =
      '<span>Hạng: <strong>' + escapeHtml(m.tier) + '</strong></span>' +
      '<span class="text-indigo-600 text-sm">' + escapeHtml(m.points) + ' điểm hiện tại</span>';
    document.getElementById('ptsInputDelta').value = '100';
    document.getElementById('ptsInputReason').value = '';

    var ledger = engine.getMemberPointHistory(pendingPointsUserId);
    var listEl = document.getElementById('ptsModalLedgerList');
    if (listEl) {
      listEl.innerHTML = ledger.length ? ledger.slice(0, 15).map(function (pl) {
        var pos = Number(pl.points) >= 0;
        return '<div class="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-100">' +
          '<div><p class="font-semibold">' + escapeHtml(pl.description) + '</p><p class="text-[10px] font-mono" style="color: var(--admin-text-secondary);">' + escapeHtml(engine.formatDate(pl.createdAt)) + '</p></div>' +
          '<strong class="font-extrabold tabular-nums ' + (pos ? 'text-emerald-600' : 'text-red-600') + '">' + (pos ? '+' : '') + escapeHtml(pl.points) + '</strong>' +
        '</div>';
      }).join('') : '<p class="italic text-slate-400">Chưa có giao dịch điểm nào được ghi nhận.</p>';
    }

    openModal(document.getElementById('memberPointsModal'));
  }

  function openSendNotificationModal() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var targetSel = document.getElementById('notifSendTarget');
    if (targetSel) {
      var customers = engine.getUsers().filter(function (u) { return Number(u.role) !== 1; });
      targetSel.innerHTML = '<option value="all">Tất cả khách hàng thành viên (' + customers.length + ')</option>' +
        customers.map(function (u) {
          var key = String(u.username || u.email || u.id);
          return '<option value="' + escapeHtml(key) + '">' + escapeHtml((u.fullname || u.username) + ' (' + (u.email || u.username) + ')') + '</option>';
        }).join('');
    }
    var titleEl = document.getElementById('notifSendTitle');
    var msgEl = document.getElementById('notifSendMessage');
    if (titleEl) titleEl.value = '';
    if (msgEl) msgEl.value = '';
    openModal(document.getElementById('sendNotificationModal'));
  }

  function closeAllModals(force) {
    var prodModal = document.getElementById('productModal');
    if (!force && prodModal && !prodModal.classList.contains('hidden') && productFormDirty) {
      requestCloseProductModal();
      return;
    }
    document.querySelectorAll('.admin-modal').forEach(function (m) {
      m.classList.add('hidden');
      m.classList.remove('flex');
    });
    document.body.classList.remove('overflow-hidden');
    document.body.style.overflow = '';
    if (document.documentElement) {
      document.documentElement.classList.remove('overflow-hidden');
      document.documentElement.style.overflow = '';
    }
    editingProductId = null;
    editingCategoryId = null;
    editingBrandId = null;
    currentViewingOrderId = null;
    pendingCancelOrderId = null;
    currentViewingUserId = null;
    editingUserId = null;
    pendingLockUserId = null;
    editingVoucherId = null;
    editingPromotionId = null;
    pendingReplyTarget = null;
    editingReturnUid = null;
    pendingPointsUserId = null;
    currentPreviewProductId = null;
    confirmModalCallback = null;
    markProductFormDirty(false);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var confirmModal = document.getElementById('adminConfirmModal');
      if (confirmModal && !confirmModal.classList.contains('hidden')) {
        closeConfirmModal();
        return;
      }
      var subOrder = [
        'orderCancelReasonModal', 'userLockModal', 'userEditModal',
        'inventoryMovementModal', 'voucherModal', 'promotionModal',
        'reviewQaReplyModal', 'returnTicketModal', 'memberPointsModal', 'sendNotificationModal'
      ];
      for (var i = 0; i < subOrder.length; i++) {
        var subEl = document.getElementById(subOrder[i]);
        if (subEl && !subEl.classList.contains('hidden')) {
          closeModalById(subOrder[i]);
          return;
        }
      }
      var prodModal = document.getElementById('productModal');
      if (prodModal && !prodModal.classList.contains('hidden') && productFormDirty) {
        requestCloseProductModal();
        return;
      }
      closeAllModals(true);
      closeHeaderPopovers();
      document.body.classList.remove('admin-sidebar-mobile-open');
    }
  });

  // Back-button Guard: Chặn quay lại admin.html từ bfcache sau khi đã đăng xuất hoặc mất quyền Admin
  window.addEventListener('pageshow', function (event) {
    var navEntries = (window.performance && typeof window.performance.getEntriesByType === 'function')
      ? window.performance.getEntriesByType('navigation')
      : [];
    var isBackForward = Boolean(event && event.persisted) ||
      (navEntries && navEntries[0] && navEntries[0].type === 'back_forward');
    if (!isBackForward) return;

    var rawUser = null;
    try { rawUser = localStorage.getItem('vlu_user'); } catch (e) {}
    var auth = (window.VLU_ADMIN && typeof window.VLU_ADMIN.checkAuth === 'function')
      ? window.VLU_ADMIN.checkAuth()
      : { isAuthorized: false };

    if (!rawUser || !auth.isAuthorized) {
      if (window.location && typeof window.location.replace === 'function') {
        window.location.replace('index.html');
      } else if (window.location) {
        window.location.href = 'index.html';
      }
    }
  });

})(window, document);
