/* ═══════════════════════════════════════════════════════
   KHALYL2T6 — PREMIUM JAVASCRIPT
   Cursor · Canvas · Preloader · 3D Phones · Form · FX
═══════════════════════════════════════════════════════ */

'use strict';

/* ── UTILS ─────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ─────────────────────────────────────────────────────
   PRELOADER
───────────────────────────────────────────────────── */
(function initPreloader() {
  const pre  = $('preloader');
  const bar  = $('preBar');
  let pct    = 0;
  let rafId;

  function tick() {
    const add = Math.random() * 4 + 0.8;
    pct = Math.min(pct + add, 100);
    bar.style.width = pct + '%';
    if (pct < 100) {
      rafId = setTimeout(tick, 40 + Math.random() * 60);
    } else {
      setTimeout(() => {
        pre.classList.add('gone');
        document.body.classList.add('loaded');
      }, 300);
    }
  }
  tick();
})();

/* ─────────────────────────────────────────────────────
   CUSTOM CURSOR — SMOOTH MAGNETIC
───────────────────────────────────────────────────── */
(function initCursor() {
  const ring = $('cur-ring');
  const dot  = $('cur-dot');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  (function animCursor() {
    rx = lerp(rx, mx, 0.095);
    ry = lerp(ry, my, 0.095);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  // Hover / click states
  $$('a, button, .acc-card, .price-card, .stat-cell, .ch-link, .bfa-item, .cf-check-item, label').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });
  document.addEventListener('mousedown', () => document.body.classList.add('cur-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'));
})();

/* ─────────────────────────────────────────────────────
   DUAL CANVAS — DEEP SPACE + AURORA
───────────────────────────────────────────────────── */
(function initCanvas() {
  const bgCV  = $('cv-bg');
  const fxCV  = $('cv-fx');
  if (!bgCV || !fxCV) return;
  const bgCtx = bgCV.getContext('2d');
  const fxCtx = fxCV.getContext('2d');

  function resize() {
    bgCV.width = fxCV.width = window.innerWidth;
    bgCV.height = fxCV.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Stars */
  class Star {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * bgCV.width;
      this.y = init ? Math.random() * bgCV.height : -4;
      this.r = Math.random() * 1.1 + 0.15;
      this.a = Math.random() * 0.5 + 0.06;
      this.vx = (Math.random() - 0.5) * 0.1;
      this.vy = (Math.random() - 0.5) * 0.1;
      this.flicker = Math.random() * Math.PI * 2;
      this.fSpeed  = 0.018 + Math.random() * 0.025;
      this.life    = 0;
      this.maxLife = 280 + Math.random() * 320;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.flicker += this.fSpeed; this.life++;
      if (this.life > this.maxLife
        || this.x < -6 || this.x > bgCV.width + 6
        || this.y < -6 || this.y > bgCV.height + 6) this.reset();
    }
    draw() {
      const fade   = Math.min(this.life / 40, 1, (this.maxLife - this.life) / 40);
      const flick  = 0.7 + 0.3 * Math.sin(this.flicker);
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(212,168,67,${this.a * fade * flick})`;
      bgCtx.fill();
    }
  }

  /* Network nodes */
  class Node {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * bgCV.width;
      this.y  = Math.random() * bgCV.height;
      this.vx = (Math.random() - 0.5) * 0.16;
      this.vy = (Math.random() - 0.5) * 0.16;
      this.r  = 0.7 + Math.random() * 0.9;
      this.a  = 0.12 + Math.random() * 0.2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > bgCV.width)  this.vx *= -1;
      if (this.y < 0 || this.y > bgCV.height)  this.vy *= -1;
    }
    draw() {
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(212,168,67,${this.a})`;
      bgCtx.fill();
    }
  }

  const stars = Array.from({length: 140}, () => new Star());
  const nodes = Array.from({length: 55},  () => new Node());
  const CONN  = 150;

  function drawBg() {
    bgCtx.clearRect(0, 0, bgCV.width, bgCV.height);
    // Connection lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN) {
          bgCtx.beginPath();
          bgCtx.moveTo(nodes[i].x, nodes[i].y);
          bgCtx.lineTo(nodes[j].x, nodes[j].y);
          bgCtx.strokeStyle = `rgba(212,168,67,${0.065 * (1 - d / CONN)})`;
          bgCtx.lineWidth   = 0.5;
          bgCtx.stroke();
        }
      }
    }
    nodes.forEach(n => { n.update(); n.draw(); });
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(drawBg);
  }
  drawBg();

  /* Aurora FX */
  let aT = 0;
  const bands = [
    {y: 0.18, amp: 90,  freq: 0.7,  ph: 0,   alpha: 0.022, col: '212,168,67'},
    {y: 0.32, amp: 65,  freq: 1.1,  ph: 1.3, alpha: 0.015, col: '170,120,40'},
    {y: 0.68, amp: 55,  freq: 0.55, ph: 2.6, alpha: 0.013, col: '212,168,67'},
  ];

  function drawAurora() {
    fxCtx.clearRect(0, 0, fxCV.width, fxCV.height);
    const W = fxCV.width, H = fxCV.height;
    aT += 0.0035;
    bands.forEach(b => {
      const grad = fxCtx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   `rgba(${b.col},0)`);
      grad.addColorStop(0.5, `rgba(${b.col},${b.alpha})`);
      grad.addColorStop(1,   `rgba(${b.col},0)`);
      fxCtx.beginPath();
      fxCtx.moveTo(0, H * b.y);
      for (let x = 0; x <= W; x += 3) {
        const w1 = Math.sin(x / W * Math.PI * b.freq + aT)           * b.amp;
        const w2 = Math.sin(x / W * Math.PI * b.freq * 0.6 + aT * 1.4 + b.ph) * b.amp * 0.35;
        fxCtx.lineTo(x, H * b.y + w1 + w2);
      }
      fxCtx.lineTo(W, H); fxCtx.lineTo(0, H); fxCtx.closePath();
      fxCtx.fillStyle = grad; fxCtx.fill();
    });
    requestAnimationFrame(drawAurora);
  }
  drawAurora();
})();

