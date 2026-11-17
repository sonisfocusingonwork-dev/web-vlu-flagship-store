/**
 * VLU FLAGSHIP STORE – Product 3D Viewer (Phase 1 -> Phase 4)
 * Module độc lập quản lý toàn bộ vòng đời WebGL canvas cho trang Chi tiết sản phẩm.
 *
 * API công khai (window.VLU_3D_VIEWER):
 *   create(options) -> instance
 *   options: {
 *     host, hotspotHost, model, onProgress(pct), onReady(), onError(err),
 *     onStateChange({autoRotate, preset, hotspotsVisible, activeHotspotId, explodePct}),
 *     onArticulationChange({value, t, activePresetKey, badgeText}),
 *     onHotspotSelect(hotspotObj | null)
 *   }
 *   instance: load, start, pause, resize, zoomIn, zoomOut, resetView,
 *             setColor(resolved), setAutoRotate(on), toggleAutoRotate, isAutoRotate,
 *             getPresets, goToPreset(key),
 *             getArticulationSpec, getArticulationValue, setArticulationValue(val, opts),
 *             goToArticulationPreset(key),
 *             getHotspots, toggleHotspots(force), areHotspotsVisible, focusHotspot(id),
 *             supportsExplodedView, setExplodedValue(pct, opts), getExplodedValue,
 *             dispose, isLoaded, isDisposed
 */
