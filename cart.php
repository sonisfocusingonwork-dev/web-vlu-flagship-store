<?php
/**
 * VLU FLAGSHIP STORE – Trang Giỏ Hàng 2026 (cart.php)
 * Bố cục 2 cột chuẩn Apple Store, kết nối động localStorage Cart Engine, tính toán thời gian thực
 */

require_once __DIR__ . '/backend/lib/product_links.php';

function e($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="vi" class="h-full scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Giỏ hàng của bạn – VLU FLAGSHIP STORE</title>
  <meta name="description" content="Xem và quản lý các thiết bị công nghệ chính hãng trong giỏ hàng tại VLU FLAGSHIP STORE. Miễn phí vận chuyển toàn quốc.">
  <link rel="icon" type="image/png" href="image_2c97c5.png">

  <!-- Font chữ Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: { DEFAULT: '#C8102E', dark: '#9B0D23', soft: '#FDF2F4' },
            ink: '#0B0F19'
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
          }
        }
      }
    }
  </script>

  <!-- Stylesheet Hệ thống Glassmorphic 2026 -->
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-[#F8F9FC] font-sans text-ink antialiased min-h-screen flex flex-col selection:bg-brand selection:text-white">

  <!-- ============================================================
       [HEADER] ĐỒNG BỘ 100% VỚI 7 MEGA-MENU TỪ COMPONENT HEADER
       ============================================================ -->
  <?php include __DIR__ . '/frontend/components/header.php'; ?>

  <!-- ============================================================
       [MAIN] BỐ CỤC 2 CỘT CHUẨN APPLE STORE
       ============================================================ -->
  <main id="main" class="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Breadcrumb & Tiêu đề trang -->
    <div class="mb-8">
      <nav aria-label="Breadcrumb" class="text-xs font-medium text-slate-500 mb-2">
        <ol class="flex items-center gap-2">
          <li><a href="index.html" class="hover:text-brand transition">Trang chủ</a></li>
          <li><span class="text-slate-300">/</span></li>
          <li class="text-slate-900 font-bold" aria-current="page">Giỏ hàng của bạn</li>
        </ol>
      </nav>
      <div class="flex flex-wrap items-baseline gap-3">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Giỏ hàng</h1>
        <span id="cartCountHeader" class="text-sm font-semibold text-slate-500"></span>
      </div>
    </div>

    <!-- Khung chính giỏ hàng (2 Cột) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- ================= CỘT TRÁI: DANH SÁCH MÓN HÀNG (lg:col-span-8) ================= -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Trạng thái giỏ hàng có sản phẩm -->
        <div id="cartMainContent" class="space-y-4">
          
          <!-- Thanh tiện ích trên cùng: Miễn phí vận chuyển & Nút làm trống -->
          <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm">
            <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600">
              <span class="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75l-4.5 4.5M12 7.5L7.5 12"/></svg>
              </span>
              <span>Miễn phí giao hàng tiêu chuẩn toàn quốc</span>
            </div>
            <button type="button" id="btnClearAllCart" class="text-xs font-semibold text-slate-400 hover:text-red-500 transition">
              Làm trống giỏ hàng
            </button>
          </div>

          <!-- Danh sách thẻ sản phẩm (Render động bằng cart-page.js) -->
          <div id="cartItemsList" class="space-y-3">
            <!-- Dynamic items rendered here -->
          </div>

          <!-- Khung cam kết an tâm mua sắm -->
          <div class="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-sm p-4 sm:p-5">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">Đặc quyền khách hàng tại VLU FLAGSHIP STORE</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div class="flex items-center gap-2">
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <span>100% Chính hãng VN/A</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                </span>
                <span>Đổi mới 30 ngày nếu lỗi NSX</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <span>Giao nhanh 2 giờ nội thành</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Trạng thái giỏ hàng trống (Hiện ra khi không có món nào) -->
        <div id="cartEmptyState" class="hidden rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-slate-50 text-slate-400">
            <svg class="h-10 w-10" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-900">Giỏ hàng của bạn đang trống</h2>
          <p class="max-w-md mx-auto text-sm text-slate-500">
            Hiện tại bạn chưa chọn thiết bị công nghệ nào. Hãy khám phá ngay các sản phẩm flagship mới nhất năm 2026 với ưu đãi hấp dẫn.
          </p>
          <div class="pt-2">
            <a href="index.html" class="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark active:scale-95">
              <span>Tiếp tục mua sắm</span>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </a>
          </div>
        </div>

      </div>

      <!-- ================= CỘT PHẢI: TÓM TẮT ĐƠN HÀNG - STICKY SUMMARY (lg:col-span-4) ================= -->
      <div class="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
        
        <div class="rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 shadow-sm space-y-5">
          <h2 class="text-base font-extrabold text-slate-950 flex items-center justify-between">
            <span>Tóm tắt đơn hàng</span>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Bảo mật SSL</span>
          </h2>

          <!-- Bảng dòng chi tiết giá -->
          <div class="space-y-3 text-sm text-slate-600 border-b border-slate-100 pb-4">
            <div class="flex justify-between">
              <span>Tạm tính</span>
              <span id="summarySubtotal" class="font-bold text-slate-900">0₫</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Phí vận chuyển</span>
              <span class="font-bold text-emerald-600">Miễn phí</span>
            </div>
            <div id="summaryDiscountRow" class="hidden flex justify-between items-center text-emerald-600">
              <span class="font-medium">Giảm giá ưu đãi</span>
              <span id="summaryDiscount" class="font-bold">-0₫</span>
            </div>
          </div>

          <!-- Khung Voucher / Mã giảm giá -->
          <div class="space-y-2.5">
            <label for="voucherInput" class="block text-xs font-bold text-slate-700">Mã giảm giá / Voucher</label>
            
            <div class="flex gap-2">
              <input type="text" id="voucherInput" placeholder="Nhập mã (VLU2026, FLAGSHIP...)" class="flex-1 uppercase rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition">
              <button type="button" id="applyVoucherBtn" class="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95">
                Áp dụng
              </button>
            </div>

            <!-- Gợi ý voucher nhanh -->
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              <span class="text-[11px] text-slate-400">Gợi ý:</span>
              <button type="button" data-promo="VLU2026" class="rounded-md border border-brand/20 bg-brand-soft/50 px-2 py-0.5 text-[11px] font-bold text-brand hover:bg-brand-soft transition">
                VLU2026 (-500K)
              </button>
              <button type="button" data-promo="FLAGSHIP" class="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition">
                FLAGSHIP (-1TR)
              </button>
            </div>

            <!-- Trạng thái Voucher đang hoạt động -->
            <div id="activeVoucherBox" class="hidden rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 truncate">
                <svg class="h-4 w-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div class="truncate">
                  <span id="activeVoucherCode" class="font-extrabold uppercase"></span>: <span id="activeVoucherLabel"></span>
                </div>
              </div>
              <button type="button" id="removeVoucherBtn" class="shrink-0 text-emerald-700 hover:text-red-600 font-black p-0.5" title="Gỡ mã này">✕</button>
            </div>

            <p id="voucherFeedback" class="hidden text-xs"></p>
          </div>

          <!-- Dòng Tổng thanh toán -->
          <div class="pt-2 border-t border-slate-200/80 flex justify-between items-baseline">
            <span class="text-base font-bold text-slate-900">Tổng thanh toán</span>
            <div class="text-right">
              <span id="summaryTotal" class="text-2xl sm:text-3xl font-black text-brand tracking-tight">0₫</span>
              <p class="text-[11px] text-slate-400 font-medium">(Đã bao gồm thuế VAT 10%)</p>
            </div>
          </div>

          <!-- Nút hành động chính: TIẾN HÀNH THANH TOÁN (chuyển sang checkout.html) -->
          <a href="checkout.html" id="checkoutBtn" class="w-full h-13 py-3.5 rounded-full bg-brand text-white font-extrabold text-center hover:bg-brand-dark transition-all duration-200 shadow-lg shadow-brand/25 active:scale-98 flex items-center justify-center gap-2 text-base">
            <span>Tiến hành thanh toán</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </a>

          <!-- Liên kết quay lại mua sắm -->
          <a href="index.html" class="w-full block py-1 text-center text-xs font-bold text-slate-500 hover:text-brand transition">
            ← Tiếp tục lựa chọn thêm sản phẩm khác
          </a>

          <!-- Logo bảo mật / thanh toán chấp nhận -->
          <div class="pt-3 border-t border-slate-100 text-center">
            <p class="text-[11px] font-semibold text-slate-400 mb-2">CHẤP NHẬN THANH TOÁN AN TOÀN</p>
            <div class="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600">
              <span class="rounded bg-slate-100 px-2 py-1">VietQR</span>
              <span class="rounded bg-slate-100 px-2 py-1">Visa</span>
              <span class="rounded bg-slate-100 px-2 py-1">Mastercard</span>
              <span class="rounded bg-slate-100 px-2 py-1">Apple Pay</span>
              <span class="rounded bg-slate-100 px-2 py-1">COD</span>
            </div>
          </div>

        </div>

      </div>

    </div>

  </main>

  <!-- ============================================================
       [FOOTER] ĐỒNG BỘ 100% TOÀN BỘ WEBSITE
       ============================================================ -->
  <?php include __DIR__ . '/frontend/components/footer.php'; ?>

  <!-- Toast thông báo -->
  <div id="toast" role="status" aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-xl"></div>

  <!-- Scripts -->
  <script src="frontend/assets/js/main.js"></script>
  <script src="frontend/assets/js/cart-page.js"></script>

</body>
</html>
