// Floating Feedback Widget
(function () {
  const PROJECT_NAME = 'SaaSDownRadar';
  const FEEDBACK_EMAIL = 'taeshinkim11@gmail.com';

  const i18nLabels = {
    en: { title: 'Send Feedback', placeholder: 'Your message...', submit: 'Send', close: 'Close' },
    ko: { title: '피드백 보내기', placeholder: '메시지를 입력하세요...', submit: '보내기', close: '닫기' },
    ja: { title: 'フィードバックを送る', placeholder: 'メッセージを入力...', submit: '送信', close: '閉じる' },
    zh: { title: '发送反馈', placeholder: '请输入您的消息...', submit: '发送', close: '关闭' },
    es: { title: 'Enviar comentarios', placeholder: 'Tu mensaje...', submit: 'Enviar', close: 'Cerrar' },
    fr: { title: 'Envoyer des commentaires', placeholder: 'Votre message...', submit: 'Envoyer', close: 'Fermer' },
    de: { title: 'Feedback senden', placeholder: 'Ihre Nachricht...', submit: 'Senden', close: 'Schließen' },
    pt: { title: 'Enviar feedback', placeholder: 'Sua mensagem...', submit: 'Enviar', close: 'Fechar' }
  };

  function getLang() {
    try {
      const saved = localStorage.getItem('sdr_lang');
      if (saved) return saved;
    } catch (e) {}
    const userLang = (navigator.language || navigator.languages?.[0] || 'en').slice(0, 2);
    return ['en','ko','ja','zh','es','fr','de','pt'].includes(userLang) ? userLang : 'en';
  }

  function getLabels() {
    return i18nLabels[getLang()] || i18nLabels['en'];
  }

  function createWidget() {
    const labels = getLabels();

    // Floating button
    const btn = document.createElement('button');
    btn.id = 'feedback-float-btn';
    btn.setAttribute('aria-label', labels.title);
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>`;
    btn.style.cssText = `
      position:fixed;right:20px;bottom:80px;z-index:9999;
      width:48px;height:48px;border-radius:50%;border:none;cursor:pointer;
      background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 14px rgba(59,130,246,0.5);transition:transform 0.2s,box-shadow 0.2s;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 6px 20px rgba(59,130,246,0.6)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 14px rgba(59,130,246,0.5)';
    });

    // Modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'feedback-modal-overlay';
    overlay.style.cssText = `
      display:none;position:fixed;inset:0;z-index:10000;
      background:rgba(0,0,0,0.4);align-items:center;justify-content:center;
    `;

    // Modal box
    const modal = document.createElement('div');
    modal.style.cssText = `
      background:#fff;border-radius:12px;padding:24px;width:320px;max-width:90vw;
      box-shadow:0 20px 60px rgba(0,0,0,0.2);position:relative;
      font-family:system-ui,-apple-system,sans-serif;
    `;

    modal.innerHTML = `
      <button id="feedback-modal-close" aria-label="${labels.close}" style="position:absolute;top:12px;right:12px;background:none;border:none;cursor:pointer;color:#6b7280;font-size:18px;line-height:1;padding:4px;">&#x2715;</button>
      <h3 id="feedback-modal-title" style="margin:0 0 16px;font-size:1rem;font-weight:600;color:#111827;">${labels.title}</h3>
      <textarea id="feedback-modal-textarea" placeholder="${labels.placeholder}" style="width:100%;box-sizing:border-box;height:100px;padding:10px;border:1px solid #d1d5db;border-radius:8px;font-size:0.875rem;resize:vertical;font-family:inherit;color:#374151;outline:none;"></textarea>
      <div style="margin-top:12px;display:flex;justify-content:flex-end;gap:8px;">
        <button id="feedback-modal-submit" style="background:#3b82f6;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:0.875rem;font-weight:500;cursor:pointer;">${labels.submit}</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(btn);
    document.body.appendChild(overlay);

    // Event: open modal
    btn.addEventListener('click', () => {
      const l = getLabels();
      document.getElementById('feedback-modal-title').textContent = l.title;
      document.getElementById('feedback-modal-textarea').placeholder = l.placeholder;
      document.getElementById('feedback-modal-submit').textContent = l.submit;
      document.getElementById('feedback-modal-close').setAttribute('aria-label', l.close);
      overlay.style.display = 'flex';
      document.getElementById('feedback-modal-textarea').focus();
    });

    // Event: close modal
    document.getElementById('feedback-modal-close').addEventListener('click', () => {
      overlay.style.display = 'none';
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') overlay.style.display = 'none';
    });

    // Event: submit
    document.getElementById('feedback-modal-submit').addEventListener('click', () => {
      const msg = document.getElementById('feedback-modal-textarea').value.trim();
      if (!msg) return;
      const subject = encodeURIComponent(`[${PROJECT_NAME}] Feedback`);
      const body = encodeURIComponent(msg);
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
      overlay.style.display = 'none';
      document.getElementById('feedback-modal-textarea').value = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
