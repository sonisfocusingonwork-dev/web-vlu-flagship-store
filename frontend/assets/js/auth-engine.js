/**
 * VLU FLAGSHIP STORE – Central Auth Engine 2026
 * Quản lý trạng thái xác thực người dùng (localStorage 'vlu_user'), phân quyền (role 0: Khách hàng, role 1: Admin),
 * và đồng bộ dropdown tài khoản trên thanh Header ở toàn bộ website.
 */
(function (window, document) {
  'use strict';

  var STORAGE_KEY = 'vlu_user';
  var REGISTERED_USERS_KEY = 'vlu_registered_users';

  // Tài khoản Quản trị viên chuẩn CSDL MySQL (backend/database/database.sql)
  var DEFAULT_ADMIN_ACCOUNT = {
    id: 1,
    username: 'admin',
    email: 'admin@vluflagship.vn',
    alt_email: 'admin@vlu.edu.vn',
    password: 'admin123',
    alt_password: 'Admin@2026',
    fullname: 'Quản trị viên VLU',
    phone: '0901234567',
    role: 1
  };

  /**
   * Lấy danh sách tài khoản đã đăng ký hợp lệ
   */
  function getRegisteredUsers() {
    try {
      var raw = localStorage.getItem(REGISTERED_USERS_KEY);
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      // Đảm bảo luôn có tài khoản Admin đối chiếu với SQL
      var hasAdmin = list.some(function (u) {
        return u && (u.username === 'admin' || u.email === 'admin@vluflagship.vn' || u.email === 'admin@vlu.edu.vn');
      });
      if (!hasAdmin) {
        list.unshift(DEFAULT_ADMIN_ACCOUNT);
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
      }
      return list;
    } catch (e) {
      return [DEFAULT_ADMIN_ACCOUNT];
    }
  }

  /**
   * Lưu tài khoản mới vào danh sách tài khoản hợp lệ
   */
  function addRegisteredUser(account) {
    try {
      var list = getRegisteredUsers();
      var exists = list.some(function (u) {
        return u && (u.email.toLowerCase() === account.email.toLowerCase() || u.username.toLowerCase() === account.username.toLowerCase());
      });
      if (!exists) {
        list.push(account);
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
      }
    } catch (e) {}
  }

  /**
   * Xác định tài khoản có quyền Quản trị viên (Admin) hay không.
   * Chấp nhận role === 1 / '1' / 'admin' hoặc username === 'admin' (không áp dụng cho tài khoản Khách).
   */
  function isAdminUser(user) {
    if (!user || typeof user !== 'object' || user.isGuest) return false;
    var roleText = String(user.role == null ? '' : user.role).trim().toLowerCase();
    var uname = String(user.username || '').trim().toLowerCase();
    return Number(user.role) === 1 || roleText === 'admin' || uname === 'admin';
  }

  /**
   * Trang đích theo môi trường đang chạy (.php hoặc .html)
   */
  function isPhpEnvironment() {
    return window.location.pathname.indexOf('.php') !== -1;
  }

  function getPageUrl(baseName) {
    return baseName + (isPhpEnvironment() ? '.php' : '.html');
  }

  /**
   * Làm sạch tham số ?next= (chỉ chấp nhận đường dẫn tương đối nội bộ, chống open redirect)
   */
  function sanitizeNext(nextParam) {
    if (!nextParam || typeof nextParam !== 'string') return '';
    var value = nextParam.trim();
    if (!/^[A-Za-z0-9_\-\/.]+\.(php|html)(\?[A-Za-z0-9_\-=&%.]*)?$/.test(value)) return '';
    if (value.charAt(0) === '/' || value.indexOf('..') !== -1 || value.indexOf('//') !== -1) return '';
    return value;
  }

  /**
   * Tính URL chuyển hướng sau đăng nhập:
   *  - Admin  -> admin.php / admin.html (Dashboard), bỏ qua ?next=
   *  - User   -> ?next= hợp lệ (không phải trang admin) hoặc index.php / index.html
   */
  function resolvePostLoginUrl(user, nextParam) {
    if (isAdminUser(user)) return getPageUrl('admin');
    var next = sanitizeNext(nextParam);
    if (next && !/^admin\.(php|html)/i.test(next)) return next;
    return getPageUrl('index');
  }

  var AuthEngine = {
    getRegisteredUsers: getRegisteredUsers,
    isAdminUser: isAdminUser,
    getPostLoginUrl: resolvePostLoginUrl,
    getPageUrl: getPageUrl,

    /**
     * Lấy thông tin người dùng hiện tại đang đăng nhập
     */
    getUser: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        var user = JSON.parse(raw);
        if (!(user && typeof user === 'object' && user.username)) return null;
        // Chuẩn hóa quyền: Admin luôn là role = 1 (số)
        if (isAdminUser(user) && user.role !== 1) user.role = 1;
        return user;
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
     * Tự động kích hoạt Tài khoản Khách (Silent Guest Login - Không cần nhập username/password)
     * Chuyển tiếp liền mạch toàn bộ giỏ hàng tạm sang phiên khách và cập nhật thông tin nếu có
     */
    ensureGuestSession: function (customInfo) {
      var existing = this.getUser();
      if (existing) {
        if (existing.isGuest && customInfo && typeof customInfo === 'object') {
          var updated = false;
          if (customInfo.fullname && customInfo.fullname.trim()) {
            existing.fullname = customInfo.fullname.trim();
            updated = true;
          }
          if (customInfo.phone && customInfo.phone.trim()) {
            existing.phone = customInfo.phone.trim();
            updated = true;
          }
          if (customInfo.email && customInfo.email.trim()) {
            existing.email = customInfo.email.trim();
            updated = true;
          }
          if (updated) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
              var guestAccount = JSON.parse(localStorage.getItem('vlu_account_guest') || '{}');
              if (!guestAccount || typeof guestAccount !== 'object' || Array.isArray(guestAccount)) guestAccount = {};
              guestAccount.profile = Object.assign({}, guestAccount.profile || {}, {
                fullname: existing.fullname,
                phone: existing.phone,
                email: existing.email
              });
              localStorage.setItem('vlu_account_guest', JSON.stringify(guestAccount));
            } catch (e) {}
            this.updateHeaderAuth();
            this.emitUpdate(existing);
          }
        }
        return existing;
      }

      // Chuyển tiếp giỏ hàng tạm (vlu_cart hoặc vlu_cart_guest) để không mất bất kỳ sản phẩm nào
      try {
        var guestCartRaw = localStorage.getItem('vlu_cart_guest');
        var legacyCartRaw = localStorage.getItem('vlu_cart');
        var guestCart = guestCartRaw ? JSON.parse(guestCartRaw) : [];
        var legacyCart = legacyCartRaw ? JSON.parse(legacyCartRaw) : [];
        if ((!Array.isArray(guestCart) || guestCart.length === 0) && Array.isArray(legacyCart) && legacyCart.length > 0) {
          localStorage.setItem('vlu_cart_guest', JSON.stringify(legacyCart));
        }
      } catch (cartErr) {}

      var guestUser = {
        id: 'guest',
        username: 'guest',
        email: (customInfo && customInfo.email && customInfo.email.trim()) ? customInfo.email.trim() : 'guest@vluflagship.vn',
        fullname: (customInfo && customInfo.fullname && customInfo.fullname.trim()) ? customInfo.fullname.trim() : 'Khách vãng lai (Guest)',
        phone: (customInfo && customInfo.phone && customInfo.phone.trim()) ? customInfo.phone.trim() : '',
        role: 0,
        isGuest: true,
        loginAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));
        var accountStore = JSON.parse(localStorage.getItem('vlu_account_guest') || '{}');
        if (!accountStore || typeof accountStore !== 'object' || Array.isArray(accountStore)) accountStore = {};
        accountStore.profile = Object.assign({}, accountStore.profile || {}, {
          fullname: guestUser.fullname,
          phone: guestUser.phone,
          email: guestUser.email
        });
        localStorage.setItem('vlu_account_guest', JSON.stringify(accountStore));
      } catch (e) {
        console.error('[AuthEngine] Lỗi khởi tạo phiên Tài khoản Khách:', e);
      }

      this.updateHeaderAuth();
      this.emitUpdate(guestUser);
      return guestUser;
    },

    loginAsGuest: function (customInfo) {
      return this.ensureGuestSession(customInfo);
    },

    /**
     * Đăng nhập người dùng với xác thực đối chiếu CSDL MySQL & mật khẩu
     * Trả về Promise để hỗ trợ async fetch, đồng thời xử lý fallback an toàn
     */
    login: function (identifier, password, remember) {
      var self = this;
      if (!identifier || !password) {
        return Promise.resolve({
          success: false,
          code: 'EMPTY_CREDENTIALS',
          message: 'Vui lòng nhập đầy đủ Email/Tên đăng nhập và Mật khẩu!'
        });
      }

      var cleanId = identifier.trim().toLowerCase();

      // Bước 1: Thử gọi API Backend MySQL trực tiếp
      var apiEndpoint = 'backend/api/auth.php';

      return fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'login',
          username: cleanId,
          password: password
        })
      })
      .then(function (response) {
        return response.json().then(function (data) {
          return { status: response.status, data: data };
        });
      })
      .then(function (result) {
        var data = result.data;
        if (data && data.success) {
          // Chuẩn hóa quyền Admin (role = 1) ngay khi nhận user từ CSDL
          data.user = data.user || {};
          data.user.role = isAdminUser(data.user) ? 1 : 0;
          // Lưu phiên đăng nhập hợp lệ từ CSDL
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
            if (remember) {
              localStorage.setItem('vlu_remember_username', cleanId);
            } else {
              localStorage.removeItem('vlu_remember_username');
            }
          } catch (e) {
            console.error('[AuthEngine] Lỗi lưu tài khoản:', e);
          }
          self.updateHeaderAuth();
          self.emitUpdate(data.user);
          return {
            success: true,
            message: data.message || ('Đăng nhập thành công! Chào mừng ' + data.user.fullname + '.'),
            user: data.user
          };
        } else {
          // Backend từ chối: Báo đúng lỗi từ CSDL (Tài khoản không tồn tại hoặc Mật khẩu không chính xác)
          return {
            success: false,
            code: data ? data.code : 'AUTH_FAILED',
            message: data ? data.message : 'Đăng nhập không thành công!'
          };
        }
      })
      .catch(function () {
        // Bước 2: Khi chạy offline / môi trường không có PHP Web Server:
        // ĐỐI CHIẾU TRỰC TIẾP VỚI DANH SÁCH TÀI KHOẢN ĐÃ ĐĂNG KÝ HỢP LỆ (BẢNG USERS)
        var registeredList = getRegisteredUsers();
        var foundUser = registeredList.find(function (u) {
          if (!u) return false;
          var uName = (u.username || '').toLowerCase();
          var uEmail = (u.email || '').toLowerCase();
          var uAltEmail = (u.alt_email || '').toLowerCase();
          return uName === cleanId || uEmail === cleanId || uAltEmail === cleanId;
        });

        // 1. Kiểm tra tài khoản có tồn tại hay không
        if (!foundUser) {
          return {
            success: false,
            code: 'USER_NOT_FOUND',
            message: 'Tài khoản không tồn tại, vui lòng đăng ký!'
          };
        }

        // 2. Kiểm tra mật khẩu có chính xác hay không
        var validPasswords = [foundUser.password];
        if (foundUser.alt_password) validPasswords.push(foundUser.alt_password);

        var isPwMatch = validPasswords.some(function (p) {
          return String(p) === String(password);
        });

        if (!isPwMatch) {
          return {
            success: false,
            code: 'WRONG_PASSWORD',
            message: 'Mật khẩu không chính xác!'
          };
        }

        // Đăng nhập thành công với tài khoản đã đăng ký hợp lệ
        var loggedUser = {
          id: foundUser.id || 1,
          username: foundUser.username || cleanId,
          email: foundUser.email || cleanId,
          fullname: foundUser.fullname || 'Người dùng VLU',
          phone: foundUser.phone || '',
          role: isAdminUser(foundUser) ? 1 : 0,
          loginAt: new Date().toISOString()
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
          if (remember) {
            localStorage.setItem('vlu_remember_username', cleanId);
          } else {
            localStorage.removeItem('vlu_remember_username');
          }
        } catch (e) {
          console.error('[AuthEngine] Lỗi lưu tài khoản:', e);
        }

        self.updateHeaderAuth();
        self.emitUpdate(loggedUser);

        return {
          success: true,
          message: 'Đăng nhập thành công! Chào mừng ' + loggedUser.fullname + (loggedUser.role === 1 ? ' (Quản trị viên)' : '') + '.',
          user: loggedUser
        };
      });
    },

    /**
     * Đăng ký tài khoản mới (lưu vào CSDL MySQL & danh sách hợp lệ)
     */
    register: function (data) {
      var self = this;
      if (!data || !data.email || !data.password) {
        return Promise.resolve({
          success: false,
          message: 'Vui lòng điền đầy đủ các thông tin đăng ký!'
        });
      }

      var cleanEmail = data.email.trim().toLowerCase();
      var isAdmin = (cleanEmail === 'admin@vluflagship.vn' || cleanEmail === 'admin@vlu.edu.vn');

      var newUser = {
        id: isAdmin ? 1 : Date.now(),
        username: cleanEmail,
        email: cleanEmail,
        password: data.password,
        fullname: (data.fullname || 'Khách hàng mới').trim(),
        phone: (data.phone || '').trim(),
        role: isAdmin ? 1 : 0,
        registeredAt: new Date().toISOString()
      };

      // Thử gọi backend PHP lưu vào CSDL MySQL
      return fetch('backend/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          fullname: newUser.fullname,
          phone: newUser.phone,
          email: cleanEmail,
          password: data.password
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (apiRes) {
        if (apiRes && apiRes.success && apiRes.user) {
          newUser.id = apiRes.user.id || newUser.id;
        }
        addRegisteredUser(newUser);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        } catch (e) {}
        self.updateHeaderAuth();
        self.emitUpdate(newUser);
        return {
          success: true,
          message: 'Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.',
          user: newUser
        };
      })
      .catch(function () {
        // Fallback lưu local khi không có PHP server
        addRegisteredUser(newUser);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        } catch (e) {}
        self.updateHeaderAuth();
        self.emitUpdate(newUser);
        return {
          success: true,
          message: 'Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.',
          user: newUser
        };
      });
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
      var menuAvatarEl = document.getElementById('menuUserAvatar');
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
      var mobileAdminBtn = document.getElementById('mobileAdminBtn');

      if (user) {
        // Đã đăng nhập: ẩn nút Đăng nhập, hiện nút User Dropdown
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userDropdown) userDropdown.classList.remove('hidden');

        var displayName = user.fullname || user.username;
        if (userNameEl) userNameEl.textContent = displayName;
        var firstLetter = displayName.charAt(0).toUpperCase();
        [userAvatarEl, menuAvatarEl].forEach(function (avatarEl) {
          if (!avatarEl) return;
          avatarEl.replaceChildren();
          if (typeof user.avatar === 'string' && user.avatar) {
            var avatarImage = document.createElement('img');
            avatarImage.src = user.avatar;
            avatarImage.alt = '';
            avatarImage.className = 'h-full w-full object-cover';
            avatarEl.appendChild(avatarImage);
          } else {
            var avatarIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            avatarIcon.setAttribute('viewBox', '0 0 24 24');
            avatarIcon.setAttribute('fill', 'currentColor');
            avatarIcon.setAttribute('aria-hidden', 'true');
            avatarIcon.setAttribute('class', userAvatarEl === avatarEl ? 'h-5 w-5' : 'h-8 w-8');
            var avatarShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            avatarShape.setAttribute('d', 'M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.1 0-7.5 2.1-7.5 4.7V21h15v-2.3c0-2.6-3.4-4.7-7.5-4.7Z');
            avatarIcon.appendChild(avatarShape);
            avatarEl.appendChild(avatarIcon);
          }
        });
        if (menuFullName) menuFullName.textContent = displayName;
        if (menuEmail) {
          if (user.isGuest) {
            menuEmail.textContent = user.phone ? ('SĐT: ' + user.phone) : 'Phiên mua sắm Khách (Guest)';
          } else {
            menuEmail.textContent = user.email || '';
          }
        }

        // Phân biệt Role 1: Quản trị viên, Khách (Guest) vs Role 0: Khách hàng
        if (user.role === 1) {
          if (menuRoleBadge) {
            menuRoleBadge.textContent = 'Quản trị viên (Admin)';
            menuRoleBadge.className = 'rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-black uppercase tracking-wider';
          }
          if (menuAdminBtn) {
            menuAdminBtn.setAttribute('href', getPageUrl('admin'));
            menuAdminBtn.classList.remove('hidden');
          }
          if (mobileAdminBtn) {
            mobileAdminBtn.setAttribute('href', getPageUrl('admin'));
            mobileAdminBtn.classList.remove('hidden');
          }
        } else if (user.isGuest) {
          if (menuRoleBadge) {
            menuRoleBadge.textContent = 'Khách (Guest)';
            menuRoleBadge.className = 'rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px] font-extrabold';
          }
          if (menuAdminBtn) menuAdminBtn.classList.add('hidden');
          if (mobileAdminBtn) mobileAdminBtn.classList.add('hidden');
        } else {
          if (menuRoleBadge) {
            menuRoleBadge.textContent = 'Khách hàng thân thiết';
            menuRoleBadge.className = 'rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-extrabold';
          }
          if (menuAdminBtn) menuAdminBtn.classList.add('hidden');
          if (mobileAdminBtn) mobileAdminBtn.classList.add('hidden');
        }

        // Cập nhật Mobile Drawer
        if (mobileLoginBtn) mobileLoginBtn.classList.add('hidden');
        if (mobileUserBox) mobileUserBox.classList.remove('hidden');
        if (mobileUserName) mobileUserName.textContent = displayName;
        if (mobileUserAvatar) mobileUserAvatar.textContent = firstLetter;
        if (mobileUserRole) {
          mobileUserRole.textContent = user.role === 1 ? 'Quản trị viên (Admin)' : (user.isGuest ? 'Khách (Guest)' : 'Khách hàng VLU');
          mobileUserRole.className = 'text-[11px] font-bold ' + (user.role === 1 ? 'text-brand' : (user.isGuest ? 'text-amber-600' : 'text-emerald-600'));
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

  // Đảm bảo cập nhật tức thì khi quay về trang chủ từ BFCache hoặc chuyển trang
  window.addEventListener('pageshow', function () {
    AuthEngine.updateHeaderAuth();
  });
  window.addEventListener('load', function () {
    AuthEngine.updateHeaderAuth();
  });

  // Đưa AuthEngine ra toàn cục
  window.VLU_AUTH = AuthEngine;

})(window, document);
