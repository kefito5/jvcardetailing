/* ── LOADER ── */
(function initLoader() {

  const loader = document.createElement('div');
  loader.id = 'jv-loader';
  loader.setAttribute('aria-label', 'Cargando JV Car Detailing');
  loader.setAttribute('role', 'status');

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

  document.documentElement.prepend(loader);

  const bar = document.getElementById('jv-loader-bar');
  let progress = 0;
  let interval;

  function animateBar() {
    interval = setInterval(() => {
      const step = progress < 60 ? Math.random() * 14 + 6
                 : progress < 85 ? Math.random() * 6  + 2
                 :                 Math.random() * 2  + 0.5;
      progress = Math.min(progress + step, 95);
      if (bar) bar.style.width = progress + '%';
      if (progress >= 95) clearInterval(interval);
    }, 100);
  }

  animateBar();

  function hideLoader() {
    clearInterval(interval);
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    const elapsed = performance.now();
    const remaining = Math.max(0, 1200 - elapsed);
    setTimeout(hideLoader, remaining);
  }

  setTimeout(hideLoader, 4000);

})();
/* ── FIN LOADER ── */


/* ── FAVICON ANIMADO ── */
(function initFaviconAnimation() {

  const link = document.querySelector("link[rel='shortcut icon']")
            || document.querySelector("link[rel='icon']");
  if (!link) return;

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
      ctx.drawImage(img, 0, 0, 32, 32);
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
/* ── FIN FAVICON ── */


/* ── CÓDIGO PRINCIPAL — NOSOTROS ── */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCustomCursor();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initTipsPanel();
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
          ctx.strokeStyle = `rgba(${config.color}, ${(1-dist/config.connectDist)*0.35})`;
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
    dot.style.left = mx+'px'; dot.style.top = my+'px';
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
  btn.className = 'hamburger';
  btn.setAttribute('aria-label', 'Menú');
  btn.innerHTML = `
    <img src="../iconos/menu.png" alt="Menú">
    <span class="close-icon">✕</span>
  `;
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
   6. RIPPLE EN BOTONES
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

/* ═══════════════════════════════════════
   7. PANEL DE TIPS POST-DETAILING
═══════════════════════════════════════ */
function initTipsPanel() {

  const depth  = location.pathname.split('/').filter(Boolean).length;
  const prefix = depth >= 2 ? '../' : '';

  const btn = document.createElement('button');
  btn.className = 'tips-float';
  btn.setAttribute('aria-label', 'Tips de cuidado');
  btn.innerHTML = `
    <img src="${prefix}iconos/iconos_tips/tip.png" alt="Tips">
    <span>Tips de Cuidado</span>
  `;

  const panel = document.createElement('div');
  panel.className = 'tips-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Tips de cuidado post-detailing');

  panel.innerHTML = `
    <div class="tips-panel__header">
      <span class="tips-panel__title">Tips Post-Detailing</span>
      <button class="tips-panel__close" aria-label="Cerrar">✕</button>
    </div>

    <div class="tips-tabs">
      <button class="tips-tab active" data-tab="general">General</button>
      <button class="tips-tab" data-tab="ceramico">Cerámico</button>
      <button class="tips-tab" data-tab="pulido">Pulido</button>
      <button class="tips-tab" data-tab="interior">Interior</button>
    </div>

    <div class="tips-content">

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

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  panel.querySelector('.tips-panel__close').addEventListener('click', () => {
    panel.classList.remove('open');
  });

  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  panel.querySelectorAll('.tips-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.tips-tab').forEach(t => t.classList.remove('active'));
      panel.querySelectorAll('.tips-category').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      panel.querySelector(`[data-category="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    btn.addEventListener('mouseenter', () => ring.classList.add('hover'));
    btn.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  }
}