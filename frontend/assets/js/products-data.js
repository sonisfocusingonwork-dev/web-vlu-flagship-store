/**
 * VLU FLAGSHIP STORE – Centralized Product Catalog Database
 * Hỗ trợ toàn bộ 53+ dòng điện thoại trên Mega-Menu và các sản phẩm chủ đạo khác.
 * 100% hình ảnh phân theo màu sắc thực tế (Local WebP Assets).
 */

(function (global) {
  'use strict';

  // Bảng mã màu chuẩn
  var COLOR_HEX = {
    'titan-tu-nhien': '#C5B9A5',
    'titan-den': '#3C3B37',
    'titan-trang': '#E3E4E5',
    'titan-sa-mac': '#C7A382',
    'xanh-luu-ly': '#3F5277',
    'xanh-mong-ket': '#8EADA4',
    'hong': '#E9B8BE',
    'trang': '#F2F2F2',
    'den': '#33373B',
    'trang-may': '#EAEAEA',
    'vang-nhat': '#F7E7B4',
    'xanh-da-troi': '#A8C5DA',
    'den-khong-gian': '#1D1D1F',
    'cobalt-violet': '#4E4362',
    'silver-shadow': '#D8D9DD',
    'pink-gold': '#DEB3AD',
    'cream': '#F5EEDB',
    'graphite': '#3E4044',
    'mint': '#C2E5D3',
    'cam': '#E87A4D',
    'tim': '#8B739E'
  };

  function getColorHex(nameOrKey) {
    if (!nameOrKey) return '#334155';
    var k = nameOrKey.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return COLOR_HEX[k] || '#334155';
  }

  // Toàn bộ Cơ sở dữ liệu Catalog
  var CATALOG = {
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
        "image": "img/phones/apple/iphone-18-pro-max-natural.webp",
        "img": "img/phones/apple/iphone-18-pro-max-natural.webp"
      },
      {
        "name": "Titan Đen",
        "hex": "#3C3B37",
        "key": "black",
        "image": "img/phones/apple/iphone-18-pro-max-black.webp",
        "img": "img/phones/apple/iphone-18-pro-max-black.webp"
      },
      {
        "name": "Titan Trắng",
        "hex": "#E3E4E5",
        "key": "white",
        "image": "img/phones/apple/iphone-18-pro-max-white.webp",
        "img": "img/phones/apple/iphone-18-pro-max-white.webp"
      },
      {
        "name": "Titan Sa Mạc",
        "hex": "#C7A382",
        "key": "desert",
        "image": "img/phones/apple/iphone-18-pro-max-desert.webp",
        "img": "img/phones/apple/iphone-18-pro-max-desert.webp"
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
    "image": "img/phones/apple/iphone-18-pro-max-natural.webp",
    "img": "img/phones/apple/iphone-18-pro-max-natural.webp"
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
        "image": "img/phones/apple/iphone-18-pro-natural.webp",
        "img": "img/phones/apple/iphone-18-pro-natural.webp"
      },
      {
        "name": "Titan Đen",
        "hex": "#3C3B37",
        "key": "black",
        "image": "img/phones/apple/iphone-18-pro-black.webp",
        "img": "img/phones/apple/iphone-18-pro-black.webp"
      },
      {
        "name": "Titan Trắng",
        "hex": "#E3E4E5",
        "key": "white",
        "image": "img/phones/apple/iphone-18-pro-white.webp",
        "img": "img/phones/apple/iphone-18-pro-white.webp"
      },
      {
        "name": "Titan Sa Mạc",
        "hex": "#C7A382",
        "key": "desert",
        "image": "img/phones/apple/iphone-18-pro-desert.webp",
        "img": "img/phones/apple/iphone-18-pro-desert.webp"
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
    "image": "img/phones/apple/iphone-18-pro-natural.webp",
    "img": "img/phones/apple/iphone-18-pro-natural.webp"
  },
  "iphone-18": {
    "id": "iphone-18",
    "name": "iPhone 18",
    "brand": "Apple",
    "category": "dien-thoai",
    "badge": "Apple · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm iPhone 18 chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 22990000,
    "oldPrice": 24829200,
    "colors": [
      {
        "name": "Xanh Lưu Ly",
        "hex": "#3F5277",
        "key": "ultramarine",
        "image": "img/phones/apple/iphone-18-ultramarine.webp",
        "img": "img/phones/apple/iphone-18-ultramarine.webp"
      },
      {
        "name": "Xanh Mòng Két",
        "hex": "#8EADA4",
        "key": "teal",
        "image": "img/phones/apple/iphone-18-teal.webp",
        "img": "img/phones/apple/iphone-18-teal.webp"
      },
      {
        "name": "Hồng Pastel",
        "hex": "#E9B8BE",
        "key": "pink",
        "image": "img/phones/apple/iphone-18-pink.webp",
        "img": "img/phones/apple/iphone-18-pink.webp"
      },
      {
        "name": "Trắng",
        "hex": "#F2F2F2",
        "key": "white",
        "image": "img/phones/apple/iphone-18-white.webp",
        "img": "img/phones/apple/iphone-18-white.webp"
      },
      {
        "name": "Đen",
        "hex": "#33373B",
        "key": "black",
        "image": "img/phones/apple/iphone-18-black.webp",
        "img": "img/phones/apple/iphone-18-black.webp"
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
        "iPhone 18"
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
    "sku": "IPHONE-18",
    "image": "img/phones/apple/iphone-18-ultramarine.webp",
    "img": "img/phones/apple/iphone-18-ultramarine.webp"
  },
  "iphone-air": {
    "id": "iphone-air",
    "name": "iPhone Air",
    "brand": "Apple",
    "category": "dien-thoai",
    "badge": "Apple · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm iPhone Air chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 26990000,
    "oldPrice": 29149200,
    "colors": [
      {
        "name": "Trắng Mây",
        "hex": "#EAEAEA",
        "key": "white",
        "image": "img/phones/apple/iphone-air-white.webp",
        "img": "img/phones/apple/iphone-air-white.webp"
      },
      {
        "name": "Vàng Nhạt",
        "hex": "#F7E7B4",
        "key": "yellow",
        "image": "img/phones/apple/iphone-air-yellow.webp",
        "img": "img/phones/apple/iphone-air-yellow.webp"
      },
      {
        "name": "Xanh Da Trời",
        "hex": "#A8C5DA",
        "key": "blue",
        "image": "img/phones/apple/iphone-air-blue.webp",
        "img": "img/phones/apple/iphone-air-blue.webp"
      },
      {
        "name": "Đen Không Gian",
        "hex": "#1D1D1F",
        "key": "black",
        "image": "img/phones/apple/iphone-air-black.webp",
        "img": "img/phones/apple/iphone-air-black.webp"
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
        "iPhone Air"
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
    "sku": "IPHONE-AIR",
    "image": "img/phones/apple/iphone-air-white.webp",
    "img": "img/phones/apple/iphone-air-white.webp"
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
  "iphone-15-pro-max": {
    "id": "iphone-15-pro-max",
    "name": "iPhone 15 Pro Max",
    "brand": "Apple",
    "category": "dien-thoai",
    "badge": "Apple · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm iPhone 15 Pro Max chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 28990000,
    "oldPrice": 31309200,
    "colors": [
      {
        "name": "Titan Tự Nhiên",
        "hex": "#9F988F",
        "key": "natural",
        "image": "img/phones/apple/iphone-15-pro-max-natural.webp",
        "img": "img/phones/apple/iphone-15-pro-max-natural.webp"
      },
      {
        "name": "Titan Đen",
        "hex": "#3F3E40",
        "key": "black",
        "image": "img/phones/apple/iphone-15-pro-max-black.webp",
        "img": "img/phones/apple/iphone-15-pro-max-black.webp"
      },
      {
        "name": "Titan Trắng",
        "hex": "#EDEBE8",
        "key": "white",
        "image": "img/phones/apple/iphone-15-pro-max-white.webp",
        "img": "img/phones/apple/iphone-15-pro-max-white.webp"
      },
      {
        "name": "Titan Xanh",
        "hex": "#323846",
        "key": "blue",
        "image": "img/phones/apple/iphone-15-pro-max-blue.webp",
        "img": "img/phones/apple/iphone-15-pro-max-blue.webp"
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
        "value": "Apple A17 Pro / A16 Bionic",
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
        "iPhone 15 Pro Max"
      ],
      [
        "Hãng sản xuất",
        "Apple"
      ],
      [
        "Vi xử lý (CPU)",
        "Apple A17 Pro / A16 Bionic"
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
    "sku": "IPHONE-15-PRO-MAX",
    "image": "img/phones/apple/iphone-15-pro-max-natural.webp",
    "img": "img/phones/apple/iphone-15-pro-max-natural.webp"
  },
  "iphone-15-pro": {
    "id": "iphone-15-pro",
    "name": "iPhone 15 Pro",
    "brand": "Apple",
    "category": "dien-thoai",
    "badge": "Apple · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm iPhone 15 Pro chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 23990000,
    "oldPrice": 25909200,
    "colors": [
      {
        "name": "Titan Tự Nhiên",
        "hex": "#9F988F",
        "key": "natural",
        "image": "img/phones/apple/iphone-15-pro-natural.webp",
        "img": "img/phones/apple/iphone-15-pro-natural.webp"
      },
      {
        "name": "Titan Đen",
        "hex": "#3F3E40",
        "key": "black",
        "image": "img/phones/apple/iphone-15-pro-black.webp",
        "img": "img/phones/apple/iphone-15-pro-black.webp"
      },
      {
        "name": "Titan Trắng",
        "hex": "#EDEBE8",
        "key": "white",
        "image": "img/phones/apple/iphone-15-pro-white.webp",
        "img": "img/phones/apple/iphone-15-pro-white.webp"
      },
      {
        "name": "Titan Xanh",
        "hex": "#323846",
        "key": "blue",
        "image": "img/phones/apple/iphone-15-pro-blue.webp",
        "img": "img/phones/apple/iphone-15-pro-blue.webp"
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
        "value": "Apple A17 Pro / A16 Bionic",
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
        "iPhone 15 Pro"
      ],
      [
        "Hãng sản xuất",
        "Apple"
      ],
      [
        "Vi xử lý (CPU)",
        "Apple A17 Pro / A16 Bionic"
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
    "sku": "IPHONE-15-PRO",
    "image": "img/phones/apple/iphone-15-pro-natural.webp",
    "img": "img/phones/apple/iphone-15-pro-natural.webp"
  },
  "iphone-15-plus": {
    "id": "iphone-15-plus",
    "name": "iPhone 15 Plus",
    "brand": "Apple",
    "category": "dien-thoai",
    "badge": "Apple · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm iPhone 15 Plus chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 21490000,
    "oldPrice": 23209200,
    "colors": [
      {
        "name": "Hồng Pastel",
        "hex": "#E8D3D1",
        "key": "pink",
        "image": "img/phones/apple/iphone-15-plus-pink.webp",
        "img": "img/phones/apple/iphone-15-plus-pink.webp"
      },
      {
        "name": "Vàng Nhạt",
        "hex": "#E8E5CE",
        "key": "yellow",
        "image": "img/phones/apple/iphone-15-plus-yellow.webp",
        "img": "img/phones/apple/iphone-15-plus-yellow.webp"
      },
      {
        "name": "Xanh Lá",
        "hex": "#D3E0D7",
        "key": "green",
        "image": "img/phones/apple/iphone-15-plus-green.webp",
        "img": "img/phones/apple/iphone-15-plus-green.webp"
      },
      {
        "name": "Xanh Dương",
        "hex": "#D0DCE3",
        "key": "blue",
        "image": "img/phones/apple/iphone-15-plus-blue.webp",
        "img": "img/phones/apple/iphone-15-plus-blue.webp"
      },
      {
        "name": "Đen",
        "hex": "#37393B",
        "key": "black",
        "image": "img/phones/apple/iphone-15-plus-black.webp",
        "img": "img/phones/apple/iphone-15-plus-black.webp"
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
        "value": "Apple A17 Pro / A16 Bionic",
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
        "iPhone 15 Plus"
      ],
      [
        "Hãng sản xuất",
        "Apple"
      ],
      [
        "Vi xử lý (CPU)",
        "Apple A17 Pro / A16 Bionic"
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
    "sku": "IPHONE-15-PLUS",
    "image": "img/phones/apple/iphone-15-plus-pink.webp",
    "img": "img/phones/apple/iphone-15-plus-pink.webp"
  },
  "iphone-15": {
    "id": "iphone-15",
    "name": "iPhone 15",
    "brand": "Apple",
    "category": "dien-thoai",
    "badge": "Apple · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm iPhone 15 chính hãng Apple với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 18990000,
    "oldPrice": 20509200,
    "colors": [
      {
        "name": "Hồng Pastel",
        "hex": "#E8D3D1",
        "key": "pink",
        "image": "img/phones/apple/iphone-15-pink.webp",
        "img": "img/phones/apple/iphone-15-pink.webp"
      },
      {
        "name": "Vàng Nhạt",
        "hex": "#E8E5CE",
        "key": "yellow",
        "image": "img/phones/apple/iphone-15-yellow.webp",
        "img": "img/phones/apple/iphone-15-yellow.webp"
      },
      {
        "name": "Xanh Lá",
        "hex": "#D3E0D7",
        "key": "green",
        "image": "img/phones/apple/iphone-15-green.webp",
        "img": "img/phones/apple/iphone-15-green.webp"
      },
      {
        "name": "Xanh Dương",
        "hex": "#D0DCE3",
        "key": "blue",
        "image": "img/phones/apple/iphone-15-blue.webp",
        "img": "img/phones/apple/iphone-15-blue.webp"
      },
      {
        "name": "Đen",
        "hex": "#37393B",
        "key": "black",
        "image": "img/phones/apple/iphone-15-black.webp",
        "img": "img/phones/apple/iphone-15-black.webp"
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
        "value": "Apple A17 Pro / A16 Bionic",
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
        "iPhone 15"
      ],
      [
        "Hãng sản xuất",
        "Apple"
      ],
      [
        "Vi xử lý (CPU)",
        "Apple A17 Pro / A16 Bionic"
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
    "sku": "IPHONE-15",
    "image": "img/phones/apple/iphone-15-pink.webp",
    "img": "img/phones/apple/iphone-15-pink.webp"
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
  "galaxy-s24-ultra": {
    "id": "galaxy-s24-ultra",
    "name": "Galaxy S24 Ultra",
    "brand": "Samsung",
    "category": "dien-thoai",
    "badge": "Samsung · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Galaxy S24 Ultra chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 26990000,
    "oldPrice": 29149200,
    "colors": [
      {
        "name": "Titanium Gray",
        "hex": "#7B7B7D",
        "key": "gray",
        "image": "img/phones/samsung/galaxy-s24-ultra-gray.webp",
        "img": "img/phones/samsung/galaxy-s24-ultra-gray.webp"
      },
      {
        "name": "Titanium Black",
        "hex": "#2B2B2D",
        "key": "black",
        "image": "img/phones/samsung/galaxy-s24-ultra-black.webp",
        "img": "img/phones/samsung/galaxy-s24-ultra-black.webp"
      },
      {
        "name": "Titanium Violet",
        "hex": "#4A435A",
        "key": "violet",
        "image": "img/phones/samsung/galaxy-s24-ultra-violet.webp",
        "img": "img/phones/samsung/galaxy-s24-ultra-violet.webp"
      },
      {
        "name": "Titanium Yellow",
        "hex": "#E5DECE",
        "key": "yellow",
        "image": "img/phones/samsung/galaxy-s24-ultra-yellow.webp",
        "img": "img/phones/samsung/galaxy-s24-ultra-yellow.webp"
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
        "value": "Snapdragon 8 Gen 3 for Galaxy",
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
        "Galaxy S24 Ultra"
      ],
      [
        "Hãng sản xuất",
        "Samsung"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Gen 3 for Galaxy"
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
    "sku": "GALAXY-S24-ULTRA",
    "image": "img/phones/samsung/galaxy-s24-ultra-gray.webp",
    "img": "img/phones/samsung/galaxy-s24-ultra-gray.webp"
  },
  "galaxy-s24-fe": {
    "id": "galaxy-s24-fe",
    "name": "Galaxy S24 FE",
    "brand": "Samsung",
    "category": "dien-thoai",
    "badge": "Samsung · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Galaxy S24 FE chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 15990000,
    "oldPrice": 17269200,
    "colors": [
      {
        "name": "Xanh Mint",
        "hex": "#BEE3DB",
        "key": "mint",
        "image": "img/phones/samsung/galaxy-s24-fe-mint.webp",
        "img": "img/phones/samsung/galaxy-s24-fe-mint.webp"
      },
      {
        "name": "Xám Graphite",
        "hex": "#3A3D40",
        "key": "graphite",
        "image": "img/phones/samsung/galaxy-s24-fe-graphite.webp",
        "img": "img/phones/samsung/galaxy-s24-fe-graphite.webp"
      },
      {
        "name": "Bạc Silver",
        "hex": "#E3E5E8",
        "key": "silver",
        "image": "img/phones/samsung/galaxy-s24-fe-silver.webp",
        "img": "img/phones/samsung/galaxy-s24-fe-silver.webp"
      },
      {
        "name": "Xanh Lam",
        "hex": "#B2D1E8",
        "key": "blue",
        "image": "img/phones/samsung/galaxy-s24-fe-blue.webp",
        "img": "img/phones/samsung/galaxy-s24-fe-blue.webp"
      },
      {
        "name": "Vàng Chanh",
        "hex": "#F7E9B7",
        "key": "yellow",
        "image": "img/phones/samsung/galaxy-s24-fe-yellow.webp",
        "img": "img/phones/samsung/galaxy-s24-fe-yellow.webp"
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
        "value": "Snapdragon 8 Gen 3 for Galaxy",
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
        "Galaxy S24 FE"
      ],
      [
        "Hãng sản xuất",
        "Samsung"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Gen 3 for Galaxy"
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
    "sku": "GALAXY-S24-FE",
    "image": "img/phones/samsung/galaxy-s24-fe-mint.webp",
    "img": "img/phones/samsung/galaxy-s24-fe-mint.webp"
  },
  "galaxy-z-fold8": {
    "id": "galaxy-z-fold8",
    "name": "Galaxy Z Fold8",
    "brand": "Samsung",
    "category": "dien-thoai",
    "badge": "Samsung · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Galaxy Z Fold8 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 44990000,
    "oldPrice": 48589200,
    "colors": [
      {
        "name": "Cream",
        "hex": "#F5EEDB",
        "key": "cream",
        "image": "img/phones/samsung/galaxy-z-fold8-cream.webp",
        "img": "img/phones/samsung/galaxy-z-fold8-cream.webp"
      },
      {
        "name": "Graphite",
        "hex": "#3E4044",
        "key": "graphite",
        "image": "img/phones/samsung/galaxy-z-fold8-graphite.webp",
        "img": "img/phones/samsung/galaxy-z-fold8-graphite.webp"
      },
      {
        "name": "Lavender",
        "hex": "#D7CFE3",
        "key": "lavender",
        "image": "img/phones/samsung/galaxy-z-fold8-lavender.webp",
        "img": "img/phones/samsung/galaxy-z-fold8-lavender.webp"
      },
      {
        "name": "Pistachio",
        "hex": "#C9DBCB",
        "key": "pistachio",
        "image": "img/phones/samsung/galaxy-z-fold8-pistachio.webp",
        "img": "img/phones/samsung/galaxy-z-fold8-pistachio.webp"
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
        "Galaxy Z Fold8"
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
    "sku": "GALAXY-Z-FOLD8",
    "image": "img/phones/samsung/galaxy-z-fold8-cream.webp",
    "img": "img/phones/samsung/galaxy-z-fold8-cream.webp"
  },
  "galaxy-z-flip8": {
    "id": "galaxy-z-flip8",
    "name": "Galaxy Z Flip8",
    "brand": "Samsung",
    "category": "dien-thoai",
    "badge": "Samsung · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Galaxy Z Flip8 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 25990000,
    "oldPrice": 28069200,
    "colors": [
      {
        "name": "Cream",
        "hex": "#F5EEDB",
        "key": "cream",
        "image": "img/phones/samsung/galaxy-z-flip8-cream.webp",
        "img": "img/phones/samsung/galaxy-z-flip8-cream.webp"
      },
      {
        "name": "Graphite",
        "hex": "#3E4044",
        "key": "graphite",
        "image": "img/phones/samsung/galaxy-z-flip8-graphite.webp",
        "img": "img/phones/samsung/galaxy-z-flip8-graphite.webp"
      },
      {
        "name": "Mint",
        "hex": "#C2E5D3",
        "key": "mint",
        "image": "img/phones/samsung/galaxy-z-flip8-mint.webp",
        "img": "img/phones/samsung/galaxy-z-flip8-mint.webp"
      },
      {
        "name": "Pink",
        "hex": "#F3D0D8",
        "key": "pink",
        "image": "img/phones/samsung/galaxy-z-flip8-pink.webp",
        "img": "img/phones/samsung/galaxy-z-flip8-pink.webp"
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
        "Galaxy Z Flip8"
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
    "sku": "GALAXY-Z-FLIP8",
    "image": "img/phones/samsung/galaxy-z-flip8-cream.webp",
    "img": "img/phones/samsung/galaxy-z-flip8-cream.webp"
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
  "galaxy-z-fold6": {
    "id": "galaxy-z-fold6",
    "name": "Galaxy Z Fold6",
    "brand": "Samsung",
    "category": "dien-thoai",
    "badge": "Samsung · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Galaxy Z Fold6 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 38990000,
    "oldPrice": 42109200,
    "colors": [
      {
        "name": "Silver Shadow",
        "hex": "#D8D9DD",
        "key": "silver",
        "image": "img/phones/samsung/galaxy-z-fold6-silver.webp",
        "img": "img/phones/samsung/galaxy-z-fold6-silver.webp"
      },
      {
        "name": "Navy",
        "hex": "#2C3647",
        "key": "navy",
        "image": "img/phones/samsung/galaxy-z-fold6-navy.webp",
        "img": "img/phones/samsung/galaxy-z-fold6-navy.webp"
      },
      {
        "name": "Pink",
        "hex": "#E8C6CF",
        "key": "pink",
        "image": "img/phones/samsung/galaxy-z-fold6-pink.webp",
        "img": "img/phones/samsung/galaxy-z-fold6-pink.webp"
      },
      {
        "name": "Phantom Black",
        "hex": "#262729",
        "key": "black",
        "image": "img/phones/samsung/galaxy-z-fold6-black.webp",
        "img": "img/phones/samsung/galaxy-z-fold6-black.webp"
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
        "value": "Snapdragon 8 Gen 3 for Galaxy",
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
        "Galaxy Z Fold6"
      ],
      [
        "Hãng sản xuất",
        "Samsung"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Gen 3 for Galaxy"
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
    "sku": "GALAXY-Z-FOLD6",
    "image": "img/phones/samsung/galaxy-z-fold6-silver.webp",
    "img": "img/phones/samsung/galaxy-z-fold6-silver.webp"
  },
  "galaxy-z-flip6": {
    "id": "galaxy-z-flip6",
    "name": "Galaxy Z Flip6",
    "brand": "Samsung",
    "category": "dien-thoai",
    "badge": "Samsung · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Galaxy Z Flip6 chính hãng Samsung với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 20990000,
    "oldPrice": 22669200,
    "colors": [
      {
        "name": "Silver Shadow",
        "hex": "#D8D9DD",
        "key": "silver",
        "image": "img/phones/samsung/galaxy-z-flip6-silver.webp",
        "img": "img/phones/samsung/galaxy-z-flip6-silver.webp"
      },
      {
        "name": "Yellow",
        "hex": "#F7E8BA",
        "key": "yellow",
        "image": "img/phones/samsung/galaxy-z-flip6-yellow.webp",
        "img": "img/phones/samsung/galaxy-z-flip6-yellow.webp"
      },
      {
        "name": "Blue",
        "hex": "#AECFE6",
        "key": "blue",
        "image": "img/phones/samsung/galaxy-z-flip6-blue.webp",
        "img": "img/phones/samsung/galaxy-z-flip6-blue.webp"
      },
      {
        "name": "Mint",
        "hex": "#C2E5D3",
        "key": "mint",
        "image": "img/phones/samsung/galaxy-z-flip6-mint.webp",
        "img": "img/phones/samsung/galaxy-z-flip6-mint.webp"
      },
      {
        "name": "Black",
        "hex": "#262729",
        "key": "black",
        "image": "img/phones/samsung/galaxy-z-flip6-black.webp",
        "img": "img/phones/samsung/galaxy-z-flip6-black.webp"
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
        "value": "Snapdragon 8 Gen 3 for Galaxy",
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
        "Galaxy Z Flip6"
      ],
      [
        "Hãng sản xuất",
        "Samsung"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Gen 3 for Galaxy"
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
    "sku": "GALAXY-Z-FLIP6",
    "image": "img/phones/samsung/galaxy-z-flip6-silver.webp",
    "img": "img/phones/samsung/galaxy-z-flip6-silver.webp"
  },
  "xiaomi-16-ultra": {
    "id": "xiaomi-16-ultra",
    "name": "Xiaomi 16 Ultra",
    "brand": "Xiaomi",
    "category": "dien-thoai",
    "badge": "Xiaomi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Xiaomi 16 Ultra chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 25990000,
    "oldPrice": 28069200,
    "colors": [
      {
        "name": "Trắng Gốm",
        "hex": "#ECEEF0",
        "key": "white",
        "image": "img/phones/xiaomi/xiaomi-16-ultra-white.webp",
        "img": "img/phones/xiaomi/xiaomi-16-ultra-white.webp"
      },
      {
        "name": "Xanh Ô-liu",
        "hex": "#556052",
        "key": "olive",
        "image": "img/phones/xiaomi/xiaomi-16-ultra-olive.webp",
        "img": "img/phones/xiaomi/xiaomi-16-ultra-olive.webp"
      },
      {
        "name": "Đen Huyền Bí",
        "hex": "#232426",
        "key": "black",
        "image": "img/phones/xiaomi/xiaomi-16-ultra-black.webp",
        "img": "img/phones/xiaomi/xiaomi-16-ultra-black.webp"
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
        "Xiaomi 16 Ultra"
      ],
      [
        "Hãng sản xuất",
        "Xiaomi"
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
    "sku": "XIAOMI-16-ULTRA",
    "image": "img/phones/xiaomi/xiaomi-16-ultra-white.webp",
    "img": "img/phones/xiaomi/xiaomi-16-ultra-white.webp"
  },
  "xiaomi-16-pro": {
    "id": "xiaomi-16-pro",
    "name": "Xiaomi 16 Pro",
    "brand": "Xiaomi",
    "category": "dien-thoai",
    "badge": "Xiaomi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Xiaomi 16 Pro chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 21990000,
    "oldPrice": 23749200,
    "colors": [
      {
        "name": "Tím Lụa",
        "hex": "#6A5F7A",
        "key": "purple",
        "image": "img/phones/xiaomi/xiaomi-16-pro-purple.webp",
        "img": "img/phones/xiaomi/xiaomi-16-pro-purple.webp"
      },
      {
        "name": "Xanh Băng",
        "hex": "#8FAFC9",
        "key": "blue",
        "image": "img/phones/xiaomi/xiaomi-16-pro-blue.webp",
        "img": "img/phones/xiaomi/xiaomi-16-pro-blue.webp"
      },
      {
        "name": "Đen Ánh Kim",
        "hex": "#242528",
        "key": "black",
        "image": "img/phones/xiaomi/xiaomi-16-pro-black.webp",
        "img": "img/phones/xiaomi/xiaomi-16-pro-black.webp"
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
        "Xiaomi 16 Pro"
      ],
      [
        "Hãng sản xuất",
        "Xiaomi"
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
    "sku": "XIAOMI-16-PRO",
    "image": "img/phones/xiaomi/xiaomi-16-pro-purple.webp",
    "img": "img/phones/xiaomi/xiaomi-16-pro-purple.webp"
  },
  "xiaomi-16": {
    "id": "xiaomi-16",
    "name": "Xiaomi 16",
    "brand": "Xiaomi",
    "category": "dien-thoai",
    "badge": "Xiaomi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Xiaomi 16 chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 16990000,
    "oldPrice": 18349200,
    "colors": [
      {
        "name": "Cam Hoàng Hôn",
        "hex": "#E87A4D",
        "key": "orange",
        "image": "img/phones/xiaomi/xiaomi-16-orange.webp",
        "img": "img/phones/xiaomi/xiaomi-16-orange.webp"
      },
      {
        "name": "Xanh Biển",
        "hex": "#4E89AE",
        "key": "blue",
        "image": "img/phones/xiaomi/xiaomi-16-blue.webp",
        "img": "img/phones/xiaomi/xiaomi-16-blue.webp"
      },
      {
        "name": "Đen Tuyền",
        "hex": "#232426",
        "key": "black",
        "image": "img/phones/xiaomi/xiaomi-16-black.webp",
        "img": "img/phones/xiaomi/xiaomi-16-black.webp"
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
        "Xiaomi 16"
      ],
      [
        "Hãng sản xuất",
        "Xiaomi"
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
    "sku": "XIAOMI-16",
    "image": "img/phones/xiaomi/xiaomi-16-orange.webp",
    "img": "img/phones/xiaomi/xiaomi-16-orange.webp"
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
  "xiaomi-14-ultra": {
    "id": "xiaomi-14-ultra",
    "name": "Xiaomi 14 Ultra",
    "brand": "Xiaomi",
    "category": "dien-thoai",
    "badge": "Xiaomi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Xiaomi 14 Ultra chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 21990000,
    "oldPrice": 23749200,
    "colors": [
      {
        "name": "Titan Thể Thao",
        "hex": "#A3A4A8",
        "key": "silver",
        "image": "img/phones/xiaomi/xiaomi-14-ultra-silver.webp",
        "img": "img/phones/xiaomi/xiaomi-14-ultra-silver.webp"
      },
      {
        "name": "Trắng Tinh Khiết",
        "hex": "#F5F6F8",
        "key": "white",
        "image": "img/phones/xiaomi/xiaomi-14-ultra-white.webp",
        "img": "img/phones/xiaomi/xiaomi-14-ultra-white.webp"
      },
      {
        "name": "Đen Da Thuần",
        "hex": "#222326",
        "key": "black",
        "image": "img/phones/xiaomi/xiaomi-14-ultra-black.webp",
        "img": "img/phones/xiaomi/xiaomi-14-ultra-black.webp"
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
        "value": "Snapdragon 8 Gen 3",
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
        "Xiaomi 14 Ultra"
      ],
      [
        "Hãng sản xuất",
        "Xiaomi"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Gen 3"
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
    "sku": "XIAOMI-14-ULTRA",
    "image": "img/phones/xiaomi/xiaomi-14-ultra-silver.webp",
    "img": "img/phones/xiaomi/xiaomi-14-ultra-silver.webp"
  },
  "xiaomi-14-pro": {
    "id": "xiaomi-14-pro",
    "name": "Xiaomi 14 Pro",
    "brand": "Xiaomi",
    "category": "dien-thoai",
    "badge": "Xiaomi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Xiaomi 14 Pro chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 17990000,
    "oldPrice": 19429200,
    "colors": [
      {
        "name": "Xanh Ngọc Bích",
        "hex": "#436056",
        "key": "green",
        "image": "img/phones/xiaomi/xiaomi-14-pro-green.webp",
        "img": "img/phones/xiaomi/xiaomi-14-pro-green.webp"
      },
      {
        "name": "Xanh Đá",
        "hex": "#526E7F",
        "key": "blue",
        "image": "img/phones/xiaomi/xiaomi-14-pro-blue.webp",
        "img": "img/phones/xiaomi/xiaomi-14-pro-blue.webp"
      },
      {
        "name": "Trắng Băng",
        "hex": "#F2F4F8",
        "key": "white",
        "image": "img/phones/xiaomi/xiaomi-14-pro-white.webp",
        "img": "img/phones/xiaomi/xiaomi-14-pro-white.webp"
      },
      {
        "name": "Đen Nhám",
        "hex": "#28292B",
        "key": "black",
        "image": "img/phones/xiaomi/xiaomi-14-pro-black.webp",
        "img": "img/phones/xiaomi/xiaomi-14-pro-black.webp"
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
        "value": "Snapdragon 8 Gen 3",
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
        "Xiaomi 14 Pro"
      ],
      [
        "Hãng sản xuất",
        "Xiaomi"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Gen 3"
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
    "sku": "XIAOMI-14-PRO",
    "image": "img/phones/xiaomi/xiaomi-14-pro-green.webp",
    "img": "img/phones/xiaomi/xiaomi-14-pro-green.webp"
  },
  "xiaomi-14": {
    "id": "xiaomi-14",
    "name": "Xiaomi 14",
    "brand": "Xiaomi",
    "category": "dien-thoai",
    "badge": "Xiaomi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Xiaomi 14 chính hãng Xiaomi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 13990000,
    "oldPrice": 15109200,
    "colors": [
      {
        "name": "Xanh Ngọc",
        "hex": "#436056",
        "key": "green",
        "image": "img/phones/xiaomi/xiaomi-14-green.webp",
        "img": "img/phones/xiaomi/xiaomi-14-green.webp"
      },
      {
        "name": "Hồng Tuyết",
        "hex": "#F2CCD7",
        "key": "pink",
        "image": "img/phones/xiaomi/xiaomi-14-pink.webp",
        "img": "img/phones/xiaomi/xiaomi-14-pink.webp"
      },
      {
        "name": "Trắng Mây",
        "hex": "#F5F6F8",
        "key": "white",
        "image": "img/phones/xiaomi/xiaomi-14-white.webp",
        "img": "img/phones/xiaomi/xiaomi-14-white.webp"
      },
      {
        "name": "Đen Cổ Điển",
        "hex": "#262729",
        "key": "black",
        "image": "img/phones/xiaomi/xiaomi-14-black.webp",
        "img": "img/phones/xiaomi/xiaomi-14-black.webp"
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
        "value": "Snapdragon 8 Gen 3",
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
        "Xiaomi 14"
      ],
      [
        "Hãng sản xuất",
        "Xiaomi"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Gen 3"
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
    "sku": "XIAOMI-14",
    "image": "img/phones/xiaomi/xiaomi-14-green.webp",
    "img": "img/phones/xiaomi/xiaomi-14-green.webp"
  },
  "find-x9-ultra": {
    "id": "find-x9-ultra",
    "name": "Find X9 Ultra",
    "brand": "OPPO",
    "category": "dien-thoai",
    "badge": "OPPO · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Find X9 Ultra chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 27990000,
    "oldPrice": 30229200,
    "colors": [
      {
        "name": "Cam Sa Mạc",
        "hex": "#D97746",
        "key": "orange",
        "image": "img/phones/oppo/find-x9-ultra-orange.webp",
        "img": "img/phones/oppo/find-x9-ultra-orange.webp"
      },
      {
        "name": "Đen Vũ Trụ",
        "hex": "#232426",
        "key": "black",
        "image": "img/phones/oppo/find-x9-ultra-black.webp",
        "img": "img/phones/oppo/find-x9-ultra-black.webp"
      },
      {
        "name": "Bạc Titan",
        "hex": "#D1D4DA",
        "key": "silver",
        "image": "img/phones/oppo/find-x9-ultra-silver.webp",
        "img": "img/phones/oppo/find-x9-ultra-silver.webp"
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
        "value": "Snapdragon 8 Elite / Dimensity 9400+",
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
        "Find X9 Ultra"
      ],
      [
        "Hãng sản xuất",
        "OPPO"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Elite / Dimensity 9400+"
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
    "sku": "FIND-X9-ULTRA",
    "image": "img/phones/oppo/find-x9-ultra-orange.webp",
    "img": "img/phones/oppo/find-x9-ultra-orange.webp"
  },
  "find-x9-pro": {
    "id": "find-x9-pro",
    "name": "Find X9 Pro",
    "brand": "OPPO",
    "category": "dien-thoai",
    "badge": "OPPO · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Find X9 Pro chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 22990000,
    "oldPrice": 24829200,
    "colors": [
      {
        "name": "Trắng Ánh Trăng",
        "hex": "#F5F6F8",
        "key": "white",
        "image": "img/phones/oppo/find-x9-pro-white.webp",
        "img": "img/phones/oppo/find-x9-pro-white.webp"
      },
      {
        "name": "Đen Huyền Vũ",
        "hex": "#222325",
        "key": "black",
        "image": "img/phones/oppo/find-x9-pro-black.webp",
        "img": "img/phones/oppo/find-x9-pro-black.webp"
      },
      {
        "name": "Đỏ Rượu",
        "hex": "#7D2B35",
        "key": "red",
        "image": "img/phones/oppo/find-x9-pro-red.webp",
        "img": "img/phones/oppo/find-x9-pro-red.webp"
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
        "value": "Snapdragon 8 Elite / Dimensity 9400+",
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
        "Find X9 Pro"
      ],
      [
        "Hãng sản xuất",
        "OPPO"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Elite / Dimensity 9400+"
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
    "sku": "FIND-X9-PRO",
    "image": "img/phones/oppo/find-x9-pro-white.webp",
    "img": "img/phones/oppo/find-x9-pro-white.webp"
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
  "find-n5": {
    "id": "find-n5",
    "name": "Find N5",
    "brand": "OPPO",
    "category": "dien-thoai",
    "badge": "OPPO · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Find N5 chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 39990000,
    "oldPrice": 43189200,
    "colors": [
      {
        "name": "Trắng Lông Vũ",
        "hex": "#F5F6F8",
        "key": "white",
        "image": "img/phones/oppo/find-n5-white.webp",
        "img": "img/phones/oppo/find-n5-white.webp"
      },
      {
        "name": "Than Chì Titan",
        "hex": "#333539",
        "key": "black",
        "image": "img/phones/oppo/find-n5-black.webp",
        "img": "img/phones/oppo/find-n5-black.webp"
      },
      {
        "name": "Vàng Satin",
        "hex": "#E8D8B8",
        "key": "gold",
        "image": "img/phones/oppo/find-n5-gold.webp",
        "img": "img/phones/oppo/find-n5-gold.webp"
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
        "value": "Snapdragon 8 Elite / Dimensity 9400+",
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
        "Find N5"
      ],
      [
        "Hãng sản xuất",
        "OPPO"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 8 Elite / Dimensity 9400+"
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
    "sku": "FIND-N5",
    "image": "img/phones/oppo/find-n5-white.webp",
    "img": "img/phones/oppo/find-n5-white.webp"
  },
  "find-n3-flip": {
    "id": "find-n3-flip",
    "name": "Find N3 Flip",
    "brand": "OPPO",
    "category": "dien-thoai",
    "badge": "OPPO · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Find N3 Flip chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 18990000,
    "oldPrice": 20509200,
    "colors": [
      {
        "name": "Vàng Ánh Kim",
        "hex": "#F2E5C9",
        "key": "gold",
        "image": "img/phones/oppo/find-n3-flip-gold.webp",
        "img": "img/phones/oppo/find-n3-flip-gold.webp"
      },
      {
        "name": "Đen Huyền Diệu",
        "hex": "#262729",
        "key": "black",
        "image": "img/phones/oppo/find-n3-flip-black.webp",
        "img": "img/phones/oppo/find-n3-flip-black.webp"
      },
      {
        "name": "Hồng Sương Mù",
        "hex": "#F3D3DC",
        "key": "pink",
        "image": "img/phones/oppo/find-n3-flip-pink.webp",
        "img": "img/phones/oppo/find-n3-flip-pink.webp"
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
        "value": "MediaTek Dimensity 7300-Energy",
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
        "Find N3 Flip"
      ],
      [
        "Hãng sản xuất",
        "OPPO"
      ],
      [
        "Vi xử lý (CPU)",
        "MediaTek Dimensity 7300-Energy"
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
    "sku": "FIND-N3-FLIP",
    "image": "img/phones/oppo/find-n3-flip-gold.webp",
    "img": "img/phones/oppo/find-n3-flip-gold.webp"
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
  "reno12-pro-5g": {
    "id": "reno12-pro-5g",
    "name": "Reno12 Pro 5G",
    "brand": "OPPO",
    "category": "dien-thoai",
    "badge": "OPPO · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Reno12 Pro 5G chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 13490000,
    "oldPrice": 14569200,
    "colors": [
      {
        "name": "Nâu Không Gian",
        "hex": "#5C4D4A",
        "key": "brown",
        "image": "img/phones/oppo/reno12-pro-5g-brown.webp",
        "img": "img/phones/oppo/reno12-pro-5g-brown.webp"
      },
      {
        "name": "Vàng Hoàng Hôn",
        "hex": "#EAD5A8",
        "key": "gold",
        "image": "img/phones/oppo/reno12-pro-5g-gold.webp",
        "img": "img/phones/oppo/reno12-pro-5g-gold.webp"
      },
      {
        "name": "Nâu Mờ",
        "hex": "#483D3B",
        "key": "matte-brown",
        "image": "img/phones/oppo/reno12-pro-5g-matte-brown.webp",
        "img": "img/phones/oppo/reno12-pro-5g-matte-brown.webp"
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
        "value": "MediaTek Dimensity 7300-Energy",
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
        "Reno12 Pro 5G"
      ],
      [
        "Hãng sản xuất",
        "OPPO"
      ],
      [
        "Vi xử lý (CPU)",
        "MediaTek Dimensity 7300-Energy"
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
    "sku": "RENO12-PRO-5G",
    "image": "img/phones/oppo/reno12-pro-5g-brown.webp",
    "img": "img/phones/oppo/reno12-pro-5g-brown.webp"
  },
  "reno12-5g": {
    "id": "reno12-5g",
    "name": "Reno12 5G",
    "brand": "OPPO",
    "category": "dien-thoai",
    "badge": "OPPO · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Reno12 5G chính hãng OPPO với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 10490000,
    "oldPrice": 11329200,
    "colors": [
      {
        "name": "Bạc Thiên Thạch",
        "hex": "#D5D8DC",
        "key": "silver",
        "image": "img/phones/oppo/reno12-5g-silver.webp",
        "img": "img/phones/oppo/reno12-5g-silver.webp"
      },
      {
        "name": "Hồng Hoàng Hôn",
        "hex": "#F2C7D1",
        "key": "pink",
        "image": "img/phones/oppo/reno12-5g-pink.webp",
        "img": "img/phones/oppo/reno12-5g-pink.webp"
      },
      {
        "name": "Nâu Nhám",
        "hex": "#4A3F3D",
        "key": "brown",
        "image": "img/phones/oppo/reno12-5g-brown.webp",
        "img": "img/phones/oppo/reno12-5g-brown.webp"
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
        "value": "MediaTek Dimensity 7300-Energy",
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
        "Reno12 5G"
      ],
      [
        "Hãng sản xuất",
        "OPPO"
      ],
      [
        "Vi xử lý (CPU)",
        "MediaTek Dimensity 7300-Energy"
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
    "sku": "RENO12-5G",
    "image": "img/phones/oppo/reno12-5g-silver.webp",
    "img": "img/phones/oppo/reno12-5g-silver.webp"
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
  "redmi-k70-ultra": {
    "id": "redmi-k70-ultra",
    "name": "Redmi K70 Ultra",
    "brand": "Redmi",
    "category": "dien-thoai",
    "badge": "Redmi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Redmi K70 Ultra chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 12990000,
    "oldPrice": 14029200,
    "colors": [
      {
        "name": "Băng Pha Lê",
        "hex": "#B2D0E6",
        "key": "ice-blue",
        "image": "img/phones/redmi/redmi-k70-ultra-ice-blue.webp",
        "img": "img/phones/redmi/redmi-k70-ultra-ice-blue.webp"
      },
      {
        "name": "Đen Lông Vũ",
        "hex": "#242527",
        "key": "black",
        "image": "img/phones/redmi/redmi-k70-ultra-black.webp",
        "img": "img/phones/redmi/redmi-k70-ultra-black.webp"
      },
      {
        "name": "Trắng Tinh Tuyết",
        "hex": "#F5F6F8",
        "key": "white",
        "image": "img/phones/redmi/redmi-k70-ultra-white.webp",
        "img": "img/phones/redmi/redmi-k70-ultra-white.webp"
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
        "value": "MediaTek Dimensity 9300+",
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
        "Redmi K70 Ultra"
      ],
      [
        "Hãng sản xuất",
        "Redmi"
      ],
      [
        "Vi xử lý (CPU)",
        "MediaTek Dimensity 9300+"
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
    "sku": "REDMI-K70-ULTRA",
    "image": "img/phones/redmi/redmi-k70-ultra-ice-blue.webp",
    "img": "img/phones/redmi/redmi-k70-ultra-ice-blue.webp"
  },
  "redmi-k70": {
    "id": "redmi-k70",
    "name": "Redmi K70",
    "brand": "Redmi",
    "category": "dien-thoai",
    "badge": "Redmi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Redmi K70 chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 9490000,
    "oldPrice": 10249200,
    "colors": [
      {
        "name": "Xanh Nguyệt Trúc",
        "hex": "#658174",
        "key": "green",
        "image": "img/phones/redmi/redmi-k70-green.webp",
        "img": "img/phones/redmi/redmi-k70-green.webp"
      },
      {
        "name": "Tím Cà Nhạt",
        "hex": "#8A7B95",
        "key": "purple",
        "image": "img/phones/redmi/redmi-k70-purple.webp",
        "img": "img/phones/redmi/redmi-k70-purple.webp"
      },
      {
        "name": "Trắng Tinh Tuyết",
        "hex": "#F5F6F8",
        "key": "white",
        "image": "img/phones/redmi/redmi-k70-white.webp",
        "img": "img/phones/redmi/redmi-k70-white.webp"
      },
      {
        "name": "Đen Mực Vũ",
        "hex": "#242527",
        "key": "black",
        "image": "img/phones/redmi/redmi-k70-black.webp",
        "img": "img/phones/redmi/redmi-k70-black.webp"
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
        "value": "MediaTek Dimensity 9300+",
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
        "Redmi K70"
      ],
      [
        "Hãng sản xuất",
        "Redmi"
      ],
      [
        "Vi xử lý (CPU)",
        "MediaTek Dimensity 9300+"
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
    "sku": "REDMI-K70",
    "image": "img/phones/redmi/redmi-k70-green.webp",
    "img": "img/phones/redmi/redmi-k70-green.webp"
  },
  "redmi-note-15-pro-plus": {
    "id": "redmi-note-15-pro-plus",
    "name": "Redmi Note 15 Pro+",
    "brand": "Redmi",
    "category": "dien-thoai",
    "badge": "Redmi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Redmi Note 15 Pro+ chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 9990000,
    "oldPrice": 10789200,
    "colors": [
      {
        "name": "Trắng Sứ Gương",
        "hex": "#F7F8FA",
        "key": "white",
        "image": "img/phones/redmi/redmi-note-15-pro-plus-white.webp",
        "img": "img/phones/redmi/redmi-note-15-pro-plus-white.webp"
      },
      {
        "name": "Tím Hoàng Hôn",
        "hex": "#8B739E",
        "key": "purple",
        "image": "img/phones/redmi/redmi-note-15-pro-plus-purple.webp",
        "img": "img/phones/redmi/redmi-note-15-pro-plus-purple.webp"
      },
      {
        "name": "Đen Bóng Đêm",
        "hex": "#232426",
        "key": "black",
        "image": "img/phones/redmi/redmi-note-15-pro-plus-black.webp",
        "img": "img/phones/redmi/redmi-note-15-pro-plus-black.webp"
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
        "value": "Snapdragon 7s Gen 3",
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
        "Redmi Note 15 Pro+"
      ],
      [
        "Hãng sản xuất",
        "Redmi"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 7s Gen 3"
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
    "sku": "REDMI-NOTE-15-PRO-PLUS",
    "image": "img/phones/redmi/redmi-note-15-pro-plus-white.webp",
    "img": "img/phones/redmi/redmi-note-15-pro-plus-white.webp"
  },
  "redmi-note-15-pro": {
    "id": "redmi-note-15-pro",
    "name": "Redmi Note 15 Pro",
    "brand": "Redmi",
    "category": "dien-thoai",
    "badge": "Redmi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Redmi Note 15 Pro chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 7990000,
    "oldPrice": 8629200,
    "colors": [
      {
        "name": "Xanh Trời Sao",
        "hex": "#4B6B94",
        "key": "blue",
        "image": "img/phones/redmi/redmi-note-15-pro-blue.webp",
        "img": "img/phones/redmi/redmi-note-15-pro-blue.webp"
      },
      {
        "name": "Xám Titan",
        "hex": "#6C7079",
        "key": "gray",
        "image": "img/phones/redmi/redmi-note-15-pro-gray.webp",
        "img": "img/phones/redmi/redmi-note-15-pro-gray.webp"
      },
      {
        "name": "Đen Bóng Đêm",
        "hex": "#232426",
        "key": "black",
        "image": "img/phones/redmi/redmi-note-15-pro-black.webp",
        "img": "img/phones/redmi/redmi-note-15-pro-black.webp"
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
        "value": "Snapdragon 7s Gen 3",
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
        "Redmi Note 15 Pro"
      ],
      [
        "Hãng sản xuất",
        "Redmi"
      ],
      [
        "Vi xử lý (CPU)",
        "Snapdragon 7s Gen 3"
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
    "sku": "REDMI-NOTE-15-PRO",
    "image": "img/phones/redmi/redmi-note-15-pro-blue.webp",
    "img": "img/phones/redmi/redmi-note-15-pro-blue.webp"
  },
  "redmi-note-14-pro-plus": {
    "id": "redmi-note-14-pro-plus",
    "name": "Redmi Note 14 Pro+",
    "brand": "Redmi",
    "category": "dien-thoai",
    "badge": "Redmi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Redmi Note 14 Pro+ chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 8490000,
    "oldPrice": 9169200,
    "colors": [
      {
        "name": "Trắng Sứ Gương",
        "hex": "#F7F8FA",
        "key": "white",
        "image": "img/phones/redmi/redmi-note-14-pro-plus-white.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-plus-white.webp"
      },
      {
        "name": "Tím Hoàng Hôn",
        "hex": "#8B739E",
        "key": "purple",
        "image": "img/phones/redmi/redmi-note-14-pro-plus-purple.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-plus-purple.webp"
      },
      {
        "name": "Đen Bóng Đêm",
        "hex": "#232426",
        "key": "black",
        "image": "img/phones/redmi/redmi-note-14-pro-plus-black.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-plus-black.webp"
      },
      {
        "name": "Xanh Ngọc",
        "hex": "#4F8176",
        "key": "green",
        "image": "img/phones/redmi/redmi-note-14-pro-plus-green.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-plus-green.webp"
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
        "Redmi Note 14 Pro+"
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
    "sku": "REDMI-NOTE-14-PRO-PLUS",
    "image": "img/phones/redmi/redmi-note-14-pro-plus-white.webp",
    "img": "img/phones/redmi/redmi-note-14-pro-plus-white.webp"
  },
  "redmi-note-14-pro": {
    "id": "redmi-note-14-pro",
    "name": "Redmi Note 14 Pro",
    "brand": "Redmi",
    "category": "dien-thoai",
    "badge": "Redmi · Flagship",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Tuyệt phẩm Redmi Note 14 Pro chính hãng Redmi với công nghệ đột phá và bảo hành minh bạch 24 tháng.",
    "basePrice": 6990000,
    "oldPrice": 7549200,
    "colors": [
      {
        "name": "Tím Hoàng Hôn",
        "hex": "#8B739E",
        "key": "purple",
        "image": "img/phones/redmi/redmi-note-14-pro-purple.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-purple.webp"
      },
      {
        "name": "Xanh Ảo Ảnh",
        "hex": "#486E95",
        "key": "blue",
        "image": "img/phones/redmi/redmi-note-14-pro-blue.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-blue.webp"
      },
      {
        "name": "Trắng Sứ Gương",
        "hex": "#F7F8FA",
        "key": "white",
        "image": "img/phones/redmi/redmi-note-14-pro-white.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-white.webp"
      },
      {
        "name": "Đen Bóng Đêm",
        "hex": "#232426",
        "key": "black",
        "image": "img/phones/redmi/redmi-note-14-pro-black.webp",
        "img": "img/phones/redmi/redmi-note-14-pro-black.webp"
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
        "Redmi Note 14 Pro"
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
    "sku": "REDMI-NOTE-14-PRO",
    "image": "img/phones/redmi/redmi-note-14-pro-purple.webp",
    "img": "img/phones/redmi/redmi-note-14-pro-purple.webp"
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
  "macbook-pro": {
    "id": "macbook-pro",
    "name": "MacBook Pro 16\" (Chip M4 Pro / M4 Max)",
    "brand": "Apple",
    "category": "laptop",
    "badge": "Apple · Siêu Cấp",
    "badgeSub": "Chính Hãng SA/A",
    "tagline": "Quái vật hiệu năng di động với chip Apple M4 Pro / M4 Max, màn hình Liquid Retina XDR.",
    "basePrice": 59990000,
    "oldPrice": 64990000,
    "colors": [
      {
        "name": "Xám Không Gian",
        "key": "space-black",
        "hex": "#2E3033",
        "image": "SanPham/SanPham/Laptop/MacBook Pro/Tiêu Chuẩn.svg",
        "img": "SanPham/SanPham/Laptop/MacBook Pro/Tiêu Chuẩn.svg"
      },
      {
        "name": "Bạc Ánh Kim",
        "key": "silver",
        "hex": "#E3E4E6",
        "image": "SanPham/SanPham/Laptop/MacBook Pro/Tiêu Chuẩn.svg",
        "img": "SanPham/SanPham/Laptop/MacBook Pro/Tiêu Chuẩn.svg"
      }
    ],
    "extraImages": [],
    "variantLabel": "Cấu hình Chip & Bộ nhớ",
    "variants": [
      {
        "label": "M4 Pro (24GB / 512GB)",
        "delta": 0,
        "discount": "-8%"
      },
      {
        "label": "M4 Pro (48GB / 1TB)",
        "delta": 12000000,
        "discount": "-6%"
      },
      {
        "label": "M4 Max (64GB / 1TB)",
        "delta": 25000000,
        "discount": "-5%"
      }
    ],
    "perks": [
      "Tặng balo chống sốc cao cấp VLU Store trị giá 1.200.000₫",
      "Bảo hành AppleCare+ chính hãng toàn quốc 12 tháng",
      "Hỗ trợ cài đặt phần mềm đồ họa chuyên nghiệp miễn phí",
      "Giao nhanh trong 2 giờ tại khu vực TP.HCM"
    ],
    "highlights": [
      {
        "icon": "screen",
        "title": "Màn hình XDR",
        "value": "Liquid Retina XDR 16.2\"",
        "bullets": [
          "Độ sáng 1600 nits đỉnh cao",
          "Công nghệ ProMotion 120Hz mượt mà",
          "Độ phân giải 3456 x 2234 cực nét"
        ]
      },
      {
        "icon": "cpu",
        "title": "Hiệu năng",
        "value": "Apple M4 Pro / M4 Max",
        "bullets": [
          "14-core CPU, lên tới 32-core GPU",
          "Băng thông bộ nhớ 273GB/s",
          "Băng thông tăng tốc AI Neural Engine 16 lõi"
        ]
      },
      {
        "icon": "battery",
        "title": "Thời lượng Pin",
        "value": "Lên tới 24 Giờ liên tục",
        "bullets": [
          "Pin bền bỉ nhất trong dòng máy Mac",
          "Sạc nhanh MagSafe 3 công suất 140W"
        ]
      },
      {
        "icon": "camera",
        "title": "Cổng kết nối",
        "value": "Đầy đủ Thunderbolt 5",
        "bullets": [
          "3 cổng Thunderbolt 5 băng thông 120Gb/s",
          "HDMI 8K, khe thẻ SDXC, jack 3.5mm"
        ]
      }
    ],
    "specs": [
      [
        "Màn hình",
        "16.2 inch Liquid Retina XDR (3456 x 2234), 120Hz"
      ],
      [
        "Vi xử lý",
        "Apple M4 Pro (14-core CPU, 20-core GPU) / M4 Max"
      ],
      [
        "Bộ nhớ RAM",
        "24GB / 48GB / 64GB Unified Memory"
      ],
      [
        "Ổ cứng lưu trữ",
        "512GB / 1TB SSD NVMe tốc độ 7.4GB/s"
      ],
      [
        "Pin & Nguồn",
        "100Wh Li-Poly, sạc nhanh 140W MagSafe 3"
      ],
      [
        "Trọng lượng",
        "2.14 kg"
      ],
      [
        "Hệ điều hành",
        "macOS Sequoia"
      ]
    ],
    "sku": "MBP16-M4",
    "image": "SanPham/SanPham/Laptop/MacBook Pro/Tiêu Chuẩn.svg",
    "img": "SanPham/SanPham/Laptop/MacBook Pro/Tiêu Chuẩn.svg"
  },
  "ipad-pro": {
    "id": "ipad-pro",
    "name": "iPad Pro 13\" M4 (OLED Siêu Mỏng)",
    "brand": "Apple",
    "category": "ipad",
    "badge": "Apple · Đỉnh Cao",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Thiết kế mỏng kỷ lục 5.1mm, màn hình Ultra Retina XDR OLED hai lớp đột phá cùng chip M4.",
    "basePrice": 37990000,
    "oldPrice": 39990000,
    "colors": [
      {
        "name": "Đen Không Gian",
        "key": "space-black",
        "hex": "#262729",
        "image": "SanPham/SanPham/iPad/iPad Pro/Tiêu Chuẩn.svg",
        "img": "SanPham/SanPham/iPad/iPad Pro/Tiêu Chuẩn.svg"
      },
      {
        "name": "Bạc Ánh Kim",
        "key": "silver",
        "hex": "#E3E4E6",
        "image": "SanPham/SanPham/iPad/iPad Pro/Tiêu Chuẩn.svg",
        "img": "SanPham/SanPham/iPad/iPad Pro/Tiêu Chuẩn.svg"
      }
    ],
    "extraImages": [],
    "variantLabel": "Bộ nhớ lưu trữ & Kết nối",
    "variants": [
      {
        "label": "256GB (Wi-Fi)",
        "delta": 0,
        "discount": "-5%"
      },
      {
        "label": "512GB (Wi-Fi)",
        "delta": 5000000,
        "discount": "-5%"
      },
      {
        "label": "1TB (Wi-Fi + 5G)",
        "delta": 16000000,
        "discount": "-4%"
      }
    ],
    "perks": [
      "Thu cũ đổi mới trợ giá lên tới 3.000.000₫",
      "Giảm 500.000₫ khi mua kèm Apple Pencil Pro",
      "Bảo hành chính hãng 12 tháng 1 đổi 1"
    ],
    "highlights": [
      {
        "icon": "screen",
        "title": "Tandem OLED",
        "value": "Ultra Retina XDR 13\"",
        "bullets": [
          "Độ tương phản 2.000.000:1",
          "Độ sáng cực đại 1600 nits XDR",
          "Kính khắc cấu trúc nano tùy chọn"
        ]
      },
      {
        "icon": "cpu",
        "title": "Sức mạnh M4",
        "value": "Apple Silicon M4",
        "bullets": [
          "Hiệu năng đồ họa gấp 4 lần M2",
          "Tăng tốc phần cứng Ray Tracing",
          "Neural Engine 38 nghìn tỷ phép tính/giây"
        ]
      }
    ],
    "specs": [
      [
        "Màn hình",
        "13-inch Ultra Retina XDR OLED kép, 120Hz"
      ],
      [
        "Vi xử lý",
        "Apple M4 chip (9-core CPU, 10-core GPU)"
      ],
      [
        "Độ mỏng",
        "5.1 mm (Mỏng nhất lịch sử Apple)"
      ],
      [
        "Hệ điều hành",
        "iPadOS 18"
      ]
    ],
    "sku": "IPAD-PRO-13-M4",
    "image": "SanPham/SanPham/iPad/iPad Pro/Tiêu Chuẩn.svg",
    "img": "SanPham/SanPham/iPad/iPad Pro/Tiêu Chuẩn.svg"
  },
  "airpods-pro-2": {
    "id": "airpods-pro-2",
    "name": "AirPods Pro 2 (Hộp sạc USB-C)",
    "brand": "Apple",
    "category": "tai-nghe",
    "badge": "Apple · Âm Thanh",
    "badgeSub": "Chính Hãng VN/A",
    "tagline": "Chống ồn chủ động đỉnh cao gấp 2 lần, âm thanh thích ứng và cổng USB-C tiện lợi.",
    "basePrice": 5690000,
    "oldPrice": 6190000,
    "colors": [
      {
        "name": "Trắng Tinh Khiết",
        "key": "white",
        "hex": "#FFFFFF",
        "image": "SanPham/SanPham/Tai nghe/AirPods Pro 2/Tiêu Chuẩn.svg",
        "img": "SanPham/SanPham/Tai nghe/AirPods Pro 2/Tiêu Chuẩn.svg"
      }
    ],
    "extraImages": [],
    "variantLabel": "Phiên bản hộp sạc",
    "variants": [
      {
        "label": "Hộp Sạc USB-C MagSafe",
        "delta": 0,
        "discount": "-8%"
      }
    ],
    "perks": [
      "Tặng ốp bảo vệ silicon cao cấp",
      "Bảo hành chính hãng 12 tháng tại các trung tâm Apple ủy quyền"
    ],
    "highlights": [
      {
        "icon": "cpu",
        "title": "Chip H2",
        "value": "Âm thanh Đột Phá",
        "bullets": [
          "Chống ồn chủ động gấp 2 lần",
          "Âm thanh Không Gian cá nhân hóa",
          "Thời lượng pin 6h liên tục (30h với hộp)"
        ]
      }
    ],
    "specs": [
      [
        "Chipset",
        "Apple H2 trong tai nghe, U1 trong hộp sạc"
      ],
      [
        "Cổng sạc",
        "USB-C, MagSafe, sạc không dây Qi"
      ],
      [
        "Chống nước",
        "Chuẩn IP54 cho cả tai nghe và hộp sạc"
      ]
    ],
    "sku": "APP2-USBC",
    "image": "SanPham/SanPham/Tai nghe/AirPods Pro 2/Tiêu Chuẩn.svg",
    "img": "SanPham/SanPham/Tai nghe/AirPods Pro 2/Tiêu Chuẩn.svg"
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
        "image": "SanPham/SanPham/Dong ho/Apple Watch Ultra 3/Tiêu Chuẩn.svg",
        "img": "SanPham/SanPham/Dong ho/Apple Watch Ultra 3/Tiêu Chuẩn.svg"
      },
      {
        "name": "Titan Đen Satin",
        "key": "black",
        "hex": "#262729",
        "image": "SanPham/SanPham/Dong ho/Apple Watch Ultra 3/Tiêu Chuẩn.svg",
        "img": "SanPham/SanPham/Dong ho/Apple Watch Ultra 3/Tiêu Chuẩn.svg"
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
    "image": "SanPham/SanPham/Dong ho/Apple Watch Ultra 3/Tiêu Chuẩn.svg",
    "img": "SanPham/SanPham/Dong ho/Apple Watch Ultra 3/Tiêu Chuẩn.svg"
  }
};

  // Helper tìm kiếm sản phẩm theo ID hoặc slug hoặc tên
  function findProduct(query) {
    if (!query) return null;
    var raw = query.toString().trim();
    var slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // 1. Khớp chính xác slug trong CATALOG
    if (CATALOG[slug]) return CATALOG[slug];

    // 2. Khớp theo tên chuẩn xác
    for (var k in CATALOG) {
      if (CATALOG[k].name && CATALOG[k].name.toLowerCase() === raw.toLowerCase()) {
        return CATALOG[k];
      }
    }

    // 3. Khớp một phần slug (ưu tiên khớp dài nhất)
    var matches = [];
    for (var k2 in CATALOG) {
      if (slug.indexOf(k2) !== -1 || k2.indexOf(slug) !== -1) {
        matches.push(CATALOG[k2]);
      }
    }
    if (matches.length > 0) {
      matches.sort(function (a, b) { return b.id.length - a.id.length; });
      return matches[0];
    }

    return null;
  }

  // Đưa ra phạm vi toàn cục
  global.VLU_COLOR_HEX = COLOR_HEX;
  global.VLU_GET_COLOR_HEX = getColorHex;
  global.VLU_CATALOG = CATALOG;
  global.VLU_FIND_PRODUCT = findProduct;

})(typeof window !== 'undefined' ? window : this);
