/**
 * VLU FLAGSHIP STORE – Admin Control Engine 2026
 * Quản trị toàn diện: Thống kê Dashboard, Quản lý Sản phẩm (CRUD), Quản lý Danh mục,
 * Duyệt Đơn hàng (Orders & Status), Phân quyền Admin (Role = 1), Đồng bộ localStorage
 */
(function (window, document) {
  'use strict';

  var STORAGE_PRODUCTS = 'vlu_admin_products';
  var STORAGE_CATEGORIES = 'vlu_admin_categories';
  var STORAGE_ORDERS = 'vlu_orders';
  var STORAGE_USERS = 'vlu_admin_users';

  // 1. DỮ LIỆU DANH MỤC MẪU BAN ĐẦU (CATEGORIES SEED)
  var DEFAULT_CATEGORIES = [
    { id: 1, name: 'Apple', slug: 'apple', icon: '🍎', description: 'iPhone, iPad, MacBook, Apple Watch, AirPods' },
    { id: 2, name: 'Samsung', slug: 'samsung', icon: '🟢', description: 'Galaxy phones, tablets, earbuds, and watches' },
    { id: 3, name: 'Xiaomi', slug: 'xiaomi', icon: '🔵', description: 'Xiaomi, Redmi, POCO, and Pad devices' },
    { id: 4, name: 'OPPO', slug: 'oppo', icon: '🟠', description: 'Find, Reno, and A series phones' },
    { id: 5, name: 'vivo', slug: 'vivo', icon: '🔷', description: 'X and V series phones' },
    { id: 6, name: 'ASUS', slug: 'asus', icon: '💻', description: 'Vivobook, Zenbook, ROG, and ProArt laptops' },
    { id: 7, name: 'Lenovo', slug: 'lenovo', icon: '💻', description: 'IdeaPad, Legion, and Yoga laptops' },
    { id: 8, name: 'HP', slug: 'hp', icon: '💻', description: 'OmniBook and ZBook laptops' },
    { id: 9, name: 'Acer', slug: 'acer', icon: '💻', description: 'Swift and Predator laptops' },
    { id: 10, name: 'MSI', slug: 'msi', icon: '💻', description: 'Vector and Creator laptops' },
    { id: 11, name: 'Dell', slug: 'dell', icon: '💻', description: 'XPS laptops' },
    { id: 12, name: 'JBL', slug: 'jbl', icon: '🔊', description: 'Headphones and speakers' },
    { id: 13, name: 'Marshall', slug: 'marshall', icon: '🔊', description: 'Portable and home speakers' },
    { id: 14, name: 'Soundcore', slug: 'soundcore', icon: '🔊', description: 'Portable Soundcore speakers' }
  ];

  // 2. DỮ LIỆU SẢN PHẨM MẪU BAN ĐẦU (PRODUCTS SEED)
  var DEFAULT_PRODUCTS = [];

  function makeCatalogProducts() {
    var catalog = window.VLU_CATALOG || {};
    var categoryIds = DEFAULT_CATEGORIES.reduce(function (ids, category) {
      ids[category.name.toLowerCase()] = category.id;
      return ids;
    }, {});
    return Object.keys(catalog).map(function (id) {
      var product = catalog[id];
      return {
        id: id,
        category_id: categoryIds[String(product.brand || '').toLowerCase()] || 1,
        category_name: product.brand,
        name: product.name,
        price: Number(product.basePrice) || 0,
        old_price: Number(product.oldPrice) || null,
        image: product.image,
        description: product.tagline || '',
        status: 'active',
        stock: Number(product.stock) || 0
      };
    });
  }

  if (window.VLU_CATALOG) {
    DEFAULT_PRODUCTS = makeCatalogProducts();
  } else {
    console.error('[AdminEngine] Không thể khởi tạo sản phẩm: catalog chưa được tải.');
  }

  // 3. DỮ LIỆU ĐƠN HÀNG MẪU BAN ĐẦU (ORDERS SEED)
  var DEFAULT_ORDERS = [
    {
      id: '#VLU-2026-89214',
      customer_name: 'Nguyễn Văn An',
      customer_phone: '0987654321',
      customer_email: 'nguyenvanan@vlu.edu.vn',
      customer_address: '69/68 Đặng Thùy Trâm, Phường 13, Bình Thạnh, TP. Hồ Chí Minh',
      customer_notes: 'Giao giờ hành chính, gọi trước 15 phút.',
      payment_method: 'Chuyển khoản VietQR',
      payment_key: 'vietqr',
      items: [
        {
          id: '101',
          name: 'iPhone 18 Pro Max',
          color: 'Titan Sa Mạc',
          variant: '256GB',
          price: 34990000,
          quantity: 1,
          image: 'SanPham/SanPham/Iphone/Ip 18 pro max/Đỏ Burgundy.png'
        }
      ],
      subtotal: 34990000,
      discount: 500000,
      total: 34490000,
      status: 'pending', // Chờ xử lý
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: '#VLU-2026-74120',
      customer_name: 'Trần Thị Bích Ngọc',
      customer_phone: '0912345678',
      customer_email: 'bichngoc.tran@gmail.com',
      customer_address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. Hồ Chí Minh',
      customer_notes: 'Gửi lễ tân nhận giúp nếu không có nhà.',
      payment_method: 'Thẻ quốc tế / Apple Pay',
      payment_key: 'credit',
      items: [
        {
          id: '501',
          name: 'MacBook Pro 16" M4 Max',
          color: 'Space Black',
          variant: '36GB RAM / 1TB SSD',
          price: 79990000,
          quantity: 1,
          image: 'frontend/assets/images/placeholders/laptop.svg'
        },
        {
          id: '701',
          name: 'AirPods Pro 2 (USB-C)',
          color: 'Trắng',
          variant: 'Chống ồn ANC',
          price: 5790000,
          quantity: 1,
          image: 'frontend/assets/images/placeholders/tai-nghe.svg'
        }
      ],
      subtotal: 85780000,
      discount: 1000000,
      total: 84780000,
      status: 'shipping', // Đang giao
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: '#VLU-2026-62051',
      customer_name: 'Lê Hoàng Long',
      customer_phone: '0933889900',
      customer_email: 'hoanglong.le@gmail.com',
      customer_address: '254 Nguyễn Văn Linh, Phường Thạc Gián, Thanh Khê, Đà Nẵng',
      customer_notes: 'Kiểm tra máy nguyên seal.',
      payment_method: 'Thanh toán khi nhận hàng (COD)',
      payment_key: 'cod',
      items: [
        {
          id: '201',
          name: 'Galaxy S26 Ultra',
          color: 'Titan Xám',
          variant: '512GB',
          price: 31990000,
          quantity: 1,
          image: 'frontend/assets/images/placeholders/dien-thoai.svg'
        }
      ],
      subtotal: 31990000,
      discount: 0,
      total: 31990000,
      status: 'completed', // Hoàn thành
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: '#VLU-2026-51980',
      customer_name: 'Phạm Minh Tuấn',
      customer_phone: '0909112233',
      customer_email: 'tuan.pm@vlu.edu.vn',
      customer_address: 'Số 12 Đại lộ Hòa Bình, Ninh Kiều, Cần Thơ',
      customer_notes: '',
      payment_method: 'Chuyển khoản VietQR',
      payment_key: 'vietqr',
      items: [
        {
          id: '601',
          name: 'iPad Pro M4 Ultra Thin',
          color: 'Bạc Silver',
          variant: '256GB Wi-Fi',
          price: 29990000,
          quantity: 1,
          image: 'frontend/assets/images/placeholders/ipad.svg'
        }
      ],
      subtotal: 29990000,
      discount: 500000,
      total: 29490000,
      status: 'completed', // Hoàn thành
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    }
  ];

  // 4. DỮ LIỆU TÀI KHOẢN MẪU (USERS SEED)
  var DEFAULT_USERS = [
    { id: 1, username: 'admin@vlu.edu.vn', fullname: 'Quản Trị Viên VLU', email: 'admin@vlu.edu.vn', phone: '0901234567', role: 1, status: 'active', created_at: '2026-01-01' },
    { id: 2, username: 'nguyenvanan@vlu.edu.vn', fullname: 'Nguyễn Văn An', email: 'nguyenvanan@vlu.edu.vn', phone: '0987654321', role: 0, status: 'active', created_at: '2026-02-15' },
    { id: 3, username: 'bichngoc.tran@gmail.com', fullname: 'Trần Thị Bích Ngọc', email: 'bichngoc.tran@gmail.com', phone: '0912345678', role: 0, status: 'active', created_at: '2026-03-10' },
    { id: 4, username: 'hoanglong.le@gmail.com', fullname: 'Lê Hoàng Long', email: 'hoanglong.le@gmail.com', phone: '0933889900', role: 0, status: 'active', created_at: '2026-03-22' }
  ];

  var AdminEngine = {
    /**
     * Kiểm tra quyền truy cập (Role === 1: Admin)
     */
    checkAuth: function () {
      try {
        var raw = localStorage.getItem('vlu_user');
        if (!raw) return { isAuthorized: false, user: null };
        var user = JSON.parse(raw);
        if (user && user.role === 1) {
          return { isAuthorized: true, user: user };
        }
        return { isAuthorized: false, user: user };
      } catch (e) {
        return { isAuthorized: false, user: null };
      }
    },

    /**
     * Đăng nhập nhanh quyền Admin (Dành cho demo và chấm bài thuận tiện)
     */
    quickLoginAdmin: function () {
      if (window.VLU_AUTH) {
        window.VLU_AUTH.login('admin@vlu.edu.vn', 'Admin@2026', true);
      } else {
        var adminUser = {
          id: 1,
          username: 'admin@vlu.edu.vn',
          email: 'admin@vlu.edu.vn',
          fullname: 'Quản Trị Viên VLU',
          phone: '0901234567',
          role: 1,
          loginAt: new Date().toISOString()
        };
        localStorage.setItem('vlu_user', JSON.stringify(adminUser));
      }
      // this.initDashboard();
    },

    /* ==========================================================================
       A. QUẢN LÝ SẢN PHẨM (PRODUCTS CRUD)
       ========================================================================== */
    getProducts: function () {
      try {
        var raw = localStorage.getItem(STORAGE_PRODUCTS);
        if (!raw) {
          this.saveProducts(DEFAULT_PRODUCTS);
          return DEFAULT_PRODUCTS.slice();
        }
        var list = JSON.parse(raw);
        if (!Array.isArray(list)) return DEFAULT_PRODUCTS.slice();
        if (!window.VLU_CATALOG) return list;

        var catalog = window.VLU_CATALOG;
        var aliases = window.VLU_PRODUCT_ID_ALIASES || {};
        var byName = {};
        list.forEach(function (product) {
          if (product && product.name) byName[String(product.name).trim().toLowerCase()] = product;
        });
        var categoryIds = DEFAULT_CATEGORIES.reduce(function (ids, category) {
          ids[category.name.toLowerCase()] = category.id;
          return ids;
        }, {});
        var synchronized = Object.keys(catalog).reduce(function (result, id) {
          var product = catalog[id];
          var saved = list.find(function (item) {
            return item && (String(aliases[item.id] || item.id) === id ||
              String(item.name || '').trim().toLowerCase() === product.name.toLowerCase());
          }) || byName[product.name.toLowerCase()];
          if (!saved) saved = {};
          result.push({
            id: id,
            category_id: categoryIds[String(product.brand || '').toLowerCase()] || 1,
            category_name: product.brand,
            name: product.name,
            price: Number(saved.price) || Number(product.basePrice) || 0,
            old_price: Number(saved.old_price) || Number(product.oldPrice) || null,
            image: product.image || saved.image,
            description: product.tagline || saved.description || '',
            status: saved.status || 'active',
            stock: Number(saved.stock) || Number(product.stock) || 0
          });
          return result;
        }, []);
        if (JSON.stringify(synchronized) !== JSON.stringify(list)) this.saveProducts(synchronized);
        return synchronized;
      } catch (e) {
        console.error('[AdminEngine] Không thể đồng bộ danh mục sản phẩm:', e);
        return DEFAULT_PRODUCTS.slice();
      }
    },

    saveProducts: function (list) {
      try {
        localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(list));
        this.emitUpdate();
      } catch (e) {
        console.error('Lỗi lưu products:', e);
      }
    },

    addProduct: function (productData) {
      var list = this.getProducts();
      var newId = 'admin-product-' + Date.now();
      
      var newProd = {
        id: newId,
        category_id: parseInt(productData.category_id, 10) || 1,
        category_name: productData.category_name || this.getCategoryName(productData.category_id),
        name: productData.name.trim(),
        price: parseInt(productData.price, 10) || 0,
        old_price: productData.old_price ? parseInt(productData.old_price, 10) : null,
        image: productData.image || 'frontend/assets/images/logo.png',
        description: productData.description || '',
        status: productData.status || 'active',
        stock: parseInt(productData.stock, 10) || 50,
        created_at: new Date().toISOString()
      };

      list.unshift(newProd);
      this.saveProducts(list);
      return newProd;
    },

    updateProduct: function (id, productData) {
      var list = this.getProducts();
      var idx = -1;
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(id)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return false;

      list[idx].name = productData.name.trim();
      list[idx].category_id = parseInt(productData.category_id, 10) || list[idx].category_id;
      list[idx].category_name = productData.category_name || this.getCategoryName(productData.category_id);
      list[idx].price = parseInt(productData.price, 10) || 0;
      list[idx].old_price = productData.old_price ? parseInt(productData.old_price, 10) : null;
      if (productData.image) list[idx].image = productData.image;
      if (productData.description !== undefined) list[idx].description = productData.description;
      if (productData.status) list[idx].status = productData.status;
      if (productData.stock !== undefined) list[idx].stock = parseInt(productData.stock, 10) || 0;

      this.saveProducts(list);
      return list[idx];
    },

    deleteProduct: function (id) {
      var list = this.getProducts();
      var filtered = list.filter(function (p) {
        return String(p.id) !== String(id);
      });
      this.saveProducts(filtered);
      return true;
    },

    resetProducts: function () {
      this.saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS.slice();
    },

    /* ==========================================================================
       B. QUẢN LÝ DANH MỤC (CATEGORIES CRUD)
       ========================================================================== */
    getCategories: function () {
      try {
        var raw = localStorage.getItem(STORAGE_CATEGORIES);
        var stored = raw ? JSON.parse(raw) : [];
        var synchronized = DEFAULT_CATEGORIES.map(function (category) {
          var saved = Array.isArray(stored) && stored.find(function (item) {
            return item && (item.slug === category.slug || item.name === category.name);
          });
          return saved ? Object.assign({}, category, { created_at: saved.created_at }) : Object.assign({}, category);
        });
        if (JSON.stringify(stored) !== JSON.stringify(synchronized)) this.saveCategories(synchronized);
        return synchronized;
      } catch (e) {
        console.error('[AdminEngine] Không thể đồng bộ danh mục hãng:', e);
        return DEFAULT_CATEGORIES.slice();
      }
    },

    saveCategories: function (list) {
      try {
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(list));
        this.emitUpdate();
      } catch (e) {
        console.error('Lỗi lưu categories:', e);
      }
    },

    getCategoryName: function (catId) {
      var cats = this.getCategories();
      var cId = parseInt(catId, 10);
      for (var i = 0; i < cats.length; i++) {
        if (cats[i].id === cId) return cats[i].name;
      }
      return 'Khác';
    },

    addCategory: function (catData) {
      var list = this.getCategories();
      var newId = list.length > 0 ? Math.max.apply(Math, list.map(function (c) { return c.id; })) + 1 : 1;
      var newCat = {
        id: newId,
        name: catData.name.trim(),
        slug: catData.slug ? catData.slug.trim() : catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        icon: catData.icon || '📦',
        description: catData.description || '',
        created_at: new Date().toISOString()
      };
      list.push(newCat);
      this.saveCategories(list);
      return newCat;
    },

    updateCategory: function (id, catData) {
      var list = this.getCategories();
      var numId = parseInt(id, 10);
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === numId) {
          list[i].name = catData.name.trim();
          if (catData.slug) list[i].slug = catData.slug.trim();
          if (catData.icon) list[i].icon = catData.icon;
          if (catData.description !== undefined) list[i].description = catData.description;
          this.saveCategories(list);
          return list[i];
        }
      }
      return false;
    },

    deleteCategory: function (id) {
      var list = this.getCategories();
      var numId = parseInt(id, 10);
      var filtered = list.filter(function (c) { return c.id !== numId; });
      this.saveCategories(filtered);
      return true;
    },

    /* ==========================================================================
       C. QUẢN LÝ ĐƠN HÀNG (ORDERS & STATUS TRANSITION)
       ========================================================================== */
    getOrders: function () {
      try {
        var raw = localStorage.getItem(STORAGE_ORDERS);
        if (!raw) {
          this.saveOrders(DEFAULT_ORDERS);
          return DEFAULT_ORDERS.slice();
        }
        var list = JSON.parse(raw);
        return Array.isArray(list) ? list : DEFAULT_ORDERS.slice();
      } catch (e) {
        return DEFAULT_ORDERS.slice();
      }
    },

    saveOrders: function (list) {
      try {
        localStorage.setItem(STORAGE_ORDERS, JSON.stringify(list));
        this.emitUpdate();
      } catch (e) {
        console.error('Lỗi lưu orders:', e);
      }
    },

    syncAccountOrder: function (order, remove) {
      if (!order || !order.user_id || order.user_id === 'guest') return;
      var key = 'vlu_account_' + String(order.user_id).trim().toLowerCase().replace(/[^a-z0-9._@-]+/g, '_');
      try {
        var account = JSON.parse(localStorage.getItem(key) || '{}');
        if (!account || typeof account !== 'object' || Array.isArray(account)) account = {};
        if (!Array.isArray(account.orders)) account.orders = [];
        if (remove) {
          account.orders = account.orders.filter(function (entry) {
            return String(entry.id) !== String(order.id);
          });
        } else {
          var index = account.orders.findIndex(function (entry) {
            return String(entry.id) === String(order.id);
          });
          var previousStatus = index === -1 ? '' : String(account.orders[index].status || '');
          if (index === -1) account.orders.unshift(order);
          else account.orders[index] = order;
          if (previousStatus && previousStatus !== String(order.status || '')) {
            if (!Array.isArray(account.notifications)) account.notifications = [];
            var statusText = {
              pending: 'Chờ xác nhận', confirmed: 'Đang chuẩn bị', processing: 'Đang chuẩn bị',
              shipping: 'Đang giao', delivering: 'Đang giao', completed: 'Đã giao thành công',
              delivered: 'Đã giao thành công', cancelled: 'Đã hủy'
            };
            account.notifications.unshift({
              id: 'N-' + Date.now(),
              type: ['shipping', 'delivering'].indexOf(String(order.status)) !== -1 ? 'shipping' : 'order',
              title: 'Cập nhật trạng thái đơn hàng',
              message: 'Đơn ' + order.id + ' chuyển sang trạng thái ' + (statusText[order.status] || order.status) + '.',
              read: false,
              createdAt: new Date().toISOString()
            });
          }
        }
        localStorage.setItem(key, JSON.stringify(account));
      } catch (error) {
        console.error('[AdminEngine] Không thể đồng bộ đơn hàng vào vùng dữ liệu tài khoản:', error);
      }
    },

    updateOrderStatus: function (orderId, newStatus) {
      var list = this.getOrders();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === orderId) {
          list[i].status = newStatus;
          list[i].updated_at = new Date().toISOString();
          this.saveOrders(list);
          this.syncAccountOrder(list[i], false);
          return list[i];
        }
      }
      return false;
    },

    deleteOrder: function (orderId) {
      var list = this.getOrders();
      var removed = list.find(function (order) { return order.id === orderId; });
      var filtered = list.filter(function (o) { return o.id !== orderId; });
      this.saveOrders(filtered);
      if (removed) this.syncAccountOrder(removed, true);
      return true;
    },

    /* ==========================================================================
       D. QUẢN LÝ TÀI KHOẢN (USERS)
       ========================================================================== */
    getUsers: function () {
      try {
        var raw = localStorage.getItem(STORAGE_USERS);
        var currentUser = null;
        try {
          var userRaw = localStorage.getItem('vlu_user');
          if (userRaw) currentUser = JSON.parse(userRaw);
        } catch (e) {}

        var list = DEFAULT_USERS.slice();
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
        }

        // Bổ sung tài khoản hiện tại vào danh sách nếu chưa có
        if (currentUser && currentUser.username) {
          var exists = list.some(function (u) { return u.username === currentUser.username; });
          if (!exists) {
            list.unshift({
              id: currentUser.id || Math.floor(100 + Math.random() * 900),
              username: currentUser.username,
              fullname: currentUser.fullname || currentUser.username,
              email: currentUser.email || '',
              phone: currentUser.phone || '',
              role: currentUser.role || 0,
              status: 'active',
              created_at: new Date().toISOString().slice(0, 10)
            });
          }
        }
        return list;
      } catch (e) {
        return DEFAULT_USERS.slice();
      }
    },

    /* ==========================================================================
       E. THỐNG KÊ TỔNG QUAN (DASHBOARD STATS)
       ========================================================================== */
    calculateStats: function () {
      var orders = this.getOrders();
      var products = this.getProducts();
      var users = this.getUsers();

      var totalRevenue = 0;
      var pendingCount = 0;
      var shippingCount = 0;
      var completedCount = 0;

      orders.forEach(function (o) {
        var total = parseInt(o.total, 10) || 0;
        if (o.status !== 'cancelled') {
          totalRevenue += total;
        }
        if (o.status === 'pending') pendingCount++;
        if (o.status === 'shipping') shippingCount++;
        if (o.status === 'completed') completedCount++;
      });

      return {
        totalRevenue: totalRevenue,
        orderCount: orders.length,
        pendingOrders: pendingCount,
        shippingOrders: shippingCount,
        completedOrders: completedCount,
        productCount: products.length,
        userCount: users.length
      };
    },

    formatVND: function (num) {
      var n = parseInt(num, 10) || 0;
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
    },

    formatDate: function (dateStr) {
      if (!dateStr) return '--';
      try {
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        var day = ('0' + d.getDate()).slice(-2);
        var month = ('0' + (d.getMonth() + 1)).slice(-2);
        var year = d.getFullYear();
        var hours = ('0' + d.getHours()).slice(-2);
        var minutes = ('0' + d.getMinutes()).slice(-2);
        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
      } catch (e) {
        return dateStr;
      }
    },

    getStatusBadge: function (status) {
      switch (status) {
        case 'pending':
          return '<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/80"><span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>Chờ xử lý</span>';
        case 'shipping':
          return '<span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200/80"><span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>Đang giao</span>';
        case 'completed':
          return '<span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/80"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Hoàn thành</span>';
        case 'cancelled':
          return '<span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 border border-slate-200"><span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>Đã hủy</span>';
        default:
          return '<span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">' + (status || 'Mới') + '</span>';
      }
    },

    showToast: function (msg, isError) {
      if (window.VLU_CART && typeof window.VLU_CART.showToast === 'function') {
        window.VLU_CART.showToast(msg, isError);
        return;
      }
      var toast = document.getElementById('toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-full px-5 py-3 text-sm font-semibold text-white opacity-0 shadow-2xl transition-all duration-300';
        document.body.appendChild(toast);
      }
      toast.style.background = isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(11, 15, 25, 0.92)';
      toast.textContent = msg;
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';
      setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 1rem)';
      }, 2600);
    },

    emitUpdate: function () {
      var event;
      if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent('vlu:admin-updated');
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent('vlu:admin-updated', true, true, {});
      }
      window.dispatchEvent(event);
    }
  };

  window.VLU_ADMIN = AdminEngine;

})(window, document);
