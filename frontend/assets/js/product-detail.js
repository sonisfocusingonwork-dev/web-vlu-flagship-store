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
      if (item.slug === slug || item.slug.indexOf(slug) !== -1 || slug.indexOf(item.slug) !== -1) {
        if (item.images && item.images.length > 0) {
          return item.images;
        }
      }
    }
    return [];
  }

  // 3. Cơ chế Smart Fallback – Tự động nhận diện cấu hình từ tên sản phẩm
  function buildSmartFallback(name, id, catHint) {
    var n = (name || id || 'iPhone 18 Pro Max').replace(/-/g, ' ');
    var lower = n.toLowerCase();

    // Nhận diện Hãng
    var brand = 'Apple';
    if (lower.indexOf('samsung') !== -1 || lower.indexOf('galaxy') !== -1) brand = 'Samsung';
    else if (lower.indexOf('xiaomi') !== -1) brand = 'Xiaomi';
    else if (lower.indexOf('redmi') !== -1) brand = 'Redmi';
    else if (lower.indexOf('oppo') !== -1 || lower.indexOf('reno') !== -1 || lower.indexOf('find') !== -1) brand = 'OPPO';
    else if (lower.indexOf('asus') !== -1 || lower.indexOf('rog') !== -1) brand = 'ASUS';
    else if (lower.indexOf('lenovo') !== -1 || lower.indexOf('thinkpad') !== -1 || lower.indexOf('legion') !== -1) brand = 'Lenovo';
    else if (lower.indexOf('hp') !== -1 || lower.indexOf('pavilion') !== -1 || lower.indexOf('omen') !== -1) brand = 'HP';
    else if (lower.indexOf('dell') !== -1 || lower.indexOf('xps') !== -1) brand = 'Dell';
    else if (lower.indexOf('sony') !== -1) brand = 'Sony';
    else if (lower.indexOf('jbl') !== -1) brand = 'JBL';
    else if (lower.indexOf('bose') !== -1) brand = 'Bose';
    else if (lower.indexOf('marshall') !== -1) brand = 'Marshall';

    // Nhận diện Danh mục
    var category = catHint || 'dien-thoai';
    if (lower.indexOf('macbook') !== -1 || lower.indexOf('laptop') !== -1 || lower.indexOf('vivobook') !== -1 ||
        lower.indexOf('rog') !== -1 || lower.indexOf('thinkpad') !== -1 || lower.indexOf('legion') !== -1 ||
        lower.indexOf('pavilion') !== -1 || lower.indexOf('xps') !== -1 || lower.indexOf('zenbook') !== -1) {
      category = 'laptop';
    } else if (lower.indexOf('ipad') !== -1 || lower.indexOf('tab') !== -1 || lower.indexOf('pad') !== -1 || lower.indexOf('matepad') !== -1) {
      category = 'ipad';
    } else if (lower.indexOf('airpods') !== -1 || lower.indexOf('buds') !== -1 || lower.indexOf('wh-') !== -1 ||
               lower.indexOf('wf-') !== -1 || lower.indexOf('tai nghe') !== -1 || lower.indexOf('quietcomfort') !== -1) {
      category = 'tai-nghe';
    } else if (lower.indexOf('loa') !== -1 || lower.indexOf('speaker') !== -1 || lower.indexOf('flip') !== -1 ||
               lower.indexOf('charge') !== -1 || lower.indexOf('emberton') !== -1 || lower.indexOf('stanmore') !== -1 ||
               lower.indexOf('soundlink') !== -1 || lower.indexOf('onyx') !== -1) {
      category = 'loa';
    } else if (lower.indexOf('watch') !== -1 || lower.indexOf('đồng hồ') !== -1 || lower.indexOf('garmin') !== -1) {
      category = 'dong-ho-dien-tu';
    } else if (lower.indexOf('sạc') !== -1 || lower.indexOf('cáp') !== -1 || lower.indexOf('ốp') !== -1 ||
               lower.indexOf('pin dự phòng') !== -1 || lower.indexOf('pencil') !== -1) {
      category = 'phu-kien';
    }

    // Tính giá tiền cố định theo tên
    var hash = 0;
    for (var i = 0; i < n.length; i++) hash = ((hash << 5) - hash) + n.charCodeAt(i);
    hash = Math.abs(hash);

    var basePrice = 24990000;
    var variantLabel = 'Dung lượng lưu trữ';
    var variants = [
      { label: '256GB', delta: 0, discount: '-5%' },
      { label: '512GB', delta: 3500000, discount: '-5%' },
      { label: '1TB', delta: 8000000, discount: '-4%' }
    ];
    var placeholderSvg = 'frontend/assets/images/placeholders/phone.svg';
    var highlights = [];
    var specs = [];

    if (category === 'laptop') {
      basePrice = 18990000 + (hash % 20) * 1000000;
      variantLabel = 'Cấu hình RAM / SSD';
      variants = [
        { label: '16GB RAM / 512GB SSD', delta: 0, discount: '-6%' },
        { label: '32GB RAM / 1TB SSD', delta: 6000000, discount: '-5%' },
        { label: '64GB RAM / 2TB SSD', delta: 15000000, discount: '-4%' }
      ];
      placeholderSvg = 'frontend/assets/images/placeholders/laptop.svg';
      highlights = [
        { icon: 'screen', title: 'Màn hình', value: '15.6" Retina / OLED', bullets: ['Độ phân giải siêu nét', 'Tần số quét cao mượt mà', 'Chuẩn màu đồ họa 100% sRGB / DCI-P3'] },
        { icon: 'cpu', title: 'Vi xử lý', value: 'Thế Hệ Mới Nhất', bullets: ['Hiệu năng đa nhân mạnh mẽ', 'Tăng tốc đồ họa và xử lý AI', 'Tản nhiệt buồng hơi êm ái'] },
        { icon: 'battery', title: 'Thời lượng Pin', value: 'Pin Dài Cả Ngày', bullets: ['Sạc nhanh qua cổng USB-C', 'Tiết kiệm điện năng thông minh'] },
        { icon: 'camera', title: 'Thiết kế', value: 'Vỏ Nhôm Nguyên Khối', bullets: ['Thiết kế mỏng nhẹ sang trọng', 'Bàn phím êm ái có đèn nền'] }
      ];
      specs = [
        ['Dòng máy', n],
        ['Thương hiệu', brand],
        ['Bảo hành', 'Chính hãng 24 tháng toàn quốc']
      ];
    } else if (category === 'ipad') {
      basePrice = 12990000 + (hash % 15) * 1000000;
      variantLabel = 'Dung lượng & Kết nối';
      variants = [
        { label: '128GB (Wi-Fi)', delta: 0, discount: '-5%' },
        { label: '256GB (Wi-Fi)', delta: 2500000, discount: '-5%' },
        { label: '512GB (5G Cellular)', delta: 7000000, discount: '-4%' }
      ];
      placeholderSvg = 'frontend/assets/images/placeholders/tablet.svg';
      highlights = [
        { icon: 'screen', title: 'Màn hình', value: 'Màn Hình Retina / OLED', bullets: ['Màu sắc sống động', 'Tần số quét 120Hz mượt mà', 'Hỗ trợ bút cảm ứng vẽ chuyên nghiệp'] },
        { icon: 'cpu', title: 'Vi xử lý', value: 'Chip Đầu Bảng', bullets: ['Xử lý đồ họa đa nhiệm mượt', 'Hỗ trợ bàn phím ngoài như laptop'] }
      ];
      specs = [['Tên thiết bị', n], ['Hãng sản xuất', brand], ['Bảo hành', '12 - 24 tháng']];
    } else if (category === 'tai-nghe') {
      basePrice = 2490000 + (hash % 10) * 500000;
      variantLabel = 'Phiên bản tai nghe';
      variants = [
        { label: 'Bản Tiêu Chuẩn', delta: 0, discount: '-8%' },
        { label: 'Bản Cao Cấp (Chống Ồn ANC)', delta: 1200000, discount: '-6%' }
      ];
      placeholderSvg = 'frontend/assets/images/placeholders/headphones.svg';
      highlights = [
        { icon: 'cpu', title: 'Chất âm', value: 'Hi-Res Audio & ANC', bullets: ['Chống ồn chủ động thông minh', 'Âm trầm sâu, dải cao trong trẻo', 'Micro đàm thoại khử ồn gió'] },
        { icon: 'battery', title: 'Thời lượng Pin', value: 'Lên tới 30 Giờ', bullets: ['Sạc nhanh 10 phút dùng 2 giờ', 'Hỗ trợ sạc không dây'] }
      ];
      specs = [['Dòng tai nghe', n], ['Thương hiệu', brand], ['Bảo hành', '12 tháng chính hãng']];
    } else if (category === 'loa') {
      basePrice = 1990000 + (hash % 12) * 600000;
      variantLabel = 'Phiên bản loa';
      variants = [
        { label: 'Bản Di Động (Bluetooth)', delta: 0, discount: '-7%' },
        { label: 'Bản Có Dây & Trợ Lý Ảo', delta: 1500000, discount: '-5%' }
      ];
      placeholderSvg = 'frontend/assets/images/placeholders/speaker.svg';
      highlights = [
        { icon: 'cpu', title: 'Âm thanh', value: 'Công Suất Lớn Chống Nước', bullets: ['Chuẩn kháng nước IP67 bền bỉ', 'Âm thanh 360 độ lan tỏa', 'Kết nối nhiều loa cùng lúc'] },
        { icon: 'battery', title: 'Pin Di Động', value: 'Chơi Nhạc 20 Giờ', bullets: ['Pin bền bỉ cho tiệc tùng', 'Cổng sạc Type-C tiện lợi'] }
      ];
      specs = [['Dòng loa', n], ['Hãng sản xuất', brand], ['Bảo hành', '12 tháng']];
    } else if (category === 'dong-ho-dien-tu') {
      basePrice = 4990000 + (hash % 14) * 800000;
      variantLabel = 'Kích thước & Kết nối';
      variants = [
        { label: '41mm (Bản GPS)', delta: 0, discount: '-6%' },
        { label: '45mm (Bản GPS + LTE)', delta: 2500000, discount: '-5%' }
      ];
      placeholderSvg = 'frontend/assets/images/placeholders/watch.svg';
      highlights = [
        { icon: 'screen', title: 'Màn hình', value: 'Always-On AMOLED', bullets: ['Độ sáng cao rõ ngoài trời', 'Mặt kính chống trầy xước', 'Nhiều mặt đồng hồ tùy biến'] },
        { icon: 'battery', title: 'Theo dõi Sức khỏe', value: 'Cảm Biến Nhịp Tim & SpO2', bullets: ['Đo điện tâm đồ ECG', 'Theo dõi giấc ngủ chuyên sâu', 'Hơn 100 chế độ thể thao'] }
      ];
      specs = [['Tên đồng hồ', n], ['Hãng sản xuất', brand], ['Bảo hành', '12 tháng']];
    } else if (category === 'phu-kien') {
      basePrice = 490000 + (hash % 8) * 150000;
      variantLabel = 'Tùy chọn quy cách';
      variants = [
        { label: 'Tiêu Chuẩn (Chính Hãng)', delta: 0, discount: '-10%' },
        { label: 'Bản Combo Cao Cấp', delta: 300000, discount: '-15%' }
      ];
      placeholderSvg = 'frontend/assets/images/placeholders/accessories.svg';
      highlights = [
        { icon: 'cpu', title: 'Chất lượng', value: 'Chuẩn Flagship', bullets: ['Độ bền vượt trội', 'Tương thích 100% với thiết bị', 'Chứng nhận an toàn chống cháy nổ'] }
      ];
      specs = [['Tên phụ kiện', n], ['Thương hiệu', brand], ['Bảo hành', '12 tháng 1 đổi 1']];
    } else {
      // Điện thoại
      basePrice = 18990000 + (hash % 16) * 1000000;
      highlights = [
        { icon: 'screen', title: 'Màn hình', value: 'Màn Hình Tràn Viền 120Hz', bullets: ['Tấm nền OLED rực rỡ sắc nét', 'Độ sáng cực đại ngoài trời', 'Kính cường lực bảo vệ tối đa'] },
        { icon: 'cpu', title: 'Vi xử lý', value: 'Chipset Flagship 2026', bullets: ['Hiệu năng xử lý cực nhanh', 'Tích hợp AI trí tuệ nhân tạo', 'Tối ưu pin vượt trội'] },
        { icon: 'camera', title: 'Camera', value: 'Hệ Thống Camera Đỉnh Cao', bullets: ['Chụp đêm rõ nét từng chi tiết', 'Quay video 4K sắc nét', 'Nhiều chế độ chân dung xóa phông'] },
        { icon: 'battery', title: 'Pin & Sạc', value: 'Sạc Nhanh Cực Tốc', bullets: ['Dùng thoải mái cả ngày dài', 'Sạc 50% trong 25 phút'] }
      ];
      specs = [
        ['Tên sản phẩm', n],
        ['Thương hiệu', brand],
        ['Hệ điều hành', brand === 'Apple' ? 'iOS' : 'Android'],
        ['Bảo hành', 'Chính hãng 24 tháng toàn quốc']
      ];
    }

    // Tra cứu ảnh thật trong SanPham/SanPham
    var foundImages = findImagesInManifest(n);
    var colors = [];
    if (foundImages.length > 0) {
      colors = foundImages.map(function (img, idx) {
        return {
          name: img.color || ('Màu ' + (idx + 1)),
          key: toSlug(img.color || 'color-' + idx),
          hex: (window.VLU_GET_COLOR_HEX ? window.VLU_GET_COLOR_HEX(img.color) : '#334155'),
          img: img.url
        };
      });
    } else {
      colors = [
        { name: 'Titan Tự Nhiên', key: 'natural', hex: '#98928B', img: placeholderSvg },
        { name: 'Titan Đen', key: 'black', hex: '#252527', img: placeholderSvg },
        { name: 'Titan Trắng', key: 'white', hex: '#F0F0F2', img: placeholderSvg }
      ];
    }

    return {
      id: toSlug(n),
      name: n,
      brand: brand,
      category: category,
      badge: brand + ' · Flagship',
      badgeSub: 'Chính Hãng VN/A',
      tagline: 'Thiết bị công nghệ chính hãng ' + brand + ' với chế độ bảo hành minh bạch tại VLU FLAGSHIP STORE.',
      basePrice: basePrice,
      oldPrice: Math.round(basePrice * 1.08),
      colors: colors,
      extraImages: [],
      variantLabel: variantLabel,
      variants: variants,
      perks: [
        'Thu cũ đổi mới trợ giá lên tới 4.000.000₫',
        'Tặng combo quà tặng chính hãng kèm máy',
        'Bảo hành chính hãng 12 - 24 tháng minh bạch',
        'Giao hỏa tốc nội thành trong vòng 2 giờ'
      ],
      highlights: highlights,
      specs: specs,
      sku: 'FLAGSHIP-' + (hash % 9000 + 1000)
    };
  }

  // 4. Tìm kiếm hoặc tự động sinh sản phẩm
  var product = null;
  if (rawId && window.VLU_FIND_PRODUCT) {
    product = window.VLU_FIND_PRODUCT(rawId);
  }
  if (!product && rawName && window.VLU_FIND_PRODUCT) {
    product = window.VLU_FIND_PRODUCT(rawName);
  }
  if (!product) {
    product = buildSmartFallback(rawName, rawId, rawCat);
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
    var defaultImgUrl = (p.colors && p.colors[0] && p.colors[0].img) || 'frontend/assets/images/placeholders/phone.svg';
    var defaultColorName = (p.colors && p.colors[0] && p.colors[0].name) || 'Mặc định';

    if (mainImg) {
      mainImg.src = defaultImgUrl;
      mainImg.alt = p.name + ' - ' + defaultColorName;
    }
    if (imageColorLabel) imageColorLabel.textContent = defaultColorName;

    // 5.6 Thumbnails
    var thumbStrip = document.getElementById('thumbnailStrip');
    if (thumbStrip) {
      var thumbsHtml = '';
      (p.colors || []).forEach(function (c, idx) {
        thumbsHtml += '<button type="button" class="thumb-btn' + (idx === 0 ? ' active' : '') + '"'
          + ' data-src="' + c.img + '"'
          + ' data-color-name="' + c.name + '"'
          + ' data-color-key="' + c.key + '"'
          + ' aria-label="Xem ảnh ' + c.name + '">'
          + '<img src="' + c.img + '" alt="' + c.name + '">'
          + '</button>';
      });
      (p.extraImages || []).forEach(function (extra) {
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
          + ' data-img="' + c.img + '"'
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
        var vPrice = p.basePrice + (v.delta || 0);
        variantsHtml += '<button type="button" class="storage-btn' + (idx === 0 ? ' active' : '') + '"'
          + ' data-label="' + v.label + '"'
          + ' data-delta="' + (v.delta || 0) + '"'
          + ' data-discount="' + (v.discount || '') + '"'
          + ' role="radio" aria-checked="' + (idx === 0 ? 'true' : 'false') + '">'
          + '<span class="text-sm font-black text-slate-900">' + v.label + '</span>'
          + '<span class="text-[11px] font-semibold text-slate-500 mt-0.5">' + formatVND(vPrice) + '</span>'
          + '</button>';
      });
      variantGrid.innerHTML = variantsHtml;
    }

    // 5.9 Giá tiền & Trả góp
    var priceEl = document.getElementById('productPrice');
    var oldPriceEl = document.getElementById('oldPrice');
    var discountEl = document.getElementById('discountBadge');
    if (priceEl) priceEl.textContent = formatVND(p.basePrice);
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
      var monthly = Math.round(p.basePrice / 12);
      installmentNote.innerHTML = '<svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
        + 'Trả góp 0% lãi suất – Chỉ từ <strong>' + formatVND(monthly) + '/tháng</strong> (Kỳ hạn 12 tháng)';
    }

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
      mainImg.style.opacity = '0.3';
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

    // Click Nút Mua Ngay -> Lưu vào giỏ hàng và chuyển hướng thẳng sang cart.html
    var buyBtn = e.target.closest('#buyNowBtn');
    if (buyBtn) {
      try {
        var buyItem = {
          id: product.id,
          name: product.name,
          color: currentColor,
          variant: currentVariant,
          price: currentPrice,
          oldPrice: product.oldPrice ? (product.oldPrice + (currentPrice - product.basePrice)) : null,
          image: currentImg || (product.colors && product.colors[0] && product.colors[0].img) || '',
          quantity: 1
        };
        if (window.VLU_CART) {
          window.VLU_CART.addItem(buyItem);
        } else {
          localStorage.setItem('vlu_cart_item', JSON.stringify(buyItem));
        }
      } catch (err) {
        console.warn('Không thể lưu giỏ hàng vào localStorage:', err);
      }
    }
  });

})();
