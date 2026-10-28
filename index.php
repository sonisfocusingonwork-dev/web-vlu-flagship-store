<?php
/**
 * VLU FLAGSHIP STORE – Trang chủ
 * Header (logo + tìm kiếm + menu dropdown) | Hero banner full-width | Sản phẩm mới ra mắt | Footer
 */

require_once __DIR__ . '/db.php'; // db.php không in gì ra màn hình

function e($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

/* ------------------------------------------------------------------
   Ảnh sản phẩm cục bộ: SanPham/SanPham/<Hãng>/<Dòng máy>/<Màu>.png|webp
   Đọc trực tiếp tên file trong thư mục để URL luôn khớp (kể cả tên tiếng Việt có dấu)
   ------------------------------------------------------------------ */
const PRODUCT_IMG_DIR = 'SanPham/SanPham';

function product_images(string $folder): array
{
    $dir = __DIR__ . '/' . PRODUCT_IMG_DIR . '/' . $folder;
    if (!is_dir($dir)) {
        return [];
    }
    $files = array_values(array_filter(scandir($dir), function ($f) {
        return (bool)preg_match('/\.(png|webp|jpe?g)$/i', $f);
    }));
    sort($files, SORT_NATURAL | SORT_FLAG_CASE);

    $base = implode('/', array_map('rawurlencode', explode('/', PRODUCT_IMG_DIR . '/' . $folder)));
    return array_map(function ($f) use ($base) {
        return ['url' => $base . '/' . rawurlencode($f), 'color' => pathinfo($f, PATHINFO_FILENAME)];
    }, $files);
}

function same_text(string $a, string $b): bool
{
    if (class_exists('Normalizer')) {
        $a = Normalizer::normalize($a, Normalizer::FORM_C);
        $b = Normalizer::normalize($b, Normalizer::FORM_C);
    }
    return mb_strtolower($a, 'UTF-8') === mb_strtolower($b, 'UTF-8');
}

function cover_image(array $images, string $prefer = ''): string
{
    foreach ($images as $img) {
        if ($prefer !== '' && same_text($img['color'], $prefer)) {
            return $img['url'];
        }
    }
    return $images[0]['url'] ?? '';
}

/* ------------------------------------------------------------------
   1) MENU NGANG + DROPDOWN (dưới thanh tìm kiếm)
   ------------------------------------------------------------------ */
$menu = [
    ['slug' => 'dien-thoai', 'name' => 'Điện thoại', 'subs' => [
        ['iphone', 'Apple iPhone', 'iPhone 18 Pro, iPhone Air, iPhone 17'],
        ['samsung', 'Samsung Galaxy', 'Galaxy S26 Ultra, S26'],
        ['xiaomi', 'Xiaomi', 'Xiaomi 17 Ultra, 17 Pro Max'],
        ['oppo', 'OPPO', 'Find X9 Ultra, Find X9 Pro'],
        ['dien-thoai-gap', 'Điện thoại gập', 'Galaxy Z Fold8, Z Flip8, Find N5'],
    ]],
    ['slug' => 'laptop', 'name' => 'Laptop', 'subs' => [
        ['macbook-air', 'MacBook Air', 'Mỏng nhẹ, pin cả ngày'],
        ['macbook-pro', 'MacBook Pro', 'Hiệu năng chuyên nghiệp'],
        ['laptop-gaming', 'Laptop Gaming', 'Card đồ họa rời mạnh mẽ'],
        ['laptop-van-phong', 'Laptop Văn phòng', 'Học tập & làm việc'],
        ['laptop-do-hoa', 'Laptop Đồ họa', 'Màn hình chuẩn màu'],
    ]],
    ['slug' => 'ipad', 'name' => 'iPad', 'subs' => [
        ['ipad-pro', 'iPad Pro', 'Chip M-series, màn hình OLED'],
        ['ipad-air', 'iPad Air', 'Cân bằng hiệu năng & giá'],
        ['ipad-mini', 'iPad mini', 'Nhỏ gọn một tay cầm'],
        ['ipad-gen', 'iPad (Gen)', 'Lựa chọn phổ thông'],
        ['may-tinh-bang-android', 'Máy tính bảng Android', 'Galaxy Tab, Xiaomi Pad'],
    ]],
    ['slug' => 'tai-nghe', 'name' => 'Tai nghe', 'subs' => [
        ['airpods', 'AirPods', 'AirPods Pro, AirPods 4, AirPods Max'],
        ['true-wireless', 'Tai nghe True Wireless', 'Không dây nhét tai'],
        ['chup-tai', 'Tai nghe chụp tai', 'Chống ồn chủ động'],
        ['the-thao', 'Tai nghe thể thao', 'Chống nước, bám tai'],
        ['gaming', 'Tai nghe Gaming', 'Âm thanh vòm, micro rời'],
    ]],
    ['slug' => 'loa', 'name' => 'Loa', 'subs' => [
        ['loa-bluetooth', 'Loa Bluetooth', 'Di động, chống nước'],
        ['loa-thong-minh', 'Loa thông minh', 'Trợ lý giọng nói'],
        ['soundbar', 'Loa Soundbar', 'Âm thanh cho TV'],
        ['loa-karaoke', 'Loa Karaoke', 'Kèm micro không dây'],
        ['loa-vi-tinh', 'Loa vi tính', 'Cho bàn làm việc'],
    ]],
    ['slug' => 'phu-kien', 'name' => 'Phụ kiện', 'subs' => [
        ['sac-cap', 'Sạc & Cáp', 'Sạc nhanh USB-C, MagSafe'],
        ['sac-du-phong', 'Sạc dự phòng', 'Dung lượng cao, nhỏ gọn'],
        ['op-lung', 'Ốp lưng & Bao da', 'Bảo vệ thời trang'],
        ['mieng-dan', 'Miếng dán màn hình', 'Cường lực, chống nhìn trộm'],
        ['but-cam-ung', 'Bút cảm ứng', 'Apple Pencil, S Pen'],
        ['chuot-ban-phim', 'Chuột & Bàn phím', 'Không dây, cơ học'],
    ]],
    ['slug' => 'dong-ho-dien-tu', 'name' => 'Đồng hồ điện tử', 'subs' => [
        ['apple-watch', 'Apple Watch', 'Series, Ultra, SE'],
        ['galaxy-watch', 'Samsung Galaxy Watch', 'Theo dõi sức khỏe toàn diện'],
        ['xiaomi-amazfit', 'Xiaomi & Amazfit', 'Pin dài, giá tốt'],
        ['garmin', 'Garmin', 'Chuyên thể thao, GPS'],
        ['vong-deo-tay', 'Vòng đeo tay thông minh', 'Nhỏ gọn, đo nhịp tim'],
        ['dong-ho-tre-em', 'Đồng hồ trẻ em', 'Định vị, nghe gọi'],
    ]],
];

/* ------------------------------------------------------------------
   2) HERO BANNER (ảnh phủ kín 100% khung, chữ nổi phía trên)
   Lấy trực tiếp từ thư mục Banner/ của dự án
   ------------------------------------------------------------------ */
$banners = [
    [
        'eyebrow' => 'Apple · Flagship',
        'title' => 'iPhone 18 Pro Max',
        'text' => 'Đỉnh cao công nghệ Titanium cùng chip A20 Pro siêu mạnh mẽ.',
        'image' => 'Banner/iphone-18-pro_overview__bl9no3txkonm_og.png',
        'position' => 'center',
    ],
    [
        'eyebrow' => 'Samsung · Flagship',
        'title' => 'Galaxy S26 Ultra',
        'text' => 'Galaxy AI, bút S Pen tích hợp và camera zoom xa ấn tượng.',
        'image' => 'Banner/1793210573792_6690802098732450037_6690802098732450037_e1d1abf703bca13b2c04877bec2a6237.jpg',
        'position' => 'center',
    ],
    [
        'eyebrow' => 'Xiaomi · Flagship',
        'title' => 'Xiaomi 17 Ultra',
        'text' => 'Ống kính Leica, cảm biến 1-inch cho nhiếp ảnh di động chuyên nghiệp.',
        'image' => 'Banner/1793210880061_6690802098732450037_6690802098732450037_6a8b3b4c8e68135516fb3c5dc26fc679.jpg',
        'position' => 'center',
    ],
    [
        'eyebrow' => 'OPPO · Flagship',
        'title' => 'OPPO Find X9 Ultra',
        'text' => 'Camera tiềm vọng kép hợp tác Hasselblad, sạc nhanh SuperVOOC.',
        'image' => 'Banner/1793210675516_6690802098732450037_6690802098732450037_a8855076415c152f1279d1ae05c669e9.jpg',
        'position' => 'center',
    ],
];

/* ------------------------------------------------------------------
   3) SẢN PHẨM MỚI RA MẮT
   Mặc định dùng ảnh trong thư mục SanPham; nếu CSDL có dữ liệu thì ưu tiên CSDL
   ------------------------------------------------------------------ */
$defaultProducts = [
    ['id' => 101, 'brand' => 'Apple', 'name' => 'iPhone 18 Pro & iPhone 18 Pro Max', 'price' => 34990000, 'old_price' => 36990000,
     'description' => 'Đỉnh cao công nghệ Titanium, chip A20 Pro siêu mạnh mẽ.', 'folder' => 'Iphone/Ip 18 pro max', 'prefer' => 'Đỏ Burgundy'],
    ['id' => 102, 'brand' => 'Apple', 'name' => 'iPhone Air', 'price' => 26990000, 'old_price' => 28990000,
     'description' => 'Thiết kế siêu mỏng nhẹ đột phá, hiệu năng vượt trội.', 'folder' => 'Iphone/Ip Air', 'prefer' => 'Xanh da trời'],
    ['id' => 103, 'brand' => 'Apple', 'name' => 'iPhone 17', 'price' => 22990000, 'old_price' => null,
     'description' => 'Màu sắc trẻ trung, camera kép nâng cấp toàn diện.', 'folder' => 'Iphone/Ip 17', 'prefer' => 'Tím Oải Hương'],
    ['id' => 201, 'brand' => 'Samsung', 'name' => 'Galaxy S26 Ultra', 'price' => 31990000, 'old_price' => null,
     'description' => 'Galaxy AI, bút S Pen tích hợp và camera 200MP.', 'folder' => 'Samsung/SS S26 Ultra', 'prefer' => 'Cobalt Violet'],
    ['id' => 202, 'brand' => 'Samsung', 'name' => 'Galaxy Z Fold8', 'price' => 44990000, 'old_price' => null,
     'description' => 'Màn hình gập lớn như tablet, bản lề siêu mỏng.', 'folder' => 'Samsung/SS Galaxy Z Fold8', 'prefer' => 'Graphite'],
    ['id' => 203, 'brand' => 'Samsung', 'name' => 'Galaxy Z Flip8', 'price' => 25990000, 'old_price' => 28990000,
     'description' => 'Gập vỏ sò nhỏ gọn, màn hình phụ Flex Window đa năng.', 'folder' => 'Samsung/SS Galaxy Flip8', 'prefer' => 'Mint'],
    ['id' => 204, 'brand' => 'Samsung', 'name' => 'Galaxy S26', 'price' => 22990000, 'old_price' => null,
     'description' => 'Thiết kế phẳng nguyên khối, màn hình Dynamic AMOLED 2X.', 'folder' => 'Samsung/SS Galaxy S26', 'prefer' => 'Sky Blue'],
    ['id' => 301, 'brand' => 'Xiaomi', 'name' => 'Xiaomi 17 Ultra', 'price' => 26990000, 'old_price' => null,
     'description' => 'Ống kính Leica, cảm biến 1-inch chuyên nghiệp.', 'folder' => 'Xiaomi/Xiaomi 17 ultra', 'prefer' => 'Xanh Lá'],
    ['id' => 302, 'brand' => 'Xiaomi', 'name' => 'Xiaomi 17 Pro Max', 'price' => 24990000, 'old_price' => 26990000,
     'description' => 'Snapdragon đầu bảng, sạc siêu tốc HyperCharge.', 'folder' => 'Xiaomi/Xiaomi 17 pro max', 'prefer' => 'Tím'],
    ['id' => 401, 'brand' => 'OPPO', 'name' => 'OPPO Find X9 Ultra', 'price' => 27990000, 'old_price' => null,
     'description' => 'Camera tiềm vọng kép, hệ màu Hasselblad chân thực.', 'folder' => 'Oppo/OPPO Find X9 Ultra', 'prefer' => 'Cam'],
    ['id' => 402, 'brand' => 'OPPO', 'name' => 'OPPO Find X9 Pro', 'price' => 22990000, 'old_price' => null,
     'description' => 'Thiết kế cao cấp, chip xử lý hình ảnh độc quyền.', 'folder' => 'Oppo/OPPO Find X9 Pro', 'prefer' => 'Trắng'],
    ['id' => 404, 'brand' => 'OPPO', 'name' => 'OPPO Find N5', 'price' => 39990000, 'old_price' => 42990000,
     'description' => 'Màn gập không nếp gấp, siêu mỏng nhẹ.', 'folder' => 'Oppo/OPPO Find N5', 'prefer' => 'Đen'],
];

$defaultsById = [];
foreach ($defaultProducts as $d) {
    $defaultsById[$d['id']] = $d;
}

$newProducts = [];

// Ưu tiên dữ liệu từ CSDL web_dien_tu (nếu MySQL đang chạy và bảng có dữ liệu)
if ($conn instanceof PDO) {
    try {
        $rows = $conn->query(
            "SELECT p.*, c.name AS brand_name
               FROM products p
               LEFT JOIN categories c ON c.id = p.category_id
              ORDER BY p.id ASC"
        )->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as $row) {
            $id = (int)$row['id'];
            $d = $defaultsById[$id] ?? [];
            $images = !empty($d['folder']) ? product_images($d['folder']) : [];
            $image = trim((string)($row['image'] ?? '')) ?: cover_image($images, $d['prefer'] ?? '');
            if ($image === '') {
                continue;
            }
            $newProducts[] = [
                'id' => $id,
                'brand' => $row['brand_name'] ?? ($d['brand'] ?? ''),
                'name' => $row['name'],
                'description' => $row['description'] ?? '',
                'price' => (float)$row['price'],
                'old_price' => $d['old_price'] ?? null,
                'image' => $image,
                'colors' => count($images),
            ];
        }
    } catch (PDOException $ex) {
        error_log('[web_dien_tu] Lỗi truy vấn sản phẩm: ' . $ex->getMessage());
        $newProducts = [];
    }
}

