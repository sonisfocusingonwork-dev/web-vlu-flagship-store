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

      // Hiệu ứng nút bấm đang xử lý
      if (btnLoginSubmit) {
        btnLoginSubmit.disabled = true;
        btnLoginSubmit.innerHTML = '<span class="inline-block animate-spin mr-2">◌</span> Đang xác thực...';
      }

      function handleLoginResult(res) {
        if (res && res.success) {
          if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
          if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
            window.VLU_CART.showToast(res.message);
          }
          // Phân luồng sau đăng nhập: Admin -> Dashboard (admin.php/html), User -> trang chủ hoặc ?next=
          var loggedUser = res.user || (window.VLU_AUTH && window.VLU_AUTH.getUser ? window.VLU_AUTH.getUser() : null);
          var nextParam = '';
          try { nextParam = new URLSearchParams(window.location.search).get('next') || ''; } catch (err) {}
          var targetUrl = resolveTargetUrl(loggedUser, nextParam);
          setTimeout(function () {
            window.location.href = targetUrl;
          }, 400);
        } else {
          if (btnLoginSubmit) {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.innerHTML = '<span>Đăng nhập</span><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>';
          }
          var errMsg = (res && res.message) ? res.message : 'Tài khoản không tồn tại, vui lòng đăng ký!';
          showError(errMsg);
        }
      }

      if (window.VLU_AUTH && typeof window.VLU_AUTH.login === 'function') {
        var loginResult = window.VLU_AUTH.login(username, password, remember);
        if (loginResult && typeof loginResult.then === 'function') {
          loginResult.then(handleLoginResult).catch(function () {
            handleLoginResult({ success: false, message: 'Lỗi xác thực hệ thống.' });
          });
        } else {
          handleLoginResult(loginResult);
        }
      } else {
        handleLoginResult({ success: false, message: 'Module xác thực chưa sẵn sàng.' });
      }
    });
  }

  // 3. Xử lý Nút Đăng nhập Nhanh với Google & Apple ID
  var btnGoogleLogin = document.getElementById('btnGoogleLogin');
  if (btnGoogleLogin) {
    btnGoogleLogin.addEventListener('click', function () {
      showError('Tính năng đăng nhập với Google hiện đang bảo trì kết nối OAuth. Vui lòng đăng nhập bằng Email/Tài khoản.');
    });
  }

  var btnAppleLogin = document.getElementById('btnAppleLogin');
  if (btnAppleLogin) {
    btnAppleLogin.addEventListener('click', function () {
      showError('Tính năng đăng nhập Apple ID hiện đang bảo trì kết nối Apple Sign-In. Vui lòng đăng nhập bằng Email/Tài khoản.');
    });
  }

  // 4. Quick Fill Demo Button
  var quickAdminBtn = document.getElementById('quickAdminBtn');
  if (quickAdminBtn && usernameInput && passwordInput) {
    quickAdminBtn.addEventListener('click', function () {
      usernameInput.value = 'admin';
      passwordInput.value = 'admin123';
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

  /**
   * Xác định trang đích sau đăng nhập thành công (đồng bộ với VLU_AUTH.getPostLoginUrl)
   * - Admin (role == 1 / 'admin' / username 'admin') -> admin.php hoặc admin.html
   * - User thường -> ?next= hợp lệ hoặc index.php / index.html
   */
  function resolveTargetUrl(user, nextParam) {
    if (window.VLU_AUTH && typeof window.VLU_AUTH.getPostLoginUrl === 'function') {
      return window.VLU_AUTH.getPostLoginUrl(user, nextParam);
    }
    var ext = window.location.pathname.indexOf('.php') !== -1 ? '.php' : '.html';
    var isAdmin = !!user && (Number(user.role) === 1 || String(user.role).toLowerCase() === 'admin' ||
      String(user.username || '').toLowerCase() === 'admin');
    return (isAdmin ? 'admin' : 'index') + ext;
  }

})(window, document);
