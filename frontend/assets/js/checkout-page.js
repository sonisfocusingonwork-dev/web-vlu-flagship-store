/**
 * VLU FLAGSHIP STORE – Checkout Page Logic 2026
 * Xử lý dữ liệu đơn hàng, đối chiếu giỏ hàng, chọn phương thức thanh toán VietQR, validate form & hiển thị modal thành công
 */
(function (window, document) {
  'use strict';

  var checkoutItemsList = document.getElementById('checkoutItemsList');
  var checkoutSubtotal = document.getElementById('checkoutSubtotal');
  var checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
  var checkoutDiscount = document.getElementById('checkoutDiscount');
  var checkoutTotal = document.getElementById('checkoutTotal');
  var checkoutCountBadge = document.getElementById('checkoutCountBadge');

  var checkoutForm = document.getElementById('checkoutForm');
  var btnSubmitOrder = document.getElementById('btnSubmitOrder');

  // Phương thức thanh toán
  var paymentRadios = document.querySelectorAll('input[name="payment_method"]');
  var vietqrBox = document.getElementById('vietqrBox');
  var bnplBox = document.getElementById('bnplBox');
  var installmentRadios = document.querySelectorAll('input[name="installment_term"]');
  var shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
  var deliveryAddressFields = document.getElementById('deliveryAddressFields');
  var storePickupFields = document.getElementById('storePickupFields');
  var qrOrderCodeText = document.getElementById('qrOrderCodeText');
  var qrOrderTotalText = document.getElementById('qrOrderTotalText');

  // Modal Đặt hàng thành công
  var successModal = document.getElementById('orderSuccessModal');
  var successOrderId = document.getElementById('successOrderId');
  var successCustomerName = document.getElementById('successCustomerName');
  var successCustomerPhone = document.getElementById('successCustomerPhone');
  var successCustomerAddress = document.getElementById('successCustomerAddress');
  var successPaymentMethod = document.getElementById('successPaymentMethod');
  var successTotalAmount = document.getElementById('successTotalAmount');

  // Sinh mã đơn hàng ngẫu nhiên dạng #VLU-2026-XXXXX
  var currentOrderId = '#VLU-2026-' + Math.floor(10000 + Math.random() * 90000);

  function getCartEngine() {
    return window.VLU_CART;
  }

  function getSelectedValue(radios, fallback) {
    var selected = fallback;
    radios.forEach(function (radio) {
      if (radio.checked) selected = radio.value;
    });
    return selected;
  }

  function updateShippingFields() {
    var pickup = getSelectedValue(shippingRadios, 'delivery') === 'pickup';
    var addressInputs = deliveryAddressFields ? deliveryAddressFields.querySelectorAll('input, select, textarea') : [];
    Array.prototype.forEach.call(addressInputs, function (input) {
      input.disabled = pickup;
      input.required = !pickup;
    });
    if (deliveryAddressFields) deliveryAddressFields.classList.toggle('hidden', pickup);
    if (storePickupFields) storePickupFields.classList.toggle('hidden', !pickup);
    if (storePickupFields) {
      storePickupFields.querySelectorAll('input[name="store_location"]').forEach(function (input) {
        input.disabled = !pickup;
      });
    }
  }

  function updateInstallmentAmounts() {
    var engine = getCartEngine();
    if (!engine) return;
    var total = engine.getTotal();
    [3, 6, 12].forEach(function (months) {
      var amount = document.getElementById('installmentAmount' + months);
      if (amount) amount.textContent = engine.formatVND(Math.ceil(total / months)) + '/tháng';
    });
  }

  function getAuthenticatedUser() {
    var user = null;
    if (window.VLU_AUTH && typeof window.VLU_AUTH.getUser === 'function') {
      user = window.VLU_AUTH.getUser();
    } else {
      try { user = JSON.parse(localStorage.getItem('vlu_user') || 'null'); } catch (e) { user = null; }
    }
    if (!user || typeof user !== 'object') return null;
    if (user.isGuest === true) return null;
    var idStr = String(user.id == null ? '' : user.id).trim().toLowerCase();
    var uname = String(user.username || '').trim().toLowerCase();
    var email = String(user.email || '').trim().toLowerCase();
    if (idStr === 'guest' || uname === 'guest' || email === 'guest@vluflagship.vn') return null;
    var numId = Number(user.id);
    if (!Number.isFinite(numId) || numId <= 0) return null;
    return user;
  }

  function redirectGuestToLogin() {
    try {
      localStorage.removeItem('vlu_orders_guest');
      localStorage.removeItem('vlu_account_guest');
    } catch (e) {}
    if (window.location && typeof window.location.replace === 'function') {
      window.location.replace('login.html?next=checkout.html');
    } else {
      window.location.href = 'login.html?next=checkout.html';
    }
  }

  function prefillSavedAddress() {
    try {
      var user = getAuthenticatedUser();
      if (!user) return;
      var userIdKey = String(Number(user.id));
      var legacyIdentity = String(user.username || user.email || user.id).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
      var account = JSON.parse(localStorage.getItem('vlu_account_' + userIdKey) || 'null');
      if (!account && legacyIdentity && legacyIdentity !== userIdKey) {
        account = JSON.parse(localStorage.getItem('vlu_account_' + legacyIdentity) || '{}');
      }
      account = account || {};
      if (user.fullname && document.getElementById('checkoutFullname')) {
        document.getElementById('checkoutFullname').value = user.fullname;
      }
      if (user.phone && document.getElementById('checkoutPhone')) {
        document.getElementById('checkoutPhone').value = user.phone;
      }
      if (user.email && document.getElementById('checkoutEmail')) {
        document.getElementById('checkoutEmail').value = user.email;
      }
      var addresses = account && Array.isArray(account.addresses) ? account.addresses : [];
      var address = addresses.find(function (item) { return item.default; });
      if (!address) return;
      var fullname = document.getElementById('checkoutFullname');
      var phone = document.getElementById('checkoutPhone');
      var city = document.getElementById('checkoutCity');
      var district = document.getElementById('checkoutDistrict');
      var line = document.getElementById('checkoutAddress');
      if (fullname) fullname.value = address.name || user.fullname || '';
      if (phone) phone.value = address.phone || user.phone || '';
      if (city && address.city) {
        var cityOption = Array.prototype.find.call(city.options, function (option) {
          return option.value.toLowerCase() === String(address.city).toLowerCase();
        });
        if (!cityOption) {
          cityOption = document.createElement('option');
          cityOption.value = address.city;
          cityOption.textContent = address.city;
          city.appendChild(cityOption);
        }
        city.value = cityOption.value;
      }
      if (district) district.value = address.district || '';
      if (line) line.value = [address.street, address.ward].filter(Boolean).join(', ') || address.address || '';
    } catch (error) {
      console.warn('[Checkout] Không thể điền địa chỉ mặc định từ hồ sơ:', error);
    }
  }

  function saveOrderToAccount(order) {
    try {
      var user = getAuthenticatedUser();
      if (!user) return;
      var userIdKey = String(Number(user.id));

      // 1. Lưu vào vlu_orders_${user.id}
      var userOrdersKey = 'vlu_orders_' + userIdKey;
      var userOrdersList = [];
      try {
        userOrdersList = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
        if (!Array.isArray(userOrdersList)) userOrdersList = [];
      } catch (e) {
        userOrdersList = [];
      }
      userOrdersList = userOrdersList.filter(function (existing) {
        return String(existing.id) !== String(order.id);
      });
      userOrdersList.unshift(order);
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrdersList));

      // 2. Lưu vào vlu_account_${user.id}
      var key = 'vlu_account_' + userIdKey;
      var account = JSON.parse(localStorage.getItem(key) || '{}');
      if (!account || typeof account !== 'object' || Array.isArray(account)) account = {};
      if (!Array.isArray(account.orders)) account.orders = [];
      account.orders = account.orders.filter(function (existing) {
        return String(existing.id) !== String(order.id);
      });
      account.orders.unshift(order);

      // Đồng bộ hồ sơ người dùng theo tài khoản đã đăng nhập
      account.profile = Object.assign({}, account.profile || {}, {
        fullname: (account.profile && account.profile.fullname) ? account.profile.fullname : (order.customer_name || user.fullname || ''),
        phone: (account.profile && account.profile.phone) ? account.profile.phone : (order.customer_phone || user.phone || ''),
        email: (account.profile && account.profile.email) ? account.profile.email : (order.customer_email || user.email || '')
      });

      if (!Array.isArray(account.notifications)) account.notifications = [];
      account.notifications.unshift({
        id: 'N-' + Date.now(),
        type: 'order',
        title: 'Đã tiếp nhận đơn hàng',
        message: 'Đơn ' + order.id + ' đã được ghi nhận và đang chờ xác nhận.',
        read: false,
        createdAt: new Date().toISOString()
      });
      if (order.payment_key !== 'cod') {
        account.notifications.unshift({
          id: 'N-' + (Date.now() + 1),
          type: 'payment',
          title: 'Đã ghi nhận phương thức thanh toán',
          message: 'Phương thức ' + order.payment_method + ' được lưu cho đơn ' + order.id + '.',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
      if (order.voucher_code && Array.isArray(account.vouchers)) {
        account.vouchers.forEach(function (voucher) {
          if (voucher.code === order.voucher_code) voucher.status = 'used';
        });
        if (!Array.isArray(account.usedVouchers)) account.usedVouchers = [];
        if (account.usedVouchers.indexOf(order.voucher_code) === -1) account.usedVouchers.push(order.voucher_code);
      }
      localStorage.setItem(key, JSON.stringify(account));
    } catch (error) {
      console.error('[Checkout] Không thể lưu đơn hàng trong vùng dữ liệu riêng của tài khoản:', error);
    }
  }

  // Render danh sách sản phẩm ở cột phải (Order Review)
  function renderOrderReview() {
    var engine = getCartEngine();
    if (!engine) return;

    var items = engine.getCart();
    var count = engine.getItemCount();
    var subtotal = engine.getSubtotal();
    var discount = engine.getDiscount();
    var total = engine.getTotal();
    updateInstallmentAmounts();

    if (checkoutCountBadge) {
      checkoutCountBadge.textContent = count > 0 ? count + ' sản phẩm' : '0 sản phẩm';
    }

    if (!items || items.length === 0) {
      if (checkoutItemsList) {
        checkoutItemsList.innerHTML = '<div class="py-6 text-center text-xs text-slate-500">Giỏ hàng của bạn đang trống.<br><a href="index.html" class="mt-2 inline-block font-bold text-brand hover:underline">Quay lại mua sắm</a></div>';
      }
      if (btnSubmitOrder) {
        btnSubmitOrder.classList.add('pointer-events-none', 'opacity-50');
      }
      if (checkoutSubtotal) checkoutSubtotal.textContent = '0₫';
      if (checkoutTotal) checkoutTotal.textContent = '0₫';
      if (checkoutDiscountRow) checkoutDiscountRow.classList.add('hidden');
      return;
    }

    if (btnSubmitOrder) {
      btnSubmitOrder.classList.remove('pointer-events-none', 'opacity-50');
    }

    // Render danh sách items
    if (checkoutItemsList) {
      var html = '';
      items.forEach(function (item) {
        var lineTotal = (parseInt(item.price, 10) || 0) * (parseInt(item.quantity, 10) || 1);
        var safeResolver = window.resolveProductImageUrl || function (u) { return u; };
        var resolvedImg = safeResolver(item.image || 'frontend/assets/images/logo.png', item.category);
        html += '<div class="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">';
        html += '  <div class="h-16 w-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center">';
        html += '    <img src="' + resolvedImg + '" alt="' + item.name + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'frontend/assets/images/placeholders/phone.svg\';">';
        html += '  </div>';
        html += '  <div class="flex-1 min-w-0">';
        html += '    <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">' + item.name + '</h4>';
        html += '    <p class="text-[11px] text-slate-500 font-medium">' + (item.color || 'Mặc định') + ' | ' + (item.variant || 'Tiêu chuẩn') + ' <span class="text-slate-800 font-bold">x' + item.quantity + '</span></p>';
        html += '  </div>';
        html += '  <div class="text-right shrink-0">';
        html += '    <span class="text-xs sm:text-sm font-black text-slate-900">' + engine.formatVND(lineTotal) + '</span>';
        html += '  </div>';
        html += '</div>';
      });
      checkoutItemsList.innerHTML = html;
    }

    // Cập nhật các dòng tổng tiền
    if (checkoutSubtotal) checkoutSubtotal.textContent = engine.formatVND(subtotal);
    if (checkoutTotal) checkoutTotal.textContent = engine.formatVND(total);

    if (discount > 0) {
      if (checkoutDiscountRow) checkoutDiscountRow.classList.remove('hidden');
      if (checkoutDiscount) checkoutDiscount.textContent = '-' + engine.formatVND(discount);
    } else {
      if (checkoutDiscountRow) checkoutDiscountRow.classList.add('hidden');
    }

    // Cập nhật thông tin cho khung VietQR
    if (qrOrderCodeText) qrOrderCodeText.textContent = currentOrderId.replace('#', '');
    if (qrOrderTotalText) qrOrderTotalText.textContent = engine.formatVND(total);
  }

  // Khởi động các tương tác trang Checkout
  function initCheckoutPage() {
    // Chặn truy cập nếu chưa đăng nhập tài khoản thực (không tự tạo phiên Guest)
    if (!getAuthenticatedUser()) {
      redirectGuestToLogin();
      return;
    }
    window.addEventListener('storage', function (e) {
      if (e.key === 'vlu_user' && !getAuthenticatedUser()) {
        redirectGuestToLogin();
      }
    });
    prefillSavedAddress();
    renderOrderReview();

    // Toggle khung VietQR khi thay đổi phương thức thanh toán
    paymentRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (radio.value === 'vietqr' && radio.checked) {
          if (vietqrBox) vietqrBox.classList.remove('hidden');
        } else {
          if (vietqrBox) vietqrBox.classList.add('hidden');
        }
        if (bnplBox) bnplBox.classList.toggle('hidden', getSelectedValue(paymentRadios, 'cod') !== 'bnpl');
      });
    });

    shippingRadios.forEach(function (radio) {
      radio.addEventListener('change', updateShippingFields);
    });
    updateShippingFields();
    updateInstallmentAmounts();

    window.addEventListener('vlu:cart-updated', function () {
      renderOrderReview();
    });

    // Nút sao chép (Số tài khoản / Cú pháp chuyển khoản)
    document.addEventListener('click', function (e) {
      var copyBtn = e.target.closest('[data-copy]');
      if (copyBtn) {
        var textToCopy = copyBtn.getAttribute('data-copy');
        if (!textToCopy && copyBtn.id === 'copySyntaxBtn') {
          textToCopy = 'VLU ' + currentOrderId.replace('#', '');
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(function () {
            var originalText = copyBtn.textContent;
            copyBtn.textContent = 'Đã chép!';
            setTimeout(function () { copyBtn.textContent = originalText; }, 1800);
          });
        } else {
          alert('Đã sao chép: ' + textToCopy);
        }
      }
    });

    // RÀNG BUỘC CHẶT INPUT: Họ và tên người nhận (chỉ chữ và khoảng trắng, không số, không ký tự đặc biệt)
    var fullnameInput = document.getElementById('checkoutFullname');
    var fullnameError = document.getElementById('fullnameError');
    if (fullnameInput) {
      function sanitizeFullname(e) {
        var original = fullnameInput.value;
        var filtered = original.replace(/[^\p{L}\s]/gu, '');
        if (original !== filtered) {
          fullnameInput.value = filtered;
          if (fullnameError) {
            fullnameError.textContent = 'Họ và tên chỉ được chứa chữ cái, không được nhập số hoặc ký tự đặc biệt!';
            fullnameError.classList.remove('hidden');
          }
        } else if (fullnameError && filtered.trim().length >= 2) {
          fullnameError.classList.add('hidden');
        }
      }

      fullnameInput.addEventListener('input', sanitizeFullname);
      fullnameInput.addEventListener('paste', function () {
        setTimeout(sanitizeFullname, 10);
      });
      fullnameInput.addEventListener('blur', function () {
        var val = fullnameInput.value.trim();
        if (fullnameError) {
          if (!val || val.length < 2) {
            fullnameError.textContent = 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự)!';
            fullnameError.classList.remove('hidden');
          } else {
            fullnameError.classList.add('hidden');
          }
        }
      });
    }

    // RÀNG BUỘC CHẶT INPUT: Số điện thoại (chỉ số 0-9, chuẩn 10 chữ số)
    var phoneInput = document.getElementById('checkoutPhone');
    var phoneError = document.getElementById('phoneError');
    if (phoneInput) {
      function sanitizePhone(e) {
        var original = phoneInput.value;
        var filtered = original.replace(/[^0-9]/g, '').slice(0, 10);
        if (original !== filtered) {
          phoneInput.value = filtered;
          if (phoneError) {
            phoneError.textContent = 'Số điện thoại chỉ được chứa các chữ số (0-9)!';
            phoneError.classList.remove('hidden');
          }
        } else if (phoneError && filtered.length === 10) {
          phoneError.classList.add('hidden');
        }
      }

      phoneInput.addEventListener('input', sanitizePhone);
      phoneInput.addEventListener('paste', function () {
        setTimeout(sanitizePhone, 10);
      });
      phoneInput.addEventListener('blur', function () {
        var val = phoneInput.value.trim();
        var phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (phoneError) {
          if (!phoneRegex.test(val)) {
            phoneError.textContent = 'Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động (03, 05, 07, 08, 09...).';
            phoneError.classList.remove('hidden');
          } else {
            phoneError.classList.add('hidden');
          }
        }
      });
    }

    // Xử lý nộp đơn hàng
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var engine = getCartEngine();
        if (!engine) return;

        var cart = engine.getCart();
        if (!cart || cart.length === 0) {
          alert('Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
          window.location.href = 'index.html';
          return;
        }

        // Lấy thông tin form
        var fullnameInput = document.getElementById('checkoutFullname');
        var phoneInput = document.getElementById('checkoutPhone');
        var emailInput = document.getElementById('checkoutEmail');
        var cityInput = document.getElementById('checkoutCity');
        var districtInput = document.getElementById('checkoutDistrict');
        var addressInput = document.getElementById('checkoutAddress');
        var notesInput = document.getElementById('checkoutNotes');

        var fullname = fullnameInput ? fullnameInput.value.trim() : '';
        var phone = phoneInput ? phoneInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';
        var city = cityInput ? cityInput.value.trim() : '';
        var district = districtInput ? districtInput.value.trim() : '';
        var address = addressInput ? addressInput.value.trim() : '';
        var notes = notesInput ? notesInput.value.trim() : '';
        var shippingMethod = getSelectedValue(shippingRadios, 'delivery');
        var selectedStore = getSelectedValue(storePickupFields ? storePickupFields.querySelectorAll('input[name="store_location"]') : [], '');

        // Validate Họ tên (tối thiểu 2 ký tự, CHỈ CHỮ CÁI Unicode và khoảng trắng)
        var nameStrictRegex = /^[\p{L}\s]{2,}$/u;
        if (!fullname || !nameStrictRegex.test(fullname)) {
          if (fullnameError) {
            fullnameError.textContent = 'Họ và tên chỉ được chứa chữ cái, không được nhập số hoặc ký tự đặc biệt!';
            fullnameError.classList.remove('hidden');
          } else {
            alert('Họ và tên chỉ được chứa chữ cái, không được nhập số hoặc ký tự đặc biệt!');
          }
          if (fullnameInput) fullnameInput.focus();
          return;
        } else if (fullnameError) {
          fullnameError.classList.add('hidden');
        }

        // Validate Số điện thoại (10 chữ số chuẩn đầu số Việt Nam)
        var phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (!phone || !phoneRegex.test(phone)) {
          if (phoneError) {
            phoneError.textContent = 'Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động (03, 05, 07, 08, 09...).';
            phoneError.classList.remove('hidden');
          } else {
            alert('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động (03, 05, 07, 08, 09...).');
          }
          if (phoneInput) phoneInput.focus();
          return;
        } else if (phoneError) {
          phoneError.classList.add('hidden');
        }

        var fullAddress = '';
        if (shippingMethod === 'pickup') {
          var storeRadio = storePickupFields ? storePickupFields.querySelector('input[name="store_location"]:checked') : null;
          if (!storeRadio) {
            alert('Vui lòng chọn chi nhánh nhận hàng!');
            return;
          }
          var storeLabel = storeRadio.closest('label');
          var storeLines = storeLabel ? storeLabel.querySelectorAll('strong, span.text-slate-500') : [];
          fullAddress = Array.prototype.map.call(storeLines, function (line) { return line.textContent.trim(); }).join(' - ');
        } else {
          if (!city || !district || !address) {
            alert('Vui lòng nhập Tỉnh/Thành, Quận / Phường / Khu vực và địa chỉ số nhà, tên đường!');
            if (!city && cityInput) cityInput.focus();
            else if (!district && districtInput) districtInput.focus();
            else if (addressInput) addressInput.focus();
            return;
          }
          fullAddress = address + ', ' + district + ', ' + city;
        }

        // Lấy phương thức thanh toán đã chọn
        var selectedMethod = 'cod';
        var selectedMethodLabel = 'Thanh toán khi nhận hàng (COD)';
        paymentRadios.forEach(function (r) {
          if (r.checked) {
            selectedMethod = r.value;
            if (r.value === 'vietqr') selectedMethodLabel = 'Chuyển khoản VietQR';
            if (r.value === 'credit') selectedMethodLabel = 'Thẻ tín dụng / Apple Pay';
            if (r.value === 'bnpl') selectedMethodLabel = 'Mua trước trả sau (Kredivo / MoMo / Home PayLater / Fundiin)';
          }
        });
        var installmentTerm = selectedMethod === 'bnpl' ? getSelectedValue(installmentRadios, '3') : '';

        var finalTotal = engine.formatVND(engine.getTotal());

        // Điền thông tin vào Modal Đặt hàng thành công
        if (successOrderId) successOrderId.textContent = currentOrderId;
        if (successCustomerName) successCustomerName.textContent = fullname;
        if (successCustomerPhone) successCustomerPhone.textContent = phone;
        if (successCustomerAddress) successCustomerAddress.textContent = fullAddress;
        if (successPaymentMethod) successPaymentMethod.textContent = selectedMethodLabel;
        if (successTotalAmount) successTotalAmount.textContent = finalTotal;

        // Tự động lưu đơn hàng vào vlu_orders, vlu_orders_${user.id} và vlu_account_${user.id}
        var activeAuthUser = getAuthenticatedUser();
        if (!activeAuthUser) {
          alert('Vui lòng đăng nhập tài khoản trước khi đặt hàng!');
          redirectGuestToLogin();
          return;
        }
        try {
          var numericUserId = Number(activeAuthUser.id);
          var userIdentity = String(activeAuthUser.username || activeAuthUser.email || numericUserId).trim().toLowerCase();
          var newOrderRecord = {
            id: currentOrderId,
            order_code: currentOrderId,
            customer_name: fullname,
            customer_phone: phone,
            customer_email: email || activeAuthUser.email || '',
            customer_address: fullAddress,
            shipping_method: shippingMethod,
            store_location: shippingMethod === 'pickup' ? selectedStore : '',
            customer_notes: notes || '',
            payment_method: selectedMethodLabel,
            payment_key: selectedMethod,
            voucher_code: engine.getVoucher() ? engine.getVoucher().code : '',
            installment_term: installmentTerm,
            installment_monthly: installmentTerm ? Math.ceil(engine.getTotal() / Number(installmentTerm)) : 0,
            user_id: numericUserId,
            db_user_id: numericUserId,
            user_identity: userIdentity,
            items: cart.map(function (it) {
              return {
                id: it.id,
                name: it.name,
                color: it.color || 'Mặc định',
                variant: it.variant || 'Tiêu chuẩn',
                price: it.price || 0,
                quantity: it.quantity || 1,
                image: it.image || 'frontend/assets/images/logo.png'
              };
            }),
            subtotal: engine.getSubtotal(),
            discount: engine.getDiscount(),
            total: engine.getTotal(),
            status: 'pending',
            created_at: new Date().toISOString()
          };

          var ordersList = [];
          var rawOrders = localStorage.getItem('vlu_orders');
          if (rawOrders) {
            ordersList = JSON.parse(rawOrders);
            if (!Array.isArray(ordersList)) ordersList = [];
          }
          ordersList.unshift(newOrderRecord);
          localStorage.setItem('vlu_orders', JSON.stringify(ordersList));
          saveOrderToAccount(newOrderRecord);

          // Đồng bộ lưu đơn hàng & chi tiết đơn hàng vào bảng orders / order_details trong MySQL qua API
          if (typeof fetch === 'function') {
            var sqlOrderPayload = Object.assign({}, newOrderRecord, {
              order_code: newOrderRecord.id,
              user_id: numericUserId,
              db_user_id: numericUserId,
              user_identity: userIdentity
            });
            fetch('backend/api/orders.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                action: 'create',
                order: sqlOrderPayload
              })
            }).catch(function (apiErr) {
              console.warn('[Checkout] Lưu đơn hàng MySQL offline, đã giữ tại localStorage:', apiErr);
            });
          }
        } catch (err) {
          console.warn('Lỗi lưu đơn hàng vào vlu_orders:', err);
        }

        // Xóa giỏ hàng chuẩn hóa theo đúng yêu cầu:
        // CHỈ ĐƯỢC XÓA key giỏ hàng của user đó (vlu_cart_${user.id}), TUYỆT ĐỐI KHÔNG xóa vlu_user
        try {
          var currentUser = getAuthenticatedUser();
          var normalizedCartId = currentUser ? String(Number(currentUser.id)) : '';

          if (normalizedCartId) {
            localStorage.removeItem('vlu_cart_' + normalizedCartId);
            localStorage.removeItem('vlu_cart_voucher_' + normalizedCartId);
          }
          localStorage.removeItem('vlu_cart'); // xóa legacy fallback nếu có
          localStorage.removeItem('vlu_cart_voucher');

          // Đảm bảo bảo toàn tuyệt đối phiên đăng nhập vlu_user
          if (currentUser && typeof currentUser === 'object') {
            localStorage.setItem('vlu_user', JSON.stringify(currentUser));
          }

          // Cập nhật lại huy hiệu giỏ hàng về 0
          if (engine && typeof engine.updateBadge === 'function') {
            engine.updateBadge();
          }
          if (engine && typeof engine.emitUpdate === 'function') {
            engine.emitUpdate();
          }
        } catch (clearErr) {
          console.warn('[Checkout] Lỗi làm sạch giỏ hàng:', clearErr);
        }

        // Cập nhật đường link nút Xem đơn hàng đã đặt & Quay về trang chủ (Bắt buộc .html)
        var btnViewOrders = document.getElementById('btnViewOrders');
        var btnBackToHome = document.getElementById('btnBackToHome');
        var btnContinueShopping = document.getElementById('btnContinueShopping');
        if (btnViewOrders) {
          btnViewOrders.setAttribute('href', 'account.html?tab=orders');
        }
        if (btnBackToHome) {
          btnBackToHome.setAttribute('href', 'index.html');
        }
        if (btnContinueShopping) {
          btnContinueShopping.setAttribute('href', 'index.html#dien-thoai');
        }

        // Hiển thị Modal Đặt hàng thành công
        if (successModal) {
          successModal.classList.remove('hidden');
          successModal.classList.add('flex');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckoutPage);
  } else {
    initCheckoutPage();
  }

})(window, document);
