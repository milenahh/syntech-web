/* Microinteracciones accesibles para Syntech Solutions */
(() => {
  const ready = () => {
    const body = document.body;
    const header = document.querySelector('.site-header');
    if (!header) return;

    // Menú móvil accesible
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const opened = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(opened));
        toggle.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
        toggle.textContent = opened ? '×' : '☰';
      });
      nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        toggle.textContent = '☰';
      }));
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '☰';
        }
      });
    }

    // Barra de progreso de lectura
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    body.appendChild(progress);

    // Volver arriba
    const top = document.createElement('button');
    top.className = 'back-top';
    top.type = 'button';
    top.textContent = '↑';
    top.setAttribute('aria-label', 'Volver al inicio');
    body.appendChild(top);
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
      top.classList.toggle('visible', window.scrollY > 450);
      header.classList.toggle('header-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Aparición progresiva de secciones y tarjetas al entrar en pantalla
    const targets = document.querySelectorAll('main section.block, .card, .opt, .info-box, .quote-wrap > div');
    targets.forEach(node => {
      if (!node.closest('.hero')) node.classList.add('reveal');
    });
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
      targets.forEach(node => { if (!node.closest('.hero')) observer.observe(node); });
    } else {
      targets.forEach(node => node.classList.add('is-visible'));
    }

    // Animación sutil del panel de la portada según el movimiento del puntero.
    const preview = document.querySelector('.product-preview');
    if (preview && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      preview.addEventListener('pointermove', e => {
        const r = preview.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        preview.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) translateY(-3px)`;
      });
      preview.addEventListener('pointerleave', () => { preview.style.transform = ''; });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
