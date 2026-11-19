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

  var ORDER_PIPELINE_STEPS = [
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'preparing', label: 'Đang chuẩn bị' },
    { key: 'handed_over', label: 'Đã bàn giao vận chuyển' },
    { key: 'shipping', label: 'Đang giao hàng' },
    { key: 'completed', label: 'Giao thành công' }
  ];

  var STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    processing: 'Đang chuẩn bị',
    handed_over: 'Đã bàn giao vận chuyển',
    handedover: 'Đã bàn giao vận chuyển',
    dispatched: 'Đã bàn giao vận chuyển',
    shipping: 'Đang giao hàng',
    delivering: 'Đang giao hàng',
    completed: 'Giao thành công',
    delivered: 'Giao thành công',
    cancelled: 'Đã hủy',
    canceled: 'Đã hủy',
    returned: 'Yêu cầu đổi trả',
    return: 'Yêu cầu đổi trả'
  };

  var STATUS_RANK = {
    pending: 1,
    confirmed: 2,
    preparing: 3,
    handed_over: 4,
    shipping: 5,
    completed: 6,
    cancelled: 7,
    returned: 7
  };

  var STATUS_TABS = [
    ['all', 'Tất cả'],
    ['pending', 'Chờ xác nhận'],
    ['processing', 'Đang chuẩn bị'],
    ['shipping', 'Đang giao'],
    ['completed', 'Đã giao thành công'],
    ['cancelled', 'Đã hủy'],
    ['returned', 'Yêu cầu đổi trả']
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
  var addressEditIndex = -1;
  var selectedOrder = '';
  var lastBackendSyncAt = 0;
  var compareSearch = '';
  var historyFilter = { day: '', month: '', year: '' };
  var warrantyFormOpen = false;
  var warrantyRequestType = 'warranty';
  var warrantySelectedPurchase = '';
  var reviewTab = 'pending';
  var editingReviewId = '';
  var voucherFilter = 'available';
  var notificationFilter = 'all';

  function normalizeOrderKey(code) {
    return String(code == null ? '' : code).replace(/^#+/, '').trim().toUpperCase();
  }

  function formatOrderCode(code) {
    var key = normalizeOrderKey(code);
    return key ? ('#' + key) : '';
  }

  function normalizeOrderStatus(status) {
    var s = String(status || 'pending').trim().toLowerCase();
    if (s === 'confirmed') return 'confirmed';
    if (s === 'preparing' || s === 'processing') return 'preparing';
    if (s === 'handed_over' || s === 'handedover' || s === 'dispatched') return 'handed_over';
    if (s === 'shipping' || s === 'delivering') return 'shipping';
    if (s === 'completed' || s === 'delivered') return 'completed';
    if (s === 'cancelled' || s === 'canceled') return 'cancelled';
    if (s === 'returned' || s === 'return') return 'returned';
    return 'pending';
  }

  function getStatusRank(status) {
    return STATUS_RANK[normalizeOrderStatus(status)] || 1;
  }

  function parseTimestampMs(value) {
    if (!value) return 0;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? 0 : value.getTime();
    var str = String(value).trim();
    if (!str) return 0;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(str)) {
      str = str.replace(' ', 'T');
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      str = str + 'T00:00:00';
    }
    var ms = new Date(str).getTime();
    return Number.isNaN(ms) ? 0 : ms;
  }

  function normalizeOrderRecord(order) {
    if (!order || typeof order !== 'object') return null;
    var formattedCode = formatOrderCode(order.order_code || order.id);
    if (!formattedCode) return null;
    var normStatus = normalizeOrderStatus(order.status);
    var copy = Object.assign({}, order);
    if (typeof order.id === 'number' && !copy.db_id) {
      copy.db_id = order.id;
    }
    copy.id = formattedCode;
    copy.order_code = formattedCode;
    copy.status = normStatus;
    copy.payment_status = String(order.payment_status || (normStatus === 'completed' ? 'paid' : 'pending'));
    copy.cancel_reason = String(order.cancel_reason || '');
    copy.status_history = Array.isArray(order.status_history) ? order.status_history.slice() : [];
    copy.items = Array.isArray(order.items) ? order.items.slice() : [];
    return copy;
  }

  function mergeStatusHistories(histA, histB) {
    var combined = [];
    var seen = {};
    [histA, histB].forEach(function (list) {
      if (!Array.isArray(list)) return;
      list.forEach(function (ev) {
        if (!ev || typeof ev !== 'object' || !ev.status) return;
        var norm = normalizeOrderStatus(ev.status);
        var key = norm + '|' + String(ev.timestamp || '');
        if (seen[key]) return;
        seen[key] = true;
        combined.push(Object.assign({}, ev, { status: norm }));
      });
    });
    combined.sort(function (a, b) {
      return parseTimestampMs(a.timestamp) - parseTimestampMs(b.timestamp);
    });
    return combined;
  }

  function mergeOrderRecords(existing, incoming, incomingFromServer) {
    var a = normalizeOrderRecord(existing);
    var b = normalizeOrderRecord(incoming);
    if (!a) return b;
    if (!b) return a;

    var rankA = getStatusRank(a.status);
    var rankB = getStatusRank(b.status);
    var updA = parseTimestampMs(a.updated_at);
    var updB = parseTimestampMs(b.updated_at);
    var tsA = parseTimestampMs(a.updated_at || a.created_at);
    var tsB = parseTimestampMs(b.updated_at || b.created_at);

    var incomingWins = false;
    if (rankB > rankA) {
      incomingWins = true;
    } else if (rankA > rankB) {
      incomingWins = false;
    } else if (updB > updA) {
      incomingWins = true;
    } else if (updA > updB) {
      incomingWins = false;
    } else if (tsB > tsA) {
      incomingWins = true;
    } else if (tsA > tsB) {
      incomingWins = false;
    } else {
      incomingWins = Boolean(incomingFromServer);
    }

    var winner = incomingWins ? b : a;
    var loser = incomingWins ? a : b;
    var canonicalCode = formatOrderCode(winner.order_code || winner.id || loser.order_code || loser.id);
    var mergedUpdatedAt = updB >= updA
      ? (b.updated_at || a.updated_at || winner.created_at || loser.created_at || '')
      : (a.updated_at || b.updated_at || winner.created_at || loser.created_at || '');

    var merged = Object.assign({}, loser, winner, {
      id: canonicalCode,
      order_code: canonicalCode,
      db_id: winner.db_id || loser.db_id || 0,
      status: normalizeOrderStatus(winner.status),
      payment_status: winner.payment_status || loser.payment_status || (normalizeOrderStatus(winner.status) === 'completed' ? 'paid' : 'pending'),
      cancel_reason: winner.cancel_reason || loser.cancel_reason || '',
      status_history: mergeStatusHistories(loser.status_history, winner.status_history),
      items: (Array.isArray(winner.items) && winner.items.length) ? winner.items : (Array.isArray(loser.items) ? loser.items : []),
      updated_at: mergedUpdatedAt
    });
    return merged;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function getAuthenticatedUser() {
    var user = null;
    if (window.VLU_AUTH && typeof window.VLU_AUTH.getUser === 'function') {
      user = window.VLU_AUTH.getUser();
    } else {
      user = readJson('vlu_user', null);
    }
    if (!user || typeof user !== 'object') return null;
    if (user.isGuest === true) return null;
    var idStr = String(user.id == null ? '' : user.id).trim().toLowerCase();
    var uname = String(user.username || '').trim().toLowerCase();
    var email = String(user.email || '').trim().toLowerCase();
    if (idStr === 'guest' || uname === 'guest' || email === 'guest@vluflagship.vn') return null;
    var numId = Number(user.id);
    if (!Number.isFinite(numId) || numId <= 0) return null;
    return user;
  }

  function redirectGuestToLogin() {
    try {
      localStorage.removeItem('vlu_orders_guest');
      localStorage.removeItem('vlu_account_guest');
    } catch (e) {}
    if (window.location && typeof window.location.replace === 'function') {
      window.location.replace('login.html?next=account.html');
    } else {
      window.location.href = 'login.html?next=account.html';
    }
  }

  function currentIdentity(user) {
    if (!user || user.isGuest) return '';
    var numId = Number(user.id);
    if (!Number.isFinite(numId) || numId <= 0) return '';
    return String(numId);
  }

  function isOrderOwnedByUser(order, user) {
    if (!order || !user) return false;
    var uid = currentIdentity(user);
    if (!uid) return false;
    var rawOrderUid = String(order.user_id == null ? '' : order.user_id).trim().toLowerCase();
    var rawDbUid = order.db_user_id != null ? String(order.db_user_id).trim().toLowerCase() : '';
    var rawOrderIdent = String(order.user_identity == null ? '' : order.user_identity).trim().toLowerCase();
    if (rawOrderUid === 'guest' || rawOrderIdent === 'guest') return false;
    if (rawOrderUid === '' && rawDbUid === '' && rawOrderIdent === '') return false;
    if (rawOrderUid === uid || rawDbUid === uid) return true;
    var uname = String(user.username || '').trim().toLowerCase();
    var uemail = String(user.email || '').trim().toLowerCase();
    if (uname && (rawOrderUid === uname || rawOrderIdent === uname)) return true;
    if (uemail && (rawOrderUid === uemail || rawOrderIdent === uemail)) return true;
    return false;
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
      orders: Array.isArray(data.orders) ? data.orders : null,
      addresses: Array.isArray(data.addresses) ? data.addresses : [],
      wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
      recent: Array.isArray(data.recent) ? data.recent : [],
      compare: Array.isArray(data.compare) ? data.compare.slice(0, 3) : [],
      reviews: Array.isArray(data.reviews) ? data.reviews : [],
      tickets: Array.isArray(data.tickets) ? data.tickets : [],
      notifications: Array.isArray(data.notifications) ? data.notifications : [],
      usedVouchers: Array.isArray(data.usedVouchers) ? data.usedVouchers : [],
      vouchers: Array.isArray(data.vouchers) ? data.vouchers : [],
      pointLedger: Array.isArray(data.pointLedger) ? data.pointLedger : [],
      supportTickets: Array.isArray(data.supportTickets) ? data.supportTickets : [],
      points: Number(data.points) || 0,
      settings: Object.assign({ orderUpdates: true, promotions: false, emailUpdates: true, pushNotifications: true, privateHistory: false }, data.settings || {}),
      profile: data.profile && typeof data.profile === 'object' ? data.profile : {}
    };
  }

  function ensureAccountRewards() {
    var defaults = [
      { code: 'VLU2026', value: 500000, type: 'fixed', minOrder: 1000000, expiresAt: '2026-12-31', source: 'welcome' },
      { code: 'FLAGSHIP', value: 1000000, type: 'fixed', minOrder: 15000000, expiresAt: '2026-12-31', source: 'member' },
      { code: 'FLAGSHIP500K', value: 500000, type: 'fixed', minOrder: 5000000, expiresAt: '2026-12-31', source: 'campaign' },
      { code: 'SVVLU10', value: 10, type: 'percent', minOrder: 1000000, expiresAt: '2026-12-31', source: 'student' },
      { code: 'APPLEVIP', value: 800000, type: 'fixed', minOrder: 10000000, expiresAt: '2026-12-31', source: 'campaign' },
      { code: 'FREESHIP', value: 0, type: 'fixed', minOrder: 0, expiresAt: '2026-12-31', source: 'campaign' }
    ];
    var adminVouchers = readJson('vlu_admin_vouchers', null);
    var hasAdminSource = Array.isArray(adminVouchers);
    var activeAdminVouchers = hasAdminSource
      ? adminVouchers.filter(function (v) { return v && v.code && !v.deleted && String(v.status || 'active') !== 'inactive'; })
      : defaults;
    var activeCodes = {};
    var changed = false;

    activeAdminVouchers.forEach(function (voucher) {
      var code = String(voucher.code).trim().toUpperCase();
      activeCodes[code] = true;
      var existing = store.vouchers.find(function (item) { return String(item.code || '').toUpperCase() === code; });
      if (!existing) {
        store.vouchers.push({
          code: code,
          value: Number(voucher.value) || 0,
          type: voucher.type || 'fixed',
          maxDiscount: Number(voucher.maxDiscount) || 0,
          minOrder: Number(voucher.minOrder) || 0,
          expiresAt: voucher.expiresAt || '2026-12-31',
          source: voucher.source || 'store',
          label: voucher.label || ''
        });
        changed = true;
      } else {
        existing.value = Number(voucher.value) || 0;
        existing.type = voucher.type || existing.type || 'fixed';
        existing.maxDiscount = Number(voucher.maxDiscount) || 0;
        existing.minOrder = Number(voucher.minOrder) || 0;
        existing.expiresAt = voucher.expiresAt || existing.expiresAt || '2026-12-31';
        if (voucher.label) existing.label = voucher.label;
      }
    });

    if (hasAdminSource) {
      var beforeLen = store.vouchers.length;
      store.vouchers = store.vouchers.filter(function (item) {
        if (!item) return false;
        if (item.source === 'points' || store.usedVouchers.indexOf(item.code) !== -1) return true;
        return Boolean(activeCodes[String(item.code || '').toUpperCase()]);
      });
      if (store.vouchers.length !== beforeLen) changed = true;
    }

    store.vouchers.forEach(function (voucher) {
      if (store.usedVouchers.indexOf(voucher.code) !== -1) voucher.status = 'used';
      else if (voucher.expiresAt && new Date(voucher.expiresAt + 'T23:59:59').getTime() < Date.now()) voucher.status = 'expired';
      else if (voucher.status !== 'used') voucher.status = 'available';
    });
    if (changed) saveStore();
  }

  function awardPoints(source, amount, description) {
    if (store.pointLedger.some(function (entry) { return entry.source === source; })) return;
    var points = Math.max(0, Number(amount) || 0);
    if (!points) return;
    store.pointLedger.push({ id: 'P-' + Date.now(), source: source, points: points, description: description, createdAt: new Date().toISOString() });
    store.points += points;
  }

  function reconcilePoints() {
    var changed = false;
    orders().forEach(function (order) {
      if (normalizeOrderStatus(order.status) !== 'completed') return;
      var formattedId = formatOrderCode(order.order_code || order.id);
      var source = 'order:' + formattedId;
      var altSource = 'order:' + normalizeOrderKey(formattedId);
      if (!store.pointLedger.some(function (entry) { return entry.source === source || entry.source === altSource || entry.source === ('order:' + order.id); })) {
        awardPoints(source, Math.floor((Number(order.total) || 0) / 100000), 'Mua hàng ' + formattedId);
        changed = true;
      }
    });
    store.reviews.forEach(function (review) {
      var source = 'review:' + review.id;
      if (!store.pointLedger.some(function (entry) { return entry.source === source; })) {
        awardPoints(source, 50, 'Đánh giá ' + (review.name || 'sản phẩm'));
        changed = true;
      }
    });
    if (changed) saveStore();
  }

  function addNotification(type, title, message) {
    store.notifications.unshift({ id: 'N-' + Date.now(), type: type, title: title, message: message, read: false, createdAt: new Date().toISOString() });
    store.notifications = store.notifications.slice(0, 100);
    saveStore();
  }

  function notify(message, isError) {
    var toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.remove('opacity-0', 'bg-ink');
      toast.classList.add('opacity-100', isError ? 'bg-red-700' : 'bg-ink');
      window.clearTimeout(notify.timer);
      notify.timer = window.setTimeout(function () {
        toast.classList.remove('opacity-100', 'bg-red-700');
        toast.classList.add('opacity-0', 'bg-ink');
      }, 3600);
      return;
    }
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

  function defaultAvatarMarkup(sizeClass) {
    return '<svg class="' + sizeClass + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.1 0-7.5 2.1-7.5 4.7V21h15v-2.3c0-2.6-3.4-4.7-7.5-4.7Z"/>' +
      '</svg>';
  }

  function localProductImage(image) {
    if (typeof image !== 'string' || !image || /^(?:https?:|data:|\/\/)/i.test(image) || image.indexOf('..') !== -1) return false;
    var clean = image.trim().replace(/^[\/\\]+/, '');
    return /^(?:SanPham|img|frontend\/assets\/images\/placeholders)\//i.test(clean) &&
      !/(^|\/)Banner\//i.test(clean);
  }

  function dateText(value) {
    if (!value) return '—';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return date.toLocaleDateString('vi-VN');
  }

  function dateAfterMonths(value, months) {
    var date = new Date(value || Date.now());
    if (Number.isNaN(date.getTime())) date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
  }

  function dateTimeText(value) {
    if (!value) return '—';
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleString('vi-VN');
  }

  function products() {
    return window.VLU_CATALOG || {};
  }

  function findProduct(id) {
    return products()[id] || null;
  }

  function productImage(product) {
    var raw = product && (product.image || product.img ||
      (product.colors && product.colors[0] && (product.colors[0].image || product.colors[0].img)));
    var resolver = window.resolveProductImageUrl || function (u) { return u; };
    if (!raw || !localProductImage(raw)) return PRODUCT_PLACEHOLDER;
    return resolver(raw, product ? product.category : 'phone');
  }

  function itemImage(item) {
    var raw = item && (item.image || item.img);
    var resolver = window.resolveProductImageUrl || function (u) { return u; };
    if (!raw || !localProductImage(raw)) return PRODUCT_PLACEHOLDER;
    return resolver(raw, item ? item.category : 'phone');
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
      oldPrice: Number(product.oldPrice) || 0,
      inStock: typeof product.stock === 'number' ? product.stock > 0 : true,
      image: productImage(product),
      tagline: product.tagline || '',
      specs: Array.isArray(product.specs) ? product.specs : [],
      highlights: Array.isArray(product.highlights) ? product.highlights : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      variantLabel: product.variantLabel || ''
    };
  }

  function persistMergedOrdersToStorage(mergedList) {
    var identity = currentIdentity(currentUser);
    if (!identity) return;
    try {
      localStorage.setItem('vlu_orders_' + identity, JSON.stringify(mergedList));
    } catch (e) {}

    try {
      var globalOrders = readJson('vlu_orders', []);
      if (!Array.isArray(globalOrders)) globalOrders = [];
      var updatedGlobal = globalOrders.slice();
      mergedList.forEach(function (ord) {
        var key = normalizeOrderKey(ord.order_code || ord.id);
        if (!key) return;
        var gIdx = updatedGlobal.findIndex(function (g) {
          return g && normalizeOrderKey(g.order_code || g.id) === key;
        });
        if (gIdx === -1) {
          updatedGlobal.unshift(ord);
        } else {
          updatedGlobal[gIdx] = mergeOrderRecords(updatedGlobal[gIdx], ord, true);
        }
      });
      localStorage.setItem('vlu_orders', JSON.stringify(updatedGlobal));
    } catch (eGlobal) {}

    if (store) {
      store.orders = mergedList;
      saveStore();
    }
  }

  function orderStateSignature(list) {
    if (!Array.isArray(list)) return '';
    return list.map(function (o) {
      if (!o) return '';
      return normalizeOrderKey(o.order_code || o.id) + ':' + normalizeOrderStatus(o.status) + ':' + String(o.updated_at || '') + ':' + String(o.cancel_reason || '');
    }).join('|');
  }

  function syncUserOrders(serverOrders, persistBack) {
    var identity = currentIdentity(currentUser);
    if (!identity) {
      if (store) store.orders = [];
      return [];
    }
    var accountOrders = Array.isArray(store && store.orders) ? store.orders : [];
    var userSpecificOrders = readJson('vlu_orders_' + identity, []);
    var globalOrders = readJson('vlu_orders', []);
    var prevAccountSig = orderStateSignature(accountOrders);
    var prevUserOrdersSig = orderStateSignature(userSpecificOrders);

    var mergedMap = {};
    var orderKeys = [];

    function mergeIfOwned(order, isFromServer) {
      if (!order || typeof order !== 'object') return;
      if (!isOrderOwnedByUser(order, currentUser)) return;
      var norm = normalizeOrderRecord(order);
      if (!norm) return;
      var idKey = normalizeOrderKey(norm.order_code || norm.id);
      if (!idKey) return;
      if (!mergedMap[idKey]) {
        mergedMap[idKey] = norm;
        orderKeys.push(idKey);
      } else {
        mergedMap[idKey] = mergeOrderRecords(mergedMap[idKey], norm, isFromServer);
      }
    }

    // Hợp nhất toàn bộ nguồn dữ liệu theo độ ưu tiên tiến trình trạng thái + updated_at mới nhất
    if (Array.isArray(accountOrders)) accountOrders.forEach(function (o) { mergeIfOwned(o, false); });
    if (Array.isArray(userSpecificOrders)) userSpecificOrders.forEach(function (o) { mergeIfOwned(o, false); });
    if (Array.isArray(globalOrders)) globalOrders.forEach(function (o) { mergeIfOwned(o, false); });
    if (Array.isArray(serverOrders)) serverOrders.forEach(function (o) { mergeIfOwned(o, true); });

    var mergedList = orderKeys.map(function (k) { return mergedMap[k]; });
    mergedList.sort(function (a, b) {
      return parseTimestampMs(b.created_at) - parseTimestampMs(a.created_at);
    });

    if (store) {
      store.orders = mergedList;
    }

    var nextSig = orderStateSignature(mergedList);
    if (persistBack === true || nextSig !== prevAccountSig || nextSig !== prevUserOrdersSig) {
      persistMergedOrdersToStorage(mergedList);
    }
    return mergedList;
  }

  function fetchOrdersFromBackend(options) {
    var opts = options && typeof options === 'object' ? options : {};
    if (typeof fetch !== 'function' || !currentUser) {
      return Promise.resolve(syncUserOrders());
    }
    var identity = currentIdentity(currentUser);
    if (!identity) {
      return Promise.resolve([]);
    }
    var now = Date.now();
    if (!opts.force && lastBackendSyncAt && (now - lastBackendSyncAt) < 1200) {
      return Promise.resolve(syncUserOrders());
    }
    lastBackendSyncAt = now;

    var userIdentParam = String(currentUser.username || currentUser.email || '').trim().toLowerCase();
    var listUrl = 'backend/api/orders.php?action=list&user_id=' + encodeURIComponent(identity) +
      '&user_identity=' + encodeURIComponent(userIdentParam) + '&_t=' + now;

    return fetch(listUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var serverOrders = (data && data.success && Array.isArray(data.orders)) ? data.orders : [];
        var targetKey = opts.orderCode ? normalizeOrderKey(opts.orderCode) : '';
        var hasTargetInList = !targetKey || serverOrders.some(function (o) {
          return o && normalizeOrderKey(o.order_code || o.id) === targetKey;
        });

        if (targetKey && !hasTargetInList) {
          var singleUrl = 'backend/api/orders.php?action=list&order_code=' + encodeURIComponent(targetKey) + '&_t=' + Date.now();
          return fetch(singleUrl, {
            method: 'GET',
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          })
            .then(function (r2) { return r2.json(); })
            .then(function (d2) {
              if (d2 && d2.success && Array.isArray(d2.orders) && d2.orders.length) {
                serverOrders = serverOrders.concat(d2.orders);
              }
              return serverOrders;
            })
            .catch(function () { return serverOrders; });
        }
        return serverOrders;
      })
      .then(function (serverOrders) {
        var mergedList = syncUserOrders(serverOrders, true);
        reconcilePoints();
        render();
        refreshOpenOrderModal();
        return mergedList;
      })
      .catch(function () {
        // Fallback giữ nguyên dữ liệu localStorage đã hợp nhất khi offline
        return syncUserOrders();
      });
  }

  function orders() {
    return syncUserOrders();
  }

  function statusLabel(status) {
    var norm = normalizeOrderStatus(status);
    return STATUS_LABELS[norm] || STATUS_LABELS[String(status || '').toLowerCase()] || 'Chờ xác nhận';
  }

  function statusClass(status) {
    var key = normalizeOrderStatus(status);
    if (key === 'completed') return 'bg-emerald-50 text-emerald-700';
    if (key === 'cancelled') return 'bg-red-50 text-red-700';
    if (key === 'returned') return 'bg-slate-100 text-slate-600';
    if (key === 'shipping') return 'bg-sky-50 text-sky-700';
    if (key === 'handed_over') return 'bg-purple-50 text-purple-700';
    if (key === 'preparing') return 'bg-indigo-50 text-indigo-700';
    if (key === 'confirmed') return 'bg-blue-50 text-blue-700';
    return 'bg-amber-50 text-amber-700';
  }

  function orderItems(order) {
    return Array.isArray(order.items) ? order.items : [];
  }

  function filteredOrders() {
    return orders().filter(function (order) {
      if (orderSearch) {
        var qKey = normalizeOrderKey(orderSearch).toLowerCase();
        var qRaw = String(orderSearch).trim().toLowerCase();
        var ordCode = formatOrderCode(order.order_code || order.id).toLowerCase();
        var ordKey = normalizeOrderKey(order.order_code || order.id).toLowerCase();
        if (ordCode.indexOf(qRaw) === -1 && ordKey.indexOf(qKey) === -1) return false;
      }
      var status = normalizeOrderStatus(order.status);
      if (orderFilter === 'processing' && ['confirmed', 'preparing'].indexOf(status) === -1) return false;
      if (orderFilter === 'shipping' && ['handed_over', 'shipping'].indexOf(status) === -1) return false;
      if (orderFilter === 'completed' && status !== 'completed') return false;
      if (orderFilter === 'returned' && status !== 'returned') return false;
      if (orderFilter !== 'all' && ['processing', 'shipping', 'completed', 'returned'].indexOf(orderFilter) === -1 && status !== orderFilter) return false;
      if (orderDateFilter !== 'all') {
        var days = Number(orderDateFilter);
        var createdAt = parseTimestampMs(order.created_at);
        if (!days || !createdAt || Date.now() - createdAt > days * 86400000) return false;
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
      '<a class="account-image-frame" href="' + href + '" aria-label="Xem ' + escapeHtml(product.name) + '">' +
      '<img class="account-product-img" src="' + escapeHtml(product.image || PRODUCT_PLACEHOLDER) +
      '" alt="' + escapeHtml(product.name) + '" loading="lazy" data-account-product-image>' +
      '</a>' +
      '<div class="mt-3 flex items-center justify-between gap-2">' +
      '<span class="account-eyebrow">' + escapeHtml(product.brand || 'VLU STORE') + '</span>' +
      '<span class="account-badge">' + escapeHtml(product.category || 'Sản phẩm') + '</span></div>' +
      '<a class="mt-1 block min-h-9 text-xs font-extrabold leading-5 text-slate-900 hover:text-brand" href="' + href + '">' +
      escapeHtml(product.name) + '</a><div class="mt-1 flex items-center gap-2"><p class="text-sm font-black text-brand">' + money(product.price) + '</p>' +
      (product.oldPrice > product.price ? '<del class="text-[10px] text-slate-400">' + money(product.oldPrice) + '</del>' : '') +
      '</div>' +
      (product.oldPrice > product.price ? '<p class="account-price-change">↓ Giảm ' +
        Math.round((product.oldPrice - product.price) / product.oldPrice * 100) + '% so với giá cũ</p>' : '') +
      '<div class="mt-3 flex flex-wrap gap-2">' + actions +
      (options.compare ? '<button class="account-button" data-action="toggle-compare" data-id="' + escapeHtml(product.id) + '">⇄ So sánh</button>' : '') +
      '</div></article>';
  }

  function emptyState(icon, text, actionLabel, tab) {
    return '<div class="account-empty"><span class="account-empty-icon">' + icon + '</span>' +
      '<p class="text-sm font-extrabold text-slate-700">' + escapeHtml(text) + '</p>' +
      (actionLabel ? '<a class="account-button mt-4" href="' + escapeHtml(tab || 'index.html') + '">' + escapeHtml(actionLabel) + '</a>' : '') +
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
      avatar.innerHTML = defaultAvatarMarkup('h-8 w-8');
    }
    if (window.VLU_AUTH && typeof window.VLU_AUTH.updateHeaderAuth === 'function') window.VLU_AUTH.updateHeaderAuth();
    if (window.VLU_CART) {
      document.getElementById('accountCartCount').textContent = window.VLU_CART.getItemCount();
    }
  }

  function overviewHtml() {
    var userOrders = orders();
    var done = userOrders.filter(function (order) {
      return normalizeOrderStatus(order.status) === 'completed';
    });
    var pending = userOrders.filter(function (order) {
      return ['pending', 'confirmed', 'preparing', 'handed_over', 'shipping'].indexOf(normalizeOrderStatus(order.status)) !== -1;
    });
    var recentProducts = store.recent.map(catalogProduct).filter(Boolean).slice(0, 4);
    var recommendations = Object.keys(products()).map(catalogProduct).filter(Boolean)
      .sort(function (a, b) { return b.price - a.price; }).slice(0, 4);
    var points = Math.max(0, Number(store.points) || 0);
    var nextLevel = 500;
    var progress = Math.min(100, Math.round(points / nextLevel * 100));
    var orderMarkup = userOrders.slice(0, 3).map(orderRow).join('');
    var avatarMarkup = store.profile.avatar
      ? '<img class="account-welcome-avatar" src="' + escapeHtml(store.profile.avatar) + '" alt="Ảnh đại diện">'
      : '<span class="account-welcome-avatar account-avatar-fallback">' + defaultAvatarMarkup('h-10 w-10') + '</span>';
    var recentSection = store.settings.privateHistory ? '' :
      '<section class="account-card account-card-pad"><div class="mb-4 flex items-center justify-between gap-3">' +
      '<h2 class="account-card-title">Đã xem gần đây</h2><button class="account-button" data-tab="recent">Xem lịch sử</button></div>' +
      (recentProducts.length ? '<div class="account-product-grid">' + recentProducts.map(function (p) {
        return productCard(p, '<button class="account-button account-button-primary" data-action="add-cart" data-id="' + escapeHtml(p.id) + '">Thêm giỏ</button>', { compare: true });
      }).join('') + '</div>' : emptyState('◷', 'Lịch sử xem sản phẩm sẽ xuất hiện tại đây.')) + '</section>';
    var isGuestUser = Boolean(currentUser && currentUser.isGuest);
    return '<section class="account-card account-card-pad"><div class="account-welcome">' + avatarMarkup +
      '<div class="min-w-0 flex-1"><p class="account-eyebrow">' + (isGuestUser ? 'PHIÊN MUA SẮM KHÁCH (GUEST)' : 'CHÀO MỪNG TRỞ LẠI') + '</p><h2 class="mt-1 text-xl font-black text-slate-950">' +
      'Xin chào, ' + escapeHtml(profileName()) + '</h2><p class="account-muted mt-1">' + (isGuestUser ? 'Tài khoản Khách vãng lai (Guest) · VLU FLAGSHIP STORE' : 'Tài khoản thành viên VLU FLAGSHIP STORE') + '</p></div>' +
      '<span class="account-badge account-tier-badge">' + (isGuestUser ? '✦ Khách (Guest)' : '✦ Thành viên VLU') + '</span></div>' +
      '<div class="account-loyalty-progress"><div class="flex items-center justify-between gap-3"><span>Điểm tích lũy trên thiết bị</span>' +
      '<strong>' + points.toLocaleString('vi-VN') + ' / ' + nextLevel + ' điểm</strong></div>' +
      '<div class="account-progress-track"><span style="width:' + progress + '%"></span></div>' +
      '<p class="account-muted mt-1">Còn ' + Math.max(0, nextLevel - points) + ' điểm đến mốc quyền lợi tiếp theo.</p></div></section>' +
      '<div class="grid grid-cols-2 gap-3 xl:grid-cols-4">' +
      statCard('▤', 'Tổng đơn hàng', userOrders.length, 'orders') + statCard('◷', 'Đang xử lý', pending.length, 'orders') +
      statCard('✓', 'Đã hoàn thành', done.length, 'history') + statCard('♡', 'Yêu thích', store.wishlist.length, 'wishlist') + '</div>' +
      '<section class="account-card account-card-pad"><div class="mb-2 flex items-center justify-between gap-3">' +
      '<h2 class="account-card-title">Đơn hàng gần đây</h2><button class="account-button" data-tab="orders">Xem tất cả</button></div>' +
      (orderMarkup || emptyState('▤', 'Chưa có đơn hàng gắn với tài khoản này.', 'Khám phá sản phẩm', 'category.html')) +
      '</section>' +
      recentSection + '<section class="account-card account-card-pad"><h2 class="account-card-title mb-4">Gợi ý sản phẩm có thể quan tâm</h2>' +
      '<div class="account-product-grid">' + recommendations.map(function (p) {
        return productCard(p, '<a class="account-button" href="product-detail.html?id=' + encodeURIComponent(p.id) + '&name=' + encodeURIComponent(p.name) + '&cat=' + encodeURIComponent(p.category) + '">Xem chi tiết</a>' +
          '<button class="account-button account-button-primary" data-action="add-cart" data-id="' + escapeHtml(p.id) + '">Thêm vào giỏ</button>', { compare: true });
      }).join('') + '</div></section>';
  }

  function statCard(icon, label, value, tab) {
    return '<button type="button" class="account-stat account-stat-link" data-tab="' + escapeHtml(tab) + '"><span class="flex items-center justify-between"><span class="account-eyebrow">' +
      escapeHtml(label) + '</span><span class="text-lg text-brand">' + icon + '</span></span><p class="account-stat-value">' +
      escapeHtml(value) + '</p></button>';
  }

  function orderRow(order) {
    var displayCode = formatOrderCode(order.order_code || order.id);
    var items = orderItems(order);
    var status = normalizeOrderStatus(order.status);
    var canCancel = ['pending', 'confirmed', 'preparing'].indexOf(status) !== -1;
    var itemMarkup = items.map(function (item) {
      return '<div class="account-order-product"><img class="account-product-img" src="' + escapeHtml(itemImage(item)) +
        '" alt="" loading="lazy" data-account-product-image><div class="min-w-0 flex-1"><p class="truncate text-xs font-extrabold">' +
        escapeHtml(item.name) + '</p><p class="mt-1 text-[10px] text-slate-500">' + escapeHtml(item.color || 'Mặc định') +
        ' · ' + escapeHtml(item.variant || item.storage || 'Tiêu chuẩn') + ' · ×' + escapeHtml(item.quantity || 1) +
        '</p></div><strong class="shrink-0 text-xs">' + money((Number(item.price) || 0) * (Number(item.quantity) || 1)) + '</strong></div>';
    }).join('');
    return '<article class="account-order-card" data-order-code="' + escapeHtml(displayCode) + '"><div class="flex flex-wrap items-start justify-between gap-3">' +
      '<div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><strong class="text-sm text-slate-900">' +
      escapeHtml(displayCode) + '</strong><span class="account-badge ' + statusClass(status) + '">' + escapeHtml(statusLabel(status)) +
      '</span></div><p class="account-muted mt-1">Ngày đặt ' + dateText(order.created_at) + '</p></div>' +
      '<div class="text-right"><span class="account-eyebrow">TỔNG THANH TOÁN</span><p class="text-sm font-black text-brand">' +
      money(order.total) + '</p></div></div>' +
      '<div class="mt-3 divide-y divide-slate-100">' + (itemMarkup || '<p class="account-muted py-3">Không có thông tin sản phẩm.</p>') + '</div>' +
      '<div class="mt-3 grid gap-2 text-[11px] text-slate-500 sm:grid-cols-2"><p>Nhận hàng: <strong class="text-slate-700">' +
      (order.shipping_method === 'pickup' ? 'Nhận tại cửa hàng VLU' : 'Giao tận nơi') + '</strong>' +
      (order.store_location ? ' · ' + escapeHtml(order.store_location) : '') + '</p><p>Thanh toán: <strong class="text-slate-700">' +
      escapeHtml(order.payment_method || 'Chưa cập nhật') + '</strong></p></div>' +
      (status === 'cancelled' && order.cancel_reason ? '<div class="mt-3 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2 text-[11px] font-semibold text-red-700">Lý do hủy: ' + escapeHtml(order.cancel_reason) + '</div>' : '') +
      '<div class="mt-4 flex flex-wrap justify-end gap-2"><button class="account-button" data-action="order-detail" data-id="' +
      escapeHtml(displayCode) + '">Xem chi tiết</button>' +
      (canCancel ? '<button class="account-button account-button-danger" data-action="cancel-order" data-id="' + escapeHtml(displayCode) + '">Hủy đơn hàng</button>' : '') +
      (status === 'completed' ? '<button class="account-button" data-action="review-order" data-id="' + escapeHtml(displayCode) + '">Đánh giá</button>' : '') +
      '<button class="account-button account-button-primary" data-action="buy-again" data-id="' + escapeHtml(displayCode) + '">Mua lại</button></div></article>';
  }

  function buildOrderModalMarkup(order) {
    var displayCode = formatOrderCode(order.order_code || order.id);
    var current = normalizeOrderStatus(order.status);
    var isCancelled = current === 'cancelled';
    var isReturned = current === 'returned';
    var currentIndex = ORDER_PIPELINE_STEPS.findIndex(function (step) { return step.key === current; });
    var historyStatuses = {};
    if (Array.isArray(order.status_history)) {
      order.status_history.forEach(function (ev) {
        if (ev && ev.status) historyStatuses[normalizeOrderStatus(ev.status)] = true;
      });
    }

    var timeline = ORDER_PIPELINE_STEPS.map(function (step, index) {
      var stepCls = 'account-timeline-step';
      var dotInner = '';
      if (isCancelled || isReturned) {
        if (historyStatuses[step.key]) {
          stepCls += ' is-complete is-cancelled-past';
          dotInner = '✓';
        } else {
          stepCls += ' is-cancelled';
        }
      } else if (currentIndex >= 0) {
        if (index < currentIndex) {
          stepCls += ' is-complete';
          dotInner = '✓';
        } else if (index === currentIndex) {
          stepCls += ' is-active';
          dotInner = '<span class="account-timeline-dot-core" aria-hidden="true"></span>';
        } else {
          stepCls += ' is-upcoming';
        }
      }
      return '<li class="' + stepCls + '" data-step-key="' + escapeHtml(step.key) + '" data-step-index="' + (index + 1) + '">' +
        '<span class="account-timeline-dot" aria-hidden="true">' + dotInner + '</span>' +
        '<span class="account-timeline-label">' + escapeHtml(step.label) + '</span></li>';
    }).join('');

    var cancelBannerHtml = isCancelled
      ? '<div class="account-cancel-banner" role="alert"><strong>Đơn hàng đã bị hủy</strong><p>Lý do hủy: ' +
        escapeHtml(order.cancel_reason || 'Đơn hàng đã được hủy theo yêu cầu.') + '</p></div>'
      : '';

    var items = orderItems(order).map(function (item) {
      return '<div class="account-order-product"><img class="account-product-img" src="' + escapeHtml(itemImage(item)) +
        '" alt="" data-account-product-image><div class="min-w-0 flex-1"><p class="text-xs font-extrabold">' +
        escapeHtml(item.name) + '</p><p class="account-muted">' + escapeHtml(item.color || 'Mặc định') + ' · ' +
        escapeHtml(item.variant || item.storage || 'Tiêu chuẩn') + ' · ×' + escapeHtml(item.quantity || 1) +
        '</p></div><strong class="text-xs">' + money((Number(item.price) || 0) * (Number(item.quantity) || 1)) + '</strong></div>';
    }).join('');

    return '<section class="account-modal account-modal-order" role="dialog" aria-modal="true" aria-labelledby="orderModalTitle">' +
      '<div class="flex items-start justify-between gap-3"><div><p class="account-eyebrow">CHI TIẾT ĐƠN HÀNG</p>' +
      '<div class="mt-1 flex flex-wrap items-center gap-2"><h2 id="orderModalTitle" class="text-lg font-black">' +
      escapeHtml(displayCode) + '</h2><span class="account-badge ' + statusClass(current) + '">' + escapeHtml(statusLabel(current)) +
      '</span></div><p class="account-muted mt-1">' + dateText(order.created_at) +
      (order.updated_at ? ' · Cập nhật ' + dateTimeText(order.updated_at) : '') + '</p></div>' +
      '<button class="account-modal-close" type="button" data-action="close-order-modal" aria-label="Đóng">×</button></div>' +
      '<div class="mt-5"><h3 class="account-card-title" data-order-status-heading>Theo dõi trạng thái · ' + escapeHtml(statusLabel(current)) + '</h3>' +
      '<div class="account-timeline-wrap"><ol class="account-timeline" data-current-status="' + escapeHtml(current) +
      '" data-current-step="' + (currentIndex >= 0 ? (currentIndex + 1) : 0) + '">' + timeline + '</ol></div>' +
      cancelBannerHtml + '</div><div class="mt-5"><h3 class="account-card-title">Sản phẩm</h3>' +
      '<div class="mt-2 divide-y divide-slate-100">' + (items || '<p class="account-muted py-2">Không có thông tin sản phẩm.</p>') + '</div></div>' +
      '<div class="mt-5 grid gap-2 rounded-2xl bg-slate-50 p-4 text-xs sm:grid-cols-2"><p>Người nhận: <strong>' +
      escapeHtml(order.customer_name || '—') + '</strong></p><p>Điện thoại: <strong>' + escapeHtml(order.customer_phone || '—') +
      '</strong></p><p>Hình thức nhận: <strong>' + (order.shipping_method === 'pickup' ? 'Nhận tại cửa hàng VLU' : 'Giao tận nơi') +
      '</strong></p><p>Thanh toán: <strong>' + escapeHtml(order.payment_method || '—') + '</strong></p><p class="sm:col-span-2">Địa chỉ: <strong>' +
      escapeHtml(order.customer_address || order.store_location || '—') + '</strong></p><p class="sm:col-span-2 text-right text-base font-black text-brand">Tổng: ' +
      money(order.total) + '</p></div></section>';
  }

  function refreshOpenOrderModal() {
    if (!selectedOrder) return;
    var modal = document.getElementById('accountOrderModal');
    if (!modal) return;
    var targetKey = normalizeOrderKey(selectedOrder);
    var latestOrder = orders().find(function (entry) {
      return entry && normalizeOrderKey(entry.order_code || entry.id) === targetKey;
    });
    if (!latestOrder) return;
    modal.innerHTML = buildOrderModalMarkup(latestOrder);
  }

  function openOrderModal(orderId) {
    var targetKey = normalizeOrderKey(orderId);
    var order = orders().find(function (entry) {
      return entry && normalizeOrderKey(entry.order_code || entry.id) === targetKey;
    });
    if (!order) return;
    closeOrderModal();
    selectedOrder = formatOrderCode(order.order_code || order.id);

    var modal = document.createElement('div');
    modal.id = 'accountOrderModal';
    modal.className = 'account-modal-backdrop';
    modal.innerHTML = buildOrderModalMarkup(order);
    modal.addEventListener('click', function (event) {
      if (event.target === modal || (event.target.closest && event.target.closest('[data-action="close-order-modal"]'))) {
        closeOrderModal();
      }
    });
    document.body.appendChild(modal);
    var closeBtn = modal.querySelector('[data-action="close-order-modal"]');
    if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();

    // Đồng bộ nhanh ngay lập tức với backend/api/orders.php để cập nhật trạng thái thực tế mới nhất
    fetchOrdersFromBackend({ force: true, orderCode: selectedOrder });
  }

  function closeOrderModal() {
    selectedOrder = '';
    var modal = document.getElementById('accountOrderModal');
    if (modal) modal.remove();
  }

  function profileHtml() {
    var profile = Object.assign({}, currentUser, store.profile);
    var avatarMarkup = profile.avatar
      ? '<img id="profileAvatarPreview" class="account-profile-avatar" src="' + escapeHtml(profile.avatar) + '" alt="Ảnh đại diện">'
      : '<div id="profileAvatarPreview" class="account-profile-avatar account-avatar-fallback">' + defaultAvatarMarkup('h-16 w-16') + '</div>';
    return '<section class="account-card account-card-pad"><div class="account-profile-layout">' +
      '<aside class="account-profile-photo"><div class="account-profile-photo-frame">' + avatarMarkup + '</div>' +
      '<p class="mt-4 text-sm font-extrabold">Ảnh đại diện</p><p class="account-muted mt-1">JPG, PNG hoặc WebP · tối đa 1 MB</p>' +
      '<label class="account-button account-button-primary mt-4 cursor-pointer">Thay đổi ảnh đại diện' +
      '<input class="hidden" type="file" accept="image/png,image/jpeg,image/webp" data-profile-avatar></label>' +
      '<button class="account-button mt-2" type="button" data-action="reset-avatar">Đặt lại ảnh mặc định</button></aside>' +
      '<div><div class="mb-4"><h2 class="account-card-title">Thông tin cá nhân</h2>' +
      '<p class="account-muted mt-1">Thông tin hồ sơ được lưu riêng theo tài khoản trên thiết bị này.</p></div>' +
      '<form data-form="profile" class="grid gap-4 sm:grid-cols-2">' +
      field('Họ và tên', 'fullname', profile.fullname || '', 'text', 'Nguyễn Văn An') +
      field('Email', 'email', profile.email || '', 'email', 'email@example.com') +
      field('Số điện thoại', 'phone', profile.phone || '', 'tel', '09xxxxxxxx') +
      field('Ngày sinh', 'birthday', profile.birthday || '', 'date', '') +
      '<fieldset class="account-field"><legend class="text-[11px] font-extrabold text-slate-600">Giới tính (không bắt buộc)</legend>' +
      '<div class="flex flex-wrap gap-2">' + [['male', 'Nam'], ['female', 'Nữ'], ['other', 'Khác']].map(function (optionItem) {
        return '<label class="account-choice' + (profile.gender === optionItem[0] ? ' is-selected' : '') + '">' +
          '<input type="radio" name="gender" value="' + optionItem[0] + '"' + (profile.gender === optionItem[0] ? ' checked' : '') + '>' +
          '<span>' + optionItem[1] + '</span></label>';
      }).join('') + '</div></fieldset>' +
      '<div class="account-field"><label for="profileUsername">Tên đăng nhập</label><input class="account-input" id="profileUsername" value="' +
      escapeHtml(currentUser.username || '') + '" readonly></div>' +
      '<div class="sm:col-span-2"><button class="account-button account-button-primary" type="submit">Lưu thay đổi</button></div></form>' +
      '</div></div></section>' +
      '<section class="account-card account-card-pad"><div class="mb-4"><h2 class="account-card-title">Bảo mật &amp; Quản lý đăng nhập</h2>' +
      '<p class="account-muted mt-1">Phiên xác thực hiện tại được giữ trong trình duyệt này.</p></div>' +
      '<form data-form="password" class="grid gap-4 md:grid-cols-3">' +
      passwordField('Mật khẩu hiện tại', 'currentPassword', 'Nhập mật khẩu hiện tại') +
      passwordField('Mật khẩu mới', 'newPassword', 'Tối thiểu 8 ký tự') +
      passwordField('Xác nhận mật khẩu mới', 'confirmPassword', 'Nhập lại mật khẩu mới') +
      '<div class="md:col-span-3"><div class="account-password-meter"><span data-password-meter></span></div>' +
      '<p class="account-muted mt-1" data-password-strength>Độ mạnh mật khẩu</p></div>' +
      '<div class="md:col-span-3 flex flex-wrap items-center justify-between gap-3"><button class="account-button account-button-primary" type="submit">Yêu cầu đổi mật khẩu</button>' +
      '<span class="account-muted">Chưa thể đổi mật khẩu: dự án chưa có API xác thực/đổi mật khẩu phía máy chủ.</span></div></form>' +
      '<div class="account-session-card mt-5"><span class="account-session-icon">' + defaultAvatarMarkup('h-5 w-5') + '</span>' +
      '<div><p class="text-xs font-extrabold">Phiên hiện tại</p><p class="account-muted">' + escapeHtml(currentUser.email || currentUser.username || '') +
      ' · ' + (currentUser.loginAt ? 'Đăng nhập ' + dateText(currentUser.loginAt) : 'Đang hoạt động trên thiết bị này') + '</p></div>' +
      '<span class="account-badge bg-emerald-50 text-emerald-700">Đang hoạt động</span></div></section>';
  }

  function passwordField(label, name, placeholder) {
    return '<div class="account-field"><label for="password-' + name + '">' + label + '</label><div class="account-password-wrap">' +
      '<input class="account-input" id="password-' + name + '" name="' + name + '" type="password" autocomplete="' +
      (name === 'currentPassword' ? 'current-password' : 'new-password') + '" placeholder="' + placeholder + '">' +
      '<button class="account-password-toggle" type="button" data-action="toggle-password" data-target="password-' + name + '" aria-label="Hiện mật khẩu">◉</button>' +
      '</div></div>';
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
      (list.length ? list.map(orderRow).join('') : emptyState('▤', orderSearch || orderFilter !== 'all' ? 'Không tìm thấy đơn hàng phù hợp.' : 'Chưa có đơn hàng nào của tài khoản này.', 'Mua sắm ngay', 'index.html')) +
      '</div></section>';
  }

  function addressesHtml() {
    var editing = addressEditIndex >= 0 ? store.addresses[addressEditIndex] : {};
    var fullAddress = function (address) {
      return address.address || [address.street, address.ward, address.district, address.city].filter(Boolean).join(', ');
    };
    var formMarkup = addressFormOpen ? '<div class="account-modal-backdrop" data-address-backdrop><section class="account-modal account-modal-compact" role="dialog" aria-modal="true" aria-labelledby="addressModalTitle">' +
      '<div class="flex items-start justify-between gap-3"><div><h2 id="addressModalTitle" class="account-card-title">' +
      (addressEditIndex >= 0 ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới') + '</h2><p class="account-muted mt-1">Thông tin được lưu riêng cho tài khoản.</p></div>' +
      '<button type="button" class="account-modal-close" data-action="toggle-address-form" aria-label="Đóng">×</button></div>' +
      '<form data-form="address" class="mt-5 grid gap-3 sm:grid-cols-2">' +
      field('Họ tên người nhận', 'name', editing.name || '', 'text', 'Nguyễn Văn An') +
      field('Số điện thoại', 'phone', editing.phone || '', 'tel', '09xxxxxxxx') +
      field('Tỉnh / Thành phố', 'city', editing.city || '', 'text', 'TP. Hồ Chí Minh') +
      field('Quận / Phường / Khu vực', 'district', editing.district || '', 'text', 'Quận 1') +
      field('Phường / Xã', 'ward', editing.ward || '', 'text', 'Phường Bến Nghé') +
      field('Số nhà & Tên đường', 'street', editing.street || editing.address || '', 'text', 'Số nhà, tên đường') +
      '<div class="account-field"><label for="addressLabel">Loại địa chỉ</label><select class="account-select" id="addressLabel" name="label">' +
      option('home', 'Nhà riêng', editing.label || 'home') + option('office', 'Văn phòng', editing.label || 'home') + '</select></div>' +
      '<label class="account-check-row"><input type="checkbox" name="default"' + (editing.default || !store.addresses.some(function (address) { return address.default; }) ? ' checked' : '') +
      '> Đặt làm địa chỉ mặc định</label><div class="flex justify-end gap-2 sm:col-span-2">' +
      '<button class="account-button" type="button" data-action="toggle-address-form">Hủy</button>' +
      '<button class="account-button account-button-primary" type="submit">Lưu địa chỉ</button></div></form></section></div>' : '';
    var addresses = store.addresses.length ? '<div class="account-address-grid">' + store.addresses.map(function (address, index) {
      return '<article class="account-address-card' + (address.default ? ' is-default' : '') + '"><div class="flex items-start justify-between gap-2">' +
        '<div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-extrabold">' + escapeHtml(address.name) + '</h3>' +
        '<span class="account-badge">' + (address.label === 'office' ? 'Văn phòng' : 'Nhà riêng') + '</span></div>' +
        (address.default ? '<span class="account-default-badge">Mặc định</span>' : '') + '</div>' +
        '<p class="mt-2 text-xs font-semibold text-slate-600">' + escapeHtml(address.phone) + '</p>' +
        '<p class="account-muted mt-2">' + escapeHtml(fullAddress(address)) + '</p>' +
        '<div class="mt-4 flex flex-wrap gap-2">' +
        '<button class="account-button" data-action="edit-address" data-index="' + index + '">Chỉnh sửa</button>' +
        (!address.default ? '<button class="account-button" data-action="default-address" data-index="' + index + '">Đặt làm mặc định</button>' : '') +
        (!address.default ? '<button class="account-button account-button-danger" data-action="delete-address" data-index="' + index + '">Xóa</button>' : '') +
        '</div></article>';
    }).join('') + '</div>' : emptyState('⌖', 'Bạn chưa lưu địa chỉ giao hàng.');
    return '<section class="account-card account-card-pad"><div class="mb-5 flex flex-wrap items-center justify-between gap-3"><div>' +
      '<h2 class="account-card-title">Sổ địa chỉ</h2><p class="account-muted mt-1">Địa chỉ mặc định được điền sẵn khi thanh toán.</p></div>' +
      '<button class="account-button account-button-primary" data-action="toggle-address-form">+ Thêm địa chỉ mới</button></div>' +
      addresses + '</section>' + formMarkup;
  }

  function productCollectionHtml(ids, mode) {
    var list = ids.map(catalogProduct).filter(Boolean);
    if (!list.length) return '<section class="account-card account-card-pad">' +
      emptyState(mode === 'wishlist' ? '♡' : '◷', mode === 'wishlist' ? 'Chưa có sản phẩm yêu thích.' : 'Lịch sử xem sẽ được cập nhật mỗi khi bạn mở trang chi tiết sản phẩm.', 'Khám phá sản phẩm', 'category.html') +
      '</section>';
    var cards = list.map(function (product) {
      var action = mode === 'wishlist' ? 'remove-wishlist' : 'remove-recent';
      var label = mode === 'wishlist' ? 'Bỏ yêu thích' : 'Xóa lịch sử';
      var detailHref = 'product-detail.html?id=' + encodeURIComponent(product.id) + '&name=' +
        encodeURIComponent(product.name) + '&cat=' + encodeURIComponent(product.category || 'dien-thoai');
      var actions = (mode === 'wishlist' ? '<span class="account-stock-label' + (product.inStock === false ? ' is-unavailable' : '') + '">' +
          (product.inStock === true ? '● Còn hàng sẵn' : '● Tồn kho cần xác nhận') + '</span>' : '') +
        (mode === 'recent' ? '<a class="account-button" href="' + detailHref + '">Xem lại chi tiết</a>' : '') +
        '<button class="account-button account-button-primary" data-action="add-cart" data-id="' + escapeHtml(product.id) + '">Thêm vào giỏ hàng</button>' +
        (mode === 'recent' ? '<button class="account-button" data-action="add-wishlist" data-id="' + escapeHtml(product.id) + '">♡ Thêm yêu thích</button>' : '') +
        '<button class="account-button" data-action="' + action + '" data-id="' + escapeHtml(product.id) + '">' + label + '</button>';
      return productCard(product, actions, { compare: true });
    }).join('');
    if (mode === 'recent') {
      return '<section class="account-card account-card-pad"><div class="mb-4 flex flex-wrap items-center justify-between gap-3">' +
        '<div><h2 class="account-card-title">Sản phẩm đã xem gần đây</h2><p class="account-muted mt-1">Mới xem gần nhất hiển thị trước.</p></div>' +
        '<button class="account-button account-button-danger" data-action="clear-recent">Xóa toàn bộ lịch sử xem</button></div>' +
        '<div class="account-product-grid">' + cards + '</div></section>';
    }
    return '<div class="account-product-grid">' + cards + '</div>';
  }

  function compareHtml() {
    var list = store.compare.map(catalogProduct).filter(Boolean).slice(0, 3);
    var catalog = Object.keys(products()).map(catalogProduct).filter(Boolean)
      .filter(function (product) { return store.compare.indexOf(String(product.id)) === -1; });
    var options = catalog.map(function (product) {
      return '<option value="' + escapeHtml(product.id) + '">' + escapeHtml(product.brand + ' · ' + product.name) + '</option>';
    }).join('');
    var search = '<form class="account-compare-picker" data-form="compare-add"><div class="min-w-0 flex-1">' +
      '<label class="account-field"><span>Tìm hoặc chọn dòng sản phẩm</span><input class="account-input" id="compareSearch" type="search" placeholder="Tên máy, hãng, danh mục..." value="' +
      escapeHtml(compareSearch) + '"><select class="account-select mt-2" id="compareProduct" name="productId" required>' +
      '<option value="">Chọn sản phẩm để thêm</option>' + options + '</select></label></div>' +
      '<button class="account-button account-button-primary" type="submit"' + (list.length >= 3 ? ' disabled' : '') + '>+ Thêm vào bảng</button></form>';
    function specValue(product, labelPattern, highlightPattern, fallback) {
      if (!product) return '—';
      var spec = product.specs.find(function (entry) {
        return Array.isArray(entry) && labelPattern.test(String(entry[0]));
      });
      var highlight = product.highlights.find(function (entry) {
        return highlightPattern.test(String(entry.title || '') + ' ' + String(entry.icon || ''));
      });
      return spec ? String(spec[1]) : (highlight ? String(highlight.value) : fallback);
    }
    var rows = [
      ['Sản phẩm', function (product, index) {
        if (!product) return '<button type="button" class="account-compare-empty" data-action="focus-compare-picker"><span>＋</span><strong>Thêm sản phẩm so sánh</strong><small>' + (index === 0 ? 'Điện thoại, Laptop, iPad, Tai nghe...' : 'Tối đa 3 sản phẩm') + '</small></button>';
        return '<div class="account-compare-product"><button type="button" class="account-compare-remove" data-action="remove-compare" data-id="' + escapeHtml(product.id) + '" aria-label="Xóa ' + escapeHtml(product.name) + '">×</button><img class="account-compare-image" src="' +
          escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" data-account-product-image><strong>' + escapeHtml(product.name) + '</strong><span class="account-muted">' +
          escapeHtml(product.brand || '—') + '</span></div>';
      }],
      ['Giá bán', function (product) { return product ? '<strong class="text-brand">' + money(product.price) + '</strong>' : '—'; }],
      ['Thương hiệu', function (product) { return product ? escapeHtml(product.brand || '—') : '—'; }],
      ['Tình trạng hàng', function (product) { return product ? '<span class="account-stock-label' + (product.inStock ? '' : ' is-unavailable') + '">' +
        (product.inStock ? '● Còn hàng' : '● Tạm hết hàng') + '</span>' : '—'; }],
      ['Chip xử lý', function (product) { return escapeHtml(specValue(product, /vi xử lý|cpu|chip|processor/i, /cpu|vi xử lý|chip/i, 'Thông tin chưa cập nhật')); }],
      ['RAM / ROM', function (product) { return product ? escapeHtml((product.variantLabel ? product.variantLabel + ': ' : '') +
        (product.variants.map(function (variant) { return variant.label; }).slice(0, 3).join(' · ') || 'Thông tin chưa cập nhật')) : '—'; }],
      ['Màn hình & tần số quét', function (product) { return escapeHtml(specValue(product, /màn hình|display|screen/i, /screen|màn hình/i, 'Thông tin chưa cập nhật')); }],
      ['Pin / Sạc', function (product) { return escapeHtml(specValue(product, /pin|sạc|battery/i, /battery|pin|sạc/i, 'Thông tin chưa cập nhật')); }],
      ['Thao tác', function (product) { return product ? '<button class="account-button account-button-primary" data-action="add-cart" data-id="' +
        escapeHtml(product.id) + '">Thêm vào giỏ</button>' : '—'; }]
    ];
    var body = rows.map(function (row) {
      return '<tr><th>' + row[0] + '</th>' + [0, 1, 2].map(function (index) {
        return '<td>' + row[1](list[index] || null, index) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<section class="account-card account-card-pad"><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><div>' +
      '<h2 class="account-card-title">So sánh tối đa 3 sản phẩm</h2><p class="account-muted mt-1">Thông số hiển thị theo catalog hiện có.</p></div>' +
      (list.length ? '<button class="account-button account-button-danger" data-action="clear-compare">Xóa danh sách</button>' : '') +
      '</div>' + search + '<div class="account-table-wrap mt-5"><table class="account-table account-compare-table"><tbody>' + body +
      '</tbody></table></div></section>';
  }

  function warrantyHtml() {
    var list = [];
    orders().filter(function (order) {
      return normalizeOrderStatus(order.status) === 'completed';
    }).forEach(function (order) {
      orderItems(order).forEach(function (item) {
        var start = new Date(order.created_at || Date.now());
        var expiry = dateAfterMonths(start, 12);
        var remaining = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 86400000));
        list.push({ order: order, item: item, start: start, expiry: expiry, remaining: remaining });
      });
    });
    var formMarkup = warrantyFormOpen ? '<form data-form="warranty" class="account-warranty-form mt-5">' +
      '<div class="mb-3"><h3 class="account-card-title">Tạo yêu cầu bảo hành / đổi trả</h3><p class="account-muted mt-1">Yêu cầu được lưu riêng trên thiết bị và cần cửa hàng xác nhận tiếp nhận.</p></div>' +
      '<div class="grid gap-3 sm:grid-cols-2"><label class="account-field"><span>Sản phẩm và đơn hàng</span><select class="account-select" name="purchase" required><option value="">Chọn sản phẩm đã giao</option>' +
      list.map(function (entry) {
        var code = formatOrderCode(entry.order.order_code || entry.order.id);
        var value = code + '::' + String(entry.item.id || entry.item.name);
        return '<option value="' + escapeHtml(value) + '"' + (value === warrantySelectedPurchase ? ' selected' : '') + '>' +
          escapeHtml(entry.item.name + ' · ' + code) + '</option>';
      }).join('') + '</select></label><label class="account-field"><span>Loại yêu cầu</span><select class="account-select" name="requestType">' +
      option('warranty', 'Bảo hành lỗi kỹ thuật', warrantyRequestType) + option('return', 'Đổi trả 1-1', warrantyRequestType) +
      '</select></label><label class="account-field sm:col-span-2"><span>Mô tả chi tiết tình trạng máy</span><textarea class="account-textarea" name="message" required minlength="10" placeholder="Mô tả lỗi hoặc tình trạng sản phẩm..."></textarea></label>' +
      '</div><div class="mt-3 flex justify-end gap-2"><button type="button" class="account-button" data-action="close-warranty-form">Đóng</button>' +
      '<button class="account-button account-button-primary" type="submit">Gửi yêu cầu</button></div></form>' : '';
    var cards = list.length ? '<div class="account-warranty-grid">' + list.map(function (entry) {
      var code = formatOrderCode(entry.order.order_code || entry.order.id);
      var product = catalogProduct(entry.item.id);
      var image = product ? product.image : itemImage(entry.item);
      var progress = Math.max(0, Math.min(100, Math.round(entry.remaining / 365 * 100)));
      return '<article class="account-warranty-card"><div class="flex items-start gap-3"><img class="account-warranty-image" src="' +
        escapeHtml(image) + '" alt="' + escapeHtml(entry.item.name) + '" data-account-product-image><div class="min-w-0 flex-1"><span class="account-eyebrow">BẢO HÀNH ĐIỆN TỬ · 12 THÁNG</span>' +
        '<h3 class="mt-1 text-sm font-black">' + escapeHtml(entry.item.name) + '</h3><p class="account-muted mt-1">Đơn ' + escapeHtml(code) + '</p></div></div>' +
        '<div class="account-warranty-dates"><span>Bắt đầu<strong>' + dateText(entry.start) + '</strong></span><span>Hết hạn<strong>' + dateText(entry.expiry) + '</strong></span></div>' +
        '<div class="account-progress-track"><span style="width:' + progress + '%"></span></div><p class="account-muted mt-1">' +
        (entry.remaining ? 'Còn ' + entry.remaining + ' ngày bảo hành' : 'Đã hết thời hạn bảo hành 12 tháng theo ngày đặt ghi nhận') + '</p>' +
        '<div class="mt-3 flex flex-wrap gap-2"><button class="account-button account-button-primary" data-action="warranty-request" data-type="warranty" data-order="' +
        escapeHtml(code) + '" data-item="' + escapeHtml(entry.item.id || entry.item.name) + '">Gửi yêu cầu bảo hành</button>' +
        '<button class="account-button" data-action="warranty-request" data-type="return" data-order="' + escapeHtml(code) +
        '" data-item="' + escapeHtml(entry.item.id || entry.item.name) + '">Gửi yêu cầu đổi trả</button></div></article>';
    }).join('') + '</div>' : emptyState('⌑', 'Sản phẩm đã giao thành công sẽ hiển thị tại đây.');
    var tickets = store.tickets.filter(function (ticket) { return ticket.type === 'warranty' || ticket.type === 'return'; });
    return '<section class="account-card account-card-pad"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="account-card-title">Tra cứu bảo hành thiết bị đã mua</h2>' +
      '<p class="account-muted mt-1">Thời hạn 12 tháng được tính từ ngày đặt hàng đã ghi nhận trên thiết bị.</p></div>' +
      (list.length ? '<button class="account-button account-button-primary" data-action="open-warranty-form">+ Tạo yêu cầu</button>' : '') +
      '</div><div class="mt-4">' + cards + '</div>' + formMarkup +
      '<h3 class="account-card-title mt-7">Theo dõi trạng thái &amp; lịch sử yêu cầu</h3>' +
      (tickets.length ? tickets.slice().reverse().map(ticketRow).join('') : '<p class="account-muted mt-2">Chưa có yêu cầu bảo hành hoặc đổi trả.</p>') + '</section>';
  }

  function ticketRow(ticket) {
    var steps = ['Đã tiếp nhận', 'Đang kiểm tra kỹ thuật', 'Đang bảo hành / Đổi mới', 'Hoàn tất'];
    var curSt = ticket.status || steps[0];
    var isRejected = curSt === 'Từ chối';
    var isRefunded = curSt === 'Đã hoàn tiền';
    var current = isRefunded ? steps.length - 1 : Math.max(0, steps.indexOf(curSt));
    var ticketOrderCode = ticket.orderId ? formatOrderCode(ticket.orderId) : '—';
    return '<div class="account-list-row"><div><p class="text-xs font-extrabold">' + escapeHtml(ticket.subject) + '</p>' +
      '<p class="mt-1 text-[10px] text-slate-500">' + escapeHtml(ticket.typeLabel || ticket.type) + ' · Đơn ' + escapeHtml(ticketOrderCode) +
      ' · ' + dateTimeText(ticket.createdAt) + '</p><p class="account-muted mt-1">' + escapeHtml(ticket.message || '') + '</p>' +
      (ticket.adminNote ? '<p class="mt-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">Phản hồi từ VLU: ' + escapeHtml(ticket.adminNote) + '</p>' : '') +
      '<ol class="account-ticket-steps">' + steps.map(function (step, index) {
        return '<li class="' + (!isRejected && index <= current ? 'is-complete' : '') + '">' + escapeHtml(step) + '</li>';
      }).join('') + '</ol></div><span class="account-badge">' + escapeHtml(curSt) + '</span></div>';
  }

  function historyHtml() {
    var list = orders();
    if (historyFilter.day) list = list.filter(function (order) { return String(order.created_at || '').slice(0, 10) === historyFilter.day; });
    if (historyFilter.month) list = list.filter(function (order) { return String(order.created_at || '').slice(0, 7) === historyFilter.month; });
    if (historyFilter.year) list = list.filter(function (order) { return String(order.created_at || '').slice(0, 4) === historyFilter.year; });
    var completed = orders().filter(function (order) { return normalizeOrderStatus(order.status) === 'completed'; });
    var total = completed.reduce(function (sum, order) { return sum + (Number(order.total) || 0); }, 0);
    var itemCount = completed.reduce(function (sum, order) {
      return sum + orderItems(order).reduce(function (count, item) { return count + (Number(item.quantity) || 1); }, 0);
    }, 0);
    return '<section class="account-card account-card-pad"><div class="grid gap-3 sm:grid-cols-2">' +
      statCard('₫', 'Tổng số tiền đã mua sắm', money(total)) + statCard('▤', 'Tổng số sản phẩm đã sở hữu', itemCount) +
      '</div><form data-form="history-filter" class="account-history-filters mt-5"><label class="account-field"><span>Lọc theo ngày</span><input class="account-input" name="day" type="date" value="' + escapeHtml(historyFilter.day) + '"></label>' +
      '<label class="account-field"><span>Lọc theo tháng</span><input class="account-input" name="month" type="month" value="' + escapeHtml(historyFilter.month) + '"></label>' +
      '<label class="account-field"><span>Lọc theo năm</span><input class="account-input" name="year" type="number" min="2000" max="2100" placeholder="2026" value="' + escapeHtml(historyFilter.year) + '"></label>' +
      '<div class="flex items-end gap-2"><button class="account-button account-button-primary" type="submit">Tra cứu</button><button class="account-button" type="button" data-action="clear-history-filter">Xóa lọc</button></div></form>' +
      '<div class="mt-5 account-table-wrap"><table class="account-table"><thead><tr><th>Mã đơn</th><th>Ngày</th><th>Sản phẩm</th><th>Thanh toán</th><th>Tổng</th><th></th></tr></thead><tbody>' +
      (list.length ? list.map(function (order) {
        var displayCode = formatOrderCode(order.order_code || order.id);
        return '<tr><td>' + escapeHtml(displayCode) + '</td><td>' + dateText(order.created_at) + '</td><td>' +
          escapeHtml(orderItems(order).map(function (item) { return item.name; }).join(', ') || '—') + '</td><td>' +
          escapeHtml(order.payment_method || '—') + '</td><td><strong>' + money(order.total) + '</strong></td><td>' +
          '<button class="account-button" data-action="order-detail" data-id="' + escapeHtml(displayCode) + '">Chi tiết</button> ' +
          '<button class="account-button" data-action="download-invoice" data-id="' + escapeHtml(displayCode) + '">Tải hóa đơn</button> ' +
          '<button class="account-button" data-action="buy-again" data-id="' + escapeHtml(displayCode) + '">Mua lại</button></td></tr>';
      }).join('') : '<tr><td colspan="6">' + emptyState('↻', 'Chưa có lịch sử mua sắm.') + '</td></tr>') + '</tbody></table></div></section>';
  }

  function reviewsHtml() {
    var eligible = [];
    orders().filter(function (order) {
      return normalizeOrderStatus(order.status) === 'completed';
    }).forEach(function (order) {
      var displayCode = formatOrderCode(order.order_code || order.id);
      orderItems(order).forEach(function (item) {
        eligible.push({ id: displayCode + ':' + String(item.id || item.name), orderId: displayCode, productId: item.id, name: item.name, image: item.image });
      });
    });
    var pending = eligible.filter(function (item) {
      return !store.reviews.some(function (review) { return review.id === item.id; });
    });
    function reviewForm(item, existing) {
      var rating = Math.max(1, Number(existing && existing.rating) || 5);
      var tags = ['Hàng chính hãng VLU', 'Giao hàng siêu tốc', 'Đóng gói chắc chắn', 'Hiệu năng mượt mà'];
      return '<form data-form="review" data-review-id="' + escapeHtml(item.id) + '" class="account-review-form">' +
        '<div class="flex flex-wrap items-start justify-between gap-2"><div><h3 class="text-sm font-extrabold">' + escapeHtml(item.name) +
        '</h3><p class="account-muted mt-1">Đơn ' + escapeHtml(item.orderId) + '</p></div>' +
        (existing ? '<span class="account-badge">Chỉnh sửa đánh giá</span>' : '') + '</div>' +
        '<fieldset class="mt-3"><legend class="account-field-label">Chấm điểm sản phẩm</legend><div class="account-star-rating" role="radiogroup" aria-label="Chọn số sao">' +
        [5, 4, 3, 2, 1].map(function (value) {
          return '<label title="' + value + ' sao"><input type="radio" name="rating" value="' + value + '"' +
            (rating === value ? ' checked' : '') + '><span aria-hidden="true">★</span></label>';
        }).join('') + '</div></fieldset><fieldset class="mt-3"><legend class="account-field-label">Gợi ý nhanh</legend><div class="account-review-tags">' +
        tags.map(function (tag) {
          var checked = existing && Array.isArray(existing.tags) && existing.tags.indexOf(tag) !== -1;
          return '<label><input type="checkbox" name="tags" value="' + escapeHtml(tag) + '"' + (checked ? ' checked' : '') + '><span>' + escapeHtml(tag) + '</span></label>';
        }).join('') + '</div></fieldset>' +
        '<label class="account-field mt-3"><span>Nhận xét chi tiết</span><textarea class="account-textarea" name="comment" required minlength="5" placeholder="Chia sẻ trải nghiệm thực tế của bạn...">' +
        escapeHtml(existing && existing.comment || '') + '</textarea></label>' +
        '<div class="account-review-upload mt-3"><label class="account-field"><span>Ảnh thực tế (PNG, JPG, WebP · tối đa 1 MB)</span><input type="file" name="reviewImage" accept="image/png,image/jpeg,image/webp" data-review-image></label>' +
        '<div class="account-review-preview" data-review-preview>' + (existing && existing.image ? '<img src="' + escapeHtml(existing.image) + '" alt="Ảnh đánh giá hiện tại">' : '<span>Ảnh xem trước</span>') + '</div>' +
        (existing && existing.image ? '<label class="account-check-row"><input type="checkbox" name="removeReviewImage"> Xóa ảnh hiện tại</label>' : '') + '</div>' +
        '<div class="mt-3 flex flex-wrap justify-end gap-2">' + (existing ? '<button class="account-button" type="button" data-action="cancel-review-edit">Hủy</button>' : '') +
        '<button class="account-button account-button-primary" type="submit">' + (existing ? 'Lưu chỉnh sửa' : 'Gửi đánh giá') + '</button></div></form>';
    }
    var pendingHtml = pending.length ? pending.map(function (item) {
      return reviewForm(item, null);
    }).join('') : emptyState('☆', eligible.length ? 'Bạn đã đánh giá tất cả sản phẩm đã giao.' : 'Sản phẩm đã giao sẽ xuất hiện tại đây để bạn đánh giá.');
    var historyHtmlContent = store.reviews.length ? store.reviews.slice().reverse().map(function (review) {
      var item = eligible.find(function (product) { return product.id === review.id; }) ||
        { id: review.id, name: review.name || 'Sản phẩm', orderId: review.orderId || '—' };
      if (editingReviewId === review.id) return reviewForm(item, review);
      return '<article class="account-review-entry"><div><h3 class="text-sm font-extrabold">' + escapeHtml(review.name || item.name) +
        ' <span class="text-amber-500">' + '★'.repeat(Math.max(1, Number(review.rating) || 1)) + '</span></h3><p class="account-muted mt-1">' +
        escapeHtml(review.comment) + '</p>' + (Array.isArray(review.tags) && review.tags.length ? '<div class="account-review-tags mt-2">' +
        review.tags.map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>' : '') +
        (review.image ? '<img class="account-review-image" src="' + escapeHtml(review.image) + '" alt="Ảnh đánh giá">' : '') +
        '<p class="account-muted mt-2">Đơn ' + escapeHtml(review.orderId || item.orderId || '—') + ' · ' + dateText(review.createdAt) + '</p></div>' +
        '<div class="flex flex-wrap gap-2"><button class="account-button" data-action="edit-review" data-id="' + escapeHtml(review.id) + '">Chỉnh sửa đánh giá</button>' +
        '<button class="account-button account-button-danger" data-action="delete-review" data-id="' + escapeHtml(review.id) + '">Xóa đánh giá</button></div></article>';
    }).join('') : '<p class="account-muted mt-2">Chưa có đánh giá.</p>';
    return '<section class="account-card account-card-pad"><div class="mb-5"><h2 class="account-card-title">Đánh giá sản phẩm</h2><p class="account-muted mt-1">Chỉ sản phẩm trong đơn đã giao mới đủ điều kiện đánh giá.</p></div>' +
      '<div class="account-review-tabs"><button type="button" data-review-tab="pending" class="' + (reviewTab === 'pending' ? 'is-active' : '') + '">Sản phẩm chờ đánh giá <span>' + pending.length + '</span></button>' +
      '<button type="button" data-review-tab="history" class="' + (reviewTab === 'history' ? 'is-active' : '') + '">Lịch sử đánh giá của tôi <span>' + store.reviews.length + '</span></button></div>' +
      (reviewTab === 'pending' ? pendingHtml : historyHtmlContent) + '</section>';
  }

  function vouchersHtml() {
    var labels = { available: 'Chưa sử dụng', used: 'Đã sử dụng', expired: 'Hết hạn' };
    var list = store.vouchers.filter(function (voucher) { return (voucher.status || 'available') === voucherFilter; });
    return '<section class="account-card account-card-pad"><div class="account-review-tabs">' +
      Object.keys(labels).map(function (key) { return '<button type="button" data-voucher-filter="' + key + '" class="' +
        (voucherFilter === key ? 'is-active' : '') + '">' + labels[key] + ' <span>' +
        store.vouchers.filter(function (voucher) { return (voucher.status || 'available') === key; }).length + '</span></button>'; }).join('') +
      '</div><div class="account-voucher-grid">' + (list.length ? list.map(function (voucher) {
        var discount = voucher.type === 'percent' ? (voucher.value + '%') : (voucher.value ? money(voucher.value) : 'Miễn phí vận chuyển');
        return '<article class="account-voucher"><div><span class="account-eyebrow">VLU FLAGSHIP STORE</span><strong>' +
          escapeHtml(discount) + '</strong><span>Đơn tối thiểu ' + money(voucher.minOrder || 0) + '</span></div><div>' +
          '<span class="account-eyebrow">MÃ ƯU ĐÃI</span><code>' + escapeHtml(voucher.code) + '</code><span>Hạn dùng: ' +
          escapeHtml(voucher.expiresAt || 'Không giới hạn') + '</span><button class="account-button" data-action="copy-voucher" data-code="' +
          escapeHtml(voucher.code) + '"' + (voucherFilter !== 'available' ? ' disabled' : '') + '>' +
          (voucherFilter === 'available' ? 'Sao chép & dùng' : labels[voucherFilter]) + '</button></div></article>';
      }).join('') : emptyState('％', 'Chưa có voucher trong nhóm này.')) +
      '</div><p class="account-muted mt-4">Voucher và trạng thái được lưu riêng trên thiết bị. Chỉ mã được cửa hàng hỗ trợ mới áp dụng được tại giỏ hàng.</p></section>';
  }

  function pointsHtml() {
    var points = store.points;
    var tiers = [{ name: 'Thành viên Mới', min: 0 }, { name: 'Bạc', min: 500 }, { name: 'Vàng', min: 1500 }, { name: 'VLU Kim Cương', min: 5000 }];
    var tierIndex = tiers.reduce(function (current, tier, index) { return points >= tier.min ? index : current; }, 0);
    var next = tiers[Math.min(tierIndex + 1, tiers.length - 1)];
    var progress = next.min === tiers[tierIndex].min ? 100 : Math.min(100, Math.round((points - tiers[tierIndex].min) * 100 / (next.min - tiers[tierIndex].min)));
    var earned = store.pointLedger.filter(function (entry) { return Number(entry.points) > 0; });
    var spent = store.pointLedger.filter(function (entry) { return Number(entry.points) < 0; });
    return '<section class="account-card account-card-pad"><div class="account-member-card"><span>VLU FLAGSHIP · ' + escapeHtml(tiers[tierIndex].name) +
      '</span><strong>' + points.toLocaleString('vi-VN') + ' điểm</strong><small>' + escapeHtml(profileName()) + '</small></div>' +
      '<p class="account-muted mt-3">Hạng tiếp theo: ' + escapeHtml(next.name) + (tierIndex < 3 ? ' · còn ' + Math.max(0, next.min - points) + ' điểm' : ' · đã đạt hạng cao nhất') + '</p>' +
      '<div class="account-progress-track mt-2"><span style="width:' + progress + '%"></span></div>' +
      '<div class="account-tier-benefits"><span>Mới · tích điểm mua hàng</span><span>Bạc · ưu đãi thành viên</span><span>Vàng · ưu tiên hỗ trợ</span><span>Kim cương · đặc quyền flagship</span></div>' +
      '<h3 class="account-card-title mt-6">Đổi điểm lấy voucher</h3><div class="account-list-row"><span class="text-xs">Voucher giảm 100.000₫ · 100 điểm</span>' +
      '<button class="account-button account-button-primary" data-action="redeem-points" ' + (points < 100 ? 'disabled' : '') + '>Đổi ngay</button></div>' +
      '<div class="grid gap-5 md:grid-cols-2 mt-5"><div><h3 class="account-card-title">Lịch sử cộng điểm</h3>' +
      (earned.length ? earned.slice().reverse().map(pointRow).join('') : '<p class="account-muted mt-2">Đơn hoàn tất nhận 1 điểm mỗi 100.000₫; đánh giá hợp lệ nhận 50 điểm.</p>') +
      '</div><div><h3 class="account-card-title">Lịch sử sử dụng điểm</h3>' +
      (spent.length ? spent.slice().reverse().map(pointRow).join('') : '<p class="account-muted mt-2">Chưa sử dụng điểm.</p>') +
      '</div></div></section>';
  }

  function pointRow(entry) {
    return '<div class="account-list-row"><span class="text-xs">' + escapeHtml(entry.description || 'Giao dịch điểm') + '<small class="block text-slate-400">' +
      dateText(entry.createdAt) + '</small></span><strong class="' + (entry.points > 0 ? 'text-emerald-700' : 'text-brand') + '">' +
      (entry.points > 0 ? '+' : '') + entry.points + '</strong></div>';
  }

  function openLegalModal(action) {
    var title = action === 'legal-policy' ? 'Chính sách bảo mật' : 'Điều khoản sử dụng';
    var content = action === 'legal-policy'
      ? 'Thông tin hồ sơ, giỏ hàng và lịch sử tài khoản trên phiên bản hiện tại được lưu trong bộ nhớ trình duyệt của thiết bị. Dữ liệu không được gửi tới máy chủ từ các biểu mẫu tài khoản trong phiên bản này. Không lưu thông tin thanh toán nhạy cảm trong trình duyệt.'
      : 'Các chức năng tài khoản và voucher hiện hoạt động phía trình duyệt, không thay thế xác nhận đơn hàng hoặc chính sách chính thức của cửa hàng. Đơn hàng, giá và bảo hành cần được cửa hàng xác nhận theo hóa đơn và điều kiện áp dụng.';
    var modal = document.createElement('div');
    modal.className = 'account-modal-backdrop';
    modal.innerHTML = '<section class="account-modal" role="dialog" aria-modal="true" aria-labelledby="accountLegalTitle"><div class="flex items-start justify-between gap-3">' +
      '<h2 id="accountLegalTitle" class="account-card-title">' + title + '</h2><button class="account-button" type="button" data-action="close-legal">Đóng</button></div>' +
      '<p class="account-muted mt-4">' + content + '</p></section>';
    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-action="close-legal"]')) modal.remove();
    });
    document.body.appendChild(modal);
  }

  function notificationsHtml() {
    var list = store.notifications.slice().sort(function (a, b) {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    var groups = [['all', 'Tất cả'], ['order', 'Đơn hàng'], ['payment', 'Thanh toán'], ['shipping', 'Giao hàng'], ['promotion', 'Khuyến mãi'], ['warranty', 'Bảo hành & đổi trả']];
    if (notificationFilter !== 'all') list = list.filter(function (item) { return item.type === notificationFilter; });
    return '<section class="account-card account-card-pad"><div class="mb-4 flex flex-wrap items-center justify-between gap-3">' +
      '<h2 class="account-card-title">Thông báo tài khoản <span class="account-badge">' + store.notifications.filter(function (item) { return !item.read; }).length + ' chưa đọc</span></h2>' +
      '<button class="account-button" data-action="read-all">Đánh dấu tất cả đã đọc</button></div><div class="account-review-tabs">' +
      groups.map(function (group) { return '<button type="button" data-notification-filter="' + group[0] + '" class="' +
        (notificationFilter === group[0] ? 'is-active' : '') + '">' + group[1] + '</button>'; }).join('') +
      '</div>' + (list.length ? list.map(function (item) {
        var index = store.notifications.indexOf(item);
        return '<article class="account-list-row"><div class="min-w-0"><div class="flex items-center gap-2"><span class="account-badge">' +
          escapeHtml(item.type || 'Cập nhật') + '</span>' + (!item.read ? '<span class="h-2 w-2 rounded-full bg-brand"></span>' : '') +
          '</div><p class="mt-2 text-xs font-extrabold">' + escapeHtml(item.title || 'Cập nhật tài khoản') + '</p><p class="account-muted mt-1">' +
          escapeHtml(item.message) + '</p><p class="mt-1 text-[10px] text-slate-400">' + dateText(item.createdAt) + '</p></div>' +
          '<div class="flex gap-2">' + (!item.read ? '<button class="account-button" data-action="read-notification" data-index="' + index + '">Đã đọc</button>' : '') +
          '<button class="account-button account-button-danger" data-action="delete-notification" data-index="' + index + '">Xóa</button></div></article>';
      }).join('') : emptyState('♧', 'Thông báo của bạn sẽ hiển thị tại đây.')) + '</section>';
  }

  function supportHtml() {
    var faqs = [
      ['Có hỗ trợ trả góp 0% không?', 'Các lựa chọn trả góp hiện trên trang thanh toán tùy chương trình và đơn vị tài chính. Điều kiện cuối cùng do đối tác xác nhận.'],
      ['Có thể nhận hàng tại cửa hàng không?', 'Có. Chọn Nhận tại cửa hàng trên trang thanh toán và chọn chi nhánh còn khả dụng.'],
      ['Thời hạn bảo hành là bao lâu?', 'Thẻ bảo hành điện tử hiển thị thời hạn tham khảo 12 tháng; điều kiện cụ thể theo hóa đơn và chính sách hãng.']
    ];
    return '<div class="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><section class="account-card account-card-pad">' +
      '<h2 class="account-card-title">Gửi yêu cầu hỗ trợ</h2><form data-form="support" class="mt-4 grid gap-3">' +
      '<div class="account-field"><label for="supportType">Chủ đề</label><select class="account-select" id="supportType" name="type">' +
      option('order', 'Câu hỏi về đơn hàng') + option('product', 'Yêu cầu tư vấn sản phẩm') + option('complaint', 'Gửi khiếu nại') + option('warranty', 'Hỗ trợ bảo hành/kỹ thuật') + '</select></div>' +
      field('Mã đơn liên quan (không bắt buộc)', 'orderId', '', 'text', 'VD: #VLU-2026-12345') +
      field('Tiêu đề yêu cầu', 'subject', '', 'text', 'Tóm tắt nội dung cần hỗ trợ') +
      '<div class="account-field"><label for="supportMessage">Nội dung chi tiết</label><textarea class="account-textarea" id="supportMessage" name="message" required minlength="10" placeholder="Mô tả yêu cầu của bạn"></textarea></div>' +
      '<button class="account-button account-button-primary justify-self-start" type="submit">Gửi yêu cầu</button>' +
      '<p class="account-muted">Phiếu được lưu trên thiết bị này; chưa kết nối hệ thống ticket/email của cửa hàng.</p></form>' +
      '<h3 class="account-card-title mt-6">Yêu cầu đã gửi</h3>' +
      (store.supportTickets.length ? store.supportTickets.slice().reverse().map(function (ticket) {
        return '<article class="account-list-row"><div><strong class="text-xs">#' + escapeHtml(ticket.id) + ' · ' + escapeHtml(ticket.subject) +
          '</strong><p class="account-muted mt-1">' + escapeHtml(ticket.typeLabel) + ' · ' + dateText(ticket.createdAt) + '</p><p class="account-muted mt-1">' +
          escapeHtml(ticket.message) + '</p><p class="account-muted mt-1">Phản hồi: ' + escapeHtml(ticket.reply || 'Đang chờ phản hồi') + '</p></div>' +
          '<span class="account-badge">' + escapeHtml(ticket.status || 'Đang chờ phản hồi') + '</span></article>';
      }).join('') : '<p class="account-muted mt-2">Chưa có phiếu hỗ trợ.</p>') + '</section>' +
      '<div class="space-y-5"><section class="account-card account-card-pad"><h2 class="account-card-title">Câu hỏi thường gặp</h2>' +
      faqs.map(function (faq) { return '<details class="mt-3 rounded-xl bg-slate-50/80 p-3"><summary class="cursor-pointer text-xs font-extrabold">' +
        escapeHtml(faq[0]) + '</summary><p class="account-muted mt-2">' + escapeHtml(faq[1]) + '</p></details>'; }).join('') +
      '</section><section class="account-card account-card-pad"><h2 class="account-card-title">Liên hệ CSKH</h2><p class="account-muted mt-2">Hotline 1800-xxxx (thông tin mẫu) · Email hỗ trợ: cskh@vlu.edu.vn · Hệ thống chi nhánh VLU</p></section></div></div>';
  }

  function settingsHtml() {
    var session = window.navigator.userAgent || 'Trình duyệt hiện tại';
    return '<div class="grid gap-5"><section class="account-card account-card-pad"><h2 class="account-card-title">Bảo mật nhanh</h2>' +
      '<p class="account-list-row"><span class="text-xs"><strong>Phiên hiện tại</strong><small class="block text-slate-400">' + escapeHtml(session.slice(0, 120)) +
      '</small></span><span class="account-badge">Đang hoạt động</span></p><button class="account-button mt-3" data-action="show-password-form">Đổi mật khẩu</button>' +
      '<p class="account-muted mt-2">Mật khẩu hiện chưa được quản lý qua API an toàn; không thể xác thực hoặc thay đổi chỉ bằng dữ liệu trình duyệt.</p></section>' +
      '<section class="account-card account-card-pad"><h2 class="account-card-title">Thông báo và quyền riêng tư</h2>' +
      settingRow('pushNotifications', 'Nhận thông báo cập nhật') + settingRow('orderUpdates', 'Cập nhật trạng thái đơn hàng') +
      settingRow('emailUpdates', 'Nhận thông tin dịch vụ qua email') + settingRow('promotions', 'Nhận email quảng cáo/khuyến mãi') +
      settingRow('privateHistory', 'Ẩn lịch sử hoạt động trên trang tài khoản') +
      '<p class="account-muted mt-2">Các tùy chọn được lưu riêng theo tài khoản trên thiết bị này.</p></section>' +
      '<section class="account-card account-card-pad"><h2 class="account-card-title">Pháp lý & tài khoản</h2>' +
      '<div class="mt-3 flex flex-wrap gap-2"><button class="account-button" data-action="legal-policy">Chính sách bảo mật</button>' +
      '<button class="account-button" data-action="legal-terms">Điều khoản sử dụng</button><button class="account-button account-button-danger" data-action="logout">Đăng xuất tài khoản</button></div>' +
      '<p class="account-muted mt-3">Nội dung chính sách hiển thị dưới đây là thông tin tóm tắt; vui lòng liên hệ cửa hàng để biết điều khoản chính thức.</p>' +
      '<div class="mt-5 rounded-xl border border-red-100 bg-red-50/60 p-4"><h3 class="text-sm font-extrabold text-red-800">Yêu cầu xóa dữ liệu tài khoản trên thiết bị này</h3>' +
      '<p class="account-muted mt-1">Thao tác sẽ xóa hồ sơ, dữ liệu cá nhân và giỏ hàng gắn với tài khoản này tại trình duyệt hiện tại.</p>' +
      '<button class="account-button account-button-danger mt-3" data-action="request-delete">Xóa dữ liệu tài khoản</button>' +
      (store.profile.deleteRequested ? '<p class="mt-3 text-xs font-bold text-amber-700">Đã ghi nhận yêu cầu xóa trước đó.</p>' : '') +
      '</div></section></div>';
  }

  function settingRow(key, label) {
    return '<label class="account-list-row account-setting-row cursor-pointer"><span class="text-xs font-bold text-slate-700">' + escapeHtml(label) +
      '</span><span class="account-toggle"><input type="checkbox" data-setting="' + key + '"' + (store.settings[key] ? ' checked' : '') +
      '><i aria-hidden="true"></i></span></label>';
  }

  function tabContent() {
    if (activeTab === 'overview') return overviewHtml();
    if (activeTab === 'profile') return profileHtml();
    if (activeTab === 'orders') return ordersHtml();
    if (activeTab === 'addresses') return addressesHtml();
    if (activeTab === 'wishlist') return productCollectionHtml(store.wishlist, 'wishlist') +
      '<div class="mt-4 flex justify-end"><button class="account-button account-button-danger" data-action="clear-wishlist">Xóa danh sách yêu thích</button></div>';
    if (activeTab === 'recent') return store.settings.privateHistory
      ? '<section class="account-card account-card-pad">' + emptyState('◷', 'Lịch sử hoạt động đang được ẩn theo cài đặt riêng tư.') + '</section>'
      : productCollectionHtml(store.recent, 'recent');
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
    if (['overview', 'orders', 'history', 'warranty', 'reviews'].indexOf(id) !== -1) {
      fetchOrdersFromBackend({ force: id === 'orders' });
    }
  }

  function saveOrders(list) {
    var identity = currentIdentity(currentUser);
    if (!identity) return false;
    var userFiltered = list.filter(function (order) {
      return isOrderOwnedByUser(order, currentUser);
    });
    try {
      localStorage.setItem('vlu_orders', JSON.stringify(list));
      localStorage.setItem('vlu_orders_' + identity, JSON.stringify(userFiltered));
    } catch (error) {
      console.error('[AccountPage] Không thể cập nhật đơn hàng:', error);
      notify('Không thể cập nhật đơn hàng trên thiết bị.', true);
      return false;
    }
    store.orders = userFiltered;
    return saveStore();
  }

  function addToCart(id) {
    var product = findProduct(id);
    if (!product || !window.VLU_CART) {
      notify('Sản phẩm hoặc dịch vụ giỏ hàng hiện không khả dụng.', true);
      return;
    }
    var color = product.colors && product.colors[0] ? product.colors[0] : {};
    var variant = product.variants && product.variants[0] ? product.variants[0] : {};
    var added = window.VLU_CART.addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: (Number(product.basePrice) || 0) + (Number(variant.delta) || 0),
      image: productImage(product),
      color: color.name || 'Mặc định',
      variant: variant.label || 'Tiêu chuẩn',
      quantity: 1
    });
    if (!added) {
      notify('Không thể thêm sản phẩm vào giỏ hàng.', true);
      return;
    }
    updateIdentity();
    notify('Đã thêm sản phẩm vào giỏ hàng.');
  }

  function logout() {
    if (window.VLU_AUTH && typeof window.VLU_AUTH.logout === 'function') {
      window.VLU_AUTH.logout();
    } else {
      localStorage.removeItem('vlu_user');
    }
    window.location.href = 'index.html';
  }

  function downloadInvoice(orderId) {
    var targetKey = normalizeOrderKey(orderId);
    var order = orders().find(function (entry) { return entry && normalizeOrderKey(entry.order_code || entry.id) === targetKey; });
    if (!order) return;
    closeInvoiceModal();
    var displayCode = formatOrderCode(order.order_code || order.id);
    var paid = normalizeOrderStatus(order.status) === 'completed' || String(order.payment_status || '').toLowerCase() === 'paid';
    var items = orderItems(order).map(function (item) {
      var quantity = Number(item.quantity) || 1;
      var price = Number(item.price) || 0;
      return '<tr><td>' + escapeHtml(item.name) + '<br><small>' + escapeHtml(item.color || '') + ' ' + escapeHtml(item.variant || item.storage || '') +
        '</small></td><td>' + quantity + '</td><td>' + money(price) + '</td><td>' + money(price * quantity) + '</td></tr>';
    }).join('');
    var modal = document.createElement('div');
    modal.id = 'accountInvoiceModal';
    modal.className = 'account-modal-backdrop';
    modal.innerHTML = '<section class="account-modal account-invoice" role="dialog" aria-modal="true" aria-labelledby="invoiceTitle"><div class="account-invoice-toolbar">' +
      '<button class="account-button" type="button" data-action="close-invoice">Đóng</button><button class="account-button account-button-primary" type="button" data-action="print-invoice">In / Lưu PDF</button></div>' +
      '<article class="account-invoice-paper"><header class="account-invoice-header"><img src="frontend/assets/images/logo.png" alt="VLU FLAGSHIP STORE"><div><strong>VLU FLAGSHIP STORE</strong><span>BẢNG KÊ ĐƠN HÀNG</span></div>' +
      '<span class="account-invoice-status' + (paid ? ' is-paid' : '') + '">' + (paid ? 'ĐÃ THANH TOÁN' : 'ĐANG XỬ LÝ') + '</span></header>' +
      '<h2 id="invoiceTitle">Thông tin giao dịch</h2><div class="account-invoice-info"><p>Mã đơn<strong>' + escapeHtml(displayCode) + '</strong></p>' +
      '<p>Thời gian đặt<strong>' + dateTimeText(order.created_at) + '</strong></p><p>Người nhận<strong>' + escapeHtml(order.customer_name || profileName()) + '</strong></p>' +
      '<p>Điện thoại<strong>' + escapeHtml(order.customer_phone || currentUser.phone || '—') + '</strong></p><p>Thanh toán<strong>' +
      escapeHtml(order.payment_method || '—') + '</strong></p><p>Nhận hàng<strong>' + escapeHtml(order.customer_address || order.store_location || '—') + '</strong></p></div>' +
      '<table class="account-invoice-table"><thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>' +
      (items || '<tr><td colspan="4">Không có thông tin sản phẩm.</td></tr>') + '</tbody><tfoot><tr><th colspan="3">Tổng thanh toán</th><th>' + money(order.total) + '</th></tr></tfoot></table>' +
      '<p class="account-invoice-note">Bản xem/in này được tạo từ thông tin đơn hàng lưu trên thiết bị, không thay thế hóa đơn điện tử VAT do cửa hàng phát hành.</p></article></section>';
    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-action="close-invoice"]')) closeInvoiceModal();
      if (event.target.closest('[data-action="print-invoice"]') && typeof window.print === 'function') window.print();
    });
    document.body.appendChild(modal);
  }

  function closeInvoiceModal() {
    var modal = document.getElementById('accountInvoiceModal');
    if (modal) modal.remove();
  }

  function readSmallImage(file, done) {
    if (!file) return done('');
    if (!/^image\/(?:png|jpeg|webp)$/i.test(file.type || '')) {
      notify('Vui lòng chọn ảnh PNG, JPG hoặc WebP.', true);
      return done('');
    }
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
      if (button) {
        setTab(button.dataset.tab);
        var sidebar = document.getElementById('accountSidebar');
        if (sidebar && sidebar.classList.contains('is-open')) {
          sidebar.classList.remove('is-open');
          var toggle = document.getElementById('mobileNavToggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
    document.getElementById('mobileNavToggle').addEventListener('click', function () {
      var sidebar = document.getElementById('accountSidebar');
      var open = sidebar.classList.toggle('is-open');
      this.setAttribute('aria-expanded', String(open));
    });
    document.getElementById('accountPanel').addEventListener('click', function (event) {
      var reviewTabButton = event.target.closest('[data-review-tab]');
      if (reviewTabButton) {
        reviewTab = reviewTabButton.dataset.reviewTab;
        editingReviewId = '';
        render();
        return;
      }
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
      if (action === 'add-wishlist') {
        if (store.wishlist.indexOf(id) === -1) store.wishlist.unshift(id);
        saveStore(); notify('Đã thêm vào sản phẩm yêu thích.'); render();
      }
      if (action === 'toggle-address-form') {
        addressFormOpen = !addressFormOpen;
        addressEditIndex = -1;
        render();
      }
      if (action === 'reset-avatar') {
        delete store.profile.avatar;
        delete currentUser.avatar;
        try {
          localStorage.setItem('vlu_user', JSON.stringify(currentUser));
          if (saveStore()) {
            if (window.VLU_AUTH) window.VLU_AUTH.updateHeaderAuth();
            render();
            notify('Đã đặt lại ảnh đại diện mặc định.');
          }
        } catch (error) {
          console.error('[AccountPage] Không thể đặt lại ảnh đại diện:', error);
          notify('Không thể cập nhật ảnh đại diện.', true);
        }
      }
      if (action === 'edit-address') {
        addressEditIndex = index;
        addressFormOpen = true;
        render();
      }
      if (action === 'default-address') {
        store.addresses = store.addresses.map(function (address, i) {
          address.default = i === index;
          return address;
        });
        saveStore(); render();
      }
      if (action === 'delete-address' && store.addresses[index] && !store.addresses[index].default &&
          window.confirm('Xóa địa chỉ này khỏi sổ địa chỉ?')) {
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
        if (store.compare.indexOf(id) !== -1) {
          store.compare = store.compare.filter(function (itemId) { return itemId !== id; });
        } else if (store.compare.length < 3) {
          store.compare.push(id);
          if (saveStore()) {
            notify('Đã thêm sản phẩm vào bảng so sánh.');
            setTab('compare');
          }
          return;
        } else return notify('Có thể so sánh tối đa 3 sản phẩm.', true);
        saveStore(); notify('Đã cập nhật danh sách so sánh.'); render();
      }
      if (action === 'remove-compare') { store.compare = store.compare.filter(function (itemId) { return itemId !== id; }); saveStore(); render(); }
      if (action === 'clear-compare') { store.compare = []; saveStore(); render(); }
      if (action === 'focus-compare-picker') {
        var picker = document.getElementById('compareProduct');
        if (picker) picker.focus();
      }
      if (action === 'order-detail') openOrderModal(id);
      if (action === 'close-order-modal') closeOrderModal();
      if (action === 'close-invoice') closeInvoiceModal();
      if (action === 'print-invoice' && typeof window.print === 'function') window.print();
      if (action === 'review-order') setTab('reviews');
      if (action === 'edit-review') {
        editingReviewId = id;
        reviewTab = 'history';
        render();
      }
      if (action === 'cancel-review-edit') {
        editingReviewId = '';
        render();
      }
      if (action === 'open-warranty-form') {
        warrantyFormOpen = true;
        render();
      }
      if (action === 'close-warranty-form') {
        warrantyFormOpen = false;
        render();
      }
      if (action === 'toggle-password') {
        var target = document.getElementById(button.dataset.target);
        if (target) {
          target.type = target.type === 'password' ? 'text' : 'password';
          button.setAttribute('aria-label', target.type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
        }
      }
      if (action === 'cancel-order') {
        if (!window.confirm('Hủy đơn hàng? Chỉ đơn đang chờ xác nhận/đang chuẩn bị có thể hủy.')) return;
        var cancelKey = normalizeOrderKey(id);
        var currentOrder = orders().find(function (entry) {
          return entry && normalizeOrderKey(entry.order_code || entry.id) === cancelKey;
        });
        if (currentOrder && ['pending', 'confirmed', 'preparing'].indexOf(normalizeOrderStatus(currentOrder.status)) !== -1) {
          var cancelCode = formatOrderCode(currentOrder.order_code || currentOrder.id);
          var nowIso = new Date().toISOString();
          var all = readJson('vlu_orders', []);
          if (!Array.isArray(all)) all = [];
          var gIdx = all.findIndex(function (entry) {
            return entry && normalizeOrderKey(entry.order_code || entry.id) === cancelKey && isOrderOwnedByUser(entry, currentUser);
          });
          var updatedCancelOrder = Object.assign({}, currentOrder, {
            id: cancelCode,
            order_code: cancelCode,
            status: 'cancelled',
            cancel_reason: currentOrder.cancel_reason || 'Khách hàng chủ động hủy đơn',
            updated_at: nowIso
          });
          if (gIdx === -1) all.unshift(updatedCancelOrder);
          else all[gIdx] = updatedCancelOrder;

          if (saveOrders(all)) {
            if (typeof fetch === 'function') {
              fetch('backend/api/orders.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                  action: 'update_status',
                  order_id: cancelCode,
                  order_code: cancelCode,
                  status: 'cancelled',
                  cancel_reason: updatedCancelOrder.cancel_reason,
                  actor: profileName()
                })
              }).catch(function () {});
            }
            notify('Đơn hàng đã được đánh dấu hủy thành công.');
            render();
            refreshOpenOrderModal();
          }
        } else notify('Đơn hàng này không còn ở trạng thái có thể hủy.', true);
      }
      if (action === 'buy-again') {
        var buyKey = normalizeOrderKey(id);
        var order = orders().find(function (entry) { return entry && normalizeOrderKey(entry.order_code || entry.id) === buyKey; });
        if (!order) return;
        var addedCount = 0;
        orderItems(order).forEach(function (item) {
          if (!window.VLU_CART) return;
          var catalog = findProduct(item.id);
          var added = window.VLU_CART.addItem({
            id: item.id, name: item.name, category: item.category || (catalog && catalog.category) || '',
            price: item.price || (catalog && catalog.basePrice) || 0,
            image: catalog ? productImage(catalog) : itemImage(item), color: item.color,
            variant: item.variant, quantity: item.quantity || 1
          });
          if (added) addedCount += 1;
        });
        if (addedCount) window.location.href = 'cart.html';
        else notify('Không có sản phẩm hợp lệ để thêm vào giỏ hàng.', true);
      }
      if (action === 'download-invoice') downloadInvoice(id);
      if (action === 'warranty-request') {
        warrantyFormOpen = true;
        warrantyRequestType = button.dataset.type || 'warranty';
        warrantySelectedPurchase = button.dataset.order && button.dataset.item
          ? button.dataset.order + '::' + button.dataset.item : '';
        render();
        var purchaseSelect = document.querySelector('[data-form="warranty"] [name="purchase"]');
        var requestSelect = document.querySelector('[data-form="warranty"] [name="requestType"]');
        if (purchaseSelect) purchaseSelect.value = warrantySelectedPurchase;
        if (requestSelect) requestSelect.value = warrantyRequestType;
      }
      if (action === 'clear-history-filter') {
        historyFilter = { day: '', month: '', year: '' };
        render();
      }
      if (action === 'copy-voucher') {
        var code = button.dataset.code;
        if (!store.vouchers.some(function (voucher) { return voucher.code === code && voucher.status === 'available'; })) {
          return notify('Voucher này không còn khả dụng.', true);
        }
        try {
          localStorage.setItem('vlu_pending_voucher_' + currentIdentity(currentUser), code);
        } catch (error) {
          console.error('[AccountPage] Không thể chuyển voucher sang giỏ hàng:', error);
          return notify('Không thể chuyển voucher sang giỏ hàng.', true);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).catch(function () { window.prompt('Sao chép mã ưu đãi:', code); });
        } else {
          window.prompt('Sao chép mã ưu đãi:', code);
        }
        notify('Đã sao chép ' + code + '. Đang mở giỏ hàng để áp dụng.');
        window.setTimeout(function () { window.location.href = 'cart.html?applyVoucher=' + encodeURIComponent(code); }, 450);
      }
      if (action === 'read-all') { store.notifications.forEach(function (item) { item.read = true; }); saveStore(); render(); }
      if (action === 'read-notification') { if (store.notifications[index]) store.notifications[index].read = true; saveStore(); render(); }
      if (action === 'delete-notification') { store.notifications.splice(index, 1); saveStore(); render(); }
      if (action === 'delete-review') {
        store.reviews = store.reviews.filter(function (review) { return review.id !== id; });
        saveStore(); render();
      }
      if (action === 'redeem-points') {
        if (store.points < 100) return notify('Chưa đủ điểm để đổi voucher.', true);
        store.points -= 100;
        var rewardCode = 'POINTS100-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 46656).toString(36).toUpperCase();
        store.pointLedger.push({ id: 'P-' + Date.now(), source: 'redeem:' + rewardCode, points: -100, description: 'Đổi voucher ' + rewardCode, createdAt: new Date().toISOString() });
        store.vouchers.push({ code: rewardCode, value: 100000, type: 'fixed', minOrder: 500000, expiresAt: '2026-12-31', source: 'points', status: 'available' });
        addNotification('promotion', 'Đổi điểm thành công', 'Voucher ' + rewardCode + ' đã được thêm vào ví voucher.');
        saveStore(); notify('Đã đổi 100 điểm lấy voucher ' + rewardCode + '.'); render();
      }
      if (action === 'request-delete' && window.confirm('Xóa toàn bộ dữ liệu riêng của tài khoản này trên trình duyệt hiện tại? Không thể hoàn tác.')) {
        try {
          var delIdentity = currentIdentity(currentUser);
          localStorage.removeItem(userKey);
          if (delIdentity) {
            localStorage.removeItem('vlu_orders_' + delIdentity);
            localStorage.removeItem('vlu_cart_' + delIdentity);
            localStorage.removeItem('vlu_cart_voucher_' + delIdentity);
            localStorage.removeItem('vlu_pending_voucher_' + delIdentity);
          }
          var allOrders = readJson('vlu_orders', []);
          if (Array.isArray(allOrders)) {
            localStorage.setItem('vlu_orders', JSON.stringify(allOrders.filter(function (order) {
              return !isOrderOwnedByUser(order, currentUser);
            })));
          }
          logout();
        } catch (error) {
          console.error('[AccountPage] Không thể xóa dữ liệu tài khoản:', error);
          notify('Không thể xóa toàn bộ dữ liệu. Vui lòng kiểm tra dung lượng trình duyệt.', true);
        }
      }
      if (action === 'show-password-form') { setTab('profile'); }
      if (action === 'legal-policy' || action === 'legal-terms') openLegalModal(action);
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
      if (event.target.id === 'compareSearch') {
        compareSearch = event.target.value;
        var productSelect = document.getElementById('compareProduct');
        if (productSelect) {
          var filter = compareSearch.toLowerCase();
          Array.prototype.forEach.call(productSelect.options, function (optionNode, optionIndex) {
            if (optionIndex === 0) return;
            optionNode.hidden = Boolean(filter) && optionNode.textContent.toLowerCase().indexOf(filter) === -1;
          });
        }
      }
      if (event.target.id === 'password-newPassword') {
        var password = event.target.value;
        var score = (password.length >= 8 ? 1 : 0) +
          (/[A-Z]/.test(password) ? 1 : 0) +
          (/[a-z]/.test(password) ? 1 : 0) +
          (/\d/.test(password) ? 1 : 0) +
          (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
        var meter = document.querySelector('[data-password-meter]');
        var strength = document.querySelector('[data-password-strength]');
        if (meter) meter.style.width = (score * 20) + '%';
        if (strength) strength.textContent = password ? ['Rất yếu', 'Yếu', 'Trung bình', 'Khá', 'Mạnh', 'Rất mạnh'][score] : 'Độ mạnh mật khẩu';
        if (meter) meter.setAttribute('data-strength', String(score));
      }
    });

    document.getElementById('accountPanel').addEventListener('change', function (event) {
      if (event.target.matches('[data-setting]')) {
        store.settings[event.target.dataset.setting] = event.target.checked;
        if (saveStore()) notify('Đã lưu tùy chọn tài khoản.');
      }
      if (event.target.id === 'orderDateFilter') {
        orderDateFilter = event.target.value;
        var list = filteredOrders();
        var rows = document.getElementById('orderRows');
        if (rows) rows.innerHTML = list.length ? list.map(orderRow).join('') : emptyState('▤', 'Không có đơn hàng trong khoảng thời gian này.');
      }
      if (event.target.matches('[data-review-image]') && event.target.files[0]) {
        var reviewForm = event.target.closest('form[data-form="review"]');
        var preview = reviewForm && reviewForm.querySelector('[data-review-preview]');
        readSmallImage(event.target.files[0], function (image) {
          if (preview && image) preview.innerHTML = '<img src="' + escapeHtml(image) + '" alt="Ảnh đánh giá xem trước">';
        });
      }
      if (event.target.matches('[data-profile-avatar]') && event.target.files[0]) {
        readSmallImage(event.target.files[0], function (image) {
          if (!image) return;
          store.profile.avatar = image;
          currentUser.avatar = image;
          try {
            localStorage.setItem('vlu_user', JSON.stringify(currentUser));
            if (saveStore()) {
              if (window.VLU_AUTH) window.VLU_AUTH.updateHeaderAuth();
              render();
              notify('Ảnh đại diện đã được cập nhật.');
            }
          } catch (error) {
            console.error('[AccountPage] Không thể đồng bộ ảnh đại diện:', error);
            notify('Không thể lưu ảnh đại diện.', true);
          }
        });
      }
    });
    document.getElementById('accountPanel').addEventListener('error', function (event) {
      var image = event.target;
      if (!image.matches('[data-account-product-image]') || image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = 'true';
      image.src = PRODUCT_PLACEHOLDER;
    }, true);

    document.getElementById('accountPanel').addEventListener('submit', function (event) {
      var form = event.target.closest('form[data-form]');
      if (!form) return;
      event.preventDefault();
      var formData = new FormData(form);

      if (form.dataset.form === 'compare-add') {
        var productId = String(formData.get('productId') || '');
        if (!productId || !findProduct(productId)) return notify('Vui lòng chọn sản phẩm có trong catalog.', true);
        if (store.compare.length >= 3) return notify('Có thể so sánh tối đa 3 sản phẩm.', true);
        if (store.compare.indexOf(productId) === -1) store.compare.push(productId);
        compareSearch = '';
        if (saveStore()) { render(); notify('Đã thêm sản phẩm vào bảng so sánh.'); }
        return;
      }

      if (form.dataset.form === 'history-filter') {
        historyFilter = {
          day: String(formData.get('day') || ''),
          month: String(formData.get('month') || ''),
          year: String(formData.get('year') || '').trim()
        };
        render();
        return;
      }

      if (form.dataset.form === 'warranty') {
        var purchaseKey = String(formData.get('purchase') || '');
        var separator = purchaseKey.indexOf('::');
        var purchaseOrderId = separator === -1 ? '' : purchaseKey.slice(0, separator);
        var purchaseItemId = separator === -1 ? '' : purchaseKey.slice(separator + 2);
        var purchaseOrderKey = normalizeOrderKey(purchaseOrderId);
        var purchaseOrder = orders().find(function (order) {
          return normalizeOrderKey(order.order_code || order.id) === purchaseOrderKey &&
            normalizeOrderStatus(order.status) === 'completed';
        });
        var purchasedItem = purchaseOrder && orderItems(purchaseOrder).find(function (item) {
          return String(item.id || item.name) === purchaseItemId;
        });
        var requestMessage = String(formData.get('message') || '').trim();
        var requestType = String(formData.get('requestType') || 'warranty');
        if (!purchaseOrder || !purchasedItem) return notify('Vui lòng chọn sản phẩm từ đơn đã giao.', true);
        if (requestMessage.length < 10) return notify('Mô tả tình trạng cần tối thiểu 10 ký tự.', true);
        var isReturn = requestType === 'return';
        var purchaseCode = formatOrderCode(purchaseOrder.order_code || purchaseOrder.id);
        store.tickets.push({
          id: (isReturn ? 'R-' : 'W-') + Date.now(),
          type: isReturn ? 'return' : 'warranty',
          typeLabel: isReturn ? 'Đổi trả 1-1' : 'Bảo hành lỗi kỹ thuật',
          subject: (isReturn ? 'Yêu cầu đổi trả: ' : 'Yêu cầu bảo hành: ') + purchasedItem.name,
          orderId: purchaseCode,
          itemId: purchasedItem.id || purchasedItem.name,
          message: requestMessage,
          status: 'Đã tiếp nhận',
          createdAt: new Date().toISOString()
        });
        addNotification('warranty', isReturn ? 'Đã gửi yêu cầu đổi trả' : 'Đã gửi yêu cầu bảo hành',
          'Yêu cầu cho đơn ' + purchaseCode + ' đã được lưu trên thiết bị.');
        warrantyFormOpen = false;
        warrantySelectedPurchase = '';
        if (saveStore()) { render(); notify('Yêu cầu đã được lưu trên thiết bị; vui lòng liên hệ cửa hàng để xác nhận tiếp nhận.'); }
        return;
      }

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
          if (!saveStore()) return;
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
          id: addressEditIndex >= 0 ? store.addresses[addressEditIndex].id : 'A-' + Date.now(),
          name: String(formData.get('name') || '').trim(),
          phone: String(formData.get('phone') || '').trim(),
          city: String(formData.get('city') || '').trim(),
          district: String(formData.get('district') || '').trim(),
          ward: String(formData.get('ward') || '').trim(),
          street: String(formData.get('street') || '').trim(),
          label: String(formData.get('label') || 'home'),
          default: Boolean(formData.get('default')) || store.addresses.length === 0
        };
        if (!address.name || !address.phone || !address.city || !address.district || !address.ward || !address.street) {
          return notify('Vui lòng nhập đủ tên, số điện thoại và địa chỉ.', true);
        }
        address.address = [address.street, address.ward, address.district, address.city].join(', ');
        if (address.default) store.addresses.forEach(function (item) { item.default = false; });
        if (addressEditIndex >= 0) store.addresses[addressEditIndex] = address;
        else store.addresses.push(address);
        if (!store.addresses.some(function (item) { return item.default; }) && store.addresses[0]) {
          store.addresses[0].default = true;
        }
        if (saveStore()) {
          addressEditIndex = -1;
          addressFormOpen = false;
          render();
          notify('Đã lưu địa chỉ.');
        }
      }

      if (form.dataset.form === 'password') {
        var newPassword = String(formData.get('newPassword') || '');
        var confirmPassword = String(formData.get('confirmPassword') || '');
        if (!String(formData.get('currentPassword') || '') || !newPassword || !confirmPassword) {
          return notify('Vui lòng điền đủ ba trường mật khẩu.', true);
        }
        if (newPassword.length < 8) return notify('Mật khẩu mới cần tối thiểu 8 ký tự.', true);
        if (newPassword !== confirmPassword) return notify('Mật khẩu xác nhận không khớp.', true);
        notify('Chưa thể đổi mật khẩu: hệ thống hiện chưa có API xác thực và cập nhật mật khẩu an toàn.', true);
      }

      if (form.dataset.form === 'support') {
        var message = String(formData.get('message') || '').trim();
        var subject = String(formData.get('subject') || '').trim();
        if (message.length < 10 || !subject) return notify('Vui lòng nhập tiêu đề và nội dung tối thiểu 10 ký tự.', true);
        var type = String(formData.get('type') || 'other');
        var typeLabels = { order: 'Câu hỏi về đơn hàng', product: 'Tư vấn sản phẩm', complaint: 'Khiếu nại', warranty: 'Hỗ trợ bảo hành/kỹ thuật' };
        var ticket = {
          id: 'SUP-' + Date.now(), type: type, typeLabel: typeLabels[type] || type,
          subject: subject,
          orderId: String(formData.get('orderId') || ''),
          message: message, status: 'Đang chờ phản hồi', createdAt: new Date().toISOString()
        };
        store.supportTickets.push(ticket);
        if (saveStore()) {
          addNotification('warranty', 'Đã gửi yêu cầu hỗ trợ', 'Mã phiếu #' + ticket.id + ' đã được lưu trên thiết bị.');
          render(); notify('Đã lưu phiếu hỗ trợ #' + ticket.id + ' trên thiết bị.');
        }
      }

      if (form.dataset.form === 'review') {
        var comment = String(formData.get('comment') || '').trim();
        if (comment.length < 5) return notify('Nhận xét cần tối thiểu 5 ký tự.', true);
        var reviewId = form.dataset.reviewId;
        var previousReview = store.reviews.find(function (review) { return review.id === reviewId; });
        var reviewData = {
          id: reviewId,
          name: previousReview ? previousReview.name : reviewId.split(':').slice(1).join(':'),
          orderId: previousReview ? previousReview.orderId : reviewId.slice(0, reviewId.indexOf(':')),
          rating: Math.max(1, Math.min(5, Number(formData.get('rating')) || 5)),
          comment: comment,
          tags: formData.getAll('tags').map(function (tag) { return String(tag); }),
          createdAt: new Date().toISOString()
        };
        var imageFile = form.querySelector('[name="reviewImage"]');
        if (imageFile && imageFile.files[0] &&
            (!/^image\/(?:png|jpeg|webp)$/i.test(imageFile.files[0].type || '') || imageFile.files[0].size > 1024 * 1024)) {
          return notify('Ảnh đánh giá phải là PNG, JPG hoặc WebP và tối đa 1 MB.', true);
        }
        readSmallImage(imageFile && imageFile.files[0], function (image) {
          if (image) reviewData.image = image;
          else if (previousReview && previousReview.image && !formData.get('removeReviewImage')) reviewData.image = previousReview.image;
          store.reviews = store.reviews.filter(function (review) { return review.id !== reviewId; });
          store.reviews.push(reviewData);
          if (!previousReview) awardPoints('review:' + reviewId, 50, 'Đánh giá ' + reviewData.name);
          editingReviewId = '';
          reviewTab = 'history';
          if (saveStore()) { render(); notify('Đánh giá đã được lưu trên thiết bị.'); }
        });
      }
    });

    document.getElementById('accountPanel').addEventListener('click', function (event) {
      var filterButton = event.target.closest('[data-order-filter]');
      if (filterButton) {
        orderFilter = filterButton.dataset.orderFilter;
        render();
      }
      var voucherButton = event.target.closest('[data-voucher-filter]');
      if (voucherButton) { voucherFilter = voucherButton.dataset.voucherFilter; render(); }
      var notificationButton = event.target.closest('[data-notification-filter]');
      if (notificationButton) { notificationFilter = notificationButton.dataset.notificationFilter; render(); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeOrderModal();
        closeInvoiceModal();
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

  window.VLU_ACCOUNT_SYNC = {
    ORDER_PIPELINE_STEPS: ORDER_PIPELINE_STEPS,
    STATUS_LABELS: STATUS_LABELS,
    STATUS_RANK: STATUS_RANK,
    normalizeOrderKey: normalizeOrderKey,
    formatOrderCode: formatOrderCode,
    normalizeOrderStatus: normalizeOrderStatus,
    getStatusRank: getStatusRank,
    mergeOrderRecords: mergeOrderRecords,
    syncUserOrders: syncUserOrders,
    fetchOrdersFromBackend: fetchOrdersFromBackend,
    openOrderModal: openOrderModal,
    closeOrderModal: closeOrderModal,
    getOrders: orders
  };

  function init() {
    currentUser = getAuthenticatedUser();
    if (!currentUser) {
      redirectGuestToLogin();
      return;
    }
    userKey = 'vlu_account_' + currentIdentity(currentUser);
    store = normalizeStore(readJson(userKey, {}));
    syncUserOrders();
    saveStore();
    ensureAccountRewards();
    reconcilePoints();
    if (store.profile.fullname) currentUser.fullname = store.profile.fullname;
    if (store.profile.email) currentUser.email = store.profile.email;
    if (store.profile.phone) currentUser.phone = store.profile.phone;
    if (store.profile.avatar) currentUser.avatar = store.profile.avatar;
    recordCurrentProduct();
    render();
    bindEvents();
    fetchOrdersFromBackend({ force: true });
    window.addEventListener('storage', function (event) {
      if (event.key === 'vlu_user') {
        currentUser = getAuthenticatedUser();
        if (!currentUser) {
          redirectGuestToLogin();
          return;
        }
        var currentId = currentIdentity(currentUser);
        if (currentId !== userKey.replace(/^vlu_account_/, '')) {
          userKey = 'vlu_account_' + currentId;
          store = normalizeStore(readJson(userKey, {}));
          syncUserOrders();
          render();
          fetchOrdersFromBackend({ force: true });
        }
      }
      if (event.key === 'vlu_orders' || (event.key && event.key.indexOf('vlu_orders_') === 0) || event.key === 'vlu_sync_timestamp') {
        syncUserOrders();
        reconcilePoints();
        render();
        refreshOpenOrderModal();
      }
      if (event.key === userKey) {
        store = normalizeStore(readJson(userKey, {}));
        syncUserOrders();
        if (store.profile.avatar) currentUser.avatar = store.profile.avatar;
        reconcilePoints();
        render();
        refreshOpenOrderModal();
      }
    });
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        var bc = new BroadcastChannel('vlu_store_sync');
        bc.onmessage = function () {
          fetchOrdersFromBackend({ force: true });
        };
      }
    } catch (eBc) {}
    window.addEventListener('focus', function () {
      fetchOrdersFromBackend();
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) fetchOrdersFromBackend();
    });
    window.addEventListener('popstate', function () {
      activeTab = new URLSearchParams(window.location.search).get('tab') || 'overview';
      render();
    });
    window.addEventListener('vlu:cart-updated', updateIdentity);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);