// Không có CSDL → dùng danh sách mặc định với ảnh trong thư mục SanPham
if (empty($newProducts)) {
    foreach ($defaultProducts as $d) {
        $images = product_images($d['folder']);
        $newProducts[] = $d + ['image' => cover_image($images, $d['prefer']), 'colors' => count($images)];
    }
}

$cartCount = 0;
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VLU FLAGSHIP STORE</title>
  <meta name="description" content="VLU FLAGSHIP STORE – Điện thoại, laptop, iPad, tai nghe, loa, phụ kiện, camera và đồng hồ điện tử chính hãng.">
  <link rel="icon" type="image/png" href="image_2c97c5.png">
  <link rel="stylesheet" href="style.css">

  <!-- Font: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap&subset=vietnamese" rel="stylesheet">

  <!-- Tailwind CSS qua CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
          colors: {
            ink: '#0B0F19',
            brand: { DEFAULT: '#C8102E', dark: '#A00D25', soft: '#FDECEF' }
          }
        }
      }
    }
  </script>

  <style>
    html { scroll-behavior: smooth; }
    .no-scrollbar { scrollbar-width: none; }
    .no-scrollbar::-webkit-scrollbar { display: none; }

    /* Nút yêu thích: trạng thái đã chọn */
    [data-wish][aria-pressed="true"] { color: #DC2626; }
    [data-wish][aria-pressed="true"] svg { fill: currentColor; }

    /* Badge giỏ hàng nảy lên khi thêm sản phẩm */
    @keyframes bump { 0% { transform: scale(1); } 40% { transform: scale(1.5); } 100% { transform: scale(1); } }
    .bump { animation: bump .35s ease-out; }

    /* Toast thông báo */
    #toast { transition: opacity .25s ease, transform .25s ease; }
    #toast.show { opacity: 1; transform: translate(-50%, 0); }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      * { transition-duration: .01ms !important; animation-duration: .01ms !important; }
    }

    /* ============ 1. SITE HEADER GLASSMORPHISM & LOGO ============ */
    .site-header {
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border-bottom: 1px solid rgba(15, 23, 42, 0.06);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 16px 36px -16px rgba(15, 23, 42, 0.05);
      transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .site-logo {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      text-decoration: none;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .site-logo img {
      display: block;
      height: 48px;
      width: auto;
      aspect-ratio: 243 / 171;
      object-fit: contain;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      filter: contrast(1.1) brightness(1.02) drop-shadow(0 2px 6px rgba(15, 23, 42, 0.08));
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
    }
    .site-logo:hover img {
      transform: scale(1.06);
      filter: contrast(1.16) brightness(1.03) drop-shadow(0 6px 16px rgba(200, 16, 46, 0.22));
    }
    @media (min-width: 640px) { .site-logo img { height: 52px; } }

    /* ============ 2. THANH MENU NGANG (HÀNG DƯỚI THANH TÌM KIẾM) ============ */
    .main-nav { position: relative; }
    .nav-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      height: 2.375rem;
      padding: 0 0.875rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      background: transparent;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      text-decoration: none;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .nav-chev { width: 12px; height: 12px; color: #94a3b8; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
    .nav-badge-new {
      font-size: 0.625rem;
      font-weight: 800;
      padding: 0.1rem 0.4rem;
      border-radius: 9999px;
      background: #FDECEF;
      color: #C8102E;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .nav-link-btn:hover,
    .nav-item-mega:hover .nav-link-btn,
    .nav-item-mega.is-open .nav-link-btn,
    .nav-item-phone:hover .nav-link-btn,
    .nav-item-phone.is-open .nav-link-btn,
    .nav-item-laptop:hover .nav-link-btn,
    .nav-item-laptop.is-open .nav-link-btn,
    .nav-item-sub:hover .nav-link-btn,
    .nav-item-sub.is-open .nav-link-btn {
      color: #0f172a;
      background: rgba(15, 23, 42, 0.05);
    }
    .nav-item-mega:hover .nav-chev,
    .nav-item-mega.is-open .nav-chev,
    .nav-item-phone:hover .nav-chev,
    .nav-item-phone.is-open .nav-chev,
    .nav-item-laptop:hover .nav-chev,
    .nav-item-laptop.is-open .nav-chev,
    .nav-item-sub:hover .nav-chev,
    .nav-item-sub.is-open .nav-chev {
      transform: rotate(180deg);
      color: #C8102E;
    }

    /* ============ 3. MEGA-MENU "ĐIỆN THOẠI" (5 CỘT) & "LAPTOP" (6 CỘT) ============ */
    .nav-item-mega,
    .nav-item-phone,
    .nav-item-laptop { position: static; }
    .mega-panel,
    .mega-phone-panel,
    .mega-laptop-panel {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(36px) saturate(200%);
      -webkit-backdrop-filter: blur(36px) saturate(200%);
      border-bottom: 1px solid rgba(226, 232, 240, 0.85);
      box-shadow: 0 40px 80px -20px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-4px);
      pointer-events: none;
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s;
      z-index: 50;
    }
    /* Vùng đệm bắt chuột (hover bridge) chống giật và đứt quãng */
    .mega-panel::before,
    .mega-phone-panel::before,
    .mega-laptop-panel::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      height: 20px;
      background: transparent;
    }
    .nav-item-mega:hover .mega-panel,
    .nav-item-mega.is-open .mega-panel,
    .nav-item-phone:hover .mega-phone-panel,
    .nav-item-phone.is-open .mega-phone-panel,
    .nav-item-laptop:hover .mega-laptop-panel,
    .nav-item-laptop.is-open .mega-laptop-panel {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* BỐ CỤC LƯỚI TỰ ĐỘNG THÍCH ỨNG (AUTO-FILL GRID FLOW CHO 9 - 12 NHÓM) */
    .mega-grid-flow {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem 1.5rem;
    }

    /* THANH CUỘN DỌC MƯỢT MÀ VÀ GIỚI HẠN CHIỀU CAO MAX-HEIGHT 75VH */
    .mega-menu-scroll {
      max-height: 75vh;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: rgba(148, 163, 184, 0.5) rgba(241, 245, 249, 0.5);
    }
    .mega-menu-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .mega-menu-scroll::-webkit-scrollbar-track {
      background: rgba(241, 245, 249, 0.5);
      border-radius: 9999px;
    }
    .mega-menu-scroll::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.5);
      border-radius: 9999px;
      transition: background-color 0.2s ease;
    }
    .mega-menu-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(100, 116, 139, 0.8);
    }

    .mega-brand-col { display: flex; flex-direction: column; }
    
    /* ITEM LINK TRONG MEGA-MENU: TINH GIẢN, CHỈ HIỂN THỊ TÊN DÒNG SẢN PHẨM */
    .mega-item-link {
      display: block;
      padding: 0.35rem 0.6rem;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #1e293b;
      text-decoration: none;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mega-item-link:hover, .mega-item-link:focus-visible {
      color: #C8102E;
      background: rgba(241, 245, 249, 0.95);
      transform: translateX(4px);
      outline: none;
    }

    .badge-chip {
      font-size: 0.625rem;
      font-weight: 800;
      padding: 0.125rem 0.45rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .badge-brand { background: #FDECEF; color: #C8102E; }
    .badge-blue  { background: #eff6ff; color: #2563eb; }
    .badge-purple{ background: #faf5ff; color: #7e22ce; }
    .badge-amber { background: #fffbeb; color: #b45309; }

    /* ============ 4. DROPDOWN 6 MỤC CÒN LẠI ============ */
    .nav-item-sub { position: relative; }
    .nav-sub-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 280px;
      padding-top: 0.5rem;
      opacity: 0;
      visibility: hidden;
      transform: translateY(4px);
      transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
      z-index: 50;
      pointer-events: none;
    }
    /* Vùng đệm bắt chuột cho dropdown con */
    .nav-sub-dropdown::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      height: 16px;
      background: transparent;
    }
    .nav-item-sub:nth-last-child(-n+3) .nav-sub-dropdown { left: auto; right: 0; }
    .nav-sub-dropdown-inner {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border: 1px solid rgba(226, 232, 240, 0.85);
      border-radius: 20px;
      box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.16);
      padding: 0.75rem;
    }
    .nav-item-sub:hover .nav-sub-dropdown, .nav-item-sub.is-open .nav-sub-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }
    .nav-sub-item-link {
      display: block;
      border-radius: 10px;
      padding: 0.45rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #1e293b;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .nav-sub-item-link:hover {
      background: rgba(241, 245, 249, 0.95);
      color: #C8102E;
      transform: translateX(3px);
    }

    /* ============ 5. SCRIM & SEARCH & MOBILE ============ */
    .mega-scrim {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.25);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
      pointer-events: none;
      z-index: 40;
    }
    body.has-mega-open .mega-scrim { opacity: 1; visibility: visible; pointer-events: auto; }

    .glass-search-input {
      background: rgba(241, 245, 249, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.85);
      color: #0f172a;
    }
    .glass-search-input:focus {
      background: #fff;
      border-color: #C8102E;
      box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.12);
    }

    .mobile-drawer {
      position: fixed;
      top: 4.5rem;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      overflow-y: auto;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0.3s;
      z-index: 45;
    }
    .mobile-drawer.is-open { transform: translateY(0); opacity: 1; visibility: visible; pointer-events: auto; }
    .mobile-brand-card {
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 18px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
    }
      overflow-y: auto;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0.3s;
      z-index: 45;
    }
    .mobile-drawer.is-open { transform: translateY(0); opacity: 1; visibility: visible; pointer-events: auto; }
    .mobile-brand-card {
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 18px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
    }

    /* ============ 3. HERO BANNER FULL-WIDTH ============ */
    .hero-slide {
      position: relative;
      flex: 0 0 100%;
      width: 100%;
      height: 26rem;
      overflow: hidden;
      background: #0f172a;
    }
    @media (min-width: 640px)  { .hero-slide { height: 30rem; } }
    @media (min-width: 1024px) { .hero-slide { height: 36rem; } }

    .hero-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;               /* phủ kín 100% khung banner */
      object-position: center;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(0deg, rgba(2, 6, 23, .88) 0%, rgba(2, 6, 23, .45) 55%, rgba(2, 6, 23, .1) 100%);
    }
    .hero-content {
      position: absolute;              /* chữ + nút nổi trên bề mặt ảnh */
      z-index: 2;
      left: 0;
      right: 0;
      bottom: 5.5rem;
      max-width: 40rem;
      padding: 0 1.5rem;
      color: #fff;
    }
    @media (min-width: 768px) {
      .hero-overlay { background: linear-gradient(90deg, rgba(2, 6, 23, .85) 0%, rgba(2, 6, 23, .5) 45%, rgba(2, 6, 23, 0) 80%); }
      .hero-content { top: 50%; bottom: auto; transform: translateY(-50%); padding: 0 4rem; }
    }

    /* ============ 4. SẢN PHẨM MỚI RA MẮT (GRID RESPONSIVE) ============ */
    .launch-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .75rem;
    }
    @media (min-width: 640px)  { .launch-grid { gap: 1.25rem; } }
    @media (min-width: 768px)  { .launch-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .launch-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.5rem; } }

    .product-card {
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: 24px;
      background: #fff;
      border: 1px solid rgba(226, 232, 240, .8);
      padding: .75rem;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, .05);
      transition: transform .35s cubic-bezier(.16, 1, .3, 1), box-shadow .35s ease, border-color .35s ease;
    }
    @media (min-width: 640px) { .product-card { padding: 1rem; } }
    .product-card:hover {
      transform: translateY(-6px);
      border-color: rgba(200, 16, 46, .3);
      box-shadow: 0 16px 32px -4px rgba(0, 0, 0, .1);
    }
    .product-img-box {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1 / 1;
      width: 100%;
      overflow: hidden;
      border-radius: 18px;
      background: #f5f5f7;
      padding: .75rem;
    }
    .product-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform .5s cubic-bezier(.16, 1, .3, 1);
    }
    .product-card:hover .product-img { transform: scale(1.06); }
  </style>
