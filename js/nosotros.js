/* =======================================
   LOADER —
  
======================================= */

(function initLoader() {

  /* ── 1. Crear el HTML del loader ── */
  const loader = document.createElement('div');
  loader.id = 'jv-loader';
  loader.setAttribute('aria-label', 'Cargando JV Car Detailing');
  loader.setAttribute('role', 'status');

  /* Detectar ruta del logo según profundidad de la página */
  const depth  = location.pathname.split('/').filter(Boolean).length;
  const prefix = depth >= 2 ? '../' : '';
  const logoSrc = `${prefix}logo/logo.png`;

  loader.innerHTML = `
    <div class="loader-logo-wrap">
      <div class="loader-ring"></div>
      <div class="loader-ring-2"></div>
      <div class="loader-ring-3"></div>
      <div class="loader-logo-box">
        <img src="${logoSrc}" alt="JV Car Detailing">
      </div>
    </div>

    <div class="loader-text">
      <span class="loader-brand">JV Car Detailing</span>
      <span class="loader-sub">Detallado Profesional</span>
    </div>

    <div class="loader-bar-wrap">
      <div class="loader-bar" id="jv-loader-bar"></div>
    </div>

    <div class="loader-dots">
      <span></span><span></span><span></span>
    </div>
  `;

  /* Insertar antes que todo lo demás */
  document.documentElement.prepend(loader);

  /* ── 2. Animar la barra de progreso ── */
  const bar = document.getElementById('jv-loader-bar');
  let progress = 0;
  let interval;

  function animateBar() {
    interval = setInterval(() => {
      /* Avance rápido al inicio, más lento al final */
      const step = progress < 60 ? Math.random() * 14 + 6
                 : progress < 85 ? Math.random() * 6  + 2
                 :                 Math.random() * 2  + 0.5;

      progress = Math.min(progress + step, 95);
      if (bar) bar.style.width = progress + '%';

      if (progress >= 95) clearInterval(interval);
    }, 100);
  }

  animateBar();

  /* ── 3. Ocultar el loader ── */
  function hideLoader() {
    clearInterval(interval);
    if (bar) bar.style.width = '100%';

    /* Pequeña pausa para que se vea el 100% */
    setTimeout(() => {
      loader.classList.add('hidden');

      /* Eliminar del DOM después de la transición */
      setTimeout(() => loader.remove(), 700);
    }, 250);
  }

  /* Ocultar cuando el DOM está listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    /* Si ya cargó (script diferido) — mínimo 1.2s de loader */
    const elapsed = performance.now();
    const minTime = 1200;
    const remaining = Math.max(0, minTime - elapsed);
    setTimeout(hideLoader, remaining);
  }

  /* Fallback: si algo falla, esconder igual a los 4s */
  setTimeout(hideLoader, 4000);

})();



/* =======================================
   JV CAR DETAILING — nosotros.js
======================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCustomCursor();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
});

/* ═══════════════════════════════════════
   1. PARTÍCULAS
═══════════════════════════════════════ */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const config = { count: 45, color: '192, 57, 43', minR: 0.8, maxR: 2, speed: 0.3, connectDist: 110 };

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function createParticles() {
    particles = Array.from({ length: config.count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: config.minR + Math.random() * (config.maxR - config.minR),
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < config.connectDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${config.color}, ${(1 - dist/config.connectDist)*0.35})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${config.color}, 0.65)`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  resize(); createParticles(); draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ═══════════════════════════════════════
   2. CURSOR
═══════════════════════════════════════ */
function initCustomCursor() {
  if (window.matchMedia('(max-width: 700px)').matches) return;
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx-rx)*0.14; ry += (my-ry)*0.14;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a, button, .mv-card, .value-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ═══════════════════════════════════════
   3. NAVBAR
═══════════════════════════════════════ */
function initNavbar() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ═══════════════════════════════════════
   4. MENÚ MOBILE
═══════════════════════════════════════ */
function initMobileMenu() {
  const nav = document.querySelector('nav ul');
  if (!nav) return;
  const btn = document.createElement('button');
  btn.className = 'hamburger'; btn.setAttribute('aria-label', 'Menú');
  btn.innerHTML = '<span></span><span></span><span></span>';
  document.querySelector('nav').append(btn);
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); btn.classList.remove('open');
  }));
}

/* ═══════════════════════════════════════
   5. SCROLL REVEAL
═══════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .mv-card, .value-card, .who-text, .who-visual'
  );

  elements.forEach((el, i) => {
    if (el.closest('.values-grid')) {
      el.style.transitionDelay = `${(i % 5) * 0.1}s`;
    }
    if (!el.classList.contains('reveal') &&
        !el.classList.contains('reveal-left') &&
        !el.classList.contains('reveal-right')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));

  /* Reveal left/right para who-section */
  const whoText   = document.querySelector('.who-text');
  const whoVisual = document.querySelector('.who-visual');
  if (whoText) {
    whoText.style.opacity = '0';
    whoText.style.transform = 'translateX(-40px)';
    whoText.style.transition = 'opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)';
  }
  if (whoVisual) {
    whoVisual.style.opacity = '0';
    whoVisual.style.transform = 'translateX(40px)';
    whoVisual.style.transition = 'opacity 0.85s 0.15s cubic-bezier(0.16,1,0.3,1), transform 0.85s 0.15s cubic-bezier(0.16,1,0.3,1)';
  }
}

/* ═══════════════════════════════════════
   6. CONTADORES ANIMADOS
═══════════════════════════════════════ */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════
   7. RIPPLE EN BOTONES
═══════════════════════════════════════ */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-primary, .btn-secondary');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;
    left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;
    background:rgba(255,255,255,0.16);border-radius:50%;transform:scale(0);
    animation:ripple-anim 0.55s ease-out forwards;pointer-events:none;`;
  if (!document.querySelector('#ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `@keyframes ripple-anim{to{transform:scale(2.5);opacity:0;}}`;
    document.head.append(s);
  }
  btn.style.position = 'relative'; btn.style.overflow = 'hidden';
  btn.append(ripple);
  setTimeout(() => ripple.remove(), 600);
});