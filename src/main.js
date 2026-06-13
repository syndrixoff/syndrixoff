import "./style.css";
import { initNav } from './modules/nav.js';
import { initCanvas } from './modules/canvas.js';
import { initTerminal } from './modules/terminal.js';
import { initTypewriter } from './modules/typewriter.js';
import { initTeam } from './modules/team.js';
import { initTheme } from './modules/theme.js';
import { initModal } from './modules/modal.js';
import { initReveal } from './modules/reveal.js';
import { initToast } from './modules/toast.js';
import { initCounters } from './modules/counters.js';
import { initMagnetic } from './modules/magnetic.js';

function later(fn) {
  setTimeout(fn, 0);
}

initNav();
later(initReveal);
later(initCounters);
later(initTeam);
later(initTheme);
later(initModal);

document.addEventListener("DOMContentLoaded", () => {
  later(initCanvas);
  later(initToast);
  later(initMagnetic);
  later(initTerminal);
  later(initTypewriter);
  later(initContactForm);
});

function initContactForm() {
  const form = document.getElementById('contactForm');
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = form.dataset.action || form.getAttribute('action');
      if (endpoint && endpoint !== '#') {
        const data = new FormData(form);
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Server error ' + res.status);
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }

      form.reset();
      showToast('success', "Message sent! We'll be in touch shortly.");
    } catch {
      showToast('error', 'Something went wrong. Email us directly at syndrixoff@gmail.com.');
    } finally {
      setLoading(false);
    }
  });

  [nameInput, emailInput, companyInput, budgetInput, projectInput].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => clearFieldError(el));
  });
}

function showToast(type, msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.dataset.type = type;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}
