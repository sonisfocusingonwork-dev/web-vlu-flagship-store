/**
 * VLU FLAGSHIP STORE – Login Page Logic 2026
 * Xử lý ẩn/hiện mật khẩu, đăng nhập localStorage qua VLU_AUTH, hỗ trợ Apple ID / Google và chuyển hướng
 */
(function (window, document) {
  'use strict';

  var loginForm = document.getElementById('loginForm');
  var usernameInput = document.getElementById('username');
  var passwordInput = document.getElementById('password');
  var rememberCheckbox = document.getElementById('remember');
  var togglePasswordBtn = document.getElementById('togglePasswordBtn');
  var eyeOpenIcon = document.getElementById('eyeOpenIcon');
  var eyeClosedIcon = document.getElementById('eyeClosedIcon');
  var loginErrorMsg = document.getElementById('loginErrorMsg');
  var btnLoginSubmit = document.getElementById('btnLoginSubmit');

  // Nạp lại username nếu đã từng chọn "Ghi nhớ đăng nhập"
  try {
    var savedUsername = localStorage.getItem('vlu_remember_username');
    if (savedUsername && usernameInput) {
      usernameInput.value = savedUsername;
      if (rememberCheckbox) rememberCheckbox.checked = true;
    }
  } catch (e) {}

  // 1. Xử lý Toggle Ẩn / Hiện Mật khẩu
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function () {
      var isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      if (eyeOpenIcon && eyeClosedIcon) {
        if (isPassword) {
          eyeOpenIcon.classList.add('hidden');
          eyeClosedIcon.classList.remove('hidden');
          togglePasswordBtn.setAttribute('aria-label', 'Ẩn mật khẩu');
        } else {
          eyeOpenIcon.classList.remove('hidden');
          eyeClosedIcon.classList.add('hidden');
          togglePasswordBtn.setAttribute('aria-label', 'Hiện mật khẩu');
        }
      }
    });
  }

  // 2. Xử lý Submit Form Đăng nhập
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var username = usernameInput ? usernameInput.value.trim() : '';
      var password = passwordInput ? passwordInput.value : '';
      var remember = rememberCheckbox ? rememberCheckbox.checked : false;

      if (!username || !password) {
        showError('Vui lòng nhập đầy đủ Email/Tên đăng nhập và Mật khẩu!');
        return;
      }

      if (password.length < 4) {
        showError('Mật khẩu quá ngắn (tối thiểu 4 ký tự)!');
        return;
      }

      // Hiệu ứng nút bấm đang xử lý
      if (btnLoginSubmit) {
        btnLoginSubmit.disabled = true;
        btnLoginSubmit.innerHTML = '<span class="inline-block animate-spin mr-2">◌</span> Đang xác thực...';
      }

      setTimeout(function () {
        var res = { success: false, message: 'Lỗi hệ thống' };
        if (window.VLU_AUTH) {
          res = window.VLU_AUTH.login(username, password, remember);
        }

        if (res.success) {
          if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
          if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
            window.VLU_CART.showToast(res.message);
          }
          // Chuyển hướng sang trang chủ sau 500ms
          setTimeout(function () {
            window.location.href = 'index.html';
          }, 500);
        } else {
          if (btnLoginSubmit) {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.innerHTML = '<span>Đăng nhập</span><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>';
          }
          showError(res.message);
        }
      }, 400);
    });
  }

  // 3. Xử lý Nút Đăng nhập Nhanh với Google & Apple ID
  var btnGoogleLogin = document.getElementById('btnGoogleLogin');
  if (btnGoogleLogin) {
    btnGoogleLogin.addEventListener('click', function () {
      if (window.VLU_AUTH) {
        window.VLU_AUTH.login('google.user@gmail.com', 'google_auth_demo', true);
        if (window.VLU_CART) window.VLU_CART.showToast('Đăng nhập thành công bằng tài khoản Google!');
        setTimeout(function () { window.location.href = 'index.html'; }, 500);
      }
    });
  }

  var btnAppleLogin = document.getElementById('btnAppleLogin');
  if (btnAppleLogin) {
    btnAppleLogin.addEventListener('click', function () {
      if (window.VLU_AUTH) {
        window.VLU_AUTH.login('apple.id@icloud.com', 'apple_id_demo', true);
        if (window.VLU_CART) window.VLU_CART.showToast('Đăng nhập thành công bằng Apple ID!');
        setTimeout(function () { window.location.href = 'index.html'; }, 500);
      }
    });
  }

  // 4. Quick Fill Demo Button
  var quickAdminBtn = document.getElementById('quickAdminBtn');
  if (quickAdminBtn && usernameInput && passwordInput) {
    quickAdminBtn.addEventListener('click', function () {
      usernameInput.value = 'admin@vlu.edu.vn';
      passwordInput.value = 'Admin@2026';
      if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
    });
  }

  function showError(msg) {
    if (loginErrorMsg) {
      loginErrorMsg.textContent = msg;
      loginErrorMsg.classList.remove('hidden');
    } else {
      alert(msg);
    }
  }

})(window, document);
