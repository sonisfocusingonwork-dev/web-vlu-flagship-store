<?php
/**
 * VLU FLAGSHIP STORE – Trang Chi tiết sản phẩm (Product Detail)
 * Chuẩn UI/UX Apple Store 2026: Clean, tối giản, sang trọng, tương tác mượt mà
 * Hỗ trợ chọn màu sắc có hiệu ứng viền sáng, chọn dung lượng cập nhật giá tiền tự động,
 * cụm nút Mua ngay & Thêm vào giỏ hàng Toast, và Bảng thông số kỹ thuật Bento Grid.
 */

require_once __DIR__ . '/backend/config/db.php';

if (!function_exists('e')) {
    function e($val): string {
        return htmlspecialchars((string)$val, ENT_QUOTES, 'UTF-8');
    }
}

$cartCount = 0;
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>iPhone 18 Pro Max – VLU FLAGSHIP STORE</title>
  <meta name="description" content="iPhone 18 Pro Max chính hãng tại VLU FLAGSHIP STORE. Đỉnh cao Titanium, chip Apple A20 Pro 2nm, camera tiềm vọng Tetraprism zoom 5x, bảo hành chính hãng 24 tháng.">
  <link rel="icon" type="image/png" href="frontend/assets/images/logo.png">

  <!-- Font: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap&subset=vietnamese" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
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

  <!-- CSS hệ thống chuẩn Apple 2026 -->
  <link rel="stylesheet" href="frontend/assets/css/style.css">
  <link rel="stylesheet" href="style.css">
</head>

