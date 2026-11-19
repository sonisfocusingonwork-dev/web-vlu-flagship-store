/**
 * VLU FLAGSHIP STORE – Central Auth Engine 2026
 * Quản lý trạng thái xác thực người dùng (localStorage 'vlu_user'), phân quyền (role 0: Khách hàng, role 1: Admin),
 * và đồng bộ dropdown tài khoản trên thanh Header ở toàn bộ website.
 */
(function (window, document) {
  'use strict';

  var STORAGE_KEY = 'vlu_user';
  var REGISTERED_USERS_KEY = 'vlu_registered_users';

  // Tài khoản Quản trị viên chuẩn CSDL MySQL (backend/database/database.sql & backend/config/db.php)
  var DEFAULT_ADMIN_ACCOUNT = {
    id: 1,
    username: 'admin',
    email: 'admin@vluflagship.vn',
    password: 'admin123',
    fullname: 'Quản trị viên VLU',
    phone: '02871059999',
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
        return u && (u.username === 'admin' || u.email === 'admin@vluflagship.vn');
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

  function isGuestOrInvalidUser(user) {
    if (!user || typeof user !== 'object') return true;
    if (user.isGuest === true) return true;
    var idStr = String(user.id == null ? '' : user.id).trim().toLowerCase();
    var uname = String(user.username || '').trim().toLowerCase();
    var email = String(user.email || '').trim().toLowerCase();
    if (idStr === 'guest' || uname === 'guest' || email === 'guest@vluflagship.vn') return true;
    var numId = Number(user.id);
    if (!Number.isFinite(numId) || numId <= 0) return true;
    return false;
  }

  function cleanupGuestSessionData() {
    try {
      localStorage.removeItem('vlu_orders_guest');
      localStorage.removeItem('vlu_account_guest');
    } catch (e) {}
  }

  function cleanupAllGuestKeys() {
    try {
      var keysToRemove = [
        'vlu_cart_guest',
        'vlu_cart_voucher_guest',
        'vlu_pending_voucher_guest',
        'vlu_orders_guest',
        'vlu_account_guest',
        'vlu_recently_viewed_guest',
        'vlu_recent_sync_sig_guest'
      ];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && /_guest$/i.test(k) && keysToRemove.indexOf(k) === -1) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(function (k) {
        localStorage.removeItem(k);
      });
    } catch (e) {}
  }

  function isProtectedRootAccount(user) {
    if (!user || typeof user !== 'object') return false;
    var uname = String(user.username || '').trim().toLowerCase();
    var email = String(user.email || '').trim().toLowerCase();
    return Number(user.id) === 1 || uname === 'admin' || email === 'admin@vluflagship.vn';
  }

  function findStoredAdminUserRecord(identifier) {
    var clean = String(identifier || '').trim().toLowerCase();
    if (!clean) return null;
    try {
      var sources = ['vlu_admin_users', REGISTERED_USERS_KEY];
      for (var s = 0; s < sources.length; s++) {
        var raw = localStorage.getItem(sources[s]);
        var list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) continue;
        for (var i = 0; i < list.length; i++) {
          var u = list[i];
          if (!u) continue;
          var uName = String(u.username || '').trim().toLowerCase();
          var uEmail = String(u.email || '').trim().toLowerCase();
          if (uName === clean || uEmail === clean) return u;
        }
      }
    } catch (e) {}
    return null;
  }

  function isUserLockedInStorage(userOrId) {
    if (!userOrId) return false;
    if (typeof userOrId === 'object') {
      if (userOrId.isGuest || isProtectedRootAccount(userOrId)) return false;
      if (userOrId.status === 'locked' || userOrId.is_locked === true) return true;
      var rec = findStoredAdminUserRecord(userOrId.username) || findStoredAdminUserRecord(userOrId.email);
      return Boolean(rec && !isProtectedRootAccount(rec) && (rec.status === 'locked' || rec.is_locked === true));
    }
    var byId = findStoredAdminUserRecord(userOrId);
    if (!byId || isProtectedRootAccount(byId)) return false;
    return byId.status === 'locked' || byId.is_locked === true;
  }

  /**
   * Xác định tài khoản có quyền Quản trị viên (Admin) hay không.
   * Chấp nhận role === 1 / '1' / 'admin', username === 'admin', email === 'admin@vluflagship.vn'
   */
  function isAdminUser(user) {
    if (!user || typeof user !== 'object' || user.isGuest) return false;
    var roleText = String(user.role == null ? '' : user.role).trim().toLowerCase();
    var uname = String(user.username || '').trim().toLowerCase();
    var email = String(user.email || '').trim().toLowerCase();
    return Number(user.role) === 1 || roleText === 'admin' || uname === 'admin' || email === 'admin@vluflagship.vn';
  }

  /**
   * Bắt buộc hiển thị giao diện bằng trang .html (Không tải trang .php trên trình duyệt)
   */
  function getPageUrl(baseName) {
    return baseName + '.html';
  }

  /**
   * Làm sạch tham số ?next= (chỉ chấp nhận đường dẫn tương đối nội bộ, chống open redirect)
   */
  function sanitizeNext(nextParam) {
    if (!nextParam || typeof nextParam !== 'string') return '';
    var value = nextParam.trim();
    if (!/^[A-Za-z0-9_\-\/.]+\.(php|html)(\?[A-Za-z0-9_\-=&%.]*)?$/.test(value)) return '';
    if (value.charAt(0) === '/' || value.indexOf('..') !== -1 || value.indexOf('//') !== -1) return '';
    // Chuẩn hóa mọi đuôi .php sang .html
    return value.replace(/\.php(\?|$)/i, '.html$1');
  }

  /**
   * Tính URL chuyển hướng sau đăng nhập:
   *  - Admin (role 1) -> Bắt buộc nhảy thẳng vào Dashboard admin.html
   *  - User thường    -> ?next= hợp lệ (.html) hoặc index.html
   */
  function resolvePostLoginUrl(user, nextParam) {
    if (isAdminUser(user)) return 'admin.html';
    var next = sanitizeNext(nextParam);
    if (next && !/^admin\.(php|html)/i.test(next)) return next;
    return 'index.html';
  }

  var AuthEngine = {
    getRegisteredUsers: getRegisteredUsers,
    isAdminUser: isAdminUser,
    isGuestOrInvalidUser: isGuestOrInvalidUser,
    getPostLoginUrl: resolvePostLoginUrl,
    getPageUrl: getPageUrl,

    /**
     * Lấy thông tin người dùng hiện tại đang đăng nhập (chỉ chấp nhận tài khoản thực trong SQL)
     */
    getUser: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        var user = JSON.parse(raw);
        if (isGuestOrInvalidUser(user)) {
          localStorage.removeItem(STORAGE_KEY);
          cleanupGuestSessionData();
          return null;
        }
        if (!(user && typeof user === 'object' && (user.username || user.email))) return null;
        if (isUserLockedInStorage(user)) {
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
        user.id = Number(user.id);
        delete user.isGuest;
        // Chuẩn hóa quyền: Admin luôn là role = 1 (số)
        if (isAdminUser(user) && user.role !== 1) user.role = 1;
        return user;
      } catch (e) {
        console.warn('[AuthEngine] Lỗi đọc tài khoản:', e);
        return null;
      }
    },

    /**
     * Kiểm tra trạng thái đã đăng nhập tài khoản thực hay chưa
     */
    isLoggedIn: function () {
      return this.getUser() !== null;
    },

    /**
     * Vô hiệu hóa auto-login Guest: Xóa mọi phiên ảo guest nếu tồn tại và trả về tài khoản thực (hoặc null)
     */
    ensureGuestSession: function () {
      cleanupGuestSessionData();
      return this.getUser();
    },

    loginAsGuest: function () {
      cleanupGuestSessionData();
      return this.getUser();
    },

    /**
     * Kế thừa & gộp toàn bộ sản phẩm từ giỏ hàng tạm (vlu_cart_guest) sang giỏ riêng của tài khoản SQL (vlu_cart_${user.id})
     */
    mergeGuestCartToUser: function (user) {
      if (isGuestOrInvalidUser(user)) return [];
      var numericId = String(Number(user.id));
      var targetCartKey = 'vlu_cart_' + numericId;
      var targetVoucherKey = 'vlu_cart_voucher_' + numericId;
      var targetPendingVoucherKey = 'vlu_pending_voucher_' + numericId;

      var guestKeys = ['vlu_cart_guest', 'vlu_cart'];
      var rawIdent = String(user.username || user.email || '').trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
      if (rawIdent && rawIdent !== numericId) {
        guestKeys.push('vlu_cart_' + rawIdent);
      }

      var merged = [];
      try {
        var existingRaw = localStorage.getItem(targetCartKey);
        var existingParsed = existingRaw ? JSON.parse(existingRaw) : [];
        if (Array.isArray(existingParsed)) {
          merged = existingParsed.slice();
        }
      } catch (e1) {
        merged = [];
      }

      guestKeys.forEach(function (srcKey) {
        try {
          var srcRaw = localStorage.getItem(srcKey);
          if (!srcRaw) return;
          var srcItems = JSON.parse(srcRaw);
          if (!Array.isArray(srcItems) || srcItems.length === 0) return;

          srcItems.forEach(function (item) {
            if (!item || !item.name) return;
            var id = item.id || (item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            var color = (item.color || 'Mặc định').trim();
            var variant = (item.variant || 'Tiêu chuẩn').trim();
            var qty = Math.max(1, parseInt(item.quantity, 10) || 1);
            var price = parseInt(item.price, 10) || 0;

            var matched = null;
            for (var i = 0; i < merged.length; i++) {
              var cur = merged[i];
              if (cur && cur.id === id && (cur.color || 'Mặc định') === color && (cur.variant || 'Tiêu chuẩn') === variant) {
                matched = cur;
                break;
              }
            }
            if (matched) {
              matched.quantity = (parseInt(matched.quantity, 10) || 0) + qty;
              if (price > 0) matched.price = price;
              if (item.oldPrice) matched.oldPrice = parseInt(item.oldPrice, 10) || matched.oldPrice;
              if (item.image) matched.image = item.image;
              if (item.category) matched.category = item.category;
            } else {
              merged.push({
                id: id,
                name: item.name,
                category: item.category || '',
                color: color,
                variant: variant,
                price: price,
                oldPrice: item.oldPrice ? parseInt(item.oldPrice, 10) : null,
                image: item.image || 'frontend/assets/images/logo.png',
                quantity: qty
              });
            }
          });
        } catch (e2) {}
      });

      try {
        localStorage.setItem(targetCartKey, JSON.stringify(merged));
        if (!localStorage.getItem(targetVoucherKey)) {
          var gVoucher = localStorage.getItem('vlu_cart_voucher_guest') || localStorage.getItem('vlu_cart_voucher');
          if (gVoucher) localStorage.setItem(targetVoucherKey, gVoucher);
        }
        if (!localStorage.getItem(targetPendingVoucherKey)) {
          var gPending = localStorage.getItem('vlu_pending_voucher_guest');
          if (gPending) localStorage.setItem(targetPendingVoucherKey, gPending);
        }
        localStorage.removeItem('vlu_cart_guest');
        localStorage.removeItem('vlu_cart');
        localStorage.removeItem('vlu_cart_voucher_guest');
        localStorage.removeItem('vlu_cart_voucher');
        localStorage.removeItem('vlu_pending_voucher_guest');
        if (rawIdent && rawIdent !== numericId) {
          localStorage.removeItem('vlu_cart_' + rawIdent);
        }
        cleanupGuestSessionData();
      } catch (e3) {}

      if (window.VLU_CART) {
        if (typeof window.VLU_CART.updateBadge === 'function') window.VLU_CART.updateBadge();
        if (typeof window.VLU_CART.emitUpdate === 'function') window.VLU_CART.emitUpdate();
      }
      return merged;
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
      if (cleanId === 'guest' || cleanId === 'guest@vluflagship.vn') {
        return Promise.resolve({
          success: false,
          code: 'GUEST_LOGIN_FORBIDDEN',
          message: 'Tài khoản Guest không hợp lệ. Vui lòng đăng ký hoặc đăng nhập tài khoản thành viên!'
        });
      }

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
          data.user = data.user || {};
          if (isGuestOrInvalidUser(data.user)) {
            return {
              success: false,
              code: 'INVALID_ACCOUNT',
              message: 'Tài khoản không hợp lệ!'
            };
          }
          if (isUserLockedInStorage(data.user) || isUserLockedInStorage(cleanId)) {
            return {
              success: false,
              code: 'ACCOUNT_LOCKED',
              message: 'Tài khoản của bạn đang tạm khóa, vui lòng liên hệ CSKH VLU Flagship Store.'
            };
          }
          // Chuẩn hóa ID số và quyền Admin (role = 1) ngay khi nhận user từ CSDL
          data.user.id = Number(data.user.id);
          data.user.role = isAdminUser(data.user) ? 1 : 0;
          delete data.user.isGuest;
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
          self.mergeGuestCartToUser(data.user);
          self.updateHeaderAuth();
          self.emitUpdate(data.user);
          return {
            success: true,
            message: data.message || ('Đăng nhập thành công! Chào mừng ' + data.user.fullname + '.'),
            user: data.user
          };
        } else {
          // Backend từ chối: Báo đúng lỗi từ CSDL (Khóa tài khoản / Không tồn tại / Sai mật khẩu)
          return {
            success: false,
            code: data ? data.code : 'AUTH_FAILED',
            message: data ? data.message : 'Đăng nhập không thành công!'
          };
        }
      })
      .catch(function () {
        // Bước 2: Chỉ khi fetch bị Network Error hoàn toàn (ngoại tuyến không có PHP server):
        // ĐỐI CHIẾU TRỰC TIẾP VỚI DANH SÁCH TÀI KHOẢN ĐÃ ĐĂNG KÝ HỢP LỆ (BẢNG USERS)
        var registeredList = getRegisteredUsers();
        var foundUser = registeredList.find(function (u) {
          if (!u) return false;
          var uName = (u.username || '').toLowerCase();
          var uEmail = (u.email || '').toLowerCase();
          return uName === cleanId || uEmail === cleanId;
        });

        // 1. Kiểm tra tài khoản có tồn tại hay không
        if (!foundUser) {
          return {
            success: false,
            code: 'USER_NOT_FOUND',
            message: 'Tài khoản không tồn tại, vui lòng đăng ký!'
          };
        }

        // 1.5 Kiểm tra tài khoản bị khóa hay không
        if (isUserLockedInStorage(foundUser) || isUserLockedInStorage(cleanId)) {
          return {
            success: false,
            code: 'ACCOUNT_LOCKED',
            message: 'Tài khoản của bạn đang tạm khóa, vui lòng liên hệ CSKH VLU Flagship Store.'
          };
        }

        // 2. Kiểm tra mật khẩu có chính xác hay không
        if (String(foundUser.password) !== String(password)) {
          return {
            success: false,
            code: 'WRONG_PASSWORD',
            message: 'Mật khẩu không chính xác!'
          };
        }

        // Đăng nhập thành công với tài khoản đã đăng ký hợp lệ
        var loggedUser = {
          id: Number(foundUser.id) > 0 ? Number(foundUser.id) : 1,
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

        self.mergeGuestCartToUser(loggedUser);
        self.updateHeaderAuth();
        self.emitUpdate(loggedUser);

        return {
          success: true,
          message: 'Đăng nhập thành công! Chào mừng ' .concat(loggedUser.fullname, loggedUser.role === 1 ? ' (Quản trị viên)' : '', '.'),
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
          code: 'MISSING_FIELDS',
          message: 'Vui lòng điền đầy đủ các thông tin đăng ký!'
        });
      }

      var cleanEmail = data.email.trim().toLowerCase();
      if (cleanEmail === 'guest' || cleanEmail === 'guest@vluflagship.vn') {
        return Promise.resolve({
          success: false,
          code: 'INVALID_EMAIL',
          message: 'Email này không được phép đăng ký!'
        });
      }
      var isAdmin = (cleanEmail === 'admin@vluflagship.vn');

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

      // Gọi backend PHP lưu vào CSDL MySQL
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
      .then(function (res) {
        return res.json().catch(function () {
          return { success: false, code: 'INVALID_SERVER_RESPONSE', message: 'Lỗi phản hồi máy chủ.' };
        });
      })
      .then(function (apiRes) {
        if (apiRes && apiRes.success) {
          if (apiRes.user) {
            newUser.id = Number(apiRes.user.id) > 0 ? Number(apiRes.user.id) : newUser.id;
            newUser.username = apiRes.user.username || newUser.username;
            newUser.role = apiRes.user.role != null ? Number(apiRes.user.role) : newUser.role;
          }
          var sessionUser = {
            id: Number(newUser.id),
            username: newUser.username,
            email: newUser.email,
            fullname: newUser.fullname,
            phone: newUser.phone,
            role: newUser.role,
            status: 'active',
            registeredAt: newUser.registeredAt
          };
          addRegisteredUser(newUser);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
          } catch (e) {}
          self.mergeGuestCartToUser(sessionUser);
          self.updateHeaderAuth();
          self.emitUpdate(sessionUser);
          return {
            success: true,
            message: apiRes.message || 'Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.',
            user: sessionUser
          };
        } else {
          return {
            success: false,
            code: apiRes ? apiRes.code : 'REGISTER_FAILED',
            message: apiRes ? apiRes.message : 'Đăng ký tài khoản không thành công!'
          };
        }
      })
      .catch(function () {
        // Fallback an toàn khi mạng offline hoàn toàn
        var offlineSessionUser = {
          id: Number(newUser.id),
          username: newUser.username,
          email: newUser.email,
          fullname: newUser.fullname,
          phone: newUser.phone,
          role: newUser.role,
          status: 'active',
          registeredAt: newUser.registeredAt
        };
        addRegisteredUser(newUser);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineSessionUser));
        } catch (e) {}
        self.mergeGuestCartToUser(offlineSessionUser);
        self.updateHeaderAuth();
        self.emitUpdate(offlineSessionUser);
        return {
          success: true,
          message: 'Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.',
          user: offlineSessionUser
        };
      });
    },

    /**
     * Đăng xuất trung tâm:
     * 1. Xóa phiên đăng nhập hiện tại (vlu_user) và các trạng thái phiên tạm thời (*_guest, sessionStorage)
     * 2. Giữ nguyên 100% dữ liệu lịch sử riêng của tài khoản (vlu_cart_${userId}, vlu_orders_${userId}, vlu_account_${userId})
     * 3. Reset badge giỏ hàng trên Header về trạng thái chưa đăng nhập (0 sản phẩm / giỏ tạm)
     * 4. Chuyển hướng thẳng về Trang chủ bằng window.location.replace('index.html') (xóa lịch sử trang cũ)
     */
    logout: function (options) {
      var opts = options && typeof options === 'object' ? options : {};
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      cleanupAllGuestKeys();
      try {
        if (window.sessionStorage && typeof window.sessionStorage.removeItem === 'function') {
          window.sessionStorage.removeItem('vlu_admin_session_logged');
        }
      } catch (eSess) {}

      this.updateHeaderAuth();
      this.emitUpdate(null);

      if (window.VLU_CART) {
        if (typeof window.VLU_CART.updateBadge === 'function') window.VLU_CART.updateBadge();
        if (typeof window.VLU_CART.emitUpdate === 'function') window.VLU_CART.emitUpdate();
      }
      try {
        var resetCount = (window.VLU_CART && typeof window.VLU_CART.getItemCount === 'function')
          ? window.VLU_CART.getItemCount()
          : 0;
        var badgeEls = document.querySelectorAll('#cartCount, #accountCartCount, .cart-badge-count');
        Array.prototype.forEach.call(badgeEls, function (el) {
          el.textContent = String(resetCount);
        });
      } catch (eBadge) {}

      if (opts.redirect !== false) {
        if (window.location && typeof window.location.replace === 'function') {
          window.location.replace('index.html');
        } else if (window.location) {
          window.location.href = 'index.html';
        }
      }

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

    // Xử lý nút Đăng xuất trên Header (Desktop Dropdown) — luôn chuyển thẳng về index.html
    var logoutBtn = document.getElementById('headerLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        AuthEngine.logout();
      });
    }

    // Xử lý nút Đăng xuất trên Mobile Drawer — luôn chuyển thẳng về index.html
    var mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        AuthEngine.logout();
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

  // Tự động dọn phiên ảo guest nếu còn tồn đọng trong localStorage ngay khi tải script
  AuthEngine.getUser();

  // Đưa AuthEngine ra toàn cục
  window.VLU_AUTH = AuthEngine;

})(window, document);