/* ─────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────────────── */
(function initScrollProg() {
  const bar = $('scroll-prog');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, {passive: true});
})();

/* ─────────────────────────────────────────────────────
   NAVIGATION — SCROLL + BURGER
───────────────────────────────────────────────────── */
(function initNav() {
  const nav     = $('main-nav');
  const burger  = $('burger-btn');
  const mob     = $('mob-menu');
  const btt     = $('btt');
  let   menuOpen = false;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    nav.classList.toggle('scrolled', sy > 50);
    if (btt) btt.classList.toggle('show', sy > 600);
  }, {passive: true});

  if (burger && mob) {
    burger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      burger.classList.toggle('open', menuOpen);
      mob.classList.toggle('open', menuOpen);
      mob.setAttribute('aria-hidden', !menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuOpen = false;
        burger.classList.remove('open');
        mob.classList.remove('open');
        mob.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  if (btt) btt.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

  // Smooth anchor scroll
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({top: target.offsetTop - 70, behavior: 'smooth'});
      }
    });
  });

  // Year
  const yr = $('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ─────────────────────────────────────────────────────
   INTERSECTION OBSERVER — SCROLL REVEAL
───────────────────────────────────────────────────── */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -40px 0px'});

  $$('.rv, .rvl, .rvr').forEach(el => io.observe(el));

  // Gold line reveal
  const glObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); glObs.unobserve(e.target); }
    });
  }, {threshold: 0.5});
  $$('.gold-line').forEach(el => glObs.observe(el));
})();

/* ─────────────────────────────────────────────────────
   COUNT-UP NUMBERS
───────────────────────────────────────────────────── */
(function initCountUp() {
  function animCount(el) {
    const target = +el.dataset.t;
    const dur = 2200, start = performance.now();
    (function step(now) {
      const t    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(ease * target);
      if (t < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animCount(e.target); io.unobserve(e.target); }
    });
  }, {threshold: 0.5});
  $$('.cu').forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────────────────
   RING PROGRESS — STATS
───────────────────────────────────────────────────── */
(function initRings() {
  const CIRC = 2 * Math.PI * 30; // r=30
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const ring = e.target;
        const pct  = +ring.dataset.pct;
        ring.style.strokeDashoffset = CIRC * (1 - pct / 100);
        io.unobserve(ring);
      }
    });
  }, {threshold: 0.5});
  $$('.ring-fg').forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────────────────
   HERO PARALLAX — EMBLEM FOLLOWS MOUSE
