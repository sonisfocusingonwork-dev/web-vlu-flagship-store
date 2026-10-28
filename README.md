# VLU FLAGSHIP STORE – Cấu Trúc Dự Án (FE & BE)

Dự án website thương mại điện tử công nghệ cao cấp **VLU FLAGSHIP STORE** được thiết kế theo phong cách Apple 2026 Glassmorphic. Toàn bộ mã nguồn đã được sắp xếp khoa học, phân chia rạch ròi giữa **Frontend (FE)** và **Backend (BE)**.

---

## 📁 Cấu Trúc Thư Mục Chuẩn Hóa

```text
web-dien-tu/
│
├── 📂 backend/                              # [BACKEND - BE] Xử lý máy chủ & cơ sở dữ liệu
│   ├── 📂 config/
│   │   └── db.php                           # Cấu hình kết nối PDO MySQL (Bảo mật, tắt báo lỗi giao diện)
│   └── 📂 database/
│       ├── database.sql                     # CSDL gốc, bảng categories, products, users (admin)
│       └── update_products.sql              # Script SQL cập nhật sản phẩm & ảnh thực tế
│
├── 📂 frontend/                             # [FRONTEND - FE] Giao diện người dùng
│   ├── 📂 assets/
│   │   ├── 📂 css/
│   │   │   └── style.css                    # Toàn bộ CSS hệ thống Glassmorphism Apple 2026
│   │   ├── 📂 js/
│   │   │   └── main.js                      # Client script: Mega-Menu, Carousel, Drawer, Cart, Toast
│   │   └── 📂 images/
│   │       ├── logo.png                     # Logo VLU FLAGSHIP STORE (khử nền nguyên khối 100%)
│   │       └── 📂 banners/                  # Ảnh Hero Banner studio độ phân giải cao
│   │           ├── iphone-18-pro_...png     # Banner Apple iPhone 18 Pro Max
│   │           ├── 1793210573792_...jpg     # Banner Samsung Galaxy S26 Ultra
│   │           ├── 1793210880061_...jpg     # Banner Xiaomi 17 Ultra Leica
│   │           └── 1793210675516_...jpg     # Banner OPPO Find X9 Ultra Hasselblad
│   └── 📂 components/
│       └── header.php                       # Header Navigation Bar + 7 Mega-Menu toàn màn hình
│
├── 📂 SanPham/                              # Thư mục ảnh sản phẩm phân theo hãng & màu sắc
│   └── SanPham/
│       ├── Iphone/
│       ├── Samsung/
│       ├── Xiaomi/
│       └── Oppo/
│
├── 📂 Banner/                               # Thư mục nguồn ảnh banner hero gốc
│
├── 📂 backups/                              # Thư mục chứa các tệp sao lưu cũ (.bak, .rar) đã dọn dẹp
│
├── index.php                                # Entry point chính của ứng dụng web (PHP)
├── index.html                               # Phiên bản HTML tĩnh xem trực tiếp trên trình duyệt
├── db.php                                   # Forwarder chuyển tiếp đến backend/config/db.php
├── header.php                               # Forwarder chuyển tiếp đến frontend/components/header.php
├── style.css                                # Forwarder chuyển tiếp đến frontend/assets/css/style.css
├── push.bat                                 # Script tự động đẩy code lên GitHub (nhánh main & dev)
├── .gitignore                               # Bỏ qua tệp hệ thống, tệp tạm và thư mục backups/
└── README.md                                # Tài liệu hướng dẫn cấu trúc dự án
```

---

## 🛠️ Chi Tiết Phân Chia FE & BE

### 1. Backend (BE)
* **Kết nối cơ sở dữ liệu (`backend/config/db.php`):** Sử dụng PDO với UTF-8 (`utf8mb4`), thiết lập chế độ bắt lỗi ngầm (`PDO::ERRMODE_EXCEPTION`) không để lộ lỗi SQL lên màn hình người dùng.
* **Cơ sở dữ liệu (`backend/database/`):**
  - `database.sql`: Chứa cấu trúc bảng `categories`, `products`, `users` cùng tài khoản quản trị viên (`admin` / `admin123`).
  - `update_products.sql`: Đoạn lệnh SQL cập nhật link ảnh thực tế và mô tả các dòng máy.
* **Tương thích ngược:** Tệp `db.php` tại thư mục gốc tự động chuyển tiếp (`require_once`) về `backend/config/db.php`, đảm bảo mọi đường dẫn cũ vẫn hoạt động trơn tru.

### 2. Frontend (FE)
* **Thành phần giao diện (`frontend/components/header.php`):**
  - Chứa thanh điều hướng cố định (`sticky top-0 z-50`) với hiệu ứng kính mờ (`backdrop-filter: blur`).
  - 7 bảng Mega-Menu thả xuống toàn màn hình (Điện thoại, Laptop, iPad, Tai nghe, Loa, Phụ kiện, Đồng hồ điện tử).
  - Giới hạn chiều cao `max-height: 75vh` và thanh cuộn dọc slim scrollbar mượt mà.
* **Phong cách & Kiểu dáng (`frontend/assets/css/style.css`):**
  - Hệ thống màu sắc chuẩn Apple 2026 kết hợp màu đỏ thương hiệu VLU `#C8102E`.
  - Hiệu ứng kính mờ, khử viền logo nguyên khối, lưới sản phẩm Responsive Grid.
* **Kịch bản tương tác (`frontend/assets/js/main.js`):**
  - Quản lý đóng/mở Mega-Menu với bộ đệm chống giật 220ms (debounce).
  - Slider banner trượt vô hạn (infinite loop carousel) kèm cử chỉ vuốt chạm touch/swipe.
  - Mobile Drawer accordion cho thiết bị di động.
  - Thông báo giỏ hàng phong cách Dynamic Island Toast.

---

## 🚀 Hướng Dẫn Khởi Chạy

1. **Khởi động Local Server:** Mở XAMPP / WampServer và bật Apache & MySQL.
2. **Import Database (Tùy chọn):** Mở `http://localhost/phpmyadmin/`, tạo cơ sở dữ liệu `web_dien_tu` và import file `backend/database/database.sql`.
3. **Truy cập Website:** Mở trình duyệt và truy cập `http://localhost/web-dien-tu/index.php`.
