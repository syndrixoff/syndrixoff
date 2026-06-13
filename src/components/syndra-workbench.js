const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; scroll-margin-top: 100px; }
  .section-head { display: grid; grid-template-columns: 1fr minmax(240px, 0.42fr); gap: 2.5rem; align-items: end; margin-bottom: 3rem; }
  .section-head p { margin: 0; color: var(--muted); line-height: 1.7; }
  .kicker { margin: 0 0 0.8rem; color: var(--copper); font-family: var(--font); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
  h2 { margin: 0; font-family: var(--font); font-size: clamp(2.2rem, 5vw, 5rem); line-height: 0.92; letter-spacing: -0.06em; max-width: 800px; }
  .workbench { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 1rem; align-items: stretch; }
  .terminal { min-height: 460px; border: 1px solid rgba(232,223,206,0.12); border-radius: var(--radius); background: rgba(12,11,9,0.5); backdrop-filter: blur(20px) saturate(1.3); padding: 1.2rem; overflow: hidden; box-shadow: 0 16px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(232,223,206,0.08); }
  .terminal .win-dots { display: flex; gap: 0.3rem; margin-bottom: 0.8rem; }
  .terminal .win-dots i { width: 7px; height: 7px; border-radius: 50%; background: var(--copper); opacity: 0.6; }
  .terminal .win-dots i:nth-child(2) { background: var(--cyan); opacity: 0.5; }
  .terminal .win-dots i:nth-child(3) { background: var(--green); opacity: 0.4; }
  .terminal pre { margin: 0; color: var(--muted); font-family: var(--mono); font-size: clamp(0.7rem,1.1vw,0.85rem); line-height: 1.8; white-space: pre-wrap; }
  .terminal .c1 { color: var(--cyan); } .terminal .c2 { color: var(--copper); } .terminal .d { color: var(--fg-dim); }
  .deliverables { display: grid; gap: 0.9rem; }
  .deliverable { border: 1px solid rgba(232,223,206,0.09); border-radius: 22px; background: rgba(18,16,14,0.4); backdrop-filter: blur(12px) saturate(1.3); padding: 1.2rem 1.3rem; display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: start; box-shadow: 0 8px 30px -8px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(232,223,206,0.06); transition: border-color 0.25s ease, box-shadow 0.25s ease; }
  .deliverable:hover { border-color: var(--copper) !important; box-shadow: 0 0 0 1px var(--copper) inset, 0 0 20px rgba(196,134,63,0.08); }
  .deliverable .icon { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; color: #0c0b09; background: var(--copper); font-weight: 900; font-family: var(--font); font-size: 0.85rem; flex-shrink: 0; }
  .deliverable:nth-child(2) .icon { background: var(--cyan); } .deliverable:nth-child(3) .icon { background: var(--green); } .deliverable:nth-child(4) .icon { background: var(--ink-pure); }
  .deliverable h3 { margin: 0 0 0.3rem; font-family: var(--font); font-size: 1.15rem; }
  .deliverable p { margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.55; }
  .tech-stack-section { margin-top: 3.5rem; border-top: 1px dashed var(--border); padding-top: 3.5rem; }
  .tech-stack-head { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.3rem; }
  .tech-stack-head .kicker { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--copper); font-weight: 600; margin: 0; }
  .tech-stack-head h3 { font-family: var(--font); font-size: 1.5rem; margin: 0.2rem 0 0; color: var(--ink-pure); letter-spacing: -0.02em; }
  .tech-stack-head p { margin: 0.2rem 0 0; color: var(--muted); font-size: 0.95rem; }
  .tech-stack-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .tech-card { border: 1px solid var(--border); border-radius: 20px; background: var(--bg-card); backdrop-filter: blur(12px) saturate(1.3); padding: 1.4rem; box-shadow: 0 8px 30px -8px rgba(0,0,0,0.3), inset 0 1px 0 0 var(--glass-edge); display: flex; flex-direction: column; gap: 0.8rem; transition: border-color 0.25s ease, box-shadow 0.25s ease; }
  .tech-card:hover { border-color: var(--copper) !important; box-shadow: 0 0 0 1px var(--copper) inset, 0 0 20px rgba(196,134,63,0.08); }
  .tech-icon-wrapper { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(196,134,63,0.1); border: 1px solid rgba(196,134,63,0.15); color: var(--copper); }
  .tech-card h4 { margin: 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 600; }
  .tech-card .tech-title { font-family: var(--font); font-size: 1.3rem; font-weight: 700; margin: 0; color: var(--ink-pure); }
  .tech-card .tech-list { margin: 0; font-size: 0.9rem; color: var(--muted); line-height: 1.5; }
  .tech-card:nth-child(2) .tech-icon-wrapper, .tech-card:nth-child(4) .tech-icon-wrapper { background: rgba(94,197,189,0.1); border-color: rgba(94,197,189,0.15); color: var(--cyan); }
  .project-card { cursor: pointer; }
  .project-card:hover { border-color: var(--copper) !important; }
  .reveal { opacity: 0; transform: translateY(36px) scale(0.98); will-change: transform, opacity; transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); transition-delay: var(--stagger-delay, 0ms); }
  .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }
  .reveal-r { opacity: 0; transform: translateX(30px); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }
  .reveal-r.revealed { opacity: 1; transform: translateX(0); }
  .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.8s var(--ease), transform 0.8s var(--ease); }
  .reveal-scale.revealed { opacity: 1; transform: scale(1); }
  .delay-1 { transition-delay: 0.06s; } .delay-2 { transition-delay: 0.14s; } .delay-3 { transition-delay: 0.22s; } .delay-4 { transition-delay: 0.3s; }
  :host(.light) .terminal { background: rgba(245,240,235,0.7); border-color: rgba(0,0,0,0.08); }
  :host(.light) .deliverable { background: rgba(255,255,255,0.7); border-color: rgba(0,0,0,0.08); }
  :host(.light) .tech-icon-wrapper { background: rgba(196,134,63,0.08); border-color: rgba(196,134,63,0.12); }
  :host(.light) .tech-card:nth-child(2) .tech-icon-wrapper, :host(.light) .tech-card:nth-child(4) .tech-icon-wrapper { background: rgba(94,197,189,0.08); border-color: rgba(94,197,189,0.12); }
  @media (max-width: 980px) { .section-head { grid-template-columns: 1fr; gap: 1rem; } .workbench { grid-template-columns: 1fr; } .tech-stack-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  @media (max-width: 640px) { section { width: calc(100% - 1.6rem); padding: 3.5rem 0; } .tech-stack-grid { grid-template-columns: 1fr; } }
</style>
<section class="section" id="workbench" aria-labelledby="workbench-title">
  <div class="section-head">
    <div>
      <p class="kicker">The Workbench</p>
      <h2 id="workbench-title">Precision tools for intelligent engineering.</h2>
    </div>
    <p>From concept to deployment, every solution is designed with precision and purpose. We choose the most reliable tool for each surface — circuit, firmware, or production.</p>
  </div>
  <div class="workbench">
    <div class="terminal" aria-label="SYNDRIX project manifest example">
      <div class="win-dots" aria-hidden="true"><i></i><i></i><i></i></div>
      <pre><span class="d">// syndrix.project.manifest</span>
<span class="c2">client</span>: <span class="c1">"startup / research org / industry"</span>
<span class="c2">industry</span>: <span class="c1">"Custom Electronics & Hardware"</span>
<span class="c2">outputs</span>: [
  <span class="c1">"circuit_design"</span>,
  <span class="c1">"pcb_layout"</span>,
  <span class="c1">"embedded_firmware"</span>,
  <span class="c1">"iot_solution"</span>,
  <span class="c1">"production_prototype"</span>
]
<span class="c2">values</span>: {
  precision: <span class="c1">true</span>,
  intelligence: <span class="c1">true</span>,
  reliability: <span class="c1">true</span>,
  innovation: <span class="c1">true</span>,
  partnership: <span class="c1">true</span>
}
<span class="d">// status: concept → deployed</span></pre>
    </div>
    <div class="deliverables">
      <article class="deliverable"><div class="icon">D</div><div><h3>Circuit & PCB Design packages</h3><p>Schematic capture, multi-layer PCB layout, hardware architecture, component selection, BOM generation, and Gerber files ready for manufacturing.</p></div></article>
      <article class="deliverable"><div class="icon">E</div><div><h3>Embedded Systems & Firmware Development</h3><p>Microcontroller firmware, RTOS integration, sensor drivers, communication protocols, and IoT connectivity built for real-world performance.</p></div></article>
      <article class="deliverable"><div class="icon">V</div><div><h3>Testing & Performance Verification</h3><p>Functional testing, signal analysis, debugging, EMC compliance, and performance verification to ensure every system meets specification.</p></div></article>
      <article class="deliverable"><div class="icon">P</div><div><h3>Prototyping & Manufacturing Support</h3><p>Rapid prototyping, manufacturing documentation, product optimization, and production support for seamless transition from lab to factory.</p></div></article>
    </div>
  </div>
  <div class="tech-stack-section">
    <div class="tech-stack-head">
      <p class="kicker">Core Technologies</p>
      <h3>The Actual Tech Stack</h3>
      <p>Specific tools, architectures, and protocols we employ to build reliable, high-performance hardware.</p>
    </div>
    <div class="tech-stack-grid">
      <div class="tech-card"><div class="tech-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9M15 9v12M3 15h18"/></svg></div><h4>ECAD</h4><p class="tech-title">KiCad</p><p class="tech-list">Professional multi-layer schematic design, precise PCB routing, and fabrication package generation.</p></div>
      <div class="tech-card"><div class="tech-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M10 19l4-14"/></svg></div><h4>Firmware</h4><p class="tech-title">C / C++</p><p class="tech-list">Low-level, hardware-optimized firmware development for high reliability and real-time execution.</p></div>
      <div class="tech-card"><div class="tech-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/></svg></div><h4>MCUs & Architectures</h4><p class="tech-title">ARM / STM32</p><p class="tech-list">ARM Cortex-M core processing, STM32 microcontrollers, ESP32, and Nordic Semiconductor systems.</p></div>
      <div class="tech-card"><div class="tech-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 12a3 3 0 1 0 3 3 3 3 0 0 0-3-3z"/><path d="M17 7a7 7 0 1 0 0 10"/></svg></div><h4>IoT & Connectivity</h4><p class="tech-title">MQTT / BLE</p><p class="tech-list">Wireless and remote connectivity via Bluetooth Low Energy (BLE), Cellular (LTE-M/NB-IoT), and MQTT protocol.</p></div>
    </div>
  </div>
</section>`;

class SyndraWorkbench extends HTMLElement {
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
          entry.target.querySelectorAll('.reveal, .reveal-r, .reveal-scale').forEach((child, i) => { child.style.setProperty('--stagger-delay', `${i * 60}ms`); child.classList.add('revealed'); });
        }
      });
    }, { threshold: 0.1, rootMargin: '-10% 0px -20% 0px' });
    const section = root.querySelector('section[id]');
    if (section) observer.observe(section);
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.1) {
      section.querySelectorAll('.reveal, .reveal-r, .reveal-scale').forEach((child, i) => { child.style.setProperty('--stagger-delay', `${i * 60}ms`); child.classList.add('revealed'); });
    }
  }
}
customElements.define('syndra-workbench', SyndraWorkbench);
