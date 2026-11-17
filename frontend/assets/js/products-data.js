/**
 * VLU FLAGSHIP STORE – Centralized Product Catalog Database
 * Catalog chuẩn 115 sản phẩm dùng chung cho cửa hàng, chi tiết và quản trị.
 */

(function (global) {
  'use strict';

  // Bảng mã màu chuẩn VLU_COLOR_HEX_MAP (ưu tiên khớp cụm từ dài trước, hỗ trợ tiếng Việt có dấu / không dấu / tiếng Anh)
  var COLOR_HEX = {
    'den-khong-gian': '#1F2024',
    'space-black': '#1F2024',
    'titan-tu-nhien': '#C5B9A5',
    'natural-titanium': '#C5B9A5',
    'titan-sa-mac': '#C2A68C',
    'desert-titanium': '#C2A68C',
    'vang-dong': '#C2A68C',
    'titan-trang': '#F5F5F7',
    'starlight-white': '#F5F5F7',
    'glacier-white': '#F5F5F7',
    'titan-den': '#1F2024',
    'titan-xam': '#7D7E80',
    'xam-khong-gian': '#7D7E80',
    'space-gray': '#7D7E80',
    'space-grey': '#7D7E80',
    'dem-xanh-tham': '#1E293B',
    'midnight': '#1E293B',
    'xanh-navy': '#1E293B',
    'xanh-dam': '#1E293B',
    'xanh-da-troi': '#93C5FD',
    'sky-blue': '#93C5FD',
    'xanh-bang': '#93C5FD',
    'ice-blue': '#93C5FD',
    'xanh-nhat': '#93C5FD',
    'xanh-duong': '#2563EB',
    'blue': '#2563EB',
    'ultramarine': '#2563EB',
    'xanh-bac-ha': '#6EE7B7',
    'xanh-la': '#6EE7B7',
    'mint': '#6EE7B7',
    'green': '#6EE7B7',
    'xanh-reu': '#4D5E3C',
    'anh-sao': '#F0E5D3',
    'starlight': '#F0E5D3',
    'kem': '#F0E5D3',
    'bac': '#E3E4E6',
    'silver': '#E3E4E6',
    'trang-bac': '#E3E4E6',
    'trang': '#F5F5F7',
    'white': '#F5F5F7',
    'den': '#1F2024',
    'black': '#1F2024',
    'xam': '#7D7E80',
    'gray': '#7D7E80',
    'do-do': '#991B1B',
    'burgundy': '#991B1B',
    'do': '#B91C1C',
    'red': '#B91C1C',
    'vang': '#F3D58D',
    'gold': '#F3D58D',
    'hong': '#F4A7B9',
    'pink': '#F4A7B9',
    'rose': '#F4A7B9',
    'tim-dam': '#8B5CF6',
    'tim': '#C4B5FD',
    'purple': '#C4B5FD',
    'lavender': '#C4B5FD',
    'cam': '#F97316',
    'orange': '#F97316',
    'nau': '#78350F',
    'brown': '#78350F'
  };

  var COLOR_HEX_ORDERED_RULES = [["den khong gian","#1F2024"],["space black","#1F2024"],["titan tu nhien","#C5B9A5"],["natural titanium","#C5B9A5"],["titan sa mac","#C2A68C"],["desert titanium","#C2A68C"],["vang dong","#C2A68C"],["den vang dong","#5E503F"],["titan trang","#F5F5F7"],["starlight white","#F5F5F7"],["glacier white","#F5F5F7"],["titan den","#1F2024"],["titan xam","#7D7E80"],["xam khong gian","#7D7E80"],["space gray","#7D7E80"],["space grey","#7D7E80"],["dem xanh tham","#1E293B"],["xanh da troi","#93C5FD"],["sky blue","#93C5FD"],["xanh bang","#93C5FD"],["ice blue","#93C5FD"],["xanh nhat","#93C5FD"],["xanh duong","#2563EB"],["ultramarine","#2563EB"],["xanh navy","#1E293B"],["xanh dam","#1E293B"],["midnight","#1E293B"],["xanh bac ha","#6EE7B7"],["xanh ngoc","#5EEAD4"],["xanh la nhat","#86EFAC"],["xanh la","#6EE7B7"],["xanh reu","#4D5E3C"],["xanh lam","#608A6E"],["anh sao","#F0E5D3"],["starlight","#F0E5D3"],["trang bac","#E3E4E6"],["trang sang","#FAFAFC"],["trang ngoc","#EFEFF2"],["trang sua","#F1F2F5"],["trang tinh","#F8F9FA"],["trang may","#EAECEF"],["bac sang","#EDEFF2"],["bac nham","#D6D8DE"],["bac anh kim","#DFE2E8"],["bac ngoc","#E0E3E8"],["bac titan","#CED2D9"],["bac xam","#9EA1A8"],["bac den","#D1D5DB"],["xam bac","#C4C8D0"],["xam nhat","#B8BDC6"],["xam dam","#525459"],["xam than","#464950"],["xam khoi","#5A5D64"],["xam titan","#6C6F76"],["xam ghi","#74777E"],["xam den","#36383E"],["den led tim","#4C3559"],["den led xanh","#244E3D"],["den anh tim","#362F48"],["den nham","#2A2C30"],["den carbon","#222429"],["den than","#25272D"],["den xam","#3A3C42"],["den tuyen","#17181C"],["den nano","#1F2024"],["vang den","#78664E"],["do do","#991B1B"],["burgundy","#991B1B"],["tim dam","#8B5CF6"],["lavender","#C4B5FD"],["purple","#C4B5FD"],["silver","#E3E4E6"],["white","#F5F5F7"],["black","#1F2024"],["gray","#7D7E80"],["grey","#7D7E80"],["mint","#6EE7B7"],["green","#6EE7B7"],["blue","#2563EB"],["pink","#F4A7B9"],["rose","#F4A7B9"],["gold","#F3D58D"],["orange","#F97316"],["brown","#78350F"],["cream","#F0E5D3"],["red","#B91C1C"],["bac","#E3E4E6"],["trang","#F5F5F7"],["den","#1F2024"],["xam","#7D7E80"],["do","#B91C1C"],["kem","#F0E5D3"],["vang","#F3D58D"],["hong","#F4A7B9"],["tim","#C4B5FD"],["cam","#F97316"],["nau","#78350F"],["xanh","#2563EB"]];

  function normalizeColorPhrase(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function getColorHex(nameOrKey, fallbackKey) {
    var candidates = [nameOrKey, fallbackKey];
    for (var c = 0; c < candidates.length; c++) {
      var raw = candidates[c];
      if (!raw) continue;
      var norm = normalizeColorPhrase(raw);
      if (!norm) continue;
      var slug = norm.replace(/\s+/g, '-');
      if (COLOR_HEX[slug]) return COLOR_HEX[slug];
      var padded = ' ' + norm + ' ';
      for (var i = 0; i < COLOR_HEX_ORDERED_RULES.length; i++) {
        if (padded.indexOf(' ' + COLOR_HEX_ORDERED_RULES[i][0] + ' ') !== -1) {
          return COLOR_HEX_ORDERED_RULES[i][1];
        }
      }
    }
    return '#7D7E80';
  }

  function isLightColorHex(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return false;
    var n = parseInt(m[1], 16);
    var r = (n >> 16) & 255;
    var g = (n >> 8) & 255;
    var b = n & 255;
    var luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma >= 205;
  }

  // Toàn bộ Cơ sở dữ liệu Catalog
  var CATALOG =   {
    "iphone-18-pro-max": {
      "id": "iphone-18-pro-max",
      "name": "iPhone 18 Pro Max",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 18 Pro Max chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 34990000,
      "oldPrice": 37789200,
      "colors": [
        {
          "name": "Titan Tự Nhiên",
          "hex": "#C5B9A5",
          "key": "natural",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        },
        {
          "name": "Titan Đen",
          "hex": "#3C3B37",
          "key": "black",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        },
        {
          "name": "Titan Trắng",
          "hex": "#E3E4E5",
          "key": "white",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        },
        {
          "name": "Titan Sa Mạc",
          "hex": "#C7A382",
          "key": "desert",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A20 Pro (2nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 18 Pro Max"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A20 Pro (2nm)"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-18-PRO-MAX",
      "image": "frontend/assets/images/placeholders/phone.svg",
      "img": "frontend/assets/images/placeholders/phone.svg"
    },
    "iphone-18-pro": {
      "id": "iphone-18-pro",
      "name": "iPhone 18 Pro",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 18 Pro chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 29990000,
      "oldPrice": 32389200,
      "colors": [
        {
          "name": "Titan Tự Nhiên",
          "hex": "#C5B9A5",
          "key": "natural",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        },
        {
          "name": "Titan Đen",
          "hex": "#3C3B37",
          "key": "black",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        },
        {
          "name": "Titan Trắng",
          "hex": "#E3E4E5",
          "key": "white",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        },
        {
          "name": "Titan Sa Mạc",
          "hex": "#C7A382",
          "key": "desert",
          "image": "frontend/assets/images/placeholders/phone.svg",
          "img": "frontend/assets/images/placeholders/phone.svg"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A20 Pro (2nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 18 Pro"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A20 Pro (2nm)"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-18-PRO",
      "image": "frontend/assets/images/placeholders/phone.svg",
      "img": "frontend/assets/images/placeholders/phone.svg"
    },
    "iphone-17-pro-max": {
      "id": "iphone-17-pro-max",
      "name": "iPhone 17 Pro Max",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 17 Pro Max chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 33990000,
      "oldPrice": 36709200,
      "colors": [
        {
          "name": "Titan Tự Nhiên",
          "hex": "#C5B9A5",
          "key": "natural",
          "image": "img/phones/apple/iphone-17-pro-max-natural.webp",
          "img": "img/phones/apple/iphone-17-pro-max-natural.webp"
        },
        {
          "name": "Titan Đen",
          "hex": "#3C3B37",
          "key": "black",
          "image": "img/phones/apple/iphone-17-pro-max-black.webp",
          "img": "img/phones/apple/iphone-17-pro-max-black.webp"
        },
        {
          "name": "Titan Trắng",
          "hex": "#E3E4E5",
          "key": "white",
          "image": "img/phones/apple/iphone-17-pro-max-white.webp",
          "img": "img/phones/apple/iphone-17-pro-max-white.webp"
        },
        {
          "name": "Titan Sa Mạc",
          "hex": "#C7A382",
          "key": "desert",
          "image": "img/phones/apple/iphone-17-pro-max-desert.webp",
          "img": "img/phones/apple/iphone-17-pro-max-desert.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A19 Pro (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 17 Pro Max"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A19 Pro (3nm)"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-17-PRO-MAX",
      "image": "img/phones/apple/iphone-17-pro-max-natural.webp",
      "img": "img/phones/apple/iphone-17-pro-max-natural.webp"
    },
    "iphone-17-pro": {
      "id": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 17 Pro chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 28990000,
      "oldPrice": 31309200,
      "colors": [
        {
          "name": "Titan Tự Nhiên",
          "hex": "#C5B9A5",
          "key": "natural",
          "image": "img/phones/apple/iphone-17-pro-natural.webp",
          "img": "img/phones/apple/iphone-17-pro-natural.webp"
        },
        {
          "name": "Titan Đen",
          "hex": "#3C3B37",
          "key": "black",
          "image": "img/phones/apple/iphone-17-pro-black.webp",
          "img": "img/phones/apple/iphone-17-pro-black.webp"
        },
        {
          "name": "Titan Trắng",
          "hex": "#E3E4E5",
          "key": "white",
          "image": "img/phones/apple/iphone-17-pro-white.webp",
          "img": "img/phones/apple/iphone-17-pro-white.webp"
        },
        {
          "name": "Titan Sa Mạc",
          "hex": "#C7A382",
          "key": "desert",
          "image": "img/phones/apple/iphone-17-pro-desert.webp",
          "img": "img/phones/apple/iphone-17-pro-desert.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A19 Pro (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 17 Pro"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A19 Pro (3nm)"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-17-PRO",
      "image": "img/phones/apple/iphone-17-pro-natural.webp",
      "img": "img/phones/apple/iphone-17-pro-natural.webp"
    },
    "iphone-17": {
      "id": "iphone-17",
      "name": "iPhone 17",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 17 chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 21990000,
      "oldPrice": 23749200,
      "colors": [
        {
          "name": "Trắng",
          "hex": "#F5F5F7",
          "key": "white",
          "image": "img/phones/apple/iphone-17-white.webp",
          "img": "img/phones/apple/iphone-17-white.webp"
        },
        {
          "name": "Tím Oải Hương",
          "hex": "#DDD4E8",
          "key": "lavender",
          "image": "img/phones/apple/iphone-17-lavender.webp",
          "img": "img/phones/apple/iphone-17-lavender.webp"
        },
        {
          "name": "Xanh Lam Khói",
          "hex": "#A7BDCB",
          "key": "smoke-blue",
          "image": "img/phones/apple/iphone-17-smoke-blue.webp",
          "img": "img/phones/apple/iphone-17-smoke-blue.webp"
        },
        {
          "name": "Xanh Lá Xô Thơm",
          "hex": "#C2CFC4",
          "key": "sage-green",
          "image": "img/phones/apple/iphone-17-sage-green.webp",
          "img": "img/phones/apple/iphone-17-sage-green.webp"
        },
        {
          "name": "Đen",
          "hex": "#343739",
          "key": "black",
          "image": "img/phones/apple/iphone-17-black.webp",
          "img": "img/phones/apple/iphone-17-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A19 Pro (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 17"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A19 Pro (3nm)"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-17",
      "image": "img/phones/apple/iphone-17-white.webp",
      "img": "img/phones/apple/iphone-17-white.webp"
    },
    "iphone-16-pro-max": {
      "id": "iphone-16-pro-max",
      "name": "iPhone 16 Pro Max",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 16 Pro Max chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 31990000,
      "oldPrice": 34549200,
      "colors": [
        {
          "name": "Titan Tự Nhiên",
          "hex": "#C5B9A5",
          "key": "natural",
          "image": "img/phones/apple/iphone-16-pro-max-natural.webp",
          "img": "img/phones/apple/iphone-16-pro-max-natural.webp"
        },
        {
          "name": "Titan Đen",
          "hex": "#3C3B37",
          "key": "black",
          "image": "img/phones/apple/iphone-16-pro-max-black.webp",
          "img": "img/phones/apple/iphone-16-pro-max-black.webp"
        },
        {
          "name": "Titan Trắng",
          "hex": "#E3E4E5",
          "key": "white",
          "image": "img/phones/apple/iphone-16-pro-max-white.webp",
          "img": "img/phones/apple/iphone-16-pro-max-white.webp"
        },
        {
          "name": "Titan Sa Mạc",
          "hex": "#C7A382",
          "key": "desert",
          "image": "img/phones/apple/iphone-16-pro-max-desert.webp",
          "img": "img/phones/apple/iphone-16-pro-max-desert.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A18 Pro / A18",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 16 Pro Max"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A18 Pro / A18"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-16-PRO-MAX",
      "image": "img/phones/apple/iphone-16-pro-max-natural.webp",
      "img": "img/phones/apple/iphone-16-pro-max-natural.webp"
    },
    "iphone-16-pro": {
      "id": "iphone-16-pro",
      "name": "iPhone 16 Pro",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 16 Pro chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 26990000,
      "oldPrice": 29149200,
      "colors": [
        {
          "name": "Titan Tự Nhiên",
          "hex": "#C5B9A5",
          "key": "natural",
          "image": "img/phones/apple/iphone-16-pro-natural.webp",
          "img": "img/phones/apple/iphone-16-pro-natural.webp"
        },
        {
          "name": "Titan Đen",
          "hex": "#3C3B37",
          "key": "black",
          "image": "img/phones/apple/iphone-16-pro-black.webp",
          "img": "img/phones/apple/iphone-16-pro-black.webp"
        },
        {
          "name": "Titan Trắng",
          "hex": "#E3E4E5",
          "key": "white",
          "image": "img/phones/apple/iphone-16-pro-white.webp",
          "img": "img/phones/apple/iphone-16-pro-white.webp"
        },
        {
          "name": "Titan Sa Mạc",
          "hex": "#C7A382",
          "key": "desert",
          "image": "img/phones/apple/iphone-16-pro-desert.webp",
          "img": "img/phones/apple/iphone-16-pro-desert.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A18 Pro / A18",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 16 Pro"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A18 Pro / A18"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-16-PRO",
      "image": "img/phones/apple/iphone-16-pro-natural.webp",
      "img": "img/phones/apple/iphone-16-pro-natural.webp"
    },
    "iphone-16-plus": {
      "id": "iphone-16-plus",
      "name": "iPhone 16 Plus",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 16 Plus chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 23990000,
      "oldPrice": 25909200,
      "colors": [
        {
          "name": "Xanh Lưu Ly",
          "hex": "#3F5277",
          "key": "ultramarine",
          "image": "img/phones/apple/iphone-16-plus-ultramarine.webp",
          "img": "img/phones/apple/iphone-16-plus-ultramarine.webp"
        },
        {
          "name": "Xanh Mòng Két",
          "hex": "#8EADA4",
          "key": "teal",
          "image": "img/phones/apple/iphone-16-plus-teal.webp",
          "img": "img/phones/apple/iphone-16-plus-teal.webp"
        },
        {
          "name": "Hồng",
          "hex": "#E9B8BE",
          "key": "pink",
          "image": "img/phones/apple/iphone-16-plus-pink.webp",
          "img": "img/phones/apple/iphone-16-plus-pink.webp"
        },
        {
          "name": "Trắng",
          "hex": "#F2F2F2",
          "key": "white",
          "image": "img/phones/apple/iphone-16-plus-white.webp",
          "img": "img/phones/apple/iphone-16-plus-white.webp"
        },
        {
          "name": "Đen",
          "hex": "#33373B",
          "key": "black",
          "image": "img/phones/apple/iphone-16-plus-black.webp",
          "img": "img/phones/apple/iphone-16-plus-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A18 Pro / A18",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 16 Plus"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A18 Pro / A18"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-16-PLUS",
      "image": "img/phones/apple/iphone-16-plus-ultramarine.webp",
      "img": "img/phones/apple/iphone-16-plus-ultramarine.webp"
    },
    "iphone-16": {
      "id": "iphone-16",
      "name": "iPhone 16",
      "brand": "Apple",
      "category": "dien-thoai",
      "badge": "Apple · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm iPhone 16 chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 20490000,
      "oldPrice": 22129200,
      "colors": [
        {
          "name": "Xanh Lưu Ly",
          "hex": "#3F5277",
          "key": "ultramarine",
          "image": "img/phones/apple/iphone-16-ultramarine.webp",
          "img": "img/phones/apple/iphone-16-ultramarine.webp"
        },
        {
          "name": "Xanh Mòng Két",
          "hex": "#8EADA4",
          "key": "teal",
          "image": "img/phones/apple/iphone-16-teal.webp",
          "img": "img/phones/apple/iphone-16-teal.webp"
        },
        {
          "name": "Hồng",
          "hex": "#E9B8BE",
          "key": "pink",
          "image": "img/phones/apple/iphone-16-pink.webp",
          "img": "img/phones/apple/iphone-16-pink.webp"
        },
        {
          "name": "Trắng",
          "hex": "#F2F2F2",
          "key": "white",
          "image": "img/phones/apple/iphone-16-white.webp",
          "img": "img/phones/apple/iphone-16-white.webp"
        },
        {
          "name": "Đen",
          "hex": "#33373B",
          "key": "black",
          "image": "img/phones/apple/iphone-16-black.webp",
          "img": "img/phones/apple/iphone-16-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Apple A18 Pro / A18",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "iPhone 16"
        ],
        [
          "Hãng sản xuất",
          "Apple"
        ],
        [
          "Vi xử lý (CPU)",
          "Apple A18 Pro / A18"
        ],
        [
          "Hệ điều hành",
          "iOS"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "IPHONE-16",
      "image": "img/phones/apple/iphone-16-ultramarine.webp",
      "img": "img/phones/apple/iphone-16-ultramarine.webp"
    },
    "galaxy-s26-ultra": {
      "id": "galaxy-s26-ultra",
      "name": "Galaxy S26 Ultra",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy S26 Ultra chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 31990000,
      "oldPrice": 34549200,
      "colors": [
        {
          "name": "Cobalt Violet",
          "hex": "#4E4362",
          "key": "violet",
          "image": "img/phones/samsung/galaxy-s26-ultra-violet.webp",
          "img": "img/phones/samsung/galaxy-s26-ultra-violet.webp"
        },
        {
          "name": "Silver Shadow",
          "hex": "#D8D9DD",
          "key": "silver",
          "image": "img/phones/samsung/galaxy-s26-ultra-silver.webp",
          "img": "img/phones/samsung/galaxy-s26-ultra-silver.webp"
        },
        {
          "name": "Pink Gold",
          "hex": "#DEB3AD",
          "key": "pink",
          "image": "img/phones/samsung/galaxy-s26-ultra-pink.webp",
          "img": "img/phones/samsung/galaxy-s26-ultra-pink.webp"
        },
        {
          "name": "Xanh Da Trời",
          "hex": "#A8C5DA",
          "key": "blue",
          "image": "img/phones/samsung/galaxy-s26-ultra-blue.webp",
          "img": "img/phones/samsung/galaxy-s26-ultra-blue.webp"
        },
        {
          "name": "Đen Phantom",
          "hex": "#252527",
          "key": "black",
          "image": "img/phones/samsung/galaxy-s26-ultra-black.webp",
          "img": "img/phones/samsung/galaxy-s26-ultra-black.webp"
        },
        {
          "name": "Trắng Titan",
          "hex": "#F0F1F5",
          "key": "white",
          "image": "img/phones/samsung/galaxy-s26-ultra-white.webp",
          "img": "img/phones/samsung/galaxy-s26-ultra-white.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite Gen 2",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy S26 Ultra"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite Gen 2"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-S26-ULTRA",
      "image": "img/phones/samsung/galaxy-s26-ultra-violet.webp",
      "img": "img/phones/samsung/galaxy-s26-ultra-violet.webp"
    },
    "galaxy-s26-plus": {
      "id": "galaxy-s26-plus",
      "name": "Galaxy S26+",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy S26+ chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 25990000,
      "oldPrice": 28069200,
      "colors": [
        {
          "name": "Cobalt Violet",
          "hex": "#4E4362",
          "key": "violet",
          "image": "img/phones/samsung/galaxy-s26-plus-violet.webp",
          "img": "img/phones/samsung/galaxy-s26-plus-violet.webp"
        },
        {
          "name": "Silver Shadow",
          "hex": "#D8D9DD",
          "key": "silver",
          "image": "img/phones/samsung/galaxy-s26-plus-silver.webp",
          "img": "img/phones/samsung/galaxy-s26-plus-silver.webp"
        },
        {
          "name": "Pink Gold",
          "hex": "#DEB3AD",
          "key": "pink",
          "image": "img/phones/samsung/galaxy-s26-plus-pink.webp",
          "img": "img/phones/samsung/galaxy-s26-plus-pink.webp"
        },
        {
          "name": "Sky Blue",
          "hex": "#A8C5DA",
          "key": "blue",
          "image": "img/phones/samsung/galaxy-s26-plus-blue.webp",
          "img": "img/phones/samsung/galaxy-s26-plus-blue.webp"
        },
        {
          "name": "Black",
          "hex": "#252527",
          "key": "black",
          "image": "img/phones/samsung/galaxy-s26-plus-black.webp",
          "img": "img/phones/samsung/galaxy-s26-plus-black.webp"
        },
        {
          "name": "White",
          "hex": "#F0F1F5",
          "key": "white",
          "image": "img/phones/samsung/galaxy-s26-plus-white.webp",
          "img": "img/phones/samsung/galaxy-s26-plus-white.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite Gen 2",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy S26+"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite Gen 2"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-S26-PLUS",
      "image": "img/phones/samsung/galaxy-s26-plus-violet.webp",
      "img": "img/phones/samsung/galaxy-s26-plus-violet.webp"
    },
    "galaxy-s26": {
      "id": "galaxy-s26",
      "name": "Galaxy S26",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy S26 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 21990000,
      "oldPrice": 23749200,
      "colors": [
        {
          "name": "Cobalt Violet",
          "hex": "#4E4362",
          "key": "violet",
          "image": "img/phones/samsung/galaxy-s26-violet.webp",
          "img": "img/phones/samsung/galaxy-s26-violet.webp"
        },
        {
          "name": "Silver Shadow",
          "hex": "#D8D9DD",
          "key": "silver",
          "image": "img/phones/samsung/galaxy-s26-silver.webp",
          "img": "img/phones/samsung/galaxy-s26-silver.webp"
        },
        {
          "name": "Pink Gold",
          "hex": "#DEB3AD",
          "key": "pink",
          "image": "img/phones/samsung/galaxy-s26-pink.webp",
          "img": "img/phones/samsung/galaxy-s26-pink.webp"
        },
        {
          "name": "Sky Blue",
          "hex": "#A8C5DA",
          "key": "blue",
          "image": "img/phones/samsung/galaxy-s26-blue.webp",
          "img": "img/phones/samsung/galaxy-s26-blue.webp"
        },
        {
          "name": "Black",
          "hex": "#252527",
          "key": "black",
          "image": "img/phones/samsung/galaxy-s26-black.webp",
          "img": "img/phones/samsung/galaxy-s26-black.webp"
        },
        {
          "name": "White",
          "hex": "#F0F1F5",
          "key": "white",
          "image": "img/phones/samsung/galaxy-s26-white.webp",
          "img": "img/phones/samsung/galaxy-s26-white.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite Gen 2",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy S26"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite Gen 2"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-S26",
      "image": "img/phones/samsung/galaxy-s26-violet.webp",
      "img": "img/phones/samsung/galaxy-s26-violet.webp"
    },
    "galaxy-s25-ultra": {
      "id": "galaxy-s25-ultra",
      "name": "Galaxy S25 Ultra",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy S25 Ultra chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 29990000,
      "oldPrice": 32389200,
      "colors": [
        {
          "name": "Titanium Gray",
          "hex": "#7B7B7D",
          "key": "gray",
          "image": "img/phones/samsung/galaxy-s25-ultra-gray.webp",
          "img": "img/phones/samsung/galaxy-s25-ultra-gray.webp"
        },
        {
          "name": "Titanium Black",
          "hex": "#2B2B2D",
          "key": "black",
          "image": "img/phones/samsung/galaxy-s25-ultra-black.webp",
          "img": "img/phones/samsung/galaxy-s25-ultra-black.webp"
        },
        {
          "name": "Titanium Violet",
          "hex": "#4A435A",
          "key": "violet",
          "image": "img/phones/samsung/galaxy-s25-ultra-violet.webp",
          "img": "img/phones/samsung/galaxy-s25-ultra-violet.webp"
        },
        {
          "name": "Titanium Yellow",
          "hex": "#E5DECE",
          "key": "yellow",
          "image": "img/phones/samsung/galaxy-s25-ultra-yellow.webp",
          "img": "img/phones/samsung/galaxy-s25-ultra-yellow.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy S25 Ultra"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-S25-ULTRA",
      "image": "img/phones/samsung/galaxy-s25-ultra-gray.webp",
      "img": "img/phones/samsung/galaxy-s25-ultra-gray.webp"
    },
    "galaxy-s25-plus": {
      "id": "galaxy-s25-plus",
      "name": "Galaxy S25+",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy S25+ chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 23990000,
      "oldPrice": 25909200,
      "colors": [
        {
          "name": "Cobalt Violet",
          "hex": "#4A435A",
          "key": "violet",
          "image": "img/phones/samsung/galaxy-s25-plus-violet.webp",
          "img": "img/phones/samsung/galaxy-s25-plus-violet.webp"
        },
        {
          "name": "Silver Shadow",
          "hex": "#D8D9DD",
          "key": "silver",
          "image": "img/phones/samsung/galaxy-s25-plus-silver.webp",
          "img": "img/phones/samsung/galaxy-s25-plus-silver.webp"
        },
        {
          "name": "Onyx Black",
          "hex": "#2B2B2D",
          "key": "black",
          "image": "img/phones/samsung/galaxy-s25-plus-black.webp",
          "img": "img/phones/samsung/galaxy-s25-plus-black.webp"
        },
        {
          "name": "Marble Gray",
          "hex": "#EAEBED",
          "key": "gray",
          "image": "img/phones/samsung/galaxy-s25-plus-gray.webp",
          "img": "img/phones/samsung/galaxy-s25-plus-gray.webp"
        },
        {
          "name": "Amber Yellow",
          "hex": "#F0E5D1",
          "key": "yellow",
          "image": "img/phones/samsung/galaxy-s25-plus-yellow.webp",
          "img": "img/phones/samsung/galaxy-s25-plus-yellow.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy S25+"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-S25-PLUS",
      "image": "img/phones/samsung/galaxy-s25-plus-violet.webp",
      "img": "img/phones/samsung/galaxy-s25-plus-violet.webp"
    },
    "galaxy-s25": {
      "id": "galaxy-s25",
      "name": "Galaxy S25",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy S25 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 19990000,
      "oldPrice": 21589200,
      "colors": [
        {
          "name": "Cobalt Violet",
          "hex": "#4A435A",
          "key": "violet",
          "image": "img/phones/samsung/galaxy-s25-violet.webp",
          "img": "img/phones/samsung/galaxy-s25-violet.webp"
        },
        {
          "name": "Silver Shadow",
          "hex": "#D8D9DD",
          "key": "silver",
          "image": "img/phones/samsung/galaxy-s25-silver.webp",
          "img": "img/phones/samsung/galaxy-s25-silver.webp"
        },
        {
          "name": "Onyx Black",
          "hex": "#2B2B2D",
          "key": "black",
          "image": "img/phones/samsung/galaxy-s25-black.webp",
          "img": "img/phones/samsung/galaxy-s25-black.webp"
        },
        {
          "name": "Marble Gray",
          "hex": "#EAEBED",
          "key": "gray",
          "image": "img/phones/samsung/galaxy-s25-gray.webp",
          "img": "img/phones/samsung/galaxy-s25-gray.webp"
        },
        {
          "name": "Amber Yellow",
          "hex": "#F0E5D1",
          "key": "yellow",
          "image": "img/phones/samsung/galaxy-s25-yellow.webp",
          "img": "img/phones/samsung/galaxy-s25-yellow.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy S25"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-S25",
      "image": "img/phones/samsung/galaxy-s25-violet.webp",
      "img": "img/phones/samsung/galaxy-s25-violet.webp"
    },
    "galaxy-z-fold7": {
      "id": "galaxy-z-fold7",
      "name": "Galaxy Z Fold7",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy Z Fold7 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 41990000,
      "oldPrice": 45349200,
      "colors": [
        {
          "name": "Silver Shadow",
          "hex": "#D8D9DD",
          "key": "silver",
          "image": "img/phones/samsung/galaxy-z-fold7-silver.webp",
          "img": "img/phones/samsung/galaxy-z-fold7-silver.webp"
        },
        {
          "name": "Navy",
          "hex": "#2C3647",
          "key": "navy",
          "image": "img/phones/samsung/galaxy-z-fold7-navy.webp",
          "img": "img/phones/samsung/galaxy-z-fold7-navy.webp"
        },
        {
          "name": "Phantom Black",
          "hex": "#262729",
          "key": "black",
          "image": "img/phones/samsung/galaxy-z-fold7-black.webp",
          "img": "img/phones/samsung/galaxy-z-fold7-black.webp"
        },
        {
          "name": "Crafted White",
          "hex": "#F5F6F8",
          "key": "white",
          "image": "img/phones/samsung/galaxy-z-fold7-white.webp",
          "img": "img/phones/samsung/galaxy-z-fold7-white.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy Z Fold7"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-Z-FOLD7",
      "image": "img/phones/samsung/galaxy-z-fold7-silver.webp",
      "img": "img/phones/samsung/galaxy-z-fold7-silver.webp"
    },
    "galaxy-z-flip7": {
      "id": "galaxy-z-flip7",
      "name": "Galaxy Z Flip7",
      "brand": "Samsung",
      "category": "dien-thoai",
      "badge": "Samsung · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Galaxy Z Flip7 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 23990000,
      "oldPrice": 25909200,
      "colors": [
        {
          "name": "Mint",
          "hex": "#C2E5D3",
          "key": "mint",
          "image": "img/phones/samsung/galaxy-z-flip7-mint.webp",
          "img": "img/phones/samsung/galaxy-z-flip7-mint.webp"
        },
        {
          "name": "Silver Shadow",
          "hex": "#D8D9DD",
          "key": "silver",
          "image": "img/phones/samsung/galaxy-z-flip7-silver.webp",
          "img": "img/phones/samsung/galaxy-z-flip7-silver.webp"
        },
        {
          "name": "Blue",
          "hex": "#AECFE6",
          "key": "blue",
          "image": "img/phones/samsung/galaxy-z-flip7-blue.webp",
          "img": "img/phones/samsung/galaxy-z-flip7-blue.webp"
        },
        {
          "name": "Yellow",
          "hex": "#F7E8BA",
          "key": "yellow",
          "image": "img/phones/samsung/galaxy-z-flip7-yellow.webp",
          "img": "img/phones/samsung/galaxy-z-flip7-yellow.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Galaxy Z Flip7"
        ],
        [
          "Hãng sản xuất",
          "Samsung"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "GALAXY-Z-FLIP7",
      "image": "img/phones/samsung/galaxy-z-flip7-mint.webp",
      "img": "img/phones/samsung/galaxy-z-flip7-mint.webp"
    },
    "xiaomi-15-ultra": {
      "id": "xiaomi-15-ultra",
      "name": "Xiaomi 15 Ultra",
      "brand": "Xiaomi",
      "category": "dien-thoai",
      "badge": "Xiaomi · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Xiaomi 15 Ultra chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 23990000,
      "oldPrice": 25909200,
      "colors": [
        {
          "name": "Titan Silver",
          "hex": "#C5C6C9",
          "key": "silver",
          "image": "img/phones/xiaomi/xiaomi-15-ultra-silver.webp",
          "img": "img/phones/xiaomi/xiaomi-15-ultra-silver.webp"
        },
        {
          "name": "Trắng Gốm",
          "hex": "#F2F4F7",
          "key": "white",
          "image": "img/phones/xiaomi/xiaomi-15-ultra-white.webp",
          "img": "img/phones/xiaomi/xiaomi-15-ultra-white.webp"
        },
        {
          "name": "Đen Huyền Vũ",
          "hex": "#222325",
          "key": "black",
          "image": "img/phones/xiaomi/xiaomi-15-ultra-black.webp",
          "img": "img/phones/xiaomi/xiaomi-15-ultra-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Xiaomi 15 Ultra"
        ],
        [
          "Hãng sản xuất",
          "Xiaomi"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "XIAOMI-15-ULTRA",
      "image": "img/phones/xiaomi/xiaomi-15-ultra-silver.webp",
      "img": "img/phones/xiaomi/xiaomi-15-ultra-silver.webp"
    },
    "xiaomi-15-pro": {
      "id": "xiaomi-15-pro",
      "name": "Xiaomi 15 Pro",
      "brand": "Xiaomi",
      "category": "dien-thoai",
      "badge": "Xiaomi · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Xiaomi 15 Pro chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 19990000,
      "oldPrice": 21589200,
      "colors": [
        {
          "name": "Xám Đá",
          "hex": "#676B73",
          "key": "gray",
          "image": "img/phones/xiaomi/xiaomi-15-pro-gray.webp",
          "img": "img/phones/xiaomi/xiaomi-15-pro-gray.webp"
        },
        {
          "name": "Xanh Thông",
          "hex": "#495A4B",
          "key": "green",
          "image": "img/phones/xiaomi/xiaomi-15-pro-green.webp",
          "img": "img/phones/xiaomi/xiaomi-15-pro-green.webp"
        },
        {
          "name": "Trắng Tuyết",
          "hex": "#F5F7FA",
          "key": "white",
          "image": "img/phones/xiaomi/xiaomi-15-pro-white.webp",
          "img": "img/phones/xiaomi/xiaomi-15-pro-white.webp"
        },
        {
          "name": "Bạc Lỏng",
          "hex": "#D9DCE1",
          "key": "silver",
          "image": "img/phones/xiaomi/xiaomi-15-pro-silver.webp",
          "img": "img/phones/xiaomi/xiaomi-15-pro-silver.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Xiaomi 15 Pro"
        ],
        [
          "Hãng sản xuất",
          "Xiaomi"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "XIAOMI-15-PRO",
      "image": "img/phones/xiaomi/xiaomi-15-pro-gray.webp",
      "img": "img/phones/xiaomi/xiaomi-15-pro-gray.webp"
    },
    "xiaomi-15": {
      "id": "xiaomi-15",
      "name": "Xiaomi 15",
      "brand": "Xiaomi",
      "category": "dien-thoai",
      "badge": "Xiaomi · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Xiaomi 15 chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 15490000,
      "oldPrice": 16729200,
      "colors": [
        {
          "name": "Tím Lilac",
          "hex": "#C5B4E3",
          "key": "purple",
          "image": "img/phones/xiaomi/xiaomi-15-purple.webp",
          "img": "img/phones/xiaomi/xiaomi-15-purple.webp"
        },
        {
          "name": "Xanh Mạ",
          "hex": "#B5D6B2",
          "key": "green",
          "image": "img/phones/xiaomi/xiaomi-15-green.webp",
          "img": "img/phones/xiaomi/xiaomi-15-green.webp"
        },
        {
          "name": "Trắng Ngọc",
          "hex": "#F7F8FA",
          "key": "white",
          "image": "img/phones/xiaomi/xiaomi-15-white.webp",
          "img": "img/phones/xiaomi/xiaomi-15-white.webp"
        },
        {
          "name": "Đen Bóng",
          "hex": "#26272A",
          "key": "black",
          "image": "img/phones/xiaomi/xiaomi-15-black.webp",
          "img": "img/phones/xiaomi/xiaomi-15-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Xiaomi 15"
        ],
        [
          "Hãng sản xuất",
          "Xiaomi"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "XIAOMI-15",
      "image": "img/phones/xiaomi/xiaomi-15-purple.webp",
      "img": "img/phones/xiaomi/xiaomi-15-purple.webp"
    },
    "find-x8-ultra": {
      "id": "find-x8-ultra",
      "name": "Find X8 Ultra",
      "brand": "OPPO",
      "category": "dien-thoai",
      "badge": "OPPO · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Find X8 Ultra chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 25990000,
      "oldPrice": 28069200,
      "colors": [
        {
          "name": "Xanh Biển Sâu",
          "hex": "#2B4C6F",
          "key": "blue",
          "image": "img/phones/oppo/find-x8-ultra-blue.webp",
          "img": "img/phones/oppo/find-x8-ultra-blue.webp"
        },
        {
          "name": "Đen Titan",
          "hex": "#242527",
          "key": "black",
          "image": "img/phones/oppo/find-x8-ultra-black.webp",
          "img": "img/phones/oppo/find-x8-ultra-black.webp"
        },
        {
          "name": "Trắng Lụa",
          "hex": "#F2F4F7",
          "key": "white",
          "image": "img/phones/oppo/find-x8-ultra-white.webp",
          "img": "img/phones/oppo/find-x8-ultra-white.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "256GB",
          "delta": 0,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 3000000,
          "discount": "-5%"
        },
        {
          "label": "1TB",
          "delta": 7000000,
          "discount": "-4%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "MediaTek Dimensity 9400 (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Find X8 Ultra"
        ],
        [
          "Hãng sản xuất",
          "OPPO"
        ],
        [
          "Vi xử lý (CPU)",
          "MediaTek Dimensity 9400 (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "FIND-X8-ULTRA",
      "image": "img/phones/oppo/find-x8-ultra-blue.webp",
      "img": "img/phones/oppo/find-x8-ultra-blue.webp"
    },
    "find-x8-pro": {
      "id": "find-x8-pro",
      "name": "Find X8 Pro",
      "brand": "OPPO",
      "category": "dien-thoai",
      "badge": "OPPO · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Find X8 Pro chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 20990000,
      "oldPrice": 22669200,
      "colors": [
        {
          "name": "Đen Không Gian",
          "hex": "#232427",
          "key": "black",
          "image": "img/phones/oppo/find-x8-pro-black.webp",
          "img": "img/phones/oppo/find-x8-pro-black.webp"
        },
        {
          "name": "Trắng Ngọc Trai",
          "hex": "#F5F7FA",
          "key": "white",
          "image": "img/phones/oppo/find-x8-pro-white.webp",
          "img": "img/phones/oppo/find-x8-pro-white.webp"
        },
        {
          "name": "Xanh Hoshino",
          "hex": "#3C5A78",
          "key": "blue",
          "image": "img/phones/oppo/find-x8-pro-blue.webp",
          "img": "img/phones/oppo/find-x8-pro-blue.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "MediaTek Dimensity 9400 (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Find X8 Pro"
        ],
        [
          "Hãng sản xuất",
          "OPPO"
        ],
        [
          "Vi xử lý (CPU)",
          "MediaTek Dimensity 9400 (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "FIND-X8-PRO",
      "image": "img/phones/oppo/find-x8-pro-black.webp",
      "img": "img/phones/oppo/find-x8-pro-black.webp"
    },
    "find-x8": {
      "id": "find-x8",
      "name": "Find X8",
      "brand": "OPPO",
      "category": "dien-thoai",
      "badge": "OPPO · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Find X8 chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 16990000,
      "oldPrice": 18349200,
      "colors": [
        {
          "name": "Đen Trời Sao",
          "hex": "#252629",
          "key": "black",
          "image": "img/phones/oppo/find-x8-black.webp",
          "img": "img/phones/oppo/find-x8-black.webp"
        },
        {
          "name": "Hồng Vỏ Sò",
          "hex": "#F4D2DA",
          "key": "pink",
          "image": "img/phones/oppo/find-x8-pink.webp",
          "img": "img/phones/oppo/find-x8-pink.webp"
        },
        {
          "name": "Xanh Gió Biển",
          "hex": "#A8CDE6",
          "key": "blue",
          "image": "img/phones/oppo/find-x8-blue.webp",
          "img": "img/phones/oppo/find-x8-blue.webp"
        },
        {
          "name": "Trắng Mây Trôi",
          "hex": "#F7F8FA",
          "key": "white",
          "image": "img/phones/oppo/find-x8-white.webp",
          "img": "img/phones/oppo/find-x8-white.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "MediaTek Dimensity 9400 (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Find X8"
        ],
        [
          "Hãng sản xuất",
          "OPPO"
        ],
        [
          "Vi xử lý (CPU)",
          "MediaTek Dimensity 9400 (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "FIND-X8",
      "image": "img/phones/oppo/find-x8-black.webp",
      "img": "img/phones/oppo/find-x8-black.webp"
    },
    "reno13-pro-plus-5g": {
      "id": "reno13-pro-plus-5g",
      "name": "Reno13 Pro+ 5G",
      "brand": "OPPO",
      "category": "dien-thoai",
      "badge": "OPPO · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Reno13 Pro+ 5G chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 16990000,
      "oldPrice": 18349200,
      "colors": [
        {
          "name": "Tím Hồ Điệp",
          "hex": "#A793D1",
          "key": "purple",
          "image": "img/phones/oppo/reno13-pro-plus-5g-purple.webp",
          "img": "img/phones/oppo/reno13-pro-plus-5g-purple.webp"
        },
        {
          "name": "Đen Đêm",
          "hex": "#242527",
          "key": "black",
          "image": "img/phones/oppo/reno13-pro-plus-5g-black.webp",
          "img": "img/phones/oppo/reno13-pro-plus-5g-black.webp"
        },
        {
          "name": "Trắng Ngôi Sao",
          "hex": "#F5F6F8",
          "key": "white",
          "image": "img/phones/oppo/reno13-pro-plus-5g-white.webp",
          "img": "img/phones/oppo/reno13-pro-plus-5g-white.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "MediaTek Dimensity 8350",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Reno13 Pro+ 5G"
        ],
        [
          "Hãng sản xuất",
          "OPPO"
        ],
        [
          "Vi xử lý (CPU)",
          "MediaTek Dimensity 8350"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "RENO13-PRO-PLUS-5G",
      "image": "img/phones/oppo/reno13-pro-plus-5g-purple.webp",
      "img": "img/phones/oppo/reno13-pro-plus-5g-purple.webp"
    },
    "reno13-pro-5g": {
      "id": "reno13-pro-5g",
      "name": "Reno13 Pro 5G",
      "brand": "OPPO",
      "category": "dien-thoai",
      "badge": "OPPO · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Reno13 Pro 5G chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 14490000,
      "oldPrice": 15649200,
      "colors": [
        {
          "name": "Tím Hồ Điệp",
          "hex": "#A793D1",
          "key": "purple",
          "image": "img/phones/oppo/reno13-pro-5g-purple.webp",
          "img": "img/phones/oppo/reno13-pro-5g-purple.webp"
        },
        {
          "name": "Xanh Thiên Hà",
          "hex": "#4F769F",
          "key": "blue",
          "image": "img/phones/oppo/reno13-pro-5g-blue.webp",
          "img": "img/phones/oppo/reno13-pro-5g-blue.webp"
        },
        {
          "name": "Đen Bóng Đêm",
          "hex": "#242527",
          "key": "black",
          "image": "img/phones/oppo/reno13-pro-5g-black.webp",
          "img": "img/phones/oppo/reno13-pro-5g-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "MediaTek Dimensity 8350",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Reno13 Pro 5G"
        ],
        [
          "Hãng sản xuất",
          "OPPO"
        ],
        [
          "Vi xử lý (CPU)",
          "MediaTek Dimensity 8350"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "RENO13-PRO-5G",
      "image": "img/phones/oppo/reno13-pro-5g-purple.webp",
      "img": "img/phones/oppo/reno13-pro-5g-purple.webp"
    },
    "reno13-5g": {
      "id": "reno13-5g",
      "name": "Reno13 5G",
      "brand": "OPPO",
      "category": "dien-thoai",
      "badge": "OPPO · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Reno13 5G chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 11990000,
      "oldPrice": 12949200,
      "colors": [
        {
          "name": "Tím Hồ Điệp",
          "hex": "#A793D1",
          "key": "purple",
          "image": "img/phones/oppo/reno13-5g-purple.webp",
          "img": "img/phones/oppo/reno13-5g-purple.webp"
        },
        {
          "name": "Xanh Thiên Hà",
          "hex": "#4F769F",
          "key": "blue",
          "image": "img/phones/oppo/reno13-5g-blue.webp",
          "img": "img/phones/oppo/reno13-5g-blue.webp"
        },
        {
          "name": "Đen Bóng Đêm",
          "hex": "#242527",
          "key": "black",
          "image": "img/phones/oppo/reno13-5g-black.webp",
          "img": "img/phones/oppo/reno13-5g-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "MediaTek Dimensity 8350",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Reno13 5G"
        ],
        [
          "Hãng sản xuất",
          "OPPO"
        ],
        [
          "Vi xử lý (CPU)",
          "MediaTek Dimensity 8350"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "RENO13-5G",
      "image": "img/phones/oppo/reno13-5g-purple.webp",
      "img": "img/phones/oppo/reno13-5g-purple.webp"
    },
    "redmi-k80-pro": {
      "id": "redmi-k80-pro",
      "name": "Redmi K80 Pro",
      "brand": "Redmi",
      "category": "dien-thoai",
      "badge": "Redmi · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Redmi K80 Pro chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 14990000,
      "oldPrice": 16189200,
      "colors": [
        {
          "name": "Trắng Tuyết Thạch",
          "hex": "#F5F6F8",
          "key": "white",
          "image": "img/phones/redmi/redmi-k80-pro-white.webp",
          "img": "img/phones/redmi/redmi-k80-pro-white.webp"
        },
        {
          "name": "Xanh Núi Rừng",
          "hex": "#4E6352",
          "key": "green",
          "image": "img/phones/redmi/redmi-k80-pro-green.webp",
          "img": "img/phones/redmi/redmi-k80-pro-green.webp"
        },
        {
          "name": "Đen Bóng Tối",
          "hex": "#222325",
          "key": "black",
          "image": "img/phones/redmi/redmi-k80-pro-black.webp",
          "img": "img/phones/redmi/redmi-k80-pro-black.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "256GB",
          "delta": 2500000,
          "discount": "-6%"
        },
        {
          "label": "512GB",
          "delta": 5500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Redmi K80 Pro"
        ],
        [
          "Hãng sản xuất",
          "Redmi"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "REDMI-K80-PRO",
      "image": "img/phones/redmi/redmi-k80-pro-white.webp",
      "img": "img/phones/redmi/redmi-k80-pro-white.webp"
    },
    "redmi-k80": {
      "id": "redmi-k80",
      "name": "Redmi K80",
      "brand": "Redmi",
      "category": "dien-thoai",
      "badge": "Redmi · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Redmi K80 chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 10990000,
      "oldPrice": 11869200,
      "colors": [
        {
          "name": "Trắng Tuyết Thạch",
          "hex": "#F5F6F8",
          "key": "white",
          "image": "img/phones/redmi/redmi-k80-white.webp",
          "img": "img/phones/redmi/redmi-k80-white.webp"
        },
        {
          "name": "Xanh Núi Rừng",
          "hex": "#4E6352",
          "key": "green",
          "image": "img/phones/redmi/redmi-k80-green.webp",
          "img": "img/phones/redmi/redmi-k80-green.webp"
        },
        {
          "name": "Đen Bóng Tối",
          "hex": "#222325",
          "key": "black",
          "image": "img/phones/redmi/redmi-k80-black.webp",
          "img": "img/phones/redmi/redmi-k80-black.webp"
        },
        {
          "name": "Xanh Bình Minh",
          "hex": "#6A8EAE",
          "key": "blue",
          "image": "img/phones/redmi/redmi-k80-blue.webp",
          "img": "img/phones/redmi/redmi-k80-blue.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "Snapdragon 8 Elite (3nm)",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Redmi K80"
        ],
        [
          "Hãng sản xuất",
          "Redmi"
        ],
        [
          "Vi xử lý (CPU)",
          "Snapdragon 8 Elite (3nm)"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "REDMI-K80",
      "image": "img/phones/redmi/redmi-k80-white.webp",
      "img": "img/phones/redmi/redmi-k80-white.webp"
    },
    "redmi-note-14": {
      "id": "redmi-note-14",
      "name": "Redmi Note 14",
      "brand": "Redmi",
      "category": "dien-thoai",
      "badge": "Redmi · Flagship",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Tuyệt phẩm Redmi Note 14 chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
      "basePrice": 4990000,
      "oldPrice": 5389200,
      "colors": [
        {
          "name": "Trắng Trời Sao",
          "hex": "#F5F6F8",
          "key": "white",
          "image": "img/phones/redmi/redmi-note-14-white.webp",
          "img": "img/phones/redmi/redmi-note-14-white.webp"
        },
        {
          "name": "Đen Bóng Đêm",
          "hex": "#232426",
          "key": "black",
          "image": "img/phones/redmi/redmi-note-14-black.webp",
          "img": "img/phones/redmi/redmi-note-14-black.webp"
        },
        {
          "name": "Xanh Ảo Ảnh",
          "hex": "#486E95",
          "key": "blue",
          "image": "img/phones/redmi/redmi-note-14-blue.webp",
          "img": "img/phones/redmi/redmi-note-14-blue.webp"
        }
      ],
      "extraImages": [],
      "variantLabel": "Dung lượng lưu trữ",
      "variants": [
        {
          "label": "128GB",
          "delta": 0,
          "discount": "-10%"
        },
        {
          "label": "256GB",
          "delta": 2000000,
          "discount": "-8%"
        },
        {
          "label": "512GB",
          "delta": 4500000,
          "discount": "-6%"
        }
      ],
      "perks": [
        "Thu cũ đổi mới trợ giá lên tới 4.000.000₫",
        "Tặng củ sạc nhanh cao cấp chính hãng kèm máy",
        "Bảo hành 24 tháng chính hãng tại VLU Store",
        "Giao nhanh nội thành trong 2 giờ"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình",
          "value": "OLED 120Hz ProMotion",
          "bullets": [
            "Tấm nền siêu nét, độ sáng cực đại 3000 nits",
            "Kính cường lực Ceramic / Gorilla Glass cao cấp",
            "Viền màn hình siêu mỏng đối xứng"
          ]
        },
        {
          "icon": "cpu",
          "title": "Vi xử lý",
          "value": "MediaTek Dimensity 7300-Ultra",
          "bullets": [
            "Kiến trúc thế hệ mới tốc độ xử lý đỉnh cao",
            "Nhân AI NPU hỗ trợ tác vụ thông minh mượt mà",
            "Tản nhiệt buồng hơi hiệu quả tối ưu"
          ]
        },
        {
          "icon": "camera",
          "title": "Camera",
          "value": "Hệ Thống Camera Flagship",
          "bullets": [
            "Cảm biến lớn chụp đêm vượt trội",
            "Quay phim 4K HDR chống rung quang học OIS",
            "Ống kính chân dung xóa phông tự nhiên"
          ]
        },
        {
          "icon": "battery",
          "title": "Pin & Sạc",
          "value": "Pin Trâu & Sạc Siêu Tốc",
          "bullets": [
            "Thời lượng pin kéo dài thoải mái cả ngày",
            "Sạc nhanh cực tốc, hỗ trợ sạc không dây",
            "Thuật toán bảo vệ tuổi thọ pin thông minh"
          ]
        }
      ],
      "specs": [
        [
          "Tên máy",
          "Redmi Note 14"
        ],
        [
          "Hãng sản xuất",
          "Redmi"
        ],
        [
          "Vi xử lý (CPU)",
          "MediaTek Dimensity 7300-Ultra"
        ],
        [
          "Hệ điều hành",
          "Android (HyperOS / ColorOS / One UI)"
        ],
        [
          "Bảo hành",
          "24 tháng chính hãng toàn quốc"
        ],
        [
          "Tình trạng",
          "Mới 100% nguyên seal hộp"
        ]
      ],
      "sku": "REDMI-NOTE-14",
      "image": "img/phones/redmi/redmi-note-14-white.webp",
      "img": "img/phones/redmi/redmi-note-14-white.webp"
    },
    "apple-watch-ultra-3": {
      "id": "apple-watch-ultra-3",
      "name": "Apple Watch Ultra 3 (Titan Đen)",
      "brand": "Apple",
      "category": "dong-ho-dien-tu",
      "badge": "Apple · Thám Hiểm",
      "badgeSub": "Chính Hãng VN/A",
      "tagline": "Chiếc đồng hồ thể thao chuyên nghiệp đỉnh cao với vỏ Titanium đen satin và định vị GPS kép.",
      "basePrice": 21990000,
      "oldPrice": 23990000,
      "colors": [
        {
          "name": "Titan Tự Nhiên",
          "key": "natural",
          "hex": "#98928B",
          "image": "frontend/assets/images/placeholders/watch.svg",
          "img": "frontend/assets/images/placeholders/watch.svg"
        },
        {
          "name": "Titan Đen Satin",
          "key": "black",
          "hex": "#262729",
          "image": "frontend/assets/images/placeholders/watch.svg",
          "img": "frontend/assets/images/placeholders/watch.svg"
        }
      ],
      "extraImages": [],
      "variantLabel": "Kích cỡ & Dây đeo",
      "variants": [
        {
          "label": "Dây Vải Trail Loop (S/M)",
          "delta": 0,
          "discount": "-8%"
        },
        {
          "label": "Dây Cao Su Ocean Band",
          "delta": 500000,
          "discount": "-6%"
        },
        {
          "label": "Dây Thép Milanese Titan",
          "delta": 2500000,
          "discount": "-5%"
        }
      ],
      "perks": [
        "Tặng dán cường lực sapphire cao cấp",
        "Bảo hành chính hãng 12 tháng toàn quốc"
      ],
      "highlights": [
        {
          "icon": "screen",
          "title": "Màn hình OLED 3000 nits",
          "value": "Sáng Rõ Dưới Nắng",
          "bullets": [
            "Mặt kính Sapphire chống xước tuyệt đối",
            "Màn hình Always-On rộng nhất"
          ]
        }
      ],
      "specs": [
        [
          "Kích thước vỏ",
          "49mm Titanium"
        ],
        [
          "Màn hình",
          "Always-On Retina OLED, 3000 nits"
        ],
        [
          "Độ lặn sâu",
          "100m, chứng nhận EN13319"
        ],
        [
          "Kết nối",
          "LTE 4G + GPS kép tần số L1/L5"
        ]
      ],
      "sku": "AW-ULTRA-3",
      "image": "frontend/assets/images/placeholders/watch.svg",
      "img": "frontend/assets/images/placeholders/watch.svg"
    }
  };

  var CATALOG_SPEC = [
    { category: 'dien-thoai', brand: 'Apple', names: ['iPhone 18 Pro Max', 'iPhone 18 Pro', 'iPhone Fold', 'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17 Air', 'iPhone 17', 'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16'] },
    { category: 'dien-thoai', brand: 'Samsung', names: ['Samsung Galaxy Z Fold7', 'Samsung Galaxy Z Flip7', 'Samsung Galaxy S26 Ultra', 'Samsung Galaxy S26+', 'Samsung Galaxy S26', 'Samsung Galaxy S25 Ultra', 'Samsung Galaxy S25+', 'Samsung Galaxy S25', 'Samsung Galaxy S25 FE', 'Samsung Galaxy A56 5G', 'Samsung Galaxy A36 5G', 'Samsung Galaxy A16 5G'] },
    { category: 'dien-thoai', brand: 'Xiaomi', names: ['Xiaomi 15 Ultra', 'Xiaomi 15 Pro', 'Xiaomi 15', 'Xiaomi MIX Fold 4', 'Xiaomi MIX Flip', 'Redmi Note 14 Pro+ 5G', 'Redmi Note 14 Pro 5G', 'Redmi Note 14', 'Redmi K80 Pro', 'Redmi K80', 'POCO F7 Ultra', 'POCO F7 Pro'] },
    { category: 'dien-thoai', brand: 'OPPO', names: ['OPPO Find X8 Ultra', 'OPPO Find X8 Pro', 'OPPO Find X8', 'OPPO Find N4', 'OPPO Find N4 Flip', 'OPPO Reno13 Pro 5G', 'OPPO Reno13 5G', 'OPPO A5 Pro', 'OPPO A3'] },
    { category: 'dien-thoai', brand: 'vivo', names: ['vivo X200 Ultra', 'vivo X200 Pro', 'vivo X200', 'vivo X Fold4', 'vivo X Fold3 Pro', 'vivo V50 Pro', 'vivo V50', 'vivo V40'] },
    { category: 'laptop', brand: 'Apple', names: ['MacBook Air M5', 'MacBook Pro 14 M5', 'MacBook Pro 16 M5 Pro', 'MacBook Pro 16 M5 Max'] },
    { category: 'laptop', brand: 'ASUS', names: ['ASUS Vivobook S 15', 'ASUS Zenbook S 14', 'ASUS ROG Zephyrus G14', 'ASUS ROG Zephyrus G16', 'ASUS ROG Strix G16', 'ASUS ROG Strix Scar 16', 'ASUS ProArt P16', 'ASUS ProArt PX13'] },
    { category: 'laptop', brand: 'Lenovo', names: ['Lenovo IdeaPad Slim 5', 'Lenovo Legion Pro 7i', 'Lenovo Legion 7i', 'Lenovo Yoga Pro 9i'] },
    { category: 'laptop', brand: 'HP', names: ['HP OmniBook 7', 'HP ZBook Studio G11'] },
    { category: 'laptop', brand: 'Acer', names: ['Acer Swift Go 14', 'Acer Predator Helios Neo 16'] },
    { category: 'laptop', brand: 'MSI', names: ['MSI Vector 16 HX', 'MSI Creator Z16'] },
    { category: 'laptop', brand: 'Dell', names: ['Dell XPS 14'] },
    { category: 'ipad', brand: 'Apple', names: ['iPad Pro M5', 'iPad Air M4', 'iPad Gen 11 A16', 'iPad mini 7 A17 Pro'] },
    { category: 'ipad', brand: 'Samsung', names: ['Samsung Galaxy Tab S11 Ultra', 'Samsung Galaxy Tab S11', 'Samsung Galaxy Tab S10 FE+'] },
    { category: 'ipad', brand: 'Xiaomi', names: ['Xiaomi Pad 9 Pro Max', 'Xiaomi Pad 9 Pro', 'Xiaomi Pad 8 Pro'] },
    { category: 'tai-nghe', brand: 'Apple', names: ['AirPods Pro 3', 'AirPods Max 2', 'AirPods 4 ANC', 'AirPods 4'] },
    { category: 'tai-nghe', brand: 'Samsung', names: ['Samsung Galaxy Buds4 Pro', 'Samsung Galaxy Buds4', 'Samsung Galaxy Buds3 FE'] },
    { category: 'tai-nghe', brand: 'JBL', names: ['JBL Tour Pro 3', 'JBL Live Beam 3', 'JBL Live Buds 3'] },
    { category: 'loa', brand: 'JBL', names: ['JBL Go 5', 'JBL Flip 7', 'JBL Charge 6', 'JBL Xtreme 5', 'JBL Boombox 4', 'JBL PartyBox Encore Essential 2'] },
    { category: 'loa', brand: 'Marshall', names: ['Marshall Emberton III', 'Marshall Willen II', 'Marshall Kilburn III', 'Marshall Acton III', 'Marshall Stanmore III'] },
    { category: 'loa', brand: 'Soundcore', names: ['Soundcore Boom 2', 'Soundcore Boom 3i', 'Soundcore Motion X600'] },
    { category: 'dong-ho-dien-tu', brand: 'Apple', names: ['Apple Watch Ultra 3', 'Apple Watch Series 11', 'Apple Watch SE 3'] },
    { category: 'dong-ho-dien-tu', brand: 'Samsung', names: ['Samsung Galaxy Watch Ultra 2', 'Samsung Galaxy Watch 9 Classic', 'Samsung Galaxy Watch 9'] }
  ];

  var LEGACY_CATALOG = CATALOG;
  var PRODUCT_ID_ALIASES = {};
  var categoryImages = {
    'dien-thoai': 'phone.svg',
    laptop: 'laptop.svg',
    ipad: 'ipad.svg',
    'tai-nghe': 'headphones.svg',
    loa: 'speaker.svg',
    'dong-ho-dien-tu': 'watch.svg'
  };
  var categoryNames = {
    'dien-thoai': 'Điện thoại',
    laptop: 'Laptop',
    ipad: 'iPad',
    'tai-nghe': 'Tai nghe',
    loa: 'Loa',
    'dong-ho-dien-tu': 'Đồng hồ điện tử'
  };
  var menuGroupByName = {
    'MacBook Air M5': 'MacBook',
    'MacBook Pro 14 M5': 'MacBook',
    'MacBook Pro 16 M5 Pro': 'MacBook',
    'MacBook Pro 16 M5 Max': 'MacBook',
    'ASUS Vivobook S 15': 'Hoc-Tap-Van-Phong',
    'ASUS Zenbook S 14': 'Hoc-Tap-Van-Phong',
    'ASUS ROG Zephyrus G14': 'Gaming',
    'ASUS ROG Zephyrus G16': 'Gaming',
    'ASUS ROG Strix G16': 'Gaming',
    'ASUS ROG Strix Scar 16': 'Gaming',
    'ASUS ProArt P16': 'Do-Hoa-Sang-Tao',
    'ASUS ProArt PX13': 'Do-Hoa-Sang-Tao',
    'Lenovo IdeaPad Slim 5': 'Hoc-Tap-Van-Phong',
    'Lenovo Legion Pro 7i': 'Gaming',
    'Lenovo Legion 7i': 'Gaming',
    'Lenovo Yoga Pro 9i': 'Do-Hoa-Sang-Tao',
    'HP OmniBook 7': 'Hoc-Tap-Van-Phong',
    'HP ZBook Studio G11': 'Do-Hoa-Sang-Tao',
    'Acer Swift Go 14': 'Hoc-Tap-Van-Phong',
    'Acer Predator Helios Neo 16': 'Gaming',
    'MSI Vector 16 HX': 'Gaming',
    'MSI Creator Z16': 'Do-Hoa-Sang-Tao',
    'Dell XPS 14': 'Do-Hoa-Sang-Tao',
    'Soundcore Boom 2': 'Anker-Soundcore',
    'Soundcore Boom 3i': 'Anker-Soundcore',
    'Soundcore Motion X600': 'Anker-Soundcore',
    'Apple Watch Ultra 3': 'Apple-Watch',
    'Apple Watch Series 11': 'Apple-Watch',
    'Apple Watch SE 3': 'Apple-Watch',
    'Samsung Galaxy Watch Ultra 2': 'Samsung-Galaxy-Watch',
    'Samsung Galaxy Watch 9 Classic': 'Samsung-Galaxy-Watch',
    'Samsung Galaxy Watch 9': 'Samsung-Galaxy-Watch'
  };

  function removeVietnameseAccents(str) {
    if (!str) return '';
    try {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd');
    } catch (e) {
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
      return res;
    }
  }

  function productSlug(value) {
    if (!value) return '';
    var clean = removeVietnameseAccents(String(value));
    return clean.toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function comparableName(value) {
    return value.toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, '');
  }

  function findLegacyProduct(name, brand) {
    var matchNames = [name];
    if (brand === 'Samsung') matchNames.push(name.replace(/^Samsung\s+/i, ''));
    if (brand === 'OPPO') matchNames.push(name.replace(/^OPPO\s+/i, ''));
    for (var i = 0; i < matchNames.length; i++) {
      var expected = comparableName(matchNames[i]);
      for (var key in LEGACY_CATALOG) {
        var oldName = comparableName(LEGACY_CATALOG[key].name || '');
        if (oldName === expected) {
          return LEGACY_CATALOG[key];
        }
      }
    }
    return null;
  }

    // Bản đồ hình ảnh thực tế 115 sản phẩm từ thư mục SanPham/
  var PRODUCT_REAL_IMAGES = {"iphone-18-pro-max":{"image":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png","img":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Den.png","img":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Den.png"},{"name":"Đỏ","hex":"#991B1B","key":"do","image":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Do.png","img":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Do.png"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Xam.png","img":"SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Xam.png"}]},"iphone-18-pro":{"image":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Bac.jpg","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Bac.jpg","img":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Bac.jpg"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Max-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Max-Den.jpg"},{"name":"Đỏ","hex":"#991B1B","key":"do","image":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Max-Do.jpg","img":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Max-Do.jpg"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Max-Xam.jpg","img":"SanPham/DienThoai/Apple/iPhone-18-Pro/iPhone-18-Pro-Max-Xam.jpg"}]},"iphone-fold":{"image":"SanPham/DienThoai/Apple/iPhone-Fold/iPhone-Duo-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-Fold/iPhone-Duo-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-Fold/iPhone-Duo-Den.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-Fold/iPhone-Duo-Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-Fold/iPhone-Duo-Trang.jpg"}]},"iphone-17-pro-max":{"image":"SanPham/DienThoai/Apple/iPhone-17-Pro-Max/iPhone-17-Pro-Max-Cam.png","colors":[{"name":"Cam","hex":"#F97316","key":"cam","image":"SanPham/DienThoai/Apple/iPhone-17-Pro-Max/iPhone-17-Pro-Max-Cam.png","img":"SanPham/DienThoai/Apple/iPhone-17-Pro-Max/iPhone-17-Pro-Max-Cam.png"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-17-Pro-Max/iPhone-17-Pro-Max-Đen.png","img":"SanPham/DienThoai/Apple/iPhone-17-Pro-Max/iPhone-17-Pro-Max-Đen.png"}]},"iphone-17-pro":{"image":"SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Cam.jpg","colors":[{"name":"Cam","hex":"#F97316","key":"cam","image":"SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Cam.jpg","img":"SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Cam.jpg"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Tim.jpg","img":"SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Tim.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-17-Pro/iPhone-17-Pro-Trang.jpg"}]},"iphone-17-air":{"image":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Den.jpg"},{"name":"Kem","hex":"#F0E5D3","key":"kem","image":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Kem.jpg","img":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Kem.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Trang.jpg"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Xanh.jpg","img":"SanPham/DienThoai/Apple/iPhone-17-Air/iPhone-Air-Xanh.jpg"}]},"iphone-17":{"image":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Den.jpg"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Hong.jpg","img":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Hong.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Trang.jpg"},{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Xanh Da Troi.jpg","img":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Xanh Da Troi.jpg"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Xanh La.jpg","img":"SanPham/DienThoai/Apple/iPhone-17/iPhone-17-Xanh La.jpg"}]},"iphone-16-pro-max":{"image":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max--Trang.jpg","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max--Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max--Trang.jpg"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max-Den.jpg"},{"name":"Kem","hex":"#F0E5D3","key":"kem","image":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max-Kem.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max-Kem.jpg"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max-Xam.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro-Max/iPhone-16-Pro-Max-Xam.jpg"}]},"iphone-16-pro":{"image":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Den.jpg"},{"name":"Kem","hex":"#F0E5D3","key":"kem","image":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Kem.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Kem.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Trang.jpg"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Xam.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Pro/iPhone-16-Pro-Xam.jpg"}]},"iphone-16-plus":{"image":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Den.jpg"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Hong.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Hong.jpg"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Tim.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Tim.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Trang.jpg"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Xanh La.jpg","img":"SanPham/DienThoai/Apple/iPhone-16-Plus/iPhone-16-Plus-Xanh La.jpg"}]},"iphone-16":{"image":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Den.jpg","img":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Den.jpg"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Hong.jpg","img":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Hong.jpg"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Tim.jpg","img":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Tim.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Trang.jpg","img":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Trang.jpg"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Xanh La.jpg","img":"SanPham/DienThoai/Apple/iPhone-16/iPhone-16-Xanh La.jpg"}]},"samsung-galaxy-z-fold7":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Den-clean.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Den-clean.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Den-clean.png"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Xam.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Xam.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Xanh.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Xanh.webp"}]},"samsung-galaxy-z-flip7":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Den.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Den.webp"},{"name":"Đỏ","hex":"#B91C1C","key":"do","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Do.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Do.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Xanh Duong.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Xanh Duong.webp"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Xanh La.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Flip7/Galaxy-Z-Flip7-Xanh La.webp"}]},"samsung-galaxy-s26-ultra":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Den-clean.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Den-clean.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Den-clean.png"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Tim.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Tim.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Trang.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Trang.webp"},{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Xanh Da Troi.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Xanh Da Troi.webp"}]},"samsung-galaxy-s26-plus":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Den-clean.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Den-clean.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Den-clean.png"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Tim.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Tim.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Trang.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Trang.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Xanh Duong.jpg","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Xanh Duong.jpg"}]},"samsung-galaxy-s26":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Den-clean.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Den-clean.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Den-clean.png"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Tim.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Tim.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Trang.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Trang.webp"},{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Xanh Da Troi.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Xanh Da Troi.webp"}]},"samsung-galaxy-s25-ultra":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Den-clean.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Den-clean.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Den-clean.png"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Trang.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Trang.webp"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Xam.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Xam.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Xanh.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Xanh.webp"}]},"samsung-galaxy-s25-plus":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xam.webp","colors":[{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xam.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xam.webp"},{"name":"Xanh Đậm","hex":"#1E293B","key":"xanh-dam","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xanh Dam.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xanh Dam.webp"},{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xanh Da Troi.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xanh Da Troi.webp"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xanh La.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Plus/Galaxy-S25-Plus-Xanh La.png"}]},"samsung-galaxy-s25":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Bac.webp","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Bac.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Bac.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Den.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Den.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Xanh.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25/Galaxy-S25-Xanh.webp"}]},"samsung-galaxy-s25-fe":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Den.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Trang.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Trang.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Xanh.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Xanh.webp"},{"name":"Xanh Nhạt","hex":"#93C5FD","key":"xanh-nhat","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Xanh Nhat.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-FE/Galaxy-S25-FE-Xanh Nhat.webp"}]},"samsung-galaxy-a56-5g":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Den.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Den.webp"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Hong.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Hong.webp"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Xam.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Xam.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Xanh.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A56-5G/Galaxy-A56-5G-Xanh.webp"}]},"samsung-galaxy-a36-5g":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Den.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Trang.webp","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Trang.webp"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Vang.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A36-5G/Galaxy-A36-5G-Vang.png"}]},"samsung-galaxy-a16-5g":{"image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Den.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Den.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Den.png"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Vang.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Vang.png"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Xanh.png","img":"SanPham/DienThoai/Samsung/Samsung-Galaxy-A16-5G/Galaxy-A16-5G-Xanh.png"}]},"xiaomi-15-ultra":{"image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-37.webp","colors":[{"name":"Bạc Đen","hex":"#D1D5DB","key":"bac-den","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-37.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-37.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-51.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-51.webp"},{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-57.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Ultra/photo_2025-04-16_11-45-57.webp"}]},"xiaomi-15-pro":{"image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Den.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Trang.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Trang.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Xanh.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15-Pro/Xiaomi-15-Pro-Xanh.webp"}]},"xiaomi-15":{"image":"SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Den.jpg","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Den.jpg"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Tim.jpg","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Tim.jpg"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Xanh.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-15/Xiaomi-15-Xanh.webp"}]},"xiaomi-mix-fold-4":{"image":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4.webp","colors":[{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4_1_.png","img":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4_1_.png"},{"name":"Xám Titan","hex":"#7D7E80","key":"xam-titan","image":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4_2_.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Fold-4/xiaomi-mix-fold-4_2_.webp"}]},"xiaomi-mix-flip":{"image":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Flip/xiaomi_mi_mix_flip.webp","colors":[{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Flip/xiaomi_mi_mix_flip.webp","img":"SanPham/DienThoai/Xiaomi/Xiaomi-MIX-Flip/xiaomi_mi_mix_flip.webp"}]},"redmi-note-14-pro-plus-5g":{"image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-den.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-den.webp"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-Tim.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-Tim.webp"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-Vang.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-5G-Vang.webp"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-Xanh La.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-Plus-5G/Redmi-Note-14-Pro-Plus-Xanh La.webp"}]},"redmi-note-14-pro-5g":{"image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_1_.png","colors":[{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_1_.png","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_1_.png"},{"name":"Xanh Bạc Hà","hex":"#6EE7B7","key":"xanh-bac-ha","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_2_.png","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_2_.png"},{"name":"Xanh Lá Nhạt","hex":"#86EFAC","key":"xanh-la-nhat","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_4_.png","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_4_.png"},{"name":"Xanh Ngọc","hex":"#5EEAD4","key":"xanh-ngoc","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_5_.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14-Pro-5G/xiaomi-redmi-note-14-pro-5g-8gb-256gb_5_.webp"}]},"redmi-note-14":{"image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Den.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Den.webp"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Vang.png","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Vang.png"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Xanh.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-Note-14/Redmi-Note-14-Xanh.webp"}]},"redmi-k80-pro":{"image":"SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Den.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Den.png","img":"SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Den.png"},{"name":"Xanh Đậm","hex":"#1E293B","key":"xanh-dam","image":"SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Xanh dam.png","img":"SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Xanh dam.png"},{"name":"Xanh Nhạt","hex":"#93C5FD","key":"xanh-nhat","image":"SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Xanh nhat.webp","img":"SanPham/DienThoai/Xiaomi/Redmi-K80-Pro/Redmi-K80-Pro-Xanh nhat.webp"}]},"redmi-k80":{"image":"SanPham/DienThoai/Xiaomi/Redmi-K80/dien-thoai-xiaomi-redmi-k80-12gb-256gb-cu-dep.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/Xiaomi/Redmi-K80/dien-thoai-xiaomi-redmi-k80-12gb-256gb-cu-dep.jpg","img":"SanPham/DienThoai/Xiaomi/Redmi-K80/dien-thoai-xiaomi-redmi-k80-12gb-256gb-cu-dep.jpg"}]},"poco-f7-ultra":{"image":"SanPham/DienThoai/Xiaomi/POCO-F7-Ultra/dien-thoai-xiaomi-poco-f7-ultra.webp","colors":[{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/Xiaomi/POCO-F7-Ultra/dien-thoai-xiaomi-poco-f7-ultra.webp","img":"SanPham/DienThoai/Xiaomi/POCO-F7-Ultra/dien-thoai-xiaomi-poco-f7-ultra.webp"}]},"poco-f7-pro":{"image":"SanPham/DienThoai/Xiaomi/POCO-F7-Pro/dien-thoai-xiaomi-poco-f7-pro.webp","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/DienThoai/Xiaomi/POCO-F7-Pro/dien-thoai-xiaomi-poco-f7-pro.webp","img":"SanPham/DienThoai/Xiaomi/POCO-F7-Pro/dien-thoai-xiaomi-poco-f7-pro.webp"}]},"oppo-find-x8-ultra":{"image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Ultra/Find-X8-Ultra-Nau.png","colors":[{"name":"Nâu","hex":"#78350F","key":"nau","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Ultra/Find-X8-Ultra-Nau.png","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Ultra/Find-X8-Ultra-Nau.png"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Ultra/Find-X8-Ultra-Xanh La.png","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Ultra/Find-X8-Ultra-Xanh La.png"}]},"oppo-find-x8-pro":{"image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Hồng.webp","colors":[{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Hồng.webp","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Hồng.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Trắng.png","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Trắng.png"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Xanh.png","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Xanh.png"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Đen.png","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8-Pro/Find-X8-Pro-Đen.png"}]},"oppo-find-x8":{"image":"SanPham/DienThoai/OPPO/OPPO-Find-X8/Find-X8-Xám.webp","colors":[{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8/Find-X8-Xám.webp","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8/Find-X8-Xám.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/OPPO/OPPO-Find-X8/Find-X8-Đen.webp","img":"SanPham/DienThoai/OPPO/OPPO-Find-X8/Find-X8-Đen.webp"}]},"oppo-find-n4":{"image":"SanPham/DienThoai/OPPO/OPPO-Find-N4/Oppo-Find-N#-Vang.webp","colors":[{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/OPPO/OPPO-Find-N4/Oppo-Find-N#-Vang.webp","img":"SanPham/DienThoai/OPPO/OPPO-Find-N4/Oppo-Find-N#-Vang.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/OPPO/OPPO-Find-N4/Oppo-Find-N3-Den.webp","img":"SanPham/DienThoai/OPPO/OPPO-Find-N4/Oppo-Find-N3-Den.webp"}]},"oppo-find-n4-flip":{"image":"SanPham/DienThoai/OPPO/OPPO-Find-N4-Flip/Oppo-Find-N4-Flip-Hong.webp","colors":[{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/DienThoai/OPPO/OPPO-Find-N4-Flip/Oppo-Find-N4-Flip-Hong.webp","img":"SanPham/DienThoai/OPPO/OPPO-Find-N4-Flip/Oppo-Find-N4-Flip-Hong.webp"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DienThoai/OPPO/OPPO-Find-N4-Flip/Oppo-Find-N4-Flip-Vang.png","img":"SanPham/DienThoai/OPPO/OPPO-Find-N4-Flip/Oppo-Find-N4-Flip-Vang.png"}]},"oppo-reno13-pro-5g":{"image":"SanPham/DienThoai/OPPO/OPPO-Reno13-Pro-5G/Reno13-Pro-5G-Trắng.webp","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/OPPO/OPPO-Reno13-Pro-5G/Reno13-Pro-5G-Trắng.webp","img":"SanPham/DienThoai/OPPO/OPPO-Reno13-Pro-5G/Reno13-Pro-5G-Trắng.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/OPPO/OPPO-Reno13-Pro-5G/Reno13-Pro-5G-Đen.webp","img":"SanPham/DienThoai/OPPO/OPPO-Reno13-Pro-5G/Reno13-Pro-5G-Đen.webp"}]},"oppo-reno13-5g":{"image":"SanPham/DienThoai/OPPO/OPPO-Reno13-5G/Reno13-5G-Tím.webp","colors":[{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/OPPO/OPPO-Reno13-5G/Reno13-5G-Tím.webp","img":"SanPham/DienThoai/OPPO/OPPO-Reno13-5G/Reno13-5G-Tím.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/OPPO/OPPO-Reno13-5G/Reno13-5G-Đen.webp","img":"SanPham/DienThoai/OPPO/OPPO-Reno13-5G/Reno13-5G-Đen.webp"}]},"oppo-a5-pro":{"image":"SanPham/DienThoai/OPPO/OPPO-A5-Pro/Oppo-A5-Pro-Den.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/OPPO/OPPO-A5-Pro/Oppo-A5-Pro-Den.png","img":"SanPham/DienThoai/OPPO/OPPO-A5-Pro/Oppo-A5-Pro-Den.png"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/OPPO/OPPO-A5-Pro/Oppo-A5-Pro-Trang.webp","img":"SanPham/DienThoai/OPPO/OPPO-A5-Pro/Oppo-A5-Pro-Trang.webp"}]},"oppo-a3":{"image":"SanPham/DienThoai/OPPO/OPPO-A3/Oppo-A3-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/OPPO/OPPO-A3/Oppo-A3-Den.webp","img":"SanPham/DienThoai/OPPO/OPPO-A3/Oppo-A3-Den.webp"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/DienThoai/OPPO/OPPO-A3/Oppo-A3-Tim.webp","img":"SanPham/DienThoai/OPPO/OPPO-A3/Oppo-A3-Tim.webp"}]},"vivo-x200-ultra":{"image":"SanPham/DienThoai/vivo/vivo-X200-Ultra/dien-thoai-vivo-x200-ultra.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/vivo/vivo-X200-Ultra/dien-thoai-vivo-x200-ultra.webp","img":"SanPham/DienThoai/vivo/vivo-X200-Ultra/dien-thoai-vivo-x200-ultra.webp"}]},"vivo-x200-pro":{"image":"SanPham/DienThoai/vivo/vivo-X200-Pro/dien-thoai-vivo-x200-pro-mini-5g-16gb-512gb-cu-xuoc-can_1.webp","colors":[{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/vivo/vivo-X200-Pro/dien-thoai-vivo-x200-pro-mini-5g-16gb-512gb-cu-xuoc-can_1.webp","img":"SanPham/DienThoai/vivo/vivo-X200-Pro/dien-thoai-vivo-x200-pro-mini-5g-16gb-512gb-cu-xuoc-can_1.webp"}]},"vivo-x200":{"image":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-den.webp","img":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-Trang.webp","img":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-Trang.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-Xanh Duong.webp","img":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-Xanh Duong.webp"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-Xanh Lam.webp","img":"SanPham/DienThoai/vivo/vivo-X200/vivo-X200-Xanh Lam.webp"}]},"vivo-x-fold4":{"image":"SanPham/DienThoai/vivo/vivo-X-Fold4/vivo-X-Fold4.webp","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/vivo/vivo-X-Fold4/vivo-X-Fold4.webp","img":"SanPham/DienThoai/vivo/vivo-X-Fold4/vivo-X-Fold4.webp"}]},"vivo-x-fold3-pro":{"image":"SanPham/DienThoai/vivo/vivo-X-Fold3-Pro/vivo-X-Fold3-Pro-Den.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/vivo/vivo-X-Fold3-Pro/vivo-X-Fold3-Pro-Den.png","img":"SanPham/DienThoai/vivo/vivo-X-Fold3-Pro/vivo-X-Fold3-Pro-Den.png"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/vivo/vivo-X-Fold3-Pro/vivo-X-Fold3-Pro-Trang.png","img":"SanPham/DienThoai/vivo/vivo-X-Fold3-Pro/vivo-X-Fold3-Pro-Trang.png"}]},"vivo-v50-pro":{"image":"SanPham/DienThoai/vivo/vivo-V50-Pro/vivo-V50-Pro-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/vivo/vivo-V50-Pro/vivo-V50-Pro-Den.webp","img":"SanPham/DienThoai/vivo/vivo-V50-Pro/vivo-V50-Pro-Den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/vivo/vivo-V50-Pro/vivo-V50-Pro-Trang.webp","img":"SanPham/DienThoai/vivo/vivo-V50-Pro/vivo-V50-Pro-Trang.webp"}]},"vivo-v50":{"image":"SanPham/DienThoai/vivo/vivo-V50/vivo-v50.jpg","colors":[{"name":"Đỏ Đô","hex":"#991B1B","key":"do-do","image":"SanPham/DienThoai/vivo/vivo-V50/vivo-v50.jpg","img":"SanPham/DienThoai/vivo/vivo-V50/vivo-v50.jpg"}]},"vivo-v40":{"image":"SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Den.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Den.png","img":"SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Den.png"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Trang.webp","img":"SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Trang.webp"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Xam.webp","img":"SanPham/DienThoai/vivo/vivo-V40/vivo-V40-Xam.webp"}]},"macbook-air-m5":{"image":"SanPham/Laptop/MacBook/MacBook-Air-M5/01_6_4.png","colors":[{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/Laptop/MacBook/MacBook-Air-M5/01_6_4.png","img":"SanPham/Laptop/MacBook/MacBook-Air-M5/01_6_4.png"},{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/MacBook/MacBook-Air-M5/02_2_.png","img":"SanPham/Laptop/MacBook/MacBook-Air-M5/02_2_.png"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Laptop/MacBook/MacBook-Air-M5/ma883f_1.jpg","img":"SanPham/Laptop/MacBook/MacBook-Air-M5/ma883f_1.jpg"},{"name":"Đêm Xanh Thẫm","hex":"#1E293B","key":"dem-xanh-tham","image":"SanPham/Laptop/MacBook/MacBook-Air-M5/macboo_4.jpg","img":"SanPham/Laptop/MacBook/MacBook-Air-M5/macboo_4.jpg"}]},"macbook-pro-14-m5":{"image":"SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_2__11_1.png","colors":[{"name":"Đen Không Gian","hex":"#1F2024","key":"den-khong-gian","image":"SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_2__11_1.png","img":"SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_2__11_1.png"},{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_3__9_1.png","img":"SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_3__9_1.png"},{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_8__10_3_1.png","img":"SanPham/Laptop/MacBook/MacBook-Pro-14-M5/text_ng_n_8__10_3_1.png"}]},"macbook-pro-16-m5-pro":{"image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/02_1__1.png","colors":[{"name":"Đen Không Gian","hex":"#1F2024","key":"den-khong-gian","image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/02_1__1.png","img":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/02_1__1.png"},{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/ma2d5a_1_1.jpg","img":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/ma2d5a_1_1.jpg"},{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/_en_5_14_1_1_1_1.webp","img":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Pro/_en_5_14_1_1_1_1.webp"}]},"macbook-pro-16-m5-max":{"image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macbook-pro-16-m5-max.png","colors":[{"name":"Đen Không Gian","hex":"#1F2024","key":"den-khong-gian","image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macbook-pro-16-m5-max.png","img":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macbook-pro-16-m5-max.png"},{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/ma745f_1.webp","img":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/ma745f_1.webp"},{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macboo_2_17.webp","img":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macboo_2_17.webp"},{"name":"Titan Tự Nhiên","hex":"#C5B9A5","key":"titan-tu-nhien","image":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/text_ng_n_1__12_4_1_1_1_1.webp","img":"SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/text_ng_n_1__12_4_1_1_1_1.webp"}]},"asus-vivobook-s-15":{"image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_10__4_17_1_1_1_1.png","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_10__4_17_1_1_1_1.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_10__4_17_1_1_1_1.png"},{"name":"Bạc Sáng","hex":"#EDEFF2","key":"bac-sang","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_11__5_29_1_1_1_1.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_11__5_29_1_1_1_1.png"},{"name":"Bạc Nhám","hex":"#D6D8DE","key":"bac-nham","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_12__5_28_1_1_1_1.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_12__5_28_1_1_1_1.png"},{"name":"Xám Bạc","hex":"#C4C8D0","key":"xam-bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_13__6_24_1_1_1_1.webp","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_13__6_24_1_1_1_1.webp"},{"name":"Bạc Ánh Kim","hex":"#DFE2E8","key":"bac-anh-kim","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_15__7_26_1_1_1_1.webp","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_15__7_26_1_1_1_1.webp"},{"name":"Bạc Titan","hex":"#CED2D9","key":"bac-titan","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_16__5_24_1_1_1_1.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_16__5_24_1_1_1_1.png"},{"name":"Xám Nhạt","hex":"#B8BDC6","key":"xam-nhat","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_17__7_4_1_1_1_1.webp","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Vivobook-S-15/text_ng_n_17__7_4_1_1_1_1.webp"}]},"asus-zenbook-s-14":{"image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VONG0A.jpg","colors":[{"name":"Xám Đậm","hex":"#525459","key":"xam-dam","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VONG0A.jpg","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VONG0A.jpg"},{"name":"Đen Nhám","hex":"#2A2C30","key":"den-nham","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VOWL99.jpg","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VOWL99.jpg"},{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VOZ92D.jpg","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VOZ92D.jpg"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VP2J5C.jpg","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPD25080406VP2J5C.jpg"},{"name":"Xám Than","hex":"#464950","key":"xam-than","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPS2508040777S7D7.jpg","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPS2508040777S7D7.jpg"},{"name":"Xám Đen","hex":"#36383E","key":"xam-den","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPS2508040777W291.jpg","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/ASUS-Zenbook-S-14/AMRPS2508040777W291.jpg"}]},"asus-rog-zephyrus-g14":{"image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_2_65.webp","colors":[{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_2_65.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_2_65.webp"},{"name":"Xám Đậm","hex":"#5A5D64","key":"xam-dam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_3__35.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_3__35.webp"},{"name":"Xám Bạc","hex":"#94969C","key":"xam-bac","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_4__28.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_4__28.png"},{"name":"Xám Titan","hex":"#6C6F76","key":"xam-titan","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_5__28.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_5__28.png"},{"name":"Xám Khói","hex":"#60636A","key":"xam-khoi","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_6__20.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_6__20.webp"},{"name":"Đen Xám","hex":"#3A3C42","key":"den-xam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_12__10.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_12__10.png"},{"name":"Xám Nhạt","hex":"#878A90","key":"xam-nhat","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_13__13.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G14/x_m_13__13.png"}]},"asus-rog-zephyrus-g16":{"image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027148_453728186523740223_453728186523740223_d8a51a29162bba852cc8d09a6c4a5f63.jpg","colors":[{"name":"Xám Đậm","hex":"#5A5D64","key":"xam-dam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027148_453728186523740223_453728186523740223_d8a51a29162bba852cc8d09a6c4a5f63.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027148_453728186523740223_453728186523740223_d8a51a29162bba852cc8d09a6c4a5f63.jpg"},{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027186_453728186523740223_453728186523740223_594e6476b762622e04d8cec4f26ffe93.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027186_453728186523740223_453728186523740223_594e6476b762622e04d8cec4f26ffe93.jpg"},{"name":"Xám Titan","hex":"#6C6F76","key":"xam-titan","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027202_453728186523740223_453728186523740223_f8ca1af7892f43c61503cac7a62cec03.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027202_453728186523740223_453728186523740223_f8ca1af7892f43c61503cac7a62cec03.jpg"},{"name":"Xám Khói","hex":"#52555C","key":"xam-khoi","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027217_453728186523740223_453728186523740223_c8240a876cb3ad4167caec3c12db86d1.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027217_453728186523740223_453728186523740223_c8240a876cb3ad4167caec3c12db86d1.jpg"},{"name":"Bạc Xám","hex":"#9EA1A8","key":"bac-xam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027230_453728186523740223_453728186523740223_8528c0c7fc2c13c61d0d26a034dcdb71.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027230_453728186523740223_453728186523740223_8528c0c7fc2c13c61d0d26a034dcdb71.jpg"},{"name":"Xám Nhạt","hex":"#8D9096","key":"xam-nhat","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027243_453728186523740223_453728186523740223_63f859c4c2bd0a9bd7227da084ba5c3b.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027243_453728186523740223_453728186523740223_63f859c4c2bd0a9bd7227da084ba5c3b.jpg"},{"name":"Đen Xám","hex":"#3A3C42","key":"den-xam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027255_453728186523740223_453728186523740223_272900a1837d30c29a1d669bbacea754.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027255_453728186523740223_453728186523740223_272900a1837d30c29a1d669bbacea754.jpg"},{"name":"Xám Ghi","hex":"#74777E","key":"xam-ghi","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027265_453728186523740223_453728186523740223_0c4a5f29fbc281653398b5a34a9202d4.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027265_453728186523740223_453728186523740223_0c4a5f29fbc281653398b5a34a9202d4.jpg"},{"name":"Xám Bạc","hex":"#A5A8AE","key":"xam-bac","image":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027276_453728186523740223_453728186523740223_7a29ee6870d777f828ffc08b9b989ac7.jpg","img":"SanPham/Laptop/Gaming/ASUS-ROG-Zephyrus-G16/1793773027276_453728186523740223_453728186523740223_7a29ee6870d777f828ffc08b9b989ac7.jpg"}]},"asus-rog-strix-g16":{"image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_3__28.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_3__28.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_3__28.webp"},{"name":"Xám Đậm","hex":"#4B4E56","key":"xam-dam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_5__18.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_5__18.webp"},{"name":"Đen Nhám","hex":"#282A30","key":"den-nham","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_6__17.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_6__17.webp"},{"name":"Xám Titan","hex":"#5F626A","key":"xam-titan","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_7__19.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_7__19.webp"},{"name":"Đen Xám","hex":"#34373E","key":"den-xam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_9__7.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_9__7.webp"},{"name":"Đen Carbon","hex":"#23252A","key":"den-carbon","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_10__3.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_10__3.webp"},{"name":"Đen Ánh Tím","hex":"#362F48","key":"den-anh-tim","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_47.webp","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-G16/sssxs_47.webp"}]},"asus-rog-strix-scar-16":{"image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_1__7_8_1.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_1__7_8_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_1__7_8_1.png"},{"name":"Đen Nhám","hex":"#2A2C32","key":"den-nham","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_4__7_4_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_4__7_4_1.png"},{"name":"Đen Carbon","hex":"#1C1D22","key":"den-carbon","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_5__8_4_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_5__8_4_1.png"},{"name":"Xám Đen","hex":"#34373D","key":"xam-den","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_6__2_168_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_6__2_168_1.png"},{"name":"Đen Than","hex":"#25272D","key":"den-than","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_7__2_156_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_7__2_156_1.png"},{"name":"Xám Không Gian","hex":"#4F5259","key":"xam-khong-gian","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_9__4_169_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_9__4_169_1.png"},{"name":"Xám Titan","hex":"#5C5F66","key":"xam-titan","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_11__5_128_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_11__5_128_1.png"},{"name":"Đen Xám","hex":"#3A3D43","key":"den-xam","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_13__6_116_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_13__6_116_1.png"},{"name":"Đen Tuyền","hex":"#18191D","key":"den-tuyen","image":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_14__6_76_1.png","img":"SanPham/Laptop/Gaming/ASUS-ROG-Strix-Scar-16/text_ng_n_14__6_76_1.png"}]},"asus-proart-p16":{"image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-01_2_10_1.webp","colors":[{"name":"Đen Nano","hex":"#1F2024","key":"den-nano","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-01_2_10_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-01_2_10_1.webp"},{"name":"Đen Nhám","hex":"#27292E","key":"den-nham","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-02_2_12_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-02_2_12_1.webp"},{"name":"Đen Carbon","hex":"#18191D","key":"den-carbon","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-06_2_8_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-06_2_8_1.webp"},{"name":"Xám Đen","hex":"#32353B","key":"xam-den","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-07_2_6_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-07_2_6_1.webp"},{"name":"Đen Tuyền","hex":"#141518","key":"den-tuyen","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-09_56_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-P16/product-09_56_1.webp"}]},"asus-proart-px13":{"image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_1__1_114.png","colors":[{"name":"Đen Nano","hex":"#1F2024","key":"den-nano","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_1__1_114.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_1__1_114.png"},{"name":"Đen Nhám","hex":"#282A30","key":"den-nham","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_2_180.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_2_180.png"},{"name":"Xám Đen","hex":"#34363D","key":"xam-den","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_2__97.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_2__97.png"},{"name":"Đen Carbon","hex":"#1B1C21","key":"den-carbon","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_5__78.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/ASUS-ProArt-PX13/x_m_5__78.png"}]},"lenovo-ideapad-slim-5":{"image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_1__1_147.png","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_1__1_147.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_1__1_147.png"},{"name":"Bạc Sáng","hex":"#EDEFF2","key":"bac-sang","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_2_243.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_2_243.png"},{"name":"Xám Nhạt","hex":"#C5C8CE","key":"xam-nhat","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_2__135.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_2__135.png"},{"name":"Bạc Ánh Kim","hex":"#D8DCE2","key":"bac-anh-kim","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_4__121.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_4__121.png"},{"name":"Xám Bạc","hex":"#B8BCC4","key":"xam-bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_5__109.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_5__109.png"},{"name":"Bạc Ngọc","hex":"#E0E2E7","key":"bac-ngoc","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_6__94.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Lenovo-IdeaPad-Slim-5/x_m_6__94.png"}]},"lenovo-legion-pro-7i":{"image":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OCX896.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OCX896.jpg","img":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OCX896.jpg"},{"name":"Đen Nhám","hex":"#2A2C32","key":"den-nham","image":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OCZ28B.jpg","img":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OCZ28B.jpg"},{"name":"Xám Đen","hex":"#383A41","key":"xam-den","image":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OD6FC1.jpg","img":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OD6FC1.jpg"},{"name":"Đen Carbon","hex":"#23252A","key":"den-carbon","image":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915ODQT76.jpg","img":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915ODQT76.jpg"},{"name":"Đen Tuyền","hex":"#18191D","key":"den-tuyen","image":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OKCO35.jpg","img":"SanPham/Laptop/Gaming/Lenovo-Legion-Pro-7i/VAFJD26102915OKCO35.jpg"}]},"lenovo-legion-7i":{"image":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_4__8_101.png","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_4__8_101.png","img":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_4__8_101.png"},{"name":"Trắng Sáng","hex":"#FAFAFC","key":"trang-sang","image":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_5__10_89.png","img":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_5__10_89.png"},{"name":"Trắng Bạc","hex":"#E3E4E6","key":"trang-bac","image":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_6__5_83.webp","img":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_6__5_83.webp"},{"name":"Trắng Ngọc","hex":"#EFEFF2","key":"trang-ngoc","image":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_7__5_71.png","img":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_7__5_71.png"},{"name":"Trắng Sữa","hex":"#F1F2F5","key":"trang-sua","image":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_9__9_280.png","img":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_9__9_280.png"},{"name":"Bạc Sáng","hex":"#E8EAEE","key":"bac-sang","image":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_11__7_195.webp","img":"SanPham/Laptop/Gaming/Lenovo-Legion-7i/text_ng_n_11__7_195.webp"}]},"lenovo-yoga-pro-9i":{"image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-03_2_38.webp","colors":[{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-03_2_38.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-03_2_38.webp"},{"name":"Xám Đậm","hex":"#5A5D64","key":"xam-dam","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-08_1_22.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-08_1_22.png"},{"name":"Đen Xám","hex":"#3F4248","key":"den-xam","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-09_72.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-09_72.png"},{"name":"Xám Titan","hex":"#6D7077","key":"xam-titan","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-12_43.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-12_43.png"},{"name":"Xám Nhám","hex":"#4D5057","key":"xam-nham","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-15_26.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Lenovo-Yoga-Pro-9i/product-15_26.png"}]},"hp-omnibook-7":{"image":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_1_94.png","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_1_94.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_1_94.png"},{"name":"Bạc Sáng","hex":"#EDEFF2","key":"bac-sang","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_2__71.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_2__71.png"},{"name":"Bạc Nhám","hex":"#D6D9DF","key":"bac-nham","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_3__69.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_3__69.png"},{"name":"Xám Bạc","hex":"#C8CCD4","key":"xam-bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_4__63.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/HP-OmniBook-7/ssss_4__63.png"}]},"hp-zbook-studio-g11":{"image":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_1__1_74_1.webp","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_1__1_74_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_1__1_74_1.webp"},{"name":"Bạc Ánh Kim","hex":"#DCE0E5","key":"bac-anh-kim","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_2_109_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_2_109_1.webp"},{"name":"Bạc Sáng","hex":"#EAECEF","key":"bac-sang","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_3__61_1.webp","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_3__61_1.webp"},{"name":"Xám Bạc","hex":"#C6CAD2","key":"xam-bac","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_4__53_1.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/HP-ZBook-Studio-G11/x_m_4__53_1.png"}]},"acer-swift-go-14":{"image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_2_36.webp","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_2_36.webp","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_2_36.webp"},{"name":"Bạc Sáng","hex":"#EDEFF2","key":"bac-sang","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_3__13.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_3__13.png"},{"name":"Xám Bạc","hex":"#C4C8D0","key":"xam-bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_4__7.webp","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_4__7.webp"},{"name":"Bạc Nhám","hex":"#D6D9DF","key":"bac-nham","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_5__4.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_5__4.png"},{"name":"Bạc Ngọc","hex":"#E0E3E8","key":"bac-ngoc","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_6__2.webp","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_6__2.webp"},{"name":"Xám Nhạt","hex":"#B8BCC4","key":"xam-nhat","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_7__2.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_7__2.png"},{"name":"Bạc Titan","hex":"#CED2D9","key":"bac-titan","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_8__2.webp","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_8__2.webp"},{"name":"Trắng Bạc","hex":"#EAECF0","key":"trang-bac","image":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_9__2.png","img":"SanPham/Laptop/Hoc-Tap-Van-Phong/Acer-Swift-Go-14/x_m_9__2.png"}]},"acer-predator-helios-neo-16":{"image":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_1__10_1.png","colors":[{"name":"Đêm Xanh Thẫm","hex":"#1E293B","key":"dem-xanh-tham","image":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_1__10_1.png","img":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_1__10_1.png"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_4__8_1.webp","img":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_4__8_1.webp"},{"name":"Đen Xám","hex":"#2C303A","key":"den-xam","image":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_5__8_1.webp","img":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_5__8_1.webp"},{"name":"Đen Nhám","hex":"#24262D","key":"den-nham","image":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_6__7_1.png","img":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_6__7_1.png"},{"name":"Xám Đen","hex":"#383C46","key":"xam-den","image":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_9__3_1.png","img":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_9__3_1.png"},{"name":"Đen Tuyền","hex":"#171A21","key":"den-tuyen","image":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_14_1.png","img":"SanPham/Laptop/Gaming/Acer-Predator-Helios-Neo-16/sssxs_14_1.png"}]},"msi-vector-16-hx":{"image":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_15__7_160_1.png","colors":[{"name":"Xám Đậm","hex":"#525459","key":"xam-dam","image":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_15__7_160_1.png","img":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_15__7_160_1.png"},{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_16__6_121_1.png","img":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_16__6_121_1.png"},{"name":"Xám Titan","hex":"#64676E","key":"xam-titan","image":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_17__8_76_1.png","img":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_17__8_76_1.png"},{"name":"Đen Xám","hex":"#3D3F45","key":"den-xam","image":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_18__6_60_1.png","img":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_18__6_60_1.png"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_19__4_62_1.png","img":"SanPham/Laptop/Gaming/MSI-Vector-16-HX/text_ng_n_19__4_62_1.png"}]},"msi-creator-z16":{"image":"SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0000_msi-creator-z16-a11uet-217vn-i7_1_.jpg","colors":[{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0000_msi-creator-z16-a11uet-217vn-i7_1_.jpg","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0000_msi-creator-z16-a11uet-217vn-i7_1_.jpg"},{"name":"Xám Đậm","hex":"#63666D","key":"xam-dam","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0001_msi-creator-z16-a11uet-217vn-i7_2_.jpg","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0001_msi-creator-z16-a11uet-217vn-i7_2_.jpg"},{"name":"Xám Bạc","hex":"#96989E","key":"xam-bac","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0002_msi-creator-z16-a11uet-217vn-i7_3_.jpg","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/MSI-Creator-Z16/_0002_msi-creator-z16-a11uet-217vn-i7_3_.jpg"}]},"dell-xps-14":{"image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_21__4_48.png","colors":[{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_21__4_48.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_21__4_48.png"},{"name":"Xám Đậm","hex":"#5E6066","key":"xam-dam","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_22__4_47.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_22__4_47.png"},{"name":"Xám Khói","hex":"#6C6E74","key":"xam-khoi","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_27__8_11.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_27__8_11.png"},{"name":"Đen Xám","hex":"#4B4E54","key":"den-xam","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_28__8_21.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_28__8_21.png"},{"name":"Bạc Xám","hex":"#9EA1A8","key":"bac-xam","image":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_29__9_20.png","img":"SanPham/Laptop/Do-Hoa-Sang-Tao/Dell-XPS-14/text_ng_n_29__9_20.png"}]},"ipad-pro-m5":{"image":"SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-cutout.png","colors":[{"name":"Đen Không Gian","hex":"#1F2024","key":"den-khong-gian","image":"SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-cutout.png","img":"SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-cutout.png"},{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/iPad/Apple/iPad-Pro-M5/ipad_pro_11-in_m5_cellular_silver_pdp_image_position_2__vn-vi_1.webp","img":"SanPham/iPad/Apple/iPad-Pro-M5/ipad_pro_11-in_m5_cellular_silver_pdp_image_position_2__vn-vi_1.webp"},{"name":"Đen","hex":"#27292E","key":"den","image":"SanPham/iPad/Apple/iPad-Pro-M5/ipad_pro_13-in_m5_wifi_space_black_pdp_image_position_2__vn-vi_1.webp","img":"SanPham/iPad/Apple/iPad-Pro-M5/ipad_pro_13-in_m5_wifi_space_black_pdp_image_position_2__vn-vi_1.webp"},{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/iPad/Apple/iPad-Pro-M5/ipad_pro_13-in_m5_wifi_space_black_pdp_image_position_3__vn-vi.webp","img":"SanPham/iPad/Apple/iPad-Pro-M5/ipad_pro_13-in_m5_wifi_space_black_pdp_image_position_3__vn-vi.webp"}]},"ipad-air-m4":{"image":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Den.jpg","img":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Den.jpg"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Hong.jpg","img":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Hong.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Trang.jpg","img":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-Trang.jpg"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-vang.jpg","img":"SanPham/iPad/Apple/iPad-Air-M4/iPad-Air-M4-vang.jpg"}]},"ipad-gen-11-a16":{"image":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Hong.webp","colors":[{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Hong.webp","img":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Hong.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Trang.webp","img":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Trang.webp"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Vang.webp","img":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Vang.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Xanh.webp","img":"SanPham/iPad/Apple/iPad-Gen-11-A16/iPad-Gen-11-A16-Xanh.webp"}]},"ipad-mini-7-a17-pro":{"image":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Den.jpg","img":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Den.jpg"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Hong.jpg","img":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Hong.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Trang.jpg","img":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Trang.jpg"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Xanh.jpg","img":"SanPham/iPad/Apple/iPad-mini-7-A17-Pro/iPad-mini-7-A17-Pro-Xanh.jpg"}]},"samsung-galaxy-tab-s11-ultra":{"image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11-Ultra/Samsung-Galaxy-Tab-S11-Ultra-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11-Ultra/Samsung-Galaxy-Tab-S11-Ultra-Den.webp","img":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11-Ultra/Samsung-Galaxy-Tab-S11-Ultra-Den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11-Ultra/Samsung-Galaxy-Tab-S11-Ultra-Trang.webp","img":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11-Ultra/Samsung-Galaxy-Tab-S11-Ultra-Trang.webp"}]},"samsung-galaxy-tab-s11":{"image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11/may-tinh-bang-samsung-galaxy-tab-s11_4_1.webp","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11/may-tinh-bang-samsung-galaxy-tab-s11_4_1.webp","img":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11/may-tinh-bang-samsung-galaxy-tab-s11_4_1.webp"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11/may-tinh-bang-samsung-galaxy-tab-s11_5_1.webp","img":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S11/may-tinh-bang-samsung-galaxy-tab-s11_5_1.webp"}]},"samsung-galaxy-tab-s10-fe-plus":{"image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Den.webp","img":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Trang.png","img":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Trang.png"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Xanh.webp","img":"SanPham/iPad/Samsung/Samsung-Galaxy-Tab-S10-FE-Plus/Samsung-Galaxy-Tab-S10-FE-Plus-Xanh.webp"}]},"xiaomi-pad-9-pro-max":{"image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro-Max/may-tinh-bang-xiaomi-pad-9-pro-max.webp","colors":[{"name":"Xám Không Gian","hex":"#7D7E80","key":"xam-khong-gian","image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro-Max/may-tinh-bang-xiaomi-pad-9-pro-max.webp","img":"SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro-Max/may-tinh-bang-xiaomi-pad-9-pro-max.webp"}]},"xiaomi-pad-9-pro":{"image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro/may-tinh-bang-xiaomi-pad-9.webp","colors":[{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro/may-tinh-bang-xiaomi-pad-9.webp","img":"SanPham/iPad/Xiaomi/Xiaomi-Pad-9-Pro/may-tinh-bang-xiaomi-pad-9.webp"}]},"xiaomi-pad-8-pro":{"image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Den.webp","img":"SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Den.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Xanh Duong.webp","img":"SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Xanh Duong.webp"},{"name":"Xanh Lá","hex":"#6EE7B7","key":"xanh-la","image":"SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Xanh La.webp","img":"SanPham/iPad/Xiaomi/Xiaomi-Pad-8-Pro/Xiaomi-Pad-8-Pro-Xanh La.webp"}]},"airpods-pro-3":{"image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods-pro-3-cutout.png","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods-pro-3-cutout.png","img":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods-pro-3-cutout.png"},{"name":"Trắng Bạc","hex":"#E3E4E6","key":"trang-bac","image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_2__vn-vi_1.png","img":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_2__vn-vi_1.png"},{"name":"Trắng Sáng","hex":"#FAFAFC","key":"trang-sang","image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_3__vn-vi_1.png","img":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_3__vn-vi_1.png"},{"name":"Trắng Ngọc","hex":"#EFEFF2","key":"trang-ngoc","image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_4__vn-vi_1.webp","img":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_4__vn-vi_1.webp"},{"name":"Trắng Mây","hex":"#EAECEF","key":"trang-may","image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_5__vn-vi_1.webp","img":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_5__vn-vi_1.webp"},{"name":"Trắng Sữa","hex":"#F1F2F5","key":"trang-sua","image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_7__vn-vi_1.png","img":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_7__vn-vi_1.png"},{"name":"Trắng Tinh","hex":"#F8F9FA","key":"trang-tinh","image":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_8__vn-vi_1.png","img":"SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_8__vn-vi_1.png"}]},"airpods-max-2":{"image":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2.webp","colors":[{"name":"Đêm Xanh Thẫm","hex":"#1E293B","key":"dem-xanh-tham","image":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2.webp","img":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2.webp"},{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2_1_.webp","img":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2_1_.webp"},{"name":"Cam","hex":"#F97316","key":"cam","image":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2_2_.webp","img":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2_2_.webp"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2_3_.webp","img":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2_3_.webp"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2026_1__2.webp","img":"SanPham/TaiNghe/Apple/AirPods-Max-2/tai_nghe_ch_p_tai_ch_ng_n_apple_airpods_max_2026_1__2.webp"}]},"airpods-4-anc":{"image":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-1.webp","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-1.webp","img":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-1.webp"},{"name":"Trắng Bạc","hex":"#E3E4E6","key":"trang-bac","image":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-2.png","img":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-2.png"},{"name":"Trắng Sáng","hex":"#FAFAFC","key":"trang-sang","image":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-3-3.webp","img":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-3-3.webp"},{"name":"Trắng Ngọc","hex":"#EFEFF2","key":"trang-ngoc","image":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-3-4.webp","img":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods-4-3-4.webp"},{"name":"Trắng Mây","hex":"#EAECEF","key":"trang-may","image":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods_4_pdp_image_position_7__vn-vi.jpg","img":"SanPham/TaiNghe/Apple/AirPods-4-ANC/airpods_4_pdp_image_position_7__vn-vi.jpg"}]},"airpods-4":{"image":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-1.webp","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-1.webp","img":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-1.webp"},{"name":"Trắng Bạc","hex":"#E3E4E6","key":"trang-bac","image":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-2.png","img":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-2.png"},{"name":"Trắng Sáng","hex":"#FAFAFC","key":"trang-sang","image":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-3-3.webp","img":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-3-3.webp"},{"name":"Trắng Ngọc","hex":"#EFEFF2","key":"trang-ngoc","image":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-3-4.webp","img":"SanPham/TaiNghe/Apple/AirPods-4/airpods-4-3-4.webp"},{"name":"Trắng Mây","hex":"#EAECEF","key":"trang-may","image":"SanPham/TaiNghe/Apple/AirPods-4/airpods_4_pdp_image_position_7__vn-vi.jpg","img":"SanPham/TaiNghe/Apple/AirPods-4/airpods_4_pdp_image_position_7__vn-vi.jpg"}]},"samsung-galaxy-buds4-pro":{"image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4-Pro/61SXWLsmy-L._AC_SL1500_.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4-Pro/61SXWLsmy-L._AC_SL1500_.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4-Pro/61SXWLsmy-L._AC_SL1500_.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4-Pro/SCOMMRCL-167-Buds4Pro_02_v2.webp","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4-Pro/SCOMMRCL-167-Buds4Pro_02_v2.webp"}]},"samsung-galaxy-buds4":{"image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4/51QEHqsjzPL._AC_SL1500_.jpg","colors":[{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4/51QEHqsjzPL._AC_SL1500_.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4/51QEHqsjzPL._AC_SL1500_.jpg"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4/61kDTK2TgsL._AC_SL1500_.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds4/61kDTK2TgsL._AC_SL1500_.jpg"}]},"samsung-galaxy-buds3-fe":{"image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/51-nqf6rkil.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/51-nqf6rkil.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/51-nqf6rkil.jpg"},{"name":"Đen Nhám","hex":"#2A2C31","key":"den-nham","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_1_detail_ss000_ra_02_1.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_1_detail_ss000_ra_02_1.jpg"},{"name":"Xám Đen","hex":"#383A40","key":"xam-den","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_22_detail_ss000_ra_03_1200x1200.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_22_detail_ss000_ra_03_1200x1200.jpg"},{"name":"Đen Carbon","hex":"#23252A","key":"den-carbon","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_34_title_ss000_ra_01_grande_1.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_34_title_ss000_ra_01_grande_1.jpg"},{"name":"Đen Tuyền","hex":"#17181B","key":"den-tuyen","image":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_989_detail_ss000_ra_07.jpg","img":"SanPham/TaiNghe/Samsung/Samsung-Galaxy-Buds3-FE/_www.spigen.com_989_detail_ss000_ra_07.jpg"}]},"jbl-tour-pro-3":{"image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3-latte.webp","colors":[{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3-latte.webp","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3-latte.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_6__1.webp","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_6__1.webp"},{"name":"Đen Nhám","hex":"#282A2F","key":"den-nham","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_9_.webp","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_9_.webp"},{"name":"Xám Đen","hex":"#37393F","key":"xam-den","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_10_.webp","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_10_.webp"},{"name":"Đen Carbon","hex":"#222429","key":"den-carbon","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_11_.png","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_11_.png"},{"name":"Đen Tuyền","hex":"#16171B","key":"den-tuyen","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_12_.png","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_12_.png"},{"name":"Đen Xám","hex":"#303238","key":"den-xam","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_13_.webp","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_13_.webp"},{"name":"Xám Titan","hex":"#50535A","key":"xam-titan","image":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_14_.png","img":"SanPham/TaiNghe/JBL/JBL-Tour-Pro-3/tai-nghe-bluetooth-jbl-tour-pro-3_14_.png"}]},"jbl-live-beam-3":{"image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/image_-_2024-12-18t203627.288.webp","colors":[{"name":"Bạc","hex":"#E3E4E6","key":"bac","image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/image_-_2024-12-18t203627.288.webp","img":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/image_-_2024-12-18t203627.288.webp"},{"name":"Tím","hex":"#C4B5FD","key":"tim","image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_9__1.png","img":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_9__1.png"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_14__1.png","img":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_14__1.png"},{"name":"Đen Nhám","hex":"#292B30","key":"den-nham","image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_16__1.png","img":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_16__1.png"},{"name":"Xám Đen","hex":"#36383E","key":"xam-den","image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_17__1.png","img":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_17__1.png"},{"name":"Đen Carbon","hex":"#222429","key":"den-carbon","image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_18__1.webp","img":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai-nghe-bluetooth-jbl-live-beam-3-_18__1.webp"},{"name":"Đen Tuyền","hex":"#17181C","key":"den-tuyen","image":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai_nghe_bluetooth_true_wireless_jbl_live_beam_3.webp","img":"SanPham/TaiNghe/JBL/JBL-Live-Beam-3/tai_nghe_bluetooth_true_wireless_jbl_live_beam_3.webp"}]},"jbl-live-buds-3":{"image":"SanPham/TaiNghe/JBL/JBL-Live-Buds-3/tai-nghe-bluetooth-jbl-live-buds-3-0_1.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/TaiNghe/JBL/JBL-Live-Buds-3/tai-nghe-bluetooth-jbl-live-buds-3-0_1.png","img":"SanPham/TaiNghe/JBL/JBL-Live-Buds-3/tai-nghe-bluetooth-jbl-live-buds-3-0_1.png"},{"name":"Xám Đen","hex":"#383B42","key":"xam-den","image":"SanPham/TaiNghe/JBL/JBL-Live-Buds-3/tai_nghe_bluetooth_true_wireless_jbl_live_buds_3.png","img":"SanPham/TaiNghe/JBL/JBL-Live-Buds-3/tai_nghe_bluetooth_true_wireless_jbl_live_buds_3.png"}]},"jbl-go-5":{"image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_3_.webp","colors":[{"name":"Cam","hex":"#F97316","key":"cam","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_3_.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_3_.webp"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_4_.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_4_.webp"},{"name":"Tím Đậm","hex":"#8B5CF6","key":"tim-dam","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_5_.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_5_.webp"},{"name":"Đỏ","hex":"#B91C1C","key":"do","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_6_.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_6_.webp"},{"name":"Xanh Rêu","hex":"#4D5E3C","key":"xanh-reu","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_7_.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_7_.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_9_.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_9_.webp"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_10_.png","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5--_10_.png"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5-_1__1.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5-_1__1.webp"},{"name":"Đêm Xanh Thẫm","hex":"#1E293B","key":"dem-xanh-tham","image":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5-_2__1.webp","img":"SanPham/Loa/JBL/JBL-Go-5/loa-jbl-go-5-_2__1.webp"}]},"jbl-flip-7":{"image":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-cm.webp","colors":[{"name":"Xanh Rêu","hex":"#4D5E3C","key":"xanh-reu","image":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-cm.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-cm.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-den-cam.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-den-cam.webp"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-p.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-p.webp"},{"name":"Tím Đậm","hex":"#8B5CF6","key":"tim-dam","image":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-tim.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-tim.webp"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-vang-cat.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/jbl-flip-7-vang-cat.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_11__1.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_11__1.webp"},{"name":"Đen Nhám","hex":"#2C2E33","key":"den-nham","image":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_23__1.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_23__1.webp"},{"name":"Đỏ","hex":"#B91C1C","key":"do","image":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_35__1.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_35__1.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_47__1.webp","img":"SanPham/Loa/JBL/JBL-Flip-7/loa-bluetooth-jbl-flip-7_47__1.webp"}]},"jbl-charge-6":{"image":"SanPham/Loa/JBL/JBL-Charge-6/bluetooth-jbl-charge-6-den-cam.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/JBL/JBL-Charge-6/bluetooth-jbl-charge-6-den-cam.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/bluetooth-jbl-charge-6-den-cam.webp"},{"name":"Tím Đậm","hex":"#8B5CF6","key":"tim-dam","image":"SanPham/Loa/JBL/JBL-Charge-6/bluetooth-jbl-charge-6-tim.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/bluetooth-jbl-charge-6-tim.webp"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/Loa/JBL/JBL-Charge-6/jbl-charge-6-p.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/jbl-charge-6-p.webp"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/JBL/JBL-Charge-6/jbl-charge-6-vang-cat.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/jbl-charge-6-vang-cat.webp"},{"name":"Xanh Rêu","hex":"#4D5E3C","key":"xanh-reu","image":"SanPham/Loa/JBL/JBL-Charge-6/jbl-charge-6.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/jbl-charge-6.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_2__1.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_2__1.webp"},{"name":"Đỏ","hex":"#B91C1C","key":"do","image":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_16__1.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_16__1.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_27__1.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_27__1.webp"},{"name":"Đen Nhám","hex":"#2C2E33","key":"den-nham","image":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_38__1.webp","img":"SanPham/Loa/JBL/JBL-Charge-6/loa-bluetooth-jbl-charge-6_38__1.webp"}]},"jbl-xtreme-5":{"image":"SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5-den_2__1.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5-den_2__1.webp","img":"SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5-den_2__1.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5_6__1.webp","img":"SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5_6__1.webp"},{"name":"Xanh Rêu","hex":"#4D5E3C","key":"xanh-reu","image":"SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5_7__1.webp","img":"SanPham/Loa/JBL/JBL-Xtreme-5/loa-bluetooth-jbl-xtreme-5_7__1.webp"}]},"jbl-boombox-4":{"image":"SanPham/Loa/JBL/JBL-Boombox-4/bb6_1.webp","colors":[{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/Loa/JBL/JBL-Boombox-4/bb6_1.webp","img":"SanPham/Loa/JBL/JBL-Boombox-4/bb6_1.webp"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/Loa/JBL/JBL-Boombox-4/jbl_boombox_4.webp","img":"SanPham/Loa/JBL/JBL-Boombox-4/jbl_boombox_4.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/JBL/JBL-Boombox-4/loa-bluetooth-jbl-boombox-4_14__1.png","img":"SanPham/Loa/JBL/JBL-Boombox-4/loa-bluetooth-jbl-boombox-4_14__1.png"},{"name":"Xanh Rêu","hex":"#4D5E3C","key":"xanh-reu","image":"SanPham/Loa/JBL/JBL-Boombox-4/loa-bluetooth-jbl-boombox-4_21__1.webp","img":"SanPham/Loa/JBL/JBL-Boombox-4/loa-bluetooth-jbl-boombox-4_21__1.webp"}]},"jbl-partybox-encore-essential-2":{"image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_1_.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_1_.webp","img":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_1_.webp"},{"name":"Đen LED Tím","hex":"#4C3559","key":"den-led-tim","image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_2_.png","img":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_2_.png"},{"name":"Đen LED Xanh","hex":"#244E3D","key":"den-led-xanh","image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_3_.png","img":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_3_.png"},{"name":"Đen Nhám","hex":"#2A2C31","key":"den-nham","image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_4_.webp","img":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_4_.webp"},{"name":"Đen Carbon","hex":"#212328","key":"den-carbon","image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_5_.png","img":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_5_.png"},{"name":"Xám Đen","hex":"#393B42","key":"xam-den","image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_6_.webp","img":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_6_.webp"},{"name":"Đen Tuyền","hex":"#16171A","key":"den-tuyen","image":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_13_.png","img":"SanPham/Loa/JBL/JBL-PartyBox-Encore-Essential-2/loa-bluetooth-jbl-partybox-enco-essential-2-kem-2-micro_13_.png"}]},"marshall-emberton-iii":{"image":"SanPham/Loa/Marshall/Marshall-Emberton-III/emiii.webp","colors":[{"name":"Đêm Xanh Thẫm","hex":"#1E293B","key":"dem-xanh-tham","image":"SanPham/Loa/Marshall/Marshall-Emberton-III/emiii.webp","img":"SanPham/Loa/Marshall/Marshall-Emberton-III/emiii.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/Marshall/Marshall-Emberton-III/loa-bluetooth-marshall-emberton-iii-08_1.webp","img":"SanPham/Loa/Marshall/Marshall-Emberton-III/loa-bluetooth-marshall-emberton-iii-08_1.webp"},{"name":"Nâu","hex":"#78350F","key":"nau","image":"SanPham/Loa/Marshall/Marshall-Emberton-III/loa-bluetooth-marshall-emberton-iii-br01.webp","img":"SanPham/Loa/Marshall/Marshall-Emberton-III/loa-bluetooth-marshall-emberton-iii-br01.webp"},{"name":"Đen Nhám","hex":"#2C2E33","key":"den-nham","image":"SanPham/Loa/Marshall/Marshall-Emberton-III/marshall_emberton-iii_black_prod.webp","img":"SanPham/Loa/Marshall/Marshall-Emberton-III/marshall_emberton-iii_black_prod.webp"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/Marshall/Marshall-Emberton-III/marshall_emberton-iii_cream_prod.webp","img":"SanPham/Loa/Marshall/Marshall-Emberton-III/marshall_emberton-iii_cream_prod.webp"},{"name":"Xanh Rêu","hex":"#5F7159","key":"xanh-reu","image":"SanPham/Loa/Marshall/Marshall-Emberton-III/marshall_emberton-iii_sage_produ.webp","img":"SanPham/Loa/Marshall/Marshall-Emberton-III/marshall_emberton-iii_sage_produ.webp"}]},"marshall-willen-ii":{"image":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii-den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii-den.webp","img":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii-den.webp"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii-vang.jpg","img":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii-vang.jpg"},{"name":"Đen Nhám","hex":"#2C2E33","key":"den-nham","image":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_8_.webp","img":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_8_.webp"},{"name":"Vàng Đen","hex":"#78664E","key":"vang-den","image":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_11_.webp","img":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_11_.webp"},{"name":"Đen Carbon","hex":"#23252A","key":"den-carbon","image":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_13_.png","img":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_13_.png"},{"name":"Đen Tuyền","hex":"#16171B","key":"den-tuyen","image":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_15_.webp","img":"SanPham/Loa/Marshall/Marshall-Willen-II/loa-bluetooth-marshall-willen-ii_15_.webp"}]},"marshall-kilburn-iii":{"image":"SanPham/Loa/Marshall/Marshall-Kilburn-III/kilburn3-kem.webp","colors":[{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/Marshall/Marshall-Kilburn-III/kilburn3-kem.webp","img":"SanPham/Loa/Marshall/Marshall-Kilburn-III/kilburn3-kem.webp"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_10_.webp","img":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_10_.webp"},{"name":"Đen Vàng Đồng","hex":"#5E503F","key":"den-vang-dong","image":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_11_.webp","img":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_11_.webp"},{"name":"Đen Nhám","hex":"#2B2D32","key":"den-nham","image":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_12_.webp","img":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_12_.webp"},{"name":"Đen Tuyền","hex":"#17181B","key":"den-tuyen","image":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_14__1.webp","img":"SanPham/Loa/Marshall/Marshall-Kilburn-III/loa-bluetooth-marshall-kilburn-iii_14__1.webp"},{"name":"Nâu","hex":"#78350F","key":"nau","image":"SanPham/Loa/Marshall/Marshall-Kilburn-III/medium-marshall_kilburn-iii_brown_product_base_1_flat.webp","img":"SanPham/Loa/Marshall/Marshall-Kilburn-III/medium-marshall_kilburn-iii_brown_product_base_1_flat.webp"}]},"marshall-acton-iii":{"image":"SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_7_1.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_7_1.webp","img":"SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_7_1.webp"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_6_2.webp","img":"SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_6_2.webp"},{"name":"Đêm Xanh Thẫm","hex":"#1E293B","key":"dem-xanh-tham","image":"SanPham/Loa/Marshall/Marshall-Acton-III/act-iii.webp","img":"SanPham/Loa/Marshall/Marshall-Acton-III/act-iii.webp"},{"name":"Nâu","hex":"#78350F","key":"nau","image":"SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_nau.webp","img":"SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_nau.webp"}]},"marshall-stanmore-iii":{"image":"SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_10_.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_10_.webp","img":"SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_10_.webp"},{"name":"Đen Nhám","hex":"#2B2D32","key":"den-nham","image":"SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_11_.webp","img":"SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_11_.webp"},{"name":"Vàng Đen","hex":"#6B5C47","key":"vang-den","image":"SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_12_.webp","img":"SanPham/Loa/Marshall/Marshall-Stanmore-III/loa-bluetooth-marshall-stanmore-iii-new_12_.webp"},{"name":"Đen Carbon","hex":"#222429","key":"den-carbon","image":"SanPham/Loa/Marshall/Marshall-Stanmore-III/marshall_stanmore_iii_5_1.webp","img":"SanPham/Loa/Marshall/Marshall-Stanmore-III/marshall_stanmore_iii_5_1.webp"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/Marshall/Marshall-Stanmore-III/marshall_stanmore_iii_6_1.webp","img":"SanPham/Loa/Marshall/Marshall-Stanmore-III/marshall_stanmore_iii_6_1.webp"},{"name":"Nâu","hex":"#78350F","key":"nau","image":"SanPham/Loa/Marshall/Marshall-Stanmore-III/stan3.webp","img":"SanPham/Loa/Marshall/Marshall-Stanmore-III/stan3.webp"}]},"soundcore-boom-2":{"image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-2/loa-anker-soundcore-motion-boom-2-se-a3148-1.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-2/loa-anker-soundcore-motion-boom-2-se-a3148-1.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-2/loa-anker-soundcore-motion-boom-2-se-a3148-1.webp"}]},"soundcore-boom-3i":{"image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_1_.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_1_.png","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_1_.png"},{"name":"Hồng","hex":"#F4A7B9","key":"hong","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_7_.png","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_7_.png"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_8_.png","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_8_.png"},{"name":"Ánh Sao","hex":"#F0E5D3","key":"anh-sao","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_9_.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_9_.webp"},{"name":"Đêm Xanh Thẫm","hex":"#1E293B","key":"dem-xanh-tham","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_11_.png","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_11_.png"},{"name":"Xanh Navy","hex":"#294661","key":"xanh-navy","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_12_.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_12_.webp"},{"name":"Xanh Da Trời","hex":"#5C88A8","key":"xanh-da-troi","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_13_.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Boom-3i/loa-anker-soundcore-boom-go-3i_13_.webp"}]},"soundcore-motion-x600":{"image":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_1__3.webp","colors":[{"name":"Xám Không Gian","hex":"#52565E","key":"xam-khong-gian","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_1__3.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_1__3.webp"},{"name":"Xanh Da Trời","hex":"#93C5FD","key":"xanh-da-troi","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_3__2.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_3__2.webp"},{"name":"Xanh Lá","hex":"#5B8271","key":"xanh-la","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_4__2.png","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_4__2.png"},{"name":"Bạc","hex":"#C5C8CE","key":"bac","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_7__2.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_7__2.webp"},{"name":"Xanh Ngọc","hex":"#4B7A69","key":"xanh-ngoc","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_9__3.png","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_9__3.png"},{"name":"Xanh Dương","hex":"#5F82A6","key":"xanh-duong","image":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_10__3.webp","img":"SanPham/Loa/Anker-Soundcore/Soundcore-Motion-X600/loa-bluetooth-anker-soundcore-motion-x600_10__3.webp"}]},"apple-watch-ultra-3":{"image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/apple-watch-ultra-3-cutout.png","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/apple-watch-ultra-3-cutout.png","img":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/apple-watch-ultra-3-cutout.png"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/Apple-Watch-Ultra-3-xam.jpg","img":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/Apple-Watch-Ultra-3-xam.jpg"}]},"apple-watch-series-11":{"image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-den.webp","img":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-Trang.webp","img":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-Trang.webp"},{"name":"Xám","hex":"#7D7E80","key":"xam","image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-Xam.webp","img":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Series-11/Apple-Watch-Series-11-Xam.webp"}]},"apple-watch-se-3":{"image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-SE-3/Apple-Watch-SE-3-den.webp","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-SE-3/Apple-Watch-SE-3-den.webp","img":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-SE-3/Apple-Watch-SE-3-den.webp"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-SE-3/Apple-Watch-SE-3-Trang.webp","img":"SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-SE-3/Apple-Watch-SE-3-Trang.webp"}]},"samsung-galaxy-watch-ultra-2":{"image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Cam.jpg","colors":[{"name":"Cam","hex":"#F97316","key":"cam","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Cam.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Cam.jpg"},{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Den.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Den.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Trang.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Trang.jpg"},{"name":"Xanh Dương","hex":"#2563EB","key":"xanh-duong","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Xanh.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-Ultra-2/Galaxy-Watch-Ultra-Xanh.jpg"}]},"samsung-galaxy-watch-9-classic":{"image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9-Classic/Samsung-Galaxy-Watch-9-Classic-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9-Classic/Samsung-Galaxy-Watch-9-Classic-Den.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9-Classic/Samsung-Galaxy-Watch-9-Classic-Den.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9-Classic/Samsung-Galaxy-Watch-9-Classic-Trang.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9-Classic/Samsung-Galaxy-Watch-9-Classic-Trang.jpg"}]},"samsung-galaxy-watch-9":{"image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-Den.jpg","colors":[{"name":"Đen","hex":"#1F2024","key":"den","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-Den.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-Den.jpg"},{"name":"Trắng","hex":"#F5F5F7","key":"trang","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-Trang.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-Trang.jpg"},{"name":"Vàng","hex":"#F3D58D","key":"vang","image":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-vang.jpg","img":"SanPham/DongHoDienTu/Samsung-Galaxy-Watch/Samsung-Galaxy-Watch-9/Galaxy-Watch-7-vang.jpg"}]}};
  global.VLU_REAL_IMAGES = PRODUCT_REAL_IMAGES;

  CATALOG = {};
  CATALOG_SPEC.forEach(function (group) {
    group.names.forEach(function (name) {
      var id = productSlug(name);
      var oldProduct = findLegacyProduct(name, group.brand);
      var product = oldProduct ? Object.assign({}, oldProduct) : {};
      var placeholder = 'frontend/assets/images/placeholders/' + categoryImages[group.category];
      product.id = id;
      product.name = name;
      product.brand = group.brand;
      product.menuGroup = menuGroupByName[name] || group.brand;
      product.category = group.category;
      product.badge = group.brand + ' · ' + categoryNames[group.category];
      product.badgeSub = 'Chính Hãng';
      product.tagline = product.tagline || name + ' chính hãng tại VLU FLAGSHIP STORE.';
      product.basePrice = Number(product.basePrice) || null;
      product.oldPrice = Number(product.oldPrice) || null;
      var realImgData = PRODUCT_REAL_IMAGES[id];
      if (realImgData && realImgData.image) {
        product.image = realImgData.image;
        product.img = realImgData.image;
        product.colors = realImgData.colors && realImgData.colors.length ? realImgData.colors : [{ name: 'Mặc định', key: 'default', hex: '#CBD5E1', image: realImgData.image, img: realImgData.image }];
      } else {
        product.image = product.image || placeholder;
        product.img = product.img || product.image;
        product.colors = Array.isArray(product.colors) && product.colors.length ? product.colors : [{ name: 'Mặc định', key: 'default', hex: '#CBD5E1', image: placeholder, img: placeholder }];
      }
      product.extraImages = Array.isArray(product.extraImages) ? product.extraImages : [];
      product.variantLabel = product.variantLabel || 'Phiên bản';
      product.variants = Array.isArray(product.variants) && product.variants.length
        ? product.variants
        : [{ label: 'Tiêu chuẩn', delta: 0, discount: '' }];
      product.perks = Array.isArray(product.perks) ? product.perks : [];
      product.highlights = Array.isArray(product.highlights) ? product.highlights : [];
      product.specs = Array.isArray(product.specs)
        ? product.specs.filter(function (spec) { return !Array.isArray(spec) || spec[0] !== 'Tên máy'; })
        : [];
      product.specs.unshift(['Tên máy', name], ['Hãng sản xuất', group.brand], ['Danh mục', categoryNames[group.category]]);
      product.sku = productSlug(name).toUpperCase();
      CATALOG[id] = product;
      if (oldProduct && oldProduct.id !== id) PRODUCT_ID_ALIASES[oldProduct.id] = id;
    });
  });

  // ============================================================================
  // FUZZY SLUG & NAME MATCHER CHUẨN 2026 (Tìm kiếm thông minh không bao giờ 404)
  // ============================================================================
  function findProduct(query) {
    if (!query) return null;
    var raw = String(query).trim();
    if (!raw) return null;
    var slug = productSlug(raw);
    var rawLower = raw.toLowerCase();
    var normRaw = removeVietnameseAccents(rawLower);

    // 1. Khớp trực tiếp key/id hoặc slug trong CATALOG
    if (CATALOG[raw]) return CATALOG[raw];
    if (CATALOG[slug]) return CATALOG[slug];
    if (PRODUCT_ID_ALIASES[raw] && CATALOG[PRODUCT_ID_ALIASES[raw]]) return CATALOG[PRODUCT_ID_ALIASES[raw]];
    if (PRODUCT_ID_ALIASES[slug] && CATALOG[PRODUCT_ID_ALIASES[slug]]) return CATALOG[PRODUCT_ID_ALIASES[slug]];

    // 2. Khớp database_id hoặc numeric ID
    for (var k in CATALOG) {
      var p = CATALOG[k];
      if (p.database_id && String(p.database_id) === raw) return p;
      if (p.id && String(p.id) === raw) return p;
    }

    // 3. Khớp chính xác tên (có dấu và không dấu)
    for (var k2 in CATALOG) {
      var p2 = CATALOG[k2];
      if (p2.name) {
        var pNameLower = p2.name.toLowerCase();
        if (pNameLower === rawLower) return p2;
        if (removeVietnameseAccents(pNameLower) === normRaw) return p2;
      }
    }

    // 4. Fuzzy Matcher: So khớp tiền tố, chuỗi con & tập token
    var queryTokens = normRaw.split(/[^a-z0-9]+/).filter(function (t) { return t.length >= 2; });
    var bestMatch = null;
    var bestScore = 0;

    for (var k3 in CATALOG) {
      var p3 = CATALOG[k3];
      var pNormName = removeVietnameseAccents((p3.name || '').toLowerCase());
      var pSlug = productSlug(p3.name || k3);

      // Trùng slug một phần (query nằm trong slug hoặc slug nằm trong query)
      if (pSlug.indexOf(slug) !== -1 || slug.indexOf(pSlug) !== -1) {
        var score = 100 - Math.abs(pSlug.length - slug.length);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = p3;
        }
      }

      // Kiểm tra token của query có nằm trong tên sản phẩm không
      if (queryTokens.length > 0) {
        var matchedTokens = 0;
        queryTokens.forEach(function (token) {
          if (pNormName.indexOf(token) !== -1 || pSlug.indexOf(token) !== -1) {
            matchedTokens++;
          }
        });
        var tokenScore = (matchedTokens / queryTokens.length) * 80;
        if (tokenScore > bestScore && matchedTokens >= Math.min(2, queryTokens.length)) {
          bestScore = tokenScore;
          bestMatch = p3;
        }
      }
    }

    if (bestMatch) return bestMatch;
    return null;
  }

  // ============================================================================
  // SINGLE SOURCE OF TRUTH: HỢP NHẤT DỮ LIỆU TỪ ADMIN VÀO CATALOG TOÀN CỤC
  // ============================================================================
  var PARTA_DEPRECATED_IMAGE_MAP = {
    'SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/ma5ac1_1.webp': 'SanPham/Laptop/MacBook/MacBook-Pro-16-M5-Max/macbook-pro-16-m5-max.png',
    'SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-2.webp': 'SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-cutout.png',
    'SanPham/iPad/Apple/iPad-Pro-M5/ipad_pro_13-in_m5_wifi_space_black_pdp_image_position_2__vn-vi_1.webp': 'SanPham/iPad/Apple/iPad-Pro-M5/ipad-pro-m5-hero.png',
    'SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods_pro_3_sep25_pdp_image_position_1__vn-vi_1.webp': 'SanPham/TaiNghe/Apple/AirPods-Pro-3/airpods-pro-3-cutout.png',
    'SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/Apple-Watch-Ultra-3-Den.jpg': 'SanPham/DongHoDienTu/Apple-Watch/Apple-Watch-Ultra-3/apple-watch-ultra-3-cutout.png',
    'SanPham/Loa/Marshall/Marshall-Acton-III/act-iii.webp': 'SanPham/Loa/Marshall/Marshall-Acton-III/marshall_acton_iii_7_1.webp',
    'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Den.webp': 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Ultra/Galaxy-S26-Ultra-Den-clean.png',
    'SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Den.webp': 'SanPham/DienThoai/Samsung/Samsung-Galaxy-Z-Fold7/Galaxy-Z-Fold7-Den-clean.png',
    'SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Den.webp': 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S25-Ultra/Galaxy-S25-Ultra-Den-clean.png',
    'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Den.webp': 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26-Plus/Galaxy-S26-Plus-Den-clean.png',
    'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Den.webp': 'SanPham/DienThoai/Samsung/Samsung-Galaxy-S26/Galaxy-S26-Den-clean.png'
  };

  function upgradeLegacyProductImagePath(imgUrl) {
    if (!imgUrl || typeof imgUrl !== 'string') return imgUrl;
    var trimmed = imgUrl.trim().replace(/^[\/\\]+/, '').replace(/^\.\//, '');
    return PARTA_DEPRECATED_IMAGE_MAP[trimmed] || imgUrl;
  }

  function isStaleOrGenericColorList(colors) {
    if (!Array.isArray(colors) || !colors.length) return true;
    return colors.some(function (c) {
      if (!c) return true;
      var h = String(c.hex || '').toUpperCase();
      if (!h || h === '#475569' || h === '#334155' || h === '#1E293B' || h === '#E2E8F0' || h === '#1D1D1F' || h === '#64748B' || h === '#EF4444' || h === '#F8FAFC') return true;
      return /^(Bản màu \d+|Kem \d+|Tiêu chuẩn)$/i.test(String(c.name || '').trim());
    });
  }

  function syncLegacyLocalStorageImages() {
    try {
      var targetColorSchema = '2026_colors_v2';
      var prevSchema = '';
      try { prevSchema = localStorage.getItem('vlu_color_schema_ver') || ''; } catch (eVer) {}

      ['vlu_products', 'vlu_admin_products'].forEach(function (storageKey) {
        var raw = localStorage.getItem(storageKey);
        if (!raw) return;
        var list = JSON.parse(raw);
        if (!Array.isArray(list)) return;
        var dirty = false;
        list.forEach(function (item) {
          if (!item) return;
          var fresh = CATALOG[item.id];
          var upgraded = upgradeLegacyProductImagePath(item.image);
          if (upgraded && upgraded !== item.image) {
            item.image = upgraded;
            if ('img' in item) item.img = upgraded;
            dirty = true;
          }
          if (fresh && (!item.image || item.image.indexOf('placeholders/') !== -1)) {
            item.image = fresh.image;
            if ('img' in item) item.img = fresh.image;
            dirty = true;
          }
          if (fresh && Array.isArray(fresh.colors) && !item.colors_edited && !item.is_custom) {
            var needsColorSync = prevSchema !== targetColorSchema
              || isStaleOrGenericColorList(item.colors)
              || JSON.stringify(item.colors) !== JSON.stringify(fresh.colors);
            if (needsColorSync) {
              item.colors = JSON.parse(JSON.stringify(fresh.colors));
              dirty = true;
            }
          } else if (Array.isArray(item.colors)) {
            item.colors.forEach(function (c) {
              if (c && c.name) {
                var nextHex = getColorHex(c.name, c.key);
                if (c.hex !== nextHex) {
                  c.hex = nextHex;
                  dirty = true;
                }
              }
            });
          }
        });
        if (dirty) {
          localStorage.setItem(storageKey, JSON.stringify(list));
        }
      });
      if (prevSchema !== targetColorSchema) {
        try { localStorage.setItem('vlu_color_schema_ver', targetColorSchema); } catch (eVer2) {}
      }
    } catch (cacheErr) {}
  }

  function mergeAdminProducts(adminList) {
    try {
      if (!Array.isArray(adminList)) {
        var rawAdmin = localStorage.getItem('vlu_admin_products') || localStorage.getItem('vlu_products');
        if (rawAdmin) {
          adminList = JSON.parse(rawAdmin);
        }
      }
      if (!Array.isArray(adminList) || !adminList.length) return false;

      var changed = false;
      adminList.forEach(function (ap) {
        if (!ap) return;
        var apImg = upgradeLegacyProductImagePath(ap.image);
        var existing = findProduct(ap.id || ap.name);
        if (existing) {
          if (ap.price !== undefined && (Number(ap.price) > 0 || ap.price_edited === true) && existing.basePrice !== Number(ap.price)) {
            existing.basePrice = Math.max(0, Number(ap.price) || 0);
            changed = true;
          }
          if (ap.old_price !== undefined) {
            existing.oldPrice = ap.old_price ? Number(ap.old_price) : null;
            changed = true;
          }
          if (ap.name && ap.name !== existing.name) {
            existing.name = ap.name;
            changed = true;
          }
          if (ap.sku && ap.sku !== existing.sku) {
            existing.sku = ap.sku;
            changed = true;
          }
          if (apImg && apImg.indexOf('placeholders/') === -1 && apImg !== existing.image) {
            existing.image = apImg;
            if (!ap.colors_edited && existing.colors && existing.colors[0]) {
              existing.colors[0].image = apImg;
              existing.colors[0].img = apImg;
            }
            changed = true;
          }
          if (ap.stock !== undefined) {
            existing.stock = Number(ap.stock);
            changed = true;
          }
          if (ap.stock_threshold !== undefined) {
            existing.stock_threshold = Number(ap.stock_threshold) || 5;
            changed = true;
          }
          if (ap.status) {
            existing.status = ap.status;
            changed = true;
          }
          if (ap.description !== undefined && ap.description !== existing.tagline) {
            existing.tagline = ap.description;
            changed = true;
          }
          if (ap.colors_edited && Array.isArray(ap.colors) && ap.colors.length) {
            existing.colors = ap.colors.map(function (c, idx) {
              var cImg = upgradeLegacyProductImagePath(c.image || c.img) || existing.image;
              return {
                name: c.name || ('Màu ' + (idx + 1)),
                hex: c.hex || getColorHex(c.name, c.key),
                key: c.key || ('color-' + idx),
                image: cImg,
                img: cImg,
                stock: c.stock !== undefined && c.stock !== '' ? Number(c.stock) : undefined
              };
            });
            changed = true;
          }
          if (ap.variants_edited && Array.isArray(ap.variants) && ap.variants.length) {
            existing.variants = ap.variants.map(function (v) {
              var outVar = {
                label: v.label || 'Tiêu chuẩn',
                delta: Number(v.delta) || 0,
                discount: v.discount || ''
              };
              if (v.stock !== undefined && v.stock !== '') outVar.stock = Number(v.stock);
              return outVar;
            });
            changed = true;
          }
          if (ap.variant_stocks && typeof ap.variant_stocks === 'object') {
            existing.variant_stocks = Object.assign({}, ap.variant_stocks);
            changed = true;
          }
          if ('promoStart' in ap) {
            existing.promoStart = ap.promoStart || null;
            changed = true;
          }
          if ('promoEnd' in ap) {
            existing.promoEnd = ap.promoEnd || null;
            changed = true;
          }
          if ('campaignId' in ap) {
            existing.campaignId = ap.campaignId || null;
            changed = true;
          }
          if (ap.specs_edited && Array.isArray(ap.specs)) {
            existing.specs = ap.specs.filter(function (pair) { return Array.isArray(pair) && pair[0]; });
            changed = true;
          }
          if (ap.gallery_edited && Array.isArray(ap.extraImages)) {
            existing.extraImages = ap.extraImages.slice();
            changed = true;
          }
          if (ap.seo && typeof ap.seo === 'object') {
            existing.seo = ap.seo;
            changed = true;
          }
          var nextCatSlug = ap.category_slug || ap.category;
          if (nextCatSlug && nextCatSlug !== existing.category) {
            existing.category = nextCatSlug;
            changed = true;
          }
          var nextBrandName = ap.brand || ap.category_name;
          if (nextBrandName && nextBrandName !== existing.brand) {
            existing.brand = nextBrandName;
            changed = true;
          }
        } else if (ap.name && (Number(ap.price) > 0 || ap.is_custom)) {
          // Thêm sản phẩm mới từ Admin vào Catalog
          var newId = ap.id || productSlug(ap.name);
          var customImg = apImg || 'frontend/assets/images/logo.png';
          var normColors = (Array.isArray(ap.colors) && ap.colors.length)
            ? ap.colors.map(function (c, idx) {
                var ci = upgradeLegacyProductImagePath(c.image || c.img) || customImg;
                return {
                  name: c.name || ('Màu ' + (idx + 1)),
                  hex: c.hex || getColorHex(c.name, c.key),
                  key: c.key || ('color-' + idx),
                  image: ci,
                  img: ci
                };
              })
            : [{ name: 'Mặc định', hex: '#334155', key: 'default', image: customImg, img: customImg }];
          var normVariants = (Array.isArray(ap.variants) && ap.variants.length)
            ? ap.variants.map(function (v) {
                return { label: v.label || 'Tiêu chuẩn', delta: Number(v.delta) || 0, discount: v.discount || '' };
              })
            : [{ label: 'Tiêu chuẩn', delta: 0 }];
          CATALOG[newId] = {
            id: newId,
            sku: ap.sku || String(newId).toUpperCase(),
            name: ap.name,
            brand: ap.brand || ap.category_name || 'Khác',
            category: ap.category_slug || ap.category || 'dien-thoai',
            basePrice: Math.max(0, Number(ap.price) || 0),
            oldPrice: ap.old_price ? Number(ap.old_price) : null,
            image: customImg,
            extraImages: Array.isArray(ap.extraImages) ? ap.extraImages.slice() : [],
            tagline: ap.description || '',
            stock: (ap.stock !== undefined && ap.stock !== null) ? Number(ap.stock) : 15,
            stock_threshold: ap.stock_threshold !== undefined ? (Number(ap.stock_threshold) || 5) : 5,
            status: ap.status || 'active',
            colors: normColors,
            variants: normVariants,
            specs: Array.isArray(ap.specs) ? ap.specs : [],
            seo: ap.seo || null,
            is_custom: true
          };
          changed = true;
        }
      });

      global.VLU_CATALOG = CATALOG;
      global.VLU_PRODUCTS = Object.values(CATALOG);

      if (changed) {
        try {
          if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('vlu:products-updated', { detail: { products: global.VLU_PRODUCTS } }));
          }
        } catch (e) {}
      }
      return changed;
    } catch (err) {
      console.warn('[ProductsData] Lỗi mergeAdminProducts:', err);
      return false;
    }
  }

  // Tự động làm sạch cache deprecated trước, sau đó hợp nhất Admin vào Catalog
  syncLegacyLocalStorageImages();
  mergeAdminProducts();

  // Đưa ra phạm vi toàn cục
  /**
   * Chuẩn hóa đường dẫn hình ảnh an toàn: chống double-encoding, chống lỗi 404 khoảng trắng / tiếng Việt
   */
  function resolveProductImageUrl(url, fallbackCategory) {
    if (!url || typeof url !== 'string') {
      return 'frontend/assets/images/placeholders/' + (fallbackCategory || 'phone') + '.svg';
    }
    var clean = url.trim().replace(/^[\/\\]+/, '').replace(/^\.\//, '');
    if (/^(?:https?:|data:|\/\/)/i.test(clean)) {
      return clean;
    }
    try {
      clean = decodeURI(clean);
    } catch (e) {}
    return encodeURI(clean);
  }

  // Giữ tương thích đồng bộ sau khi khởi tạo
  syncLegacyLocalStorageImages();

  // Đưa ra phạm vi toàn cục
  global.resolveProductImageUrl = resolveProductImageUrl;
  global.VLU_RESOLVE_IMG_URL = resolveProductImageUrl;
  global.VLU_COLOR_HEX_MAP = COLOR_HEX;
  global.VLU_COLOR_HEX = COLOR_HEX;
  global.VLU_GET_COLOR_HEX = getColorHex;
  global.VLU_IS_LIGHT_COLOR = isLightColorHex;
  global.VLU_CATALOG = CATALOG;
  global.VLU_PRODUCTS = Object.values(CATALOG);
  global.VLU_PRODUCT_ID_ALIASES = PRODUCT_ID_ALIASES;
  global.VLU_CATALOG_SPEC = CATALOG_SPEC;
  global.VLU_FIND_PRODUCT = findProduct;
  global.VLU_MERGE_ADMIN_PRODUCTS = mergeAdminProducts;
  global.VLU_SYNC_PRODUCTS = function () { return mergeAdminProducts(); };
  global.VLU_UPGRADE_PRODUCT_IMG = upgradeLegacyProductImagePath;

})(typeof window !== 'undefined' ? window : this);
