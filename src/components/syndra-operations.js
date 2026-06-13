const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; scroll-margin-top: 100px; }
  .section-head { display: grid; grid-template-columns: 1fr minmax(240px, 0.42fr); gap: 2.5rem; align-items: end; margin-bottom: 3rem; }
  .section-head p { margin: 0; color: var(--muted); line-height: 1.7; }
  .kicker { margin: 0 0 0.8rem; color: var(--copper); font-family: var(--font); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
  h2 { margin: 0; font-family: var(--font); font-size: clamp(2.2rem, 5vw, 5rem); line-height: 0.92; letter-spacing: -0.06em; max-width: 800px; }
  .operations-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  .ops-card { border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-card); backdrop-filter: blur(20px) saturate(1.3); padding: 2rem; box-shadow: 0 16px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 0 var(--glass-edge); display: flex; flex-direction: column; gap: 0.8rem; transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease); }
  .ops-card:hover { border-color: var(--line-strong); box-shadow: 0 20px 60px -10px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(232,223,206,0.12); }
  .ops-card.ip-highlight { border-color: rgba(196,134,63,0.25); background: radial-gradient(ellipse at 80% 20%, rgba(196,134,63,0.08), transparent 18rem), var(--bg-card); }
  .ops-card.ip-highlight:hover { border-color: var(--copper); }
  .ops-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(94,197,189,0.1); border: 1px solid rgba(94,197,189,0.15); color: var(--cyan); margin-bottom: 0.4rem; }
  .ops-card.ip-highlight .ops-icon { background: rgba(196,134,63,0.1); border: 1px solid rgba(196,134,63,0.15); color: var(--copper); }
  .ops-icon svg { width: 24px; height: 24px; }
  .ops-card h3 { font-family: var(--font); font-size: 1.45rem; margin: 0; color: var(--ink-pure); }
  .ops-location { font-family: var(--font); font-size: 0.85rem; font-weight: 700; color: var(--cyan); text-transform: uppercase; letter-spacing: 0.08em; margin: -0.4rem 0 0; }
  .ops-card.ip-highlight .ops-location { color: var(--copper); }
  .ops-text { font-size: 0.92rem; color: var(--muted); line-height: 1.6; margin: 0; }
  .reveal { opacity: 0; transform: translateY(36px) scale(0.98); will-change: transform, opacity; transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); transition-delay: var(--stagger-delay, 0ms); }
  .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }
  .delay-1 { transition-delay: 0.06s; }
  :host(.light) .ops-card { background: rgba(255,255,255,0.4); border-color: rgba(0,0,0,0.08); }
  :host(.light) .ops-card.ip-highlight { background: radial-gradient(ellipse at 80% 20%, rgba(196,134,63,0.06), transparent 18rem), rgba(255,255,255,0.4); }
  @media (max-width: 980px) { .section-head { grid-template-columns: 1fr; gap: 1rem; } .operations-grid { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { section { width: calc(100% - 1.6rem); padding: 3.5rem 0; } }
</style>
<section class="section" id="operations" aria-labelledby="ops-title">
  <div class="section-head">
    <div>
      <p class="kicker">The Engine</p>
      <h2 id="ops-title">Infrastructure behind the engineering.</h2>
    </div>
    <p>We operate our own prototyping lab and maintain a strict client-first IP policy — because trust is engineered, not assumed.</p>
  </div>
  <div class="operations-grid">
    <div class="ops-card">
      <div class="ops-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 10h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2M12 2v16M8 6l4-4 4 4"/></svg></div>
      <h3>In-House Prototyping Lab</h3>
      <p class="ops-location">Based in India</p>
      <p class="ops-text">Our physical prototypes are assembled, debugged, and validated directly inside our dedicated in-house hardware laboratory. Equipped with high-precision testing gear, logic analyzers, and reflow stations, we maintain total quality control over PCB bring-up before shipping globally to your door.</p>
    </div>
    <div class="ops-card ip-highlight">
      <div class="ops-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 11l2 2 4-4"/></svg></div>
      <h3>Client-First IP Policy</h3>
      <p class="ops-location">100% IP Ownership Guarantee</p>
      <p class="ops-text">All intellectual property, including schematic designs, PCB layouts, RTL models, firmware source code, and software components developed during our partnership, belongs exclusively and unconditionally to you. We execute strict NDAs and transfer all rights upon milestone delivery.</p>
    </div>
  </div>
</section>`;

class SyndraOperations extends HTMLElement {
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
          entry.target.querySelectorAll('.reveal').forEach((child, i) => { child.style.setProperty('--stagger-delay', `${i * 60}ms`); child.classList.add('revealed'); });
        }
      });
    }, { threshold: 0.1, rootMargin: '-10% 0px -20% 0px' });
    const section = root.querySelector('section[id]');
    if (section) observer.observe(section);
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.1) {
      section.querySelectorAll('.reveal').forEach((child, i) => { child.style.setProperty('--stagger-delay', `${i * 60}ms`); child.classList.add('revealed'); });
    }
  }
}
customElements.define('syndra-operations', SyndraOperations);
