/* ============================================================
   COOKIES.JS — Banner de consentimiento + carga condicional GA
   Novimai Landing Page

   IMPORTANTE: Sustituye 'G-XXXXXXXXXX' por tu ID real de
   Google Analytics antes de publicar en producción.
   ============================================================ */

(function () {
  var STORAGE_KEY = 'novimai_cookie_consent';
  var GA_ID = 'G-NEXXP9R6PQ';

  /* ── Carga Google Analytics ── */
  function loadGA() {
    if (document.getElementById('ga-script')) return; // ya cargado
    var script = document.createElement('script');
    script.id = 'ga-script';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ── Aplica preferencias guardadas ── */
  function applyConsent(prefs) {
    if (prefs && prefs.analytics) {
      loadGA();
    }
    hideBanner();
  }

  /* ── Eleva/baja el chat widget respecto al banner ── */
  function liftChatWidget(banner) {
    var widget = document.getElementById('chat-widget');
    if (!widget) return;
    function update() {
      widget.style.bottom = (banner.offsetHeight + 16) + 'px';
    }
    update();
    // Observa cambios de altura (p.ej. al abrir el panel de configuración)
    if (window.ResizeObserver) {
      var obs = new ResizeObserver(update);
      obs.observe(banner);
      banner._widgetObserver = obs;
    }
  }

  function resetChatWidget(banner) {
    if (banner && banner._widgetObserver) {
      banner._widgetObserver.disconnect();
      delete banner._widgetObserver;
    }
    var widget = document.getElementById('chat-widget');
    if (widget) widget.style.bottom = '';
  }

  /* ── Muestra/oculta el banner ── */
  function showBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      setTimeout(function () {
        banner.classList.add('cookie-banner--visible');
        liftChatWidget(banner);
      }, 600); // pequeño delay para no interrumpir la carga
    }
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      resetChatWidget(banner);
      banner.classList.remove('cookie-banner--visible');
      banner.classList.add('cookie-banner--hidden');
    }
  }

  /* ── Comprueba si ya hay decisión guardada ── */
  var saved = null;
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch (e) {}

  if (saved !== null) {
    // Ya decidió antes — aplicar sin mostrar banner
    document.addEventListener('DOMContentLoaded', function () {
      applyConsent(saved);
    });
    return;
  }

  /* ── Sin decisión previa: mostrar banner al cargar ── */
  document.addEventListener('DOMContentLoaded', function () {
    showBanner();

    var acceptBtn  = document.getElementById('cookie-accept-btn');
    var rejectBtn  = document.getElementById('cookie-reject-btn');
    var configBtn  = document.getElementById('cookie-config-btn');
    var saveBtn    = document.getElementById('cookie-save-btn');
    var configPanel = document.getElementById('cookie-config-panel');

    /* Aceptar todo */
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        var prefs = { analytics: true };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (e) {}
        applyConsent(prefs);
      });
    }

    /* Rechazar todas (excepto técnicas) */
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        var prefs = { analytics: false };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (e) {}
        applyConsent(prefs);
      });
    }

    /* Mostrar/ocultar panel de configuración */
    if (configBtn && configPanel) {
      configBtn.addEventListener('click', function () {
        var isHidden = configPanel.hasAttribute('hidden');
        if (isHidden) {
          configPanel.removeAttribute('hidden');
          configBtn.textContent = 'Cerrar ✕';
        } else {
          configPanel.setAttribute('hidden', '');
          configBtn.textContent = 'Configurar';
        }
      });
    }

    /* Guardar preferencias personalizadas */
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var analyticsToggle = document.getElementById('analytics-toggle');
        var prefs = { analytics: analyticsToggle ? analyticsToggle.checked : false };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (e) {}
        applyConsent(prefs);
      });
    }
  });
})();