(function (window, document) {
  'use strict';

  var THREE_VERSION = '0.160.0';
  var SOURCES = [
    {
      name: 'cdn',
      three: 'https://cdn.jsdelivr.net/npm/three@' + THREE_VERSION + '/build/three.module.js',
      addons: 'https://cdn.jsdelivr.net/npm/three@' + THREE_VERSION + '/examples/jsm/',
      draco: 'https://cdn.jsdelivr.net/npm/three@' + THREE_VERSION + '/examples/jsm/libs/draco/gltf/'
    },
    {
      name: 'local',
      three: './frontend/assets/vendor/three/build/three.module.js',
      addons: './frontend/assets/vendor/three/examples/jsm/',
      draco: 'frontend/assets/vendor/three/examples/jsm/libs/draco/gltf/'
    }
  ];

  var DEFAULT_PRESETS = [
    { key: 'overview',    label: 'Tổng thể',   title: 'Tổng thể (Overview)' },
    { key: 'front',       label: 'Mặt trước',  title: 'Mặt trước & Màn hình', dir: [0, 0.04, 1],    dist: 0.62, target: [0, 0, 0] },
    { key: 'back-camera', label: 'Mặt sau',    title: 'Mặt sau & Camera',     dir: [0, 0.12, -1],   dist: 0.55, target: [0, 0.28, 0] },
    { key: 'side',        label: 'Cạnh viền',  title: 'Cạnh viền & Nút bấm',  dir: [1, 0.08, 0.12], dist: 0.6,  target: [0, 0.1, 0] },
    { key: 'ports',       label: 'Cổng & Loa', title: 'Cổng kết nối & Loa',   dir: [0.08, -0.28, 1], dist: 0.5, target: [0, -0.8, 0] }
  ];

  var libPromise = null;
  var activeSource = null;

  function reducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function isWebGLAvailable() {
    try {
      if (!window.WebGLRenderingContext) return false;
      var c = document.createElement('canvas');
      var gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return false;
      try {
        var loseExt = gl.getExtension('WEBGL_lose_context');
        if (loseExt && typeof loseExt.loseContext === 'function') loseExt.loseContext();
      } catch (eLose) {}
      return true;
    } catch (e) {
      return false;
    }
  }
  var hasWebGL = isWebGLAvailable;

  function probe(url) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 4000) : null;
    return fetch(url, { method: 'HEAD', signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) { if (timer) clearTimeout(timer); return res.ok; })
      .catch(function () { if (timer) clearTimeout(timer); return false; });
  }

  function installImportMap(src) {
    if (document.querySelector('script[data-vlu-importmap]')) return;
    var s = document.createElement('script');
    s.type = 'importmap';
    s.setAttribute('data-vlu-importmap', src.name);
    s.textContent = JSON.stringify({ imports: { 'three': src.three, 'three/addons/': src.addons } });
    document.head.appendChild(s);
  }

  function loadLibs() {
    if (libPromise) return libPromise;
    libPromise = (function pick(i) {
      if (i >= SOURCES.length) return Promise.reject(new Error('Không thể nạp thư viện Three.js (CDN và bản cục bộ đều lỗi).'));
      var src = SOURCES[i];
      return probe(src.three).then(function (ok) {
        if (!ok) return pick(i + 1);
        installImportMap(src);
        activeSource = src;
        return Promise.all([
          import('three'),
          import('three/addons/controls/OrbitControls.js'),
          import('three/addons/loaders/GLTFLoader.js'),
          import('three/addons/loaders/DRACOLoader.js'),
          import('three/addons/environments/RoomEnvironment.js')
        ]).then(function (mods) {
          return {
            THREE: mods[0],
            OrbitControls: mods[1].OrbitControls,
            GLTFLoader: mods[2].GLTFLoader,
            DRACOLoader: mods[3].DRACOLoader,
            RoomEnvironment: mods[4].RoomEnvironment,
            source: src
          };
        });
      });
    })(0).catch(function (err) {
      libPromise = null;
      throw err;
    });
    return libPromise;
  }

  // ---- Phase 5: Bounded Session In-Memory GLTF Binary Cache (LRU) ------------------------------
  var MAX_CACHE_ENTRIES = 6;
  var MAX_CACHE_BYTES = 48 * 1024 * 1024;
  var MAX_INSTANCE_ROOTS = 6;
  var glbBufferCache = Object.create(null);
  var glbCacheOrder = [];
  var glbCacheBytes = 0;
  var inflightGlbFetches = Object.create(null);

  function touchCacheKey(orderArr, key) {
    var idx = orderArr.indexOf(key);
    if (idx !== -1) orderArr.splice(idx, 1);
    orderArr.push(key);
  }

  function cacheGetBuffer(url) {
    var entry = glbBufferCache[url];
    if (!entry || !entry.buffer) return null;
    touchCacheKey(glbCacheOrder, url);
    return entry.buffer;
  }

  function cacheEvictOne() {
    if (!glbCacheOrder.length) return false;
    var oldest = glbCacheOrder.shift();
    var entry = glbBufferCache[oldest];
    if (entry) {
      glbCacheBytes = Math.max(0, glbCacheBytes - (entry.bytes || 0));
      delete glbBufferCache[oldest];
    }
    return true;
  }

  function cacheSetBuffer(url, arrayBuffer) {
    if (!url || !arrayBuffer || typeof arrayBuffer.byteLength !== 'number') return;
    var byteLen = arrayBuffer.byteLength;
    if (byteLen > MAX_CACHE_BYTES) return;
    if (glbBufferCache[url]) {
      glbCacheBytes = Math.max(0, glbCacheBytes - (glbBufferCache[url].bytes || 0));
      delete glbBufferCache[url];
    }
    while ((glbCacheOrder.length >= MAX_CACHE_ENTRIES || glbCacheBytes + byteLen > MAX_CACHE_BYTES) && cacheEvictOne()) {}
    glbBufferCache[url] = { buffer: arrayBuffer, bytes: byteLen };
    glbCacheBytes += byteLen;
    touchCacheKey(glbCacheOrder, url);
  }

  function clearSessionCache() {
    glbBufferCache = Object.create(null);
    glbCacheOrder = [];
    glbCacheBytes = 0;
  }

  function getSessionCacheStats() {
    return {
      entries: glbCacheOrder.length,
      maxEntries: MAX_CACHE_ENTRIES,
      bytes: glbCacheBytes,
      maxBytes: MAX_CACHE_BYTES,
      keys: glbCacheOrder.slice()
    };
  }

  function makeTaggedError(message, code) {
    var err = new Error(message);
    err.code = code || 'MODEL_LOAD_FAILED';
    return err;
  }

  function fetchGlbBufferWithProgress(url, onProgress) {
    var cachedBuf = cacheGetBuffer(url);
    if (cachedBuf) {
      if (typeof onProgress === 'function') onProgress(100);
      return Promise.resolve(cachedBuf);
    }
    if (inflightGlbFetches[url]) return inflightGlbFetches[url];

    var reqPromise = fetch(url).then(function (res) {
      if (!res || !res.ok) {
        throw makeTaggedError('Không tìm thấy tệp mô hình 3D (' + (res ? res.status : 'network') + ').', 'MODEL_NOT_FOUND');
      }
      var ct = '';
      try { ct = String((res.headers && res.headers.get && res.headers.get('content-type')) || '').toLowerCase(); } catch (e) {}
      if (ct.indexOf('text/html') !== -1) {
        throw makeTaggedError('Tệp mô hình 3D không hợp lệ.', 'MODEL_NOT_FOUND');
      }
      var total = 0;
      try { total = Number(res.headers && res.headers.get && res.headers.get('content-length')) || 0; } catch (e2) {}

      if (res.body && typeof res.body.getReader === 'function') {
        var reader = res.body.getReader();
        var chunks = [];
        var loadedBytes = 0;
        var lastPct = -1;
        function pump() {
          return reader.read().then(function (step) {
            if (step.done) {
              var out = new Uint8Array(loadedBytes);
              var offset = 0;
              for (var i = 0; i < chunks.length; i++) {
                out.set(chunks[i], offset);
                offset += chunks[i].byteLength;
              }
              if (typeof onProgress === 'function' && lastPct < 100) onProgress(100);
              return out.buffer;
            }
            var chunk = step.value;
            chunks.push(chunk);
            loadedBytes += chunk.byteLength;
            if (typeof onProgress === 'function') {
              var pct = total > 0 ? Math.min(99, Math.round((loadedBytes / total) * 100)) : Math.min(90, 12 + chunks.length * 8);
              if (pct !== lastPct) {
                lastPct = pct;
                onProgress(pct);
              }
            }
            return pump();
          });
        }
        return pump();
      }
      if (typeof onProgress === 'function') onProgress(35);
      return res.arrayBuffer().then(function (buf) {
        if (typeof onProgress === 'function') onProgress(100);
        return buf;
      });
    }).then(function (buf) {
      delete inflightGlbFetches[url];
      cacheSetBuffer(url, buf);
      return buf;
    }).catch(function (err) {
      delete inflightGlbFetches[url];
      throw err;
    });

    inflightGlbFetches[url] = reqPromise;
    return reqPromise;
  }

  function disposeMaterial(mat) {
    if (!mat) return;
    Object.keys(mat).forEach(function (k) {
      var v = mat[k];
      if (v && v.isTexture) v.dispose();
    });
    if (typeof mat.dispose === 'function') mat.dispose();
  }

  function disposeObject(root) {
    if (!root) return;
    root.traverse(function (o) {
      if (o.geometry && typeof o.geometry.dispose === 'function') o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(disposeMaterial);
        else disposeMaterial(o.material);
      }
    });
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function clamp01(t) {
    return Math.min(1, Math.max(0, Number(t) || 0));
  }

  function escapeSmall(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildMergedPresets(model) {
    var overrides = (model && model.detailPresets) || {};
    var list = [];
    DEFAULT_PRESETS.forEach(function (base) {
      var ov = overrides[base.key];
      if (ov === false) return;
      var merged = { key: base.key, label: base.label, title: base.title, dir: base.dir, dist: base.dist, target: base.target };
      if (ov && typeof ov === 'object') {
        merged.dir = ov.dir || merged.dir;
        merged.dist = ov.dist || merged.dist;
        merged.target = ov.target || merged.target;
        if (ov.label) { merged.label = ov.label; merged.title = ov.label; }
      }
      list.push(merged);
    });
    Object.keys(overrides).forEach(function (key) {
      var ov = overrides[key];
      if (!ov || DEFAULT_PRESETS.some(function (b) { return b.key === key; })) return;
      list.push({ key: key, label: ov.label || key, title: ov.label || key, dir: ov.dir, dist: ov.dist, target: ov.target });
    });
    return list;
  }

  function buildHotspotButtonEl(hs) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pd-3d-hotspot-dot';
    btn.setAttribute('data-3d-hotspot', hs.id);
    btn.setAttribute('aria-label', hs.title);
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '<span class="pd-3d-hotspot-pulse" aria-hidden="true"></span>'
      + '<span class="pd-3d-hotspot-core"></span>'
      + '<span class="pd-3d-hotspot-tip">' + escapeSmall(hs.title) + '</span>';
    return btn;
  }

  function syncHotspotActiveEls(items, activeId) {
    items.forEach(function (item) {
      var act = Boolean(activeId && item.raw.id === activeId);
      item.el.classList.toggle('is-active', act);
      item.el.setAttribute('aria-pressed', act ? 'true' : 'false');
    });
  }

  var SKETCHFAB_API_URL = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
  var sketchfabSdkPromise = null;

  function loadSketchfabSdk() {
    if (window.Sketchfab) return Promise.resolve(window.Sketchfab);
    if (sketchfabSdkPromise) return sketchfabSdkPromise;
    sketchfabSdkPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-vlu-sketchfab-sdk]');
      if (existing && window.Sketchfab) { resolve(window.Sketchfab); return; }
      var s = existing || document.createElement('script');
      s.src = SKETCHFAB_API_URL;
      s.async = true;
      s.setAttribute('data-vlu-sketchfab-sdk', '1');
      s.onload = function () {
        if (window.Sketchfab) resolve(window.Sketchfab);
        else reject(makeTaggedError('Không thể khởi tạo Sketchfab Viewer SDK.', 'SKETCHFAB_SDK_FAILED'));
      };
      s.onerror = function () {
        sketchfabSdkPromise = null;
        reject(makeTaggedError('Không thể kết nối máy chủ mô hình 3D Sketchfab.', 'SKETCHFAB_SDK_FAILED'));
      };
      if (!existing) document.head.appendChild(s);
    });
    return sketchfabSdkPromise;
  }

  /** Bộ điều khiển Sketchfab Viewer API chính thức cho mô hình 3D thật (giữ đồng bộ HUD, đổi màu, Hotspot & Fullscreen). */
  function createSketchfabViewer(options) {
    options = options || {};
    var host = options.host;
    var hotspotHost = options.hotspotHost || null;
    var model = options.model;
    var slotMap = Object.create(null);
    var activeUid = model.sketchfabUid;
    var loaded = false;
    var disposed = false;
    var loadingPromise = null;
    var activePreset = 'overview';
    var autoRotateOn = false;
    var spinRaf = 0;
    var spinLastTime = 0;
    var spinEye = null;
    var spinTarget = null;
    var lastSpinMoveAt = 0;
    var projTimer = 0;
    var hotspotsVisible = true;
    var activeHotspotId = null;
    var hotspotItems = [];
    var colorToken = 0;
    var resizeObs = null;

    function norm3(v) {
      var l = Math.hypot(v[0], v[1], v[2]) || 1;
      return [v[0] / l, v[1] / l, v[2] / l];
    }

    function add3(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
    function sub3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
    function mul3(v, s) { return [v[0] * s, v[1] * s, v[2] * s]; }
    function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

    function emitState() {
      if (typeof options.onStateChange === 'function') {
        options.onStateChange({
          autoRotate: autoRotateOn,
          preset: activePreset,
          hotspotsVisible: hotspotsVisible,
          activeHotspotId: activeHotspotId,
          explodePct: 0
        });
      }
    }

    function computeBasis(cam, zoomFactor) {
      var origEye = cam.position.slice();
      var homeTarget = cam.target.slice();
      var v = sub3(origEye, homeTarget);
      var baseDist = Math.hypot(v[0], v[1], v[2]) || 1;
      var k = Number(zoomFactor) > 0 ? Number(zoomFactor) : 1;
      var homeEye = k === 1 ? origEye : add3(homeTarget, mul3(v, k));
      var homeDist = baseDist * k;
      var hLen = Math.hypot(v[0], v[1]);
      var fwdHoriz = hLen > 1e-4 ? [v[0] / hLen, v[1] / hLen, 0] : [0, -1, 0];
      var right = norm3([-fwdHoriz[1], fwdHoriz[0], 0]);
      return {
        homeEye: homeEye,
        homeTarget: homeTarget,
        baseDist: baseDist,
        homeDist: homeDist,
        radiusEst: baseDist * 0.36,
        fwdHoriz: fwdHoriz,
        right: right,
        up: [0, 0, 1]
      };
    }

    function applySlotIframeVisibility(iframe, isVisible) {
      if (!iframe) return;
      iframe.style.visibility = isVisible ? 'visible' : 'hidden';
      iframe.style.pointerEvents = isVisible ? 'auto' : 'none';
      iframe.style.opacity = isVisible ? '1' : '0';
      iframe.style.zIndex = isVisible ? '1' : '0';
    }

    function vecFromNormalized(basis, nv) {
      return add3(
        add3(mul3(basis.right, nv[0]), mul3(basis.up, nv[1])),
        mul3(basis.fwdHoriz, nv[2])
      );
    }

    function buildHotspotsOnce() {
      if (!hotspotHost || hotspotItems.length) return;
      hotspotHost.innerHTML = '';
      var raw = Array.isArray(model.hotspots) ? model.hotspots : [];
      raw.forEach(function (hs) {
        var btn = buildHotspotButtonEl(hs);
        btn.classList.add('is-clipped');
        hotspotHost.appendChild(btn);
        hotspotItems.push({ raw: hs, el: btn });
      });
    }

    function projectHotspots() {
      var slot = slotMap[activeUid];
      if (!hotspotHost || !hotspotItems.length || !slot || !slot.ready || !slot.basis || !hotspotsVisible || disposed) return;
      var w = Math.max(1, host.clientWidth);
      var h = Math.max(1, host.clientHeight);
      var basis = slot.basis;
      slot.api.getCameraLookAt(function (err, cam) {
        if (err || !cam || disposed) return;
        hotspotItems.forEach(function (item) {
          var hs = item.raw;
          var relPos = mul3(vecFromNormalized(basis, hs.position), basis.radiusEst);
          var worldPos = add3(basis.homeTarget, relPos);
          var worldNorm = norm3(vecFromNormalized(basis, hs.normal));
          var toCam = norm3(sub3(cam.position, worldPos));
          var dot = dot3(worldNorm, toCam);

          slot.api.getWorldToScreenCoordinates(worldPos, function (res) {
            if (disposed || !res || !res.canvasCoord) return;
            var sx = Number(res.canvasCoord[0]);
            var sy = Number(res.canvasCoord[1]);
            var outOfDepth = Boolean(res.glCoord && res.glCoord.length >= 3 && (res.glCoord[2] < -1 || res.glCoord[2] > 1));
            var clipped = outOfDepth || !isFinite(sx) || !isFinite(sy) || sx < -16 || sx > w + 16 || sy < -16 || sy > h + 16;
            item.el.classList.toggle('is-clipped', clipped);
            if (!clipped) {
              item.el.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0) translate(-50%,-50%)';
              item.el.classList.toggle('is-occluded', dot < 0.08);
            }
          });
        });
      });
    }

    function scheduleHotspotSync() {
      [80, 260, 700, 1400].forEach(function (ms) {
        setTimeout(function () {
          if (!disposed) projectHotspots();
        }, ms);
      });
    }

    function startProjLoop() {
      if (projTimer || !hotspotItems.length) return;
      projTimer = setInterval(projectHotspots, 70);
    }

    function stopProjLoop() {
      if (projTimer) { clearInterval(projTimer); projTimer = 0; }
    }

    function initUidSlot(uid) {
      if (slotMap[uid]) return slotMap[uid].readyPromise;
      var iframe = document.createElement('iframe');
      iframe.className = 'pd-3d-sf-iframe';
      iframe.setAttribute('allow', 'autoplay; fullscreen; xr-spatial-tracking');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Mô hình 3D thật ' + (model.label || 'sản phẩm'));
      applySlotIframeVisibility(iframe, uid === activeUid);
      host.appendChild(iframe);

      var slot = { uid: uid, iframe: iframe, api: null, ready: false, basis: null, readyPromise: null };
      slot.readyPromise = loadSketchfabSdk().then(function (Sketchfab) {
        return new Promise(function (resolve, reject) {
          if (disposed) { reject(makeTaggedError('Disposed', 'DISPOSED')); return; }
          var client = new Sketchfab('1.12.1', iframe);
          client.init(uid, {
            autostart: 1,
            preload: 1,
            transparent: 1,
            scrollwheel: 1,
            ui_infos: 0,
            ui_controls: 0,
            ui_stop: 0,
            ui_hint: 0,
            ui_help: 0,
            ui_settings: 0,
            ui_vr: 0,
            ui_fullscreen: 0,
            ui_annotations: 0,
            ui_watermark: 0,
            ui_watermark_link: 0,
            ui_ar: 0,
            ui_fadeout: 0,
            success: function (api) {
              slot.api = api;
              if (uid === activeUid && typeof options.onProgress === 'function') options.onProgress(65);
              api.start();
              api.addEventListener('viewerready', function () {
                if (disposed) return;
                api.setBackground({ color: [1, 1, 1] }, function () {});
                try {
                  if (typeof api.getPostProcessing === 'function' && typeof api.setPostProcessing === 'function') {
                    api.getPostProcessing(function (ppErr, pp) {
                      if (!ppErr && pp && !disposed) {
                        api.setPostProcessing(Object.assign({}, pp, { vignetteEnable: false, vignetteAmount: 0 }), function () {});
                      }
                    });
                  }
                } catch (ePp) {}
                api.getCameraLookAt(function (err, cam) {
                  slot.basis = !err && cam ? computeBasis(cam, 1.18) : {
                    homeEye: [0, -2.36, 0.35], homeTarget: [0, 0, 0], baseDist: 2.02, homeDist: 2.38, radiusEst: 0.72,
                    fwdHoriz: [0, -1, 0], right: [1, 0, 0], up: [0, 0, 1]
                  };
                  slot.ready = true;
                  if (!err && cam) {
                    api.setCameraLookAt(slot.basis.homeEye, slot.basis.homeTarget, 0, function () {
                      if (!disposed && uid === activeUid) projectHotspots();
                    });
                  }
                  api.addEventListener('camerastart', function () {
                    if (Date.now() - lastSpinMoveAt > 120 && autoRotateOn) {
                      setAutoRotate(false);
                    }
                    startProjLoop();
                  });
                  api.addEventListener('camerastop', function () {
                    stopProjLoop();
                    projectHotspots();
                  });
                  resolve(slot);
                });
              });
            },
            error: function () {
              reject(makeTaggedError('Không thể tải mô hình 3D từ Sketchfab.', 'SKETCHFAB_MODEL_ERROR'));
            }
          });
        });
      });
      slotMap[uid] = slot;
      return slot.readyPromise;
    }

    function spinStep(now) {
      if (!autoRotateOn || disposed) { spinRaf = 0; return; }
      var dt = spinLastTime ? Math.min(0.05, (now - spinLastTime) / 1000) : 0.016;
      spinLastTime = now;
      var slot = slotMap[activeUid];
      if (slot && slot.ready && spinEye && spinTarget) {
        var ang = dt * 0.65;
        var ca = Math.cos(ang), sa = Math.sin(ang);
        var ox = spinEye[0] - spinTarget[0], oy = spinEye[1] - spinTarget[1], oz = spinEye[2] - spinTarget[2];
        spinEye = [spinTarget[0] + ox * ca - oy * sa, spinTarget[1] + ox * sa + oy * ca, spinTarget[2] + oz];
        lastSpinMoveAt = Date.now();
        slot.api.setCameraLookAt(spinEye, spinTarget, 0);
        if (Math.round(now / 70) !== Math.round((now - dt * 1000) / 70)) projectHotspots();
      }
      spinRaf = requestAnimationFrame(spinStep);
    }

    function setAutoRotate(on) {
      var want = Boolean(on) && !reducedMotion();
      autoRotateOn = want;
      if (spinRaf) { cancelAnimationFrame(spinRaf); spinRaf = 0; }
      var slot = slotMap[activeUid];
      if (want && slot && slot.ready) {
        activePreset = null;
        slot.api.getCameraLookAt(function (err, cam) {
          if (err || !cam || !autoRotateOn || disposed) return;
          spinEye = cam.position.slice();
          spinTarget = cam.target.slice();
          spinLastTime = performance.now();
          spinRaf = requestAnimationFrame(spinStep);
        });
      }
      emitState();
    }

    function load() {
      if (loadingPromise) return loadingPromise;
      if (!hasWebGL()) return Promise.reject(makeTaggedError('Trình duyệt hiện không hỗ trợ WebGL 3D.', 'WEBGL_UNAVAILABLE'));
      if (typeof options.onProgress === 'function') options.onProgress(20);
      loadingPromise = initUidSlot(activeUid).then(function () {
        if (disposed) return;
        loaded = true;
        buildHotspotsOnce();
        if (typeof ResizeObserver !== 'undefined') {
          resizeObs = new ResizeObserver(function () { projectHotspots(); });
          resizeObs.observe(host);
        } else {
          window.addEventListener('resize', projectHotspots);
        }
        if (typeof options.onProgress === 'function') options.onProgress(100);
        if (typeof options.onReady === 'function') options.onReady();
        scheduleHotspotSync();
        emitState();
      }).catch(function (err) {
        loadingPromise = null;
        if (typeof options.onError === 'function') options.onError(err);
        throw err;
      });
      return loadingPromise;
    }

    function goToPreset(key) {
      var slot = slotMap[activeUid];
      if (!loaded || !slot || !slot.ready) return;
      if (autoRotateOn) setAutoRotate(false);
      var b = slot.basis;
      if (key === 'overview') {
        activePreset = 'overview';
        slot.api.setCameraLookAt(b.homeEye, b.homeTarget, 0.65, projectHotspots);
        emitState();
        return;
      }
      var preset = buildMergedPresets(model).filter(function (p) { return p.key === key; })[0];
      if (!preset || !preset.dir) return;
      var refDist = b.baseDist || b.homeDist;
      var target = add3(b.homeTarget, mul3(vecFromNormalized(b, preset.target), b.radiusEst));
      var dirV = norm3(vecFromNormalized(b, preset.dir));
      var d = Math.max(refDist * 0.42, Math.min(refDist * 2.5, refDist * preset.dist));
      activePreset = key;
      slot.api.setCameraLookAt(add3(target, mul3(dirV, d)), target, 0.65, projectHotspots);
      emitState();
    }

    function zoomBy(factor) {
      var slot = slotMap[activeUid];
      if (!loaded || !slot || !slot.ready) return;
      if (autoRotateOn) setAutoRotate(false);
      var b = slot.basis;
      slot.api.getCameraLookAt(function (err, cam) {
        if (err || !cam || disposed) return;
        var off = sub3(cam.position, cam.target);
        var curLen = Math.hypot(off[0], off[1], off[2]) || b.homeDist;
        var nextLen = Math.max(b.homeDist * 0.34, Math.min(b.homeDist * 2.4, curLen * factor));
        var nextEye = add3(cam.target, mul3(norm3(off), nextLen));
        slot.api.setCameraLookAt(nextEye, cam.target, 0.35, projectHotspots);
      });
    }

    function resetView(opts) {
      opts = opts || {};
      goToPreset('overview');
      if (opts.resetParts !== false && activeHotspotId) {
        activeHotspotId = null;
        syncHotspotActiveEls(hotspotItems, activeHotspotId);
        if (typeof options.onHotspotSelect === 'function') options.onHotspotSelect(null);
        emitState();
      }
    }

    function setColor(resolved) {
      if (!loaded || disposed || !resolved || resolved.kind !== 'sketchfab' || !resolved.uid) return Promise.resolve(false);
      var nextUid = resolved.uid;
      if (nextUid === activeUid) return Promise.resolve(true);
      var token = ++colorToken;
      var prevSlot = slotMap[activeUid];

      function captureRelPose() {
        return new Promise(function (res) {
          if (!prevSlot || !prevSlot.ready || !prevSlot.basis) { res(null); return; }
          prevSlot.api.getCameraLookAt(function (err, cam) {
            if (err || !cam) { res(null); return; }
            var b = prevSlot.basis;
            res({
              relEye: mul3(sub3(cam.position, b.homeTarget), 1 / b.homeDist),
              relTarget: mul3(sub3(cam.target, b.homeTarget), 1 / b.homeDist)
            });
          });
        });
      }

      return captureRelPose().then(function (rel) {
        return initUidSlot(nextUid).then(function () {
          var nextSlot = slotMap[nextUid];
          if (token !== colorToken || disposed) {
            if (nextSlot && nextSlot.uid !== activeUid && nextSlot.api) {
              try { nextSlot.api.stop(); } catch (eStop) {}
            }
            return false;
          }
          if (prevSlot) {
            applySlotIframeVisibility(prevSlot.iframe, false);
            if (prevSlot.api) prevSlot.api.stop();
          }
          activeUid = nextUid;
          applySlotIframeVisibility(nextSlot.iframe, true);
          nextSlot.api.start();
          if (rel && nextSlot.basis) {
            var nb = nextSlot.basis;
            var newTarget = add3(nb.homeTarget, mul3(rel.relTarget, nb.homeDist));
            var newEye = add3(nb.homeTarget, mul3(rel.relEye, nb.homeDist));
            nextSlot.api.setCameraLookAt(newEye, newTarget, 0, projectHotspots);
          }
          scheduleHotspotSync();
          return true;
        });
      }).catch(function () { return false; });
    }

    function focusHotspot(id) {
      if (!loaded) return;
      if (!id) {
        activeHotspotId = null;
        syncHotspotActiveEls(hotspotItems, activeHotspotId);
        if (typeof options.onHotspotSelect === 'function') options.onHotspotSelect(null);
        emitState();
        return;
      }
      var found = hotspotItems.find(function (it) { return it.raw.id === id; });
      if (!found) return;
      if (autoRotateOn) setAutoRotate(false);
      activeHotspotId = found.raw.id;
      syncHotspotActiveEls(hotspotItems, activeHotspotId);
      if (found.raw.cameraPreset) goToPreset(found.raw.cameraPreset);
      if (typeof options.onHotspotSelect === 'function') options.onHotspotSelect(Object.assign({}, found.raw));
      emitState();
    }

    function toggleHotspots(forceVisible) {
      hotspotsVisible = typeof forceVisible === 'boolean' ? forceVisible : !hotspotsVisible;
      if (hotspotHost) hotspotHost.classList.toggle('pd-mode-hidden', !hotspotsVisible);
      if (!hotspotsVisible && activeHotspotId) {
        activeHotspotId = null;
        syncHotspotActiveEls(hotspotItems, activeHotspotId);
        if (typeof options.onHotspotSelect === 'function') options.onHotspotSelect(null);
      }
      if (hotspotsVisible) projectHotspots();
      emitState();
      return hotspotsVisible;
    }

    function start() {
      var s = slotMap[activeUid];
      if (s && s.api && !disposed) s.api.start();
      projectHotspots();
    }

    function pause() {
      if (autoRotateOn) setAutoRotate(false);
      stopProjLoop();
      var s = slotMap[activeUid];
      if (s && s.api && !disposed) s.api.stop();
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      if (spinRaf) cancelAnimationFrame(spinRaf);
      stopProjLoop();
      if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
      else window.removeEventListener('resize', projectHotspots);
      if (hotspotHost) hotspotHost.innerHTML = '';
      hotspotItems = [];
      Object.keys(slotMap).forEach(function (uid) {
        var sl = slotMap[uid];
        if (sl && sl.api) { try { sl.api.stop(); } catch (e) {} }
        if (sl && sl.iframe && sl.iframe.parentNode) sl.iframe.parentNode.removeChild(sl.iframe);
      });
      slotMap = Object.create(null);
      loaded = false;
    }

    return {
      load: load,
      start: start,
      pause: pause,
      resize: projectHotspots,
      zoomIn: function () { zoomBy(0.78); },
      zoomOut: function () { zoomBy(1.28); },
      resetView: resetView,
      setColor: setColor,
      setAutoRotate: setAutoRotate,
      toggleAutoRotate: function () { setAutoRotate(!autoRotateOn); },
      isAutoRotate: function () { return autoRotateOn; },
      getPresets: function () { return buildMergedPresets(model).map(function (p) { return { key: p.key, label: p.label, title: p.title }; }); },
      goToPreset: goToPreset,
      getArticulationSpec: function () { return null; },
      getArticulationValue: function () { return null; },
      setArticulationValue: function () {},
      goToArticulationPreset: function () {},
      getHotspots: function () { return hotspotItems.map(function (it) { return Object.assign({}, it.raw); }); },
      toggleHotspots: toggleHotspots,
      areHotspotsVisible: function () { return hotspotsVisible; },
      focusHotspot: focusHotspot,
      supportsExplodedView: function () { return false; },
      setExplodedValue: function () {},
      getExplodedValue: function () { return 0; },
      dispose: dispose,
      isLoaded: function () { return loaded; },
      isDisposed: function () { return disposed; }
    };
  }

  function create(options) {
    options = options || {};
    var model = options.model;
    if (model && model.engine === 'sketchfab' && model.sketchfabUid) {
      return createSketchfabViewer(options);
    }
    var host = options.host;
    var hotspotHost = options.hotspotHost || null;
    var L = null;
    var renderer, scene, camera, controls, envTexture, pmrem, shadowMesh, modelRoot, loader, draco, resizeObs;
    var clock = null;
    var rootCache = {};
    var raf = 0;
    var running = false;
    var disposed = false;
    var loaded = false;
    var loadingPromise = null;
    var tween = null;
    var colorToken = 0;
    var activePreset = 'overview';
    var home = { pos: null, target: null, dist: 1, radius: 1, minD: 1, maxD: 10 };
    var onContextLost = null;
    var onDblClick = null;
    var onControlsStart = null;

    // Phase 3: Articulation State
    var artSpec = null;
    var artMixer = null;
    var artClipAction = null;
    var artClipDuration = 0;
    var artCurrentT = 0;
    var artTargetT = 0;
    var artAnimating = false;
    var artLastEmitVal = null;

    // Phase 4: Hotspot 3D-to-2D Projection State
    var hotspotItems = [];
    var hotspotsVisible = true;
    var activeHotspotId = null;
    var tmpProjVec = null;
    var tmpCamDirVec = null;
    var tmpWorldPos = null;

    // Phase 4: Exploded View State
    var explodeCurrentT = 0;
    var explodeTargetT = 0;
    var explodeAnimating = false;
    var explodeLastEmitPct = 0;

    function emitState() {
      if (typeof options.onStateChange === 'function') {
        options.onStateChange({
          autoRotate: Boolean(controls && controls.autoRotate),
          preset: activePreset,
          hotspotsVisible: hotspotsVisible,
          activeHotspotId: activeHotspotId,
          explodePct: Math.round(explodeCurrentT * 100)
        });
      }
    }

    function size() {
      return { w: Math.max(1, host.clientWidth), h: Math.max(1, host.clientHeight) };
    }

    function resize() {
      if (!renderer || disposed) return;
      var s = size();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(s.w, s.h, false);
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
      updateHotspotProjections();
    }

    function makeShadowTexture(THREE) {
      var c = document.createElement('canvas');
      c.width = c.height = 256;
      var ctx = c.getContext('2d');
      var g = ctx.createRadialGradient(128, 128, 8, 128, 128, 126);
      g.addColorStop(0, 'rgba(15,23,42,0.42)');
      g.addColorStop(0.55, 'rgba(15,23,42,0.16)');
      g.addColorStop(1, 'rgba(15,23,42,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    function buildStudioEnvironment(THREE) {
      var envScene = new THREE.Scene();
      var domeGeo = new THREE.SphereGeometry(24, 24, 16);
      var domeMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, side: THREE.BackSide });
      envScene.add(new THREE.Mesh(domeGeo, domeMat));

      function addSoftbox(w, h, d, x, y, z, rx, ry, rz, colorHex, mul) {
        var c = new THREE.Color(colorHex).multiplyScalar(mul);
        var mat = new THREE.MeshBasicMaterial({ color: c });
        var panel = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        panel.position.set(x, y, z);
        panel.rotation.set(rx, ry, rz);
        envScene.add(panel);
      }

      // Vertical studio rim light strips + soft overhead diffused dome + clean dark negative-fill flanks
      // Tạo ánh kim sắc nét cho khung viền Titan Bạc như ảnh studio Apple mà không cháy sáng
      addSoftbox(12, 0.25, 10, 0, 10.5, 0, 0, 0, 0, 0xffffff, 1.85);
      addSoftbox(2.2, 14, 0.25, -8.5, 2, 5.5, 0.1, 0.95, 0, 0xffffff, 2.15);
      addSoftbox(2.2, 14, 0.25, 8.5, 2, 5.5, 0.1, -0.95, 0, 0xffffff, 1.95);
      addSoftbox(2.0, 14, 0.25, -8.0, 2, -6.5, -0.1, -0.9, 0, 0xf8fafc, 1.85);
      addSoftbox(2.0, 14, 0.25, 8.0, 2, -6.5, -0.1, 0.9, 0, 0xf8fafc, 1.65);
      addSoftbox(10, 7, 0.25, 0, 4.5, 9.8, 0.25, 0, 0, 0xf8fbff, 1.45);
      addSoftbox(10, 7, 0.25, 0, 4.5, -9.8, -0.25, 0, 0, 0xffffff, 1.55);
      addSoftbox(1.5, 12, 5.5, 9.8, 0, 0, 0, 0, 0, 0x334155, 0.32);
      addSoftbox(1.5, 12, 5.5, -9.8, 0, 0, 0, 0, 0, 0x334155, 0.35);
      addSoftbox(16, 0.25, 16, 0, -8.5, 0, 0, 0, 0, 0x94a3b8, 0.72);

      var tex = pmrem.fromScene(envScene, 0.032).texture;
      disposeObject(envScene);
      return tex;
    }

    function upgradeToPhysicalMaterial(THREE, mat, preset) {
      if (!mat) return mat;
      var target = mat;
      if (!mat.isMeshPhysicalMaterial && preset.clearcoat > 0) {
        target = new THREE.MeshPhysicalMaterial({
          name: mat.name || '',
          color: mat.color ? mat.color.clone() : new THREE.Color(0xffffff),
          emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000),
          emissiveIntensity: mat.emissiveIntensity != null ? mat.emissiveIntensity : 1,
          map: mat.map || null,
          normalMap: mat.normalMap || null,
          roughnessMap: mat.roughnessMap || null,
          metalnessMap: mat.metalnessMap || null,
          emissiveMap: mat.emissiveMap || null,
          transparent: Boolean(mat.transparent),
          opacity: mat.opacity != null ? mat.opacity : 1,
          side: mat.side != null ? mat.side : THREE.FrontSide
        });
        if (typeof mat.dispose === 'function') mat.dispose();
      }
      if (preset.metalness != null) target.metalness = preset.metalness;
      if (preset.roughness != null) target.roughness = preset.roughness;
      if (preset.clearcoat != null && 'clearcoat' in target) target.clearcoat = preset.clearcoat;
      if (preset.clearcoatRoughness != null && 'clearcoatRoughness' in target) target.clearcoatRoughness = preset.clearcoatRoughness;
      if (preset.envMapIntensity != null) target.envMapIntensity = preset.envMapIntensity;
      target.needsUpdate = true;
      return target;
    }

    function classifyPbrPreset(nameToken) {
      if (!nameToken) return null;
      if (/cavity|hole|speaker|grill/.test(nameToken)) {
        return { metalness: 0.15, roughness: 0.82, clearcoat: 0, envMapIntensity: 0.45 };
      }
      if (/oled|display|screen|lens|glasslens/.test(nameToken) && !/back/.test(nameToken)) {
        return { metalness: 0.1, roughness: 0.06, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.45 };
      }
      if (/backglass|cameraplateau|matteglass/.test(nameToken)) {
        return { metalness: 0.08, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.25, envMapIntensity: 1.05 };
      }
      if (/titanium|frame|ring|button|bezel|logo|portrim|copper|contacts/.test(nameToken)) {
        return { metalness: 0.88, roughness: 0.24, clearcoat: 0, envMapIntensity: 1.25 };
      }
      return null;
    }

    /** Tách rõ vật liệu PBR thực tế: Kim loại phay xước, Kính nhám clearcoat, Màn hình/Thấu kính gương & Hốc cổng tối. */
    function enhancePbrMaterials(root) {
      if (!root || !L) return;
      var THREE = L.THREE;
      root.traverse(function (o) {
        if (!o.isMesh || !o.material) return;
        var meshName = String(o.name || '').toLowerCase();
        var isArr = Array.isArray(o.material);
        var mats = isArr ? o.material : [o.material];
        var next = mats.map(function (mat) {
          var matName = String((mat && mat.name) || '').toLowerCase();
          var preset = classifyPbrPreset(matName) || classifyPbrPreset(meshName);
          return preset ? upgradeToPhysicalMaterial(THREE, mat, preset) : mat;
        });
        o.material = isArr ? next : next[0];
      });
    }

    function setup() {
      var THREE = L.THREE;
      var s = size();
      clock = new THREE.Clock();
      tmpProjVec = new THREE.Vector3();
      tmpCamDirVec = new THREE.Vector3();
      tmpWorldPos = new THREE.Vector3();

      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch (webglErr) {
        throw makeTaggedError('Thiết bị hoặc trình duyệt không thể khởi tạo ngữ cảnh WebGL 3D.', 'WEBGL_UNAVAILABLE');
      }
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = model.exposure || 1.02;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(s.w, s.h, false);
      var canvas = renderer.domElement;
      canvas.className = 'pd-3d-canvas';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'Mô hình 3D ' + (model.label || 'sản phẩm') + ' – kéo để xoay');
      canvas.style.touchAction = 'none';
      host.appendChild(canvas);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(36, s.w / s.h, 0.05, 100);

      pmrem = new THREE.PMREMGenerator(renderer);
      try {
        envTexture = buildStudioEnvironment(THREE);
      } catch (envErr) {
        envTexture = pmrem.fromScene(new L.RoomEnvironment(), 0.04).texture;
      }
      scene.environment = envTexture;
      var hemi = new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 0.42);
      scene.add(hemi);
      var key = new THREE.DirectionalLight(0xffffff, 0.65);
      key.position.set(3, 5, 4);
      scene.add(key);
      var fill = new THREE.DirectionalLight(0xeef4ff, 0.35);
      fill.position.set(-4, 2, 3.5);
      scene.add(fill);
      var backKey = new THREE.DirectionalLight(0xffffff, 0.52);
      backKey.position.set(-2.5, 4, -4.5);
      scene.add(backKey);
      var backRim = new THREE.DirectionalLight(0xe2e8f0, 0.28);
      backRim.position.set(3.5, 1.5, -3.5);
      scene.add(backRim);

      controls = new L.OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.rotateSpeed = 0.9;
      controls.zoomSpeed = 0.9;
      controls.autoRotate = false;
      controls.autoRotateSpeed = 1.8;
      controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
      controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: null };

      onControlsStart = function () {
        tween = null;
        var changed = false;
        if (controls.autoRotate) { controls.autoRotate = false; changed = true; }
        if (activePreset !== null) { activePreset = null; changed = true; }
        if (changed) emitState();
      };
      controls.addEventListener('start', onControlsStart);

      onContextLost = function (ev) {
        ev.preventDefault();
        pause();
        if (typeof options.onError === 'function') {
          options.onError(makeTaggedError('Mất ngữ cảnh WebGL 3D. Đang chuyển về bộ ảnh chi tiết.', 'WEBGL_CONTEXT_LOST'));
        }
      };
      canvas.addEventListener('webglcontextlost', onContextLost, false);

      onDblClick = function () { resetView(); };
      canvas.addEventListener('dblclick', onDblClick, false);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObs = new ResizeObserver(function () { resize(); });
        resizeObs.observe(host);
      } else {
        window.addEventListener('resize', resize);
      }
    }

    /** Chuẩn hoá root mô hình + nâng cấp vật liệu PBR + lưu vị trí/góc gốc + tính explode offset. */
    function normalizeRoot(root) {
      var THREE = L.THREE;
      enhancePbrMaterials(root);
      root.traverse(function (o) {
        if (!o.userData.__vluBaseTransform) {
          o.userData.__vluBaseTransform = {
            rx: o.rotation.x, ry: o.rotation.y, rz: o.rotation.z,
            px: o.position.x, py: o.position.y, pz: o.position.z
          };
        }
      });
      var box = new THREE.Box3().setFromObject(root);
      var sizeV = box.getSize(new THREE.Vector3());
      var center = box.getCenter(new THREE.Vector3());
      var maxDim = Math.max(sizeV.x, sizeV.y, sizeV.z) || 1;
      var k = (2 / maxDim) * (model.scale || 1);
      root.scale.multiplyScalar(k);
      root.rotation.y = model.rotationY || 0;
      box.setFromObject(root);
      box.getCenter(center);
      root.position.sub(center);
      box.setFromObject(root);
      var sz = box.getSize(new THREE.Vector3());
      var radius = Math.max(sz.x, sz.y, sz.z) * 0.5 || 1;
      prepareExplodedOffsets(root, radius);
      return { minY: box.min.y, radius: radius };
    }

    /** Gán vector phân rã vào userData.__vluExplodeOffset cho từng node tương ứng (tối ưu 60fps). */
    function prepareExplodedOffsets(root, radius) {
      if (!model.supportsExplodedView) return;
      var THREE = L.THREE;
      var explicit = Array.isArray(model.explodedParts) ? model.explodedParts : [];

      if (explicit.length > 0) {
        root.updateMatrixWorld(true);
        var pOrigin = new THREE.Vector3();
        var worldDelta = new THREE.Vector3();
        root.traverse(function (node) {
          var nName = String(node.name || '').toLowerCase();
          if (!nName) return;
          // Tránh nhân đôi offset khi glTF Group đa primitive có cả cha lẫn con cùng chứa tên lớp
          var anc = node.parent;
          while (anc && anc !== root) {
            if (anc.userData && anc.userData.__vluExplodeOffset) return;
            anc = anc.parent;
          }
          var match = explicit.find(function (pt) {
            return nName.indexOf(pt.meshName) !== -1;
          });
          if (match) {
            // Đổi vector từ tọa độ thế giới (hướng chuẩn trước/sau màn hình) sang tọa độ cục bộ của parent bất kể rotationY/scale
            var pObj = node.parent || root;
            pObj.getWorldPosition(pOrigin);
            worldDelta.set(match.offset[0] * radius, match.offset[1] * radius, match.offset[2] * radius);
            var localDelta = pObj.worldToLocal(pOrigin.clone().add(worldDelta)).sub(pObj.worldToLocal(pOrigin));
            node.userData.__vluExplodeOffset = {
              x: localDelta.x,
              y: localDelta.y,
              z: localDelta.z
            };
          }
        });
        return;
      }

      // Tự động phân rã hướng tâm theo tọa độ thế giới (hỗ trợ cả .glb đa tầng lồng ghép từ Sketchfab/Blender)
      root.updateMatrixWorld(true);
      var layerNodes = (root.children && root.children.length > 1) ? root.children.slice() : [];
      if (!layerNodes.length) {
        root.traverse(function (o) {
          if (o !== root && o.isMesh) layerNodes.push(o);
        });
      }
      if (layerNodes.length <= 1) return;

      var centerBox = new THREE.Box3();
      var partCenter = new THREE.Vector3();
      var count = layerNodes.length;

      layerNodes.forEach(function (node, idx) {
        centerBox.setFromObject(node);
        centerBox.getCenter(partCenter);
        var worldDelta = partCenter.clone();
        if (worldDelta.lengthSq() < 0.002) {
          var spread = (idx - (count - 1) / 2);
          worldDelta.set(spread * 0.14, 0, spread * 0.55);
        } else {
          worldDelta.normalize().multiplyScalar(0.58 * radius);
        }
        var parentObj = node.parent || root;
        var originLocal = parentObj.worldToLocal(partCenter.clone());
        var shiftedLocal = parentObj.worldToLocal(partCenter.clone().add(worldDelta)).sub(originLocal);
        node.userData.__vluExplodeOffset = {
          x: shiftedLocal.x,
          y: shiftedLocal.y,
          z: shiftedLocal.z
        };
      });
    }

    function frameScene(info) {
      var THREE = L.THREE;
      var radius = info.radius;
      var shadowTex = makeShadowTexture(THREE);
      var shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55, side: THREE.FrontSide });
      shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2.5, radius * 2.5), shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = info.minY - radius * 0.05;
      shadowMesh.renderOrder = -1;
      scene.add(shadowMesh);

      var fov = THREE.MathUtils.degToRad(camera.fov);
      var dist = (radius / Math.sin(fov / 2)) * 0.86;
      home.pos = new THREE.Vector3(-dist * 0.40, dist * 0.14, -dist * 0.90).setLength(dist);
      home.target = new THREE.Vector3(0, -radius * 0.06, 0);
      home.dist = dist;
      home.radius = radius;
      home.minD = radius * 0.72;
      home.maxD = dist * 2.4;

      camera.position.copy(home.pos);
      camera.near = Math.max(0.02, dist / 140);
      camera.far = dist * 24;
      camera.updateProjectionMatrix();

      controls.target.copy(home.target);
      controls.minDistance = home.minD;
      controls.maxDistance = home.maxD;
      controls.minPolarAngle = 0.08;
      controls.maxPolarAngle = Math.PI - 0.08;
      controls.update();
    }

    function loadRoot(url, onProgress) {
      if (typeof fetch !== 'function') {
        return new Promise(function (resolve, reject) {
          loader.load(url, function (gltf) {
            resolve({ scene: gltf.scene, animations: Array.isArray(gltf.animations) ? gltf.animations : [] });
          }, function (evt) {
            if (onProgress && evt && evt.lengthComputable) onProgress(Math.round((evt.loaded / evt.total) * 100));
          }, function (err) {
            reject(err instanceof Error ? err : makeTaggedError('Không thể tải tệp mô hình 3D.', 'MODEL_LOAD_FAILED'));
          });
        });
      }
      var lastSlash = url.lastIndexOf('/');
      var resourcePath = lastSlash !== -1 ? url.slice(0, lastSlash + 1) : '';
      return fetchGlbBufferWithProgress(url, onProgress).then(function (buf) {
        return new Promise(function (resolve, reject) {
          try {
            loader.parse(buf.slice(0), resourcePath, function (gltf) {
              resolve({ scene: gltf.scene, animations: Array.isArray(gltf.animations) ? gltf.animations : [] });
            }, function (err) {
              reject(err instanceof Error ? err : makeTaggedError('Không thể phân tích tệp mô hình 3D.', 'MODEL_PARSE_FAILED'));
            });
          } catch (parseErr) {
            reject(parseErr instanceof Error ? parseErr : makeTaggedError('Không thể phân tích tệp mô hình 3D.', 'MODEL_PARSE_FAILED'));
          }
        });
      });
    }

    // ---- Phase 3 + Phase 4 Composite Transform (Articulation + Exploded View không xung đột) -------
    function cleanupMixer() {
      if (artClipAction) {
        artClipAction.stop();
        artClipAction = null;
      }
      if (artMixer) {
        artMixer.stopAllAction();
        if (modelRoot) artMixer.uncacheRoot(modelRoot);
        artMixer = null;
      }
      artClipDuration = 0;
    }

    function resolveArticulationSpec(animations) {
      var hasClips = Array.isArray(animations) && animations.length > 0;
      if (model.articulation) return model.articulation;
      if (hasClips) {
        return {
          type: 'clip-auto',
          label: 'Hoạt ảnh bộ phận 3D',
          min: 0, max: 100, step: 1, defaultValue: 0, unit: '%',
          statusBadges: null,
          presets: [
            { key: 'start', label: 'Mặc định (0%)', value: 0 },
            { key: 'mid',   label: 'Mở một nửa (50%)', value: 50 },
            { key: 'end',   label: 'Hoàn tất (100%)', value: 100 }
          ],
          clip: '', useClip: true, parts: []
        };
      }
      return null;
    }

    function setupMixerForRoot(root, animations) {
      cleanupMixer();
      if (!root || !artSpec || !Array.isArray(animations) || !animations.length) return;
      if (artSpec.parts && artSpec.parts.length && !artSpec.clip && !artSpec.useClip) return;

      var THREE = L.THREE;
      var clipTarget = null;
      if (artSpec.clip) {
        var wanted = artSpec.clip.toLowerCase();
        clipTarget = animations.find(function (c) {
          return c && c.name && c.name.toLowerCase().indexOf(wanted) !== -1;
        }) || null;
      }
      if (!clipTarget && artSpec.useClip) clipTarget = animations[0] || null;
      if (!clipTarget || !(clipTarget.duration > 0)) return;

      artMixer = new THREE.AnimationMixer(root);
      artClipAction = artMixer.clipAction(clipTarget);
      artClipAction.setLoop(THREE.LoopOnce, 1);
      artClipAction.clampWhenFinished = true;
      artClipAction.play();
      artClipAction.paused = true;
      artClipDuration = clipTarget.duration;
    }

    function applyCompositeNodeTransforms(root) {
      if (!root || !L) return;
      var degToRad = L.THREE.MathUtils.degToRad;
      var radScale = home.radius || 1;
      var hasArtParts = Boolean(artSpec && Array.isArray(artSpec.parts) && artSpec.parts.length);
      var hasExplode = Boolean(model.supportsExplodedView);
      if (!hasArtParts && !hasExplode) return;

      root.traverse(function (node) {
        var base = node.userData && node.userData.__vluBaseTransform;
        if (!base) return;
        var nName = String(node.name || '').toLowerCase();
        var expOff = node.userData.__vluExplodeOffset;

        var matchedParts = (hasArtParts && nName) ? artSpec.parts.filter(function (part) {
          return part.nodes.some(function (sub) { return nName.indexOf(sub) !== -1; });
        }) : [];

        if (!matchedParts.length && !expOff) return;

        var rx = base.rx, ry = base.ry, rz = base.rz;
        var px = base.px, py = base.py, pz = base.pz;

        matchedParts.forEach(function (part) {
          var span = Math.max(0.0001, (part.endT - part.startT));
          var localT = clamp01((artCurrentT - part.startT) / span);
          if (part.mode === 'translate') {
            var mult = part.space === 'world' ? 1 : radScale;
            if (part.fromVec && part.toVec) {
              px += (part.fromVec[0] + (part.toVec[0] - part.fromVec[0]) * localT) * mult;
              py += (part.fromVec[1] + (part.toVec[1] - part.fromVec[1]) * localT) * mult;
              pz += (part.fromVec[2] + (part.toVec[2] - part.fromVec[2]) * localT) * mult;
            } else {
              var d = (part.from + (part.to - part.from) * localT) * mult;
              if (part.axis === 'x') px += d;
              else if (part.axis === 'y') py += d;
              else pz += d;
            }
          } else {
            var angleRad = degToRad(part.from + (part.to - part.from) * localT);
            if (part.axis === 'x') rx += angleRad;
            else if (part.axis === 'y') ry += angleRad;
            else rz += angleRad;
          }
        });

        if (expOff && hasExplode) {
          px += expOff.x * explodeCurrentT;
          py += expOff.y * explodeCurrentT;
          pz += expOff.z * explodeCurrentT;
        }

        node.rotation.set(rx, ry, rz);
        node.position.set(px, py, pz);
      });
    }

    function computeBadgeText(val) {
      if (!artSpec) return '';
      var rounded = Math.round(val);
      if (Array.isArray(artSpec.statusBadges) && artSpec.statusBadges.length) {
        var matched = artSpec.statusBadges.find(function (b) { return rounded <= Number(b.max); });
        if (matched && matched.text) {
          return String(matched.text).replace('{value}', String(rounded));
        }
      }
      return String(rounded) + (artSpec.unit || '');
    }

    function applyArticulationAtT(t, forceEmit) {
      artCurrentT = clamp01(t);
      if (artMixer && artClipAction && artClipDuration > 0) {
        artClipAction.time = Math.min(artClipDuration * 0.9995, artCurrentT * artClipDuration);
        artMixer.update(0);
      }
      if (modelRoot) applyCompositeNodeTransforms(modelRoot);
      if (!artSpec) return;
      var val = artSpec.min + (artSpec.max - artSpec.min) * artCurrentT;
      var rounded = Math.round(val);
      if (forceEmit || artLastEmitVal !== rounded) {
        artLastEmitVal = rounded;
        var matchedPreset = (artSpec.presets || []).find(function (pr) {
          return Math.abs(pr.value - val) <= 1.2;
        });
        if (typeof options.onArticulationChange === 'function') {
          options.onArticulationChange({
            value: rounded,
            t: artCurrentT,
            activePresetKey: matchedPreset ? matchedPreset.key : null,
            badgeText: computeBadgeText(val)
          });
        }
      }
    }

    function applyExplodedAtT(t, forceEmit) {
      explodeCurrentT = clamp01(t);
      if (modelRoot) applyCompositeNodeTransforms(modelRoot);
      var pct = Math.round(explodeCurrentT * 100);
      if (forceEmit || explodeLastEmitPct !== pct) {
        explodeLastEmitPct = pct;
        emitState();
      }
    }

    // ---- Phase 4: Hotspot Setup & 3D-to-2D Projection ---------------------------------------------
    function setupHotspots() {
      if (!hotspotHost || !L) return;
      hotspotHost.innerHTML = '';
      hotspotItems = [];
      var raw = Array.isArray(model.hotspots) ? model.hotspots : [];
      if (!raw.length) return;
      var THREE = L.THREE;

      raw.forEach(function (hs) {
        var btn = buildHotspotButtonEl(hs);
        hotspotHost.appendChild(btn);

        hotspotItems.push({
          raw: hs,
          el: btn,
          posVec: new THREE.Vector3(hs.position[0], hs.position[1], hs.position[2]),
          normalVec: new THREE.Vector3(hs.normal[0], hs.normal[1], hs.normal[2]).normalize()
        });
      });
    }

    function updateHotspotProjections() {
      if (!hotspotHost || !hotspotItems.length || !camera || !loaded || !hotspotsVisible) return;
      var s = size();
      var r = home.radius || 1;
      for (var i = 0; i < hotspotItems.length; i++) {
        var item = hotspotItems[i];
        tmpWorldPos.copy(item.posVec).multiplyScalar(r);
        tmpProjVec.copy(tmpWorldPos).project(camera);

        var outOfFrustum = tmpProjVec.z > 1 || tmpProjVec.z < -1
          || tmpProjVec.x < -1.15 || tmpProjVec.x > 1.15
          || tmpProjVec.y < -1.15 || tmpProjVec.y > 1.15;
        item.el.classList.toggle('is-clipped', outOfFrustum);
        if (outOfFrustum) continue;

        var sx = (tmpProjVec.x * 0.5 + 0.5) * s.w;
        var sy = (-tmpProjVec.y * 0.5 + 0.5) * s.h;
        item.el.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0) translate(-50%,-50%)';

        // Dot product giữa vector hướng từ tâm ra hotspot (normalVec) với vector hướng về camera
        tmpCamDirVec.subVectors(camera.position, tmpWorldPos).normalize();
        var dot = item.normalVec.dot(tmpCamDirVec);
        item.el.classList.toggle('is-occluded', dot < 0.08);
      }
    }

    function syncHotspotDotActiveStates() {
      syncHotspotActiveEls(hotspotItems, activeHotspotId);
    }

    function focusHotspot(id) {
      if (!loaded) return;
      if (!id) {
        activeHotspotId = null;
        syncHotspotDotActiveStates();
        if (typeof options.onHotspotSelect === 'function') options.onHotspotSelect(null);
        emitState();
        return;
      }
      var found = hotspotItems.find(function (it) { return it.raw.id === id; });
      if (!found) return;
      if (controls.autoRotate) controls.autoRotate = false;
      activeHotspotId = found.raw.id;
      syncHotspotDotActiveStates();

      var hs = found.raw;
      if (hs.cameraPreset) {
        goToPreset(hs.cameraPreset);
      } else {
        var THREE = L.THREE;
        var r = home.radius || 1;
        var target = hs.focusTarget
          ? new THREE.Vector3(hs.focusTarget[0], hs.focusTarget[1], hs.focusTarget[2]).multiplyScalar(r)
          : found.posVec.clone().multiplyScalar(r * 0.55);
        var d = Math.min(home.maxD, Math.max(home.minD, home.dist * (hs.focusDist || 0.65)));
        var camPos = target.clone().add(found.normalVec.clone().multiplyScalar(d));
        activePreset = null;
        animateTo(camPos, target);
      }

      if (typeof options.onHotspotSelect === 'function') {
        options.onHotspotSelect(Object.assign({}, hs));
      }
      emitState();
    }

    function toggleHotspots(forceVisible) {
      hotspotsVisible = typeof forceVisible === 'boolean' ? forceVisible : !hotspotsVisible;
      if (hotspotHost) {
        hotspotHost.classList.toggle('pd-mode-hidden', !hotspotsVisible);
      }
      if (!hotspotsVisible && activeHotspotId) {
        activeHotspotId = null;
        syncHotspotDotActiveStates();
        if (typeof options.onHotspotSelect === 'function') options.onHotspotSelect(null);
      }
      if (hotspotsVisible) updateHotspotProjections();
      emitState();
      return hotspotsVisible;
    }

    var rootCacheOrder = [];

    function storeInstanceRoot(url, entry) {
      rootCache[url] = entry;
      touchCacheKey(rootCacheOrder, url);
      while (rootCacheOrder.length > MAX_INSTANCE_ROOTS) {
        var evictUrl = null;
        for (var i = 0; i < rootCacheOrder.length; i++) {
          var cand = rootCacheOrder[i];
          if (!rootCache[cand] || rootCache[cand].root !== modelRoot) {
            evictUrl = cand;
            rootCacheOrder.splice(i, 1);
            break;
          }
        }
        if (!evictUrl) break;
        var oldEntry = rootCache[evictUrl];
        delete rootCache[evictUrl];
        if (oldEntry && oldEntry.root && oldEntry.root !== modelRoot) {
          disposeObject(oldEntry.root);
        }
      }
    }

    /** Hiển thị root của url (dùng cache nếu đã tải) mà giữ nguyên camera, articulation & exploded state. */
    function activateRoot(url) {
      var cached = rootCache[url];
      if (cached) touchCacheKey(rootCacheOrder, url);
      var p = cached ? Promise.resolve(cached) : loadRoot(url).then(function (gltfRes) {
        if (disposed) { disposeObject(gltfRes.scene); return null; }
        normalizeRoot(gltfRes.scene);
        storeInstanceRoot(url, { root: gltfRes.scene, animations: gltfRes.animations });
        return rootCache[url];
      });
      return p.then(function (entry) {
        if (!entry || disposed) return null;
        if (modelRoot !== entry.root) {
          if (modelRoot) scene.remove(modelRoot);
          scene.add(entry.root);
          modelRoot = entry.root;
          setupMixerForRoot(entry.root, entry.animations);
          applyCompositeNodeTransforms(entry.root);
        }
        return entry.root;
      });
    }

    function load() {
      if (loadingPromise) return loadingPromise;
      loadingPromise = Promise.resolve().then(function () {
        if (!hasWebGL()) throw makeTaggedError('Trình duyệt hoặc thiết bị hiện không hỗ trợ WebGL 3D.', 'WEBGL_UNAVAILABLE');
        if (!model || !model.url) throw makeTaggedError('Sản phẩm chưa có mô hình 3D.', 'MODEL_MISSING');
        return loadLibs();
      }).then(function (libs) {
        if (disposed) return null;
        L = libs;
        setup();
        loader = new L.GLTFLoader();
        draco = new L.DRACOLoader();
        draco.setDecoderPath(libs.source.draco);
        loader.setDRACOLoader(draco);
        return loadRoot(model.url, options.onProgress);
      }).then(function (gltfRes) {
        if (disposed) { if (gltfRes && gltfRes.scene) disposeObject(gltfRes.scene); return; }
        var root = gltfRes.scene;
        var anims = gltfRes.animations;
        var info = normalizeRoot(root);
        frameScene(info);
        storeInstanceRoot(model.url, { root: root, animations: anims });
        scene.add(root);
        modelRoot = root;

        artSpec = resolveArticulationSpec(anims);
        if (artSpec) {
          setupMixerForRoot(root, anims);
          var span = Math.max(0.0001, artSpec.max - artSpec.min);
          artCurrentT = clamp01((artSpec.defaultValue - artSpec.min) / span);
          artTargetT = artCurrentT;
          applyArticulationAtT(artCurrentT, true);
        }

        setupHotspots();
        loaded = true;
        resize();
        if (typeof options.onReady === 'function') options.onReady();
        updateHotspotProjections();
        emitState();
      }).catch(function (err) {
        loadingPromise = null;
        if (typeof options.onError === 'function') options.onError(err);
        throw err;
      });
      return loadingPromise;
    }

    var wallpaperCache = {};

    function getScreenWallpaperTexture(THREE, themeKey) {
      var k = String(themeKey || 'silver').toLowerCase();
      if (wallpaperCache[k]) return wallpaperCache[k];
      var canvas = document.createElement('canvas');
      canvas.width = 384;
      canvas.height = 768;
      var ctx = canvas.getContext('2d');
      var bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (k === 'black') {
        bg.addColorStop(0, '#0f1219');
        bg.addColorStop(0.5, '#1d2433');
        bg.addColorStop(1, '#0b0d12');
      } else if (k === 'red') {
        bg.addColorStop(0, '#3a131b');
        bg.addColorStop(0.5, '#6d2332');
        bg.addColorStop(1, '#260b11');
      } else if (k === 'gray') {
        bg.addColorStop(0, '#62738c');
        bg.addColorStop(0.5, '#95a7c1');
        bg.addColorStop(1, '#49576d');
      } else {
        bg.addColorStop(0, '#b9bdc2');
        bg.addColorStop(0.5, '#e8eaed');
        bg.addColorStop(1, '#9ca2aa');
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dải sóng cong ánh kim Pro-Ribbon
      var r1 = ctx.createRadialGradient(canvas.width * 0.25, canvas.height * 0.38, 12, canvas.width * 0.48, canvas.height * 0.45, 290);
      r1.addColorStop(0, k === 'silver' ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.28)');
      r1.addColorStop(0.55, 'rgba(255,255,255,0.08)');
      r1.addColorStop(1, 'rgba(0,0,0,0.32)');
      ctx.fillStyle = r1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.22);
      ctx.bezierCurveTo(canvas.width * 0.45, canvas.height * 0.10, canvas.width * 0.85, canvas.height * 0.48, canvas.width, canvas.height * 0.36);
      ctx.lineTo(canvas.width, canvas.height * 0.78);
      ctx.bezierCurveTo(canvas.width * 0.65, canvas.height * 0.90, canvas.width * 0.25, canvas.height * 0.56, 0, canvas.height * 0.72);
      ctx.closePath();
      ctx.fill();

      var tex = new THREE.CanvasTexture(canvas);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
      tex.needsUpdate = true;
      wallpaperCache[k] = tex;
      return tex;
    }

    function matchesNameList(mesh, mat, list) {
      if (!list || !list.length) return false;
      var meshName = String((mesh && mesh.name) || '').toLowerCase();
      var matName = String((mat && mat.name) || '').toLowerCase();
      return list.some(function (n) { return meshName.indexOf(n) !== -1 || (matName && matName.indexOf(n) !== -1); });
    }

    function applyMaterialSpec(root, spec) {
      var THREE = L.THREE;
      root.traverse(function (o) {
        if (!o.isMesh || !o.material) return;
        var isArr = Array.isArray(o.material);
        var list = isArr ? o.material : [o.material];
        var next = list.map(function (mat) {
          var isBody = matchesNameList(o, mat, model.bodyMeshes);
          var isGlass = matchesNameList(o, mat, model.glassMeshes);
          var isAccent = matchesNameList(o, mat, model.accentMeshes);
          var isScreen = matchesNameList(o, mat, model.screenMeshes);
          if (!isBody && !isGlass && !isAccent && !isScreen) return mat;

          var m = mat;
          if (!mat.userData || !mat.userData.__vluCloned) {
            m = mat.clone();
            m.userData = Object.assign({}, mat.userData, {
              __vluCloned: true,
              __vluOrigMap: mat.map || null
            });
          }

          if (isScreen) {
            var wpTex = getScreenWallpaperTexture(THREE, spec.screenTheme || 'silver');
            m.map = wpTex;
            m.emissiveMap = wpTex;
            if (m.color && typeof m.color.setHex === 'function') m.color.setHex(0xffffff);
            if (m.emissive && typeof m.emissive.setHex === 'function') m.emissive.setHex(0xffffff);
            m.emissiveIntensity = 0.28;
            if ('metalness' in m) m.metalness = 0.04;
            if ('roughness' in m) m.roughness = 0.14;
            m.needsUpdate = true;
            return m;
          }

          if (spec.clearMap) {
            m.map = null;
          } else if (m.userData.__vluOrigMap && !m.map) {
            m.map = m.userData.__vluOrigMap;
          }

          if (isAccent) {
            if (m.color && typeof m.color.set === 'function') m.color.set(spec.accentHex || spec.hex);
            if (spec.accentMetalness != null && 'metalness' in m) m.metalness = spec.accentMetalness;
            else if (spec.metalness != null && 'metalness' in m) m.metalness = spec.metalness;
            if (spec.accentRoughness != null && 'roughness' in m) m.roughness = spec.accentRoughness;
            else if (spec.roughness != null && 'roughness' in m) m.roughness = spec.roughness;
          } else if (isGlass) {
            if (m.color && typeof m.color.set === 'function') m.color.set(spec.glassHex || spec.hex);
            if (spec.glassMetalness != null && 'metalness' in m) m.metalness = spec.glassMetalness;
            else if (spec.metalness != null && 'metalness' in m) m.metalness = spec.metalness;
            if (spec.glassRoughness != null && 'roughness' in m) m.roughness = spec.glassRoughness;
            else if (spec.roughness != null && 'roughness' in m) m.roughness = spec.roughness;
          } else {
            if (m.color && typeof m.color.set === 'function') m.color.set(spec.hex);
            if (spec.metalness != null && 'metalness' in m) m.metalness = spec.metalness;
            if (spec.roughness != null && 'roughness' in m) m.roughness = spec.roughness;
          }
          m.needsUpdate = true;
          return m;
        });
        o.material = isArr ? next : next[0];
      });
    }

    function setColor(resolved) {
      if (!loaded || disposed || !resolved) return Promise.resolve(false);
      var token = ++colorToken;
      var url = resolved.kind === 'model' ? resolved.url : model.url;
      return activateRoot(url).then(function (root) {
        if (!root || token !== colorToken || disposed) return false;
        if (resolved.kind === 'material') applyMaterialSpec(root, resolved.material);
        return true;
      }).catch(function () { return false; });
    }

    function tick(now) {
      if (!running || disposed) return;
      raf = requestAnimationFrame(tick);
      var delta = clock ? Math.min(0.05, clock.getDelta()) : 0.016;

      if (tween) {
        var t = Math.min(1, (now - tween.start) / tween.dur);
        var e = easeInOut(t);
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
        tween.cur.radius = tween.fs.radius + (tween.ts.radius - tween.fs.radius) * e;
        tween.cur.phi = tween.fs.phi + (tween.ts.phi - tween.fs.phi) * e;
        tween.cur.theta = tween.fs.theta + tween.dTheta * e;
        tween.offset.setFromSpherical(tween.cur);
        camera.position.copy(controls.target).add(tween.offset);
        if (t >= 1) tween = null;
      }

      if (artAnimating && artSpec) {
        var diff = artTargetT - artCurrentT;
        if (Math.abs(diff) <= 0.002 || reducedMotion()) {
          artAnimating = false;
          applyArticulationAtT(artTargetT, true);
        } else {
          applyArticulationAtT(artCurrentT + diff * Math.min(1, delta * 9.5), false);
        }
      } else if (artMixer && artClipAction && !artClipAction.paused) {
        artMixer.update(delta);
      }

      if (explodeAnimating) {
        var eDiff = explodeTargetT - explodeCurrentT;
        if (Math.abs(eDiff) <= 0.002 || reducedMotion()) {
          explodeAnimating = false;
          applyExplodedAtT(explodeTargetT, true);
        } else {
          applyExplodedAtT(explodeCurrentT + eDiff * Math.min(1, delta * 8.5), false);
        }
      }

      controls.update();
      renderer.render(scene, camera);
      updateHotspotProjections();
    }

    function start() {
      if (disposed || !loaded || running) return;
      running = true;
      if (clock) clock.getDelta();
      resize();
      raf = requestAnimationFrame(tick);
    }

    function pause() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function animateTo(toPos, toTarget) {
      if (!loaded) return;
      if (reducedMotion()) {
        camera.position.copy(toPos);
        controls.target.copy(toTarget);
        controls.update();
        return;
      }
      var THREE = L.THREE;
      var fromOffset = camera.position.clone().sub(controls.target);
      var toOffset = toPos.clone().sub(toTarget);
      var fs = new THREE.Spherical().setFromVector3(fromOffset);
      var ts = new THREE.Spherical().setFromVector3(toOffset);
      var d = ts.theta - fs.theta;
      d = ((d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      tween = {
        start: performance.now(),
        dur: 700,
        fs: fs,
        ts: ts,
        dTheta: d,
        cur: new THREE.Spherical(fs.radius, fs.phi, fs.theta),
        offset: new THREE.Vector3(),
        fromTarget: controls.target.clone(),
        toTarget: toTarget.clone()
      };
    }

    function zoomBy(factor) {
      if (!loaded) return;
      var offset = camera.position.clone().sub(controls.target);
      var nd = Math.min(home.maxD, Math.max(home.minD, offset.length() * factor));
      offset.setLength(nd);
      animateTo(controls.target.clone().add(offset), controls.target);
    }

    /** Đặt lại toàn bộ góc camera, góc chuyển động bộ phận về mặc định, thu gọn Exploded View và đóng Hotspot. */
    function resetView(opts) {
      if (!loaded) return;
      opts = opts || {};
      if (controls.autoRotate) controls.autoRotate = false;
      activePreset = 'overview';
      animateTo(home.pos, home.target);
      if (opts.resetParts !== false) {
        if (artSpec) setArticulationValue(artSpec.defaultValue, { animate: true });
        if (model.supportsExplodedView) setExplodedValue(0, { animate: true });
        if (activeHotspotId) {
          activeHotspotId = null;
          syncHotspotDotActiveStates();
          if (typeof options.onHotspotSelect === 'function') options.onHotspotSelect(null);
        }
      }
      emitState();
    }

    function resolvePresetList() {
      return buildMergedPresets(model);
    }

    function getPresets() {
      return resolvePresetList().map(function (p) { return { key: p.key, label: p.label, title: p.title }; });
    }

    function goToPreset(key) {
      if (!loaded) return;
      if (controls.autoRotate) controls.autoRotate = false;
      if (key === 'overview') {
        activePreset = 'overview';
        animateTo(home.pos, home.target);
        emitState();
        return;
      }
      var preset = resolvePresetList().filter(function (p) { return p.key === key; })[0];
      if (!preset || !preset.dir) return;
      var THREE = L.THREE;
      var target = new THREE.Vector3(preset.target[0], preset.target[1], preset.target[2]).multiplyScalar(home.radius);
      var dirV = new THREE.Vector3(preset.dir[0], preset.dir[1], preset.dir[2]).normalize();
      var d = Math.min(home.maxD, Math.max(home.minD, home.dist * preset.dist));
      activePreset = key;
      animateTo(target.clone().add(dirV.multiplyScalar(d)), target);
      emitState();
    }

    function setAutoRotate(on) {
      if (!controls || !loaded) return;
      controls.autoRotate = Boolean(on);
      if (on) { tween = null; activePreset = null; }
      emitState();
    }

    function setArticulationValue(val, opts) {
      if (!loaded || !artSpec || disposed) return;
      opts = opts || {};
      var span = Math.max(0.0001, artSpec.max - artSpec.min);
      var clampedVal = Math.min(artSpec.max, Math.max(artSpec.min, Number(val) || artSpec.min));
      var targetT = clamp01((clampedVal - artSpec.min) / span);
      artTargetT = targetT;
      if (opts.animate && !reducedMotion()) artAnimating = true;
      else {
        artAnimating = false;
        applyArticulationAtT(targetT, true);
      }
    }

    function goToArticulationPreset(key) {
      if (!loaded || !artSpec) return;
      var pr = (artSpec.presets || []).find(function (item) { return item.key === key; });
      if (!pr) return;
      setArticulationValue(pr.value, { animate: true });
      if (pr.cameraPreset) goToPreset(pr.cameraPreset);
    }

    function getArticulationSpec() {
      if (!artSpec) return null;
      return {
        type: artSpec.type,
        label: artSpec.label,
        min: artSpec.min,
        max: artSpec.max,
        step: artSpec.step,
        defaultValue: artSpec.defaultValue,
        unit: artSpec.unit,
        presets: artSpec.presets.slice(),
        currentValue: Math.round(artSpec.min + (artSpec.max - artSpec.min) * artCurrentT),
        badgeText: computeBadgeText(artSpec.min + (artSpec.max - artSpec.min) * artCurrentT)
      };
    }

    function setExplodedValue(pct, opts) {
      if (!loaded || !model.supportsExplodedView || disposed) return;
      opts = opts || {};
      var clampedPct = Math.min(100, Math.max(0, Number(pct) || 0));
      var targetT = clampedPct / 100;
      explodeTargetT = targetT;
      if (opts.animate && !reducedMotion()) explodeAnimating = true;
      else {
        explodeAnimating = false;
        applyExplodedAtT(targetT, true);
      }
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      pause();
      tween = null;
      artAnimating = false;
      explodeAnimating = false;
      cleanupMixer();
      if (hotspotHost) hotspotHost.innerHTML = '';
      hotspotItems = [];
      if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
      else window.removeEventListener('resize', resize);
      if (renderer) {
        var canvas = renderer.domElement;
        if (onContextLost) canvas.removeEventListener('webglcontextlost', onContextLost, false);
        if (onDblClick) canvas.removeEventListener('dblclick', onDblClick, false);
      }
      if (controls) {
        if (onControlsStart) controls.removeEventListener('start', onControlsStart);
        controls.dispose();
      }
      if (shadowMesh) {
        if (shadowMesh.material && shadowMesh.material.map) shadowMesh.material.map.dispose();
        disposeObject(shadowMesh);
      }
      Object.keys(rootCache).forEach(function (u) {
        if (rootCache[u] && rootCache[u].root) disposeObject(rootCache[u].root);
      });
      rootCache = {};
      rootCacheOrder = [];
      Object.keys(wallpaperCache).forEach(function (wk) {
        if (wallpaperCache[wk] && typeof wallpaperCache[wk].dispose === 'function') wallpaperCache[wk].dispose();
      });
      wallpaperCache = {};
      if (envTexture) envTexture.dispose();
      if (pmrem) pmrem.dispose();
      if (draco) draco.dispose();
      if (scene) scene.clear();
      if (renderer) {
        renderer.dispose();
        if (typeof renderer.forceContextLoss === 'function') renderer.forceContextLoss();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      renderer = scene = camera = controls = envTexture = pmrem = shadowMesh = modelRoot = loader = draco = clock = artSpec = null;
      loaded = false;
    }

    return {
      load: load,
      start: start,
      pause: pause,
      resize: resize,
      zoomIn: function () { zoomBy(0.78); },
      zoomOut: function () { zoomBy(1.28); },
      resetView: resetView,
      setColor: setColor,
      setAutoRotate: setAutoRotate,
      toggleAutoRotate: function () { setAutoRotate(!(controls && controls.autoRotate)); },
      isAutoRotate: function () { return Boolean(controls && controls.autoRotate); },
      getPresets: getPresets,
      goToPreset: goToPreset,
      getArticulationSpec: getArticulationSpec,
      getArticulationValue: function () { return artSpec ? Math.round(artSpec.min + (artSpec.max - artSpec.min) * artCurrentT) : null; },
      setArticulationValue: setArticulationValue,
      goToArticulationPreset: goToArticulationPreset,
      getHotspots: function () { return hotspotItems.map(function (it) { return Object.assign({}, it.raw); }); },
      toggleHotspots: toggleHotspots,
      areHotspotsVisible: function () { return hotspotsVisible; },
      focusHotspot: focusHotspot,
      supportsExplodedView: function () { return Boolean(model && model.supportsExplodedView); },
      setExplodedValue: setExplodedValue,
      getExplodedValue: function () { return Math.round(explodeCurrentT * 100); },
      dispose: dispose,
      isLoaded: function () { return loaded; },
      isDisposed: function () { return disposed; }
    };
  }

  window.VLU_3D_VIEWER = {
    create: create,
    hasWebGL: isWebGLAvailable,
    isWebGLAvailable: isWebGLAvailable,
    clearCache: clearSessionCache,
    getCacheStats: getSessionCacheStats,
    isCached: function (url) { return Boolean(glbBufferCache[url]); },
    getActiveSource: function () { return activeSource && activeSource.name; }
  };
})(window, document);
