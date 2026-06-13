const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; scroll-margin-top: 100px; }
  .section-head { display: grid; grid-template-columns: 1fr minmax(240px, 0.42fr); gap: 2.5rem; align-items: end; margin-bottom: 3rem; }
  .section-head p { margin: 0; color: var(--muted); line-height: 1.7; }
  .kicker { margin: 0 0 0.8rem; color: var(--copper); font-family: var(--font); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
  h2 { margin: 0; font-family: var(--font); font-size: clamp(2.2rem, 5vw, 5rem); line-height: 0.92; letter-spacing: -0.06em; max-width: 800px; }
  .process-track { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 0; position: relative; counter-reset: step-counter; }
  .process-track::before { content: ""; position: absolute; top: 17px; left: 18px; right: calc(25% - 18px); height: 1.5px; background: var(--line-strong); border-radius: 1px; pointer-events: none; z-index: 0; }
  .step-item { padding: 0 1.2rem 1.2rem 0; position: relative; }
  .step-marker { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--line-strong); background: var(--bg-soft); display: grid; place-items: center; font-family: var(--font); font-size: 0.8rem; font-weight: 700; color: var(--copper); margin-bottom: 1.4rem; position: relative; z-index: 2; transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, transform 0.3s var(--ease); box-shadow: 0 0 0 0 transparent; }
  .step-item:hover .step-marker { border-color: var(--copper); background: var(--bg-soft); box-shadow: 0 0 0 3px color-mix(in srgb, var(--copper) 12%, transparent), 0 0 20px color-mix(in srgb, var(--copper) 10%, transparent); transform: scale(1.08); }
  .step-item h3 { margin: 0 0 0.5rem; font-family: var(--font); font-size: 1.35rem; letter-spacing: -0.03em; line-height: 1.1; }
  .step-item p { margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.55; }
  :host(.light) .step-marker { background: var(--bg-soft); border-color: var(--line-strong); }
  .reveal-l { opacity: 0; transform: translateX(-30px); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }
  .reveal-l.is-visible, .reveal-l.revealed { opacity: 1; transform: translateX(0); }
  .delay-1 { transition-delay: 0.06s; } .delay-2 { transition-delay: 0.14s; } .delay-3 { transition-delay: 0.22s; } .delay-4 { transition-delay: 0.3s; }
  @media (max-width: 980px) { .section-head { grid-template-columns: 1fr; gap: 1rem; } .process-track { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1.5rem 0; } .process-track::before { display: none; } }
  @media (max-width: 640px) { section { width: calc(100% - 1.6rem); padding: 3.5rem 0; } .process-track { grid-template-columns: 1fr; gap: 1.8rem 0; } }
</style>
<section class="section" id="process" aria-labelledby="process-title">
  <div class="section-head">
    <div>
      <p class="kicker">How we engineer</p>
      <h2 id="process-title">From concept to deployment. Precision at every step.</h2>
    </div>
    <p>A rigorous engineering process for innovators, startups, research organizations, and industries seeking advanced electronic solutions on a predictable timeline.</p>
  </div>
  <div class="process-track">
    <article class="step-item"><div class="step-marker">1</div><h3>Scope</h3><p>Define requirements, technical constraints, performance targets, component selection, and deployment environment.</p></article>
    <article class="step-item"><div class="step-marker">2</div><h3>Design</h3><p>Produce schematics, PCB layouts, firmware architecture, and initial hardware prototypes for validation.</p></article>
    <article class="step-item"><div class="step-marker">3</div><h3>Validate</h3><p>Rigorous testing, debugging, performance verification, EMC compliance, and edge-case analysis.</p></article>
    <article class="step-item"><div class="step-marker">4</div><h3>Deploy</h3><p>Deliver production-ready designs, manufacturing files, firmware binaries, and comprehensive documentation.</p></article>
  </div>
</section>`;

class SyndraProcess extends HTMLElement {
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
          entry.target.querySelectorAll('.reveal-l').forEach((child, i) => { child.style.setProperty('--stagger-delay', `${i * 60}ms`); child.classList.add('revealed'); });
        }
      });
    }, { threshold: 0.1, rootMargin: '-10% 0px -20% 0px' });
    const section = root.querySelector('section[id]');
    if (section) observer.observe(section);
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.1) {
      section.querySelectorAll('.reveal-l').forEach((child, i) => { child.style.setProperty('--stagger-delay', `${i * 60}ms`); child.classList.add('revealed'); });
    }
  }
}
customElements.define('syndra-process', SyndraProcess);
