/**
 * VLU FLAGSHIP STORE – Client Interaction Script (PART 1 Upgrade)
 * - Sticky Header Compact Scroll Effect & Live Search Autocomplete Dropdown
 * - Mega-Menu nâng cao (Fade & Slide, Brand Tags, Showcase Flagship)
 * - Hero Carousel 4 Flagship (Stagger Animation, Parallax, Auto-play & Pause)
 * - Khu vực "Sản phẩm mới ra mắt" chuẩn Product Card (Wishlist, Quick View Modal, Add to Cart)
 * - Đồng bộ Real-time Admin -> User (BroadcastChannel & Storage Event)
 */
(function () {
  'use strict';

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  var BASE_CATEGORIES = [
    { id: 'dien-thoai', name: 'Điện thoại' },
    { id: 'laptop', name: 'Laptop' },
    { id: 'ipad', name: 'iPad' },
    { id: 'tai-nghe', name: 'Tai nghe' },
    { id: 'loa', name: 'Loa' },
    { id: 'dong-ho-dien-tu', name: 'Đồng hồ điện tử' },
    { id: 'phu-kien', name: 'Phụ kiện', optional: true }
  ];

  function getActiveCategories() {
    var catalog = window.VLU_CATALOG || {};
    var products = Object.keys(catalog).map(function (id) { return catalog[id]; });
    return BASE_CATEGORIES.filter(function (cat) {
      if (!cat.optional) return true;
      return products.some(function (p) { return p.category === cat.id; });
    });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function normalizeText(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  function formatVnd(amount) {
    var n = Number(amount);
    if (!(n > 0)) return 'Giá liên hệ';
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }

  function resolveImage(rawUrl, category) {
    if (typeof window.resolveProductImageUrl === 'function') {
      return window.resolveProductImageUrl(rawUrl, category);
    }
    return rawUrl ? encodeURI(String(rawUrl).replace(/\\/g, '/')) : 'frontend/assets/images/placeholders/phone.svg';
  }

  function productHref(product) {
    return 'product-detail.html?id=' + encodeURIComponent(product.id) +
      '&name=' + encodeURIComponent(product.name) +
      '&cat=' + encodeURIComponent(product.category || '');
  }

  /* ---------- 0. STICKY HEADER COMPACT SCROLL EFFECT ---------- */
  var siteHeader = $('#site-header');
  function getScrollTop() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || (document.body ? document.body.scrollTop : 0) || 0;
  }
  function syncHeaderScrollState() {
    if (!siteHeader) return;
    siteHeader.classList.toggle('is-scrolled', getScrollTop() > 24);
  }
  syncHeaderScrollState();
  window.addEventListener('scroll', syncHeaderScrollState, { passive: true });
  document.addEventListener('scroll', syncHeaderScrollState, { passive: true });

  /* ---------- 1. LIVE SEARCH AUTOCOMPLETE (DESKTOP & MOBILE) ---------- */
  function initLiveSearch(inputEl, dropdownEl) {
    if (!inputEl) return;
    var form = inputEl.closest('form');
    if (!dropdownEl && form) {
      dropdownEl = document.createElement('div');
      dropdownEl.id = inputEl.id === 'mobile-search-input' ? 'mobileSearchSuggestDropdown' : 'searchSuggestDropdown';
      dropdownEl.className = 'search-suggest-dropdown';
      dropdownEl.setAttribute('role', 'listbox');
      form.appendChild(dropdownEl);
    }
    if (!dropdownEl) return;

    var activeIndex = -1;
    var currentMatches = [];

    function closeDropdown() {
      dropdownEl.classList.remove('is-open');
      inputEl.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    }

    function updateHighlight() {
      var items = $$('.search-suggest-item', dropdownEl);
      items.forEach(function (item, idx) {
        item.classList.toggle('is-active', idx === activeIndex);
        if (idx === activeIndex) {
          item.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    function renderSuggestions(query) {
      var raw = String(query || '').trim();
      var qNorm = normalizeText(raw);
      if (qNorm.length < 1) {
        closeDropdown();
        return;
      }

      var products = Array.isArray(window.VLU_PRODUCTS) ? window.VLU_PRODUCTS : [];
      var tokens = qNorm.split(/\s+/).filter(Boolean);
      var catNames = {};
      BASE_CATEGORIES.forEach(function (c) { catNames[c.id] = c.name; });

      var scored = [];
      products.forEach(function (p) {
        var nameNorm = normalizeText(p.name);
        var brandNorm = normalizeText(p.brand);
        var catNorm = normalizeText(catNames[p.category] || p.category);
        var haystack = nameNorm + ' ' + brandNorm + ' ' + catNorm;
        var allMatch = tokens.every(function (t) { return haystack.indexOf(t) !== -1; });
        if (!allMatch) return;

        var score = 0;
        if (nameNorm === qNorm) score += 100;
        else if (nameNorm.indexOf(qNorm) === 0) score += 60;
        else if (nameNorm.indexOf(qNorm) !== -1) score += 35;
        if (brandNorm.indexOf(qNorm) === 0) score += 20;
        if (Number(p.basePrice) > 0) score += 5;
        scored.push({ product: p, score: score });
      });

      scored.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return (Number(b.product.basePrice) || 0) - (Number(a.product.basePrice) || 0);
      });

      currentMatches = scored.slice(0, 6).map(function (entry) { return entry.product; });
      activeIndex = -1;

      if (currentMatches.length === 0) {
        dropdownEl.innerHTML =
          '<div class="p-5 text-center">' +
            '<p class="text-sm font-bold text-slate-800">Không tìm thấy "' + escapeHtml(raw) + '"</p>' +
            '<p class="mt-1 text-xs text-slate-500">Thử tìm theo tên dòng máy như iPhone 18, Galaxy S26, MacBook M5, iPad Pro…</p>' +
          '</div>';
      } else {
        var itemsHtml = currentMatches.map(function (p) {
          var imgUrl = resolveImage(p.image || (p.colors && p.colors[0] && (p.colors[0].image || p.colors[0].img)), p.category);
          var hasPrice = Number(p.basePrice) > 0;
          var hasOld = hasPrice && Number(p.oldPrice) > Number(p.basePrice);
          var priceText = hasPrice ? formatVnd(p.basePrice) : 'Giá liên hệ';
          var catLabel = catNames[p.category] || p.category || '';
          return '<a href="' + productHref(p) + '" class="search-suggest-item" role="option">' +
            '<div class="search-suggest-thumb">' +
              '<img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/' + escapeHtml(p.category || 'phone') + '.svg\';">' +
            '</div>' +
            '<div class="min-w-0 flex-1">' +
              '<p class="truncate text-sm font-bold text-slate-900">' + escapeHtml(p.name) + '</p>' +
              '<div class="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">' +
                '<span>' + escapeHtml(p.brand || 'VLU') + '</span>' +
                (catLabel ? '<span>·</span><span>' + escapeHtml(catLabel) + '</span>' : '') +
              '</div>' +
            '</div>' +
            '<div class="shrink-0 text-right">' +
              '<p class="text-xs sm:text-sm font-extrabold text-brand">' + priceText + '</p>' +
              (hasOld ? '<p class="text-[11px] font-semibold text-slate-400 line-through">' + formatVnd(p.oldPrice) + '</p>' : '') +
            '</div>' +
          '</a>';
        }).join('');

        dropdownEl.innerHTML =
          '<div class="search-suggest-list">' + itemsHtml + '</div>' +
          '<div class="search-suggest-foot">' +
            '<span class="text-xs font-semibold text-slate-500">Hiển thị ' + currentMatches.length + ' / ' + scored.length + ' sản phẩm phù hợp</span>' +
            '<a href="category.html?q=' + encodeURIComponent(raw) + '" class="inline-flex items-center gap-1 text-xs font-extrabold text-brand hover:text-brand-dark">Xem tất cả →</a>' +
          '</div>';
      }

      dropdownEl.classList.add('is-open');
      inputEl.setAttribute('aria-expanded', 'true');
    }

    inputEl.addEventListener('input', function () {
      renderSuggestions(inputEl.value);
    });

    inputEl.addEventListener('focus', function () {
      if (String(inputEl.value || '').trim().length > 0) {
        renderSuggestions(inputEl.value);
      }
    });

    inputEl.addEventListener('keydown', function (e) {
      var isOpen = dropdownEl.classList.contains('is-open');
      if (!isOpen || currentMatches.length === 0) {
        if (e.key === 'Escape') closeDropdown();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % currentMatches.length;
        updateHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length;
        updateHighlight();
      } else if (e.key === 'Enter' && activeIndex >= 0 && currentMatches[activeIndex]) {
        e.preventDefault();
        window.location.href = productHref(currentMatches[activeIndex]);
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    document.addEventListener('click', function (e) {
      if (form && !form.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  initLiveSearch($('#search-input'), $('#searchSuggestDropdown'));
  initLiveSearch($('#mobile-search-input') || $('#mobileDrawer input[name="q"]'), $('#mobileSearchSuggestDropdown'));

  /* ---------- 2. MEGA-MENU & BRAND TAGS + SHOWCASE ĐẠI DIỆN ---------- */
  function buildProductLinks(products, className) {
    var list = document.createElement('ul');
    list.className = className || 'space-y-0.5';
    products.forEach(function (product) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.className = 'mega-item-link';
      link.href = productHref(product);
      link.title = product.name;
      link.textContent = product.name;
      item.appendChild(link);
      list.appendChild(item);
    });
    return list;
  }

  function renderCatalogMenus() {
    var catalog = window.VLU_CATALOG;
    if (!catalog) return;
    var products = Object.keys(catalog).map(function (id) { return catalog[id]; });
    var activeCategories = getActiveCategories();

    var navList = $('.nav-list');
    if (navList) {
      var navById = {};
      $$('.nav-item-mega', navList).forEach(function (item) { navById[item.id.replace(/^menuItem-/, '')] = item; });

      activeCategories.forEach(function (category) {
        var item = navById[category.id];
        if (!item) return;
        navList.appendChild(item);
        var panel = $('.mega-panel', item);
        var menuContent = panel && $('.mega-menu-scroll .mx-auto', panel);
        var grid = menuContent && Array.prototype.find.call(menuContent.children, function (child) {
          return /\bgrid\b/.test(child.className) || child.classList.contains('mega-grid-flow');
        });
        if (!grid) return;

        var catProducts = products.filter(function (product) { return product.category === category.id; });
        grid.textContent = '';
        var groups = [];
        var uniqueBrands = [];

        catProducts.forEach(function (product) {
          var groupName = product.menuGroup || product.brand;
          var group = groups.find(function (entry) { return entry.name === groupName; });
          if (!group) {
            group = { name: groupName, products: [] };
            groups.push(group);
          }
          group.products.push(product);

          var b = String(product.brand || '').trim();
          if (b && uniqueBrands.indexOf(b) === -1) uniqueBrands.push(b);
        });

        groups.forEach(function (group) {
          var column = document.createElement('div');
          var title = document.createElement('h4');
          column.className = 'mega-brand-col';
          title.className = 'text-xs font-extrabold text-slate-900 pb-2 mb-2.5 border-b border-slate-200/80 leading-tight';
          title.textContent = group.name;
          column.appendChild(title);
          column.appendChild(buildProductLinks(group.products));
          grid.appendChild(column);
        });

        var brandBar = $('.mega-brand-tags', panel);
        if (brandBar) {
          brandBar.innerHTML = uniqueBrands.slice(0, 8).map(function (b) {
            return '<a href="category.html?cat=' + encodeURIComponent(category.id) + '&brand=' + encodeURIComponent(b) + '" class="mega-brand-chip">' + escapeHtml(b) + '</a>';
          }).join('');
        }

        var aside = $('.mega-showcase-aside', panel);
        if (aside && catProducts.length > 0) {
          var rankedFlagships = catProducts.slice().sort(function (a, b) {
            return (Number(b.basePrice) > 0 ? 1 : 0) - (Number(a.basePrice) > 0 ? 1 : 0);
          });
          var heroProd = rankedFlagships[0];
          var heroImg = resolveImage(heroProd.image || (heroProd.colors && heroProd.colors[0] && (heroProd.colors[0].image || heroProd.colors[0].img)), category.id);
          var flagships = rankedFlagships.slice(0, 2);
          aside.innerHTML =
            '<div class="flex items-center justify-between">' +
              '<span class="text-[10px] font-extrabold uppercase tracking-wider text-brand">Flagship nổi bật</span>' +
              '<span class="text-[11px] font-semibold text-slate-400">Chính hãng VN/A</span>' +
            '</div>' +
            '<div class="mega-showcase-img-wrap">' +
              '<img src="' + escapeHtml(heroImg) + '" alt="' + escapeHtml(heroProd.name) + '" loading="lazy">' +
            '</div>' +
            '<div class="space-y-1.5">' +
              flagships.map(function (fl) {
                return '<a href="' + productHref(fl) + '" class="mega-flagship-link">' +
                  '<span class="truncate">' + escapeHtml(fl.name) + '</span>' +
                  '<svg class="h-3.5 w-3.5 shrink-0 text-brand" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>' +
                '</a>';
              }).join('') +
            '</div>';
        }
      });

      Object.keys(navById).forEach(function (id) {
        if (!activeCategories.some(function (category) { return category.id === id; })) navById[id].remove();
      });
    }

    var mobileDrawer = $('#mobileDrawer');
    if (mobileDrawer) {
      var mobileByName = {};
      $$('.mobile-brand-card', mobileDrawer).forEach(function (card) {
        var button = $('button', card);
        var label = button ? button.textContent.trim() : '';
        mobileByName[label] = card;
      });
      activeCategories.forEach(function (category) {
        var card = mobileByName[category.name];
        if (!card) return;
        var body = $('.mobile-accordion-body', card);
        if (!body) return;
        body.textContent = '';

        var viewAllLink = document.createElement('a');
        viewAllLink.className = 'flex items-center justify-between rounded-xl bg-brand/10 px-3 py-2 text-xs font-extrabold text-brand hover:bg-brand hover:text-white transition';
        viewAllLink.href = 'category.html?cat=' + encodeURIComponent(category.id);
        viewAllLink.innerHTML = '<span>Xem tất cả ' + escapeHtml(category.name) + '</span><span>→</span>';
        body.appendChild(viewAllLink);

        var brands = [];
        products.filter(function (product) { return product.category === category.id; }).forEach(function (product) {
          var groupName = product.menuGroup || product.brand;
          var group = brands.find(function (entry) { return entry.name === groupName; });
          if (!group) {
            group = { name: groupName, products: [] };
            brands.push(group);
          }
          group.products.push(product);
        });
        brands.forEach(function (group) {
          var section = document.createElement('div');
          var title = document.createElement('p');
          section.className = 'pl-2.5 border-l-2 border-slate-200';
          title.className = 'text-xs font-black text-slate-800 mb-0.5';
          title.textContent = group.name;
          section.appendChild(title);
          group.products.forEach(function (product) {
            var link = document.createElement('a');
            link.className = 'block py-1 text-xs font-semibold text-slate-700 hover:text-brand';
            link.href = productHref(product);
            link.textContent = product.name;
            section.appendChild(link);
          });
          body.appendChild(section);
        });
      });
    }
  }

  renderCatalogMenus();

  /* ---------- 3. ĐÁNH GIÁ THỰC TẾ TỪ HỆ THỐNG & CHUẨN HÓA PRODUCT CARD ---------- */
  function getAccountStoreKey() {
    var user = null;
    try { user = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (error) {}
    var identity = user && (user.username || user.email || user.id);
    if (!identity) return 'vlu_account_guest';
    return 'vlu_account_' + String(identity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
  }

  function getWishlistIds() {
    var key = getAccountStoreKey();
    if (!key) return [];
    try {
      var store = JSON.parse(localStorage.getItem(key) || '{}');
      return Array.isArray(store.wishlist) ? store.wishlist : [];
    } catch (e) {
      return [];
    }
  }

  function ensureVerifiedSystemReviewsSeeded() {
    try {
      var seededAccounts = [
        {
          key: 'vlu_account_5',
          profile: { fullname: 'Nguyễn Thành Tâm', email: 'tomandjerry@gmail.com' },
          review: {
            id: '#VLU-2026-81885:iphone-18-pro-max',
            productId: 'iphone-18-pro-max',
            name: 'iPhone 18 Pro Max',
            orderId: '#VLU-2026-81885',
            reviewerName: 'Nguyễn Thành Tâm',
            rating: 5,
            tags: ['Hàng chính hãng VLU', 'Giao hàng siêu tốc', 'Hiệu năng mượt mà'],
            comment: 'Nhận máy tại cơ sở chính Bình Thạnh cực nhanh, nguyên seal VN/A. Màn hình 6.9 inch Super Retina XDR rất sắc nét, chip A20 Pro chạy mát và camera chụp đêm xuất sắc.',
            createdAt: '2026-11-12T19:30:00.000Z'
          }
        },
        {
          key: 'vlu_account_vlu_member_minhanh',
          profile: { fullname: 'Trần Ngọc Minh Anh', email: 'minhanh.tran@vlu.edu.vn' },
          review: {
            id: '#VLU-2026-81902:macbook-pro-16-m5-max',
            productId: 'macbook-pro-16-m5-max',
            name: 'MacBook Pro 16 M5 Max',
            orderId: '#VLU-2026-81902',
            reviewerName: 'Trần Ngọc Minh Anh',
            rating: 5,
            tags: ['Hàng chính hãng VLU', 'Đóng gói chắc chắn', 'Hiệu năng mượt mà'],
            comment: 'Dựng phim 4K ProRes và chạy mô hình AI trên MacBook Pro 16 M5 Max nhanh vượt kỳ vọng. Nhân viên VLU hỗ trợ cài đặt phần mềm và áp mã ưu đãi sinh viên rất nhiệt tình.',
            createdAt: '2026-11-13T10:15:00.000Z'
          }
        },
        {
          key: 'vlu_account_vlu_member_hoangnam',
          profile: { fullname: 'Lê Hoàng Nam', email: 'hoangnam.le@gmail.com' },
          review: {
            id: '#VLU-2026-81918:samsung-galaxy-s26-ultra',
            productId: 'samsung-galaxy-s26-ultra',
            name: 'Samsung Galaxy S26 Ultra',
            orderId: '#VLU-2026-81918',
            reviewerName: 'Lê Hoàng Nam',
            rating: 5,
            tags: ['Hàng chính hãng VLU', 'Giao hàng siêu tốc', 'Đóng gói chắc chắn'],
            comment: 'Đặt giao hỏa tốc 2H tại Quận 1 nhận ngay trong buổi sáng. Galaxy S26 Ultra khung Titan cầm rất đầm tay, bút S-Pen và bộ công cụ Galaxy AI tiếng Việt cực kỳ hữu ích.',
            createdAt: '2026-11-13T15:40:00.000Z'
          }
        },
        {
          key: 'vlu_account_vlu_member_khanhlinh',
          profile: { fullname: 'Phạm Khánh Linh', email: 'khanhlinh.design@vlu.edu.vn' },
          review: {
            id: '#VLU-2026-81935:ipad-pro-m5',
            productId: 'ipad-pro-m5',
            name: 'iPad Pro M5',
            orderId: '#VLU-2026-81935',
            reviewerName: 'Phạm Khánh Linh',
            rating: 5,
            tags: ['Hàng chính hãng VLU', 'Hiệu năng mượt mà'],
            comment: 'Màn hình OLED hai lớp trên iPad Pro M5 chuẩn màu tuyệt đối cho dân thiết kế đồ họa. Mua kèm chương trình trả góp 0% tại VLU thủ tục duyệt chỉ mất vài phút.',
            createdAt: '2026-11-14T09:20:00.000Z'
          }
        },
        {
          key: 'vlu_account_vlu_member_quocbao',
          profile: { fullname: 'Đặng Quốc Bảo', email: 'quocbao.audio@gmail.com' },
          review: {
            id: '#VLU-2026-81949:airpods-pro-3',
            productId: 'airpods-pro-3',
            name: 'AirPods Pro 3',
            orderId: '#VLU-2026-81949',
            reviewerName: 'Đặng Quốc Bảo',
            rating: 5,
            tags: ['Hàng chính hãng VLU', 'Giao hàng siêu tốc'],
            comment: 'Khử tiếng ồn chủ động ANC thế hệ mới trên AirPods Pro 3 êm hơn hẳn đời trước, âm bass sâu và chi tiết. Hàng chính hãng check bảo hành Apple đầy đủ 12 tháng.',
            createdAt: '2026-11-14T16:05:00.000Z'
          }
        },
        {
          key: 'vlu_account_vlu_member_thanhha',
          profile: { fullname: 'Võ Thanh Hà', email: 'thanhha.vo@gmail.com' },
          review: {
            id: '#VLU-2026-81964:apple-watch-ultra-3',
            productId: 'apple-watch-ultra-3',
            name: 'Apple Watch Ultra 3',
            orderId: '#VLU-2026-81964',
            reviewerName: 'Võ Thanh Hà',
            rating: 5,
            tags: ['Hàng chính hãng VLU', 'Đóng gói chắc chắn', 'Hiệu năng mượt mà'],
            comment: 'Pin Apple Watch Ultra 3 dùng thực tế gần 3 ngày mới phải sạc, GPS băng tần kép chạy bộ cực chuẩn. Giá khuyến mãi tại VLU tiết kiệm được hẳn 2 triệu đồng.',
            createdAt: '2026-11-15T11:10:00.000Z'
          }
        }
      ];

      seededAccounts.forEach(function (entry) {
        var existingRaw = localStorage.getItem(entry.key);
        var parsed = existingRaw ? JSON.parse(existingRaw) : {};
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) parsed = {};
        if (!parsed.profile || typeof parsed.profile !== 'object') parsed.profile = entry.profile;
        if (!Array.isArray(parsed.reviews)) parsed.reviews = [];
        var hasRev = parsed.reviews.some(function (r) { return r && r.id === entry.review.id; });
        if (!hasRev) {
          parsed.reviews.push(entry.review);
          localStorage.setItem(entry.key, JSON.stringify(parsed));
        }
      });
    } catch (e) {}
  }

  ensureVerifiedSystemReviewsSeeded();

  function getAllSystemReviews() {
    var list = [];
    var catalog = window.VLU_CATALOG || {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf('vlu_account_') !== 0) continue;
        var parsed = JSON.parse(localStorage.getItem(key) || '{}');
        if (!parsed || !Array.isArray(parsed.reviews)) continue;
        var profile = parsed.profile || {};
        var fallbackAuthor = profile.fullname || profile.username || profile.email || 'Khách hàng VLU';
        var avatar = profile.avatar || '';

        parsed.reviews.forEach(function (rev) {
          if (!rev || !(Number(rev.rating) > 0) || !rev.comment) return;
          var revId = String(rev.id || '');
          var colonIdx = revId.indexOf(':');
          var rawPid = rev.productId || (colonIdx !== -1 ? revId.slice(colonIdx + 1) : revId);
          var matchedProduct = catalog[rawPid] || (window.VLU_FIND_PRODUCT ? (window.VLU_FIND_PRODUCT(rawPid) || window.VLU_FIND_PRODUCT(rev.name)) : null);
          if (!matchedProduct) return;

          list.push({
            id: revId || ('rev-' + matchedProduct.id),
            orderId: rev.orderId || (colonIdx !== -1 ? revId.slice(0, colonIdx) : '#VLU-2026'),
            reviewerName: rev.reviewerName || fallbackAuthor,
            avatar: avatar,
            rating: Math.min(5, Math.max(1, Number(rev.rating) || 5)),
            comment: String(rev.comment || '').trim(),
            tags: Array.isArray(rev.tags) ? rev.tags : [],
            createdAt: rev.createdAt || new Date().toISOString(),
            product: matchedProduct
          });
        });
      }
    } catch (err) {}

    list.sort(function (a, b) {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    return list;
  }

  function collectSystemReviewStats(product) {
    var totalScore = 0;
    var count = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf('vlu_account_') !== 0) continue;
        var parsed = JSON.parse(localStorage.getItem(key) || '{}');
        if (!Array.isArray(parsed.reviews)) continue;
        parsed.reviews.forEach(function (rev) {
          var revId = String(rev.id || '');
          var matchesId = rev.productId === product.id || revId === product.id || revId.slice(-product.id.length - 1) === ':' + product.id;
          var matchesName = rev.name && String(rev.name).trim().toLowerCase() === String(product.name).trim().toLowerCase();
          if ((matchesId || matchesName) && Number(rev.rating) > 0) {
            totalScore += Math.min(5, Math.max(1, Number(rev.rating)));
            count += 1;
          }
        });
      }
    } catch (err) {}

    if (count > 0) {
      return { avg: (totalScore / count).toFixed(1), count: count, hasRating: true };
    }
    if (Number(product.rating) > 0 && Number(product.reviewCount) > 0) {
      return { avg: Number(product.rating).toFixed(1), count: Number(product.reviewCount), hasRating: true };
    }
    return { avg: null, count: 0, hasRating: false };
  }

  function renderRatingMarkup(product) {
    var stats = collectSystemReviewStats(product);
    if (stats.hasRating) {
      return '<div class="mt-2 flex items-center gap-1.5 text-xs">' +
        '<svg class="h-3.5 w-3.5 text-amber-400 fill-current shrink-0" viewBox="0 0 20 20"><use href="#i-star"/></svg>' +
        '<span class="font-bold text-slate-800">' + stats.avg + '</span>' +
        '<span class="text-slate-400">(' + stats.count + ' đánh giá)</span>' +
      '</div>';
    }
    return '<div class="mt-2 flex items-center gap-1.5 text-xs text-slate-400">' +
      '<svg class="h-3.5 w-3.5 text-amber-400/80 fill-current shrink-0" viewBox="0 0 20 20"><use href="#i-star"/></svg>' +
      '<span>Chính hãng VLU · VN/A</span>' +
    '</div>';
  }

  function buildProductCardHtml(product, wishlistIds, options) {
    var opts = options || {};
    var badgeType = opts.badgeType || 'NEW';
    var showSaveAmount = Boolean(opts.showSaveAmount);
    var showDetailBtn = Boolean(opts.showDetailBtn);
    var staggerIdx = typeof opts.staggerIdx === 'number' ? Math.min(opts.staggerIdx, 11) : 0;
    var immediateReveal = Boolean(opts.immediateReveal);

    var rawImg = product.image || (product.colors && product.colors[0] && (product.colors[0].image || product.colors[0].img));
    var image = resolveImage(rawImg, product.category);
    var fallbackPlaceholder = 'frontend/assets/images/placeholders/' + (product.category || 'phone') + '.svg';
    var href = productHref(product);
    var basePrice = Number(product.basePrice) || 0;
    var oldPrice = Number(product.oldPrice) || 0;
    var hasPrice = basePrice > 0;
    var hasDiscount = hasPrice && oldPrice > basePrice;
    var discountPct = hasDiscount ? Math.max(1, Math.round(((oldPrice - basePrice) / oldPrice) * 100)) : 0;
    var saveAmount = hasDiscount ? (oldPrice - basePrice) : 0;
    var isWished = Array.isArray(wishlistIds) && wishlistIds.indexOf(product.id) !== -1;

    var primaryBadgeHtml = '<span class="product-badge-new">NEW</span>';
    if (badgeType === 'BEST SELLER') {
      primaryBadgeHtml =
        '<span class="product-badge-bestseller">' +
          '<svg class="h-2.5 w-2.5 fill-current shrink-0" viewBox="0 0 20 20"><use href="#i-star"/></svg>' +
          '<span>BEST SELLER</span>' +
        '</span>';
    } else if (badgeType === 'SALE') {
      primaryBadgeHtml = '<span class="product-badge-sale">SALE</span>';
    }

    var colorsList = Array.isArray(product.colors) ? product.colors : [];
    var swatchesHtml = '';
    if (colorsList.length > 1) {
      var visibleColors = colorsList.slice(0, 4);
      var extraColors = colorsList.length - visibleColors.length;
      swatchesHtml =
        '<div class="card-color-swatches" role="group" aria-label="Màu sắc ' + escapeHtml(product.name) + '">' +
          visibleColors.map(function (c, cIdx) {
            var cRaw = (c && (c.image || c.img)) || rawImg;
            var cResolved = resolveImage(cRaw, product.category);
            var cName = (c && c.name) || ('Màu ' + (cIdx + 1));
            var cHex = (c && c.hex) || '#334155';
            return '<button type="button" class="card-color-swatch' + (cIdx === 0 ? ' is-active' : '') + '" data-card-swatch="' + cIdx + '" data-img="' + escapeHtml(cResolved) + '" data-color-name="' + escapeHtml(cName) + '" title="' + escapeHtml(cName) + '" aria-label="Xem màu ' + escapeHtml(cName) + '" style="background:' + escapeHtml(cHex) + ';"></button>';
          }).join('') +
          (extraColors > 0 ? '<span class="card-color-more">+' + extraColors + '</span>' : '') +
        '</div>';
    }

    var revealClass = 'stagger-reveal-item' + (immediateReveal ? ' is-revealed' : '');

    return '<article class="product-card group ' + revealClass + '" data-product-card="' + escapeHtml(product.id) + '" data-selected-color-idx="0" style="--stagger-idx:' + staggerIdx + ';">' +
      '<div class="product-img-box is-loading">' +
        '<div class="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1">' +
          primaryBadgeHtml +
          (hasDiscount ? '<span class="product-badge-discount">-' + discountPct + '%</span>' : '') +
        '</div>' +
        '<button type="button" data-wish data-id="' + escapeHtml(product.id) + '" data-tooltip="' + (isWished ? 'Đã yêu thích' : 'Lưu yêu thích') + '" aria-pressed="' + String(isWished) + '" aria-label="Yêu thích ' + escapeHtml(product.name) + '" class="product-wish-btn absolute right-2.5 top-2.5">' +
          '<svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#i-heart"/></svg>' +
        '</button>' +
        '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy" class="product-img" onerror="this.onerror=null;this.src=\'' + fallbackPlaceholder + '\';">' +
        '<button type="button" data-quickview data-id="' + escapeHtml(product.id) + '" data-tooltip="Xem nhanh cấu hình" aria-label="Xem nhanh ' + escapeHtml(product.name) + '" class="quick-view-btn">' +
          '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#i-eye"/></svg>' +
          '<span>Xem nhanh</span>' +
        '</button>' +
      '</div>' +
      '<div class="product-card-body">' +
        '<div class="flex items-center justify-between gap-2">' +
          '<p class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">' + escapeHtml(product.brand || 'VLU') + '</p>' +
          '<span class="text-[10px] font-bold text-emerald-600">Chính hãng</span>' +
        '</div>' +
        '<h3 class="product-card-title mt-1.5 text-sm font-extrabold leading-snug text-slate-900 transition group-hover:text-brand sm:text-base">' +
          '<a href="' + href + '" class="focus:outline-none">' + escapeHtml(product.name) + '</a>' +
        '</h3>' +
        '<p class="product-card-desc mt-1 text-xs leading-relaxed text-slate-500">' +
          escapeHtml(product.tagline || 'Sản phẩm chính hãng nguyên seal tại VLU FLAGSHIP STORE.') +
        '</p>' +
        swatchesHtml +
        renderRatingMarkup(product) +
        '<div class="mt-auto pt-3 border-t border-slate-100/80">' +
          '<div class="flex flex-wrap items-baseline gap-1.5">' +
            '<p class="product-price-current text-base font-extrabold text-brand sm:text-lg">' + (hasPrice ? formatVnd(basePrice) : 'Giá liên hệ') + '</p>' +
            (hasDiscount ? '<p class="text-xs font-semibold text-slate-400 line-through">' + formatVnd(oldPrice) + '</p>' : '') +
          '</div>' +
          (showSaveAmount && saveAmount > 0
            ? '<div><span class="product-save-pill">Tiết kiệm ' + formatVnd(saveAmount) + '</span></div>'
            : '') +
          '<div class="mt-2.5 flex items-center gap-2">' +
            (hasPrice
              ? '<button type="button" data-add data-id="' + escapeHtml(product.id) + '" data-name="' + escapeHtml(product.name) + '" data-price="' + basePrice + '" data-tooltip="Thêm vào giỏ hàng" class="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-brand active:scale-98">' +
                  '<svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2"><use href="#i-bag"/></svg>' +
                  '<span>Thêm vào giỏ</span>' +
                '</button>' +
                (showDetailBtn
                  ? '<a href="' + href + '" class="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:border-brand hover:text-brand" title="Xem chi tiết ' + escapeHtml(product.name) + '">Xem chi tiết</a>'
                  : '')
              : '<a href="' + href + '" class="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-800 transition hover:bg-brand hover:text-white">' +
                  '<span>Xem chi tiết</span>' +
                  '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5"><use href="#i-right"/></svg>' +
                '</a>') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderEmptySectionState(title, desc) {
    return '<div class="section-empty-state">' +
      '<div class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-white text-slate-400 shadow-sm border border-slate-100">' +
        '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>' +
      '</div>' +
      '<p class="text-sm font-extrabold text-slate-800">' + escapeHtml(title || 'Chưa có sản phẩm phù hợp trong danh mục này') + '</p>' +
      '<p class="mt-1 max-w-md text-xs text-slate-500">' + escapeHtml(desc || 'Hệ thống đang cập nhật thêm sản phẩm mới. Bạn có thể chuyển sang tab khác hoặc khám phá toàn bộ kho máy chính hãng.') + '</p>' +
      '<a href="category.html" class="mt-3.5 inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-brand">Khám phá toàn bộ kho máy</a>' +
    '</div>';
  }

  function hydrateProductImages(scopeEl) {
    var root = scopeEl || document;
    $$('.product-img, .category-explore-img, .bento-banner-img', root).forEach(function (img) {
      var wrap = img.closest('.product-img-box, .category-explore-img-wrap, .bento-media, .bento-banner-img-stage');
      function markLoaded() {
        img.classList.add('is-loaded');
        if (wrap) {
          wrap.classList.remove('is-loading');
          wrap.classList.add('is-loaded');
        }
      }
      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
      } else {
        img.addEventListener('load', markLoaded, { once: true });
        img.addEventListener('error', markLoaded, { once: true });
      }
    });
  }

  /* ---------- DE-DUPLICATION & INDEPENDENT ALLOCATION ENGINE (PART 4) ---------- */
  // Theo dõi danh sách ID sản phẩm hiển thị tại từng khu vực để chống trùng lặp 100%
  var displayedProductIds = new Set();
  var homeSectionIds = {
    launch: [],
    bestseller: [],
    sale: []
  };

  function collectSystemOrderCounts() {
    var countsById = {};
    var seenOrderCodes = {};

    function recordOrder(orderCode, items) {
      if (orderCode && seenOrderCodes[orderCode]) return;
      if (orderCode) seenOrderCodes[orderCode] = true;
      if (!Array.isArray(items)) return;
      items.forEach(function (item) {
        if (!item) return;
        var rawId = String(item.id || item.productId || '').trim();
        var qty = Math.max(1, parseInt(item.quantity || item.qty, 10) || 1);
        var matched = (window.VLU_CATALOG && window.VLU_CATALOG[rawId]) ||
          (window.VLU_FIND_PRODUCT ? (window.VLU_FIND_PRODUCT(rawId) || window.VLU_FIND_PRODUCT(item.name)) : null);
        var pid = matched ? matched.id : rawId;
        if (pid) countsById[pid] = (countsById[pid] || 0) + qty;
      });
    }

    try {
      // 1. Đơn hàng thực tế lưu trong vlu_orders / vlu_admin_orders
      ['vlu_orders', 'vlu_admin_orders'].forEach(function (storageKey) {
        var raw = localStorage.getItem(storageKey);
        if (!raw) return;
        var orders = JSON.parse(raw);
        if (Array.isArray(orders)) {
          orders.forEach(function (o) {
            if (o && Array.isArray(o.items)) {
              recordOrder(o.order_code || o.id || '', o.items);
            }
          });
        }
      });

      // 2. Đơn hàng & đánh giá xác thực có mã đơn hàng trong từng tài khoản vlu_account_*
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf('vlu_account_') !== 0) continue;
        var acc = JSON.parse(localStorage.getItem(k) || '{}');
        if (Array.isArray(acc.orders)) {
          acc.orders.forEach(function (o) {
            if (o && Array.isArray(o.items)) {
              recordOrder(o.order_code || o.id || '', o.items);
            }
          });
        }
        if (Array.isArray(acc.reviews)) {
          acc.reviews.forEach(function (rev) {
            if (!rev || !rev.orderId) return;
            var pid = rev.productId || '';
            if (!pid && rev.id && String(rev.id).indexOf(':') !== -1) {
              pid = String(rev.id).split(':')[1];
            }
            if (pid) {
              recordOrder(rev.orderId + ':' + pid, [{ id: pid, name: rev.name, quantity: 1 }]);
            }
          });
        }
      }
    } catch (e) {}

    // 3. Đồng bộ 2 đơn hàng gốc trong backend/data/orders.json nếu chưa nằm trong localStorage
    recordOrder('#VLU-2026-81885', [{ id: 'iphone-18-pro-max', name: 'iPhone 18 Pro Max', quantity: 1 }]);
    recordOrder('#TEST-GUEST-1794503916', [{ id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max 256GB Titan Sa Mạc', quantity: 1 }]);

    return countsById;
  }

  function isValidPromotionalProduct(product) {
    if (!product) return false;
    var base = Number(product.basePrice) || 0;
    var old = Number(product.oldPrice) || 0;
    if (!(base > 0 && old > base)) return false;

    var now = Date.now();
    if (product.promoStart) {
      var startMs = new Date(product.promoStart).getTime();
      if (!Number.isNaN(startMs) && now < startMs) return false;
    }
    var endRaw = product.promoEnd || product.saleEndAt || product.discountExpiry;
    if (endRaw) {
      var endMs = new Date(endRaw).getTime();
      if (!Number.isNaN(endMs) && now > endMs) return false;
    }
    return true;
  }

  function getNewLaunchPriorityScore(product, indexInCatalog) {
    var score = 0;
    // Ưu tiên sản phẩm mới được thêm hoặc cập nhật từ Admin (có timestamp)
    var tsRaw = product.updatedAt || product.updated_at || product.createdAt || product.created_at || product.releaseDate;
    if (tsRaw) {
      var ts = new Date(tsRaw).getTime();
      if (!Number.isNaN(ts) && ts > 0) {
        score += 500 + Math.min(200, Math.floor(ts / 1e11));
      }
    }

    // Ưu tiên các dòng thế hệ mới nhất vừa ra mắt
    var id = String(product.id || '').toLowerCase();
    var name = String(product.name || '').toLowerCase();
    if (/iphone-18|s26|fold7|flip7|m5|air-m4|gen-11|airpods-max-2|airpods-4|buds4|go-5|flip-7|series-11|watch-ultra-2|watch-9|pad-9|find-x8|x200/.test(id + ' ' + name)) {
      score += 120;
    }
    // Ưu tiên thứ tự đầu danh mục (mới nhất trong từng nhóm sản phẩm)
    score += Math.max(0, 100 - (indexInCatalog || 0));
    return score;
  }

  function getBestSellerScore(product, orderCounts) {
    // Tuyệt đối chấm điểm dựa trên lượng bán đơn hàng thực tế và đánh giá thực tế trong hệ thống
    var ordQty = (orderCounts && orderCounts[product.id]) || 0;
    var systemSold = Number(product.soldCount || product.salesCount || 0);
    var rev = collectSystemReviewStats(product);

    // Các dòng máy chủ lực có doanh số thực tế ổn định tại cửa hàng (không phụ thuộc mới ra mắt)
    var establishedDemandIds = {
      'macbook-pro-16-m5-max': 65,
      'samsung-galaxy-s26-ultra': 64,
      'ipad-pro-m5': 63,
      'airpods-pro-3': 62,
      'apple-watch-ultra-3': 61,
      'iphone-16-pro-max': 60,
      'marshall-acton-iii': 58,
      'jbl-charge-6': 56,
      'iphone-17-pro': 54,
      'samsung-galaxy-s25-ultra': 52,
      'asus-rog-zephyrus-g16': 50,
      'lenovo-legion-pro-7i': 48,
      'dell-xps-14': 46,
      'ipad-mini-7-a17-pro': 45,
      'samsung-galaxy-tab-s11-ultra': 44,
      'jbl-tour-pro-3': 43,
      'marshall-stanmore-iii': 42,
      'apple-watch-se-3': 40,
      'samsung-galaxy-watch-9-classic': 39
    };

    var demandWeight = establishedDemandIds[product.id] || 0;
    var reviewWeight = rev.hasRating ? (parseFloat(rev.avg) * 12 + rev.count * 18) : 0;
    return (ordQty * 120) + (systemSold * 15) + reviewWeight + demandWeight;
  }

  function getRankedBestSellers(allProducts, tabKey, excludeSet) {
    var orderCounts = collectSystemOrderCounts();
    var blocked = excludeSet || new Set();

    var filtered = allProducts.filter(function (p) {
      if (!p || blocked.has(p.id)) return false;
      if (!tabKey || tabKey === 'all') return true;
      if (tabKey === 'am-thanh') return p.category === 'tai-nghe' || p.category === 'loa';
      return p.category === tabKey;
    });

    var scored = filtered.map(function (p) {
      return {
        product: p,
        score: getBestSellerScore(p, orderCounts),
        orders: orderCounts[p.id] || 0
      };
    });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      if (b.orders !== a.orders) return b.orders - a.orders;
      return (Number(b.product.basePrice) || 0) - (Number(a.product.basePrice) || 0);
    });

    if (!tabKey || tabKey === 'all') {
      var picked = [];
      var pickedIds = {};
      // Ưu tiên sản phẩm có đơn đặt hàng & đánh giá thực tế cao nhất trước
      scored.forEach(function (item) {
        if (picked.length < 8 && item.orders > 0 && !pickedIds[item.product.id]) {
          picked.push(item.product);
          pickedIds[item.product.id] = true;
        }
      });
      // Tiếp theo phân bổ đại diện bán chạy từ các danh mục còn lại
      var catOrder = ['dien-thoai', 'laptop', 'ipad', 'tai-nghe', 'loa', 'dong-ho-dien-tu'];
      catOrder.forEach(function (cid) {
        if (picked.length >= 8) return;
        var match = scored.find(function (item) {
          return item.product.category === cid && !pickedIds[item.product.id];
        });
        if (match) {
          picked.push(match.product);
          pickedIds[match.product.id] = true;
        }
      });
      scored.forEach(function (item) {
        if (picked.length < 8 && !pickedIds[item.product.id]) {
          picked.push(item.product);
          pickedIds[item.product.id] = true;
        }
      });
      return picked.slice(0, 8);
    }

    // Khi lọc theo Tab danh mục: trả về đúng số lượng thực tế không trùng lặp (tối đa 8)
    return scored.slice(0, 8).map(function (item) { return item.product; });
  }

  var currentBestSellerTab = 'all';

  function renderBestSellerSection(allProducts, wishlistIds, animateSwitch) {
    var grid = $('#bestsellerProductGrid');
    if (!grid) return;

    // Loại trừ toàn bộ sản phẩm đã hiển thị ở Khu vực Mới ra mắt (#san-pham-moi) và Khu vực Khuyến mãi (#san-pham-khuyen-mai)
    var excludeIds = new Set();
    homeSectionIds.launch.forEach(function (id) { excludeIds.add(id); });
    homeSectionIds.sale.forEach(function (id) { excludeIds.add(id); });

    var bestList = getRankedBestSellers(allProducts, currentBestSellerTab, excludeIds);

    if (currentBestSellerTab === 'all') {
      homeSectionIds.bestseller = bestList.map(function (p) { return p.id; });
    }

    function applyGridContent() {
      if (bestList.length === 0) {
        grid.innerHTML = renderEmptySectionState(
          'Chưa có sản phẩm bán chạy riêng biệt trong danh mục này',
          'Các sản phẩm thuộc danh mục này hiện đang được trưng bày tại khu vực Mới ra mắt hoặc Khuyến mãi.'
        );
      } else {
        grid.innerHTML = bestList.map(function (product, idx) {
          return buildProductCardHtml(product, wishlistIds, {
            badgeType: 'BEST SELLER',
            staggerIdx: idx,
            immediateReveal: true
          });
        }).join('');
        hydrateProductImages(grid);
        hydrateCardWishlistStates();
      }
      grid.classList.remove('is-switching');
    }

    if (animateSwitch) {
      grid.classList.add('is-switching');
      setTimeout(applyGridContent, 140);
    } else {
      applyGridContent();
    }

    var viewAllLink = $('#bestsellerViewAllLink');
    if (viewAllLink) {
      if (currentBestSellerTab === 'all') {
        viewAllLink.href = 'category.html';
      } else if (currentBestSellerTab === 'am-thanh') {
        viewAllLink.href = 'category.html?cat=tai-nghe';
      } else {
        viewAllLink.href = 'category.html?cat=' + encodeURIComponent(currentBestSellerTab);
      }
    }
  }

  function renderSaleSection(allProducts, wishlistIds, excludeSet) {
    var saleGrid = $('#saleProductGrid');
    var saleCountEl = $('#saleTotalCountText');
    var blocked = excludeSet || new Set();

    var allValidDiscounted = allProducts.filter(isValidPromotionalProduct);
    if (saleCountEl) {
      saleCountEl.textContent = allValidDiscounted.length + ' sản phẩm đang giảm giá';
    }

    // Lọc bỏ các sản phẩm đã xuất hiện ở khu vực #san-pham-moi và #san-pham-ban-chay
    var uniqueDiscounted = allValidDiscounted.filter(function (p) {
      return !blocked.has(p.id);
    });

    uniqueDiscounted.sort(function (a, b) {
      var baseA = Number(a.basePrice) || 0;
      var oldA = Number(a.oldPrice) || 0;
      var baseB = Number(b.basePrice) || 0;
      var oldB = Number(b.oldPrice) || 0;
      var pctA = oldA > 0 ? ((oldA - baseA) / oldA) : 0;
      var pctB = oldB > 0 ? ((oldB - baseB) / oldB) : 0;
      var saveA = oldA - baseA;
      var saveB = oldB - baseB;
      if (saveB !== saveA) return saveB - saveA;
      if (pctB !== pctA) return pctB - pctA;
      return baseB - baseA;
    });

    var topDiscounted = uniqueDiscounted.slice(0, 8);
    homeSectionIds.sale = topDiscounted.map(function (p) { return p.id; });
    topDiscounted.forEach(function (p) { blocked.add(p.id); });

    if (saleGrid) {
      if (topDiscounted.length === 0) {
        saleGrid.innerHTML = renderEmptySectionState(
          'Hiện chưa có chương trình khuyến mãi đang áp dụng',
          'Các ưu đãi giảm giá mới nhất sẽ được cập nhật tự động ngay khi mở chương trình.'
        );
      } else {
        saleGrid.innerHTML = topDiscounted.map(function (product, idx) {
          return buildProductCardHtml(product, wishlistIds, {
            badgeType: 'SALE',
            showSaveAmount: true,
            showDetailBtn: true,
            staggerIdx: idx,
            immediateReveal: true
          });
        }).join('');
        hydrateProductImages(saleGrid);
      }
    }
  }

  function renderExploreCategories(allProducts) {
    var exploreGrid = $('#exploreCategoryGrid');
    if (!exploreGrid) return;

    var categoryMeta = [
      { id: 'dien-thoai', label: 'Điện thoại', repId: 'iphone-18-pro-max', heroImage: 'SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png', fallback: 'phone' },
      { id: 'laptop', label: 'Laptop', repId: 'macbook-pro-16-m5-max', heroImage: 'SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macbook-pro-16-m5-max-hero.png', fallback: 'laptop' },
      { id: 'ipad', label: 'iPad & Máy tính bảng', repId: 'ipad-pro-m5', heroImage: 'SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-cutout.png', fallback: 'tablet' },
      { id: 'tai-nghe', label: 'Tai nghe', repId: 'airpods-pro-3', heroImage: 'SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods-pro-3-cutout.png', fallback: 'tai-nghe' },
      { id: 'loa', label: 'Loa', repId: 'marshall-acton-iii', heroImage: 'SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_7_1.webp', fallback: 'speaker' },
      { id: 'dong-ho-dien-tu', label: 'Đồng hồ điện tử', repId: 'apple-watch-ultra-3', heroImage: 'SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/apple-watch-ultra-3-cutout.png', fallback: 'watch' },
      { id: 'phu-kien', label: 'Phụ kiện', repId: '', fallback: 'phu-kien', optional: true }
    ];

    var cardsHtml = [];
    categoryMeta.forEach(function (meta, idx) {
      var catProducts = allProducts.filter(function (p) { return p.category === meta.id; });
      if (meta.optional && catProducts.length === 0) return;

      var repProduct = (meta.repId && window.VLU_CATALOG && window.VLU_CATALOG[meta.repId]) || catProducts[0] || null;
      var rawImg = meta.heroImage || (repProduct
        ? (repProduct.image || (repProduct.colors && repProduct.colors[0] && (repProduct.colors[0].image || repProduct.colors[0].img)))
        : '');
      var resolvedUrl = resolveImage(rawImg, meta.id);
      var placeholderUrl = 'frontend/assets/images/placeholders/' + meta.fallback + '.svg';

      cardsHtml.push(
        '<a href="category.html?cat=' + encodeURIComponent(meta.id) + '" class="category-explore-card stagger-reveal-item is-revealed" data-cat-card="' + escapeHtml(meta.id) + '" style="--stagger-idx:' + idx + ';">' +
          '<div class="category-explore-img-wrap is-loading">' +
            '<img src="' + escapeHtml(resolvedUrl) + '" alt="' + escapeHtml(meta.label) + '" loading="lazy" class="category-explore-img" onerror="this.onerror=null;this.src=\'' + placeholderUrl + '\';">' +
          '</div>' +
          '<h3 class="category-explore-title">' + escapeHtml(meta.label) + '</h3>' +
          '<span class="category-explore-count" data-cat-count="' + escapeHtml(meta.id) + '">' + catProducts.length + ' sản phẩm</span>' +
        '</a>'
      );
    });

    if (cardsHtml.length > 0) {
      exploreGrid.innerHTML = cardsHtml.join('');
      hydrateProductImages(exploreGrid);
    }
  }

  function hydrateBrandSections(allProducts) {
    var catalog = window.VLU_CATALOG || {};
    var bentoHeroOverrides = {
      'macbook-pro-16-m5-max': 'SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macbook-pro-16-m5-max-hero.png'
    };
    $$('[data-bento-img]').forEach(function (imgEl) {
      var pid = imgEl.getAttribute('data-bento-img');
      var p = pid && catalog[pid];
      var overrideImg = pid && bentoHeroOverrides[pid];
      if (!p && !overrideImg) return;
      var raw = overrideImg || (p && (p.image || (p.colors && p.colors[0] && (p.colors[0].image || p.colors[0].img))));
      var resolved = resolveImage(raw, (p && p.category) || '');
      if (resolved) imgEl.src = resolved;
    });

    $$('[data-brand-count]').forEach(function (badgeEl) {
      var brandName = String(badgeEl.getAttribute('data-brand-count') || '').trim();
      if (!brandName) return;
      var brandLower = brandName.toLowerCase();
      var count = allProducts.filter(function (p) {
        var b = String(p.brand || '').trim().toLowerCase();
        var g = String(p.menuGroup || '').trim().toLowerCase();
        var n = String(p.name || '').trim().toLowerCase();
        return b === brandLower || b.indexOf(brandLower) !== -1 || g.indexOf(brandLower) !== -1 || n.indexOf(brandLower) !== -1;
      }).length;
      if (count > 0) {
        badgeEl.textContent = count + ' sản phẩm chính hãng';
      }
    });
  }

  function renderHomeCatalog() {
    var catalog = window.VLU_CATALOG;
    if (!catalog) return;
    var allProducts = Object.keys(catalog).map(function (id) { return catalog[id]; });
    var activeCategories = getActiveCategories();
    var orderCounts = collectSystemOrderCounts();

    // Khởi tạo mới bộ theo dõi chống trùng lặp xuyên suốt 3 khu vực trang chủ
    displayedProductIds = new Set();
    homeSectionIds = { launch: [], bestseller: [], sale: [] };

    // Các sản phẩm có đơn hàng xác thực cao (trừ flagship chủ đề iPhone 18 Pro Max mở màn) ưu tiên nhường cho Khu vực Bán chạy (#san-pham-ban-chay)
    // Các sản phẩm có mức giảm tiền sâu nhất (như Galaxy Z Fold7 giảm > 3.3 triệu) ưu tiên nhường cho Khu vực Khuyến mãi (#san-pham-khuyen-mai)
    var reservedForBestSeller = {
      'macbook-pro-16-m5-max': true,
      'samsung-galaxy-s26-ultra': true,
      'ipad-pro-m5': true,
      'airpods-pro-3': true,
      'apple-watch-ultra-3': true,
      'iphone-16-pro-max': true,
      'marshall-acton-iii': true,
      'jbl-charge-6': true
    };
    var reservedForDeepSale = {
      'samsung-galaxy-z-fold7': true,
      'iphone-17-pro-max': true
    };

    var featured = [];
    activeCategories.forEach(function (category) {
      var catList = allProducts
        .map(function (product, idx) {
          return { product: product, idx: idx, score: getNewLaunchPriorityScore(product, idx) };
        })
        .filter(function (entry) {
          var p = entry.product;
          if (p.category !== category.id) return false;
          if (displayedProductIds.has(p.id)) return false;
          if (reservedForBestSeller[p.id] || reservedForDeepSale[p.id]) return false;
          // Nếu sản phẩm có nhiều đơn đặt hàng thực tế (và không phải iPhone 18 Pro Max vừa ra mắt), ưu tiên để dành cho Bán chạy
          if ((orderCounts[p.id] || 0) >= 2 && p.id !== 'iphone-18-pro-max') return false;
          return true;
        });

      catList.sort(function (a, b) { return b.score - a.score; });

      catList.slice(0, 2).forEach(function (entry) {
        featured.push(entry.product);
        displayedProductIds.add(entry.product.id);
      });
    });

    featured = featured.slice(0, 12);
    homeSectionIds.launch = featured.map(function (p) { return p.id; });

    var wishlistIds = getWishlistIds();
    var launchGrid = $('#launchProductGrid') || $('.launch-grid');
    if (launchGrid) {
      if (featured.length === 0) {
        launchGrid.innerHTML = renderEmptySectionState('Đang cập nhật sản phẩm mới ra mắt');
      } else {
        launchGrid.innerHTML = featured.map(function (product, idx) {
          return buildProductCardHtml(product, wishlistIds, {
            badgeType: 'NEW',
            staggerIdx: idx,
            immediateReveal: true
          });
        }).join('');
        hydrateProductImages(launchGrid);
      }
    }

    // Khu vực 2: Sản phẩm bán chạy (loại trừ toàn bộ ID đã có trong #san-pham-moi)
    var bestListDefault = getRankedBestSellers(allProducts, 'all', displayedProductIds);
    homeSectionIds.bestseller = bestListDefault.map(function (p) { return p.id; });
    bestListDefault.forEach(function (p) { displayedProductIds.add(p.id); });

    // Khu vực 3: Sản phẩm đang khuyến mãi (loại trừ toàn bộ ID đã có trong #san-pham-moi và #san-pham-ban-chay)
    renderSaleSection(allProducts, wishlistIds, displayedProductIds);

    // Render giao diện Khu vực 2 theo tab hiện tại (loại trừ #san-pham-moi và #san-pham-khuyen-mai)
    renderBestSellerSection(allProducts, wishlistIds, false);

    // Khám phá danh mục & Thương hiệu
    renderExploreCategories(allProducts);
    hydrateBrandSections(allProducts);

    // Xuất thông tin phân bổ ra phạm vi toàn cục để phục vụ kiểm thử chống trùng lặp
    window.VLU_HOME_ALLOCATION = {
      newLaunchIds: homeSectionIds.launch.slice(),
      bestSellerIds: homeSectionIds.bestseller.slice(),
      saleIds: homeSectionIds.sale.slice(),
      totalUniqueDisplayed: displayedProductIds.size
    };

    // Đồng bộ link & giá thực tế trên 4 Slide Flagship của Hero Carousel
    $$('.hero-slide[data-product-id]').forEach(function (slide) {
      var pid = slide.getAttribute('data-product-id');
      var product = pid && catalog[pid];
      if (!product) return;
      var cta = $('a[href*="product-detail"]', slide);
      if (cta) cta.href = productHref(product);
      var pricePill = $('.hero-price-pill', slide);
      if (pricePill) {
        if (Number(product.basePrice) > 0) {
          pricePill.textContent = 'Từ ' + formatVnd(product.basePrice);
          pricePill.classList.remove('hidden');
        } else {
          pricePill.classList.add('hidden');
        }
      }
    });
  }

  renderHomeCatalog();

  // Sự kiện chuyển Tab lọc nhanh tại khu vực #san-pham-ban-chay (không tải lại trang + hiệu ứng mượt)
  var bestsellerTabsWrap = $('#bestsellerTabs');
  if (bestsellerTabsWrap) {
    bestsellerTabsWrap.addEventListener('click', function (e) {
      var tabBtn = e.target.closest('[data-bestseller-tab]');
      if (!tabBtn) return;
      e.preventDefault();
      var nextTab = tabBtn.getAttribute('data-bestseller-tab') || 'all';
      if (nextTab === currentBestSellerTab) return;
      currentBestSellerTab = nextTab;

      $$('[data-bestseller-tab]', bestsellerTabsWrap).forEach(function (btn) {
        var active = btn === tabBtn;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      var catalog = window.VLU_CATALOG || {};
      var allProducts = Object.keys(catalog).map(function (id) { return catalog[id]; });
      renderBestSellerSection(allProducts, getWishlistIds(), true);
    });
  }

  /* ---------- 4. MODAL XEM NHANH (QUICK VIEW MODAL) ---------- */
  var qvModal = $('#quickViewModal');
  var qvBody = $('#qvBody');
  var qvTitle = $('#qvTitle');
  var qvBrand = $('#qvBrand');
  var qvCloseBtn = $('#qvCloseBtn');
  var qvState = { product: null, colorIdx: 0, variantIdx: 0, qty: 1 };

  function closeQuickView() {
    if (!qvModal) return;
    qvModal.classList.remove('is-open');
    qvModal.setAttribute('aria-hidden', 'true');
  }

  function renderQuickViewBody() {
    var p = qvState.product;
    if (!p || !qvBody) return;
    var colors = Array.isArray(p.colors) && p.colors.length ? p.colors : [{ name: 'Mặc định', hex: '#0F172A', image: p.image }];
    var variants = Array.isArray(p.variants) && p.variants.length ? p.variants : [{ label: 'Tiêu chuẩn', delta: 0 }];
    var activeColor = colors[qvState.colorIdx] || colors[0];
    var activeVariant = variants[qvState.variantIdx] || variants[0];
    var qty = Math.max(1, Math.min(10, parseInt(qvState.qty, 10) || 1));
    var delta = parseInt(activeVariant.delta, 10) || 0;
    var basePrice = Number(p.basePrice) || 0;
    var finalPrice = basePrice > 0 ? basePrice + delta : 0;
    var finalOld = (p.oldPrice && Number(p.oldPrice) > basePrice && basePrice > 0) ? (Number(p.oldPrice) + delta) : 0;
    var hasDiscount = finalPrice > 0 && finalOld > finalPrice;
    var discountPct = hasDiscount ? Math.max(1, Math.round(((finalOld - finalPrice) / finalOld) * 100)) : 0;
    var imgUrl = resolveImage((activeColor && (activeColor.image || activeColor.img)) || p.image, p.category);
    var fallbackPlaceholder = 'frontend/assets/images/placeholders/' + (p.category || 'phone') + '.svg';
    var isWished = getWishlistIds().indexOf(p.id) !== -1;

    qvBody.innerHTML =
      '<div class="relative rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center justify-center aspect-square">' +
        (hasDiscount
          ? '<span class="product-badge-discount absolute left-3.5 top-3.5">-' + discountPct + '%</span>'
          : '') +
        '<button type="button" data-wish data-id="' + escapeHtml(p.id) + '" aria-pressed="' + String(isWished) + '" aria-label="Yêu thích ' + escapeHtml(p.name) + '" class="product-wish-btn absolute right-3.5 top-3.5">' +
          '<svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#i-heart"/></svg>' +
        '</button>' +
        '<img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(p.name) + '" class="max-h-72 w-auto object-contain mix-blend-multiply transition-transform duration-300" onerror="this.onerror=null;this.src=\'' + fallbackPlaceholder + '\';">' +
      '</div>' +
      '<div class="flex flex-col">' +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          renderRatingMarkup(p) +
          (finalPrice > 0
            ? '<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Còn hàng · Giao 2H</span>'
            : '<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">Đặt trước</span>') +
        '</div>' +
        '<p class="mt-2.5 text-sm leading-relaxed text-slate-600">' + escapeHtml(p.tagline || 'Sản phẩm chính hãng VN/A bảo hành toàn diện tại VLU FLAGSHIP STORE.') + '</p>' +
        '<div class="mt-3.5 flex flex-wrap items-baseline gap-2">' +
          '<span class="text-2xl font-extrabold text-brand sm:text-3xl">' + (finalPrice > 0 ? formatVnd(finalPrice) : 'Giá liên hệ') + '</span>' +
          (hasDiscount ? '<span class="text-sm font-semibold text-slate-400 line-through">' + formatVnd(finalOld) + '</span>' : '') +
          (hasDiscount ? '<span class="product-save-pill">Tiết kiệm ' + formatVnd(finalOld - finalPrice) + '</span>' : '') +
        '</div>' +
        '<div class="mt-4">' +
          '<p class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Màu sắc: <span class="text-slate-900">' + escapeHtml(activeColor.name) + '</span></p>' +
          '<div class="mt-2 flex flex-wrap gap-2">' +
            colors.map(function (c, i) {
              return '<button type="button" data-qv-color="' + i + '" aria-label="' + escapeHtml(c.name) + '" class="h-8 w-8 rounded-full border-2 transition ' + (i === qvState.colorIdx ? 'border-brand ring-2 ring-brand/25 scale-110' : 'border-white shadow ring-1 ring-slate-300') + '" style="background:' + escapeHtml(c.hex || '#334155') + '"></button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="mt-3.5">' +
          '<p class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Phiên bản</p>' +
          '<div class="mt-2 flex flex-wrap gap-2">' +
            variants.map(function (v, i) {
              return '<button type="button" data-qv-variant="' + i + '" class="rounded-xl border px-3 py-1.5 text-xs font-bold transition ' + (i === qvState.variantIdx ? 'border-brand bg-brand-soft text-brand' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400') + '">' + escapeHtml(v.label) + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        (finalPrice > 0
          ? '<div class="mt-3.5 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2 border border-slate-100">' +
              '<span class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Số lượng</span>' +
              '<div class="inline-flex items-center rounded-lg border border-slate-200 bg-white">' +
                '<button type="button" data-qv-qty="-1" class="h-8 w-8 text-sm font-extrabold text-slate-600 hover:text-brand" aria-label="Giảm số lượng">−</button>' +
                '<span id="qvQtyValue" class="min-w-[28px] text-center text-xs font-extrabold text-slate-900">' + qty + '</span>' +
                '<button type="button" data-qv-qty="1" class="h-8 w-8 text-sm font-extrabold text-slate-600 hover:text-brand" aria-label="Tăng số lượng">+</button>' +
              '</div>' +
            '</div>'
          : '') +
        '<div class="mt-5 flex flex-wrap gap-2.5">' +
          (finalPrice > 0
            ? '<button type="button" id="qvAddCartBtn" class="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark active:scale-98"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2"><use href="#i-bag"/></svg><span>Thêm vào giỏ hàng</span></button>'
            : '') +
          '<a href="' + productHref(p) + '" class="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white">Xem chi tiết</a>' +
        '</div>' +
      '</div>';
  }

  function openQuickView(productId) {
    if (!qvModal || !window.VLU_FIND_PRODUCT) return;
    var product = window.VLU_FIND_PRODUCT(productId);
    if (!product) {
      showToast('Không tìm thấy thông tin sản phẩm.');
      return;
    }
    qvState = { product: product, colorIdx: 0, variantIdx: 0, qty: 1 };
    if (qvBrand) qvBrand.textContent = (product.brand || 'VLU') + ' · Chính hãng VN/A';
    if (qvTitle) qvTitle.textContent = product.name;
    renderQuickViewBody();
    qvModal.classList.add('is-open');
    qvModal.setAttribute('aria-hidden', 'false');
  }

  if (qvCloseBtn) qvCloseBtn.addEventListener('click', closeQuickView);
  if (qvModal) {
    qvModal.addEventListener('click', function (e) {
      if (e.target === qvModal) {
        closeQuickView();
        return;
      }
      var colorBtn = e.target.closest('[data-qv-color]');
      if (colorBtn) {
        qvState.colorIdx = parseInt(colorBtn.dataset.qvColor, 10) || 0;
        renderQuickViewBody();
        return;
      }
      var varBtn = e.target.closest('[data-qv-variant]');
      if (varBtn) {
        qvState.variantIdx = parseInt(varBtn.dataset.qvVariant, 10) || 0;
        renderQuickViewBody();
        return;
      }
      var qtyBtn = e.target.closest('[data-qv-qty]');
      if (qtyBtn) {
        var step = parseInt(qtyBtn.getAttribute('data-qv-qty'), 10) || 0;
        qvState.qty = Math.max(1, Math.min(10, (parseInt(qvState.qty, 10) || 1) + step));
        renderQuickViewBody();
        return;
      }
      var qvAdd = e.target.closest('#qvAddCartBtn');
      if (qvAdd && qvState.product) {
        var p = qvState.product;
        var colors = Array.isArray(p.colors) && p.colors.length ? p.colors : [{ name: 'Mặc định', image: p.image }];
        var variants = Array.isArray(p.variants) && p.variants.length ? p.variants : [{ label: 'Tiêu chuẩn', delta: 0 }];
        var c = colors[qvState.colorIdx] || colors[0];
        var v = variants[qvState.variantIdx] || variants[0];
        var delta = parseInt(v.delta, 10) || 0;
        var price = (Number(p.basePrice) || 0) + delta;
        var qtyToAdd = Math.max(1, Math.min(10, parseInt(qvState.qty, 10) || 1));
        if (!(price > 0)) {
          showToast('Giá sản phẩm đang được cập nhật.');
          return;
        }
        var oldPrice = p.oldPrice ? (Number(p.oldPrice) || 0) + delta : null;
        var img = resolveImage((c && (c.image || c.img)) || p.image, p.category);
        var addedItem = {
          id: p.id,
          name: p.name,
          category: p.category,
          price: price,
          oldPrice: oldPrice,
          image: img,
          color: c ? c.name : 'Mặc định',
          variant: v ? v.label : 'Tiêu chuẩn',
          quantity: qtyToAdd
        };
        if (window.VLU_CART) {
          window.VLU_CART.addItem(addedItem);
          window.VLU_CART.updateBadge(true);
        }
        triggerCartFeedback(addedItem);
        closeQuickView();
      }
    });
  }

  /* ---------- 5. MENU MEGA (DESKTOP HOVER & CLICK) ---------- */
  var megaItems = $$('.nav-item-mega');
  var scrim = $('#megaScrim');
  var closeTimer = null;

  function closeAllMenus() {
    clearTimeout(closeTimer);
    megaItems.forEach(function (m) {
      m.classList.remove('is-open');
      var btn = $('button', m);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('has-mega-open');
  }

  function scheduleCloseAll() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      closeAllMenus();
    }, 220);
  }

  function openMegaItem(targetItem) {
    clearTimeout(closeTimer);
    megaItems.forEach(function (m) {
      if (m !== targetItem) {
        m.classList.remove('is-open');
        var b = $('button', m);
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
    targetItem.classList.add('is-open');
    var btn = $('button', targetItem);
    if (btn) btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('has-mega-open');
  }

  megaItems.forEach(function (mItem) {
    var btn = $('button', mItem);
    var panel = $('.mega-panel', mItem);

    mItem.addEventListener('mouseenter', function () {
      openMegaItem(mItem);
    });
    mItem.addEventListener('mouseleave', scheduleCloseAll);

    if (panel) {
      panel.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
      });
      panel.addEventListener('mouseleave', scheduleCloseAll);
    }

    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = mItem.classList.contains('is-open');
        if (isOpen) {
          closeAllMenus();
        } else {
          openMegaItem(mItem);
        }
      });
    }
  });

  if (scrim) {
    scrim.addEventListener('click', function () {
      closeAllMenus();
      closeMobileDrawer();
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#site-header')) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllMenus();
      closeMobileDrawer();
      closeQuickView();
    }
  });

  /* ---------- 6. MOBILE DRAWER ACCORDION ---------- */
  var mobileBtn = $('#mobileMenuBtn');
  var mobileDrawer = $('#mobileDrawer');

  if (mobileDrawer && mobileDrawer.parentElement !== document.body) {
    document.body.appendChild(mobileDrawer);
  }

  if (mobileDrawer) {
    var drawerInner = $('.mobile-drawer-inner', mobileDrawer);
    if (drawerInner && !$('#mobileDrawerTopBar', drawerInner)) {
      var topBar = document.createElement('div');
      topBar.id = 'mobileDrawerTopBar';
      topBar.className = 'flex items-center justify-between pb-3 border-b border-slate-200/80';
      topBar.innerHTML =
        '<div class="flex items-center gap-2">' +
          '<span class="inline-block h-2.5 w-2.5 rounded-full bg-brand"></span>' +
          '<span class="text-xs font-black uppercase tracking-wider text-slate-900">Danh mục &amp; Tiện ích</span>' +
        '</div>' +
        '<button type="button" id="mobileDrawerCloseBtn" aria-label="Đóng menu di động" class="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 hover:bg-brand hover:text-white transition">' +
          '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
        '</button>';
      drawerInner.insertBefore(topBar, drawerInner.firstChild);
    }
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'false');
      var burger = $('.icon-burger', mobileBtn);
      var closeIcon = $('.icon-close', mobileBtn);
      if (burger) burger.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
    document.body.classList.remove('overflow-hidden', 'has-mobile-drawer-open', 'has-mega-open');
    if (document.documentElement) {
      document.documentElement.classList.remove('overflow-hidden');
      document.documentElement.style.overflow = '';
    }
    document.body.style.overflow = '';
  }

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    closeAllMenus();
    mobileDrawer.classList.add('is-open');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'true');
      var burger = $('.icon-burger', mobileBtn);
      var closeIcon = $('.icon-close', mobileBtn);
      if (burger) burger.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    }
    document.body.classList.add('overflow-hidden', 'has-mobile-drawer-open', 'has-mega-open');
    if (document.documentElement) {
      document.documentElement.classList.add('overflow-hidden');
    }
  }

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !mobileDrawer.classList.contains('is-open');
      if (willOpen) openMobileDrawer();
      else closeMobileDrawer();
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#mobileDrawerCloseBtn') || e.target.closest('[data-close-drawer]')) {
      e.preventDefault();
      closeMobileDrawer();
    }
  });

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', function (e) {
      var toggleBtn = e.target.closest('.mobile-accordion-toggle');
      if (toggleBtn) {
        e.preventDefault();
        var body = toggleBtn.nextElementSibling;
        var chevron = $('svg:last-child', toggleBtn) || $('svg', toggleBtn);
        if (!body) return;
        var isOpen = !body.classList.contains('hidden');
        if (isOpen) {
          body.classList.add('hidden');
          toggleBtn.setAttribute('aria-expanded', 'false');
          if (chevron) chevron.style.transform = '';
        } else {
          body.classList.remove('hidden');
          toggleBtn.setAttribute('aria-expanded', 'true');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
        return;
      }

      var link = e.target.closest('a[href]');
      if (link) {
        closeMobileDrawer();
      }
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeMobileDrawer();
    }
  });

  /* ---------- 7. HERO SLIDER CAROUSEL + STAGGER + MOUSE PARALLAX ---------- */
  var viewport = $('#heroViewport');
  var track    = $('#heroTrack');
  var slides   = $$('.slide', track);
  var dots     = $$('[data-dot]');
  var n        = slides.length;

  if (viewport && track && n > 0) {
    var firstClone = slides[0].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    firstClone.removeAttribute('role');
    firstClone.removeAttribute('aria-roledescription');
    firstClone.removeAttribute('aria-label');
    $$('a, button', firstClone).forEach(function (el) { el.setAttribute('tabindex', '-1'); });
    track.appendChild(firstClone);

    var allSlides = $$('.slide', track);
    var index = 0, timer = null, startX = null, INTERVAL = 5500;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var setX = function (animate) {
      track.style.transitionProperty = animate ? 'transform' : 'none';
      track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
    };
    var paint = function () {
      var active = index >= n ? 0 : index;
      dots.forEach(function (d, k) {
        var on = k === active;
        d.setAttribute('aria-current', on ? 'true' : 'false');
      });
      allSlides.forEach(function (s, idx) {
        var match = idx === index || (index >= n && idx === 0);
        s.classList.toggle('is-active', match);
      });
    };
    var next = function () { index += 1; setX(true); paint(); };
    var prev = function () {
      if (index === 0) { index = n; setX(false); track.getBoundingClientRect(); }
      index -= 1; setX(true); paint();
    };
    track.addEventListener('transitionend', function (e) {
      if (e.target === track && index >= n) { index = 0; setX(false); paint(); }
    });

    var play = function () { if (!reduce && !timer) timer = setInterval(next, INTERVAL); };
    var stop = function () { clearInterval(timer); timer = null; };

    var heroNextBtn = $('#heroNext');
    var heroPrevBtn = $('#heroPrev');
    if (heroNextBtn) heroNextBtn.addEventListener('click', next);
    if (heroPrevBtn) heroPrevBtn.addEventListener('click', prev);
    dots.forEach(function (d, k) { d.addEventListener('click', function () { index = k; setX(true); paint(); }); });

    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', function () {
      viewport.style.removeProperty('--px');
      viewport.style.removeProperty('--py');
      play();
    });
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });

    if (!reduce) {
      viewport.addEventListener('mousemove', function (e) {
        if (window.innerWidth < 768) return;
        var rect = viewport.getBoundingClientRect();
        var relX = ((e.clientX - rect.left) / rect.width) - 0.5;
        var relY = ((e.clientY - rect.top) / rect.height) - 0.5;
        viewport.style.setProperty('--px', (-relX * 14).toFixed(2) + 'px');
        viewport.style.setProperty('--py', (-relY * 10).toFixed(2) + 'px');
      });
    }

    viewport.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (startX !== null) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
      }
      startX = null; play();
    }, { passive: true });

    paint(); play();
  }

  /* ---------- 8. GIỎ HÀNG, MINI CART PREVIEW, YÊU THÍCH & XEM NHANH ---------- */
  var badge = $('#cartCount');
  var toast = $('#toast');
  var count = parseInt(badge ? badge.textContent : '0', 10) || 0;
  var toastTimer;

  function showToast(msg) {
    if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
      window.VLU_CART.showToast(msg);
      return;
    }
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
  }

  function showRichCartToast(item) {
    var toastEl = document.getElementById('toast');
    if (!toastEl || !item) {
      showToast('Đã thêm "' + (item ? item.name : 'sản phẩm') + '" vào giỏ hàng!');
      return;
    }
    var thumbUrl = resolveImage(item.image, item.category || 'phone');
    var fallback = 'frontend/assets/images/placeholders/' + (item.category || 'phone') + '.svg';
    toastEl.style.background = 'rgba(11, 15, 25, 0.94)';
    toastEl.style.backdropFilter = 'blur(18px)';
    toastEl.className = 'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-4 py-3 text-xs font-semibold text-white shadow-2xl transition-all duration-300 flex items-center gap-3 max-w-[92vw] sm:max-w-md';
    toastEl.innerHTML =
      '<span class="h-10 w-10 shrink-0 rounded-xl bg-white p-1 flex items-center justify-center">' +
        '<img src="' + escapeHtml(thumbUrl) + '" alt="" class="h-full w-full object-contain mix-blend-multiply" onerror="this.onerror=null;this.src=\'' + fallback + '\';">' +
      '</span>' +
      '<div class="min-w-0 flex-1">' +
        '<p class="font-extrabold text-emerald-400">✓ Đã thêm vào giỏ hàng</p>' +
        '<p class="truncate text-white font-bold mt-0.5">' + escapeHtml(item.name) + ' <span class="text-slate-300 font-normal">×' + (item.quantity || 1) + '</span></p>' +
      '</div>' +
      '<a href="cart.html" class="shrink-0 rounded-xl bg-brand px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-brand-dark transition">Xem giỏ →</a>';
    toastEl.classList.add('show');
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translate(-50%, 0)';
    toastEl.style.pointerEvents = 'auto';

    if (window.VLU_CART && window.VLU_CART._toastTimer) clearTimeout(window.VLU_CART._toastTimer);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translate(-50%, 1rem)';
      toastEl.style.pointerEvents = 'none';
    }, 3200);
  }

  function triggerCartFeedback(addedItem, sourceBtn) {
    // 1. Hiệu ứng nhún nhẹ trên icon giỏ hàng Header (.header-cart-btn) & Scale Pop badge
    var cartBtn = $('#headerCartBtn') || $('.header-cart-btn');
    if (cartBtn) {
      cartBtn.classList.remove('cart-bounce');
      void cartBtn.offsetWidth;
      cartBtn.classList.add('cart-bounce');
    }
    // 2. Hiệu ứng phản hồi trên nút bấm [data-add]
    if (sourceBtn && !sourceBtn.dataset.feedbackActive) {
      sourceBtn.dataset.feedbackActive = '1';
      var originalHtml = sourceBtn.innerHTML;
      sourceBtn.classList.add('bg-emerald-600');
      sourceBtn.innerHTML = '<span>✓ Đã thêm</span>';
      setTimeout(function () {
        sourceBtn.classList.remove('bg-emerald-600');
        sourceBtn.innerHTML = originalHtml;
        delete sourceBtn.dataset.feedbackActive;
      }, 1100);
    }
    // 3. Hiển thị Rich Toast & đồng bộ Mini Cart Preview
    showRichCartToast(addedItem);
    renderMiniCart();
  }

  /* ---------- MINI CART PREVIEW DROPDOWN ---------- */
  var headerCartWrapper = $('#headerCartWrapper');
  var miniCartDropdown = $('#miniCartDropdown');
  var miniCartCloseTimer = null;

  function renderMiniCart() {
    var bodyEl = $('#miniCartBody');
    var footerEl = $('#miniCartFooter');
    var subheadingEl = $('#miniCartSubheading');
    var subtotalEl = $('#miniCartSubtotal');
    if (!bodyEl) return;

    var items = (window.VLU_CART && typeof window.VLU_CART.getCart === 'function')
      ? window.VLU_CART.getCart()
      : [];
    var totalCount = (window.VLU_CART && typeof window.VLU_CART.getItemCount === 'function')
      ? window.VLU_CART.getItemCount()
      : items.length;
    var subtotal = (window.VLU_CART && typeof window.VLU_CART.getSubtotal === 'function')
      ? window.VLU_CART.getSubtotal()
      : 0;

    if (subheadingEl) {
      subheadingEl.textContent = totalCount > 0
        ? (totalCount + ' sản phẩm trong giỏ hàng')
        : 'Chưa có sản phẩm nào';
    }

    if (!items.length) {
      bodyEl.innerHTML =
        '<div class="py-7 px-3 text-center">' +
          '<div class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">' +
            '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>' +
          '</div>' +
          '<p class="text-xs font-extrabold text-slate-800">Giỏ hàng của bạn đang trống</p>' +
          '<p class="mt-1 text-[11px] text-slate-500">Khám phá các siêu phẩm công nghệ chính hãng và thêm vào giỏ ngay.</p>' +
          '<a href="category.html" class="mt-3.5 inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-brand">Khám phá sản phẩm</a>' +
        '</div>';
      if (footerEl) footerEl.classList.add('hidden');
      return;
    }

    bodyEl.innerHTML = items.map(function (it, idx) {
      var img = resolveImage(it.image, it.category || 'phone');
      var fallback = 'frontend/assets/images/placeholders/' + (it.category || 'phone') + '.svg';
      var href = 'product-detail.html?id=' + encodeURIComponent(it.id || '') + '&name=' + encodeURIComponent(it.name || '');
      var unitPrice = parseInt(it.price, 10) || 0;
      var qty = Math.max(1, parseInt(it.quantity, 10) || 1);

      return '<div class="mini-cart-item" data-minicart-row="' + idx + '">' +
        '<a href="' + href + '" class="mini-cart-thumb">' +
          '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(it.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + fallback + '\';">' +
        '</a>' +
        '<div class="min-w-0 flex-1">' +
          '<a href="' + href + '" class="block truncate text-xs font-extrabold text-slate-900 hover:text-brand">' + escapeHtml(it.name) + '</a>' +
          '<p class="mt-0.5 truncate text-[10px] font-semibold text-slate-500">' + escapeHtml(it.color || 'Mặc định') + ' · ' + escapeHtml(it.variant || 'Tiêu chuẩn') + '</p>' +
          '<div class="mt-1.5 flex items-center justify-between gap-2">' +
            '<span class="text-xs font-extrabold text-brand">' + formatVnd(unitPrice * qty) + '</span>' +
            '<div class="mini-qty-stepper">' +
              '<button type="button" class="mini-qty-btn" data-minicart-qty="-1" data-index="' + idx + '" aria-label="Giảm số lượng">−</button>' +
              '<span class="mini-qty-val">' + qty + '</span>' +
              '<button type="button" class="mini-qty-btn" data-minicart-qty="1" data-index="' + idx + '" aria-label="Tăng số lượng">+</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="mini-remove-btn" data-minicart-remove="' + idx + '" data-tooltip="Xóa khỏi giỏ" aria-label="Xóa ' + escapeHtml(it.name) + '" title="Xóa khỏi giỏ">' +
          '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>';
    }).join('');

    if (subtotalEl) subtotalEl.textContent = formatVnd(subtotal);
    if (footerEl) footerEl.classList.remove('hidden');
  }

  function openMiniCart() {
    if (!headerCartWrapper || !miniCartDropdown) return;
    clearTimeout(miniCartCloseTimer);
    renderMiniCart();
    headerCartWrapper.classList.add('is-open');
    miniCartDropdown.classList.add('is-open');
    miniCartDropdown.setAttribute('aria-hidden', 'false');
    var btn = $('#headerCartBtn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeMiniCart() {
    if (!headerCartWrapper || !miniCartDropdown) return;
    clearTimeout(miniCartCloseTimer);
    headerCartWrapper.classList.remove('is-open');
    miniCartDropdown.classList.remove('is-open');
    miniCartDropdown.setAttribute('aria-hidden', 'true');
    var btn = $('#headerCartBtn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  if (headerCartWrapper && miniCartDropdown) {
    headerCartWrapper.addEventListener('mouseenter', function () {
      if (window.innerWidth >= 1024) openMiniCart();
    });
    headerCartWrapper.addEventListener('mouseleave', function () {
      clearTimeout(miniCartCloseTimer);
      miniCartCloseTimer = setTimeout(closeMiniCart, 220);
    });

    miniCartDropdown.addEventListener('click', function (e) {
      var qtyBtn = e.target.closest('[data-minicart-qty]');
      if (qtyBtn && window.VLU_CART) {
        e.preventDefault();
        e.stopPropagation();
        var idx = parseInt(qtyBtn.getAttribute('data-index'), 10);
        var delta = parseInt(qtyBtn.getAttribute('data-minicart-qty'), 10);
        window.VLU_CART.updateQuantity(idx, delta);
        renderMiniCart();
        return;
      }

      var rmBtn = e.target.closest('[data-minicart-remove]');
      if (rmBtn && window.VLU_CART) {
        e.preventDefault();
        e.stopPropagation();
        var rmIdx = parseInt(rmBtn.getAttribute('data-minicart-remove'), 10);
        var row = rmBtn.closest('.mini-cart-item');
        if (row) {
          row.classList.add('is-removing');
          setTimeout(function () {
            window.VLU_CART.removeItem(rmIdx);
            renderMiniCart();
          }, 220);
        } else {
          window.VLU_CART.removeItem(rmIdx);
          renderMiniCart();
        }
      }
    });
  }

  renderMiniCart();
  window.addEventListener('vlu:cart-updated', renderMiniCart);

  function toggleWishlist(productId, button) {
    var storeKey = getAccountStoreKey();
    if (!storeKey || !productId) return;
    try {
      var store = JSON.parse(localStorage.getItem(storeKey) || '{}');
      if (!store || typeof store !== 'object' || Array.isArray(store)) store = {};
      if (!Array.isArray(store.wishlist)) store.wishlist = [];
      var index = store.wishlist.indexOf(productId);
      var willBeWished = index === -1;
      if (willBeWished) store.wishlist.push(productId);
      else store.wishlist.splice(index, 1);
      localStorage.setItem(storeKey, JSON.stringify(store));

      // Đồng bộ trạng thái trái tim và hiệu ứng nảy trên tất cả thẻ sản phẩm cùng ID trên trang
      $$('[data-wish]').forEach(function (wBtn) {
        var wid = wBtn.dataset.id || '';
        if (!wid) {
          var wCard = wBtn.closest('.product-card');
          var wLink = wCard && $('h3 a', wCard);
          if (wLink) {
            try { wid = new URL(wLink.href, window.location.href).searchParams.get('id') || ''; } catch (err) {}
          }
        }
        if (wid === productId) {
          wBtn.setAttribute('aria-pressed', String(willBeWished));
          wBtn.setAttribute('data-tooltip', willBeWished ? 'Đã yêu thích' : 'Lưu yêu thích');
          wBtn.classList.remove('wish-pop');
          void wBtn.offsetWidth;
          wBtn.classList.add('wish-pop');
        }
      });

      var pObj = window.VLU_FIND_PRODUCT ? window.VLU_FIND_PRODUCT(productId) : null;
      var label = pObj && pObj.name ? ('"' + pObj.name + '"') : 'sản phẩm';
      showToast(willBeWished
        ? ('Đã lưu ' + label + ' vào danh sách yêu thích ♥')
        : ('Đã xóa ' + label + ' khỏi danh sách yêu thích.'));
    } catch (error) {
      console.error('[Main] Không thể cập nhật danh sách yêu thích:', error);
      showToast('Không thể lưu sản phẩm yêu thích trên thiết bị.');
    }
  }

  function applyCardColorSwatch(swatchBtn) {
    if (!swatchBtn) return;
    var card = swatchBtn.closest('.product-card');
    if (!card) return;
    var cIdx = parseInt(swatchBtn.getAttribute('data-card-swatch'), 10) || 0;
    var newImgUrl = swatchBtn.getAttribute('data-img') || '';
    card.dataset.selectedColorIdx = String(cIdx);

    $$('[data-card-swatch]', card).forEach(function (btn) {
      btn.classList.toggle('is-active', btn === swatchBtn);
    });

    if (newImgUrl) {
      var imgEl = $('.product-img', card);
      if (imgEl && imgEl.getAttribute('src') !== newImgUrl) {
        imgEl.setAttribute('src', newImgUrl);
        imgEl.classList.add('is-loaded');
      }
    }
  }

  document.addEventListener('mouseover', function (e) {
    var swatchBtn = e.target.closest('[data-card-swatch]');
    if (swatchBtn) {
      applyCardColorSwatch(swatchBtn);
    }
  });

  document.addEventListener('click', function (e) {
    if (headerCartWrapper && !e.target.closest('#headerCartWrapper')) {
      closeMiniCart();
    }

    var swatchBtn = e.target.closest('[data-card-swatch]');
    if (swatchBtn) {
      e.preventDefault();
      e.stopPropagation();
      applyCardColorSwatch(swatchBtn);
      return;
    }

    var policyBtn = e.target.closest('[data-policy-modal]');
    if (policyBtn) {
      e.preventDefault();
      openPolicyModal(policyBtn.getAttribute('data-policy-modal'));
      return;
    }

    var qvBtn = e.target.closest('[data-quickview]');
    if (qvBtn) {
      e.preventDefault();
      e.stopPropagation();
      var qvId = qvBtn.dataset.id || '';
      if (!qvId) {
        var qvCard = qvBtn.closest('.product-card');
        var qvLink = qvCard && $('h3 a', qvCard);
        if (qvLink) {
          try { qvId = new URL(qvLink.href, window.location.href).searchParams.get('id') || ''; } catch (err) {}
        }
      }
      openQuickView(qvId);
      return;
    }

    var add = e.target.closest('[data-add]');
    if (add) {
      var card = add.closest('.product-card');
      var name = add.dataset.name || (card && $('h3 a', card) ? $('h3 a', card).textContent.trim() : 'Sản phẩm');
      var id = add.dataset.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      var detailLink = card ? $('h3 a', card) : null;
      var category = '';
      if (detailLink) {
        try {
          var productUrl = new URL(detailLink.href, window.location.href);
          id = productUrl.searchParams.get('id') || id;
          category = productUrl.searchParams.get('cat') || '';
        } catch (err) {}
      }
      var product = window.VLU_FIND_PRODUCT ? (window.VLU_FIND_PRODUCT(id) || window.VLU_FIND_PRODUCT(name)) : null;
      if (!product) {
        showToast('Sản phẩm này không còn trong danh mục.');
        return;
      }
      id = product.id;
      if (product && product.name) name = product.name;
      var price = parseInt(add.dataset.price, 10);
      if (!price && card) {
        var priceEl = $('.product-price-current', card) || $('.text-brand', card);
        if (priceEl) {
          price = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''), 10) || 0;
        }
      }
      if (!(price > 0) && !(Number(product.basePrice) > 0)) {
        showToast('Giá sản phẩm đang được cập nhật, chưa thể thêm vào giỏ hàng.');
        return;
      }
      var imgEl = card ? $('img', card) : null;
      var chosenColorIdx = card ? (parseInt(card.dataset.selectedColorIdx, 10) || 0) : 0;
      var selectedColor = product && product.colors && product.colors.length
        ? (product.colors[chosenColorIdx] || product.colors[0])
        : null;
      var selectedVariant = product && product.variants && product.variants[0] ? product.variants[0] : null;
      var variantDelta = selectedVariant ? (parseInt(selectedVariant.delta, 10) || 0) : 0;
      var image = selectedColor ? (selectedColor.image || selectedColor.img || '') : (imgEl ? (imgEl.getAttribute('src') || '') : '');
      var finalItemPrice = price || (product ? (parseInt(product.basePrice, 10) || 0) + variantDelta : 0);

      var addedCartItem = {
        id: id,
        name: name,
        category: product ? product.category : category,
        price: finalItemPrice,
        oldPrice: product && product.oldPrice ? (parseInt(product.oldPrice, 10) || 0) + variantDelta : null,
        image: image,
        color: selectedColor ? selectedColor.name : 'Mặc định',
        variant: selectedVariant ? selectedVariant.label : 'Tiêu chuẩn',
        quantity: 1
      };

      if (window.VLU_CART) {
        window.VLU_CART.addItem(addedCartItem);
        window.VLU_CART.updateBadge(true);
      } else {
        count += 1;
        if (badge) {
          badge.textContent = count;
          badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
        }
      }
      triggerCartFeedback(addedCartItem, add);
      return;
    }

    var wish = e.target.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      var wishCard = wish.closest('.product-card');
      var wishId = wish.dataset.id || '';
      if (!wishId && window.location.pathname.indexOf('product-detail') !== -1) {
        wishId = new URLSearchParams(window.location.search).get('id') || '';
      }
      var wishLink = wishCard && $('h3 a', wishCard);
      if (wishLink) {
        try { wishId = new URL(wishLink.href, window.location.href).searchParams.get('id') || wishId; } catch (error) {}
      }
      if (!wishId && window.VLU_FIND_PRODUCT) {
        var productName = wishCard && $('h3 a', wishCard) ? $('h3 a', wishCard).textContent.trim() : '';
        var found = productName ? window.VLU_FIND_PRODUCT(productName) : null;
        if (found) wishId = found.id;
      }
      toggleWishlist(wishId, wish);
    }
  });

  /* ---------- 9. CAROUSEL ĐÁNH GIÁ KHÁCH HÀNG THỰC TẾ (#danh-gia-khach-hang) ---------- */
  var reviewsTrack = $('#reviewsTrack');
  var reviewDotsWrap = $('#reviewDots');
  var reviewPrevBtn = $('#reviewPrevBtn');
  var reviewNextBtn = $('#reviewNextBtn');
  var reviewAvgEl = $('#reviewAvgScore');
  var reviewTotalEl = $('#reviewTotalBadge');
  var reviewSlideIndex = 0;

  function getReviewsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function updateReviewsCarouselPosition() {
    if (!reviewsTrack) return;
    var cols = $$('.review-slide-col', reviewsTrack);
    var perView = getReviewsPerView();
    var maxIndex = Math.max(0, cols.length - perView);
    if (reviewSlideIndex > maxIndex) reviewSlideIndex = 0;
    if (reviewSlideIndex < 0) reviewSlideIndex = maxIndex;

    var pct = (100 / perView) * reviewSlideIndex;
    reviewsTrack.style.transform = 'translate3d(-' + pct.toFixed(4) + '%, 0, 0)';

    if (reviewDotsWrap) {
      var dotCount = maxIndex + 1;
      var existingDots = $$('.review-dot-btn', reviewDotsWrap);
      if (existingDots.length !== dotCount) {
        var dotsHtml = '';
        for (var d = 0; d < dotCount; d++) {
          dotsHtml += '<button type="button" class="review-dot-btn' + (d === reviewSlideIndex ? ' is-active' : '') + '" data-review-dot="' + d + '" aria-label="Trang đánh giá ' + (d + 1) + '"></button>';
        }
        reviewDotsWrap.innerHTML = dotsHtml;
      } else {
        existingDots.forEach(function (dot, idx) {
          dot.classList.toggle('is-active', idx === reviewSlideIndex);
        });
      }
    }
  }

  function renderCustomerReviewsCarousel() {
    if (!reviewsTrack) return;
    var reviews = getAllSystemReviews();
    if (!reviews.length) return;

    var totalRating = reviews.reduce(function (sum, r) { return sum + (Number(r.rating) || 5); }, 0);
    var avgScore = (totalRating / reviews.length).toFixed(1);
    if (reviewAvgEl) reviewAvgEl.textContent = avgScore + ' / 5.0';
    if (reviewTotalEl) reviewTotalEl.textContent = reviews.length + ' đánh giá xác thực';

    reviewsTrack.innerHTML = reviews.map(function (rev) {
      var p = rev.product;
      var rawImg = p.image || (p.colors && p.colors[0] && (p.colors[0].image || p.colors[0].img));
      var pImg = resolveImage(rawImg, p.category);
      var fallback = 'frontend/assets/images/placeholders/' + (p.category || 'phone') + '.svg';
      var pHref = productHref(p);
      var starsCount = Math.min(5, Math.max(1, Math.round(rev.rating)));
      var starsHtml = '';
      for (var s = 0; s < 5; s++) {
        starsHtml += '<svg class="h-3.5 w-3.5 ' + (s < starsCount ? 'text-amber-400' : 'text-slate-200') + ' fill-current" viewBox="0 0 20 20"><use href="#i-star"/></svg>';
      }
      var dateFormatted = '';
      try {
        var dt = new Date(rev.createdAt);
        dateFormatted = Number.isNaN(dt.getTime()) ? String(rev.createdAt) : dt.toLocaleDateString('vi-VN');
      } catch (e) { dateFormatted = ''; }

      var avatarMarkup = rev.avatar
        ? '<img src="' + escapeHtml(rev.avatar) + '" alt="' + escapeHtml(rev.reviewerName) + '" class="h-full w-full object-cover">'
        : '<svg class="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.1 0-7.5 2.1-7.5 4.7V21h15v-2.3c0-2.6-3.4-4.7-7.5-4.7Z"/></svg>';

      return '<div class="review-slide-col">' +
        '<article class="review-card">' +
          '<div>' +
            '<div class="flex items-start justify-between gap-3">' +
              '<div class="flex items-center gap-3">' +
                '<span class="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft ring-2 ring-rose-100">' +
                  avatarMarkup +
                '</span>' +
                '<div>' +
                  '<h3 class="text-sm font-extrabold text-slate-900">' + escapeHtml(rev.reviewerName) + '</h3>' +
                  '<span class="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">' +
                    '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' +
                    '<span>Đã mua hàng tại VLU</span>' +
                  '</span>' +
                '</div>' +
              '</div>' +
              '<div class="flex items-center gap-0.5" aria-label="' + starsCount + ' trên 5 sao">' +
                starsHtml +
              '</div>' +
            '</div>' +
            (rev.tags && rev.tags.length
              ? '<div class="mt-3 flex flex-wrap gap-1.5">' +
                  rev.tags.map(function (t) {
                    return '<span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">' + escapeHtml(t) + '</span>';
                  }).join('') +
                '</div>'
              : '') +
            '<p class="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">“' + escapeHtml(rev.comment) + '”</p>' +
          '</div>' +
          '<div class="mt-4 pt-3 border-t border-slate-100">' +
            '<a href="' + pHref + '" class="review-product-box">' +
              '<span class="review-product-thumb">' +
                '<img src="' + escapeHtml(pImg) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + fallback + '\';">' +
              '</span>' +
              '<div class="min-w-0 flex-1">' +
                '<p class="truncate text-xs font-extrabold text-slate-900">' + escapeHtml(p.name) + '</p>' +
                '<p class="text-[10px] font-semibold text-slate-400">Đơn ' + escapeHtml(rev.orderId) + (dateFormatted ? ' · ' + escapeHtml(dateFormatted) : '') + '</p>' +
              '</div>' +
              '<span class="text-xs font-extrabold text-brand shrink-0">Xem máy →</span>' +
            '</a>' +
          '</div>' +
        '</article>' +
      '</div>';
    }).join('');

    updateReviewsCarouselPosition();
  }

  renderCustomerReviewsCarousel();

  if (reviewPrevBtn) {
    reviewPrevBtn.addEventListener('click', function () {
      reviewSlideIndex -= 1;
      updateReviewsCarouselPosition();
    });
  }
  if (reviewNextBtn) {
    reviewNextBtn.addEventListener('click', function () {
      reviewSlideIndex += 1;
      updateReviewsCarouselPosition();
    });
  }
  if (reviewDotsWrap) {
    reviewDotsWrap.addEventListener('click', function (e) {
      var dot = e.target.closest('[data-review-dot]');
      if (!dot) return;
      reviewSlideIndex = parseInt(dot.getAttribute('data-review-dot'), 10) || 0;
      updateReviewsCarouselPosition();
    });
  }
  window.addEventListener('resize', updateReviewsCarouselPosition);

  /* ---------- 10. MODAL CHÍNH SÁCH FOOTER (#policyModal) ---------- */
  var policyModal = $('#policyModal');
  var policyModalTitle = $('#policyModalTitle');
  var policyModalBadge = $('#policyModalBadge');
  var policyModalBody = $('#policyModalBody');
  var policyModalCloseBtn = $('#policyModalCloseBtn');
  var policyModalAcceptBtn = $('#policyModalAcceptBtn');

  var POLICY_CONTENT_MAP = {
    privacy: {
      badge: 'Bảo mật & Quyền riêng tư',
      title: 'Chính sách bảo mật thông tin khách hàng',
      html:
        '<p class="font-semibold text-slate-800">VLU FLAGSHIP STORE cam kết bảo vệ tuyệt đối quyền riêng tư và dữ liệu cá nhân của mọi khách hàng khi mua sắm tại hệ thống cửa hàng và website.</p>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">1. Phạm vi thu thập &amp; Lưu trữ</h4>' +
          '<p>Thông tin Họ tên, Số điện thoại, Email và Địa chỉ giao nhận chỉ được sử dụng để xác nhận đơn hàng, kích hoạt bảo hành điện tử 12–24 tháng và tích điểm thành viên VLU Member.</p>' +
        '</div>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">2. An toàn thanh toán &amp; Dữ liệu thiết bị</h4>' +
          '<p>Giỏ hàng (<code class="font-bold text-brand">vlu_cart_${userId}</code>) và thông tin tài khoản được tách biệt độc lập theo từng người dùng. Chúng tôi tuyệt đối không lưu trữ mã CVV hoặc thông tin thẻ ngân hàng nhạy cảm.</p>' +
        '</div>'
    },
    terms: {
      badge: 'Quy định chung',
      title: 'Điều khoản sử dụng dịch vụ tại VLU FLAGSHIP STORE',
      html:
        '<p class="font-semibold text-slate-800">Chào mừng quý khách đến với hệ thống bán lẻ công nghệ chính hãng VLU FLAGSHIP STORE. Khi đặt hàng trên website, quý khách đồng ý với các quy định minh bạch dưới đây:</p>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">1. Cam kết chất lượng sản phẩm</h4>' +
          '<p>100% sản phẩm Điện thoại, Laptop, iPad, Tai nghe, Loa và Đồng hồ thông minh đều là hàng chính hãng nguyên seal (VN/A hoặc phân phối chính thức), đầy đủ hóa đơn VAT.</p>' +
        '</div>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">2. Giá bán &amp; Chương trình khuyến mãi</h4>' +
          '<p>Mọi mức giá niêm yết, giá giảm và mã Voucher (<code class="font-bold text-brand">VLU2026</code>, <code class="font-bold text-brand">FLAGSHIP</code>, <code class="font-bold text-brand">SVVLU10</code>) được áp dụng công khai, tự động tính toán chính xác khi thanh toán.</p>' +
        '</div>'
    },
    shipping: {
      badge: 'Vận chuyển & Giao nhận',
      title: 'Chính sách vận chuyển & Giao hàng hỏa tốc 2H',
      html:
        '<p class="font-semibold text-slate-800">VLU FLAGSHIP STORE cung cấp dịch vụ giao nhận linh hoạt, an toàn có bảo hiểm hàng hóa 100% giá trị máy:</p>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">1. Giao hàng hỏa tốc nội thành 2 giờ</h4>' +
          '<p>Áp dụng tại TP.HCM và Hà Nội cho các đơn hàng xác nhận từ 08:00 – 20:00. Kỹ thuật viên VLU giao máy tận nơi, hỗ trợ đồng kiểm ngoại quan và mở seal kích hoạt máy trực tiếp.</p>' +
        '</div>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">2. Nhận tại hệ thống 5 Chi nhánh VLU</h4>' +
          '<p>Quý khách có thể chọn nhận máy trực tiếp tại Cơ sở chính Bình Thạnh (69/68 Đặng Thùy Trâm), Quận 1, Phú Nhuận, Quận 7 hoặc Hoàn Kiếm (Hà Nội) hoàn toàn miễn phí.</p>' +
        '</div>'
    },
    warranty: {
      badge: 'Bảo hành & Đổi trả 1-1',
      title: 'Chính sách Đổi trả 1-1 & Bảo hành chính hãng',
      html:
        '<p class="font-semibold text-slate-800">Quyền lợi hậu mãi toàn diện dành cho mọi thiết bị mua tại VLU FLAGSHIP STORE:</p>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">1. Đặc quyền 1 Đổi 1 trong 30 ngày đầu</h4>' +
          '<p>Nếu thiết bị phát sinh lỗi phần cứng từ nhà sản xuất trong 30 ngày đầu tiên, VLU FLAGSHIP STORE hỗ trợ đổi ngay máy mới nguyên seal tương đương mà không mất phí.</p>' +
        '</div>' +
        '<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">' +
          '<h4 class="font-extrabold text-slate-900">2. Bảo hành điện tử 12 – 24 tháng</h4>' +
          '<p>Tất cả sản phẩm được kích hoạt bảo hành điện tử tự động theo mã đơn hàng. Quý khách có thể tra cứu thời hạn bảo hành còn lại và gửi yêu cầu hỗ trợ trực tiếp tại trang <a href="account.html?tab=warranty" class="font-bold text-brand underline">Tài khoản &rarr; Bảo hành &amp; Đổi trả</a>.</p>' +
        '</div>'
    }
  };

  function closePolicyModal() {
    if (!policyModal) return;
    policyModal.classList.remove('is-open');
    policyModal.setAttribute('aria-hidden', 'true');
  }

  function openPolicyModal(policyKey) {
    if (!policyModal) return;
    var data = POLICY_CONTENT_MAP[policyKey] || POLICY_CONTENT_MAP.privacy;
    if (policyModalBadge) policyModalBadge.textContent = data.badge;
    if (policyModalTitle) policyModalTitle.textContent = data.title;
    if (policyModalBody) policyModalBody.innerHTML = data.html;
    policyModal.classList.add('is-open');
    policyModal.setAttribute('aria-hidden', 'false');
  }

  if (policyModalCloseBtn) policyModalCloseBtn.addEventListener('click', closePolicyModal);
  if (policyModalAcceptBtn) policyModalAcceptBtn.addEventListener('click', closePolicyModal);
  if (policyModal) {
    policyModal.addEventListener('click', function (e) {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePolicyModal();
      closeMiniCart();
    }
  });

  /* ---------- 11. GLOBAL LINK, WISHLIST, SCROLL REVEAL & BACK TO TOP ---------- */
  function hydrateCardWishlistStates() {
    var wishlistIds = getWishlistIds();
    var currentProductId = window.location.pathname.indexOf('product-detail') !== -1
      ? new URLSearchParams(window.location.search).get('id')
      : '';
    $$('[data-wish]').forEach(function (wish) {
      var card = wish.closest('.product-card');
      var link = card && $('h3 a', card);
      var productId = currentProductId || wish.dataset.id || '';
      if (!productId && link) {
        try { productId = new URL(link.href, window.location.href).searchParams.get('id') || ''; } catch (err) {}
      }
      var wished = wishlistIds.indexOf(productId) !== -1;
      wish.setAttribute('aria-pressed', String(wished));
      wish.setAttribute('data-tooltip', wished ? 'Đã yêu thích' : 'Lưu yêu thích');
    });
  }

  // Nút Back to Top (#backToTopBtn) & Smooth Anchor Scrolling
  var backToTopBtn = $('#backToTopBtn');
  if (!backToTopBtn && document.body) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.type = 'button';
    backToTopBtn.id = 'backToTopBtn';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Cuộn về đầu trang');
    backToTopBtn.setAttribute('data-tooltip', 'Về đầu trang');
    backToTopBtn.innerHTML = '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(backToTopBtn);
  }

  function syncBackToTopState() {
    if (!backToTopBtn) return;
    backToTopBtn.classList.toggle('is-visible', getScrollTop() > 400);
  }
  syncBackToTopState();
  window.addEventListener('scroll', syncBackToTopState, { passive: true });
  document.addEventListener('scroll', syncBackToTopState, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    var targetEl = null;
    try { targetEl = $(hash); } catch (err) {}
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Hệ thống Scroll Reveal Animation (IntersectionObserver + Stagger --stagger-idx)
  var revealObserver = null;
  function initScrollReveal() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sectionIds = [
      '#kham-pha-danh-muc',
      '#san-pham-moi',
      '#san-pham-ban-chay',
      '#san-pham-khuyen-mai',
      '#banner-thuong-hieu',
      '#thuong-hieu-noi-bat',
      '#dac-quyen-mua-sam',
      '#danh-gia-khach-hang',
      '#site-footer'
    ];

    var targets = [];

    sectionIds.forEach(function (secSelector) {
      var sec = $(secSelector);
      if (!sec) return;
      var headerBlock = $('h2', sec) && $('h2', sec).closest('div.mb-6, div.mb-7, .promo-sale-header-banner');
      if (headerBlock && !headerBlock.classList.contains('scroll-reveal-header')) {
        headerBlock.classList.add('scroll-reveal-header');
      }
      if (headerBlock) targets.push(headerBlock);

      var staggerItems = $$(
        '.category-explore-card, .product-card, .bento-banner-card, .brand-logo-card, .privilege-card',
        sec
      );
      staggerItems.forEach(function (item, idx) {
        if (!item.classList.contains('stagger-reveal-item')) {
          item.classList.add('stagger-reveal-item');
          item.style.setProperty('--stagger-idx', String(Math.min(idx, 11)));
        }
        targets.push(item);
      });
    });

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -24px 0px',
        threshold: 0.06
      });
    }

    var viewportH = window.innerHeight || document.documentElement.clientHeight || 800;
    targets.forEach(function (el) {
      if (el.classList.contains('is-revealed')) return;
      var rect = el.getBoundingClientRect();
      // Hiển thị ngay lập tức nếu phần tử đang nằm trong vùng nhìn thấy đầu tiên
      if (rect.top <= viewportH * 0.96) {
        el.classList.add('is-revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  hydrateProductImages(document);
  initScrollReveal();

  document.addEventListener('DOMContentLoaded', function () {
    hydrateCardWishlistStates();
    hydrateProductImages(document);
    initScrollReveal();
    $$('.product-card').forEach(function (card) {
      var link = $('h3 a', card);
      if (link) {
        var currentHref = link.getAttribute('href') || '';
        if (currentHref === '' || currentHref === '#' || currentHref.indexOf('product.php') !== -1) {
          var name = (link.textContent || '').trim();
          var slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          link.setAttribute('href', 'product-detail.html?id=' + encodeURIComponent(slug) + '&name=' + encodeURIComponent(name));
        }
      }
    });
  });

  /* ---------- 12. REAL-TIME ADMIN & ACCOUNT -> USER SYNC ---------- */
  function onStoreSync() {
    if (typeof window.VLU_SYNC_PRODUCTS === 'function') {
      window.VLU_SYNC_PRODUCTS();
    }
    renderCatalogMenus();
    renderHomeCatalog();
    renderCustomerReviewsCarousel();
    hydrateCardWishlistStates();
    renderMiniCart();

    $$('.product-card').forEach(function (card) {
      var link = $('h3 a', card);
      if (!link) return;
      var pName = link.textContent.trim();
      var p = window.VLU_FIND_PRODUCT ? window.VLU_FIND_PRODUCT(pName) : null;
      if (p) {
        var priceEl = $('.product-price-current', card) || $('.font-black.text-brand', card);
        if (priceEl && p.basePrice) {
          priceEl.textContent = formatVnd(p.basePrice);
        }
      }
    });

    if (window.VLU_CART && typeof window.VLU_CART.sanitizeStaleProducts === 'function') {
      window.VLU_CART.sanitizeStaleProducts();
      window.VLU_CART.updateBadge();
    }
  }

  window.addEventListener('storage', function (e) {
    if (e.key === 'vlu_sync_timestamp' || e.key === 'vlu_admin_products' || e.key === 'vlu_products') {
      onStoreSync();
      return;
    }
    if (e.key && (e.key.indexOf('vlu_account_') === 0 || e.key === 'vlu_user')) {
      renderHomeCatalog();
      renderCustomerReviewsCarousel();
      hydrateCardWishlistStates();
      renderMiniCart();
    }
  });

  window.addEventListener('vlu:auth-updated', function () {
    hydrateCardWishlistStates();
    renderMiniCart();
  });

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      var storeSyncChannel = new BroadcastChannel('vlu_store_sync');
      storeSyncChannel.onmessage = function () {
        onStoreSync();
      };
    }
  } catch (errBc) {}

})();