</head>

<body class="bg-[#FBFBFE] font-sans text-ink antialiased">

  <!-- Bộ icon dùng chung (SVG sprite) -->
  <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></symbol>
    <symbol id="i-left" viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></symbol>
    <symbol id="i-right" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></symbol>
    <symbol id="i-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  </svg>

  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Bỏ qua đến nội dung chính</a>

  <!-- ============================================================
       [HEADER] nhúng từ header.php: Logo (image_2c97c5.png) | Tìm kiếm | Giỏ hàng | Menu ngang 8 mục có Dropdown
       ============================================================ -->
  <?php include __DIR__ . '/header.php'; ?>

  <main id="main">

    <!-- ============================================================
         [HERO BANNER] Ảnh phủ kín khung (object-fit: cover), chữ nổi phía trên
         ============================================================ -->
    <section id="hero" aria-roledescription="carousel" aria-label="Sản phẩm nổi bật" class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
      <div id="heroViewport" class="relative overflow-hidden rounded-[2rem] shadow-2xl">
        <div id="heroTrack" class="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">

          <?php foreach ($banners as $i => $banner): ?>
            <article class="slide hero-slide" role="group" aria-roledescription="slide" aria-label="<?= $i + 1 ?> / <?= count($banners) ?>">
              <img class="hero-img" src="<?= e($banner['image']) ?>" alt="<?= e($banner['title']) ?>" style="object-position: <?= e($banner['position']) ?>" loading="<?= $i === 0 ? 'eager' : 'lazy' ?>">
              <div class="hero-overlay" aria-hidden="true"></div>
              <div class="hero-content">
                <span class="inline-flex items-center rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm"><?= e($banner['eyebrow']) ?></span>
                <h2 class="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"><?= e($banner['title']) ?></h2>
                <p class="mt-3 max-w-md text-sm font-medium leading-relaxed text-white/85 sm:text-lg"><?= e($banner['text']) ?></p>
                <a href="#san-pham-moi" class="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-brand hover:text-white active:scale-95">
                  Khám phá ngay
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-right"/></svg>
                </a>
              </div>
            </article>
          <?php endforeach; ?>

        </div>

        <!-- Điều khiển: chấm trang + nút trước/sau -->
        <div class="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex items-center justify-between px-4 sm:bottom-6 sm:px-8">
          <div class="pointer-events-auto flex items-center rounded-full bg-white/90 px-2 shadow-sm" role="group" aria-label="Chọn banner">
            <?php foreach ($banners as $i => $banner): ?>
              <button type="button" data-dot class="grid h-11 w-7 place-items-center" aria-label="Đến banner <?= $i + 1 ?>" aria-current="<?= $i === 0 ? 'true' : 'false' ?>">
                <span class="block h-2.5 rounded-full transition-all duration-300 <?= $i === 0 ? 'w-7 bg-ink' : 'w-2.5 bg-ink/30' ?>"></span>
              </button>
            <?php endforeach; ?>
          </div>
          <div class="pointer-events-auto flex gap-2">
            <button type="button" id="heroPrev" class="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white active:scale-95" aria-label="Banner trước">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-left"/></svg>
            </button>
            <button type="button" id="heroNext" class="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white active:scale-95" aria-label="Banner sau">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-right"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         [SẢN PHẨM MỚI RA MẮT] Lưới responsive: 2 → 3 → 4 cột
         ============================================================ -->
    <section id="san-pham-moi" class="mx-auto max-w-7xl scroll-mt-40 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="launch-title">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-brand">Vừa cập bến</p>
          <h2 id="launch-title" class="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Sản phẩm mới ra mắt</h2>
          <p class="mt-1 text-sm text-slate-500">Những thiết bị flagship mới nhất, chính hãng tại VLU FLAGSHIP STORE.</p>
        </div>
        <a href="category.php?sort=moi-nhat" class="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-brand transition hover:bg-brand-soft">
          Xem tất cả
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-right"/></svg>
        </a>
      </div>

      <div class="launch-grid">
        <?php foreach ($newProducts as $p):
          $hasSale = !empty($p['old_price']) && $p['old_price'] > $p['price'];
          $badge = $hasSale ? '-' . round(100 - $p['price'] / $p['old_price'] * 100) . '%' : 'Mới';
        ?>
          <article class="product-card group">
            <div class="product-img-box">
              <span class="absolute left-3 top-3 z-10 rounded-full <?= $hasSale ? 'bg-brand' : 'bg-slate-900' ?> px-2.5 py-1 text-xs font-bold text-white shadow-sm"><?= e($badge) ?></span>
              <button type="button" data-wish aria-pressed="false" aria-label="Yêu thích <?= e($p['name']) ?>" class="absolute right-2 top-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-red-600 active:scale-90">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-heart"/></svg>
              </button>
              <img src="<?= e($p['image']) ?>" alt="<?= e($p['name']) ?>" loading="lazy" class="product-img">
            </div>

            <div class="mt-3 flex flex-1 flex-col sm:mt-4">
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400"><?= e($p['brand']) ?></p>
                <?php if (!empty($p['colors'])): ?>
                  <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500"><?= (int)$p['colors'] ?> màu</span>
                <?php endif; ?>
              </div>
              <h3 class="mt-1 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-brand sm:text-base">
                <a href="product.php?id=<?= (int)$p['id'] ?>" class="after:absolute after:inset-0 after:z-0 after:rounded-[24px] focus-visible:outline-none focus-visible:after:ring-4 focus-visible:after:ring-brand/30"><?= e($p['name']) ?></a>
              </h3>
              <?php if (!empty($p['description'])): ?>
                <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500"><?= e($p['description']) ?></p>
              <?php endif; ?>

              <div class="mt-auto flex items-end justify-between gap-2 pt-3">
                <div>
                  <p class="text-sm font-extrabold text-brand sm:text-lg"><?= number_format($p['price'], 0, ',', '.') ?>₫</p>
                  <?php if ($hasSale): ?>
                    <p class="text-xs text-slate-400 line-through"><?= number_format($p['old_price'], 0, ',', '.') ?>₫</p>
                  <?php endif; ?>
                </div>
                <button type="button" data-add data-id="<?= (int)$p['id'] ?>" data-name="<?= e($p['name']) ?>" aria-label="Thêm <?= e($p['name']) ?> vào giỏ hàng" class="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-white shadow-sm transition hover:bg-brand active:scale-95">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-plus"/></svg>
                </button>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
    </section>

  </main>

  <!-- ============================================================
       [FOOTER] VLU FLAGSHIP STORE
       ============================================================ -->
  <footer class="mt-8 border-t border-slate-200/80 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 border-b border-slate-100 pb-12 md:grid-cols-4">
        <div class="space-y-4 md:col-span-2">
          <a href="index.php" class="site-logo" aria-label="VLU FLAGSHIP STORE – Trang chủ">
            <img src="image_2c97c5.png" alt="VLU FLAGSHIP STORE" width="241" height="171">
          </a>
          <p class="text-lg font-black tracking-tight text-slate-950">VLU FLAGSHIP STORE</p>
          <p class="max-w-md text-sm leading-relaxed text-slate-500">
            Hệ thống cửa hàng công nghệ chính hãng: điện thoại, laptop, iPad, tai nghe, loa, phụ kiện, camera và đồng hồ điện tử. Bảo hành chính hãng, đổi trả minh bạch.
          </p>
        </div>

        <div>
          <h4 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">Danh mục</h4>
          <ul class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-slate-600 md:grid-cols-1">
            <?php foreach ($menu as $cat): ?>
              <li><a href="category.php?cat=<?= e($cat['slug']) ?>" class="font-medium transition hover:text-brand"><?= e($cat['name']) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">Dịch vụ &amp; Hậu mãi</h4>
          <ul class="space-y-2.5 text-sm text-slate-600">
            <li>Giao hàng nhanh trong 2 giờ</li>
            <li>Bảo hành chính hãng 12 tháng</li>
            <li>Trả góp 0% lãi suất</li>
            <li>Thu cũ đổi mới trợ giá</li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-500 sm:flex-row">
        <p>© <?= date('Y') ?> <strong class="font-bold text-slate-800">VLU FLAGSHIP STORE</strong>. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>

  <!-- Toast thông báo -->
  <div id="toast" role="status" aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-xl"></div>

  <script>
    (function () {
      'use strict';
      var $ = function (s, el) { return (el || document).querySelector(s); };
      var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

      /* ---------- MENU MEGA (ĐIỆN THOẠI 5 CỘT & LAPTOP 6 CỘT) & SUB DROPDOWNS ---------- */
      var megaItems = $$('.nav-item-mega');
      var subItems = $$('.nav-item-sub');
      var scrim = $('#megaScrim');
      var closeTimer = null;

      function closeAllMenus() {
        clearTimeout(closeTimer);
        megaItems.forEach(function (m) {
          m.classList.remove('is-open');
          var btn = $('button', m);
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        subItems.forEach(function (it) {
          it.classList.remove('is-open');
          var a = $('a', it);
          if (a) a.setAttribute('aria-expanded', 'false');
        });
        document.body.classList.remove('has-mega-open');
      }

      function scheduleCloseAll() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
          closeAllMenus();
        }, 220); // Đệm 220ms ngăn giật, di chuột chéo siêu mượt mà
      }

      function openMegaItem(targetItem) {
        clearTimeout(closeTimer);
        subItems.forEach(function (it) {
          it.classList.remove('is-open');
          var a = $('a', it);
          if (a) a.setAttribute('aria-expanded', 'false');
        });
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

      // 1. Xử lý tất cả Mega-Menu (Điện thoại & Laptop)
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

      // 2. Xử lý Dropdown 6 mục còn lại (iPad, Tai nghe, Loa, Phụ kiện, Camera, Đồng hồ)
      subItems.forEach(function (it) {
        it.addEventListener('mouseenter', function () {
          clearTimeout(closeTimer);
          megaItems.forEach(function (m) {
            m.classList.remove('is-open');
            var b = $('button', m);
            if (b) b.setAttribute('aria-expanded', 'false');
          });
          subItems.forEach(function (other) {
            if (other !== it) {
              other.classList.remove('is-open');
              var a = $('a', other);
              if (a) a.setAttribute('aria-expanded', 'false');
            }
          });
          it.classList.add('is-open');
          var a = $('a', it);
          if (a) a.setAttribute('aria-expanded', 'true');
          document.body.classList.add('has-mega-open');
        });

        it.addEventListener('mouseleave', scheduleCloseAll);
      });

      // 3. Xử lý Scrim (chỉ đóng khi người dùng CLICK ra ngoài, tuyệt đối không dùng mouseenter)
      if (scrim) {
        scrim.addEventListener('click', closeAllMenus);
      }

      // Đóng khi click ngoài hoặc nhấn Escape
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

      /* ---------- MOBILE DRAWER ACCORDION ---------- */
      var mobileBtn = $('#mobileMenuBtn');
      var mobileDrawer = $('#mobileDrawer');

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
        document.body.classList.remove('overflow-hidden');
      }

      if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', function () {
          var willOpen = !mobileDrawer.classList.contains('is-open');
          if (willOpen) {
            mobileDrawer.classList.add('is-open');
            mobileBtn.setAttribute('aria-expanded', 'true');
            var burger = $('.icon-burger', mobileBtn);
            var closeIcon = $('.icon-close', mobileBtn);
            if (burger) burger.classList.add('hidden');
            if (closeIcon) closeIcon.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
          } else {
            closeMobileDrawer();
          }
        });
      }

      $$('.mobile-accordion-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var body = btn.nextElementSibling;
          var chevron = $('svg', btn);
          var isOpen = !body.classList.contains('hidden');
          if (isOpen) {
            body.classList.add('hidden');
            if (chevron) chevron.style.transform = '';
          } else {
            body.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
          }
        });
      });

      /* ---------- HERO SLIDER TRƯỢT VÔ HẠN ---------- */
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

        $('#heroNext').addEventListener('click', next);
        $('#heroPrev').addEventListener('click', prev);
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

      /* ---------- GIỎ HÀNG + YÊU THÍCH ---------- */
      var badge = $('#cartCount');
      var toast = $('#toast');
      var count = parseInt(badge.textContent, 10) || 0;
      var toastTimer;

      function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
      }

      document.addEventListener('click', function (e) {
        var add = e.target.closest('[data-add]');
        if (add) {
          count += 1;
          badge.textContent = count;
          badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
          showToast('Đã thêm "' + add.dataset.name + '" vào giỏ hàng');
          return;
        }
        var wish = e.target.closest('[data-wish]');
        if (wish) {
          wish.setAttribute('aria-pressed', wish.getAttribute('aria-pressed') !== 'true');
        }
      });
    })();
  </script>
</body>
</html>
