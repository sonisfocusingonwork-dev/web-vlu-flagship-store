/**
 * VLU FLAGSHIP STORE – Central Product Data Catalog
 * Cung cấp dữ liệu chuẩn cho toàn bộ sản phẩm trên website.
 * Phục vụ Dynamic Rendering cho product-detail.html kết hợp Smart Fallback.
 */
(function (global) {
  'use strict';

  // 1. Bản đồ màu sắc chuẩn giao diện 2026
  var COLOR_HEX = {
    'đỏ burgundy': '#5B1C24',
    'burgundy': '#5B1C24',
    'titan tự nhiên': '#98928B',
    'băng thanh': '#98928B',
    'titan đen': '#252527',
    'đen': '#252527',
    'black': '#252527',
    'graphite': '#3E424B',
    'titan trắng': '#F0F0F2',
    'trắng': '#F0F0F2',
    'white': '#F0F0F2',
    'bạc': '#D8D9DD',
    'silver shadow': '#D8D9DD',
    'titan sa mạc': '#C4A78A',
    'vàng sa mạc': '#C4A78A',
    'desert': '#C4A78A',
    'xanh da trời': '#A8C5DA',
    'sky blue': '#A8C5DA',
    'xanh lam khói': '#7B8FA1',
    'xanh lá xô thơm': '#94A394',
    'xanh lá': '#4E7055',
    'xanh dương': '#2B4C7E',
    'tím oải hương': '#A799B7',
    'tím': '#6E5D7A',
    'cobalt violet': '#4E4362',
    'cream': '#F4EAD4',
    'mint': '#B9D8C2',
    'pistachio': '#C1D3B8',
    'lavender': '#D0C8E0',
    'pink': '#E7B7C8',
    'pink gold': '#DEB3AD',
    'cam': '#DE6A38',
    'vàng nhạt': '#F7E7B4',
    'trắng mây': '#EAEAEA',
    'đen không gian': '#1D1D1F',
    'space gray': '#5F6062',
    'xám': '#78797D',
    'midnight': '#19232D',
    'starlight': '#F0EAD6'
  };

  function getColorHex(name) {
    if (!name) return '#334155';
    var clean = name.toLowerCase().trim();
    if (COLOR_HEX[clean]) return COLOR_HEX[clean];
    for (var k in COLOR_HEX) {
      if (clean.indexOf(k) !== -1 || k.indexOf(clean) !== -1) {
        return COLOR_HEX[k];
      }
    }
    return '#475569';
  }

  // 2. Danh mục sản phẩm chi tiết mẫu
  var CATALOG = {
    // ----------------------------------------------------
    // APPLE IPHONE 18 PRO MAX
    // ----------------------------------------------------
    'iphone-18-pro-max': {
      id: 'iphone-18-pro-max',
      legacyId: 101,
      name: 'iPhone 18 Pro Max',
      brand: 'Apple',
      category: 'dien-thoai',
      badge: 'Titanium Cấp 5',
      badgeSub: 'Chip A20 Pro 2nm',
      tagline: 'Đỉnh cao công nghệ Titanium cùng chip Apple A20 Pro siêu mạnh mẽ.',
      basePrice: 34990000,
      oldPrice: 36990000,
      colors: [
        { name: 'Đỏ Burgundy', key: 'burgundy', hex: '#5B1C24', img: 'SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90%E1%BB%8F%20Burgundy.png' },
        { name: 'Titan Tự Nhiên', key: 'natural', hex: '#98928B', img: 'SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%C4%83ng%20thanh.png' },
        { name: 'Titan Đen', key: 'black', hex: '#252527', img: 'SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90en.png' },
        { name: 'Titan Trắng', key: 'white', hex: '#F0F0F2', img: 'SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%E1%BA%A1c.png' }
      ],
      extraImages: [
        { src: 'Banner/iphone-18-pro_overview__bl9no3txkonm_og.png', label: 'Studio Hero PRO', key: 'hero' }
      ],
      variantLabel: 'Dung lượng lưu trữ',
      variants: [
        { label: '256GB', delta: 0, discount: '-5%' },
        { label: '512GB', delta: 4000000, discount: '-5%' },
        { label: '1TB', delta: 10000000, discount: '-4%' }
      ],
      perks: [
        'Thu cũ đổi mới trợ giá tới 5.000.000₫ khi lên đời iPhone 18 Pro Max',
        'Tặng củ sạc GaN 35W Dual USB-C & kính cường lực chính hãng',
        'Giảm 50% khi mua kèm ốp lưng MagSafe hoặc AirPods Pro 2',
        'Bảo hành VIP 24 tháng chính hãng, 1 đổi 1 trong 30 ngày'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: '6.9" Super Retina XDR', bullets: ['Tấm nền OLED ProMotion 120Hz', 'Dynamic Island 2.0 cảm ứng', 'Always-On Display & Độ sáng 3000 nits', 'Ceramic Shield thế hệ mới'] },
        { icon: 'cpu', title: 'Vi xử lý (CPU)', value: 'Apple A20 Pro (2nm)', bullets: ['Tiến trình 2nm tiên tiến nhất thế giới', '6 lõi CPU (2 hiệu năng cao + 4 tiết kiệm điện)', 'GPU 6 lõi Ray Tracing tăng tốc phần cứng', 'Neural Engine 16 lõi xử lý AI tốc độ cao'] },
        { icon: 'camera', title: 'Camera Pro', value: '48MP Tứ Lăng Kính', bullets: ['Camera chính 48MP Fusion f/1.78 OIS', 'Góc siêu rộng 48MP chụp Macro sắc nét', 'Tiềm vọng Tetraprism zoom 5x quang học', 'Nút cảm ứng Camera Control tiện lợi'] },
        { icon: 'battery', title: 'Pin & Sạc', value: '33 Giờ Xem Video', bullets: ['Sạc nhanh 50% trong vòng 25 phút', 'Hỗ trợ sạc không dây MagSafe 25W', 'Chuẩn sạc Qi2 tương thích rộng rãi', 'Quản lý pin thông minh AI tối ưu'] }
      ],
      specs: [
        ['Công nghệ màn hình', 'Super Retina XDR OLED, ProMotion 120Hz, HDR10, Dolby Vision, 3000 nits'],
        ['Kích thước màn hình', '6.9 inch (Độ phân giải 2868 x 1320 pixels, mật độ 460 ppi)'],
        ['Chipset (Vi xử lý)', 'Apple A20 Pro 2nm (6-core CPU, 6-core GPU, 16-core Neural Engine)'],
        ['Dung lượng bộ nhớ', '256GB / 512GB / 1TB (NVMe tốc độ cao)'],
        ['Hệ thống Camera sau', '48MP Chính (OIS Sensor-shift) + 48MP Ultra-Wide + 48MP Telephoto 5x'],
        ['Camera trước', '12MP TrueDepth, tự động lấy nét PDAF, quay 4K Dolby Vision'],
        ['Quay video chuyên nghiệp', '4K 120fps Dolby Vision, ProRes 4K 120fps ổ cứng ngoài'],
        ['Chất liệu khung & Mặt kính', 'Khung Titanium Hàng Không Cấp 5, Kính Ceramic Shield 2.0'],
        ['Chuẩn kháng nước & bụi', 'IP68 (Độ sâu tối đa 6 mét trong 30 phút theo IEC 60529)'],
        ['Cổng kết nối', 'USB Type-C chuẩn USB 3 (10Gb/s), DisplayPort'],
        ['Hệ điều hành', 'iOS 19 tích hợp hệ thống trí tuệ nhân tạo Apple Intelligence'],
        ['Quy cách đóng hộp', 'Thân máy iPhone 18 Pro Max, Cáp sạc USB-C dù 1m, Tài liệu, Que lấy SIM']
      ],
      sku: 'A3294 (VN/A)'
    },

    // ----------------------------------------------------
    // APPLE IPHONE AIR
    // ----------------------------------------------------
    'iphone-air': {
      id: 'iphone-air',
      legacyId: 102,
      name: 'iPhone Air',
      brand: 'Apple',
      category: 'dien-thoai',
      badge: 'Siêu Mỏng Nhẹ',
      badgeSub: 'Chip Apple A19 Pro',
      tagline: 'Kiệt tác thiết kế siêu mỏng nhẹ đột phá, hiệu năng vượt trội.',
      basePrice: 26990000,
      oldPrice: 28990000,
      colors: [
        { name: 'Xanh Da Trời', key: 'blue', hex: '#A8C5DA', img: 'SanPham/SanPham/Iphone/Ip%20Air/Xanh%20da%20tr%E1%BB%9Di.png' },
        { name: 'Trắng Mây', key: 'white', hex: '#EAEAEA', img: 'SanPham/SanPham/Iphone/Ip%20Air/Tr%E1%BA%AFng%20M%C3%A2y.png' },
        { name: 'Vàng Nhạt', key: 'yellow', hex: '#F7E7B4', img: 'SanPham/SanPham/Iphone/Ip%20Air/V%C3%A0ng%20Nh%E1%BA%A1t.png' },
        { name: 'Đen Không Gian', key: 'black', hex: '#1D1D1F', img: 'SanPham/SanPham/Iphone/Ip%20Air/%C4%90en%20Kh%C3%B4ng%20Gian.png' }
      ],
      extraImages: [],
      variantLabel: 'Dung lượng lưu trữ',
      variants: [
        { label: '128GB', delta: 0, discount: '-7%' },
        { label: '256GB', delta: 3000000, discount: '-6%' },
        { label: '512GB', delta: 7000000, discount: '-5%' }
      ],
      perks: [
        'Thu cũ đổi mới trợ giá tới 4.000.000₫',
        'Tặng củ sạc nhanh 30W Type-C nhỏ gọn',
        'Bảo hành 24 tháng chính hãng tại VLU Store',
        'Giao nhanh nội thành trong 2 giờ'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: '6.6" Super Retina', bullets: ['Tấm nền OLED tràn viền siêu mỏng', 'Dynamic Island tương tác thông minh', 'Độ sáng cực đại 2500 nits', 'Ceramic Shield thế hệ mới'] },
        { icon: 'cpu', title: 'Vi xử lý', value: 'Apple A19 Pro', bullets: ['Tiến trình 3nm tối ưu điện năng', '6 lõi CPU cực nhanh', 'Đồ họa 5 lõi mượt mà', 'Neural Engine AI thế hệ mới'] },
        { icon: 'camera', title: 'Camera', value: '48MP Fusion Siêu Mỏng', bullets: ['Camera chính 48MP bắt nét siêu tốc', 'Chụp đêm Night Mode nâng cấp', 'Quay phim 4K Cinematic Mode'] },
        { icon: 'battery', title: 'Pin & Thiết kế', value: 'Độ mỏng chỉ 5.5mm', bullets: ['Thân máy nguyên khối titan-nhôm', 'Trọng lượng siêu nhẹ chỉ 160g', 'Sạc nhanh Type-C và MagSafe'] }
      ],
      specs: [
        ['Công nghệ màn hình', 'Super Retina XDR OLED, 120Hz ProMotion, 2500 nits'],
        ['Kích thước màn hình', '6.6 inch'],
        ['Chipset (Vi xử lý)', 'Apple A19 Pro 3nm'],
        ['Dung lượng bộ nhớ', '128GB / 256GB / 512GB'],
        ['Camera sau', '48MP Fusion f/1.6 OIS Sensor-shift'],
        ['Trọng lượng', '160g – Độ mỏng chỉ 5.5mm'],
        ['Chuẩn kháng nước', 'IP68'],
        ['Cổng kết nối', 'USB-C']
      ],
      sku: 'AIR-2026'
    },

    // ----------------------------------------------------
    // APPLE IPHONE 17
    // ----------------------------------------------------
    'iphone-17': {
      id: 'iphone-17',
      legacyId: 103,
      name: 'iPhone 17',
      brand: 'Apple',
      category: 'dien-thoai',
      badge: 'Màu Sắc Trẻ Trung',
      badgeSub: 'Chip Apple A19',
      tagline: 'Màu sắc trẻ trung năng động, camera kép 48MP nâng cấp toàn diện.',
      basePrice: 22990000,
      oldPrice: null,
      colors: [
        { name: 'Tím Oải Hương', key: 'purple', hex: '#A799B7', img: 'SanPham/SanPham/Iphone/Ip%2017/T%C3%ADm%20O%E1%BA%A3i%20H%C6%B0%C6%A1ng.png' },
        { name: 'Xanh Lam Khói', key: 'blue', hex: '#7B8FA1', img: 'SanPham/SanPham/Iphone/Ip%2017/Xanh%20Lam%20Kh%C3%B3i.png' },
        { name: 'Xanh Lá Xô Thơm', key: 'green', hex: '#94A394', img: 'SanPham/SanPham/Iphone/Ip%2017/Xanh%20L%C3%A1%20X%C3%B4%20Th%C6%A1m.png' },
        { name: 'Trắng', key: 'white', hex: '#F0F0F2', img: 'SanPham/SanPham/Iphone/Ip%2017/Tr%E1%BA%AFng.png' },
        { name: 'Đen', key: 'black', hex: '#252527', img: 'SanPham/SanPham/Iphone/Ip%2017/%C4%90en.png' }
      ],
      extraImages: [],
      variantLabel: 'Dung lượng lưu trữ',
      variants: [
        { label: '128GB', delta: 0, discount: '' },
        { label: '256GB', delta: 2500000, discount: '' },
        { label: '512GB', delta: 6000000, discount: '' }
      ],
      perks: [
        'Giảm thêm 500.000₫ cho học sinh, sinh viên',
        'Tặng combo ốp lưng & cường lực cao cấp',
        'Trả góp 0% lãi suất xét duyệt 5 phút'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: '6.3" ProMotion 120Hz', bullets: ['Tấm nền OLED màu sắc chuẩn điện ảnh', 'Dynamic Island thế hệ mới', 'Độ sáng ngoài trời 2000 nits'] },
        { icon: 'cpu', title: 'Vi xử lý', value: 'Apple A19 Bionic', bullets: ['Xử lý nhanh chóng mọi tác vụ', 'Tích hợp Apple Intelligence tiếng Việt'] },
        { icon: 'camera', title: 'Camera', value: '48MP Kép Nâng Cấp', bullets: ['Camera chính 48MP siêu nét', 'Camera góc rộng chụp phong cảnh'] },
        { icon: 'battery', title: 'Pin & Sạc', value: 'Pin xem video 26 giờ', bullets: ['Sạc nhanh 50% trong 30 phút', 'Cổng sạc USB-C tiện lợi'] }
      ],
      specs: [
        ['Màn hình', '6.3" Super Retina XDR OLED, 120Hz'],
        ['Chip', 'Apple A19 Bionic'],
        ['Camera', '48MP Fusion + 12MP Ultra-Wide'],
        ['Hệ điều hành', 'iOS 19']
      ],
      sku: 'IP17-VN'
    },

    // ----------------------------------------------------
    // SAMSUNG GALAXY S26 ULTRA
    // ----------------------------------------------------
    'galaxy-s26-ultra': {
      id: 'galaxy-s26-ultra',
      legacyId: 201,
      name: 'Galaxy S26 Ultra',
      brand: 'Samsung',
      category: 'dien-thoai',
      badge: 'Galaxy AI Thế Hệ Mới',
      badgeSub: 'Snapdragon 8 Elite Gen 2',
      tagline: 'Galaxy AI tiên phong, camera 200MP zoom 100x và bút S Pen tích hợp.',
      basePrice: 31990000,
      oldPrice: 34990000,
      colors: [
        { name: 'Cobalt Violet', key: 'violet', hex: '#4E4362', img: 'SanPham/SanPham/Samsung/SS%20S26%20Ultra/Cobalt%20Violet.webp' },
        { name: 'Silver Shadow', key: 'silver', hex: '#D8D9DD', img: 'SanPham/SanPham/Samsung/SS%20S26%20Ultra/Silver%20Shadow.webp' },
        { name: 'Pink Gold', key: 'pink', hex: '#DEB3AD', img: 'SanPham/SanPham/Samsung/SS%20S26%20Ultra/Pink%20Gold.webp' },
        { name: 'Xanh Da Trời', key: 'blue', hex: '#A8C5DA', img: 'SanPham/SanPham/Samsung/SS%20S26%20Ultra/Xanh%20da%20tr%E1%BB%9Di.webp' },
        { name: 'Đen Phantom', key: 'black', hex: '#252527', img: 'SanPham/SanPham/Samsung/SS%20S26%20Ultra/%C4%90en.webp' }
      ],
      extraImages: [
        { src: 'Banner/1793210573792_6690802098732450037_6690802098732450037_e1d1abf703bca13b2c04877bec2a6237.jpg', label: 'Hero S26 Ultra', key: 'hero' }
      ],
      variantLabel: 'Dung lượng lưu trữ',
      variants: [
        { label: '256GB / 12GB RAM', delta: 0, discount: '-9%' },
        { label: '512GB / 16GB RAM', delta: 4000000, discount: '-8%' },
        { label: '1TB / 16GB RAM', delta: 9000000, discount: '-7%' }
      ],
      perks: [
        'Tặng gói bảo hành Samsung Care+ 2 năm trị giá 4.500.000₫',
        'Thu cũ đổi mới trợ giá 4.000.000₫',
        'Tặng củ sạc siêu nhanh Samsung 45W chính hãng',
        'Đặc quyền phòng chờ thương gia sân bay toàn cầu'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: '6.9" Dynamic AMOLED 2X', bullets: ['Độ phân giải Quad HD+ 1-120Hz', 'Kính cường lực Gorilla Armor chống lóa đỉnh cao', 'Độ sáng kỷ lục 3200 nits'] },
        { icon: 'cpu', title: 'Hiệu năng', value: 'Snapdragon 8 Elite (3nm)', bullets: ['Tối ưu riêng cho Galaxy (for Galaxy)', 'Hệ thống tản nhiệt buồng hơi buồng lớn', 'NPU AI xử lý đa ngôn ngữ trực tiếp trên máy'] },
        { icon: 'camera', title: 'Camera Zoom', value: '200MP AI Quad Zoom', bullets: ['Cảm biến 200MP chi tiết vượt trội', 'Zoom tiềm vọng 50x quang học kết hợp AI', 'Quay video 8K HDR sắc nét'] },
        { icon: 'battery', title: 'Pin & S Pen', value: '5500mAh & Bút S Pen', bullets: ['Thời lượng sử dụng bền bỉ 2 ngày', 'Sạc siêu nhanh 45W 65% trong 30 phút', 'Bút S Pen viết vẽ và chụp ảnh từ xa'] }
      ],
      specs: [
        ['Màn hình', '6.9 inch Dynamic AMOLED 2X, 120Hz, 3200 nits'],
        ['Chip xử lý', 'Qualcomm Snapdragon 8 Elite for Galaxy'],
        ['Camera', '200MP + 50MP + 50MP + 12MP'],
        ['Bút S Pen', 'Tích hợp sẵn trong thân máy'],
        ['Pin & Sạc', '5500 mAh, sạc nhanh 45W']
      ],
      sku: 'SM-S948B'
    },

    // ----------------------------------------------------
    // SAMSUNG GALAXY Z FOLD8
    // ----------------------------------------------------
    'galaxy-z-fold8': {
      id: 'galaxy-z-fold8',
      legacyId: 202,
      name: 'Galaxy Z Fold8',
      brand: 'Samsung',
      category: 'dien-thoai',
      badge: 'Màn Gập Siêu Mỏng',
      badgeSub: 'Snapdragon 8 Elite',
      tagline: 'Màn hình gập lớn như tablet, bản lề siêu mỏng không nếp gấp.',
      basePrice: 44990000,
      oldPrice: null,
      colors: [
        { name: 'Graphite', key: 'graphite', hex: '#3E424B', img: 'SanPham/SanPham/Samsung/SS%20Galaxy%20Z%20Fold8/Graphite.webp' },
        { name: 'Cream', key: 'cream', hex: '#F4EAD4', img: 'SanPham/SanPham/Samsung/SS%20Galaxy%20Z%20Fold8/Cream.webp' },
        { name: 'Lavender', key: 'lavender', hex: '#D0C8E0', img: 'SanPham/SanPham/Samsung/SS%20Galaxy%20Z%20Fold8/Lavender.webp' },
        { name: 'Pistachio', key: 'pistachio', hex: '#C1D3B8', img: 'SanPham/SanPham/Samsung/SS%20Galaxy%20Z%20Fold8/Pistachio.webp' }
      ],
      extraImages: [],
      variantLabel: 'Dung lượng lưu trữ',
      variants: [
        { label: '256GB / 12GB RAM', delta: 0, discount: '' },
        { label: '512GB / 16GB RAM', delta: 4500000, discount: '' },
        { label: '1TB / 16GB RAM', delta: 10000000, discount: '' }
      ],
      perks: [
        'Tặng gói bảo hành VIP Z Elite Care 2 năm thay màn hình miễn phí',
        'Tặng ốp lưng kèm bút S Pen Fold Edition',
        'Trợ giá lên đời 5.000.000₫'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: '7.8" + 6.4" 120Hz', bullets: ['Màn chính mở rộng thành máy tính bảng mini', 'Màn ngoài tỷ lệ chuẩn cầm nắm tự nhiên', 'Bản lề giọt nước không khe hở'] },
        { icon: 'cpu', title: 'Hiệu năng', value: 'Snapdragon 8 Elite', bullets: ['Đa nhiệm chia 3 ứng dụng mượt mà', 'Thanh tác vụ Taskbar như máy tính'] },
        { icon: 'camera', title: 'Camera', value: '108MP Pro Visual', bullets: ['Camera chụp đêm ấn tượng', 'Zoom quang học 5x'] },
        { icon: 'battery', title: 'Pin & Sạc', value: '4800mAh Kép', bullets: ['Phân bổ đều 2 nửa màn hình', 'Sạc nhanh và sạc không dây'] }
      ],
      specs: [
        ['Màn hình chính', '7.8 inch Dynamic AMOLED 2X, 120Hz'],
        ['Màn hình phụ', '6.4 inch Dynamic AMOLED 2X, 120Hz'],
        ['Chip', 'Snapdragon 8 Elite for Galaxy'],
        ['Kháng nước', 'IP48 cao cấp cho máy gập']
      ],
      sku: 'SM-F966B'
    },

    // ----------------------------------------------------
    // MACBOOK PRO
    // ----------------------------------------------------
    'macbook-pro': {
      id: 'macbook-pro',
      legacyId: null,
      name: 'MacBook Pro 16" (Chip M4 Pro / M4 Max)',
      brand: 'Apple',
      category: 'laptop',
      badge: 'Apple Silicon M4 Pro',
      badgeSub: 'Liquid Retina XDR',
      tagline: 'Hiệu năng chuyên nghiệp đỉnh cao, pin kỷ lục 24 giờ liên tục.',
      basePrice: 59990000,
      oldPrice: 62990000,
      colors: [
        { name: 'Đen Không Gian (Space Black)', key: 'black', hex: '#1D1D1F', img: 'frontend/assets/images/placeholders/laptop.svg' },
        { name: 'Bạc (Silver)', key: 'silver', hex: '#D8D9DD', img: 'frontend/assets/images/placeholders/laptop.svg' }
      ],
      extraImages: [],
      variantLabel: 'Cấu hình Chip & Bộ nhớ',
      variants: [
        { label: 'M4 Pro / 24GB RAM / 512GB SSD', delta: 0, discount: '-5%' },
        { label: 'M4 Pro / 48GB RAM / 1TB SSD', delta: 12000000, discount: '-5%' },
        { label: 'M4 Max / 64GB RAM / 2TB SSD', delta: 30000000, discount: '-4%' }
      ],
      perks: [
        'Tặng balo chống sốc cao cấp & chuột Magic Mouse',
        'Giảm 20% khi mua kèm gói AppleCare+ chính hãng',
        'Trả góp 0% lãi suất với thẻ tín dụng'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: '16.2" Liquid Retina XDR', bullets: ['Độ sáng 1600 nits đỉnh HDR', 'Công nghệ ProMotion 120Hz mượt mà', 'Tùy chọn màn hình mặt kính Nano-texture'] },
        { icon: 'cpu', title: 'Vi xử lý', value: 'Apple M4 Pro / M4 Max', bullets: ['Lên tới 16 lõi CPU và 40 lõi GPU', 'Băng thông bộ nhớ 410 GB/s', 'Tăng tốc phần cứng cho xử lý AI và Ray Tracing'] },
        { icon: 'battery', title: 'Thời lượng Pin', value: '24 Giờ Dùng Liên Tục', bullets: ['Thời lượng pin dài nhất từng có trên Mac', 'Giữ nguyên 100% hiệu năng khi cắm sạc hoặc dùng pin'] },
        { icon: 'camera', title: 'Kết nối Pro', value: 'Thunderbolt 5 (120Gb/s)', bullets: ['3 cổng Thunderbolt 5 tốc độ cực cao', 'Cổng HDMI 8K, khe thẻ SDXC và sạc MagSafe 3'] }
      ],
      specs: [
        ['Màn hình', '16.2 inch Liquid Retina XDR (3456 x 2234 pixels), 120Hz'],
        ['Vi xử lý', 'Apple M4 Pro 14-core CPU / 20-core GPU (hoặc M4 Max)'],
        ['Bộ nhớ RAM', '24GB Unified Memory (nâng cấp tối đa 128GB)'],
        ['Ổ cứng SSD', '512GB / 1TB / 2TB tốc độ đọc 7.4GB/s'],
        ['Cổng kết nối', '3x Thunderbolt 5, HDMI, SDXC, MagSafe 3, Jack 3.5mm'],
        ['Trọng lượng', '2.14 kg'],
        ['Hệ điều hành', 'macOS Sequoia']
      ],
      sku: 'MBP16-M4'
    },

    // ----------------------------------------------------
    // IPAD PRO M4
    // ----------------------------------------------------
    'ipad-pro': {
      id: 'ipad-pro',
      legacyId: null,
      name: 'iPad Pro 13" M4 (OLED Siêu Mỏng)',
      brand: 'Apple',
      category: 'ipad',
      badge: 'Màn Ultra Retina Tandem OLED',
      badgeSub: 'Chip Apple M4',
      tagline: 'Thiết kế mỏng nhất từ trước đến nay của Apple, màn hình kép Tandem OLED đỉnh cao.',
      basePrice: 37990000,
      oldPrice: 39990000,
      colors: [
        { name: 'Đen Không Gian', key: 'black', hex: '#1D1D1F', img: 'frontend/assets/images/placeholders/tablet.svg' },
        { name: 'Bạc', key: 'silver', hex: '#D8D9DD', img: 'frontend/assets/images/placeholders/tablet.svg' }
      ],
      extraImages: [],
      variantLabel: 'Dung lượng & Kết nối',
      variants: [
        { label: '256GB (Wi-Fi)', delta: 0, discount: '-5%' },
        { label: '512GB (Wi-Fi)', delta: 5000000, discount: '-5%' },
        { label: '1TB (Wi-Fi + 5G Cellular)', delta: 16000000, discount: '-4%' }
      ],
      perks: [
        'Giảm 1.000.000₫ khi mua kèm bút Apple Pencil Pro',
        'Tặng dán màn hình Paperlike cao cấp cho đồ họa',
        'Bảo hành chính hãng 24 tháng'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: '13" Tandem OLED', bullets: ['Công nghệ 2 lớp OLED xếp chồng', 'Độ tương phản vô hạn 2.000.000:1', 'Độ sáng 1600 nits đỉnh HDR'] },
        { icon: 'cpu', title: 'Vi xử lý', value: 'Apple M4 (3nm thế hệ 2)', bullets: ['CPU 10 lõi xử lý dựng hình cực nhanh', 'Neural Engine 38 nghìn tỷ phép tính/giây'] },
        { icon: 'battery', title: 'Độ mỏng kỷ lục', value: 'Chỉ 5.1 mm', bullets: ['Thiết bị mỏng nhất Apple từng chế tạo', 'Trọng lượng chỉ 579 gram'] },
        { icon: 'camera', title: 'Phụ kiện Pro', value: 'Hỗ trợ Pencil Pro', bullets: ['Nút bóp cảm ứng xoay haptic feedback', 'Magic Keyboard nhôm nguyên khối'] }
      ],
      specs: [
        ['Màn hình', '13 inch Ultra Retina XDR Tandem OLED, 120Hz ProMotion'],
        ['Vi xử lý', 'Apple M4 9-core hoặc 10-core CPU'],
        ['Bộ nhớ', '256GB / 512GB / 1TB / 2TB'],
        ['Độ mỏng', '5.1 mm – Trọng lượng 579g'],
        ['Cổng kết nối', 'Thunderbolt / USB 4']
      ],
      sku: 'IPADP-M4'
    },

    // ----------------------------------------------------
    // AIRPODS PRO 2
    // ----------------------------------------------------
    'airpods-pro-2': {
      id: 'airpods-pro-2',
      legacyId: null,
      name: 'AirPods Pro 2 (Hộp sạc USB-C)',
      brand: 'Apple',
      category: 'tai-nghe',
      badge: 'Chống Ồn Chủ Động 2X',
      badgeSub: 'Chip Apple H2',
      tagline: 'Âm thanh không gian cá nhân hóa, chống ồn chủ động gấp đôi và hộp sạc USB-C.',
      basePrice: 5690000,
      oldPrice: 6190000,
      colors: [
        { name: 'Trắng Bóng', key: 'white', hex: '#FFFFFF', img: 'frontend/assets/images/placeholders/headphones.svg' }
      ],
      extraImages: [],
      variantLabel: 'Phiên bản',
      variants: [
        { label: 'Bản Tiêu Chuẩn (USB-C MagSafe)', delta: 0, discount: '-8%' }
      ],
      perks: [
        'Tặng bao da bảo vệ hộp sạc trị giá 250.000₫',
        'Miễn phí khắc tên/emoji cá nhân hóa hộp sạc',
        'Bảo hành chính hãng 12 tháng 1 đổi 1'
      ],
      highlights: [
        { icon: 'cpu', title: 'Chip xử lý', value: 'Apple H2 & U1', bullets: ['Chống ồn thông minh thích ứng', 'Âm thanh vòm Spatial Audio'] },
        { icon: 'battery', title: 'Thời lượng Pin', value: '30 Giờ Tổng Cộng', bullets: ['6 giờ nghe liên tục một lần sạc', 'Hộp sạc hỗ trợ MagSafe và loa tìm kiếm Find My'] }
      ],
      specs: [
        ['Chipset', 'Apple H2 cho tai nghe, Apple U1 cho hộp sạc'],
        ['Kháng nước & mồ hôi', 'IP54 cho cả tai nghe và hộp sạc'],
        ['Cổng sạc', 'USB-C, MagSafe, Apple Watch Charger'],
        ['Thời lượng pin', 'Lên đến 6 giờ (30 giờ kèm hộp sạc)']
      ],
      sku: 'MTJV3'
    },

    // ----------------------------------------------------
    // APPLE WATCH ULTRA 3
    // ----------------------------------------------------
    'apple-watch-ultra-3': {
      id: 'apple-watch-ultra-3',
      legacyId: null,
      name: 'Apple Watch Ultra 3 (Titan Đen)',
      brand: 'Apple',
      category: 'dong-ho-dien-tu',
      badge: 'Vỏ Titanium 49mm',
      badgeSub: 'GPS Kép Tần Số',
      tagline: 'Chiếc đồng hồ thể thao và thám hiểm tối thượng, độ bền chuẩn quân đội.',
      basePrice: 21990000,
      oldPrice: 22990000,
      colors: [
        { name: 'Titan Tự Nhiên', key: 'natural', hex: '#98928B', img: 'frontend/assets/images/placeholders/watch.svg' },
        { name: 'Titan Đen Không Gian', key: 'black', hex: '#1D1D1F', img: 'frontend/assets/images/placeholders/watch.svg' }
      ],
      extraImages: [],
      variantLabel: 'Loại dây đeo chuyên dụng',
      variants: [
        { label: 'Dây Alpine Loop (Leo núi)', delta: 0, discount: '-4%' },
        { label: 'Dây Trail Loop (Chạy bộ)', delta: 0, discount: '-4%' },
        { label: 'Dây Ocean Band (Bơi lặn)', delta: 0, discount: '-4%' }
      ],
      perks: [
        'Tặng dán viền kính Sapphire chống trầy',
        'Bảo hành chính hãng 24 tháng VIP'
      ],
      highlights: [
        { icon: 'screen', title: 'Màn hình', value: 'Sapphire 3000 nits', bullets: ['Mặt kính Sapphire phẳng chống va đập', 'Màn hình Always-On sáng nhất'] },
        { icon: 'battery', title: 'Pin thám hiểm', value: 'Lên tới 72 Giờ', bullets: ['36 giờ dùng thông thường', '72 giờ ở chế độ tiết kiệm pin'] }
      ],
      specs: [
        ['Kích thước vỏ', '49mm Titanium'],
        ['Màn hình', 'Always-On Retina OLED, 3000 nits'],
        ['Độ lặn sâu', '100m, chứng nhận EN13319'],
        ['Kết nối', 'LTE 4G + GPS kép tần số L1/L5']
      ],
      sku: 'AW-ULTRA-3'
    }
  };

  // Helper tìm kiếm sản phẩm theo ID hoặc slug hoặc tên
  function findProduct(query) {
    if (!query) return null;
    var slug = query.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // 1. Khớp chính xác slug trong CATALOG
    if (CATALOG[slug]) return CATALOG[slug];

    // 2. Khớp theo legacyId
    for (var k in CATALOG) {
      if (CATALOG[k].legacyId && CATALOG[k].legacyId.toString() === query.toString()) {
        return CATALOG[k];
      }
    }

    // 3. Khớp một phần slug
    for (var k2 in CATALOG) {
      if (slug.indexOf(k2) !== -1 || k2.indexOf(slug) !== -1) {
        return CATALOG[k2];
      }
    }

    return null;
  }

  // Đưa ra phạm vi toàn cục
  global.VLU_COLOR_HEX = COLOR_HEX;
  global.VLU_GET_COLOR_HEX = getColorHex;
  global.VLU_CATALOG = CATALOG;
  global.VLU_FIND_PRODUCT = findProduct;

})(typeof window !== 'undefined' ? window : this);
