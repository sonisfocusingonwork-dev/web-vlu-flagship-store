/**
 * VLU FLAGSHIP STORE – Central Cart Engine 2026
 * Quản lý giỏ hàng toàn diện: localStorage, Badge Header, Voucher, Toast, Đồng bộ sự kiện đa trang
 */
(function (window, document) {
  'use strict';

  var STORAGE_KEY = 'vlu_cart';
  var SEEDED_KEY = 'vlu_cart_seeded';
  var VOUCHER_KEY = 'vlu_cart_voucher';

  // Danh mục voucher hợp lệ của hệ thống
  var PROMO_CODES = {
    'VLU2026': {
      code: 'VLU2026',
      type: 'fixed',
      value: 500000,
      minOrder: 1000000,
      label: 'Ưu đãi Tân Sinh Viên & Khách hàng VLU 2026 (-500.000₫)'
    },
    'FLAGSHIP': {
      code: 'FLAGSHIP',
      type: 'fixed',
      value: 1000000,
      minOrder: 15000000,
      label: 'Đặc quyền VLU Flagship Member (-1.000.000₫)'
    },
    'APPLEVIP': {
      code: 'APPLEVIP',
      type: 'fixed',
      value: 800000,
      minOrder: 10000000,
      label: 'Voucher Apple Ecosystem Care (-800.000₫)'
    },
    'FREESHIP': {
      code: 'FREESHIP',
      type: 'fixed',
      value: 0,
      minOrder: 0,
      label: 'Miễn phí vận chuyển toàn quốc (0₫)'
    }
  };

  // 2 Sản phẩm flagship mẫu dùng để nạp ban đầu cho người dùng dễ kiểm thử
  var SAMPLE_SEED_ITEMS = [
    {
      id: 'iphone-18-pro-max',
      name: 'iPhone 18 Pro Max',
      color: 'Titan Sa Mạc',
      variant: '256GB',
      price: 34990000,
      oldPrice: 36990000,
      image: 'SanPham/SanPham/Iphone/Ip 18 pro max/Vàng Sa Mạc.png',
      quantity: 1
    },
    {
      id: 'airpods-pro-2',
      name: 'AirPods Pro 2 (USB-C)',
      color: 'Trắng',
      variant: 'Chống ồn ANC',
      price: 5790000,
      oldPrice: 6190000,
      image: 'frontend/assets/images/placeholders/tai-nghe.svg',
      quantity: 1
    }
  ];

  var CartEngine = {
    /**
     * Lấy danh sách sản phẩm trong giỏ hàng.
     * Tự động nạp sẵn 2 sản phẩm mẫu ở lần mở web đầu tiên nếu giỏ đang trống.
     */
    getCart: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        var seeded = localStorage.getItem(SEEDED_KEY);

        if (!raw) {
          if (!seeded) {
            // Lần đầu mở: nạp sản phẩm mẫu để khách dễ kiểm thử giao diện
            this.saveCart(SAMPLE_SEED_ITEMS);
            localStorage.setItem(SEEDED_KEY, 'true');
            return SAMPLE_SEED_ITEMS.slice();
          }
          return [];
        }

        var items = JSON.parse(raw);
        if (!Array.isArray(items)) {
          return [];
        }
        return items;
      } catch (e) {
        console.warn('[CartEngine] Lỗi đọc giỏ hàng:', e);
        return [];
      }
    },

    /**
     * Lưu giỏ hàng vào localStorage và kích hoạt cập nhật Badge
     */
    saveCart: function (items) {
      try {
        if (!Array.isArray(items)) items = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        this.updateBadge();
        this.emitUpdate();
      } catch (e) {
        console.error('[CartEngine] Lỗi ghi giỏ hàng:', e);
      }
    },

    /**
     * Thêm sản phẩm vào giỏ hàng
     * Tự động gộp số lượng nếu trùng id, color và variant
     */
    addItem: function (item) {
      if (!item || !item.name) return false;
      var cart = this.getCart();

      var id = item.id || (item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      var color = (item.color || 'Mặc định').trim();
      var variant = (item.variant || 'Tiêu chuẩn').trim();
      var quantity = parseInt(item.quantity, 10) || 1;
      var price = parseInt(item.price, 10) || 0;
      var oldPrice = item.oldPrice ? parseInt(item.oldPrice, 10) : null;
      var image = item.image || 'frontend/assets/images/logo.png';

      var found = false;
      for (var i = 0; i < cart.length; i++) {
        var it = cart[i];
        if (it.id === id && (it.color || '') === color && (it.variant || '') === variant) {
          it.quantity = (parseInt(it.quantity, 10) || 0) + quantity;
          if (price > 0) it.price = price;
          if (oldPrice) it.oldPrice = oldPrice;
          if (image) it.image = image;
          found = true;
          break;
        }
      }

      if (!found) {
        cart.push({
          id: id,
          name: item.name,
          color: color,
          variant: variant,
          price: price,
          oldPrice: oldPrice,
          image: image,
          quantity: quantity
        });
      }

      // Đánh dấu đã tương tác giỏ hàng
      localStorage.setItem(SEEDED_KEY, 'true');
      this.saveCart(cart);
      return true;
    },

    /**
     * Tăng / giảm số lượng của một sản phẩm theo vị trí index
     */
    updateQuantity: function (index, delta) {
      var cart = this.getCart();
      if (index < 0 || index >= cart.length) return false;

      var newQty = (parseInt(cart[index].quantity, 10) || 1) + delta;
      if (newQty <= 0) {
        // Xóa món hàng nếu giảm về 0
        cart.splice(index, 1);
      } else {
        cart[index].quantity = newQty;
      }

      this.saveCart(cart);
      return true;
    },

    /**
     * Xóa sản phẩm khỏi giỏ hàng theo index
     */
    removeItem: function (index) {
      var cart = this.getCart();
      if (index < 0 || index >= cart.length) return false;
      cart.splice(index, 1);
      this.saveCart(cart);
      return true;
    },

    /**
     * Xóa sạch toàn bộ giỏ hàng và voucher
     */
    clearCart: function () {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VOUCHER_KEY);
      localStorage.setItem(SEEDED_KEY, 'true'); // Tránh tự động seed lại sau khi khách chủ động xóa/đặt hàng
      this.updateBadge();
      this.emitUpdate();
    },

    /**
     * Tính tổng số lượng sản phẩm (Total Items Count)
     */
    getItemCount: function () {
      var cart = this.getCart();
      var count = 0;
      for (var i = 0; i < cart.length; i++) {
        count += (parseInt(cart[i].quantity, 10) || 0);
      }
      return count;
    },

    /**
     * Tính Tạm tính (Subtotal)
     */
    getSubtotal: function () {
      var cart = this.getCart();
      var sub = 0;
      for (var i = 0; i < cart.length; i++) {
        var p = parseInt(cart[i].price, 10) || 0;
        var q = parseInt(cart[i].quantity, 10) || 1;
        sub += (p * q);
      }
      return sub;
    },

    /**
     * Lấy voucher hiện tại đang được kích hoạt
     */
    getVoucher: function () {
      try {
        var raw = localStorage.getItem(VOUCHER_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    /**
     * Áp dụng mã voucher
     */
    applyVoucher: function (code) {
      if (!code) return { success: false, message: 'Vui lòng nhập mã giảm giá!' };
      var cleanCode = code.trim().toUpperCase();
      var promo = PROMO_CODES[cleanCode];

      if (!promo) {
        return { success: false, message: 'Mã "' + cleanCode + '" không hợp lệ hoặc đã hết lượt dùng.' };
      }

      var subtotal = this.getSubtotal();
      if (promo.minOrder && subtotal < promo.minOrder) {
        return {
          success: false,
          message: 'Mã này chỉ áp dụng cho đơn hàng từ ' + this.formatVND(promo.minOrder) + ' trở lên!'
        };
      }

      var discountAmount = 0;
      if (promo.type === 'fixed') {
        discountAmount = promo.value;
      } else if (promo.type === 'percent') {
        discountAmount = Math.round(subtotal * (promo.value / 100));
        if (promo.maxDiscount) discountAmount = Math.min(discountAmount, promo.maxDiscount);
      }

      var voucherData = {
        code: promo.code,
        label: promo.label,
        discount: discountAmount
      };

      try {
        localStorage.setItem(VOUCHER_KEY, JSON.stringify(voucherData));
      } catch (e) {}

      this.emitUpdate();
      return {
        success: true,
        message: 'Áp dụng mã "' + promo.code + '" thành công! Tiết kiệm ' + this.formatVND(discountAmount) + '.',
        voucher: voucherData
      };
    },

    /**
     * Gỡ bỏ voucher hiện tại
     */
    removeVoucher: function () {
      localStorage.removeItem(VOUCHER_KEY);
      this.emitUpdate();
    },

    /**
     * Tính tổng số tiền được giảm giá từ voucher
     */
    getDiscount: function () {
      var voucher = this.getVoucher();
      if (!voucher || !voucher.discount) return 0;
      var subtotal = this.getSubtotal();
      if (subtotal <= 0) return 0;
      return Math.min(subtotal, parseInt(voucher.discount, 10) || 0);
    },

    /**
     * Tính Tổng thanh toán cuối cùng (Grand Total)
     */
    getTotal: function () {
      var subtotal = this.getSubtotal();
      if (subtotal <= 0) return 0;
      var discount = this.getDiscount();
      return Math.max(0, subtotal - discount);
    },

    /**
     * Định dạng tiền tệ VND (ví dụ: 34.990.000₫)
     */
    formatVND: function (num) {
      var n = parseInt(num, 10) || 0;
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    },

    /**
     * Cập nhật số lượng trên icon giỏ hàng ở thanh Header trên toàn bộ trang
     */
    updateBadge: function (triggerAnimation) {
      var count = this.getItemCount();
      var badges = document.querySelectorAll('#cartCount, .cart-badge-count');
      badges.forEach(function (b) {
        b.textContent = count;
        if (triggerAnimation) {
          b.classList.remove('bump');
          void b.offsetWidth;
          b.classList.add('bump');
        }
      });
    },

    /**
     * Bắn Custom Event để các trang nghe và cập nhật giao diện thời gian thực
     */
    emitUpdate: function () {
      var event;
      var data = {
        cart: this.getCart(),
        count: this.getItemCount(),
        subtotal: this.getSubtotal(),
        discount: this.getDiscount(),
        total: this.getTotal()
      };
      if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent('vlu:cart-updated', { detail: data });
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent('vlu:cart-updated', true, true, data);
      }
      window.dispatchEvent(event);
    },

    /**
     * Hiển thị Toast thông báo phong cách Dynamic Island mượt mà
     */
    showToast: function (msg, isError) {
      var toast = document.getElementById('toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.className = 'pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-2xl transition-all duration-300';
        document.body.appendChild(toast);
      }

      toast.style.background = isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(11, 15, 25, 0.92)';
      toast.style.backdropFilter = 'blur(16px)';
      toast.textContent = msg;
      toast.classList.add('show');
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';

      if (this._toastTimer) clearTimeout(this._toastTimer);
      var self = this;
      this._toastTimer = setTimeout(function () {
        toast.classList.remove('show');
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 1rem)';
      }, 2600);
    }
  };

  // Khởi động cập nhật badge và lắng nghe thay đổi giữa các tab
  function initEngine() {
    CartEngine.updateBadge();
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY || e.key === VOUCHER_KEY) {
        CartEngine.updateBadge();
        CartEngine.emitUpdate();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }

  // Đưa CartEngine ra toàn cục
  window.VLU_CART = CartEngine;

})(window, document);
