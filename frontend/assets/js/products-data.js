/**
 * VLU FLAGSHIP STORE – Centralized Product Catalog Database
 * Catalog chuẩn 115 sản phẩm dùng chung cho cửa hàng, chi tiết và quản trị.
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

  function productSlug(value) {
    return value.toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
      product.image = product.image || placeholder;
      product.img = product.img || product.image;
      product.colors = Array.isArray(product.colors) && product.colors.length
        ? product.colors
        : [{ name: 'Mặc định', key: 'default', hex: '#CBD5E1', image: placeholder, img: placeholder }];
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

  // Helper tìm kiếm sản phẩm theo ID hoặc slug hoặc tên
  function findProduct(query) {
    if (!query) return null;
    var raw = query.toString().trim();
    var slug = productSlug(raw);
    
    // 1. Khớp chính xác slug trong CATALOG
    if (CATALOG[slug]) return CATALOG[slug];
    if (PRODUCT_ID_ALIASES[slug] && CATALOG[PRODUCT_ID_ALIASES[slug]]) return CATALOG[PRODUCT_ID_ALIASES[slug]];

    // 2. Khớp theo tên chuẩn xác
    for (var k in CATALOG) {
      if (CATALOG[k].name && CATALOG[k].name.toLowerCase() === raw.toLowerCase()) {
        return CATALOG[k];
      }
    }

    return null;
  }

  // Đưa ra phạm vi toàn cục
  global.VLU_COLOR_HEX = COLOR_HEX;
  global.VLU_GET_COLOR_HEX = getColorHex;
  global.VLU_CATALOG = CATALOG;
  global.VLU_PRODUCT_ID_ALIASES = PRODUCT_ID_ALIASES;
  global.VLU_CATALOG_SPEC = CATALOG_SPEC;
  global.VLU_FIND_PRODUCT = findProduct;

})(typeof window !== 'undefined' ? window : this);
