/* ModexAgent — particle morph engine (T4). Vanilla JS, no deps, IIFE.
   Faithful port of the validated prototype (prototype/index.html) — do not
   tune physics/extraction rules (§5.2). Config contract: see home.html. */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* §4.1 palettes: NIGHT glows, DAY crisp. */
  var PAL = {
    day:   { main: ["#0D9488", "#0F766E", "#14B8A6"], ember: ["#B45309", "#D97706"], ratio: 0.15, glow: false },
    night: { main: ["#5EEAD4", "#2DD4A8", "#99F6E4"], ember: ["#FBBF24", "#F59E0B"], ratio: 0.15, glow: true }
  };

  var GATHER = 4200, DISPERSE = 1000, TAU = Math.PI * 2;
  var layout = { cx: 0.5, cy: 0.27, s: 0.46 }; // Variant A, validated

  var cv = null, ctx = null, stage = null, labelEl = null;
  var W = 0, H = 0, DPR = 1;
  var particles = [], shapes = [], shapeIdx = 0;
  var phase = "gather", phaseStart = performance.now();
  var mouse = { x: -9999, y: -9999 };
  var pageVisible = true, inView = true;
  var raf = null, last = performance.now();
  var knightImg = null;
  var theme = "night";

  function hexRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function gradColor(stops, t) {
    var n = stops.length - 1, x = t * n, i = Math.min(Math.floor(x), n - 1), f = x - i;
    var a = hexRgb(stops[i]), b = hexRgb(stops[i + 1]);
    return [(a[0] + (b[0] - a[0]) * f) | 0, (a[1] + (b[1] - a[1]) * f) | 0, (a[2] + (b[2] - a[2]) * f) | 0];
  }  function recolor() {
    var pal = PAL[theme], rayC = hexRgb(theme === "night" ? "#FBBF24" : "#D97706");
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      p.color = p.ray ? rayC
        : (p.ember ? hexRgb(pal.ember[(p.seed % pal.ember.length) | 0]) : gradColor(pal.main, p.t));
    }
  }
  function currentTheme() {
    return document.body.getAttribute("data-md-color-scheme") === "slate" ? "night" : "day";
  }

  /* Validated predicates (§5.2) — do not tune. */
  function sample(drawFn, gap, fromImage) {
    var off = document.createElement("canvas");
    off.width = W; off.height = H;
    var o = off.getContext("2d", { willReadFrequently: true });
    o.fillStyle = "#fff"; o.strokeStyle = "#fff";
    drawFn(o);
    var data = o.getImageData(0, 0, W, H).data, pts = [];
    for (var y = 0; y < H; y += gap) for (var x = 0; x < W; x += gap) {
      var k = (y * W + x) * 4;
      if (fromImage) {
        if (data[k + 3] < 128) continue;                 // transparent canvas is NOT a target
        var r = data[k], g = data[k + 1], b = data[k + 2];
        if (r > 237 && g > 237 && b > 237) continue;     // drop white bg
        var ray = r > 190 && g > 170 && b < 160;         // sun-rays → golden layer
        var ember = !ray && r > 150 && (r - g) > 100 && (r - b) > 100; // true reds only
        pts.push({ x: x, y: y, ember: ember, ray: ray });
      } else if (data[k + 3] > 128) {
        pts.push({ x: x, y: y, ember: false, ray: false });
      }
    }
    return pts;
  }
  function CX() { return W * layout.cx; }
  function CY() { return H * layout.cy; }
  function S() { return Math.min(W, H) * layout.s; }

  function stroke(o, T, s, w, c, p) {
    var a = T(50, 50), b = T(c[0], c[1]), e = T(p[0], p[1]);
    o.lineWidth = w * s; o.beginPath(); o.moveTo(a[0], a[1]);
    o.quadraticCurveTo(b[0], b[1], e[0], e[1]); o.stroke();
  }
  var drawWordmark = function (o) {
    var size = Math.min(W / 6.8, 118);
    o.font = "700 " + size + "px 'Space Grotesk',sans-serif";
    o.textAlign = "center"; o.textBaseline = "middle";
    o.fillText("ModexAgent", CX(), CY());
  };
  var drawHub = function (o) {
    var s = S() / 100, cx = CX(), cy = CY();
    var T = function (x, y) { return [cx + (x - 50) * s, cy + (y - 50) * s]; };
    o.lineCap = "round";
    var arms = [[[58, 32], [50, 14]], [[68, 42], [86, 50]], [[42, 68], [50, 86]], [[32, 58], [14, 50]]];
    var diags = [[[60, 40], [71.2, 28.8]], [[60, 60], [71.2, 71.2]], [[40, 60], [28.8, 71.2]], [[40, 40], [28.8, 28.8]]];
    var i, a;
    for (i = 0; i < arms.length; i++) stroke(o, T, s, 2.6, arms[i][0], arms[i][1]);
    /* diagonals FULL alpha (sampler drops <50%); hierarchy via width */
    for (i = 0; i < diags.length; i++) stroke(o, T, s, 1.2, diags[i][0], diags[i][1]);
    var dia = [[50, 39], [61, 50], [50, 61], [39, 50]].map(function (pt) { return T(pt[0], pt[1]); });
    o.beginPath();
    dia.forEach(function (xy, j) { if (j) o.lineTo(xy[0], xy[1]); else o.moveTo(xy[0], xy[1]); });
    o.closePath(); o.fill();
    var nodes = [[50, 14, 4.6], [86, 50, 4.6], [50, 86, 4.6], [14, 50, 4.6],
                 [71.2, 28.8, 2.1], [71.2, 71.2, 2.1], [28.8, 71.2, 2.1], [28.8, 28.8, 2.1]];
    for (i = 0; i < nodes.length; i++) {
      a = T(nodes[i][0], nodes[i][1]);
      o.beginPath(); o.arc(a[0], a[1], nodes[i][2] * s, 0, 7); o.fill();
    }
  };
  var drawKnight = function (o) {
    if (!knightImg) return;
    var s = S() * 1.12;
    o.drawImage(knightImg, CX() - s / 2, CY() - s / 2, s, s);
  };
  var drawPuzzle = function (o) {
    var size = S() * 0.78;
    o.font = size + "px serif"; o.textAlign = "center"; o.textBaseline = "middle";
    o.fillText("🧩", CX(), CY());
  };

  function gapBy(d, m) { return function () { return Math.max(m || 3, Math.round(W / d)); }; }
  function defineShapes() {
    var d = cv.dataset;
    shapes = [
      { fn: drawWordmark, gap: gapBy(360),    label: d.labelWordmark || "" },
      { fn: drawHub,      gap: gapBy(380),    label: d.labelHub || "" },
      { fn: drawKnight,   gap: gapBy(300),    label: d.labelKnight || "", img: true },
      { fn: drawPuzzle,   gap: gapBy(300, 4), label: d.labelPuzzle || "" }
    ];
  }

  function setLabel(i) {
    var txt = shapes[i].label;
    if (!labelEl || !txt || labelEl.textContent === txt) return;
    labelEl.style.opacity = 0;
    setTimeout(function () { labelEl.textContent = txt; labelEl.style.opacity = 1; }, 280);
  }

  function applyShape(i) {
    var s = shapes[i];
    var pts = sample(s.fn, s.gap(), !!s.img);
    if (pts.length < 30) return;
    var shuffled = pts.slice();
    for (var k = shuffled.length - 1; k > 0; k--) {
      var j = (Math.random() * (k + 1)) | 0;
      var tmp = shuffled[k]; shuffled[k] = shuffled[j]; shuffled[j] = tmp;
    }
    var maxN = W < 700 ? 1000 : 2200;
    var n = Math.min(shuffled.length, maxN);
    while (particles.length < n) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0,
        r: 1.1 + Math.random() * 1.7, tx: 0, ty: 0, t: particles.length / maxN,
        seed: Math.random() * 1000, ember: Math.random() < PAL[theme].ratio, ray: false, color: [255, 255, 255]
      });
    }
    if (particles.length > n) particles.length = n;
    for (k = 0; k < n; k++) {
      var p = particles[k], t = shuffled[k];
      p.tx = t.x + (Math.random() - 0.5) * 2; p.ty = t.y + (Math.random() - 0.5) * 2;
      p.ray = (s.img && t.ray) ? true : false;
      if (s.img && t.ember !== undefined) p.ember = t.ember;
    }
    recolor();
    setLabel(i);
  }

  function disperse() {
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k], a = Math.random() * TAU, sp = 2 + Math.random() * 7;
      p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp;
    }
  }

  function rgb(c) { return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; }
  function dot(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }

  /* single rAF loop */
  function frame(now) {
    raf = null;
    if (!isVisible()) return;
    var dt = Math.min((now - last) / 16.7, 3); last = now;
    var elapsed = now - phaseStart;
    if (phase === "gather" && elapsed > GATHER) {
      phase = "disperse"; phaseStart = now; disperse();
    } else if (phase === "disperse" && elapsed > DISPERSE) {
      phase = "gather"; phaseStart = now;
      shapeIdx = (shapeIdx + 1) % shapes.length;
      applyShape(shapeIdx);
    }

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var glow = PAL[theme].glow, R2 = 110 * 110;
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      if (phase === "gather") {
        var wob = Math.sin(now * 0.0012 + p.seed) * 0.35;
        p.vx += ((p.tx - p.x) * 0.045 + wob * 0.05) * dt;
        p.vy += ((p.ty - p.y) * 0.045 + wob * 0.04) * dt;
        p.vx *= Math.pow(0.86, dt); p.vy *= Math.pow(0.86, dt);
      } else {
        p.vx *= Math.pow(0.965, dt); p.vy *= Math.pow(0.965, dt);
      }
      var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 0.01) {
        var d = Math.sqrt(d2), f = (1 - d / 110) * 2.6;
        p.vx += dx / d * f * dt; p.vy += dy / d * f * dt;
      }
      p.x += p.vx * dt; p.y += p.vy * dt;
      var c = p.color, rr = p.ray ? p.r * 0.7 : p.r;
      if (glow) {
        ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.09)";
        dot(p.x, p.y, rr * 2.7);
      }
      ctx.fillStyle = rgb(c);
      dot(p.x, p.y, rr);
    }
    raf = requestAnimationFrame(frame);
  }

  function isVisible() { return pageVisible && inView; }
  function kick() {
    if (!raf && isVisible() && !REDUCED) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  /* reduced motion: one static frame, no loop */
  function drawStatic() {
    var s = shapes[shapeIdx];
    var pts = sample(s.fn, s.gap(), !!s.img);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var pal = PAL[theme], rayC = hexRgb(theme === "night" ? "#FBBF24" : "#D97706");
    pts.forEach(function (t, i) {
      var c = t.ray ? rayC : (t.ember ? hexRgb(pal.ember[0]) : gradColor(pal.main, i / pts.length));
      ctx.fillStyle = rgb(c);
      ctx.fillRect(t.x, t.y, 2, 2);
    });
  }

  function resize() {
    if (!stage) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth; H = stage.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    if (shapes.length) applyShape(shapeIdx);
    if (REDUCED) drawStatic();
  }

  function bindStage() {
    ctx = cv.getContext("2d");
    resize();
    stage.onpointermove = function (e) {
      var r = stage.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    stage.onpointerleave = function () { mouse.x = -9999; mouse.y = -9999; };
  }

  function init() {
    cv = document.getElementById("pcv");
    stage = document.getElementById("hero");
    if (!cv || !stage) return;
    labelEl = stage.querySelector(".mdx-shape-label");
    theme = currentTheme();
    defineShapes();

    /* Boot after BOTH knight image AND font (3s timeout each) — the
       prototype race that silently skipped the knight. */
    var knightSrc = cv.dataset.knightSrc;
    var knightReady = new Promise(function (res) {
      if (!knightSrc) { res(); return; }
      var img = new Image();
      img.onload = function () { knightImg = img; res(); };
      img.onerror = function () { res(); };
      img.src = knightSrc;
      setTimeout(res, 3000);
    });
    var fontsReady = (document.fonts && document.fonts.load)
      ? Promise.race([
          document.fonts.load("700 100px 'Space Grotesk'").catch(function () {}),
          new Promise(function (res) { setTimeout(res, 3000); })
        ])
      : Promise.resolve();

    Promise.all([knightReady, fontsReady]).then(function () {
      bindStage();
      applyShape(0);
      phaseStart = performance.now();
      kick();
    });

    /* scheme switch: live re-color, no engine restart */
    new MutationObserver(function () {
      theme = currentTheme();
      recolor();
      if (REDUCED) drawStatic();
    }).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });

    /* pause off-viewport / tab-hidden */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (isVisible()) kick();
      }, { threshold: 0 }).observe(stage);
    }
    document.addEventListener("visibilitychange", function () {
      pageVisible = !document.hidden;
      if (isVisible()) kick();
    });

    var rTimer;
    window.addEventListener("resize", function () {
      clearTimeout(rTimer);
      rTimer = setTimeout(resize, 200);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