───────────────────────────────────────────────────── */
(function initHeroParallax() {
  const emblem = $('heroEmblem');
  if (!emblem) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    const normX = (e.clientX / window.innerWidth  - 0.5);
    const normY = (e.clientY / window.innerHeight - 0.5);
    tx = normX * -28;
    ty = normY * -18;
  });

  (function anim() {
    cx = lerp(cx, tx, 0.055);
    cy = lerp(cy, ty, 0.055);
    emblem.style.transform = `translateY(-50%) translate(${cx}px,${cy}px)`;
    requestAnimationFrame(anim);
  })();
})();

/* ─────────────────────────────────────────────────────
   3D TILT — ACCOUNT CARDS
───────────────────────────────────────────────────── */
(function initCardTilt() {
  $$('.acc-card').forEach(card => {
    let tx = 0, ty = 0, cx = 0, cy = 0, hovering = false;
    let rafId;

    function anim() {
      cx = lerp(cx, tx, 0.1);
      cy = lerp(cy, ty, 0.1);
      card.style.transform = hovering
        ? `translateY(-6px) rotateY(${cx}deg) rotateX(${cy}deg)`
        : `translateY(${lerp(parseFloat(card.style.transform?.match(/translateY\(([^)]+)\)/)?.[1]) || 0, 0, 0.1)}px)`;
      if (hovering || Math.abs(cx) > 0.01 || Math.abs(cy) > 0.01) rafId = requestAnimationFrame(anim);
    }

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      tx =  nx * 9;
      ty = -ny * 6;
    });
    card.addEventListener('mouseenter', () => {
      hovering = true;
      cancelAnimationFrame(rafId);
      anim();
    });
    card.addEventListener('mouseleave', () => {
      hovering = false;
      tx = 0; ty = 0;
      card.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
      card.style.transform  = '';
      setTimeout(() => card.style.transition = '', 600);
    });
  });
})();

/* ─────────────────────────────────────────────────────
   3D IPHONE TILT — MOUSE TRACKING
───────────────────────────────────────────────────── */
(function initPhoneTilt() {
  const phones = [
    {podId: 'pod1', phoneId: 'iphone1'},
    {podId: 'pod2', phoneId: 'iphone2'},
    {podId: 'pod3', phoneId: 'iphone3'},
  ];

  phones.forEach(({podId, phoneId}) => {
    const pod   = $(podId);
    const phone = $(phoneId);
    if (!pod || !phone) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, hovering = false;
    let rafId;

    function anim() {
      cx = lerp(cx, tx, 0.08);
      cy = lerp(cy, ty, 0.08);
      phone.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg) translateZ(0)`;
      if (hovering || Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
        rafId = requestAnimationFrame(anim);
      }
    }

    pod.addEventListener('mousemove', e => {
      const r  = pod.getBoundingClientRect();
      const nx = (e.clientX - r.left)  / r.width  - 0.5;
      const ny = (e.clientY - r.top)   / r.height - 0.5;
      tx =  nx * 18;
      ty = -ny * 12;
      if (!hovering) { hovering = true; anim(); }
    });

    pod.addEventListener('mouseleave', () => {
      hovering = false;
      tx = 0; ty = 0;
      // Smooth reset
      function reset() {
        cx = lerp(cx, 0, 0.1);
        cy = lerp(cy, 0, 0.1);
        phone.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
        if (Math.abs(cx) > 0.02 || Math.abs(cy) > 0.02) requestAnimationFrame(reset);
        else phone.style.transform = '';
      }
      requestAnimationFrame(reset);
    });
  });
})();

/* ─────────────────────────────────────────────────────
   PRICING — RADIAL MOUSE GLOW
───────────────────────────────────────────────────── */
(function initPriceGlow() {
  $$('.price-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (!card.classList.contains('price-card--featured')) {
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,168,67,.07), var(--panel) 55%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('price-card--featured')) card.style.background = '';
    });
  });
})();

/* ─────────────────────────────────────────────────────
   STAT CELLS — MOUSE RADIAL
───────────────────────────────────────────────────── */
(function initStatGlow() {
  $$('.stat-cell').forEach(cell => {
    cell.addEventListener('mousemove', e => {
      const r = cell.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      cell.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,168,67,.05), transparent 60%)`;
    });
    cell.addEventListener('mouseleave', () => { cell.style.background = ''; });
  });
})();

/* ─────────────────────────────────────────────────────
   MAGNETIC BUTTONS — FOLLOW CURSOR
───────────────────────────────────────────────────── */
(function initMagnetic() {
  $$('.btn-prime, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const x  = (e.clientX - r.left - r.width  / 2) * 0.3;
      const y  = (e.clientY - r.top  - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(() => btn.style.transition = '', 500);
    });
  });
})();

