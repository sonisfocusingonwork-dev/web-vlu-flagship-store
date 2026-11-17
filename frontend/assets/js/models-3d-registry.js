/**
 * VLU FLAGSHIP STORE – Registry mô hình 3D thực tế (Phase 1 -> Phase 4)
 *
 * QUY TẮC:
 *  - Chỉ khai báo sản phẩm ĐÃ CÓ file .glb / .gltf thực tế trong thư mục models3d/.
 *  - Tuyệt đối không dùng mô hình giả / sai hình dáng cho sản phẩm chưa có file.
 *  - Thông số trong Hotspot trích xuất hoàn toàn từ dữ liệu thực tế `product.specs` / `product.highlights`.
 *  - Exploded View chỉ bật khi mô hình có `supportsExplodedView: true` hoặc mảng `explodedParts`.
 *
 * VÍ DỤ KHAI BÁO ĐẦY ĐỦ:
 *   'iphone-18-pro-max': {
 *     url: 'models3d/iphone-18-pro-max/base.glb',
 *     draco: true,
 *     hotspots: [
 *       {
 *         id: 'camera',
 *         title: 'Cụm Camera Sau Flagship',
 *         position: [0.32, 0.56, -0.18],
 *         normal: [0, 0.15, -1],
 *         cameraPreset: 'back-camera',
 *         specKeys: ['camera', 'quay phim'],
 *         description: 'Hệ thống ống kính chụp đêm và zoom quang học đa tiêu cự.'
 *       }
 *     ],
 *     supportsExplodedView: true,
 *     explodedParts: [
 *       { meshName: 'DisplayGlass', offset: [0, 0, 0.72] },
 *       { meshName: 'LogicBoard',   offset: [0, 0.18, 0.12] },
 *       { meshName: 'BatteryCell',  offset: [0, -0.22, -0.1] },
 *       { meshName: 'RearHousing',  offset: [0, 0, -0.72] }
 *     ]
 *   }
 */
