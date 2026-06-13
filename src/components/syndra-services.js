const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; scroll-margin-top: 100px; }
  .section-head { display: grid; grid-template-columns: 1fr minmax(240px, 0.42fr); gap: 2.5rem; align-items: end; margin-bottom: 3rem; }
  .section-head p { margin: 0; color: var(--muted); line-height: 1.7; }
  .kicker { margin: 0 0 0.8rem; color: var(--copper); font-family: var(--font); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
  h2 { margin: 0; font-family: var(--font); font-size: clamp(2.2rem, 5vw, 5rem); line-height: 0.92; letter-spacing: -0.06em; max-width: 800px; }
  .services-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1rem; }
  .service-card { position: relative; min-height: clamp(320px, 45vw, 380px); padding: 1.8rem 1.6rem; border: 1px solid rgba(232,223,206,0.1); border-radius: var(--radius); background: rgba(18,16,14,0.45); backdrop-filter: blur(16px) saturate(1.4); box-shadow: 0 14px 40px -10px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(232,223,206,0.08); overflow: hidden; transition: border-color 0.25s ease, box-shadow 0.25s ease; }
  .service-card:hover { border-color: var(--copper) !important; box-shadow: 0 0 0 1px var(--copper) inset, 0 0 20px rgba(196,134,63,0.08); }
  .service-card .num { font-family: var(--font); font-size: 5rem; font-weight: 700; line-height: 0.7; letter-spacing: -0.08em; color: rgba(232,223,206,0.03); position: absolute; top: 0.4rem; right: 0.6rem; pointer-events: none; }
  .service-card h3 { margin: 0 0 0.7rem; font-family: var(--font); font-size: clamp(1.2rem, 1.8vw, 1.6rem); line-height: 1; letter-spacing: -0.04em; position: relative; z-index: 2; }
  .service-card p { margin: 0; color: var(--muted); line-height: 1.6; font-size: 0.9rem; position: relative; z-index: 2; }
  .tag-list { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 1.6rem; position: relative; z-index: 2; }
  .tag { border: 1px solid rgba(232,223,206,0.08); border-radius: 999px; padding: 0.35rem 0.65rem; color: var(--faint); font-family: var(--font); font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(232,223,206,0.03); }
  .service-card .pattern { position: absolute; inset: 0; opacity: 0.04; background-image: linear-gradient(90deg, rgba(196,134,63,0.6) 1px, transparent 1px), linear-gradient(rgba(94,197,189,0.4) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; }
  .service-card-1 h3 { color: var(--copper); } .service-card-2 h3 { color: var(--cyan); } .service-card-3 h3 { color: var(--ink-pure); } .service-card-4 h3 { color: var(--green); }
  .reveal { opacity: 0; transform: translateY(36px) scale(0.98); will-change: transform, opacity; transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); transition-delay: var(--stagger-delay, 0ms); }
  .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }
  .delay-1 { transition-delay: 0.06s; } .delay-2 { transition-delay: 0.14s; } .delay-3 { transition-delay: 0.22s; } .delay-4 { transition-delay: 0.3s; }
  :host(.light) .service-card { background: rgba(255,255,255,0.7); border-color: rgba(0,0,0,0.08); }
  @media (max-width: 980px) { .section-head { grid-template-columns: 1fr; gap: 1rem; } .services-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  @media (max-width: 640px) { section { width: calc(100% - 1.6rem); padding: 3.5rem 0; } .services-grid { grid-template-columns: 1fr; } .service-card { min-height: 300px; padding: 1.4rem; } }
</style>
<section class="section" id="services" aria-labelledby="services-title">
  <div class="section-head">
    <div>
      <p class="kicker">Service Architecture</p>
      <h2 id="services-title">Four disciplines, one engineering partner.</h2>
    </div>
    <p>SYNDRIX aligns circuit design, embedded development, validation, and production support into a single unified engineering workflow — from first schematic to final deployment.</p>
  </div>
  <div class="services-grid">
    <article class="service-card service-card-1"><div class="pattern"></div><span class="num">01</span><div style="position:relative;z-index:2"><p class="kicker">Design</p><h3>Circuit Design, PCB Design, Hardware Architecture.</h3><p>Schematic capture, multi-layer PCB layout, hardware architecture, power distribution, and signal integrity — engineered for reliability and manufacturability.</p><div class="tag-list"><span class="tag">Circuit Design</span><span class="tag">PCB Design</span><span class="tag">Hardware Architecture</span></div></div></article>
    <article class="service-card service-card-2"><div class="pattern"></div><span class="num">02</span><div style="position:relative;z-index:2"><p class="kicker">Development</p><h3>Embedded Systems, Firmware Development, IoT Solutions.</h3><p>Embedded firmware, real-time operating systems, IoT connectivity, sensor integration, and communication protocols that perform consistently in real-world environments.</p><div class="tag-list"><span class="tag">Embedded Systems</span><span class="tag">Firmware Development</span><span class="tag">IoT Solutions</span></div></div></article>
    <article class="service-card service-card-3"><div class="pattern"></div><span class="num">03</span><div style="position:relative;z-index:2"><p class="kicker">Validation</p><h3>Testing, Debugging, Performance Verification.</h3><p>Rigorous functional testing, systematic debugging, signal analysis, EMC compliance, and performance verification to ensure every system meets specification.</p><div class="tag-list"><span class="tag">Testing</span><span class="tag">Debugging</span><span class="tag">Performance Verification</span></div></div></article>
    <article class="service-card service-card-4"><div class="pattern"></div><span class="num">04</span><div style="position:relative;z-index:2"><p class="kicker">Production</p><h3>Prototyping, Manufacturing Support, Product Optimization.</h3><p>Rapid prototyping, BOM generation, manufacturing documentation, Gerber files, production support, and product optimization for seamless scale-up.</p><div class="tag-list"><span class="tag">Prototyping</span><span class="tag">Manufacturing Support</span><span class="tag">Product Optimization</span></div></div></article>
  </div>
</section>`;

class SyndraServices extends HTMLElement {
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
customElements.define('syndra-services', SyndraServices);