<body class="bg-[#FBFBFE] font-sans text-ink antialiased">

  <!-- ============================================================
       [HEADER] ĐỒNG BỘ 100% TỪ COMPONENT HEADER VỚI 7 MEGA-MENU
       ============================================================ -->
  <?php include __DIR__ . '/frontend/components/header.php'; ?>

  <main id="main">

    <!-- ================= BREADCRUMBS ================= -->
    <div class="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
      <nav aria-label="Đường dẫn trang" class="text-xs font-semibold text-slate-500">
        <ol class="flex items-center gap-1.5 flex-wrap">
          <li><a href="index.php" class="hover:text-brand transition">Trang chủ</a></li>
          <li class="text-slate-300">/</li>
          <li><a id="pdBreadcrumbCat" href="category.php?cat=dien-thoai" class="hover:text-brand transition">Điện thoại</a></li>
          <li class="text-slate-300">/</li>
          <li><a id="pdBreadcrumbBrand" href="search.php?q=Apple" class="hover:text-brand transition">Apple iPhone</a></li>
          <li class="text-slate-300">/</li>
          <li id="pdBreadcrumbName" class="text-slate-900 font-bold" aria-current="page">iPhone 18 Pro Max</li>
        </ol>
      </nav>
    </div>

    <!-- ============================================================
         PHẦN 1: BỐ CỤC CHÍNH (2 CỘT CHUẨN APPLE STORE)
         - Cột trái: Khung hiển thị ảnh lớn + Dải ảnh thu nhỏ thumbnails
         - Cột phải: Thông tin, chọn màu sắc, chọn dung lượng đổi giá, nút Mua
         ============================================================ -->
    <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        <!-- ================= CỘT TRÁI: HÌNH ẢNH SẢN PHẨM ================= -->
        <div class="lg:col-span-7 space-y-4">
          
          <!-- Khung ảnh lớn sắc nét phong cách Apple Studio -->
          <div class="gallery-viewer group relative p-6 sm:p-10">
            <!-- Huy hiệu nổi bật góc ảnh -->
            <div id="pdBadges" class="absolute left-4 top-4 z-10 flex flex-col gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-sm">
                <span class="h-1.5 w-1.5 rounded-full bg-brand"></span>
                Titanium Cấp 5
              </span>
              <span class="inline-flex items-center rounded-full bg-brand/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-sm">
                Chip A20 Pro 2nm
              </span>
            </div>

            <!-- Nút Yêu thích trên góc ảnh -->
            <button type="button" data-wish aria-pressed="false" aria-label="Thêm vào danh sách yêu thích"
                    class="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-slate-500 shadow-md transition hover:text-red-600 hover:scale-105 active:scale-95">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>
              </svg>
            </button>

            <!-- Ảnh lớn chính -->
            <img id="mainProductImg"
                 src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90%E1%BB%8F%20Burgundy.png"
                 alt="iPhone 18 Pro Max - Đỏ Burgundy"
                 class="transition-all duration-300 transform group-hover:scale-105">

            <!-- Nhãn màu sắc đang hiển thị góc dưới -->
            <div class="absolute bottom-4 left-4 z-10 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-slate-700 backdrop-blur-md border border-slate-200/60 shadow-xs">
              Màu: <span id="imageColorLabel" class="text-brand">Đỏ Burgundy</span>
            </div>
          </div>

          <!-- Dải ảnh thu nhỏ (Thumbnails) tương tác chuyển ảnh mượt mà -->
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bộ sưu tập màu sắc &amp; góc chụp</p>
            <div id="thumbnailStrip" class="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              
              <!-- Thumb 1: Đỏ Burgundy -->
              <button type="button" class="thumb-btn active"
                      data-src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90%E1%BB%8F%20Burgundy.png"
                      data-color-name="Đỏ Burgundy"
                      data-color-key="burgundy"
                      aria-label="Xem ảnh Đỏ Burgundy">
                <img src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90%E1%BB%8F%20Burgundy.png" alt="Đỏ Burgundy">
              </button>

              <!-- Thumb 2: Titan Tự Nhiên (Băng thanh) -->
              <button type="button" class="thumb-btn"
                      data-src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%C4%83ng%20thanh.png"
                      data-color-name="Titan Tự Nhiên"
                      data-color-key="natural"
                      aria-label="Xem ảnh Titan Tự Nhiên">
                <img src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%C4%83ng%20thanh.png" alt="Titan Tự Nhiên">
              </button>

              <!-- Thumb 3: Titan Đen -->
              <button type="button" class="thumb-btn"
                      data-src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90en.png"
                      data-color-name="Titan Đen"
                      data-color-key="black"
                      aria-label="Xem ảnh Titan Đen">
                <img src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90en.png" alt="Titan Đen">
              </button>

              <!-- Thumb 4: Titan Trắng / Bạc -->
              <button type="button" class="thumb-btn"
                      data-src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%E1%BA%A1c.png"
                      data-color-name="Titan Trắng"
                      data-color-key="white"
                      aria-label="Xem ảnh Titan Trắng">
                <img src="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%E1%BA%A1c.png" alt="Titan Trắng">
              </button>

              <!-- Thumb 5: Góc chụp Banner Studio Hero -->
              <button type="button" class="thumb-btn"
                      data-src="Banner/iphone-18-pro_overview__bl9no3txkonm_og.png"
                      data-color-name="Khung Titan 3D PRO"
                      data-color-key="hero"
                      aria-label="Xem góc chụp Studio PRO">
                <img src="Banner/iphone-18-pro_overview__bl9no3txkonm_og.png" alt="Góc chụp Studio PRO">
              </button>

            </div>
          </div>

        </div>

        <!-- ================= CỘT PHẢI: TƯƠNG TÁC CHỌN CẤU HÌNH & MUA HÀNG ================= -->
        <div class="lg:col-span-5 space-y-6">

          <!-- 1. Tiêu đề, Hãng & Đánh giá -->
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span id="pdEyebrow" class="text-xs font-black uppercase tracking-[0.2em] text-brand">Apple · Flagship 2026</span>
              <span class="inline-block h-1 w-1 rounded-full bg-slate-300"></span>
              <span class="text-xs font-bold text-slate-500">Chính hãng VN/A</span>
            </div>
            <h1 id="pdName" class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">iPhone 18 Pro Max</h1>

            <div class="flex items-center gap-3 mt-3 flex-wrap">
              <!-- Rating Stars -->
              <div class="flex items-center gap-1 text-amber-500">
                <span class="text-xs font-black text-slate-900 mr-0.5">5.0</span>
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <span class="text-xs text-slate-400">·</span>
              <span class="text-xs font-semibold text-slate-500">1.248 Đánh giá</span>
              <span class="text-xs text-slate-400">·</span>
              
              <!-- Tình trạng 'Còn hàng' có đèn xanh pulse sang trọng -->
              <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                Còn hàng
              </span>
            </div>
          </div>

          <!-- 2. Khung Giá Tiền Tự Động Cập Nhật Theo Cấu Hình -->
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div class="flex items-baseline gap-3 flex-wrap">
              <span id="productPrice" class="text-3xl sm:text-4xl font-extrabold text-brand tracking-tight transition-all duration-300">
                34.990.000₫
              </span>
              <span id="oldPrice" class="text-base text-slate-400 line-through font-semibold transition-all duration-300">
                36.990.000₫
              </span>
              <span id="discountBadge" class="rounded-full bg-red-100 text-brand px-2.5 py-0.5 text-xs font-extrabold">
                -5%
              </span>
            </div>
            <p id="pdInstallment" class="mt-2 text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Trả góp 0% lãi suất – Chỉ từ <strong>2.915.000₫/tháng</strong> (Kỳ hạn 12 tháng)
            </p>
          </div>

          <!-- 3. Chọn Màu Sắc (Swatches có viền sáng & tương tác chuyển ảnh) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
                Màu sắc: <strong id="selectedColorName" class="text-slate-900 font-extrabold text-sm ml-1">Đỏ Burgundy</strong>
              </span>
            </div>
            <div id="colorSwatches" class="flex items-center gap-3.5" role="radiogroup" aria-label="Chọn màu sắc sản phẩm">
              
              <!-- Màu 1: Đỏ Burgundy -->
              <button type="button" class="color-swatch-btn active"
                      data-color-key="burgundy"
                      data-color-name="Đỏ Burgundy"
                      data-img="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90%E1%BB%8F%20Burgundy.png"
                      style="background-color: #5B1C24;"
                      title="Đỏ Burgundy"
                      aria-label="Chọn màu Đỏ Burgundy"
                      aria-checked="true" role="radio"></button>

              <!-- Màu 2: Titan Tự Nhiên (Băng thanh) -->
              <button type="button" class="color-swatch-btn"
                      data-color-key="natural"
                      data-color-name="Titan Tự Nhiên"
                      data-img="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%C4%83ng%20thanh.png"
                      style="background-color: #98928B;"
                      title="Titan Tự Nhiên"
                      aria-label="Chọn màu Titan Tự Nhiên"
                      aria-checked="false" role="radio"></button>

              <!-- Màu 3: Titan Đen -->
              <button type="button" class="color-swatch-btn"
                      data-color-key="black"
                      data-color-name="Titan Đen"
                      data-img="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/%C4%90en.png"
                      style="background-color: #252527;"
                      title="Titan Đen"
                      aria-label="Chọn màu Titan Đen"
                      aria-checked="false" role="radio"></button>

              <!-- Màu 4: Titan Trắng -->
              <button type="button" class="color-swatch-btn"
                      data-color-key="white"
                      data-color-name="Titan Trắng"
                      data-img="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%E1%BA%A1c.png"
                      style="background-color: #F0F0F2;"
                      title="Titan Trắng"
                      aria-label="Chọn màu Titan Trắng"
                      aria-checked="false" role="radio"></button>

              <!-- Màu 5: Titan Sa Mạc -->
              <button type="button" class="color-swatch-btn"
                      data-color-key="desert"
                      data-color-name="Titan Sa Mạc"
                      data-img="SanPham/SanPham/Iphone/Ip%2018%20pro%20max/B%C4%83ng%20thanh.png"
                      style="background-color: #C4A78A;"
                      title="Titan Sa Mạc"
                      aria-label="Chọn màu Titan Sa Mạc"
                      aria-checked="false" role="radio"></button>

            </div>
          </div>

          <!-- 4. Chọn Dung Lượng (256GB / 512GB / 1TB - JavaScript tự động cập nhật giá) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
                <span id="variantLabel">Dung lượng lưu trữ</span>: <strong id="selectedVariantName" class="text-slate-900 font-extrabold text-sm ml-1">256GB</strong>
              </span>
            </div>
            <div id="variantGrid" class="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Chọn phiên bản">
              
              <!-- Bản 256GB -->
              <button type="button" class="storage-btn active"
                      data-capacity="256GB"
                      data-price="34990000"
                      data-old-price="36990000"
                      data-discount="-5%"
                      role="radio" aria-checked="true">
                <span class="text-sm font-black text-slate-900">256GB</span>
                <span class="text-[11px] font-semibold text-slate-500 mt-0.5">34.990.000₫</span>
              </button>

              <!-- Bản 512GB -->
              <button type="button" class="storage-btn"
                      data-capacity="512GB"
                      data-price="38990000"
                      data-old-price="40990000"
                      data-discount="-5%"
                      role="radio" aria-checked="false">
                <span class="text-sm font-black text-slate-900">512GB</span>
                <span class="text-[11px] font-semibold text-slate-500 mt-0.5">38.990.000₫</span>
              </button>

              <!-- Bản 1TB -->
              <button type="button" class="storage-btn"
                      data-capacity="1TB"
                      data-price="44990000"
                      data-old-price="46990000"
                      data-discount="-4%"
                      role="radio" aria-checked="false">
                <span class="text-sm font-black text-slate-900">1TB</span>
                <span class="text-[11px] font-semibold text-slate-500 mt-0.5">44.990.000₫</span>
              </button>

            </div>
          </div>

          <!-- 5. Khung Ưu Đãi Độc Quyền (Bento Promo Card) -->
          <div class="p-4 rounded-2xl bg-brand-soft/60 border border-brand/20 space-y-2">
            <p class="text-xs font-black uppercase tracking-wider text-brand flex items-center gap-1.5">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
              Ưu đãi đặc quyền tại VLU FLAGSHIP STORE
            </p>
            <ul id="pdPerks" class="text-xs text-slate-700 space-y-1.5 font-medium">
              <li class="flex items-start gap-2">
                <span class="text-brand font-bold">•</span>
                <span>Thu cũ trợ giá lên tới <strong>5.000.000₫</strong> khi lên đời iPhone 18 Pro Max</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand font-bold">•</span>
                <span>Tặng củ sạc nhanh 35W GaN Dual USB-C &amp; kính cường lực cao cấp</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand font-bold">•</span>
                <span>Giảm ngay 50% khi mua kèm ốp lưng MagSafe hoặc tai nghe AirPods Pro 2</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand font-bold">•</span>
                <span>Bảo hành VIP 24 tháng chính hãng, 1 đổi 1 trong 30 ngày nếu phát sinh lỗi</span>
              </li>
            </ul>
          </div>

          <!-- 6. Cụm Nút Hành Động (Mua Ngay -> cart.html & Thêm Vào Giỏ Toast) -->
          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            
            <!-- Nút chính: MUA NGAY (chuyển hướng sang cart.html) -->
            <a href="cart.html"
               id="buyNowBtn"
               class="flex-1 h-13 py-3.5 rounded-full bg-brand text-white font-extrabold text-center hover:bg-brand-dark transition-all duration-200 shadow-lg shadow-brand/25 active:scale-98 flex items-center justify-center gap-2 text-base">
              <span>Mua ngay</span>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </a>

            <!-- Nút phụ: THÊM VÀO GIỎ HÀNG (kèm hiệu ứng Toast) -->
            <button type="button"
                    id="addToCartBtn"
                    class="flex-1 h-13 py-3.5 rounded-full bg-slate-900 text-white font-extrabold hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-98 flex items-center justify-center gap-2 text-base">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>
              </svg>
              <span>Thêm vào giỏ hàng</span>
            </button>

          </div>

          <!-- 7. Cam Kết Dịch Vụ Chuẩn Flagship -->
          <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/70 text-xs text-slate-600 font-semibold">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>100% Máy mới nguyên seal</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>Giao hỏa tốc nội thành 2h</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-brand flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Đổi mới 30 ngày miễn phí</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>Bảo hành chính hãng 24 tháng</span>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ============================================================
         PHẦN 2: BẢNG THÔNG SỐ KỸ THUẬT CHI TIẾT (BENTO GRID HIỆN ĐẠI 2026)
         ============================================================ -->
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 border-t border-slate-200/80">
      
      <!-- Tiêu đề phần thông số -->
      <div class="mb-8">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black uppercase tracking-[0.2em] text-brand">Chi Tiết Phần Cứng</span>
          <span class="inline-block h-1 w-1 rounded-full bg-slate-300"></span>
          <span class="text-xs font-bold text-slate-500">Thế hệ Flagship đỉnh cao 2026</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Bảng thông số kỹ thuật chi tiết
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Trang bị những công nghệ phần cứng tiên phong nhất thế giới từ hệ sinh thái Apple.
        </p>
      </div>

      <!-- Lưới Bento Grid 8 khối cấu hình -->
      <div id="pdBento" class="spec-bento-grid mb-8">
        
        <!-- Khối 1: Màn hình -->
        <div class="spec-bento-card">
          <div class="flex items-center gap-2.5 mb-3 text-brand">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10v10H7z"/></svg>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900">Màn hình</h3>
          </div>
          <p class="text-lg font-black text-slate-950">6.9" Super Retina XDR</p>
          <ul class="mt-2 text-xs text-slate-600 space-y-1 font-medium">
            <li>• Tấm nền OLED ProMotion 120Hz mượt mà</li>
            <li>• Dynamic Island thế hệ 2.0 cảm ứng</li>
            <li>• Always-On Display &amp; Độ sáng 3000 nits</li>
            <li>• Mặt kính Ceramic Shield siêu bền thế hệ mới</li>
          </ul>
        </div>

        <!-- Khối 2: Vi xử lý -->
        <div class="spec-bento-card">
          <div class="flex items-center gap-2.5 mb-3 text-purple-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900">Vi xử lý (CPU)</h3>
          </div>
          <p class="text-lg font-black text-slate-950">Apple A20 Pro (2nm)</p>
          <ul class="mt-2 text-xs text-slate-600 space-y-1 font-medium">
            <li>• Tiến trình 2nm tiên tiến nhất thế giới</li>
            <li>• 6 lõi CPU (2 lõi hiệu năng cao + 4 lõi tiết kiệm điện)</li>
            <li>• GPU 6 lõi với Ray Tracing tăng tốc phần cứng</li>
            <li>• Neural Engine 16 lõi xử lý AI tốc độ cao</li>
          </ul>
        </div>

        <!-- Khối 3: Camera -->
        <div class="spec-bento-card">
          <div class="flex items-center gap-2.5 mb-3 text-blue-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="4"/></svg>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900">Camera Pro</h3>
          </div>
          <p class="text-lg font-black text-slate-950">48MP Tứ Lăng Kính</p>
          <ul class="mt-2 text-xs text-slate-600 space-y-1 font-medium">
            <li>• Camera chính 48MP Fusion khẩu độ f/1.78</li>
            <li>• Camera góc siêu rộng 48MP chụp Macro sắc nét</li>
            <li>• Tiềm vọng Tetraprism 48MP Zoom quang 5x</li>
            <li>• Nút cảm ứng Camera Control chụp nhanh</li>
          </ul>
        </div>

        <!-- Khối 4: Pin & Sạc -->
        <div class="spec-bento-card">
          <div class="flex items-center gap-2.5 mb-3 text-emerald-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900">Pin &amp; Sạc</h3>
          </div>
          <p class="text-lg font-black text-slate-950">33 Giờ Xem Video</p>
          <ul class="mt-2 text-xs text-slate-600 space-y-1 font-medium">
            <li>• Sạc nhanh 50% trong vòng 25 phút</li>
            <li>• Hỗ trợ sạc MagSafe công suất 25W</li>
            <li>• Chuẩn sạc không dây Qi2 tương thích rộng rãi</li>
            <li>• Quản lý pin AI thông minh tối ưu tuổi thọ</li>
          </ul>
        </div>

      </div>

      <!-- Bảng kẻ sọc mờ (Striped Table) thông số kỹ thuật chi tiết -->
      <div class="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Thông số kỹ thuật đầy đủ</h3>
          <span id="pdSku" class="text-xs text-slate-500 font-medium">Mã sản phẩm: A3294 (VN/A)</span>
        </div>

        <div id="pdSpecTable" class="divide-y divide-slate-100 text-sm">
          
          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Công nghệ màn hình</span>
            <span class="text-slate-600 w-2/3">Super Retina XDR OLED, ProMotion 120Hz, HDR10, Dolby Vision, 3000 nits đỉnh</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Kích thước màn hình</span>
            <span class="text-slate-600 w-2/3">6.9 inch (Độ phân giải 2868 x 1320 pixels, mật độ 460 ppi)</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Chipset (Vi xử lý)</span>
            <span class="text-slate-600 w-2/3">Apple A20 Pro 2nm 6-core CPU, 6-core GPU, 16-core Neural Engine</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Dung lượng bộ nhớ</span>
            <span class="text-slate-600 w-2/3">256GB / 512GB / 1TB (NVMe tốc độ cao)</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Hệ thống Camera sau</span>
            <span class="text-slate-600 w-2/3">48MP Chính (OIS Sensor-shift) + 48MP Ultra-Wide + 48MP Telephoto Zoom 5x quang học</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Camera trước</span>
            <span class="text-slate-600 w-2/3">12MP TrueDepth với khẩu độ f/1.9, tự động lấy nét PDAF, quay 4K Dolby Vision</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Quay video chuyên nghiệp</span>
            <span class="text-slate-600 w-2/3">4K 120fps Dolby Vision, ProRes 4K 120fps trực tiếp ổ cứng ngoài, Spatial Video không gian</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Chất liệu khung &amp; Mặt kính</span>
            <span class="text-slate-600 w-2/3">Khung Titanium Hàng Không Cấp 5, Kính Ceramic Shield 2.0 chống xước gấp 4 lần</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Chuẩn kháng nước &amp; bụi</span>
            <span class="text-slate-600 w-2/3">IP68 (Độ sâu tối đa 6 mét trong vòng 30 phút theo tiêu chuẩn IEC 60529)</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Cổng kết nối</span>
            <span class="text-slate-600 w-2/3">USB Type-C hỗ trợ chuẩn USB 3 (Tốc độ truyền dữ liệu lên tới 10Gb/s), DisplayPort</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Hệ điều hành</span>
            <span class="text-slate-600 w-2/3">iOS 19 tích hợp hệ thống trí tuệ nhân tạo Apple Intelligence hỗ trợ tiếng Việt toàn diện</span>
          </div>

          <div class="spec-table-row">
            <span class="font-bold text-slate-900 w-1/3">Quy cách đóng hộp</span>
            <span class="text-slate-600 w-2/3">Thân máy iPhone 18 Pro Max, Cáp sạc USB-C bọc dù cao cấp 1m, Tài liệu HDSD, Que lấy SIM</span>
          </div>

        </div>
      </div>

    </section>

  </main>

  <!-- ============================================================
       [FOOTER] ĐỒNG BỘ NGUYÊN BẢN VLU FLAGSHIP STORE
       ============================================================ -->
  <?php include __DIR__ . '/frontend/components/footer.php'; ?>

  <!-- Toast thông báo Dynamic Island -->
  <div id="toast" role="status" aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-xl"></div>
  <!-- Client Script chung cho Header Mega-Menu & Drawer -->
  <script src="frontend/assets/js/main.js"></script>

  <!-- Dữ liệu catalog và image manifest cho Dynamic Product Detail -->
  <script src="frontend/assets/js/image-manifest.js"></script>
  <script src="frontend/assets/js/products-data.js"></script>
  <script src="frontend/assets/js/product-detail.js"></script>
</body>
</html>
