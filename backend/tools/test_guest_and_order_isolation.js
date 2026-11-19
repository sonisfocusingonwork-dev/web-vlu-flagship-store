#!/usr/bin/env node
/**
 * CLI Acceptance Test Suite:
 * 1) Chặn auto-login Guest khi thanh toán / mua ngay -> chuyển hướng login.html?next=checkout.html (hoặc account.html)
 * 2) Đăng ký tài khoản mới lưu vào SQL/JSON, giữ nguyên & gộp giỏ hàng tạm vlu_cart_guest -> vlu_cart_${user.id}, đặt hàng thành công
 * 3) Cách ly 100% đơn hàng theo user_id thực (User 1 và User 2 không thấy đơn chéo nhau, Admin thấy đầy đủ)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../..');
const PHP_BIN = 'C:\\Project\\php\\php.exe';
const USERS_JSON_PATH = path.join(ROOT_DIR, 'backend', 'data', 'users.json');
const ORDERS_JSON_PATH = path.join(ROOT_DIR, 'backend', 'data', 'orders.json');

let passed = 0;
let failed = 0;

function assertTest(name, condition, details) {
  if (condition) {
    passed++;
    console.log(` [PASS] ${name}`);
  } else {
    failed++;
    console.error(` [FAIL] ${name}${details ? ' -> ' + details : ''}`);
  }
}

function callPhpApi(relativeScript, method, queryString, bodyObj) {
  const fullScript = path.join(ROOT_DIR, relativeScript);
  const phpRunner = [
    '$_SERVER["REQUEST_METHOD"] = $argv[1];',
    '$_SERVER["QUERY_STRING"] = $argv[2];',
    'if ($_SERVER["QUERY_STRING"] !== "") { parse_str($_SERVER["QUERY_STRING"], $_GET); }',
    'require $argv[3];'
  ].join(' ');

  const inputStr = bodyObj ? JSON.stringify(bodyObj) : '';
  const res = spawnSync(PHP_BIN, ['-r', phpRunner, method, queryString || '', fullScript], {
    cwd: ROOT_DIR,
    input: inputStr,
    encoding: 'utf8'
  });

  const rawOut = (res.stdout || '').trim();
  let parsed = null;
  try {
    parsed = JSON.parse(rawOut);
  } catch (e) {
    parsed = { parseError: true, rawOut, stderr: res.stderr };
  }
  return { status: res.status, parsed, rawOut, stderr: res.stderr };
}

function createStorageMock(initialData) {
  const store = Object.assign({}, initialData || {});
  const api = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(store, k) ? String(store[k]) : null;
    },
    setItem(k, v) {
      store[String(k)] = String(v);
    },
    removeItem(k) {
      delete store[String(k)];
    },
    clear() {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    key(i) {
      const keys = Object.keys(store);
      return i >= 0 && i < keys.length ? keys[i] : null;
    },
    get length() {
      return Object.keys(store).length;
    },
    _dump() {
      return Object.assign({}, store);
    }
  };
  return api;
}

function createElementStub(id, tagName) {
  const listeners = {};
  const attrs = {};
  const classes = new Set();
  const children = [];
  const el = {
    id: id || '',
    tagName: (tagName || 'DIV').toUpperCase(),
    value: '',
    checked: false,
    disabled: false,
    required: false,
    type: 'text',
    innerHTML: '',
    textContent: '',
    src: '',
    href: '',
    options: [],
    dataset: {},
    style: {
      setProperty() {}
    },
    classList: {
      add(...cls) { cls.forEach((c) => classes.add(c)); },
      remove(...cls) { cls.forEach((c) => classes.delete(c)); },
      toggle(c, force) {
        if (force === true) classes.add(c);
        else if (force === false) classes.delete(c);
        else if (classes.has(c)) classes.delete(c);
        else classes.add(c);
      },
      contains(c) { return classes.has(c); }
    },
    setAttribute(k, v) {
      attrs[k] = String(v);
      if (k === 'href') el.href = String(v);
      if (k === 'src') el.src = String(v);
    },
    getAttribute(k) {
      if (k === 'href') return attrs.href || el.href || null;
      return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null;
    },
    addEventListener(type, fn) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    dispatchEvent(evt) {
      const e = Object.assign({
        target: el,
        currentTarget: el,
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; },
        stopPropagation() {}
      }, evt || {});
      (listeners[e.type] || []).forEach((fn) => fn.call(el, e));
      return e;
    },
    click() {
      return el.dispatchEvent({ type: 'click' });
    },
    closest() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    appendChild(child) { children.push(child); return child; },
    replaceChildren() { children.length = 0; },
    contains() { return false; },
    focus() {},
    remove() {}
  };
  return el;
}

function createBrowserEnv({ url = 'http://localhost/index.html', localStorageData = {}, elements = {} }) {
  const localStorage = createStorageMock(localStorageData);
  const windowListeners = {};
  const documentListeners = {};
  const elementMap = Object.assign({}, elements);

  const locationObj = {
    href: url,
    search: url.includes('?') ? '?' + url.split('?')[1] : '',
    replace(nextUrl) {
      this.href = String(nextUrl);
      this.search = this.href.includes('?') ? '?' + this.href.split('?')[1] : '';
    },
    reload() {}
  };

  function getEl(id) {
    if (!elementMap[id]) {
      elementMap[id] = createElementStub(id);
    }
    return elementMap[id];
  }

  const documentObj = {
    readyState: 'complete',
    title: 'VLU FLAGSHIP STORE',
    body: createElementStub('body', 'BODY'),
    getElementById(id) {
      return Object.prototype.hasOwnProperty.call(elementMap, id) ? elementMap[id] : null;
    },
    querySelector(sel) {
      const mId = /^#([A-Za-z0-9_-]+)$/.exec(sel);
      if (mId) return documentObj.getElementById(mId[1]);
      if (sel === 'a[href^="register.html"]') return elementMap.__registerLink || null;
      if (sel === 'a[href^="login.html"]') return elementMap.__loginLink || null;
      return null;
    },
    querySelectorAll(sel) {
      if (sel === 'input[name="payment_method"]') return elementMap.__paymentRadios || [];
      if (sel === 'input[name="installment_term"]') return elementMap.__installmentRadios || [];
      if (sel === 'input[name="shipping_method"]') return elementMap.__shippingRadios || [];
      return [];
    },
    createElement(tag) {
      return createElementStub('', tag);
    },
    createElementNS(ns, tag) {
      return createElementStub('', tag);
    },
    createEvent() {
      return { initCustomEvent() {} };
    },
    addEventListener(type, fn) {
      if (!documentListeners[type]) documentListeners[type] = [];
      documentListeners[type].push(fn);
    },
    dispatchDocumentEvent(evt) {
      const e = Object.assign({
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; },
        stopPropagation() {}
      }, evt);
      (documentListeners[e.type] || []).forEach((fn) => fn.call(documentObj, e));
      return e;
    }
  };

  const sandbox = {
    window: null,
    document: documentObj,
    localStorage,
    location: locationObj,
    navigator: { userAgent: 'VLU-Node-CLI-Test' },
    URLSearchParams,
    URL,
    CustomEvent: function (name, opts) {
      return { type: name, detail: opts ? opts.detail : undefined };
    },
    alert(msg) { sandbox.__lastAlert = msg; },
    confirm() { return true; },
    setTimeout(fn, delay) {
      if (delay <= 500) {
        fn();
      }
      return 1;
    },
    clearTimeout() {},
    requestAnimationFrame(fn) { fn(); },
    console,
    fetch(endpoint, opts) {
      const cleanPath = String(endpoint).split('?')[0];
      const query = String(endpoint).includes('?') ? String(endpoint).split('?')[1] : '';
      const method = (opts && opts.method ? opts.method : 'GET').toUpperCase();
      const bodyObj = opts && opts.body ? JSON.parse(opts.body) : null;
      const apiRes = callPhpApi(cleanPath, method, query, bodyObj);
      return Promise.resolve({
        status: apiRes.parsed && apiRes.parsed.success === false ? 400 : 200,
        json() {
          return Promise.resolve(apiRes.parsed);
        }
      });
    },
    addEventListener(type, fn) {
      if (!windowListeners[type]) windowListeners[type] = [];
      windowListeners[type].push(fn);
    },
    dispatchEvent(evt) {
      (windowListeners[evt.type] || []).forEach((fn) => fn.call(sandbox, evt));
    },
    __getEl: getEl
  };
  sandbox.window = sandbox;

  const ctx = vm.createContext(sandbox);

  function loadJs(relPath) {
    const code = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
    vm.runInContext(code, ctx, { filename: relPath });
  }

  return { sandbox, ctx, loadJs, localStorage, locationObj, documentObj };
}

async function runTests() {
  const backupUsers = fs.existsSync(USERS_JSON_PATH) ? fs.readFileSync(USERS_JSON_PATH, 'utf8') : null;
  const backupOrders = fs.existsSync(ORDERS_JSON_PATH) ? fs.readFileSync(ORDERS_JSON_PATH, 'utf8') : null;

  try {
    console.log('====================================================================');
    console.log('   KIỂM THỬ NGHIỆM THU CLI: CHẶN GUEST AUTO-LOGIN & CÁCH LY ĐƠN HÀNG');
    console.log('====================================================================\n');

    // ------------------------------------------------------------------
    // KỊCH BẢN 1: Chưa đăng nhập bấm Thanh toán / Mua ngay bị chặn
    // ------------------------------------------------------------------
    console.log('--- KỊCH BẢN 1: CHẶN AUTO-LOGIN GUEST & CHUYỂN HƯỚNG LOGIN ---');

    // 1.1 Stale guest session bị tự động xóa khi tải auth-engine.js
    const staleEnv = createBrowserEnv({
      url: 'http://localhost/index.html',
      localStorageData: {
        vlu_user: JSON.stringify({ id: 'guest', username: 'guest', isGuest: true }),
        vlu_account_guest: JSON.stringify({ orders: [{ id: '#LEAK' }] }),
        vlu_orders_guest: JSON.stringify([{ id: '#LEAK' }])
      }
    });
    staleEnv.loadJs('frontend/assets/js/cart-engine.js');
    staleEnv.loadJs('frontend/assets/js/auth-engine.js');
    assertTest(
      'auth-engine.js tự động xóa phiên ảo guest cũ trong localStorage',
      staleEnv.localStorage.getItem('vlu_user') === null &&
      staleEnv.sandbox.VLU_AUTH.getUser() === null &&
      staleEnv.sandbox.VLU_AUTH.isLoggedIn() === false
    );

    const guestCallRes = staleEnv.sandbox.VLU_AUTH.ensureGuestSession({ fullname: 'Hack Guest' });
    assertTest(
      'ensureGuestSession() bị vô hiệu hóa hoàn toàn (không tạo vlu_user guest)',
      guestCallRes === null &&
      staleEnv.localStorage.getItem('vlu_user') === null &&
      staleEnv.localStorage.getItem('vlu_account_guest') === null
    );

    // 1.2 Guest thêm hàng vào giỏ tạm vlu_cart_guest và bấm Thanh toán (#checkoutBtn)
    const cartEnv = createBrowserEnv({
      url: 'http://localhost/cart.html',
      elements: {
        checkoutBtn: createElementStub('checkoutBtn', 'A'),
        cartItemsList: createElementStub('cartItemsList', 'DIV'),
        cartEmptyState: createElementStub('cartEmptyState', 'DIV'),
        cartMainContent: createElementStub('cartMainContent', 'DIV')
      }
    });
    cartEnv.loadJs('frontend/assets/js/cart-engine.js');
    cartEnv.loadJs('frontend/assets/js/auth-engine.js');
    cartEnv.sandbox.VLU_CART.addItem({
      id: 'iphone-18-pro-max',
      name: 'iPhone 18 Pro Max',
      category: 'dien-thoai',
      color: 'Titan Tự Nhiên',
      variant: '256GB',
      price: 34990000,
      quantity: 1
    });
    assertTest(
      'Guest thêm sản phẩm lưu vào giỏ tạm vlu_cart_guest',
      JSON.parse(cartEnv.localStorage.getItem('vlu_cart_guest') || '[]').length === 1 &&
      cartEnv.localStorage.getItem('vlu_user') === null
    );

    cartEnv.loadJs('frontend/assets/js/cart-page.js');
    const checkoutClickEvent = cartEnv.sandbox.__getEl('checkoutBtn').click();
    assertTest(
      'Guest bấm #checkoutBtn bị chặn (preventDefault), giữ giỏ tạm và chuyển sang login.html?next=checkout.html',
      checkoutClickEvent.defaultPrevented === true &&
      cartEnv.locationObj.href === 'login.html?next=checkout.html' &&
      cartEnv.localStorage.getItem('vlu_user') === null &&
      JSON.parse(cartEnv.localStorage.getItem('vlu_cart_guest') || '[]').length === 1
    );

    // 1.3 Guest bấm Mua ngay (#buyNowBtn) trên product-detail.js
    const buyBtnStub = createElementStub('buyNowBtn', 'BUTTON');
    const pdEnv = createBrowserEnv({
      url: 'http://localhost/product-detail.html?id=iphone-18-pro-max',
      elements: {
        buyNowBtn: buyBtnStub,
        mainProductImg: createElementStub('mainProductImg', 'IMG')
      }
    });
    pdEnv.sandbox.VLU_PRODUCTS = [{
      id: 'iphone-18-pro-max',
      name: 'iPhone 18 Pro Max',
      brand: 'Apple',
      category: 'dien-thoai',
      basePrice: 34990000,
      stock: 10,
      image: 'SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png',
      colors: [{ name: 'Bạc', key: 'bac', hex: '#e2e8f0', image: 'SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png' }],
      variants: [{ label: '256GB', delta: 0, stock: 10 }]
    }];
    pdEnv.sandbox.VLU_CATALOG = { 'iphone-18-pro-max': pdEnv.sandbox.VLU_PRODUCTS[0] };
    pdEnv.sandbox.VLU_FIND_PRODUCT = () => pdEnv.sandbox.VLU_PRODUCTS[0];
    pdEnv.loadJs('frontend/assets/js/cart-engine.js');
    pdEnv.loadJs('frontend/assets/js/auth-engine.js');
    pdEnv.loadJs('frontend/assets/js/product-detail.js');

    const buyClickEvt = pdEnv.documentObj.dispatchDocumentEvent({
      type: 'click',
      target: {
        closest(sel) {
          return sel.includes('#buyNowBtn') ? buyBtnStub : null;
        }
      }
    });
    assertTest(
      'Guest bấm #buyNowBtn lưu vào vlu_cart_guest, không login ảo và chuyển sang login.html?next=checkout.html',
      buyClickEvt.defaultPrevented === true &&
      pdEnv.locationObj.href === 'login.html?next=checkout.html' &&
      pdEnv.localStorage.getItem('vlu_user') === null &&
      JSON.parse(pdEnv.localStorage.getItem('vlu_cart_guest') || '[]').length === 1
    );

    // 1.4 Truy cập thẳng checkout.html và account.html khi chưa đăng nhập
    const directCheckoutEnv = createBrowserEnv({ url: 'http://localhost/checkout.html' });
    directCheckoutEnv.loadJs('frontend/assets/js/cart-engine.js');
    directCheckoutEnv.loadJs('frontend/assets/js/auth-engine.js');
    directCheckoutEnv.loadJs('frontend/assets/js/checkout-page.js');
    assertTest(
      'Truy cập thẳng checkout.html khi chưa đăng nhập tự chuyển hướng login.html?next=checkout.html',
      directCheckoutEnv.locationObj.href === 'login.html?next=checkout.html'
    );

    const directAccountEnv = createBrowserEnv({ url: 'http://localhost/account.html' });
    directAccountEnv.loadJs('frontend/assets/js/cart-engine.js');
    directAccountEnv.loadJs('frontend/assets/js/auth-engine.js');
    directAccountEnv.loadJs('frontend/assets/js/account-page.js');
    assertTest(
      'Truy cập thẳng account.html khi chưa đăng nhập tự chuyển hướng login.html?next=account.html',
      directAccountEnv.locationObj.href === 'login.html?next=account.html'
    );

    // 1.5 API orders.php từ chối tạo đơn Guest / thiếu user_id và không trả đơn khi thiếu user_id
    const guestCreateApi = callPhpApi('backend/api/orders.php', 'POST', '', {
      action: 'create',
      order: {
        user_id: 'guest',
        customer_name: 'Khách Vãng Lai',
        customer_phone: '0912345678',
        customer_address: '123 Lê Lợi',
        total: 1000000
      }
    });
    assertTest(
      'API orders.php từ chối tạo đơn khi user_id === "guest"',
      guestCreateApi.parsed && guestCreateApi.parsed.success === false && guestCreateApi.parsed.code === 'AUTH_REQUIRED'
    );

    const ghostCreateApi = callPhpApi('backend/api/orders.php', 'POST', '', {
      action: 'create',
      order: {
        user_id: 999999,
        customer_name: 'Fake User',
        customer_phone: '0912345678',
        customer_address: '123 Lê Lợi',
        total: 1000000
      }
    });
    assertTest(
      'API orders.php từ chối tạo đơn khi user_id không tồn tại trong SQL/JSON',
      ghostCreateApi.parsed && ghostCreateApi.parsed.success === false && ghostCreateApi.parsed.code === 'USER_NOT_FOUND_IN_SQL'
    );

    const guestListApi = callPhpApi('backend/api/orders.php', 'GET', 'action=list&user_id=guest', null);
    const emptyListApi = callPhpApi('backend/api/orders.php', 'GET', 'action=list', null);
    assertTest(
      'API orders.php không trả bất kỳ đơn nào cho user_id=guest hoặc khi thiếu user_id',
      guestListApi.parsed && Array.isArray(guestListApi.parsed.orders) && guestListApi.parsed.orders.length === 0 &&
      emptyListApi.parsed && Array.isArray(emptyListApi.parsed.orders) && emptyListApi.parsed.orders.length === 0
    );

    // ------------------------------------------------------------------
    // KỊCH BẢN 2: Đăng ký tài khoản mới -> lưu SQL/JSON -> kế thừa giỏ tạm -> đặt hàng thành công
    // ------------------------------------------------------------------
    console.log('\n--- KỊCH BẢN 2: ĐĂNG KÝ TÀI KHOẢN SQL, GỘP GIỎ HÀNG TẠM & ĐẶT HÀNG ---');

    const regFormEl = createElementStub('registerForm', 'FORM');
    const regFullnameEl = createElementStub('regFullname', 'INPUT');
    const regPhoneEl = createElementStub('regPhone', 'INPUT');
    const regEmailEl = createElementStub('regEmail', 'INPUT');
    const regPwEl = createElementStub('regPassword', 'INPUT');
    const regCpwEl = createElementStub('regConfirmPassword', 'INPUT');
    const regTermsEl = createElementStub('regTerms', 'INPUT');
    const loginLinkEl = createElementStub('loginLink', 'A');

    const regEmail1 = 'cli_user1_' + Date.now() + '@vlu.edu.vn';
    regFullnameEl.value = 'Nguyễn Văn Một';
    regPhoneEl.value = '0912345671';
    regEmailEl.value = regEmail1;
    regPwEl.value = 'Pass1234!';
    regCpwEl.value = 'Pass1234!';
    regTermsEl.checked = true;

    const regEnv = createBrowserEnv({
      url: 'http://localhost/register.html?next=checkout.html',
      localStorageData: {
        vlu_cart_guest: JSON.stringify([
          {
            id: 'iphone-18-pro-max',
            name: 'iPhone 18 Pro Max',
            category: 'dien-thoai',
            color: 'Bạc',
            variant: '256GB',
            price: 34990000,
            quantity: 2
          }
        ])
      },
      elements: {
        registerForm: regFormEl,
        regFullname: regFullnameEl,
        regPhone: regPhoneEl,
        regEmail: regEmailEl,
        regPassword: regPwEl,
        regConfirmPassword: regCpwEl,
        regTerms: regTermsEl,
        btnRegisterSubmit: createElementStub('btnRegisterSubmit', 'BUTTON'),
        registerErrorMsg: createElementStub('registerErrorMsg', 'DIV'),
        __loginLink: loginLinkEl
      }
    });
    regEnv.loadJs('frontend/assets/js/cart-engine.js');
    regEnv.loadJs('frontend/assets/js/auth-engine.js');
    regEnv.loadJs('frontend/assets/js/register-page.js');

    assertTest(
      'register.html truyền tiếp ?next=checkout.html sang link Đăng nhập',
      loginLinkEl.getAttribute('href') === 'login.html?next=checkout.html'
    );

    regFormEl.dispatchEvent({ type: 'submit' });
    await new Promise((r) => setTimeout(r, 150));

    const user1 = regEnv.sandbox.VLU_AUTH.getUser();
    const usersAfterReg = callPhpApi('backend/api/auth.php', 'GET', 'action=users', null);
    const user1InBackend = usersAfterReg.parsed && Array.isArray(usersAfterReg.parsed.users)
      ? usersAfterReg.parsed.users.find((u) => u.email === regEmail1)
      : null;

    assertTest(
      'Đăng ký tài khoản mới lưu thực tế vào SQL/JSON với id > 0',
      Boolean(user1 && Number(user1.id) > 0 && user1InBackend && Number(user1InBackend.id) === Number(user1.id))
    );

    const user1CartAfterReg = JSON.parse(regEnv.localStorage.getItem('vlu_cart_' + user1.id) || '[]');
    assertTest(
      'Gộp giỏ hàng tạm vlu_cart_guest sang vlu_cart_${user.id}, xóa vlu_cart_guest và chuyển về checkout.html',
      user1CartAfterReg.length === 1 &&
      user1CartAfterReg[0].quantity === 2 &&
      regEnv.localStorage.getItem('vlu_cart_guest') === null &&
      regEnv.locationObj.href === 'checkout.html'
    );

    // Tiến hành đặt hàng trên checkout-page.js với tài khoản user1
    const checkoutFormEl = createElementStub('checkoutForm', 'FORM');
    const cFullnameEl = createElementStub('checkoutFullname', 'INPUT');
    const cPhoneEl = createElementStub('checkoutPhone', 'INPUT');
    const cEmailEl = createElementStub('checkoutEmail', 'INPUT');
    const cCityEl = createElementStub('checkoutCity', 'SELECT');
    const cDistrictEl = createElementStub('checkoutDistrict', 'INPUT');
    const cAddressEl = createElementStub('checkoutAddress', 'INPUT');
    cCityEl.value = 'TP. Hồ Chí Minh';
    cDistrictEl.value = 'Bình Thạnh';
    cAddressEl.value = '69/68 Đặng Thùy Trâm';

    const coEnv1 = createBrowserEnv({
      url: 'http://localhost/checkout.html',
      localStorageData: regEnv.localStorage._dump(),
      elements: {
        checkoutForm: checkoutFormEl,
        checkoutFullname: cFullnameEl,
        checkoutPhone: cPhoneEl,
        checkoutEmail: cEmailEl,
        checkoutCity: cCityEl,
        checkoutDistrict: cDistrictEl,
        checkoutAddress: cAddressEl,
        checkoutItemsList: createElementStub('checkoutItemsList', 'DIV'),
        checkoutSubtotal: createElementStub('checkoutSubtotal', 'SPAN'),
        checkoutTotal: createElementStub('checkoutTotal', 'SPAN'),
        checkoutDiscountRow: createElementStub('checkoutDiscountRow', 'DIV'),
        checkoutCountBadge: createElementStub('checkoutCountBadge', 'SPAN'),
        btnSubmitOrder: createElementStub('btnSubmitOrder', 'BUTTON'),
        orderSuccessModal: createElementStub('orderSuccessModal', 'DIV'),
        successOrderId: createElementStub('successOrderId', 'SPAN'),
        __paymentRadios: [{ value: 'cod', checked: true, addEventListener() {} }],
        __shippingRadios: [{ value: 'delivery', checked: true, addEventListener() {} }],
        __installmentRadios: []
      }
    });
    coEnv1.loadJs('frontend/assets/js/cart-engine.js');
    coEnv1.loadJs('frontend/assets/js/auth-engine.js');
    coEnv1.loadJs('frontend/assets/js/checkout-page.js');

    checkoutFormEl.dispatchEvent({ type: 'submit' });
    await new Promise((r) => setTimeout(r, 150));

    const order1Id = coEnv1.sandbox.__getEl('successOrderId').textContent;
    const u1LocalOrders = JSON.parse(coEnv1.localStorage.getItem('vlu_orders_' + user1.id) || '[]');
    const u1AccountData = JSON.parse(coEnv1.localStorage.getItem('vlu_account_' + user1.id) || '{}');
    assertTest(
      'User 1 đặt hàng thành công: lưu vlu_orders_${user.id}, vlu_account_${user.id}, xóa giỏ hàng và giữ nguyên vlu_user',
      order1Id.startsWith('#VLU-2026-') &&
      u1LocalOrders.length === 1 &&
      u1LocalOrders[0].user_id === user1.id &&
      Array.isArray(u1AccountData.orders) && u1AccountData.orders.length === 1 &&
      coEnv1.localStorage.getItem('vlu_cart_' + user1.id) === null &&
      coEnv1.localStorage.getItem('vlu_orders_guest') === null &&
      coEnv1.localStorage.getItem('vlu_account_guest') === null &&
      coEnv1.sandbox.VLU_AUTH.getUser().id === user1.id
    );

    // ------------------------------------------------------------------
    // KỊCH BẢN 3: User 1 và User 2 đặt 2 đơn khác nhau -> 0% tham chiếu chéo, Admin thấy đủ
    // ------------------------------------------------------------------
    console.log('\n--- KỊCH BẢN 3: CÁCH LY 100% ĐƠN HÀNG USER 1 vs USER 2 & ADMIN ---');

    const regEmail2 = 'cli_user2_' + Date.now() + '@vlu.edu.vn';
    const regUser2Res = callPhpApi('backend/api/auth.php', 'POST', '', {
      action: 'register',
      fullname: 'Trần Thị Hai',
      phone: '0912345672',
      email: regEmail2,
      password: 'Pass1234!'
    });
    const user2 = regUser2Res.parsed && regUser2Res.parsed.user;
    assertTest(
      'Đăng ký User 2 thành công với id riêng biệt khác User 1',
      Boolean(user2 && Number(user2.id) > 0 && Number(user2.id) !== Number(user1.id))
    );

    const order2Code = '#VLU-2026-U2-' + Date.now();
    const order2Res = callPhpApi('backend/api/orders.php', 'POST', '', {
      action: 'create',
      order: {
        id: order2Code,
        order_code: order2Code,
        user_id: user2.id,
        db_user_id: user2.id,
        user_identity: user2.username,
        customer_name: 'Trần Thị Hai',
        customer_phone: '0912345672',
        customer_email: regEmail2,
        customer_address: '45 Nguyễn Văn Đậu, Bình Thạnh, TP.HCM',
        shipping_method: 'home',
        payment_method: 'COD',
        subtotal: 25000000,
        discount: 0,
        total: 25000000,
        items: [{ id: 'macbook-air-m4', name: 'MacBook Air M4', price: 25000000, quantity: 1 }]
      }
    });
    assertTest(
      'User 2 tạo đơn hàng #2 qua backend/api/orders.php thành công',
      order2Res.parsed && order2Res.parsed.success === true
    );

    // Kiểm tra Backend Isolation
    const listU1 = callPhpApi('backend/api/orders.php', 'GET', `action=list&user_id=${user1.id}`, null);
    const listU2 = callPhpApi('backend/api/orders.php', 'GET', `action=list&user_id=${user2.id}`, null);
    const listAdmin = callPhpApi('backend/api/orders.php', 'GET', 'action=list&is_admin=1', null);

    const u1Codes = (listU1.parsed.orders || []).map((o) => o.order_code);
    const u2Codes = (listU2.parsed.orders || []).map((o) => o.order_code);
    const adminCodes = (listAdmin.parsed.orders || []).map((o) => o.order_code);

    assertTest(
      'Backend API: User 1 chỉ thấy đúng đơn của User 1 (0% lộ đơn User 2)',
      u1Codes.includes(order1Id) && !u1Codes.includes(order2Code) && u1Codes.length === 1
    );
    assertTest(
      'Backend API: User 2 chỉ thấy đúng đơn của User 2 (0% lộ đơn User 1)',
      u2Codes.includes(order2Code) && !u2Codes.includes(order1Id) && u2Codes.length === 1
    );
    assertTest(
      'Backend API: Admin (is_admin=1) thấy đầy đủ cả 2 đơn hàng của User 1 và User 2',
      adminCodes.includes(order1Id) && adminCodes.includes(order2Code)
    );

    // Kiểm tra Frontend Isolation trên account-page.js (kể cả khi localStorage.vlu_orders bị trộn chung đơn User 1, User 2 và đơn guest rác)
    const mixedLocalOrders = [
      u1LocalOrders[0],
      {
        id: order2Code,
        order_code: order2Code,
        user_id: user2.id,
        db_user_id: user2.id,
        user_identity: user2.username,
        customer_name: 'Trần Thị Hai',
        total: 25000000,
        status: 'pending',
        created_at: new Date().toISOString(),
        items: [{ id: 'macbook-air-m4', name: 'MacBook Air M4', price: 25000000, quantity: 1 }]
      },
      {
        id: '#GUEST-LEAK-999',
        order_code: '#GUEST-LEAK-999',
        user_id: 'guest',
        user_identity: 'guest',
        customer_name: 'Guest Leak',
        total: 1000000,
        status: 'pending',
        created_at: new Date().toISOString(),
        items: []
      }
    ];

    function mountAccountFor(userObj) {
      const accElements = {
        accountNav: createElementStub('accountNav', 'NAV'),
        sidebarName: createElementStub('sidebarName', 'DIV'),
        sidebarEmail: createElementStub('sidebarEmail', 'DIV'),
        sidebarAvatar: createElementStub('sidebarAvatar', 'DIV'),
        accountCartCount: createElementStub('accountCartCount', 'SPAN'),
        pageTitle: createElementStub('pageTitle', 'H1'),
        pageSubtitle: createElementStub('pageSubtitle', 'P'),
        accountPanel: createElementStub('accountPanel', 'DIV'),
        accountSidebar: createElementStub('accountSidebar', 'ASIDE'),
        mobileNavToggle: createElementStub('mobileNavToggle', 'BUTTON')
      };
      const env = createBrowserEnv({
        url: 'http://localhost/account.html?tab=orders',
        localStorageData: {
          vlu_user: JSON.stringify(userObj),
          vlu_orders: JSON.stringify(mixedLocalOrders)
        },
        elements: accElements
      });
      env.loadJs('frontend/assets/js/cart-engine.js');
      env.loadJs('frontend/assets/js/auth-engine.js');
      env.loadJs('frontend/assets/js/account-page.js');
      return env;
    }

    const accEnv1 = mountAccountFor(user1);
    await new Promise((r) => setTimeout(r, 150));
    const accPanel1Html = accEnv1.sandbox.__getEl('accountPanel').innerHTML;

    const accEnv2 = mountAccountFor(user2);
    await new Promise((r) => setTimeout(r, 150));
    const accPanel2Html = accEnv2.sandbox.__getEl('accountPanel').innerHTML;

    assertTest(
      'account-page.js User 1 chỉ hiển thị đơn của User 1 (chặn đơn User 2 & guest)',
      accPanel1Html.includes(order1Id) &&
      !accPanel1Html.includes(order2Code) &&
      !accPanel1Html.includes('#GUEST-LEAK-999')
    );
    assertTest(
      'account-page.js User 2 chỉ hiển thị đơn của User 2 (chặn đơn User 1 & guest)',
      accPanel2Html.includes(order2Code) &&
      !accPanel2Html.includes(order1Id) &&
      !accPanel2Html.includes('#GUEST-LEAK-999')
    );

    // Kiểm tra logout() xóa vlu_user và toàn bộ khóa *_guest
    accEnv1.localStorage.setItem('vlu_cart_guest', '[{"id":"x"}]');
    accEnv1.localStorage.setItem('vlu_orders_guest', '[{"id":"y"}]');
    accEnv1.localStorage.setItem('vlu_account_guest', '{}');
    accEnv1.sandbox.VLU_AUTH.logout();
    assertTest(
      'AuthEngine.logout() xóa vlu_user và dọn sạch các khóa tạm *_guest',
      accEnv1.localStorage.getItem('vlu_user') === null &&
      accEnv1.localStorage.getItem('vlu_cart_guest') === null &&
      accEnv1.localStorage.getItem('vlu_orders_guest') === null &&
      accEnv1.localStorage.getItem('vlu_account_guest') === null
    );

    console.log('\n====================================================================');
    console.log(`   KẾT QUẢ KIỂM THỬ CLI: ${passed} PASS / ${passed + failed} TESTS`);
    console.log('====================================================================');
    return failed === 0 ? 0 : 1;
  } finally {
    if (backupUsers !== null) fs.writeFileSync(USERS_JSON_PATH, backupUsers, 'utf8');
    if (backupOrders !== null) fs.writeFileSync(ORDERS_JSON_PATH, backupOrders, 'utf8');
  }
}

runTests().then((code) => process.exit(code)).catch((err) => {
  console.error(err);
  process.exit(1);
});
