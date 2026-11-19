#!/usr/bin/env node
/**
 * CLI Acceptance Test Suite:
 * Kiểm chứng toàn diện 4 hạng mục đồng bộ & hiển thị Trạng thái đơn hàng giữa Admin và Account:
 * 1) Admin cập nhật trạng thái đơn #VLU-2026-28506 sang handed_over / shipping / cancelled qua backend/api/orders.php
 *    (kể cả chế độ Incognito không dùng chung localStorage) -> account-page.js ưu tiên tiến trình cao hơn + updated_at mới hơn
 *    và ghi đè ngược vào vlu_account_${userId}, vlu_orders_${userId}.
 * 2) Chuẩn hóa mã đơn hàng normalizeOrderKey & formatOrderCode: khớp 100% giữa #VLU-..., ##VLU-..., VLU-... và xóa triệt để lỗi hiển thị kép ##VLU-...
 * 3) Ánh xạ đầy đủ 6 bước trạng thái + cancelled kèm lý do hủy; Timeline 6 bước sáng đúng mốc 1..k-1 (✓ xanh + đường nối xanh), mốc k (active),
 *    bố cục 1 hàng ngang duy nhất (repeat(6, ...)) trong account.css.
 * 4) Đồng bộ nhanh ngay khi mở Modal Chi tiết đơn hàng.
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
  return {
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
}

function createElementStub(id, tagName, registry) {
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
    innerHTML: '',
    textContent: '',
    dataset: {},
    style: { setProperty() {} },
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
    setAttribute(k, v) { attrs[k] = String(v); },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null; },
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
    closest() { return null; },
    querySelector() { return { focus() {} }; },
    querySelectorAll() { return []; },
    appendChild(child) {
      children.push(child);
      if (child && child.id && registry) {
        registry[child.id] = child;
      }
      return child;
    },
    remove() {
      if (el.id && registry && registry[el.id] === el) {
        delete registry[el.id];
      }
    },
    focus() {}
  };
  return el;
}

function createBrowserEnv({ url = 'http://localhost/account.html?tab=orders', localStorageData = {}, elementIds = [] }) {
  const localStorage = createStorageMock(localStorageData);
  const windowListeners = {};
  const documentListeners = {};
  const elementMap = {};

  elementIds.forEach((id) => {
    elementMap[id] = createElementStub(id, 'DIV', elementMap);
  });

  const bodyEl = createElementStub('body', 'BODY', elementMap);
  const locationObj = {
    href: url,
    search: url.includes('?') ? '?' + url.split('?')[1] : '',
    hash: url.includes('#') ? '#' + url.split('#')[1] : '',
    replace(nextUrl) {
      this.href = String(nextUrl);
      this.search = this.href.includes('?') ? '?' + this.href.split('?')[1] : '';
    },
    reload() {}
  };

  const documentObj = {
    readyState: 'complete',
    hidden: false,
    title: 'VLU FLAGSHIP STORE',
    documentElement: createElementStub('html', 'HTML', elementMap),
    body: bodyEl,
    getElementById(id) {
      return Object.prototype.hasOwnProperty.call(elementMap, id) ? elementMap[id] : null;
    },
    querySelector(sel) {
      const mId = /^#([A-Za-z0-9_-]+)$/.exec(sel);
      if (mId) return documentObj.getElementById(mId[1]);
      return null;
    },
    querySelectorAll() { return []; },
    createElement(tag) {
      return createElementStub('', tag, elementMap);
    },
    createEvent() {
      return { initCustomEvent() {} };
    },
    addEventListener(type, fn) {
      if (!documentListeners[type]) documentListeners[type] = [];
      documentListeners[type].push(fn);
    }
  };

  const pendingPromises = [];
  const fetchLogs = [];

  const sandbox = {
    window: null,
    document: documentObj,
    localStorage,
    sessionStorage: createStorageMock({}),
    location: locationObj,
    history: { replaceState() {} },
    navigator: { userAgent: 'VLU-Node-CLI-Test' },
    URLSearchParams,
    URL,
    CustomEvent: function (name, opts) {
      return { type: name, detail: opts ? opts.detail : undefined };
    },
    alert() {},
    confirm() { return true; },
    setTimeout(fn, delay) {
      if (delay <= 500) fn();
      return 1;
    },
    clearTimeout() {},
    requestAnimationFrame(fn) { fn(); },
    console,
    fetch(endpoint, opts) {
      fetchLogs.push({ endpoint, method: (opts && opts.method) || 'GET' });
      const cleanPath = String(endpoint).split('?')[0];
      const query = String(endpoint).includes('?') ? String(endpoint).split('?')[1] : '';
      const method = (opts && opts.method ? opts.method : 'GET').toUpperCase();
      const bodyObj = opts && opts.body ? JSON.parse(opts.body) : null;
      const apiRes = callPhpApi(cleanPath, method, query, bodyObj);
      const p = Promise.resolve({
        status: apiRes.parsed && apiRes.parsed.success === false ? 400 : 200,
        json() { return Promise.resolve(apiRes.parsed); }
      });
      pendingPromises.push(p);
      return p;
    },
    addEventListener(type, fn) {
      if (!windowListeners[type]) windowListeners[type] = [];
      windowListeners[type].push(fn);
    },
    dispatchEvent(evt) {
      (windowListeners[evt.type] || []).forEach((fn) => fn.call(sandbox, evt));
    }
  };
  sandbox.window = sandbox;

  const ctx = vm.createContext(sandbox);
  function loadJs(relPath) {
    const code = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
    vm.runInContext(code, ctx, { filename: relPath });
  }

  async function flushMicrotasks() {
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }
  }

  return { sandbox, ctx, loadJs, localStorage, documentObj, elementMap, fetchLogs, flushMicrotasks };
}

function parseTimelineSteps(modalHtml) {
  const steps = [];
  const regex = /<li\s+class="([^"]*)"\s+data-step-key="([^"]*)"\s+data-step-index="(\d+)">([\s\S]*?)<\/li>/g;
  let match;
  while ((match = regex.exec(modalHtml)) !== null) {
    const cls = match[1];
    const key = match[2];
    const index = Number(match[3]);
    const body = match[4];
    const labelMatch = /<span class="account-timeline-label">([\s\S]*?)<\/span>/.exec(body);
    steps.push({
      index,
      key,
      classes: cls.split(/\s+/),
      isComplete: cls.includes('is-complete'),
      isActive: cls.includes('is-active'),
      isUpcoming: cls.includes('is-upcoming'),
      hasCheckmark: body.includes('✓'),
      hasActiveCore: body.includes('account-timeline-dot-core'),
      label: labelMatch ? labelMatch[1] : ''
    });
  }
  return steps;
}

async function runTests() {
  const backupUsers = fs.existsSync(USERS_JSON_PATH) ? fs.readFileSync(USERS_JSON_PATH, 'utf8') : null;
  const backupOrders = fs.existsSync(ORDERS_JSON_PATH) ? fs.readFileSync(ORDERS_JSON_PATH, 'utf8') : null;

  try {
    console.log('====================================================================');
    console.log('   KIỂM THỬ CLI: ĐỒNG BỘ TRẠNG THÁI ĐƠN HÀNG & TIMELINE 6 BƯỚC');
    console.log('====================================================================\n');

    // Lấy tài khoản khách hàng thực từ users.json (user_id = 5)
    const users = JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf8'));
    const customer = users.find((u) => Number(u.role) === 0 && Number(u.id) > 0);
    assertTest('Tìm thấy tài khoản khách hàng hợp lệ trong SQL/JSON', Boolean(customer), JSON.stringify(customer));

    const TARGET_CODE = '#VLU-2026-28506';

    // ------------------------------------------------------------------
    // PHẦN 1: TẠO ĐƠN #VLU-2026-28506 & KIỂM TRA CHUẨN HÓA MÃ ĐƠN TRÊN BACKEND
    // ------------------------------------------------------------------
    console.log('--- PHẦN 1: CHUẨN HÓA MÃ ĐƠN HÀNG & CẬP NHẬT TRẠNG THÁI BACKEND ---');

    const createRes = callPhpApi('backend/api/orders.php', 'POST', '', {
      action: 'create',
      order: {
        id: '##VLU-2026-28506',
        order_code: '##VLU-2026-28506',
        user_id: customer.id,
        db_user_id: customer.id,
        user_identity: customer.username,
        customer_name: customer.fullname || 'Nguyễn Thành Tâm',
        customer_phone: '0987654321',
        customer_email: customer.email || '',
        customer_address: '69/68 Đặng Thùy Trâm, Bình Thạnh, TP.HCM',
        shipping_method: 'home',
        payment_method: 'Thanh toán khi nhận hàng (COD)',
        payment_key: 'cod',
        subtotal: 34990000,
        discount: 0,
        total: 34990000,
        status: 'pending',
        items: [
          {
            id: 'iphone-18-pro-max',
            name: 'iPhone 18 Pro Max',
            color: 'Bạc',
            variant: '256GB',
            price: 34990000,
            quantity: 1,
            image: 'SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png'
          }
        ]
      }
    });

    assertTest(
      'orders.php tạo đơn ##VLU-2026-28506 tự động chuẩn hóa còn đúng 1 dấu # (#VLU-2026-28506)',
      createRes.parsed && createRes.parsed.success === true && createRes.parsed.order_code === TARGET_CODE,
      JSON.stringify(createRes.parsed)
    );

    // Cập nhật bằng mã không có dấu # -> confirmed
    const updBare = callPhpApi('backend/api/orders.php', 'POST', '', {
      action: 'update_status',
      order_id: 'VLU-2026-28506',
      status: 'confirmed',
      payment_status: 'pending'
    });
    assertTest(
      'orders.php update_status tìm khớp mã không có dấu # ("VLU-2026-28506") -> confirmed',
      updBare.parsed && updBare.parsed.success && updBare.parsed.updated === true && updBare.parsed.status === 'confirmed' && updBare.parsed.order_code === TARGET_CODE,
      JSON.stringify(updBare.parsed)
    );

    // Cập nhật bằng mã 2 dấu # -> preparing
    const updDouble = callPhpApi('backend/api/orders.php', 'POST', '', {
      action: 'update_status',
      order_id: '##VLU-2026-28506',
      status: 'preparing'
    });
    assertTest(
      'orders.php update_status tìm khớp mã 2 dấu # ("##VLU-2026-28506") -> preparing',
      updDouble.parsed && updDouble.parsed.success && updDouble.parsed.updated === true && updDouble.parsed.status === 'preparing',
      JSON.stringify(updDouble.parsed)
    );

    // ------------------------------------------------------------------
    // PHẦN 2: ADMIN (INCOGNITO) ĐỔI TRẠNG THÁI SANG handed_over QUA admin-engine.js + orders.php
    // ------------------------------------------------------------------
    console.log('\n--- PHẦN 2: ADMIN (INCOGNITO) CHUYỂN ĐƠN SANG handed_over ---');

    const adminIncognitoEnv = createBrowserEnv({
      url: 'http://localhost/admin.html',
      localStorageData: {
        vlu_user: JSON.stringify({ id: 1, username: 'admin', email: 'admin@vluflagship.vn', fullname: 'Quản trị viên VLU', role: 1 })
      }
    });
    adminIncognitoEnv.loadJs('frontend/assets/js/admin-engine.js');
    await adminIncognitoEnv.flushMicrotasks();

    const adminEngine = adminIncognitoEnv.sandbox.VLU_ADMIN;
    assertTest(
      'admin-engine.js normalizeOrderKey/formatOrderCode chuẩn hóa chính xác #, ## và không có #',
      adminEngine.normalizeOrderKey('##VLU-2026-28506') === 'VLU-2026-28506' &&
      adminEngine.normalizeOrderKey('#VLU-2026-28506') === 'VLU-2026-28506' &&
      adminEngine.normalizeOrderKey('vlu-2026-28506') === 'VLU-2026-28506' &&
      adminEngine.formatOrderCode('##VLU-2026-28506') === TARGET_CODE &&
      adminEngine.formatOrderCode('VLU-2026-28506') === TARGET_CODE,
      adminEngine.formatOrderCode('##VLU-2026-28506')
    );

    const advHandedOver = adminEngine.tryUpdateOrderStatus('VLU-2026-28506', 'handed_over', { note: 'Đã bàn giao GHN Express' });
    await adminIncognitoEnv.flushMicrotasks();
    assertTest(
      'Admin chuyển trạng thái #VLU-2026-28506 sang handed_over thành công',
      advHandedOver && advHandedOver.ok === true && advHandedOver.order.status === 'handed_over',
      JSON.stringify(advHandedOver)
    );

    const serverAfterHanded = callPhpApi('backend/api/orders.php', 'GET', `action=list&order_code=VLU-2026-28506`, null);
    const srvOrderHanded = serverAfterHanded.parsed && serverAfterHanded.parsed.orders && serverAfterHanded.parsed.orders[0];
    assertTest(
      'Backend orders.php lưu rõ status=handed_over, payment_status, status_history, updated_at',
      Boolean(srvOrderHanded) &&
      srvOrderHanded.order_code === TARGET_CODE &&
      srvOrderHanded.status === 'handed_over' &&
      Boolean(srvOrderHanded.updated_at) &&
      Array.isArray(srvOrderHanded.status_history) &&
      srvOrderHanded.status_history.some((ev) => ev.status === 'handed_over'),
      JSON.stringify(srvOrderHanded)
    );

    // ------------------------------------------------------------------
    // PHẦN 3: ACCOUNT PAGE ĐANG GIỮ LOCALSTORAGE CŨ (pending + ##VLU-...) -> PHẢI ĐỒNG BỘ SANG handed_over
    // ------------------------------------------------------------------
    console.log('\n--- PHẦN 3: ACCOUNT.HTML ĐỒNG BỘ VƯỢT LOCALSTORAGE CŨ & TIMELINE 6 BƯỚC ---');

    const staleLocalOrder = {
      id: '##VLU-2026-28506',
      order_code: '##VLU-2026-28506',
      user_id: String(customer.id),
      db_user_id: Number(customer.id),
      user_identity: customer.username,
      customer_name: customer.fullname || 'Nguyễn Thành Tâm',
      customer_phone: '0987654321',
      customer_address: '69/68 Đặng Thùy Trâm, Bình Thạnh, TP.HCM',
      shipping_method: 'home',
      payment_method: 'Thanh toán khi nhận hàng (COD)',
      total: 34990000,
      status: 'pending',
      created_at: '2026-11-12T10:00:00.000Z',
      updated_at: '2026-11-12T10:00:00.000Z',
      items: [{ id: 'iphone-18-pro-max', name: 'iPhone 18 Pro Max', color: 'Bạc', variant: '256GB', price: 34990000, quantity: 1 }]
    };

    const accountEnv = createBrowserEnv({
      url: 'http://localhost/account.html?tab=orders',
      localStorageData: {
        vlu_user: JSON.stringify({
          id: customer.id,
          username: customer.username,
          email: customer.email,
          fullname: customer.fullname,
          role: 0
        }),
        [`vlu_account_${customer.id}`]: JSON.stringify({ orders: [staleLocalOrder] }),
        [`vlu_orders_${customer.id}`]: JSON.stringify([Object.assign({}, staleLocalOrder, { id: 'VLU-2026-28506', order_code: 'VLU-2026-28506' })]),
        vlu_orders: JSON.stringify([Object.assign({}, staleLocalOrder, { id: TARGET_CODE, order_code: TARGET_CODE })])
      },
      elementIds: [
        'accountNav', 'sidebarName', 'sidebarEmail', 'sidebarAvatar',
        'accountCartCount', 'pageTitle', 'pageSubtitle', 'accountPanel',
        'accountSidebar', 'mobileNavToggle', 'accountNotice', 'toast'
      ]
    });

    accountEnv.loadJs('frontend/assets/js/account-page.js');
    await accountEnv.flushMicrotasks();

    const accSync = accountEnv.sandbox.VLU_ACCOUNT_SYNC;
    const syncedOrders = accSync.getOrders();
    const accOrder = syncedOrders.find((o) => accSync.normalizeOrderKey(o.order_code || o.id) === 'VLU-2026-28506');

    assertTest(
      'account-page.js tự động nhận trạng thái handed_over từ orders.php (không bị localStorage pending ghi đè)',
      Boolean(accOrder) && accOrder.status === 'handed_over' && accOrder.id === TARGET_CODE && accOrder.order_code === TARGET_CODE,
      JSON.stringify(accOrder)
    );

    // Kiểm tra ghi đè ngược vào vlu_account_${userId} và vlu_orders_${userId}
    const persistedAccount = JSON.parse(accountEnv.localStorage.getItem(`vlu_account_${customer.id}`) || '{}');
    const persistedUserOrders = JSON.parse(accountEnv.localStorage.getItem(`vlu_orders_${customer.id}`) || '[]');
    assertTest(
      'Trạng thái mới handed_over đã được ghi đè ngược lại vào vlu_account_${userId} và vlu_orders_${userId}',
      persistedAccount.orders && persistedAccount.orders[0] && persistedAccount.orders[0].status === 'handed_over' &&
      persistedUserOrders[0] && persistedUserOrders[0].status === 'handed_over',
      `acc=${persistedAccount.orders && persistedAccount.orders[0] && persistedAccount.orders[0].status}, uOrders=${persistedUserOrders[0] && persistedUserOrders[0].status}`
    );

    const panelHtml = accountEnv.elementMap.accountPanel.innerHTML;
    assertTest(
      'Giao diện danh sách đơn hàng account.html hiển thị chuẩn #VLU-2026-28506 (0 lỗi ##VLU-...) và đúng nhãn Đã bàn giao vận chuyển',
      panelHtml.includes(TARGET_CODE) && !panelHtml.includes('##VLU-') && panelHtml.includes('Đã bàn giao vận chuyển'),
      panelHtml.slice(0, 400)
    );

    // Mở Modal Chi tiết đơn hàng tại mốc handed_over (bước 4/6)
    accSync.openOrderModal('##VLU-2026-28506');
    await accountEnv.flushMicrotasks();

    const modalEl = accountEnv.documentObj.getElementById('accountOrderModal');
    const modalHtmlHanded = modalEl ? modalEl.innerHTML : '';
    const stepsHanded = parseTimelineSteps(modalHtmlHanded);

    assertTest(
      'Modal Chi tiết đơn hàng (handed_over) hiển thị mã #VLU-2026-28506 (không ##) và tiêu đề "Theo dõi trạng thái · Đã bàn giao vận chuyển"',
      modalHtmlHanded.includes('>' + TARGET_CODE + '<') &&
      !modalHtmlHanded.includes('##VLU-') &&
      modalHtmlHanded.includes('Theo dõi trạng thái · Đã bàn giao vận chuyển'),
      modalHtmlHanded.slice(0, 500)
    );

    assertTest(
      'Timeline 6 bước (handed_over = bước 4): bước 1..3 hoàn thành (✓), bước 4 active nổi bật, bước 5..6 upcoming',
      stepsHanded.length === 6 &&
      stepsHanded[0].key === 'pending' && stepsHanded[0].label === 'Chờ xác nhận' && stepsHanded[0].isComplete && stepsHanded[0].hasCheckmark &&
      stepsHanded[1].key === 'confirmed' && stepsHanded[1].label === 'Đã xác nhận' && stepsHanded[1].isComplete && stepsHanded[1].hasCheckmark &&
      stepsHanded[2].key === 'preparing' && stepsHanded[2].label === 'Đang chuẩn bị' && stepsHanded[2].isComplete && stepsHanded[2].hasCheckmark &&
      stepsHanded[3].key === 'handed_over' && stepsHanded[3].label === 'Đã bàn giao vận chuyển' && stepsHanded[3].isActive && stepsHanded[3].hasActiveCore && !stepsHanded[3].isComplete &&
      stepsHanded[4].key === 'shipping' && stepsHanded[4].label === 'Đang giao hàng' && stepsHanded[4].isUpcoming &&
      stepsHanded[5].key === 'completed' && stepsHanded[5].label === 'Giao thành công' && stepsHanded[5].isUpcoming,
      JSON.stringify(stepsHanded)
    );

    // ------------------------------------------------------------------
    // PHẦN 4: ADMIN ĐỔI SANG shipping -> KHÁCH BẤM MỞ MODAL ĐỒNG BỘ NGAY LẬP TỨC
    // ------------------------------------------------------------------
    console.log('\n--- PHẦN 4: ĐỒNG BỘ NHANH NGAY KHI MỞ MODAL (handed_over -> shipping) ---');

    accSync.closeOrderModal();
    const advShipping = adminEngine.tryUpdateOrderStatus('#VLU-2026-28506', 'shipping', { note: 'Shipper đang giao tới khách' });
    await adminIncognitoEnv.flushMicrotasks();
    assertTest('Admin chuyển #VLU-2026-28506 sang shipping thành công', advShipping && advShipping.ok === true);

    // Khách mở lại Modal Chi tiết mà không reload trang
    accSync.openOrderModal(TARGET_CODE);
    await accountEnv.flushMicrotasks();

    const modalElShipping = accountEnv.documentObj.getElementById('accountOrderModal');
    const modalHtmlShipping = modalElShipping ? modalElShipping.innerHTML : '';
    const stepsShipping = parseTimelineSteps(modalHtmlShipping);

    assertTest(
      'Mở Modal đồng bộ nhanh từ orders.php: tiêu đề cập nhật ngay "Theo dõi trạng thái · Đang giao hàng"',
      modalHtmlShipping.includes('Theo dõi trạng thái · Đang giao hàng') && !modalHtmlShipping.includes('##VLU-'),
      modalHtmlShipping.slice(0, 500)
    );

    assertTest(
      'Timeline 6 bước (shipping = bước 5): bước 1..4 hoàn thành (✓), bước 5 active nổi bật, bước 6 upcoming',
      stepsShipping.length === 6 &&
      stepsShipping.slice(0, 4).every((s) => s.isComplete && s.hasCheckmark) &&
      stepsShipping[4].key === 'shipping' && stepsShipping[4].isActive && stepsShipping[4].hasActiveCore &&
      stepsShipping[5].key === 'completed' && stepsShipping[5].isUpcoming,
      JSON.stringify(stepsShipping)
    );

    // ------------------------------------------------------------------
    // PHẦN 5: TRẠNG THÁI CANCELLED KÈM LÝ DO HỦY & QUY TẮC KHÔNG HẠ CẤP TRẠNG THÁI
    // ------------------------------------------------------------------
    console.log('\n--- PHẦN 5: TRẠNG THÁI CANCELLED KÈM LÝ DO HỦY & MERGE PRIORITY ---');

    const cancelRes = adminEngine.tryUpdateOrderStatus(TARGET_CODE, 'cancelled', { cancelReason: 'Khách đổi địa chỉ giao hàng' });
    await adminIncognitoEnv.flushMicrotasks();
    assertTest('Admin hủy đơn kèm lý do thành công', cancelRes && cancelRes.ok === true);

    accSync.closeOrderModal();
    accSync.openOrderModal(TARGET_CODE);
    await accountEnv.flushMicrotasks();
    const modalHtmlCancelled = (accountEnv.documentObj.getElementById('accountOrderModal') || {}).innerHTML || '';
    assertTest(
      'Modal hiển thị trạng thái Đã hủy kèm lý do hủy rõ ràng',
      modalHtmlCancelled.includes('Theo dõi trạng thái · Đã hủy') &&
      modalHtmlCancelled.includes('account-cancel-banner') &&
      modalHtmlCancelled.includes('Khách đổi địa chỉ giao hàng'),
      modalHtmlCancelled.slice(0, 600)
    );

    // Kiểm tra hàm mergeOrderRecords không bao giờ hạ cấp trạng thái cao xuống thấp
    const mergedNoDowngrade = accSync.mergeOrderRecords(
      { id: TARGET_CODE, status: 'shipping', updated_at: '2026-11-19T10:00:00.000Z' },
      { id: 'VLU-2026-28506', status: 'pending', updated_at: '2026-11-19T12:00:00.000Z' },
      true
    );
    const mergedNewerSameStatus = accSync.mergeOrderRecords(
      { id: TARGET_CODE, status: 'confirmed', payment_status: 'pending', updated_at: '2026-11-19T10:00:00.000Z' },
      { id: '##VLU-2026-28506', status: 'confirmed', payment_status: 'paid', updated_at: '2026-11-19T11:00:00.000Z' },
      true
    );
    assertTest(
      'mergeOrderRecords ưu tiên tiến trình trạng thái cao hơn và updated_at mới hơn khi cùng trạng thái',
      mergedNoDowngrade.status === 'shipping' &&
      mergedNoDowngrade.id === TARGET_CODE &&
      mergedNewerSameStatus.payment_status === 'paid' &&
      mergedNewerSameStatus.id === TARGET_CODE,
      JSON.stringify({ mergedNoDowngrade, mergedNewerSameStatus })
    );

    // ------------------------------------------------------------------
    // PHẦN 6: KIỂM TRA CSS TIMELINE 6 BƯỚC 1 HÀNG NGANG & ADMIN KHÔNG CÓ ##VLU-
    // ------------------------------------------------------------------
    console.log('\n--- PHẦN 6: KIỂM TRA CSS TIMELINE 1 HÀNG NGANG & ADMIN MODAL ---');

    const accountCss = fs.readFileSync(path.join(ROOT_DIR, 'frontend', 'assets', 'css', 'account.css'), 'utf8');
    const timelineBlocks = accountCss.match(/\.account-timeline\s*\{[^}]*\}/g) || [];
    const allSixCols = timelineBlocks.length > 0 && timelineBlocks.every((blk) =>
      /grid-template-columns:\s*repeat\(6,/.test(blk) && !/grid-template-columns:\s*repeat\([24],/.test(blk)
    );
    assertTest(
      'account.css bố trí .account-timeline 6 cột trên 1 hàng ngang (repeat(6, ...)), có đường nối liền mạch và không rớt dòng repeat(4)/repeat(2)',
      allSixCols &&
      accountCss.includes('.account-timeline-step:not(:last-child)::after') &&
      accountCss.includes('.account-timeline-step.is-complete:not(:last-child)::after') &&
      accountCss.includes('.account-timeline-step.is-active .account-timeline-dot'),
      JSON.stringify(timelineBlocks)
    );

    const adminPageSrc = fs.readFileSync(path.join(ROOT_DIR, 'frontend', 'assets', 'js', 'admin-page.js'), 'utf8');
    assertTest(
      'admin-page.js đã loại bỏ toàn bộ nối chuỗi "#" + o.id gây lỗi kép ##VLU-...',
      !adminPageSrc.includes("'#' + o.id") &&
      !adminPageSrc.includes("'#' + escapeHtml(o.id)") &&
      !adminPageSrc.includes('Mã đơn: #\' + escapeHtml(o.id)'),
      'Kiểm tra mã nguồn admin-page.js'
    );

    console.log('\n====================================================================');
    console.log(`   KẾT QUẢ KIỂM THỬ CLI: ${passed} PASS / ${passed + failed} TESTS`);
    console.log('====================================================================');
    if (failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (backupUsers !== null) fs.writeFileSync(USERS_JSON_PATH, backupUsers, 'utf8');
    if (backupOrders !== null) fs.writeFileSync(ORDERS_JSON_PATH, backupOrders, 'utf8');
  }
}

runTests().catch((err) => {
  console.error('[FATAL TEST ERROR]', err);
  process.exit(1);
});
