/**
 * VLU FLAGSHIP STORE – Register Page Logic 2026
 * Xử lý kiểm tra dữ liệu thời gian thực (Email, SĐT 10 số, Khớp mật khẩu),
 * thanh đo độ mạnh mật khẩu (Password Strength Meter) và đăng ký qua VLU_AUTH
 */
(function (window, document) {
  'use strict';

  var registerForm = document.getElementById('registerForm');
  var fullnameInput = document.getElementById('regFullname');
  var phoneInput = document.getElementById('regPhone');
  var emailInput = document.getElementById('regEmail');
  var passwordInput = document.getElementById('regPassword');
  var confirmPasswordInput = document.getElementById('regConfirmPassword');
  var termsCheckbox = document.getElementById('regTerms');
  var btnRegisterSubmit = document.getElementById('btnRegisterSubmit');

  // Các phần tử thanh đo độ mạnh mật khẩu
  var strengthBar1 = document.getElementById('strengthBar1');
  var strengthBar2 = document.getElementById('strengthBar2');
  var strengthBar3 = document.getElementById('strengthBar3');
  var strengthText = document.getElementById('strengthText');

  // Phần tử báo lỗi xác nhận mật khẩu
  var confirmFeedback = document.getElementById('confirmFeedback');
  var registerErrorMsg = document.getElementById('registerErrorMsg');

  // Toggle Mật khẩu
  var togglePasswordBtn = document.getElementById('regTogglePasswordBtn');
  var toggleConfirmBtn = document.getElementById('regToggleConfirmBtn');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function () {
      var isPw = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPw ? 'text' : 'password');
    });
  }

  if (toggleConfirmBtn && confirmPasswordInput) {
    toggleConfirmBtn.addEventListener('click', function () {
      var isPw = confirmPasswordInput.getAttribute('type') === 'password';
      confirmPasswordInput.setAttribute('type', isPw ? 'text' : 'password');
    });
  }

  // 1. Thanh đo độ mạnh mật khẩu theo thời gian thực (Password Strength Meter)
  function evaluatePasswordStrength(val) {
    if (!val || val.length === 0) return 0;
    var score = 0;
    if (val.length >= 6) score += 1;
    if (val.length >= 8) score += 1;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;
    return Math.min(score, 3);
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      var val = passwordInput.value;
      var strength = evaluatePasswordStrength(val);

      // Reset màu sắc
      if (strengthBar1) strengthBar1.className = 'h-1.5 flex-1 rounded-full bg-slate-200 transition-colors duration-300';
      if (strengthBar2) strengthBar2.className = 'h-1.5 flex-1 rounded-full bg-slate-200 transition-colors duration-300';
      if (strengthBar3) strengthBar3.className = 'h-1.5 flex-1 rounded-full bg-slate-200 transition-colors duration-300';

      if (!val) {
        if (strengthText) strengthText.textContent = 'Chưa nhập';
        checkPasswordMatch();
        return;
      }

      if (strength <= 1) {
        if (strengthBar1) strengthBar1.className = 'h-1.5 flex-1 rounded-full bg-red-500 transition-colors duration-300';
        if (strengthText) {
          strengthText.textContent = 'Yếu (Nên thêm số và chữ hoa)';
          strengthText.className = 'text-[11px] font-bold text-red-500';
        }
      } else if (strength === 2) {
        if (strengthBar1) strengthBar1.className = 'h-1.5 flex-1 rounded-full bg-amber-500 transition-colors duration-300';
        if (strengthBar2) strengthBar2.className = 'h-1.5 flex-1 rounded-full bg-amber-500 transition-colors duration-300';
        if (strengthText) {
          strengthText.textContent = 'Trung bình (Nên thêm ký tự đặc biệt)';
          strengthText.className = 'text-[11px] font-bold text-amber-500';
        }
      } else {
        if (strengthBar1) strengthBar1.className = 'h-1.5 flex-1 rounded-full bg-emerald-500 transition-colors duration-300';
        if (strengthBar2) strengthBar2.className = 'h-1.5 flex-1 rounded-full bg-emerald-500 transition-colors duration-300';
        if (strengthBar3) strengthBar3.className = 'h-1.5 flex-1 rounded-full bg-emerald-500 transition-colors duration-300';
        if (strengthText) {
          strengthText.textContent = 'Mạnh (Mật khẩu an toàn)';
          strengthText.className = 'text-[11px] font-bold text-emerald-600';
        }
      }

      checkPasswordMatch();
    });
  }

  // 2. Kiểm tra Xác nhận Mật khẩu theo thời gian thực (Real-time Match Validation)
  function checkPasswordMatch() {
    if (!confirmPasswordInput || !passwordInput) return true;
    var pw = passwordInput.value;
    var cpw = confirmPasswordInput.value;

    if (!cpw) {
      confirmPasswordInput.classList.remove('border-red-500', 'border-emerald-500', 'ring-red-500/20', 'ring-emerald-500/20');
      confirmPasswordInput.classList.add('border-slate-200');
      if (confirmFeedback) confirmFeedback.classList.add('hidden');
      return false;
    }

    if (pw !== cpw) {
      confirmPasswordInput.classList.remove('border-slate-200', 'border-emerald-500', 'ring-emerald-500/20');
      confirmPasswordInput.classList.add('border-red-500', 'ring-2', 'ring-red-500/20');
      if (confirmFeedback) {
        confirmFeedback.textContent = '✕ Mật khẩu xác nhận không khớp!';
        confirmFeedback.className = 'text-[11px] font-bold text-red-500 mt-1';
        confirmFeedback.classList.remove('hidden');
      }
      return false;
    } else {
      confirmPasswordInput.classList.remove('border-slate-200', 'border-red-500', 'ring-red-500/20');
      confirmPasswordInput.classList.add('border-emerald-500', 'ring-2', 'ring-emerald-500/20');
      if (confirmFeedback) {
        confirmFeedback.textContent = '✓ Mật khẩu hoàn toàn khớp!';
        confirmFeedback.className = 'text-[11px] font-bold text-emerald-600 mt-1';
        confirmFeedback.classList.remove('hidden');
      }
      return true;
    }
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  }

  // 3. Xử lý Submit Form Đăng ký
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fullname = fullnameInput ? fullnameInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var password = passwordInput ? passwordInput.value : '';
      var confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
      var terms = termsCheckbox ? termsCheckbox.checked : false;

      // Validate Họ tên
      if (!fullname) {
        showError('Vui lòng nhập Họ và tên của bạn!');
        fullnameInput.focus();
        return;
      }

      // Validate Số điện thoại 10 số Việt Nam
      var phoneRegex = /^(03|05|07|08|09)\d{8}$/;
      if (!phone || !phoneRegex.test(phone)) {
        showError('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động tại Việt Nam (ví dụ: 0912345678).');
        if (phoneInput) {
          phoneInput.focus();
          phoneInput.classList.add('border-red-500', 'ring-2', 'ring-red-500/20');
        }
        return;
      } else if (phoneInput) {
        phoneInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500/20');
      }

      // Validate Email
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('Địa chỉ Email không đúng định dạng!');
        if (emailInput) {
          emailInput.focus();
          emailInput.classList.add('border-red-500', 'ring-2', 'ring-red-500/20');
        }
        return;
      } else if (emailInput) {
        emailInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500/20');
      }

      // Validate Mật khẩu
      if (!password || password.length < 6) {
        showError('Mật khẩu phải chứa ít nhất 6 ký tự để đảm bảo an toàn!');
        passwordInput.focus();
        return;
      }

      // Validate Khớp mật khẩu
      if (password !== confirmPassword) {
        showError('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
        confirmPasswordInput.focus();
        return;
      }

      // Validate Điều khoản
      if (!terms) {
        showError('Bạn cần đồng ý với Điều khoản dịch vụ & Chính sách bảo mật của VLU Flagship Store.');
        return;
      }

      // Hiệu ứng đang xử lý
      if (btnRegisterSubmit) {
        btnRegisterSubmit.disabled = true;
        btnRegisterSubmit.innerHTML = '<span class="inline-block animate-spin mr-2">◌</span> Đang tạo tài khoản...';
      }

      setTimeout(function () {
        var res = { success: false, message: 'Lỗi hệ thống' };
        if (window.VLU_AUTH) {
          res = window.VLU_AUTH.register({
            fullname: fullname,
            phone: phone,
            email: email,
            password: password
          });
        }

        if (res.success) {
          if (registerErrorMsg) registerErrorMsg.classList.add('hidden');
          if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
            window.VLU_CART.showToast(res.message);
          }
          // Chuyển hướng sang trang chủ sau 500ms
          setTimeout(function () {
            window.location.href = 'index.html';
          }, 500);
        } else {
          if (btnRegisterSubmit) {
            btnRegisterSubmit.disabled = false;
            btnRegisterSubmit.innerHTML = '<span>Đăng ký tài khoản</span><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>';
          }
          showError(res.message);
        }
      }, 400);

    });
  }

  function showError(msg) {
    if (registerErrorMsg) {
      registerErrorMsg.textContent = msg;
      registerErrorMsg.classList.remove('hidden');
    } else {
      alert(msg);
    }
  }

})(window, document);
