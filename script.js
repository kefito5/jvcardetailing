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
   JV CAR DETAILING — script.js
   Animaciones: partículas · reveal · cursor · navbar · contador
======================================= */

'use strict';

/* ── Esperar DOM ── */
document.addEventListener('DOMContentLoaded', () => {

  initParticles();
  initCustomCursor();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initActiveNav();

});

/* ═══════════════════════════════════════
   1. PARTÍCULAS DE FONDO
═══════════════════════════════════════ */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);

  const ctx   = canvas.getContext('2d');
  let W, H, particles;

  const config = {
    count: 55,
    color: '192, 57, 43',
    minR: 1,
    maxR: 2.5,
    speed: 0.35,
    connectDist: 130,
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

    /* Líneas de conexión */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectDist) {
          const alpha = (1 - dist / config.connectDist) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    /* Puntos */
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.color}, 0.7)`;
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

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* ═══════════════════════════════════════
   2. CURSOR PERSONALIZADO
═══════════════════════════════════════ */
function initCustomCursor() {
  /* Solo en desktop */
  if (window.matchMedia('(max-width: 700px)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  /* Suavizado del ring */
  function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  /* Hover en links y botones */
  document.querySelectorAll('a, button, .service-card, .benefit-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ═══════════════════════════════════════
   3. NAVBAR — scroll shadow + active
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
  const nav   = document.querySelector('nav ul');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.className = 'hamburger';
  btn.setAttribute('aria-label', 'Menú');
 btn.innerHTML = `
  <img src="iconos/menu.png" alt="Menú">
  <span class="close-icon">✕</span>