/* ─────────────────────────────────────────────────────
   SPARKLE BURST ON BTN CLICK
───────────────────────────────────────────────────── */
(function initSparkle() {
  $$('.btn-prime').forEach(btn => {
    btn.addEventListener('click', e => {
      const wrap = btn.querySelector('.bp-particles');
      if (!wrap) return;
      for (let i = 0; i < 12; i++) {
        const spark = document.createElement('span');
        Object.assign(spark.style, {
          position: 'absolute', width: '4px', height: '4px',
          borderRadius: '50%', background: '#e8c870',
          pointerEvents: 'none', left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
        });
        wrap.appendChild(spark);
        const angle = (i / 12) * Math.PI * 2;
        const dist  = 28 + Math.random() * 38;
        spark.animate([
          {transform: 'translate(-50%,-50%) scale(1)', opacity: 1},
          {transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity: 0}
        ], {duration: 480 + Math.random() * 280, easing: 'cubic-bezier(.2,1,.3,1)', fill: 'forwards'});
        setTimeout(() => spark.remove(), 800);
      }
    });
  });
})();

/* ─────────────────────────────────────────────────────
   PRICE CALCULATOR — LIVE TOTAL
───────────────────────────────────────────────────── */
(function initPriceCalc() {
  const checks  = $$('input[name="accounts"]');
  const priceEl = $('bfatPrice');
  const bulkEl  = $('bfatBulk');
  if (!priceEl) return;

  function update() {
    const checked = [...checks].filter(c => c.checked);
    const total   = checked.reduce((s, c) => s + +c.dataset.price, 0);
    const isBulk  = checked.length === 4;

    if (isBulk) {
      priceEl.textContent = '$40 (bulk)';
      priceEl.style.color = '#00e5ff';
      bulkEl.classList.add('show');
    } else {
      priceEl.textContent = total ? `$${total}` : '$0';
      priceEl.style.color = '';
      bulkEl.classList.remove('show');
    }
  }
  checks.forEach(c => c.addEventListener('change', update));
})();

/* ─────────────────────────────────────────────────────
   BOOKING FORM — SUBMIT + SUCCESS
───────────────────────────────────────────────────── */
(function initForm() {
  const form    = $('bookForm');
  const success = $('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    $$('#bookForm .bf-input[required]').forEach(inp => {
      if (!inp.value.trim()) { inp.style.borderBottomColor = '#ef4444'; valid = false; }
      else inp.style.borderBottomColor = '';
    });
    if (!valid) {
      form.animate([
        {transform: 'translateX(0)'},
        {transform: 'translateX(-6px)'},{transform: 'translateX(6px)'},
        {transform: 'translateX(-4px)'},{transform: 'translateX(4px)'},
        {transform: 'translateX(0)'}
      ], {duration: 400});
      return;
    }

    const btn = form.querySelector('.bf-submit');
    if (btn) { btn.querySelector('.bp-label').textContent = 'Sending…'; btn.disabled = true; }

    setTimeout(() => {
      // Hide form fields, show success
      [...form.children].forEach(c => {
        if (c !== success) { c.style.transition = 'opacity .4s'; c.style.opacity = '0'; }
      });
      setTimeout(() => {
        [...form.children].forEach(c => {
          if (c !== success) c.style.display = 'none';
        });
        success.classList.add('show');
      }, 400);
    }, 1200);
  });

  // Floating label fix for autofill
  $$('#bookForm .bf-input').forEach(inp => {
    inp.addEventListener('animationstart', e => {
      if (e.animationName === 'onAutoFillStart') inp.classList.add('filled');
    });
  });
})();

