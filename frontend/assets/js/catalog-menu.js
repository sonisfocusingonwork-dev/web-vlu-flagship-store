(function (window, document) {
  'use strict';

  var categories = [
    { id: 'dien-thoai', name: 'Điện thoại' },
    { id: 'laptop', name: 'Laptop' },
    { id: 'ipad', name: 'iPad' },
    { id: 'tai-nghe', name: 'Tai nghe' },
    { id: 'loa', name: 'Loa' },
    { id: 'dong-ho-dien-tu', name: 'Đồng hồ điện tử' }
  ];

  function productHref(product) {
    return 'product-detail.html?id=' + encodeURIComponent(product.id) +
      '&name=' + encodeURIComponent(product.name) +
      '&cat=' + encodeURIComponent(product.category);
  }

  function render() {
    var catalog = window.VLU_CATALOG;
    if (!catalog) {
      console.error('[CatalogMenu] Không thể đồng bộ menu: catalog chưa được tải.');
      return;
    }
    var products = Object.keys(catalog).map(function (id) { return catalog[id]; });
    var navList = document.querySelector('.nav-list');
    if (navList) {
      var navById = {};
      Array.prototype.forEach.call(navList.querySelectorAll('.nav-item-mega'), function (item) {
        navById[item.id.replace(/^menuItem-/, '')] = item;
      });
      categories.forEach(function (category) {
        var item = navById[category.id];
        if (!item) return;
        navList.appendChild(item);
        var panel = item.querySelector('.mega-panel');
        var menuContent = panel && panel.querySelector('.mega-menu-scroll .mx-auto');
        var grid = menuContent && Array.prototype.find.call(menuContent.children, function (child) {
          return /\bgrid\b/.test(child.className) || child.classList.contains('mega-grid-flow');
        });
        if (!grid) {
          console.error('[CatalogMenu] Không tìm thấy lưới sản phẩm trong menu:', category.id);
          return;
        }
        grid.textContent = '';
        var groups = [];
        products.filter(function (product) { return product.category === category.id; }).forEach(function (product) {
          var groupName = product.menuGroup || product.brand;
          var group = groups.find(function (entry) { return entry.name === groupName; });
          if (!group) {
            group = { name: groupName, products: [] };
            groups.push(group);
          }
          group.products.push(product);
        });
        groups.forEach(function (group) {
          var column = document.createElement('div');
          var title = document.createElement('h4');
          var list = document.createElement('ul');
          column.className = 'mega-brand-col';
          title.className = 'text-xs font-extrabold text-slate-900 pb-2 mb-2.5 border-b border-slate-200/80 leading-tight';
          title.textContent = group.name;
          list.className = 'space-y-0.5';
          group.products.forEach(function (product) {
            var row = document.createElement('li');
            var link = document.createElement('a');
            link.className = 'mega-item-link';
            link.href = productHref(product);
            link.title = product.name;
            link.textContent = product.name;
            row.appendChild(link);
            list.appendChild(row);
          });
          column.appendChild(title);
          column.appendChild(list);
          grid.appendChild(column);
        });
      });
      Object.keys(navById).forEach(function (id) {
        if (!categories.some(function (category) { return category.id === id; })) navById[id].remove();
      });
    }

    var mobileDrawer = document.getElementById('mobileDrawer');
    if (!mobileDrawer) return;
    var mobileByName = {};
    Array.prototype.forEach.call(mobileDrawer.querySelectorAll('.mobile-brand-card'), function (card) {
      var button = card.querySelector('button');
      if (button) mobileByName[button.textContent.trim()] = card;
    });
    categories.forEach(function (category) {
      var card = mobileByName[category.name];
      var body = card && card.querySelector('.mobile-accordion-body');
      if (!body) return;
      body.textContent = '';

      var viewAllLink = document.createElement('a');
      viewAllLink.className = 'flex items-center justify-between rounded-xl bg-brand/10 px-3 py-2 text-xs font-extrabold text-brand hover:bg-brand hover:text-white transition';
      viewAllLink.href = 'category.html?cat=' + encodeURIComponent(category.id);
      viewAllLink.innerHTML = '<span>Xem tất cả ' + category.name + '</span><span>→</span>';
      body.appendChild(viewAllLink);

      var groups = [];
      products.filter(function (product) { return product.category === category.id; }).forEach(function (product) {
        var groupName = product.menuGroup || product.brand;
        var group = groups.find(function (entry) { return entry.name === groupName; });
        if (!group) {
          group = { name: groupName, products: [] };
          groups.push(group);
        }
        group.products.push(product);
      });
      groups.forEach(function (group) {
        var section = document.createElement('div');
        var title = document.createElement('p');
        section.className = 'pl-2.5 border-l-2 border-slate-200';
        title.className = 'text-xs font-black text-slate-800 mb-0.5';
        title.textContent = group.name;
        section.appendChild(title);
        group.products.forEach(function (product) {
          var link = document.createElement('a');
          link.className = 'block py-1 text-xs font-semibold text-slate-700 hover:text-brand';
          link.href = productHref(product);
          link.textContent = product.name;
          section.appendChild(link);
        });
        body.appendChild(section);
      });
    });
  }

  window.VLU_RENDER_CATALOG_MENUS = render;
  render();
})(window, document);
