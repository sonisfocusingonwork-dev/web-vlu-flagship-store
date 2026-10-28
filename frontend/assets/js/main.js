/**
 * VLU FLAGSHIP STORE – Client Interaction Script
 * - Mega-Menu 7 danh mục (Điện thoại, Laptop, iPad, Tai nghe, Loa, Phụ kiện, Đồng hồ)
 * - Hero Banner Carousel trượt vô hạn
 * - Mobile Drawer Accordion
 * - Giỏ hàng, nút yêu thích & Toast thông báo Dynamic Island
 */
(function () {
  'use strict';

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---------- 1. MENU MEGA (7 DANH MỤC CHÍNH) ---------- */
  var megaItems = $$('.nav-item-mega');
  var scrim = $('#megaScrim');
  var closeTimer = null;

  function closeAllMenus() {
    clearTimeout(closeTimer);
    megaItems.forEach(function (m) {
      m.classList.remove('is-open');
      var btn = $('button', m);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('has-mega-open');
  }

  function scheduleCloseAll() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      closeAllMenus();
    }, 220); // Đệm 220ms chống giật khi di chuột chéo
  }

  function openMegaItem(targetItem) {
    clearTimeout(closeTimer);
    megaItems.forEach(function (m) {
      if (m !== targetItem) {
        m.classList.remove('is-open');
        var b = $('button', m);
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
    targetItem.classList.add('is-open');
    var btn = $('button', targetItem);
    if (btn) btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('has-mega-open');
  }

  megaItems.forEach(function (mItem) {
    var btn = $('button', mItem);
    var panel = $('.mega-panel', mItem);

    mItem.addEventListener('mouseenter', function () {
      openMegaItem(mItem);
    });
    mItem.addEventListener('mouseleave', scheduleCloseAll);

    if (panel) {
      panel.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
      });
      panel.addEventListener('mouseleave', scheduleCloseAll);
    }

    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = mItem.classList.contains('is-open');
        if (isOpen) {
          closeAllMenus();
        } else {
          openMegaItem(mItem);
        }
      });
    }
  });

  // Đóng khi click scrim hoặc click ngoài
  if (scrim) {
    scrim.addEventListener('click', closeAllMenus);
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#site-header')) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllMenus();
      closeMobileDrawer();
    }
  });

  /* ---------- 2. MOBILE DRAWER ACCORDION ---------- */
  var mobileBtn = $('#mobileMenuBtn');
  var mobileDrawer = $('#mobileDrawer');

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'false');
      var burger = $('.icon-burger', mobileBtn);
      var closeIcon = $('.icon-close', mobileBtn);
      if (burger) burger.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
    document.body.classList.remove('overflow-hidden');
  }

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', function () {
      var willOpen = !mobileDrawer.classList.contains('is-open');
      if (willOpen) {
        mobileDrawer.classList.add('is-open');
        mobileBtn.setAttribute('aria-expanded', 'true');
        var burger = $('.icon-burger', mobileBtn);
        var closeIcon = $('.icon-close', mobileBtn);
        if (burger) burger.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      } else {
        closeMobileDrawer();
      }
    });
  }

  $$('.mobile-accordion-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var body = btn.nextElementSibling;
      var chevron = $('svg', btn);
      var isOpen = !body.classList.contains('hidden');
      if (isOpen) {
        body.classList.add('hidden');
        if (chevron) chevron.style.transform = '';
      } else {
        body.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* ---------- 3. HERO SLIDER TRƯỢT VÔ HẠN ---------- */
  var viewport = $('#heroViewport');
  var track    = $('#heroTrack');
  var slides   = $$('.slide', track);
  var dots     = $$('[data-dot]');
  var n        = slides.length;

  if (viewport && track && n > 0) {
    var firstClone = slides[0].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    firstClone.removeAttribute('role');
    firstClone.removeAttribute('aria-roledescription');
    firstClone.removeAttribute('aria-label');
    $$('a, button', firstClone).forEach(function (el) { el.setAttribute('tabindex', '-1'); });
    track.appendChild(firstClone);

    var index = 0, timer = null, startX = null, INTERVAL = 5000;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var setX = function (animate) {
      track.style.transitionProperty = animate ? 'transform' : 'none';
      track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
    };
    var paint = function () {
      var active = index >= n ? 0 : index;
      dots.forEach(function (d, k) {
        var on = k === active;
        d.setAttribute('aria-current', on ? 'true' : 'false');
        d.firstElementChild.className = 'block h-2.5 rounded-full transition-all duration-300 ' + (on ? 'w-7 bg-ink' : 'w-2.5 bg-ink/30');
      });
    };
    var next = function () { index += 1; setX(true); paint(); };
    var prev = function () {
      if (index === 0) { index = n; setX(false); track.getBoundingClientRect(); }
      index -= 1; setX(true); paint();
    };
    track.addEventListener('transitionend', function (e) {
      if (e.target === track && index >= n) { index = 0; setX(false); }
    });

    var play = function () { if (!reduce && !timer) timer = setInterval(next, INTERVAL); };
    var stop = function () { clearInterval(timer); timer = null; };

    var heroNextBtn = $('#heroNext');
    var heroPrevBtn = $('#heroPrev');
    if (heroNextBtn) heroNextBtn.addEventListener('click', next);
    if (heroPrevBtn) heroPrevBtn.addEventListener('click', prev);
    dots.forEach(function (d, k) { d.addEventListener('click', function () { index = k; setX(true); paint(); }); });

    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', play);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });

    viewport.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (startX !== null) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
      }
      startX = null; play();
    }, { passive: true });

    paint(); play();
  }

  /* ---------- 4. GIỎ HÀNG + YÊU THÍCH ---------- */
  var badge = $('#cartCount');
  var toast = $('#toast');
  var count = parseInt(badge ? badge.textContent : '0', 10) || 0;
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      count += 1;
      if (badge) {
        badge.textContent = count;
        badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
      }
      showToast('Đã thêm "' + add.dataset.name + '" vào giỏ hàng');
      return;
    }
    var wish = e.target.closest('[data-wish]');
    if (wish) {
      wish.setAttribute('aria-pressed', wish.getAttribute('aria-pressed') !== 'true');
    }
  });
})();
