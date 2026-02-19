/* ============================================================
   ANIMATIONS.JS — Scroll reveal (IntersectionObserver) + Timeline
   Novimai Landing Page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Reveal con IntersectionObserver ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Dejar de observar una vez visible (animación de entrada, no de salida)
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Timeline: activar iconos y progreso al scroll ──
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const timelineProgress = document.getElementById('timeline-progress');

  if (timelineSteps.length > 0 && timelineProgress) {

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });

      // Calcular cuántos pasos están activos y actualizar la línea
      const inViewCount = document.querySelectorAll('.timeline-step.in-view').length;
      const totalSteps = timelineSteps.length;
      const progress = inViewCount === 0 ? 0 : ((inViewCount - 1) / (totalSteps - 1)) * 100;
      timelineProgress.style.height = `${Math.min(progress, 100)}%`;

    }, {
      threshold: 0.4,
      rootMargin: '0px 0px -60px 0px'
    });

    timelineSteps.forEach(step => stepObserver.observe(step));
  }

  // ── Contador animado para números destacados (si se añaden en el futuro) ──
  function animateCounter(el, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(start + (target - start) * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter, 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ── Parallax sutil en los blobs del hero ──
  const blob1 = document.querySelector('.hero-blob--1');
  const blob2 = document.querySelector('.hero-blob--2');

  if (blob1 && blob2) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Parallax muy sutil para no marear
          blob1.style.transform = `translateY(${scrollY * 0.08}px)`;
          blob2.style.transform = `translateY(${-scrollY * 0.05}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

});
