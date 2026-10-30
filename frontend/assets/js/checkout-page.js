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

  // Render danh sách sản phẩm ở cột phải (Order Review)
  function renderOrderReview() {
    var engine = getCartEngine();
    if (!engine) return;

    var items = engine.getCart();
    var count = engine.getItemCount();
    var subtotal = engine.getSubtotal();
    var discount = engine.getDiscount();
    var total = engine.getTotal();

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
    renderOrderReview();

    // Toggle khung VietQR khi thay đổi phương thức thanh toán
    paymentRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (radio.value === 'vietqr' && radio.checked) {
          if (vietqrBox) vietqrBox.classList.remove('hidden');
        } else {
          if (vietqrBox) vietqrBox.classList.add('hidden');
        }
      });
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

        // Validate Địa chỉ nhận hàng
        if (!address) {
          alert('Vui lòng nhập địa chỉ nhận hàng chi tiết (Số nhà, tên đường, phường/xã)!');
          addressInput.focus();
          return;
        }

        // Lấy phương thức thanh toán đã chọn
        var selectedMethod = 'cod';
        var selectedMethodLabel = 'Thanh toán khi nhận hàng (COD)';
        paymentRadios.forEach(function (r) {
          if (r.checked) {
            selectedMethod = r.value;
            if (r.value === 'vietqr') selectedMethodLabel = 'Chuyển khoản VietQR';
            if (r.value === 'credit') selectedMethodLabel = 'Thẻ tín dụng / Apple Pay';
          }
        });

        var finalTotal = engine.formatVND(engine.getTotal());
        var fullAddress = address + (district ? ', ' + district : '') + (city ? ', ' + city : '');

        // Điền thông tin vào Modal Đặt hàng thành công
        if (successOrderId) successOrderId.textContent = currentOrderId;
        if (successCustomerName) successCustomerName.textContent = fullname;
        if (successCustomerPhone) successCustomerPhone.textContent = phone;
        if (successCustomerAddress) successCustomerAddress.textContent = fullAddress;
        if (successPaymentMethod) successPaymentMethod.textContent = selectedMethodLabel;
        if (successTotalAmount) successTotalAmount.textContent = finalTotal;

        // Tự động lưu đơn hàng vào vlu_orders để Admin quản lý ngay lập tức
        try {
          var newOrderRecord = {
            id: currentOrderId,
            customer_name: fullname,
            customer_phone: phone,
            customer_email: email || '',
            customer_address: fullAddress,
            customer_notes: notes || '',
            payment_method: selectedMethodLabel,
            payment_key: selectedMethod,
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
        } catch (err) {
          console.warn('Lỗi lưu đơn hàng vào vlu_orders:', err);
        }

        // Xóa giỏ hàng và cập nhật badge
        engine.clearCart();

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
