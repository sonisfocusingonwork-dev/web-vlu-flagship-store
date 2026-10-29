/**
 * VLU FLAGSHIP STORE – Central Auth Engine 2026
 * Quản lý trạng thái xác thực người dùng (localStorage 'vlu_user'), phân quyền (role 0: Khách hàng, role 1: Admin),
 * và đồng bộ dropdown tài khoản trên thanh Header ở toàn bộ website.
 */
(function (window, document) {
  'use strict';

  var STORAGE_KEY = 'vlu_user';

  var AuthEngine = {
    /**
     * Lấy thông tin người dùng hiện tại đang đăng nhập
     */
    getUser: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        var user = JSON.parse(raw);
        return (user && typeof user === 'object' && user.username) ? user : null;
      } catch (e) {
        console.warn('[AuthEngine] Lỗi đọc tài khoản:', e);
        return null;
      }
    },

    /**
     * Kiểm tra trạng thái đã đăng nhập hay chưa
     */
    isLoggedIn: function () {
      return this.getUser() !== null;
    },

    /**
     * Đăng nhập người dùng
     * Phân quyền: admin@vlu.edu.vn hoặc username 'admin' -> role 1 (Admin), các tài khoản khác -> role 0 (Khách hàng)
     */
    login: function (identifier, password, remember) {
      if (!identifier || !password) {
        return { success: false, message: 'Vui lòng nhập đầy đủ thông tin đăng nhập!' };
      }

      var cleanId = identifier.trim().toLowerCase();
      var isAdmin = (cleanId === 'admin@vlu.edu.vn' || cleanId === 'admin');

      // Tự động tạo tên hiển thị đẹp từ email/username
      var defaultName = isAdmin ? 'Quản Trị Viên VLU' : (cleanId.indexOf('@') !== -1 ? cleanId.split('@')[0] : cleanId);
      // Viết hoa chữ cái đầu
      defaultName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

      var user = {
        id: isAdmin ? 1 : Math.floor(100 + Math.random() * 900),
        username: cleanId,
        email: cleanId.indexOf('@') !== -1 ? cleanId : cleanId + '@gmail.com',
        fullname: defaultName,
        phone: isAdmin ? '0901234567' : '0987654321',
        role: isAdmin ? 1 : 0,
        loginAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        if (remember) {
          localStorage.setItem('vlu_remember_username', cleanId);
        } else {
          localStorage.removeItem('vlu_remember_username');
        }
      } catch (e) {
        console.error('[AuthEngine] Lỗi lưu tài khoản:', e);
      }

      this.updateHeaderAuth();
      this.emitUpdate(user);

      return {
        success: true,
        message: 'Đăng nhập thành công! Chào mừng ' + user.fullname + (isAdmin ? ' (Quản trị viên)' : '') + '.',
        user: user
      };
    },

    /**
     * Đăng ký tài khoản mới
     */
    register: function (data) {
      if (!data || !data.email || !data.password) {
        return { success: false, message: 'Vui lòng điền đầy đủ các thông tin đăng ký!' };
      }

      var cleanEmail = data.email.trim().toLowerCase();
      var isAdmin = (cleanEmail === 'admin@vlu.edu.vn');

      var newUser = {
        id: isAdmin ? 1 : Math.floor(100 + Math.random() * 900),
        username: cleanEmail,
        email: cleanEmail,
        fullname: (data.fullname || 'Khách hàng mới').trim(),
        phone: (data.phone || '').trim(),
        role: isAdmin ? 1 : 0,
        registeredAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } catch (e) {
        console.error('[AuthEngine] Lỗi lưu đăng ký:', e);
      }

      this.updateHeaderAuth();
      this.emitUpdate(newUser);

      return {
        success: true,
        message: 'Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.',
        user: newUser
      };
    },

    /**
     * Đăng xuất tài khoản
     */
    logout: function () {
      localStorage.removeItem(STORAGE_KEY);
      this.updateHeaderAuth();
      this.emitUpdate(null);
      return { success: true, message: 'Đã đăng xuất thành công.' };
    },

    /**
     * Đồng bộ giao diện Thanh Header (Desktop & Mobile) theo trạng thái đăng nhập
     */
    updateHeaderAuth: function () {
      var user = this.getUser();

      // Các phần tử trên Desktop Header
      var loginBtn = document.getElementById('headerLoginBtn');
      var userDropdown = document.getElementById('headerUserDropdown');
      var userNameEl = document.getElementById('headerUserName');
      var userAvatarEl = document.getElementById('headerUserAvatar');
      var menuFullName = document.getElementById('menuUserFullName');
      var menuEmail = document.getElementById('menuUserEmail');
      var menuRoleBadge = document.getElementById('menuUserRoleBadge');
      var menuAdminBtn = document.getElementById('menuAdminBtn');

      // Các phần tử trên Mobile Drawer
      var mobileLoginBtn = document.getElementById('mobileLoginBtn');
      var mobileUserBox = document.getElementById('mobileUserBox');
      var mobileUserName = document.getElementById('mobileUserName');
      var mobileUserRole = document.getElementById('mobileUserRole');
      var mobileUserAvatar = document.getElementById('mobileUserAvatar');

      if (user) {
        // Đã đăng nhập: ẩn nút Đăng nhập, hiện nút User Dropdown
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userDropdown) userDropdown.classList.remove('hidden');

        var displayName = user.fullname || user.username;
        var firstLetter = displayName.charAt(0).toUpperCase();

        if (userNameEl) userNameEl.textContent = displayName;
        if (userAvatarEl) userAvatarEl.textContent = firstLetter;
        if (menuFullName) menuFullName.textContent = displayName;
        if (menuEmail) menuEmail.textContent = user.email || '';

        // Phân biệt Role 1: Quản trị viên vs Role 0: Khách hàng
        if (user.role === 1) {
          if (menuRoleBadge) {
            menuRoleBadge.textContent = 'Quản trị viên (Admin)';
            menuRoleBadge.className = 'rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-black uppercase tracking-wider';
          }
          if (menuAdminBtn) menuAdminBtn.classList.remove('hidden');
        } else {
          if (menuRoleBadge) {
            menuRoleBadge.textContent = 'Khách hàng thân thiết';
            menuRoleBadge.className = 'rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-extrabold';
          }
          if (menuAdminBtn) menuAdminBtn.classList.add('hidden');
        }

        // Cập nhật Mobile Drawer
        if (mobileLoginBtn) mobileLoginBtn.classList.add('hidden');
        if (mobileUserBox) mobileUserBox.classList.remove('hidden');
        if (mobileUserName) mobileUserName.textContent = displayName;
        if (mobileUserAvatar) mobileUserAvatar.textContent = firstLetter;
        if (mobileUserRole) {
          mobileUserRole.textContent = user.role === 1 ? 'Quản trị viên (Admin)' : 'Khách hàng VLU';
          mobileUserRole.className = 'text-[11px] font-bold ' + (user.role === 1 ? 'text-brand' : 'text-emerald-600');
        }

      } else {
        // Chưa đăng nhập: hiện nút Đăng nhập, ẩn Dropdown
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userDropdown) userDropdown.classList.add('hidden');

        // Ẩn menu dropdown nếu đang mở
        var menuBox = document.getElementById('headerUserMenu');
        if (menuBox) menuBox.classList.add('hidden');

        // Cập nhật Mobile Drawer
        if (mobileLoginBtn) mobileLoginBtn.classList.remove('hidden');
        if (mobileUserBox) mobileUserBox.classList.add('hidden');
      }
    },

    /**
     * Bắn Custom Event để các trang nghe và phản hồi tức thì
     */
    emitUpdate: function (user) {
      var event;
      if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent('vlu:auth-updated', { detail: { user: user, isLoggedIn: Boolean(user) } });
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent('vlu:auth-updated', true, true, { user: user, isLoggedIn: Boolean(user) });
      }
      window.dispatchEvent(event);
    }
  };

  // Khởi động các tương tác dropdown và lắng nghe sự kiện
  function initAuthDOM() {
    AuthEngine.updateHeaderAuth();

    // Toggle menu dropdown khi click nút User trên Desktop
    var userBtn = document.getElementById('headerUserBtn');
    var menuBox = document.getElementById('headerUserMenu');
    if (userBtn && menuBox) {
      userBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = !menuBox.classList.contains('hidden');
        if (isOpen) {
          menuBox.classList.add('hidden');
          userBtn.setAttribute('aria-expanded', 'false');
        } else {
          menuBox.classList.remove('hidden');
          userBtn.setAttribute('aria-expanded', 'true');
        }
      });

      // Click ra ngoài để đóng menu
      document.addEventListener('click', function (e) {
        if (!userBtn.contains(e.target) && !menuBox.contains(e.target)) {
          menuBox.classList.add('hidden');
          userBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Xử lý nút Đăng xuất trên Header
    var logoutBtn = document.getElementById('headerLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        AuthEngine.logout();
        if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
          window.VLU_CART.showToast('Bạn đã đăng xuất tài khoản thành công.');
        }
        // Tải lại trang sau 300ms nếu đang ở trang cá nhân hoặc giữ nguyên
        setTimeout(function () {
          window.location.reload();
        }, 300);
      });
    }

    // Xử lý nút Đăng xuất trên Mobile Drawer
    var mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        AuthEngine.logout();
        window.location.reload();
      });
    }

    // Lắng nghe thay đổi giữa các Tab
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) {
        AuthEngine.updateHeaderAuth();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthDOM);
  } else {
    initAuthDOM();
  }

  // Đưa AuthEngine ra toàn cục
  window.VLU_AUTH = AuthEngine;

})(window, document);
