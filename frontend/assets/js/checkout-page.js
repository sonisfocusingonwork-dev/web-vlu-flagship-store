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

  function prefillSavedAddress() {
    try {
      var user = JSON.parse(localStorage.getItem('vlu_user') || 'null');
      if (!user || !(user.username || user.email || user.id)) return;
      var identity = String(user.username || user.email || user.id).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
      var account = JSON.parse(localStorage.getItem('vlu_account_' + identity) || '{}');
      if (user.fullname && document.getElementById('checkoutFullname')) {
        document.getElementById('checkoutFullname').value = user.fullname;
      }
      if (user.phone && document.getElementById('checkoutPhone')) {
        document.getElementById('checkoutPhone').value = user.phone;
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
      console.warn('[Checkout] Tidak dapat điền địa chỉ mặc định từ hồ sơ:', error);
    }
  }

  function saveOrderToAccount(order) {
    try {
      var user = (window.VLU_AUTH && typeof window.VLU_AUTH.ensureGuestSession === 'function')
        ? window.VLU_AUTH.ensureGuestSession({
            fullname: order.customer_name,
            phone: order.customer_phone,
            email: order.customer_email
          })
        : JSON.parse(localStorage.getItem('vlu_user') || 'null');

      var identity = (user && (user.username || user.email || user.id)) || order.user_id || 'guest';
      var normalized = String(identity).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_') || 'guest';

      // 1. Lưu vào vlu_orders_<userId>
      var userOrdersKey = 'vlu_orders_' + normalized;
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

      // 2. Lưu vào vlu_account_<userId>
      var key = 'vlu_account_' + normalized;
      var account = JSON.parse(localStorage.getItem(key) || '{}');
      if (!account || typeof account !== 'object' || Array.isArray(account)) account = {};
      if (!Array.isArray(account.orders)) account.orders = [];
      account.orders = account.orders.filter(function (existing) {
        return String(existing.id) !== String(order.id);
      });
      account.orders.unshift(order);

      // Đồng bộ họ tên & SĐT người nhận vào hồ sơ nếu là Tài khoản Khách hoặc chưa có
      account.profile = Object.assign({}, account.profile || {}, {
        fullname: (account.profile && account.profile.fullname && !user.isGuest) ? account.profile.fullname : (order.customer_name || (user && user.fullname) || 'Khách vãng lai (Guest)'),
        phone: (account.profile && account.profile.phone && !user.isGuest) ? account.profile.phone : (order.customer_phone || (user && user.phone) || ''),
        email: (account.profile && account.profile.email && !user.isGuest) ? account.profile.email : (order.customer_email || (user && user.email) || '')
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
        html += '<div class="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">';
        html += '  <div class="h-16 w-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center">';
        html += '    <img src="' + (item.image || 'frontend/assets/images/logo.png') + '" alt="' + item.name + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'image_2c97c5.png\';">';
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
    // Tự động kích hoạt Tài khoản Khách (Silent Guest Login) nếu người dùng chưa đăng nhập
    if (window.VLU_AUTH && typeof window.VLU_AUTH.ensureGuestSession === 'function') {
      window.VLU_AUTH.ensureGuestSession();
    }
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

        // Validate Họ tên
        if (!fullname) {
          alert('Vui lòng nhập Họ và tên người nhận hàng!');
          fullnameInput.focus();
          return;
        }

        // Validate Số điện thoại (10 chữ số chuẩn đầu số Việt Nam)
        var phoneRegex = /^(03|05|07|08|09)\d{8}$/;
        if (!phone || !phoneRegex.test(phone)) {
          alert('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động tại Việt Nam (ví dụ: 0987654321).');
          phoneInput.focus();
          return;
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
            alert('Vui lòng nhập Tỉnh/Thành, Quận/Huyện và địa chỉ số nhà, tên đường!');
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

        // Tự động lưu đơn hàng vào vlu_orders, vlu_orders_<userId> và vlu_account_<userId>
        try {
          // Đồng bộ Họ tên & SĐT vào phiên Tài khoản Khách (hoặc khởi tạo nếu chưa có)
          if (window.VLU_AUTH && typeof window.VLU_AUTH.ensureGuestSession === 'function') {
            window.VLU_AUTH.ensureGuestSession({
              fullname: fullname,
              phone: phone,
              email: email
            });
          }

          var resolvedUserId = engine.getCurrentUserId ? engine.getCurrentUserId() : 'guest';
          var newOrderRecord = {
            id: currentOrderId,
            customer_name: fullname,
            customer_phone: phone,
            customer_email: email || '',
            customer_address: fullAddress,
            shipping_method: shippingMethod,
            store_location: shippingMethod === 'pickup' ? selectedStore : '',
            customer_notes: notes || '',
            payment_method: selectedMethodLabel,
            payment_key: selectedMethod,
            voucher_code: engine.getVoucher() ? engine.getVoucher().code : '',
            installment_term: installmentTerm,
            installment_monthly: installmentTerm ? Math.ceil(engine.getTotal() / Number(installmentTerm)) : 0,
            user_id: resolvedUserId,
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
            var activeAuthUser = (window.VLU_AUTH && typeof window.VLU_AUTH.getUser === 'function')
              ? window.VLU_AUTH.getUser()
              : null;
            var sqlOrderPayload = Object.assign({}, newOrderRecord, {
              order_code: newOrderRecord.id,
              db_user_id: activeAuthUser && !activeAuthUser.isGuest && Number(activeAuthUser.id) > 0
                ? Number(activeAuthUser.id)
                : null
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
        // CHỈ ĐƯỢC XÓA key giỏ hàng của user đó (ví dụ vlu_cart_userId), TUYỆT ĐỐI KHÔNG dùng localStorage.clear()
        // hay xóa key vlu_user chứa thông tin phiên đăng nhập hiện tại.
        try {
          var currentUser = (window.VLU_AUTH && typeof window.VLU_AUTH.getUser === 'function')
            ? window.VLU_AUTH.getUser()
            : JSON.parse(localStorage.getItem('vlu_user') || 'null');

          var currentId = currentUser && (currentUser.username || currentUser.email || currentUser.id);
          var normalizedCartId = currentId
            ? String(currentId).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_')
            : 'guest';

          // Chỉ xóa đúng key giỏ hàng và voucher của tài khoản hiện tại
          localStorage.removeItem('vlu_cart_' + normalizedCartId);
          localStorage.removeItem('vlu_cart_voucher_' + normalizedCartId);
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

        // Cập nhật đường link nút Xem đơn hàng đã đặt & Quay về trang chủ theo đúng môi trường (PHP vs HTML)
        var isPhpEnv = window.location.pathname.indexOf('.php') !== -1;
        var btnViewOrders = document.getElementById('btnViewOrders');
        var btnBackToHome = document.getElementById('btnBackToHome');
        var btnContinueShopping = document.getElementById('btnContinueShopping');
        if (btnViewOrders) {
          btnViewOrders.setAttribute('href', isPhpEnv ? 'account.php?tab=orders' : 'account.html?tab=orders');
        }
        if (btnBackToHome) {
          btnBackToHome.setAttribute('href', isPhpEnv ? 'index.php' : 'index.html');
        }
        if (btnContinueShopping) {
          btnContinueShopping.setAttribute('href', isPhpEnv ? 'index.php#dien-thoai' : 'index.html#dien-thoai');
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