/* ─────────────────────────────────────────────────────
   CONTACT LINKS HOVER FX
───────────────────────────────────────────────────── */
(function initContactHover() {
  $$('.ch-link').forEach(link => {
    link.addEventListener('mousemove', e => {
      const r = link.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      link.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,168,67,.04), transparent 60%)`;
    });
    link.addEventListener('mouseleave', () => link.style.background = '');
  });
})();

/* ─────────────────────────────────────────────────────
   SMOOTH SECTION TRANSITIONS (intersection-based fade)
───────────────────────────────────────────────────── */
(function initSectionFX() {
  const sections = $$('section');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('sec-in');
    });
  }, {threshold: 0.04});
  sections.forEach(s => { s.classList.add('sec-pre'); io.observe(s); });
})();

/* ─────────────────────────────────────────────────────
   HERO TEXT STAGGER (re-trigger if needed)
───────────────────────────────────────────────────── */
(function initHeroStagger() {
  // Already handled by CSS animations; just ensure font is loaded
  if (document.fonts) {
    document.fonts.ready.then(() => {
      $$('.h1-inner, .h-eyebrow, .hero-sub-wrap').forEach(el => el.classList.add('font-ready'));
    });
  }
})();

/* ─────────────────────────────────────────────────────
   TICKER — PAUSE ON HOVER (already in CSS, reinforced)
───────────────────────────────────────────────────── */
(function initTicker() {
  const band  = document.querySelector('.ticker-band');
  const track = document.querySelector('.tk-track');
  if (!band || !track) return;
  band.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  band.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

/* ─────────────────────────────────────────────────────
   BACK-TO-TOP BTN — WHEEL ICON SPIN
───────────────────────────────────────────────────── */
(function initBtt() {
  const btt = $('btt');
  if (!btt) return;
  btt.addEventListener('mouseenter', () => {
    btt.querySelector('svg')?.style && (btt.querySelector('svg').style.transform = 'translateY(-2px)');
  });
  btt.addEventListener('mouseleave', () => {
    btt.querySelector('svg') && (btt.querySelector('svg').style.transform = '');
  });
})();

/* ─────────────────────────────────────────────────────
   SCROLL-BASED PARALLAX — HERO TITLE
───────────────────────────────────────────────────── */
(function initParallaxScroll() {
  const h1 = document.querySelector('.hero-h1');
  const eyebrow = document.querySelector('.h-eyebrow');
  if (!h1) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (sy < window.innerHeight * 1.2) {
          h1.style.transform       = `translateY(${sy * 0.16}px)`;
          if (eyebrow) eyebrow.style.transform = `translateY(${sy * 0.10}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, {passive: true});
})();

/* ─────────────────────────────────────────────────────
   SECTION PRE STYLE (injected dynamically)
───────────────────────────────────────────────────── */
(function injectSectionCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .sec-pre{opacity:0;transform:translateY(6px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
    .sec-in{opacity:1!important;transform:none!important}
    #hero{opacity:1!important;transform:none!important}
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────────────
   SOUND BARS ANIMATION — random heights loop
   (adds life to the TikTok phone bars)
───────────────────────────────────────────────────── */
(function initSoundBars() {
  $$('.tt-bars').forEach(bars => {
    const spans = bars.querySelectorAll('span');
    function randomize() {
      spans.forEach(span => {
        const h = Math.floor(Math.random() * 14 + 4);
        span.style.height = h + 'px';
      });
    }
    setInterval(randomize, 300 + Math.random() * 200);
  });
})();

/* ─────────────────────────────────────────────────────
   KEYBOARD ACCESSIBILITY — ESC closes menu
───────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const mob    = $('mob-menu');
    const burger = $('burger-btn');
    if (mob?.classList.contains('open')) {
      mob.classList.remove('open');
      burger?.classList.remove('open');
      mob.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }
});

/* ─────────────────────────────────────────────────────
   PERFORMANCE — hide cursor on touch devices
───────────────────────────────────────────────────── */
(function detectTouch() {
  const hasTouch = window.matchMedia('(hover: none)').matches;
  if (hasTouch) {
    const r = $('cur-ring'), d = $('cur-dot');
    if (r) r.style.display = 'none';
    if (d) d.style.display = 'none';
    document.body.style.cursor = 'auto';
    $$('a, button, input, textarea, label, .acc-card').forEach(el => el.style.cursor = 'pointer');
  }
})();

/* ─────────────────────────────────────────────────────
   ACCOUNT CARDS — subtle background noise on hover
───────────────────────────────────────────────────── */
(function initAccCardGlow() {
  $$('.acc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const pct = (x / r.width * 100).toFixed(1);
      card.style.backgroundImage =
        `radial-gradient(circle at ${pct}% 40%, rgba(212,168,67,.055), transparent 55%)`;
    });
    card.addEventListener('mouseleave', () => card.style.backgroundImage = '');
  });
})();

/* ─────────────────────────────────────────────────────
   FINAL INIT LOG
───────────────────────────────────────────────────── */
console.log('%cKHALYL2T6 © — Premium TikTok Promotion', 'font-family:monospace;font-size:14px;color:#d4a843;background:#02020a;padding:8px 16px;border-left:2px solid #d4a843');