`;
  document.querySelector('nav').append(btn);

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  /* Cerrar al hacer clic en un link */
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
    });
  });
}

/* ═══════════════════════════════════════
   5. SCROLL REVEAL
═══════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.service-card, .benefit-item, .stat-box, .reveal, .reveal-left, .reveal-right, .about-text, .about-stats'
  );

  if (!elements.length) return;

  /* Delay escalonado para grids */
  elements.forEach((el, i) => {
    if (el.closest('.services-grid, .benefits-grid, .about-stats')) {
      el.style.transitionDelay = `${(i % 6) * 0.1}s`;
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Agregar clase reveal si no la tiene */
          if (!entry.target.classList.contains('reveal') &&
              !entry.target.classList.contains('reveal-left') &&
              !entry.target.classList.contains('reveal-right')) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => {
    /* Si no tiene clase reveal, aplicar estilos base */
    if (!el.classList.contains('reveal') &&
        !el.classList.contains('reveal-left') &&
        !el.classList.contains('reveal-right')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
    }
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════
   6. CONTADORES ANIMADOS
═══════════════════════════════════════ */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  nums.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    /* easing ease-out quart */
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════
   7. NAV LINK ACTIVO SEGÚN SCROLL
═══════════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const links    = document.querySelectorAll('nav ul li a');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => {
          a.classList.toggle(
            'active',
            a.getAttribute('href') === '#' + entry.target.id ||
            a.getAttribute('href').includes(entry.target.id)
          );
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ═══════════════════════════════════════
   8. EFECTO RIPPLE EN BOTONES
═══════════════════════════════════════ */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-primary, .btn-secondary');
  if (!btn) return;

  const rect   = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size   = Math.max(rect.width, rect.height);

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top:  ${e.clientY - rect.top  - size / 2}px;
    background: rgba(255,255,255,0.18);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-anim 0.55s ease-out forwards;
    pointer-events: none;
  `;

  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }`;
    document.head.append(style);
  }

  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.append(ripple);
  setTimeout(() => ripple.remove(), 600);
});

/* boton flotante de los tips del cuidado del carro */
/* =======================================
   TIPS FLOTANTE — agregar al final de script.js
   (y en cada JS de página donde lo uses)
======================================= */

function initTipsPanel() {

  /* ── Detectar ruta del ícono ── */
  const depth  = location.pathname.split('/').filter(Boolean).length;
  const prefix = depth >= 2 ? '../' : '';

  /* ── HTML del botón flotante ── */
  const btn = document.createElement('button');
  btn.className = 'tips-float';
  btn.setAttribute('aria-label', 'Tips de cuidado');
  btn.innerHTML = `
    <img src="${prefix}iconos/iconos_tips/tip.png" alt="Tips">
    <span>Tips de Cuidado</span>
  `;

  /* ── HTML del panel ── */
  const panel = document.createElement('div');
  panel.className = 'tips-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Tips de cuidado post-detailing');

  panel.innerHTML = `
    <div class="tips-panel__header">
      <span class="tips-panel__title">
         Tips Post-Detailing
      </span>
      <button class="tips-panel__close" aria-label="Cerrar">✕</button>
    </div>

    <div class="tips-tabs">
      <button class="tips-tab active" data-tab="general">General</button>
      <button class="tips-tab" data-tab="ceramico">Cerámico</button>
      <button class="tips-tab" data-tab="pulido">Pulido</button>
      <button class="tips-tab" data-tab="interior">Interior</button>
    </div>

    <div class="tips-content">

      <!-- General -->
      <div class="tips-category active" data-category="general">

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/clock.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Primeras 24 horas</p>
            <p class="tip-card__desc">Evitá exponer el vehículo a lluvia, sol directo o polvo durante las primeras 24 horas.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/jabon.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Lavado correcto</p>
            <p class="tip-card__desc">Usá siempre agua abundante y shampoo específico para carros. Nunca detergente de cocina.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/paño.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Paño de microfibra</p>
            <p class="tip-card__desc">Secá siempre con paños de microfibra limpia. Nunca tela áspera o esponjas viejas.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/parkin.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Estacionamiento</p>
            <p class="tip-card__desc">Preferí sombra o garaje. El sol constante degrada la pintura y los tratamientos más rápido.</p>
          </div>
        </div>

      </div>

      <!-- Cerámico -->
      <div class="tips-category" data-category="ceramico">

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/clock.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">No lavar por 72 horas</p>
            <p class="tip-card__desc">El recubrimiento cerámico necesita al menos 72 horas para curar completamente. No lo lavés.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/cera.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Sin cera encima</p>
            <p class="tip-card__desc">No apliqués cera sobre el cerámico. Usá solo mantenedores específicos para cerámica.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/lluvia.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Lluvia ácida</p>
            <p class="tip-card__desc">Después de lluvia, lavá el carro cuanto antes. El agua ácida puede manchar el cerámico.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/tiempo.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Duración</p>
            <p class="tip-card__desc">Con buen mantenimiento el cerámico dura 1-3 años. Contactanos para reaplique cuando sea necesario.</p>
          </div>
        </div>

      </div>

      <!-- Pulido -->
      <div class="tips-category" data-category="pulido">

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/protege.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Protegé el brillo</p>
            <p class="tip-card__desc">Aplicá una capa de cera o sellador cada 3-4 meses para mantener el brillo del pulido.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/lavado_auto.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Evitá lavados automáticos</p>
            <p class="tip-card__desc">Los cepillos de lavados automáticos generan micro-rayones. Preferí lavado manual.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/paloma.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Excremento de pájaros</p>
            <p class="tip-card__desc">Removelo cuanto antes. El ácido puede dañar el pulido si se deja mucho tiempo.</p>
          </div>
        </div>

      </div>

      <!-- Interior -->
      <div class="tips-category" data-category="interior">

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/avanico.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Ventilación</p>
            <p class="tip-card__desc">Después de la limpieza interior, ventilá bien el vehículo antes de usar para evitar olores.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/aspiradora.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Aspirado regular</p>
            <p class="tip-card__desc">Aspirá el interior cada 2 semanas para evitar acumulación de polvo y suciedad.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/protege.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Protector de tablero</p>
            <p class="tip-card__desc">Aplicá protector UV en el tablero cada mes para evitar que se agriete con el sol.</p>
          </div>
        </div>

        <div class="tip-card">
          <img class="tip-card__icon" src="${prefix}iconos/iconos_tips/tapete.png" alt="">
          <div class="tip-card__body">
            <p class="tip-card__title">Tapetes</p>
            <p class="tip-card__desc">Lavá los tapetes por separado cada 2 semanas. Dejá secar completamente antes de poner en el carro.</p>
          </div>
        </div>

      </div>

    </div>

    <div class="tips-panel__footer">
      <a href="${prefix}html/cotizacion.html">¿Necesitás otro servicio? → Cotizá aquí</a>
    </div>
  `;

  document.body.append(btn, panel);

  /* ── Lógica de apertura/cierre ── */
  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  panel.querySelector('.tips-panel__close').addEventListener('click', () => {
    panel.classList.remove('open');
  });

  /* Cerrar al clic fuera */
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  /* ── Tabs ── */
  panel.querySelectorAll('.tips-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.tips-tab').forEach(t => t.classList.remove('active'));
      panel.querySelectorAll('.tips-category').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      panel.querySelector(`[data-category="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  /* ── Cursor hover ── */
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    btn.addEventListener('mouseenter', () => ring.classList.add('hover'));
    btn.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  }
}

/* Llamar la función */
document.addEventListener('DOMContentLoaded', initTipsPanel);