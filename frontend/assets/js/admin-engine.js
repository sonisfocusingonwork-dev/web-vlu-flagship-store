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
    { id: 2, name: 'Samsung', slug: 'samsung', icon: '🟢', description: 'Galaxy S26, Z Fold8, Z Flip8, Galaxy Tab, Watch' },
    { id: 3, name: 'Xiaomi', slug: 'xiaomi', icon: '🔵', description: 'Xiaomi 17 Ultra, Redmi Note, Xiaomi Pad' },
    { id: 4, name: 'OPPO', slug: 'oppo', icon: '🟠', description: 'Find X9 Ultra, Reno Series, Find N5' },
    { id: 5, name: 'ASUS', slug: 'asus', icon: '💻', description: 'ROG Strix, TUF Gaming, Zenbook, Vivobook' },
    { id: 6, name: 'Dell & HP', slug: 'dell-hp', icon: '🖥️', description: 'Dell XPS, Inspiron, HP Spectre, Pavilion' },
    { id: 7, name: 'Sony & Âm thanh', slug: 'sony-audio', icon: '🎧', description: 'Tai nghe WH-1000XM5, WF-1000XM5, Marshall' },
    { id: 8, name: 'JBL & Loa', slug: 'jbl-loa', icon: '🔊', description: 'JBL Flip 6, Boombox, Marshall Emberton, Bose' },
    { id: 9, name: 'Phụ kiện cao cấp', slug: 'phu-kien', icon: '⚡', description: 'Củ sạc GaN, Cáp Type-C, Pin dự phòng, Ốp MagSafe' }
  ];

  // 2. DỮ LIỆU SẢN PHẨM MẪU BAN ĐẦU (PRODUCTS SEED)
  var DEFAULT_PRODUCTS = [
    {
      id: 101,
      category_id: 1,
      category_name: 'Apple',
      name: 'iPhone 18 Pro & iPhone 18 Pro Max',
      price: 34990000,
      old_price: 36990000,
      image: 'SanPham/SanPham/Iphone/Ip 18 pro max/Đỏ Burgundy.png',
      description: 'Đỉnh cao công nghệ Titanium, chip A20 Pro siêu mạnh mẽ, camera tiềm vọng 10x.',
      status: 'active',
      stock: 45
    },
    {
      id: 102,
      category_id: 1,
      category_name: 'Apple',
      name: 'iPhone Air',
      price: 26990000,
      old_price: 28990000,
      image: 'SanPham/SanPham/Iphone/Ip Air/Vàng Nhạt.png',
      description: 'Thiết kế siêu mỏng nhẹ đột phá, độ mỏng kỷ lục 5.4mm, chip Apple A19 Pro.',
      status: 'active',
      stock: 60
    },
    {
      id: 103,
      category_id: 1,
      category_name: 'Apple',
      name: 'iPhone 17',
      price: 22990000,
      old_price: 24990000,
      image: 'SanPham/SanPham/Iphone/Ip 17/Trắng.png',
      description: 'Màu sắc trẻ trung năng động, camera kép 48MP nâng cấp toàn diện, Dynamic Island.',
      status: 'active',
      stock: 35
    },
    {
      id: 201,
      category_id: 2,
      category_name: 'Samsung',
      name: 'Galaxy S26 Ultra',
      price: 31990000,
      old_price: 33990000,
      image: 'SanPham/SanPham/Samsung/SS S26 Ultra/Trắng.webp',
      description: 'Flagship Android đỉnh cao với Galaxy AI thông minh, bút S Pen tích hợp và camera 200MP.',
      status: 'active',
      stock: 28
    },
    {
      id: 202,
      category_id: 2,
      category_name: 'Samsung',
      name: 'Galaxy Z Fold8',
      price: 44990000,
      old_price: 47990000,
      image: 'SanPham/SanPham/Samsung/SS Galaxy Z Fold8/Cream.webp',
      description: 'Thiết kế gập mở màn hình lớn như tablet, bản lề flex siêu mỏng không nếp gấp.',
      status: 'active',
      stock: 15
    },
    {
      id: 301,
      category_id: 3,
      category_name: 'Xiaomi',
      name: 'Xiaomi 17 Ultra',
      price: 26990000,
      old_price: 28990000,
      image: 'SanPham/SanPham/Xiaomi/Xiaomi 17 ultra/Trắng.webp',
      description: 'Kiệt tác quang học huyền thoại Leica, cảm biến 1-inch và hệ thống 4 camera chuyên nghiệp.',
      status: 'active',
      stock: 20
    },
    {
      id: 401,
      category_id: 4,
      category_name: 'OPPO',
      name: 'OPPO Find X9 Ultra',
      price: 27990000,
      old_price: 29990000,
      image: 'SanPham/SanPham/Oppo/OPPO Find X9 Ultra/Cam.png',
      description: 'Camera tiềm vọng kép đầu tiên cùng hệ màu Hasselblad tự nhiên chân thực.',
      status: 'active',
      stock: 18
    },
    {
      id: 501,
      category_id: 1,
      category_name: 'Apple',
      name: 'MacBook Pro 16" M4 Max',
      price: 79990000,
      old_price: 84990000,
      image: 'frontend/assets/images/placeholders/laptop.svg',
      description: 'Hiệu năng đỉnh cao đồ họa chuyên nghiệp, màn hình Liquid Retina XDR 120Hz.',
      status: 'active',
      stock: 12
    },
    {
      id: 502,
      category_id: 5,
      category_name: 'ASUS',
      name: 'ASUS ROG Strix SCAR 18',
      price: 89990000,
      old_price: 94990000,
      image: 'frontend/assets/images/placeholders/laptop.svg',
      description: 'Cỗ máy gaming tối thượng Core i9 thế hệ mới, RTX 4090 16GB, tản nhiệt buồng hơi 3 quạt.',
      status: 'active',
      stock: 8
    },
    {
      id: 601,
      category_id: 1,
      category_name: 'Apple',
      name: 'iPad Pro M4 Ultra Thin',
      price: 29990000,
      old_price: 31990000,
      image: 'frontend/assets/images/placeholders/ipad.svg',
      description: 'Màn hình OLED Tandem siêu sáng 1600 nits, chip M4 siêu tốc độ xử lý AI.',
      status: 'active',
      stock: 25
    },
    {
      id: 701,
      category_id: 1,
      category_name: 'Apple',
      name: 'AirPods Pro 2 (USB-C)',
      price: 5790000,
      old_price: 6190000,
      image: 'SanPham/SanPham/Tai nghe/AirPods Pro 2/Tiêu Chuẩn.svg',
      description: 'Chống ồn chủ động ANC gấp 2 lần, âm thanh thích ứng và cổng sạc USB-C tiện dụng.',
      status: 'active',
      stock: 80
    },
    {
      id: 702,
      category_id: 7,
      category_name: 'Sony & Âm thanh',
      name: 'Sony WH-1000XM5 Hi-Res',
      price: 7990000,
      old_price: 8690000,
      image: 'frontend/assets/images/placeholders/tai-nghe.svg',
      description: 'Tai nghe chống ồn hàng đầu thế giới, thiết kế công thái học nhẹ nhàng êm ái cả ngày.',
      status: 'active',
      stock: 30
    },
    {
      id: 801,
      category_id: 8,
      category_name: 'JBL & Loa',
      name: 'Loa JBL Flip 6 Portable',
      price: 2490000,
      old_price: 2990000,
      image: 'frontend/assets/images/placeholders/loa.svg',
      description: 'Âm thanh 2 đường tiếng uy lực, chống nước bụi chuẩn IP67, pin bền bỉ 12 giờ liên tục.',
      status: 'active',
      stock: 50
    },
    {
      id: 901,
      category_id: 1,
      category_name: 'Apple',
      name: 'Apple Watch Ultra 2 Titanium',
      price: 21990000,
      old_price: 23990000,
      image: 'frontend/assets/images/placeholders/dong-ho.svg',
      description: 'Vỏ titan 49mm siêu bền chuẩn quân đội, GPS băng tần kép, pin tới 72 giờ ở chế độ tiết kiệm.',
      status: 'active',
      stock: 22
    }
  ];

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
      this.initDashboard();
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
        return Array.isArray(list) ? list : DEFAULT_PRODUCTS.slice();
      } catch (e) {
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
      var newId = list.length > 0 ? Math.max.apply(Math, list.map(function (p) { return parseInt(p.id, 10) || 0; })) + 1 : 101;
      
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
      var numId = parseInt(id, 10);
      var idx = -1;
      for (var i = 0; i < list.length; i++) {
        if (parseInt(list[i].id, 10) === numId) {
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
      var numId = parseInt(id, 10);
      var filtered = list.filter(function (p) {
        return parseInt(p.id, 10) !== numId;
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
        if (!raw) {
          this.saveCategories(DEFAULT_CATEGORIES);
          return DEFAULT_CATEGORIES.slice();
        }
        var list = JSON.parse(raw);
        return Array.isArray(list) ? list : DEFAULT_CATEGORIES.slice();
      } catch (e) {
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

    updateOrderStatus: function (orderId, newStatus) {
      var list = this.getOrders();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === orderId) {
          list[i].status = newStatus;
          list[i].updated_at = new Date().toISOString();
          this.saveOrders(list);
          return list[i];
        }
      }
      return false;
    },

    deleteOrder: function (orderId) {
      var list = this.getOrders();
      var filtered = list.filter(function (o) { return o.id !== orderId; });
      this.saveOrders(filtered);
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
