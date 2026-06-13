const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  .section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; }
  .closing-statement { text-align: center; padding: 3rem 0 0; }
  .closing-statement p { max-width: 680px; margin: 0 auto 0.8rem; color: var(--muted); font-size: 1rem; line-height: 1.7; }
  .closing-statement .tagline { font-family: var(--font); font-size: 1.15rem; font-weight: 700; color: var(--copper); letter-spacing: 0.06em; }
  .footer-legal { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; text-align: center; padding-bottom: 2.5rem; }
  .logo-mark { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 0.5rem; }
  .logo-mark svg { width: 32px; height: 32px; flex-shrink: 0; }
  .logo-mark svg .logo-bg { fill: #0c0b09; }
  .logo-mark svg .logo-stroke { stroke: var(--copper); }
  .logo-mark svg .logo-fill { fill: var(--cyan); }
  :host(.light) .logo-mark svg .logo-bg { fill: #f5f0eb; }
  :host(.light) .logo-mark svg .logo-stroke { stroke: var(--copper); }
  :host(.light) .logo-mark svg .logo-fill { fill: var(--cyan); }
  .reveal { opacity: 0; transform: translateY(36px) scale(0.98); will-change: transform, opacity; transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }
</style>
<div class="section closing-statement">
  <p>SYNDRIX stands at the intersection of intelligence and engineering, transforming concepts into dependable electronic solutions through precision, innovation, and technical excellence.</p>
  <div class="logo-mark">
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="logo-bg" width="64" height="64" rx="14" fill="#0c0b09"/><path class="logo-stroke" d="M14 42 32 12l18 30H14Z" stroke="#c4863f" stroke-width="4"/><path class="logo-fill" d="M22 42h28L32 52 14 42h8Z" fill="#5ec5bd"/></svg>
    <span class="tagline">Engineered with Intelligence.</span>
  </div>
</div>
<div class="footer-legal">&copy; 2026 SYNDRIX &mdash; All rights reserved.</div>`;

class SyndraFooter extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('eager')) { this.render(); }
    else { this.observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { this.observer.disconnect(); this.render(); } }, { rootMargin: '400px' }); this.observer.observe(this); }
  }
  render() {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(t.content.cloneNode(true));
    this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    new MutationObserver(() => { this.classList.toggle('light', document.documentElement.dataset.theme === 'light'); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.initReveal(root);
  }
  initReveal(root) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal').forEach((child) => { child.classList.add('revealed'); });
        }
      });
    }, { threshold: 0.1 });
    const el = root.querySelector('.closing-statement');
    if (el) observer.observe(el);
  }
}
customElements.define('syndra-footer', SyndraFooter);
