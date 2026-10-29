/**
 * VLU FLAGSHIP STORE – Cart Page Logic 2026
 * Quản lý hiển thị giỏ hàng động, cập nhật số lượng thời gian thực, tính tiền, áp dụng voucher
 */
(function (window, document) {
  'use strict';

  var cartItemsContainer = document.getElementById('cartItemsList');
  var cartEmptyState = document.getElementById('cartEmptyState');
  var cartMainContent = document.getElementById('cartMainContent');
  var cartCountHeader = document.getElementById('cartCountHeader');

  var summarySubtotal = document.getElementById('summarySubtotal');
  var summaryDiscount = document.getElementById('summaryDiscount');
  var summaryDiscountRow = document.getElementById('summaryDiscountRow');
  var summaryTotal = document.getElementById('summaryTotal');
  var voucherInput = document.getElementById('voucherInput');
  var applyVoucherBtn = document.getElementById('applyVoucherBtn');
  var voucherFeedback = document.getElementById('voucherFeedback');
  var activeVoucherBox = document.getElementById('activeVoucherBox');
  var activeVoucherCode = document.getElementById('activeVoucherCode');
  var activeVoucherLabel = document.getElementById('activeVoucherLabel');
  var removeVoucherBtn = document.getElementById('removeVoucherBtn');
  var checkoutBtn = document.getElementById('checkoutBtn');

  function getCartEngine() {
    return window.VLU_CART;
  }

  function renderCart() {
    var engine = getCartEngine();
    if (!engine) return;

    var items = engine.getCart();
    var count = engine.getItemCount();
    var subtotal = engine.getSubtotal();
    var discount = engine.getDiscount();
    var total = engine.getTotal();
    var voucher = engine.getVoucher();

    // Cập nhật số lượng sản phẩm trên tiêu đề
    if (cartCountHeader) {
      cartCountHeader.textContent = count > 0 ? '(' + count + ' sản phẩm)' : '';
    }

    if (!items || items.length === 0) {
      if (cartMainContent) cartMainContent.classList.add('hidden');
      if (cartEmptyState) cartEmptyState.classList.remove('hidden');
      if (checkoutBtn) {
        checkoutBtn.classList.add('pointer-events-none', 'opacity-50');
      }
      return;
    }

    if (cartMainContent) cartMainContent.classList.remove('hidden');
    if (cartEmptyState) cartEmptyState.classList.add('hidden');
    if (checkoutBtn) {
      checkoutBtn.classList.remove('pointer-events-none', 'opacity-50');
    }

    // Render danh sách sản phẩm
    if (cartItemsContainer) {
      var html = '';
      items.forEach(function (item, index) {
        var lineTotal = (parseInt(item.price, 10) || 0) * (parseInt(item.quantity, 10) || 1);
        var oldLineTotal = item.oldPrice ? (parseInt(item.oldPrice, 10) * (parseInt(item.quantity, 10) || 1)) : 0;
        var detailUrl = 'product-detail.html?id=' + encodeURIComponent(item.id || '') + '&name=' + encodeURIComponent(item.name || '');

        html += '<div class="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm" data-index="' + index + '">';
        
        // Cột ảnh
        html += '  <a href="' + detailUrl + '" class="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center transition group-hover:scale-102">';
        html += '    <img src="' + (item.image || 'frontend/assets/images/logo.png') + '" alt="' + item.name + '" class="max-h-full max-w-full object-contain" onerror="this.onerror=null;this.src=\'image_2c97c5.png\';">';
        html += '  </a>';

        // Cột thông tin
        html += '  <div class="flex-1 min-w-0 space-y-1.5">';
        html += '    <div class="flex items-start justify-between gap-3">';
        html += '      <h3 class="text-base font-bold text-slate-900 hover:text-brand transition truncate">';
        html += '        <a href="' + detailUrl + '">' + item.name + '</a>';
        html += '      </h3>';
        html += '      <button type="button" class="btn-remove-item text-slate-400 hover:text-red-500 transition p-1" data-index="' + index + '" aria-label="Xóa ' + item.name + ' khỏi giỏ hàng" title="Xóa món này">';
        html += '        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>';
        html += '      </button>';
        html += '    </div>';

        // Badges phân loại
        html += '    <div class="flex flex-wrap items-center gap-2 text-xs">';
        if (item.color) {
          html += '      <span class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">';
          html += '        Màu sắc: <strong class="text-slate-900">' + item.color + '</strong>';
          html += '      </span>';
        }
        if (item.variant) {
          html += '      <span class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">';
          html += '        Cấu hình: <strong class="text-slate-900">' + item.variant + '</strong>';
          html += '      </span>';
        }
        html += '      <span class="inline-flex items-center gap-1 text-emerald-600 font-semibold">';
        html += '        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Còn hàng';
        html += '      </span>';
        html += '    </div>';

        // Đơn giá & Cụm tăng giảm số lượng & Thành tiền
        html += '    <div class="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 mt-2">';
        html += '      <div class="flex items-baseline gap-2">';
        html += '        <span class="text-xs text-slate-500">Đơn giá:</span>';
        html += '        <span class="text-sm font-bold text-slate-900">' + engine.formatVND(item.price) + '</span>';
        if (item.oldPrice && item.oldPrice > item.price) {
          html += '        <span class="text-xs text-slate-400 line-through">' + engine.formatVND(item.oldPrice) + '</span>';
        }
        html += '      </div>';

        html += '      <div class="flex items-center gap-4">';
        // Bộ tăng giảm số lượng
        html += '        <div class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/80 p-0.5 shadow-inner">';
        html += '          <button type="button" class="btn-qty-minus grid h-7 w-7 place-items-center rounded-full text-slate-600 transition hover:bg-white hover:text-brand active:scale-95" data-index="' + index + '" aria-label="Giảm 1 sản phẩm">';
        html += '            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"/></svg>';
        html += '          </button>';
        html += '          <span class="w-8 text-center text-xs font-black text-slate-900 select-none">' + item.quantity + '</span>';
        html += '          <button type="button" class="btn-qty-plus grid h-7 w-7 place-items-center rounded-full text-slate-600 transition hover:bg-white hover:text-brand active:scale-95" data-index="' + index + '" aria-label="Tăng 1 sản phẩm">';
        html += '            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>';
        html += '          </button>';
        html += '        </div>';

        // Thành tiền
        html += '        <div class="text-right min-w-28">';
        html += '          <div class="text-sm sm:text-base font-black text-brand">' + engine.formatVND(lineTotal) + '</div>';
        html += '        </div>';
        html += '      </div>';

        html += '    </div>';
        html += '  </div>';

        html += '</div>';
      });

      cartItemsContainer.innerHTML = html;
    }

    // Cập nhật Cột phải: Khung Tóm tắt đơn hàng (Sticky Summary)
    if (summarySubtotal) summarySubtotal.textContent = engine.formatVND(subtotal);
    if (summaryTotal) summaryTotal.textContent = engine.formatVND(total);

    if (discount > 0) {
      if (summaryDiscountRow) summaryDiscountRow.classList.remove('hidden');
      if (summaryDiscount) summaryDiscount.textContent = '-' + engine.formatVND(discount);
    } else {
      if (summaryDiscountRow) summaryDiscountRow.classList.add('hidden');
    }

    // Hiển thị trạng thái Voucher đang áp dụng
    if (voucher && voucher.code) {
      if (activeVoucherBox) activeVoucherBox.classList.remove('hidden');
      if (activeVoucherCode) activeVoucherCode.textContent = voucher.code;
      if (activeVoucherLabel) activeVoucherLabel.textContent = voucher.label || ('Giảm ' + engine.formatVND(voucher.discount));
      if (voucherInput) voucherInput.value = voucher.code;
    } else {
      if (activeVoucherBox) activeVoucherBox.classList.add('hidden');
    }
  }

  // Khởi động sự kiện tương tác
  function initCartPage() {
    renderCart();

    // Lắng nghe cập nhật từ CartEngine
    window.addEventListener('vlu:cart-updated', function () {
      renderCart();
    });

    // Xử lý click trong danh sách sản phẩm (Tăng/Giảm/Xóa)
    if (cartItemsContainer) {
      cartItemsContainer.addEventListener('click', function (e) {
        var engine = getCartEngine();
        if (!engine) return;

        // Bấm nút tăng số lượng
        var btnPlus = e.target.closest('.btn-qty-plus');
        if (btnPlus) {
          var idx = parseInt(btnPlus.getAttribute('data-index'), 10);
          engine.updateQuantity(idx, 1);
          return;
        }

        // Bấm nút giảm số lượng
        var btnMinus = e.target.closest('.btn-qty-minus');
        if (btnMinus) {
          var idxMinus = parseInt(btnMinus.getAttribute('data-index'), 10);
          engine.updateQuantity(idxMinus, -1);
          return;
        }

        // Bấm nút xóa sản phẩm
        var btnRemove = e.target.closest('.btn-remove-item');
        if (btnRemove) {
          var idxRemove = parseInt(btnRemove.getAttribute('data-index'), 10);
          var items = engine.getCart();
          var removedName = items[idxRemove] ? items[idxRemove].name : 'Sản phẩm';
          engine.removeItem(idxRemove);
          engine.showToast('Đã xóa "' + removedName + '" khỏi giỏ hàng.');
          return;
        }
      });
    }

    // Nút Xóa tất cả giỏ hàng
    var btnClearAll = document.getElementById('btnClearAllCart');
    if (btnClearAll) {
      btnClearAll.addEventListener('click', function () {
        var engine = getCartEngine();
        if (!engine) return;
        if (confirm('Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng không?')) {
          engine.clearCart();
          engine.showToast('Đã làm trống giỏ hàng.');
        }
      });
    }

    // Áp dụng mã Voucher
    if (applyVoucherBtn && voucherInput) {
      applyVoucherBtn.addEventListener('click', function () {
        var engine = getCartEngine();
        if (!engine) return;
        var code = voucherInput.value.trim();
        var res = engine.applyVoucher(code);

        if (voucherFeedback) {
          voucherFeedback.textContent = res.message;
          voucherFeedback.className = 'text-xs mt-1.5 ' + (res.success ? 'text-emerald-600 font-semibold' : 'text-red-500 font-medium');
          voucherFeedback.classList.remove('hidden');
        }

        if (res.success) {
          renderCart();
          engine.showToast('Áp dụng mã giảm giá "' + res.voucher.code + '" thành công!');
        }
      });

      voucherInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyVoucherBtn.click();
        }
      });
    }

    // Gỡ mã Voucher
    if (removeVoucherBtn) {
      removeVoucherBtn.addEventListener('click', function () {
        var engine = getCartEngine();
        if (!engine) return;
        engine.removeVoucher();
        if (voucherInput) voucherInput.value = '';
        if (voucherFeedback) voucherFeedback.classList.add('hidden');
        renderCart();
        engine.showToast('Đã gỡ mã giảm giá.');
      });
    }

    // Chips chọn nhanh Voucher
    document.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-promo]');
      if (chip && voucherInput && applyVoucherBtn) {
        voucherInput.value = chip.getAttribute('data-promo');
        applyVoucherBtn.click();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
  } else {
    initCartPage();
  }

})(window, document);
