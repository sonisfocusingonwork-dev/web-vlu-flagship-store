/**
 * VLU FLAGSHIP STORE – Client Interaction Script
 * - Mega-Menu 6 danh mục (Điện thoại, Laptop, iPad, Tai nghe, Loa, Đồng hồ)
 * - Hero Banner Carousel trượt vô hạn
 * - Mobile Drawer Accordion
 * - Giỏ hàng, nút yêu thích & Toast thông báo Dynamic Island
 * - Global Product Link Binding
 */
(function () {
  'use strict';

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  var CATALOG_CATEGORIES = [
    { id: 'dien-thoai', name: 'Điện thoại' },
    { id: 'laptop', name: 'Laptop' },
    { id: 'ipad', name: 'iPad' },
    { id: 'tai-nghe', name: 'Tai nghe' },
    { id: 'loa', name: 'Loa' },
    { id: 'dong-ho-dien-tu', name: 'Đồng hồ điện tử' }
  ];

  function productHref(product) {
    return 'product-detail.html?id=' + encodeURIComponent(product.id) +
      '&name=' + encodeURIComponent(product.name) +
      '&cat=' + encodeURIComponent(product.category);
  }

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
    var navList = $('.nav-list');
    if (navList) {
      var navById = {};
      $$('.nav-item-mega', navList).forEach(function (item) { navById[item.id.replace(/^menuItem-/, '')] = item; });
      CATALOG_CATEGORIES.forEach(function (category) {
        var item = navById[category.id];
        if (!item) return;
        navList.appendChild(item);
        var panel = $('.mega-panel', item);
        var menuContent = panel && $('.mega-menu-scroll .mx-auto', panel);
        var grid = menuContent && Array.prototype.find.call(menuContent.children, function (child) {
          return /\bgrid\b/.test(child.className) || child.classList.contains('mega-grid-flow');
        });
        if (!grid) return;
        grid.textContent = '';
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
          var column = document.createElement('div');
          var title = document.createElement('h4');
          column.className = 'mega-brand-col';
          title.className = 'text-xs font-extrabold text-slate-900 pb-2 mb-2.5 border-b border-slate-200/80 leading-tight';
          title.textContent = group.name;
          column.appendChild(title);
          column.appendChild(buildProductLinks(group.products));
          grid.appendChild(column);
        });
      });
      Object.keys(navById).forEach(function (id) {
        if (!CATALOG_CATEGORIES.some(function (category) { return category.id === id; })) navById[id].remove();
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
      CATALOG_CATEGORIES.forEach(function (category) {
        var card = mobileByName[category.name];
        if (!card) return;
        var body = $('.mobile-accordion-body', card);
        if (!body) return;
        body.textContent = '';

        var viewAllLink = document.createElement('a');
        viewAllLink.className = 'flex items-center justify-between rounded-xl bg-brand/10 px-3 py-2 text-xs font-extrabold text-brand hover:bg-brand hover:text-white transition';
        viewAllLink.href = 'category.html?cat=' + encodeURIComponent(category.id);
        viewAllLink.innerHTML = '<span>Xem tất cả ' + category.name + '</span><span>→</span>';
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

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function renderHomeCatalog() {
    var catalog = window.VLU_CATALOG;
    if (!catalog) return;
    var allProducts = Object.keys(catalog).map(function (id) { return catalog[id]; });
    var featured = [];
    CATALOG_CATEGORIES.forEach(function (category) {
      allProducts.filter(function (product) { return product.category === category.id; }).slice(0, 2).forEach(function (product) {
        featured.push(product);
      });
    });
    var launchGrid = $('.launch-grid');
    if (launchGrid) {
      launchGrid.innerHTML = featured.map(function (product) {
        var image = product.image || (product.colors && product.colors[0] && (product.colors[0].image || product.colors[0].img)) ||
          'frontend/assets/images/placeholders/phone.svg';
        var href = productHref(product);
        var price = Number(product.basePrice) > 0 ? Number(product.basePrice).toLocaleString('vi-VN') + '₫' : 'Giá liên hệ';
        return '<article class="product-card group">' +
          '<div class="product-img-box"><button type="button" data-wish data-id="' + escapeHtml(product.id) + '" aria-pressed="false" aria-label="Yêu thích ' + escapeHtml(product.name) + '" class="absolute right-2 top-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-red-600 active:scale-90"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><use href="#i-heart"/></svg></button>' +
          '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy" class="product-img"></div>' +
          '<div class="mt-3 flex flex-1 flex-col sm:mt-4"><div class="flex items-center justify-between gap-2"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">' + escapeHtml(product.brand) + '</p></div>' +
          '<h3 class="mt-1 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-brand sm:text-base"><a href="' + href + '" class="after:absolute after:inset-0 after:z-0">' + escapeHtml(product.name) + '</a></h3>' +
          '<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">' + escapeHtml(product.tagline || 'Sản phẩm chính hãng tại VLU FLAGSHIP STORE.') + '</p>' +
          '<div class="mt-auto flex items-end justify-between gap-2 pt-3"><p class="text-sm font-extrabold text-brand sm:text-lg">' + price + '</p>' +
          (Number(product.basePrice) > 0 ? '<button type="button" data-add data-id="' + escapeHtml(product.id) + '" data-name="' + escapeHtml(product.name) + '" data-price="' + Number(product.basePrice) + '" aria-label="Thêm ' + escapeHtml(product.name) + ' vào giỏ hàng" class="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-white shadow-sm transition hover:bg-brand active:scale-95"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5"><use href="#i-plus"/></svg></button>' : '') +
          '</div></div></article>';
      }).join('');
    }

    var slides = $$('.hero-slide');
    var featuredSlides = allProducts.filter(function (product, index, list) {
      return list.findIndex(function (entry) { return entry.brand === product.brand; }) === index;
    }).slice(0, slides.length);
    slides.forEach(function (slide, index) {
      var product = featuredSlides[index];
      if (!product) return;
      var title = $('h2', slide);
      var brand = $('.hero-content > span', slide);
      var link = $('a', slide);
      if (title) title.textContent = product.name;
      if (brand) brand.textContent = product.brand + ' · Chính hãng';
      if (link) link.href = productHref(product);
    });
  }

  renderHomeCatalog();

  /* ---------- 1. MENU MEGA (6 DANH MỤC CHÍNH) ---------- */
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
    }, 220); // Đệm 220ms chống giật khi di chuột chéo
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

  // Đóng khi click scrim hoặc click ngoài
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
    }
  });

  /* ---------- 2. MOBILE DRAWER ACCORDION ---------- */
  var mobileBtn = $('#mobileMenuBtn');
  var mobileDrawer = $('#mobileDrawer');

  if (mobileDrawer && mobileDrawer.parentElement !== document.body) {
    // Di chuyển #mobileDrawer ra trực tiếp document.body để tránh bị backdrop-filter của #site-header khóa chiều cao position:fixed
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
      if (willOpen) {
        openMobileDrawer();
      } else {
        closeMobileDrawer();
      }
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

  /* ---------- 3. HERO SLIDER TRƯỢT VÔ HẠN ---------- */
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

    var index = 0, timer = null, startX = null, INTERVAL = 5000;
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
        d.firstElementChild.className = 'block h-2.5 rounded-full transition-all duration-300 ' + (on ? 'w-7 bg-ink' : 'w-2.5 bg-ink/30');
      });
    };
    var next = function () { index += 1; setX(true); paint(); };
    var prev = function () {
      if (index === 0) { index = n; setX(false); track.getBoundingClientRect(); }
      index -= 1; setX(true); paint();
    };
    track.addEventListener('transitionend', function (e) {
      if (e.target === track && index >= n) { index = 0; setX(false); }
    });

    var play = function () { if (!reduce && !timer) timer = setInterval(next, INTERVAL); };
    var stop = function () { clearInterval(timer); timer = null; };

    var heroNextBtn = $('#heroNext');
    var heroPrevBtn = $('#heroPrev');
    if (heroNextBtn) heroNextBtn.addEventListener('click', next);
    if (heroPrevBtn) heroPrevBtn.addEventListener('click', prev);
    dots.forEach(function (d, k) { d.addEventListener('click', function () { index = k; setX(true); paint(); }); });

    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', play);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });

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

  /* ---------- 4. GIỎ HÀNG + YÊU THÍCH ---------- */
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
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function getAccountStoreKey() {
    var user = null;
    try { user = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (error) {}
    var identity = user && (user.username || user.email || user.id);
    if (!identity) return null;
    return 'vlu_account_' + String(identity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
  }

  function toggleWishlist(productId, button) {
    var storeKey = getAccountStoreKey();
    if (!storeKey || !productId) {
      showToast('Đăng nhập để lưu sản phẩm yêu thích.');
      return;
    }
    try {
      var store = JSON.parse(localStorage.getItem(storeKey) || '{}');
      if (!Array.isArray(store.wishlist)) store.wishlist = [];
      var index = store.wishlist.indexOf(productId);
      if (index === -1) store.wishlist.push(productId);
      else store.wishlist.splice(index, 1);
      localStorage.setItem(storeKey, JSON.stringify(store));
      button.setAttribute('aria-pressed', String(index === -1));
      showToast(index === -1 ? 'Đã thêm vào sản phẩm yêu thích.' : 'Đã xóa khỏi sản phẩm yêu thích.');
    } catch (error) {
      console.error('[Main] Không thể cập nhật danh sách yêu thích:', error);
      showToast('Không thể lưu sản phẩm yêu thích trên thiết bị.');
    }
  }

  document.addEventListener('click', function (e) {
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
        var priceEl = $('.text-brand', card);
        if (priceEl) {
          price = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''), 10) || 0;
        }
      }
      if (!(price > 0) && !(Number(product.basePrice) > 0)) {
        showToast('Giá sản phẩm đang được cập nhật, chưa thể thêm vào giỏ hàng.');
        return;
      }
      var imgEl = card ? $('img', card) : null;
      var selectedColor = product && product.colors && product.colors[0] ? product.colors[0] : null;
      var selectedVariant = product && product.variants && product.variants[0] ? product.variants[0] : null;
      var variantDelta = selectedVariant ? (parseInt(selectedVariant.delta, 10) || 0) : 0;
      var image = selectedColor ? (selectedColor.image || selectedColor.img || '') : (imgEl ? (imgEl.getAttribute('src') || '') : '');

      if (window.VLU_CART) {
        window.VLU_CART.addItem({
          id: id,
          name: name,
          category: product ? product.category : category,
          price: price || (product ? (parseInt(product.basePrice, 10) || 0) + variantDelta : 0),
          oldPrice: product && product.oldPrice ? (parseInt(product.oldPrice, 10) || 0) + variantDelta : null,
          image: image,
          color: selectedColor ? selectedColor.name : 'Mặc định',
          variant: selectedVariant ? selectedVariant.label : 'Tiêu chuẩn',
          quantity: 1
        });
        window.VLU_CART.updateBadge(true);
        window.VLU_CART.showToast('Đã thêm "' + name + '" vào giỏ hàng!');
      } else {
        count += 1;
        if (badge) {
          badge.textContent = count;
          badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
        }
        showToast('Đã thêm "' + name + '" vào giỏ hàng');
      }
      return;
    }
    var wish = e.target.closest('[data-wish]');
    if (wish) {
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
        var product = productName ? window.VLU_FIND_PRODUCT(productName) : null;
        if (product) wishId = product.id;
      }
      toggleWishlist(wishId, wish);
    }
  });

  /* ---------- 5. GLOBAL LINK BINDING CHO SẢN PHẨM ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var accountKey = getAccountStoreKey();
    if (accountKey) {
      try {
        var accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');
        var currentProductId = window.location.pathname.indexOf('product-detail') !== -1
          ? new URLSearchParams(window.location.search).get('id')
          : '';
        $$('[data-wish]').forEach(function (wish) {
          var card = wish.closest('.product-card');
          var link = card && $('h3 a', card);
          var productId = currentProductId || wish.dataset.id || '';
          if (!productId && link) productId = new URL(link.href, window.location.href).searchParams.get('id') || '';
          wish.setAttribute('aria-pressed', String(Array.isArray(accountData.wishlist) && accountData.wishlist.indexOf(productId) !== -1));
        });
      } catch (error) {
        console.warn('[Main] Không thể nạp trạng thái yêu thích:', error);
      }
    }
    $$('.product-card').forEach(function (card) {
      var link = $('h3 a', card);
      if (link) {
        var currentHref = link.getAttribute('href') || '';
        if (currentHref === '' || currentHref === '#' || currentHref.indexOf('product.php') !== -1) {
          var name = (link.textContent || '').trim();
          var slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          link.setAttribute('href', 'product-detail.html?id=' + encodeURIComponent(slug) + '&name=' + encodeURIComponent(name));
        }
        var wish = $('[data-wish]', card);
        var storeKey = getAccountStoreKey();
        if (wish && storeKey) {
          try {
            var store = JSON.parse(localStorage.getItem(storeKey) || '{}');
            var productId = new URL(link.href, window.location.href).searchParams.get('id');
            wish.setAttribute('aria-pressed', String(Array.isArray(store.wishlist) && store.wishlist.indexOf(productId) !== -1));
          } catch (error) {
            console.warn('[Main] Không thể đồng bộ trạng thái yêu thích:', error);
          }
        }
      }
    });
  });

})();
