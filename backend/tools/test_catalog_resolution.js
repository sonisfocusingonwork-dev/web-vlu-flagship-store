const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mock window and document
const context = {
  window: {},
  document: {
    title: '',
    querySelector: () => ({ setAttribute: () => {} }),
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  URLSearchParams: class {
    constructor() {}
    get() { return null; }
  },
  console: console
};
context.window = context;

// Load image-manifest.js
const manifestCode = fs.readFileSync(path.join(__dirname, '../../frontend/assets/js/image-manifest.js'), 'utf8');
vm.runInNewContext(manifestCode, context);

// Load products-data.js
const catalogCode = fs.readFileSync(path.join(__dirname, '../../frontend/assets/js/products-data.js'), 'utf8');
vm.runInNewContext(catalogCode, context);

console.log('✓ products-data.js loaded successfully!');
console.log('  Catalog keys:', Object.keys(context.VLU_CATALOG).length);

let catalogFailures = 0;
Object.keys(context.VLU_CATALOG).forEach(function (id) {
  const product = context.VLU_FIND_PRODUCT(id);
  if (!product || product.id !== id) {
    console.error('✗ Product ID resolved to the wrong catalog entry:', id, product && product.id);
    catalogFailures++;
    return;
  }

  const images = [product.image, product.img].concat((product.colors || []).map(function (color) {
    return color.image || color.img;
  })).filter(Boolean);
  images.forEach(function (image) {
    const imagePath = path.resolve(__dirname, '../..', decodeURIComponent(image));
    if (image.indexOf('Banner/') === 0 || !fs.existsSync(imagePath)) {
      console.error('✗ Invalid product image:', id, image);
      catalogFailures++;
    }
  });
});

const partialMatch = context.VLU_FIND_PRODUCT('iphone-18-pro-max-extra');
if (partialMatch) {
  console.error('✗ Partial product ID resolved to unrelated catalog entry:', partialMatch.id);
  catalogFailures++;
}

['iphone-18-pro', 'iphone-18-pro-max'].forEach(function (id) {
  const product = context.VLU_FIND_PRODUCT(id);
  const images = (product.colors || []).map(function (color) {
    return color.image || color.img;
  });
  if (images.length === 0 || images.some(function (image) {
    return image !== 'frontend/assets/images/placeholders/phone.svg';
  })) {
    console.error('✗ iPhone 18 Pro gallery still references incorrect model/banner images:', id, images);
    catalogFailures++;
  }
});

if (catalogFailures > 0) {
  process.exit(1);
}
console.log('✓ All catalog IDs and product image paths resolve exactly.');

const detailImage = { style: {}, src: '', alt: '' };
const thumbnailStrip = { innerHTML: '' };
const detailContext = {
  window: {
    location: { search: '?id=iphone-18-pro-max&name=iPhone%2018%20Pro%20Max&cat=dien-thoai' },
    VLU_IMAGE_MANIFEST: [],
    VLU_FIND_PRODUCT: context.VLU_FIND_PRODUCT,
    VLU_GET_COLOR_HEX: context.VLU_GET_COLOR_HEX
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  document: {
    title: '',
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: (id) => {
      if (id === 'mainProductImg') return detailImage;
      if (id === 'thumbnailStrip') return thumbnailStrip;
      return null;
    },
    addEventListener: () => {}
  },
  URLSearchParams,
  console
};
const detailCode = fs.readFileSync(path.join(__dirname, '../../frontend/assets/js/product-detail.js'), 'utf8');
vm.runInNewContext(detailCode, detailContext);
if (detailImage.src !== 'frontend/assets/images/placeholders/phone.svg') {
  console.error('✗ Product detail used an incorrect iPhone 18 image:', detailImage.src);
  process.exit(1);
}
const renderedThumbnails = thumbnailStrip.innerHTML.match(/class="thumb-btn/g) || [];
if (renderedThumbnails.length !== 1 || thumbnailStrip.innerHTML.indexOf('Banner/') !== -1) {
  console.error('✗ Product detail rendered duplicate or banner thumbnails:', thumbnailStrip.innerHTML);
  process.exit(1);
}
console.log('✓ iPhone 18 Pro Max detail renders one non-banner product placeholder.');

['product-detail.html', 'product-detail.php'].forEach(function (file) {
  const source = fs.readFileSync(path.join(__dirname, '../../', file), 'utf8');
  const mainImageMatch = source.match(/<img id="mainProductImg"[^>]*src="([^"]+)"/);
  const galleryImages = Array.from(source.matchAll(/data-(?:src|img)="([^"]+)"/g), function (match) {
    return match[1];
  });
  const templateImages = [mainImageMatch && mainImageMatch[1]].concat(galleryImages).filter(Boolean);

  if (!mainImageMatch || source.indexOf('Banner/') !== -1 || source.indexOf('SanPham/SanPham') !== -1) {
    console.error('✗ Product detail template contains a banner or invalid product image:', file);
    process.exitCode = 1;
  }
  templateImages.forEach(function (image) {
    if (!fs.existsSync(path.resolve(__dirname, '../..', decodeURIComponent(image)))) {
      console.error('✗ Product detail template references a missing image:', file, image);
      process.exitCode = 1;
    }
  });
});
if (process.exitCode === 1) process.exit(1);
console.log('✓ HTML and PHP detail templates only reference existing product images.');

const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, '../database/catalog-inventory.json'), 'utf8'));
if (inventory.categories.length !== 6 || inventory.products.length !== 115) {
  console.error('✗ Catalog inventory must contain six categories and 115 products.');
  process.exit(1);
}
console.log('✓ Catalog inventory contains six categories and all 115 products.');

// Test samples across categories
const samples = [
  'iPhone 18 Pro Max',
  'Galaxy S26 Ultra',
  'MacBook Pro 16 M5 Max',
  'ASUS ROG Strix G16',
  'iPad Pro M5',
  'AirPods Pro 3',
  'JBL Flip 7',
  'Apple Watch Ultra 3',
  'Lenovo Legion Pro 7i',
  'Soundcore Boom 3i',
  'OPPO Reno13 Pro 5G',
  'Redmi Note 14 Pro+ 5G'
];

let failed = 0;
for (const sample of samples) {
  const prod = context.VLU_FIND_PRODUCT(sample);
  if (!prod || !prod.name || !Array.isArray(prod.colors) || prod.colors.length === 0) {
    console.error('✗ Failed on:', sample);
    failed++;
  } else {
    const price = Number(prod.basePrice) || 0;
    const priceLabel = price > 0 ? `${price.toLocaleString('vi-VN')}₫` : 'Giá liên hệ';
    console.log(`  ✓ Sample: "${prod.name}" → ${priceLabel} | Colors: ${prod.colors.length} | Variants: ${prod.variants ? prod.variants.length : 1}`);
  }
}

if (failed === 0) {
  console.log('=== TẤT CẢ CÁC SẢN PHẨM TEST ĐỀU HOẠT ĐỘNG HOÀN HẢO 100%! ===');
} else {
  process.exit(1);
}
