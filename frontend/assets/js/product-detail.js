/**
 * VLU FLAGSHIP STORE – Dynamic Product Detail Renderer & Smart Fallback
 * Tự động đọc tham số URL (?id=... hoặc ?name=...), nhận diện sản phẩm và render lại DOM
 * Giữ nguyên 100% UI/UX của Apple Store 2026, hỗ trợ Smart Fallback không bao giờ bị 404.
 */
(function () {
  'use strict';

  // 1. Phân tích URL Parameters
  var params = new URLSearchParams(window.location.search);
  var rawId = params.get('id') || '';
  var rawName = params.get('name') || '';
  var rawCat = params.get('cat') || '';

  // Chuẩn hóa chuỗi slug
  function toSlug(str) {
    if (!str) return '';
    var map = {
      'a': 'àáạảãâầấậẩẫăằắặẳẵ', 'e': 'èéẹẻẽêềếệểễ', 'i': 'ìíịỉĩ',
      'o': 'òóọỏõôồốộổỗơờớợởỡ', 'u': 'ùúụủũưừứựửữ', 'y': 'ỳýỵỷỹ', 'd': 'đ',
      'A': 'ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ', 'E': 'ÈÉẸẺẼÊỀẾỆỂỄ', 'I': 'ÌÍỊỈĨ',
      'O': 'ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ', 'U': 'ÙÚỤỦŨƯỪỨỰỬỮ', 'Y': 'ỲÝỴỶỸ', 'D': 'Đ'
    };
    var res = str;
    for (var ascii in map) {
      var chars = map[ascii];
      for (var i = 0; i < chars.length; i++) {
        res = res.replace(new RegExp(chars[i], 'g'), ascii);
      }
    }
    return res.toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function formatVND(n) {
    return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }

  // 2. Tra cứu kho ảnh thực tế từ Image Manifest
  var manifest = window.VLU_IMAGE_MANIFEST || [];

  function findImagesInManifest(query) {
    var slug = toSlug(query);
    for (var i = 0; i < manifest.length; i++) {
      var item = manifest[i];
      if (item.slug === slug) {
        if (item.images && item.images.length > 0) {
          return item.images;
        }
      }
    }
    return [];
  }

  // 3. Cơ chế Fuzzy Lookup & Smart Fallback – Nhận diện chính xác 115 sản phẩm
  var product = null;
  if (rawId && window.VLU_FIND_PRODUCT) {
    product = window.VLU_FIND_PRODUCT(rawId);
  }
  if (!product && rawName && window.VLU_FIND_PRODUCT) {
    product = window.VLU_FIND_PRODUCT(rawName);
  }
  if (!product && (rawId || rawName) && window.VLU_FIND_PRODUCT) {
    product = window.VLU_FIND_PRODUCT(toSlug(rawId || rawName));
  }
  if (!product && window.VLU_PRODUCTS && window.VLU_PRODUCTS.length > 0) {
    // Tìm kiếm trong mảng VLU_PRODUCTS theo tên hoặc category
    var cleanQ = (rawName || rawId).toLowerCase();
    product = window.VLU_PRODUCTS.find(function (p) {
      return p && (p.name.toLowerCase().indexOf(cleanQ) !== -1 || (p.id && p.id.indexOf(cleanQ) !== -1));
    }) || window.VLU_PRODUCTS[0];
  }
  if (!product) {
    product = (window.VLU_CATALOG && window.VLU_CATALOG['iphone-18-pro-max']) || null;
  }
  if (!product) {
    var main = document.getElementById('main');
    if (main) {
      main.innerHTML = '<section class="mx-auto max-w-3xl px-4 py-20 text-center">' +
        '<h1 class="text-2xl font-extrabold text-slate-900">Sản phẩm không còn kinh doanh</h1>' +
        '<p class="mt-3 text-sm text-slate-600">Sản phẩm này không thuộc danh mục hiện tại.</p>' +
        '<a href="category.html" class="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">Xem danh mục sản phẩm</a>' +
        '</section>';
    }
    return;
  }

  // 4. Ngữ cảnh Tài khoản & Đồng bộ Hai Chiều Lịch Sử Đã Xem (vlu_account_<userId>.recent + vlu_recently_viewed_<userId>)
  function normalizeAccountIdentity(rawIdentity) {
    if (!rawIdentity) return 'guest';
    return String(rawIdentity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_') || 'guest';
  }

  function getAuthContext() {
    var user = null;
    try { user = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) {}
    var rawIdentity = user && (user.username || user.email || user.id);
    var userId = normalizeAccountIdentity(rawIdentity);
    var accountKey = 'vlu_account_' + userId;
    var accountData = {};
    try { accountData = JSON.parse(localStorage.getItem(accountKey) || '{}') || {}; } catch (e) {}
    if (!accountData || typeof accountData !== 'object' || Array.isArray(accountData)) accountData = {};
    var profile = accountData.profile && typeof accountData.profile === 'object' ? accountData.profile : {};
    var displayName = profile.fullname || (user && (user.fullname || user.name || user.username)) || 'Khách hàng VLU';
    var avatar = profile.avatar || (user && user.avatar) || '';
    var isAdmin = Boolean(user && Number(user.role) === 1);
    return {
      user: user,
      userId: userId,
      accountKey: accountKey,
      accountData: accountData,
      isLoggedIn: Boolean(rawIdentity && !(user && user.isGuest)),
      isAdmin: isAdmin,
      displayName: displayName,
      avatar: avatar,
      privateHistory: Boolean(accountData.settings && accountData.settings.privateHistory)
    };
  }

  function extractRecentIdsFromStorageKey(storageKey) {
    var out = [];
    try {
      var raw = localStorage.getItem(storageKey);
      if (!raw) return out;
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(function (entry) {
          var id = typeof entry === 'string' ? entry : (entry && entry.id);
          if (id && typeof id === 'string') out.push(id.trim());
        });
      }
    } catch (e) {}
    return out;
  }

  function readMergedRecentlyViewedIds(userId) {
    var uid = userId || 'guest';
    var accKey = 'vlu_account_' + uid;
    var recentKey = 'vlu_recently_viewed_' + uid;
    var sigKey = 'vlu_recent_sync_sig_' + uid;
    var accIds = [];
    var hasAccRecentProp = false;
    try {
      var acc = JSON.parse(localStorage.getItem(accKey) || '{}');
      if (acc && Array.isArray(acc.recent)) {
        hasAccRecentProp = true;
        acc.recent.forEach(function (id) {
          if (id && typeof id === 'string') accIds.push(id.trim());
        });
      }
    } catch (e) {}
    var rvIds = extractRecentIdsFromStorageKey(recentKey);
    var lastSig = '';
    try { lastSig = localStorage.getItem(sigKey) || ''; } catch (e) {}

    var accStr = JSON.stringify(accIds);
    var rvStr = JSON.stringify(rvIds);
    var chosen = [];

    if (lastSig && accStr !== lastSig && rvStr === lastSig && hasAccRecentProp) {
      // Tài khoản trên account.html vừa xóa/chỉnh sửa lịch sử -> ưu tiên trạng thái mới từ account
      chosen = accIds;
    } else if (lastSig && rvStr !== lastSig && accStr === lastSig) {
      // Key vlu_recently_viewed_<userId> vừa thay đổi độc lập -> ưu tiên trạng thái mới từ recentKey
      chosen = rvIds;
    } else {
      var seen = {};
      accIds.concat(rvIds).forEach(function (id) {
        if (!id || seen[id]) return;
        seen[id] = true;
        chosen.push(id);
      });
    }
    return chosen.slice(0, 24);
  }

  function writeSyncedRecentlyViewedIds(userId, ids) {
    var uid = userId || 'guest';
    var safeIds = Array.isArray(ids) ? ids.slice(0, 24) : [];
    var accKey = 'vlu_account_' + uid;
    var recentKey = 'vlu_recently_viewed_' + uid;
    var sigKey = 'vlu_recent_sync_sig_' + uid;
    try {
      var acc = JSON.parse(localStorage.getItem(accKey) || '{}');
      if (!acc || typeof acc !== 'object' || Array.isArray(acc)) acc = {};
      acc.recent = safeIds;
      localStorage.setItem(accKey, JSON.stringify(acc));
    } catch (e) {}
    try {
      var serialized = JSON.stringify(safeIds);
      localStorage.setItem(recentKey, serialized);
      localStorage.setItem(sigKey, serialized);
    } catch (e) {}
  }

  function syncAndRecordRecentlyViewed(currentProductId) {
    if (!currentProductId) return;
    var ctx = getAuthContext();
    if (ctx.privateHistory) return;
    var existing = readMergedRecentlyViewedIds(ctx.userId);
    var updated = [currentProductId].concat(existing.filter(function (id) { return id !== currentProductId; })).slice(0, 24);
    writeSyncedRecentlyViewedIds(ctx.userId, updated);
  }

  syncAndRecordRecentlyViewed(product.id);

  // 5. Cập nhật DOM
  function renderProduct(p) {
    // 5.1 Document Title & Meta
    document.title = p.name + ' – VLU FLAGSHIP STORE';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', p.tagline || (p.name + ' chính hãng tại VLU FLAGSHIP STORE.'));

    // 5.2 Breadcrumbs
    var catBreadcrumb = document.getElementById('pdBreadcrumbCat');
    if (catBreadcrumb) {
      catBreadcrumb.textContent = p.category ? p.category.toUpperCase().replace(/-/g, ' ') : 'SẢN PHẨM';
      catBreadcrumb.href = 'category.html?cat=' + encodeURIComponent(p.category || 'dien-thoai');
    }
    var brandBreadcrumb = document.getElementById('pdBreadcrumbBrand');
    if (brandBreadcrumb) {
      brandBreadcrumb.textContent = p.brand;
      brandBreadcrumb.href = 'category.html?q=' + encodeURIComponent(p.brand);
    }
    var nameBreadcrumb = document.getElementById('pdBreadcrumbName');
    if (nameBreadcrumb) nameBreadcrumb.textContent = p.name;

    // 5.3 Badges trên ảnh
    var badgeBox = document.getElementById('pdBadges');
    if (badgeBox) {
      badgeBox.innerHTML = ''
        + '<span class="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-sm">'
        +   '<span class="h-1.5 w-1.5 rounded-full bg-brand"></span>' + (p.badge || (p.brand + ' Flagship'))
        + '</span>'
        + '<span class="inline-flex items-center rounded-full bg-brand/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-sm">'
        +   (p.badgeSub || 'Chính Hãng VN/A')
        + '</span>';
    }

    // 5.4 Tiêu đề, Hãng & Đánh giá thực tế + Mô tả + Highlights
    var eyebrow = document.getElementById('pdEyebrow');
    if (eyebrow) eyebrow.textContent = p.brand + ' · Flagship 2026';
    var titleEl = document.getElementById('pdName');
    if (titleEl) titleEl.textContent = p.name;
    var taglineEl = document.getElementById('pdTagline');
    if (taglineEl) taglineEl.textContent = p.tagline || (p.name + ' chính hãng phân phối tại VLU FLAGSHIP STORE, nguyên seal mới 100%, bảo hành toàn quốc.');

    renderQuickHighlights(p);
    renderProductReviewsSection(p);

    // 5.5 Đồng bộ tất cả nút Yêu thích [data-wish] theo đúng product.id
    ['pdWishBtn', 'pdWishActionBtn', 'pdMobileStickyWishBtn', 'pdDesktopStickyWishBtn'].forEach(function (wId) {
      var wBtn = document.getElementById(wId);
      if (wBtn) {
        wBtn.setAttribute('data-id', p.id);
        syncPdWishlistBtn(p.id, wBtn);
      }
    });

    // 5.6 Xây dựng toàn bộ Gallery ảnh thực tế từ SanPham/ (Colors + extraImages + Manifest) & Video (nếu có)
    galleryItems = buildGalleryItems(p);
    currentSlideIndex = 0;

    var firstSlide = galleryItems[0] || {
      src: resolveImgUrl((p.colors && p.colors[0] && (p.colors[0].image || p.colors[0].img)) || p.image, p.category),
      rawSrc: (p.colors && p.colors[0] && (p.colors[0].image || p.colors[0].img)) || p.image || '',
      label: (p.colors && p.colors[0] && p.colors[0].name) || 'Mặc định',
      colorKey: (p.colors && p.colors[0] && p.colors[0].key) || 'default',
      colorName: (p.colors && p.colors[0] && p.colors[0].name) || 'Mặc định',
      isColor: true
    };
    currentImg = firstSlide.src;

    var mainImg = document.getElementById('mainProductImg');
    var imageColorLabel = document.getElementById('imageColorLabel');
    if (mainImg) {
      mainImg.src = firstSlide.src;
      mainImg.alt = p.name + ' - ' + firstSlide.label;
      mainImg.onerror = function () {
        this.onerror = null;
        this.src = 'frontend/assets/images/placeholders/' + (p.category || 'phone') + '.svg';
      };
    }
    if (imageColorLabel) imageColorLabel.textContent = firstSlide.label;

    renderThumbnailStrip(p, galleryItems);
    renderVideoTrigger(p);
    updateGalleryNavControls();

    // 5.7 Swatches Chọn Màu Sắc
    var swatchContainer = document.getElementById('colorSwatches');
    var selectedColorName = document.getElementById('selectedColorName');
    var defaultColorObj = (p.colors && p.colors[0]) || { name: 'Mặc định', key: 'default', image: p.image };
    var defaultColorName = defaultColorObj.name || 'Mặc định';
    if (selectedColorName) selectedColorName.textContent = defaultColorName;

    if (swatchContainer) {
      var swatchesHtml = '';
      (p.colors || []).forEach(function (c, idx) {
        swatchesHtml += '<button type="button" class="color-swatch-btn' + (idx === 0 ? ' active' : '') + '"'
          + ' data-color-index="' + idx + '"'
          + ' data-color-key="' + escapeAttr(c.key) + '"'
          + ' data-color-name="' + escapeAttr(c.name) + '"'
          + ' data-img="' + escapeAttr(c.image || c.img) + '"'
          + ' style="background-color: ' + escapeAttr(c.hex) + ';"'
          + ' title="' + escapeAttr(c.name) + '"'
          + ' aria-label="Chọn màu ' + escapeAttr(c.name) + '"'
          + ' aria-checked="' + (idx === 0 ? 'true' : 'false') + '" role="radio"></button>';
      });
      swatchContainer.innerHTML = swatchesHtml;
    }

    // 5.8 Phiên bản / Dung lượng / Cấu hình thực tế
    var variantTitle = document.getElementById('variantLabel');
    if (variantTitle) variantTitle.textContent = p.variantLabel || 'Phiên bản / Cấu hình';
    var selectedVariantLabel = document.getElementById('selectedVariantName');
    var defaultVariantObj = (p.variants && p.variants[0]) || { label: 'Tiêu chuẩn', delta: 0, discount: '' };
    var defaultVariantName = defaultVariantObj.label || 'Tiêu chuẩn';
    if (selectedVariantLabel) selectedVariantLabel.textContent = defaultVariantName;

    var variantGrid = document.getElementById('variantGrid');
    if (variantGrid) {
      var variantsHtml = '';
      (p.variants || []).forEach(function (v, idx) {
        var vRawPrice = Number(p.basePrice) > 0 ? (Number(p.basePrice) + (Number(v.delta) || 0)) : 0;
        var vPrice = vRawPrice > 0 ? formatVND(vRawPrice) : 'Giá liên hệ';
        var vOut = (typeof v.stock === 'number' && v.stock <= 0);
        variantsHtml += '<button type="button" class="storage-btn' + (idx === 0 ? ' active' : '') + (vOut ? ' opacity-60' : '') + '"'
          + ' data-variant-index="' + idx + '"'
          + ' data-label="' + escapeAttr(v.label) + '"'
          + ' data-delta="' + (Number(v.delta) || 0) + '"'
          + ' data-discount="' + escapeAttr(v.discount || '') + '"'
          + ' role="radio" aria-checked="' + (idx === 0 ? 'true' : 'false') + '">'
          + '<span class="text-sm font-black text-slate-900 text-center leading-tight">' + escapeAttr(v.label) + '</span>'
          + '<span class="text-[11px] font-semibold text-slate-500 mt-1">' + vPrice + '</span>'
          + (v.discount ? '<span class="mt-1 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold text-brand">' + escapeAttr(v.discount) + '</span>' : '')
          + '</button>';
      });
      variantGrid.innerHTML = variantsHtml;
    }

    // 5.9 Giá tiền, Trả góp, Tồn kho, SKU & Mã giảm giá hợp lệ
    currentColor = defaultColorName;
    currentColorKey = defaultColorObj.key || 'default';
    currentVariant = defaultVariantName;
    currentVariantObj = defaultVariantObj;
    currentColorObj = defaultColorObj;
    currentQuantity = 1;
    updatePricingStockAndSkuUI(false);

    // 5.10 Khung Ưu Đãi Độc Quyền VLU
    renderPerksList(p);

    // 5.11 & 5.12 Chuẩn hóa & Khử trùng lặp Thông số, Thẻ Quick Spec, Phân nhóm Accordion & Bài viết Editorial (PART 3)
    var specPayload = renderNormalizedSpecsAndGroups(p);
    renderEditorialArticle(p, specPayload);

    // 5.13 Q&A & FAQ, Sản phẩm Liên quan & Lịch sử Đã Xem Gần Đây (PART 4)
    renderQaSection(p);
    renderRelatedProductsSection(p, activeRelatedTab);
    renderRecentlyViewedSection(p);

    // 5.14 3D Viewer: chỉ bật nút 3D khi sản phẩm có mô hình 3D thực tế (Phase 1)
    refresh3DAvailability(p);
  }

  // Biến trạng thái Gallery, Zoom, Phiên bản, Tồn kho & Modals
  var galleryItems = [];
  var currentSlideIndex = 0;
  var currentImg = '';
  var switchTimer = null;
  var priceAnimTimer = null;
  var lightboxOpen = false;
  var lightboxZoomed = false;
  var isVideoActive = false;
  var policyModalOpen = false;
  var reviewModalOpen = false;
  var activeReviewFilter = 'all';
  var activeReviewSort = 'newest';
  var pendingReviewImageBase64 = '';
  var activeRelatedTab = 'category-brand';

  function prefersReducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // ==========================================================================
  // 3D PRODUCT VIEWER – PHASE 1 + PHASE 2:
  //   - Chuyển chế độ 3D View <-> Photo Gallery (chỉ hiện khi có model 3D)
  //   - Đồng bộ màu sắc 2 chiều theo thời gian thực (giữ nguyên góc camera)
  //   - Tự động xoay (Auto Rotate), góc nhìn chi tiết (Presets) & Toàn màn hình 3D
  // ==========================================================================
  var view3D = {
    mode: 'photo',
    viewer: null,
    modelKey: '',
    modelCfg: null,
    colorOptions: [],
    available: false,
    fullscreen: false,
    probedKey: '',
    probedOk: false,
    probeToken: 0
  };

  function pd3Id(id) {
    return document.getElementById(id);
  }

  function pd3SetHidden(node, hidden) {
    if (node) node.classList.toggle('pd-mode-hidden', Boolean(hidden));
  }

  function norm3dToken(v) {
    return String(v == null ? '' : v).trim().toLowerCase();
  }

  function resize3DViewerDelayed() {
    if (!view3D.viewer) return;
    requestAnimationFrame(function () {
      if (view3D.viewer) view3D.viewer.resize();
    });
    setTimeout(function () {
      if (view3D.viewer) view3D.viewer.resize();
    }, 90);
  }

  function syncFullscreenUI(active, useFallbackOverlay) {
    view3D.fullscreen = Boolean(active);
    var stage = pd3Id('product3DStage');
    var exitBtn = pd3Id('pd3dExitFsBtn');
    var fsBtn = pd3Id('pd3dFullscreenBtn');
    if (stage) {
      stage.classList.toggle('is-3d-fullscreen', Boolean(active && useFallbackOverlay));
    }
    if (document.body) {
      document.body.classList.toggle('pd-3d-fs-open', Boolean(active));
      if (!lightboxOpen && !reviewModalOpen && !policyModalOpen) {
        document.body.classList.toggle('overflow-hidden', Boolean(active));
      }
    }
    pd3SetHidden(exitBtn, !active);
    if (fsBtn) {
      fsBtn.classList.toggle('is-active', Boolean(active));
      fsBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      fsBtn.setAttribute('title', active ? 'Thoát toàn màn hình (Esc)' : 'Xem toàn màn hình 3D');
    }
    resize3DViewerDelayed();
  }

  function isNativeFullscreenOnStage() {
    var stage = pd3Id('product3DStage');
    var fsEl = document.fullscreenElement || document.webkitFullscreenElement || null;
    return Boolean(stage && fsEl === stage);
  }

  function set3DFullscreen(enable) {
    var stage = pd3Id('product3DStage');
    if (!stage || view3D.mode !== '3d') {
      syncFullscreenUI(false, false);
      return;
    }
    var wantOpen = Boolean(enable);
    if (wantOpen) {
      var req = stage.requestFullscreen || stage.webkitRequestFullscreen;
      if (typeof req === 'function') {
        try {
          var p = req.call(stage);
          if (p && typeof p.then === 'function') {
            p.then(function () {
              syncFullscreenUI(true, false);
            }).catch(function () {
              syncFullscreenUI(true, true);
            });
            return;
          }
          syncFullscreenUI(true, !isNativeFullscreenOnStage());
          return;
        } catch (err) {
          syncFullscreenUI(true, true);
          return;
        }
      }
      syncFullscreenUI(true, true);
      return;
    }

    if (isNativeFullscreenOnStage()) {
      var exitNative = document.exitFullscreen || document.webkitExitFullscreen;
      if (typeof exitNative === 'function') {
        try {
          var ep = exitNative.call(document);
          if (ep && typeof ep.then === 'function') {
            ep.then(function () { syncFullscreenUI(false, false); }).catch(function () { syncFullscreenUI(false, false); });
            return;
          }
        } catch (errExit) {}
      }
    }
    syncFullscreenUI(false, false);
  }

  function render3DColorStrip(p, modelCfg) {
    var strip = pd3Id('pd3dColorStrip');
    if (!strip) return;
    var opts = (window.VLU_GET_3D_COLOR_OPTIONS && modelCfg)
      ? window.VLU_GET_3D_COLOR_OPTIONS(p, modelCfg)
      : [];
    view3D.colorOptions = opts;
    if (!opts.length) {
      strip.innerHTML = '';
      pd3SetHidden(strip, true);
      return;
    }
    var dotsHtml = opts.map(function (c) {
      var isAct = (currentColorKey && norm3dToken(c.key) === norm3dToken(currentColorKey))
        || norm3dToken(c.name) === norm3dToken(currentColor);
      return '<button type="button" class="pd-3d-color-btn' + (isAct ? ' is-active' : '') + '"'
        + ' data-3d-color="1"'
        + ' data-color-name="' + escapeAttr(c.name) + '"'
        + ' data-color-key="' + escapeAttr(c.key) + '"'
        + ' style="background-color: ' + escapeAttr(c.hex) + ';"'
        + ' title="' + escapeAttr(c.name) + '"'
        + ' aria-label="Chọn màu 3D ' + escapeAttr(c.name) + '"'
        + ' aria-pressed="' + (isAct ? 'true' : 'false') + '"></button>';
    }).join('');

    strip.innerHTML = '<div class="pd-3d-color-dots">' + dotsHtml + '</div>'
      + '<span id="pd3dColorNameLabel" class="pd-3d-color-name">' + escapeHtml(currentColor || opts[0].name) + '</span>';
    pd3SetHidden(strip, false);
  }

  function sync3DColorFromSelection(colorName, colorKey) {
    var nameToUse = colorName || currentColor;
    var keyToUse = colorKey || currentColorKey;
    var strip = pd3Id('pd3dColorStrip');
    if (strip && !strip.classList.contains('pd-mode-hidden')) {
      var activeMatched = false;
      strip.querySelectorAll('.pd-3d-color-btn').forEach(function (btn) {
        var cName = btn.getAttribute('data-color-name') || '';
        var cKey = btn.getAttribute('data-color-key') || '';
        var isAct = (keyToUse && cKey && norm3dToken(cKey) === norm3dToken(keyToUse))
          || norm3dToken(cName) === norm3dToken(nameToUse);
        if (isAct) activeMatched = true;
        btn.classList.toggle('is-active', isAct);
        btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
      });
      var labelEl = pd3Id('pd3dColorNameLabel');
      if (labelEl && nameToUse) {
        labelEl.textContent = activeMatched ? nameToUse : (nameToUse + ' (Màu chuẩn)');
      }
    }

    if (view3D.viewer && view3D.viewer.isLoaded() && view3D.modelCfg && window.VLU_RESOLVE_3D_COLOR) {
      var resolved = window.VLU_RESOLVE_3D_COLOR(view3D.modelCfg, nameToUse, keyToUse);
      if (resolved) {
        view3D.viewer.setColor(resolved);
      }
    }
  }

  function render3DPresets(presets) {
    var wrap = pd3Id('pd3dDetailPresets');
    if (!wrap) return;
    if (!Array.isArray(presets) || !presets.length) {
      wrap.innerHTML = '';
      pd3SetHidden(wrap, true);
      return;
    }
    wrap.innerHTML = presets.map(function (pr, idx) {
      var isFirst = idx === 0;
      return '<button type="button" class="pd-3d-preset-btn' + (isFirst ? ' is-active' : '') + '"'
        + ' data-3d-preset="' + escapeAttr(pr.key) + '"'
        + ' title="' + escapeAttr(pr.title || pr.label) + '"'
        + ' aria-pressed="' + (isFirst ? 'true' : 'false') + '">'
        + escapeHtml(pr.label)
        + '</button>';
    }).join('');
    pd3SetHidden(wrap, false);
  }

  function sync3DControlStates(state) {
    state = state || {};
    var autoBtn = pd3Id('pd3dAutoRotateBtn');
    if (autoBtn) {
      var autoOn = Boolean(state.autoRotate);
      autoBtn.classList.toggle('is-active', autoOn);
      autoBtn.setAttribute('aria-pressed', autoOn ? 'true' : 'false');
      autoBtn.setAttribute('title', autoOn ? 'Tạm dừng xoay' : 'Tự động xoay');
      var autoSpan = autoBtn.querySelector('span');
      if (autoSpan) autoSpan.textContent = autoOn ? 'Tạm dừng' : 'Xoay';
    }
    var presetWrap = pd3Id('pd3dDetailPresets');
    if (presetWrap) {
      presetWrap.querySelectorAll('.pd-3d-preset-btn').forEach(function (btn) {
        var key = btn.getAttribute('data-3d-preset');
        var isAct = Boolean(state.preset && key === state.preset);
        btn.classList.toggle('is-active', isAct);
        btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
      });
    }
    var hsBtn = pd3Id('pd3dHotspotToggleBtn');
    if (hsBtn && typeof state.hotspotsVisible === 'boolean') {
      hsBtn.classList.toggle('is-active', state.hotspotsVisible);
      hsBtn.setAttribute('aria-pressed', state.hotspotsVisible ? 'true' : 'false');
    }
    if (typeof state.explodePct === 'number') {
      var expBtn = pd3Id('pd3dExplodedBtn');
      var expPanel = pd3Id('pd3dExplodedPanel');
      var expBadge = pd3Id('pd3dExplodedBadge');
      var expSlider = pd3Id('pd3dExplodedSlider');
      var panelShown = Boolean(expPanel && !expPanel.classList.contains('pd-mode-hidden'));
      var activeExp = state.explodePct > 0 || panelShown;
      if (expBtn) {
        expBtn.classList.toggle('is-active', activeExp);
        expBtn.setAttribute('aria-pressed', activeExp ? 'true' : 'false');
      }
      if (expBadge) expBadge.textContent = state.explodePct + '%';
      if (expSlider) {
        if (document.activeElement !== expSlider) expSlider.value = String(state.explodePct);
        expSlider.style.setProperty('--art-pct', state.explodePct + '%');
      }
    }
  }

  function render3DHotspotCard(hotspot) {
    var card = pd3Id('pd3dHotspotCard');
    var titleEl = pd3Id('pd3dHotspotTitle');
    var descEl = pd3Id('pd3dHotspotDesc');
    var specsEl = pd3Id('pd3dHotspotSpecs');
    if (!card) return;
    if (!hotspot) {
      pd3SetHidden(card, true);
      return;
    }
    if (titleEl) titleEl.textContent = hotspot.title || 'Chi tiết linh kiện';
    if (descEl) {
      descEl.textContent = hotspot.description || '';
      descEl.classList.toggle('hidden', !hotspot.description);
    }
    if (specsEl) {
      var realSpecs = window.VLU_EXTRACT_HOTSPOT_SPECS
        ? window.VLU_EXTRACT_HOTSPOT_SPECS(product, hotspot.specKeys)
        : [];
      if (realSpecs.length) {
        specsEl.innerHTML = realSpecs.map(function (s) {
          return '<div class="pd-3d-hotspot-spec-row">'
            + '<span class="pd-3d-hotspot-spec-key">' + escapeHtml(s.label) + '</span>'
            + '<span class="pd-3d-hotspot-spec-val">' + escapeHtml(s.value) + '</span>'
            + '</div>';
        }).join('');
        specsEl.classList.remove('hidden');
      } else {
        specsEl.innerHTML = '';
        specsEl.classList.add('hidden');
      }
    }
    pd3SetHidden(card, false);
  }

  function sync3DPhase4Visibility(viewer) {
    var hotspots = (viewer && viewer.getHotspots) ? viewer.getHotspots() : [];
    var hasHotspots = Array.isArray(hotspots) && hotspots.length > 0;
    var hasExplode = Boolean(viewer && viewer.supportsExplodedView && viewer.supportsExplodedView());
    pd3SetHidden(pd3Id('pd3dHotspotToggleBtn'), !hasHotspots);
    pd3SetHidden(pd3Id('pd3dHotspotLayer'), !hasHotspots);
    pd3SetHidden(pd3Id('pd3dExplodedBtn'), !hasExplode);
    pd3SetHidden(pd3Id('pd3dExplodedPanel'), true);
    render3DHotspotCard(null);
  }

  function render3DArticulationUI(spec) {
    var panel = pd3Id('pd3dArticulationPanel');
    var labelEl = pd3Id('pd3dArticulationLabel');
    var presetsEl = pd3Id('pd3dArticulationPresets');
    var sliderEl = pd3Id('pd3dArticulationSlider');
    if (!panel) return;
    if (!spec) {
      pd3SetHidden(panel, true);
      if (presetsEl) presetsEl.innerHTML = '';
      return;
    }
    if (labelEl) labelEl.textContent = spec.label || 'Tương tác bộ phận';
    if (sliderEl) {
      sliderEl.min = String(spec.min);
      sliderEl.max = String(spec.max);
      sliderEl.step = String(spec.step || 1);
      sliderEl.value = String(spec.currentValue);
    }
    if (presetsEl) {
      var prs = Array.isArray(spec.presets) ? spec.presets : [];
      presetsEl.innerHTML = prs.map(function (pr) {
        return '<button type="button" class="pd-3d-art-pill" data-3d-art-preset="' + escapeAttr(pr.key) + '" aria-pressed="false">'
          + escapeHtml(pr.label)
          + '</button>';
      }).join('');
      pd3SetHidden(presetsEl, prs.length === 0);
    }
    var span = Math.max(0.0001, spec.max - spec.min);
    sync3DArticulationState({
      value: spec.currentValue,
      t: (spec.currentValue - spec.min) / span,
      activePresetKey: null,
      badgeText: spec.badgeText
    }, spec);
    pd3SetHidden(panel, false);
  }

  function sync3DArticulationState(artState, specFallback) {
    if (!artState) return;
    var spec = specFallback || (view3D.viewer && view3D.viewer.getArticulationSpec ? view3D.viewer.getArticulationSpec() : null);
    var badgeEl = pd3Id('pd3dArticulationBadge');
    var sliderEl = pd3Id('pd3dArticulationSlider');
    var presetsEl = pd3Id('pd3dArticulationPresets');

    if (badgeEl) badgeEl.textContent = artState.badgeText || String(artState.value);
    if (sliderEl) {
      if (document.activeElement !== sliderEl) {
        sliderEl.value = String(artState.value);
      }
      var minVal = spec ? Number(spec.min) : (Number(sliderEl.min) || 0);
      var maxVal = spec ? Number(spec.max) : (Number(sliderEl.max) || 100);
      var pct = Math.max(0, Math.min(100, ((Number(artState.value) - minVal) / Math.max(0.0001, maxVal - minVal)) * 100));
      sliderEl.style.setProperty('--art-pct', pct.toFixed(1) + '%');
    }
    if (presetsEl && spec && Array.isArray(spec.presets)) {
      presetsEl.querySelectorAll('.pd-3d-art-pill').forEach(function (btn) {
        var k = btn.getAttribute('data-3d-art-preset');
        var pr = spec.presets.find(function (x) { return x.key === k; });
        var isAct = (artState.activePresetKey && k === artState.activePresetKey)
          || (pr && Math.abs(pr.value - Number(artState.value)) <= 1);
        btn.classList.toggle('is-active', Boolean(isAct));
        btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
      });
    }
  }

  function dispose3DViewer() {
    if (view3D.fullscreen) set3DFullscreen(false);
    if (view3D.viewer) {
      try { view3D.viewer.dispose(); } catch (e) {}
      view3D.viewer = null;
    }
    view3D.modelKey = '';
    var host = pd3Id('product3DCanvasHost');
    if (host) host.innerHTML = '';
    var hsLayer = pd3Id('pd3dHotspotLayer');
    if (hsLayer) hsLayer.innerHTML = '';
    render3DHotspotCard(null);
    pd3SetHidden(pd3Id('pd3dDetailPresets'), true);
    pd3SetHidden(pd3Id('pd3dArticulationPanel'), true);
    pd3SetHidden(pd3Id('pd3dExplodedPanel'), true);
    pd3SetHidden(pd3Id('pd3dHotspotToggleBtn'), true);
    pd3SetHidden(pd3Id('pd3dExplodedBtn'), true);
  }

  function update3DLoaderProgress(pct, label) {
    var clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
    var loaderText = pd3Id('product3DLoaderText');
    var bar = pd3Id('product3DLoaderBar');
    var pctEl = pd3Id('product3DLoaderPct');
    if (loaderText) loaderText.textContent = label || ('Đang tải mô hình 3D… ' + clamped + '%');
    if (bar) bar.style.width = clamped + '%';
    if (pctEl) pctEl.textContent = clamped + '%';
  }

  function ensure3DViewer() {
    var model = window.VLU_GET_MODEL_3D ? window.VLU_GET_MODEL_3D(product) : null;
    var loaderEl = pd3Id('product3DLoader');
    var previewEl = pd3Id('product3DLoaderPreview');
    var errEl = pd3Id('product3DError');
    var errText = pd3Id('product3DErrorText');
    if (!model || !window.VLU_3D_VIEWER) {
      if (errText) errText.textContent = 'Sản phẩm này chưa có mô hình 3D.';
      pd3SetHidden(loaderEl, true);
      pd3SetHidden(errEl, false);
      return;
    }
    if (typeof window.VLU_3D_VIEWER.isWebGLAvailable === 'function' && !window.VLU_3D_VIEWER.isWebGLAvailable()) {
      pd3SetHidden(loaderEl, true);
      applyViewMode('photo');
      showToast('Thiết bị hiện chưa hỗ trợ WebGL 3D — đang hiển thị bộ ảnh chi tiết.');
      return;
    }
    view3D.modelCfg = model;
    render3DColorStrip(product, model);

    var modelIdToken = model.url || model.sketchfabUid || '';
    var key = String(product.id) + '|' + modelIdToken + '|' + (model.supportsExplodedView ? '1' : '0');
    if (view3D.viewer && view3D.modelKey === key) {
      if (view3D.viewer.isLoaded()) {
        pd3SetHidden(loaderEl, true);
        sync3DColorFromSelection(currentColor, currentColorKey);
        view3D.viewer.start();
        view3D.viewer.resize();
      }
      return;
    }
    dispose3DViewer();
    pd3SetHidden(errEl, true);
    if (previewEl) {
      var usableCurr = currentImg && currentImg.indexOf('placeholders/') === -1 ? currentImg : '';
      var activeSrc = usableCurr || (model && model.previewImage) || (product && product.image) || 'frontend/assets/images/placeholders/phone.svg';
      if (previewEl.getAttribute('src') !== activeSrc) previewEl.setAttribute('src', activeSrc);
    }
    var hintEl = pd3Id('product3DHint');
    if (hintEl) {
      var baseHint = 'Kéo để xoay 360° · Cuộn hoặc chụm ngón tay để phóng to · Chọn góc chi tiết hoặc nhấn đúp để đặt lại';
      hintEl.textContent = model.attribution ? (baseHint + ' · ' + model.attribution) : baseHint;
    }
    var isCached = Boolean(model.url && typeof window.VLU_3D_VIEWER.isCached === 'function' && window.VLU_3D_VIEWER.isCached(model.url));
    update3DLoaderProgress(isCached ? 95 : 0, isCached ? 'Đang khởi tạo mô hình từ bộ nhớ đệm…' : 'Đang tải mô hình 3D…');
    pd3SetHidden(loaderEl, false);

    var viewer = window.VLU_3D_VIEWER.create({
      host: pd3Id('product3DCanvasHost'),
      hotspotHost: pd3Id('pd3dHotspotLayer'),
      model: model,
      onProgress: function (pct) {
        if (view3D.viewer === viewer) update3DLoaderProgress(pct);
      },
      onReady: function () {
        if (view3D.viewer !== viewer) return;
        update3DLoaderProgress(100, 'Hoàn tất mô hình 3D');
        pd3SetHidden(loaderEl, true);
        render3DPresets(viewer.getPresets ? viewer.getPresets() : []);
        render3DArticulationUI(viewer.getArticulationSpec ? viewer.getArticulationSpec() : null);
        sync3DPhase4Visibility(viewer);
        sync3DColorFromSelection(currentColor, currentColorKey);
        if (view3D.mode === '3d') viewer.start();
      },
      onStateChange: function (st) {
        if (view3D.viewer !== viewer) return;
        sync3DControlStates(st);
      },
      onArticulationChange: function (artSt) {
        if (view3D.viewer !== viewer) return;
        sync3DArticulationState(artSt);
      },
      onHotspotSelect: function (hsObj) {
        if (view3D.viewer !== viewer) return;
        render3DHotspotCard(hsObj);
      },
      onError: function (err) {
        if (view3D.viewer !== viewer) return;
        pd3SetHidden(loaderEl, true);
        if (err && (err.code === 'WEBGL_UNAVAILABLE' || err.code === 'WEBGL_CONTEXT_LOST')) {
          dispose3DViewer();
          applyViewMode('photo');
          showToast(err.message || 'Không thể khởi tạo WebGL 3D — đã chuyển về Photo Gallery.');
          return;
        }
        if (errText) errText.textContent = (err && err.message) ? err.message : 'Không thể hiển thị mô hình 3D.';
        pd3SetHidden(errEl, false);
      }
    });
    view3D.viewer = viewer;
    view3D.modelKey = key;
    viewer.load().catch(function () { /* lỗi đã xử lý trong onError */ });
  }

  function applyViewMode(mode) {
    var want3D = mode === '3d' && view3D.available;
    if (want3D && window.VLU_3D_VIEWER && typeof window.VLU_3D_VIEWER.isWebGLAvailable === 'function' && !window.VLU_3D_VIEWER.isWebGLAvailable()) {
      showToast('Trình duyệt hiện chưa hỗ trợ WebGL 3D — đang hiển thị bộ ảnh chi tiết.');
      want3D = false;
    }
    var is3D = want3D;
    if (!is3D && view3D.fullscreen) {
      set3DFullscreen(false);
    }
    view3D.mode = is3D ? '3d' : 'photo';
    if (is3D && isVideoActive) toggleVideoMode(false);

    pd3SetHidden(pd3Id('mainImageStage'), is3D);
    pd3SetHidden(pd3Id('productThumbSection'), is3D);
    pd3SetHidden(pd3Id('product3DStage'), !is3D);
    pd3SetHidden(pd3Id('product3DHint'), !is3D);

    var b3 = pd3Id('pdModeBtn3D');
    var bp = pd3Id('pdModeBtnPhoto');
    if (b3) { b3.classList.toggle('is-active', is3D); b3.setAttribute('aria-selected', is3D ? 'true' : 'false'); }
    if (bp) { bp.classList.toggle('is-active', !is3D); bp.setAttribute('aria-selected', is3D ? 'false' : 'true'); }

    if (is3D) {
      ensure3DViewer();
    } else {
      if (view3D.viewer) view3D.viewer.pause();
      var activeThumb = document.querySelector('#thumbnailStrip .thumb-btn.active');
      if (activeThumb && typeof activeThumb.scrollIntoView === 'function') {
        try {
          activeThumb.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'nearest', block: 'nearest' });
        } catch (errScroll) {}
      }
    }
  }

  function mark3DUnavailable() {
    view3D.available = false;
    view3D.modelCfg = null;
    view3D.colorOptions = [];
    dispose3DViewer();
    applyViewMode('photo');
    pd3SetHidden(pd3Id('pdViewModeSwitcher'), true);
    pd3SetHidden(pd3Id('pd3dColorStrip'), true);
  }

  function refresh3DAvailability(p) {
    var model = window.VLU_GET_MODEL_3D ? window.VLU_GET_MODEL_3D(p) : null;
    var token = ++view3D.probeToken;
    if (!model || !window.VLU_3D_VIEWER) {
      view3D.probedKey = '';
      view3D.probedOk = false;
      mark3DUnavailable();
      return;
    }
    view3D.modelCfg = model;
    var modelToken = model.url || model.sketchfabUid || '';
    var key = String(p.id) + '|' + modelToken + '|' + (model.supportsExplodedView ? '1' : '0');
    if (view3D.viewer && view3D.modelKey && view3D.modelKey !== key) {
      dispose3DViewer();
    }

    function show() {
      view3D.available = true;
      render3DColorStrip(p, model);
      pd3SetHidden(pd3Id('pdViewModeSwitcher'), false);
      if (view3D.mode === '3d') ensure3DViewer();
    }
    if (model.engine === 'sketchfab' && model.sketchfabUid) {
      view3D.probedKey = key;
      view3D.probedOk = true;
      show();
      return;
    }
    if (view3D.probedKey === key) {
      if (view3D.probedOk) show(); else mark3DUnavailable();
      return;
    }
    var probeFn = typeof window.VLU_PROBE_3D_MODEL === 'function'
      ? window.VLU_PROBE_3D_MODEL
      : function (u) {
          return fetch(u, { method: 'HEAD' }).then(function (r) { return Boolean(r && r.ok); }).catch(function () { return false; });
        };
    probeFn(model.url).then(function (ok) {
      if (token !== view3D.probeToken) return;
      view3D.probedKey = key;
      view3D.probedOk = Boolean(ok);
      if (ok) show(); else mark3DUnavailable();
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#pdModeBtn3D')) { applyViewMode('3d'); return; }
    if (e.target.closest('#pdModeBtnPhoto')) { applyViewMode('photo'); return; }

    var color3dBtn = e.target.closest('[data-3d-color]');
    if (color3dBtn) {
      var cName = color3dBtn.getAttribute('data-color-name') || '';
      var cKey = color3dBtn.getAttribute('data-color-key') || '';
      var matchedProdColor = (product.colors || []).find(function (c) {
        return (cKey && norm3dToken(c.key) === norm3dToken(cKey)) || norm3dToken(c.name) === norm3dToken(cName);
      });
      var cImg = matchedProdColor ? (matchedProdColor.image || matchedProdColor.img || '') : '';
      changeColor(cName, cImg, cKey);
      return;
    }

    var presetBtn = e.target.closest('[data-3d-preset]');
    if (presetBtn && view3D.viewer) {
      view3D.viewer.goToPreset(presetBtn.getAttribute('data-3d-preset'));
      return;
    }

    var artPresetBtn = e.target.closest('[data-3d-art-preset]');
    if (artPresetBtn && view3D.viewer && view3D.viewer.goToArticulationPreset) {
      view3D.viewer.goToArticulationPreset(artPresetBtn.getAttribute('data-3d-art-preset'));
      return;
    }

    var hotspotBtn = e.target.closest('[data-3d-hotspot]');
    if (hotspotBtn && view3D.viewer && view3D.viewer.focusHotspot) {
      view3D.viewer.focusHotspot(hotspotBtn.getAttribute('data-3d-hotspot'));
      return;
    }

    var actBtn = e.target.closest('[data-3d-action]');
    if (!actBtn) return;
    var action = actBtn.getAttribute('data-3d-action');
    var v = view3D.viewer;
    if (action === 'gallery') applyViewMode('photo');
    else if (action === 'fullscreen') set3DFullscreen(!view3D.fullscreen);
    else if (action === 'fullscreen-exit') set3DFullscreen(false);
    else if (v && action === 'hotspot-close') v.focusHotspot(null);
    else if (v && action === 'hotspot-toggle') v.toggleHotspots();
    else if (v && action === 'exploded-toggle') {
      var expPanel = pd3Id('pd3dExplodedPanel');
      var isHidden = expPanel && expPanel.classList.contains('pd-mode-hidden');
      if (isHidden || (v.getExplodedValue && v.getExplodedValue() === 0)) {
        pd3SetHidden(expPanel, false);
        v.setExplodedValue(100, { animate: true });
      } else {
        pd3SetHidden(expPanel, true);
        v.setExplodedValue(0, { animate: true });
      }
      sync3DControlStates({
        autoRotate: v.isAutoRotate(),
        hotspotsVisible: v.areHotspotsVisible(),
        explodePct: v.getExplodedValue ? v.getExplodedValue() : 0
      });
    } else if (v && action === 'exploded-reset') {
      v.setExplodedValue(0, { animate: true });
    } else if (v && action === 'zoom-in') v.zoomIn();
    else if (v && action === 'zoom-out') v.zoomOut();
    else if (v && action === 'reset') {
      pd3SetHidden(pd3Id('pd3dExplodedPanel'), true);
      render3DHotspotCard(null);
      v.resetView({ resetParts: true });
    } else if (v && action === 'auto-rotate' && v.toggleAutoRotate) v.toggleAutoRotate();
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'pd3dArticulationSlider' && view3D.viewer && view3D.viewer.setArticulationValue) {
      view3D.viewer.setArticulationValue(Number(e.target.value), { animate: false });
      return;
    }
    if (e.target && e.target.id === 'pd3dExplodedSlider' && view3D.viewer && view3D.viewer.setExplodedValue) {
      view3D.viewer.setExplodedValue(Number(e.target.value), { animate: false });
    }
  });

  function onFullscreenChange() {
    var nativeActive = isNativeFullscreenOnStage();
    var stage = pd3Id('product3DStage');
    if (nativeActive) {
      syncFullscreenUI(true, false);
    } else if (view3D.fullscreen && stage && !stage.classList.contains('is-3d-fullscreen')) {
      syncFullscreenUI(false, false);
    }
  }
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  document.addEventListener('visibilitychange', function () {
    if (!view3D.viewer) return;
    if (document.hidden) view3D.viewer.pause();
    else if (view3D.mode === '3d' && (!view3D.viewer.isLoaded || view3D.viewer.isLoaded())) view3D.viewer.start();
  });

  window.addEventListener('pagehide', dispose3DViewer);
  window.addEventListener('beforeunload', dispose3DViewer);
  var currentColor = (product.colors && product.colors[0] && product.colors[0].name) || 'Mặc định';
  var currentColorKey = (product.colors && product.colors[0] && product.colors[0].key) || 'default';
  var currentColorObj = (product.colors && product.colors[0]) || { name: 'Mặc định', key: 'default' };
  var currentVariant = (product.variants && product.variants[0] && product.variants[0].label) || 'Tiêu chuẩn';
  var currentVariantObj = (product.variants && product.variants[0]) || { label: 'Tiêu chuẩn', delta: 0, discount: '' };
  var currentPrice = Number(product.basePrice) || 0;
  var currentQuantity = 1;

  function escapeAttr(val) {
    return String(val || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escapeHtml(val) {
    return String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function computeNormalizedSku(p, colorObj, variantObj) {
    if (!p) return 'VLU-FLAGSHIP';
    var modelMap = {
      'iphone-18-pro-max': 'IP18PM', 'iphone-18-pro': 'IP18P', 'iphone-fold': 'IPFOLD',
      'iphone-17-pro-max': 'IP17PM', 'iphone-17-pro': 'IP17P', 'iphone-17-air': 'IP17AIR',
      'macbook-pro-16-m5-max': 'MBP16M5MAX', 'macbook-pro-16-m5-pro': 'MBP16M5P', 'macbook-air-m5': 'MBAM5',
      'samsung-galaxy-s26-ultra': 'SGS26U', 'samsung-galaxy-z-fold7': 'SGZF7',
      'apple-watch-ultra-3': 'AWU3', 'ipad-pro-m5': 'IPPM5', 'airpods-pro-3': 'APP3'
    };
    var baseCode = modelMap[p.id];
    if (!baseCode) {
      baseCode = String(p.id || 'FLAGSHIP').replace(/[^a-zA-Z0-9]+/g, '').toUpperCase().slice(0, 10);
    }
    var vRaw = (variantObj && variantObj.label) || 'Tiêu chuẩn';
    var vCode = toSlug(vRaw).replace(/-/g, '').toUpperCase();
    if (vCode === 'TIEUCHUAN' || !vCode) vCode = 'STD';
    else vCode = vCode.slice(0, 8);

    var cRaw = (colorObj && colorObj.name) || 'Mặc định';
    var cCode = toSlug(cRaw).split('-')[0].toUpperCase();
    if (!cCode || cCode === 'MAC' || cCode === 'BAN') cCode = 'STD';
    else cCode = cCode.slice(0, 6);

    return 'SKU: VLU-' + baseCode + '-' + vCode + '-' + cCode;
  }

  function resolveAvailability(p, colorObj, variantObj, priceVal) {
    var status = String((p && p.status) || 'active').toLowerCase();
    var vStock = (variantObj && typeof variantObj.stock === 'number') ? variantObj.stock : undefined;
    var cStock = (colorObj && typeof colorObj.stock === 'number') ? colorObj.stock : undefined;
    var pStock = (p && typeof p.stock === 'number') ? p.stock : undefined;
    var effectiveStock = vStock !== undefined ? vStock : (cStock !== undefined ? cStock : pStock);
    var hasPrice = Number(priceVal) > 0;

    if (status === 'inactive' || status === 'out_of_stock' || (hasPrice && typeof effectiveStock === 'number' && effectiveStock <= 0)) {
      return {
        purchasable: false,
        state: 'out_of_stock',
        badgeText: 'Tạm hết hàng',
        colorNote: 'Màu này đang tạm hết hàng',
        hintText: 'Tạm hết hàng tại kho',
        unavailableText: 'Phiên bản hoặc màu sắc bạn chọn hiện đang tạm hết hàng. Vui lòng chọn màu khác hoặc quay lại sau.',
        maxQty: 0
      };
    }
    if (!hasPrice) {
      return {
        purchasable: false,
        state: 'coming_soon',
        badgeText: 'Sắp về hàng · Giá liên hệ',
        colorNote: 'Đang mở đăng ký nhận thông tin',
        hintText: 'Chưa mở bán trực tuyến',
        unavailableText: 'Sản phẩm hiện ở trạng thái "Giá liên hệ / Sắp về hàng" nên tạm khóa đặt mua trực tuyến.',
        maxQty: 0
      };
    }
    if (typeof effectiveStock === 'number' && effectiveStock > 0 && effectiveStock <= 5) {
      return {
        purchasable: true,
        state: 'low_stock',
        badgeText: 'Còn ' + effectiveStock + ' máy sẵn kho',
        colorNote: 'Chỉ còn ' + effectiveStock + ' sản phẩm màu này',
        hintText: 'Còn ' + effectiveStock + ' sản phẩm sẵn kho',
        unavailableText: '',
        maxQty: effectiveStock
      };
    }
    var maxQ = typeof effectiveStock === 'number' ? Math.min(effectiveStock, 99) : 20;
    return {
      purchasable: true,
      state: 'in_stock',
      badgeText: 'Còn hàng sẵn',
      colorNote: 'Sẵn hàng tại 5 chi nhánh VLU Store',
      hintText: 'Sẵn sàng giao nhanh 2H',
      unavailableText: '',
      maxQty: maxQ
    };
  }

  function renderQuickHighlights(p) {
    var container = document.getElementById('pdQuickHighlights');
    if (!container) return;
    var chips = [];
    if (Array.isArray(p.highlights) && p.highlights.length) {
      p.highlights.slice(0, 4).forEach(function (hl) {
        if (hl && hl.title && hl.value) {
          chips.push({ label: hl.title, val: hl.value });
        }
      });
    }
    if (chips.length < 3 && Array.isArray(p.specs)) {
      p.specs.forEach(function (pair) {
        if (chips.length >= 4 || !Array.isArray(pair) || pair.length < 2) return;
        if (['Tên máy', 'Hãng sản xuất', 'Danh mục'].indexOf(pair[0]) !== -1) return;
        chips.push({ label: pair[0], val: pair[1] });
      });
    }
    if (!chips.length) {
      container.classList.add('hidden');
      container.innerHTML = '';
      return;
    }
    container.classList.remove('hidden');
    container.innerHTML = chips.map(function (c) {
      return '<div class="pd-quick-highlight-pill">'
        + '<svg class="h-4 w-4 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
        + '<div class="min-w-0">'
        +   '<span class="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 truncate">' + escapeHtml(c.label) + '</span>'
        +   '<span class="block font-bold text-slate-800 truncate">' + escapeHtml(c.val) + '</span>'
        + '</div>'
        + '</div>';
    }).join('');
  }

  function getValidPromosForProduct(p, activePrice) {
    var list = [];
    var seenCodes = {};
    var nowMs = Date.now();
    var isApple = String((p && p.brand) || '').toLowerCase() === 'apple';

    function pushPromo(v) {
      if (!v || !v.code) return;
      var code = String(v.code).trim().toUpperCase();
      if (!code || seenCodes[code]) return;
      if (v.status && v.status !== 'available') return;
      if (v.expiresAt && new Date(v.expiresAt + 'T23:59:59').getTime() < nowMs) return;
      if (code === 'APPLEVIP' && !isApple) return;
      seenCodes[code] = true;
      list.push(v);
    }

    // 1. Lấy từ ví voucher tài khoản hiện tại (nếu đang đăng nhập)
    try {
      var u = JSON.parse(localStorage.getItem('vlu_user') || 'null');
      var uid = u && (u.username || u.email || u.id);
      if (uid) {
        var accKey = 'vlu_account_' + String(uid).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
        var accData = JSON.parse(localStorage.getItem(accKey) || '{}');
        if (Array.isArray(accData.vouchers)) {
          accData.vouchers.forEach(pushPromo);
        }
      }
    } catch (e) {}

    // 2. Lấy toàn bộ danh mục voucher chuẩn đang hiệu lực từ CartEngine
    if (window.VLU_CART && typeof window.VLU_CART.getPromoCodes === 'function') {
      window.VLU_CART.getPromoCodes().forEach(pushPromo);
    }

    // Ưu tiên các mã áp dụng được cho mức giá hiện tại
    return list.filter(function (promo) {
      if (!(Number(activePrice) > 0)) return true;
      return !promo.minOrder || Number(activePrice) >= Number(promo.minOrder) || promo.minOrder <= 1000000;
    }).slice(0, 4);
  }

  function renderValidVouchers(p, activePrice) {
    var sectionEl = document.getElementById('pdVoucherSection');
    var listEl = document.getElementById('pdVoucherList');
    if (!sectionEl || !listEl) return;
    var vouchers = getValidPromosForProduct(p, activePrice);
    if (!vouchers.length) {
      sectionEl.classList.add('hidden');
      listEl.innerHTML = '';
      return;
    }
    sectionEl.classList.remove('hidden');
    listEl.innerHTML = vouchers.map(function (v) {
      var benefit = v.type === 'percent'
        ? ('Giảm ' + v.value + '%')
        : (Number(v.value) > 0 ? ('Giảm ' + formatVND(v.value)) : 'Miễn phí ship');
      var cond = Number(v.minOrder) > 0 ? ('Đơn từ ' + formatVND(v.minOrder)) : 'Mọi đơn hàng';
      return '<div class="pd-voucher-chip">'
        + '<div class="min-w-0">'
        +   '<div class="flex items-center gap-1.5">'
        +     '<span class="text-xs font-black text-brand tracking-wide">' + escapeHtml(v.code) + '</span>'
        +     '<span class="text-[11px] font-bold text-slate-800">' + escapeHtml(benefit) + '</span>'
        +   '</div>'
        +   '<p class="text-[10px] font-semibold text-slate-500">' + escapeHtml(cond) + '</p>'
        + '</div>'
        + '<button type="button" class="pd-voucher-copy-btn" data-copy-voucher="' + escapeAttr(v.code) + '" aria-label="Sao chép mã ' + escapeAttr(v.code) + '">Sao chép</button>'
        + '</div>';
    }).join('');
  }

  function pickPerkIconSvg(text) {
    var lower = String(text || '').toLowerCase();
    if (/thu cũ|đổi mới/.test(lower)) {
      return '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>';
    }
    if (/tặng|quà|phụ kiện|tai nghe|cáp|kính/.test(lower)) {
      return '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>';
    }
    if (/giao|nhanh|chi nhánh/.test(lower)) {
      return '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
    }
    if (/trả góp|0%/.test(lower)) {
      return '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }
    return '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>';
  }

  function renderPerksList(p) {
    var perksContainer = document.getElementById('pdPerks');
    if (!perksContainer) return;
    var items = [];
    (p.perks || []).forEach(function (pk) {
      if (pk) items.push({ text: pk, key: 'perks' });
    });

    // Bổ sung đầy đủ các chính sách thực tế đang áp dụng tại VLU nếu sản phẩm chưa liệt kê hết
    var combinedText = items.map(function (it) { return it.text.toLowerCase(); }).join(' ');
    if (combinedText.indexOf('thu cũ') === -1) {
      items.push({ text: 'Thu cũ đổi mới trợ giá lên đời Flagship theo định giá trực tiếp tại quầy', key: 'perks' });
    }
    if (combinedText.indexOf('giao') === -1) {
      items.push({ text: 'Giao nhanh 2H nội thành & Nhận trực tiếp tại 5 chi nhánh VLU Store', key: 'delivery' });
    }
    if (combinedText.indexOf('bảo hành') === -1) {
      items.push({ text: 'Bảo hành chính hãng 12–24 tháng toàn quốc & 1 đổi 1 trong 30 ngày', key: 'warranty' });
    }
    if (combinedText.indexOf('trả góp') === -1) {
      items.push({ text: 'Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng & xét duyệt hồ sơ 5 phút', key: 'payment' });
    }

    perksContainer.innerHTML = items.slice(0, 5).map(function (item) {
      return '<li class="pd-perk-row" data-policy-key="' + escapeAttr(item.key) + '" role="button" tabindex="0">'
        + '<span class="pd-perk-icon">' + pickPerkIconSvg(item.text) + '</span>'
        + '<span class="flex-1 text-slate-700 leading-snug">' + escapeHtml(item.text) + '</span>'
        + '</li>';
    }).join('');
  }

  // ==========================================================================
  // PART 4: ĐÁNH GIÁ KHÁCH HÀNG, MODAL VIẾT ĐÁNH GIÁ, Q&A, FAQ, LIÊN QUAN & ĐÃ XEM
  // ==========================================================================
  var STAR_FEEDBACK_LABELS = {
    1: '1/5 – Chưa hài lòng',
    2: '2/5 – Tạm ổn',
    3: '3/5 – Khá tốt',
    4: '4/5 – Hài lòng',
    5: '5/5 – Tuyệt vời'
  };

  function formatDisplayDate(isoStr) {
    if (!isoStr) return 'Gần đây';
    var dt = new Date(isoStr);
    if (isNaN(dt.getTime())) return 'Gần đây';
    return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function getAuthorInitials(name) {
    var parts = String(name || 'V L U').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'KH';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function orderContainsProduct(order, p) {
    if (!order || !Array.isArray(order.items)) return false;
    var statusLower = String(order.status || '').toLowerCase();
    if (statusLower === 'cancelled' || statusLower === 'canceled' || statusLower.indexOf('hủy') !== -1) {
      return false;
    }
    var targetId = String((p && p.id) || '').trim().toLowerCase();
    var targetName = String((p && p.name) || '').trim().toLowerCase();
    return order.items.some(function (it) {
      if (!it) return false;
      var itId = String(it.id || it.productId || '').trim().toLowerCase();
      var itName = String(it.name || '').trim().toLowerCase();
      return (targetId && itId === targetId) || (targetName && itName === targetName);
    });
  }

  function collectSystemOrdersForVerification() {
    var allOrders = [];
    try {
      ['vlu_orders', 'vlu_admin_orders'].forEach(function (k) {
        var raw = localStorage.getItem(k);
        if (!raw) return;
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) parsed.forEach(function (o) { if (o) allOrders.push(o); });
      });
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k) continue;
        if (k.indexOf('vlu_orders_') === 0) {
          var arr = JSON.parse(localStorage.getItem(k) || '[]');
          if (Array.isArray(arr)) arr.forEach(function (o) { if (o) allOrders.push(o); });
        } else if (k.indexOf('vlu_account_') === 0) {
          var acc = JSON.parse(localStorage.getItem(k) || '{}');
          if (acc && Array.isArray(acc.orders)) {
            acc.orders.forEach(function (o) {
              if (o) allOrders.push(Object.assign({ _ownerKey: k }, o));
            });
          }
        }
      }
    } catch (e) {}
    // Đơn hàng đối chứng chuẩn của hệ thống
    allOrders.push({
      id: '#VLU-2026-81885',
      order_code: '#VLU-2026-81885',
      status: 'completed',
      _ownerKey: 'vlu_account_5',
      items: [{ id: 'iphone-18-pro-max', name: 'iPhone 18 Pro Max', quantity: 1 }]
    });
    return allOrders;
  }

  function verifyAccountPurchaseForProduct(accKey, revOrderId, p, systemOrders) {
    var cleanOrderId = String(revOrderId || '').trim();
    var accIdentity = String(accKey || '').replace(/^vlu_account_/, '').toLowerCase();

    var matchingAccountOrder = systemOrders.find(function (o) {
      if (!orderContainsProduct(o, p)) return false;
      var oCode = String(o.order_code || o.id || '').trim();
      if (cleanOrderId && cleanOrderId.toLowerCase() !== 'direct' && oCode === cleanOrderId) return true;
      if (o._ownerKey && o._ownerKey === accKey) return true;
      var oOwner = normalizeAccountIdentity(o.user_id || o.username || o.email || o.customerEmail || '');
      return Boolean(accIdentity && oOwner === accIdentity);
    });

    if (matchingAccountOrder) {
      return {
        verified: true,
        orderId: cleanOrderId || String(matchingAccountOrder.order_code || matchingAccountOrder.id || '')
      };
    }
    return { verified: false, orderId: '' };
  }

  function findMatchedOrderForCurrentUser(authCtx, p) {
    var systemOrders = collectSystemOrdersForVerification();
    var check = verifyAccountPurchaseForProduct(authCtx.accountKey, '', p, systemOrders);
    if (check.verified) return { id: check.orderId };
    return null;
  }

  function renderStarStripHtml(scoreVal, sizeClass) {
    var rounded = Math.max(0, Math.min(5, Math.round(Number(scoreVal) || 0)));
    var cls = sizeClass || 'h-4 w-4';
    var html = '';
    for (var i = 1; i <= 5; i++) {
      var fillCls = i <= rounded ? 'text-amber-400' : 'text-slate-200';
      html += '<svg class="' + cls + ' ' + fillCls + ' fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true"><use href="#i-star"/></svg>';
    }
    return html;
  }

  function collectProductReviews(p) {
    var collected = [];
    var seenKeys = {};
    var systemOrders = collectSystemOrdersForVerification();
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf('vlu_account_') !== 0) continue;
        var parsed = JSON.parse(localStorage.getItem(key) || '{}');
        if (!parsed || !Array.isArray(parsed.reviews)) continue;
        var profile = parsed.profile && typeof parsed.profile === 'object' ? parsed.profile : {};
        var authorFallback = profile.fullname || profile.username || profile.email || 'Khách hàng VLU';
        var avatar = profile.avatar || '';

        parsed.reviews.forEach(function (rev, idx) {
          if (!rev || !(Number(rev.rating) > 0) || !rev.comment) return;
          var revId = String(rev.id || '');
          var matchId = rev.productId === p.id || revId === p.id || revId.slice(-p.id.length - 1) === ':' + p.id;
          var matchName = rev.name && String(rev.name).trim().toLowerCase() === String(p.name).trim().toLowerCase();
          if (!matchId && !matchName) return;

          var dedupKey = key + '::' + (revId || idx);
          if (seenKeys[dedupKey]) return;
          seenKeys[dedupKey] = true;

          var ratingVal = Math.min(5, Math.max(1, Math.round(Number(rev.rating) || 5)));
          var purchaseCheck = verifyAccountPurchaseForProduct(key, rev.orderId, p, systemOrders);

          collected.push({
            id: revId || dedupKey,
            accountKey: key,
            reviewerName: rev.reviewerName || authorFallback,
            avatar: rev.avatar || avatar,
            rating: ratingVal,
            comment: String(rev.comment).trim(),
            tags: Array.isArray(rev.tags) ? rev.tags : [],
            image: rev.image && String(rev.image).trim() ? String(rev.image).trim() : '',
            createdAt: rev.createdAt || '',
            timestamp: rev.createdAt ? (new Date(rev.createdAt).getTime() || 0) : 0,
            isVerifiedBuyer: purchaseCheck.verified,
            verifiedOrderId: purchaseCheck.orderId
          });
        });
      }
    } catch (e) {}

    return collected;
  }

  function renderProductReviewsSection(p) {
    var collected = collectProductReviews(p);
    var counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    var sum = 0;
    var withImgCount = 0;
    var verifiedCount = 0;

    collected.forEach(function (r) {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      sum += r.rating;
      if (r.image) withImgCount += 1;
      if (r.isVerifiedBuyer) verifiedCount += 1;
    });

    var total = collected.length;
    var avgStr = total > 0 ? (sum / total).toFixed(1) : '0.0';

    // 1. Cập nhật dòng Meta đầu trang (#pdRatingMetaBtn)
    var metaStarsEl = document.getElementById('pdRatingStars');
    var ratingTextEl = document.getElementById('pdRatingText');
    if (metaStarsEl) {
      metaStarsEl.innerHTML = total > 0
        ? renderStarStripHtml(Number(avgStr), 'h-3.5 w-3.5')
        : '<svg class="h-3.5 w-3.5 text-slate-300 fill-current" viewBox="0 0 20 20"><use href="#i-star"/></svg>';
    }
    if (ratingTextEl) {
      ratingTextEl.textContent = total > 0
        ? (avgStr + '/5 · ' + total + ' đánh giá' + (verifiedCount > 0 ? ' (' + verifiedCount + ' đã mua)' : ''))
        : '0.0/5 · Chưa có đánh giá';
    }

    // 2. Cập nhật Bảng Tổng Quan (#pdReviewSummaryCard)
    var summaryBadgeEl = document.getElementById('pdReviewsSummaryBadge');
    var avgEl = document.getElementById('pdAvgScoreValue');
    var summaryStarsEl = document.getElementById('pdSummaryStars');
    var totalCountEl = document.getElementById('pdTotalReviewCount');
    var breakdownEl = document.getElementById('pdRatingBreakdown');

    if (summaryBadgeEl) {
      summaryBadgeEl.innerHTML = total > 0
        ? '<span class="text-amber-500">★</span> <span>' + avgStr + '/5 từ ' + total + ' đánh giá thực tế</span>'
        : '<span class="text-slate-500">Chưa có đánh giá thực tế</span>';
    }
    if (avgEl) avgEl.textContent = avgStr;
    if (summaryStarsEl) summaryStarsEl.innerHTML = renderStarStripHtml(total > 0 ? Number(avgStr) : 0, 'h-[18px] w-[18px] shrink-0');
    if (totalCountEl) {
      totalCountEl.textContent = total > 0
        ? (total + ' lượt đánh giá thực tế' + (verifiedCount ? ' · ' + verifiedCount + ' đã mua hàng' : ''))
        : 'Chưa có lượt đánh giá';
    }

    if (breakdownEl) {
      breakdownEl.innerHTML = [5, 4, 3, 2, 1].map(function (star) {
        var c = counts[star] || 0;
        var pct = total > 0 ? Math.round((c / total) * 100) : 0;
        return '<button type="button" class="pd-rating-bar-row" data-review-filter="' + star + '" title="Lọc đánh giá ' + star + ' sao">'
          + '<span class="w-11 text-left shrink-0 inline-flex items-center gap-1">' + star + ' <span class="text-amber-500">★</span></span>'
          + '<span class="pd-rating-bar-track"><span class="pd-rating-bar-fill block" style="width:' + pct + '%;"></span></span>'
          + '<span class="w-16 text-right text-slate-500 font-semibold shrink-0">' + pct + '% (' + c + ')</span>'
          + '</button>';
      }).join('');
    }

    // 3. Bộ lọc nhanh
    var filterBarEl = document.getElementById('pdReviewFilterBar');
    if (filterBarEl) {
      var filterDefs = [
        { key: 'all', label: 'Tất cả (' + total + ')' },
        { key: '5', label: '5 sao (' + counts[5] + ')' },
        { key: '4', label: '4 sao (' + counts[4] + ')' },
        { key: '3', label: '3 sao (' + counts[3] + ')' },
        { key: '2', label: '2 sao (' + counts[2] + ')' },
        { key: '1', label: '1 sao (' + counts[1] + ')' },
        { key: 'with-image', label: 'Có hình ảnh (' + withImgCount + ')' }
      ];
      filterBarEl.innerHTML = filterDefs.map(function (f) {
        var active = activeReviewFilter === f.key;
        return '<button type="button" class="pd-review-filter-pill' + (active ? ' is-active' : '') + '" data-review-filter="' + f.key + '" role="tab" aria-selected="' + (active ? 'true' : 'false') + '">'
          + escapeHtml(f.label)
          + '</button>';
      }).join('');
    }

    // 4. Lọc & Sắp xếp danh sách Review
    var filtered = collected.filter(function (r) {
      if (activeReviewFilter === 'all') return true;
      if (activeReviewFilter === 'with-image') return Boolean(r.image);
      var starTarget = parseInt(activeReviewFilter, 10);
      return !isNaN(starTarget) ? r.rating === starTarget : true;
    });

    filtered.sort(function (a, b) {
      if (activeReviewSort === 'highest') {
        if (b.rating !== a.rating) return b.rating - a.rating;
      }
      return b.timestamp - a.timestamp;
    });

    var reviewsListEl = document.getElementById('pdReviewsList');
    if (!reviewsListEl) return;

    if (total === 0) {
      reviewsListEl.innerHTML = '<div class="md:col-span-2 rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-7 text-center space-y-2">'
        + '<p class="text-sm font-extrabold text-slate-800">Chưa có đánh giá nào cho ' + escapeHtml(p.name) + '</p>'
        + '<p class="text-xs text-slate-500 max-w-lg mx-auto">Hãy là khách hàng đầu tiên chia sẻ trải nghiệm thực tế về sản phẩm này. Đánh giá được đồng bộ trực tiếp với tài khoản VLU và trang chủ.</p>'
        + '</div>';
      return;
    }

    if (filtered.length === 0) {
      reviewsListEl.innerHTML = '<div class="md:col-span-2 rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center space-y-2">'
        + '<p class="text-xs font-bold text-slate-600">Không có đánh giá nào khớp bộ lọc hiện tại.</p>'
        + '<button type="button" class="pd-review-filter-pill" data-review-filter="all">Xem tất cả đánh giá</button>'
        + '</div>';
      return;
    }

    reviewsListEl.innerHTML = filtered.map(function (r) {
      var avatarInner = r.avatar
        ? '<img src="' + escapeAttr(r.avatar) + '" alt="' + escapeAttr(r.reviewerName) + '" onerror="this.remove()">'
        : '<span>' + escapeHtml(getAuthorInitials(r.reviewerName)) + '</span>';

      var verifiedBadgeHtml = r.isVerifiedBuyer
        ? '<span class="pd-verified-buyer-badge" title="' + (r.verifiedOrderId ? 'Đơn hàng ' + escapeAttr(r.verifiedOrderId) : 'Xác thực đơn hàng VLU') + '">'
            + '<svg class="h-3 w-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
            + '<span>Đã mua hàng tại VLU</span>'
          + '</span>'
        : '<span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">Khách hàng VLU</span>';

      return '<article class="pd-review-card">'
        + '<div class="flex items-start justify-between gap-3">'
        +   '<div class="flex items-center gap-3 min-w-0">'
        +     '<div class="pd-review-avatar">' + avatarInner + '</div>'
        +     '<div class="min-w-0">'
        +       '<div class="flex flex-wrap items-center gap-1.5">'
        +         '<strong class="text-sm font-extrabold text-slate-900 truncate">' + escapeHtml(r.reviewerName) + '</strong>'
        +         verifiedBadgeHtml
        +       '</div>'
        +       '<div class="mt-1 flex items-center gap-2">'
        +         '<span class="inline-flex items-center gap-0.5">' + renderStarStripHtml(r.rating, 'h-3.5 w-3.5') + '</span>'
        +         '<span class="text-[11px] font-semibold text-slate-400">· ' + escapeHtml(formatDisplayDate(r.createdAt)) + '</span>'
        +       '</div>'
        +     '</div>'
        +   '</div>'
        + '</div>'
        + '<p class="text-xs sm:text-[13px] text-slate-700 leading-relaxed">' + escapeHtml(r.comment) + '</p>'
        + (r.tags.length ? '<div class="flex flex-wrap gap-1.5">' + r.tags.slice(0, 4).map(function (t) {
            return '<span class="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">' + escapeHtml(t) + '</span>';
          }).join('') + '</div>' : '')
        + (r.image ? '<div><img src="' + escapeAttr(r.image) + '" alt="Ảnh đánh giá thực tế của ' + escapeAttr(r.reviewerName) + '" class="pd-review-photo" data-zoom-review-img="1" loading="lazy"></div>' : '')
        + '</article>';
    }).join('');
  }

  function updateStarPickerUI(val) {
    var safeVal = Math.max(1, Math.min(5, Number(val) || 5));
    var hiddenInput = document.getElementById('pdReviewRatingInput');
    var labelEl = document.getElementById('pdStarPickerLabel');
    if (hiddenInput) hiddenInput.value = String(safeVal);
    if (labelEl) labelEl.textContent = STAR_FEEDBACK_LABELS[safeVal] || STAR_FEEDBACK_LABELS[5];
    document.querySelectorAll('#pdStarPicker .pd-star-pick-btn').forEach(function (btn) {
      var starNum = parseInt(btn.getAttribute('data-star-val'), 10) || 0;
      btn.classList.toggle('is-active', starNum <= safeVal);
    });
  }

  function openReviewModal() {
    var modal = document.getElementById('pdReviewModal');
    if (!modal) return;
    var ctx = getAuthContext();
    var subtitleEl = document.getElementById('pdReviewModalSubtitle');
    var authorInput = document.getElementById('pdReviewAuthorInput');
    var verifyHint = document.getElementById('pdReviewVerifyHint');
    if (subtitleEl) subtitleEl.textContent = product.name + ' (' + product.brand + ')';
    if (authorInput) {
      authorInput.value = ctx.isLoggedIn ? ctx.displayName : (authorInput.value || '');
    }
    if (verifyHint) {
      var matchedOrder = findMatchedOrderForCurrentUser(ctx, product);
      if (matchedOrder) {
        verifyHint.className = 'w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-[11px] font-bold text-emerald-700';
        verifyHint.textContent = 'Đã đối chiếu đơn hàng ' + matchedOrder.id + ' – Sẽ gắn huy hiệu "Đã mua hàng tại VLU".';
      } else {
        verifyHint.className = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-[11px] font-semibold text-slate-600';
        verifyHint.textContent = 'Đánh giá được đồng bộ tự động với Tài khoản VLU và Trang chủ.';
      }
    }

    updateStarPickerUI(5);
    reviewModalOpen = true;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
  }

  function closeReviewModal() {
    var modal = document.getElementById('pdReviewModal');
    if (!modal || !reviewModalOpen) return;
    reviewModalOpen = false;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      if (!reviewModalOpen) modal.classList.add('hidden');
    }, 220);
  }

  function compressAndReadReviewImage(file, callback) {
    if (!file || !/^image\/(?:png|jpeg|webp)$/i.test(file.type || '')) {
      showToast('Vui lòng chọn ảnh định dạng PNG, JPG hoặc WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ảnh tải lên tối đa 5 MB.');
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      var dataUrl = ev && ev.target ? ev.target.result : '';
      if (!dataUrl) return;
      if (file.size <= 450 * 1024) {
        callback(dataUrl);
        return;
      }
      var img = new Image();
      img.onload = function () {
        var maxSide = 820;
        var scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round((img.width || 1) * scale));
        canvas.height = Math.max(1, Math.round((img.height || 1) * scale));
        var c2d = canvas.getContext('2d');
        if (!c2d) {
          callback(dataUrl);
          return;
        }
        c2d.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          callback(canvas.toDataURL('image/jpeg', 0.82));
        } catch (err) {
          callback(dataUrl);
        }
      };
      img.onerror = function () { callback(dataUrl); };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  function openReviewImagePreviewModal(src, caption) {
    var modal = document.getElementById('pdPolicyModal');
    if (!modal || !src) return;
    var eyebrowEl = document.getElementById('pdPolicyModalEyebrow');
    var titleEl = document.getElementById('pdPolicyModalTitle');
    var bodyEl = document.getElementById('pdPolicyModalBody');
    if (eyebrowEl) eyebrowEl.textContent = 'Hình ảnh thực tế từ khách hàng';
    if (titleEl) titleEl.textContent = caption || product.name;
    if (bodyEl) {
      bodyEl.innerHTML = '<div class="rounded-2xl bg-slate-50 border border-slate-200 p-3 flex justify-center">'
        + '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(caption || product.name) + '" class="max-h-[55vh] w-auto rounded-xl object-contain">'
        + '</div>';
    }
    policyModalOpen = true;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
  }

  // ---------- Q&A & FAQ THEO DANH MỤC THỰC TẾ ----------
  function getQaStorageKey(pid) {
    return 'vlu_product_qa_' + String(pid || 'default');
  }

  function readQaList(pid) {
    try {
      var parsed = JSON.parse(localStorage.getItem(getQaStorageKey(pid)) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveQaList(pid, list) {
    try {
      localStorage.setItem(getQaStorageKey(pid), JSON.stringify(list));
      localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
    } catch (e) {
      showToast('Không thể lưu câu hỏi vào bộ nhớ trình duyệt.');
    }
  }

  function buildDynamicFaqItems(p) {
    var cat = p.category || 'dien-thoai';
    var isApple = String(p.brand || '').toLowerCase() === 'apple';
    var boxAccessories = 'Thân máy nguyên seal chính hãng, cáp sạc và tài liệu hướng dẫn sử dụng chuẩn ' + p.brand + '.';
    if (cat === 'dien-thoai') {
      boxAccessories = isApple
        ? 'Hộp nguyên seal chuẩn VN/A gồm thân máy ' + p.name + ', cáp sạc nhanh USB-C bện dù, que lấy SIM (với bản khay SIM) và sách hướng dẫn bảo hành chính hãng Apple.'
        : 'Hộp nguyên seal chính hãng gồm thân máy ' + p.name + ', cáp sạc nhanh USB-C (kèm củ sạc theo chuẩn phân phối từng dòng máy), que lấy SIM và sách hướng dẫn.';
    } else if (cat === 'laptop') {
      boxAccessories = 'Thùng máy nguyên seal chính hãng gồm Laptop ' + p.name + ', bộ nguồn Adapter sạc nhanh công suất tiêu chuẩn theo máy, dây nguồn và tài liệu hướng dẫn bảo hành.';
    } else if (cat === 'ipad') {
      boxAccessories = 'Hộp nguyên seal chính hãng gồm máy tính bảng ' + p.name + ', cáp sạc USB-C, tài liệu hướng dẫn VLU/Hãng (bút cảm ứng & bàn phím rời được hỗ trợ mua kèm ưu đãi tại cửa hàng).';
    } else if (cat === 'tai-nghe') {
      boxAccessories = 'Hộp nguyên seal chính hãng gồm tai nghe ' + p.name + ', hộp sạc (hoặc túi bảo vệ dòng chụp tai), cáp sạc USB-C, bộ đệm tai đa kích cỡ và sách hướng dẫn.';
    } else if (cat === 'loa') {
      boxAccessories = 'Thùng loa nguyên seal chính hãng gồm loa ' + p.name + ', dây nguồn / cáp sạc chính hãng theo cấu hình loa và phiếu bảo hành ủy quyền.';
    } else if (cat === 'dong-ho-dien-tu') {
      boxAccessories = 'Hộp nguyên seal chính hãng gồm mặt đồng hồ ' + p.name + ', dây đeo tiêu chuẩn đi kèm, cáp sạc nhanh nam châm và sách hướng dẫn.';
    }

    var colorNames = (p.colors || []).map(function (c) { return c && c.name; }).filter(Boolean);
    var variantNames = (p.variants || []).map(function (v) { return v && v.label; }).filter(Boolean);
    var priceVal = Number(p.basePrice) || 0;
    var monthlyStr = priceVal > 0 ? formatVND(Math.round(priceVal / 12)) + '/tháng' : 'hồ sơ trả góp 0% ngay khi có giá mở bán';

    return [
      {
        q: 'Bộ sản phẩm & phụ kiện trong hộp ' + p.name + ' gồm những gì?',
        a: boxAccessories
      },
      {
        q: 'Thời hạn bảo hành chính hãng cho ' + p.name + ' là bao lâu?',
        a: 'Sản phẩm được bảo hành chính hãng 12–24 tháng theo tiêu chuẩn của ' + p.brand + ' Việt Nam. VLU FLAGSHIP STORE tiếp nhận và gửi bảo hành hộ miễn phí tại tất cả 5 chi nhánh.'
      },
      {
        q: 'Chính sách đổi trả 1 đổi 1 của VLU áp dụng như thế nào?',
        a: 'VLU cam kết 1 đổi 1 miễn phí trong vòng 30 ngày đầu tiên nếu phát sinh lỗi phần cứng từ nhà sản xuất (hỗ trợ kỹ thuật kiểm tra và xử lý lấy ngay tại quầy).'
      },
      {
        q: p.name + ' có hỗ trợ mua trả góp 0% và thu cũ đổi mới không?',
        a: priceVal > 0
          ? 'Có. Bạn có thể trả góp 0% lãi suất qua thẻ tín dụng kỳ hạn 6/9/12 tháng hoặc hồ sơ duyệt 5 phút, chỉ từ ' + monthlyStr + ', đồng thời áp dụng thu cũ đổi mới trợ giá trực tiếp.'
          : 'Sản phẩm hỗ trợ đăng ký nhận thông báo giá mở bán kèm chính sách trả góp 0% và chương trình thu cũ đổi mới ưu đãi của VLU Flagship Store.'
      },
      {
        q: p.name + ' hiện đang có những phiên bản màu sắc & cấu hình nào?',
        a: (colorNames.length ? 'Màu sắc hiện có: ' + colorNames.join(', ') + '. ' : '')
          + (variantNames.length ? 'Phiên bản / Cấu hình: ' + variantNames.join(', ') + '.' : 'Phiên bản tiêu chuẩn chính hãng nguyên seal.')
      }
    ];
  }

  function renderQaSection(p) {
    var ctx = getAuthContext();
    var prodNameEl = document.getElementById('pdQaProductName');
    var authorInput = document.getElementById('pdQaAuthorInput');
    var countBadge = document.getElementById('pdQaCountBadge');
    var listEl = document.getElementById('pdQaList');
    var faqEl = document.getElementById('pdFaqAccordion');

    if (prodNameEl) prodNameEl.textContent = p.name;
    if (authorInput && !authorInput.value.trim() && ctx.isLoggedIn) {
      authorInput.value = ctx.displayName;
    }

    var qaItems = readQaList(p.id);
    qaItems.sort(function (a, b) {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    if (countBadge) countBadge.textContent = qaItems.length + ' câu hỏi';

    if (listEl) {
      if (!qaItems.length) {
        listEl.innerHTML = '<div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-xs text-slate-500">'
          + 'Chưa có câu hỏi nào cho <strong>' + escapeHtml(p.name) + '</strong>. Hãy gửi câu hỏi ở khung trên để đội ngũ chuyên viên VLU Flagship Store giải đáp nhanh nhất.'
          + '</div>';
      } else {
        listEl.innerHTML = qaItems.map(function (q) {
          var answerHtml = '';
          if (q.answer && q.answer.text) {
            answerHtml = '<div class="pd-qa-answer-box">'
              + '<div class="flex flex-wrap items-center justify-between gap-2">'
              +   '<span class="inline-flex items-center gap-1.5 text-xs font-black text-brand">'
              +     '<span class="inline-grid h-5 w-5 place-items-center rounded-md bg-brand text-[10px] font-black text-white">V</span>'
              +     '<span>VLU Flagship Store · Quản trị viên</span>'
              +   '</span>'
              +   '<span class="text-[11px] font-semibold text-slate-400">' + escapeHtml(formatDisplayDate(q.answer.answeredAt)) + '</span>'
              + '</div>'
              + '<p class="mt-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed">' + escapeHtml(q.answer.text) + '</p>'
              + '</div>';
          } else if (ctx.isAdmin) {
            answerHtml = '<form class="pd-admin-reply-box pd-admin-reply-form space-y-2.5" data-qa-reply-id="' + escapeAttr(q.id) + '">'
              + '<div class="flex items-center justify-between gap-2">'
              +   '<label class="text-xs font-extrabold text-brand">Phản hồi câu hỏi này (Quản trị viên)</label>'
              +   '<span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role Admin</span>'
              + '</div>'
              + '<textarea name="adminReplyText" rows="2" minlength="5" required placeholder="Nhập câu trả lời chính thức từ VLU Flagship Store · Quản trị viên..." class="w-full rounded-xl border border-brand/25 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-brand focus:outline-none"></textarea>'
              + '<div class="flex justify-end">'
              +   '<button type="submit" class="rounded-full bg-brand px-4 py-1.5 text-xs font-extrabold text-white hover:bg-brand-dark transition cursor-pointer">Gửi phản hồi</button>'
              + '</div>'
              + '</form>';
          } else {
            answerHtml = '<p class="mt-2.5 text-[11px] font-semibold text-slate-400 italic">Đang chờ chuyên viên VLU Flagship Store phản hồi...</p>';
          }

          return '<article class="pd-qa-card">'
            + '<div class="flex flex-wrap items-center justify-between gap-2">'
            +   '<div class="flex items-center gap-2.5 min-w-0">'
            +     '<span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-extrabold text-white">' + escapeHtml(getAuthorInitials(q.authorName)) + '</span>'
            +     '<div class="min-w-0">'
            +       '<p class="text-xs font-extrabold text-slate-900 truncate">' + escapeHtml(q.authorName || 'Khách hàng VLU') + '</p>'
            +       '<p class="text-[11px] font-semibold text-slate-400">' + escapeHtml(formatDisplayDate(q.createdAt)) + '</p>'
            +     '</div>'
            +   '</div>'
            +   '<span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-700">' + escapeHtml(q.topic || 'Tư vấn sản phẩm') + '</span>'
            + '</div>'
            + '<p class="mt-3 text-sm font-bold text-slate-900 leading-snug">' + escapeHtml(q.question) + '</p>'
            + answerHtml
            + '</article>';
        }).join('');
      }
    }

    if (faqEl) {
      var faqs = buildDynamicFaqItems(p);
      faqEl.innerHTML = faqs.map(function (item, idx) {
        var isFirst = idx === 0;
        return '<div class="pd-faq-item' + (isFirst ? ' is-open' : '') + '">'
          + '<button type="button" class="pd-faq-trigger" data-faq-trigger="1" aria-expanded="' + (isFirst ? 'true' : 'false') + '">'
          +   '<span>' + escapeHtml(item.q) + '</span>'
          +   '<svg class="pd-faq-chevron" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>'
          + '</button>'
          + '<div class="pd-faq-panel"><div class="pd-faq-panel-inner"><p class="pd-faq-answer-text">' + escapeHtml(item.a) + '</p></div></div>'
          + '</div>';
      }).join('');
    }
  }

  // ---------- UNIFIED HOME PRODUCT CARD + RELATED + RECENTLY VIEWED CAROUSEL ----------
  function getAccountWishlistIds() {
    var ctx = getAuthContext();
    var arr = ctx.accountData && Array.isArray(ctx.accountData.wishlist) ? ctx.accountData.wishlist : [];
    return arr;
  }

  function collectCardReviewStats(item) {
    var totalScore = 0;
    var count = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf('vlu_account_') !== 0) continue;
        var parsed = JSON.parse(localStorage.getItem(key) || '{}');
        if (!parsed || !Array.isArray(parsed.reviews)) continue;
        parsed.reviews.forEach(function (rev) {
          var revId = String(rev.id || '');
          var matchesId = rev.productId === item.id || revId === item.id || revId.slice(-item.id.length - 1) === ':' + item.id;
          var matchesName = rev.name && String(rev.name).trim().toLowerCase() === String(item.name).trim().toLowerCase();
          if ((matchesId || matchesName) && Number(rev.rating) > 0) {
            totalScore += Math.min(5, Math.max(1, Number(rev.rating)));
            count += 1;
          }
        });
      }
    } catch (e) {}
    if (count > 0) return { avg: (totalScore / count).toFixed(1), count: count, hasRating: true };
    if (Number(item.rating) > 0 && Number(item.reviewCount) > 0) {
      return { avg: Number(item.rating).toFixed(1), count: Number(item.reviewCount), hasRating: true };
    }
    return { avg: null, count: 0, hasRating: false };
  }

  function buildUnifiedProductCardHtml(item, wishlistIds, idx) {
    if (!item || !item.id) return '';
    var rawImg = item.image || (item.colors && item.colors[0] && (item.colors[0].image || item.colors[0].img));
    var image = resolveImgUrl(rawImg, item.category || 'dien-thoai');
    var placeholder = 'frontend/assets/images/placeholders/' + (item.category || 'phone') + '.svg';
    var href = 'product-detail.html?id=' + encodeURIComponent(item.id) + '&name=' + encodeURIComponent(item.name) + '&cat=' + encodeURIComponent(item.category || 'dien-thoai');
    var basePrice = Number(item.basePrice) || 0;
    var oldPrice = Number(item.oldPrice) || 0;
    var hasPrice = basePrice > 0;
    var hasDiscount = hasPrice && oldPrice > basePrice;
    var discountPct = hasDiscount ? Math.max(1, Math.round(((oldPrice - basePrice) / oldPrice) * 100)) : 0;
    var isWished = Array.isArray(wishlistIds) && wishlistIds.indexOf(item.id) !== -1;

    var badgeHtml = hasDiscount
      ? '<span class="product-badge-sale">SALE</span>'
      : '<span class="product-badge-new">NEW</span>';

    var colorsList = Array.isArray(item.colors) ? item.colors : [];
    var swatchesHtml = '';
    if (colorsList.length > 1) {
      var visibleColors = colorsList.slice(0, 4);
      var extraColors = colorsList.length - visibleColors.length;
      swatchesHtml = '<div class="card-color-swatches" role="group" aria-label="Màu sắc ' + escapeAttr(item.name) + '">'
        + visibleColors.map(function (c, cIdx) {
            var cRaw = (c && (c.image || c.img)) || rawImg;
            var cResolved = resolveImgUrl(cRaw, item.category || 'dien-thoai');
            var cName = (c && c.name) || ('Màu ' + (cIdx + 1));
            var cHex = (c && c.hex) || '#334155';
            return '<button type="button" class="card-color-swatch' + (cIdx === 0 ? ' is-active' : '') + '" data-card-swatch="' + cIdx + '" data-img="' + escapeAttr(cResolved) + '" data-color-name="' + escapeAttr(cName) + '" title="' + escapeAttr(cName) + '" aria-label="Xem màu ' + escapeAttr(cName) + '" style="background:' + escapeAttr(cHex) + ';"></button>';
          }).join('')
        + (extraColors > 0 ? '<span class="card-color-more">+' + extraColors + '</span>' : '')
        + '</div>';
    }

    var ratingStats = collectCardReviewStats(item);
    var ratingMarkup = ratingStats.hasRating
      ? '<div class="mt-2 flex items-center gap-1.5 text-xs"><svg class="h-3.5 w-3.5 text-amber-400 fill-current shrink-0" viewBox="0 0 20 20"><use href="#i-star"/></svg><span class="font-bold text-slate-800">' + ratingStats.avg + '</span><span class="text-slate-400">(' + ratingStats.count + ' đánh giá)</span></div>'
      : '<div class="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><svg class="h-3.5 w-3.5 text-amber-400/80 fill-current shrink-0" viewBox="0 0 20 20"><use href="#i-star"/></svg><span>Chính hãng VLU · VN/A</span></div>';

    return '<article class="product-card group stagger-reveal-item is-revealed" data-product-card="' + escapeAttr(item.id) + '" data-selected-color-idx="0" style="--stagger-idx:' + Math.min(idx || 0, 11) + ';">'
      + '<div class="product-img-box is-loading">'
      +   '<div class="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1">'
      +     badgeHtml
      +     (hasDiscount ? '<span class="product-badge-discount">-' + discountPct + '%</span>' : '')
      +   '</div>'
      +   '<button type="button" data-wish data-id="' + escapeAttr(item.id) + '" data-tooltip="' + (isWished ? 'Đã yêu thích' : 'Lưu yêu thích') + '" aria-pressed="' + String(isWished) + '" aria-label="Yêu thích ' + escapeAttr(item.name) + '" class="product-wish-btn absolute right-2.5 top-2.5">'
      +     '<svg class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#i-heart"/></svg>'
      +   '</button>'
      +   '<img src="' + escapeAttr(image) + '" alt="' + escapeAttr(item.name) + '" loading="lazy" class="product-img" onerror="this.onerror=null;this.src=\'' + escapeAttr(placeholder) + '\';">'
      +   '<button type="button" data-quickview data-id="' + escapeAttr(item.id) + '" data-tooltip="Xem nhanh cấu hình" aria-label="Xem nhanh ' + escapeAttr(item.name) + '" class="quick-view-btn">'
      +     '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#i-eye"/></svg>'
      +     '<span>Xem nhanh</span>'
      +   '</button>'
      + '</div>'
      + '<div class="product-card-body">'
      +   '<div class="flex items-center justify-between gap-2">'
      +     '<p class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">' + escapeHtml(item.brand || 'VLU') + '</p>'
      +     '<span class="text-[10px] font-bold text-emerald-600">Chính hãng</span>'
      +   '</div>'
      +   '<h3 class="product-card-title mt-1.5 text-sm font-extrabold leading-snug text-slate-900 transition group-hover:text-brand sm:text-base">'
      +     '<a href="' + href + '" class="focus:outline-none">' + escapeHtml(item.name) + '</a>'
      +   '</h3>'
      +   '<p class="product-card-desc mt-1 text-xs leading-relaxed text-slate-500">' + escapeHtml(item.tagline || 'Sản phẩm chính hãng nguyên seal tại VLU FLAGSHIP STORE.') + '</p>'
      +   swatchesHtml
      +   ratingMarkup
      +   '<div class="mt-auto pt-3 border-t border-slate-100/80">'
      +     '<div class="flex flex-wrap items-baseline gap-1.5">'
      +       '<p class="product-price-current text-base font-extrabold text-brand sm:text-lg">' + (hasPrice ? formatVND(basePrice) : 'Giá liên hệ') + '</p>'
      +       (hasDiscount ? '<p class="text-xs font-semibold text-slate-400 line-through">' + formatVND(oldPrice) + '</p>' : '')
      +     '</div>'
      +     '<div class="mt-2.5 flex items-center gap-2">'
      +       (hasPrice
                ? '<button type="button" data-add data-id="' + escapeAttr(item.id) + '" data-name="' + escapeAttr(item.name) + '" data-price="' + basePrice + '" data-tooltip="Thêm vào giỏ hàng" class="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-brand active:scale-[0.98]">'
                  + '<svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2"><use href="#i-bag"/></svg>'
                  + '<span>Thêm vào giỏ</span>'
                  + '</button>'
                  + '<a href="' + href + '" class="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:border-brand hover:text-brand" title="Xem chi tiết ' + escapeAttr(item.name) + '">Chi tiết</a>'
                : '<a href="' + href + '" class="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-800 transition hover:bg-brand hover:text-white">'
                  + '<span>Xem chi tiết</span>'
                  + '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5"><use href="#i-right"/></svg>'
                  + '</a>')
      +     '</div>'
      +   '</div>'
      + '</div>'
      + '</article>';
  }

  function hydrateDynamicCardImages(scopeEl) {
    if (!scopeEl) return;
    scopeEl.querySelectorAll('.product-img').forEach(function (img) {
      var wrap = img.closest('.product-img-box');
      function done() {
        img.classList.add('is-loaded');
        if (wrap) {
          wrap.classList.remove('is-loading');
          wrap.classList.add('is-loaded');
        }
      }
      if (img.complete && img.naturalWidth > 0) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
  }

  function extractSeriesPrefix(p) {
    var raw = String((p && p.name) || '').toLowerCase().replace(/\s+/g, ' ').trim();
    var patterns = [
      /^(iphone\s+\d+)/,
      /^(samsung\s+galaxy\s+[a-z]+\d*)/,
      /^(galaxy\s+[a-z]+\d*)/,
      /^(macbook\s+(?:pro|air|neo))/,
      /^(ipad\s+(?:pro|air|mini)?)/,
      /^(apple\s+watch\s+(?:ultra|series|se)?)/,
      /^(airpods\s+(?:pro|max)?)/,
      /^(marshall\s+\w+)/,
      /^(jbl\s+\w+)/,
      /^(sony\s+\w+)/
    ];
    for (var i = 0; i < patterns.length; i++) {
      var m = raw.match(patterns[i]);
      if (m && m[1]) return m[1];
    }
    var words = raw.split(' ').slice(0, 2).join(' ');
    return words;
  }

  function getRelatedProducts(p, tabKey) {
    var all = Array.isArray(window.VLU_PRODUCTS) ? window.VLU_PRODUCTS : [];
    var pool = [];
    var seen = {};

    all.forEach(function (item) {
      if (!item || !item.id || item.id === p.id || seen[item.id]) return;
      if (String(item.status || 'active').toLowerCase() === 'inactive') return;
      seen[item.id] = true;
      pool.push(item);
    });

    if (tabKey === 'similar-price') {
      var targetPrice = Number(p.basePrice) || Number(p.oldPrice) || 0;
      var priced = pool.filter(function (it) { return Number(it.basePrice) > 0; });
      if (targetPrice > 0) {
        priced.sort(function (a, b) {
          var diffA = Math.abs(Number(a.basePrice) - targetPrice);
          var diffB = Math.abs(Number(b.basePrice) - targetPrice);
          var sameCatA = a.category === p.category ? -500000 : 0;
          var sameCatB = b.category === p.category ? -500000 : 0;
          return (diffA + sameCatA) - (diffB + sameCatB);
        });
        return priced.slice(0, 8);
      }
      var catFlagship = priced.filter(function (it) { return it.category === p.category; })
        .sort(function (a, b) { return Number(b.basePrice) - Number(a.basePrice); });
      return (catFlagship.length ? catFlagship : priced).slice(0, 8);
    }

    if (tabKey === 'same-line') {
      var series = extractSeriesPrefix(p);
      var groupSlug = String(p.menuGroup || '').toLowerCase();
      var siblings = pool.filter(function (it) {
        var itName = String(it.name || '').toLowerCase();
        var sameSeries = series && itName.indexOf(series) === 0;
        var sameMenuGroup = groupSlug && String(it.menuGroup || '').toLowerCase() === groupSlug;
        return (it.category === p.category) && (sameSeries || sameMenuGroup);
      });
      if (siblings.length < 4) {
        var sibIds = {};
        siblings.forEach(function (s) { sibIds[s.id] = true; });
        pool.forEach(function (it) {
          if (siblings.length >= 8 || sibIds[it.id]) return;
          if (it.category === p.category && it.brand === p.brand) {
            sibIds[it.id] = true;
            siblings.push(it);
          }
        });
      }
      return siblings.slice(0, 8);
    }

    // Mặc định: Cùng danh mục & Thương hiệu
    var exact = pool.filter(function (it) {
      return it.category === p.category && it.brand === p.brand;
    });
    if (exact.length < 4) {
      var exactIds = {};
      exact.forEach(function (e) { exactIds[e.id] = true; });
      pool.forEach(function (it) {
        if (exact.length >= 8 || exactIds[it.id]) return;
        if (it.category === p.category) {
          exactIds[it.id] = true;
          exact.push(it);
        }
      });
    }
    return exact.slice(0, 8);
  }

  function renderRelatedProductsSection(p, tabKey) {
    activeRelatedTab = tabKey || activeRelatedTab || 'category-brand';
    var viewAllEl = document.getElementById('pdRelatedViewAllLink');
    if (viewAllEl) {
      viewAllEl.href = 'category.html?cat=' + encodeURIComponent(p.category || 'dien-thoai');
    }

    document.querySelectorAll('#pdRelatedTabs .pd-related-tab').forEach(function (btn) {
      var isAct = btn.getAttribute('data-related-tab') === activeRelatedTab;
      btn.classList.toggle('is-active', isAct);
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    var gridEl = document.getElementById('pdRelatedGrid');
    if (!gridEl) return;

    var items = getRelatedProducts(p, activeRelatedTab);
    if (!items.length) {
      gridEl.innerHTML = '<div class="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500">Chưa có sản phẩm phù hợp trong nhóm gợi ý này. Bạn có thể chuyển sang tab khác hoặc nhấn "Xem tất cả".</div>';
      return;
    }

    var wishlistIds = getAccountWishlistIds();
    gridEl.classList.remove('pd-grid-fade-in');
    void gridEl.offsetWidth;
    gridEl.innerHTML = items.map(function (item, idx) {
      return buildUnifiedProductCardHtml(item, wishlistIds, idx);
    }).join('');
    gridEl.classList.add('pd-grid-fade-in');
    hydrateDynamicCardImages(gridEl);
  }

  function updateRecentCarouselNavState() {
    var track = document.getElementById('pdRecentTrack');
    var prevBtn = document.getElementById('pdRecentPrevBtn');
    var nextBtn = document.getElementById('pdRecentNextBtn');
    if (!track || !prevBtn || !nextBtn) return;
    var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = maxScroll <= 4 || track.scrollLeft >= maxScroll - 4;
  }

  function renderRecentlyViewedSection(p) {
    var sectionEl = document.getElementById('pdRecentlyViewedSection');
    var trackEl = document.getElementById('pdRecentTrack');
    if (!sectionEl || !trackEl) return;

    var ctx = getAuthContext();
    if (ctx.privateHistory) {
      sectionEl.classList.add('hidden');
      trackEl.innerHTML = '';
      return;
    }

    var mergedIds = readMergedRecentlyViewedIds(ctx.userId).filter(function (id) {
      return id && id !== p.id;
    });

    var validProducts = [];
    mergedIds.forEach(function (id) {
      var found = (window.VLU_CATALOG && window.VLU_CATALOG[id]) || (window.VLU_FIND_PRODUCT ? window.VLU_FIND_PRODUCT(id) : null);
      if (found && found.id !== p.id && !validProducts.some(function (x) { return x.id === found.id; })) {
        validProducts.push(found);
      }
    });

    if (!validProducts.length) {
      sectionEl.classList.add('hidden');
      trackEl.innerHTML = '';
      return;
    }

    var wishlistIds = getAccountWishlistIds();
    sectionEl.classList.remove('hidden');
    trackEl.innerHTML = validProducts.slice(0, 12).map(function (item, idx) {
      return '<div class="pd-recent-slide">' + buildUnifiedProductCardHtml(item, wishlistIds, idx) + '</div>';
    }).join('');
    hydrateDynamicCardImages(trackEl);
    requestAnimationFrame(updateRecentCarouselNavState);
  }

  function updatePricingStockAndSkuUI(animatePrice) {
    var delta = Number(currentVariantObj && currentVariantObj.delta) || 0;
    var activePrice = Number(product.basePrice) > 0 ? (Number(product.basePrice) + delta) : 0;
    var activeOldPrice = (product.oldPrice && Number(product.oldPrice) > Number(product.basePrice) && activePrice > 0)
      ? (Number(product.oldPrice) + delta)
      : 0;
    currentPrice = activePrice;

    var availability = resolveAvailability(product, currentColorObj, currentVariantObj, activePrice);
    var skuText = computeNormalizedSku(product, currentColorObj, currentVariantObj);

    var metaSkuEl = document.getElementById('pdMetaSku');
    var tableSkuEl = document.getElementById('pdSku');
    if (metaSkuEl) metaSkuEl.textContent = skuText;
    if (tableSkuEl) tableSkuEl.textContent = skuText;

    var stockBadgeEl = document.getElementById('pdStockBadge');
    if (stockBadgeEl) {
      if (availability.state === 'out_of_stock') {
        stockBadgeEl.className = 'inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200';
        stockBadgeEl.innerHTML = '<span class="h-2 w-2 rounded-full bg-red-600"></span>' + escapeHtml(availability.badgeText);
      } else if (availability.state === 'coming_soon' || availability.state === 'low_stock') {
        stockBadgeEl.className = 'inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200';
        stockBadgeEl.innerHTML = '<span class="h-2 w-2 rounded-full bg-amber-500"></span>' + escapeHtml(availability.badgeText);
      } else {
        stockBadgeEl.className = 'inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200';
        stockBadgeEl.innerHTML = '<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span></span>' + escapeHtml(availability.badgeText);
      }
    }

    var colorStockNote = document.getElementById('pdColorStockNote');
    if (colorStockNote) {
      colorStockNote.textContent = availability.colorNote;
      colorStockNote.className = 'text-[11px] font-bold ' + (availability.purchasable ? (availability.state === 'low_stock' ? 'text-amber-600' : 'text-emerald-600') : 'text-red-600');
    }

    // Clamp Quantity selector
    var maxQty = availability.maxQty || 1;
    if (currentQuantity > maxQty) currentQuantity = maxQty;
    if (currentQuantity < 1) currentQuantity = 1;
    var qtyInput = document.getElementById('pdQtyInput');
    var qtyMinus = document.getElementById('qtyMinusBtn');
    var qtyPlus = document.getElementById('qtyPlusBtn');
    var stockLimitHint = document.getElementById('pdStockLimitHint');
    if (qtyInput) qtyInput.value = availability.purchasable ? String(currentQuantity) : '0';
    if (qtyMinus) qtyMinus.disabled = !availability.purchasable || currentQuantity <= 1;
    if (qtyPlus) qtyPlus.disabled = !availability.purchasable || currentQuantity >= maxQty;
    if (stockLimitHint) stockLimitHint.textContent = availability.hintText;

    // Lock / Unlock Action Buttons
    var unavailNotice = document.getElementById('pdUnavailableNotice');
    var unavailText = document.getElementById('pdUnavailableText');
    if (unavailNotice) unavailNotice.classList.toggle('hidden', availability.purchasable);
    if (unavailText && !availability.purchasable) unavailText.textContent = availability.unavailableText;

    ['addToCartBtn', 'buyNowBtn'].forEach(function (id) {
      var button = document.getElementById(id);
      if (!button) return;
      button.disabled = !availability.purchasable;
      button.classList.toggle('opacity-50', !availability.purchasable);
      button.classList.toggle('cursor-not-allowed', !availability.purchasable);
    });

    // Price, Savings & Installment with smooth animation
    var priceEl = document.getElementById('productPrice');
    var oldPriceEl = document.getElementById('oldPrice');
    var discountEl = document.getElementById('discountBadge');
    var savingsEl = document.getElementById('savingsBadge');
    var installmentEl = document.getElementById('pdInstallment');

    function applyPriceValues() {
      var hasPrice = activePrice > 0;
      if (priceEl) priceEl.textContent = hasPrice ? formatVND(activePrice) : 'Giá liên hệ';
      if (oldPriceEl) {
        if (hasPrice && activeOldPrice > activePrice) {
          oldPriceEl.textContent = formatVND(activeOldPrice);
          oldPriceEl.classList.remove('hidden');
        } else {
          oldPriceEl.classList.add('hidden');
        }
      }
      if (discountEl) {
        var dStr = (currentVariantObj && currentVariantObj.discount) || '';
        if (!dStr && hasPrice && activeOldPrice > activePrice) {
          dStr = '-' + Math.max(1, Math.round((1 - activePrice / activeOldPrice) * 100)) + '%';
        }
        if (hasPrice && dStr) {
          discountEl.textContent = dStr;
          discountEl.classList.remove('hidden');
        } else {
          discountEl.classList.add('hidden');
        }
      }
      if (savingsEl) {
        if (hasPrice && activeOldPrice > activePrice) {
          savingsEl.textContent = 'Tiết kiệm ' + formatVND(activeOldPrice - activePrice);
          savingsEl.classList.remove('hidden');
        } else {
          savingsEl.classList.add('hidden');
        }
      }
      if (installmentEl) {
        if (hasPrice) {
          var monthly = Math.round(activePrice / 12);
          installmentEl.innerHTML = '<svg class="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
            + '<span>Trả góp 0% lãi suất – Chỉ từ <strong>' + formatVND(monthly) + '/tháng</strong> (Kỳ hạn 12 tháng)</span>';
        } else {
          installmentEl.innerHTML = '<svg class="h-4 w-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
            + '<span>Giá phiên bản này đang được cập nhật từ Apple / Hãng.</span>';
        }
      }
    }

    if (animatePrice && priceEl) {
      clearTimeout(priceAnimTimer);
      priceEl.classList.add('is-updating');
      priceAnimTimer = setTimeout(function () {
        applyPriceValues();
        requestAnimationFrame(function () {
          priceEl.classList.remove('is-updating');
        });
      }, 120);
    } else {
      applyPriceValues();
    }

    renderValidVouchers(product, activePrice);
    syncStickyPurchaseBars(availability, activePrice, activeOldPrice);
  }

  function syncStickyPurchaseBars(availability, activePrice, activeOldPrice) {
    var hasPrice = Number(activePrice) > 0;
    var priceDisplay = hasPrice ? formatVND(activePrice) : 'Giá liên hệ';
    var metaText = (currentColor || 'Mặc định') + ' · ' + (currentVariant || 'Tiêu chuẩn');
    var placeholder = 'frontend/assets/images/placeholders/' + ((product && product.category) || 'phone') + '.svg';
    var thumbSrc = currentImg
      || (galleryItems[0] && galleryItems[0].src)
      || resolveImgUrl((product.colors && product.colors[0] && (product.colors[0].image || product.colors[0].img)) || product.image, product.category)
      || placeholder;

    var mobMeta = document.getElementById('pdMobileStickyMeta');
    var mobPrice = document.getElementById('pdMobileStickyPrice');
    if (mobMeta) mobMeta.textContent = metaText;
    if (mobPrice) mobPrice.textContent = priceDisplay;

    var deskThumb = document.getElementById('pdDesktopStickyThumb');
    var deskName = document.getElementById('pdDesktopStickyName');
    var deskMeta = document.getElementById('pdDesktopStickyMeta');
    var deskPrice = document.getElementById('pdDesktopStickyPrice');
    var deskOldPrice = document.getElementById('pdDesktopStickyOldPrice');
    if (deskThumb) {
      deskThumb.src = thumbSrc;
      deskThumb.alt = (product && product.name) ? (product.name + ' - ' + (currentColor || '')) : 'Sản phẩm';
      deskThumb.onerror = function () {
        this.onerror = null;
        this.src = placeholder;
      };
    }
    if (deskName && product) deskName.textContent = product.name;
    if (deskMeta) deskMeta.textContent = metaText + ' · SL ' + currentQuantity;
    if (deskPrice) deskPrice.textContent = priceDisplay;
    if (deskOldPrice) {
      if (hasPrice && activeOldPrice > activePrice) {
        deskOldPrice.textContent = formatVND(activeOldPrice);
        deskOldPrice.classList.remove('hidden');
      } else {
        deskOldPrice.classList.add('hidden');
      }
    }

    ['pdMobileStickyAddBtn', 'pdMobileStickyBuyBtn', 'pdDesktopStickyAddBtn', 'pdDesktopStickyBuyBtn'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn || !availability) return;
      btn.disabled = !availability.purchasable;
      if (!availability.purchasable) {
        btn.title = availability.unavailableText || availability.badgeText;
      } else {
        btn.removeAttribute('title');
      }
    });
  }

  var POLICY_DETAILS = {
    perks: {
      eyebrow: 'Đặc quyền VLU FLAGSHIP STORE',
      title: 'Chi tiết ưu đãi dành riêng cho sản phẩm',
      paragraphs: [
        'Thu cũ đổi mới trợ giá cao: Hỗ trợ kiểm tra máy nhanh trong 5 phút tại 5 chi nhánh VLU Store, trừ trực tiếp vào giá sản phẩm mới.',
        'Ưu đãi hệ sinh thái & phụ kiện: Áp dụng giảm giá phụ kiện chính hãng khi mua kèm máy trong cùng đơn hàng.',
        'Áp dụng đồng thời với các mã giảm giá hợp lệ (VLU2026, SVVLU10, FLAGSHIP...) tại trang Giỏ hàng & Thanh toán.'
      ]
    },
    authentic: {
      eyebrow: 'Cam kết chất lượng VLU',
      title: '100% Sản phẩm chính hãng nguyên seal VN/A',
      paragraphs: [
        'Mọi thiết bị phân phối tại VLU FLAGSHIP STORE đều có nguồn gốc xuất xứ rõ ràng, đầy đủ hóa đơn VAT điện tử và tem kiểm định từ nhà phân phối ủy quyền.',
        'Cam kết máy mới nguyên seal hộp 100%, chưa kích hoạt bảo hành điện tử trước khi bàn giao tới tay khách hàng.'
      ]
    },
    warranty: {
      eyebrow: 'Trung tâm bảo hành ủy quyền',
      title: 'Bảo hành chính hãng 12–24 tháng toàn quốc',
      paragraphs: [
        'Hưởng trọn vẹn chính sách bảo hành tiêu chuẩn từ nhà sản xuất (Apple, Samsung, ASUS, Marshall, Sony...) tại các trung tâm ủy quyền trên toàn quốc.',
        'Hỗ trợ tiếp nhận gửi bảo hành hộ hoàn toàn miễn phí tại hệ thống 5 chi nhánh VLU Store.'
      ]
    },
    delivery: {
      eyebrow: 'Vận chuyển siêu tốc & Điểm nhận',
      title: 'Giao hàng hỏa tốc 2H & 5 chi nhánh VLU',
      paragraphs: [
        'Giao nhanh miễn phí trong vòng 2 giờ cho các quận nội thành TP.HCM; giao chuyển phát nhanh 1–3 ngày trên toàn quốc (có đồng kiểm khi nhận hàng).',
        'Khách hàng có thể chọn nhận hàng trực tiếp tại một trong 5 chi nhánh VLU Store để được kỹ thuật viên hỗ trợ cài đặt và dán màn hình.'
      ]
    },
    exchange: {
      eyebrow: 'Chính sách hậu mãi',
      title: 'Đổi mới 1 đổi 1 trong 30 ngày',
      paragraphs: [
        'Miễn phí 1 đổi 1 ngay sản phẩm mới tương đương nếu phát sinh lỗi phần cứng từ nhà sản xuất trong 30 ngày đầu kể từ ngày xuất hóa đơn.',
        'Hỗ trợ kiểm tra kỹ thuật lấy ngay, không để khách hàng chờ đợi lâu.'
      ]
    },
    support: {
      eyebrow: 'Chăm sóc khách hàng VLU',
      title: 'Hỗ trợ kỹ thuật & Tư vấn 24/7',
      paragraphs: [
        'Đội ngũ kỹ thuật viên sẵn sàng hỗ trợ chuyển dữ liệu iCloud/Samsung Cloud, sao lưu, cài đặt phần mềm chuyên ngành sinh viên và giải đáp thắc mắc trực tuyến.',
        'Hỗ trợ trọn đời phần mềm tại cửa hàng không thu phí.'
      ]
    },
    payment: {
      eyebrow: 'Thanh toán & Tài chính',
      title: 'Thanh toán bảo mật SSL · Trả góp 0% lãi suất',
      paragraphs: [
        'Hỗ trợ thanh toán đa kênh an toàn chuẩn SSL: Chuyển khoản QR ngân hàng, Ví MoMo/VNPAY, COD khi nhận hàng hoặc quẹt thẻ trực tiếp.',
        'Trả góp 0% lãi suất qua thẻ tín dụng kỳ hạn linh hoạt (6/9/12 tháng) hoặc hồ sơ trả góp xét duyệt nhanh trong 5 phút.'
      ]
    }
  };

  function openPolicyModal(key) {
    var modal = document.getElementById('pdPolicyModal');
    if (!modal) return;
    var info = POLICY_DETAILS[key] || POLICY_DETAILS.perks;
    var eyebrowEl = document.getElementById('pdPolicyModalEyebrow');
    var titleEl = document.getElementById('pdPolicyModalTitle');
    var bodyEl = document.getElementById('pdPolicyModalBody');

    if (eyebrowEl) eyebrowEl.textContent = info.eyebrow;
    if (titleEl) titleEl.textContent = info.title;
    if (bodyEl) {
      var listHtml = info.paragraphs.map(function (text) {
        return '<div class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">'
          + '<svg class="h-4 w-4 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
          + '<span>' + escapeHtml(text) + '</span>'
          + '</div>';
      }).join('');
      if (key === 'perks' && Array.isArray(product.perks) && product.perks.length) {
        listHtml = '<div class="space-y-2 pb-2 border-b border-slate-100">'
          + '<p class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Ưu đãi kèm theo ' + escapeHtml(product.name) + '</p>'
          + product.perks.map(function (pk) {
              return '<div class="flex items-start gap-2.5 p-3 rounded-xl bg-brand-soft/60 border border-brand/15 text-slate-800 font-medium">'
                + '<span class="text-brand font-black">★</span><span>' + escapeHtml(pk) + '</span></div>';
            }).join('')
          + '</div>' + listHtml;
      }
      bodyEl.innerHTML = listHtml;
    }

    policyModalOpen = true;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
  }

  function closePolicyModal() {
    var modal = document.getElementById('pdPolicyModal');
    if (!modal || !policyModalOpen) return;
    policyModalOpen = false;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      if (!policyModalOpen) modal.classList.add('hidden');
    }, 220);
  }

  function syncAllWishlistButtons(wished) {
    ['pdWishBtn', 'pdWishActionBtn', 'pdMobileStickyWishBtn', 'pdDesktopStickyWishBtn'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('aria-pressed', wished ? 'true' : 'false');
      el.classList.toggle('is-wished', wished);
    });
    var lbl = document.getElementById('pdWishLabel');
    if (lbl) lbl.textContent = wished ? 'Đã yêu thích' : 'Yêu thích';
  }

  // ==========================================================================
  // PART 3: CHUẨN HÓA, KHỬ TRÙNG LẶP THÔNG SỐ KỸ THUẬT & BÀI VIẾT EDITORIAL
  // ==========================================================================
  var CATEGORY_DISPLAY = {
    'dien-thoai': 'Điện thoại thông minh',
    'laptop': 'Laptop & Máy tính xách tay',
    'ipad': 'iPad & Máy tính bảng',
    'tai-nghe': 'Tai nghe & Âm thanh cá nhân',
    'loa': 'Loa & Hệ thống Âm thanh',
    'dong-ho-dien-tu': 'Đồng hồ thông minh'
  };

  function normalizeSpecKey(rawKey) {
    var k = String(rawKey || '').replace(/[:：]+$/g, '').trim();
    var lower = k.toLowerCase();
    var aliases = {
      'tên máy': 'Tên sản phẩm',
      'tên sản phẩm': 'Tên sản phẩm',
      'model': 'Tên sản phẩm',
      'hãng sản xuất': 'Thương hiệu',
      'thương hiệu': 'Thương hiệu',
      'nhà sản xuất': 'Thương hiệu',
      'danh mục': 'Danh mục',
      'loại sản phẩm': 'Danh mục',
      'vi xử lý': 'Vi xử lý & Chipset',
      'vi xử lý (cpu)': 'Vi xử lý & Chipset',
      'chipset': 'Vi xử lý & Chipset',
      'chipset (vi xử lý)': 'Vi xử lý & Chipset',
      'cpu': 'Vi xử lý & Chipset',
      'công nghệ màn hình': 'Công nghệ màn hình',
      'màn hình': 'Màn hình',
      'kích thước màn hình': 'Kích thước hiển thị',
      'kích thước vỏ': 'Kích thước vỏ',
      'dung lượng bộ nhớ': 'Bộ nhớ & Lưu trữ',
      'bộ nhớ': 'Bộ nhớ & Lưu trữ',
      'bộ nhớ trong': 'Bộ nhớ & Lưu trữ',
      'lưu trữ': 'Bộ nhớ & Lưu trữ',
      'hệ điều hành': 'Hệ điều hành',
      'cổng kết nối': 'Kết nối & Cổng giao tiếp',
      'kết nối': 'Kết nối & Giao tiếp',
      'bảo hành': 'Bảo hành chính hãng',
      'tình trạng': 'Tình trạng'
    };
    return aliases[lower] || k;
  }

  function normalizeAndDedupeSpecs(p) {
    var dedupedMap = {};
    var order = [];

    function upsertRow(rawK, rawV) {
      var key = normalizeSpecKey(rawK);
      var val = String(rawV == null ? '' : rawV).trim();
      if (!key || !val) return;
      var canon = key.toLowerCase();
      if (!dedupedMap[canon]) {
        dedupedMap[canon] = { key: key, val: val };
        order.push(canon);
      } else if (val.length > dedupedMap[canon].val.length && dedupedMap[canon].val.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        dedupedMap[canon].val = val;
      }
    }

    (p.specs || []).forEach(function (pair) {
      if (Array.isArray(pair) && pair.length >= 2) {
        upsertRow(pair[0], pair[1]);
      } else if (pair && typeof pair === 'object' && pair.label && pair.value) {
        upsertRow(pair.label, pair.value);
      }
    });

    // Bổ sung thông số cơ bản xác thực nếu chưa có sau khi khử trùng lặp
    upsertRow('Tên sản phẩm', p.name);
    upsertRow('Thương hiệu', p.brand);
    upsertRow('Danh mục', CATEGORY_DISPLAY[p.category] || 'Thiết bị công nghệ');

    var rows = order.map(function (c) { return dedupedMap[c]; });
    return { rows: rows, map: dedupedMap };
  }

  function getSpecIconSvg(iconKey) {
    var icons = {
      overview: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      design: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      screen: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="4" rx="2"/><path stroke-linecap="round" d="M8 20h8M12 18v2"/></svg>',
      cpu: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>',
      memory: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><rect width="16" height="12" x="4" y="6" rx="2"/><path d="M8 6V3m4 3V3m4 3V3M8 21v-3m4 3v-3m4 3v-3"/></svg>',
      camera: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="4"/></svg>',
      audio: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      battery: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><rect width="16" height="10" x="2" y="7" rx="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>',
      connect: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>',
      os: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>',
      warranty: '<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'
    };
    return icons[iconKey] || icons.overview;
  }

  function findHighlightByTopic(p, pattern) {
    if (!Array.isArray(p.highlights)) return null;
    return p.highlights.find(function (hl) {
      return hl && (pattern.test(String(hl.title || '')) || pattern.test(String(hl.icon || '')));
    }) || null;
  }

  function buildQuickSpecCards(p, dedupedMap) {
    var cards = [];
    var seenTitle = {};
    var cat = p.category || 'dien-thoai';

    function pushCard(iconKey, title, value, bullets) {
      var tk = String(title || '').toLowerCase();
      if (!title || !value || seenTitle[tk] || cards.length >= 4) return;
      seenTitle[tk] = true;
      cards.push({ icon: iconKey, title: title, value: value, bullets: Array.isArray(bullets) ? bullets : [] });
    }

    (p.highlights || []).forEach(function (hl) {
      pushCard(hl.icon || 'cpu', hl.title, hl.value, hl.bullets || []);
    });

    var colorNames = (p.colors || []).map(function (c) { return c.name; }).filter(Boolean);
    var variantNames = (p.variants || []).map(function (v) { return v.label; }).filter(Boolean);

    if (cat === 'dong-ho-dien-tu') {
      if (dedupedMap['kích thước vỏ']) pushCard('design', 'Kích thước vỏ', dedupedMap['kích thước vỏ'].val, ['Chất liệu hoàn thiện cao cấp chính hãng ' + p.brand, colorNames.length ? ('Màu sắc: ' + colorNames.join(', ')) : 'Dây đeo chuẩn đồng hồ thể thao']);
      if (dedupedMap['màn hình']) pushCard('screen', 'Màn hình', dedupedMap['màn hình'].val, ['Hiển thị sắc nét ngay cả dưới nắng gắt', 'Mặt kính cường lực chống trầy xước']);
      if (dedupedMap['độ lặn sâu']) pushCard('battery', 'Kháng nước & Bền bỉ', dedupedMap['độ lặn sâu'].val, ['Phù hợp bơi lội & tập luyện cường độ cao']);
      if (dedupedMap['kết nối & giao tiếp']) pushCard('connect', 'Kết nối & Định vị', dedupedMap['kết nối & giao tiếp'].val, ['Đồng bộ thông báo & dữ liệu sức khỏe tức thì']);
    } else if (cat === 'laptop') {
      pushCard('cpu', 'Dòng Laptop ' + p.brand, p.menuGroup || p.name, [p.name + ' phân phối chính hãng VN/A', 'Thiết kế di động, hoàn thiện kim loại chuẩn flagship']);
      pushCard('memory', p.variantLabel || 'Cấu hình / Phiên bản', variantNames.join(' · ') || 'Tiêu chuẩn hãng', ['Tùy chọn phiên bản chính hãng tối ưu cho học tập & sáng tạo']);
      pushCard('design', 'Màu sắc hoàn thiện', colorNames.length + ' Tùy chọn màu', [colorNames.slice(0, 4).join(', ') || 'Chuẩn màu studio hãng']);
      pushCard('warranty', 'Chính sách & Bảo hành', '12 – 24 Tháng VN/A', ['Hỗ trợ cài đặt phần mềm & 1 đổi 1 trong 30 ngày', 'Trả góp 0% · Giao nhanh 2H']);
    } else if (cat === 'ipad') {
      pushCard('screen', 'Dòng Tablet ' + p.brand, p.menuGroup || p.name, ['Không gian hiển thị cảm ứng linh hoạt cho ghi chú & thiết kế']);
      pushCard('memory', p.variantLabel || 'Phiên bản dung lượng', variantNames.join(' · ') || 'Tiêu chuẩn hãng', ['Đáp ứng lưu trữ tài liệu, đồ họa và giải trí mượt mà']);
      pushCard('design', 'Màu sắc chính hãng', colorNames.length + ' Phiên bản màu', [colorNames.slice(0, 4).join(', ') || 'Hoàn thiện cao cấp']);
      pushCard('warranty', 'Chính sách & Đổi trả', 'Chính hãng VN/A', ['Bảo hành toàn quốc 12–24 tháng · Hỗ trợ 1 đổi 1 trong 30 ngày']);
    } else if (cat === 'tai-nghe' || cat === 'loa') {
      pushCard('audio', cat === 'loa' ? 'Hệ thống Âm thanh' : 'Âm thanh Cá nhân', p.brand + ' Audio', [p.name + ' cân chỉnh âm thanh chính xác theo chuẩn ' + p.brand, 'Hỗ trợ nghe nhạc chất lượng cao']);
      pushCard('design', 'Hoàn thiện & Phiên bản', variantNames.length > 1 ? variantNames.join(' · ') : (colorNames.length + ' Tùy chọn màu'), [colorNames.length ? ('Màu: ' + colorNames.slice(0, 4).join(', ')) : 'Thiết kế tối ưu âm học']);
      pushCard('connect', 'Kết nối & Tương thích', 'Chuẩn ghép nối nhanh', ['Tương thích linh hoạt iOS, Android, macOS và Windows']);
      pushCard('warranty', 'Bảo hành chính hãng', '100% Nguyên seal', ['Bảo hành chính hãng 12 tháng · 1 đổi 1 lỗi NSX trong 30 ngày']);
    }

    // Bảo đảm luôn đủ 4 thẻ cân đối từ dữ liệu thực tế
    if (dedupedMap['vi xử lý & chipset']) pushCard('cpu', 'Vi xử lý', dedupedMap['vi xử lý & chipset'].val, ['Tối ưu hiệu năng và xử lý tác vụ mượt mà']);
    if (dedupedMap['hệ điều hành']) pushCard('os', 'Hệ điều hành', dedupedMap['hệ điều hành'].val, ['Cập nhật phần mềm chính thức từ ' + p.brand]);
    pushCard('design', 'Tùy chọn màu sắc', (colorNames.length || 1) + ' Màu sắc', [colorNames.slice(0, 4).join(', ') || 'Mặc định chính hãng']);
    pushCard('warranty', 'Bảo hành & Cam kết', dedupedMap['bảo hành chính hãng'] ? dedupedMap['bảo hành chính hãng'].val : '12–24 Tháng VN/A', ['Máy mới 100% nguyên seal, hỗ trợ đổi trả 30 ngày']);

    return cards.slice(0, 4);
  }

  function buildSpecGroups(p, dedupedRows, dedupedMap) {
    var cat = p.category || 'dien-thoai';
    var isAudio = (cat === 'tai-nghe' || cat === 'loa');
    var colorNames = (p.colors || []).map(function (c) { return c.name; }).filter(Boolean);
    var variantNames = (p.variants || []).map(function (v) { return v.label; }).filter(Boolean);

    var screenHl = findHighlightByTopic(p, /screen|màn hình/i);
    var cpuHl = findHighlightByTopic(p, /cpu|vi xử lý|chip/i);
    var camHl = findHighlightByTopic(p, /camera/i);
    var batHl = findHighlightByTopic(p, /battery|pin|sạc/i);

    function pickSpecRow(keyRegex) {
      return dedupedRows.filter(function (r) { return keyRegex.test(r.key); });
    }

    var groups = [];
    function pushGroup(id, title, iconKey, rows) {
      var uniqueRows = [];
      var seenRowKeys = {};
      var seenRowVals = {};
      (rows || []).forEach(function (r) {
        if (!r || !r.key || !r.val) return;
        var k = r.key.toLowerCase();
        var vNorm = String(r.val).trim().toLowerCase().replace(/\s+/g, ' ');
        if (seenRowKeys[k] || (vNorm && seenRowVals[vNorm])) return;
        seenRowKeys[k] = true;
        if (vNorm) seenRowVals[vNorm] = true;
        uniqueRows.push(r);
      });
      if (uniqueRows.length > 0) {
        groups.push({ id: id, title: title, icon: iconKey, rows: uniqueRows });
      }
    }

    // 1. Tổng quan
    var menuGroupClean = String(p.menuGroup || '').trim();
    var showSeriesLine = menuGroupClean && menuGroupClean.toLowerCase() !== String(p.brand || '').trim().toLowerCase();
    var overviewRows = [
      { key: 'Tên sản phẩm', val: p.name },
      { key: 'Thương hiệu', val: p.brand }
    ];
    if (showSeriesLine) {
      overviewRows.push({ key: 'Dòng sản phẩm', val: menuGroupClean });
    }
    overviewRows.push({ key: 'Danh mục', val: CATEGORY_DISPLAY[cat] || 'Sản phẩm công nghệ' });
    overviewRows.push({ key: 'Tình trạng sản phẩm', val: (dedupedMap['tình trạng'] && dedupedMap['tình trạng'].val) || 'Mới 100% nguyên seal hộp chính hãng' });
    pushGroup('overview', 'Tổng quan', 'overview', overviewRows);

    // 2. Thiết kế và kích thước
    var designRows = pickSpecRow(/kích thước vỏ|chất liệu|trọng lượng|độ lặn sâu|kháng nước|thiết kế/i);
    if (colorNames.length) {
      designRows.push({ key: 'Màu sắc phân phối', val: colorNames.join(' · ') });
    }
    pushGroup('design', 'Thiết kế và kích thước', 'design', designRows);

    // 3. Màn hình (chỉ hiển thị cho thiết bị có màn hình: Điện thoại, Laptop, iPad, Đồng hồ)
    if (!isAudio) {
      var screenRows = pickSpecRow(/màn hình|kích thước hiển thị/i);
      if (screenHl) {
        screenRows.push({ key: 'Thông số hiển thị chính', val: screenHl.value });
        if (Array.isArray(screenHl.bullets) && screenHl.bullets.length) {
          screenRows.push({ key: 'Công nghệ màn hình chi tiết', val: screenHl.bullets.join(' · ') });
        }
      }
      pushGroup('screen', 'Màn hình hiển thị', 'screen', screenRows);
    }

    // 4. Vi xử lý & Hiệu năng (theo danh mục có CPU/Chip)
    if (cat !== 'loa') {
      var cpuRows = pickSpecRow(/vi xử lý|chip|gpu|npu/i);
      if (cpuHl) {
        cpuRows.push({ key: 'Bộ vi xử lý trọng tâm', val: cpuHl.value });
        if (Array.isArray(cpuHl.bullets) && cpuHl.bullets.length) {
          cpuRows.push({ key: 'Kiến trúc CPU / GPU / NPU', val: cpuHl.bullets.join(' · ') });
        }
      }
      pushGroup('cpu', cat === 'tai-nghe' ? 'Chip xử lý âm thanh & Hiệu năng' : 'Vi xử lý & Hiệu năng', 'cpu', cpuRows);
    }

    // 5. RAM và Bộ nhớ / Lưu trữ (chỉ áp dụng cho Điện thoại, Laptop, iPad)
    if (cat === 'dien-thoai' || cat === 'laptop' || cat === 'ipad') {
      var memRows = pickSpecRow(/ram|bộ nhớ|lưu trữ|ssd/i);
      if (variantNames.length) {
        memRows.push({ key: p.variantLabel || 'Phiên bản cấu hình / Lưu trữ', val: variantNames.join(' / ') });
      }
      pushGroup('memory', 'RAM và Bộ nhớ / Lưu trữ', 'memory', memRows);
    }

    // 6. Camera / Âm thanh (tự động điều chỉnh đúng loại máy)
    if (isAudio) {
      var audioRows = pickSpecRow(/âm thanh|loa|chống ồn|driver|codec|microphone/i);
      audioRows.push({ key: 'Chuẩn xử lý âm thanh', val: 'Cân chỉnh âm học nguyên bản từ ' + p.brand + ' Audio' });
      if (variantNames.length && variantNames[0] !== 'Tiêu chuẩn') {
        audioRows.push({ key: p.variantLabel || 'Phiên bản âm thanh', val: variantNames.join(' / ') });
      }
      pushGroup('media', 'Công nghệ Âm thanh', 'audio', audioRows);
    } else if (cat === 'dien-thoai' || cat === 'ipad') {
      var camRows = pickSpecRow(/camera|quay phim|video/i);
      if (camHl) {
        camRows.push({ key: 'Cụm Camera nổi bật', val: camHl.value });
        if (Array.isArray(camHl.bullets) && camHl.bullets.length) {
          camRows.push({ key: 'Tính năng nhiếp ảnh & Quay phim', val: camHl.bullets.join(' · ') });
        }
      }
      pushGroup('media', 'Camera & Quay phim', 'camera', camRows);
    } else if (cat === 'dong-ho-dien-tu' && variantNames.length) {
      pushGroup('media', 'Kích cỡ & Dây đeo tương thích', 'design', [{ key: p.variantLabel || 'Tùy chọn dây đeo', val: variantNames.join(' / ') }]);
    }

    // 7. Pin & Công nghệ sạc / Thời lượng sử dụng
    var batRows = pickSpecRow(/pin|sạc|thời lượng|nguồn/i);
    if (batHl) {
      batRows.push({ key: 'Thời lượng sử dụng', val: batHl.value });
      if (Array.isArray(batHl.bullets) && batHl.bullets.length) {
        batRows.push({ key: 'Công nghệ sạc & Quản lý năng lượng', val: batHl.bullets.join(' · ') });
      }
    }
    pushGroup('battery', cat === 'loa' ? 'Nguồn điện & Thời lượng phát nhạc' : 'Pin và Công nghệ sạc', 'battery', batRows);

    // 8. Kết nối & Cổng giao tiếp
    var connectRows = pickSpecRow(/kết nối|bluetooth|wifi|usb|cổng|lte|gps|5g/i);
    if (!connectRows.length && cat === 'laptop') {
      connectRows.push({ key: 'Kết nối không dây & Cổng', val: 'Wi-Fi tốc độ cao, Bluetooth đa thiết bị & USB-C truyền dữ liệu' });
    } else if (!connectRows.length && isAudio) {
      connectRows.push({ key: 'Kết nối hỗ trợ', val: 'Bluetooth không dây độ trễ thấp, ghép nối đa nền tảng' });
    }
    pushGroup('connect', 'Kết nối & Cổng giao tiếp', 'connect', connectRows);

    // 9. Hệ điều hành & Tính năng thông minh
    if (cat !== 'loa') {
      var osRows = pickSpecRow(/hệ điều hành|tính năng|ai|thông minh|cảm biến/i);
      pushGroup('os', 'Hệ điều hành & Tính năng thông minh', 'os', osRows);
    }

    // 10. Thông tin Bảo hành chính hãng VLU
    var warrantyRows = [
      { key: 'Bảo hành chính hãng', val: (dedupedMap['bảo hành chính hãng'] && dedupedMap['bảo hành chính hãng'].val) || '12 – 24 tháng tại Trung tâm ủy quyền toàn quốc' },
      { key: 'Đổi mới 1 đổi 1', val: 'Miễn phí 30 ngày đầu nếu phát sinh lỗi phần cứng từ nhà sản xuất' },
      { key: 'Hỗ trợ VLU Store', val: 'Kiểm định nguyên seal VN/A, VAT đầy đủ & Hỗ trợ kỹ thuật trọn đời tại 5 chi nhánh' }
    ];
    pushGroup('warranty', 'Thông tin Bảo hành chính hãng VLU', 'warranty', warrantyRows);

    return groups;
  }

  function renderSpecGroupCardHtml(group, index) {
    var rowsHtml = group.rows.map(function (r) {
      return '<div class="spec-table-row">'
        + '<span class="font-bold text-slate-800 w-5/12 sm:w-4/12 pr-3">' + escapeHtml(r.key) + '</span>'
        + '<span class="text-slate-600 w-7/12 sm:w-8/12 break-words">' + escapeHtml(r.val) + '</span>'
        + '</div>';
    }).join('');
    return '<article class="pd-spec-group-card" data-spec-group="' + escapeAttr(group.id) + '">'
      + '<button type="button" class="pd-spec-group-head" aria-expanded="true">'
      +   '<div class="flex items-center gap-2.5 min-w-0">'
      +     '<span class="pd-spec-group-icon">' + getSpecIconSvg(group.icon) + '</span>'
      +     '<h4 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 truncate">' + escapeHtml(group.title) + '</h4>'
      +   '</div>'
      +   '<svg class="h-4 w-4 pd-spec-group-chevron" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>'
      + '</button>'
      + '<div class="pd-spec-group-body"><div class="pd-spec-group-inner">' + rowsHtml + '</div></div>'
      + '</article>';
  }

  var latestSpecGroupsCache = [];

  function renderNormalizedSpecsAndGroups(p) {
    var normalized = normalizeAndDedupeSpecs(p);
    var catName = CATEGORY_DISPLAY[p.category] || 'Thiết bị công nghệ';

    var catPill = document.getElementById('pdSpecsCategoryPill');
    var subtitleEl = document.getElementById('pdSpecsSubtitle');
    if (catPill) catPill.textContent = p.brand + ' · ' + catName;
    if (subtitleEl) {
      subtitleEl.textContent = 'Thông số phần cứng chính hãng của ' + p.name + ' (' + p.brand + ') được chuẩn hóa và khử trùng lặp hoàn toàn.';
    }

    // 1. Dải Quick Spec Cards (4 thẻ nổi bật)
    var bentoContainer = document.getElementById('pdBento');
    var quickCards = buildQuickSpecCards(p, normalized.map);
    if (bentoContainer) {
      var colorClasses = ['text-brand', 'text-purple-600', 'text-blue-600', 'text-emerald-600'];
      bentoContainer.innerHTML = quickCards.map(function (hl, idx) {
        var iconColor = colorClasses[idx % colorClasses.length];
        var bulletsHtml = (hl.bullets || []).slice(0, 4).map(function (b) {
          return '<li>• ' + escapeHtml(b) + '</li>';
        }).join('');
        return '<div class="spec-bento-card">'
          + '<div class="flex items-center gap-2.5 mb-3 ' + iconColor + '">'
          +   getSpecIconSvg(hl.icon)
          +   '<h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">' + escapeHtml(hl.title) + '</h3>'
          + '</div>'
          + '<p class="text-base sm:text-lg font-black text-slate-950 leading-snug">' + escapeHtml(hl.value) + '</p>'
          + (bulletsHtml ? '<ul class="mt-2.5 text-xs text-slate-600 space-y-1 font-medium">' + bulletsHtml + '</ul>' : '')
          + '</div>';
      }).join('');
    }

    // 2. Các Nhóm Thông Số Kỹ Thuật Chuyên Biệt
    var groups = buildSpecGroups(p, normalized.rows, normalized.map);
    latestSpecGroupsCache = groups;

    var countEl = document.getElementById('pdSpecGroupCount');
    if (countEl) {
      var totalRows = groups.reduce(function (sum, g) { return sum + g.rows.length; }, 0);
      countEl.textContent = groups.length + ' nhóm chuyên biệt · ' + totalRows + ' thông số đã chuẩn hóa';
    }

    var primaryEl = document.getElementById('pdSpecGroupsPrimary');
    var extraEl = document.getElementById('pdSpecGroupsExtra');
    var extraGridEl = document.getElementById('pdSpecGroupsExtraGrid');
    var toggleWrap = document.getElementById('pdSpecToggleWrap');
    var toggleBtn = document.getElementById('pdSpecToggleAllBtn');
    var toggleLbl = document.getElementById('pdSpecToggleLabel');

    var primaryGroups = groups.slice(0, 4);
    var extraGroups = groups.slice(4);

    if (primaryEl) {
      primaryEl.innerHTML = primaryGroups.map(function (g, idx) { return renderSpecGroupCardHtml(g, idx); }).join('');
    }
    if (extraGridEl) {
      extraGridEl.innerHTML = extraGroups.map(function (g, idx) { return renderSpecGroupCardHtml(g, idx + 4); }).join('');
    }
    if (extraEl) extraEl.classList.remove('is-expanded');
    if (toggleWrap) toggleWrap.classList.toggle('hidden', extraGroups.length === 0);
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    if (toggleLbl) toggleLbl.textContent = 'Xem toàn bộ thông số chi tiết (' + extraGroups.length + ' nhóm thêm)';

    return { normalized: normalized, groups: groups };
  }

  function openFullSpecsModal() {
    var modal = document.getElementById('pdPolicyModal');
    if (!modal) return;
    var eyebrowEl = document.getElementById('pdPolicyModalEyebrow');
    var titleEl = document.getElementById('pdPolicyModalTitle');
    var bodyEl = document.getElementById('pdPolicyModalBody');

    if (eyebrowEl) eyebrowEl.textContent = product.brand + ' · Thông số chuẩn hóa';
    if (titleEl) titleEl.textContent = 'Thông số kỹ thuật đầy đủ – ' + product.name;
    if (bodyEl) {
      bodyEl.innerHTML = latestSpecGroupsCache.map(function (g) {
        return '<div class="rounded-2xl border border-slate-200/80 overflow-hidden mb-3">'
          + '<div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200/70 flex items-center gap-2">'
          +   '<span class="text-brand">' + getSpecIconSvg(g.icon) + '</span>'
          +   '<strong class="text-xs uppercase tracking-wider text-slate-900">' + escapeHtml(g.title) + '</strong>'
          + '</div>'
          + '<div>'
          + g.rows.map(function (r) {
              return '<div class="flex justify-between gap-3 px-4 py-2 text-xs border-b border-slate-100 last:border-none">'
                + '<span class="font-bold text-slate-700 w-5/12">' + escapeHtml(r.key) + '</span>'
                + '<span class="text-slate-600 w-7/12 text-right">' + escapeHtml(r.val) + '</span>'
                + '</div>';
            }).join('')
          + '</div>'
          + '</div>';
      }).join('');
    }

    policyModalOpen = true;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
  }

  function buildEditorialChapters(p, normalized, groups) {
    var cat = p.category || 'dien-thoai';
    var map = normalized.map;
    var colorList = (p.colors || []).map(function (c) { return c.name; }).filter(Boolean);
    var variantList = (p.variants || []).map(function (v) { return v.label; }).filter(Boolean);

    var screenHl = findHighlightByTopic(p, /screen|màn hình/i);
    var cpuHl = findHighlightByTopic(p, /cpu|vi xử lý|chip/i);
    var camHl = findHighlightByTopic(p, /camera/i);
    var batHl = findHighlightByTopic(p, /battery|pin|sạc/i);

    var cpuText = (cpuHl && cpuHl.value) || (map['vi xử lý & chipset'] && map['vi xử lý & chipset'].val);
    var screenText = (screenHl && screenHl.value) || (map['màn hình'] && map['màn hình'].val) || (map['kích thước hiển thị'] && map['kích thước hiển thị'].val);
    var osText = (map['hệ điều hành'] && map['hệ điều hành'].val);
    var warrantyText = (map['bảo hành chính hãng'] && map['bảo hành chính hãng'].val) || '12 – 24 tháng chính hãng toàn quốc';

    var ch3Title = (cat === 'tai-nghe' || cat === 'loa')
      ? 'Thiết kế công thái học & Kết cấu âm học'
      : 'Công nghệ màn hình & Không gian hiển thị';
    var ch3Body = '';
    if (cat === 'tai-nghe' || cat === 'loa') {
      ch3Body = p.name + ' được ' + p.brand + ' tinh chỉnh cấu trúc hoàn thiện nhằm tối ưu sự thoải mái khi đeo lâu dài hoặc độ ổn định cộng hưởng âm học trong không gian sử dụng. Các chi tiết bề mặt và nút điều khiển trực quan giúp thao tác hằng ngày mượt mà.';
    } else if (screenText) {
      ch3Body = 'Không gian hiển thị trên ' + p.name + ' nổi bật với thông số ' + screenText + (screenHl && screenHl.bullets && screenHl.bullets.length ? ' (' + screenHl.bullets.join('; ') + ')' : '') + ', mang lại độ chi tiết sắc nét và màu sắc trung thực khi làm việc, chỉnh sửa nội dung hay giải trí đa phương tiện.';
    } else if (cat === 'laptop') {
      ch3Body = 'Trên dòng laptop ' + p.name + ', không gian màn hình rộng rãi chuẩn màu của ' + p.brand + ' được tối ưu cho nhu cầu làm việc đa cửa sổ, lập trình, dựng đồ họa và học tập suốt ngày dài mà không gây mỏi mắt.';
    } else {
      ch3Body = p.name + ' sở hữu màn hình cảm ứng sắc nét chuẩn phân khúc ' + p.brand + ', hỗ trợ thao tác mượt mà cho công việc sáng tạo và hiển thị ngoài trời rõ ràng.';
    }

    var ch4Title = (cat === 'tai-nghe' || cat === 'loa')
      ? 'Chất âm đặc trưng & Công nghệ Âm thanh'
      : (cat === 'dong-ho-dien-tu' ? 'Hiệu năng xử lý & Hệ thống Cảm biến' : 'Hiệu năng & Bộ vi xử lý');
    var ch4Body = '';
    if (cat === 'tai-nghe' || cat === 'loa') {
      ch4Body = p.name + ' mang dấu ấn âm thanh chuẩn mực của ' + p.brand + ', cân bằng dải trầm chắc gọn cùng dải trung và cao tách bạch. Thiết bị đáp ứng tốt từ nhu cầu nghe nhạc Hi-Res, họp trực tuyến đến thưởng thức không gian giải trí tại gia.';
    } else if (cpuText) {
      ch4Body = 'Sức mạnh xử lý trung tâm đến từ ' + cpuText + (cpuHl && cpuHl.bullets && cpuHl.bullets.length ? ' — nổi bật với ' + cpuHl.bullets.join(', ') : '') + '. Nhờ vậy ' + p.name + ' phản hồi nhanh nhạy các tác vụ nặng, đa nhiệm mượt mà và duy trì sự ổn định lâu dài.';
    } else if (cat === 'laptop') {
      ch4Body = 'Thuộc dòng ' + (p.menuGroup || p.brand) + ', ' + p.name + (variantList.length > 1 ? ' với các tùy chọn ' + variantList.join(', ') : '') + ' đáp ứng trọn vẹn từ xử lý tác vụ văn phòng chuyên sâu đến thiết kế, biên tập media và tính toán kỹ thuật.';
    } else {
      ch4Body = p.name + ' được tối ưu phần cứng đồng bộ từ ' + p.brand + (osText ? ' chạy trên nền tảng ' + osText : '') + ', đảm bảo hiệu suất ổn định và khả năng phản hồi tức thì mọi thao tác hằng ngày.';
    }

    var ch5Title = (cat === 'dien-thoai' || cat === 'ipad')
      ? 'Hệ thống Camera & Công nghệ Chuyên sâu'
      : (cat === 'laptop'
        ? 'Tính năng Chuyên sâu, Cổng kết nối & Bàn phím'
        : (cat === 'dong-ho-dien-tu'
          ? 'Theo dõi Sức khỏe, Thể thao & Kết nối Độc lập'
          : 'Kết nối Đa thiết bị & Tính năng Thông minh'));
    var ch5Body = '';
    if (camHl) {
      ch5Body = 'Hệ thống nhiếp ảnh với ' + camHl.value + (camHl.bullets && camHl.bullets.length ? ' tích hợp các công nghệ ' + camHl.bullets.join(', ') : '') + ', giúp người dùng ghi lại khung hình sắc nét trong nhiều điều kiện ánh sáng khác nhau.';
    } else if (cat === 'laptop') {
      ch5Body = p.name + ' chú trọng hệ thống tản nhiệt hiệu quả, bàn phím hành trình chuẩn xác cùng các cổng kết nối tốc độ cao phục vụ trình chiếu, sao lưu và mở rộng màn hình rời linh hoạt tại giảng đường hay văn phòng.';
    } else if (cat === 'dong-ho-dien-tu') {
      var diveStr = map['độ lặn sâu'] ? ('Chuẩn bền bỉ ' + map['độ lặn sâu'].val + ' kết hợp ') : '';
      var connStr = map['kết nối & giao tiếp'] ? ('kết nối ' + map['kết nối & giao tiếp'].val) : 'cảm biến theo dõi vận động đa chế độ';
      ch5Body = diveStr + connStr + ' biến ' + p.name + ' thành người bạn đồng hành tin cậy cho hoạt động thể thao ngoài trời lẫn quản lý nhịp sống năng động mỗi ngày.';
    } else {
      ch5Body = p.name + ' hỗ trợ ghép nối nhanh chóng với điện thoại, tablet và máy tính thông qua kết nối ổn định, dễ dàng chuyển đổi giữa học tập, hội họp và nghe nhạc giải trí.';
    }

    var ch6Title = (cat === 'loa')
      ? 'Nguồn cấp điện & Trải nghiệm vận hành bền bỉ'
      : 'Pin, Thời lượng sử dụng thực tế & Công nghệ sạc';
    var ch6Body = '';
    if (batHl) {
      ch6Body = 'Thời lượng pin đạt tới ' + batHl.value + (batHl.bullets && batHl.bullets.length ? ', đi kèm ' + batHl.bullets.join(', ') : '') + ', đảm bảo nhịp làm việc và giải trí liền mạch xuyên suốt cả ngày.';
    } else if (cat === 'loa') {
      ch6Body = p.name + ' được thiết kế tối ưu hiệu suất tiêu thụ điện năng và khả năng duy trì chất âm ổn định ở nhiều mức âm lượng, phù hợp bố trí linh hoạt trong phòng cá nhân hoặc không gian sinh hoạt.';
    } else {
      ch6Body = 'Cùng các thuật toán quản lý năng lượng hiện đại từ ' + p.brand + ', ' + p.name + ' duy trì thời lượng sử dụng bền bỉ suốt ngày làm việc dài và hỗ trợ sạc lại nhanh chóng qua chuẩn kết nối phổ thông.';
    }

    var targetAudience = '';
    if (cat === 'laptop') {
      targetAudience = 'Sinh viên ngành Công nghệ Thông tin, Thiết kế Đồ họa, Kỹ sư phần mềm và nhân viên văn phòng cần một chiếc ' + p.brand + ' bền bỉ, hiệu suất cao và ổn định lâu dài.';
    } else if (cat === 'ipad') {
      targetAudience = 'Sinh viên, giảng viên, người làm sáng tạo nội dung số và thiết kế thường xuyên ghi chú, phác thảo hoặc trình bày ý tưởng di động.';
    } else if (cat === 'tai-nghe' || cat === 'loa') {
      targetAudience = 'Người dùng yêu thích chất âm trung thực chuẩn ' + p.brand + ', cần thiết bị hỗ trợ học ngoại ngữ, họp trực tuyến và thư giãn âm nhạc chất lượng cao.';
    } else if (cat === 'dong-ho-dien-tu') {
      targetAudience = 'Người năng động, người chơi thể thao ngoài trời và khách hàng muốn theo dõi các chỉ số sức khỏe, thông báo thông minh ngay trên cổ tay.';
    } else {
      targetAudience = 'Khách hàng tìm kiếm chiếc smartphone chính hãng ' + p.brand + ' cân bằng toàn diện giữa hiệu năng, camera sắc nét, pin bền bỉ và chế độ bảo hành minh bạch 12–24 tháng.';
    }

    return [
      {
        id: 'editorial-ch-1',
        num: '01',
        title: 'Giới thiệu tổng quan & Điểm nổi bật nhất',
        body: (p.tagline || (p.name + ' là đại diện tiêu biểu trong phân khúc ' + (CATEGORY_DISPLAY[cat] || 'công nghệ') + ' từ ' + p.brand + '.'))
          + ' Sản phẩm được phân phối chính hãng nguyên seal VN/A tại VLU FLAGSHIP STORE với chính sách bảo hành ' + warrantyText
          + (variantList.length > 1 ? ', đi kèm các tùy chọn phiên bản ' + variantList.join(', ') + ' đáp ứng đa dạng nhu cầu.' : '.')
      },
      {
        id: 'editorial-ch-2',
        num: '02',
        title: 'Thiết kế và Chất liệu hoàn thiện cao cấp',
        body: p.name + ' mang ngôn ngữ thiết kế đặc trưng của ' + p.brand + ', chú trọng tính thẩm mỹ tinh giản và độ bền thực tế khi cầm nắm hay mang theo hằng ngày.'
          + (colorList.length ? ' Tại VLU FLAGSHIP STORE, sản phẩm hiện có các phiên bản màu sắc gồm: ' + colorList.join(', ') + '.' : '')
          + (map['kích thước vỏ'] ? ' Thông số khung vỏ chuẩn ' + map['kích thước vỏ'].val + ' mang lại cảm giác chắc chắn.' : '')
      },
      { id: 'editorial-ch-3', num: '03', title: ch3Title, body: ch3Body },
      { id: 'editorial-ch-4', num: '04', title: ch4Title, body: ch4Body },
      { id: 'editorial-ch-5', num: '05', title: ch5Title, body: ch5Body },
      { id: 'editorial-ch-6', num: '06', title: ch6Title, body: ch6Body },
      {
        id: 'editorial-ch-7',
        num: '07',
        title: 'Đối tượng sử dụng phù hợp (Tư vấn VLU Flagship)',
        body: targetAudience + ' Khi mua tại VLU FLAGSHIP STORE, bạn được tư vấn chọn phiên bản cấu hình tối ưu ngân sách, hỗ trợ trả góp 0% lãi suất, thu cũ đổi mới và cài đặt phần mềm trọn đời.',
        isCallout: true
      }
    ];
  }

  function renderEditorialArticle(p, specPayload) {
    var titleEl = document.getElementById('pdEditorialTitle');
    var leadEl = document.getElementById('pdEditorialLead');
    var navEl = document.getElementById('pdEditorialNav');
    var bodyEl = document.getElementById('pdEditorialBody');
    var toggleBtn = document.getElementById('pdEditorialToggleBtn');
    var toggleLbl = document.getElementById('pdEditorialToggleLabel');

    if (titleEl) titleEl.textContent = 'Giới thiệu & Đánh giá chi tiết ' + p.name;
    if (leadEl) {
      leadEl.textContent = 'Khám phá chi tiết thiết kế, điểm nhấn công nghệ của ' + p.name + ' (' + p.brand + ') cùng hình ảnh thực tế tại VLU FLAGSHIP STORE.';
    }

    var chapters = buildEditorialChapters(p, specPayload.normalized, specPayload.groups);
    if (navEl) {
      navEl.innerHTML = chapters.map(function (ch) {
        return '<button type="button" class="pd-editorial-toc-btn" data-editorial-target="' + escapeAttr(ch.id) + '">'
          + ch.num + '. ' + escapeHtml(ch.title)
          + '</button>';
      }).join('');
    }

    // Lấy tối đa 2 hình ảnh sản phẩm thực tế từ SanPham/ (đã nạp trong galleryItems) để minh họa bài viết
    var visual1 = galleryItems[0] || null;
    var visual2 = galleryItems.length > 1 ? galleryItems[1] : null;

    function buildFigureHtml(item, captionSuffix) {
      if (!item || !item.src || !isValidLocalMedia(item.rawSrc || item.src)) return '';
      return '<figure class="pd-editorial-figure">'
        + '<img src="' + escapeAttr(item.src) + '" alt="' + escapeAttr(p.name + ' - ' + item.label) + '" loading="lazy">'
        + '<figcaption class="pd-editorial-caption">Ảnh thực tế ' + escapeHtml(p.name) + ' (' + escapeHtml(item.label) + ') – ' + escapeHtml(captionSuffix) + '</figcaption>'
        + '</figure>';
    }

    if (bodyEl) {
      bodyEl.classList.add('is-collapsed');
      var htmlParts = [];
      chapters.forEach(function (ch, idx) {
        htmlParts.push(
          '<section id="' + escapeAttr(ch.id) + '" class="pd-editorial-chapter' + (ch.isCallout ? ' pd-editorial-callout' : '') + '">'
          + '<h3 class="flex items-center gap-2.5 text-base sm:text-lg font-extrabold text-slate-950">'
          +   '<span class="pd-editorial-chapter-num">' + ch.num + '</span>'
          +   '<span>' + escapeHtml(ch.title) + '</span>'
          + '</h3>'
          + '<p class="mt-2.5 text-sm sm:text-[15px] text-slate-600 leading-relaxed">' + escapeHtml(ch.body) + '</p>'
          + '</section>'
        );
        if (idx === 1 && visual1) {
          htmlParts.push(buildFigureHtml(visual1, 'Phân phối chính hãng tại VLU FLAGSHIP STORE'));
        }
        if (idx === 3 && visual2) {
          htmlParts.push(buildFigureHtml(visual2, 'Góc nhìn hoàn thiện chi tiết sản phẩm'));
        }
      });
      bodyEl.innerHTML = htmlParts.join('');
    }

    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    if (toggleLbl) toggleLbl.textContent = 'Xem thêm bài viết chi tiết';
  }

  function resolveImgUrl(url, cat) {
    var upgrade = window.VLU_UPGRADE_PRODUCT_IMG || function (u) { return u; };
    var resolver = window.resolveProductImageUrl || function (u) { return u; };
    return resolver(upgrade(url), cat || 'phone');
  }

  function normalizeMediaKey(url) {
    if (!url) return '';
    var upgrade = window.VLU_UPGRADE_PRODUCT_IMG || function (u) { return u; };
    var cleaned = upgrade(String(url).trim().replace(/^[\/\\]+/, '').replace(/^\.\//, ''));
    try { cleaned = decodeURI(cleaned); } catch (e) {}
    return cleaned.toLowerCase();
  }

  function isValidLocalMedia(url) {
    if (!url || typeof url !== 'string') return false;
    var trimmed = url.trim();
    if (!trimmed) return false;
    if (/^(?:https?:|javascript:|\/\/)/i.test(trimmed)) return false;
    if (/(^|\/)Banner\//i.test(trimmed)) return false;
    return true;
  }

  function syncPdWishlistBtn(productId, btn) {
    try {
      var accountUser = JSON.parse(localStorage.getItem('vlu_user') || 'null');
      var identity = (accountUser && (accountUser.username || accountUser.email || accountUser.id)) || 'guest';
      var accountKey = 'vlu_account_' + String(identity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
      var store = JSON.parse(localStorage.getItem(accountKey) || '{}');
      var wishlist = Array.isArray(store.wishlist) ? store.wishlist : [];
      var wished = wishlist.indexOf(productId) !== -1;
      btn.setAttribute('aria-pressed', wished ? 'true' : 'false');
      btn.classList.toggle('is-wished', wished);
      if (btn.id === 'pdWishActionBtn') {
        var lbl = document.getElementById('pdWishLabel');
        if (lbl) lbl.textContent = wished ? 'Đã yêu thích' : 'Yêu thích';
      }
    } catch (e) {}
  }

  function buildGalleryItems(p) {
    var items = [];
    var seen = {};
    var cat = (p && p.category) || 'phone';

    function pushItem(rawUrl, opts) {
      if (!isValidLocalMedia(rawUrl)) return;
      var upgradedUrl = (window.VLU_UPGRADE_PRODUCT_IMG || function (u) { return u; })(rawUrl);
      if (!isValidLocalMedia(upgradedUrl)) return;
      var key = normalizeMediaKey(upgradedUrl);
      if (!key || seen[key]) return;
      seen[key] = true;
      var resolved = resolveImgUrl(upgradedUrl, cat);
      items.push({
        src: resolved,
        rawSrc: upgradedUrl,
        label: opts.label || 'Mặc định',
        colorName: opts.colorName || opts.label || 'Mặc định',
        colorKey: opts.colorKey || 'variant-' + items.length,
        isColor: Boolean(opts.isColor)
      });
    }

    // 1. Toàn bộ biến thể màu sắc chuẩn từ p.colors[]
    (p.colors || []).forEach(function (c, idx) {
      var cUrl = c.image || c.img;
      pushItem(cUrl, {
        label: c.name || ('Bản màu ' + (idx + 1)),
        colorName: c.name || ('Bản màu ' + (idx + 1)),
        colorKey: c.key || ('color-' + idx),
        isColor: true
      });
    });

    // 2. Ảnh phụ khai báo tường minh trong p.extraImages[]
    (p.extraImages || []).forEach(function (extra, idx) {
      var exSrc = (typeof extra === 'string') ? extra : extra.src;
      var exLabel = (typeof extra === 'string') ? ('Góc chụp ' + (items.length + 1)) : (extra.label || ('Góc chụp ' + (items.length + 1)));
      pushItem(exSrc, {
        label: exLabel,
        colorName: exLabel,
        colorKey: (extra && extra.key) || ('extra-' + idx),
        isColor: false
      });
    });

    // 3. Toàn bộ ảnh thực tế hiện có trong thư mục SanPham/ của model qua Image Manifest
    var manifestImgs = findImagesInManifest(p.id);
    if (!manifestImgs.length && p.name) {
      manifestImgs = findImagesInManifest(p.name);
    }
    manifestImgs.forEach(function (mImg, idx) {
      var url = mImg && mImg.url;
      if (!url || /-hero\.(png|webp|jpg)$/i.test(url)) return;
      // Bỏ qua biến thể cắt thô Position 2 nếu iPad Pro M5 đã có cutout chuẩn
      if (p.id === 'ipad-pro-m5' && /ipad_pro_13-in_m5_wifi_space_black_pdp_image_position_2/i.test(url)) return;
      pushItem(url, {
        label: 'Góc chụp ' + (items.length + 1),
        colorName: 'Góc chụp ' + (items.length + 1),
        colorKey: 'angle-' + idx,
        isColor: false
      });
    });

    // Fallback về p.image nếu vẫn rỗng
    if (!items.length && isValidLocalMedia(p.image)) {
      pushItem(p.image, { label: 'Mặc định', colorName: 'Mặc định', colorKey: 'default', isColor: true });
    }
    if (!items.length) {
      var fallbackUrl = 'frontend/assets/images/placeholders/' + (cat || 'phone') + '.svg';
      items.push({ src: fallbackUrl, rawSrc: fallbackUrl, label: 'Mặc định', colorName: 'Mặc định', colorKey: 'default', isColor: true });
    }
    return items;
  }

  function renderThumbnailStrip(p, items) {
    var thumbStrip = document.getElementById('thumbnailStrip');
    if (!thumbStrip) return;
    var cat = (p && p.category) || 'phone';
    var placeholder = 'frontend/assets/images/placeholders/' + cat + '.svg';
    var html = '';
    items.forEach(function (item, idx) {
      var isFirst = idx === 0;
      html += '<button type="button" class="thumb-btn' + (isFirst ? ' active is-active' : '') + '"'
        + ' data-index="' + idx + '"'
        + ' data-src="' + escapeAttr(item.src) + '"'
        + ' data-color-name="' + escapeAttr(item.colorName) + '"'
        + ' data-color-key="' + escapeAttr(item.colorKey) + '"'
        + ' data-is-color="' + (item.isColor ? '1' : '0') + '"'
        + ' aria-current="' + (isFirst ? 'true' : 'false') + '"'
        + ' aria-label="Xem ảnh ' + escapeAttr(item.label) + '">'
        + '<img src="' + escapeAttr(item.src) + '" alt="' + escapeAttr(p.name + ' - ' + item.label) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + escapeAttr(placeholder) + '\';">'
        + '</button>';
    });
    thumbStrip.innerHTML = html;
  }

  function renderVideoTrigger(p) {
    var videoBtn = document.getElementById('galleryVideoBtn');
    var videoEl = document.getElementById('mainProductVideo');
    var rawVideo = p && (p.video || p.videoUrl);
    var hasValidVideo = isValidLocalMedia(rawVideo);
    if (!videoBtn) return;
    if (hasValidVideo) {
      videoBtn.classList.remove('hidden');
      videoBtn.dataset.videoSrc = resolveImgUrl(rawVideo, p.category);
      if (videoEl) videoEl.src = videoBtn.dataset.videoSrc;
    } else {
      videoBtn.classList.add('hidden');
      delete videoBtn.dataset.videoSrc;
      toggleVideoMode(false);
    }
  }

  function toggleVideoMode(enable) {
    var canvas = document.getElementById('galleryCanvas');
    var mainImg = document.getElementById('mainProductImg');
    var videoEl = document.getElementById('mainProductVideo');
    var videoBtn = document.getElementById('galleryVideoBtn');
    var zoomHint = document.getElementById('galleryZoomHint');
    isVideoActive = Boolean(enable && videoEl && videoEl.getAttribute('src'));

    if (videoEl) {
      if (isVideoActive) {
        videoEl.classList.remove('hidden');
        try { videoEl.play(); } catch (e) {}
      } else {
        try { videoEl.pause(); } catch (e) {}
        videoEl.classList.add('hidden');
      }
    }
    if (mainImg) mainImg.classList.toggle('hidden', isVideoActive);
    if (canvas) {
      canvas.classList.remove('is-zooming');
      canvas.classList.toggle('is-zoom-ready', !isVideoActive);
    }
    if (zoomHint) zoomHint.classList.toggle('hidden', isVideoActive);
    if (videoBtn) {
      videoBtn.classList.toggle('border-brand', isVideoActive);
      videoBtn.classList.toggle('text-brand', isVideoActive);
    }
  }

  function updateGalleryNavControls() {
    var len = galleryItems.length || 1;
    var counterEl = document.getElementById('galleryCounterBadge');
    if (counterEl) counterEl.textContent = (currentSlideIndex + 1) + ' / ' + len;

    var prevBtn = document.getElementById('galleryPrevBtn');
    var nextBtn = document.getElementById('galleryNextBtn');
    if (prevBtn) prevBtn.classList.toggle('hidden', len <= 1);
    if (nextBtn) nextBtn.classList.toggle('hidden', len <= 1);
  }

  // Khởi tạo Render
  renderProduct(product);

  // Bảo đảm ảnh hiện tại luôn có giá trị dự phòng
  currentImg = currentImg || (galleryItems[0] && galleryItems[0].src) || (product.colors && product.colors[0] && (product.colors[0].image || product.colors[0].img)) || '';

  // Toast Function
  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  function syncActiveColorState(colorName, colorImg, colorKey) {
    currentColor = colorName;
    currentColorKey = colorKey || 'default';
    var matchedColor = (product.colors || []).find(function (c) {
      return (colorKey && c.key === colorKey) || (c.name === colorName);
    });
    if (matchedColor) currentColorObj = matchedColor;
    else currentColorObj = { name: colorName, key: colorKey || 'default', image: colorImg };

    if (colorImg) currentImg = colorImg;
    var selectedColorLabel = document.getElementById('selectedColorName');
    if (selectedColorLabel) selectedColorLabel.textContent = colorName;

    document.querySelectorAll('.color-swatch-btn').forEach(function (b) {
      var active = (b.dataset.colorKey === colorKey) || (b.dataset.colorName === colorName);
      b.classList.toggle('active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    updatePricingStockAndSkuUI(false);
    sync3DColorFromSelection(colorName, colorKey);
  }

  function setGallerySlide(targetIndex, opts) {
    if (!galleryItems.length) return;
    opts = opts || {};
    var len = galleryItems.length;
    var nextIdx = ((targetIndex % len) + len) % len;
    var slide = galleryItems[nextIdx];
    currentSlideIndex = nextIdx;

    if (isVideoActive) toggleVideoMode(false);

    var canvas = document.getElementById('galleryCanvas');
    var mainImg = document.getElementById('mainProductImg');
    var imageColorLabel = document.getElementById('imageColorLabel');

    if (canvas) canvas.classList.remove('is-zooming');
    if (imageColorLabel) {
      imageColorLabel.textContent = slide.isColor ? slide.colorName : (slide.label + ' (' + currentColor + ')');
    }

    if (mainImg && slide.src) {
      clearTimeout(switchTimer);
      if (opts.animate !== false) {
        mainImg.classList.add('is-switching');
        switchTimer = setTimeout(function () {
          mainImg.src = slide.src;
          mainImg.alt = product.name + ' - ' + slide.label;
          mainImg.onerror = function () {
            this.onerror = null;
            this.src = 'frontend/assets/images/placeholders/' + (product ? product.category : 'phone') + '.svg';
          };
          requestAnimationFrame(function () {
            mainImg.classList.remove('is-switching');
          });
        }, 125);
      } else {
        mainImg.classList.remove('is-switching');
        mainImg.src = slide.src;
        mainImg.alt = product.name + ' - ' + slide.label;
      }
    }

    // Đồng bộ dải Thumbnails & cuộn thumbnail đang chọn vào tầm nhìn
    var activeThumb = null;
    document.querySelectorAll('#thumbnailStrip .thumb-btn').forEach(function (btn, idx) {
      var active = idx === nextIdx;
      btn.classList.toggle('active', active);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
      if (active) activeThumb = btn;
    });
    if (activeThumb && opts.scrollThumb !== false && typeof activeThumb.scrollIntoView === 'function') {
      try {
        activeThumb.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'nearest', block: 'nearest' });
      } catch (e) {}
    }

    // Đồng bộ màu sắc mua hàng nếu slide tương ứng phiên bản màu (hoặc khi click Swatch)
    if (slide.isColor || opts.forceColorSync) {
      syncActiveColorState(slide.colorName, slide.src, slide.colorKey);
    }

    updateGalleryNavControls();
    if (lightboxOpen) updateLightboxUI();
  }

  // 6.1 Đổi Màu Sắc & Thumbnail tương thích ngược
  function changeColor(colorName, colorImg, colorKey) {
    var matchedIdx = -1;
    var normTarget = normalizeMediaKey(colorImg);
    for (var i = 0; i < galleryItems.length; i++) {
      var it = galleryItems[i];
      if ((colorKey && it.colorKey === colorKey) || (colorName && it.colorName === colorName) || (normTarget && normalizeMediaKey(it.rawSrc) === normTarget)) {
        matchedIdx = i;
        break;
      }
    }
    if (matchedIdx !== -1) {
      setGallerySlide(matchedIdx, { forceColorSync: true, scrollThumb: view3D.mode !== '3d' });
    } else {
      var resolvedColorImg = resolveImgUrl(colorImg, product ? product.category : 'phone');
      syncActiveColorState(colorName, resolvedColorImg, colorKey);
      var mainImg = document.getElementById('mainProductImg');
      if (mainImg && resolvedColorImg) {
        mainImg.src = resolvedColorImg;
        mainImg.alt = product.name + ' - ' + colorName;
      }
    }
  }

  // 6.2 Interactive Mouse-Hover Lens/Pan Zoom trên Desktop
  (function initInteractiveStageZoom() {
    var canvas = document.getElementById('galleryCanvas');
    if (!canvas) return;
    var isFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isFinePointer) {
      canvas.addEventListener('mousemove', function (e) {
        if (isVideoActive) return;
        if (e.target && e.target.closest && e.target.closest('[data-gallery-ui]')) {
          canvas.classList.remove('is-zooming');
          return;
        }
        var rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var xPct = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
        var yPct = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
        canvas.style.setProperty('--zoom-x', xPct.toFixed(2) + '%');
        canvas.style.setProperty('--zoom-y', yPct.toFixed(2) + '%');
        canvas.classList.add('is-zooming');
      });

      canvas.addEventListener('mouseleave', function () {
        canvas.classList.remove('is-zooming');
        canvas.style.setProperty('--zoom-x', '50%');
        canvas.style.setProperty('--zoom-y', '50%');
      });
    }

    canvas.addEventListener('click', function (e) {
      if (isVideoActive) return;
      if (e.target && e.target.closest && e.target.closest('[data-gallery-ui]')) return;
      openLightbox(currentSlideIndex);
    });

    // Hỗ trợ vuốt trái / phải trên khung ảnh chính cho Mobile & Tablet
    var touchStartX = 0;
    var touchStartY = 0;
    canvas.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    canvas.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches[0] || galleryItems.length <= 1 || isVideoActive) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        setGallerySlide(currentSlideIndex + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
  })();

  // 6.3 Fullscreen Lightbox Image Viewer
  function buildLightboxThumbs() {
    var lbThumbs = document.getElementById('lightboxThumbs');
    if (!lbThumbs) return;
    var html = '';
    galleryItems.forEach(function (item, idx) {
      html += '<button type="button" class="pd-lightbox-thumb' + (idx === currentSlideIndex ? ' is-active' : '') + '"'
        + ' data-lb-index="' + idx + '"'
        + ' aria-label="Xem ảnh ' + escapeAttr(item.label) + '">'
        + '<img src="' + escapeAttr(item.src) + '" alt="' + escapeAttr(item.label) + '">'
        + '</button>';
    });
    lbThumbs.innerHTML = html;
  }

  function setLightboxZoom(zoomOn) {
    var lbCanvas = document.getElementById('lightboxCanvas');
    var zoomBtn = document.getElementById('lightboxZoomToggleBtn');
    lightboxZoomed = Boolean(zoomOn);
    if (lbCanvas) {
      lbCanvas.classList.toggle('is-zoomed', lightboxZoomed);
      if (!lightboxZoomed) {
        lbCanvas.style.setProperty('--lb-zoom-x', '50%');
        lbCanvas.style.setProperty('--lb-zoom-y', '50%');
      }
    }
    if (zoomBtn) zoomBtn.setAttribute('aria-pressed', lightboxZoomed ? 'true' : 'false');
  }

  function updateLightboxUI() {
    var slide = galleryItems[currentSlideIndex];
    if (!slide) return;
    var lbTitle = document.getElementById('lightboxTitle');
    var lbSub = document.getElementById('lightboxSubtitle');
    var lbCounter = document.getElementById('lightboxCounter');
    var lbImg = document.getElementById('lightboxImg');
    var lbPrev = document.getElementById('lightboxPrevBtn');
    var lbNext = document.getElementById('lightboxNextBtn');

    if (lbTitle) lbTitle.textContent = product.name;
    if (lbSub) lbSub.textContent = slide.label;
    if (lbCounter) lbCounter.textContent = (currentSlideIndex + 1) + ' / ' + galleryItems.length;
    if (lbImg) {
      lbImg.src = slide.src;
      lbImg.alt = product.name + ' - ' + slide.label;
    }
    if (lbPrev) lbPrev.classList.toggle('hidden', galleryItems.length <= 1);
    if (lbNext) lbNext.classList.toggle('hidden', galleryItems.length <= 1);

    document.querySelectorAll('#lightboxThumbs .pd-lightbox-thumb').forEach(function (t, idx) {
      var active = idx === currentSlideIndex;
      t.classList.toggle('is-active', active);
      if (active && typeof t.scrollIntoView === 'function') {
        try { t.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' }); } catch (e) {}
      }
    });
  }

  function openLightbox(startIdx) {
    var modal = document.getElementById('galleryLightboxModal');
    if (!modal || !galleryItems.length) return;
    if (typeof startIdx === 'number' && startIdx >= 0 && startIdx < galleryItems.length) {
      currentSlideIndex = startIdx;
    }
    lightboxOpen = true;
    setLightboxZoom(false);
    buildLightboxThumbs();
    updateLightboxUI();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
    var closeBtn = document.getElementById('lightboxCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    var modal = document.getElementById('galleryLightboxModal');
    if (!modal || !lightboxOpen) return;
    lightboxOpen = false;
    setLightboxZoom(false);
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    setTimeout(function () {
      if (!lightboxOpen) modal.classList.add('hidden');
    }, 220);
  }

  (function bindLightboxInteractions() {
    var lbCanvas = document.getElementById('lightboxCanvas');
    var lbSwipeStartX = 0;
    if (lbCanvas) {
      lbCanvas.addEventListener('mousemove', function (e) {
        if (!lightboxZoomed) return;
        var rect = lbCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var xPct = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
        var yPct = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
        lbCanvas.style.setProperty('--lb-zoom-x', xPct.toFixed(2) + '%');
        lbCanvas.style.setProperty('--lb-zoom-y', yPct.toFixed(2) + '%');
      });
      lbCanvas.addEventListener('click', function () {
        setLightboxZoom(!lightboxZoomed);
      });
      lbCanvas.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches[0]) lbSwipeStartX = e.touches[0].clientX;
      }, { passive: true });
      lbCanvas.addEventListener('touchend', function (e) {
        if (!e.changedTouches || !e.changedTouches[0] || galleryItems.length <= 1 || lightboxZoomed) return;
        var dx = e.changedTouches[0].clientX - lbSwipeStartX;
        if (Math.abs(dx) > 42) {
          setGallerySlide(currentSlideIndex + (dx < 0 ? 1 : -1));
        }
      }, { passive: true });
    }

    document.addEventListener('keydown', function (e) {
      if (view3D.fullscreen && e.key === 'Escape') {
        e.preventDefault();
        set3DFullscreen(false);
        return;
      }
      if (reviewModalOpen && e.key === 'Escape') {
        e.preventDefault();
        closeReviewModal();
        return;
      }
      if (policyModalOpen && e.key === 'Escape') {
        e.preventDefault();
        closePolicyModal();
        return;
      }
      if (!lightboxOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setGallerySlide(currentSlideIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setGallerySlide(currentSlideIndex + 1);
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        setLightboxZoom(!lightboxZoomed);
      }
    });
  })();

  function copyVoucherCode(code, btnEl) {
    if (!code) return;
    function markCopied() {
      if (btnEl) {
        var orig = btnEl.textContent;
        btnEl.textContent = 'Đã chép ✓';
        btnEl.classList.add('is-copied');
        setTimeout(function () {
          btnEl.textContent = orig;
          btnEl.classList.remove('is-copied');
        }, 1800);
      }
      if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
        window.VLU_CART.showToast('Đã sao chép mã "' + code + '" — áp dụng ngay ở Giỏ hàng!');
      } else {
        showToast('Đã sao chép mã "' + code + '"!');
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(markCopied).catch(function () {
        markCopied();
      });
    } else {
      try {
        var ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (err) {}
      markCopied();
    }
  }

  function handleCurrentProductCartAction(isBuyNow, triggerBtn) {
    var av = resolveAvailability(product, currentColorObj, currentVariantObj, currentPrice);
    if (!av.purchasable) {
      if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
        window.VLU_CART.showToast(av.unavailableText, true);
      } else {
        showToast(av.unavailableText);
      }
      return;
    }

    var safeQty = Math.max(1, Math.min(currentQuantity, av.maxQty || 99));
    if (isBuyNow) {
      try {
        if (window.VLU_AUTH && typeof window.VLU_AUTH.ensureGuestSession === 'function') {
          window.VLU_AUTH.ensureGuestSession();
        }
      } catch (errAuth) {}
    }

    var itemPayload = {
      id: product.id,
      name: product.name,
      category: product.category || rawCat,
      color: currentColor,
      variant: currentVariant,
      price: currentPrice,
      oldPrice: product.oldPrice ? (Number(product.oldPrice) + (currentPrice - Number(product.basePrice))) : null,
      image: currentImg || (product.colors && product.colors[0] && (product.colors[0].image || product.colors[0].img)) || '',
      quantity: safeQty
    };

    try {
      if (window.VLU_CART) {
        window.VLU_CART.addItem(itemPayload);
        window.VLU_CART.updateBadge(true);
        window.VLU_CART.emitUpdate();
        if (!isBuyNow) {
          if (typeof window.VLU_SHOW_CART_FEEDBACK === 'function') {
            window.VLU_SHOW_CART_FEEDBACK(itemPayload, triggerBtn);
          } else {
            window.VLU_CART.showToast('Đã thêm "' + product.name + ' (' + currentColor + ' - ' + currentVariant + ' ×' + safeQty + ')" vào giỏ hàng!');
          }
        }
      } else if (!isBuyNow) {
        var cartBadge = document.getElementById('cartCount');
        if (cartBadge) {
          cartBadge.textContent = (parseInt(cartBadge.textContent, 10) || 0) + safeQty;
        }
        showToast('Đã thêm "' + product.name + ' (' + currentColor + ' - ' + currentVariant + ' ×' + safeQty + ')" vào giỏ hàng!');
      }
    } catch (errCart) {
      console.warn('Không thể cập nhật giỏ hàng:', errCart);
    }

    if (isBuyNow) {
      window.location.href = 'checkout.html';
    }
  }

  document.addEventListener('click', function (e) {
    // Cuộn mượt xuống khu vực đánh giá khi click Meta Rating
    var ratingMetaBtn = e.target.closest('#pdRatingMetaBtn');
    if (ratingMetaBtn) {
      var revSec = document.getElementById('pdReviewsSection') || document.getElementById('pdSpecsSection');
      if (revSec) revSec.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    // Sao chép mã giảm giá hợp lệ
    var copyBtn = e.target.closest('[data-copy-voucher]');
    if (copyBtn) {
      copyVoucherCode(copyBtn.getAttribute('data-copy-voucher'), copyBtn);
      return;
    }

    // Mở Modal Chi tiết Ưu đãi & Cam kết dịch vụ
    var policyTrigger = e.target.closest('[data-policy-key]');
    if (policyTrigger) {
      openPolicyModal(policyTrigger.getAttribute('data-policy-key'));
      return;
    }
    if (e.target.closest('#pdPolicyCloseBtn') || e.target.closest('#pdPolicyDoneBtn') || e.target.id === 'pdPolicyBackdrop') {
      closePolicyModal();
      return;
    }

    // Bật / Thu gọn từng nhóm Thông số Kỹ thuật (Accordion)
    var groupHead = e.target.closest('.pd-spec-group-head');
    if (groupHead) {
      var groupCard = groupHead.closest('.pd-spec-group-card');
      if (groupCard) {
        var collapsed = groupCard.classList.toggle('is-collapsed');
        groupHead.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      }
      return;
    }

    // Mở rộng / Thu gọn toàn bộ các nhóm Thông số phụ
    var specToggleAll = e.target.closest('#pdSpecToggleAllBtn');
    if (specToggleAll) {
      var extraWrap = document.getElementById('pdSpecGroupsExtra');
      var toggleLbl = document.getElementById('pdSpecToggleLabel');
      if (extraWrap) {
        var expanded = extraWrap.classList.toggle('is-expanded');
        specToggleAll.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        if (toggleLbl) toggleLbl.textContent = expanded ? 'Thu gọn bảng thông số' : 'Xem toàn bộ thông số chi tiết';
      }
      return;
    }

    // Mở Modal bảng thông số tóm tắt nhanh
    var specModalBtn = e.target.closest('#pdSpecModalBtn');
    if (specModalBtn) {
      openFullSpecsModal();
      return;
    }

    // Cuộn tới chương tương ứng trong bài viết Editorial
    var tocBtn = e.target.closest('[data-editorial-target]');
    if (tocBtn) {
      var targetId = tocBtn.getAttribute('data-editorial-target');
      var edBody = document.getElementById('pdEditorialBody');
      var edToggleBtn = document.getElementById('pdEditorialToggleBtn');
      var edToggleLbl = document.getElementById('pdEditorialToggleLabel');
      if (edBody && edBody.classList.contains('is-collapsed')) {
        edBody.classList.remove('is-collapsed');
        if (edToggleBtn) edToggleBtn.setAttribute('aria-expanded', 'true');
        if (edToggleLbl) edToggleLbl.textContent = 'Thu gọn bài viết';
      }
      var chapterEl = targetId && document.getElementById(targetId);
      if (chapterEl) {
        setTimeout(function () {
          chapterEl.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        }, 60);
      }
      return;
    }

    // Xem thêm / Thu gọn bài viết Giới thiệu & Mô tả chi tiết
    var edToggle = e.target.closest('#pdEditorialToggleBtn');
    if (edToggle) {
      var bodyEl = document.getElementById('pdEditorialBody');
      var lblEl = document.getElementById('pdEditorialToggleLabel');
      if (bodyEl) {
        var nowCollapsed = bodyEl.classList.toggle('is-collapsed');
        edToggle.setAttribute('aria-expanded', nowCollapsed ? 'false' : 'true');
        if (lblEl) lblEl.textContent = nowCollapsed ? 'Xem thêm bài viết chi tiết' : 'Thu gọn bài viết';
      }
      return;
    }

    // Đồng bộ Wishlist giữa Gallery, Action row, Mobile & Desktop Sticky Bar sau khi main.js xử lý toggleWishlist
    var wishTrigger = e.target.closest('#pdWishBtn, #pdWishActionBtn, #pdMobileStickyWishBtn, #pdDesktopStickyWishBtn');
    if (wishTrigger) {
      setTimeout(function () {
        var pressed = wishTrigger.getAttribute('aria-pressed') === 'true';
        syncAllWishlistButtons(pressed);
      }, 20);
      return;
    }

    // Bộ chọn Số lượng (- / +) giới hạn theo tồn kho thực tế
    var qtyMinus = e.target.closest('#qtyMinusBtn');
    if (qtyMinus) {
      var avMinus = resolveAvailability(product, currentColorObj, currentVariantObj, currentPrice);
      if (avMinus.purchasable && currentQuantity > 1) {
        currentQuantity -= 1;
        updatePricingStockAndSkuUI(false);
      }
      return;
    }
    var qtyPlus = e.target.closest('#qtyPlusBtn');
    if (qtyPlus) {
      var avPlus = resolveAvailability(product, currentColorObj, currentVariantObj, currentPrice);
      if (avPlus.purchasable && currentQuantity < avPlus.maxQty) {
        currentQuantity += 1;
        updatePricingStockAndSkuUI(false);
      } else if (avPlus.purchasable) {
        showToast('Số lượng đạt giới hạn tồn kho hiện có (' + avPlus.maxQty + ' máy).');
      }
      return;
    }

    // Điều hướng Prev / Next trên khung ảnh chính
    var prevBtn = e.target.closest('#galleryPrevBtn');
    if (prevBtn) {
      setGallerySlide(currentSlideIndex - 1);
      return;
    }
    var nextBtn = e.target.closest('#galleryNextBtn');
    if (nextBtn) {
      setGallerySlide(currentSlideIndex + 1);
      return;
    }

    // Nút Phóng to Toàn màn hình
    var fsBtn = e.target.closest('#galleryFullscreenBtn');
    if (fsBtn) {
      openLightbox(currentSlideIndex);
      return;
    }

    // Nút Video giới thiệu (nếu sản phẩm có trường video thực tế)
    var videoBtn = e.target.closest('#galleryVideoBtn');
    if (videoBtn) {
      toggleVideoMode(!isVideoActive);
      return;
    }

    // Điều khiển bên trong Lightbox Modal
    if (e.target.closest('#lightboxCloseBtn') || e.target.id === 'lightboxBackdrop') {
      closeLightbox();
      return;
    }
    if (e.target.closest('#lightboxPrevBtn')) {
      setLightboxZoom(false);
      setGallerySlide(currentSlideIndex - 1);
      return;
    }
    if (e.target.closest('#lightboxNextBtn')) {
      setLightboxZoom(false);
      setGallerySlide(currentSlideIndex + 1);
      return;
    }
    if (e.target.closest('#lightboxZoomToggleBtn')) {
      setLightboxZoom(!lightboxZoomed);
      return;
    }
    var lbThumb = e.target.closest('.pd-lightbox-thumb');
    if (lbThumb) {
      setLightboxZoom(false);
      var lbIdx = parseInt(lbThumb.dataset.lbIndex, 10);
      if (!isNaN(lbIdx)) setGallerySlide(lbIdx);
      return;
    }

    // Click Nút Màu
    var swatch = e.target.closest('.color-swatch-btn');
    if (swatch) {
      changeColor(swatch.dataset.colorName, swatch.dataset.img, swatch.dataset.colorKey);
      return;
    }

    // Click Thumbnail dưới khung ảnh chính
    var thumb = e.target.closest('.thumb-btn');
    if (thumb) {
      var idx = parseInt(thumb.dataset.index, 10);
      if (!isNaN(idx)) {
        setGallerySlide(idx);
      } else {
        changeColor(thumb.dataset.colorName, thumb.dataset.src, thumb.dataset.colorKey);
      }
      return;
    }

    // Click Chọn Phiên Bản / Dung Lượng / Cấu Hình
    var storageBtn = e.target.closest('.storage-btn');
    if (storageBtn) {
      document.querySelectorAll('.storage-btn').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      storageBtn.classList.add('active');
      storageBtn.setAttribute('aria-checked', 'true');

      var vIdx = parseInt(storageBtn.dataset.variantIndex, 10);
      var matchedVar = (!isNaN(vIdx) && product.variants && product.variants[vIdx]) ? product.variants[vIdx] : null;
      var label = storageBtn.dataset.label;
      var delta = parseInt(storageBtn.dataset.delta, 10) || 0;
      var discount = storageBtn.dataset.discount;

      currentVariant = label;
      currentVariantObj = matchedVar || { label: label, delta: delta, discount: discount };

      var selectedVariantName = document.getElementById('selectedVariantName');
      if (selectedVariantName) selectedVariantName.textContent = label;

      updatePricingStockAndSkuUI(true);
      return;
    }

    // Click Nút Thêm Vào Giỏ Hàng (Chính, Mobile Sticky Bar & Desktop Floating Bar)
    var addBtn = e.target.closest('#addToCartBtn, #pdMobileStickyAddBtn, #pdDesktopStickyAddBtn');
    if (addBtn) {
      handleCurrentProductCartAction(false, addBtn);
      return;
    }

    // Click Nút Mua Ngay (Chính, Mobile Sticky Bar & Desktop Floating Bar)
    var buyBtn = e.target.closest('#buyNowBtn, #pdMobileStickyBuyBtn, #pdDesktopStickyBuyBtn');
    if (buyBtn) {
      e.preventDefault();
      handleCurrentProductCartAction(true, buyBtn);
      return;
    }

    // PART 4: Mở / Đóng Modal Viết đánh giá, chọn sao, lọc sao & zoom ảnh đánh giá
    if (e.target.closest('#pdOpenReviewModalBtn')) {
      openReviewModal();
      return;
    }
    if (e.target.closest('#pdReviewModalCloseBtn') || e.target.closest('#pdReviewCancelBtn') || e.target.id === 'pdReviewModalBackdrop') {
      closeReviewModal();
      return;
    }
    var starPickBtn = e.target.closest('#pdStarPicker .pd-star-pick-btn');
    if (starPickBtn) {
      updateStarPickerUI(starPickBtn.getAttribute('data-star-val'));
      return;
    }
    if (e.target.closest('#pdReviewRemoveImgBtn')) {
      pendingReviewImageBase64 = '';
      var imgInput = document.getElementById('pdReviewImageInput');
      var previewWrap = document.getElementById('pdReviewImagePreviewWrap');
      var previewEl = document.getElementById('pdReviewImagePreview');
      if (imgInput) imgInput.value = '';
      if (previewEl) previewEl.src = '';
      if (previewWrap) {
        previewWrap.classList.add('hidden');
        previewWrap.classList.remove('flex');
      }
      return;
    }
    var reviewFilterBtn = e.target.closest('[data-review-filter]');
    if (reviewFilterBtn) {
      activeReviewFilter = reviewFilterBtn.getAttribute('data-review-filter') || 'all';
      renderProductReviewsSection(product);
      return;
    }
    var zoomRevImg = e.target.closest('[data-zoom-review-img]');
    if (zoomRevImg) {
      openReviewImagePreviewModal(zoomRevImg.getAttribute('src'), zoomRevImg.getAttribute('alt'));
      return;
    }

    // PART 4: Accordion Câu hỏi thường gặp (FAQ)
    var faqTrigger = e.target.closest('[data-faq-trigger]');
    if (faqTrigger) {
      var faqItem = faqTrigger.closest('.pd-faq-item');
      if (faqItem) {
        var nowOpen = faqItem.classList.toggle('is-open');
        faqTrigger.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
      }
      return;
    }

    // PART 4: Tab lọc Sản phẩm liên quan
    var relTabBtn = e.target.closest('[data-related-tab]');
    if (relTabBtn) {
      renderRelatedProductsSection(product, relTabBtn.getAttribute('data-related-tab'));
      return;
    }

    // PART 4: Carousel Sản phẩm đã xem gần đây (Prev / Next / Xóa lịch sử)
    if (e.target.closest('#pdRecentPrevBtn')) {
      var trackPrev = document.getElementById('pdRecentTrack');
      if (trackPrev) {
        trackPrev.scrollBy({ left: -Math.max(260, trackPrev.clientWidth * 0.8), behavior: 'smooth' });
      }
      return;
    }
    if (e.target.closest('#pdRecentNextBtn')) {
      var trackNext = document.getElementById('pdRecentTrack');
      if (trackNext) {
        trackNext.scrollBy({ left: Math.max(260, trackNext.clientWidth * 0.8), behavior: 'smooth' });
      }
      return;
    }
    if (e.target.closest('#pdClearRecentBtn')) {
      var clearCtx = getAuthContext();
      writeSyncedRecentlyViewedIds(clearCtx.userId, []);
      try { localStorage.setItem('vlu_sync_timestamp', String(Date.now())); } catch (errSync) {}
      renderRecentlyViewedSection(product);
      showToast('Đã xóa lịch sử sản phẩm đã xem.');
      return;
    }
  });

  // PART 4: Xử lý thay đổi Sắp xếp đánh giá & Upload ảnh FileReader
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'pdReviewSortSelect') {
      activeReviewSort = e.target.value || 'newest';
      renderProductReviewsSection(product);
      return;
    }
    if (e.target && e.target.id === 'pdReviewImageInput') {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      compressAndReadReviewImage(file, function (base64Url) {
        pendingReviewImageBase64 = base64Url;
        var previewWrap = document.getElementById('pdReviewImagePreviewWrap');
        var previewEl = document.getElementById('pdReviewImagePreview');
        if (previewEl) previewEl.src = base64Url;
        if (previewWrap) {
          previewWrap.classList.remove('hidden');
          previewWrap.classList.add('flex');
        }
      });
    }
  });

  // PART 4: Xử lý Submit Form Viết đánh giá, Đặt câu hỏi Q&A & Admin Trả lời Q&A
  document.addEventListener('submit', function (e) {
    var reviewForm = e.target && e.target.id === 'pdReviewForm' ? e.target : null;
    if (reviewForm) {
      e.preventDefault();
      var ratingVal = Math.max(1, Math.min(5, parseInt((document.getElementById('pdReviewRatingInput') || {}).value, 10) || 5));
      var authorInput = document.getElementById('pdReviewAuthorInput');
      var commentInput = document.getElementById('pdReviewCommentInput');
      var commentText = String((commentInput && commentInput.value) || '').trim();
      if (commentText.length < 5) {
        showToast('Nội dung nhận xét cần tối thiểu 5 ký tự.');
        return;
      }

      try {
        if (!localStorage.getItem('vlu_user') && window.VLU_AUTH && typeof window.VLU_AUTH.ensureGuestSession === 'function') {
          window.VLU_AUTH.ensureGuestSession();
        }
      } catch (errAuth) {}

      var ctx = getAuthContext();
      var authorName = String((authorInput && authorInput.value) || '').trim() || ctx.displayName || 'Khách hàng VLU';
      var tags = Array.prototype.slice.call(reviewForm.querySelectorAll('input[name="pdReviewTags"]:checked')).map(function (el) {
        return String(el.value || '').trim();
      }).filter(Boolean);

      var matchedOrder = findMatchedOrderForCurrentUser(ctx, product);
      var reviewId = matchedOrder ? (String(matchedOrder.id) + ':' + product.id) : ('REV-' + Date.now() + ':' + product.id);
      var newReview = {
        id: reviewId,
        productId: product.id,
        name: product.name,
        orderId: matchedOrder ? String(matchedOrder.id) : '',
        reviewerName: authorName,
        avatar: ctx.avatar || '',
        rating: ratingVal,
        comment: commentText,
        tags: tags,
        image: pendingReviewImageBase64 || '',
        createdAt: new Date().toISOString()
      };

      try {
        var accStore = JSON.parse(localStorage.getItem(ctx.accountKey) || '{}');
        if (!accStore || typeof accStore !== 'object' || Array.isArray(accStore)) accStore = {};
        if (!Array.isArray(accStore.reviews)) accStore.reviews = [];
        if (matchedOrder) {
          accStore.reviews = accStore.reviews.filter(function (rv) { return rv && rv.id !== reviewId; });
        }
        accStore.reviews.push(newReview);
        localStorage.setItem(ctx.accountKey, JSON.stringify(accStore));
        localStorage.setItem('vlu_sync_timestamp', String(Date.now()));
      } catch (errSave) {
        showToast('Không thể lưu đánh giá vào bộ nhớ trình duyệt.');
        return;
      }

      if (commentInput) commentInput.value = '';
      reviewForm.querySelectorAll('input[name="pdReviewTags"]').forEach(function (el) { el.checked = false; });
      pendingReviewImageBase64 = '';
      var fInput = document.getElementById('pdReviewImageInput');
      var fPreviewWrap = document.getElementById('pdReviewImagePreviewWrap');
      var fPreviewImg = document.getElementById('pdReviewImagePreview');
      if (fInput) fInput.value = '';
      if (fPreviewImg) fPreviewImg.src = '';
      if (fPreviewWrap) {
        fPreviewWrap.classList.add('hidden');
        fPreviewWrap.classList.remove('flex');
      }

      activeReviewFilter = 'all';
      activeReviewSort = 'newest';
      var sortEl = document.getElementById('pdReviewSortSelect');
      if (sortEl) sortEl.value = 'newest';

      closeReviewModal();
      renderProductReviewsSection(product);
      renderRelatedProductsSection(product, activeRelatedTab);
      renderRecentlyViewedSection(product);
      showToast('Đã gửi đánh giá thành công và đồng bộ lên hệ thống!');
      return;
    }

    var qaForm = e.target && e.target.id === 'pdQaForm' ? e.target : null;
    if (qaForm) {
      e.preventDefault();
      var qTopic = (document.getElementById('pdQaTopicSelect') || {}).value || 'Cấu hình & Hiệu năng';
      var qAuthorEl = document.getElementById('pdQaAuthorInput');
      var qInputEl = document.getElementById('pdQaQuestionInput');
      var questionText = String((qInputEl && qInputEl.value) || '').trim();
      if (questionText.length < 8) {
        showToast('Nội dung câu hỏi cần tối thiểu 8 ký tự.');
        return;
      }

      var qaCtx = getAuthContext();
      var qAuthor = String((qAuthorEl && qAuthorEl.value) || '').trim() || qaCtx.displayName || 'Khách hàng VLU';
      var qaList = readQaList(product.id);
      qaList.push({
        id: 'QA-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        productId: product.id,
        topic: qTopic,
        question: questionText,
        authorName: qAuthor,
        authorId: qaCtx.userId,
        createdAt: new Date().toISOString(),
        answer: null
      });
      saveQaList(product.id, qaList);
      if (qInputEl) qInputEl.value = '';
      renderQaSection(product);
      showToast('Câu hỏi của bạn đã được ghi nhận!');
      return;
    }

    var replyForm = e.target && e.target.closest ? e.target.closest('[data-qa-reply-id]') : null;
    if (replyForm) {
      e.preventDefault();
      var replyCtx = getAuthContext();
      if (!replyCtx.isAdmin) {
        showToast('Chỉ tài khoản Quản trị viên mới có quyền phản hồi trực tiếp.');
        return;
      }
      var targetQaId = replyForm.getAttribute('data-qa-reply-id');
      var replyTextarea = replyForm.querySelector('[name="adminReplyText"]');
      var replyText = String((replyTextarea && replyTextarea.value) || '').trim();
      if (replyText.length < 5) {
        showToast('Nội dung phản hồi cần tối thiểu 5 ký tự.');
        return;
      }
      var listForReply = readQaList(product.id);
      var updatedAny = false;
      listForReply.forEach(function (qItem) {
        if (qItem && qItem.id === targetQaId) {
          qItem.answer = {
            text: replyText,
            responderName: 'VLU Flagship Store · Quản trị viên',
            responderRole: 1,
            answeredAt: new Date().toISOString()
          };
          updatedAny = true;
        }
      });
      if (updatedAny) {
        saveQaList(product.id, listForReply);
        renderQaSection(product);
        showToast('Đã đăng phản hồi Quản trị viên thành công!');
      }
    }
  });

  // Cập nhật trạng thái nút Prev/Next cho Carousel Đã xem gần đây
  var recentTrackEl = document.getElementById('pdRecentTrack');
  if (recentTrackEl) {
    recentTrackEl.addEventListener('scroll', updateRecentCarouselNavState, { passive: true });
    window.addEventListener('resize', updateRecentCarouselNavState);
  }

  // PART 5: Desktop Floating Quick-Buy Bar (#pdDesktopStickyBar) trượt mượt khi cuộn qua cụm mua hàng chính
  (function initDesktopStickyBarObserver() {
    var desktopBar = document.getElementById('pdDesktopStickyBar');
    var actionsCluster = document.querySelector('.pd-actions-cluster');
    if (!desktopBar || !actionsCluster) return;

    function updateDesktopStickyVisibility() {
      var isDesktop = window.innerWidth >= 1024;
      if (!isDesktop || lightboxOpen || reviewModalOpen || policyModalOpen) {
        desktopBar.classList.remove('is-visible');
        desktopBar.setAttribute('aria-hidden', 'true');
        return;
      }
      var header = document.getElementById('site-header');
      var headerBottom = header ? Math.max(64, Math.round(header.getBoundingClientRect().bottom)) : 108;
      desktopBar.style.setProperty('--pd-sticky-top', headerBottom + 'px');

      var buyTarget = document.getElementById('buyNowBtn') || actionsCluster;
      var rect = buyTarget.getBoundingClientRect();
      var shouldShow = rect.bottom < headerBottom + 4;
      desktopBar.classList.toggle('is-visible', shouldShow);
      desktopBar.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    }

    var rafScheduled = false;
    function scheduleCheck() {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(function () {
        rafScheduled = false;
        updateDesktopStickyVisibility();
      });
    }

    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck);
    document.addEventListener('click', function () {
      setTimeout(scheduleCheck, 40);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') setTimeout(scheduleCheck, 40);
    });
    scheduleCheck();
  })();

  // Lắng nghe sự kiện đồng bộ từ Admin & các tab khác (Storage & BroadcastChannel)
  function onAdminSyncProduct() {
    if (typeof window.VLU_SYNC_PRODUCTS === 'function') {
      window.VLU_SYNC_PRODUCTS();
    }
    var refreshed = window.VLU_FIND_PRODUCT ? window.VLU_FIND_PRODUCT(rawId || rawName || product.id) : null;
    if (refreshed) {
      product = refreshed;
      renderProduct(product);
    } else if (product) {
      refresh3DAvailability(product);
    }
  }

  window.addEventListener('storage', function (e) {
    if (e.key === 'vlu_sync_timestamp' || e.key === 'vlu_admin_products' || e.key === 'vlu_products') {
      onAdminSyncProduct();
      return;
    }
    if (e.key === 'vlu_admin_models_3d') {
      if (product) refresh3DAvailability(product);
      return;
    }
    if (e.key === 'vlu_user' || (e.key && (e.key.indexOf('vlu_account_') === 0 || e.key.indexOf('vlu_recently_viewed_') === 0 || e.key.indexOf('vlu_product_qa_') === 0 || e.key.indexOf('vlu_orders') === 0))) {
      renderProductReviewsSection(product);
      renderQaSection(product);
      renderRelatedProductsSection(product, activeRelatedTab);
      renderRecentlyViewedSection(product);
      ['pdWishBtn', 'pdWishActionBtn', 'pdMobileStickyWishBtn', 'pdDesktopStickyWishBtn'].forEach(function (wId) {
        var wBtn = document.getElementById(wId);
        if (wBtn) syncPdWishlistBtn(product.id, wBtn);
      });
    }
  });

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      var pdSyncBc = new BroadcastChannel('vlu_store_sync');
      pdSyncBc.onmessage = function () {
        onAdminSyncProduct();
      };
    }
  } catch (eBc) {}

})();
