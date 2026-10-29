<?php
/**
 * VLU FLAGSHIP STORE – Trang Thanh Toán 2026 (checkout.php)
 * Form thông tin nhận hàng, 3 phương thức thanh toán (COD, VietQR, Apple Pay/Thẻ), kiểm tra đơn hàng, Modal thành công
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
  <title>Thanh toán & Đặt hàng – VLU FLAGSHIP STORE</title>
  <meta name="description" content="Thanh toán an toàn, bảo mật và tiện lợi cho các thiết bị công nghệ chính hãng tại VLU FLAGSHIP STORE.">
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
       [MAIN] BỐ CỤC 2 CỘT THANH TOÁN
       ============================================================ -->
  <main id="main" class="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Breadcrumb & Tiêu đề trang -->
    <div class="mb-8">
      <nav aria-label="Breadcrumb" class="text-xs font-medium text-slate-500 mb-2">
        <ol class="flex items-center gap-2">
          <li><a href="index.html" class="hover:text-brand transition">Trang chủ</a></li>
          <li><span class="text-slate-300">/</span></li>
          <li><a href="cart.html" class="hover:text-brand transition">Giỏ hàng</a></li>
          <li><span class="text-slate-300">/</span></li>
          <li class="text-slate-900 font-bold" aria-current="page">Thanh toán &amp; Đặt hàng</li>
        </ol>
      </nav>
      <h1 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Thanh toán đơn hàng</h1>
    </div>

    <!-- Bố cục 2 Cột Checkout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- ================= CỘT TRÁI: FORM THÔNG TIN NGƯỜI NHẬN & THANH TOÁN (lg:col-span-7) ================= -->
      <div class="lg:col-span-7 space-y-6">
        
        <form id="checkoutForm" class="space-y-6">
          
          <!-- Phần 1: Thông tin người nhận -->
          <div class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span class="grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-black text-white">1</span>
              <h2 class="text-base font-extrabold text-slate-900">Thông tin giao hàng</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Họ và tên -->
              <div class="sm:col-span-2">
                <label for="checkoutFullname" class="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên người nhận <span class="text-red-500">*</span>
                </label>
                <input type="text" id="checkoutFullname" name="fullname" required placeholder="Ví dụ: Nguyễn Văn An" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition">
              </div>

              <!-- Số điện thoại -->
              <div>
                <label for="checkoutPhone" class="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại nhận hàng <span class="text-red-500">*</span>
                </label>
                <input type="tel" id="checkoutPhone" name="phone" required placeholder="Ví dụ: 0912345678" pattern="(03|05|07|08|09)[0-9]{8}" maxlength="10" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition">
              </div>

              <!-- Email -->
              <div>
                <label for="checkoutEmail" class="block text-xs font-bold text-slate-700 mb-1">
                  Email (nhận hóa đơn điện tử)
                </label>
                <input type="email" id="checkoutEmail" name="email" placeholder="example@email.com" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition">
              </div>

              <!-- Tỉnh / Thành phố -->
              <div>
                <label for="checkoutCity" class="block text-xs font-bold text-slate-700 mb-1">Tỉnh / Thành phố</label>
                <select id="checkoutCity" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition">
                  <option value="Hồ Chí Minh" selected>TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Khác">Tỉnh thành khác...</option>
                </select>
              </div>

              <!-- Quận / Huyện -->
              <div>
                <label for="checkoutDistrict" class="block text-xs font-bold text-slate-700 mb-1">Quận / Huyện</label>
                <input type="text" id="checkoutDistrict" placeholder="Ví dụ: Quận 1, Quận Bình Thạnh..." class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition">
              </div>

              <!-- Địa chỉ cụ thể -->
              <div class="sm:col-span-2">
                <label for="checkoutAddress" class="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ số nhà &amp; tên đường, phường/xã <span class="text-red-500">*</span>
                </label>
                <input type="text" id="checkoutAddress" name="address" required placeholder="Ví dụ: Số 69/68 Đặng Thùy Trâm, Phường 13" class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition">
              </div>

              <!-- Ghi chú giao hàng -->
              <div class="sm:col-span-2">
                <label for="checkoutNotes" class="block text-xs font-bold text-slate-700 mb-1">Ghi chú giao hàng (Tùy chọn)</label>
                <textarea id="checkoutNotes" rows="2" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..." class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- Phần 2: Phương thức thanh toán (3 Radio Cards) -->
          <div class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span class="grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-black text-white">2</span>
              <h2 class="text-base font-extrabold text-slate-900">Phương thức thanh toán</h2>
            </div>

            <div class="space-y-3">
              
              <!-- Tùy chọn 1: COD -->
              <label class="payment-card flex items-start gap-3.5 rounded-2xl border-2 border-slate-200 bg-white p-4 cursor-pointer transition hover:border-slate-300 has-[:checked]:border-brand has-[:checked]:bg-brand-soft/20">
                <input type="radio" name="payment_method" value="cod" class="mt-1 h-4 w-4 text-brand focus:ring-brand accent-brand">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-900">Thanh toán khi nhận hàng (COD)</span>
                    <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Miễn phí thu hộ</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">Kiểm tra kiện hàng nguyên seal và thanh toán tiền mặt trực tiếp cho nhân viên giao hàng.</p>
                </div>
              </label>

              <!-- Tùy chọn 2: VietQR (Mặc định chọn hoặc tương tác xổ QR) -->
              <label class="payment-card flex items-start gap-3.5 rounded-2xl border-2 border-slate-200 bg-white p-4 cursor-pointer transition hover:border-slate-300 has-[:checked]:border-brand has-[:checked]:bg-brand-soft/20">
                <input type="radio" name="payment_method" value="vietqr" checked class="mt-1 h-4 w-4 text-brand focus:ring-brand accent-brand">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-slate-900">Chuyển khoản ngân hàng qua mã VietQR</span>
                      <span class="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-black text-brand">Khuyên dùng</span>
                    </div>
                    <span class="text-xs font-bold text-slate-500">Tự động xác nhận 30s</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">Quét mã QR bằng mọi ứng dụng ngân hàng hoặc ví điện tử (MB, VCB, BIDV, Techcombank...).</p>
                </div>
              </label>

              <!-- Khung xổ VietQR khi chọn tùy chọn 2 -->
              <div id="vietqrBox" class="rounded-2xl border border-brand/30 bg-gradient-to-br from-white to-brand-soft/30 p-5 space-y-4">
                <div class="flex flex-col sm:flex-row items-center gap-5">
                  
                  <!-- Khung ảnh QR Code VietQR 2026 -->
                  <div class="shrink-0 rounded-2xl bg-white p-3 border border-slate-200/80 shadow-md text-center">
                    <div class="w-36 h-36 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 relative overflow-hidden">
                      <!-- SVG Minh họa Mã QR VietQR sắc nét -->
                      <svg class="w-32 h-32 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z M45 10h10v10h-10z M45 30h10v10h-10z M45 50h10v10h-10z M10 45h10v10h-10z M30 45h10v10h-10z M60 45h10v10h-10z M80 45h10v10h-10z M45 70h10v20h-10z M60 60h10v10h-10z M75 60h15v10h-15z M60 80h20v10h-20z M85 75h10v15h-10z"/>
                        <circle cx="50" cy="50" r="10" fill="#C8102E"/>
                      </svg>
                    </div>
                    <span class="block mt-1 text-[10px] font-black uppercase text-brand tracking-wider">VietQR 24/7</span>
                  </div>

                  <!-- Thông tin số tài khoản & Ngân hàng -->
                  <div class="flex-1 space-y-2.5 text-xs text-slate-700">
                    <div class="flex justify-between items-center py-1 border-b border-slate-100">
                      <span class="text-slate-500">Ngân hàng:</span>
                      <strong class="text-slate-900 font-extrabold">MB Bank (Ngân Hàng Quân Đội)</strong>
                    </div>
                    <div class="flex justify-between items-center py-1 border-b border-slate-100">
                      <span class="text-slate-500">Chủ tài khoản:</span>
                      <strong class="text-slate-900 font-extrabold uppercase">VLU FLAGSHIP STORE</strong>
                    </div>
                    <div class="flex justify-between items-center py-1 border-b border-slate-100">
                      <span class="text-slate-500">Số tài khoản:</span>
                      <div class="flex items-center gap-1.5">
                        <strong class="text-slate-950 font-black text-sm tracking-wide">0987654321</strong>
                        <button type="button" data-copy="0987654321" class="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition">Sao chép</button>
                      </div>
                    </div>
                    <div class="flex justify-between items-center py-1 border-b border-slate-100">
                      <span class="text-slate-500">Nội dung CK:</span>
                      <div class="flex items-center gap-1.5">
                        <strong class="text-brand font-black tracking-wide">VLU <span id="qrOrderCodeText">2026</span></strong>
                        <button type="button" id="copySyntaxBtn" data-copy="" class="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand hover:bg-brand/20 transition">Sao chép</button>
                      </div>
                    </div>
                    <div class="flex justify-between items-center pt-1">
                      <span class="text-slate-500">Số tiền cần chuyển:</span>
                      <strong id="qrOrderTotalText" class="text-brand font-black text-sm">0₫</strong>
                    </div>
                  </div>

                </div>
                <p class="text-[11px] text-slate-500 text-center sm:text-left italic">
                  💡 Sau khi chuyển khoản, bấm nút "Hoàn tất đặt hàng" bên dưới để hệ thống đối soát tự động.
                </p>
              </div>

              <!-- Tùy chọn 3: Thẻ tín dụng / Apple Pay -->
              <label class="payment-card flex items-start gap-3.5 rounded-2xl border-2 border-slate-200 bg-white p-4 cursor-pointer transition hover:border-slate-300 has-[:checked]:border-brand has-[:checked]:bg-brand-soft/20">
                <input type="radio" name="payment_method" value="credit" class="mt-1 h-4 w-4 text-brand focus:ring-brand accent-brand">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-900">Thẻ quốc tế / Apple Pay</span>
                    <div class="flex items-center gap-1 text-[10px] font-black text-slate-500">
                      <span>Visa</span> • <span>Mastercard</span> • <span>Apple Pay</span>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">Xác thực 3D-Secure 2.0 an toàn tuyệt đối qua cổng thanh toán liên kết ngân hàng.</p>
                </div>
              </label>

            </div>
          </div>

          <!-- Nút Hoàn tất đặt hàng (Desktop/Mobile Submit) -->
          <div class="pt-2">
            <button type="submit" id="btnSubmitOrder" class="w-full h-14 rounded-full bg-brand text-white font-black text-base hover:bg-brand-dark transition-all duration-200 shadow-xl shadow-brand/30 active:scale-98 flex items-center justify-center gap-2">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
              <span>Hoàn tất đặt hàng</span>
            </button>
            <p class="text-center text-[11px] text-slate-400 mt-2">
              Bằng việc bấm đặt hàng, bạn đồng ý với <a href="#" class="text-slate-600 underline">Điều khoản dịch vụ</a> và <a href="#" class="text-slate-600 underline">Chính sách bảo mật</a> của VLU Flagship Store.
            </p>
          </div>

        </form>

      </div>

      <!-- ================= CỘT PHẢI: KIỂM TRA ĐƠN HÀNG - ORDER REVIEW (lg:col-span-5) ================= -->
      <div class="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
        
        <div class="rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-base font-extrabold text-slate-950">Đơn hàng của bạn</h2>
            <span id="checkoutCountBadge" class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">0 sản phẩm</span>
          </div>

          <!-- Danh sách các món hàng đối chiếu từ localStorage -->
          <div id="checkoutItemsList" class="space-y-1 max-h-80 overflow-y-auto pr-1">
            <!-- Dynamic items rendered here -->
          </div>

          <!-- Bảng dòng chi tiết giá -->
          <div class="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div class="flex justify-between">
              <span>Tạm tính</span>
              <span id="checkoutSubtotal" class="font-bold text-slate-900">0₫</span>
            </div>
            <div class="flex justify-between">
              <span>Phí vận chuyển</span>
              <span class="font-bold text-emerald-600">Miễn phí</span>
            </div>
            <div id="checkoutDiscountRow" class="hidden flex justify-between text-emerald-600 font-bold">
              <span>Ưu đãi Voucher</span>
              <span id="checkoutDiscount">-0₫</span>
            </div>
            <div class="pt-3 border-t border-slate-200/80 flex justify-between items-baseline">
              <span class="text-sm font-bold text-slate-900">Tổng thanh toán</span>
              <div class="text-right">
                <span id="checkoutTotal" class="text-2xl font-black text-brand tracking-tight">0₫</span>
                <p class="text-[10px] text-slate-400 font-medium">(Đã bao gồm VAT 10%)</p>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <a href="cart.html" class="block text-center text-xs font-bold text-brand hover:underline">
              ← Chỉnh sửa giỏ hàng / Thay đổi số lượng
            </a>
          </div>

          <!-- Cam kết mua sắm an toàn -->
          <div class="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>100% Sản phẩm chính hãng Apple &amp; đối tác</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Giao hàng bảo hiểm hỏa tốc 2 giờ</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
              <span>Bảo mật giao dịch mã hóa 256-bit</span>
            </div>
          </div>

        </div>

      </div>

    </div>

  </main>

  <!-- ============================================================
       [MODAL] ĐẶT HÀNG THÀNH CÔNG SANG TRỌNG (Glassmorphism Modal)
       ============================================================ -->
  <div id="orderSuccessModal" class="hidden fixed inset-0 z-50 items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in">
    <div class="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-scale-up">
      
      <!-- Icon checkmark động -->
      <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
        <svg class="h-10 w-10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
      </div>

      <!-- Tiêu đề & Lời cảm ơn -->
      <div class="space-y-1">
        <span class="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Đặt hàng thành công</span>
        <h3 class="text-2xl font-black text-slate-950 tracking-tight">Cảm ơn bạn đã mua hàng!</h3>
        <p class="text-xs text-slate-500">Đơn hàng của bạn đã được chuyển tới hệ thống điều phối VLU Flagship Store.</p>
      </div>

      <!-- Khung tóm tắt mã đơn và thông tin nhận hàng -->
      <div class="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-left text-xs text-slate-700 space-y-2">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200/80">
          <span class="text-slate-500 font-medium">Mã đơn hàng:</span>
          <strong id="successOrderId" class="text-sm font-black text-brand tracking-wider">#VLU-2026-00000</strong>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-500 font-medium">Người nhận:</span>
          <strong id="successCustomerName" class="text-slate-900 font-bold">--</strong>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-500 font-medium">Số điện thoại:</span>
          <strong id="successCustomerPhone" class="text-slate-900 font-bold">--</strong>
        </div>
        <div class="flex justify-between items-start gap-3">
          <span class="text-slate-500 font-medium shrink-0">Địa chỉ:</span>
          <strong id="successCustomerAddress" class="text-slate-900 font-bold text-right truncate">--</strong>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-500 font-medium">Phương thức:</span>
          <strong id="successPaymentMethod" class="text-slate-900 font-bold">--</strong>
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-slate-200/80">
          <span class="text-slate-500 font-medium">Tổng thanh toán:</span>
          <strong id="successTotalAmount" class="text-base font-black text-brand">0₫</strong>
        </div>
      </div>

      <p class="text-[11px] text-slate-400">
        Nhân viên chăm sóc khách hàng sẽ liên hệ xác nhận trong vòng 15 phút.
      </p>

      <!-- Nút quay về trang chủ -->
      <div class="pt-2 flex flex-col sm:flex-row gap-3">
        <a href="index.html" class="flex-1 rounded-full bg-brand py-3 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark active:scale-95 text-center">
          Quay về trang chủ
        </a>
        <a href="index.html#dien-thoai" class="flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 text-center">
          Tiếp tục mua sắm
        </a>
      </div>

    </div>
  </div>

  <!-- ============================================================
       [FOOTER] ĐỒNG BỘ 100% TOÀN BỘ WEBSITE
       ============================================================ -->
  <?php include __DIR__ . '/frontend/components/footer.php'; ?>

  <!-- Toast thông báo -->
  <div id="toast" role="status" aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-xl"></div>

  <!-- Scripts -->
  <script src="frontend/assets/js/main.js"></script>
  <script src="frontend/assets/js/checkout-page.js"></script>

</body>
</html>
