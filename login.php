<?php
/**
 * VLU FLAGSHIP STORE – Trang Đăng Nhập 2026 (login.php)
 * Thiết kế chuẩn Apple ID Glassmorphism 2026, ambient mesh gradient, tích hợp name inputs cho bảng users
 */

require_once __DIR__ . '/backend/lib/product_links.php';

function e($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="vi" class="h-full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Đăng nhập – VLU FLAGSHIP STORE</title>
  <meta name="description" content="Đăng nhập tài khoản VLU FLAGSHIP STORE để trải nghiệm mua sắm thiết bị công nghệ chính hãng và theo dõi đơn hàng.">
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
  <style>
    /* Nền Ambient Mesh Gradient phong cách Apple Event 2026 */
    .ambient-bg {
      background: radial-gradient(circle at 15% 20%, rgba(200, 16, 46, 0.08) 0%, transparent 45%),
                  radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
                  radial-gradient(circle at 50% 50%, rgba(248, 249, 252, 1) 0%, #F1F4F9 100%);
    }
    .glass-auth-card {
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.6);
    }
  </style>
</head>
<body class="ambient-bg font-sans text-ink antialiased min-h-screen flex flex-col justify-between selection:bg-brand selection:text-white relative overflow-x-hidden">

  <!-- Đốm sáng chuyển sắc Ambient Orbs -->
  <div class="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" aria-hidden="true"></div>
  <div class="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true"></div>

  <!-- Header Đỉnh: Nút Điều hướng quay về Trang chủ -->
  <header class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-20">
    <a href="index.html" class="site-logo inline-flex items-center gap-2.5 transition active:scale-95" aria-label="VLU FLAGSHIP STORE – Về trang chủ">
      <img src="frontend/assets/images/logo.png" onerror="this.onerror=null;this.src='image_2c97c5.png';" alt="VLU FLAGSHIP STORE" class="h-9 w-auto">
      <span class="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 hidden sm:inline">VLU FLAGSHIP STORE</span>
    </a>
    <a href="index.html" class="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200/80 px-4 py-2 text-xs font-bold text-slate-700 hover:text-brand hover:border-brand/30 hover:bg-white transition-all shadow-sm active:scale-95">
      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
      <span>Trang chủ</span>
    </a>
  </header>

  <!-- Khung Giữa: Glassmorphism Card (Apple ID Style) -->
  <main class="flex-1 flex items-center justify-center px-4 py-6 sm:py-10 relative z-10 w-full">
    <div class="glass-auth-card w-full max-w-md rounded-3xl p-7 sm:p-9 space-y-6">
      
      <!-- Logo thương hiệu & Tiêu đề Form -->
      <div class="text-center space-y-2">
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand mb-2 shadow-inner">
          <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-black text-slate-950 tracking-tight">Đăng nhập tài khoản</h1>
        <p class="text-xs text-slate-500 font-medium">Hệ thống sinh thái thiết bị công nghệ chính hãng VLU 2026</p>
      </div>

      <!-- Khung báo lỗi (nếu có) -->
      <div id="loginErrorMsg" class="hidden rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600 text-center animate-fade-in"></div>

      <!-- Form Đăng nhập (chuẩn bảng users: username, password, remember) -->
      <form id="loginForm" method="POST" action="login.php" class="space-y-4">
        
        <!-- Ô nhập: Email hoặc Username -->
        <div>
          <label for="username" class="block text-xs font-bold text-slate-700 mb-1.5">Email hoặc Tên đăng nhập</label>
          <div class="relative">
            <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
            </span>
            <input type="text" id="username" name="username" required autocomplete="username" placeholder="admin@vlu.edu.vn hoặc tên đăng nhập" class="w-full rounded-2xl border border-slate-200 bg-white/90 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all">
          </div>
        </div>

        <!-- Ô nhập: Mật khẩu (kèm icon con mắt đóng/mở) -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="password" class="block text-xs font-bold text-slate-700">Mật khẩu</label>
            <a href="#" onclick="alert('Vui lòng liên hệ quản trị viên (admin@vlu.edu.vn) hoặc hotline 1800 2026 để khôi phục mật khẩu.'); return false;" class="text-[11px] font-bold text-brand hover:underline">Quên mật khẩu?</a>
          </div>
          <div class="relative">
            <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
            </span>
            <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="••••••••" class="w-full rounded-2xl border border-slate-200 bg-white/90 pl-10 pr-11 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all">
            
            <!-- Nút bật/tắt hiển thị mật khẩu -->
            <button type="button" id="togglePasswordBtn" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1" aria-label="Hiện mật khẩu">
              <!-- Icon Mắt Mở -->
              <svg id="eyeOpenIcon" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <!-- Icon Mắt Đóng (Mặc định ẩn) -->
              <svg id="eyeClosedIcon" class="h-4 w-4 hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Tiện ích: Ghi nhớ đăng nhập -->
        <div class="flex items-center justify-between text-xs">
          <label class="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
            <input type="checkbox" id="remember" name="remember" class="rounded border-slate-300 text-brand focus:ring-brand accent-brand">
            <span>Ghi nhớ đăng nhập</span>
          </label>
        </div>

        <!-- Nút Submit Đăng nhập -->
        <button type="submit" id="btnLoginSubmit" class="w-full h-12 rounded-full bg-brand text-white font-extrabold text-sm hover:bg-brand-dark transition-all duration-200 shadow-lg shadow-brand/25 active:scale-98 flex items-center justify-center gap-2">
          <span>Đăng nhập</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
        </button>

      </form>

      <!-- Đường kẻ phân cách -->
      <div class="relative flex items-center justify-center">
        <div class="border-t border-slate-200 w-full"></div>
        <span class="bg-white/90 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">Hoặc đăng nhập với</span>
      </div>

      <!-- Tùy chọn Đăng nhập nhanh bằng Apple ID / Google -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Apple ID -->
        <button type="button" id="btnAppleLogin" class="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 py-2.5 px-3 text-xs font-bold text-slate-900 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm">
          <svg class="h-4 w-4" viewBox="0 0 170 170" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.77-8.8-10.15-18.73-13.14-29.78-3-11.06-4.5-21.73-4.5-32.03 0-14.04 3.37-25.54 10.12-34.5 6.75-8.96 15.42-13.56 26.01-13.8 4.9.12 10.42 1.35 16.57 3.69 6.14 2.34 10.13 3.56 11.96 3.69 1.63 0 5.88-1.34 12.74-4.01 6.87-2.68 12.63-3.8 17.29-3.35 13.25 1.01 23.36 5.86 30.34 14.54-11.55 7.01-17.2 16.63-16.94 28.87.26 9.69 3.91 17.65 10.95 23.88 7.03 6.23 15.28 9.68 24.74 10.36-2.07 6.42-4.63 12.72-7.69 18.91zM119.22 31.05c0-7.24 2.61-13.9 7.82-19.98 5.21-6.08 11.66-9.84 19.34-11.28.26 1.01.39 2.06.39 3.16 0 7.23-2.61 13.97-7.82 20.21-5.22 6.24-11.72 10.03-19.51 11.38-.13-1.12-.22-2.29-.22-3.49z"/>
          </svg>
          <span>Apple ID</span>
        </button>

        <!-- Google -->
        <button type="button" id="btnGoogleLogin" class="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 py-2.5 px-3 text-xs font-bold text-slate-900 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm">
          <svg class="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google</span>
        </button>
      </div>

      <!-- Điều hướng sang trang Đăng ký -->
      <div class="text-center pt-2">
        <p class="text-xs text-slate-500 font-medium">
          Chưa có tài khoản VLU Flagship?
          <a href="register.html" class="font-extrabold text-brand hover:underline ml-1">Đăng ký ngay</a>
        </p>
      </div>

      <!-- Hint tài khoản Admin / Demo tiện lợi -->
      <div class="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-600 space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-slate-900">💡 Tài khoản Quản trị viên (Admin):</span>
          <button type="button" id="quickAdminBtn" class="font-bold text-brand hover:underline">Điền nhanh</button>
        </div>
        <p class="text-slate-500">Email: <strong class="text-slate-800">admin@vlu.edu.vn</strong> | Mật khẩu: bất kỳ</p>
      </div>

    </div>
  </main>

  <!-- Footer Tối giản -->
  <footer class="w-full max-w-7xl mx-auto px-4 py-5 text-center text-xs text-slate-400 relative z-20">
    <p>© <?= date('Y') ?> <strong class="text-slate-600 font-bold">VLU FLAGSHIP STORE</strong>. Bảo vệ bởi Apple Ecosystem Security.</p>
  </footer>

  <!-- Toast thông báo -->
  <div id="toast" role="status" aria-live="polite" class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-xl"></div>

  <!-- Scripts -->
  <script src="frontend/assets/js/cart-engine.js"></script>
  <script src="frontend/assets/js/auth-engine.js"></script>
  <script src="frontend/assets/js/login-page.js"></script>

</body>
</html>
