<?php
/**
 * VLU FLAGSHIP STORE – Shared Footer Component
 * Đồng bộ 100% trên toàn bộ hệ thống trang: index, product-detail, cart, checkout
 */
?>
<footer class="mt-12 border-t border-slate-200/80 bg-white">
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 border-b border-slate-100 pb-12 md:grid-cols-4">
      <div class="space-y-4 md:col-span-2">
        <a href="index.html" class="site-logo inline-flex items-center gap-3" aria-label="VLU FLAGSHIP STORE – Trang chủ">
          <img src="frontend/assets/images/logo.png" onerror="this.onerror=null;this.src='image_2c97c5.png';" alt="VLU FLAGSHIP STORE" class="h-10 w-auto">
          <span class="text-base font-extrabold tracking-tight text-slate-900">VLU FLAGSHIP STORE</span>
        </a>
        <p class="max-w-md text-sm leading-relaxed text-slate-500">
          Hệ thống cửa hàng công nghệ chính hãng: điện thoại, laptop, iPad, tai nghe, loa, phụ kiện và đồng hồ điện tử. Cam kết 100% hàng chuẩn VN/A, bảo hành toàn diện, đổi trả minh bạch.
        </p>
        <div class="flex items-center gap-4 text-xs text-slate-500">
          <span class="flex items-center gap-1 font-semibold text-emerald-600">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Chính hãng Apple &amp; đối tác
          </span>
          <span class="text-slate-300">|</span>
          <span class="flex items-center gap-1 font-semibold text-emerald-600">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Giao nhanh 2H
          </span>
        </div>
      </div>

      <div>
        <h4 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">Danh mục sản phẩm</h4>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-slate-600 md:grid-cols-1">
          <li><a href="index.html#dien-thoai" class="font-medium transition hover:text-brand">Điện thoại</a></li>
          <li><a href="index.html#laptop" class="font-medium transition hover:text-brand">Laptop</a></li>
          <li><a href="index.html#ipad" class="font-medium transition hover:text-brand">iPad</a></li>
          <li><a href="index.html#tai-nghe" class="font-medium transition hover:text-brand">Tai nghe</a></li>
          <li><a href="index.html#loa" class="font-medium transition hover:text-brand">Loa</a></li>
          <li><a href="index.html#phu-kien" class="font-medium transition hover:text-brand">Phụ kiện</a></li>
          <li><a href="index.html#dong-ho" class="font-medium transition hover:text-brand">Đồng hồ điện tử</a></li>
        </ul>
      </div>

      <div>
        <h4 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">Dịch vụ &amp; Hỗ trợ</h4>
        <ul class="space-y-2.5 text-sm text-slate-600">
          <li class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75l-4.5 4.5M12 7.5L7.5 12"/></svg>
            <span>Giao hàng nhanh trong 2 giờ</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Bảo hành chính hãng 12 - 24 tháng</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h.75m0 0a60.07 60.07 0 0115.797-2.101c.727-.198 1.453.342 1.453 1.096V18.75"/></svg>
            <span>Trả góp 0% lãi suất xét duyệt 5 phút</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"/></svg>
            <span>Thu cũ đổi mới trợ giá tới 5.000.000₫</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-500 sm:flex-row">
      <p>© <?= date('Y') ?> <strong class="font-bold text-slate-800">VLU FLAGSHIP STORE</strong>. Tất cả quyền được bảo lưu. Dự án Công nghệ 2026.</p>
      <div class="flex items-center gap-6">
        <a href="cart.html" class="hover:text-brand transition">Giỏ hàng</a>
        <a href="checkout.html" class="hover:text-brand transition">Thanh toán</a>
        <a href="index.html" class="hover:text-brand transition">Trang chủ</a>
      </div>
    </div>
  </div>
</footer>