(function (window) {
  'use strict';

  var MODELS_3D = {
    'iphone-18-pro-max': {
      verified: true,
      url: 'models3d/iphone-18-pro-max/base.glb?v=7',
      draco: true,
      rotationY: Math.PI,
      exposure: 1.06,
      previewImage: 'SanPham/DienThoai/Apple/iPhone-18-Pro-Max/iPhone-18-Pro-Max-Bac.png',
      sku: ['IPHONE-18-PRO-MAX'],
      label: 'iPhone 18 Pro Max',
      attribution: 'Mô hình 3D thật · Polyman_3D (CC-BY-4.0)',
      defaultColor: 'Bạc',
      bodyMeshes: ['eshkpumnvjtrrgg', 'palettematerial001', 'palettematerial002', 'dxcvrucvyhjvxqy', 'xdyijlytyrfjffh'],
      glassMeshes: ['ozrkkornzkufngd', 'yhcaxngcjwcqtis', 'palettematerial003', 'bcgzxjhoangdtfv'],
      accentMeshes: ['palettematerial004', 'ppwutntfzjxxcoe'],
      screenMeshes: ['pijkfzsazmcpeiu'],
      colorMaterials: {
        'Bạc': { hex: '#d8dad8', metalness: 0.85, roughness: 0.24, glassHex: '#d4d6d4', glassMetalness: 0.14, glassRoughness: 0.42, accentHex: '#9ba1aa', accentMetalness: 0.92, accentRoughness: 0.16, screenTheme: 'silver', clearMap: true },
        'Đen': { hex: '#282a2e', metalness: 0.82, roughness: 0.28, glassHex: '#1c1d20', glassMetalness: 0.12, glassRoughness: 0.44, accentHex: '#3f434a', accentMetalness: 0.88, accentRoughness: 0.22, screenTheme: 'black', clearMap: true },
        'Đỏ':  { hex: '#6e2835', metalness: 0.80, roughness: 0.26, glassHex: '#4f1e28', glassMetalness: 0.12, glassRoughness: 0.42, accentHex: '#963b4d', accentMetalness: 0.90, accentRoughness: 0.20, screenTheme: 'red', clearMap: true },
        'Xám': { hex: '#8e9db3', metalness: 0.84, roughness: 0.25, glassHex: '#7d8ea6', glassMetalness: 0.14, glassRoughness: 0.42, accentHex: '#5f6f85', accentMetalness: 0.90, accentRoughness: 0.18, screenTheme: 'gray', clearMap: true }
      },
      detailPresets: {
        'front':       { label: 'Mặt trước',        dir: [0, 0.04, 1],        dist: 0.78, target: [0, 0, 0] },
        'back-camera': { label: 'Mặt sau & Camera', dir: [0, 0.14, -1],       dist: 0.68, target: [0, 0.42, 0] },
        'side':        { label: 'Cạnh viền',        dir: [1, 0.06, 0.16],     dist: 0.72, target: [0, 0.04, 0] },
        'ports':       { label: 'Cổng & Loa',       dir: [0.06, -0.58, 0.85], dist: 0.62, target: [0, -0.78, 0] }
      },
      hotspots: [
        {
          id: 'display',
          title: 'Màn hình OLED 120Hz ProMotion',
          position: [-0.36, 0.62, 0.085],
          normal: [0, 0, 1],
          cameraPreset: 'front',
          specKeys: ['màn hình', 'vi xử lý'],
          description: 'Màn hình OLED 120Hz ProMotion viền siêu mỏng kết hợp Dynamic Island.'
        },
        {
          id: 'chip',
          title: 'Vi xử lý Apple A20 Pro (2nm)',
          position: [0.36, -0.58, 0.085],
          normal: [0, 0, 1],
          cameraPreset: 'front',
          specKeys: ['vi xử lý', 'hệ điều hành'],
          description: 'Kiến trúc Apple A20 Pro tiến trình 2nm tối ưu hiệu năng xử lý và tác vụ AI.'
        },
        {
          id: 'camera',
          title: 'Hệ thống Camera Flagship',
          position: [-0.08, 0.80, -0.095],
          normal: [0, 0, -1],
          cameraPreset: 'back-camera',
          specKeys: ['camera'],
          description: 'Cụm camera chuyên nghiệp gồm 3 ống kính, Flash LED và cảm biến LiDAR.'
        },
        {
          id: 'battery-ports',
          title: 'Pin & Cổng sạc USB-C',
          position: [0, -0.98, 0.01],
          normal: [0, -1, 0.15],
          cameraPreset: 'ports',
          specKeys: ['pin', 'bảo hành'],
          description: 'Cổng kết nối USB-C và hệ thống loa ngoài đặt tại cạnh đáy thân máy.'
        }
      ],
      supportsExplodedView: true,
      explodedParts: [
        // Lớp 1: Màn hình OLED & Dynamic Island (trượt ra trước +Z)
        { meshName: 'xXDHkMplTIDAXLN', layerLabel: 'Màn hình OLED', offset: [0, 0, 0.36] },
        { meshName: 'vELORlCJixqPHsZ', layerLabel: 'Viền màn hình', offset: [0, 0, 0.36] },
        { meshName: 'DjdhycfQYjKMDyn', layerLabel: 'Dynamic Island', offset: [0, 0, 0.36] },
        { meshName: 'usFLmqcyrnltBUr', layerLabel: 'Camera trước', offset: [0, 0, 0.36] },
        { meshName: 'EbQGKrWAqhBHiMv', layerLabel: 'Khung camera trước', offset: [0, 0, 0.36] },
        // Lớp 2: Khung viền Titan Unibody & Nút bấm (giữ ở tâm)
        { meshName: 'GuYJryuYunhpphO', layerLabel: 'Khung Titan Unibody', offset: [0, 0, 0] },
        { meshName: 'buRWvyqhBBgcJFo', layerLabel: 'Vành thân máy', offset: [0, 0, 0] },
        { meshName: 'MrMmlCAsAxJpYqQ_0', layerLabel: 'Đai sườn máy', offset: [0, 0, 0] },
        { meshName: 'DjsDkGiopeiEJZK', layerLabel: 'Viền cạnh bên', offset: [0, 0, 0] },
        { meshName: 'ttmRoLdJipiIOmf', layerLabel: 'Gioăng khung', offset: [0, 0, 0] },
        { meshName: 'pvdHknDTGDzVpwc', layerLabel: 'Nút bấm hông', offset: [0, 0, 0] },
        { meshName: 'CfghdUoyzvwzIum', layerLabel: 'Viền nút bấm', offset: [0, 0, 0] },
        // Lớp 3: Mặt lưng kính mờ & Logo Apple (tách ra sau -Z)
        { meshName: 'wLfSXtbwRlBrwof', layerLabel: 'Kính lưng mờ', offset: [0, 0, -0.30] },
        { meshName: 'WJwwVjsahIXbJpU', layerLabel: 'Viền kính lưng', offset: [0, 0, -0.30] },
        { meshName: 'TakBsdEjEytCAMK', layerLabel: 'Bệ kính sau', offset: [0, 0, -0.30] },
        { meshName: 'IykfmVvLplTsTEW', layerLabel: 'Logo Apple', offset: [0, 0, -0.30] },
        { meshName: 'YfrJNXgMvGOAfzz', layerLabel: 'Tấm nền lưng', offset: [0, 0, -0.30] },
        // Lớp 4: Cụm Camera 3 ống kính, Flash & LiDAR (tách xa ra sau -Z, nhích lên +Y)
        { meshName: 'EddVrWkqZTlvmci', layerLabel: 'Mặt kính cụm Camera', offset: [0, 0.14, -0.52] },
        { meshName: 'KSWlaxBcnPDpFCs', layerLabel: 'Thân ống kính Camera', offset: [0, 0.14, -0.52] },
        { meshName: 'DCLCbjzqejuvsqH', layerLabel: 'Cảm biến LiDAR', offset: [0, 0.14, -0.52] },
        { meshName: 'CdalkzDVnwgdEhS', layerLabel: 'Cụm thấu kính 3 mắt', offset: [0, 0.14, -0.52] },
        { meshName: 'NtjcIgolNGgYlCg', layerLabel: 'Vành viền kim loại Camera', offset: [0, 0.14, -0.52] },
        { meshName: 'pXBNoLiaMwsDHRF', layerLabel: 'Micro thu âm sau', offset: [0, 0.14, -0.52] },
        { meshName: 'IkoiNqATMVoZFKD', layerLabel: 'Đèn Flash True Tone', offset: [0, 0.14, -0.52] },
        { meshName: 'rqgRAGHOwnuBypi', layerLabel: 'Kính bảo vệ đèn Flash', offset: [0, 0.14, -0.52] },
        // Lớp 5: Cụm cổng sạc USB-C & Hệ thống loa đáy (hạ xuống -Y)
        { meshName: 'wqbHSzWaUxBCwxY_0', layerLabel: 'Khung cổng USB-C', offset: [0, -0.24, 0] },
        { meshName: 'QvGDcbDApaGssma', layerLabel: 'Vỏ cổng sạc đáy', offset: [0, -0.24, 0] },
        { meshName: 'vFwJFNASGvEHWhs', layerLabel: 'Chân tiếp xúc USB-C', offset: [0, -0.24, 0] },
        { meshName: 'evAxFwhaQUwXuua', layerLabel: 'Lõi kết nối USB-C', offset: [0, -0.24, 0] },
        { meshName: 'USxQiqZgxHbRvqB', layerLabel: 'Cụm loa đáy', offset: [0, -0.24, 0] },
        { meshName: 'TvgBVmqNmSrFVfW', layerLabel: 'Lưới loa & Ốc đáy', offset: [0, -0.24, 0] }
      ]
    }
  };

  var CATEGORY_ARTICULATIONS = {
    'phone-foldable': {
      type: 'phone-foldable',
      label: 'Góc gập bản lề',
      min: 0,
      max: 180,
      step: 1,
      defaultValue: 180,
      unit: '°',
      presets: [
        { key: 'folded', label: 'Gập máy (0°)', value: 0 },
        { key: 'flex',   label: 'Flex Mode (90°)', value: 90 },
        { key: 'open',   label: 'Mở hoàn toàn (180°)', value: 180 }
      ]
    },
    'laptop': {
      type: 'laptop',
      label: 'Góc mở màn hình',
      min: 0,
      max: 135,
      step: 1,
      defaultValue: 115,
      unit: '°',
      presets: [
        { key: 'closed', label: 'Đóng nắp (0°)', value: 0 },
        { key: 'work',   label: 'Góc làm việc (115°)', value: 115 },
        { key: 'max',    label: 'Mở tối đa (135°)', value: 135 }
      ]
    },
    'earbuds': {
      type: 'earbuds',
      label: 'Tương tác hộp sạc',
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      unit: '%',
      statusBadges: [
        { max: 15,  text: 'Đóng hộp' },
        { max: 79,  text: 'Mở nắp {value}%' },
        { max: 100, text: 'Đã tách rời' }
      ],
      presets: [
        { key: 'closed',    label: 'Đóng hộp sạc', value: 0 },
        { key: 'open',      label: 'Mở nắp hộp sạc', value: 50 },
        { key: 'separated', label: 'Tách tai nghe & hộp sạc', value: 100 }
      ]
    },
    'watch': {
      type: 'watch',
      label: 'Góc dây đeo & quan sát',
      min: 0,
      max: 90,
      step: 1,
      defaultValue: 0,
      unit: '°',
      presets: [
        { key: 'face',   label: 'Mặt đồng hồ', value: 0, cameraPreset: 'front' },
        { key: 'sensor', label: 'Cảm biến mặt sau', value: 25, cameraPreset: 'back-camera' },
        { key: 'strap',  label: 'Mở rộng dây đeo', value: 90 }
      ]
    }
  };

  function norm(v) {
    return String(v == null ? '' : v).trim().toLowerCase();
  }

  /** Chuẩn hoá khóa màu / từ khóa không dấu. */
  function normColor(v) {
    var s = String(v == null ? '' : v).toLowerCase();
    try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    return s.replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  var ADMIN_MODELS_STORAGE_KEY = 'vlu_admin_models_3d';

  /** Chuẩn hoá và kiểm tra an toàn đường dẫn file mô hình 3D nội bộ trong thư mục `models3d/`. */
  function normalizeSafeModelPath(url) {
    var u = String(url == null ? '' : url).trim().replace(/^\.\//, '');
    if (!u || /[\r\n\t\u0000-\u001F]/.test(u)) return '';
    if (/^(?:[a-z][a-z0-9+\-.]*:|\/\/|\/|\\)/i.test(u)) return '';
    if (u.indexOf('\\') !== -1) return '';
    var pathOnly = u.split(/[?#]/)[0];
    if (pathOnly.split('/').some(function (seg) { return seg === '..' || seg === '.'; })) return '';
    if (!/^models3d\/.+\.(?:glb|gltf)$/i.test(pathOnly)) return '';
    return u;
  }

  function isSafeLocalUrl(url) {
    return Boolean(normalizeSafeModelPath(url));
  }

  function clamp01(n, fallback) {
    var x = Number(n);
    if (!isFinite(x)) return fallback;
    return Math.min(1, Math.max(0, x));
  }

  function buildColorModels(raw) {
    var out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach(function (name) {
      var url = typeof raw[name] === 'string' ? raw[name] : (raw[name] && raw[name].url);
      if (!isSafeLocalUrl(url)) return;
      out[normColor(name)] = { name: name, url: String(url).trim() };
    });
    return out;
  }

  function buildColorMaterials(raw, bodyMeshes) {
    var out = {};
    if (!raw || typeof raw !== 'object' || !bodyMeshes.length) return out;
    Object.keys(raw).forEach(function (name) {
      var spec = raw[name];
      if (!spec || !/^#[0-9a-f]{6}$/i.test(String(spec.hex || ''))) return;
      out[normColor(name)] = {
        name: name,
        material: {
          hex: String(spec.hex),
          metalness: spec.metalness == null ? null : clamp01(spec.metalness, null),
          roughness: spec.roughness == null ? null : clamp01(spec.roughness, null),
          clearMap: Boolean(spec.clearMap),
          glassHex: /^#[0-9a-f]{6}$/i.test(String(spec.glassHex || '')) ? String(spec.glassHex) : null,
          glassMetalness: spec.glassMetalness == null ? null : clamp01(spec.glassMetalness, null),
          glassRoughness: spec.glassRoughness == null ? null : clamp01(spec.glassRoughness, null),
          accentHex: /^#[0-9a-f]{6}$/i.test(String(spec.accentHex || '')) ? String(spec.accentHex) : null,
          accentMetalness: spec.accentMetalness == null ? null : clamp01(spec.accentMetalness, null),
          accentRoughness: spec.accentRoughness == null ? null : clamp01(spec.accentRoughness, null),
          screenTheme: spec.screenTheme ? String(spec.screenTheme) : ''
        }
      };
    });
    return out;
  }

  function buildPresets(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var out = {};
    Object.keys(raw).forEach(function (key) {
      var p = raw[key];
      if (p === false) { out[key] = false; return; }
      if (!p || !Array.isArray(p.dir) || p.dir.length !== 3) return;
      out[key] = {
        dir: p.dir.map(Number),
        dist: Number(p.dist) > 0 ? Number(p.dist) : 0.6,
        target: Array.isArray(p.target) && p.target.length === 3 ? p.target.map(Number) : [0, 0, 0],
        label: p.label ? String(p.label) : ''
      };
    });
    return out;
  }

  function buildArticulationParts(rawParts) {
    if (!Array.isArray(rawParts)) return [];
    var out = [];
    rawParts.forEach(function (part) {
      if (!part) return;
      var nodes = (Array.isArray(part.nodes) ? part.nodes : (part.node ? [part.node] : []))
        .map(norm).filter(Boolean);
      if (!nodes.length) return;
      var mode = part.mode === 'translate' ? 'translate' : 'rotate';
      var axis = (part.axis === 'x' || part.axis === 'y' || part.axis === 'z') ? part.axis : 'x';
      var from = Number(part.from);
      var to = Number(part.to);
      var fromVec = Array.isArray(part.fromVec) && part.fromVec.length === 3 ? part.fromVec.map(Number) : null;
      var toVec = Array.isArray(part.toVec) && part.toVec.length === 3 ? part.toVec.map(Number) : null;
      out.push({
        nodes: nodes,
        mode: mode,
        axis: axis,
        from: isFinite(from) ? from : 0,
        to: isFinite(to) ? to : 0,
        fromVec: fromVec,
        toVec: toVec,
        startT: part.startT == null ? 0 : clamp01(part.startT, 0),
        endT: part.endT == null ? 1 : clamp01(part.endT, 1),
        space: part.space === 'world' ? 'world' : 'radius'
      });
    });
    return out;
  }

  function buildArticulationConfig(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var tmpl = raw.type && CATEGORY_ARTICULATIONS[raw.type] ? CATEGORY_ARTICULATIONS[raw.type] : null;
    var min = isFinite(Number(raw.min)) ? Number(raw.min) : (tmpl ? tmpl.min : 0);
    var max = isFinite(Number(raw.max)) ? Number(raw.max) : (tmpl ? tmpl.max : 100);
    if (max <= min) max = min + 100;
    var step = Number(raw.step) > 0 ? Number(raw.step) : (tmpl ? tmpl.step : 1);
    var defVal = isFinite(Number(raw.defaultValue)) ? Number(raw.defaultValue) : (tmpl ? tmpl.defaultValue : min);
    defVal = Math.min(max, Math.max(min, defVal));

    var presetsSrc = Array.isArray(raw.presets) ? raw.presets : (tmpl ? tmpl.presets : []);
    var presets = presetsSrc.map(function (pr, idx) {
      if (!pr) return null;
      var v = isFinite(Number(pr.value)) ? Math.min(max, Math.max(min, Number(pr.value))) : min;
      return {
        key: String(pr.key || ('preset-' + idx)),
        label: String(pr.label || (v + (raw.unit || (tmpl ? tmpl.unit : '')))),
        value: v,
        cameraPreset: pr.cameraPreset ? String(pr.cameraPreset) : ''
      };
    }).filter(Boolean);

    var parts = buildArticulationParts(raw.parts);
    var clip = raw.clip ? String(raw.clip).trim() : '';
    var allowAutoClip = Boolean(clip || raw.useClip || tmpl);
    if (!parts.length && !clip && !raw.useClip && !tmpl) return null;

    var statusBadges = Array.isArray(raw.statusBadges)
      ? raw.statusBadges
      : (tmpl && Array.isArray(tmpl.statusBadges) ? tmpl.statusBadges : null);

    return {
      type: raw.type ? String(raw.type) : 'custom',
      label: String(raw.label || (tmpl ? tmpl.label : 'Tương tác bộ phận')),
      min: min,
      max: max,
      step: step,
      defaultValue: defVal,
      unit: raw.unit != null ? String(raw.unit) : (tmpl ? tmpl.unit : '%'),
      statusBadges: statusBadges,
      presets: presets,
      clip: clip,
      useClip: allowAutoClip,
      parts: parts
    };
  }

  function normalizeVector3(rawVec, fallback) {
    var fb = (Array.isArray(fallback) && fallback.length === 3) ? fallback : [0, 0, 1];
    var flen = Math.sqrt(fb[0] * fb[0] + fb[1] * fb[1] + fb[2] * fb[2]);
    var unitFb = flen >= 1e-6 ? [fb[0] / flen, fb[1] / flen, fb[2] / flen] : [0, 0, 1];
    if (!Array.isArray(rawVec) || rawVec.length !== 3) return unitFb;
    var x = Number(rawVec[0]), y = Number(rawVec[1]), z = Number(rawVec[2]);
    if (!isFinite(x) || !isFinite(y) || !isFinite(z)) return unitFb;
    var len = Math.sqrt(x * x + y * y + z * z);
    if (len < 1e-6) return unitFb;
    return [x / len, y / len, z / len];
  }

  function buildHotspots(rawHotspots) {
    if (!Array.isArray(rawHotspots)) return [];
    var out = [];
    rawHotspots.forEach(function (hs, idx) {
      if (!hs || !Array.isArray(hs.position) || hs.position.length !== 3) return;
      var px = Number(hs.position[0]), py = Number(hs.position[1]), pz = Number(hs.position[2]);
      if (!isFinite(px) || !isFinite(py) || !isFinite(pz)) return;
      var hasNormal = Array.isArray(hs.normal) && hs.normal.length === 3;
      var normal = normalizeVector3(hasNormal ? hs.normal : [px, py, pz], [0, 0.15, 1]);
      var focusTarget = (Array.isArray(hs.focusTarget) && hs.focusTarget.length === 3)
        ? hs.focusTarget.map(Number)
        : null;
      out.push({
        id: String(hs.id || ('hotspot-' + (idx + 1))),
        title: String(hs.title || ('Chi tiết ' + (idx + 1))),
        position: [px, py, pz],
        normal: normal,
        specKeys: Array.isArray(hs.specKeys) ? hs.specKeys.map(function (k) { return String(k || '').trim(); }).filter(Boolean) : [],
        description: String(hs.description || ''),
        cameraPreset: hs.cameraPreset ? String(hs.cameraPreset).trim() : '',
        focusTarget: focusTarget,
        focusDist: Number(hs.focusDist) > 0 ? Number(hs.focusDist) : 0.62
      });
    });
    return out;
  }

  function buildExplodedParts(rawParts) {
    if (!Array.isArray(rawParts)) return [];
    var out = [];
    rawParts.forEach(function (pt) {
      if (!pt || !pt.meshName || !Array.isArray(pt.offset) || pt.offset.length !== 3) return;
      var ox = Number(pt.offset[0]), oy = Number(pt.offset[1]), oz = Number(pt.offset[2]);
      if (!isFinite(ox) || !isFinite(oy) || !isFinite(oz)) return;
      out.push({
        meshName: norm(pt.meshName),
        offset: [ox, oy, oz],
        layerLabel: pt.layerLabel ? String(pt.layerLabel) : ''
      });
    });
    return out;
  }

  /**
   * Trích xuất thông số thực tế của sản phẩm cho một Hotspot từ `product.specs` & `product.highlights`.
   * Không bao giờ tự tạo thông số giả không tồn tại trong catalog.
   */
  function extractHotspotSpecs(product, specKeys) {
    if (!product) return [];
    var wanted = (Array.isArray(specKeys) ? specKeys : []).map(normColor).filter(Boolean);
    var results = [];
    var seen = {};

    function addSpec(label, val) {
      var l = String(label || '').trim();
      var v = String(val || '').trim();
      if (!l || !v) return;
      var keyNorm = l.toLowerCase() + '::' + v.toLowerCase();
      if (seen[keyNorm]) return;
      seen[keyNorm] = true;
      results.push({ label: l, value: v });
    }

    function matchesKey(candidateLabel) {
      if (!wanted.length) return true;
      var cand = normColor(candidateLabel);
      return wanted.some(function (w) {
        return cand.indexOf(w) !== -1 || w.indexOf(cand) !== -1;
      });
    }

    (product.specs || []).forEach(function (pair) {
      if (!pair) return;
      var k = Array.isArray(pair) ? pair[0] : pair.label;
      var v = Array.isArray(pair) ? pair[1] : pair.value;
      if (k && v && matchesKey(k)) {
        addSpec(k, v);
      }
    });

    (product.highlights || []).forEach(function (hl) {
      if (!hl || !hl.title || !hl.value) return;
      if (matchesKey(hl.title) || matchesKey(hl.icon || '')) {
        addSpec(hl.title, hl.value);
      }
    });

    if (!results.length && wanted.length) {
      if (wanted.some(function (w) { return w.indexOf('mau') !== -1 || w.indexOf('thiet ke') !== -1; }) && Array.isArray(product.colors) && product.colors.length) {
        addSpec('Màu sắc chính hãng', product.colors.map(function (c) { return c.name; }).filter(Boolean).join(', '));
      }
      if (wanted.some(function (w) { return w.indexOf('bo nho') !== -1 || w.indexOf('dung luong') !== -1 || w.indexOf('luu tru') !== -1; }) && Array.isArray(product.variants) && product.variants.length) {
        addSpec(product.variantLabel || 'Phiên bản', product.variants.map(function (v) { return v.label; }).filter(Boolean).join(' / '));
      }
    }

    return results.slice(0, 4);
  }

  function readAdminModels3D() {
    var out = {};
    try {
      if (!window.localStorage) return out;
      var raw = window.localStorage.getItem(ADMIN_MODELS_STORAGE_KEY);
      if (!raw) return out;
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(function (item) {
          if (!item || typeof item !== 'object') return;
          var key = norm(item.productId || item.id || item.sku);
          if (key) out[key] = item;
        });
      } else if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach(function (k) {
          var item = parsed[k];
          if (!item || typeof item !== 'object') return;
          var cleanKey = norm(k);
          if (cleanKey) out[cleanKey] = item;
        });
      }
    } catch (e) {}
    return out;
  }

  function findStaticEntry(product) {
    if (!product) return null;
    var id = norm(product.id);
    if (id && MODELS_3D[id]) return MODELS_3D[id];

    var skus = [product.sku, product.baseSku].map(norm).filter(Boolean);
    var matched = null;
    Object.keys(MODELS_3D).some(function (key) {
      var cfg = MODELS_3D[key];
      if (!cfg) return false;
      var list = Array.isArray(cfg.sku) ? cfg.sku.map(norm) : (cfg.sku ? [norm(cfg.sku)] : []);
      if (skus.some(function (s) { return list.indexOf(s) !== -1; })) {
        matched = cfg;
        return true;
      }
      return false;
    });
    return matched;
  }

  function findAdminEntry(product, adminMap) {
    if (!product || !adminMap) return null;
    var id = norm(product.id);
    if (id && adminMap[id]) return adminMap[id];

    var skus = [product.sku, product.baseSku].map(norm).filter(Boolean);
    for (var i = 0; i < skus.length; i++) {
      if (adminMap[skus[i]]) return adminMap[skus[i]];
    }

    var found = null;
    Object.keys(adminMap).some(function (k) {
      var item = adminMap[k];
      if (!item) return false;
      var itemId = norm(item.productId || item.id);
      var itemSku = norm(item.sku);
      if ((id && itemId === id) || (itemSku && skus.indexOf(itemSku) !== -1)) {
        found = item;
        return true;
      }
      return false;
    });
    return found;
  }

  function getAdminModel3DEntry(productOrId, skuOpt) {
    var prod = (productOrId && typeof productOrId === 'object')
      ? productOrId
      : { id: productOrId, sku: skuOpt || '' };
    var staticEntry = findStaticEntry(prod);
    var adminEntry = findAdminEntry(prod, readAdminModels3D());
    if (!staticEntry && !adminEntry) return null;
    var merged = Object.assign({}, staticEntry || {}, adminEntry || {});
    var rawUrl = (adminEntry && (adminEntry.modelUrl || adminEntry.url)) || (staticEntry && (staticEntry.modelUrl || staticEntry.url)) || '';
    var has3D = adminEntry && typeof adminEntry.has3D === 'boolean'
      ? adminEntry.has3D
      : Boolean(staticEntry && staticEntry.has3D !== false && isSafeLocalUrl(rawUrl));
    return {
      productId: String((adminEntry && adminEntry.productId) || prod.id || ''),
      sku: String((adminEntry && adminEntry.sku) || prod.sku || prod.baseSku || ''),
      has3D: has3D,
      verified: Boolean((adminEntry && typeof adminEntry.verified === 'boolean') ? adminEntry.verified : (staticEntry && staticEntry.verified === true)),
      modelUrl: normalizeSafeModelPath(rawUrl) || String(rawUrl || '').trim(),
      previewImage: String(merged.previewImage || ''),
      supportsExplodedView: Boolean(merged.supportsExplodedView === true || (Array.isArray(merged.explodedParts) && merged.explodedParts.length > 0))
    };
  }

  function saveAdminModel3DEntry(productId, cfg) {
    if (!productId || !cfg || typeof cfg !== 'object') return false;
    var idKey = norm(productId);
    if (!idKey) return false;
    var safeUrl = normalizeSafeModelPath(cfg.modelUrl || cfg.url || '');
    var hasValidUrl = Boolean(safeUrl);
    if ((cfg.modelUrl || cfg.url) && !hasValidUrl) return false;
    var map = readAdminModels3D();
    map[idKey] = {
      productId: String(productId),
      sku: cfg.sku ? String(cfg.sku).trim() : '',
      has3D: Boolean(cfg.has3D && hasValidUrl),
      verified: Boolean(cfg.verified === true && hasValidUrl),
      modelUrl: safeUrl,
      supportsExplodedView: Boolean(cfg.supportsExplodedView),
      updatedAt: new Date().toISOString()
    };
    try {
      if (window.localStorage) {
        window.localStorage.setItem(ADMIN_MODELS_STORAGE_KEY, JSON.stringify(map));
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Kiểm tra thực tế file `.glb` / `.gltf` có tồn tại trong `models3d/` hay không (chỉ đọc Header, không tải body). */
  function probeModelExists(url) {
    var safeUrl = normalizeSafeModelPath(url);
    if (!safeUrl || typeof fetch !== 'function') return Promise.resolve(false);
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 4000) : null;
    return fetch(safeUrl, { method: 'HEAD', signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) {
        if (timer) clearTimeout(timer);
        if (!res || !res.ok) return false;
        var ct = '';
        try { ct = String((res.headers && res.headers.get && res.headers.get('content-type')) || '').toLowerCase(); } catch (e) {}
        return ct.indexOf('text/html') === -1;
      })
      .catch(function () {
        if (timer) clearTimeout(timer);
        return false;
      });
  }

  function isValidSketchfabUid(uid) {
    return /^[a-f0-9]{32}$/i.test(String(uid || '').trim());
  }

  function buildColorSketchfabUids(raw) {
    var out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach(function (name) {
      var uid = String(raw[name] || '').trim();
      if (!isValidSketchfabUid(uid)) return;
      out[normColor(name)] = { name: name, uid: uid };
    });
    return out;
  }

  /** Trả về cấu hình mô hình 3D hợp lệ & đã kiểm duyệt (`verified: true`), hoặc null nếu tắt / chưa đạt chuẩn. */
  function getModel3D(product) {
    if (!product) return null;
    var staticEntry = findStaticEntry(product);
    var adminEntry = findAdminEntry(product, readAdminModels3D());

    if (adminEntry && adminEntry.has3D === false) return null;
    if (!adminEntry && (!staticEntry || staticEntry.has3D === false)) return null;

    var staticRawUrl = staticEntry ? (staticEntry.modelUrl || staticEntry.url || '') : '';
    var adminRawUrl = adminEntry ? (adminEntry.modelUrl || adminEntry.url || '') : '';
    var rawUrl = adminRawUrl || staticRawUrl;
    var cleanUrl = normalizeSafeModelPath(rawUrl);

    var adminChangedUrl = Boolean(adminRawUrl && staticRawUrl && norm(adminRawUrl) !== norm(staticRawUrl));
    var base = (!adminChangedUrl && staticEntry) ? staticEntry : {};
    var entry = Object.assign({}, base, adminEntry || {});

    var sfUid = isValidSketchfabUid(entry.sketchfabUid) ? String(entry.sketchfabUid).trim() : '';
    var isSketchfab = Boolean(sfUid && !cleanUrl);
    if (!cleanUrl && !isSketchfab) return null;

    var isVerified = (adminEntry && typeof adminEntry.verified === 'boolean')
      ? adminEntry.verified === true
      : Boolean(base && base.verified === true);
    if (!isVerified) return null;

    var bodyMeshes = (Array.isArray(entry.bodyMeshes) ? entry.bodyMeshes : []).map(norm).filter(Boolean);
    var glassMeshes = (Array.isArray(entry.glassMeshes) ? entry.glassMeshes : []).map(norm).filter(Boolean);
    var accentMeshes = (Array.isArray(entry.accentMeshes) ? entry.accentMeshes : []).map(norm).filter(Boolean);
    var screenMeshes = (Array.isArray(entry.screenMeshes) ? entry.screenMeshes : []).map(norm).filter(Boolean);
    var explodedParts = isSketchfab ? [] : buildExplodedParts(entry.explodedParts);
    var supportsExplodedView = isSketchfab
      ? false
      : ((adminEntry && typeof adminEntry.supportsExplodedView === 'boolean')
          ? Boolean(adminEntry.supportsExplodedView || explodedParts.length > 0)
          : Boolean(entry.supportsExplodedView === true || explodedParts.length > 0));

    return {
      engine: isSketchfab ? 'sketchfab' : 'glb',
      url: cleanUrl,
      sketchfabUid: sfUid,
      colorSketchfabUids: buildColorSketchfabUids(entry.colorSketchfabUids),
      attribution: entry.attribution ? String(entry.attribution) : '',
      verified: true,
      previewImage: String(entry.previewImage || product.image || ''),
      has3D: true,
      sku: String((adminEntry && adminEntry.sku) || product.sku || product.baseSku || ''),
      source: adminEntry && staticEntry ? 'admin+static' : (adminEntry ? 'admin' : 'static'),
      draco: Boolean(entry.draco),
      scale: Number(entry.scale) > 0 ? Number(entry.scale) : 1,
      rotationY: Number(entry.rotationY) || 0,
      exposure: Number(entry.exposure) > 0 ? Number(entry.exposure) : 1.12,
      label: entry.label || product.name || 'Sản phẩm',
      bodyMeshes: bodyMeshes,
      glassMeshes: glassMeshes,
      accentMeshes: accentMeshes,
      screenMeshes: screenMeshes,
      colorModels: buildColorModels(entry.colorModels),
      colorMaterials: buildColorMaterials(entry.colorMaterials, bodyMeshes),
      detailPresets: buildPresets(entry.detailPresets),
      articulation: buildArticulationConfig(entry.articulation),
      hotspots: buildHotspots(entry.hotspots),
      supportsExplodedView: supportsExplodedView,
      explodedParts: explodedParts
    };
  }

  /** Tìm cấu hình 3D tương ứng một màu (theo tên hoặc key). Trả về null nếu màu chưa có model/vật liệu 3D. */
  function resolveColor(model, colorName, colorKey) {
    if (!model) return null;
    var keys = [normColor(colorName), normColor(colorKey)].filter(Boolean);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (model.colorSketchfabUids && model.colorSketchfabUids[k]) {
        return { kind: 'sketchfab', name: model.colorSketchfabUids[k].name, uid: model.colorSketchfabUids[k].uid };
      }
      if (model.colorModels && model.colorModels[k]) {
        return { kind: 'model', name: model.colorModels[k].name, url: model.colorModels[k].url };
      }
      if (model.colorMaterials && model.colorMaterials[k]) {
        return { kind: 'material', name: model.colorMaterials[k].name, material: model.colorMaterials[k].material };
      }
    }
    return null;
  }

  /** Danh sách màu của sản phẩm thực sự có model/vật liệu 3D (dùng cho #pd3dColorStrip). */
  function getColorOptions(product, model) {
    if (!product || !model) return [];
    var out = [];
    (product.colors || []).forEach(function (c) {
      if (!c) return;
      var res = resolveColor(model, c.name, c.key);
      if (!res) return;
      var fallbackHex = typeof window.VLU_GET_COLOR_HEX === 'function'
        ? window.VLU_GET_COLOR_HEX(c.name, c.key)
        : '#7D7E80';
      out.push({
        name: c.name,
        key: c.key || '',
        hex: c.hex || (res.material && res.material.hex) || fallbackHex
      });
    });
    return out;
  }

  window.VLU_MODELS_3D = MODELS_3D;
  window.VLU_3D_ADMIN_STORAGE_KEY = ADMIN_MODELS_STORAGE_KEY;
  window.VLU_3D_ARTICULATION_PRESETS = CATEGORY_ARTICULATIONS;
  window.VLU_READ_ADMIN_MODELS_3D = readAdminModels3D;
  window.VLU_GET_ADMIN_MODEL_3D = getAdminModel3DEntry;
  window.VLU_SAVE_ADMIN_MODEL_3D = saveAdminModel3DEntry;
  window.VLU_VALIDATE_3D_MODEL_PATH = isSafeLocalUrl;
  window.VLU_NORMALIZE_3D_MODEL_PATH = normalizeSafeModelPath;
  window.VLU_PROBE_3D_MODEL = probeModelExists;
  window.VLU_GET_MODEL_3D = getModel3D;
  window.VLU_RESOLVE_3D_COLOR = resolveColor;
  window.VLU_GET_3D_COLOR_OPTIONS = getColorOptions;
  window.VLU_EXTRACT_HOTSPOT_SPECS = extractHotspotSpecs;
})(window);
