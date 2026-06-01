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
/* =======================================
   FAVICON ANIMADO
   Pegar después del loader en script.js
======================================= */
(function initFaviconAnimation() {

  const link = document.querySelector("link[rel='shortcut icon']")
            || document.querySelector("link[rel='icon']");
  if (!link) return;

  /* Detectar ruta según profundidad */
  const depth  = location.pathname.split('/').filter(Boolean).length;
  const prefix = depth >= 2 ? '../' : '';

  const canvas = document.createElement('canvas');
  canvas.width  = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = `${prefix}logo/logo.png`;

  img.onload = () => {
    let frame = 0;

    setInterval(() => {
      ctx.clearRect(0, 0, 32, 32);

      /* Logo base */
      ctx.drawImage(img, 0, 0, 32, 32);

      /* Pulso rojo alterno */
      if (Math.floor(frame / 20) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(192, 57, 43, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      link.href = canvas.toDataURL('image/png');
      frame++;
    }, 80);
  };

})();
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
   JV CAR DETAILING — servicios.js
   Reutiliza la lógica base + animaciones específicas de servicios
======================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  initParticles();
  initCustomCursor();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initServiceItemsReveal();

});

/* ═══════════════════════════════════════
   1. PARTÍCULAS (igual que index)
═══════════════════════════════════════ */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const config = {
    count: 45,
    color: '192, 57, 43',
    minR: 0.8,
    maxR: 2,
    speed: 0.3,
    connectDist: 110,
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: config.count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
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
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectDist) {
          const alpha = (1 - dist / config.connectDist) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.color}, 0.65)`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ═══════════════════════════════════════
   2. CURSOR PERSONALIZADO
═══════════════════════════════════════ */
function initCustomCursor() {
  if (window.matchMedia('(max-width: 700px)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .service-item, .why-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ═══════════════════════════════════════
   3. NAVBAR — scroll shadow
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
  btn.className = 'hamburger';
  btn.setAttribute('aria-label', 'Menú');
  btn.innerHTML = '<span></span><span></span><span></span>';
  document.querySelector('nav').append(btn);

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
    });
  });
}

/* ═══════════════════════════════════════
   5. SCROLL REVEAL — elementos genéricos
═══════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .why-card');

  if (!elements.length) return;

  elements.forEach((el, i) => {
    if (el.closest('.why-grid')) {
      el.style.transitionDelay = `${(i % 5) * 0.1}s`;
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════
   6. REVEAL ESPECIAL PARA ITEMS DE SERVICIO
   Alterna entrada desde izquierda / derecha
═══════════════════════════════════════ */
function initServiceItemsReveal() {
  const items = document.querySelectorAll('.service-item');
  if (!items.length) return;

  items.forEach((item, i) => {
    const fromLeft = i % 2 === 0;
    item.style.opacity = '0';
    item.style.transform = `translateX(${fromLeft ? '-50px' : '50px'})`;
    item.style.transition = 'opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)';
    item.style.transitionDelay = `${i * 0.08}s`;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach(item => observer.observe(item));
}

/* ═══════════════════════════════════════
   7. RIPPLE EN BOTONES
═══════════════════════════════════════ */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-primary, .btn-secondary');
  if (!btn) return;

  const rect   = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size   = Math.max(rect.width, rect.height);

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px; height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top:  ${e.clientY - rect.top  - size / 2}px;
    background: rgba(255,255,255,0.16);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-anim 0.55s ease-out forwards;
    pointer-events: none;
  `;

  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes ripple-anim { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.append(style);
  }

  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.append(ripple);
  setTimeout(() => ripple.remove(), 600);
});