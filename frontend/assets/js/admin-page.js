/**
 * VLU FLAGSHIP STORE – Admin Page Interactions 2026
 * Điều khiển giao diện quản trị: Tab Router, Bảng sản phẩm, Bảng đơn hàng, Bảng danh mục, Modal CRUD & Phân quyền
 */
(function (window, document) {
  'use strict';

  var currentTab = 'dashboard';
  var editingProductId = null;
  var editingCategoryId = null;
  var currentViewingOrderId = null;

  function initAdmin() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    // 1. KIỂM TRA PHÂN QUYỀN TRUY CẬP (ROLE = 1)
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
    }

    // Nút đăng nhập nhanh quyền Admin ngay trên Gate
    var btnQuickAdmin = document.getElementById('btnQuickAdminLogin');
    if (btnQuickAdmin) {
      btnQuickAdmin.addEventListener('click', function () {
        engine.quickLoginAdmin();
        if (gate) gate.classList.add('hidden');
        if (adminLayout) adminLayout.classList.remove('blur-sm', 'pointer-events-none');
        var newAuth = engine.checkAuth();
        updateAdminProfile(newAuth.user);
        engine.showToast('Chào mừng Quản trị viên VLU! Đã mở khóa bảng điều khiển.');
        renderCurrentTab();
      });
    }

    // 2. KHỞI TẠO TAB ROUTER
    initTabRouter();

    // 3. KHỞI TẠO CÁC BẢNG DỮ LIỆU & MODAL
    renderDashboard();
    renderProducts();
    renderCategories();
    renderOrders();
    renderUsers();

    // 4. LẮNG NGHE SỰ KIỆN CẬP NHẬT
    window.addEventListener('vlu:admin-updated', function () {
      renderCurrentTab();
    });

    window.addEventListener('storage', function (e) {
      if (e.key === 'vlu_orders' || e.key === 'vlu_admin_products' || e.key === 'vlu_user') {
        renderCurrentTab();
      }
    });

    // 5. NÚT ĐĂNG XUẤT ADMIN
    var btnLogout = document.getElementById('adminLogoutBtn');
    if (btnLogout) {
      btnLogout.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.VLU_AUTH) window.VLU_AUTH.logout();
        else localStorage.removeItem('vlu_user');
        window.location.href = 'login.html';
      });
    }

    // 6. NÚT KHÔI PHỤC DỮ LIỆU MẪU SẢN PHẨM
    var btnResetProducts = document.getElementById('btnResetProducts');
    if (btnResetProducts) {
      btnResetProducts.addEventListener('click', function () {
        if (confirm('Khôi phục danh sách sản phẩm về bộ dữ liệu flagship mặc định của VLU Store?')) {
          engine.resetProducts();
          engine.showToast('Đã khôi phục toàn bộ sản phẩm mặc định!');
        }
      });
    }
  }

  function updateAdminProfile(user) {
    if (!user) return;
    var nameEl = document.getElementById('sidebarAdminName');
    var emailEl = document.getElementById('sidebarAdminEmail');
    var topAdminName = document.getElementById('topAdminName');
    var avatarEl = document.getElementById('sidebarAdminAvatar');

    var displayName = user.fullname || user.username || 'Quản trị viên';
    if (nameEl) nameEl.textContent = displayName;
    if (topAdminName) topAdminName.textContent = displayName;
    if (emailEl) emailEl.textContent = user.email || 'admin@vlu.edu.vn';
    if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
  }

  /* ==========================================================================
     TAB ROUTER
     ========================================================================== */
  function initTabRouter() {
    var navItems = document.querySelectorAll('[data-tab-target]');
    navItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab-target');
        switchTab(target);
      });
    });
  }

  function switchTab(tabId) {
    currentTab = tabId;

    // Cập nhật giao diện menu sidebar
    var navItems = document.querySelectorAll('[data-tab-target]');
    navItems.forEach(function (btn) {
      var target = btn.getAttribute('data-tab-target');
      if (target === tabId) {
        btn.classList.add('bg-brand', 'text-white', 'shadow-md', 'shadow-brand/20');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-brand', 'text-white', 'shadow-md', 'shadow-brand/20');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    // Ẩn tất cả panels và hiện panel mục tiêu
    var panels = document.querySelectorAll('.admin-tab-panel');
    panels.forEach(function (p) {
      p.classList.add('hidden');
    });

    var activePanel = document.getElementById('tabPanel-' + tabId);
    if (activePanel) {
      activePanel.classList.remove('hidden');
      activePanel.classList.add('animate-fade-in');
    }

    // Cập nhật Breadcrumb & Tiêu đề Topbar
    var topTitle = document.getElementById('topbarPageTitle');
    var topCrumb = document.getElementById('topbarBreadcrumb');
    var titles = {
      'dashboard': 'Tổng quan hệ thống (Dashboard)',
      'products': 'Quản lý Sản phẩm (Products)',
      'categories': 'Quản lý Danh mục (Categories)',
      'orders': 'Quản lý Đơn hàng (Orders)',
      'users': 'Quản lý Tài khoản (Users)'
    };
    if (topTitle && titles[tabId]) topTitle.textContent = titles[tabId];
    if (topCrumb && titles[tabId]) topCrumb.textContent = titles[tabId];

    renderCurrentTab();
  }

  function renderCurrentTab() {
    switch (currentTab) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'products':
        renderProducts();
        break;
      case 'categories':
        renderCategories();
        break;
      case 'orders':
        renderOrders();
        break;
      case 'users':
        renderUsers();
        break;
    }
  }

  /* ==========================================================================
     1. RENDER DASHBOARD (TỔNG QUAN)
     ========================================================================== */
  function renderDashboard() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    var stats = engine.calculateStats();

    // 4 Thẻ Thống kê nhanh
    var revEl = document.getElementById('statTotalRevenue');
    var ordEl = document.getElementById('statTotalOrders');
    var prodEl = document.getElementById('statTotalProducts');
    var userEl = document.getElementById('statTotalUsers');
    var pendOrdEl = document.getElementById('statPendingOrders');

    if (revEl) revEl.textContent = engine.formatVND(stats.totalRevenue);
    if (ordEl) ordEl.textContent = stats.orderCount + ' đơn';
    if (prodEl) prodEl.textContent = stats.productCount + ' thiết bị';
    if (userEl) userEl.textContent = stats.userCount + ' tài khoản';
    if (pendOrdEl) pendOrdEl.textContent = stats.pendingOrders + ' đơn chờ xử lý';

    // Cập nhật badge số đơn chờ trên sidebar
    var sidebarBadge = document.getElementById('sidebarOrderPendingBadge');
    if (sidebarBadge) {
      if (stats.pendingOrders > 0) {
        sidebarBadge.textContent = stats.pendingOrders;
        sidebarBadge.classList.remove('hidden');
      } else {
        sidebarBadge.classList.add('hidden');
      }
    }

    // Bảng đơn hàng mới nhất trên Dashboard
    var recentTbody = document.getElementById('dashboardRecentOrdersBody');
    if (recentTbody) {
      var orders = engine.getOrders().slice(0, 4);
      if (orders.length === 0) {
        recentTbody.innerHTML = '<tr><td colspan="5" class="py-6 text-center text-xs text-slate-400">Chưa có đơn hàng nào.</td></tr>';
      } else {
        var html = '';
        orders.forEach(function (o) {
          html += '<tr class="border-b border-slate-100 hover:bg-slate-50/70 transition">';
          html += '  <td class="py-3 px-4 font-bold text-xs text-slate-900">' + o.id + '</td>';
          html += '  <td class="py-3 px-4 text-xs font-semibold text-slate-800">' + o.customer_name + '</td>';
          html += '  <td class="py-3 px-4 text-xs font-black text-brand">' + engine.formatVND(o.total) + '</td>';
          html += '  <td class="py-3 px-4 text-xs">' + engine.getStatusBadge(o.status) + '</td>';
          html += '  <td class="py-3 px-4 text-xs text-right">';
          html += '    <button type="button" class="btn-view-order rounded-lg px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-brand hover:bg-brand-soft transition" data-id="' + o.id + '">Xem</button>';
          html += '  </td>';
          html += '</tr>';
        });
        recentTbody.innerHTML = html;
      }
    }

    // Biểu đồ thanh cơ cấu hãng
    renderBrandBreakdown();
  }

  function renderBrandBreakdown() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var container = document.getElementById('brandBreakdownContainer');
    if (!container) return;

    var products = engine.getProducts();
    var counts = {};
    products.forEach(function (p) {
      var cat = p.category_name || 'Khác';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    var total = products.length || 1;
    var html = '';
    var colors = ['bg-brand', 'bg-blue-600', 'bg-amber-500', 'bg-emerald-500', 'bg-indigo-600', 'bg-purple-600'];
    var idx = 0;

    for (var brand in counts) {
      var count = counts[brand];
      var pct = Math.round((count / total) * 100);
      var c = colors[idx % colors.length];
      idx++;

      html += '<div class="space-y-1">';
      html += '  <div class="flex justify-between items-center text-xs">';
      html += '    <span class="font-bold text-slate-800">' + brand + '</span>';
      html += '    <span class="text-slate-500 font-semibold">' + count + ' máy (' + pct + '%)</span>';
      html += '  </div>';
      html += '  <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">';
      html += '    <div class="h-full rounded-full ' + c + ' transition-all duration-500" style="width: ' + pct + '%"></div>';
      html += '  </div>';
      html += '</div>';
    }

    container.innerHTML = html;
  }

  /* ==========================================================================
     2. RENDER SẢN PHẨM (PRODUCTS CRUD)
     ========================================================================== */
  function renderProducts() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    var products = engine.getProducts();
    var tbody = document.getElementById('productsTableBody');
    var countBadge = document.getElementById('productsCountBadge');
    var searchInput = document.getElementById('productSearchInput');
    var catFilter = document.getElementById('productCategoryFilter');

    if (countBadge) countBadge.textContent = products.length + ' sản phẩm';

    // Cập nhật bộ chọn Category trong Filter & Modal
    populateCategorySelects();

    // Lọc theo tìm kiếm và danh mục
    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var selectedCat = catFilter ? catFilter.value : 'all';

    var filtered = products.filter(function (p) {
      var matchName = !query || p.name.toLowerCase().indexOf(query) !== -1 || (p.id + '').indexOf(query) !== -1;
      var matchCat = selectedCat === 'all' || (p.category_id + '') === selectedCat || (p.category_name && p.category_name.toLowerCase() === selectedCat.toLowerCase());
      return matchName && matchCat;
    });

    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="py-10 text-center text-xs text-slate-400">Không tìm thấy sản phẩm nào khớp với tìm kiếm.</td></tr>';
      return;
    }

    var html = '';
    filtered.forEach(function (p) {
      html += '<tr class="border-b border-slate-100 hover:bg-slate-50/70 transition" data-id="' + p.id + '">';
      html += '  <td class="py-3 px-4 text-xs font-mono font-bold text-slate-400">#' + p.id + '</td>';
      html += '  <td class="py-3 px-4">';
      html += '    <div class="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center">';
      html += '      <img src="' + (p.image || 'frontend/assets/images/logo.png') + '" alt="' + p.name + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'image_2c97c5.png\';">';
      html += '    </div>';
      html += '  </td>';
      html += '  <td class="py-3 px-4 min-w-[200px]">';
      html += '    <a href="product-detail.html?id=' + encodeURIComponent(p.name) + '" target="_blank" class="text-xs font-bold text-slate-900 hover:text-brand transition line-clamp-1" title="' + p.name + '">' + p.name + '</a>';
      if (p.description) {
        html += '    <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">' + p.description + '</p>';
      }
      html += '  </td>';
      html += '  <td class="py-3 px-4 text-xs font-semibold text-slate-600">' + (p.category_name || 'Khác') + '</td>';
      html += '  <td class="py-3 px-4 whitespace-nowrap">';
      html += '    <span class="text-xs font-black text-brand">' + engine.formatVND(p.price) + '</span>';
      if (p.old_price && p.old_price > p.price) {
        html += '    <span class="block text-[10px] text-slate-400 line-through">' + engine.formatVND(p.old_price) + '</span>';
      }
      html += '  </td>';
      html += '  <td class="py-3 px-4 text-xs">';
      html += '    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-extrabold border border-emerald-200/80">Còn hàng (' + (p.stock || 50) + ')</span>';
      html += '  </td>';
      html += '  <td class="py-3 px-4 text-right whitespace-nowrap">';
      html += '    <div class="inline-flex items-center gap-1.5">';
      html += '      <button type="button" class="btn-edit-product p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition" data-id="' + p.id + '" title="Sửa sản phẩm">';
      html += '        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg>';
      html += '      </button>';
      html += '      <button type="button" class="btn-delete-product p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-id="' + p.id + '" title="Xóa sản phẩm">';
      html += '        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>';
      html += '      </button>';
      html += '    </div>';
      html += '  </td>';
      html += '</tr>';
    });

    tbody.innerHTML = html;
  }

  function populateCategorySelects() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var cats = engine.getCategories();

    var filterSelect = document.getElementById('productCategoryFilter');
    if (filterSelect && filterSelect.options.length <= 1) {
      cats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        filterSelect.appendChild(opt);
      });
    }

    var formSelect = document.getElementById('prodModalCategory');
    if (formSelect) {
      var currentVal = formSelect.value;
      formSelect.innerHTML = '';
      cats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        formSelect.appendChild(opt);
      });
      if (currentVal) formSelect.value = currentVal;
    }
  }

  /* ==========================================================================
     3. RENDER DANH MỤC (CATEGORIES CRUD)
     ========================================================================== */
  function renderCategories() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    var cats = engine.getCategories();
    var products = engine.getProducts();
    var tbody = document.getElementById('categoriesTableBody');
    var countBadge = document.getElementById('categoriesCountBadge');

    if (countBadge) countBadge.textContent = cats.length + ' danh mục';
    if (!tbody) return;

    var html = '';
    cats.forEach(function (c) {
      // Đếm số sản phẩm thuộc danh mục này
      var pCount = products.filter(function (p) {
        return parseInt(p.category_id, 10) === c.id || (p.category_name && p.category_name.toLowerCase() === c.name.toLowerCase());
      }).length;

      html += '<tr class="border-b border-slate-100 hover:bg-slate-50/70 transition" data-id="' + c.id + '">';
      html += '  <td class="py-3.5 px-4 text-xs font-mono font-bold text-slate-400">#' + c.id + '</td>';
      html += '  <td class="py-3.5 px-4">';
      html += '    <div class="flex items-center gap-2.5">';
      html += '      <span class="text-lg">' + (c.icon || '📦') + '</span>';
      html += '      <div>';
      html += '        <h4 class="text-xs font-bold text-slate-900">' + c.name + '</h4>';
      html += '        <p class="text-[10px] text-slate-400 font-mono">slug: ' + (c.slug || '') + '</p>';
      html += '      </div>';
      html += '    </div>';
      html += '  </td>';
      html += '  <td class="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">' + (c.description || '--') + '</td>';
      html += '  <td class="py-3.5 px-4 text-xs">';
      html += '    <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">' + pCount + ' sản phẩm</span>';
      html += '  </td>';
      html += '  <td class="py-3.5 px-4 text-right whitespace-nowrap">';
      html += '    <div class="inline-flex items-center gap-1.5">';
      html += '      <button type="button" class="btn-edit-category p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft transition" data-id="' + c.id + '" title="Sửa danh mục">';
      html += '        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg>';
      html += '      </button>';
      html += '      <button type="button" class="btn-delete-category p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-id="' + c.id + '" title="Xóa danh mục">';
      html += '        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>';
      html += '      </button>';
      html += '    </div>';
      html += '  </td>';
      html += '</tr>';
    });

    tbody.innerHTML = html;
  }

  /* ==========================================================================
     4. RENDER ĐƠN HÀNG (ORDERS & STATUS TRANSITION)
     ========================================================================== */
  var orderFilterStatus = 'all';

  function renderOrders() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    var orders = engine.getOrders();
    var tbody = document.getElementById('ordersTableBody');
    var countBadge = document.getElementById('ordersCountBadge');
    var searchInput = document.getElementById('orderSearchInput');

    if (countBadge) countBadge.textContent = orders.length + ' đơn hàng';
    if (!tbody) return;

    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    var filtered = orders.filter(function (o) {
      var matchStatus = orderFilterStatus === 'all' || o.status === orderFilterStatus;
      var matchQuery = !query ||
        o.id.toLowerCase().indexOf(query) !== -1 ||
        (o.customer_name && o.customer_name.toLowerCase().indexOf(query) !== -1) ||
        (o.customer_phone && o.customer_phone.indexOf(query) !== -1);
      return matchStatus && matchQuery;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="py-10 text-center text-xs text-slate-400">Không có đơn hàng nào khớp với bộ lọc.</td></tr>';
      return;
    }

    var html = '';
    filtered.forEach(function (o) {
      html += '<tr class="border-b border-slate-100 hover:bg-slate-50/70 transition" data-id="' + o.id + '">';
      html += '  <td class="py-3 px-4 font-mono font-bold text-xs text-slate-900">' + o.id + '</td>';
      html += '  <td class="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">' + engine.formatDate(o.created_at) + '</td>';
      html += '  <td class="py-3 px-4">';
      html += '    <p class="text-xs font-bold text-slate-900">' + o.customer_name + '</p>';
      html += '    <p class="text-[11px] text-slate-500 font-mono">' + o.customer_phone + '</p>';
      html += '  </td>';
      html += '  <td class="py-3 px-4 text-xs text-slate-600 max-w-xs truncate" title="' + (o.customer_address || '') + '">' + (o.customer_address || '--') + '</td>';
      html += '  <td class="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">' + (o.payment_method || 'COD') + '</td>';
      html += '  <td class="py-3 px-4 text-xs font-black text-brand whitespace-nowrap">' + engine.formatVND(o.total) + '</td>';
      html += '  <td class="py-3 px-4 whitespace-nowrap">';
      // Quick Status Dropdown trực tiếp trên dòng
      html += '    <select class="order-status-quick-select text-xs font-bold rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-brand focus:outline-none" data-id="' + o.id + '">';
      html += '      <option value="pending"' + (o.status === 'pending' ? ' selected' : '') + '>Chờ xử lý</option>';
      html += '      <option value="shipping"' + (o.status === 'shipping' ? ' selected' : '') + '>Đang giao</option>';
      html += '      <option value="completed"' + (o.status === 'completed' ? ' selected' : '') + '>Hoàn thành</option>';
      html += '      <option value="cancelled"' + (o.status === 'cancelled' ? ' selected' : '') + '>Đã hủy</option>';
      html += '    </select>';
      html += '  </td>';
      html += '  <td class="py-3 px-4 text-right whitespace-nowrap">';
      html += '    <div class="inline-flex items-center gap-1.5">';
      html += '      <button type="button" class="btn-view-order p-1.5 rounded-lg text-slate-600 hover:text-brand hover:bg-brand-soft transition" data-id="' + o.id + '" title="Xem chi tiết đơn">';
      html += '        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>';
      html += '      </button>';
      html += '      <button type="button" class="btn-delete-order p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" data-id="' + o.id + '" title="Xóa đơn">';
      html += '        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
      html += '      </button>';
      html += '    </div>';
      html += '  </td>';
      html += '</tr>';
    });

    tbody.innerHTML = html;
  }

  /* ==========================================================================
     5. RENDER TÀI KHOẢN (USERS)
     ========================================================================== */
  function renderUsers() {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    var users = engine.getUsers();
    var tbody = document.getElementById('usersTableBody');
    var countBadge = document.getElementById('usersCountBadge');

    if (countBadge) countBadge.textContent = users.length + ' thành viên';
    if (!tbody) return;

    var html = '';
    users.forEach(function (u) {
      var isAdmin = u.role === 1;
      html += '<tr class="border-b border-slate-100 hover:bg-slate-50/70 transition">';
      html += '  <td class="py-3 px-4 text-xs font-mono font-bold text-slate-400">#' + u.id + '</td>';
      html += '  <td class="py-3 px-4">';
      html += '    <div class="flex items-center gap-2.5">';
      html += '      <span class="grid h-8 w-8 place-items-center rounded-full ' + (isAdmin ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700') + ' text-xs font-extrabold">' + (u.fullname || u.username).charAt(0).toUpperCase() + '</span>';
      html += '      <div>';
      html += '        <p class="text-xs font-bold text-slate-900">' + (u.fullname || u.username) + '</p>';
      html += '        <p class="text-[11px] text-slate-400">' + (u.email || u.username) + '</p>';
      html += '      </div>';
      html += '    </div>';
      html += '  </td>';
      html += '  <td class="py-3 px-4 text-xs text-slate-600 font-mono">' + (u.phone || '--') + '</td>';
      html += '  <td class="py-3 px-4 text-xs">';
      html += isAdmin
        ? '<span class="inline-flex rounded-full bg-brand/10 text-brand px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">Quản trị viên (Admin)</span>'
        : '<span class="inline-flex rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold">Khách hàng</span>';
      html += '  </td>';
      html += '  <td class="py-3 px-4 text-xs text-slate-500 font-mono">' + (u.created_at || '2026-03-01') + '</td>';
      html += '  <td class="py-3 px-4 text-xs"><span class="inline-flex items-center gap-1 text-emerald-600 font-semibold"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Hoạt động</span></td>';
      html += '</tr>';
    });

    tbody.innerHTML = html;
  }

  /* ==========================================================================
     6. SỰ KIỆN CLICK TOÀN CỤC (MODAL CRUD, FILTER, VIEW DETAILS)
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initAdmin();

    var engine = window.VLU_ADMIN;

    // A. Mở Modal Thêm Sản phẩm
    var btnOpenAddProduct = document.getElementById('btnOpenAddProduct');
    var btnTopAddProduct = document.getElementById('btnTopAddProduct');
    if (btnOpenAddProduct) btnOpenAddProduct.addEventListener('click', openAddProductModal);
    if (btnTopAddProduct) btnTopAddProduct.addEventListener('click', openAddProductModal);

    // B. Mở Modal Thêm Danh mục
    var btnOpenAddCategory = document.getElementById('btnOpenAddCategory');
    if (btnOpenAddCategory) btnOpenAddCategory.addEventListener('click', openAddCategoryModal);

    // C. Tìm kiếm & Lọc Sản phẩm
    var prodSearch = document.getElementById('productSearchInput');
    if (prodSearch) prodSearch.addEventListener('input', renderProducts);
    var catFilter = document.getElementById('productCategoryFilter');
    if (catFilter) catFilter.addEventListener('change', renderProducts);

    // D. Tìm kiếm & Lọc Đơn hàng
    var orderSearch = document.getElementById('orderSearchInput');
    if (orderSearch) orderSearch.addEventListener('input', renderOrders);

    var orderFilterBtns = document.querySelectorAll('[data-order-filter]');
    orderFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        orderFilterBtns.forEach(function (b) {
          b.classList.remove('bg-brand', 'text-white');
          b.classList.add('bg-white', 'text-slate-600');
        });
        btn.classList.add('bg-brand', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-600');

        orderFilterStatus = btn.getAttribute('data-order-filter');
        renderOrders();
      });
    });

    // E. Xử lý click trong bảng (Event Delegation)
    document.addEventListener('click', function (e) {
      // 1. Sửa Sản phẩm
      var editProdBtn = e.target.closest('.btn-edit-product');
      if (editProdBtn) {
        var pId = editProdBtn.getAttribute('data-id');
        openEditProductModal(pId);
        return;
      }

      // 2. Xóa Sản phẩm
      var delProdBtn = e.target.closest('.btn-delete-product');
      if (delProdBtn) {
        var pIdDel = delProdBtn.getAttribute('data-id');
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm #' + pIdDel + ' không?')) {
          engine.deleteProduct(pIdDel);
          engine.showToast('Đã xóa sản phẩm thành công.');
        }
        return;
      }

      // 3. Sửa Danh mục
      var editCatBtn = e.target.closest('.btn-edit-category');
      if (editCatBtn) {
        var cId = editCatBtn.getAttribute('data-id');
        openEditCategoryModal(cId);
        return;
      }

      // 4. Xóa Danh mục
      var delCatBtn = e.target.closest('.btn-delete-category');
      if (delCatBtn) {
        var cIdDel = delCatBtn.getAttribute('data-id');
        if (confirm('Bạn có chắc chắn muốn xóa danh mục #' + cIdDel + '?')) {
          engine.deleteCategory(cIdDel);
          engine.showToast('Đã xóa danh mục.');
        }
        return;
      }

      // 5. Xem Chi tiết Đơn hàng
      var viewOrderBtn = e.target.closest('.btn-view-order');
      if (viewOrderBtn) {
        var ordId = viewOrderBtn.getAttribute('data-id');
        openOrderDetailModal(ordId);
        return;
      }

      // 6. Xóa Đơn hàng
      var delOrderBtn = e.target.closest('.btn-delete-order');
      if (delOrderBtn) {
        var ordIdDel = delOrderBtn.getAttribute('data-id');
        if (confirm('Xác nhận xóa bản ghi đơn hàng ' + ordIdDel + '?')) {
          engine.deleteOrder(ordIdDel);
          engine.showToast('Đã xóa đơn hàng.');
        }
        return;
      }

      // 7. Đóng Modal khi click ngoài
      if (e.target.classList.contains('modal-backdrop')) {
        closeAllModals();
      }
    });

    // F. Thay đổi trạng thái đơn hàng nhanh từ Select trong dòng
    document.addEventListener('change', function (e) {
      var select = e.target.closest('.order-status-quick-select');
      if (select) {
        var orderId = select.getAttribute('data-id');
        var newStatus = select.value;
        engine.updateOrderStatus(orderId, newStatus);
        engine.showToast('Đã cập nhật trạng thái đơn ' + orderId + ' thành "' + select.options[select.selectedIndex].text + '".');
        renderDashboard();
      }
    });

    // G. Preview ảnh trực tiếp trong Product Form
    var imgInput = document.getElementById('prodModalImage');
    var imgPreview = document.getElementById('prodModalImagePreview');
    if (imgInput && imgPreview) {
      imgInput.addEventListener('input', function () {
        var url = imgInput.value.trim();
        imgPreview.src = url || 'frontend/assets/images/logo.png';
      });
    }

    // H. Submit Form Sản phẩm
    var productForm = document.getElementById('productForm');
    if (productForm) {
      productForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('prodModalName').value.trim();
        var catId = document.getElementById('prodModalCategory').value;
        var price = document.getElementById('prodModalPrice').value;
        var oldPrice = document.getElementById('prodModalOldPrice').value;
        var image = document.getElementById('prodModalImage').value.trim();
        var desc = document.getElementById('prodModalDesc').value.trim();
        var stock = document.getElementById('prodModalStock').value;

        if (!name || !price) {
          alert('Vui lòng nhập Tên sản phẩm và Giá bán!');
          return;
        }

        var prodData = {
          name: name,
          category_id: catId,
          price: parseInt(price, 10),
          old_price: oldPrice ? parseInt(oldPrice, 10) : null,
          image: image || 'frontend/assets/images/logo.png',
          description: desc,
          stock: stock ? parseInt(stock, 10) : 50
        };

        if (editingProductId) {
          engine.updateProduct(editingProductId, prodData);
          engine.showToast('Cập nhật sản phẩm thành công!');
        } else {
          engine.addProduct(prodData);
          engine.showToast('Thêm sản phẩm mới thành công!');
        }

        closeAllModals();
      });
    }

    // I. Submit Form Danh mục
    var categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
      categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('catModalName').value.trim();
        var slug = document.getElementById('catModalSlug').value.trim();
        var icon = document.getElementById('catModalIcon').value.trim();
        var desc = document.getElementById('catModalDesc').value.trim();

        if (!name) {
          alert('Vui lòng nhập tên danh mục!');
          return;
        }

        var catData = {
          name: name,
          slug: slug,
          icon: icon,
          description: desc
        };

        if (editingCategoryId) {
          engine.updateCategory(editingCategoryId, catData);
          engine.showToast('Cập nhật danh mục thành công!');
        } else {
          engine.addCategory(catData);
          engine.showToast('Thêm danh mục mới thành công!');
        }

        closeAllModals();
      });
    }

    // J. Nút cập nhật trạng thái trong Modal Chi tiết đơn hàng
    var btnSaveOrderStatus = document.getElementById('btnSaveOrderStatus');
    var modalStatusSelect = document.getElementById('modalOrderStatusSelect');
    if (btnSaveOrderStatus && modalStatusSelect) {
      btnSaveOrderStatus.addEventListener('click', function () {
        if (!currentViewingOrderId) return;
        var newStatus = modalStatusSelect.value;
        engine.updateOrderStatus(currentViewingOrderId, newStatus);
        engine.showToast('Đã lưu trạng thái đơn ' + currentViewingOrderId + '!');
        closeAllModals();
      });
    }

    // K. Nút đóng modal
    var closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', closeAllModals);
    });
  });

  /* ==========================================================================
     MODAL CONTROLS
     ========================================================================== */
  function openAddProductModal() {
    editingProductId = null;
    var form = document.getElementById('productForm');
    if (form) form.reset();
    var title = document.getElementById('productModalTitle');
    if (title) title.textContent = 'Thêm sản phẩm mới';
    var imgPreview = document.getElementById('prodModalImagePreview');
    if (imgPreview) imgPreview.src = 'frontend/assets/images/logo.png';

    var modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function openEditProductModal(id) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var products = engine.getProducts();
    var numId = parseInt(id, 10);
    var p = products.find(function (item) { return parseInt(item.id, 10) === numId; });
    if (!p) return;

    editingProductId = numId;
    var title = document.getElementById('productModalTitle');
    if (title) title.textContent = 'Cập nhật sản phẩm #' + p.id;

    document.getElementById('prodModalName').value = p.name;
    document.getElementById('prodModalCategory').value = p.category_id || 1;
    document.getElementById('prodModalPrice').value = p.price;
    document.getElementById('prodModalOldPrice').value = p.old_price || '';
    document.getElementById('prodModalImage').value = p.image || '';
    document.getElementById('prodModalDesc').value = p.description || '';
    document.getElementById('prodModalStock').value = p.stock || 50;

    var imgPreview = document.getElementById('prodModalImagePreview');
    if (imgPreview) imgPreview.src = p.image || 'frontend/assets/images/logo.png';

    var modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function openAddCategoryModal() {
    editingCategoryId = null;
    var form = document.getElementById('categoryForm');
    if (form) form.reset();
    var title = document.getElementById('categoryModalTitle');
    if (title) title.textContent = 'Thêm danh mục mới';

    var modal = document.getElementById('categoryModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function openEditCategoryModal(id) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;
    var cats = engine.getCategories();
    var numId = parseInt(id, 10);
    var c = cats.find(function (item) { return item.id === numId; });
    if (!c) return;

    editingCategoryId = numId;
    var title = document.getElementById('categoryModalTitle');
    if (title) title.textContent = 'Sửa danh mục: ' + c.name;

    document.getElementById('catModalName').value = c.name;
    document.getElementById('catModalSlug').value = c.slug || '';
    document.getElementById('catModalIcon').value = c.icon || '';
    document.getElementById('catModalDesc').value = c.description || '';

    var modal = document.getElementById('categoryModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function openOrderDetailModal(orderId) {
    var engine = window.VLU_ADMIN;
    if (!engine) return;

    var orders = engine.getOrders();
    var o = orders.find(function (item) { return item.id === orderId; });
    if (!o) return;

    currentViewingOrderId = orderId;

    document.getElementById('detailModalOrderId').textContent = o.id;
    document.getElementById('detailModalDate').textContent = engine.formatDate(o.created_at);
    document.getElementById('detailModalName').textContent = o.customer_name;
    document.getElementById('detailModalPhone').textContent = o.customer_phone;
    document.getElementById('detailModalEmail').textContent = o.customer_email || 'Không cung cấp';
    document.getElementById('detailModalAddress').textContent = o.customer_address || '--';
    document.getElementById('detailModalNotes').textContent = o.customer_notes || 'Không có';
    document.getElementById('detailModalPayment').textContent = o.payment_method || 'COD';

    document.getElementById('detailModalSubtotal').textContent = engine.formatVND(o.subtotal || o.total);
    document.getElementById('detailModalDiscount').textContent = o.discount ? '-' + engine.formatVND(o.discount) : '0₫';
    document.getElementById('detailModalTotal').textContent = engine.formatVND(o.total);

    var statusSelect = document.getElementById('modalOrderStatusSelect');
    if (statusSelect) statusSelect.value = o.status || 'pending';

    // Render danh sách sản phẩm trong đơn
    var itemsTbody = document.getElementById('detailModalItemsBody');
    if (itemsTbody) {
      var html = '';
      var items = o.items || [];
      items.forEach(function (it) {
        var lineTotal = (parseInt(it.price, 10) || 0) * (parseInt(it.quantity, 10) || 1);
        html += '<tr class="border-b border-slate-100">';
        html += '  <td class="py-2.5 px-3">';
        html += '    <div class="flex items-center gap-2">';
        html += '      <div class="h-10 w-10 shrink-0 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center">';
        html += '        <img src="' + (it.image || 'frontend/assets/images/logo.png') + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'image_2c97c5.png\';">';
        html += '      </div>';
        html += '      <div>';
        html += '        <p class="text-xs font-bold text-slate-900">' + it.name + '</p>';
        html += '        <p class="text-[11px] text-slate-500">' + (it.color || 'Mặc định') + ' | ' + (it.variant || 'Tiêu chuẩn') + '</p>';
        html += '      </div>';
        html += '    </div>';
        html += '  </td>';
        html += '  <td class="py-2.5 px-3 text-xs text-center font-bold text-slate-800">x' + it.quantity + '</td>';
        html += '  <td class="py-2.5 px-3 text-xs text-right font-semibold text-slate-700">' + engine.formatVND(it.price) + '</td>';
        html += '  <td class="py-2.5 px-3 text-xs text-right font-black text-brand">' + engine.formatVND(lineTotal) + '</td>';
        html += '</tr>';
      });
      itemsTbody.innerHTML = html;
    }

    var modal = document.getElementById('orderDetailModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeAllModals() {
    var modals = document.querySelectorAll('.admin-modal');
    modals.forEach(function (m) {
      m.classList.add('hidden');
      m.classList.remove('flex');
    });
    editingProductId = null;
    editingCategoryId = null;
    currentViewingOrderId = null;
  }

})(window, document);
