/* ============================================================
   MAIN.JS — Navbar sticky, Mobile menu, Scroll suave, Ripple
   Novimai Landing Page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Inicializar iconos Lucide ──
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ── Navbar: se solidifica al hacer scroll ──
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // check on load

  // ── Mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');

  function toggleMobileMenu() {
    const isOpen = navMobile.classList.contains('open');

    hamburger.classList.toggle('active');
    navMobile.classList.toggle('open');

    hamburger.setAttribute('aria-expanded', !isOpen);
    navMobile.setAttribute('aria-hidden', isOpen);

    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Cerrar menú al hacer click en un enlace
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMobile.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (
      navMobile.classList.contains('open') &&
      !navMobile.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMobileMenu();
    }
  });

  // ── Scroll suave para los enlaces de ancla ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  // ── Efecto ripple en botones ──
  document.querySelectorAll('.btn:not(.btn-demo)').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.classList.add('ripple');
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ── Link activo en la navbar según sección visible ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const navHeight = navbar.offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 80;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

});
