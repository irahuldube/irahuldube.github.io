/* =========================================================
   CHATBOT — rahul.assistant 
   Loads intents from data/chat_data/intents.json
   Pure vanilla JS, no dependencies.
========================================================= */

(function () {
  'use strict';

  const CHAT_DATA_URL = 'data/chat_data/intents.json';

  const fab        = document.getElementById('chatFab');
  const chatWindow = document.getElementById('chatWindow');
  const closeBtn   = document.getElementById('chatCloseBtn');
  const messages   = document.getElementById('chatMessages');
  const input      = document.getElementById('chatInput');
  const sendBtn    = document.getElementById('chatSendBtn');
  const badge      = document.getElementById('chatBadge');
  const suggestions = document.getElementById('chatSuggestions');

  let intentsData  = null;
  let isOpen       = false;
  let greeted      = false;

  /* ---------- Load intents ---------- */
  async function loadIntents() {
    try {
      const res = await fetch(CHAT_DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load intents');
      intentsData = await res.json();
    } catch (e) {
      console.warn('[chatbot] Could not load intents.json:', e.message);
    }
  }

  /* ---------- Toggle window ---------- */
  function openChat() {
    isOpen = true;
    chatWindow.classList.add('open');
    chatWindow.setAttribute('aria-hidden', 'false');
    fab.classList.add('active');
    badge.style.display = 'none';
    input.focus();
    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        const greeting = intentsData?.meta?.greeting || "Hey! I'm rahul.assistant. Ask me about Rahul.";
        appendMessage('bot', greeting);
      }, 320);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.remove('open');
    chatWindow.setAttribute('aria-hidden', 'true');
    fab.classList.remove('active');
  }

  fab.addEventListener('click', () => isOpen ? closeChat() : openChat());
  fab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isOpen ? closeChat() : openChat(); } });
  closeBtn.addEventListener('click', closeChat);

  /* ---------- Suggestion chips ---------- */
  suggestions.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      handleSend(q);
      suggestions.style.display = 'none';
    });
  });

  /* ---------- Send ---------- */
  function handleSend(text) {
    const msg = (text || input.value).trim();
    if (!msg) return;
    input.value = '';
    appendMessage('user', msg);
    suggestions.style.display = 'none';
    setTimeout(() => {
      const reply = getReply(msg);
      appendMessage('bot', reply);
    }, 420);
  }

  sendBtn.addEventListener('click', () => handleSend());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  /* ---------- Append message ---------- */
  function appendMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg chat-msg-${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    // preserve newlines
    bubble.innerHTML = escHtml(text).replace(/\n/g, '<br>');

    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  /* ---------- Match intent ---------- */
  function getReply(userText) {
    if (!intentsData) return "Sorry, I couldn't load my knowledge base. Try refreshing the page.";

    const lower = userText.toLowerCase().replace(/[^a-z0-9\s.+#]/g, ' ');

    for (const intent of intentsData.intents) {
      for (const pattern of intent.patterns) {
        if (lower.includes(pattern.toLowerCase())) {
          const pool = intent.responses;
          return pool[Math.floor(Math.random() * pool.length)];
        }
      }
    }

    // fallback
    const fallbacks = intentsData.meta?.fallback || ["I'm not sure about that. Try asking about skills, projects, or contact info."];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /* ---------- Util ---------- */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ---------- Init ---------- */
  loadIntents();

})();
