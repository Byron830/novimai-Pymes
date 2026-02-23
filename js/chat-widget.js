/* ============================================================
   CHAT-WIDGET.JS — Lógica del chatbot Novimai
   ============================================================ */

(function () {
  'use strict';

  const WEBHOOK_URL = 'https://byron-n8n.rhh9eg.easypanel.host/webhook/chatbot';
  const INITIAL_MSG = '¡Hola! 👋 Soy el asistente de Novimai. ¿En qué puedo ayudarte hoy?';

  // Genera un sessionId único por sesión de navegador
  function getSessionId() {
    let id = sessionStorage.getItem('novimai_chat_session');
    if (!id) {
      id = 'session-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
      sessionStorage.setItem('novimai_chat_session', id);
    }
    return id;
  }

  // ── DOM refs ──
  const widget    = document.getElementById('chat-widget');
  const toggle    = document.getElementById('chat-toggle');
  const hint      = document.getElementById('chat-hint');
  const panel     = document.getElementById('chat-panel');
  const messages  = document.getElementById('chat-messages');
  const input     = document.getElementById('chat-input');
  const sendBtn   = document.getElementById('chat-send');
  const closeBtn  = document.getElementById('chat-close');
  let isOpen    = false;
  let isWaiting = false;

  // ── Abrir / cerrar panel ──
  function openPanel() {
    isOpen = true;
    panel.hidden = false;
    // Ocultar el globo de forma permanente en esta sesión
    if (hint) hint.classList.add('chat-bubble-hint--hidden');
    input.focus();
    scrollToBottom();
  }

  function closePanel() {
    isOpen = false;
    panel.hidden = true;
    // El globo no reaparece — permanece oculto el resto de la sesión
  }

  toggle.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);
  if (hint) hint.addEventListener('click', openPanel);

  // ── Añadir mensaje al DOM ──
  function appendMessage(text, role) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg chat-msg--' + role;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  // ── Indicador de escritura ──
  function showTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-typing';
    wrapper.id = 'chat-typing-indicator';
    wrapper.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(wrapper);
    scrollToBottom();
  }

  function hideTyping() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) indicator.remove();
  }

  // ── Scroll al último mensaje ──
  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ── Enviar mensaje ──
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isWaiting) return;

    input.value = '';
    isWaiting = true;
    sendBtn.disabled = true;

    appendMessage(text, 'user');
    showTyping();

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: getSessionId() })
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();
      hideTyping();
      appendMessage(data.response || 'Lo siento, no pude procesar tu mensaje.', 'bot');

    } catch (err) {
      hideTyping();
      appendMessage('En este momento no puedo responder. Escríbenos directamente a info@novimai.com', 'error');
    } finally {
      isWaiting = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ── Event listeners de envío ──
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ── Mensaje de bienvenida ──
  appendMessage(INITIAL_MSG, 'bot');

  // ── Re-inicializar iconos Lucide en el widget ──
  if (typeof lucide !== 'undefined') lucide.createIcons();

})();
