/* ============================================================
   FORM.JS — Envío AJAX a Formspree
   Novimai Landing Page

   INSTRUCCIONES DE CONFIGURACIÓN:
   1. Crea cuenta gratuita en https://formspree.io
   2. Crea un nuevo formulario con tu email
   3. Copia el endpoint (ej: https://formspree.io/f/xpznkqvr)
   4. Reemplaza FORMSPREE_ENDPOINT abajo con tu endpoint real
   ============================================================ */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbdaajnn';

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnLoading = document.getElementById('btn-loading');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación HTML5 nativa
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Estado de carga
    setLoading(true);
    hideMessages();

    const formData = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Éxito
        showSuccess();
        form.reset();

        // Reinicializar iconos Lucide (se pierden al resetear el DOM)
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      } else {
        // Error del servidor
        const data = await response.json().catch(() => ({}));
        const errorText = data?.errors?.[0]?.message || 'Error en el servidor';
        showError();
        console.warn('Formspree error:', errorText);
      }
    } catch (err) {
      // Error de red o Formspree no configurado
      if (FORMSPREE_ENDPOINT.includes('REEMPLAZA_CON_TU_ID')) {
        // Modo demo: simular éxito para previsualización
        showSuccess();
        form.reset();
        console.info('Formulario en modo demo. Configura tu endpoint de Formspree para activarlo.');
      } else {
        showError();
        console.error('Error de red al enviar formulario:', err);
      }
    } finally {
      setLoading(false);
    }
  });

  // ── Helpers ──

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;

    if (isLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
      btnLoading.style.alignItems = 'center';
      btnLoading.style.gap = '8px';
    } else {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  function hideMessages() {
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
  }

  function showSuccess() {
    successMsg.style.display = 'flex';
    errorMsg.style.display = 'none';

    // Scroll suave al mensaje de éxito
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Reinicializar icono dentro del mensaje
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ elements: [successMsg] });
    }
  }

  function showError() {
    errorMsg.style.display = 'flex';
    successMsg.style.display = 'none';

    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ elements: [errorMsg] });
    }
  }

  // ── Limpiar estado de error al escribir ──
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (errorMsg.style.display === 'flex') {
        hideMessages();
      }
    });
  });

});
