// Vanilla JS (no jQuery) for the space-themed portfolio.
// Handles: light/dark toggle, hero role rotator, the solar-system backdrop and
// its veil, scroll reveal, About handwriting jitter, and the post-it wool threads.
(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var syncVeil = null;   // assigned by the backdrop below, if there is one

  // ---- Shared helpers -----------------------------------------------------
  //  Deterministic pseudo-random: a sine hash, so the starfield, the
  //  handwriting jitter and the yarn all look the same on every redraw instead
  //  of reshuffling each time the theme flips. Each caller takes its own salt
  //  so the three streams do not correlate.
  function seededRandom(mul, add) {
    return function (n) {
      var x = Math.sin(n * mul + add) * 43758.5453;
      return x - Math.floor(x);
    };
  }

  //  Rebuilding the canvas or the yarn is expensive; let the drag settle first.
  function onResizeSettled(fn) {
    var timer;
    window.addEventListener("resize", function () {
      clearTimeout(timer);
      timer = setTimeout(fn, 150);
    }, { passive: true });
  }

  function cssVar(styles, name, fallback) {
    var value = styles.getPropertyValue(name).trim();
    return value === "" ? fallback : value;
  }

  // ---- Theme toggle -------------------------------------------------------
  function currentTheme() {
    return root.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function toggleLabel(theme) {
    return theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    //  The markup ships the light-mode label, but the no-FOUC script in <head>
    //  may already have put us in dark, so correct it before anyone reads it.
    toggle.setAttribute("aria-label", toggleLabel(currentTheme()));
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      toggle.setAttribute("aria-label", toggleLabel(next));
      drawThreads();
      if (syncVeil) syncVeil();   // day and night veil the sky by different amounts
    });
  }

  // ---- Hero role rotator --------------------------------------------------
  //  One role at a time. When there is nothing to cycle the words with — no JS,
  //  or motion turned down — the stylesheet lays them out as a plain inline
  //  list instead; revealing all of them here would stack three words in the
  //  one grid cell the rotator shares.
  var words = document.querySelectorAll("[data-roles] .occupation");
  if (words.length) {
    var i = 0;
    words[i].classList.add("is-visible");
    if (words.length > 1 && !reduceMotion) {
      setInterval(function () {
        words[i].classList.remove("is-visible");
        i = (i + 1) % words.length;
        words[i].classList.add("is-visible");
      }, 2600);
    }
  }

  // =========================================================================
  //  Solar-system backdrop
  // =========================================================================
  //  The sun hangs in the upper right and the eight planets run real Kepler
  //  orbits around it: elliptical, sun at a focus, periods from the third law
  //  (T = a^1.5), all seen from a shallow angle above the ecliptic. Sizes and
  //  orbital radii are compressed by a power law — true to scale, Mercury and
  //  Neptune cannot share a screen — but every ratio, speed and phase is
  //  ordered as the real thing. A planet on the far side of its orbit is drawn
  //  before the sun, so it passes behind it.
  var cosmos = document.getElementById("cosmos");
  if (cosmos && cosmos.getContext) {
    var ctx = cosmos.getContext("2d");

    var YEAR = 22;     // seconds of wall clock per Earth year
    var TILT = 0.42;   // vertical squash of the ecliptic = cos(view angle)
    var TAU = Math.PI * 2;

    // a: semi-major axis (AU) · e: eccentricity · m0: mean anomaly at load
    // w: longitude of perihelion · km: equatorial radius · lit/mid/dark: surface
    var PLANETS = [
      { a: 0.387, e: 0.206, m0: 4.40, w: 1.35, km: 2440,  lit: "#d3c3ae", mid: "#8b7b6b", dark: "#2b2620" },
      { a: 0.723, e: 0.007, m0: 3.18, w: 2.30, km: 6052,  lit: "#fceec2", mid: "#d7b06a", dark: "#3a2f1c" },
      { a: 1.000, e: 0.017, m0: 6.24, w: 1.80, km: 6371,  lit: "#9ccbf5", mid: "#3a76c4", dark: "#0d1e3e", moon: true },
      { a: 1.524, e: 0.093, m0: 0.34, w: 5.87, km: 3390,  lit: "#eaa079", mid: "#b44e2c", dark: "#33120b" },
      { a: 5.203, e: 0.048, m0: 0.60, w: 0.25, km: 69911, lit: "#f3e0c0", mid: "#c59a68", dark: "#38281a", bands: true },
      { a: 9.537, e: 0.054, m0: 0.87, w: 1.62, km: 58232, lit: "#f6e7bd", mid: "#cbae76", dark: "#382e1f", rings: true },
      { a: 19.19, e: 0.047, m0: 2.96, w: 3.01, km: 25362, lit: "#c7eef3", mid: "#78bfcd", dark: "#153139" },
      { a: 30.07, e: 0.009, m0: 5.32, w: 0.79, km: 24622, lit: "#8fadf2", mid: "#3c5cc2", dark: "#0f1b42" }
    ];

    var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, AU = 0, RK = 0;
    var stars = [], orbits = [], shift = 0, t0 = null, elapsed = 0, raf = 0;
    var night = currentTheme() === "dark";

    // The sky is a full-screen gradient that only changes on resize or on a
    // theme flip, so it is rasterised once into an offscreen canvas and blitted
    // per frame rather than re-shaded 60 times a second.
    var skyCanvas = document.createElement("canvas");
    var skyCtx = skyCanvas.getContext("2d");
    var skyFor = null;

    var rndStar = seededRandom(12.9898, 78.233);

    function orbitPx(a) { return AU * Math.pow(a / 30.07, 0.42); }
    function bodyPx(km) { return Math.max(1.4, RK * Math.pow(km / 69911, 0.45)); }

    //  Both skies live in the stylesheet as --sky-0/1/2, which is also what
    //  --cosmos-fallback is built from, so the canvas and the no-JS gradient
    //  cannot drift apart. Read once per rebuild, never per frame.
    function buildSky() {
      skyCanvas.width = cosmos.width;
      skyCanvas.height = cosmos.height;
      skyCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cs = getComputedStyle(root);
      var sky = skyCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 1.15);
      sky.addColorStop(0, cssVar(cs, "--sky-0", "#fff"));
      sky.addColorStop(parseFloat(cssVar(cs, "--sky-mid", "0.45")), cssVar(cs, "--sky-1", "#eef4fd"));
      sky.addColorStop(1, cssVar(cs, "--sky-2", "#e3eaf7"));
      skyCtx.fillStyle = sky;
      skyCtx.fillRect(0, 0, W, H);
      skyFor = night + "|" + W + "x" + H;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cosmos.clientWidth;
      H = cosmos.clientHeight;
      if (!W || !H) return;
      cosmos.width = Math.round(W * dpr);
      cosmos.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The sun sits up and to the right, clear of the hero card, so the inner
      // planets stay in the open and the outer orbits sweep across the page.
      cx = W * 0.79;
      cy = H * 0.3;
      AU = Math.max(W, H) * 0.72;      // Neptune's orbit, in px
      RK = Math.max(W, H) * 0.011;     // Jupiter's disc, in px

      var count = Math.round(Math.min(Math.max((W * H) / 7200, 60), 240));
      stars.length = 0;
      for (var s = 0; s < count; s++) {
        stars.push({
          x: rndStar(s) * W,
          y: rndStar(s + 0.5) * H * 1.25 - H * 0.12,   // room to drift on scroll
          r: 0.35 + rndStar(s + 1.5) * 1.05,
          a: 0.3 + rndStar(s + 2.5) * 0.65,
          p: rndStar(s + 3.5) * TAU,
          v: 0.5 + rndStar(s + 4.5) * 1.9
        });
      }
      orbits = PLANETS.map(orbitPath);
      if (reduceMotion) paint(elapsed);        // one still frame, no loop
    }

    // Kepler's equation, M = E - e·sin E, by Newton-Raphson
    function eccentricAnomaly(M, e) {
      var E = M;
      for (var k = 0; k < 5; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      return E;
    }

    // position in the orbital plane -> screen, squashed by the viewing angle
    function place(p, E) {
      var A = orbitPx(p.a), B = A * Math.sqrt(1 - p.e * p.e);
      var xo = A * (Math.cos(E) - p.e), yo = B * Math.sin(E);
      var cw = Math.cos(p.w), sw = Math.sin(p.w);
      var depth = xo * sw + yo * cw;           // > 0 = near side of the orbit
      return { x: cx + xo * cw - yo * sw, y: cy + depth * TILT, depth: depth };
    }

    //  An orbit outline only moves when the viewport does, so each one is
    //  tessellated once per resize into a Path2D. Walking all eight ellipses
    //  segment by segment inside paint() cost 584 path commands every frame to
    //  redraw a shape that had not changed.
    function orbitPath(p) {
      var A = orbitPx(p.a), B = A * Math.sqrt(1 - p.e * p.e);
      var cw = Math.cos(p.w), sw = Math.sin(p.w);
      var path = new Path2D();
      for (var k = 0; k <= 72; k++) {
        var E = (k / 72) * TAU;
        var xo = A * (Math.cos(E) - p.e), yo = B * Math.sin(E);
        var x = cx + xo * cw - yo * sw, y = cy + (xo * sw + yo * cw) * TILT;
        if (k) path.lineTo(x, y); else path.moveTo(x, y);
      }
      path.closePath();
      return path;
    }

    // lit from the sun: the gradient's focus is pushed toward it, so every
    // planet carries a terminator on the side facing away
    function drawBody(p, x, y, r) {
      var dx = cx - x, dy = cy - y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      var g = ctx.createRadialGradient(
        x + (dx / d) * r * 0.55, y + (dy / d) * r * 0.55, r * 0.06,
        x, y, r * 1.02
      );
      g.addColorStop(0, p.lit);
      g.addColorStop(0.5, p.mid);
      g.addColorStop(1, p.dark);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = g;
      ctx.fill();
      if (!night) {                    // inked limb, so cream planets hold on white
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = "rgba(24, 36, 72, 0.38)";
        ctx.stroke();
      }

      if (p.bands && r > 5) {          // Jupiter's belts
        ctx.save();
        ctx.clip();
        ctx.fillStyle = "rgba(120, 86, 52, 0.22)";
        [-0.58, -0.16, 0.3, 0.66].forEach(function (f, n) {
          ctx.beginPath();
          ctx.ellipse(x, y + r * f, r, r * (n % 2 ? 0.09 : 0.14), 0, 0, TAU);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    function drawRings(x, y, r, front) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, TILT * 0.85);       // the ring plane lies in the ecliptic
      ctx.lineWidth = r * 0.34;
      ctx.strokeStyle = front ? "rgba(232, 214, 172, 0.62)" : "rgba(232, 214, 172, 0.34)";
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.95, front ? 0 : Math.PI, front ? Math.PI : TAU);
      ctx.stroke();
      ctx.lineWidth = r * 0.06;        // Cassini division
      ctx.strokeStyle = "rgba(40, 30, 18, 0.35)";
      ctx.beginPath();
      ctx.arc(0, 0, r * 2.0, front ? 0 : Math.PI, front ? Math.PI : TAU);
      ctx.stroke();
      ctx.restore();
    }

    function drawSun(t) {
      var r = RK * 2.3 * (1 + Math.sin(t * 0.6) * 0.015);
      var halo = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 8);
      halo.addColorStop(0, night ? "rgba(255, 244, 206, 0.85)" : "rgba(255, 226, 160, 0.7)");
      halo.addColorStop(0.09, night ? "rgba(255, 211, 122, 0.45)" : "rgba(255, 198, 104, 0.34)");
      halo.addColorStop(0.26, "rgba(255, 149, 54, 0.15)");
      halo.addColorStop(1, "rgba(255, 128, 40, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 8, 0, TAU);
      ctx.fillStyle = halo;
      ctx.fill();

      var disc = ctx.createRadialGradient(cx - r * 0.18, cy - r * 0.2, r * 0.1, cx, cy, r);
      disc.addColorStop(0, "#fffdf3");
      disc.addColorStop(0.55, "#ffe08c");
      disc.addColorStop(1, "#ff9a38");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.fillStyle = disc;
      ctx.fill();
    }

    function paint(t) {
      //  Same orbits, two skies. A white overlay on a black sky can only ever
      //  make grey, so by day the system is drawn as an orrery inked on the
      //  white page — pale sky, outlined discs, no stars. At night it is the
      //  sky itself, and the veil barely touches it.
      night = currentTheme() === "dark";
      if (skyFor !== night + "|" + W + "x" + H) buildSky();
      ctx.drawImage(skyCanvas, 0, 0, W, H);

      // stars drift at a third of the planets' parallax — they are further away
      if (night) {
        ctx.save();
        ctx.translate(0, -shift * 0.3);
        ctx.fillStyle = "#fff";
        for (var s = 0; s < stars.length; s++) {
          var st = stars[s];
          ctx.globalAlpha = st.a * (0.65 + 0.35 * Math.sin(t * st.v + st.p));
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      ctx.save();
      ctx.translate(0, -shift);

      var bodies = PLANETS.map(function (p) {
        var T = YEAR * Math.pow(p.a, 1.5);                 // Kepler's third law
        var M = (p.m0 + (t / T) * TAU) % TAU;
        var pos = place(p, eccentricAnomaly(M, p.e));
        pos.p = p;
        pos.r = bodyPx(p.km);
        return pos;
      });

      ctx.lineWidth = 1;
      ctx.strokeStyle = night ? "rgba(178, 202, 250, 0.22)" : "rgba(32, 50, 100, 0.18)";
      for (var o = 0; o < orbits.length; o++) ctx.stroke(orbits[o]);

      function drawOne(b) {
        var p = b.p;
        if (p.rings && b.r > 3) drawRings(b.x, b.y, b.r, false);
        drawBody(p, b.x, b.y, b.r);
        if (p.rings && b.r > 3) drawRings(b.x, b.y, b.r, true);
        if (p.moon && b.r > 3.2) {                          // the Moon, 27.3 days
          var ma = (t / (YEAR * 27.3 / 365.25)) * TAU + 1.1;
          var mr = b.r * 3.1;
          ctx.beginPath();
          ctx.arc(b.x + Math.cos(ma) * mr, b.y + Math.sin(ma) * mr * TILT, Math.max(1, b.r * 0.27), 0, TAU);
          ctx.fillStyle = "#cfcabf";
          ctx.fill();
        }
      }

      bodies.forEach(function (b) { if (b.depth < 0) drawOne(b); });   // behind the sun
      drawSun(t);
      bodies.forEach(function (b) { if (b.depth >= 0) drawOne(b); });  // in front of it

      ctx.restore();
    }

    function frame(ts) {
      raf = 0;
      if (t0 === null) t0 = ts - elapsed * 1000;
      elapsed = (ts - t0) / 1000;
      paint(elapsed);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    }

    resize();
    if (!reduceMotion) raf = requestAnimationFrame(frame);

    onResizeSettled(resize);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduceMotion && !raf) {
        t0 = null;                      // resume where we paused, no jump
        raf = requestAnimationFrame(frame);
      }
    });

    // ---- The veil: thin over the hero, thick over the text ----------------
    //  How thin and how thick is a design decision, so it lives in the
    //  stylesheet as --veil-min/--veil-max and differs between day and night;
    //  we only read it here (once per theme, never per frame). Scroll also
    //  drives the parallax shift used above. Under reduced motion the veil
    //  keeps the opaque default from the stylesheet and nothing moves.
    var hero = document.querySelector(".hero");
    var veilMin = 0.26, veilMax = 0.7, queued = false;

    function paintVeil() {
      queued = false;
      var span = (hero ? hero.offsetHeight : window.innerHeight) * 0.7;
      var p = span > 0 ? window.pageYOffset / span : 1;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      shift = p * H * 0.12;
      if (hero) root.style.setProperty("--veil", (veilMin + (veilMax - veilMin) * p).toFixed(3));
    }
    function queueVeil() {
      if (!queued) { queued = true; requestAnimationFrame(paintVeil); }
    }

    //  Called on load and whenever the theme flips, since day and night veil
    //  the sky by different amounts — and, with no loop running under reduced
    //  motion, it is also what repaints the still frame in the new palette.
    syncVeil = function () {
      var cs = getComputedStyle(root);
      var lo = parseFloat(cs.getPropertyValue("--veil-min"));
      var hi = parseFloat(cs.getPropertyValue("--veil-max"));
      if (!isNaN(lo)) veilMin = lo;
      if (!isNaN(hi)) veilMax = hi;
      if (reduceMotion) paint(elapsed); else paintVeil();
    };

    syncVeil();
    if (!reduceMotion) {
      window.addEventListener("scroll", queueVeil, { passive: true });
      window.addEventListener("resize", queueVeil);
    }
  }

  // ---- Scroll reveal via IntersectionObserver -----------------------------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---- Handwriting imperfections: jitter each word of the About text -------
  var rndHand = seededRandom(97.13, 4.7);

  function humanizeHandwriting(root) {
    if (!root || root.dataset.hw === "1") return;
    root.dataset.hw = "1";
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3 && ch.textContent.trim()) {
          var parts = ch.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (w) {
            if (w === "" || /^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            i++;
            var r1 = rndHand(i), r2 = rndHand(i + 0.31), r3 = rndHand(i + 0.62), r4 = rndHand(i + 0.93);
            var s = document.createElement("span");
            s.className = "hw";
            s.textContent = w;
            s.style.transform = "rotate(" + ((r1 - 0.5) * 5.5).toFixed(2) + "deg) translateY(" + ((r2 - 0.5) * 5).toFixed(1) + "px)";
            s.style.letterSpacing = ((r3 - 0.5) * 1.4).toFixed(2) + "px";
            s.style.fontWeight = r4 > 0.72 ? "600" : (r4 < 0.28 ? "400" : "500");
            frag.appendChild(s);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && ch.tagName !== "SPAN") {
          walk(ch); // recurse into inline elements (e.g. the contact link)
        }
      });
    })(root);
  }
  var aboutLead = document.querySelector(".about__lead");
  if (aboutLead) {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { humanizeHandwriting(aboutLead); });
    else humanizeHandwriting(aboutLead);
  }

  // ---- Post-it wool threads ------------------------------------------------
  //  Yarn tied from pin to pin. Three things decide whether it reads as wool
  //  or as a drawn line:
  //    · the curve is a catenary, because that is what a hanging thread does.
  //      A Bezier with a guessed control point sags in a way the eye rejects;
  //    · the body is a filled ribbon of slightly varying gauge, not a stroke of
  //      constant width, with a lit edge on the side facing the page's light;
  //    · the twist is real geometry — short wraps laid diagonally across the
  //      ribbon, one every twist-length, so the yarn has a direction.
  //  Both ends anchor on the knot on top of a note, which the note's own
  //  rotation has carried off its layout position, so we follow the transform.
  //  The yarn runs behind the paper it is pinned to, hiding where it is tied.
  var SVGNS = "http://www.w3.org/2000/svg";
  var LIGHT = { x: -0.7, y: -0.71 };     // the whole page lights from top-left

  function knotOf(note) {
    var cs = getComputedStyle(note);
    var w = note.offsetWidth, h = note.offsetHeight;
    var pin = parseFloat(cs.getPropertyValue("--pin"));      // set per note in the stylesheet
    var lx = w * ((isNaN(pin) ? 50 : pin) / 100 - 0.5), ly = -h / 2;   // from the note's centre
    var m = cs.transform && cs.transform !== "none" ? new DOMMatrixReadOnly(cs.transform) : new DOMMatrixReadOnly();
    return {
      x: note.offsetLeft + w / 2 + m.a * lx + m.c * ly,
      y: note.offsetTop + h / 2 + m.b * lx + m.d * ly
    };
  }

  var rndYarn = seededRandom(127.1, 11.7);

  function yarn(svg, a, b, seed, isDark) {
    var r1 = rndYarn(seed), r2 = rndYarn(seed + 0.37), r3 = rndYarn(seed + 0.71), r4 = rndYarn(seed + 0.13);

    var dx = b.x - a.x, dy = b.y - a.y;
    var chord = Math.sqrt(dx * dx + dy * dy);
    var W = 4.2 + r2 * 1.6;                                          // gauge
    var steps = Math.max(30, Math.min(120, Math.round(chord / 4)));

    //  The curve: y = a·cosh((x − x0)/a) + C, for a string this much longer
    //  than the straight line between the pins. Solving it properly (rather
    //  than sagging a symmetric amount about mid-span) is what puts the low
    //  point where it belongs — when one pin sits well below the other, it
    //  slides past the lower pin and the yarn descends into the knot instead
    //  of dipping behind the note first and appearing to stop in mid-air.
    var L = chord * (1.035 + r1 * 0.05);
    var H = Math.abs(dx), dirX = dx < 0 ? -1 : 1;
    var rise = -dy;                          // screen y grows downward; work with y up
    var pts = [], nrm = [], arc = [0], i, u, X;

    if (H < 6) {                             // no horizontal run: nothing to hang
      for (i = 0; i <= steps; i++) {
        u = i / steps;
        pts.push({ x: a.x + dx * u, y: a.y + dy * u });
      }
    } else {
      var Q = Math.sqrt(Math.max(L * L - rise * rise, 1e-6));
      var lo = 1e-3, hi = H * 200, par = 0;  // 2a·sinh(H/2a) falls with a: bisect
      for (i = 0; i < 60; i++) {
        par = (lo + hi) / 2;
        if (2 * par * Math.sinh(H / (2 * par)) > Q) lo = par; else hi = par;
      }
      par = (lo + hi) / 2;
      var x0 = H / 2 - par * Math.atanh(rise / L);
      var C = -par * Math.cosh(x0 / par);    // pins the curve to the first knot
      for (i = 0; i <= steps; i++) {
        u = i / steps;
        X = u * H;
        var wob = Math.sin(u * 8.7 + r4 * 6.3) * 1.1 + Math.sin(u * 23.3 + r2 * 6.3) * 0.4;
        pts.push({ x: a.x + dirX * X + wob, y: a.y - (par * Math.cosh((X - x0) / par) + C) });
      }
    }
    for (i = 0; i <= steps; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(steps, i + 1)];
      var tx = p1.x - p0.x, ty = p1.y - p0.y, tl = Math.sqrt(tx * tx + ty * ty) || 1;
      nrm.push({ x: -ty / tl, y: tx / tl, tx: tx / tl, ty: ty / tl });
      if (i) arc.push(arc[i - 1] + Math.sqrt(Math.pow(pts[i].x - pts[i - 1].x, 2) + Math.pow(pts[i].y - pts[i - 1].y, 2)));
    }
    var total = arc[steps];

    var hue = 349 + Math.round(r4 * 8);
    var sat = 58 + Math.round(r3 * 14);
    var baseL = isDark ? 45 + r2 * 7 : 38 + r2 * 7;
    function col(dl, alpha) {
      var l = Math.max(6, Math.min(92, baseL + dl));
      return "hsla(" + hue + "," + sat + "%," + l.toFixed(0) + "%," + (alpha === undefined ? 1 : alpha) + ")";
    }
    // slubs: hand-spun yarn is never the same thickness twice
    function gauge(n) {
      var s = arc[n];
      return W * (1 + 0.09 * Math.sin(s * 0.085 + r1 * 6.3) + 0.05 * Math.sin(s * 0.22 + r3 * 6.3));
    }
    function lit(n) { return nrm[n].x * LIGHT.x + nrm[n].y * LIGHT.y >= 0 ? 1 : -1; }

    // one side of the ribbon out, the other back: scale is a fraction of the
    // gauge, offset slides the band toward the lit edge
    function ribbon(scale, offset) {
      var d = "", g, o, n;
      for (n = 0; n <= steps; n++) {
        g = gauge(n) * scale / 2; o = gauge(n) * offset * lit(n);
        d += (n ? "L" : "M") + (pts[n].x + nrm[n].x * (o + g)).toFixed(1) + " " + (pts[n].y + nrm[n].y * (o + g)).toFixed(1) + " ";
      }
      for (n = steps; n >= 0; n--) {
        g = gauge(n) * scale / 2; o = gauge(n) * offset * lit(n);
        d += "L" + (pts[n].x + nrm[n].x * (o - g)).toFixed(1) + " " + (pts[n].y + nrm[n].y * (o - g)).toFixed(1) + " ";
      }
      return d + "Z";
    }
    function add(tag, cls, attrs) {
      var el = document.createElementNS(SVGNS, tag);
      el.setAttribute("class", cls);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      svg.appendChild(el);
    }

    // dye drifts along a hand-dyed skein; a flat fill is the giveaway
    var defs = svg.querySelector("defs");
    if (!defs) defs = svg.insertBefore(document.createElementNS(SVGNS, "defs"), svg.firstChild);
    var dye = document.createElementNS(SVGNS, "linearGradient");
    var dyeId = "yarn-dye-" + seed + "-" + Math.round(a.x) + "-" + Math.round(a.y);
    dye.setAttribute("id", dyeId);
    dye.setAttribute("gradientUnits", "userSpaceOnUse");
    dye.setAttribute("x1", a.x.toFixed(1)); dye.setAttribute("y1", a.y.toFixed(1));
    dye.setAttribute("x2", b.x.toFixed(1)); dye.setAttribute("y2", b.y.toFixed(1));
    [0, 0.28, 0.52, 0.76, 1].forEach(function (off, k) {
      var stop = document.createElementNS(SVGNS, "stop");
      stop.setAttribute("offset", off);
      stop.setAttribute("stop-color", col((rndYarn(seed * 13.3 + k * 3.7) - 0.5) * 7));
      dye.appendChild(stop);
    });
    defs.appendChild(dye);

    add("path", "yarn-shadow", {
      d: ribbon(1.05, 0),
      fill: isDark ? "rgba(0,0,0,.55)" : "rgba(0,0,0,.32)",
      transform: "translate(" + (1.4 + r3 * 1.8).toFixed(1) + " " + (3.2 + r1 * 2.2).toFixed(1) + ")"
    });
    add("path", "yarn-body", { d: ribbon(1, 0), fill: "url(#" + dyeId + ")" });
    // round it off: a lit band toward the light, a darker one away from it
    add("path", "yarn-body", { d: ribbon(0.4, 0.23), fill: col(19, 0.6) });
    add("path", "yarn-body", { d: ribbon(0.3, -0.3), fill: col(-15, 0.45) });

    // the twist: a wrap every P along the yarn, laid diagonally across it
    var P = W * 1.45, walk = 1;
    for (var s = P * 0.5; s < total; s += P) {
      while (walk < steps && arc[walk] < s) walk++;
      var g = gauge(walk), t = nrm[walk], p = pts[walk];
      var ex = t.tx * (P * 0.24) + t.x * (g * 0.5);
      var ey = t.ty * (P * 0.24) + t.y * (g * 0.5);
      add("line", "yarn-wrap", {
        x1: (p.x - ex).toFixed(1), y1: (p.y - ey).toFixed(1),
        x2: (p.x + ex).toFixed(1), y2: (p.y + ey).toFixed(1),
        stroke: col(11 + (s % (P * 2) < P ? 2 : -3), 0.7),
        "stroke-width": (g * 0.36).toFixed(2)
      });
    }

    // stray fibres — the halo that separates wool from cord
    var hairs = Math.round(total / 13);
    for (var f = 0; f < hairs; f++) {
      var h1 = rndYarn(seed * 9.1 + f * 1.37), h2 = rndYarn(seed * 3.3 + f * 2.11), h3 = rndYarn(seed * 5.7 + f * 0.83);
      var at = 1 + Math.floor(h1 * (steps - 2));
      var side = h2 > 0.5 ? 1 : -1;
      var ang = (h3 - 0.5) * 1.6;
      var nx = nrm[at].x * Math.cos(ang) - nrm[at].y * Math.sin(ang);
      var ny = nrm[at].x * Math.sin(ang) + nrm[at].y * Math.cos(ang);
      var len = 2.5 + h2 * 5;
      var hx = pts[at].x + nrm[at].x * side * gauge(at) * 0.4;
      var hy = pts[at].y + nrm[at].y * side * gauge(at) * 0.4;
      add("line", "yarn-hair", {
        x1: hx.toFixed(1), y1: hy.toFixed(1),
        x2: (hx + nx * side * len).toFixed(1), y2: (hy + ny * side * len).toFixed(1),
        stroke: col(12, 0.32), "stroke-width": (0.6 + h3 * 0.5).toFixed(2)
      });
    }
  }

  function drawThreads() {
    document.querySelectorAll(".postits").forEach(function (list) {
      var items = Array.prototype.filter.call(list.children, function (el) {
        return el.tagName === "LI";
      });
      var svg = list.querySelector("svg.threads");
      if (!svg) {
        svg = document.createElementNS(SVGNS, "svg");
        svg.setAttribute("class", "threads");
        list.insertBefore(svg, list.firstChild);
      }
      var w = list.clientWidth, h = list.clientHeight;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var isDark = currentTheme() === "dark";
      for (var i = 1; i < items.length; i++) {
        yarn(svg, knotOf(items[i - 1]), knotOf(items[i]), i, isDark);
      }
    });
  }
  if (document.querySelector(".postits")) {
    //  Once, after the fonts land: note height is what decides where the yarn
    //  ties on, and it moves when Kalam and Permanent Marker arrive. Drawing
    //  eagerly as well only threw away a full set of catenaries and rebuilt it.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawThreads);
    else drawThreads();
    onResizeSettled(drawThreads);
  }
})();
