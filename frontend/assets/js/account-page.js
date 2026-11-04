(function (window, document) {
  'use strict';

  var NAV_ITEMS = [
    { id: 'overview', icon: '⌂', label: 'Tổng quan tài khoản', subtitle: 'Theo dõi đơn hàng và các hoạt động gần đây.' },
    { id: 'profile', icon: '◉', label: 'Thông tin cá nhân', subtitle: 'Quản lý hồ sơ và thông tin liên hệ của bạn.' },
    { id: 'orders', icon: '▤', label: 'Quản lý đơn hàng', subtitle: 'Tìm kiếm, theo dõi và quản lý đơn hàng.' },
    { id: 'addresses', icon: '⌖', label: 'Sổ địa chỉ', subtitle: 'Lưu các địa chỉ giao hàng thường dùng.' },
    { id: 'wishlist', icon: '♡', label: 'Sản phẩm yêu thích', subtitle: 'Các sản phẩm bạn đã lưu để xem sau.' },
    { id: 'recent', icon: '◷', label: 'Sản phẩm đã xem gần đây', subtitle: 'Tiếp tục khám phá những sản phẩm đã xem.' },
    { id: 'compare', icon: '⇄', label: 'So sánh sản phẩm', subtitle: 'Đặt các lựa chọn cạnh nhau để so sánh.' },
    { id: 'warranty', icon: '⌑', label: 'Bảo hành và đổi trả', subtitle: 'Theo dõi sản phẩm đã mua và yêu cầu hỗ trợ.' },
    { id: 'history', icon: '↻', label: 'Lịch sử mua sắm', subtitle: 'Tổng hợp giao dịch và sản phẩm đã mua.' },
    { id: 'reviews', icon: '☆', label: 'Đánh giá sản phẩm', subtitle: 'Chia sẻ trải nghiệm với sản phẩm đã nhận.' },
    { id: 'vouchers', icon: '％', label: 'Voucher và ưu đãi', subtitle: 'Theo dõi mã ưu đãi khả dụng của cửa hàng.' },
    { id: 'points', icon: '✧', label: 'Tích điểm thành viên', subtitle: 'Thông tin điểm và quyền lợi thành viên.' },
    { id: 'notifications', icon: '♧', label: 'Trung tâm thông báo', subtitle: 'Cập nhật hoạt động và ưu đãi của bạn.' },
    { id: 'support', icon: '?', label: 'Trung tâm hỗ trợ khách hàng', subtitle: 'Gửi câu hỏi hoặc yêu cầu hỗ trợ.' },
    { id: 'settings', icon: '⚙', label: 'Cài đặt tài khoản', subtitle: 'Quản lý tùy chọn riêng tư và thông báo.' },
    { id: 'logout', icon: '↪', label: 'Đăng xuất', subtitle: 'Kết thúc phiên tài khoản hiện tại.' }
  ];

  var STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đang chuẩn bị',
    processing: 'Đang chuẩn bị',
    shipping: 'Đang giao',
    delivering: 'Đang giao',
    completed: 'Đã giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    returned: 'Đổi trả'
  };
  var STATUS_TABS = [
    ['all', 'Tất cả'],
    ['pending', 'Chờ xác nhận'],
    ['processing', 'Đang chuẩn bị'],
    ['shipping', 'Đang giao'],
    ['completed', 'Đã giao'],
    ['cancelled', 'Đã hủy'],
    ['returned', 'Đổi trả']
  ];
  var PRODUCT_PLACEHOLDER = 'frontend/assets/images/placeholders/phone.svg';
  var currentUser;
  var userKey;
  var store;
  var activeTab = new URLSearchParams(window.location.search).get('tab') || 'overview';
  var orderFilter = 'all';
  var orderDateFilter = 'all';
  var orderSearch = '';
  var addressFormOpen = false;
  var selectedOrder = '';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function currentIdentity(user) {
    var identity = user && (user.username || user.email || user.id);
    if (!identity) return 'guest';
    return String(identity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_') || 'guest';
  }

  function readJson(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn('[AccountPage] Không thể đọc dữ liệu:', key, error);
      return fallback;
    }
  }

  function saveStore() {
    try {
      localStorage.setItem(userKey, JSON.stringify(store));
      return true;
    } catch (error) {
      console.error('[AccountPage] Không thể lưu dữ liệu tài khoản:', error);
      notify('Không thể lưu dữ liệu trên thiết bị này. Vui lòng kiểm tra dung lượng trình duyệt.', true);
      return false;
    }
  }

  function normalizeStore(value) {
    var data = value && typeof value === 'object' ? value : {};
    return {
      addresses: Array.isArray(data.addresses) ? data.addresses : [],
      wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
      recent: Array.isArray(data.recent) ? data.recent : [],
      compare: Array.isArray(data.compare) ? data.compare : [],
      reviews: Array.isArray(data.reviews) ? data.reviews : [],
      tickets: Array.isArray(data.tickets) ? data.tickets : [],
      notifications: Array.isArray(data.notifications) ? data.notifications : [],
      usedVouchers: Array.isArray(data.usedVouchers) ? data.usedVouchers : [],
      points: Number(data.points) || 0,
      settings: Object.assign({ orderUpdates: true, promotions: false, emailUpdates: true }, data.settings || {}),
      profile: data.profile && typeof data.profile === 'object' ? data.profile : {}
    };
  }

  function notify(message, isError) {
    var notice = document.getElementById('accountNotice');
    if (!notice) return;
    notice.textContent = message;
    notice.classList.remove('hidden');
    if (isError) {
      notice.style.borderColor = '#fecaca';
      notice.style.background = 'rgba(254,242,242,.92)';
      notice.style.color = '#b91c1c';
    } else {
      notice.style.borderColor = '';
      notice.style.background = '';
      notice.style.color = '';
    }
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(function () { notice.classList.add('hidden'); }, 3600);
  }

  function money(value) {
    var amount = Number(value) || 0;
    return amount.toLocaleString('vi-VN') + '₫';
  }

  function dateText(value) {
    if (!value) return '—';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return date.toLocaleDateString('vi-VN');
  }

  function products() {
    return window.VLU_CATALOG || {};
  }

  function findProduct(id) {
    return products()[id] || null;
  }

  function productImage(product) {
    var image = product && (product.image || product.img ||
      (product.colors && product.colors[0] && (product.colors[0].image || product.colors[0].img)));
    if (!image || /(^|\/)Banner\//i.test(image)) return PRODUCT_PLACEHOLDER;
    return image;
  }

  function itemImage(item) {
    var image = item && item.image;
    return !image || /(^|\/)Banner\//i.test(image) ? PRODUCT_PLACEHOLDER : image;
  }

  function catalogProduct(id) {
    var product = findProduct(id);
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      brand: product.brand || '',
      category: product.category || '',
      price: Number(product.basePrice) || 0,
      image: productImage(product),
      tagline: product.tagline || ''
    };
  }

  function orders() {
    var identity = currentIdentity(currentUser);
    var all = readJson('vlu_orders', []);
    if (!Array.isArray(all)) return [];
    return all.filter(function (order) {
      return String(order.user_id || '') === identity;
    }).sort(function (a, b) {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  }

  function statusLabel(status) {
    return STATUS_LABELS[String(status || '').toLowerCase()] || (status || 'Chưa cập nhật');
  }

  function statusClass(status) {
    var key = String(status || '').toLowerCase();
    if (['completed', 'delivered'].indexOf(key) !== -1) return 'bg-emerald-50 text-emerald-700';
    if (['cancelled', 'returned'].indexOf(key) !== -1) return 'bg-slate-100 text-slate-600';
    if (['shipping', 'delivering'].indexOf(key) !== -1) return 'bg-blue-50 text-blue-700';
    return 'bg-amber-50 text-amber-700';
  }

  function orderItems(order) {
    return Array.isArray(order.items) ? order.items : [];
  }

  function filteredOrders() {
    return orders().filter(function (order) {
      if (orderSearch && String(order.id || '').toLowerCase().indexOf(orderSearch.toLowerCase()) === -1) return false;
      var status = String(order.status || '').toLowerCase();
      if (orderFilter === 'processing' && ['confirmed', 'processing'].indexOf(status) === -1) return false;
      if (orderFilter === 'shipping' && ['shipping', 'delivering'].indexOf(status) === -1) return false;
      if (orderFilter === 'completed' && ['completed', 'delivered'].indexOf(status) === -1) return false;
      if (orderFilter === 'returned' && ['returned', 'return'].indexOf(status) === -1) return false;
      if (orderFilter !== 'all' && ['processing', 'shipping', 'completed', 'returned'].indexOf(orderFilter) === -1 && status !== orderFilter) return false;
      if (orderDateFilter !== 'all') {
        var days = Number(orderDateFilter);
        var createdAt = new Date(order.created_at || 0).getTime();
        if (!days || !Number.isFinite(createdAt) || Date.now() - createdAt > days * 86400000) return false;
      }
      return true;
    });
  }

  function productCard(product, actions, options) {
    options = options || {};
    var href = 'product-detail.html?id=' + encodeURIComponent(product.id) +
      '&name=' + encodeURIComponent(product.name) +
      '&cat=' + encodeURIComponent(product.category || 'dien-thoai');
    return '<article class="account-product-card">' +
      '<a href="' + href + '" aria-label="Xem ' + escapeHtml(product.name) + '">' +
      '<img class="account-product-img" src="' + escapeHtml(product.image || PRODUCT_PLACEHOLDER) +
      '" alt="' + escapeHtml(product.name) + '" loading="lazy">' +
      '</a><div class="mt-3 flex items-center justify-between gap-2">' +
      '<span class="account-eyebrow">' + escapeHtml(product.brand || 'VLU STORE') + '</span>' +
      '<span class="account-badge">' + escapeHtml(product.category || 'Sản phẩm') + '</span></div>' +
      '<a class="mt-1 block min-h-9 text-xs font-extrabold leading-5 text-slate-900 hover:text-brand" href="' + href + '">' +
      escapeHtml(product.name) + '</a><p class="mt-1 text-sm font-black text-brand">' + money(product.price) + '</p>' +
      '<div class="mt-3 flex flex-wrap gap-2">' + actions +
      (options.compare ? '<button class="account-button" data-action="toggle-compare" data-id="' + escapeHtml(product.id) + '">⇄ So sánh</button>' : '') +
      '</div></article>';
  }

  function emptyState(icon, text, actionLabel, tab) {
    return '<div class="account-empty"><span class="account-empty-icon">' + icon + '</span>' +
      '<p class="text-sm font-extrabold text-slate-700">' + escapeHtml(text) + '</p>' +
      (actionLabel ? '<a class="account-button mt-4" href="' + escapeHtml(tab || 'index.php') + '">' + escapeHtml(actionLabel) + '</a>' : '') +
      '</div>';
  }

  function renderNav() {
    var nav = document.getElementById('accountNav');
    nav.innerHTML = NAV_ITEMS.map(function (item, index) {
      var logout = item.id === 'logout';
      return '<button type="button" class="account-nav-button' + (activeTab === item.id ? ' is-active' : '') +
        (logout ? ' mt-2 border-t border-slate-100 pt-3 text-red-600' : '') + '" data-tab="' + item.id +
        '" aria-current="' + (activeTab === item.id ? 'page' : 'false') + '">' +
        '<span class="account-nav-icon">' + item.icon + '</span><span class="account-nav-label">' +
        (index + 1) + '. ' + escapeHtml(item.label) + '</span></button>';
    }).join('');
  }

  function profileName() {
    return store.profile.fullname || currentUser.fullname || currentUser.username || currentUser.email || 'Khách hàng';
  }

  function updateIdentity() {
    var name = profileName();
    var email = store.profile.email || currentUser.email || '';
    document.getElementById('sidebarName').textContent = name;
    document.getElementById('sidebarEmail').textContent = email;
    var avatar = document.getElementById('sidebarAvatar');
    if (store.profile.avatar) {
      avatar.innerHTML = '<img src="' + escapeHtml(store.profile.avatar) + '" alt="Ảnh đại diện">';
    } else {
      avatar.textContent = name.trim().charAt(0).toUpperCase() || 'V';
    }
    if (window.VLU_CART) {
      document.getElementById('accountCartCount').textContent = window.VLU_CART.getItemCount();
    }
  }

  function overviewHtml() {
    var userOrders = orders();
    var done = userOrders.filter(function (order) {
      return ['completed', 'delivered'].indexOf(String(order.status).toLowerCase()) !== -1;
    });
    var pending = userOrders.filter(function (order) {
      return ['pending', 'confirmed', 'processing', 'shipping', 'delivering'].indexOf(String(order.status).toLowerCase()) !== -1;
    });
    var recentProducts = store.recent.map(catalogProduct).filter(Boolean).slice(0, 4);
    var suggestions = Object.keys(products()).map(catalogProduct).filter(Boolean).slice(0, 4);
    var orderMarkup = userOrders.slice(0, 4).map(orderRow).join('');
    return '<section class="account-card account-card-pad"><div class="flex flex-wrap items-center justify-between gap-4">' +
      '<div><p class="account-eyebrow">CHÀO MỪNG TRỞ LẠI</p><h2 class="mt-1 text-xl font-black text-slate-950">' +
      'Xin chào, ' + escapeHtml(profileName()) + '</h2><p class="account-muted mt-1">Tài khoản thành viên VLU FLAGSHIP STORE</p></div>' +
      '<span class="account-badge">✦ Thành viên VLU</span></div></section>' +
      '<div class="grid grid-cols-2 gap-3 xl:grid-cols-4">' +
      statCard('▤', 'Tổng đơn hàng', userOrders.length) + statCard('◷', 'Đang xử lý', pending.length) +
      statCard('✓', 'Đã hoàn thành', done.length) + statCard('♡', 'Yêu thích', store.wishlist.length) + '</div>' +
      '<section class="account-card account-card-pad"><div class="mb-2 flex items-center justify-between gap-3">' +
      '<h2 class="account-card-title">Đơn hàng gần đây</h2><button class="account-button" data-tab="orders">Xem tất cả</button></div>' +
      (orderMarkup || emptyState('▤', 'Chưa có đơn hàng gắn với tài khoản này.', 'Khám phá sản phẩm', 'index.php')) +
      '</section>' +
      '<section class="account-card account-card-pad"><div class="mb-4 flex items-center justify-between gap-3">' +
      '<h2 class="account-card-title">Đã xem gần đây</h2><button class="account-button" data-tab="recent">Xem lịch sử</button></div>' +
      (recentProducts.length ? '<div class="account-product-grid">' + recentProducts.map(function (p) {
        return productCard(p, '<button class="account-button account-button-primary" data-action="add-cart" data-id="' + escapeHtml(p.id) + '">Thêm giỏ</button>', { compare: true });
      }).join('') + '</div>' : emptyState('◷', 'Lịch sử xem sản phẩm sẽ xuất hiện tại đây.')) +
      '</section><section class="account-card account-card-pad"><h2 class="account-card-title mb-4">Gợi ý dành cho bạn</h2>' +
      '<div class="account-product-grid">' + suggestions.map(function (p) {
        return productCard(p, '<button class="account-button account-button-primary" data-action="add-cart" data-id="' + escapeHtml(p.id) + '">Thêm giỏ</button>', { compare: true });
      }).join('') + '</div></section>';
  }

  function statCard(icon, label, value) {
    return '<article class="account-stat"><div class="flex items-center justify-between"><span class="account-eyebrow">' +
      escapeHtml(label) + '</span><span class="text-lg text-brand">' + icon + '</span></div><p class="account-stat-value">' +
      escapeHtml(value) + '</p></article>';
  }

  function orderRow(order) {
    var id = String(order.id || '');
    var opened = selectedOrder === id;
    var items = orderItems(order);
    var steps = ['pending', 'processing', 'shipping', 'completed'];
    var status = String(order.status || 'pending').toLowerCase();
    var stepIndex = status === 'confirmed' ? 1 : (status === 'delivering' ? 2 : steps.indexOf(status));
    var stepper = steps.map(function (step, index) {
      return '<span class="account-step' + (index <= stepIndex ? ' is-done' : '') + '">' +
        escapeHtml(statusLabel(step)) + '</span>';
    }).join('');
    var row = '<article class="account-order-row"><div class="min-w-0">' +
      '<div class="flex flex-wrap items-center gap-2"><strong class="text-xs text-slate-900">#' + escapeHtml(id) +
      '</strong><span class="account-badge ' + statusClass(status) + '">' + escapeHtml(statusLabel(status)) + '</span></div>' +
      '<p class="mt-1 truncate text-[11px] text-slate-500">' + escapeHtml(items.length ? items.map(function (item) { return item.name; }).join(', ') : 'Đơn hàng') +
      '</p><p class="mt-1 text-[10px] text-slate-400">' + dateText(order.created_at) + ' · ' + (Number(order.total) ? money(order.total) : 'Chưa có tổng tiền') + '</p>' +
      '</div><div class="flex shrink-0 flex-wrap justify-end gap-2">' +
      '<button class="account-button" data-action="order-detail" data-id="' + escapeHtml(id) + '">' + (opened ? 'Đóng' : 'Chi tiết') + '</button>' +
      (status === 'pending' ? '<button class="account-button account-button-danger" data-action="cancel-order" data-id="' + escapeHtml(id) + '">Hủy</button>' : '') +
      '<button class="account-button" data-action="buy-again" data-id="' + escapeHtml(id) + '">Mua lại</button>' +
      '</div></article>';
    if (!opened) return row;
    return row + '<div class="rounded-2xl bg-slate-50/80 p-4"><p class="text-xs font-extrabold">Theo dõi đơn hàng</p>' +
      '<div class="account-stepper">' + stepper + '</div><div class="mt-4 grid gap-2 text-[11px] text-slate-600 sm:grid-cols-2">' +
      '<p>Người nhận: <strong>' + escapeHtml(order.customer_name || '—') + '</strong></p>' +
      '<p>Điện thoại: <strong>' + escapeHtml(order.customer_phone || '—') + '</strong></p>' +
      '<p class="sm:col-span-2">Địa chỉ: <strong>' + escapeHtml(order.customer_address || '—') + '</strong></p></div>' +
      items.map(function (item) {
        return '<div class="account-list-row"><div class="flex min-w-0 items-center gap-3">' +
          '<img class="account-product-img" src="' + escapeHtml(itemImage(item)) + '" alt="" loading="lazy">' +
          '<p class="truncate text-xs font-bold">' + escapeHtml(item.name) + ' <span class="font-medium text-slate-500">× ' + escapeHtml(item.quantity || 1) + '</span></p>' +
          '</div><span class="shrink-0 text-xs font-extrabold">' + money(item.price) + '</span></div>';
      }).join('') + '</div>';
  }

  function profileHtml() {
    var profile = Object.assign({}, currentUser, store.profile);
    return '<section class="account-card account-card-pad"><div class="mb-5 flex flex-wrap items-center justify-between gap-3">' +
      '<div><h2 class="account-card-title">Hồ sơ cá nhân</h2><p class="account-muted mt-1">Thông tin được lưu trên thiết bị hiện tại.</p></div>' +
      '<label class="account-button cursor-pointer">＋ Ảnh đại diện<input class="hidden" type="file" accept="image/*" data-profile-avatar></label></div>' +
      '<form data-form="profile" class="grid gap-4 sm:grid-cols-2">' +
      field('Họ và tên', 'fullname', profile.fullname || '', 'text', 'Nguyễn Văn An') +
      field('Email', 'email', profile.email || '', 'email', 'email@example.com') +
      field('Số điện thoại', 'phone', profile.phone || '', 'tel', '09xxxxxxxx') +
      field('Ngày sinh', 'birthday', profile.birthday || '', 'date', '') +
      '<div class="account-field"><label for="profileGender">Giới tính (tùy chọn)</label><select class="account-select" id="profileGender" name="gender">' +
      option('', 'Chưa chọn', profile.gender) + option('female', 'Nữ', profile.gender) +
      option('male', 'Nam', profile.gender) + option('other', 'Khác', profile.gender) + '</select></div>' +
      '<div class="account-field"><label>Tên đăng nhập</label><input class="account-input" value="' +
      escapeHtml(currentUser.username || '') + '" readonly></div>' +
      '<div class="sm:col-span-2 flex flex-wrap items-center gap-3"><button class="account-button account-button-primary" type="submit">Lưu thông tin</button>' +
      '<span class="account-muted">Đổi mật khẩu cần dịch vụ xác thực phía máy chủ; hiện chưa có API tương ứng.</span></div></form></section>';
  }

  function field(label, name, value, type, placeholder) {
    return '<div class="account-field"><label for="field-' + escapeHtml(name) + '">' + escapeHtml(label) + '</label>' +
      '<input class="account-input" id="field-' + escapeHtml(name) + '" name="' + escapeHtml(name) + '" type="' + type +
      '" value="' + escapeHtml(value) + '" placeholder="' + escapeHtml(placeholder) + '"></div>';
  }

  function option(value, label, selected) {
    return '<option value="' + escapeHtml(value) + '"' + (value === selected ? ' selected' : '') + '>' + escapeHtml(label) + '</option>';
  }

  function ordersHtml() {
    var list = filteredOrders();
    return '<section class="account-card account-card-pad"><div class="grid gap-3 sm:grid-cols-[1fr_auto]">' +
      '<input class="account-input" id="orderSearch" type="search" value="' + escapeHtml(orderSearch) + '" placeholder="Tìm theo mã đơn hàng">' +
      '<select class="account-select" id="orderDateFilter">' + option('all', 'Mọi thời gian', orderDateFilter) +
      option('30', '30 ngày qua', orderDateFilter) + option('365', '12 tháng qua', orderDateFilter) + '</select></div>' +
      '<div class="mt-4 flex gap-2 overflow-x-auto pb-2">' + STATUS_TABS.map(function (tab) {
        return '<button class="account-button' + (orderFilter === tab[0] ? ' account-button-primary' : '') +
          '" data-order-filter="' + tab[0] + '">' + tab[1] + '</button>';
      }).join('') + '</div><div id="orderRows" class="mt-2">' +
      (list.length ? list.map(orderRow).join('') : emptyState('▤', orderSearch || orderFilter !== 'all' ? 'Không tìm thấy đơn hàng phù hợp.' : 'Chưa có đơn hàng nào của tài khoản này.', 'Mua sắm ngay', 'index.php')) +
      '</div></section>';
  }

  function addressesHtml() {
    return '<section class="account-card account-card-pad"><div class="mb-4 flex items-center justify-between gap-3"><div>' +
      '<h2 class="account-card-title">Địa chỉ giao hàng</h2><p class="account-muted mt-1">Địa chỉ được lưu riêng theo tài khoản.</p></div>' +
      '<button class="account-button account-button-primary" data-action="toggle-address-form">' + (addressFormOpen ? 'Đóng' : '+ Thêm địa chỉ') + '</button></div>' +
      (addressFormOpen ? '<form data-form="address" class="mb-5 grid gap-3 rounded-2xl bg-slate-50/80 p-4 sm:grid-cols-2">' +
        field('Tên người nhận', 'name', '', 'text', 'Nguyễn Văn An') + field('Số điện thoại', 'phone', '', 'tel', '09xxxxxxxx') +
        '<div class="account-field sm:col-span-2"><label for="addressLine">Địa chỉ đầy đủ</label><input class="account-input" id="addressLine" name="address" required placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"></div>' +
        '<label class="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" name="default"> Đặt làm địa chỉ mặc định</label>' +
        '<div><button class="account-button account-button-primary" type="submit">Lưu địa chỉ</button></div></form>' : '') +
      (store.addresses.length ? store.addresses.map(function (address, index) {
        return '<article class="account-list-row"><div><div class="flex flex-wrap items-center gap-2"><p class="text-xs font-extrabold text-slate-900">' +
          escapeHtml(address.name) + '</p>' + (address.default ? '<span class="account-badge bg-brand-soft text-brand">Mặc định</span>' : '') +
          '</div><p class="mt-1 text-xs text-slate-500">' + escapeHtml(address.phone) + ' · ' + escapeHtml(address.address) + '</p></div>' +
          '<div class="flex gap-2">' + (!address.default ? '<button class="account-button" data-action="default-address" data-index="' + index + '">Mặc định</button>' : '') +
          '<button class="account-button account-button-danger" data-action="delete-address" data-index="' + index + '">Xóa</button></div></article>';
      }).join('') : emptyState('⌖', 'Bạn chưa lưu địa chỉ giao hàng.')) + '</section>';
  }

  function productCollectionHtml(ids, mode) {
    var list = ids.map(catalogProduct).filter(Boolean);
    if (!list.length) return emptyState(mode === 'wishlist' ? '♡' : '◷', mode === 'wishlist' ? 'Chưa có sản phẩm yêu thích.' : 'Chưa có sản phẩm trong lịch sử xem.', 'Khám phá sản phẩm', 'index.php');
    return '<div class="account-product-grid">' + list.map(function (product) {
      var action = mode === 'wishlist' ? 'remove-wishlist' : 'remove-recent';
      var label = mode === 'wishlist' ? 'Bỏ yêu thích' : 'Xóa lịch sử';
      var actions = '<button class="account-button account-button-primary" data-action="add-cart" data-id="' + escapeHtml(product.id) + '">Thêm giỏ</button>' +
        '<button class="account-button" data-action="' + action + '" data-id="' + escapeHtml(product.id) + '">' + label + '</button>';
      return productCard(product, actions, { compare: true });
    }).join('') + '</div>';
  }

  function compareHtml() {
    var list = store.compare.map(catalogProduct).filter(Boolean).slice(0, 4);
    if (!list.length) return '<section class="account-card account-card-pad">' +
      emptyState('⇄', 'Chọn sản phẩm từ danh sách yêu thích hoặc lịch sử để so sánh.', 'Xem sản phẩm yêu thích', '?tab=wishlist') + '</section>';
    var rows = [
      ['Sản phẩm', function (p) { return '<img class="mx-auto mb-2 h-24 w-full object-contain" src="' + escapeHtml(p.image) + '" alt="">' + escapeHtml(p.name); }],
      ['Thương hiệu', function (p) { return escapeHtml(p.brand || '—'); }],
      ['Giá bán', function (p) { return '<strong class="text-brand">' + money(p.price) + '</strong>'; }],
      ['Danh mục', function (p) { return escapeHtml(p.category || '—'); }],
      ['Tình trạng', function () { return 'Liên hệ cửa hàng để xác nhận'; }]
    ];
    return '<section class="account-card account-card-pad"><div class="mb-4 flex justify-between gap-3"><h2 class="account-card-title">So sánh sản phẩm</h2>' +
      '<button class="account-button account-button-danger" data-action="clear-compare">Xóa danh sách</button></div><div class="account-table-wrap"><table class="account-table"><thead><tr><th>Tiêu chí</th>' +
      list.map(function (p) { return '<th>' + escapeHtml(p.brand || 'Sản phẩm') + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (row) {
        return '<tr><th>' + row[0] + '</th>' + list.map(function (p) { return '<td>' + row[1](p) + '</td>'; }).join('') + '</tr>';
      }).join('') + '<tr><th>Thao tác</th>' + list.map(function (p) {
        return '<td><button class="account-button" data-action="remove-compare" data-id="' + escapeHtml(p.id) + '">Bỏ khỏi so sánh</button></td>';
      }).join('') + '</tr></tbody></table></div></section>';
  }

  function warrantyHtml() {
    var list = orders().filter(function (order) {
      return ['completed', 'delivered'].indexOf(String(order.status).toLowerCase()) !== -1;
    });
    return '<section class="account-card account-card-pad"><h2 class="account-card-title">Sản phẩm đã giao</h2><p class="account-muted mt-1">Thời hạn bảo hành chính xác cần đối chiếu hóa đơn/phiếu bảo hành của cửa hàng.</p>' +
      (list.length ? list.map(function (order) {
        return '<article class="account-list-row"><div><p class="text-xs font-extrabold">Đơn #' + escapeHtml(order.id) + '</p>' +
          '<p class="mt-1 text-[11px] text-slate-500">' + escapeHtml(orderItems(order).map(function (item) { return item.name; }).join(', ')) +
          '</p><p class="mt-1 text-[10px] text-slate-400">Ngày nhận ghi nhận: ' + dateText(order.created_at) + ' · Ngày hết hạn: cần xác nhận</p></div>' +
          '<button class="account-button account-button-primary" data-action="warranty-request" data-id="' + escapeHtml(order.id) + '">Gửi yêu cầu</button></article>';
      }).join('') : emptyState('⌑', 'Đơn hàng đã giao sẽ xuất hiện tại đây.')) +
      '<h3 class="account-card-title mt-7">Yêu cầu bảo hành / đổi trả</h3>' +
      (store.tickets.filter(function (ticket) { return ticket.type === 'warranty'; }).map(ticketRow).join('') || '<p class="account-muted mt-2">Chưa có yêu cầu nào được ghi nhận.</p>') + '</section>';
  }

  function ticketRow(ticket) {
    return '<div class="account-list-row"><div><p class="text-xs font-extrabold">' + escapeHtml(ticket.subject) + '</p>' +
      '<p class="mt-1 text-[10px] text-slate-500">' + escapeHtml(ticket.typeLabel || ticket.type) + ' · ' + dateText(ticket.createdAt) +
      '</p></div><span class="account-badge">' + escapeHtml(ticket.status || 'Đã tiếp nhận trên thiết bị') + '</span></div>';
  }

  function historyHtml() {
    var list = orders();
    var total = list.reduce(function (sum, order) { return sum + (Number(order.total) || 0); }, 0);
    return '<section class="account-card account-card-pad"><div class="grid gap-3 sm:grid-cols-2">' +
      statCard('₫', 'Tổng giá trị đơn ghi nhận', money(total)) + statCard('▤', 'Số giao dịch', list.length) +
      '</div><div class="mt-5 account-table-wrap"><table class="account-table"><thead><tr><th>Mã đơn</th><th>Ngày</th><th>Sản phẩm</th><th>Thanh toán</th><th>Tổng</th><th></th></tr></thead><tbody>' +
      (list.length ? list.map(function (order) {
        return '<tr><td>#' + escapeHtml(order.id) + '</td><td>' + dateText(order.created_at) + '</td><td>' +
          escapeHtml(orderItems(order).map(function (item) { return item.name; }).join(', ') || '—') + '</td><td>' +
          escapeHtml(order.payment_method || '—') + '</td><td><strong>' + money(order.total) + '</strong></td><td>' +
          '<button class="account-button" data-action="download-invoice" data-id="' + escapeHtml(order.id) + '">Hóa đơn</button> ' +
          '<button class="account-button" data-action="buy-again" data-id="' + escapeHtml(order.id) + '">Mua lại</button></td></tr>';
      }).join('') : '<tr><td colspan="6">' + emptyState('↻', 'Chưa có lịch sử mua sắm.') + '</td></tr>') + '</tbody></table></div></section>';
  }

  function reviewsHtml() {
    var eligible = [];
    orders().filter(function (order) {
      return ['completed', 'delivered'].indexOf(String(order.status).toLowerCase()) !== -1;
    }).forEach(function (order) {
      orderItems(order).forEach(function (item) {
        eligible.push({ id: String(order.id) + ':' + String(item.id || item.name), orderId: order.id, name: item.name, image: item.image });
      });
    });
    return '<section class="account-card account-card-pad"><h2 class="account-card-title">Đánh giá của bạn</h2>' +
      (eligible.length ? eligible.map(function (item) {
        var review = store.reviews.find(function (entry) { return entry.id === item.id; });
        return '<form data-form="review" data-review-id="' + escapeHtml(item.id) + '" class="account-list-row">' +
          '<div class="min-w-0 flex-1"><p class="text-xs font-extrabold">' + escapeHtml(item.name) + '</p>' +
          (review ? '<p class="mt-1 text-xs text-amber-600">' + '★'.repeat(review.rating) + '</p><p class="account-muted">' + escapeHtml(review.comment) + '</p>' :
            '<div class="mt-2 grid gap-2 sm:grid-cols-[110px_1fr]"><select class="account-select" name="rating" aria-label="Số sao">' +
              option('5', '★★★★★', '5') + option('4', '★★★★☆', '5') + option('3', '★★★☆☆', '5') +
              option('2', '★★☆☆☆', '5') + option('1', '★☆☆☆☆', '5') +
              '</select><input class="account-input" name="comment" required placeholder="Chia sẻ nhận xét của bạn"></div>' +
              '<label class="mt-2 block text-[10px] text-slate-500">Ảnh minh họa (tùy chọn) <input class="mt-1 block" type="file" name="reviewImage" accept="image/*"></label>' +
              '<button class="account-button account-button-primary mt-2" type="submit">Gửi đánh giá</button>') +
          '</div><span class="account-badge">Đơn #' + escapeHtml(item.orderId) + '</span></form>';
      }).join('') : emptyState('☆', 'Sản phẩm đã giao sẽ xuất hiện tại đây để bạn đánh giá.')) +
      '<h3 class="account-card-title mt-7">Lịch sử đánh giá</h3>' +
      (store.reviews.length ? store.reviews.map(function (review) {
        return '<div class="account-list-row"><div><p class="text-xs font-extrabold">' + escapeHtml(review.name) +
          ' · <span class="text-amber-500">' + '★'.repeat(review.rating) + '</span></p><p class="account-muted mt-1">' +
          escapeHtml(review.comment) + '</p></div><button class="account-button account-button-danger" data-action="delete-review" data-id="' + escapeHtml(review.id) + '">Xóa</button></div>';
      }).join('') : '<p class="account-muted mt-2">Chưa có đánh giá.</p>') + '</section>';
  }

  function vouchersHtml() {
    var vouchers = [
      { code: 'VLU2026', value: '500.000₫', condition: 'Đơn từ 1.000.000₫', expiry: 'Theo chương trình cửa hàng' },
      { code: 'FLAGSHIP', value: '1.000.000₫', condition: 'Đơn từ 15.000.000₫', expiry: 'Theo chương trình cửa hàng' },
      { code: 'APPLEVIP', value: '800.000₫', condition: 'Đơn từ 10.000.000₫', expiry: 'Theo chương trình cửa hàng' },
      { code: 'FREESHIP', value: 'Miễn phí ship', condition: 'Áp dụng theo điều kiện vận chuyển', expiry: 'Theo chương trình cửa hàng' }
    ];
    return '<section class="account-card account-card-pad"><div class="mb-4 flex flex-wrap gap-2">' +
      '<span class="account-badge bg-emerald-50 text-emerald-700">Chưa sử dụng</span><span class="account-badge">Đã dùng: ' +
      store.usedVouchers.length + '</span><span class="account-badge">Hết hạn: cửa hàng cần đồng bộ hạn dùng</span></div>' +
      '<div class="grid gap-3 md:grid-cols-2">' + vouchers.map(function (voucher) {
        var used = store.usedVouchers.indexOf(voucher.code) !== -1;
        return '<article class="rounded-2xl border border-slate-200/80 bg-white/75 p-4">' +
          '<div class="flex items-start justify-between gap-3"><div><span class="account-eyebrow">MÃ ƯU ĐÃI</span>' +
          '<p class="mt-1 font-mono text-lg font-black tracking-wider text-brand">' + voucher.code + '</p></div>' +
          '<span class="account-badge">' + voucher.value + '</span></div><p class="account-muted mt-3">' +
          voucher.condition + '<br>' + voucher.expiry + '</p><button class="account-button mt-3" data-action="copy-voucher" data-code="' +
          voucher.code + '">' + (used ? 'Dùng lại mã' : 'Sao chép mã') + '</button></article>';
      }).join('') + '</div><p class="account-muted mt-4">Mã khả dụng được đối chiếu với danh sách ưu đãi của giỏ hàng; thời hạn và trạng thái sử dụng tại cửa hàng chưa có API đồng bộ.</p></section>';
  }

  function pointsHtml() {
    var spent = orders().filter(function (order) {
      return ['completed', 'delivered'].indexOf(String(order.status).toLowerCase()) !== -1;
    }).reduce(function (sum, order) { return sum + (Number(order.total) || 0); }, 0);
    return '<section class="account-card account-card-pad"><div class="grid gap-3 sm:grid-cols-2">' +
      statCard('✧', 'Điểm đã ghi nhận', store.points.toLocaleString('vi-VN')) +
      statCard('♛', 'Hạng thành viên', 'Thành viên VLU') + '</div>' +
      '<div class="mt-5 rounded-2xl bg-gradient-to-r from-brand/10 to-indigo-500/10 p-5"><p class="account-eyebrow">QUYỀN LỢI</p>' +
      '<p class="mt-2 text-sm font-extrabold">Ưu đãi giỏ hàng, voucher và hỗ trợ sau mua</p>' +
      '<p class="account-muted mt-1">Tổng đơn đã giao: ' + money(spent) + '. Quy tắc cộng điểm/thăng hạng cần được cửa hàng cấu hình trước khi quy đổi.</p>' +
      '<button class="account-button mt-4" data-action="redeem-points" ' + (store.points < 100 ? 'disabled' : '') + '>Đổi 100 điểm lấy voucher</button>' +
      '</div><h3 class="account-card-title mt-6">Lịch sử điểm</h3>' +
      (store.points ? '<div class="account-list-row"><span class="text-xs">Điểm hiện có được ghi nhận trên thiết bị</span><strong>+' + store.points + '</strong></div>' :
        '<p class="account-muted mt-2">Chưa có giao dịch điểm. Điểm chưa được cộng tự động vì hệ thống chưa có quy tắc tích điểm ở backend.</p>') +
      '</section>';
  }

  function notificationsHtml() {
    var list = store.notifications.slice().sort(function (a, b) {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    return '<section class="account-card account-card-pad"><div class="mb-4 flex flex-wrap items-center justify-between gap-3">' +
      '<h2 class="account-card-title">Thông báo tài khoản</h2><button class="account-button" data-action="read-all">Đánh dấu tất cả đã đọc</button></div>' +
      (list.length ? list.map(function (item, index) {
        return '<article class="account-list-row"><div class="min-w-0"><div class="flex items-center gap-2"><span class="account-badge">' +
          escapeHtml(item.type || 'Cập nhật') + '</span>' + (!item.read ? '<span class="h-2 w-2 rounded-full bg-brand"></span>' : '') +
          '</div><p class="mt-2 text-xs font-extrabold">' + escapeHtml(item.title) + '</p><p class="account-muted mt-1">' +
          escapeHtml(item.message) + '</p><p class="mt-1 text-[10px] text-slate-400">' + dateText(item.createdAt) + '</p></div>' +
          '<div class="flex gap-2">' + (!item.read ? '<button class="account-button" data-action="read-notification" data-index="' + index + '">Đã đọc</button>' : '') +
          '<button class="account-button account-button-danger" data-action="delete-notification" data-index="' + index + '">Xóa</button></div></article>';
      }).join('') : emptyState('♧', 'Thông báo của bạn sẽ hiển thị tại đây.')) + '</section>';
  }

  function supportHtml() {
    var faqs = [
      ['Tôi xem trạng thái đơn hàng ở đâu?', 'Mở mục Quản lý đơn hàng. Đơn hàng chỉ hiển thị khi được tạo từ đúng tài khoản đang đăng nhập.'],
      ['Làm sao yêu cầu bảo hành?', 'Chọn mục Bảo hành và đổi trả để gửi yêu cầu theo đơn hàng đã giao. Cửa hàng sẽ cần xác nhận thông tin thực tế.'],
      ['Giỏ hàng của tôi có được chia sẻ không?', 'Không. Giỏ hàng dùng khóa localStorage riêng theo định danh tài khoản.']
    ];
    return '<div class="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><section class="account-card account-card-pad">' +
      '<h2 class="account-card-title">Gửi yêu cầu hỗ trợ</h2><form data-form="support" class="mt-4 grid gap-3">' +
      '<div class="account-field"><label for="supportType">Chủ đề</label><select class="account-select" id="supportType" name="type">' +
      option('order', 'Hỏi về đơn hàng') + option('product', 'Tư vấn sản phẩm') + option('complaint', 'Khiếu nại') + option('other', 'Khác') + '</select></div>' +
      field('Mã đơn (nếu có)', 'orderId', '', 'text', 'VD: VLU-...') +
      '<div class="account-field"><label for="supportMessage">Nội dung</label><textarea class="account-textarea" id="supportMessage" name="message" required placeholder="Mô tả yêu cầu của bạn"></textarea></div>' +
      '<button class="account-button account-button-primary justify-self-start" type="submit">Gửi yêu cầu</button>' +
      '<p class="account-muted">Yêu cầu được lưu trên thiết bị này; trang chưa kết nối hệ thống ticket/email hỗ trợ.</p></form></section>' +
      '<div class="space-y-5"><section class="account-card account-card-pad"><h2 class="account-card-title">Câu hỏi thường gặp</h2>' +
      faqs.map(function (faq) { return '<details class="mt-3 rounded-xl bg-slate-50/80 p-3"><summary class="cursor-pointer text-xs font-extrabold">' +
        escapeHtml(faq[0]) + '</summary><p class="account-muted mt-2">' + escapeHtml(faq[1]) + '</p></details>'; }).join('') +
      '</section><section class="account-card account-card-pad"><h2 class="account-card-title">Yêu cầu đã gửi</h2>' +
      (store.tickets.length ? store.tickets.slice().reverse().map(ticketRow).join('') : '<p class="account-muted mt-2">Chưa có yêu cầu hỗ trợ.</p>') +
      '</section></div></div>';
  }

  function settingsHtml() {
    return '<section class="account-card account-card-pad"><h2 class="account-card-title">Tùy chọn thông báo</h2>' +
      settingRow('orderUpdates', 'Cập nhật trạng thái đơn hàng') + settingRow('promotions', 'Email ưu đãi và tiếp thị') +
      settingRow('emailUpdates', 'Thông tin dịch vụ qua email') +
      '<div class="mt-6 border-t border-slate-100 pt-5"><h3 class="account-card-title">Bảo mật và quyền riêng tư</h3>' +
      '<p class="account-muted mt-2">Phiên xác thực hiện được lưu trong localStorage của trình duyệt; chưa có quản lý phiên/mật khẩu trên máy chủ.</p>' +
      '<div class="mt-4 flex flex-wrap items-center gap-2"><span class="account-muted">Chính sách và điều khoản chưa được cấu hình trên website.</span>' +
      '<button class="account-button account-button-danger" data-action="request-delete">Yêu cầu xóa tài khoản</button></div>' +
      (store.profile.deleteRequested ? '<p class="mt-3 text-xs font-bold text-amber-700">Đã ghi nhận yêu cầu trên thiết bị; tài khoản chưa bị xóa khỏi hệ thống.</p>' : '') +
      '</div></section>';
  }

  function settingRow(key, label) {
    return '<label class="account-list-row cursor-pointer"><span class="text-xs font-bold text-slate-700">' + escapeHtml(label) +
      '</span><input type="checkbox" data-setting="' + key + '"' + (store.settings[key] ? ' checked' : '') + '></label>';
  }

  function tabContent() {
    if (activeTab === 'overview') return overviewHtml();
    if (activeTab === 'profile') return profileHtml();
    if (activeTab === 'orders') return ordersHtml();
    if (activeTab === 'addresses') return addressesHtml();
    if (activeTab === 'wishlist') return productCollectionHtml(store.wishlist, 'wishlist') +
      '<div class="mt-4 flex justify-end"><button class="account-button account-button-danger" data-action="clear-wishlist">Xóa danh sách yêu thích</button></div>';
    if (activeTab === 'recent') return productCollectionHtml(store.recent, 'recent') +
      '<div class="mt-4 flex justify-end"><button class="account-button account-button-danger" data-action="clear-recent">Xóa lịch sử xem</button></div>';
    if (activeTab === 'compare') return compareHtml();
    if (activeTab === 'warranty') return warrantyHtml();
    if (activeTab === 'history') return historyHtml();
    if (activeTab === 'reviews') return reviewsHtml();
    if (activeTab === 'vouchers') return vouchersHtml();
    if (activeTab === 'points') return pointsHtml();
    if (activeTab === 'notifications') return notificationsHtml();
    if (activeTab === 'support') return supportHtml();
    if (activeTab === 'settings') return settingsHtml();
    return '<section class="account-card account-card-pad">' + emptyState('↪', 'Đăng xuất khỏi tài khoản hiện tại?', 'Đăng xuất', '#') +
      '<div class="mt-4 text-center"><button class="account-button account-button-danger" data-action="logout">Đăng xuất và về trang chủ</button></div></section>';
  }

  function render() {
    var item = NAV_ITEMS.find(function (entry) { return entry.id === activeTab; }) || NAV_ITEMS[0];
    activeTab = item.id;
    renderNav();
    updateIdentity();
    document.getElementById('pageTitle').textContent = item.label;
    document.getElementById('pageSubtitle').textContent = item.subtitle;
    document.getElementById('accountPanel').innerHTML = tabContent();
  }

  function setTab(id) {
    if (id === 'logout') {
      logout();
      return;
    }
    if (!NAV_ITEMS.some(function (item) { return item.id === id; })) return;
    activeTab = id;
    var url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    window.history.replaceState({}, '', url);
    document.getElementById('accountSidebar').classList.remove('is-open');
    document.getElementById('mobileNavToggle').setAttribute('aria-expanded', 'false');
    render();
  }

  function saveOrders(list) {
    try {
      localStorage.setItem('vlu_orders', JSON.stringify(list));
      return true;
    } catch (error) {
      console.error('[AccountPage] Không thể cập nhật đơn hàng:', error);
      notify('Không thể cập nhật đơn hàng trên thiết bị.', true);
      return false;
    }
  }

  function addToCart(id) {
    var product = findProduct(id);
    if (!product || !window.VLU_CART) {
      notify('Sản phẩm hoặc dịch vụ giỏ hàng hiện không khả dụng.', true);
      return;
    }
    var color = product.colors && product.colors[0] ? product.colors[0] : {};
    var variant = product.variants && product.variants[0] ? product.variants[0] : {};
    window.VLU_CART.addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: (Number(product.basePrice) || 0) + (Number(variant.delta) || 0),
      image: productImage(product),
      color: color.name || 'Mặc định',
      variant: variant.label || 'Tiêu chuẩn',
      quantity: 1
    });
    updateIdentity();
    notify('Đã thêm sản phẩm vào giỏ hàng.');
  }

  function logout() {
    if (window.VLU_AUTH && typeof window.VLU_AUTH.logout === 'function') {
      window.VLU_AUTH.logout();
    } else {
      localStorage.removeItem('vlu_user');
    }
    window.location.href = 'index.php';
  }

  function downloadInvoice(orderId) {
    var order = orders().find(function (entry) { return String(entry.id) === String(orderId); });
    if (!order) return;
    var lines = [
      'VLU FLAGSHIP STORE',
      'HÓA ĐƠN THAM KHẢO (dữ liệu trên thiết bị)',
      'Mã đơn: ' + order.id,
      'Ngày đặt: ' + dateText(order.created_at),
      'Khách hàng: ' + (order.customer_name || ''),
      'Địa chỉ: ' + (order.customer_address || ''),
      '',
      'Sản phẩm | Số lượng | Đơn giá'
    ];
    orderItems(order).forEach(function (item) {
      lines.push([item.name, item.quantity || 1, money(item.price)].join(' | '));
    });
    lines.push('', 'Tổng cộng: ' + money(order.total));
    var blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'VLU-' + String(order.id).replace(/[^a-z0-9_-]/gi, '') + '-hoa-don.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function readSmallImage(file, done) {
    if (!file) return done('');
    if (file.size > 1024 * 1024) {
      notify('Ảnh tối đa 1 MB để lưu an toàn trên thiết bị.', true);
      return done('');
    }
    var reader = new FileReader();
    reader.onload = function () { done(String(reader.result || '')); };
    reader.onerror = function () {
      console.error('[AccountPage] Không thể đọc ảnh đã chọn.');
      notify('Không thể đọc ảnh đã chọn.', true);
      done('');
    };
    reader.readAsDataURL(file);
  }

  function bindEvents() {
    document.getElementById('accountNav').addEventListener('click', function (event) {
      var button = event.target.closest('[data-tab]');
      if (button) setTab(button.dataset.tab);
    });
    document.getElementById('mobileNavToggle').addEventListener('click', function () {
      var sidebar = document.getElementById('accountSidebar');
      var open = sidebar.classList.toggle('is-open');
      this.setAttribute('aria-expanded', String(open));
    });
    document.getElementById('accountPanel').addEventListener('click', function (event) {
      var tabButton = event.target.closest('[data-tab]');
      if (tabButton) {
        setTab(tabButton.dataset.tab);
        return;
      }
      var button = event.target.closest('[data-action]');
      if (!button) return;
      var action = button.dataset.action;
      var id = button.dataset.id;
      var index = Number(button.dataset.index);

      if (action === 'add-cart') addToCart(id);
      if (action === 'toggle-address-form') { addressFormOpen = !addressFormOpen; render(); }
      if (action === 'default-address') {
        store.addresses = store.addresses.map(function (address, i) {
          address.default = i === index;
          return address;
        });
        saveStore(); render();
      }
      if (action === 'delete-address' && window.confirm('Xóa địa chỉ này khỏi sổ địa chỉ?')) {
        store.addresses.splice(index, 1);
        if (!store.addresses.some(function (address) { return address.default; }) && store.addresses[0]) store.addresses[0].default = true;
        saveStore(); render();
      }
      if (action === 'remove-wishlist') {
        store.wishlist = store.wishlist.filter(function (itemId) { return itemId !== id; });
        saveStore(); render();
      }
      if (action === 'clear-wishlist' && window.confirm('Xóa tất cả sản phẩm yêu thích?')) {
        store.wishlist = []; saveStore(); render();
      }
      if (action === 'remove-recent') {
        store.recent = store.recent.filter(function (itemId) { return itemId !== id; });
        saveStore(); render();
      }
      if (action === 'clear-recent' && window.confirm('Xóa toàn bộ lịch sử đã xem?')) {
        store.recent = []; saveStore(); render();
      }
      if (action === 'toggle-compare') {
        if (store.compare.indexOf(id) !== -1) store.compare = store.compare.filter(function (itemId) { return itemId !== id; });
        else if (store.compare.length < 4) store.compare.push(id);
        else return notify('Có thể so sánh tối đa 4 sản phẩm.', true);
        saveStore(); notify('Đã cập nhật danh sách so sánh.'); render();
      }
      if (action === 'remove-compare') { store.compare = store.compare.filter(function (itemId) { return itemId !== id; }); saveStore(); render(); }
      if (action === 'clear-compare') { store.compare = []; saveStore(); render(); }
      if (action === 'order-detail') { selectedOrder = selectedOrder === id ? '' : id; render(); }
      if (action === 'cancel-order') {
        if (!window.confirm('Hủy đơn hàng đang chờ xác nhận?')) return;
        var all = readJson('vlu_orders', []);
        var order = all.find(function (entry) { return String(entry.id) === id && String(entry.user_id || '') === currentIdentity(currentUser); });
        if (order && String(order.status).toLowerCase() === 'pending') {
          order.status = 'cancelled';
          if (saveOrders(all)) { notify('Đơn hàng đã được đánh dấu hủy trên thiết bị.'); render(); }
        } else notify('Chỉ đơn đang chờ xác nhận mới có thể hủy.', true);
      }
      if (action === 'buy-again') {
        var order = orders().find(function (entry) { return String(entry.id) === id; });
        if (!order) return;
        orderItems(order).forEach(function (item) {
          if (!window.VLU_CART) return;
          window.VLU_CART.addItem({
            id: item.id, name: item.name, category: item.category,
            price: item.price, image: item.image, color: item.color, variant: item.variant, quantity: item.quantity || 1
          });
        });
        notify('Đã thêm các sản phẩm còn dữ liệu vào giỏ hàng.');
        updateIdentity();
      }
      if (action === 'download-invoice') downloadInvoice(id);
      if (action === 'warranty-request') {
        var orderForRequest = orders().find(function (entry) { return String(entry.id) === id; });
        if (orderForRequest) {
          store.tickets.push({
            id: 'W-' + Date.now(), type: 'warranty', typeLabel: 'Bảo hành / đổi trả',
            subject: 'Yêu cầu đơn #' + id, orderId: id, message: 'Chờ cửa hàng kiểm tra.',
            status: 'Đã lưu trên thiết bị', createdAt: new Date().toISOString()
          });
          saveStore(); notify('Đã lưu yêu cầu. Vui lòng liên hệ cửa hàng để được tiếp nhận chính thức.'); render();
        }
      }
      if (action === 'copy-voucher') {
        var code = button.dataset.code;
        var copy = navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(code)
          : Promise.reject(new Error('Clipboard API không khả dụng'));
        copy.then(function () { notify('Đã sao chép mã ' + code + '.'); })
          .catch(function () { window.prompt('Sao chép mã ưu đãi:', code); });
      }
      if (action === 'read-all') { store.notifications.forEach(function (item) { item.read = true; }); saveStore(); render(); }
      if (action === 'read-notification') { if (store.notifications[index]) store.notifications[index].read = true; saveStore(); render(); }
      if (action === 'delete-notification') { store.notifications.splice(index, 1); saveStore(); render(); }
      if (action === 'delete-review') { store.reviews = store.reviews.filter(function (review) { return review.id !== id; }); saveStore(); render(); }
      if (action === 'redeem-points') {
        if (store.points < 100) return notify('Chưa đủ điểm để đổi voucher.', true);
        store.points -= 100;
        store.usedVouchers.push('POINTS-' + Date.now());
        saveStore(); notify('Đã trừ 100 điểm. Voucher cần được cửa hàng xác nhận.'); render();
      }
      if (action === 'request-delete' && window.confirm('Gửi yêu cầu xóa tài khoản? Tài khoản không bị xóa tự động.')) {
        store.profile.deleteRequested = true; saveStore(); render();
        notify('Đã ghi nhận yêu cầu trên thiết bị. Hãy liên hệ cửa hàng để xử lý chính thức.');
      }
      if (action === 'logout') logout();
    });

    document.getElementById('accountPanel').addEventListener('input', function (event) {
      if (event.target.id === 'orderSearch') {
        orderSearch = event.target.value;
        var cursor = event.target.selectionStart;
        var list = filteredOrders();
        var rows = document.getElementById('orderRows');
        if (rows) rows.innerHTML = list.length ? list.map(orderRow).join('') : emptyState('▤', 'Không tìm thấy đơn hàng phù hợp.');
        event.target.setSelectionRange(cursor, cursor);
      }
    });

    document.getElementById('accountPanel').addEventListener('change', function (event) {
      if (event.target.matches('[data-setting]')) {
        store.settings[event.target.dataset.setting] = event.target.checked;
        saveStore();
      }
      if (event.target.id === 'orderDateFilter') {
        orderDateFilter = event.target.value;
        var list = filteredOrders();
        var rows = document.getElementById('orderRows');
        if (rows) rows.innerHTML = list.length ? list.map(orderRow).join('') : emptyState('▤', 'Không có đơn hàng trong khoảng thời gian này.');
      }
      if (event.target.matches('[data-profile-avatar]') && event.target.files[0]) {
        readSmallImage(event.target.files[0], function (image) {
          if (!image) return;
          store.profile.avatar = image; saveStore(); render();
        });
      }
    });

    document.getElementById('accountPanel').addEventListener('submit', function (event) {
      var form = event.target.closest('form[data-form]');
      if (!form) return;
      event.preventDefault();
      var formData = new FormData(form);

      if (form.dataset.form === 'profile') {
        var fullname = String(formData.get('fullname') || '').trim();
        var email = String(formData.get('email') || '').trim();
        var phone = String(formData.get('phone') || '').trim();
        if (!fullname || !email) return notify('Vui lòng nhập họ tên và email.', true);
        currentUser.fullname = fullname;
        currentUser.email = email;
        currentUser.phone = phone;
        store.profile = Object.assign({}, store.profile, {
          fullname: fullname, email: email, phone: phone,
          birthday: String(formData.get('birthday') || ''),
          gender: String(formData.get('gender') || '')
        });
        try {
          localStorage.setItem('vlu_user', JSON.stringify(currentUser));
          saveStore();
          if (window.VLU_AUTH) window.VLU_AUTH.updateHeaderAuth();
          notify('Thông tin cá nhân đã được cập nhật.');
          render();
        } catch (error) {
          console.error('[AccountPage] Không thể cập nhật thông tin người dùng:', error);
          notify('Không thể lưu thông tin tài khoản.', true);
        }
      }

      if (form.dataset.form === 'address') {
        var address = {
          id: 'A-' + Date.now(),
          name: String(formData.get('name') || '').trim(),
          phone: String(formData.get('phone') || '').trim(),
          address: String(formData.get('address') || '').trim(),
          default: Boolean(formData.get('default')) || store.addresses.length === 0
        };
        if (!address.name || !address.address) return notify('Vui lòng nhập tên người nhận và địa chỉ.', true);
        if (address.default) store.addresses.forEach(function (item) { item.default = false; });
        store.addresses.push(address);
        saveStore(); addressFormOpen = false; render(); notify('Đã lưu địa chỉ.');
      }

      if (form.dataset.form === 'support') {
        var message = String(formData.get('message') || '').trim();
        if (!message) return notify('Vui lòng nhập nội dung yêu cầu.', true);
        var type = String(formData.get('type') || 'other');
        var typeLabels = { order: 'Hỏi về đơn hàng', product: 'Tư vấn sản phẩm', complaint: 'Khiếu nại', other: 'Khác' };
        store.tickets.push({
          id: 'S-' + Date.now(), type: type, typeLabel: typeLabels[type] || type,
          subject: typeLabels[type] || 'Yêu cầu hỗ trợ',
          orderId: String(formData.get('orderId') || ''),
          message: message, status: 'Đã lưu trên thiết bị', createdAt: new Date().toISOString()
        });
        saveStore(); render(); notify('Yêu cầu đã lưu trên thiết bị. Chưa gửi tới hệ thống hỗ trợ.');
      }

      if (form.dataset.form === 'review') {
        var comment = String(formData.get('comment') || '').trim();
        if (!comment) return notify('Vui lòng nhập nhận xét.', true);
        var reviewId = form.dataset.reviewId;
        var reviewData = {
          id: reviewId,
          name: reviewId.split(':').slice(1).join(':'),
          rating: Math.max(1, Math.min(5, Number(formData.get('rating')) || 5)),
          comment: comment,
          createdAt: new Date().toISOString()
        };
        var imageFile = form.querySelector('[name="reviewImage"]');
        readSmallImage(imageFile && imageFile.files[0], function (image) {
          if (image) reviewData.image = image;
          store.reviews = store.reviews.filter(function (review) { return review.id !== reviewId; });
          store.reviews.push(reviewData);
          saveStore(); render(); notify('Đã lưu đánh giá trên thiết bị.');
        });
      }
    });

    document.getElementById('accountPanel').addEventListener('click', function (event) {
      var filterButton = event.target.closest('[data-order-filter]');
      if (filterButton) {
        orderFilter = filterButton.dataset.orderFilter;
        render();
      }
    });
  }

  function recordCurrentProduct() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id || !findProduct(id)) return;
    store.recent = [id].concat(store.recent.filter(function (itemId) { return itemId !== id; })).slice(0, 24);
    saveStore();
  }

  function init() {
    currentUser = readJson('vlu_user', null);
    if (!currentUser || !currentUser.username) {
      window.location.replace('login.html?next=' + encodeURIComponent('account.html'));
      return;
    }
    userKey = 'vlu_account_' + currentIdentity(currentUser);
    store = normalizeStore(readJson(userKey, {}));
    if (store.profile.fullname) currentUser.fullname = store.profile.fullname;
    if (store.profile.email) currentUser.email = store.profile.email;
    if (store.profile.phone) currentUser.phone = store.profile.phone;
    recordCurrentProduct();
    render();
    bindEvents();
    window.addEventListener('storage', function (event) {
      if (event.key === 'vlu_user') {
        currentUser = readJson('vlu_user', null);
        if (!currentUser || currentIdentity(currentUser) !== userKey.replace(/^vlu_account_/, '')) {
          window.location.replace('login.html');
          return;
        }
      }
      if (event.key === 'vlu_orders') render();
    });
    window.addEventListener('vlu:cart-updated', updateIdentity);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);
