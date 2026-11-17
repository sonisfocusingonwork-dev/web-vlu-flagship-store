/**
 * VLU FLAGSHIP STORE – Admin Control & Analytics Engine 2026
 * Quản trị toàn diện: Dashboard dữ liệu thực, Sản phẩm (CRUD), Danh mục, Thương hiệu,
 * Kho hàng, Đơn hàng, Khách hàng, Nhật ký hoạt động & Đồng bộ thời gian thực.
 */
(function (window, document) {
  'use strict';

  var STORAGE_PRODUCTS = 'vlu_admin_products';
  var STORAGE_DELETED_PRODUCTS = 'vlu_admin_deleted_products';
  var STORAGE_CATEGORIES = 'vlu_admin_categories'; // Nguồn dữ liệu độc lập cho Danh mục sản phẩm (Categories)
  var STORAGE_BRANDS = 'vlu_admin_brands'; // Nguồn dữ liệu độc lập cho Thương hiệu (Brands)
  var LEGACY_PRODUCT_CATEGORIES_KEY = 'vlu_admin_product_categories';
  var STORAGE_ORDERS = 'vlu_orders';
  var STORAGE_USERS = 'vlu_admin_users';
  var STORAGE_MODELS_3D = 'vlu_admin_models_3d';
  var STORAGE_ACTIVITY_LOG = 'vlu_admin_activity_log';
  var STORAGE_NOTIF_READ = 'vlu_admin_notif_read';
  var STORAGE_ACCOUNT_AUDIT_LOG = 'vlu_admin_account_audit_log';
  var STORAGE_INVENTORY_LOGS = 'vlu_admin_inventory_logs';
  var STORAGE_VOUCHERS = 'vlu_admin_vouchers';
  var STORAGE_PROMOTIONS = 'vlu_admin_promotions';
  var STORAGE_RETURNS_EXTRA = 'vlu_admin_returns';
  var STORAGE_SENT_NOTIFS = 'vlu_admin_sent_notifications';
  var STORAGE_SETTINGS = 'vlu_admin_settings';

  var DEFAULT_VOUCHERS = [
    { id: 'VCH-VLU2026', code: 'VLU2026', label: 'Ưu đãi Tân Sinh Viên & Khách hàng VLU 2026 (-500.000₫)', type: 'fixed', value: 500000, maxDiscount: 0, minOrder: 1000000, brandFilter: 'all', categoryFilter: 'all', usageLimit: 0, usedCount: 0, expiresAt: '2026-12-31', status: 'active', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 'VCH-FLAGSHIP', code: 'FLAGSHIP', label: 'Đặc quyền VLU Flagship Member (-1.000.000₫)', type: 'fixed', value: 1000000, maxDiscount: 0, minOrder: 15000000, brandFilter: 'all', categoryFilter: 'all', usageLimit: 0, usedCount: 0, expiresAt: '2026-12-31', status: 'active', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 'VCH-APPLEVIP', code: 'APPLEVIP', label: 'Voucher Apple Ecosystem Care (-800.000₫)', type: 'fixed', value: 800000, maxDiscount: 0, minOrder: 10000000, brandFilter: 'Apple', categoryFilter: 'all', usageLimit: 0, usedCount: 0, expiresAt: '2026-12-31', status: 'active', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 'VCH-FREESHIP', code: 'FREESHIP', label: 'Miễn phí vận chuyển toàn quốc (0₫)', type: 'freeship', value: 0, maxDiscount: 0, minOrder: 0, brandFilter: 'all', categoryFilter: 'all', usageLimit: 0, usedCount: 0, expiresAt: '2026-12-31', status: 'active', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 'VCH-FLAGSHIP500K', code: 'FLAGSHIP500K', label: 'Ưu đãi Flagship (-500.000₫)', type: 'fixed', value: 500000, maxDiscount: 0, minOrder: 5000000, brandFilter: 'all', categoryFilter: 'all', usageLimit: 0, usedCount: 0, expiresAt: '2026-12-31', status: 'active', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 'VCH-SVVLU10', code: 'SVVLU10', label: 'Ưu đãi sinh viên VLU (-10%)', type: 'percent', value: 10, maxDiscount: 1000000, minOrder: 1000000, brandFilter: 'all', categoryFilter: 'all', usageLimit: 0, usedCount: 0, expiresAt: '2026-12-31', status: 'active', created_at: '2026-01-01T00:00:00.000Z' }
  ];

  var DEFAULT_SYSTEM_SETTINGS = {
    storeName: 'VLU FLAGSHIP STORE',
    hotline: '1900 8868',
    supportEmail: 'cskh@vluflagship.vn',
    address: '69/68 Đặng Thùy Trâm, P.13, Q. Bình Thạnh, TP.HCM',
    defaultLowStockThreshold: 5,
    standardShippingFee: 0,
    freeShippingThreshold: 2000000,
    currency: 'VNĐ'
  };

  var ORDER_PIPELINE_STEPS = [
    { key: 'pending', label: 'Chờ xác nhận', shortLabel: 'Chờ XN', badgeClass: 'vlu-badge-warning' },
    { key: 'confirmed', label: 'Đã xác nhận', shortLabel: 'Đã XN', badgeClass: 'vlu-badge-info' },
    { key: 'preparing', label: 'Đang chuẩn bị hàng', shortLabel: 'Chuẩn bị', badgeClass: 'vlu-badge-indigo' },
    { key: 'handed_over', label: 'Đã bàn giao vận chuyển', shortLabel: 'Bàn giao', badgeClass: 'vlu-badge-purple' },
    { key: 'shipping', label: 'Đang giao hàng', shortLabel: 'Đang giao', badgeClass: 'vlu-badge-sky' },
    { key: 'completed', label: 'Giao thành công', shortLabel: 'Hoàn thành', badgeClass: 'vlu-badge-success' }
  ];

  var ORDER_STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị hàng',
    handed_over: 'Đã bàn giao vận chuyển',
    shipping: 'Đang giao hàng',
    completed: 'Giao thành công',
    cancelled: 'Đã hủy',
    returned: 'Hoàn trả'
  };

  var ORDER_STATUS_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['handed_over', 'cancelled'],
    handed_over: ['shipping', 'cancelled'],
    shipping: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
    returned: []
  };

  function isProtectedRootAdmin(user) {
    if (!user) return false;
    var uName = String(user.username || '').trim().toLowerCase();
    var uEmail = String(user.email || '').trim().toLowerCase();
    var uId = String(user.id || '').trim();
    return uName === 'admin' || uEmail === 'admin@vluflagship.vn' || uId === '1';
  }

  function sanitizeUserRecord(user, idx) {
    if (!user || typeof user !== 'object') return null;
    var clean = {};
    Object.keys(user).forEach(function (k) {
      var lk = String(k).toLowerCase();
      if (lk === 'password' || lk === 'password_hash' || lk === 'pwd' || lk === 'pass' || lk === 'hash') return;
      clean[k] = user[k];
    });
    var isRoot = isProtectedRootAdmin(clean);
    var isAdm = isRoot || Number(clean.role) === 1 || String(clean.role || '').toLowerCase() === 'admin';
    var rawStatus = String(clean.status || '').trim().toLowerCase();
    var isLocked = !isRoot && (Boolean(clean.is_locked) || rawStatus === 'locked');
    var rawId = (clean.id !== undefined && clean.id !== null && String(clean.id).trim() !== '') ? clean.id : (idx !== undefined ? (idx + 1) : ('USR-' + Date.now()));
    var idStr = String(rawId).trim();
    clean.id = rawId;
    clean.user_code = clean.user_code || (/^\d+$/.test(idStr) ? ('#USR-' + ('0000' + idStr).slice(-4)) : ('#' + idStr.toUpperCase()));
    clean.username = String(clean.username || clean.email || ('user_' + idStr)).trim();
    clean.fullname = String(clean.fullname || clean.name || clean.username || 'Thành viên VLU').trim();
    clean.email = String(clean.email || '').trim();
    clean.phone = String(clean.phone || '').trim();
    clean.role = isAdm ? 1 : 0;
    clean.status = isLocked ? 'locked' : 'active';
    clean.is_locked = isLocked;
    clean.is_protected_root = isRoot;
    clean.lock_reason = isLocked ? String(clean.lock_reason || 'Tạm khóa bởi quản trị viên') : '';
    clean.locked_at = isLocked ? (clean.locked_at || null) : null;
    clean.created_at = String(clean.created_at || clean.registeredAt || new Date().toISOString()).slice(0, 10);
    return clean;
  }

  // 1. DANH MỤC THIẾT BỊ CHUẨN (PRODUCT CATEGORIES)
  var DEFAULT_PRODUCT_CATEGORIES = [
    { id: 1, slug: 'dien-thoai', name: 'Điện thoại', icon: '📱', image: 'SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png', parent_id: null, status: 'active', sort_order: 1, description: 'Smartphone flagship chính hãng Apple, Samsung, Xiaomi, OPPO, vivo', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 2, slug: 'laptop', name: 'Laptop', icon: '💻', image: '', parent_id: null, status: 'active', sort_order: 2, description: 'MacBook, Laptop Gaming, Đồ họa sáng tạo & Văn phòng', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 3, slug: 'ipad', name: 'iPad / Máy tính bảng', icon: '📲', image: '', parent_id: null, status: 'active', sort_order: 3, description: 'iPad Pro, iPad Air, Galaxy Tab, Xiaomi Pad chính hãng', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 4, slug: 'tai-nghe', name: 'Tai nghe', icon: '🎧', image: '', parent_id: null, status: 'active', sort_order: 4, description: 'AirPods, Galaxy Buds, JBL Bluetooth & chống ồn ANC', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 5, slug: 'loa', name: 'Loa', icon: '🔊', image: '', parent_id: null, status: 'active', sort_order: 5, description: 'Loa di động & loa gia đình JBL, Marshall, Soundcore', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 6, slug: 'dong-ho-dien-tu', name: 'Đồng hồ điện tử', icon: '⌚', image: '', parent_id: null, status: 'active', sort_order: 6, description: 'Apple Watch, Samsung Galaxy Watch thông minh', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 7, slug: 'phu-kien', name: 'Phụ kiện', icon: '🔌', image: '', parent_id: null, status: 'active', sort_order: 7, description: 'Sạc nhanh, cáp truyền dữ liệu, ốp lưng & phụ kiện công nghệ', created_at: '2026-01-01T00:00:00.000Z' }
  ];

  // 2. DANH SÁCH THƯƠNG HIỆU CHUẨN (BRANDS - Giữ ID 1..14 tương thích MySQL categories)
  var DEFAULT_BRANDS = [
    { id: 1, name: 'Apple', slug: 'apple', shortCode: 'APL', icon: '🍎', logo: '', status: 'active', sort_order: 1, description: 'iPhone, iPad, MacBook, Apple Watch, AirPods chính hãng VN/A', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 2, name: 'Samsung', slug: 'samsung', shortCode: 'SAM', icon: '🔷', logo: '', status: 'active', sort_order: 2, description: 'Galaxy S, Galaxy Z Fold/Flip, Galaxy Tab, Watch & Buds', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 3, name: 'Xiaomi', slug: 'xiaomi', shortCode: 'XIA', icon: '🟠', logo: '', status: 'active', sort_order: 3, description: 'Xiaomi Flagship, Redmi Note, POCO & Xiaomi Pad', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 4, name: 'OPPO', slug: 'oppo', shortCode: 'OPP', icon: '🟢', logo: '', status: 'active', sort_order: 4, description: 'OPPO Find X, Find N, Reno Series & OPPO Pad', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 5, name: 'vivo', slug: 'vivo', shortCode: 'VIV', icon: '🔹', logo: '', status: 'active', sort_order: 5, description: 'vivo X Series Zeiss Camera & V Series mỏng nhẹ', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 6, name: 'ASUS', slug: 'asus', shortCode: 'ASU', icon: '💻', logo: '', status: 'active', sort_order: 6, description: 'Zenbook OLED, Vivobook, ROG Strix & ProArt Studio', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 7, name: 'Lenovo', slug: 'lenovo', shortCode: 'LEN', icon: '💻', logo: '', status: 'active', sort_order: 7, description: 'ThinkPad, IdeaPad Slim, Legion Gaming & Yoga Pro', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 8, name: 'HP', slug: 'hp', shortCode: 'HP', icon: '💻', logo: '', status: 'active', sort_order: 8, description: 'HP Spectre, Envy, OmniBook & Victus Gaming', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 9, name: 'Acer', slug: 'acer', shortCode: 'ACR', icon: '💻', logo: '', status: 'active', sort_order: 9, description: 'Acer Swift Go AI & Predator Helios Gaming', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 10, name: 'MSI', slug: 'msi', shortCode: 'MSI', icon: '💻', logo: '', status: 'active', sort_order: 10, description: 'MSI Stealth, Vector, Raider & Prestige Creator', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 11, name: 'Dell', slug: 'dell', shortCode: 'DEL', icon: '💻', logo: '', status: 'active', sort_order: 11, description: 'Dell XPS Flagship, Inspiron & Precision cao cấp', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 12, name: 'JBL', slug: 'jbl', shortCode: 'JBL', icon: '🔊', logo: '', status: 'active', sort_order: 12, description: 'Tai nghe True Wireless & Loa di động JBL Charge, Flip, Boombox', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 13, name: 'Marshall', slug: 'marshall', shortCode: 'MAR', icon: '🎸', logo: '', status: 'active', sort_order: 13, description: 'Loa Bluetooth cổ điển Marshall Acton, Stanmore, Emberton', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 14, name: 'Soundcore', slug: 'soundcore', shortCode: 'ANK', icon: '🎵', logo: '', status: 'active', sort_order: 14, description: 'Anker Soundcore Motion & Loa Bluetooth hi-fi di động', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 15, name: 'Sony', slug: 'sony', shortCode: 'SNY', icon: '🎧', logo: '', status: 'active', sort_order: 15, description: 'Tai nghe chống ồn WH/WF-1000XM, loa di động & thiết bị giải trí Sony', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 16, name: 'Logitech', slug: 'logitech', shortCode: 'LOG', icon: '🖱️', logo: '', status: 'active', sort_order: 16, description: 'Chuột MX Master, bàn phím cơ & thiết bị ngoại vi Logitech', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 17, name: 'Garmin', slug: 'garmin', shortCode: 'GAR', icon: '⌚', logo: '', status: 'active', sort_order: 17, description: 'Đồng hồ thể thao GPS thông minh Garmin Fenix, Forerunner, Venu', created_at: '2026-01-01T00:00:00.000Z' }
  ];

  var DEFAULT_PRODUCT_STOCK = 15; // Khớp schema MySQL `stock INT(11) NOT NULL DEFAULT 15`

  function parseDateSafe(value) {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    var str = String(value).trim();
    if (!str) return null;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(str)) {
      str = str.replace(' ', 'T');
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      str = str + 'T00:00:00';
    }
    var d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  function toLocalDateKey(date) {
    var d = parseDateSafe(date);
    if (!d) return '';
    var y = d.getFullYear();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return y + '-' + m + '-' + day;
  }

  function toMonthKey(date) {
    var d = parseDateSafe(date);
    if (!d) return '';
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }

  function normalizeText(str) {
    var s = String(str || '');
    try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    return s.replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
  }

  function slugify(str) {
    return normalizeText(str).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  }

  function calcGrowthPct(current, previous) {
    var cur = Number(current) || 0;
    var prev = Number(previous) || 0;
    if (prev === 0 && cur === 0) {
      return { pct: 0, label: '0%', direction: 'neutral', hasBaseline: true };
    }
    if (prev === 0 && cur > 0) {
      return { pct: null, label: 'Mới phát sinh', direction: 'up', hasBaseline: false };
    }
    var pct = Math.round(((cur - prev) / prev) * 1000) / 10;
    var sign = pct > 0 ? '+' : '';
    return {
      pct: pct,
      label: sign + pct + '%',
      direction: pct > 0 ? 'up' : (pct < 0 ? 'down' : 'neutral'),
      hasBaseline: true
    };
  }

  function getCategoryDisplayName(slug, list) {
    var cats = Array.isArray(list) ? list : DEFAULT_PRODUCT_CATEGORIES;
    var s = String(slug || '').trim().toLowerCase();
    for (var i = 0; i < cats.length; i++) {
      if (String(cats[i].slug || '').toLowerCase() === s) return cats[i].name;
    }
    var fallbackMap = {
      'dien-thoai': 'Điện thoại',
      'laptop': 'Laptop',
      'ipad': 'iPad / Máy tính bảng',
      'tai-nghe': 'Tai nghe',
      'loa': 'Loa',
      'dong-ho-dien-tu': 'Đồng hồ điện tử',
      'phu-kien': 'Phụ kiện'
    };
    return fallbackMap[s] || (s ? s : 'Khác');
  }

  function normalizeSku(rawSku, fallbackId, brandName) {
    var clean = String(rawSku || '').trim().toUpperCase().replace(/[^A-Z0-9._-]+/g, '-').replace(/^-|-$/g, '');
    if (clean) return clean;
    var base = String(fallbackId || 'PROD').trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
    var prefix = brandName ? normalizeText(brandName).replace(/[^a-z0-9]/g, '').slice(0, 3).toUpperCase() : 'VLU';
    if (base.indexOf('ADMIN-PRODUCT-') === 0) {
      return 'VLU-' + (prefix || 'PRD') + '-' + base.slice(-6);
    }
    return base || ('VLU-' + Date.now());
  }

  function buildShortCode(name) {
    var clean = normalizeText(name).replace(/[^a-z0-9\s]/g, ' ').trim();
    if (!clean) return 'BRN';
    var parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].slice(0, 2)).toUpperCase();
    }
    return clean.slice(0, 3).toUpperCase();
  }

  function looksLikeBrandArray(arr) {
    if (!Array.isArray(arr) || !arr.length) return false;
    var brandSignals = ['apple', 'samsung', 'xiaomi', 'oppo', 'vivo', 'asus', 'lenovo', 'jbl', 'marshall', 'soundcore'];
    var catSignals = ['dien-thoai', 'laptop', 'ipad', 'tai-nghe', 'loa', 'dong-ho-dien-tu', 'phu-kien'];
    var hasCat = arr.some(function (x) { return x && catSignals.indexOf(String(x.slug || '').toLowerCase()) !== -1; });
    var hasBrand = arr.some(function (x) {
      return x && (brandSignals.indexOf(String(x.slug || '').toLowerCase()) !== -1 || brandSignals.indexOf(normalizeText(x.name)) !== -1);
    });
    return hasBrand && !hasCat;
  }

  function normalizeCategoryRecord(c, idx) {
    var slug = slugify((c && (c.slug || c.name)) || ('cat-' + (idx + 1)));
    var def = DEFAULT_PRODUCT_CATEGORIES.find(function (d) { return d.slug === slug; });
    return {
      id: Number(c && c.id) || (idx + 1),
      name: String((c && c.name) || (def && def.name) || slug).trim(),
      slug: slug,
      icon: (c && c.icon) || (def && def.icon) || '📦',
      image: (c && c.image) || (def && def.image) || '',
      description: (c && c.description !== undefined) ? String(c.description) : ((def && def.description) || ''),
      parent_id: (c && c.parent_id !== undefined && c.parent_id !== null && c.parent_id !== '') ? Number(c.parent_id) : null,
      status: (c && c.status === 'inactive') ? 'inactive' : 'active',
      sort_order: Number(c && c.sort_order) || (idx + 1),
      created_at: (c && c.created_at) || (def && def.created_at) || new Date().toISOString(),
      updated_at: (c && c.updated_at) || null
    };
  }

  function normalizeBrandRecord(b, idx) {
    var name = String((b && b.name) || 'Khác').trim();
    var slug = slugify((b && (b.slug || name)) || ('brand-' + (idx + 1)));
    var def = DEFAULT_BRANDS.find(function (d) { return d.slug === slug || normalizeText(d.name) === normalizeText(name); });
    return {
      id: Number(b && b.id) || (def && def.id) || (idx + 1),
      name: name,
      slug: slug,
      shortCode: String((b && b.shortCode) || (def && def.shortCode) || buildShortCode(name)).toUpperCase().slice(0, 5),
      icon: (b && b.icon) || (def && def.icon) || '🏷️',
      logo: (b && b.logo) || (def && def.logo) || '',
      description: (b && b.description !== undefined) ? String(b.description) : ((def && def.description) || ''),
      status: (b && b.status === 'inactive') ? 'inactive' : 'active',
      sort_order: Number(b && b.sort_order) || (idx + 1),
      created_at: (b && b.created_at) || (def && def.created_at) || new Date().toISOString(),
      updated_at: (b && b.updated_at) || null
    };
  }

  function buildBrandIdMap(brands) {
    var map = {};
    (brands || DEFAULT_BRANDS).forEach(function (b) {
      if (b && b.name) map[String(b.name).trim().toLowerCase()] = b.id;
    });
    return map;
  }

  function makeCatalogProducts(brands, prodCategories) {
    var catalog = window.VLU_CATALOG || {};
    var brandIds = buildBrandIdMap(brands);
    return Object.keys(catalog).map(function (id) {
      var product = catalog[id];
      var catSlug = String(product.category || 'dien-thoai').trim();
      var brandName = String(product.brand || 'Apple').trim();
      return {
        id: id,
        slug: id,
        sku: normalizeSku(product.sku, id, brandName),
        category_id: brandIds[brandName.toLowerCase()] || 1,
        category_name: brandName,
        brand: brandName,
        category: catSlug,
        category_slug: catSlug,
        product_category_name: getCategoryDisplayName(catSlug, prodCategories),
        name: product.name,
        price: Number(product.basePrice) || 0,
        price_edited: false,
        old_price: Number(product.oldPrice) || null,
        image: product.image,
        extraImages: Array.isArray(product.extraImages) ? product.extraImages.slice() : [],
        gallery_edited: false,
        description: product.tagline || '',
        status: product.status || 'active',
        stock: typeof product.stock === 'number' ? product.stock : DEFAULT_PRODUCT_STOCK,
        stock_threshold: Number(product.stock_threshold) > 0 ? Number(product.stock_threshold) : 5,
        stock_edited: false,
        colors: Array.isArray(product.colors) ? product.colors : [],
        colors_edited: false,
        variants: Array.isArray(product.variants) ? product.variants : [],
        variants_edited: false,
        specs: Array.isArray(product.specs) ? product.specs : [],
        specs_edited: false,
        seo: product.seo || { title: product.name, description: product.tagline || '', slug: id },
        created_at: null,
        updated_at: null
      };
    });
  }

  function toPersistedProductRecord(p) {
    if (!p) return p;
    var rec = {
      id: p.id,
      slug: p.slug || p.id,
      sku: p.sku || normalizeSku('', p.id, p.brand || p.category_name),
      category_id: Number(p.category_id) || 1,
      category_name: p.category_name || p.brand || 'Apple',
      brand: p.brand || p.category_name || 'Apple',
      category: p.category || p.category_slug || 'dien-thoai',
      category_slug: p.category_slug || p.category || 'dien-thoai',
      product_category_name: p.product_category_name || '',
      name: p.name,
      price: Number(p.price) || 0,
      price_edited: Boolean(p.price_edited),
      old_price: p.old_price ? Number(p.old_price) : null,
      image: p.image,
      description: p.description || '',
      status: p.status || 'active',
      stock: Number(p.stock) || 0,
      stock_threshold: Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : 5,
      stock_edited: Boolean(p.stock_edited),
      is_custom: Boolean(p.is_custom),
      created_at: p.created_at || null,
      updated_at: p.updated_at || null
    };
    if (p.seo_edited || p.is_custom) rec.seo = p.seo || null;
    if (p.seo_edited) rec.seo_edited = true;
    if (p.colors_edited || p.is_custom) {
      rec.colors = Array.isArray(p.colors) ? p.colors : [];
      rec.colors_edited = Boolean(p.colors_edited);
    }
    if (p.variants_edited || p.is_custom) {
      rec.variants = Array.isArray(p.variants) ? p.variants : [];
      rec.variants_edited = Boolean(p.variants_edited);
    }
    if (p.specs_edited || p.is_custom) {
      rec.specs = Array.isArray(p.specs) ? p.specs : [];
      rec.specs_edited = Boolean(p.specs_edited);
    }
    if (p.gallery_edited || p.is_custom) {
      rec.extraImages = Array.isArray(p.extraImages) ? p.extraImages : [];
      rec.gallery_edited = Boolean(p.gallery_edited);
    }
    if (p.variant_stocks && typeof p.variant_stocks === 'object') {
      rec.variant_stocks = p.variant_stocks;
    }
    if (p.campaignId) rec.campaignId = p.campaignId;
    if (p.promoStart) rec.promoStart = p.promoStart;
    if (p.promoEnd) rec.promoEnd = p.promoEnd;
    if (p.pre_promo_price !== undefined && p.pre_promo_price !== null) rec.pre_promo_price = Number(p.pre_promo_price);
    if (p.pre_promo_old_price !== undefined) rec.pre_promo_old_price = p.pre_promo_old_price ? Number(p.pre_promo_old_price) : null;
    return rec;
  }

  var AdminEngine = {
    parseDateSafe: parseDateSafe,
    toLocalDateKey: toLocalDateKey,
    normalizeText: normalizeText,
    slugify: slugify,

    /* ==========================================================================
       0. PHÂN QUYỀN ADMIN (ROLE === 1 HOẶC admin@vluflagship.vn)
       ========================================================================== */
    checkAuth: function () {
      try {
        var raw = localStorage.getItem('vlu_user');
        if (!raw) return { isAuthorized: false, user: null };
        var user = JSON.parse(raw);
        var isAdmin = window.VLU_AUTH && typeof window.VLU_AUTH.isAdminUser === 'function'
          ? window.VLU_AUTH.isAdminUser(user)
          : !!user && !user.isGuest && (
            Number(user.role) === 1 ||
            String(user.role).toLowerCase() === 'admin' ||
            String(user.username || '').toLowerCase() === 'admin' ||
            String(user.email || '').toLowerCase() === 'admin@vluflagship.vn'
          );
        if (isAdmin) {
          if (user.role !== 1) {
            user.role = 1;
            try { localStorage.setItem('vlu_user', JSON.stringify(user)); } catch (err) {}
          }
          return { isAuthorized: true, user: user };
        }
        return { isAuthorized: false, user: user };
      } catch (e) {
        return { isAuthorized: false, user: null };
      }
    },

    quickLoginAdmin: function () {
      var self = this;
      if (window.VLU_AUTH) {
        return Promise.resolve(window.VLU_AUTH.login('admin', 'admin123', true)).then(function (res) {
          if (res && res.success) {
            self.logActivity('admin_login', 'Đăng nhập Admin Portal', 'Xác thực quyền Quản trị viên thành công.', 'dashboard');
          }
          return res;
        });
      }
      var adminUser = {
        id: 1,
        username: 'admin',
        email: 'admin@vluflagship.vn',
        fullname: 'Quản trị viên VLU',
        phone: '02871059999',
        role: 1,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem('vlu_user', JSON.stringify(adminUser));
      self.logActivity('admin_login', 'Đăng nhập Admin Portal', 'Đăng nhập nhanh quyền Quản trị viên.', 'dashboard');
      return Promise.resolve({ success: true, user: adminUser });
    },

    /* ==========================================================================
       A. QUẢN LÝ DANH MỤC THIẾT BỊ (vlu_admin_categories — ĐỘC LẬP HOÀN TOÀN)
       ========================================================================== */
    ensureSeparatedStorage: function () {
      try {
        var rawCats = localStorage.getItem(STORAGE_CATEGORIES);
        var rawLegacyCats = localStorage.getItem(LEGACY_PRODUCT_CATEGORIES_KEY);
        var rawBrands = localStorage.getItem(STORAGE_BRANDS);
        var parsedCats = rawCats ? JSON.parse(rawCats) : null;

        // Di trú dữ liệu cũ nếu vlu_admin_categories từng chứa Thương hiệu (Brands)
        if (!rawBrands) {
          var migratedBrands = looksLikeBrandArray(parsedCats)
            ? parsedCats.map(normalizeBrandRecord)
            : DEFAULT_BRANDS.map(normalizeBrandRecord);
          localStorage.setItem(STORAGE_BRANDS, JSON.stringify(migratedBrands));
          if (looksLikeBrandArray(parsedCats)) {
            parsedCats = null;
            localStorage.removeItem(STORAGE_CATEGORIES);
          }
        }

        if (!parsedCats || !Array.isArray(parsedCats) || parsedCats.length === 0) {
          var sourceCats = null;
          if (rawLegacyCats) {
            try {
              var legacyParsed = JSON.parse(rawLegacyCats);
              if (Array.isArray(legacyParsed) && legacyParsed.length > 0 && !looksLikeBrandArray(legacyParsed)) {
                sourceCats = legacyParsed.map(normalizeCategoryRecord);
              }
            } catch (eLeg) {}
          }
          if (!sourceCats) {
            sourceCats = DEFAULT_PRODUCT_CATEGORIES.map(normalizeCategoryRecord);
          }
          // Đảm bảo danh mục Phụ kiện (phu-kien) có mặt trong lần khởi tạo từ key cũ
          if (!sourceCats.some(function (c) { return c.slug === 'phu-kien'; })) {
            var accDef = DEFAULT_PRODUCT_CATEGORIES.find(function (d) { return d.slug === 'phu-kien'; });
            if (accDef) sourceCats.push(normalizeCategoryRecord(accDef, sourceCats.length));
          }
          localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(sourceCats));
        }
      } catch (e) {}
    },

    getProductCategories: function () {
      this.ensureSeparatedStorage();
      try {
        var raw = localStorage.getItem(STORAGE_CATEGORIES);
        var parsed = raw ? JSON.parse(raw) : null;
        if (!Array.isArray(parsed) || parsed.length === 0 || looksLikeBrandArray(parsed)) {
          var fallback = DEFAULT_PRODUCT_CATEGORIES.map(normalizeCategoryRecord);
          localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(fallback));
          return fallback;
        }
        return parsed.map(normalizeCategoryRecord).sort(function (a, b) {
          return (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || (Number(a.id) || 0) - (Number(b.id) || 0);
        });
      } catch (e) {
        return DEFAULT_PRODUCT_CATEGORIES.map(normalizeCategoryRecord);
      }
    },

    saveProductCategories: function (list) {
      try {
        var normalized = (Array.isArray(list) ? list : []).map(function (c, i) {
          var rec = normalizeCategoryRecord(c, i);
          rec.sort_order = i + 1;
          return rec;
        });
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(normalized));
        this.emitUpdate();
      } catch (e) {
        console.error('[AdminEngine] Lỗi lưu danh mục thiết bị:', e);
      }
    },

    getProductCategoryName: function (slugOrId) {
      var list = this.getProductCategories();
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].slug) === String(slugOrId) || String(list[i].id) === String(slugOrId)) {
          return list[i].name;
        }
      }
      return getCategoryDisplayName(slugOrId, list);
    },

    addProductCategory: function (catData) {
      var list = this.getProductCategories();
      var newId = list.length > 0 ? Math.max.apply(Math, list.map(function (c) { return Number(c.id) || 0; })) + 1 : 1;
      var name = String(catData.name || '').trim();
      var slug = catData.slug ? slugify(catData.slug) : slugify(name);
      if (list.some(function (c) { return c.slug === slug; })) {
        slug = slug + '-' + newId;
      }
      var newCat = normalizeCategoryRecord({
        id: newId,
        name: name,
        slug: slug,
        icon: catData.icon || '📦',
        image: catData.image || '',
        description: catData.description || '',
        parent_id: catData.parent_id ? Number(catData.parent_id) : null,
        status: catData.status === 'inactive' ? 'inactive' : 'active',
        sort_order: list.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, list.length);
      list.push(newCat);
      this.saveProductCategories(list);
      this.logActivity('category_add', 'Thêm danh mục: ' + newCat.name, 'Slug: ' + newCat.slug, 'categories', newCat.id);
      return newCat;
    },

    updateProductCategory: function (id, catData) {
      var list = this.getProductCategories();
      var numId = parseInt(id, 10);
      for (var i = 0; i < list.length; i++) {
        if (Number(list[i].id) === numId || String(list[i].slug) === String(id)) {
          var prevSlug = list[i].slug;
          var nextName = String(catData.name || list[i].name).trim();
          var nextSlug = catData.slug ? slugify(catData.slug) : list[i].slug;
          if (list.some(function (c, idx) { return idx !== i && c.slug === nextSlug; })) {
            nextSlug = nextSlug + '-' + list[i].id;
          }
          list[i].name = nextName;
          list[i].slug = nextSlug;
          if (catData.icon !== undefined) list[i].icon = catData.icon || '📦';
          if (catData.image !== undefined) list[i].image = catData.image || '';
          if (catData.description !== undefined) list[i].description = catData.description;
          if (catData.parent_id !== undefined) {
            var pId = catData.parent_id ? Number(catData.parent_id) : null;
            list[i].parent_id = (pId && pId !== Number(list[i].id)) ? pId : null;
          }
          if (catData.status) list[i].status = catData.status === 'inactive' ? 'inactive' : 'active';
          list[i].updated_at = new Date().toISOString();
          this.saveProductCategories(list);

          try {
            var prods = this.getProducts();
            var dirty = false;
            prods.forEach(function (p) {
              if (String(p.category || p.category_slug) === String(prevSlug)) {
                p.category = nextSlug;
                p.category_slug = nextSlug;
                p.product_category_name = nextName;
                dirty = true;
              }
            });
            if (dirty) this.saveProducts(prods, true);
          } catch (eSyncCat) {}

          this.logActivity('category_edit', 'Cập nhật danh mục: ' + list[i].name, 'Slug: ' + list[i].slug, 'categories', list[i].id);
          return list[i];
        }
      }
      return false;
    },

    moveProductCategory: function (id, direction) {
      var list = this.getProductCategories();
      var idx = list.findIndex(function (c) { return Number(c.id) === Number(id); });
      if (idx === -1) return false;
      var targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return false;
      var temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      this.saveProductCategories(list);
      return true;
    },

    reorderProductCategories: function (orderedIds) {
      var list = this.getProductCategories();
      var byId = {};
      list.forEach(function (c) { byId[String(c.id)] = c; });
      var next = [];
      (orderedIds || []).forEach(function (oid) {
        if (byId[String(oid)]) {
          next.push(byId[String(oid)]);
          delete byId[String(oid)];
        }
      });
      Object.keys(byId).forEach(function (k) { next.push(byId[k]); });
      this.saveProductCategories(next);
      return next;
    },

    toggleProductCategoryStatus: function (id) {
      var list = this.getProductCategories();
      var target = list.find(function (c) { return Number(c.id) === Number(id); });
      if (!target) return false;
      target.status = target.status === 'inactive' ? 'active' : 'inactive';
      target.updated_at = new Date().toISOString();
      this.saveProductCategories(list);
      this.logActivity('category_edit', (target.status === 'active' ? 'Kích hoạt' : 'Tạm ẩn') + ' danh mục: ' + target.name, 'Slug: ' + target.slug, 'categories', target.id);
      return target;
    },

    deleteProductCategory: function (id) {
      var list = this.getProductCategories();
      var numId = parseInt(id, 10);
      var removed = list.find(function (c) { return Number(c.id) === numId || String(c.slug) === String(id); });
      var filtered = list.filter(function (c) { return Number(c.id) !== numId && String(c.slug) !== String(id); });
      filtered.forEach(function (c) {
        if (Number(c.parent_id) === numId) c.parent_id = null;
      });
      this.saveProductCategories(filtered);
      if (removed) {
        this.logActivity('category_delete', 'Xóa danh mục: ' + removed.name, 'Đã xóa khỏi danh mục cửa hàng', 'categories');
      }
      return true;
    },

    /* ==========================================================================
       B. QUẢN LÝ THƯƠNG HIỆU (vlu_admin_brands — ĐỘC LẬP HOÀN TOÀN)
       ========================================================================== */
    getBrands: function () {
      this.ensureSeparatedStorage();
      try {
        var raw = localStorage.getItem(STORAGE_BRANDS);
        var parsed = raw ? JSON.parse(raw) : null;
        if (!Array.isArray(parsed) || parsed.length === 0) {
          var fallback = DEFAULT_BRANDS.map(normalizeBrandRecord);
          localStorage.setItem(STORAGE_BRANDS, JSON.stringify(fallback));
          return fallback;
        }
        return parsed.map(normalizeBrandRecord).sort(function (a, b) {
          return (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || (Number(a.id) || 0) - (Number(b.id) || 0);
        });
      } catch (e) {
        console.error('[AdminEngine] Lỗi đọc danh sách thương hiệu:', e);
        return DEFAULT_BRANDS.map(normalizeBrandRecord);
      }
    },

    saveBrands: function (list) {
      try {
        var normalized = (Array.isArray(list) ? list : []).map(function (b, i) {
          var rec = normalizeBrandRecord(b, i);
          rec.sort_order = i + 1;
          return rec;
        });
        localStorage.setItem(STORAGE_BRANDS, JSON.stringify(normalized));
        this.emitUpdate();
      } catch (e) {
        console.error('[AdminEngine] Lỗi lưu thương hiệu:', e);
      }
    },

    getBrandName: function (brandId) {
      var brands = this.getBrands();
      var bId = parseInt(brandId, 10);
      for (var i = 0; i < brands.length; i++) {
        if (Number(brands[i].id) === bId) return brands[i].name;
      }
      return 'Khác';
    },

    addBrand: function (brandData) {
      var list = this.getBrands();
      var newId = list.length > 0 ? Math.max.apply(Math, list.map(function (b) { return Number(b.id) || 0; })) + 1 : 1;
      var name = String(brandData.name || '').trim();
      var slug = brandData.slug ? slugify(brandData.slug) : slugify(name);
      if (list.some(function (b) { return b.slug === slug; })) slug = slug + '-' + newId;
      var newBrand = normalizeBrandRecord({
        id: newId,
        name: name,
        slug: slug,
        shortCode: brandData.shortCode || buildShortCode(name),
        icon: brandData.icon || '🏷️',
        logo: brandData.logo || '',
        description: brandData.description || '',
        status: brandData.status === 'inactive' ? 'inactive' : 'active',
        sort_order: list.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, list.length);
      list.push(newBrand);
      this.saveBrands(list);
      this.logActivity('brand_add', 'Thêm thương hiệu: ' + newBrand.name, 'ID #' + newBrand.id, 'brands', newBrand.id);
      return newBrand;
    },

    updateBrand: function (id, brandData) {
      var list = this.getBrands();
      var numId = parseInt(id, 10);
      for (var i = 0; i < list.length; i++) {
        if (Number(list[i].id) === numId) {
          var prevName = list[i].name;
          list[i].name = String(brandData.name || list[i].name).trim();
          if (brandData.slug) list[i].slug = slugify(brandData.slug);
          if (brandData.shortCode !== undefined) list[i].shortCode = String(brandData.shortCode || buildShortCode(list[i].name)).toUpperCase().slice(0, 5);
          if (brandData.icon !== undefined) list[i].icon = brandData.icon || '🏷️';
          if (brandData.logo !== undefined) list[i].logo = brandData.logo || '';
          if (brandData.description !== undefined) list[i].description = brandData.description;
          if (brandData.status) list[i].status = brandData.status === 'inactive' ? 'inactive' : 'active';
          list[i].updated_at = new Date().toISOString();
          this.saveBrands(list);
          try {
            var prods = this.getProducts();
            var prodDirty = false;
            prods.forEach(function (p) {
              if (Number(p.category_id) === numId || normalizeText(p.brand) === normalizeText(prevName)) {
                p.category_id = numId;
                p.brand = list[i].name;
                p.category_name = list[i].name;
                prodDirty = true;
              }
            });
            if (prodDirty) this.saveProducts(prods, true);
          } catch (eSyncBrand) {}
          this.logActivity('brand_edit', 'Cập nhật thương hiệu: ' + list[i].name, 'ID #' + list[i].id, 'brands', list[i].id);
          return list[i];
        }
      }
      return false;
    },

    moveBrand: function (id, direction) {
      var list = this.getBrands();
      var idx = list.findIndex(function (b) { return Number(b.id) === Number(id); });
      if (idx === -1) return false;
      var targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return false;
      var temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      this.saveBrands(list);
      return true;
    },

    reorderBrands: function (orderedIds) {
      var list = this.getBrands();
      var byId = {};
      list.forEach(function (b) { byId[String(b.id)] = b; });
      var next = [];
      (orderedIds || []).forEach(function (oid) {
        if (byId[String(oid)]) {
          next.push(byId[String(oid)]);
          delete byId[String(oid)];
        }
      });
      Object.keys(byId).forEach(function (k) { next.push(byId[k]); });
      this.saveBrands(next);
      return next;
    },

    toggleBrandStatus: function (id) {
      var list = this.getBrands();
      var target = list.find(function (b) { return Number(b.id) === Number(id); });
      if (!target) return false;
      target.status = target.status === 'inactive' ? 'active' : 'inactive';
      target.updated_at = new Date().toISOString();
      this.saveBrands(list);
      this.logActivity('brand_edit', (target.status === 'active' ? 'Kích hoạt' : 'Tạm ẩn') + ' thương hiệu: ' + target.name, 'ID #' + target.id, 'brands', target.id);
      return target;
    },

    deleteBrand: function (id) {
      var list = this.getBrands();
      var numId = parseInt(id, 10);
      var removed = list.find(function (b) { return Number(b.id) === numId; });
      var filtered = list.filter(function (b) { return Number(b.id) !== numId; });
      this.saveBrands(filtered);
      if (removed) {
        this.logActivity('brand_delete', 'Xóa thương hiệu: ' + removed.name, 'ID #' + removed.id, 'brands');
      }
      return true;
    },

    // Alias tương thích: trỏ đúng Danh mục sản phẩm (không trộn với Thương hiệu)
    getCategories: function () { return this.getProductCategories(); },
    saveCategories: function (list) { return this.saveProductCategories(list); },
    getCategoryName: function (catId) { return this.getProductCategoryName(catId); },
    addCategory: function (catData) { return this.addProductCategory(catData); },
    updateCategory: function (id, catData) { return this.updateProductCategory(id, catData); },
    deleteCategory: function (id) { return this.deleteProductCategory(id); },

    /* ==========================================================================
       C. QUẢN LÝ SẢN PHẨM (PRODUCTS CRUD & INVENTORY)
       ========================================================================== */
    getDeletedProductIds: function () {
      try {
        var raw = localStorage.getItem(STORAGE_DELETED_PRODUCTS);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.map(String) : [];
      } catch (e) {
        return [];
      }
    },

    getProducts: function () {
      var brands = this.getBrands();
      var prodCategories = this.getProductCategories();
      var brandIds = buildBrandIdMap(brands);
      var deletedIds = this.getDeletedProductIds();

      try {
        var raw = localStorage.getItem(STORAGE_PRODUCTS);
        if (!raw) {
          var initialList = makeCatalogProducts(brands, prodCategories);
          this.saveProducts(initialList, true);
          return initialList;
        }
        var list = JSON.parse(raw);
        if (!Array.isArray(list)) {
          var fallback = makeCatalogProducts(brands, prodCategories);
          return fallback;
        }
        if (!window.VLU_CATALOG) return list;

        var catalog = window.VLU_CATALOG;
        var aliases = window.VLU_PRODUCT_ID_ALIASES || {};
        var byName = {};
        var savedById = {};
        list.forEach(function (product) {
          if (!product) return;
          if (product.id) savedById[String(product.id)] = product;
          if (product.name) byName[String(product.name).trim().toLowerCase()] = product;
        });

        var hydrated = [];
        var persisted = [];
        var self = this;

        // 1. Giữ sản phẩm tùy chỉnh do Admin tạo mới (custom admin products) ở đầu danh sách
        list.forEach(function (item) {
          if (!item || !item.id) return;
          var canonicalId = String(aliases[item.id] || item.id);
          if (deletedIds.indexOf(String(item.id)) !== -1 || deletedIds.indexOf(canonicalId) !== -1) return;
          if (!catalog[canonicalId] && (item.is_custom || String(item.id).indexOf('admin-product-') === 0)) {
            var catSlug = String(item.category || item.category_slug || 'dien-thoai');
            var bName = item.category_name || item.brand || 'Apple';
            var stockVal = item.stock_edited
              ? Math.max(0, parseInt(item.stock, 10) || 0)
              : (Number(item.stock) >= 0 ? Number(item.stock) : DEFAULT_PRODUCT_STOCK);
            var customColors = Array.isArray(item.colors) && item.colors.length
              ? item.colors
              : [{ name: 'Mặc định', hex: '#334155', key: 'default', image: item.image || 'frontend/assets/images/logo.png', img: item.image || 'frontend/assets/images/logo.png' }];
            var customVariants = Array.isArray(item.variants) && item.variants.length
              ? item.variants
              : [{ label: 'Tiêu chuẩn', delta: 0 }];
            var customRec = Object.assign({}, item, {
              id: String(item.id),
              slug: item.slug || String(item.id),
              sku: item.sku || normalizeSku('', item.id, bName),
              category_id: Number(item.category_id) || brandIds[String(bName).toLowerCase()] || 1,
              category_name: bName,
              brand: bName,
              category: catSlug,
              category_slug: catSlug,
              product_category_name: getCategoryDisplayName(catSlug, prodCategories),
              status: item.status || 'active',
              stock: stockVal,
              stock_threshold: Number(item.stock_threshold) > 0 ? Number(item.stock_threshold) : 5,
              colors: customColors,
              variants: customVariants,
              specs: Array.isArray(item.specs) ? item.specs : [],
              extraImages: Array.isArray(item.extraImages) ? item.extraImages : [],
              seo: item.seo || { title: item.name, description: item.description || '', slug: item.slug || String(item.id) },
              is_custom: true
            });
            customRec.has3D = self.hasEffective3D(customRec);
            hydrated.push(customRec);
            persisted.push(toPersistedProductRecord(customRec));
          }
        });

        // 2. Đồng bộ 115 sản phẩm từ VLU_CATALOG
        Object.keys(catalog).forEach(function (id) {
          if (deletedIds.indexOf(id) !== -1) return;
          var product = catalog[id];
          var saved = savedById[id] || list.find(function (item) {
            return item && (String(aliases[item.id] || item.id) === id ||
              String(item.name || '').trim().toLowerCase() === product.name.toLowerCase());
          }) || byName[product.name.toLowerCase()];
          if (!saved) saved = {};

          var brandName = saved.category_name || saved.brand || product.brand || 'Apple';
          var catSlug = String(saved.category || saved.category_slug || product.category || 'dien-thoai');
          var resolvedStock;
          if (saved.stock_edited === true && saved.stock !== undefined && saved.stock !== null) {
            resolvedStock = Math.max(0, parseInt(saved.stock, 10) || 0);
          } else if (typeof saved.stock === 'number' && saved.stock > 0) {
            resolvedStock = saved.stock;
          } else if (typeof product.stock === 'number') {
            resolvedStock = product.stock;
          } else {
            resolvedStock = DEFAULT_PRODUCT_STOCK;
          }

          var resolvedImage = (saved.image_edited && saved.image)
            ? saved.image
            : ((product.image && product.image.indexOf('placeholders/') === -1) ? product.image : (saved.image || product.image));

          var rec = {
            id: id,
            slug: saved.slug || id,
            sku: saved.sku || normalizeSku(product.sku, id, brandName),
            category_id: Number(saved.category_id) || brandIds[String(brandName).toLowerCase()] || 1,
            category_name: brandName,
            brand: brandName,
            category: catSlug,
            category_slug: catSlug,
            product_category_name: getCategoryDisplayName(catSlug, prodCategories),
            name: saved.name || product.name,
            price: (saved.price !== undefined && (Number(saved.price) > 0 || saved.price_edited)) ? Math.max(0, Number(saved.price) || 0) : (Number(product.basePrice) || 0),
            price_edited: Boolean(saved.price_edited),
            old_price: saved.old_price !== undefined ? (saved.old_price ? Number(saved.old_price) : null) : (Number(product.oldPrice) || null),
            image: resolvedImage,
            image_edited: Boolean(saved.image_edited),
            extraImages: (saved.gallery_edited && Array.isArray(saved.extraImages)) ? saved.extraImages.slice() : (Array.isArray(product.extraImages) ? product.extraImages.slice() : []),
            gallery_edited: Boolean(saved.gallery_edited),
            description: saved.description !== undefined ? saved.description : (product.tagline || ''),
            status: saved.status || 'active',
            stock: resolvedStock,
            stock_threshold: Number(saved.stock_threshold) > 0 ? Number(saved.stock_threshold) : 5,
            stock_edited: Boolean(saved.stock_edited),
            colors: (saved.colors_edited && Array.isArray(saved.colors)) ? saved.colors : (Array.isArray(product.colors) ? product.colors : []),
            colors_edited: Boolean(saved.colors_edited),
            variants: (saved.variants_edited && Array.isArray(saved.variants)) ? saved.variants : (Array.isArray(product.variants) ? product.variants : []),
            variants_edited: Boolean(saved.variants_edited),
            specs: (saved.specs_edited && Array.isArray(saved.specs)) ? saved.specs : (Array.isArray(product.specs) ? product.specs : []),
            specs_edited: Boolean(saved.specs_edited),
            seo: saved.seo || { title: saved.name || product.name, description: saved.description || product.tagline || '', slug: saved.slug || id },
            seo_edited: Boolean(saved.seo_edited),
            variant_stocks: (saved.variant_stocks && typeof saved.variant_stocks === 'object') ? saved.variant_stocks : (product.variant_stocks || null),
            campaignId: saved.campaignId || null,
            promoStart: saved.promoStart || null,
            promoEnd: saved.promoEnd || null,
            pre_promo_price: saved.pre_promo_price !== undefined ? saved.pre_promo_price : null,
            pre_promo_old_price: saved.pre_promo_old_price !== undefined ? saved.pre_promo_old_price : null,
            is_custom: Boolean(saved.is_custom || product.is_custom),
            created_at: saved.created_at || null,
            updated_at: saved.updated_at || null
          };
          rec.has3D = self.hasEffective3D(rec);
          hydrated.push(rec);
          persisted.push(toPersistedProductRecord(rec));
        });

        var nextJson = JSON.stringify(persisted);
        if (nextJson !== raw) {
          this.saveProducts(persisted, true);
        }
        return hydrated;
      } catch (e) {
        console.error('[AdminEngine] Không thể đồng bộ danh mục sản phẩm:', e);
        return makeCatalogProducts(brands, prodCategories);
      }
    },

    hasEffective3D: function (product) {
      if (!product) return false;
      var kId = String(product.id || '').trim().toLowerCase();
      var kSku = String(product.sku || '').trim().toLowerCase();
      try {
        var rawMap = localStorage.getItem(STORAGE_MODELS_3D);
        var adminMap = rawMap ? JSON.parse(rawMap) : {};
        var directAdmin = (adminMap && typeof adminMap === 'object') ? ((kId && adminMap[kId]) || (kSku && adminMap[kSku])) : null;
        if (directAdmin) {
          if (directAdmin.has3D === false) return false;
          if (directAdmin.has3D && directAdmin.modelUrl) return true;
        }
      } catch (eAdmin3D) {}
      if (typeof window.VLU_GET_MODEL_3D === 'function') {
        try {
          if (window.VLU_GET_MODEL_3D(product)) return true;
        } catch (e) {}
      }
      var staticMap = window.VLU_MODELS_3D || {};
      var staticEntry = staticMap[product.id];
      return Boolean(staticEntry && staticEntry.verified === true && (staticEntry.sketchfabUid || staticEntry.modelUrl || staticEntry.url));
    },

    saveProducts: function (list, silent) {
      try {
        var compactList = (Array.isArray(list) ? list : []).map(toPersistedProductRecord);
        localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(compactList));
        localStorage.setItem('vlu_products', JSON.stringify(compactList));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            var bc = new BroadcastChannel('vlu_store_sync');
            bc.postMessage({ type: 'products_updated', timestamp: Date.now() });
            bc.close();
          }
        } catch (eBc) {}
        if (typeof window.VLU_SYNC_PRODUCTS === 'function') {
          window.VLU_SYNC_PRODUCTS();
        }
        if (!silent) {
          this.emitUpdate();
        }
      } catch (e) {
        console.error('[AdminEngine] Lỗi lưu products:', e);
      }
    },

    addProduct: function (productData) {
      var list = this.getProducts();
      var rawSlug = productData.id || productData.slug;
      var candidateId = rawSlug ? slugify(rawSlug) : '';
      if (!candidateId || list.some(function (p) { return String(p.id) === candidateId; })) {
        candidateId = candidateId ? (candidateId + '-' + String(Date.now()).slice(-4)) : ('admin-product-' + Date.now());
      }
      var brandId = parseInt(productData.category_id, 10) || 1;
      var brandName = productData.category_name || productData.brand || this.getBrandName(brandId);
      var catSlug = String(productData.category || productData.category_slug || 'dien-thoai');
      var prodCategories = this.getProductCategories();
      var parsedStock = productData.stock !== undefined && productData.stock !== '' ? Math.max(0, parseInt(productData.stock, 10) || 0) : DEFAULT_PRODUCT_STOCK;
      var threshold = Number(productData.stock_threshold) > 0 ? Number(productData.stock_threshold) : 5;
      var cleanImg = productData.image || 'frontend/assets/images/logo.png';
      var cleanSku = normalizeSku(productData.sku, candidateId, brandName);
      var cleanColors = Array.isArray(productData.colors) && productData.colors.length
        ? productData.colors
        : [{ name: 'Mặc định', hex: '#334155', key: 'default', image: cleanImg, img: cleanImg }];
      var cleanVariants = Array.isArray(productData.variants) && productData.variants.length
        ? productData.variants
        : [{ label: 'Tiêu chuẩn', delta: 0 }];

      var newProd = {
        id: candidateId,
        slug: slugify(productData.slug || candidateId),
        sku: cleanSku,
        category_id: brandId,
        category_name: brandName,
        brand: brandName,
        category: catSlug,
        category_slug: catSlug,
        product_category_name: getCategoryDisplayName(catSlug, prodCategories),
        name: String(productData.name || '').trim(),
        price: Math.max(0, parseInt(productData.price, 10) || 0),
        price_edited: true,
        old_price: productData.old_price ? parseInt(productData.old_price, 10) : null,
        image: cleanImg,
        image_edited: Boolean(productData.image),
        extraImages: Array.isArray(productData.extraImages) ? productData.extraImages.slice() : [],
        gallery_edited: Array.isArray(productData.extraImages),
        description: productData.description || '',
        status: productData.status === 'hidden' ? 'hidden' : 'active',
        stock: parsedStock,
        stock_threshold: threshold,
        stock_edited: true,
        colors: cleanColors,
        colors_edited: true,
        variants: cleanVariants,
        variants_edited: true,
        specs: Array.isArray(productData.specs) ? productData.specs : [],
        specs_edited: Array.isArray(productData.specs),
        seo: productData.seo || { title: String(productData.name || '').trim(), description: productData.description || '', slug: slugify(productData.slug || candidateId) },
        seo_edited: Boolean(productData.seo),
        is_custom: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      list.unshift(newProd);
      this.saveProducts(list);
      this.logActivity('product_add', 'Thêm sản phẩm: ' + newProd.name, brandName + ' · ' + newProd.product_category_name + ' · ' + this.formatVND(newProd.price), 'products', newProd.id);

      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ action: 'save_product', product: newProd })
        }).catch(function () {});
      }
      return newProd;
    },

    updateProduct: function (id, productData) {
      var list = this.getProducts();
      var idx = -1;
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(id)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return false;

      var prodCategories = this.getProductCategories();
      var brandId = parseInt(productData.category_id, 10) || list[idx].category_id;
      var brandName = productData.category_name || productData.brand || this.getBrandName(brandId);
      var catSlug = String(productData.category || productData.category_slug || list[idx].category || 'dien-thoai');

      list[idx].name = String(productData.name || list[idx].name).trim();
      if (productData.slug) list[idx].slug = slugify(productData.slug);
      if (productData.sku !== undefined && String(productData.sku).trim() !== '') {
        list[idx].sku = normalizeSku(productData.sku, list[idx].id, brandName);
      }
      list[idx].category_id = brandId;
      list[idx].category_name = brandName;
      list[idx].brand = brandName;
      list[idx].category = catSlug;
      list[idx].category_slug = catSlug;
      list[idx].product_category_name = getCategoryDisplayName(catSlug, prodCategories);

      if (productData.price !== undefined && productData.price !== '') {
        list[idx].price = Math.max(0, parseInt(productData.price, 10) || 0);
        list[idx].price_edited = true;
      }
      if (productData.old_price !== undefined) {
        list[idx].old_price = productData.old_price ? parseInt(productData.old_price, 10) : null;
      }
      if (productData.image !== undefined && String(productData.image).trim() !== '') {
        list[idx].image = String(productData.image).trim();
        list[idx].image_edited = true;
      }
      if (productData.description !== undefined) list[idx].description = productData.description;
      if (productData.status) list[idx].status = productData.status === 'hidden' ? 'hidden' : 'active';
      if (productData.stock !== undefined && productData.stock !== '') {
        list[idx].stock = Math.max(0, parseInt(productData.stock, 10) || 0);
        list[idx].stock_edited = true;
      }
      if (productData.stock_threshold !== undefined && productData.stock_threshold !== '') {
        list[idx].stock_threshold = Math.max(1, parseInt(productData.stock_threshold, 10) || 5);
      }
      if (Array.isArray(productData.colors)) {
        list[idx].colors = productData.colors;
        list[idx].colors_edited = true;
      }
      if (Array.isArray(productData.variants)) {
        list[idx].variants = productData.variants;
        list[idx].variants_edited = true;
      }
      if (Array.isArray(productData.specs)) {
        list[idx].specs = productData.specs;
        list[idx].specs_edited = true;
      }
      if (Array.isArray(productData.extraImages)) {
        list[idx].extraImages = productData.extraImages;
        list[idx].gallery_edited = true;
      }
      if (productData.seo && typeof productData.seo === 'object') {
        list[idx].seo = productData.seo;
        list[idx].seo_edited = true;
      }
      list[idx].updated_at = new Date().toISOString();

      this.saveProducts(list);
      this.logActivity('product_edit', 'Cập nhật sản phẩm: ' + list[idx].name, 'Giá: ' + this.formatVND(list[idx].price) + ' · Kho: ' + list[idx].stock, 'products', list[idx].id);

      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ action: 'save_product', product: list[idx] })
        }).catch(function () {});
      }
      return list[idx];
    },

    toggleProductStatus: function (id) {
      var list = this.getProducts();
      var target = list.find(function (p) { return String(p.id) === String(id); });
      if (!target) return false;
      target.status = target.status === 'hidden' ? 'active' : 'hidden';
      target.updated_at = new Date().toISOString();
      this.saveProducts(list);
      this.logActivity('product_edit', (target.status === 'active' ? 'Hiển thị sản phẩm: ' : 'Ẩn sản phẩm: ') + target.name, 'Mã SKU: ' + (target.sku || target.id), 'products', target.id);
      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ action: 'save_product', product: target })
        }).catch(function () {});
      }
      return target;
    },

    bulkUpdateProducts: function (ids, patch) {
      if (!Array.isArray(ids) || !ids.length || !patch) return 0;
      var idSet = {};
      ids.forEach(function (x) { idSet[String(x)] = true; });
      var list = this.getProducts();
      var prodCategories = this.getProductCategories();
      var count = 0;
      var nowIso = new Date().toISOString();
      list.forEach(function (p) {
        if (!p || !idSet[String(p.id)]) return;
        if (patch.status === 'active' || patch.status === 'hidden') {
          p.status = patch.status;
        }
        if (patch.category) {
          var slug = String(patch.category);
          p.category = slug;
          p.category_slug = slug;
          p.product_category_name = getCategoryDisplayName(slug, prodCategories);
        }
        p.updated_at = nowIso;
        count++;
      });
      if (count > 0) {
        this.saveProducts(list);
        var desc = [];
        if (patch.status) desc.push('Trạng thái: ' + (patch.status === 'active' ? 'Đang bán' : 'Đang ẩn'));
        if (patch.category) desc.push('Danh mục: ' + getCategoryDisplayName(patch.category, prodCategories));
        this.logActivity('product_bulk', 'Cập nhật hàng loạt ' + count + ' sản phẩm', desc.join(' · '), 'products');
      }
      return count;
    },

    bulkDeleteProducts: function (ids) {
      if (!Array.isArray(ids) || !ids.length) return 0;
      var idSet = {};
      ids.forEach(function (x) { idSet[String(x)] = true; });
      var list = this.getProducts();
      var toDelete = list.filter(function (p) { return p && idSet[String(p.id)]; });
      if (!toDelete.length) return 0;
      var filtered = list.filter(function (p) { return !p || !idSet[String(p.id)]; });

      try {
        var deletedIds = this.getDeletedProductIds();
        toDelete.forEach(function (p) {
          var sid = String(p.id);
          if (deletedIds.indexOf(sid) === -1) deletedIds.push(sid);
          if (window.VLU_CATALOG && window.VLU_CATALOG[sid]) {
            if ((p && p.is_custom) || window.VLU_CATALOG[sid].is_custom || sid.indexOf('admin-product-') === 0) delete window.VLU_CATALOG[sid];
            else window.VLU_CATALOG[sid].status = 'deleted';
          }
        });
        localStorage.setItem(STORAGE_DELETED_PRODUCTS, JSON.stringify(deletedIds));
        if (window.VLU_CATALOG) {
          window.VLU_PRODUCTS = Object.keys(window.VLU_CATALOG).map(function (k) { return window.VLU_CATALOG[k]; });
        }
      } catch (e) {}

      var map3D = this.getModels3D();
      var dirty3D = false;
      toDelete.forEach(function (p) {
        var k = String(p.id).toLowerCase();
        if (map3D[k]) { delete map3D[k]; dirty3D = true; }
      });
      if (dirty3D) this.saveModels3D(map3D);

      this.saveProducts(filtered);
      this.logActivity('product_delete', 'Xóa hàng loạt ' + toDelete.length + ' sản phẩm', toDelete.slice(0, 3).map(function (p) { return p.name; }).join(', '), 'products');

      if (typeof fetch === 'function') {
        toDelete.forEach(function (p) {
          fetch('backend/api/orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ action: 'delete_product', id: p.id })
          }).catch(function () {});
        });
      }
      return toDelete.length;
    },

    updateProductStock: function (id, newStock) {
      var res = this.recordInventoryMovement({
        productId: id,
        type: 'adjustment',
        newStock: Math.max(0, parseInt(newStock, 10) || 0),
        reason: 'Điều chỉnh nhanh tại bảng tồn kho'
      });
      return res && res.ok ? res.product : false;
    },

    deleteProduct: function (id) {
      var list = this.getProducts();
      var removed = list.find(function (p) { return String(p.id) === String(id); });
      var filtered = list.filter(function (p) { return String(p.id) !== String(id); });

      try {
        var deletedIds = this.getDeletedProductIds();
        if (deletedIds.indexOf(String(id)) === -1) {
          deletedIds.push(String(id));
          localStorage.setItem(STORAGE_DELETED_PRODUCTS, JSON.stringify(deletedIds));
        }
        if (window.VLU_CATALOG && window.VLU_CATALOG[id]) {
          if ((removed && removed.is_custom) || window.VLU_CATALOG[id].is_custom || String(id).indexOf('admin-product-') === 0) {
            delete window.VLU_CATALOG[id];
          } else {
            window.VLU_CATALOG[id].status = 'deleted';
          }
          window.VLU_PRODUCTS = Object.keys(window.VLU_CATALOG).map(function (k) { return window.VLU_CATALOG[k]; });
        }
      } catch (e) {}

      this.saveProducts(filtered);
      this.removeProduct3DConfig(id);
      if (removed) {
        this.logActivity('product_delete', 'Xóa sản phẩm: ' + removed.name, 'Mã #' + removed.id, 'products');
      }

      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ action: 'delete_product', id: id })
        }).catch(function () {});
      }
      return true;
    },

    resetProducts: function () {
      try {
        localStorage.removeItem(STORAGE_DELETED_PRODUCTS);
        if (window.VLU_CATALOG) {
          Object.keys(window.VLU_CATALOG).forEach(function (k) {
            if (String(k).indexOf('admin-product-') === 0) {
              delete window.VLU_CATALOG[k];
            } else if (window.VLU_CATALOG[k] && window.VLU_CATALOG[k].status === 'deleted') {
              window.VLU_CATALOG[k].status = 'active';
            }
          });
          window.VLU_PRODUCTS = Object.keys(window.VLU_CATALOG).map(function (k) { return window.VLU_CATALOG[k]; });
        }
      } catch (e) {}
      var brands = DEFAULT_BRANDS.map(normalizeBrandRecord);
      var prodCats = DEFAULT_PRODUCT_CATEGORIES.map(normalizeCategoryRecord);
      var list = makeCatalogProducts(brands, prodCats);
      this.saveProducts(list);
      this.logActivity('product_reset', 'Khôi phục Catalog mặc định', 'Đã khôi phục toàn bộ ' + list.length + ' sản phẩm flagship', 'products');
      return list;
    },

    normalizeModel3DPath: function (rawUrl) {
      if (typeof window.VLU_NORMALIZE_3D_MODEL_PATH === 'function') {
        return window.VLU_NORMALIZE_3D_MODEL_PATH(rawUrl);
      }
      var u = String(rawUrl == null ? '' : rawUrl).trim().replace(/^\.\//, '');
      if (!u || /[\r\n\t\u0000-\u001F]/.test(u) || u.indexOf('\\') !== -1) return '';
      if (/^(?:[a-z][a-z0-9+\-.]*:|\/\/|\/)/i.test(u)) return '';
      var pathOnly = u.split(/[?#]/)[0];
      if (pathOnly.split('/').some(function (s) { return s === '..' || s === '.'; })) return '';
      return /^models3d\/.+\.(?:glb|gltf)$/i.test(pathOnly) ? u : '';
    },

    getModels3D: function () {
      if (typeof window.VLU_READ_ADMIN_MODELS_3D === 'function') {
        return window.VLU_READ_ADMIN_MODELS_3D();
      }
      try {
        var raw = localStorage.getItem(STORAGE_MODELS_3D);
        var parsed = raw ? JSON.parse(raw) : {};
        return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
      } catch (e) {
        return {};
      }
    },

    saveModels3D: function (map) {
      try {
        localStorage.setItem(STORAGE_MODELS_3D, JSON.stringify(map || {}));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            var bc = new BroadcastChannel('vlu_store_sync');
            bc.postMessage({ type: 'models_3d_updated', timestamp: Date.now() });
            bc.close();
          }
        } catch (eBc) {}
        this.emitUpdate();
        return true;
      } catch (e) {
        return false;
      }
    },

    getProduct3DConfig: function (productId, sku) {
      if (typeof window.VLU_GET_ADMIN_MODEL_3D === 'function') {
        return window.VLU_GET_ADMIN_MODEL_3D({ id: productId, sku: sku || '' });
      }
      var map = this.getModels3D();
      var kId = String(productId || '').trim().toLowerCase();
      var kSku = String(sku || '').trim().toLowerCase();
      return (kId && map[kId]) || (kSku && map[kSku]) || null;
    },

    saveProduct3DConfig: function (productId, cfg, sku) {
      if (!productId || !cfg) return false;
      var kId = String(productId).trim().toLowerCase();
      if (!kId) return false;
      var rawPath = String(cfg.modelUrl || cfg.url || '').trim();
      var cleanPath = this.normalizeModel3DPath(rawPath);
      if (rawPath && !cleanPath) return false;

      var map = this.getModels3D();
      var nextSku = String(cfg.sku || sku || '').trim();
      var prev = map[kId] || {};
      map[kId] = Object.assign({}, prev, {
        productId: String(productId),
        sku: nextSku,
        has3D: Boolean(cfg.has3D && cleanPath),
        modelUrl: cleanPath,
        supportsExplodedView: Boolean(cfg.supportsExplodedView),
        updatedAt: new Date().toISOString()
      });
      return this.saveModels3D(map);
    },

    removeProduct3DConfig: function (productId) {
      if (!productId) return false;
      var kId = String(productId).trim().toLowerCase();
      var map = this.getModels3D();
      if (!map[kId]) return false;
      delete map[kId];
      return this.saveModels3D(map);
    },

    /* ==========================================================================
       D. QUẢN LÝ ĐƠN HÀNG (ORDERS CRUD, PIPELINE 6 BƯỚC & ĐỒNG BỘ TÀI KHOẢN)
       ========================================================================== */
    ORDER_PIPELINE_STEPS: ORDER_PIPELINE_STEPS,

    normalizeOrderStatus: function (status) {
      var s = String(status || 'pending').trim().toLowerCase();
      if (s === 'confirmed') return 'confirmed';
      if (s === 'preparing' || s === 'processing') return 'preparing';
      if (s === 'handed_over' || s === 'handedover' || s === 'dispatched') return 'handed_over';
      if (s === 'shipping' || s === 'delivering') return 'shipping';
      if (s === 'completed' || s === 'delivered') return 'completed';
      if (s === 'cancelled' || s === 'canceled') return 'cancelled';
      if (s === 'returned' || s === 'return') return 'returned';
      return 'pending';
    },

    getOrderDashboardGroup: function (status) {
      var st = this.normalizeOrderStatus(status);
      if (st === 'confirmed' || st === 'preparing') return 'confirmed';
      if (st === 'handed_over' || st === 'shipping') return 'shipping';
      if (st === 'completed') return 'completed';
      if (st === 'cancelled' || st === 'returned') return 'cancelled';
      return 'pending';
    },

    getOrderStatusLabel: function (status) {
      var s = this.normalizeOrderStatus(status);
      return ORDER_STATUS_LABELS[s] || String(status || 'Chờ xác nhận');
    },

    canTransitionOrderStatus: function (currentStatus, nextStatus) {
      var cur = this.normalizeOrderStatus(currentStatus);
      var next = this.normalizeOrderStatus(nextStatus);
      var allowed = ORDER_STATUS_TRANSITIONS[cur] || [];
      return allowed.indexOf(next) !== -1;
    },

    getAllowedNextOrderStatuses: function (currentStatus) {
      var cur = this.normalizeOrderStatus(currentStatus);
      return (ORDER_STATUS_TRANSITIONS[cur] || []).slice();
    },

    resolveOrderPaymentStatus: function (order) {
      if (!order) return 'pending';
      var raw = String(order.payment_status || '').trim().toLowerCase();
      if (raw === 'paid' || raw === 'completed' || raw === 'success') return 'paid';
      if (raw === 'refunded') return 'refunded';
      if (raw === 'failed' || raw === 'unpaid_failed') return 'failed';
      if (raw === 'pending' || raw === 'unpaid') return 'pending';
      var st = this.normalizeOrderStatus(order.status);
      if (st === 'completed') return 'paid';
      return 'pending';
    },

    getOrderPaymentStatusLabel: function (paymentStatus) {
      var p = String(paymentStatus || 'pending').trim().toLowerCase();
      if (p === 'paid') return 'Đã thanh toán';
      if (p === 'refunded') return 'Đã hoàn tiền';
      if (p === 'failed') return 'Thanh toán thất bại';
      return 'Chờ thanh toán';
    },

    getOrderStatusHistory: function (order) {
      if (!order) return [];
      var existing = Array.isArray(order.status_history) ? order.status_history.slice() : [];
      var out = [];
      var seen = {};
      var self = this;

      if (existing.length) {
        existing.forEach(function (ev) {
          if (!ev || !ev.status) return;
          var norm = self.normalizeOrderStatus(ev.status);
          var key = norm + '|' + String(ev.timestamp || '');
          if (seen[key]) return;
          seen[key] = true;
          out.push({
            status: norm,
            label: ev.label || self.getOrderStatusLabel(norm),
            timestamp: ev.timestamp || order.updated_at || order.created_at || new Date().toISOString(),
            actor: ev.actor || 'Hệ thống VLU',
            note: ev.note || ''
          });
        });
      }

      var hasPending = out.some(function (ev) { return ev.status === 'pending'; });
      if (!hasPending) {
        out.unshift({
          status: 'pending',
          label: self.getOrderStatusLabel('pending'),
          timestamp: order.created_at || new Date().toISOString(),
          actor: order.customer_name || 'Khách hàng',
          note: 'Đơn hàng được khởi tạo'
        });
      }

      var curNorm = this.normalizeOrderStatus(order.status);
      var hasCur = out.some(function (ev) { return ev.status === curNorm; });
      if (!hasCur) {
        out.push({
          status: curNorm,
          label: this.getOrderStatusLabel(curNorm),
          timestamp: order.updated_at || order.created_at || new Date().toISOString(),
          actor: 'Quản trị viên VLU',
          note: curNorm === 'cancelled' && order.cancel_reason ? ('Lý do: ' + order.cancel_reason) : ''
        });
      }

      out.sort(function (a, b) {
        var da = parseDateSafe(a.timestamp);
        var db = parseDateSafe(b.timestamp);
        return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
      });
      return out;
    },

    getOrderIdentityKeys: function (order) {
      var keys = [];
      function pushKey(raw) {
        if (raw === undefined || raw === null) return;
        var clean = String(raw).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
        if (clean && keys.indexOf(clean) === -1) keys.push(clean);
      }
      if (order) {
        pushKey(order.user_id);
        pushKey(order.user_identity);
        if (order.customer_email) pushKey(order.customer_email);

        try {
          var users = this.getUsers();
          var matchedUser = users.find(function (u) {
            return (order.user_id && String(u.id) === String(order.user_id)) ||
              (order.user_identity && (String(u.username || '').toLowerCase() === String(order.user_identity).toLowerCase() || String(u.email || '').toLowerCase() === String(order.user_identity).toLowerCase())) ||
              (order.customer_email && u.email && String(u.email).toLowerCase() === String(order.customer_email).toLowerCase());
          });
          if (matchedUser) {
            pushKey(matchedUser.username);
            pushKey(matchedUser.email);
            pushKey(matchedUser.id);
          }
        } catch (e) {}
      }
      if (!keys.length) keys.push('guest');
      return keys;
    },

    getOrders: function () {
      try {
        var raw = localStorage.getItem(STORAGE_ORDERS);
        var list = [];
        if (raw) {
          list = JSON.parse(raw);
          if (!Array.isArray(list)) list = [];
        }

        function mergeOrderRecord(uo) {
          if (!uo) return;
          var code = String(uo.order_code || uo.id || '').trim();
          if (!code) return;
          var existsIdx = list.findIndex(function (ex) {
            var exCode = String((ex && (ex.order_code || ex.id)) || '').trim();
            return exCode === code || (uo.id && String(ex && ex.id) === String(uo.id));
          });
          if (existsIdx === -1) {
            list.push(uo);
          }
        }

        // Quét đơn hàng thực tế từ vlu_orders_* và vlu_account_*.orders
        try {
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (!k) continue;
            if (k.indexOf('vlu_orders_') === 0) {
              var uList = JSON.parse(localStorage.getItem(k) || '[]');
              if (Array.isArray(uList)) {
                uList.forEach(mergeOrderRecord);
              }
            } else if (k.indexOf('vlu_account_') === 0) {
              var accObj = JSON.parse(localStorage.getItem(k) || '{}');
              if (accObj && Array.isArray(accObj.orders)) {
                accObj.orders.forEach(mergeOrderRecord);
              }
            }
          }
        } catch (scanErr) {}

        // Chuẩn hóa ID đơn hàng và sắp xếp mới nhất lên đầu
        list.forEach(function (o) {
          if (o && o.order_code && String(o.id) !== String(o.order_code)) {
            if (typeof o.id === 'number' && !o.db_id) o.db_id = o.id;
            o.id = String(o.order_code);
          }
        });

        list.sort(function (a, b) {
          var da = parseDateSafe(a && a.created_at);
          var db = parseDateSafe(b && b.created_at);
          return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
        });

        return list;
      } catch (e) {
        return [];
      }
    },

    saveOrders: function (list, silent) {
      try {
        localStorage.setItem(STORAGE_ORDERS, JSON.stringify(list));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            var bc = new BroadcastChannel('vlu_store_sync');
            bc.postMessage({ type: 'orders_updated', timestamp: Date.now() });
            bc.close();
          }
        } catch (eBc) {}
        if (!silent) {
          this.emitUpdate();
        }
      } catch (e) {
        console.error('[AdminEngine] Lỗi lưu orders:', e);
      }
    },

    syncAccountOrder: function (order, remove, notifMeta) {
      if (!order) return;
      var keys = this.getOrderIdentityKeys(order);
      var self = this;
      var nextNorm = this.normalizeOrderStatus(order.status);
      var statusLabel = this.getOrderStatusLabel(nextNorm);

      try {
        keys.forEach(function (idKey) {
          var key = 'vlu_account_' + idKey;
          var userOrdersKey = 'vlu_orders_' + idKey;

          var userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
          if (!Array.isArray(userOrders)) userOrders = [];
          if (remove) {
            userOrders = userOrders.filter(function (entry) {
              return String(entry.id) !== String(order.id);
            });
          } else {
            var uIdx = userOrders.findIndex(function (entry) {
              return String(entry.id) === String(order.id);
            });
            if (uIdx === -1) userOrders.unshift(order);
            else userOrders[uIdx] = order;
          }
          localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));

          var account = JSON.parse(localStorage.getItem(key) || '{}');
          if (!account || typeof account !== 'object' || Array.isArray(account)) account = {};
          if (!Array.isArray(account.orders)) account.orders = [];
          if (remove) {
            account.orders = account.orders.filter(function (entry) {
              return String(entry.id) !== String(order.id);
            });
          } else {
            var index = account.orders.findIndex(function (entry) {
              return String(entry.id) === String(order.id);
            });
            var previousStatus = index === -1 ? '' : self.normalizeOrderStatus(account.orders[index].status);
            var hadExplicitStatusChange = Boolean(notifMeta && notifMeta.forceNotify) || (previousStatus && previousStatus !== nextNorm);
            if (index === -1) account.orders.unshift(order);
            else account.orders[index] = order;

            if (hadExplicitStatusChange) {
              if (!Array.isArray(account.notifications)) account.notifications = [];
              var msg = 'Đơn ' + order.id + ' đã chuyển sang trạng thái "' + statusLabel + '".';
              if (nextNorm === 'cancelled' && order.cancel_reason) {
                msg += ' Lý do: ' + order.cancel_reason;
              }
              account.notifications.unshift({
                id: 'N-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                orderId: String(order.id),
                status: nextNorm,
                type: ['shipping', 'handed_over'].indexOf(nextNorm) !== -1 ? 'shipping' : 'order',
                title: 'Cập nhật trạng thái đơn hàng #' + order.id,
                message: msg,
                read: false,
                createdAt: new Date().toISOString()
              });
              if (account.notifications.length > 80) {
                account.notifications = account.notifications.slice(0, 80);
              }
            }
          }
          localStorage.setItem(key, JSON.stringify(account));
        });
      } catch (error) {
        console.error('[AdminEngine] Không thể đồng bộ đơn hàng vào vùng dữ liệu tài khoản:', error);
      }
    },

    tryUpdateOrderStatus: function (orderId, newStatus, options) {
      var opts = options || {};
      var list = this.getOrders();
      var targetIdx = list.findIndex(function (o) {
        return o && (String(o.id) === String(orderId) || String(o.order_code || '') === String(orderId));
      });
      if (targetIdx === -1) {
        return { ok: false, error: 'ORDER_NOT_FOUND', message: 'Không tìm thấy đơn hàng #' + orderId + '.' };
      }

      var order = list[targetIdx];
      var prevNorm = this.normalizeOrderStatus(order.status);
      var nextNorm = this.normalizeOrderStatus(newStatus);

      if (prevNorm === nextNorm) {
        return { ok: false, error: 'NO_STATUS_CHANGE', message: 'Đơn hàng đang ở trạng thái "' + this.getOrderStatusLabel(nextNorm) + '".' };
      }

      if (!this.canTransitionOrderStatus(prevNorm, nextNorm)) {
        return {
          ok: false,
          error: 'INVALID_STATUS_TRANSITION',
          message: 'Không thể chuyển trạng thái từ "' + this.getOrderStatusLabel(prevNorm) + '" sang "' + this.getOrderStatusLabel(nextNorm) + '". Hệ thống chỉ cho phép cập nhật tuần tự hoặc hủy trước khi giao thành công.'
        };
      }

      var cancelReason = String(opts.cancelReason || opts.reason || '').trim();
      if (nextNorm === 'cancelled' && !cancelReason) {
        return {
          ok: false,
          error: 'CANCEL_REASON_REQUIRED',
          message: 'Bắt buộc nhập lý do khi hủy đơn hàng.'
        };
      }

      var curActor = null;
      try { curActor = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
      var actorName = (curActor && (curActor.fullname || curActor.username)) || 'Quản trị viên VLU';
      var nowIso = new Date().toISOString();

      var history = this.getOrderStatusHistory(order);
      history.push({
        status: nextNorm,
        label: this.getOrderStatusLabel(nextNorm),
        timestamp: nowIso,
        actor: actorName,
        note: nextNorm === 'cancelled' ? ('Lý do hủy: ' + cancelReason) : (String(opts.note || '').trim())
      });

      order.status = nextNorm;
      order.status_history = history;
      order.updated_at = nowIso;
      if (nextNorm === 'cancelled') {
        order.cancel_reason = cancelReason;
      }
      if (nextNorm === 'completed' && this.resolveOrderPaymentStatus(order) === 'pending') {
        order.payment_status = 'paid';
      }

      // Tự động xuất kho khi đơn chuyển vào xử lý (confirmed/preparing/shipping) hoặc hoàn kho khi hủy đơn trước giao
      if (['confirmed', 'preparing', 'handed_over', 'shipping', 'completed'].indexOf(nextNorm) !== -1 && !order.inventory_deducted) {
        this.applyOrderInventoryChange(order, 'outbound');
        order.inventory_deducted = true;
      } else if (nextNorm === 'cancelled' && order.inventory_deducted) {
        this.applyOrderInventoryChange(order, 'inbound');
        order.inventory_deducted = false;
      }

      list[targetIdx] = order;
      this.saveOrders(list);
      this.syncAccountOrder(order, false, { forceNotify: true });
      this.logActivity(
        'order_status',
        'Cập nhật đơn ' + order.id + ' → ' + this.getOrderStatusLabel(nextNorm),
        this.getOrderStatusLabel(prevNorm) + ' → ' + this.getOrderStatusLabel(nextNorm) + (cancelReason ? (' · Lý do: ' + cancelReason) : ''),
        'orders',
        order.id
      );

      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            action: 'update_status',
            order_id: order.id,
            status: nextNorm,
            payment_status: this.resolveOrderPaymentStatus(order),
            cancel_reason: order.cancel_reason || '',
            status_history: order.status_history,
            actor: actorName,
            note: opts.note || ''
          })
        }).catch(function () {});
      }

      return { ok: true, order: order, previousStatus: prevNorm, nextStatus: nextNorm };
    },

    updateOrderStatus: function (orderId, newStatus, options) {
      var res = this.tryUpdateOrderStatus(orderId, newStatus, options);
      this._lastOrderError = res.ok ? '' : (res.message || '');
      return res.ok ? res.order : false;
    },

    updateOrderPaymentStatus: function (orderId, paymentStatus) {
      var nextPay = String(paymentStatus || '').trim().toLowerCase();
      if (['pending', 'paid', 'refunded', 'failed'].indexOf(nextPay) === -1) {
        return { ok: false, message: 'Trạng thái thanh toán không hợp lệ.' };
      }
      var list = this.getOrders();
      var idx = list.findIndex(function (o) {
        return o && (String(o.id) === String(orderId) || String(o.order_code || '') === String(orderId));
      });
      if (idx === -1) return { ok: false, message: 'Không tìm thấy đơn hàng.' };
      var order = list[idx];
      var prevPay = this.resolveOrderPaymentStatus(order);
      order.payment_status = nextPay;
      order.updated_at = new Date().toISOString();
      list[idx] = order;
      this.saveOrders(list);
      this.syncAccountOrder(order, false, { forceNotify: false });
      this.logActivity(
        'order_payment',
        'Cập nhật thanh toán ' + order.id,
        this.getOrderPaymentStatusLabel(prevPay) + ' → ' + this.getOrderPaymentStatusLabel(nextPay),
        'orders',
        order.id
      );
      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            action: 'update_order_meta',
            order_id: order.id,
            payment_status: nextPay
          })
        }).catch(function () {});
      }
      return { ok: true, order: order };
    },

    addOrderInternalNote: function (orderId, noteText) {
      var text = String(noteText || '').trim();
      if (!text) return { ok: false, message: 'Vui lòng nhập nội dung ghi chú nội bộ.' };
      if (text.length > 500) text = text.slice(0, 500);

      var list = this.getOrders();
      var idx = list.findIndex(function (o) {
        return o && (String(o.id) === String(orderId) || String(o.order_code || '') === String(orderId));
      });
      if (idx === -1) return { ok: false, message: 'Không tìm thấy đơn hàng.' };

      var curActor = null;
      try { curActor = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
      var actorName = (curActor && (curActor.fullname || curActor.username)) || 'Quản trị viên VLU';

      var order = list[idx];
      var notes = Array.isArray(order.internal_notes) ? order.internal_notes.slice() : [];
      notes.unshift({
        id: 'NOTE-' + Date.now() + '-' + Math.floor(Math.random() * 100),
        author: actorName,
        text: text,
        created_at: new Date().toISOString()
      });
      order.internal_notes = notes;
      order.updated_at = new Date().toISOString();
      list[idx] = order;

      this.saveOrders(list);
      this.syncAccountOrder(order, false, { forceNotify: false });
      this.logActivity('order_note', 'Thêm ghi chú nội bộ đơn ' + order.id, text, 'orders', order.id);

      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            action: 'update_order_meta',
            order_id: order.id,
            internal_notes: notes
          })
        }).catch(function () {});
      }
      return { ok: true, order: order, notes: notes };
    },

    calculateOrderKpis: function (ordersInput) {
      var orders = Array.isArray(ordersInput) ? ordersInput : this.getOrders();
      var kpi = {
        totalOrders: orders.length,
        pendingOrders: 0,
        preparingOrders: 0,
        shippingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        validRevenue: 0
      };
      var self = this;
      orders.forEach(function (o) {
        if (!o) return;
        var st = self.normalizeOrderStatus(o.status);
        var grp = self.getOrderDashboardGroup(st);
        var amt = Number(o.total) || 0;
        if (grp === 'pending') kpi.pendingOrders++;
        else if (grp === 'confirmed') kpi.preparingOrders++;
        else if (grp === 'shipping') kpi.shippingOrders++;
        else if (grp === 'completed') kpi.completedOrders++;
        else if (grp === 'cancelled') kpi.cancelledOrders++;

        if (st !== 'cancelled' && st !== 'returned') {
          kpi.validRevenue += amt;
        }
      });
      return kpi;
    },

    canDeleteOrder: function (order) {
      if (!order) return false;
      var hasTotal = (Number(order.total) || 0) > 0;
      var hasItems = Array.isArray(order.items) && order.items.length > 0;
      return !(hasTotal || hasItems);
    },

    deleteOrder: function (orderId) {
      var list = this.getOrders();
      var removed = list.find(function (order) {
        return order && (String(order.id) === String(orderId) || String(order.order_code || '') === String(orderId));
      });
      if (!removed) return false;
      if (!this.canDeleteOrder(removed)) {
        this._lastOrderError = 'Không thể xóa cứng đơn hàng đã phát sinh giao dịch tài chính. Vui lòng sử dụng chức năng Hủy đơn.';
        this.logActivity('order_delete_blocked', 'Chặn xóa cứng đơn ' + orderId, 'Bảo toàn chứng từ giao dịch tài chính', 'orders', orderId);
        return false;
      }

      var filtered = list.filter(function (o) { return String(o.id) !== String(orderId) && String(o.order_code || '') !== String(orderId); });
      this.saveOrders(filtered);
      this.syncAccountOrder(removed, true);
      this.logActivity('order_delete', 'Xóa đơn hàng nháp ' + orderId, 'Khách hàng: ' + (removed.customer_name || '--'), 'orders');

      // Xóa khỏi toàn bộ vlu_orders_* và vlu_account_*.orders đối với đơn nháp 0đ
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (!k) continue;
          if (k.indexOf('vlu_orders_') === 0) {
            var uOrders = JSON.parse(localStorage.getItem(k) || '[]');
            if (Array.isArray(uOrders)) {
              var nextU = uOrders.filter(function (o) { return o && String(o.id) !== String(orderId) && String(o.order_code || '') !== String(orderId); });
              if (nextU.length !== uOrders.length) localStorage.setItem(k, JSON.stringify(nextU));
            }
          } else if (k.indexOf('vlu_account_') === 0) {
            var acc = JSON.parse(localStorage.getItem(k) || '{}');
            if (acc && Array.isArray(acc.orders)) {
              var nextA = acc.orders.filter(function (o) { return o && String(o.id) !== String(orderId) && String(o.order_code || '') !== String(orderId); });
              if (nextA.length !== acc.orders.length) {
                acc.orders = nextA;
                localStorage.setItem(k, JSON.stringify(acc));
              }
            }
          }
        }
      } catch (cleanErr) {}

      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ action: 'delete', order_id: orderId })
        }).catch(function () {});
      }
      return true;
    },

    /* ==========================================================================
       E. QUẢN LÝ TÀI KHOẢN, KHÁCH HÀNG 360° & PHÂN QUYỀN (USERS & AUDIT LOG)
       ========================================================================== */
    isProtectedRootUser: function (user) {
      return isProtectedRootAdmin(user);
    },

    getUsers: function () {
      try {
        var raw = localStorage.getItem(STORAGE_USERS);
        var list = [];
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach(function (u, i) {
              var clean = sanitizeUserRecord(u, i);
              if (clean) list.push(clean);
            });
          }
        }

        function upsertUserRecord(rawUser) {
          var clean = sanitizeUserRecord(rawUser);
          if (!clean || (!clean.username && !clean.email)) return;
          var idx = list.findIndex(function (u) {
            return (clean.username && String(u.username || '').toLowerCase() === String(clean.username).toLowerCase()) ||
              (clean.email && String(u.email || '').toLowerCase() === String(clean.email).toLowerCase());
          });
          if (idx === -1) {
            list.unshift(clean);
          } else {
            var existing = list[idx];
            if (!isProtectedRootAdmin(existing) && (clean.is_locked || clean.status === 'locked') && existing.status !== 'locked') {
              existing.status = 'locked';
              existing.is_locked = true;
              existing.lock_reason = clean.lock_reason || existing.lock_reason || 'Tạm khóa bởi quản trị viên';
              existing.locked_at = clean.locked_at || existing.locked_at || null;
            }
            if (!existing.phone && clean.phone) existing.phone = clean.phone;
            if (!existing.email && clean.email) existing.email = clean.email;
            if ((!existing.fullname || existing.fullname === existing.username) && clean.fullname) existing.fullname = clean.fullname;
          }
        }

        // Gộp thêm tài khoản đã đăng ký từ AuthEngine ('vlu_registered_users') — luôn sanitize
        try {
          var regRaw = localStorage.getItem('vlu_registered_users');
          var regList = regRaw ? JSON.parse(regRaw) : [];
          if (Array.isArray(regList)) {
            regList.forEach(upsertUserRecord);
          }
        } catch (regErr) {}

        // Gộp tài khoản đang đăng nhập (không phải Guest)
        try {
          var userRaw = localStorage.getItem('vlu_user');
          if (userRaw) {
            var currentUser = JSON.parse(userRaw);
            if (currentUser && !currentUser.isGuest && currentUser.username) {
              upsertUserRecord(currentUser);
            }
          }
        } catch (curErr) {}

        return list;
      } catch (e) {
        return [];
      }
    },

    isCustomerOrderMatch: function (order, user) {
      if (!order || !user) return false;
      var uEmail = String(user.email || '').trim().toLowerCase();
      var uName = String(user.username || '').trim().toLowerCase();
      var uId = String(user.id || '').trim().toLowerCase();
      var oUserId = String(order.user_id || '').trim().toLowerCase();
      var oIdent = String(order.user_identity || '').trim().toLowerCase();
      var oEmail = String(order.customer_email || '').trim().toLowerCase();
      var uPhone = String(user.phone || '').replace(/\D+/g, '');
      var oPhone = String(order.customer_phone || '').replace(/\D+/g, '');

      return Boolean(
        (uId && oUserId && oUserId === uId) ||
        (uName && (oIdent === uName || oUserId === uName)) ||
        (uEmail && (oEmail === uEmail || oIdent === uEmail)) ||
        (uPhone && oPhone && oPhone === uPhone)
      );
    },

    getUserInsightsList: function () {
      var users = this.getUsers();
      var orders = this.getOrders();
      var self = this;

      return users.map(function (u) {
        var allUserOrders = orders.filter(function (o) {
          return self.isCustomerOrderMatch(o, u);
        });
        var validOrders = allUserOrders.filter(function (o) {
          var st = self.normalizeOrderStatus(o.status);
          return st !== 'cancelled' && st !== 'returned';
        });
        var totalSpent = validOrders.reduce(function (sum, o) { return sum + (Number(o.total) || 0); }, 0);
        var basePoints = Math.floor(totalSpent / 100000);
        var bonusDelta = 0;
        var seenLedgerIds = {};
        try {
          [u.id, u.username, u.email].forEach(function (val) {
            if (val === undefined || val === null) return;
            var k = 'vlu_account_' + String(val).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
            var rawAcc = localStorage.getItem(k);
            if (!rawAcc) return;
            var accObj = JSON.parse(rawAcc);
            if (accObj && Array.isArray(accObj.pointLedger)) {
              accObj.pointLedger.forEach(function (pl) {
                if (!pl || !pl.id || seenLedgerIds[pl.id]) return;
                seenLedgerIds[pl.id] = true;
                var src = String(pl.source || '');
                if (src.indexOf('order:') === 0) return; // Tránh tính trùng đơn hàng đã quy đổi
                bonusDelta += Number(pl.points) || 0;
              });
            }
          });
        } catch (ePts) {}
        var points = Math.max(0, basePoints + bonusDelta);
        var tierKey = totalSpent >= 50000000 ? 'diamond' : (totalSpent >= 20000000 ? 'gold' : (totalSpent > 0 ? 'silver' : 'member'));
        var tierLabel = tierKey === 'diamond' ? 'VLU Diamond' : (tierKey === 'gold' ? 'Gold' : (tierKey === 'silver' ? 'Silver' : 'Member'));

        return Object.assign({}, u, {
          allOrderCount: allUserOrders.length,
          orderCount: validOrders.length,
          totalSpent: totalSpent,
          points: points,
          tier: tierLabel,
          tierKey: tierKey,
          lastOrderAt: allUserOrders[0] ? allUserOrders[0].created_at : null
        });
      });
    },

    getMemberInsights: function () {
      return this.getUserInsightsList()
        .filter(function (u) { return Number(u.role) !== 1; })
        .map(function (u) {
          var compatTier = u.tierKey === 'diamond' ? 'VLU Diamond' : (u.tierKey === 'gold' ? 'VLU Gold' : (u.tierKey === 'silver' ? 'VLU Silver' : 'Thành viên Mới'));
          return Object.assign({}, u, { tier: compatTier });
        })
        .sort(function (a, b) {
          return b.totalSpent - a.totalSpent;
        });
    },

    calculateUserKpis: function (insightsInput) {
      var list = Array.isArray(insightsInput) ? insightsInput : this.getUserInsightsList();
      var curMonthKey = toMonthKey(new Date());
      var kpi = {
        totalAccounts: list.length,
        totalCustomers: 0,
        newThisMonth: 0,
        activeCount: 0,
        lockedCount: 0,
        memberCount: 0,
        tieredMemberCount: 0,
        returningCount: 0
      };
      list.forEach(function (u) {
        if (!u) return;
        if (String(u.status || 'active') === 'locked') kpi.lockedCount++;
        else kpi.activeCount++;

        if (toMonthKey(u.created_at) === curMonthKey) kpi.newThisMonth++;

        if (Number(u.role) !== 1) {
          kpi.totalCustomers++;
          kpi.memberCount++;
          if (u.tierKey !== 'member' || (Number(u.points) || 0) > 0) kpi.tieredMemberCount++;
          if ((Number(u.orderCount) || 0) >= 2) kpi.returningCount++;
        }
      });
      return kpi;
    },

    getAccountAuditLog: function () {
      try {
        var raw = localStorage.getItem(STORAGE_ACCOUNT_AUDIT_LOG);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch (e) {
        return [];
      }
    },

    logAccountAudit: function (actionType, targetUser, detail) {
      try {
        var logs = this.getAccountAuditLog();
        var actor = null;
        try { actor = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
        logs.unshift({
          id: 'AUD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          action: actionType,
          targetId: targetUser ? String(targetUser.id || targetUser.username) : '',
          targetUsername: targetUser ? String(targetUser.username || '') : '',
          targetEmail: targetUser ? String(targetUser.email || '') : '',
          detail: detail || '',
          actor: (actor && (actor.fullname || actor.username)) || 'Quản trị viên VLU',
          created_at: new Date().toISOString()
        });
        if (logs.length > 150) logs = logs.slice(0, 150);
        localStorage.setItem(STORAGE_ACCOUNT_AUDIT_LOG, JSON.stringify(logs));
      } catch (e) {}
    },

    getCustomer360Profile: function (userIdentifier) {
      var insights = this.getUserInsightsList();
      var needle = String(userIdentifier || '').trim().toLowerCase();
      var user = insights.find(function (u) {
        return String(u.id || '').toLowerCase() === needle ||
          String(u.username || '').toLowerCase() === needle ||
          String(u.email || '').toLowerCase() === needle;
      });
      if (!user) return null;

      var orders = this.getOrders().filter(function (o) {
        return AdminEngine.isCustomerOrderMatch(o, user);
      });

      var purchasedItems = [];
      var self = this;
      orders.forEach(function (o) {
        var st = self.normalizeOrderStatus(o.status);
        if (st === 'cancelled' || st === 'returned') return;
        (o.items || []).forEach(function (it) {
          if (!it) return;
          var matched = self.resolveItemProduct(it);
          purchasedItems.push({
            orderId: o.id,
            orderDate: o.created_at,
            name: it.name || (matched && matched.name) || 'Sản phẩm',
            sku: it.sku || (matched && matched.sku) || '--',
            color: it.color || '',
            storage: it.storage || it.variant || '',
            quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
            price: Number(it.price) || 0,
            image: (matched && matched.image) || it.image || 'frontend/assets/images/logo.png'
          });
        });
      });

      // Kết nối vlu_account_${identity} theo đúng cơ chế của account-page.js
      var candidateKeys = {};
      [user.id, user.username, user.email].forEach(function (val) {
        if (val === undefined || val === null) return;
        var norm = String(val).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
        if (norm) candidateKeys['vlu_account_' + norm] = true;
      });

      var addresses = [];
      var addrSeen = {};
      var reviews = [];
      var notifications = [];
      var accountPointLedger = [];

      Object.keys(candidateKeys).forEach(function (accKey) {
        try {
          var rawAcc = localStorage.getItem(accKey);
          if (!rawAcc) return;
          var accObj = JSON.parse(rawAcc);
          if (!accObj || typeof accObj !== 'object') return;
          if (Array.isArray(accObj.addresses)) {
            accObj.addresses.forEach(function (addr) {
              if (!addr) return;
              var fullText = [addr.street || addr.detail || addr.address, addr.ward, addr.district, addr.city || addr.province].filter(Boolean).join(', ') || String(addr.fullAddress || '');
              var dedup = normalizeText(fullText);
              if (dedup && !addrSeen[dedup]) {
                addrSeen[dedup] = true;
                addresses.push({
                  id: addr.id || ('ADDR-' + addresses.length),
                  label: addr.label || (addr.isDefault ? 'Mặc định' : 'Địa chỉ lưu'),
                  recipient: addr.fullname || addr.name || user.fullname,
                  phone: addr.phone || user.phone || '',
                  fullAddress: fullText,
                  isDefault: Boolean(addr.isDefault),
                  isFromOrder: false
                });
              }
            });
          }
          if (Array.isArray(accObj.reviews)) {
            accObj.reviews.forEach(function (rv) {
              if (rv) reviews.push(rv);
            });
          }
          if (Array.isArray(accObj.notifications)) {
            accObj.notifications.forEach(function (nt) {
              if (nt) notifications.push(nt);
            });
          }
          if (Array.isArray(accObj.pointLedger)) {
            accObj.pointLedger.forEach(function (pl) {
              if (pl) accountPointLedger.push(pl);
            });
          }
        } catch (accErr) {}
      });

      orders.forEach(function (o) {
        var addrText = String(o.customer_address || o.shipping_address || '').trim();
        if (!addrText || addrText.toLowerCase().indexOf('nhận tại cửa hàng') !== -1) return;
        var normAddr = normalizeText(addrText);
        if (!addrSeen[normAddr]) {
          addrSeen[normAddr] = true;
          addresses.push({
            id: 'ORD-ADDR-' + o.id,
            label: 'Từ đơn #' + o.id,
            recipient: o.customer_name || user.fullname,
            phone: o.customer_phone || user.phone || '',
            fullAddress: addrText,
            isDefault: addresses.length === 0,
            isFromOrder: true
          });
        }
      });

      var auditLogs = this.getAccountAuditLog().filter(function (lg) {
        return (lg.targetId && String(lg.targetId) === String(user.id)) ||
          (lg.targetUsername && String(lg.targetUsername).toLowerCase() === String(user.username).toLowerCase()) ||
          (lg.targetEmail && user.email && String(lg.targetEmail).toLowerCase() === String(user.email).toLowerCase());
      });

      return {
        user: sanitizeUserRecord(Object.assign({}, user)),
        stats: {
          orderCount: user.orderCount,
          allOrderCount: user.allOrderCount,
          totalSpent: user.totalSpent,
          points: user.points,
          tier: user.tier,
          tierKey: user.tierKey,
          lastOrderAt: user.lastOrderAt
        },
        addresses: addresses,
        orders: orders,
        purchasedItems: purchasedItems,
        reviews: reviews,
        notifications: notifications.slice(0, 20),
        pointLedger: accountPointLedger.slice(0, 20),
        auditLogs: auditLogs
      };
    },

    updateUserAccount: function (userIdentifier, patch) {
      var data = patch || {};
      var curActor = null;
      try { curActor = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
      var actorIsAdmin = curActor && (
        Number(curActor.role) === 1 ||
        String(curActor.role || '').toLowerCase() === 'admin' ||
        isProtectedRootAdmin(curActor)
      );
      if (!actorIsAdmin) {
        return { ok: false, error: 'FORBIDDEN', message: 'Chỉ Quản trị viên mới có quyền chỉnh sửa tài khoản.' };
      }

      var users = this.getUsers();
      var needle = String(userIdentifier || '').trim().toLowerCase();
      var idx = users.findIndex(function (u) {
        return String(u.id || '').toLowerCase() === needle ||
          String(u.username || '').toLowerCase() === needle ||
          String(u.email || '').toLowerCase() === needle;
      });
      if (idx === -1) {
        return { ok: false, error: 'USER_NOT_FOUND', message: 'Không tìm thấy tài khoản người dùng.' };
      }

      var target = Object.assign({}, users[idx]);
      var isRoot = isProtectedRootAdmin(target);
      var isSelf = curActor && (
        (curActor.id !== undefined && String(curActor.id) === String(target.id)) ||
        (curActor.username && String(curActor.username).toLowerCase() === String(target.username).toLowerCase())
      );

      var nextFullname = data.fullname !== undefined ? String(data.fullname).trim() : target.fullname;
      var nextEmail = data.email !== undefined ? String(data.email).trim() : target.email;
      var nextPhone = data.phone !== undefined ? String(data.phone).trim() : target.phone;
      var nextRole = data.role !== undefined ? (Number(data.role) === 1 || String(data.role).toLowerCase() === 'admin' ? 1 : 0) : Number(target.role);
      var nextStatus = data.status !== undefined ? (String(data.status).toLowerCase() === 'locked' ? 'locked' : 'active') : (target.status || 'active');
      var nextLockReason = nextStatus === 'locked'
        ? String(data.lock_reason !== undefined ? data.lock_reason : (target.lock_reason || '')).trim()
        : '';

      if (!nextFullname) return { ok: false, message: 'Họ tên không được để trống.' };
      if (nextEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
        return { ok: false, message: 'Địa chỉ email không đúng định dạng.' };
      }
      if (isRoot && nextStatus === 'locked') {
        return { ok: false, error: 'CANNOT_LOCK_ROOT_ADMIN', message: 'Không thể khóa tài khoản Quản trị viên gốc.' };
      }
      if (isSelf && nextStatus === 'locked') {
        return { ok: false, error: 'CANNOT_LOCK_SELF', message: 'Bạn không thể tự khóa tài khoản đang đăng nhập.' };
      }
      if (isRoot && nextRole !== 1) {
        return { ok: false, error: 'CANNOT_DEMOTE_ROOT_ADMIN', message: 'Không thể hạ quyền tài khoản Quản trị viên gốc.' };
      }
      if (isSelf && nextRole !== 1) {
        return { ok: false, error: 'CANNOT_DEMOTE_SELF', message: 'Bạn không thể tự thu hồi quyền Quản trị của chính mình.' };
      }
      if (nextStatus === 'locked' && !nextLockReason) {
        return { ok: false, error: 'LOCK_REASON_REQUIRED', message: 'Vui lòng nhập lý do khóa tài khoản.' };
      }

      var prevStatus = target.status || 'active';
      var prevRole = Number(target.role);
      var nowIso = new Date().toISOString();

      target.fullname = nextFullname;
      target.email = nextEmail;
      target.phone = nextPhone;
      target.role = nextRole;
      target.status = nextStatus;
      target.is_locked = nextStatus === 'locked';
      target.lock_reason = nextLockReason;
      target.locked_at = nextStatus === 'locked' ? (target.locked_at || nowIso) : null;
      target.updated_at = nowIso;

      var sanitizedTarget = sanitizeUserRecord(target);
      users[idx] = sanitizedTarget;

      // Lưu vào vlu_admin_users (tuyệt đối không lưu password/hash)
      try {
        localStorage.setItem(STORAGE_USERS, JSON.stringify(users.map(function (u, i) { return sanitizeUserRecord(u, i); })));
      } catch (eSave) {}

      // Đồng bộ trạng thái khóa & hồ sơ sang vlu_registered_users
      try {
        var regRaw = localStorage.getItem('vlu_registered_users');
        if (regRaw) {
          var regList = JSON.parse(regRaw);
          if (Array.isArray(regList)) {
            var regChanged = false;
            regList = regList.map(function (ru) {
              if (!ru) return ru;
              var matched = (sanitizedTarget.username && String(ru.username || '').toLowerCase() === String(sanitizedTarget.username).toLowerCase()) ||
                (sanitizedTarget.email && String(ru.email || '').toLowerCase() === String(sanitizedTarget.email).toLowerCase());
              if (!matched) return ru;
              regChanged = true;
              return Object.assign({}, ru, {
                fullname: sanitizedTarget.fullname,
                email: sanitizedTarget.email,
                phone: sanitizedTarget.phone,
                role: sanitizedTarget.role,
                status: sanitizedTarget.status,
                is_locked: sanitizedTarget.is_locked,
                lock_reason: sanitizedTarget.lock_reason,
                locked_at: sanitizedTarget.locked_at,
                updated_at: nowIso
              });
            });
            if (regChanged) {
              localStorage.setItem('vlu_registered_users', JSON.stringify(regList));
            }
          }
        }
      } catch (regSyncErr) {}

      var changes = [];
      if (prevStatus !== sanitizedTarget.status) {
        changes.push(sanitizedTarget.status === 'locked' ? ('Khóa tài khoản (Lý do: ' + sanitizedTarget.lock_reason + ')') : 'Mở khóa tài khoản');
      }
      if (prevRole !== sanitizedTarget.role) {
        changes.push('Đổi vai trò → ' + (sanitizedTarget.role === 1 ? 'Admin' : 'Khách hàng'));
      }
      if (data.fullname !== undefined || data.email !== undefined || data.phone !== undefined) {
        changes.push('Cập nhật thông tin liên hệ');
      }
      var changeSummary = changes.join(' · ') || 'Cập nhật hồ sơ tài khoản';

      this.logAccountAudit(
        prevStatus !== sanitizedTarget.status ? (sanitizedTarget.status === 'locked' ? 'user_lock' : 'user_unlock') : 'user_update',
        sanitizedTarget,
        changeSummary
      );
      this.logActivity(
        'user_manage',
        'Tài khoản ' + sanitizedTarget.fullname + ' (' + sanitizedTarget.username + ')',
        changeSummary,
        'users',
        String(sanitizedTarget.id)
      );

      try {
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'users_updated', userId: sanitizedTarget.id, status: sanitizedTarget.status, timestamp: Date.now() });
          bc.close();
        }
      } catch (eBc) {}

      if (typeof fetch === 'function') {
        fetch('backend/api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            action: 'admin_update_user',
            user_id: sanitizedTarget.id,
            username: sanitizedTarget.username,
            fullname: sanitizedTarget.fullname,
            email: sanitizedTarget.email,
            phone: sanitizedTarget.phone,
            role: sanitizedTarget.role,
            status: sanitizedTarget.status,
            is_locked: sanitizedTarget.is_locked,
            lock_reason: sanitizedTarget.lock_reason
          })
        }).catch(function () {});
      }

      this.emitUpdate();
      return { ok: true, user: sanitizedTarget };
    },

    toggleUserLock: function (userIdentifier, lockReason) {
      var users = this.getUsers();
      var needle = String(userIdentifier || '').trim().toLowerCase();
      var target = users.find(function (u) {
        return String(u.id || '').toLowerCase() === needle ||
          String(u.username || '').toLowerCase() === needle ||
          String(u.email || '').toLowerCase() === needle;
      });
      if (!target) return { ok: false, message: 'Không tìm thấy tài khoản.' };
      var nextStatus = String(target.status || 'active') === 'locked' ? 'active' : 'locked';
      return this.updateUserAccount(userIdentifier, {
        status: nextStatus,
        lock_reason: nextStatus === 'locked' ? lockReason : ''
      });
    },

    /* ==========================================================================
       F. NHẬT KÝ HOẠT ĐỘNG & THÔNG BÁO (ACTIVITY LOG & NOTIFICATIONS)
       ========================================================================== */
    logActivity: function (type, title, detail, targetTab, targetId) {
      try {
        var raw = localStorage.getItem(STORAGE_ACTIVITY_LOG);
        var logs = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(logs)) logs = [];
        var user = null;
        try { user = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
        logs.unshift({
          id: 'ACT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          type: type || 'system',
          title: title || 'Hoạt động hệ thống',
          detail: detail || '',
          actor: (user && (user.fullname || user.username)) || 'Quản trị viên VLU',
          targetTab: targetTab || 'dashboard',
          targetId: targetId || '',
          created_at: new Date().toISOString()
        });
        if (logs.length > 100) logs = logs.slice(0, 100);
        localStorage.setItem(STORAGE_ACTIVITY_LOG, JSON.stringify(logs));
      } catch (e) {}
    },

    getActivityLog: function () {
      try {
        var raw = localStorage.getItem(STORAGE_ACTIVITY_LOG);
        var logs = raw ? JSON.parse(raw) : [];
        return Array.isArray(logs) ? logs : [];
      } catch (e) {
        return [];
      }
    },

    getRecentActivityFeed: function (limit) {
      var events = [];
      var maxItems = limit || 25;

      // 1. Nhật ký thao tác Admin
      this.getActivityLog().forEach(function (entry) {
        events.push(Object.assign({}, entry, { source: 'admin' }));
      });

      // 2. Đơn hàng mới từ khách hàng
      this.getOrders().forEach(function (o) {
        if (!o || !o.created_at) return;
        events.push({
          id: 'ORD-EVT-' + o.id,
          type: 'order_new',
          title: 'Đơn hàng mới ' + o.id,
          detail: (o.customer_name || 'Khách hàng') + ' · ' + AdminEngine.formatVND(o.total) + ' (' + (o.payment_method || 'COD') + ')',
          actor: o.customer_name || 'Khách hàng',
          targetTab: 'orders',
          targetId: o.id,
          created_at: o.created_at,
          source: 'order'
        });
      });

      // 3. Khách hàng mới đăng ký
      this.getUsers().forEach(function (u) {
        if (!u || Number(u.role) === 1 || !u.created_at) return;
        events.push({
          id: 'USR-EVT-' + (u.id || u.username),
          type: 'user_register',
          title: 'Khách hàng mới đăng ký',
          detail: (u.fullname || u.username) + ' (' + (u.email || u.username) + ')',
          actor: u.fullname || u.username,
          targetTab: 'users',
          targetId: String(u.id || u.username),
          created_at: u.created_at,
          source: 'user'
        });
      });

      // 4. Sản phẩm mới thêm hoặc cập nhật gần đây
      this.getProducts().forEach(function (p) {
        var ts = p.updated_at || p.created_at;
        if (!ts) return;
        events.push({
          id: 'PRD-EVT-' + p.id,
          type: p.updated_at ? 'product_edit' : 'product_add',
          title: (p.updated_at ? 'Cập nhật sản phẩm: ' : 'Sản phẩm mới: ') + p.name,
          detail: (p.brand || p.category_name || '') + ' · ' + AdminEngine.formatVND(p.price),
          actor: 'Catalog',
          targetTab: 'products',
          targetId: p.id,
          created_at: ts,
          source: 'product'
        });
      });

      // 5. Biến động kho hàng & kiểm toán phân quyền
      this.getInventoryLogs().slice(0, 20).forEach(function (mv) {
        events.push({
          id: 'INV-EVT-' + mv.id,
          type: 'inventory_' + mv.type,
          title: (mv.type === 'inbound' ? 'Nhập kho ' : (mv.type === 'outbound' ? 'Xuất kho ' : 'Điều chỉnh kho ')) + mv.productName,
          detail: (mv.delta >= 0 ? ('+' + mv.delta) : mv.delta) + ' · Tồn sau: ' + mv.afterStock + (mv.reason ? (' · ' + mv.reason) : ''),
          actor: mv.actor || 'Quản trị kho',
          targetTab: 'inventory',
          targetId: mv.productId,
          created_at: mv.created_at,
          source: 'inventory'
        });
      });

      this.getAccountAuditLog().slice(0, 20).forEach(function (aud) {
        events.push({
          id: 'AUD-EVT-' + aud.id,
          type: aud.action,
          title: 'Kiểm toán tài khoản: ' + (aud.targetUsername || aud.targetId),
          detail: aud.detail,
          actor: aud.actor || 'Quản trị viên',
          targetTab: 'users',
          targetId: aud.targetId,
          created_at: aud.created_at,
          source: 'security'
        });
      });

      events.sort(function (a, b) {
        var da = parseDateSafe(a.created_at);
        var db = parseDateSafe(b.created_at);
        return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
      });

      return events.slice(0, maxItems);
    },

    getReadNotifIds: function () {
      try {
        var raw = localStorage.getItem(STORAGE_NOTIF_READ);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch (e) {
        return [];
      }
    },

    markNotificationRead: function (notifId) {
      try {
        var list = this.getReadNotifIds();
        if (list.indexOf(notifId) === -1) {
          list.push(notifId);
          if (list.length > 200) list = list.slice(-200);
          localStorage.setItem(STORAGE_NOTIF_READ, JSON.stringify(list));
          this.emitUpdate();
        }
      } catch (e) {}
    },

    markAllNotificationsRead: function () {
      try {
        var notifs = this.getAdminNotifications();
        var ids = notifs.map(function (n) { return n.id; });
        localStorage.setItem(STORAGE_NOTIF_READ, JSON.stringify(ids));
        this.emitUpdate();
      } catch (e) {}
    },

    getAdminNotifications: function () {
      var readIds = this.getReadNotifIds();
      var notifications = [];
      var orders = this.getOrders();
      var products = this.getProducts();
      var defaultThreshold = (this.getSystemSettings().defaultLowStockThreshold) || 5;

      orders.forEach(function (o) {
        var st = AdminEngine.normalizeOrderStatus(o.status);
        if (st === 'pending') {
          var nid = 'pending-' + o.id;
          notifications.push({
            id: nid,
            type: 'warning',
            title: 'Đơn chờ xác nhận ' + o.id,
            message: (o.customer_name || 'Khách hàng') + ' vừa đặt đơn trị giá ' + AdminEngine.formatVND(o.total),
            targetTab: 'orders',
            targetFilter: 'pending',
            targetId: o.id,
            created_at: o.created_at || new Date().toISOString(),
            read: readIds.indexOf(nid) !== -1
          });
        }
      });

      products.forEach(function (p) {
        var stock = Number(p.stock);
        var thresh = Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : defaultThreshold;
        if (!isNaN(stock) && stock <= thresh) {
          var nid = 'lowstock-' + p.id + '-' + stock;
          notifications.push({
            id: nid,
            type: stock <= 0 ? 'danger' : 'warning',
            title: stock <= 0 ? 'Hết hàng trong kho' : 'Cảnh báo sắp hết hàng',
            message: p.name + ' hiện còn ' + stock + ' sản phẩm (ngưỡng ≤ ' + thresh + ').',
            targetTab: 'inventory',
            targetFilter: 'low_stock',
            targetId: p.id,
            created_at: p.updated_at || new Date().toISOString(),
            read: readIds.indexOf(nid) !== -1
          });
        }
      });

      this.getAllReturnWarrantyTickets().forEach(function (tk) {
        if (tk.status === 'Đã tiếp nhận') {
          var nid = 'ret-' + tk.uid;
          notifications.push({
            id: nid,
            type: 'warning',
            title: 'Yêu cầu Đổi trả / Bảo hành mới',
            message: (tk.customerName || 'Khách hàng') + ': ' + (tk.subject || tk.typeLabel),
            targetTab: 'returns',
            targetId: tk.id,
            created_at: tk.createdAt || new Date().toISOString(),
            read: readIds.indexOf(nid) !== -1
          });
        }
      });

      this.getAllProductQAs().forEach(function (qa) {
        if (!qa.answer && !qa.hidden) {
          var nid = 'qa-' + qa.uid;
          notifications.push({
            id: nid,
            type: 'info',
            title: 'Câu hỏi Q&A chưa trả lời: ' + (qa.productName || qa.productId),
            message: (qa.authorName || 'Khách hàng') + ': "' + (qa.question || '') + '"',
            targetTab: 'reviews',
            targetId: qa.uid,
            created_at: qa.createdAt || new Date().toISOString(),
            read: readIds.indexOf(nid) !== -1
          });
        }
      });

      this.getActivityLog().slice(0, 8).forEach(function (act) {
        var nid = 'act-' + act.id;
        notifications.push({
          id: nid,
          type: 'info',
          title: act.title,
          message: act.detail || act.actor,
          targetTab: act.targetTab || 'activity-log',
          targetId: act.targetId || '',
          created_at: act.created_at,
          read: readIds.indexOf(nid) !== -1
        });
      });

      notifications.sort(function (a, b) {
        if (a.read !== b.read) return a.read ? 1 : -1;
        var da = parseDateSafe(a.created_at);
        var db = parseDateSafe(b.created_at);
        return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
      });

      return notifications;
    },

    /* ==========================================================================
       H. QUẢN LÝ KHO BIẾN THỂ, VOUCHER, KHUYẾN MÃI, REVIEW/Q&A, ĐỔI TRẢ & CÀI ĐẶT
       ========================================================================== */
    getSystemSettings: function () {
      try {
        var raw = localStorage.getItem(STORAGE_SETTINGS);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return Object.assign({}, DEFAULT_SYSTEM_SETTINGS, parsed);
          }
        }
      } catch (e) {}
      return Object.assign({}, DEFAULT_SYSTEM_SETTINGS);
    },

    saveSystemSettings: function (patch) {
      var cur = this.getSystemSettings();
      var data = patch || {};
      var next = {
        storeName: String(data.storeName !== undefined ? data.storeName : cur.storeName).trim() || 'VLU FLAGSHIP STORE',
        hotline: String(data.hotline !== undefined ? data.hotline : cur.hotline).trim() || '1900 8868',
        supportEmail: String(data.supportEmail !== undefined ? data.supportEmail : cur.supportEmail).trim() || 'cskh@vluflagship.vn',
        address: String(data.address !== undefined ? data.address : cur.address).trim() || DEFAULT_SYSTEM_SETTINGS.address,
        defaultLowStockThreshold: Math.max(1, Math.min(100, parseInt(data.defaultLowStockThreshold !== undefined ? data.defaultLowStockThreshold : cur.defaultLowStockThreshold, 10) || 5)),
        standardShippingFee: Math.max(0, Number(data.standardShippingFee !== undefined ? data.standardShippingFee : cur.standardShippingFee) || 0),
        freeShippingThreshold: Math.max(0, Number(data.freeShippingThreshold !== undefined ? data.freeShippingThreshold : cur.freeShippingThreshold) || 2000000),
        currency: 'VNĐ',
        updated_at: new Date().toISOString()
      };
      try {
        localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(next));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'settings_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {}
      this.logActivity('settings_update', 'Cập nhật Cài đặt cửa hàng', 'Ngưỡng cảnh báo tồn kho: ' + next.defaultLowStockThreshold + ' · Phí ship chuẩn: ' + this.formatVND(next.standardShippingFee), 'settings');
      this.emitUpdate();
      return { ok: true, settings: next };
    },

    exportFullSystemBackup: function () {
      return {
        exportedAt: new Date().toISOString(),
        settings: this.getSystemSettings(),
        categories: this.getProductCategories(),
        brands: this.getBrands(),
        products: this.getProducts(),
        orders: this.getOrders(),
        inventoryLogs: this.getInventoryLogs(),
        vouchers: this.getVouchers(),
        promotions: this.getPromotions(),
        users: this.getUsers(), // Sanitized: không bao giờ chứa password
        activityLogs: this.getActivityLog(),
        accountAuditLogs: this.getAccountAuditLog()
      };
    },

    getInventoryLogs: function () {
      try {
        var raw = localStorage.getItem(STORAGE_INVENTORY_LOGS);
        var arr = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(arr)) return [];
        return arr.sort(function (a, b) {
          return (new Date(b && b.created_at || 0).getTime() || 0) - (new Date(a && a.created_at || 0).getTime() || 0);
        });
      } catch (e) {
        return [];
      }
    },

    saveInventoryLogs: function (list) {
      try {
        var next = Array.isArray(list) ? list.slice(0, 300) : [];
        localStorage.setItem(STORAGE_INVENTORY_LOGS, JSON.stringify(next));
      } catch (e) {}
    },

    calculateInventoryKpis: function () {
      var products = this.getProducts();
      var logs = this.getInventoryLogs();
      var defaultThresh = this.getSystemSettings().defaultLowStockThreshold || 5;
      var totalUnits = 0;
      var lowStockCount = 0;
      var outOfStockCount = 0;
      var inboundProductMap = {};
      var thirtyDaysAgo = Date.now() - 30 * 86400000;

      logs.forEach(function (lg) {
        if (lg && lg.type === 'inbound' && lg.productId) {
          var ts = new Date(lg.created_at || 0).getTime() || 0;
          if (!ts || ts >= thirtyDaysAgo) inboundProductMap[String(lg.productId)] = true;
        }
      });

      products.forEach(function (p) {
        var s = Number(p.stock) || 0;
        var thresh = Number(p.stock_threshold) > 0 ? Number(p.stock_threshold) : defaultThresh;
        totalUnits += s;
        if (s <= 0) outOfStockCount++;
        else if (s <= thresh) lowStockCount++;
        if (p.is_custom && p.created_at) {
          var pTs = new Date(p.created_at).getTime() || 0;
          if (pTs >= thirtyDaysAgo) inboundProductMap[String(p.id)] = true;
        }
      });

      return {
        totalUnits: totalUnits,
        lowStockCount: lowStockCount,
        outOfStockCount: outOfStockCount,
        recentInboundCount: Object.keys(inboundProductMap).length,
        skuCount: products.length
      };
    },

    recordInventoryMovement: function (opts) {
      var data = opts || {};
      var type = String(data.type || 'adjustment').toLowerCase();
      if (['inbound', 'outbound', 'adjustment'].indexOf(type) === -1) {
        return { ok: false, message: 'Loại phiếu kho không hợp lệ.' };
      }
      var list = this.getProducts();
      var idx = list.findIndex(function (p) { return p && String(p.id) === String(data.productId); });
      if (idx === -1) {
        return { ok: false, message: 'Không tìm thấy sản phẩm trong kho.' };
      }

      var target = Object.assign({}, list[idx]);
      var prevStock = Math.max(0, Number(target.stock) || 0);
      var afterStock = prevStock;
      var delta = 0;
      var qtyNum = Math.max(0, parseInt(data.quantity, 10) || 0);

      var colorFilter = String(data.colorKey || '').trim();
      var variantFilter = String(data.variantLabel || '').trim();
      var hasTargetColor = Boolean(colorFilter && colorFilter !== 'all');
      var hasTargetVariant = Boolean(variantFilter && variantFilter !== 'all');

      if (type === 'inbound') {
        if (qtyNum <= 0) return { ok: false, message: 'Số lượng nhập kho phải lớn hơn 0.' };
        delta = qtyNum;
        afterStock = prevStock + delta;
      } else if (type === 'outbound') {
        if (qtyNum <= 0) return { ok: false, message: 'Số lượng xuất kho phải lớn hơn 0.' };
        if (!data.allowPartial && qtyNum > prevStock && !data.orderId) {
          return { ok: false, message: 'Số lượng xuất vượt quá tồn kho hiện tại (' + prevStock + ').' };
        }
        delta = -Math.min(prevStock, qtyNum);
        afterStock = Math.max(0, prevStock + delta);
      } else {
        afterStock = Math.max(0, parseInt(data.newStock !== undefined ? data.newStock : qtyNum, 10) || 0);
        delta = afterStock - prevStock;
      }

      target.stock = afterStock;
      target.stock_edited = true;
      target.updated_at = new Date().toISOString();

      // Đồng bộ tồn kho cấp Màu sắc / Dung lượng (Variant-level Inventory)
      if (hasTargetColor && Array.isArray(target.colors)) {
        target.colors = target.colors.map(function (c) {
          if (!c) return c;
          var matchC = normalizeText(c.key || '') === normalizeText(colorFilter) || normalizeText(c.name || '') === normalizeText(colorFilter);
          if (!matchC) return c;
          var curCStock = c.stock !== undefined && c.stock !== '' ? Number(c.stock) : prevStock;
          var nextCStock = type === 'adjustment' && !hasTargetVariant
            ? afterStock
            : Math.max(0, curCStock + delta);
          return Object.assign({}, c, { stock: nextCStock });
        });
        target.colors_edited = true;
      }

      if (hasTargetVariant && Array.isArray(target.variants)) {
        target.variants = target.variants.map(function (v) {
          if (!v) return v;
          if (normalizeText(v.label || '') !== normalizeText(variantFilter)) return v;
          var curVStock = v.stock !== undefined && v.stock !== '' ? Number(v.stock) : prevStock;
          var nextVStock = type === 'adjustment' && !hasTargetColor
            ? afterStock
            : Math.max(0, curVStock + delta);
          return Object.assign({}, v, { stock: nextVStock });
        });
        target.variants_edited = true;
      }

      if (hasTargetColor || hasTargetVariant) {
        var vsMap = (target.variant_stocks && typeof target.variant_stocks === 'object') ? Object.assign({}, target.variant_stocks) : {};
        var mapKey = (colorFilter || 'all') + '::' + (variantFilter || 'all');
        var curSlot = vsMap[mapKey] !== undefined ? Number(vsMap[mapKey]) : prevStock;
        vsMap[mapKey] = type === 'adjustment' ? afterStock : Math.max(0, curSlot + delta);
        target.variant_stocks = vsMap;
      }

      list[idx] = target;
      this.saveProducts(list, Boolean(data.silent));

      var curActor = null;
      try { curActor = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
      var actorName = (curActor && (curActor.fullname || curActor.username)) || 'Quản trị viên VLU';
      var prefix = type === 'inbound' ? 'PNK' : (type === 'outbound' ? 'PXK' : 'PKK');
      var nowIso = new Date().toISOString();

      var logEntry = {
        id: 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        code: prefix + '-' + String(Date.now()).slice(-6),
        type: type,
        productId: String(target.id),
        sku: target.sku || normalizeSku('', target.id, target.brand),
        productName: target.name,
        brand: target.brand || '',
        category: target.category || '',
        colorKey: hasTargetColor ? colorFilter : 'Tất cả màu',
        variantLabel: hasTargetVariant ? variantFilter : 'Tất cả bản',
        prevStock: prevStock,
        delta: delta,
        afterStock: afterStock,
        actor: actorName,
        reason: String(data.reason || (type === 'inbound' ? 'Nhập kho nhà cung cấp' : (type === 'outbound' ? 'Xuất kho' : 'Kiểm kê điều chỉnh'))).trim(),
        note: String(data.note || '').trim(),
        orderId: data.orderId ? String(data.orderId) : '',
        created_at: nowIso
      };

      var logs = this.getInventoryLogs();
      logs.unshift(logEntry);
      this.saveInventoryLogs(logs);

      if (!data.silent) {
        this.logActivity(
          'stock_' + type,
          (type === 'inbound' ? 'Nhập kho ' : (type === 'outbound' ? 'Xuất kho ' : 'Kiểm kê kho ')) + target.name,
          logEntry.code + ' · ' + (delta >= 0 ? ('+' + delta) : delta) + ' → Tồn: ' + afterStock + ' · ' + logEntry.reason,
          'inventory',
          target.id
        );
      }

      if (typeof fetch === 'function') {
        fetch('backend/api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ action: 'save_product', product: target })
        }).catch(function () {});
      }

      return { ok: true, product: target, log: logEntry };
    },

    applyOrderInventoryChange: function (order, direction) {
      if (!order || !Array.isArray(order.items) || !order.items.length) return;
      var products = this.getProducts();
      var self = this;
      order.items.forEach(function (it) {
        if (!it) return;
        var matched = self.resolveItemProduct(it, products);
        if (!matched) return;
        var qty = Math.max(1, parseInt(it.quantity, 10) || 1);
        self.recordInventoryMovement({
          productId: matched.id,
          type: direction === 'inbound' ? 'inbound' : 'outbound',
          quantity: qty,
          colorKey: it.color || '',
          variantLabel: it.variant || it.storage || '',
          reason: direction === 'inbound' ? ('Hoàn nhập kho do hủy đơn #' + order.id) : ('Xuất bán tự động cho đơn #' + order.id),
          orderId: order.id,
          allowPartial: true,
          silent: true
        });
      });
    },

    /* ---------------- VOUCHERS CRUD ---------------- */
    getVouchers: function () {
      var list = [];
      try {
        var raw = localStorage.getItem(STORAGE_VOUCHERS);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) list = parsed.slice();
        } else {
          list = JSON.parse(JSON.stringify(DEFAULT_VOUCHERS));
          localStorage.setItem(STORAGE_VOUCHERS, JSON.stringify(list));
        }
      } catch (e) {
        list = JSON.parse(JSON.stringify(DEFAULT_VOUCHERS));
      }

      var orders = this.getOrders();
      return list.map(function (v) {
        var codeUp = String(v.code || '').toUpperCase();
        var orderUsed = orders.filter(function (o) {
          return AdminEngine.normalizeOrderStatus(o.status) !== 'cancelled' &&
            String(o.voucher_code || '').trim().toUpperCase() === codeUp;
        }).length;
        return Object.assign({}, v, {
          code: codeUp,
          usedCount: Math.max(Number(v.usedCount) || 0, orderUsed)
        });
      });
    },

    saveVouchers: function (list) {
      try {
        localStorage.setItem(STORAGE_VOUCHERS, JSON.stringify(list));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'vouchers_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {}
      this.emitUpdate();
    },

    saveVoucher: function (data) {
      var list = this.getVouchers().map(function (v) {
        var copy = Object.assign({}, v);
        return copy;
      });
      var rawCode = String((data && data.code) || '').trim().toUpperCase().replace(/[^A-Z0-9_-]+/g, '');
      if (!rawCode) return { ok: false, message: 'Mã Voucher không hợp lệ (chỉ dùng chữ cái, số, - hoặc _).' };

      var editId = data.id ? String(data.id) : '';
      var dup = list.find(function (v) {
        return String(v.code).toUpperCase() === rawCode && String(v.id) !== editId;
      });
      if (dup) return { ok: false, message: 'Mã Voucher "' + rawCode + '" đã tồn tại trong hệ thống.' };

      var type = ['fixed', 'percent', 'freeship'].indexOf(String(data.type || 'fixed')) !== -1 ? String(data.type) : 'fixed';
      var val = type === 'freeship' ? 0 : Math.max(0, Number(data.value) || 0);
      if (type === 'percent' && val > 100) return { ok: false, message: 'Phần trăm giảm giá tối đa 100%.' };
      if (type !== 'freeship' && val <= 0) return { ok: false, message: 'Giá trị giảm phải lớn hơn 0.' };

      var nowIso = new Date().toISOString();
      var idx = editId ? list.findIndex(function (v) { return String(v.id) === editId; }) : -1;
      var nextObj = {
        id: idx !== -1 ? list[idx].id : ('VCH-' + Date.now()),
        code: rawCode,
        label: String(data.label || ('Ưu đãi ' + rawCode)).trim(),
        type: type,
        value: val,
        maxDiscount: type === 'percent' ? Math.max(0, Number(data.maxDiscount) || 0) : 0,
        minOrder: Math.max(0, Number(data.minOrder) || 0),
        brandFilter: String(data.brandFilter || 'all').trim() || 'all',
        categoryFilter: String(data.categoryFilter || 'all').trim() || 'all',
        usageLimit: Math.max(0, parseInt(data.usageLimit, 10) || 0),
        usedCount: idx !== -1 ? (Number(list[idx].usedCount) || 0) : 0,
        expiresAt: String(data.expiresAt || '2026-12-31').slice(0, 10),
        status: String(data.status || 'active') === 'inactive' ? 'inactive' : 'active',
        created_at: idx !== -1 ? (list[idx].created_at || nowIso) : nowIso,
        updated_at: nowIso
      };

      if (idx !== -1) list[idx] = nextObj;
      else list.unshift(nextObj);

      this.saveVouchers(list);
      this.logActivity(idx !== -1 ? 'voucher_edit' : 'voucher_add', (idx !== -1 ? 'Cập nhật Voucher ' : 'Tạo mới Voucher ') + rawCode, nextObj.label, 'vouchers', nextObj.id);
      return { ok: true, voucher: nextObj };
    },

    toggleVoucherStatus: function (idOrCode) {
      var list = this.getVouchers();
      var target = list.find(function (v) { return String(v.id) === String(idOrCode) || String(v.code) === String(idOrCode).toUpperCase(); });
      if (!target) return false;
      target.status = target.status === 'active' ? 'inactive' : 'active';
      target.updated_at = new Date().toISOString();
      this.saveVouchers(list);
      this.logActivity('voucher_edit', (target.status === 'active' ? 'Kích hoạt' : 'Tạm ngưng') + ' Voucher ' + target.code, target.label, 'vouchers', target.id);
      return target;
    },

    deleteVoucher: function (idOrCode) {
      var list = this.getVouchers();
      var removed = list.find(function (v) { return String(v.id) === String(idOrCode) || String(v.code) === String(idOrCode).toUpperCase(); });
      if (!removed) return false;
      var filtered = list.filter(function (v) { return String(v.id) !== String(removed.id); });
      this.saveVouchers(filtered);
      this.logActivity('voucher_delete', 'Xóa Voucher ' + removed.code, removed.label, 'vouchers');
      return true;
    },

    /* ---------------- PROMOTIONS & FLASH SALE ---------------- */
    getPromotions: function () {
      try {
        var raw = localStorage.getItem(STORAGE_PROMOTIONS);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}

      // Khởi tạo từ các sản phẩm giảm giá thực tế đang có trong catalog
      var discounted = this.getProducts().filter(function (p) {
        return Number(p.price) > 0 && Number(p.old_price) > Number(p.price);
      });
      var initial = discounted.length ? [{
        id: 'PROMO-FLAGSHIP-2026',
        name: 'Flash Sale Thiết bị Flagship Chính hãng 2026',
        badge: 'FLASH SALE',
        discountType: 'custom',
        discountValue: 0,
        startAt: '2026-01-01',
        endAt: '2026-12-31',
        status: 'active',
        productIds: discounted.map(function (p) { return String(p.id); }),
        created_at: '2026-01-01T00:00:00.000Z'
      }] : [];
      try { localStorage.setItem(STORAGE_PROMOTIONS, JSON.stringify(initial)); } catch (e2) {}
      return initial;
    },

    savePromotions: function (list) {
      try {
        localStorage.setItem(STORAGE_PROMOTIONS, JSON.stringify(list));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'products_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {}
      this.emitUpdate();
    },

    syncProductsForPromotion: function (campaign, previousProductIds) {
      var products = this.getProducts();
      var selectedSet = {};
      (campaign.productIds || []).forEach(function (id) { selectedSet[String(id)] = true; });
      var prevSet = {};
      (previousProductIds || []).forEach(function (id) { prevSet[String(id)] = true; });

      var isActive = String(campaign.status || 'active') === 'active';
      var dType = String(campaign.discountType || 'percent');
      var dVal = Number(campaign.discountValue) || 0;
      var changed = false;

      products.forEach(function (p) {
        var pid = String(p.id);
        var inNew = Boolean(selectedSet[pid]);
        var wasInPrev = Boolean(prevSet[pid]) || p.campaignId === campaign.id;

        if (isActive && inNew && dVal > 0 && dType !== 'custom') {
          var listPrice = Number(p.old_price) > Number(p.price) ? Number(p.old_price) : Number(p.price);
          if (listPrice > 0) {
            if (p.campaignId !== campaign.id) {
              p.pre_promo_price = Number(p.price);
              p.pre_promo_old_price = p.old_price ? Number(p.old_price) : null;
            }
            var nextSalePrice = dType === 'percent'
              ? Math.max(1000, Math.round(listPrice * (100 - Math.min(90, dVal)) / 100 / 1000) * 1000)
              : Math.max(1000, listPrice - dVal);
            p.old_price = listPrice;
            p.price = nextSalePrice;
            p.price_edited = true;
            p.promoStart = campaign.startAt || null;
            p.promoEnd = campaign.endAt || null;
            p.campaignId = campaign.id;
            p.updated_at = new Date().toISOString();
            changed = true;
          }
        } else if ((!isActive || !inNew) && wasInPrev && p.campaignId === campaign.id && (Number(p.old_price) > 0 || p.pre_promo_price !== null)) {
          p.price = (p.pre_promo_price !== null && p.pre_promo_price !== undefined) ? Number(p.pre_promo_price) : Number(p.old_price);
          p.old_price = p.pre_promo_old_price !== undefined ? p.pre_promo_old_price : null;
          p.pre_promo_price = null;
          p.pre_promo_old_price = null;
          p.price_edited = true;
          p.promoStart = null;
          p.promoEnd = null;
          p.campaignId = null;
          p.updated_at = new Date().toISOString();
          changed = true;
        }
      });

      if (changed) {
        this.saveProducts(products);
      }
    },

    savePromotionCampaign: function (data) {
      var list = this.getPromotions();
      var name = String((data && data.name) || '').trim();
      var productIds = Array.isArray(data && data.productIds) ? data.productIds.map(String).filter(Boolean) : [];
      if (!name) return { ok: false, message: 'Vui lòng nhập tên chiến dịch khuyến mãi.' };
      if (!productIds.length) return { ok: false, message: 'Vui lòng chọn ít nhất 1 sản phẩm áp dụng.' };

      var dType = String(data.discountType || 'percent');
      var dVal = Number(data.discountValue) || 0;
      if (dType !== 'custom' && dVal <= 0) {
        return { ok: false, message: 'Mức giảm giá chiến dịch phải lớn hơn 0.' };
      }

      var editId = data.id ? String(data.id) : '';
      var idx = editId ? list.findIndex(function (c) { return String(c.id) === editId; }) : -1;
      var prevIds = idx !== -1 ? (list[idx].productIds || []) : [];
      var nowIso = new Date().toISOString();

      var camp = {
        id: idx !== -1 ? list[idx].id : ('PROMO-' + Date.now()),
        name: name,
        badge: String(data.badge || 'FLASH SALE').trim() || 'FLASH SALE',
        discountType: dType,
        discountValue: dVal,
        startAt: String(data.startAt || nowIso.slice(0, 10)).slice(0, 10),
        endAt: String(data.endAt || '2026-12-31').slice(0, 10),
        status: String(data.status || 'active') === 'inactive' ? 'inactive' : 'active',
        productIds: productIds,
        created_at: idx !== -1 ? (list[idx].created_at || nowIso) : nowIso,
        updated_at: nowIso
      };

      if (idx !== -1) list[idx] = camp;
      else list.unshift(camp);

      this.savePromotions(list);
      this.syncProductsForPromotion(camp, prevIds);
      this.logActivity('promo_save', (idx !== -1 ? 'Cập nhật chiến dịch ' : 'Tạo chiến dịch ') + camp.name, productIds.length + ' sản phẩm áp dụng', 'promotions', camp.id);
      return { ok: true, campaign: camp };
    },

    togglePromotionStatus: function (id) {
      var list = this.getPromotions();
      var camp = list.find(function (c) { return String(c.id) === String(id); });
      if (!camp) return false;
      camp.status = camp.status === 'active' ? 'inactive' : 'active';
      camp.updated_at = new Date().toISOString();
      this.savePromotions(list);
      this.syncProductsForPromotion(camp, camp.productIds);
      this.logActivity('promo_toggle', (camp.status === 'active' ? 'Kích hoạt' : 'Tạm ngưng') + ' chiến dịch ' + camp.name, '', 'promotions', camp.id);
      return camp;
    },

    deletePromotionCampaign: function (id) {
      var list = this.getPromotions();
      var camp = list.find(function (c) { return String(c.id) === String(id); });
      if (!camp) return false;
      var reverted = Object.assign({}, camp, { status: 'inactive' });
      this.syncProductsForPromotion(reverted, camp.productIds);
      var filtered = list.filter(function (c) { return String(c.id) !== String(id); });
      this.savePromotions(filtered);
      this.logActivity('promo_delete', 'Xóa chiến dịch khuyến mãi ' + camp.name, '', 'promotions');
      return true;
    },

    /* ---------------- REVIEWS & Q&A MODERATION ---------------- */
    getAllProductReviews: function () {
      var out = [];
      var products = this.getProducts();
      var self = this;
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (!k || k.indexOf('vlu_account_') !== 0) continue;
          var acc = JSON.parse(localStorage.getItem(k) || '{}');
          if (!acc || !Array.isArray(acc.reviews)) continue;
          var fallbackName = (acc.profile && acc.profile.fullname) || k.replace('vlu_account_', '');
          acc.reviews.forEach(function (rv, idx) {
            if (!rv) return;
            var rid = String(rv.id || ('rv_' + idx));
            var matched = self.resolveItemProduct({ id: rv.productId || rid.split(':')[1], name: rv.productName || rv.name }, products);
            out.push({
              kind: 'review',
              uid: k + '::' + rid,
              accountKey: k,
              reviewId: rid,
              productId: rv.productId || (matched && matched.id) || '',
              productName: rv.productName || rv.name || (matched && matched.name) || 'Sản phẩm VLU',
              authorName: rv.reviewerName || rv.author || fallbackName,
              rating: Math.min(5, Math.max(1, Number(rv.rating) || 5)),
              comment: String(rv.comment || rv.content || '').trim(),
              image: rv.image || '',
              tags: Array.isArray(rv.tags) ? rv.tags : [],
              hidden: Boolean(rv.hidden || rv.status === 'hidden'),
              adminReply: rv.adminReply || null,
              orderId: rv.orderId || '',
              createdAt: rv.createdAt || ''
            });
          });
        }
      } catch (e) {}
      return out.sort(function (a, b) {
        return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
      });
    },

    getAllProductQAs: function () {
      var out = [];
      var products = this.getProducts();
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (!k || k.indexOf('vlu_product_qa_') !== 0) continue;
          var pid = k.replace('vlu_product_qa_', '');
          var matched = products.find(function (p) { return String(p.id) === String(pid); });
          var list = JSON.parse(localStorage.getItem(k) || '[]');
          if (!Array.isArray(list)) continue;
          list.forEach(function (qa, idx) {
            if (!qa) return;
            var qid = String(qa.id || ('qa_' + idx));
            out.push({
              kind: 'qa',
              uid: k + '::' + qid,
              qaKey: k,
              qaId: qid,
              productId: pid,
              productName: (matched && matched.name) || qa.productName || pid,
              authorName: qa.authorName || 'Khách hàng VLU',
              topic: qa.topic || 'Tư vấn sản phẩm',
              question: String(qa.question || '').trim(),
              answer: qa.answer || null,
              hidden: Boolean(qa.hidden),
              createdAt: qa.createdAt || ''
            });
          });
        }
      } catch (e) {}
      return out.sort(function (a, b) {
        return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
      });
    },

    emitModerationSync: function () {
      try {
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'reviews_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {}
      this.emitUpdate();
    },

    replyToProductReview: function (uid, replyText) {
      var text = String(replyText || '').trim();
      if (!text) return { ok: false, message: 'Vui lòng nhập nội dung phản hồi.' };
      var sep = String(uid || '').indexOf('::');
      if (sep === -1) return { ok: false, message: 'Mã đánh giá không hợp lệ.' };
      var accKey = uid.slice(0, sep);
      var rid = uid.slice(sep + 2);
      try {
        var acc = JSON.parse(localStorage.getItem(accKey) || '{}');
        if (!acc || !Array.isArray(acc.reviews)) return { ok: false, message: 'Không tìm thấy đánh giá.' };
        var idx = acc.reviews.findIndex(function (r, i) { return r && String(r.id || ('rv_' + i)) === rid; });
        if (idx === -1) return { ok: false, message: 'Không tìm thấy đánh giá.' };
        acc.reviews[idx].adminReply = {
          text: text,
          authorName: 'VLU Flagship Store · Quản trị viên',
          repliedAt: new Date().toISOString()
        };
        if (!Array.isArray(acc.notifications)) acc.notifications = [];
        acc.notifications.unshift({
          id: 'N-REV-' + Date.now(),
          type: 'order',
          title: 'VLU đã phản hồi đánh giá của bạn',
          message: 'Sản phẩm ' + (acc.reviews[idx].name || acc.reviews[idx].productName || '') + ': "' + text + '"',
          read: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem(accKey, JSON.stringify(acc));
        this.logActivity('review_reply', 'Phản hồi đánh giá sản phẩm', text, 'reviews', uid);
        this.emitModerationSync();
        return { ok: true, review: acc.reviews[idx] };
      } catch (e) {
        return { ok: false, message: 'Lỗi lưu phản hồi.' };
      }
    },

    toggleReviewVisibility: function (uid) {
      var sep = String(uid || '').indexOf('::');
      if (sep === -1) return false;
      var accKey = uid.slice(0, sep);
      var rid = uid.slice(sep + 2);
      try {
        var acc = JSON.parse(localStorage.getItem(accKey) || '{}');
        if (!acc || !Array.isArray(acc.reviews)) return false;
        var idx = acc.reviews.findIndex(function (r, i) { return r && String(r.id || ('rv_' + i)) === rid; });
        if (idx === -1) return false;
        var nextHidden = !Boolean(acc.reviews[idx].hidden || acc.reviews[idx].status === 'hidden');
        acc.reviews[idx].hidden = nextHidden;
        acc.reviews[idx].status = nextHidden ? 'hidden' : 'visible';
        localStorage.setItem(accKey, JSON.stringify(acc));
        this.logActivity('review_hide', (nextHidden ? 'Ẩn' : 'Hiện') + ' đánh giá sản phẩm', acc.reviews[idx].name || rid, 'reviews', uid);
        this.emitModerationSync();
        return acc.reviews[idx];
      } catch (e) {
        return false;
      }
    },

    deleteProductReview: function (uid) {
      var sep = String(uid || '').indexOf('::');
      if (sep === -1) return false;
      var accKey = uid.slice(0, sep);
      var rid = uid.slice(sep + 2);
      try {
        var acc = JSON.parse(localStorage.getItem(accKey) || '{}');
        if (!acc || !Array.isArray(acc.reviews)) return false;
        var before = acc.reviews.length;
        acc.reviews = acc.reviews.filter(function (r, i) { return !(r && String(r.id || ('rv_' + i)) === rid); });
        if (acc.reviews.length === before) return false;
        localStorage.setItem(accKey, JSON.stringify(acc));
        this.logActivity('review_delete', 'Xóa đánh giá vi phạm', uid, 'reviews');
        this.emitModerationSync();
        return true;
      } catch (e) {
        return false;
      }
    },

    replyToProductQA: function (uid, replyText) {
      var text = String(replyText || '').trim();
      if (!text) return { ok: false, message: 'Vui lòng nhập câu trả lời cho khách hàng.' };
      var sep = String(uid || '').indexOf('::');
      if (sep === -1) return { ok: false, message: 'Mã câu hỏi không hợp lệ.' };
      var qaKey = uid.slice(0, sep);
      var qid = uid.slice(sep + 2);
      try {
        var list = JSON.parse(localStorage.getItem(qaKey) || '[]');
        if (!Array.isArray(list)) return { ok: false, message: 'Không tìm thấy câu hỏi.' };
        var idx = list.findIndex(function (q, i) { return q && String(q.id || ('qa_' + i)) === qid; });
        if (idx === -1) return { ok: false, message: 'Không tìm thấy câu hỏi.' };
        list[idx].answer = {
          text: text,
          authorName: 'VLU Flagship Store · Quản trị viên',
          answeredAt: new Date().toISOString()
        };
        localStorage.setItem(qaKey, JSON.stringify(list));
        this.logActivity('qa_reply', 'Trả lời Q&A sản phẩm', text, 'reviews', uid);
        this.emitModerationSync();
        return { ok: true, qa: list[idx] };
      } catch (e) {
        return { ok: false, message: 'Lỗi lưu câu trả lời Q&A.' };
      }
    },

    toggleQAVisibility: function (uid) {
      var sep = String(uid || '').indexOf('::');
      if (sep === -1) return false;
      var qaKey = uid.slice(0, sep);
      var qid = uid.slice(sep + 2);
      try {
        var list = JSON.parse(localStorage.getItem(qaKey) || '[]');
        if (!Array.isArray(list)) return false;
        var idx = list.findIndex(function (q, i) { return q && String(q.id || ('qa_' + i)) === qid; });
        if (idx === -1) return false;
        list[idx].hidden = !Boolean(list[idx].hidden);
        localStorage.setItem(qaKey, JSON.stringify(list));
        this.logActivity('qa_hide', (list[idx].hidden ? 'Ẩn' : 'Hiện') + ' câu hỏi Q&A', qid, 'reviews', uid);
        this.emitModerationSync();
        return list[idx];
      } catch (e) {
        return false;
      }
    },

    deleteProductQA: function (uid) {
      var sep = String(uid || '').indexOf('::');
      if (sep === -1) return false;
      var qaKey = uid.slice(0, sep);
      var qid = uid.slice(sep + 2);
      try {
        var list = JSON.parse(localStorage.getItem(qaKey) || '[]');
        if (!Array.isArray(list)) return false;
        var before = list.length;
        list = list.filter(function (q, i) { return !(q && String(q.id || ('qa_' + i)) === qid); });
        if (list.length === before) return false;
        localStorage.setItem(qaKey, JSON.stringify(list));
        this.logActivity('qa_delete', 'Xóa câu hỏi Q&A', uid, 'reviews');
        this.emitModerationSync();
        return true;
      } catch (e) {
        return false;
      }
    },

    /* ---------------- RETURNS, WARRANTY & PAYMENTS RECONCILIATION ---------------- */
    getAllReturnWarrantyTickets: function () {
      var list = [];
      var users = this.getUsers();
      var orders = this.getOrders();
      var seen = {};

      function resolveOwnerName(accKey, accObj, fallbackOrderId) {
        if (accObj && accObj.profile && accObj.profile.fullname) return accObj.profile.fullname;
        var ident = accKey.replace('vlu_account_', '');
        var u = users.find(function (usr) {
          return String(usr.username || '').toLowerCase() === ident || String(usr.email || '').toLowerCase() === ident || String(usr.id || '').toLowerCase() === ident;
        });
        if (u) return u.fullname || u.username;
        if (fallbackOrderId) {
          var ord = orders.find(function (o) { return String(o.id) === String(fallbackOrderId); });
          if (ord) return ord.customer_name || ident;
        }
        return ident;
      }

      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (!k || k.indexOf('vlu_account_') !== 0) continue;
          var acc = JSON.parse(localStorage.getItem(k) || '{}');
          if (!acc || !Array.isArray(acc.tickets)) continue;
          acc.tickets.forEach(function (tk) {
            if (!tk || (tk.type !== 'warranty' && tk.type !== 'return' && tk.type !== 'refund')) return;
            var uid = k + '::' + tk.id;
            if (seen[uid]) return;
            seen[uid] = true;
            var linkedOrd = tk.orderId ? orders.find(function (o) { return String(o.id) === String(tk.orderId); }) : null;
            list.push(Object.assign({}, tk, {
              uid: uid,
              sourceKey: k,
              customerName: tk.customerName || resolveOwnerName(k, acc, tk.orderId),
              amount: tk.refundAmount !== undefined ? Number(tk.refundAmount) : (linkedOrd ? Number(linkedOrd.total) : 0)
            }));
          });
        }

        var extraRaw = localStorage.getItem(STORAGE_RETURNS_EXTRA);
        var extraArr = extraRaw ? JSON.parse(extraRaw) : [];
        if (Array.isArray(extraArr)) {
          extraArr.forEach(function (tk) {
            if (!tk || !tk.id) return;
            var uid = STORAGE_RETURNS_EXTRA + '::' + tk.id;
            if (seen[uid]) return;
            seen[uid] = true;
            list.push(Object.assign({}, tk, { uid: uid, sourceKey: STORAGE_RETURNS_EXTRA }));
          });
        }
      } catch (e) {}

      return list.sort(function (a, b) {
        return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
      });
    },

    createReturnWarrantyTicket: function (data) {
      var orderId = String((data && data.orderId) || '').trim();
      var type = ['return', 'warranty', 'refund'].indexOf(String((data && data.type) || 'warranty')) !== -1 ? String(data.type) : 'warranty';
      var message = String((data && data.message) || '').trim();
      if (!message) return { ok: false, message: 'Vui lòng nhập mô tả yêu cầu đổi trả / bảo hành.' };

      var orders = this.getOrders();
      var linkedOrd = orderId ? orders.find(function (o) { return String(o.id) === orderId || String(o.order_code || '') === orderId; }) : null;
      var targetAccKey = STORAGE_RETURNS_EXTRA;
      var customerName = String((data && data.customerName) || (linkedOrd && linkedOrd.customer_name) || 'Khách hàng VLU').trim();

      if (linkedOrd) {
        var keys = this.getOrderIdentityKeys(linkedOrd);
        if (keys.length) targetAccKey = 'vlu_account_' + keys[0];
      } else if (data && data.userIdentity) {
        var normIdent = String(data.userIdentity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
        if (normIdent) targetAccKey = 'vlu_account_' + normIdent;
      }

      var typeLabel = type === 'return' ? 'Đổi trả 1-1' : (type === 'refund' ? 'Hoàn tiền đơn hàng' : 'Bảo hành lỗi kỹ thuật');
      var ticket = {
        id: (type === 'return' ? 'R-' : (type === 'refund' ? 'RF-' : 'W-')) + Date.now(),
        type: type,
        typeLabel: typeLabel,
        subject: String((data && data.subject) || (typeLabel + (linkedOrd ? (' #' + linkedOrd.id) : ''))).trim(),
        orderId: linkedOrd ? String(linkedOrd.id) : orderId,
        customerName: customerName,
        message: message,
        status: 'Đã tiếp nhận',
        refundAmount: Number((data && data.refundAmount) || (linkedOrd ? linkedOrd.total : 0)) || 0,
        adminNote: String((data && data.adminNote) || '').trim(),
        createdAt: new Date().toISOString()
      };

      try {
        if (targetAccKey === STORAGE_RETURNS_EXTRA) {
          var arr = JSON.parse(localStorage.getItem(STORAGE_RETURNS_EXTRA) || '[]');
          if (!Array.isArray(arr)) arr = [];
          arr.unshift(ticket);
          localStorage.setItem(STORAGE_RETURNS_EXTRA, JSON.stringify(arr));
        } else {
          var acc = JSON.parse(localStorage.getItem(targetAccKey) || '{}');
          if (!acc || typeof acc !== 'object') acc = {};
          if (!Array.isArray(acc.tickets)) acc.tickets = [];
          if (!Array.isArray(acc.notifications)) acc.notifications = [];
          acc.tickets.push(ticket);
          acc.notifications.unshift({
            id: 'N-WTY-' + Date.now(),
            type: 'warranty',
            title: 'Đã tiếp nhận phiếu ' + ticket.id,
            message: ticket.subject + ' đang ở trạng thái "' + ticket.status + '".',
            read: false,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem(targetAccKey, JSON.stringify(acc));
        }
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'orders_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {}

      this.logActivity('return_create', 'Tạo phiếu ' + ticket.typeLabel, ticket.subject, 'returns', ticket.id);
      this.emitUpdate();
      return { ok: true, ticket: ticket, uid: targetAccKey + '::' + ticket.id };
    },

    updateReturnWarrantyTicket: function (uid, patch) {
      var sep = String(uid || '').indexOf('::');
      if (sep === -1) return { ok: false, message: 'Mã phiếu không hợp lệ.' };
      var sourceKey = uid.slice(0, sep);
      var tid = uid.slice(sep + 2);
      var data = patch || {};
      var nextStatus = String(data.status || '').trim();
      var validStatuses = ['Đã tiếp nhận', 'Đang kiểm tra kỹ thuật', 'Đang bảo hành / Đổi mới', 'Hoàn tất', 'Đã hoàn tiền', 'Từ chối'];
      if (nextStatus && validStatuses.indexOf(nextStatus) === -1) {
        return { ok: false, message: 'Trạng thái xử lý không hợp lệ.' };
      }

      var updatedTicket = null;
      try {
        if (sourceKey === STORAGE_RETURNS_EXTRA) {
          var list = JSON.parse(localStorage.getItem(STORAGE_RETURNS_EXTRA) || '[]');
          var idx = Array.isArray(list) ? list.findIndex(function (t) { return t && String(t.id) === tid; }) : -1;
          if (idx === -1) return { ok: false, message: 'Không tìm thấy phiếu yêu cầu.' };
          if (nextStatus) list[idx].status = nextStatus;
          if (data.adminNote !== undefined) list[idx].adminNote = String(data.adminNote).trim();
          if (data.refundAmount !== undefined) list[idx].refundAmount = Math.max(0, Number(data.refundAmount) || 0);
          list[idx].updatedAt = new Date().toISOString();
          updatedTicket = list[idx];
          localStorage.setItem(STORAGE_RETURNS_EXTRA, JSON.stringify(list));
        } else {
          var acc = JSON.parse(localStorage.getItem(sourceKey) || '{}');
          if (!acc || !Array.isArray(acc.tickets)) return { ok: false, message: 'Không tìm thấy phiếu trong tài khoản.' };
          var tIdx = acc.tickets.findIndex(function (t) { return t && String(t.id) === tid; });
          if (tIdx === -1) return { ok: false, message: 'Không tìm thấy phiếu yêu cầu.' };
          if (nextStatus) acc.tickets[tIdx].status = nextStatus;
          if (data.adminNote !== undefined) acc.tickets[tIdx].adminNote = String(data.adminNote).trim();
          if (data.refundAmount !== undefined) acc.tickets[tIdx].refundAmount = Math.max(0, Number(data.refundAmount) || 0);
          acc.tickets[tIdx].updatedAt = new Date().toISOString();
          updatedTicket = acc.tickets[tIdx];

          if (!Array.isArray(acc.notifications)) acc.notifications = [];
          acc.notifications.unshift({
            id: 'N-WTY-' + Date.now(),
            type: 'warranty',
            title: 'Cập nhật Bảo hành / Đổi trả #' + updatedTicket.id,
            message: updatedTicket.subject + ' → ' + updatedTicket.status + (updatedTicket.adminNote ? ('. Ghi chú: ' + updatedTicket.adminNote) : ''),
            read: false,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem(sourceKey, JSON.stringify(acc));
        }

        if (nextStatus === 'Đã hoàn tiền' && updatedTicket && updatedTicket.orderId) {
          this.updateOrderPaymentStatus(updatedTicket.orderId, 'refunded');
        }

        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'orders_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {
        return { ok: false, message: 'Không thể cập nhật phiếu xử lý.' };
      }

      this.logActivity('return_update', 'Xử lý phiếu ' + updatedTicket.id + ' → ' + updatedTicket.status, updatedTicket.adminNote || updatedTicket.subject, 'returns', updatedTicket.id);
      this.emitUpdate();
      return { ok: true, ticket: updatedTicket };
    },

    reconcileOrderPayment: function (orderId, paymentStatus, refCode) {
      var res = this.updateOrderPaymentStatus(orderId, paymentStatus);
      if (!res.ok) return res;
      var list = this.getOrders();
      var idx = list.findIndex(function (o) { return o && String(o.id) === String(orderId); });
      if (idx !== -1) {
        if (refCode) list[idx].payment_ref = String(refCode).trim();
        list[idx].reconciled_at = new Date().toISOString();
        this.saveOrders(list);
        this.syncAccountOrder(list[idx], false, { forceNotify: false });
      }
      return { ok: true, order: idx !== -1 ? list[idx] : res.order };
    },

    /* ---------------- MEMBERS POINT LEDGER & ADJUSTMENT ---------------- */
    getMemberPointHistory: function (userIdentifier) {
      var users = this.getUserInsightsList();
      var needle = String(userIdentifier || '').trim().toLowerCase();
      var user = users.find(function (u) {
        return String(u.id || '').toLowerCase() === needle || String(u.username || '').toLowerCase() === needle || String(u.email || '').toLowerCase() === needle;
      });
      if (!user) return [];

      var entries = [];
      var seen = {};
      var orders = this.getOrders().filter(function (o) {
        var st = AdminEngine.normalizeOrderStatus(o.status);
        return st !== 'cancelled' && st !== 'returned' && AdminEngine.isCustomerOrderMatch(o, user);
      });
      orders.forEach(function (o) {
        var pts = Math.floor((Number(o.total) || 0) / 100000);
        if (pts > 0) {
          seen['order:' + o.id] = true;
          entries.push({
            id: 'ORD-PT-' + o.id,
            source: 'order:' + o.id,
            points: pts,
            description: 'Tích điểm đơn hàng #' + o.id,
            createdAt: o.created_at
          });
        }
      });

      [user.id, user.username, user.email].forEach(function (val) {
        if (val === undefined || val === null) return;
        var k = 'vlu_account_' + String(val).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
        try {
          var acc = JSON.parse(localStorage.getItem(k) || '{}');
          if (acc && Array.isArray(acc.pointLedger)) {
            acc.pointLedger.forEach(function (pl) {
              if (!pl || seen[pl.source] || seen[pl.id]) return;
              seen[pl.id] = true;
              entries.push(pl);
            });
          }
        } catch (e) {}
      });

      return entries.sort(function (a, b) {
        return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
      });
    },

    adjustMemberPoints: function (userIdentifier, deltaPoints, reason) {
      var delta = parseInt(deltaPoints, 10);
      var cleanReason = String(reason || '').trim();
      if (!delta || isNaN(delta)) return { ok: false, message: 'Số điểm điều chỉnh phải khác 0.' };
      if (!cleanReason) return { ok: false, message: 'Vui lòng nhập lý do cộng / trừ điểm.' };

      var users = this.getUserInsightsList();
      var needle = String(userIdentifier || '').trim().toLowerCase();
      var user = users.find(function (u) {
        return String(u.id || '').toLowerCase() === needle || String(u.username || '').toLowerCase() === needle || String(u.email || '').toLowerCase() === needle;
      });
      if (!user) return { ok: false, message: 'Không tìm thấy thành viên.' };

      var actor = null;
      try { actor = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
      var actorName = (actor && (actor.fullname || actor.username)) || 'Quản trị viên VLU';
      var nowIso = new Date().toISOString();
      var ledgerEntry = {
        id: 'P-ADM-' + Date.now() + '-' + Math.floor(Math.random() * 100),
        source: 'admin:' + Date.now(),
        points: delta,
        description: cleanReason + ' (Bởi ' + actorName + ')',
        actor: actorName,
        createdAt: nowIso
      };

      var keyMap = {};
      var primaryKey = 'vlu_account_' + String(user.username || user.email || user.id).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
      keyMap[primaryKey] = true;
      [user.id, user.username, user.email].forEach(function (val) {
        if (val === undefined || val === null) return;
        var norm = String(val).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
        if (norm && localStorage.getItem('vlu_account_' + norm)) {
          keyMap['vlu_account_' + norm] = true;
        }
      });

      var nextTotalPoints = Math.max(0, (Number(user.points) || 0) + delta);
      Object.keys(keyMap).forEach(function (accKey) {
        try {
          var acc = JSON.parse(localStorage.getItem(accKey) || '{}');
          if (!acc || typeof acc !== 'object') acc = {};
          if (!Array.isArray(acc.pointLedger)) acc.pointLedger = [];
          if (!Array.isArray(acc.notifications)) acc.notifications = [];
          acc.pointLedger.push(ledgerEntry);
          acc.points = Math.max(0, (Number(acc.points) || Number(user.points) || 0) + delta);
          acc.notifications.unshift({
            id: 'N-PT-' + Date.now(),
            type: 'promotion',
            title: delta > 0 ? ('Bạn được cộng +' + delta + ' điểm thưởng VLU') : ('Điều chỉnh ' + delta + ' điểm VLU'),
            message: 'Lý do: ' + cleanReason + '. Tổng điểm hiện tại: ' + nextTotalPoints + ' điểm.',
            read: false,
            createdAt: nowIso
          });
          localStorage.setItem(accKey, JSON.stringify(acc));
        } catch (e2) {}
      });

      try {
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'users_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (e3) {}

      this.logActivity('member_points', 'Điều chỉnh điểm: ' + (user.fullname || user.username), (delta > 0 ? ('+' + delta) : delta) + ' điểm · ' + cleanReason, 'members', String(user.id));
      this.emitUpdate();
      return { ok: true, newPoints: nextTotalPoints, entry: ledgerEntry };
    },

    /* ---------------- BROADCAST SYSTEM NOTIFICATIONS ---------------- */
    getSentNotifications: function () {
      try {
        var raw = localStorage.getItem(STORAGE_SENT_NOTIFS);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch (e) {
        return [];
      }
    },

    sendCustomerNotification: function (opts) {
      var data = opts || {};
      var title = String(data.title || '').trim();
      var message = String(data.message || '').trim();
      var target = String(data.target || 'all').trim();
      var type = ['promotion', 'order', 'shipping', 'warranty', 'payment'].indexOf(String(data.type || 'promotion')) !== -1
        ? String(data.type) : 'promotion';

      if (!title || !message) return { ok: false, message: 'Vui lòng nhập đầy đủ Tiêu đề và Nội dung thông báo.' };

      var accountKeys = {};
      if (target === 'all') {
        this.getUsers().forEach(function (u) {
          if (!u || Number(u.role) === 1) return;
          var norm = String(u.username || u.email || u.id).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
          if (norm) accountKeys['vlu_account_' + norm] = true;
        });
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf('vlu_account_') === 0 && k !== 'vlu_account_guest') {
            accountKeys[k] = true;
          }
        }
      } else {
        var normTarget = target.toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
        accountKeys[normTarget.indexOf('vlu_account_') === 0 ? normTarget : ('vlu_account_' + normTarget)] = true;
      }

      var nowIso = new Date().toISOString();
      var delivered = 0;
      Object.keys(accountKeys).forEach(function (accKey) {
        try {
          var acc = JSON.parse(localStorage.getItem(accKey) || '{}');
          if (!acc || typeof acc !== 'object') acc = {};
          if (!Array.isArray(acc.notifications)) acc.notifications = [];
          acc.notifications.unshift({
            id: 'N-SYS-' + Date.now() + '-' + delivered,
            type: type,
            title: title,
            message: message,
            read: false,
            createdAt: nowIso
          });
          localStorage.setItem(accKey, JSON.stringify(acc));
          delivered++;
        } catch (e) {}
      });

      var sentLog = {
        id: 'SNT-' + Date.now(),
        target: target,
        deliveredCount: delivered,
        type: type,
        title: title,
        message: message,
        createdAt: nowIso
      };
      var history = this.getSentNotifications();
      history.unshift(sentLog);
      if (history.length > 50) history = history.slice(0, 50);
      try {
        localStorage.setItem(STORAGE_SENT_NOTIFS, JSON.stringify(history));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
        if (typeof BroadcastChannel !== 'undefined') {
          var bc = new BroadcastChannel('vlu_store_sync');
          bc.postMessage({ type: 'notifications_updated', timestamp: Date.now() });
          bc.close();
        }
      } catch (eBc) {}

      this.logActivity('notif_broadcast', 'Gửi thông báo tới ' + delivered + ' tài khoản', title, 'notifications');
      this.emitUpdate();
      return { ok: true, deliveredCount: delivered, log: sentLog };
    },

    /* ==========================================================================
       G. PHÂN TÍCH DỮ LIỆU DASHBOARD THỰC TẾ (REAL DATA ANALYTICS)
       ========================================================================== */
    resolveItemProduct: function (item, products) {
      if (!item) return null;
      products = Array.isArray(products) ? products : this.getProducts();
      var idStr = String(item.id || '').trim().toLowerCase();
      var nameNorm = normalizeText(item.name || '');

      // 1. Khớp chính xác ID hoặc tên sản phẩm
      var exact = products.find(function (p) {
        return (idStr && String(p.id).toLowerCase() === idStr) ||
          (nameNorm && normalizeText(p.name) === nameNorm);
      });
      if (exact) return exact;

      // 2. Khớp tên sản phẩm dài nhất nằm trong tên item (tránh nhầm id số nhỏ như "1" sang "iphone-18...")
      var best = null;
      var bestLen = 0;
      if (nameNorm) {
        products.forEach(function (p) {
          var pn = normalizeText(p.name);
          if (pn && nameNorm.indexOf(pn) !== -1 && pn.length > bestLen) {
            best = p;
            bestLen = pn.length;
          }
        });
        if (best) return best;
      }

      // 3. Thử fuzzy matcher toàn cục theo tên trước, chỉ dùng id nếu không phải số nhỏ
      if (typeof window.VLU_FIND_PRODUCT === 'function') {
        var lookupQuery = item.name || (!/^\d{1,3}$/.test(idStr) ? item.id : '');
        var found = lookupQuery ? window.VLU_FIND_PRODUCT(lookupQuery) : null;
        if (found) {
          var mapped = products.find(function (p) { return String(p.id) === String(found.id); });
          if (mapped) return mapped;
          return found;
        }
      }

      return null;
    },

    calculateStats: function () {
      var metrics = this.calculateDashboardMetrics();
      return {
        totalRevenue: metrics.totalRevenue,
        todayRevenue: metrics.todayRevenue,
        orderCount: metrics.totalOrders,
        pendingOrders: metrics.pendingOrders,
        shippingOrders: metrics.shippingOrders,
        completedOrders: metrics.completedOrders,
        productCount: metrics.totalProducts,
        lowStockCount: metrics.lowStockProducts,
        userCount: metrics.totalAccounts,
        customerCount: metrics.totalCustomers,
        newCustomersMonth: metrics.newCustomersThisMonth,
        metrics: metrics
      };
    },

    calculateDashboardMetrics: function () {
      var orders = this.getOrders();
      var products = this.getProducts();
      var users = this.getUsers();
      var prodCategories = this.getProductCategories();
      var brands = this.getBrands();

      var now = new Date();
      var todayKey = toLocalDateKey(now);
      var yestDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      var yesterdayKey = toLocalDateKey(yestDate);

      var curMonthKey = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2);
      var prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      var prevMonthKey = prevMonthDate.getFullYear() + '-' + ('0' + (prevMonthDate.getMonth() + 1)).slice(-2);

      var totalRevenue = 0;
      var todayRevenue = 0;
      var todayOrders = 0;
      var yesterdayRevenue = 0;
      var thisMonthRevenue = 0;
      var prevMonthRevenue = 0;
      var thisMonthOrders = 0;
      var prevMonthOrders = 0;

      var pendingOrders = 0;
      var processingOrders = 0;
      var shippingOrders = 0;
      var completedOrders = 0;
      var cancelledOrders = 0;

      orders.forEach(function (o) {
        if (!o) return;
        var st = AdminEngine.normalizeOrderStatus(o.status);
        var grp = AdminEngine.getOrderDashboardGroup(st);
        var amt = Number(o.total) || 0;
        var isRevenueValid = (st !== 'cancelled' && st !== 'returned');

        if (grp === 'pending') pendingOrders++;
        else if (grp === 'confirmed') processingOrders++;
        else if (grp === 'shipping') shippingOrders++;
        else if (grp === 'completed') completedOrders++;
        else if (grp === 'cancelled') cancelledOrders++;

        var dKey = toLocalDateKey(o.created_at);
        var mKey = toMonthKey(o.created_at);

        if (mKey === curMonthKey) thisMonthOrders++;
        else if (mKey === prevMonthKey) prevMonthOrders++;

        if (isRevenueValid) {
          totalRevenue += amt;
          if (dKey === todayKey) {
            todayRevenue += amt;
            todayOrders++;
          } else if (dKey === yesterdayKey) {
            yesterdayRevenue += amt;
          }

          if (mKey === curMonthKey) thisMonthRevenue += amt;
          else if (mKey === prevMonthKey) prevMonthRevenue += amt;
        }
      });

      var lowStockOnly = 0;
      var outOfStock = 0;
      products.forEach(function (p) {
        var s = Number(p.stock);
        if (isNaN(s)) return;
        if (s <= 0) outOfStock++;
        else if (s <= 5) lowStockOnly++;
      });

      var customers = users.filter(function (u) { return Number(u.role) !== 1; });
      var newCustomersThisMonth = 0;
      var newCustomersPrevMonth = 0;
      var totalCustomersBeforeThisMonth = 0;

      customers.forEach(function (u) {
        var mKey = toMonthKey(u.created_at);
        if (mKey === curMonthKey) {
          newCustomersThisMonth++;
        } else {
          totalCustomersBeforeThisMonth++;
          if (mKey === prevMonthKey) newCustomersPrevMonth++;
        }
      });

      return {
        totalRevenue: totalRevenue,
        thisMonthRevenue: thisMonthRevenue,
        prevMonthRevenue: prevMonthRevenue,
        revenueGrowth: calcGrowthPct(thisMonthRevenue, prevMonthRevenue),

        todayRevenue: todayRevenue,
        todayOrders: todayOrders,
        yesterdayRevenue: yesterdayRevenue,
        todayGrowth: calcGrowthPct(todayRevenue, yesterdayRevenue),

        totalOrders: orders.length,
        thisMonthOrders: thisMonthOrders,
        prevMonthOrders: prevMonthOrders,
        ordersGrowth: calcGrowthPct(thisMonthOrders, prevMonthOrders),

        pendingOrders: pendingOrders,
        processingOrders: processingOrders,
        shippingOrders: shippingOrders,
        completedOrders: completedOrders,
        cancelledOrders: cancelledOrders,
        pendingSharePct: orders.length > 0 ? Math.round((pendingOrders / orders.length) * 1000) / 10 : 0,

        totalProducts: products.length,
        activeCategoriesCount: prodCategories.length,
        activeBrandsCount: brands.length,

        lowStockProducts: lowStockOnly + outOfStock,
        lowStockOnlyCount: lowStockOnly,
        outOfStockCount: outOfStock,

        totalCustomers: customers.length,
        totalAccounts: users.length,
        customersGrowth: calcGrowthPct(customers.length, totalCustomersBeforeThisMonth),

        newCustomersThisMonth: newCustomersThisMonth,
        newCustomersPrevMonth: newCustomersPrevMonth,
        newCustomersGrowth: calcGrowthPct(newCustomersThisMonth, newCustomersPrevMonth)
      };
    },

    getRevenueSeries: function (options) {
      var opts = options || {};
      var granularity = opts.granularity || 'day';
      var compare = Boolean(opts.compare);
      var orders = this.getOrders().filter(function (o) {
        var st = AdminEngine.normalizeOrderStatus(o && o.status);
        return st !== 'cancelled' && st !== 'returned';
      });

      var now = new Date();
      var endDate = parseDateSafe(opts.endDate) || new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);

      var startDate = parseDateSafe(opts.startDate);
      if (!startDate) {
        if (granularity === 'day') {
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 13);
        } else if (granularity === 'week') {
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7 * 7);
        } else if (granularity === 'month') {
          startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1);
        } else {
          startDate = new Date(endDate.getFullYear() - 3, 0, 1);
        }
      } else {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
      }

      if (startDate.getTime() > endDate.getTime()) {
        var tmp = startDate;
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        endDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), 23, 59, 59, 999);
      }

      var buckets = [];
      var cursor;

      if (granularity === 'day') {
        cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        var guard = 0;
        while (cursor.getTime() <= endDate.getTime() && guard < 180) {
          guard++;
          var dayStart = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 0, 0, 0, 0);
          var dayEnd = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 23, 59, 59, 999);
          var dd = ('0' + cursor.getDate()).slice(-2);
          var mm = ('0' + (cursor.getMonth() + 1)).slice(-2);
          buckets.push({
            key: toLocalDateKey(cursor),
            label: dd + '/' + mm + '/' + cursor.getFullYear(),
            shortLabel: dd + '/' + mm,
            start: dayStart,
            end: dayEnd,
            revenue: 0,
            orderCount: 0,
            prevRevenue: 0,
            prevOrderCount: 0,
            prevLabel: ''
          });
          cursor.setDate(cursor.getDate() + 1);
        }
      } else if (granularity === 'week') {
        // Bắt đầu từ Thứ 2 của tuần chứa startDate
        var dow = (startDate.getDay() + 6) % 7;
        cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - dow);
        var guardW = 0;
        while (cursor.getTime() <= endDate.getTime() && guardW < 104) {
          guardW++;
          var wStart = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 0, 0, 0, 0);
          var wEnd = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 6, 23, 59, 59, 999);
          var sd = ('0' + wStart.getDate()).slice(-2) + '/' + ('0' + (wStart.getMonth() + 1)).slice(-2);
          var ed = ('0' + wEnd.getDate()).slice(-2) + '/' + ('0' + (wEnd.getMonth() + 1)).slice(-2);
          buckets.push({
            key: toLocalDateKey(wStart),
            label: 'Tuần ' + sd + ' - ' + ed,
            shortLabel: sd,
            start: wStart,
            end: wEnd,
            revenue: 0,
            orderCount: 0,
            prevRevenue: 0,
            prevOrderCount: 0,
            prevLabel: ''
          });
          cursor.setDate(cursor.getDate() + 7);
        }
      } else if (granularity === 'month') {
        cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        var endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        var guardM = 0;
        while (cursor.getTime() <= endMonth.getTime() && guardM < 60) {
          guardM++;
          var mStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1, 0, 0, 0, 0);
          var mEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59, 999);
          var mStr = ('0' + (cursor.getMonth() + 1)).slice(-2);
          buckets.push({
            key: cursor.getFullYear() + '-' + mStr,
            label: 'Tháng ' + mStr + '/' + cursor.getFullYear(),
            shortLabel: 'T' + (cursor.getMonth() + 1) + '/' + String(cursor.getFullYear()).slice(-2),
            start: mStart,
            end: mEnd,
            revenue: 0,
            orderCount: 0,
            prevRevenue: 0,
            prevOrderCount: 0,
            prevLabel: ''
          });
          cursor.setMonth(cursor.getMonth() + 1);
        }
      } else {
        var sYear = startDate.getFullYear();
        var eYear = endDate.getFullYear();
        for (var y = sYear; y <= eYear; y++) {
          buckets.push({
            key: String(y),
            label: 'Năm ' + y,
            shortLabel: String(y),
            start: new Date(y, 0, 1, 0, 0, 0, 0),
            end: new Date(y, 11, 31, 23, 59, 59, 999),
            revenue: 0,
            orderCount: 0,
            prevRevenue: 0,
            prevOrderCount: 0,
            prevLabel: ''
          });
        }
      }

      // Tính khoảng thời gian kỳ trước tương ứng (cùng số bucket) để so sánh
      var spanBuckets = buckets.length || 1;
      function shiftDatePrev(d) {
        var res = new Date(d.getTime());
        if (granularity === 'day') res.setDate(res.getDate() - spanBuckets);
        else if (granularity === 'week') res.setDate(res.getDate() - spanBuckets * 7);
        else if (granularity === 'month') res.setMonth(res.getMonth() - spanBuckets);
        else res.setFullYear(res.getFullYear() - spanBuckets);
        return res;
      }

      buckets.forEach(function (b) {
        b.prevStart = shiftDatePrev(b.start);
        b.prevEnd = shiftDatePrev(b.end);
        if (granularity === 'day') {
          b.prevLabel = ('0' + b.prevStart.getDate()).slice(-2) + '/' + ('0' + (b.prevStart.getMonth() + 1)).slice(-2) + '/' + b.prevStart.getFullYear();
        } else if (granularity === 'month') {
          b.prevLabel = 'Tháng ' + ('0' + (b.prevStart.getMonth() + 1)).slice(-2) + '/' + b.prevStart.getFullYear();
        } else if (granularity === 'year') {
          b.prevLabel = 'Năm ' + b.prevStart.getFullYear();
        } else {
          b.prevLabel = 'Tuần ' + ('0' + b.prevStart.getDate()).slice(-2) + '/' + ('0' + (b.prevStart.getMonth() + 1)).slice(-2);
        }
      });

      var totalRevenue = 0;
      var totalOrders = 0;
      var prevTotalRevenue = 0;
      var prevTotalOrders = 0;

      orders.forEach(function (o) {
        var od = parseDateSafe(o.created_at);
        if (!od) return;
        var t = od.getTime();
        var amt = Number(o.total) || 0;

        for (var i = 0; i < buckets.length; i++) {
          var b = buckets[i];
          if (t >= b.start.getTime() && t <= b.end.getTime()) {
            b.revenue += amt;
            b.orderCount += 1;
            totalRevenue += amt;
            totalOrders += 1;
          }
          if (compare && t >= b.prevStart.getTime() && t <= b.prevEnd.getTime()) {
            b.prevRevenue += amt;
            b.prevOrderCount += 1;
            prevTotalRevenue += amt;
            prevTotalOrders += 1;
          }
        }
      });

      return {
        granularity: granularity,
        compare: compare,
        startKey: toLocalDateKey(startDate),
        endKey: toLocalDateKey(endDate),
        buckets: buckets,
        totalRevenue: totalRevenue,
        orderCount: totalOrders,
        avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        prevTotalRevenue: prevTotalRevenue,
        prevOrderCount: prevTotalOrders,
        growth: calcGrowthPct(totalRevenue, prevTotalRevenue)
      };
    },

    getOrderStatusBreakdown: function () {
      var orders = this.getOrders();
      var total = orders.length || 0;
      var defs = [
        { key: 'pending', label: 'Chờ xác nhận', color: '#F59E0B', count: 0, revenue: 0 },
        { key: 'confirmed', label: 'Đang chuẩn bị', color: '#6366F1', count: 0, revenue: 0 },
        { key: 'shipping', label: 'Đang giao', color: '#3B82F6', count: 0, revenue: 0 },
        { key: 'completed', label: 'Hoàn thành', color: '#10B981', count: 0, revenue: 0 },
        { key: 'cancelled', label: 'Đã hủy', color: '#EF4444', count: 0, revenue: 0 }
      ];
      var byKey = {};
      defs.forEach(function (d) { byKey[d.key] = d; });

      orders.forEach(function (o) {
        var st = AdminEngine.getOrderDashboardGroup(o && o.status);
        var target = byKey[st] || byKey.pending;
        target.count += 1;
        target.revenue += Number(o && o.total) || 0;
      });

      defs.forEach(function (d) {
        d.pct = total > 0 ? Math.round((d.count / total) * 1000) / 10 : 0;
      });

      return { total: total, items: defs };
    },

    getBrandDistribution: function () {
      var products = this.getProducts();
      var orders = this.getOrders();
      var total = products.length || 0;
      var map = {};

      products.forEach(function (p) {
        var brand = String(p.brand || p.category_name || 'Khác').trim();
        if (!map[brand]) {
          map[brand] = { name: brand, count: 0, totalStock: 0, salesUnits: 0, salesRevenue: 0 };
        }
        map[brand].count += 1;
        map[brand].totalStock += Number(p.stock) || 0;
      });

      orders.forEach(function (o) {
        var st = AdminEngine.normalizeOrderStatus(o && o.status);
        if (st === 'cancelled' || st === 'returned') return;
        (o.items || []).forEach(function (it) {
          var matched = AdminEngine.resolveItemProduct(it, products);
          var brand = matched ? (matched.brand || matched.category_name || 'Khác') : 'Khác';
          if (!map[brand]) {
            map[brand] = { name: brand, count: 0, totalStock: 0, salesUnits: 0, salesRevenue: 0 };
          }
          var qty = Math.max(1, parseInt(it.quantity, 10) || 1);
          var rev = (Number(it.price) || 0) * qty;
          map[brand].salesUnits += qty;
          map[brand].salesRevenue += rev;
        });
      });

      return Object.keys(map).map(function (k) {
        var item = map[k];
        item.pct = total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0;
        return item;
      }).sort(function (a, b) {
        return b.count - a.count;
      });
    },

    getCategoryDistribution: function () {
      var products = this.getProducts();
      var prodCategories = this.getProductCategories();
      var orders = this.getOrders();
      var total = products.length || 0;
      var map = {};

      prodCategories.forEach(function (c) {
        map[c.slug] = {
          slug: c.slug,
          name: c.name,
          icon: c.icon || '📦',
          count: 0,
          totalStock: 0,
          salesUnits: 0,
          salesRevenue: 0
        };
      });

      products.forEach(function (p) {
        var slug = String(p.category || p.category_slug || 'dien-thoai').trim();
        if (!map[slug]) {
          map[slug] = {
            slug: slug,
            name: getCategoryDisplayName(slug, prodCategories),
            icon: '📦',
            count: 0,
            totalStock: 0,
            salesUnits: 0,
            salesRevenue: 0
          };
        }
        map[slug].count += 1;
        map[slug].totalStock += Number(p.stock) || 0;
      });

      orders.forEach(function (o) {
        var st = AdminEngine.normalizeOrderStatus(o && o.status);
        if (st === 'cancelled' || st === 'returned') return;
        (o.items || []).forEach(function (it) {
          var matched = AdminEngine.resolveItemProduct(it, products);
          var slug = matched ? (matched.category || matched.category_slug || 'dien-thoai') : (it.category || 'khac');
          if (!map[slug]) {
            map[slug] = {
              slug: slug,
              name: getCategoryDisplayName(slug, prodCategories),
              icon: '📦',
              count: 0,
              totalStock: 0,
              salesUnits: 0,
              salesRevenue: 0
            };
          }
          var qty = Math.max(1, parseInt(it.quantity, 10) || 1);
          var rev = (Number(it.price) || 0) * qty;
          map[slug].salesUnits += qty;
          map[slug].salesRevenue += rev;
        });
      });

      return Object.keys(map).map(function (k) {
        var item = map[k];
        item.pct = total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0;
        return item;
      }).sort(function (a, b) {
        return b.count - a.count;
      });
    },

    getProductAnalytics: function () {
      var products = this.getProducts();
      var orders = this.getOrders();
      var prodCategories = this.getProductCategories();

      var salesByProduct = {};
      var catSales = {};
      var brandSales = {};

      orders.forEach(function (o) {
        var st = AdminEngine.normalizeOrderStatus(o && o.status);
        if (st === 'cancelled' || st === 'returned') return;
        (o.items || []).forEach(function (it) {
          if (!it) return;
          var matched = AdminEngine.resolveItemProduct(it, products);
          var key = matched ? String(matched.id) : String(it.id || it.name);
          var qty = Math.max(1, parseInt(it.quantity, 10) || 1);
          var lineRev = (Number(it.price) || (matched ? Number(matched.price) : 0)) * qty;

          if (!salesByProduct[key]) {
            var itemCat = matched ? (matched.category || 'dien-thoai') : (it.category || 'khac');
            salesByProduct[key] = {
              id: matched ? matched.id : (it.id || key),
              name: matched ? matched.name : it.name,
              brand: matched ? (matched.brand || matched.category_name || 'Khác') : (it.brand || 'Khác'),
              category: itemCat,
              categoryName: matched ? (matched.product_category_name || getCategoryDisplayName(itemCat, prodCategories)) : getCategoryDisplayName(itemCat, prodCategories),
              image: (matched && matched.image) || it.image || 'frontend/assets/images/logo.png',
              price: matched ? matched.price : (Number(it.price) || 0),
              stock: matched ? Number(matched.stock) : 0,
              unitsSold: 0,
              revenue: 0
            };
          }
          salesByProduct[key].unitsSold += qty;
          salesByProduct[key].revenue += lineRev;

          var catKey = salesByProduct[key].category;
          if (!catSales[catKey]) {
            catSales[catKey] = { slug: catKey, name: salesByProduct[key].categoryName, units: 0, revenue: 0 };
          }
          catSales[catKey].units += qty;
          catSales[catKey].revenue += lineRev;

          var brKey = salesByProduct[key].brand || 'Khác';
          if (!brandSales[brKey]) {
            brandSales[brKey] = { name: brKey, units: 0, revenue: 0 };
          }
          brandSales[brKey].units += qty;
          brandSales[brKey].revenue += lineRev;
        });
      });

      var salesList = Object.keys(salesByProduct).map(function (k) { return salesByProduct[k]; });
      var topSelling = salesList.slice().sort(function (a, b) {
        if (b.unitsSold !== a.unitsSold) return b.unitsSold - a.unitsSold;
        return b.revenue - a.revenue;
      }).slice(0, 5);

      var topRevenue = salesList.slice().sort(function (a, b) {
        return b.revenue - a.revenue;
      }).slice(0, 5);

      var lowStockAll = products.filter(function (p) {
        return Number(p.stock) <= 5;
      }).sort(function (a, b) {
        return Number(a.stock) - Number(b.stock);
      });
      var lowStock = lowStockAll.slice(0, 5);

      var highStock = products.slice().sort(function (a, b) {
        if (Number(b.stock) !== Number(a.stock)) return Number(b.stock) - Number(a.stock);
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }).slice(0, 5);

      var catSorted = Object.keys(catSales).map(function (k) { return catSales[k]; }).sort(function (a, b) {
        if (b.units !== a.units) return b.units - a.units;
        return b.revenue - a.revenue;
      });
      var brandSorted = Object.keys(brandSales).map(function (k) { return brandSales[k]; }).sort(function (a, b) {
        if (b.units !== a.units) return b.units - a.units;
        return b.revenue - a.revenue;
      });

      return {
        topSelling: topSelling,
        topRevenue: topRevenue,
        lowStock: lowStock,
        lowStockTotal: lowStockAll.length,
        highStock: highStock,
        topCategory: catSorted[0] || null,
        topBrand: brandSorted[0] || null
      };
    },

    globalSearch: function (query) {
      var q = normalizeText(query);
      if (!q) return { products: [], orders: [], users: [] };
      var products = this.getProducts();
      var orders = this.getOrders();
      var users = this.getUsers();

      var matchedProducts = products.filter(function (p) {
        return normalizeText(p.name).indexOf(q) !== -1 ||
          normalizeText(p.id).indexOf(q) !== -1 ||
          normalizeText(p.brand || p.category_name).indexOf(q) !== -1 ||
          normalizeText(p.product_category_name).indexOf(q) !== -1;
      }).slice(0, 5);

      var matchedOrders = orders.filter(function (o) {
        var hasItemMatch = Array.isArray(o.items) && o.items.some(function (it) {
          return it && normalizeText(it.name).indexOf(q) !== -1;
        });
        return normalizeText(o.order_code || o.id).indexOf(q) !== -1 ||
          normalizeText(o.id).indexOf(q) !== -1 ||
          normalizeText(o.customer_name).indexOf(q) !== -1 ||
          normalizeText(o.customer_phone).indexOf(q) !== -1 ||
          normalizeText(o.customer_email).indexOf(q) !== -1 ||
          hasItemMatch;
      }).slice(0, 5);

      var matchedUsers = users.filter(function (u) {
        return normalizeText(u.fullname).indexOf(q) !== -1 ||
          normalizeText(u.username).indexOf(q) !== -1 ||
          normalizeText(u.email).indexOf(q) !== -1 ||
          normalizeText(u.phone).indexOf(q) !== -1;
      }).slice(0, 5);

      return {
        products: matchedProducts,
        orders: matchedOrders,
        users: matchedUsers
      };
    },

    /* ==========================================================================
       H. FORMATTERS, BADGES, TOAST & BACKEND SYNC
       ========================================================================== */
    formatVND: function (num) {
      var n = Math.round(Number(num) || 0);
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    },

    formatCompactVND: function (num) {
      var n = Number(num) || 0;
      if (n >= 1000000000) return (Math.round((n / 1000000000) * 100) / 100) + ' tỷ';
      if (n >= 1000000) return (Math.round((n / 1000000) * 10) / 10) + ' tr';
      if (n >= 1000) return Math.round(n / 1000) + 'k';
      return n + '₫';
    },

    formatDate: function (dateStr) {
      if (!dateStr) return '--';
      var d = parseDateSafe(dateStr);
      if (!d) return String(dateStr);
      var day = ('0' + d.getDate()).slice(-2);
      var month = ('0' + (d.getMonth() + 1)).slice(-2);
      var year = d.getFullYear();
      var hours = ('0' + d.getHours()).slice(-2);
      var minutes = ('0' + d.getMinutes()).slice(-2);
      return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
    },

    formatRelativeTime: function (dateStr) {
      var d = parseDateSafe(dateStr);
      if (!d) return '--';
      var diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diffSec < 60) return 'Vừa xong';
      if (diffSec < 3600) return Math.floor(diffSec / 60) + ' phút trước';
      if (diffSec < 86400) return Math.floor(diffSec / 3600) + ' giờ trước';
      if (diffSec < 86400 * 7) return Math.floor(diffSec / 86400) + ' ngày trước';
      return this.formatDate(dateStr);
    },

    getStatusBadge: function (status) {
      var s = this.normalizeOrderStatus(status);
      switch (s) {
        case 'pending':
          return '<span class="vlu-badge vlu-badge-warning"><span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>Chờ xác nhận</span>';
        case 'confirmed':
          return '<span class="vlu-badge vlu-badge-info"><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Đã xác nhận</span>';
        case 'preparing':
          return '<span class="vlu-badge vlu-badge-indigo"><span class="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>Đang chuẩn bị</span>';
        case 'handed_over':
          return '<span class="vlu-badge vlu-badge-purple"><span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Đã bàn giao VC</span>';
        case 'shipping':
          return '<span class="vlu-badge vlu-badge-sky"><span class="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse"></span>Đang giao hàng</span>';
        case 'completed':
          return '<span class="vlu-badge vlu-badge-success"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Giao thành công</span>';
        case 'cancelled':
          return '<span class="vlu-badge vlu-badge-danger"><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>Đã hủy</span>';
        case 'returned':
          return '<span class="vlu-badge vlu-badge-neutral"><span class="h-1.5 w-1.5 rounded-full bg-slate-500"></span>Hoàn trả</span>';
        default:
          return '<span class="vlu-badge vlu-badge-neutral">' + (status || 'Mới') + '</span>';
      }
    },

    showToast: function (msg, isError) {
      if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
        window.VLU_CART.showToast(msg, isError);
        return;
      }
      var toast = document.getElementById('toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-2xl transition-all duration-300';
        document.body.appendChild(toast);
      }
      toast.style.background = isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(21, 27, 43, 0.94)';
      toast.textContent = msg;
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 1rem)';
      }, 2600);
    },

    emitUpdate: function () {
      var event;
      if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent('vlu:admin-updated');
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent('vlu:admin-updated', true, true, {});
      }
      window.dispatchEvent(event);
    },

    syncWithBackend: function () {
      var self = this;
      if (typeof fetch !== 'function') return Promise.resolve({ ok: false, offline: true });

      var anyChanged = false;
      var ordersOk = false;
      var usersOk = false;

      var pOrders = fetch('backend/api/orders.php?action=list&is_admin=1', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.success || !Array.isArray(data.orders)) return;
          ordersOk = true;
          if (!data.orders.length) return;
          var localOrders = self.getOrders();
          var changed = false;
          data.orders.forEach(function (sqlOrder) {
            if (!sqlOrder || !sqlOrder.id) return;
            var code = String(sqlOrder.order_code || sqlOrder.id);
            var idx = localOrders.findIndex(function (o) {
              return o && (String(o.order_code || o.id) === code || String(o.id) === String(sqlOrder.id));
            });
            if (idx === -1) {
              localOrders.unshift(sqlOrder);
              changed = true;
            } else {
              var cur = localOrders[idx];
              var hasUpdatedDiff = (sqlOrder.status && cur.status !== sqlOrder.status) ||
                Number(cur.total) !== Number(sqlOrder.total) ||
                (sqlOrder.payment_status && cur.payment_status !== sqlOrder.payment_status) ||
                (sqlOrder.cancel_reason && cur.cancel_reason !== sqlOrder.cancel_reason) ||
                ((!Array.isArray(cur.items) || !cur.items.length) && Array.isArray(sqlOrder.items) && sqlOrder.items.length) ||
                ((!Array.isArray(cur.status_history) || !cur.status_history.length) && Array.isArray(sqlOrder.status_history) && sqlOrder.status_history.length) ||
                ((!Array.isArray(cur.internal_notes) || !cur.internal_notes.length) && Array.isArray(sqlOrder.internal_notes) && sqlOrder.internal_notes.length);
              if (hasUpdatedDiff) {
                localOrders[idx] = Object.assign({}, sqlOrder, cur, {
                  status: sqlOrder.updated_at && (!cur.updated_at || sqlOrder.updated_at > cur.updated_at) ? sqlOrder.status : (cur.status || sqlOrder.status),
                  payment_status: sqlOrder.payment_status || cur.payment_status,
                  cancel_reason: sqlOrder.cancel_reason || cur.cancel_reason,
                  shipping_fee: sqlOrder.shipping_fee !== undefined ? sqlOrder.shipping_fee : cur.shipping_fee,
                  status_history: (Array.isArray(cur.status_history) && cur.status_history.length >= (Array.isArray(sqlOrder.status_history) ? sqlOrder.status_history.length : 0)) ? cur.status_history : sqlOrder.status_history,
                  internal_notes: (Array.isArray(cur.internal_notes) && cur.internal_notes.length >= (Array.isArray(sqlOrder.internal_notes) ? sqlOrder.internal_notes.length : 0)) ? cur.internal_notes : sqlOrder.internal_notes,
                  items: (Array.isArray(cur.items) && cur.items.length) ? cur.items : sqlOrder.items
                });
                changed = true;
              }
            }
          });
          if (changed) {
            self.saveOrders(localOrders, true);
            anyChanged = true;
          }
        })
        .catch(function () {});

      var pUsers = fetch('backend/api/auth.php?action=users', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.success || !Array.isArray(data.users)) return;
          usersOk = true;
          if (!data.users.length) return;
          var localUsers = self.getUsers();
          var changed = false;
          data.users.forEach(function (u) {
            var cleanRemote = sanitizeUserRecord(u);
            if (!cleanRemote || !cleanRemote.username) return;
            var idx = localUsers.findIndex(function (lu) {
              return String(lu.username).toLowerCase() === String(cleanRemote.username).toLowerCase() ||
                (cleanRemote.email && String(lu.email || '').toLowerCase() === String(cleanRemote.email).toLowerCase());
            });
            if (idx === -1) {
              localUsers.unshift(cleanRemote);
              changed = true;
            } else {
              var curU = localUsers[idx];
              var nextCreated = String(cleanRemote.created_at || curU.created_at || '').slice(0, 10);
              var lockChanged = cleanRemote.status !== curU.status || Boolean(cleanRemote.is_locked) !== Boolean(curU.is_locked);
              if (curU.role !== cleanRemote.role ||
                  lockChanged ||
                  (cleanRemote.fullname && curU.fullname !== cleanRemote.fullname) ||
                  (cleanRemote.phone && curU.phone !== cleanRemote.phone) ||
                  (cleanRemote.email && curU.email !== cleanRemote.email) ||
                  (!curU.created_at && nextCreated)) {
                curU.role = cleanRemote.role;
                if (cleanRemote.fullname) curU.fullname = cleanRemote.fullname;
                if (cleanRemote.phone) curU.phone = cleanRemote.phone;
                if (cleanRemote.email) curU.email = cleanRemote.email;
                curU.status = cleanRemote.status;
                curU.is_locked = cleanRemote.is_locked;
                curU.lock_reason = cleanRemote.lock_reason;
                curU.locked_at = cleanRemote.locked_at;
                if (nextCreated) curU.created_at = nextCreated;
                localUsers[idx] = sanitizeUserRecord(curU);
                changed = true;
              }
            }
          });
          if (changed) {
            try {
              localStorage.setItem(STORAGE_USERS, JSON.stringify(localUsers.map(function (lu, i) { return sanitizeUserRecord(lu, i); })));
              anyChanged = true;
            } catch (e) {}
          }
        })
        .catch(function () {});

      return Promise.all([pOrders, pUsers]).then(function () {
        if (anyChanged) {
          self.emitUpdate();
        }
        return { ok: ordersOk || usersOk, ordersOk: ordersOk, usersOk: usersOk, changed: anyChanged };
      });
    }
  };

  window.VLU_ADMIN = AdminEngine;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      AdminEngine.syncWithBackend();
    });
  } else {
    AdminEngine.syncWithBackend();
  }

})(window, document);
