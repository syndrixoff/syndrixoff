const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; scroll-margin-top: 100px; }
  .cta-panel { position: relative; display: grid; place-items: center; padding: clamp(1.2rem, 3vw, 2rem); border: 1px solid rgba(196,134,63,0.2); border-radius: calc(var(--radius) + 12px); background: radial-gradient(ellipse at 20% 15%, rgba(196,134,63,0.15), transparent 24rem), radial-gradient(ellipse at 80% 85%, rgba(94,197,189,0.1), transparent 22rem), rgba(18,16,14,0.55); backdrop-filter: blur(28px) saturate(1.5); overflow: hidden; text-align: center; box-shadow: 0 24px 60px -15px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(232,223,206,0.15); }
  .cta-panel .bg-grid { position: absolute; inset: 0; background-image: linear-gradient(90deg, rgba(196,134,63,0.05) 1px, transparent 1px), linear-gradient(rgba(94,197,189,0.04) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; opacity: 0.5; }
  .cta-layout { display: flex; flex-direction: column; gap: 1.25rem; position: relative; z-index: 2; width: 100%; }
  .cta-top-row { display: flex; flex-direction: row; gap: 2rem; align-items: stretch; }
  .cta-top-row .cta-text-head { flex: 1 1 55%; text-align: center; }
  .cta-top-row .terminal-block { flex: 1 1 45%; display: flex; align-items: stretch; min-height: 200px; }
  .kicker { margin: 0 0 0.8rem; color: var(--copper); font-family: var(--font); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
  .contact-heading { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; max-width: 650px; margin-inline: auto; text-align: center; margin-top: 0; margin-bottom: 0; color: var(--ink-pure); }
  .terminal-block { position: relative; z-index: 2; flex: 1 1 55%; display: flex; align-items: stretch; min-width: 0; padding: 4px; }
  .term-wrap { width: 100%; display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; box-shadow: 0 1px 0 0 var(--glass-edge) inset, 0 8px 32px rgba(0,0,0,0.12); }
  .term-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-bottom: 1px solid var(--border); background: var(--bg-soft); }
  .term-bar .dot { width: 8px; height: 8px; border-radius: 50%; }
  .term-bar .d1 { background: var(--copper); opacity: 0.7; } .term-bar .d2 { background: var(--cyan); opacity: 0.5; } .term-bar .d3 { background: var(--green); opacity: 0.4; }
  .term-label { font-family: var(--mono); font-size: 0.55rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-left: auto; }
  .term-body { flex: 1; padding: 12px 14px; overflow-y: auto; font-family: var(--mono); font-size: 0.7rem; line-height: 1.6; color: var(--muted); min-height: 80px; max-height: 200px; scrollbar-width: none; }
  .term-body::-webkit-scrollbar { display: none; }
  .term-body .line { display: block; text-align: left; opacity: 0; transform: translateY(4px); }
  .term-body .line.fade-in { animation: termLineIn 0.3s ease forwards; }
  @keyframes termLineIn { to { opacity: 1; transform: translateY(0); } }
  .term-body .prompt { color: var(--copper); margin-right: 6px; user-select: none; }
  .term-body .cmd { color: var(--ink); } .term-body .out { color: var(--muted); } .term-body .out-cyan { color: var(--cyan); }
  .term-body .blink { display: inline-block; width: 6px; height: 12px; background: var(--copper); margin-left: 2px; vertical-align: middle; animation: cursorBlink 0.9s step-end infinite; }
  @keyframes cursorBlink { 50% { opacity: 0; } }
  .cta-layout .cta-text-body { margin: 0 auto; color: var(--muted); max-width: 600px; line-height: 1.55; font-size: 0.92rem; text-align: center; }
  .cta-layout .cta-text-body a { color: var(--copper); text-decoration: underline; text-underline-offset: 2px; }
  .contact-form { margin: 0 auto; width: min(680px, 100%); display: grid; gap: 0.85rem; position: relative; z-index: 2; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-field-full { grid-column: 1 / -1; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
  .contact-form input { width: 100%; min-height: clamp(40px, 5vw, 48px); border: 1px solid var(--border); border-radius: 12px; background: var(--bg-card); color: var(--ink); padding: 0 1rem; outline: none; font-size: 0.9rem; transition: border-color 0.2s ease, box-shadow 0.2s ease; box-sizing: border-box; }
  .contact-form input:focus { border-color: var(--copper); box-shadow: 0 0 0 3px var(--accent-glow); }
  .contact-form input::placeholder { color: var(--faint); }
  .btn-full { width: 100%; min-height: clamp(44px, 6vw, 52px); border-radius: 999px; background: var(--copper); color: #0c0b09; font-weight: 800; font-size: 0.95rem; letter-spacing: 0.02em; border: none; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }
  .btn-full:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(196,134,63,0.3); }
  .btn-full:active { transform: scale(0.98); }
  .form-note { color: var(--faint); font-family: var(--font); font-size: clamp(0.6rem, 1.5vw, 0.7rem); letter-spacing: 0.04em; margin: 0; text-align: center; }
  .field-error { display: block; margin-top: 4px; font-size: 0.72rem; color: var(--ember); font-family: var(--mono); letter-spacing: 0.02em; animation: fieldErrorIn 0.2s ease; }
  @keyframes fieldErrorIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
  input[aria-invalid="true"] { border-color: var(--ember) !important; box-shadow: 0 0 0 1px rgba(217,79,58,0.2); }
  .btn-loading { opacity: 0.7; cursor: not-allowed; position: relative; }
  .btn-loading::before { content: ''; position: absolute; left: 1rem; top: 50%; translate: 0 -50%; width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.25); border-top-color: #0c0b09; border-radius: 50%; animation: spinLoader 0.6s linear infinite; }
  @keyframes spinLoader { to { rotate: 1turn; } }
  .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.8s var(--ease), transform 0.8s var(--ease); }
  .form-submit-row { display: flex; align-items: center; gap: 8px; }
  .form-submit-row .btn-full { flex: 1; min-width: 0; }
  #turnstileSlot { width: 300px; display: flex; justify-content: center; align-items: center; }
  @media (max-width: 600px) { #turnstileSlot { width: 140px; } }
  :host(.light) .popup-overlay { background: rgba(0,0,0,0.25); }
  .popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
  .popup-overlay.open { opacity: 1; pointer-events: auto; }
  .popup-box { background: var(--panel-solid); border: 1px solid var(--border); border-radius: calc(var(--radius) - 6px); padding: 1.2rem 1.5rem; max-width: 300px; width: 85%; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
  .popup-box p { color: var(--ink); font-size: 0.8rem; line-height: 1.4; margin: 0 0 0.85rem; }
  .popup-box button { background: var(--copper); color: #0c0b09; border: none; border-radius: 999px; padding: 0.45rem 1.2rem; font-weight: 700; font-size: 0.78rem; cursor: pointer; transition: transform 0.2s; }
  .popup-box button:hover { transform: scale(1.04); }
  .reveal-scale.revealed { opacity: 1; transform: scale(1); }
  :host(.light) .cta-panel { background: radial-gradient(ellipse at 20% 15%, rgba(196,134,63,0.08), transparent 24rem), radial-gradient(ellipse at 80% 85%, rgba(94,197,189,0.06), transparent 22rem), rgba(255,255,255,0.75); border-color: rgba(0,0,0,0.08); box-shadow: 0 24px 60px -15px rgba(0,0,0,0.15), inset 0 1px 0 0 rgba(255,255,255,0.5); }
  :host(.light) .cta-panel .bg-grid { background-image: linear-gradient(90deg, rgba(196,134,63,0.04) 1px, transparent 1px), linear-gradient(rgba(94,197,189,0.03) 1px, transparent 1px); }
  @media (max-width: 800px) { .cta-top-row { flex-direction: column; gap: 1rem; } .cta-top-row .terminal-block { flex: none; min-height: 0; } .cta-top-row .terminal-block .term-body { min-height: 60px; max-height: 120px; } .cta-layout .cta-text-body { font-size: clamp(0.72rem, 2.5vw, 0.82rem); } .contact-form { gap: 0.65rem; } .contact-heading { font-size: clamp(1.4rem, 5vw, 2rem); } .form-grid { gap: 0.65rem; } .cta-text-head { text-align: left; } .cta-text-head .kicker { text-align: left; } .cta-text-head .contact-heading { text-align: left; margin-inline: 0; } .cta-layout .cta-text-body { text-align: left; margin: 0; } }
  @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { section { width: calc(100% - 1.6rem); padding: 3.5rem 0; } }
</style>
<section class="section" id="contact" aria-labelledby="contact-title">
  <div class="cta-panel">
    <div class="bg-grid"></div>
    <div class="cta-layout">
      <div class="cta-top-row">
        <div class="cta-text-head">
          <p class="kicker">Free consultation</p>
          <h2 id="contact-title" class="contact-heading">Bring a concept.<br>Leave with an engineering<br>direction.</h2>
        </div>
        <div class="terminal-block">
          <div class="term-wrap">
            <div class="term-bar">
              <div class="dot d1"></div>
              <div class="dot d2"></div>
              <div class="dot d3"></div>
              <span class="term-label">SYNDRIX \u2014 SIGNAL PATH TERMINAL</span>
            </div>
            <div class="term-body" id="termOutput"></div>
          </div>
        </div>
      </div>
      <p class="cta-text-body">Tell SYNDRIX what you need engineered \u2014 custom electronics, embedded system, PCB design, IoT solution, or a complete product development package. The initial consultation is free so you can evaluate the fit before committing. Or reach us directly at <a href="mailto:syndrixoff@gmail.com">syndrixoff@gmail.com</a></p>
      <form class="contact-form" id="contactForm" novalidate>
        <div class="form-grid">
          <div class="form-field"><label class="form-label" for="nameInput">Name</label><input id="nameInput" name="name" type="text" placeholder="Name" autocomplete="name" required></div>
          <div class="form-field"><label class="form-label" for="emailInput">Email</label><input id="emailInput" name="email" type="email" placeholder="Email" autocomplete="email" required></div>
          <div class="form-field"><label class="form-label" for="companyInput">Company</label><input id="companyInput" name="company" type="text" placeholder="Company" autocomplete="organization"></div>
          <div class="form-field"><label class="form-label" for="budgetInput">Budget (e.g., \u20b950K - \u20b92L)</label><input id="budgetInput" name="budget" type="text" placeholder="\u20b950K - \u20b92L" autocomplete="off"></div>
        </div>
        <div class="form-field form-field-full"><label class="form-label" for="projectInput">Describe your project</label><input id="projectInput" name="project" type="text" placeholder="Custom sensor board + embedded firmware for environmental monitoring\u2026" autocomplete="off" required></div>
        <div class="form-submit-row">
          <button class="btn btn-primary btn-full" type="submit">Start my project</button>
          <div id="turnstileSlot"><slot name="turnstile"></slot></div>
        </div>
        <p class="form-note">No pressure. No spam. Just a clear engineering direction.</p>
      </form>
    </div>
  </div>
</section>
<div class="popup-overlay" id="popup">
  <div class="popup-box">
    <p id="popupMsg"></p>
    <button id="popupBtn">OK</button>
  </div>
</div>`;

class SyndraContact extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('eager')) { this.render(); }
    else { this.observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { this.observer.disconnect(); this.render(); } }, { rootMargin: '400px' }); this.observer.observe(this); }
  }
  disconnectedCallback() {
    if (this._tsContainer) { this._tsContainer.remove(); }
  }
  render() {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(t.content.cloneNode(true));
    this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    new MutationObserver(() => { this.classList.toggle('light', document.documentElement.dataset.theme === 'light'); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.initTerminal(root);
    this.initForm(root);
    this.initReveal(root);
  }
  initTerminal(root) {
    const out = root.getElementById('termOutput');
    if (!out) return;
    function runSequence(loop) {
      out.innerHTML = "";
      const sequence = [
        { type: 'cmd', text: 'connect --to=your-project', delay: 600 },
        { type: 'gap', delay: 400 },
        { type: 'out-cyan', text: 'Initiating handshake...', delay: 0 },
        { type: 'out', text: 'Connection ready. Reach out at syndrixoff@gmail.com', delay: 600 },
        { type: 'gap', delay: 300 },
        { type: 'cursor', delay: 0 },
      ];
      let i = 0;
      function next() {
        if (i >= sequence.length) {
          if (loop) setTimeout(() => runSequence(true), 4000);
          return;
        }
        const s = sequence[i++];
        setTimeout(() => {
          if (s.type === 'gap') {
            const br = document.createElement('div');
            br.style.height = '6px';
            out.appendChild(br);
          } else if (s.type === 'cursor') {
            const div = document.createElement('div');
            div.className = 'line fade-in';
            div.innerHTML = '<span class="prompt">\u203a</span><span class="blink"></span>';
            out.appendChild(div);
          } else {
            const div = document.createElement('div');
            div.className = 'line fade-in';
            if (s.type === 'cmd') {
              div.innerHTML = '<span class="prompt">\u203a</span><span class="cmd">' + s.text + '</span>';
            } else {
              div.innerHTML = '<span class="' + s.type + '">' + s.text + '</span>';
            }
            out.appendChild(div);
          }
          out.scrollTop = out.scrollHeight;
          next();
        }, s.delay);
      }
      setTimeout(next, 500);
    }
    runSequence(true);
  }
  initForm(root) {
    const form = root.getElementById('contactForm');
    if (!form) return;
    const submitBtn = form.querySelector('[type="submit"]');
    const nameInput = form.querySelector('#nameInput');
    const emailInput = form.querySelector('#emailInput');
    const companyInput = form.querySelector('#companyInput');
    const budgetInput = form.querySelector('#budgetInput');
    const projectInput = form.querySelector('#projectInput');

    function showFieldError(input, msg) {
      clearFieldError(input);
      input.setAttribute('aria-invalid', 'true');
      const err = document.createElement('span');
      err.className = 'field-error';
      err.setAttribute('role', 'alert');
      err.textContent = msg;
      input.insertAdjacentElement('afterend', err);
    }
    function clearFieldError(input) {
      input.removeAttribute('aria-invalid');
      const next = input.nextElementSibling;
      if (next?.classList.contains('field-error')) next.remove();
    }
    function validateForm() {
      let valid = true;
      if (nameInput && nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Enter your name (at least 2 characters).');
        valid = false;
      } else if (nameInput) clearFieldError(nameInput);
      if (emailInput) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(emailInput.value.trim())) {
          showFieldError(emailInput, 'Enter a valid email address.');
          valid = false;
        } else clearFieldError(emailInput);
      }
      if (projectInput && projectInput.value.trim().length < 10) {
        showFieldError(projectInput, 'Tell us a bit more (at least 10 characters).');
        valid = false;
      } else if (projectInput) clearFieldError(projectInput);
      return valid;
    }
    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.classList.toggle('btn-loading', on);
      submitBtn.textContent = on ? 'Sending\u2026' : 'Start my project';
    }

    const popup = root.getElementById('popup');
    const popupMsg = root.getElementById('popupMsg');
    const popupBtn = root.getElementById('popupBtn');
    popupBtn.addEventListener('click', () => popup.classList.remove('open'));

    function showPopup(msg) {
      popupMsg.textContent = msg;
      popup.classList.add('open');
    }

    let turnstileToken = null;
    this._tsContainer = document.createElement('div');
    this._tsContainer.setAttribute('slot', 'turnstile');
    this._tsContainer.id = 'ts-' + Math.random().toString(36).slice(2);
    this._tsContainer.style.cssText = 'display:flex;justify-content:center;align-items:center;width:100%';
    this.appendChild(this._tsContainer);

    const initTurnstile = () => {
      if (!window.turnstile) { setTimeout(initTurnstile, 200); return; }
      try {
        turnstile.render(this._tsContainer, {
          sitekey: '0x4AAAAAADkCEvi3rSXhU_4G',
          callback: (token) => { turnstileToken = token; },
          'error-callback': () => { console.error('Turnstile error'); }
        });
      } catch (e) { console.error('Turnstile render error', e); setTimeout(initTurnstile, 500); }
    };
    initTurnstile();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      if (!turnstileToken) {
        showPopup('Verifying you are human\u2026 please wait a moment and try again.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('https://cxvskcqlpicgrfawdmii.supabase.co/functions/v1/submit-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sb_publishable_oHDa2QrICWCATGFX6HSaug__AKH6XTI'
          },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            company: companyInput?.value.trim() || null,
            budget: budgetInput?.value.trim() || null,
            project: projectInput.value.trim(),
            turnstileToken
          })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Server error');
        }
        form.reset();
        showPopup("Message sent! We'll be in touch shortly.");
      } catch (err) {
        showPopup(err.message || 'Something went wrong. Email us directly at syndrixoff@gmail.com.');
      } finally {
        setLoading(false);
      }
    });
    [nameInput, emailInput, companyInput, budgetInput, projectInput].forEach(el => {
      if (!el) return;
      el.addEventListener('input', () => clearFieldError(el));
    });
  }
  initReveal(root) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal-scale').forEach((child, i) => { child.style.setProperty('--stagger-delay', (i * 60) + 'ms'); child.classList.add('revealed'); });
        }
      });
    }, { threshold: 0.1, rootMargin: '-10% 0px -20% 0px' });
    const section = root.querySelector('section[id]');
    if (section) observer.observe(section);
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.1) {
      section.querySelectorAll('.reveal-scale').forEach((child, i) => { child.style.setProperty('--stagger-delay', (i * 60) + 'ms'); child.classList.add('revealed'); });
    }
  }
}
customElements.define('syndra-contact', SyndraContact);
