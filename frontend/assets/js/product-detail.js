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

  // 3. Cơ chế Smart Fallback – Tự động nhận diện cấu hình từ tên sản phẩm
  // 4. Chỉ hiển thị sản phẩm thuộc danh mục hiện hành
  var product = null;
  if (rawId && window.VLU_FIND_PRODUCT) {
    product = window.VLU_FIND_PRODUCT(rawId);
  }
  if (!product && rawName && window.VLU_FIND_PRODUCT) {
    product = window.VLU_FIND_PRODUCT(rawName);
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

  // Keep the recently viewed list isolated by the same identity used by the cart.
  try {
    var accountUser = JSON.parse(localStorage.getItem('vlu_user') || 'null');
    var accountIdentity = accountUser && (accountUser.username || accountUser.email || accountUser.id);
    if (accountIdentity && product.id) {
      var accountKey = 'vlu_account_' + String(accountIdentity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
      var accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');
      if (!Array.isArray(accountData.recent)) accountData.recent = [];
      accountData.recent = [product.id].concat(accountData.recent.filter(function (id) { return id !== product.id; })).slice(0, 24);
      localStorage.setItem(accountKey, JSON.stringify(accountData));
    }
  } catch (error) {
    console.warn('[ProductDetail] Không thể lưu lịch sử xem:', error);
  }

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
      catBreadcrumb.href = 'category.php?cat=' + encodeURIComponent(p.category || 'dien-thoai');
    }
    var brandBreadcrumb = document.getElementById('pdBreadcrumbBrand');
    if (brandBreadcrumb) {
      brandBreadcrumb.textContent = p.brand;
      brandBreadcrumb.href = 'search.php?q=' + encodeURIComponent(p.brand);
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

    // 5.4 Tiêu đề, Hãng & Đánh giá
    var eyebrow = document.getElementById('pdEyebrow');
    if (eyebrow) eyebrow.textContent = p.brand + ' · Flagship 2026';
    var titleEl = document.getElementById('pdName');
    if (titleEl) titleEl.textContent = p.name;

    // 5.5 Hình ảnh lớn mặc định
    var mainImg = document.getElementById('mainProductImg');
    var imageColorLabel = document.getElementById('imageColorLabel');
    var defaultImgUrl = (p.colors && p.colors[0] && (p.colors[0].image || p.colors[0].img)) || 'frontend/assets/images/placeholders/phone.svg';
    var defaultColorName = (p.colors && p.colors[0] && p.colors[0].name) || 'Mặc định';

    if (mainImg) {
      mainImg.style.transition = 'opacity 0.22s ease-in-out, transform 0.22s ease-in-out';
      mainImg.src = defaultImgUrl;
      mainImg.alt = p.name + ' - ' + defaultColorName;
    }
    if (imageColorLabel) imageColorLabel.textContent = defaultColorName;

    // 5.6 Thumbnails
    var thumbStrip = document.getElementById('thumbnailStrip');
    if (thumbStrip) {
      var thumbsHtml = '';
      var seenThumbs = {};
      (p.colors || []).forEach(function (c, idx) {
        var cImg = c.image || c.img;
        if (!cImg || seenThumbs[cImg] || /^https?:\/\//i.test(cImg) || /(^|\/)Banner\//i.test(cImg)) return;
        seenThumbs[cImg] = true;
        thumbsHtml += '<button type="button" class="thumb-btn' + (idx === 0 ? ' active' : '') + '"'
          + ' data-src="' + cImg + '"'
          + ' data-color-name="' + c.name + '"'
          + ' data-color-key="' + c.key + '"'
          + ' aria-label="Xem ảnh ' + c.name + '">'
          + '<img src="' + (c.image || c.img) + '" alt="' + c.name + '">'
          + '</button>'
      });
      (p.extraImages || []).forEach(function (extra) {
        if (!extra.src || seenThumbs[extra.src] || /^https?:\/\//i.test(extra.src) || /(^|\/)Banner\//i.test(extra.src)) return;
        seenThumbs[extra.src] = true;
        thumbsHtml += '<button type="button" class="thumb-btn"'
          + ' data-src="' + extra.src + '"'
          + ' data-color-name="' + extra.label + '"'
          + ' data-color-key="' + extra.key + '"'
          + ' aria-label="Xem góc chụp ' + extra.label + '">'
          + '<img src="' + extra.src + '" alt="' + extra.label + '">'
          + '</button>';
      });
      thumbStrip.innerHTML = thumbsHtml;
    }

    // 5.7 Swatches Chọn Màu Sắc
    var swatchContainer = document.getElementById('colorSwatches');
    var selectedColorName = document.getElementById('selectedColorName');
    if (selectedColorName) selectedColorName.textContent = defaultColorName;

    if (swatchContainer) {
      var swatchesHtml = '';
      (p.colors || []).forEach(function (c, idx) {
        swatchesHtml += '<button type="button" class="color-swatch-btn' + (idx === 0 ? ' active' : '') + '"'
          + ' data-color-key="' + c.key + '"'
          + ' data-color-name="' + c.name + '"'
          + ' data-img="' + (c.image || c.img) + '"'
          + ' style="background-color: ' + c.hex + ';"'
          + ' title="' + c.name + '"'
          + ' aria-label="Chọn màu ' + c.name + '"'
          + ' aria-checked="' + (idx === 0 ? 'true' : 'false') + '" role="radio"></button>';
      });
      swatchContainer.innerHTML = swatchesHtml;
    }

    // 5.8 Phiên bản / Dung lượng
    var variantTitle = document.getElementById('variantLabel');
    if (variantTitle) variantTitle.textContent = p.variantLabel || 'Phiên bản / Dung lượng';
    var selectedVariantLabel = document.getElementById('selectedVariantName');
    var defaultVariantName = (p.variants && p.variants[0] && p.variants[0].label) || 'Tiêu chuẩn';
    if (selectedVariantLabel) selectedVariantLabel.textContent = defaultVariantName;

    var variantGrid = document.getElementById('variantGrid');
    if (variantGrid) {
      var variantsHtml = '';
      (p.variants || []).forEach(function (v, idx) {
        var vPrice = Number(p.basePrice) > 0 ? formatVND(p.basePrice + (v.delta || 0)) : 'Liên hệ';
        variantsHtml += '<button type="button" class="storage-btn' + (idx === 0 ? ' active' : '') + '"'
          + ' data-label="' + v.label + '"'
          + ' data-delta="' + (v.delta || 0) + '"'
          + ' data-discount="' + (v.discount || '') + '"'
          + ' role="radio" aria-checked="' + (idx === 0 ? 'true' : 'false') + '">'
          + '<span class="text-sm font-black text-slate-900">' + v.label + '</span>'
          + '<span class="text-[11px] font-semibold text-slate-500 mt-0.5">' + vPrice + '</span>'
          + '</button>';
      });
      variantGrid.innerHTML = variantsHtml;
    }

    // 5.9 Giá tiền & Trả góp
    var priceEl = document.getElementById('productPrice');
    var oldPriceEl = document.getElementById('oldPrice');
    var discountEl = document.getElementById('discountBadge');
    var hasPrice = Number(p.basePrice) > 0;
    if (priceEl) priceEl.textContent = hasPrice ? formatVND(p.basePrice) : 'Giá liên hệ';
    if (oldPriceEl) {
      if (p.oldPrice && p.oldPrice > p.basePrice) {
        oldPriceEl.textContent = formatVND(p.oldPrice);
        oldPriceEl.classList.remove('hidden');
      } else {
        oldPriceEl.classList.add('hidden');
      }
    }
    if (discountEl) {
      var dStr = (p.variants && p.variants[0] && p.variants[0].discount) || '';
      if (dStr) {
        discountEl.textContent = dStr;
        discountEl.classList.remove('hidden');
      } else {
        discountEl.classList.add('hidden');
      }
    }

    var installmentNote = document.getElementById('pdInstallment');
    if (installmentNote) {
      if (hasPrice) {
        var monthly = Math.round(p.basePrice / 12);
        installmentNote.innerHTML = '<svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
          + 'Trả góp 0% lãi suất – Chỉ từ <strong>' + formatVND(monthly) + '/tháng</strong> (Kỳ hạn 12 tháng)';
      } else {
        installmentNote.textContent = 'Giá sản phẩm đang được cập nhật.';
      }
    }
    ['addToCartBtn', 'buyNowBtn'].forEach(function (id) {
      var button = document.getElementById(id);
      if (!button) return;
      button.disabled = !hasPrice;
      button.classList.toggle('opacity-50', !hasPrice);
      button.classList.toggle('cursor-not-allowed', !hasPrice);
    });

    // 5.10 Khung Ưu Đãi Độc Quyền
    var perksContainer = document.getElementById('pdPerks');
    if (perksContainer && p.perks) {
      var perksHtml = '';
      p.perks.forEach(function (pk) {
        perksHtml += '<li class="flex items-start gap-2"><span class="text-brand font-bold">•</span><span>' + pk + '</span></li>';
      });
      perksContainer.innerHTML = perksHtml;
    }

    // 5.11 Bento Grid (4 Khối Highlights)
    var bentoContainer = document.getElementById('pdBento');
    if (bentoContainer && p.highlights) {
      var iconSvgs = {
        screen: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10v10H7z"/></svg>',
        cpu: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>',
        camera: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="4"/></svg>',
        battery: '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>'
      };
      var colorClasses = ['text-brand', 'text-purple-600', 'text-blue-600', 'text-emerald-600'];

      var bentoHtml = '';
      p.highlights.forEach(function (hl, idx) {
        var iconColor = colorClasses[idx % colorClasses.length];
        var iconHtml = iconSvgs[hl.icon] || iconSvgs.cpu;
        var bulletsHtml = (hl.bullets || []).map(function (b) { return '<li>• ' + b + '</li>'; }).join('');

        bentoHtml += '<div class="spec-bento-card">'
          + '<div class="flex items-center gap-2.5 mb-3 ' + iconColor + '">'
          +   iconHtml
          +   '<h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900">' + hl.title + '</h3>'
          + '</div>'
          + '<p class="text-lg font-black text-slate-950">' + hl.value + '</p>'
          + '<ul class="mt-2 text-xs text-slate-600 space-y-1 font-medium">' + bulletsHtml + '</ul>'
          + '</div>';
      });
      bentoContainer.innerHTML = bentoHtml;
    }

    // 5.12 Bảng thông số kỹ thuật chi tiết
    var specTable = document.getElementById('pdSpecTable');
    if (specTable && p.specs) {
      var tableHtml = '';
      p.specs.forEach(function (pair) {
        tableHtml += '<div class="spec-table-row">'
          + '<span class="font-bold text-slate-900 w-1/3">' + pair[0] + '</span>'
          + '<span class="text-slate-600 w-2/3">' + pair[1] + '</span>'
          + '</div>';
      });
      specTable.innerHTML = tableHtml;
    }

    var skuEl = document.getElementById('pdSku');
    if (skuEl) skuEl.textContent = 'Mã sản phẩm: ' + (p.sku || 'VN/A');
  }

  // Khởi tạo Render
  renderProduct(product);

  // 6. Xử lý Logic Tương Tác
  var currentColor = (product.colors && product.colors[0] && product.colors[0].name) || 'Mặc định';
  var currentVariant = (product.variants && product.variants[0] && product.variants[0].label) || 'Tiêu chuẩn';
  var currentPrice = product.basePrice;
  var currentImg = (product.colors && product.colors[0] && product.colors[0].img) || '';

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

  // 6.1 Đổi Màu Sắc & Thumbnail
  function changeColor(colorName, colorImg, colorKey) {
    currentColor = colorName;
    currentImg = colorImg;

    var selectedColorLabel = document.getElementById('selectedColorName');
    var imageColorLabel = document.getElementById('imageColorLabel');
    var mainImg = document.getElementById('mainProductImg');

    if (selectedColorLabel) selectedColorLabel.textContent = colorName;
    if (imageColorLabel) imageColorLabel.textContent = colorName;

    if (mainImg && colorImg) {
      mainImg.style.transition = 'opacity 0.22s ease-in-out, transform 0.22s ease-in-out';
      mainImg.style.opacity = '0.2';
      mainImg.style.transform = 'scale(0.96)';
      setTimeout(function () {
        mainImg.src = colorImg;
        mainImg.alt = product.name + ' - ' + colorName;
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
      }, 140);
    }

    // Đồng bộ nút màu
    document.querySelectorAll('.color-swatch-btn').forEach(function (b) {
      var active = (b.dataset.colorKey === colorKey) || (b.dataset.colorName === colorName);
      b.classList.toggle('active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });

    // Đồng bộ thumbnail
    document.querySelectorAll('.thumb-btn').forEach(function (t) {
      var active = (t.dataset.colorKey === colorKey) || (t.dataset.colorName === colorName);
      t.classList.toggle('active', active);
    });
  }

  document.addEventListener('click', function (e) {
    // Click Nút Màu
    var swatch = e.target.closest('.color-swatch-btn');
    if (swatch) {
      changeColor(swatch.dataset.colorName, swatch.dataset.img, swatch.dataset.colorKey);
      return;
    }

    // Click Thumbnail
    var thumb = e.target.closest('.thumb-btn');
    if (thumb) {
      changeColor(thumb.dataset.colorName, thumb.dataset.src, thumb.dataset.colorKey);
      return;
    }

    // Click Chọn Phiên Bản / Dung Lượng
    var storageBtn = e.target.closest('.storage-btn');
    if (storageBtn) {
      document.querySelectorAll('.storage-btn').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      storageBtn.classList.add('active');
      storageBtn.setAttribute('aria-checked', 'true');

      var label = storageBtn.dataset.label;
      var delta = parseInt(storageBtn.dataset.delta, 10) || 0;
      var discount = storageBtn.dataset.discount;

      currentVariant = label;
      currentPrice = product.basePrice + delta;

      var selectedVariantName = document.getElementById('selectedVariantName');
      if (selectedVariantName) selectedVariantName.textContent = label;

      var priceEl = document.getElementById('productPrice');
      var oldPriceEl = document.getElementById('oldPrice');
      var discountEl = document.getElementById('discountBadge');

      if (priceEl) {
        priceEl.style.opacity = '0.3';
        priceEl.style.transform = 'translateY(-4px)';
        setTimeout(function () {
          priceEl.textContent = formatVND(currentPrice);
          if (oldPriceEl && product.oldPrice) {
            oldPriceEl.textContent = formatVND(product.oldPrice + delta);
          }
          if (discountEl && discount) {
            discountEl.textContent = discount;
          }
          priceEl.style.opacity = '1';
          priceEl.style.transform = 'translateY(0)';
        }, 120);
      }
      return;
    }

    // Click Nút Thêm Vào Giỏ Hàng
    var addBtn = e.target.closest('#addToCartBtn');
    if (addBtn) {
      var cartItem = {
        id: product.id,
        name: product.name,
        category: product.category || rawCat,
        color: currentColor,
        variant: currentVariant,
        price: currentPrice,
        oldPrice: product.oldPrice ? (product.oldPrice + (currentPrice - product.basePrice)) : null,
        image: currentImg || (product.colors && product.colors[0] && product.colors[0].img) || '',
        quantity: 1
      };
      if (window.VLU_CART) {
        window.VLU_CART.addItem(cartItem);
        window.VLU_CART.updateBadge(true);
        window.VLU_CART.showToast('Đã thêm "' + product.name + ' (' + currentColor + ' - ' + currentVariant + ')" vào giỏ hàng!');
      } else {
        var cartBadge = document.getElementById('cartCount');
        if (cartBadge) {
          var count = parseInt(cartBadge.textContent, 10) || 0;
          cartBadge.textContent = count + 1;
        }
        showToast('Đã thêm "' + product.name + ' (' + currentColor + ' - ' + currentVariant + ')" vào giỏ hàng!');
      }
      return;
    }

    // Click Nút Mua Ngay -> Tự động kích hoạt Tài khoản Khách (nếu chưa đăng nhập), lưu vào giỏ hàng và chuyển hướng
    var buyBtn = e.target.closest('#buyNowBtn');
    if (buyBtn) {
      try {
        if (window.VLU_AUTH && typeof window.VLU_AUTH.ensureGuestSession === 'function') {
          window.VLU_AUTH.ensureGuestSession();
        }
        var buyItem = {
          id: product.id,
          name: product.name,
          category: product.category || rawCat,
          color: currentColor,
          variant: currentVariant,
          price: currentPrice,
          oldPrice: product.oldPrice ? (product.oldPrice + (currentPrice - product.basePrice)) : null,
          image: currentImg || (product.colors && product.colors[0] && product.colors[0].img) || '',
          quantity: 1
        };
        if (window.VLU_CART) {
          window.VLU_CART.addItem(buyItem);
        }
      } catch (err) {
        console.warn('Không thể lưu giỏ hàng vào localStorage:', err);
      }
    }
  });

})();
