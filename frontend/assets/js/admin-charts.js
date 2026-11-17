/**
 * VLU FLAGSHIP STORE – Enterprise Interactive SVG Charts 2026
 * Biểu đồ Doanh thu tương tác (Ngày / Tuần / Tháng / Năm + So sánh kỳ + Tooltip VNĐ)
 * & Biểu đồ Donut Phân bổ Trạng thái Đơn hàng
 */
(function (window, document) {
  'use strict';

  function escapeHtml(val) {
    return String(val == null ? '' : val).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function formatVND(val) {
    if (window.VLU_ADMIN && typeof window.VLU_ADMIN.formatVND === 'function') {
      return window.VLU_ADMIN.formatVND(val);
    }
    return Math.round(Number(val) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }

  function formatCompact(val) {
    if (window.VLU_ADMIN && typeof window.VLU_ADMIN.formatCompactVND === 'function') {
      return window.VLU_ADMIN.formatCompactVND(val);
    }
    var n = Number(val) || 0;
    if (n >= 1000000) return Math.round(n / 1000000) + 'tr';
    if (n >= 1000) return Math.round(n / 1000) + 'k';
    return n + '₫';
  }

  function buildSmoothPath(points) {
    if (!points.length) return '';
    if (points.length === 1) return 'M ' + points[0].x + ' ' + points[0].y;
    var d = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[i];
      var p1 = points[i + 1];
      var cx = (p0.x + p1.x) / 2;
      d += ' C ' + cx.toFixed(1) + ' ' + p0.y.toFixed(1) + ', ' + cx.toFixed(1) + ' ' + p1.y.toFixed(1) + ', ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1);
    }
    return d;
  }

  function renderRevenueChart(container, tooltipEl, series) {
    if (!container) return;
    var buckets = (series && Array.isArray(series.buckets)) ? series.buckets : [];

    if (!buckets.length) {
      container.innerHTML = '<div class="vlu-empty-state py-12"><p class="text-xs font-semibold">Không có khoảng thời gian hợp lệ để hiển thị.</p></div>';
      return;
    }

    var isDark = document.documentElement.classList.contains('admin-dark');
    var gridColor = isDark ? 'rgba(148,163,184,0.14)' : '#E6EAF0';
    var axisTextColor = isDark ? '#94A3B8' : '#78869D';
    var compareStroke = isDark ? '#64748B' : '#94A3B8';

    var W = 760;
    var H = 264;
    var padL = 62;
    var padR = 20;
    var padT = 20;
    var padB = 34;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var maxVal = 0;
    buckets.forEach(function (b) {
      if (b.revenue > maxVal) maxVal = b.revenue;
      if (series.compare && b.prevRevenue > maxVal) maxVal = b.prevRevenue;
    });
    if (maxVal <= 0) maxVal = 10000000;
    else maxVal = maxVal * 1.15;

    var count = buckets.length;
    var stepX = count > 1 ? plotW / (count - 1) : 0;

    var curPoints = [];
    var prevPoints = [];

    buckets.forEach(function (b, idx) {
      var x = count === 1 ? (padL + plotW / 2) : (padL + idx * stepX);
      var yCur = padT + plotH - (b.revenue / maxVal) * plotH;
      var yPrev = padT + plotH - (b.prevRevenue / maxVal) * plotH;
      curPoints.push({ x: x, y: yCur, bucket: b, idx: idx });
      prevPoints.push({ x: x, y: yPrev, bucket: b, idx: idx });
    });

    var gridSteps = 4;
    var gridSvg = '';
    for (var g = 0; g <= gridSteps; g++) {
      var ratio = g / gridSteps;
      var yPos = padT + plotH - ratio * plotH;
      var val = maxVal * ratio;
      gridSvg += '<line x1="' + padL + '" y1="' + yPos.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yPos.toFixed(1) + '" stroke="' + gridColor + '" stroke-dasharray="' + (g === 0 ? '' : '4 4') + '" stroke-width="1"/>';
      gridSvg += '<text x="' + (padL - 10) + '" y="' + (yPos + 4).toFixed(1) + '" text-anchor="end" fill="' + axisTextColor + '" font-size="10.5" font-weight="600">' + escapeHtml(g === 0 ? '0₫' : formatCompact(val)) + '</text>';
    }

    // X-axis labels thinned cleanly
    var maxLabels = 9;
    var labelStep = count > maxLabels ? Math.ceil(count / maxLabels) : 1;
    var xLabelsSvg = '';
    curPoints.forEach(function (pt, idx) {
      if (idx === 0 || idx === count - 1 || idx % labelStep === 0) {
        xLabelsSvg += '<text x="' + pt.x.toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" fill="' + axisTextColor + '" font-size="10.5" font-weight="600">' + escapeHtml(pt.bucket.shortLabel) + '</text>';
      }
    });

    // Build paths
    var curLinePath = buildSmoothPath(curPoints);
    var baselineY = padT + plotH;
    var curAreaPath = curPoints.length > 1
      ? curLinePath + ' L ' + curPoints[curPoints.length - 1].x.toFixed(1) + ' ' + baselineY + ' L ' + curPoints[0].x.toFixed(1) + ' ' + baselineY + ' Z'
      : '';

    var prevLineSvg = '';
    if (series.compare && prevPoints.length > 1) {
      var prevPath = buildSmoothPath(prevPoints);
      prevLineSvg = '<path d="' + prevPath + '" fill="none" stroke="' + compareStroke + '" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>';
    }

    var areaAndLineSvg = '';
    if (curPoints.length === 1) {
      var single = curPoints[0];
      var barH = Math.max(4, baselineY - single.y);
      areaAndLineSvg = '<rect x="' + (single.x - 24).toFixed(1) + '" y="' + single.y.toFixed(1) + '" width="48" height="' + barH.toFixed(1) + '" rx="8" fill="#D10D32" opacity="0.88"/>';
    } else {
      areaAndLineSvg =
        '<path d="' + curAreaPath + '" fill="url(#vluRevenueAreaGrad)"/>' +
        prevLineSvg +
        '<path d="' + curLinePath + '" fill="none" stroke="#D10D32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    }

    // Data points + interactive vertical hover zones
    var dotsSvg = '';
    var hitboxesSvg = '';
    var bandW = count > 1 ? Math.max(16, stepX) : plotW;

    curPoints.forEach(function (pt, idx) {
      var showDot = count <= 24 || pt.bucket.revenue > 0;
      if (showDot) {
        dotsSvg += '<circle class="rev-dot" data-idx="' + idx + '" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="' + (pt.bucket.revenue > 0 ? 4 : 2.5) + '" fill="' + (pt.bucket.revenue > 0 ? '#D10D32' : (isDark ? '#151E30' : '#FFFFFF')) + '" stroke="#D10D32" stroke-width="2"/>';
      }
      var hx = Math.max(padL, pt.x - bandW / 2);
      var hw = Math.min(W - padR - hx, bandW);
      hitboxesSvg += '<rect class="rev-hitbox cursor-pointer" data-idx="' + idx + '" x="' + hx.toFixed(1) + '" y="' + padT + '" width="' + Math.max(8, hw).toFixed(1) + '" height="' + plotH + '" fill="transparent"/>';
    });

    var legendRow =
      '<div class="vlu-chart-legend mt-2 pt-2 border-t border-slate-100/80">' +
        '<span class="inline-flex items-center gap-1.5">' +
          '<span class="h-2.5 w-2.5 rounded-full bg-brand inline-block"></span>' +
          '<span>Kỳ đang chọn</span>' +
        '</span>' +
        (series.compare
          ? '<span class="inline-flex items-center gap-1.5">' +
              '<span class="w-4 border-t-2 border-dashed inline-block" style="border-color:' + compareStroke + '"></span>' +
              '<span>Kỳ trước (so sánh)</span>' +
            '</span>'
          : '') +
      '</div>';

    container.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" class="w-full h-auto select-none overflow-visible" role="img" aria-label="Biểu đồ doanh thu tương tác">' +
        '<defs>' +
          '<linearGradient id="vluRevenueAreaGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#D10D32" stop-opacity="0.22"/>' +
            '<stop offset="100%" stop-color="#D10D32" stop-opacity="0.01"/>' +
          '</linearGradient>' +
        '</defs>' +
        gridSvg +
        '<line id="revCrosshairLine" x1="-100" y1="' + padT + '" x2="-100" y2="' + baselineY + '" stroke="#D10D32" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="3 3" class="hidden"/>' +
        areaAndLineSvg +
        xLabelsSvg +
        dotsSvg +
        '<circle id="revPrevActiveRing" cx="-100" cy="-100" r="4.5" fill="' + compareStroke + '" stroke="#FFFFFF" stroke-width="2" class="hidden"/>' +
        '<circle id="revActiveRing" cx="-100" cy="-100" r="6" fill="#D10D32" stroke="#FFFFFF" stroke-width="2.5" class="hidden"/>' +
        hitboxesSvg +
      '</svg>' +
      legendRow;

    // Bind hover tooltip interactions
    if (!tooltipEl) return;
    var svg = container.querySelector('svg');
    var crosshair = container.querySelector('#revCrosshairLine');
    var activeRing = container.querySelector('#revActiveRing');
    var prevActiveRing = container.querySelector('#revPrevActiveRing');
    var hitboxes = container.querySelectorAll('.rev-hitbox');

    function hideTooltip() {
      tooltipEl.classList.remove('is-visible');
      if (crosshair) crosshair.classList.add('hidden');
      if (activeRing) activeRing.classList.add('hidden');
      if (prevActiveRing) prevActiveRing.classList.add('hidden');
    }

    function showTooltipForIndex(idx, clientX, clientY) {
      var pt = curPoints[idx];
      var prevPt = prevPoints[idx];
      if (!pt) return;
      var b = pt.bucket;

      if (crosshair) {
        crosshair.setAttribute('x1', pt.x.toFixed(1));
        crosshair.setAttribute('x2', pt.x.toFixed(1));
        crosshair.classList.remove('hidden');
      }
      if (activeRing) {
        activeRing.setAttribute('cx', pt.x.toFixed(1));
        activeRing.setAttribute('cy', pt.y.toFixed(1));
        activeRing.classList.remove('hidden');
      }
      if (prevActiveRing) {
        if (series.compare && prevPt && curPoints.length > 1) {
          prevActiveRing.setAttribute('cx', prevPt.x.toFixed(1));
          prevActiveRing.setAttribute('cy', prevPt.y.toFixed(1));
          prevActiveRing.classList.remove('hidden');
        } else {
          prevActiveRing.classList.add('hidden');
        }
      }

      var compareHtml = '';
      if (series.compare) {
        var diff = b.revenue - b.prevRevenue;
        var deltaPct = b.prevRevenue > 0
          ? Math.round((diff / b.prevRevenue) * 1000) / 10
          : (b.revenue > 0 ? 100 : 0);
        var badgeClr = diff >= 0 ? 'text-emerald-400' : 'text-red-400';
        var sign = diff > 0 ? '+' : '';
        compareHtml =
          '<div class="mt-1.5 pt-1.5 border-t border-white/10 space-y-0.5 text-[11px]">' +
            '<div class="flex items-center justify-between gap-3 text-slate-300">' +
              '<span>' + escapeHtml(b.prevLabel) + ':</span>' +
              '<span class="font-bold tabular-nums">' + escapeHtml(formatVND(b.prevRevenue)) + '</span>' +
            '</div>' +
            '<div class="flex items-center justify-between gap-3">' +
              '<span class="text-slate-400">Chênh lệch:</span>' +
              '<span class="font-bold tabular-nums ' + badgeClr + '">' + sign + deltaPct + '%</span>' +
            '</div>' +
          '</div>';
      }

      tooltipEl.innerHTML =
        '<p class="text-[11px] font-semibold text-slate-300 mb-0.5">' + escapeHtml(b.label) + '</p>' +
        '<p class="text-sm font-extrabold text-white tabular-nums">' + escapeHtml(formatVND(b.revenue)) + '</p>' +
        '<p class="text-[11px] text-slate-300 mt-0.5">' + b.orderCount + ' đơn hàng hợp lệ</p>' +
        compareHtml;

      tooltipEl.classList.add('is-visible');

      var wrapRect = container.getBoundingClientRect();
      var tipW = tooltipEl.offsetWidth || 190;
      var tipH = tooltipEl.offsetHeight || 85;
      var relX = (pt.x / W) * wrapRect.width;
      var relY = (pt.y / H) * wrapRect.height;

      var left = relX + 14;
      if (left + tipW > wrapRect.width - 8) {
        left = Math.max(8, relX - tipW - 14);
      }
      var top = Math.max(6, Math.min(wrapRect.height - tipH - 6, relY - tipH / 2));

      tooltipEl.style.left = Math.round(left) + 'px';
      tooltipEl.style.top = Math.round(top) + 'px';
    }

    hitboxes.forEach(function (box) {
      box.addEventListener('mouseenter', function (e) {
        var idx = parseInt(box.getAttribute('data-idx'), 10);
        showTooltipForIndex(idx, e.clientX, e.clientY);
      });
      box.addEventListener('mousemove', function (e) {
        var idx = parseInt(box.getAttribute('data-idx'), 10);
        showTooltipForIndex(idx, e.clientX, e.clientY);
      });
      box.addEventListener('click', function () {
        var idx = parseInt(box.getAttribute('data-idx'), 10);
        showTooltipForIndex(idx);
      });
    });

    if (svg) {
      svg.addEventListener('mouseleave', hideTooltip);
    }
  }

  function renderOrderStatusDonut(container, breakdown, onSelectStatus) {
    if (!container) return;
    var items = (breakdown && Array.isArray(breakdown.items)) ? breakdown.items : [];
    var total = (breakdown && breakdown.total) || 0;

    var size = 168;
    var cx = size / 2;
    var cy = size / 2;
    var r = 60;
    var circ = 2 * Math.PI * r;
    var offset = 0;

    var arcsSvg = '';
    if (total === 0) {
      arcsSvg = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--admin-border)" stroke-width="18"/>';
    } else {
      items.forEach(function (item) {
        if (!item.count) return;
        var frac = item.count / total;
        var segLen = frac * circ;
        var gap = items.filter(function (x) { return x.count > 0; }).length > 1 ? 2.5 : 0;
        var drawLen = Math.max(1, segLen - gap);
        arcsSvg +=
          '<circle class="donut-seg cursor-pointer transition-opacity duration-150 hover:opacity-80" ' +
            'data-status="' + escapeHtml(item.key) + '" ' +
            'cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" ' +
            'stroke="' + item.color + '" stroke-width="18" ' +
            'stroke-dasharray="' + drawLen.toFixed(2) + ' ' + circ.toFixed(2) + '" ' +
            'stroke-dashoffset="' + (-offset).toFixed(2) + '" ' +
            'transform="rotate(-90 ' + cx + ' ' + cy + ')">' +
            '<title>' + escapeHtml(item.label + ': ' + item.count + ' đơn (' + item.pct + '%)') + '</title>' +
          '</circle>';
        offset += segLen;
      });
    }

    var legendHtml = items.map(function (item) {
      return '<button type="button" class="donut-legend-btn w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-left" data-status="' + escapeHtml(item.key) + '">' +
        '<span class="flex items-center gap-2 min-w-0">' +
          '<span class="h-2.5 w-2.5 rounded-full shrink-0" style="background:' + item.color + '"></span>' +
          '<span class="text-xs font-semibold truncate" style="color: var(--admin-text-primary);">' + escapeHtml(item.label) + '</span>' +
        '</span>' +
        '<span class="flex items-center gap-2 shrink-0 text-xs tabular-nums">' +
          '<span class="text-[10px] hidden sm:inline" style="color: var(--admin-text-secondary);">' + (item.revenue > 0 ? escapeHtml(formatCompact(item.revenue)) : '0₫') + '</span>' +
          '<strong style="color: var(--admin-text-primary);">' + item.count + '</strong>' +
          '<span class="text-[11px] w-11 text-right" style="color: var(--admin-text-secondary);">' + item.pct + '%</span>' +
        '</span>' +
      '</button>';
    }).join('');

    container.innerHTML =
      '<div class="flex flex-col items-center gap-4">' +
        '<div class="relative flex items-center justify-center">' +
          '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Phân bổ trạng thái đơn hàng">' +
            arcsSvg +
          '</svg>' +
          '<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">' +
            '<span class="text-[11px] font-semibold" style="color: var(--admin-text-secondary);">Tổng đơn</span>' +
            '<span class="text-2xl font-extrabold tabular-nums" style="color: var(--admin-text-primary);">' + total + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="w-full space-y-1">' + legendHtml + '</div>' +
      '</div>';

    if (typeof onSelectStatus === 'function') {
      container.querySelectorAll('[data-status]').forEach(function (el) {
        el.addEventListener('click', function () {
          var st = el.getAttribute('data-status');
          if (st) onSelectStatus(st);
        });
      });
    }
  }

  window.VLU_ADMIN_CHARTS = {
    renderRevenueChart: renderRevenueChart,
    renderOrderStatusDonut: renderOrderStatusDonut
  };
})(window, document);
