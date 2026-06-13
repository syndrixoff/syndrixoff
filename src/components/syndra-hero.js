const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { min-height: 100svh; display: grid; align-items: center; padding: 7rem max(1.2rem, 5vw) 3rem; position: relative; overflow: hidden; }
  .hero-grid { width: min(1100px, 100%); margin: 0 auto; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: clamp(2rem, 4vw, 4rem); align-items: center; }
  .hero-text { position: relative; z-index: 2; }
  h1 { margin: 0; font-family: var(--font); font-size: clamp(3.4rem, 8vw, 8rem); font-weight: 700; line-height: 0.82; letter-spacing: -0.08em; text-transform: uppercase; max-width: 900px; }
  h1 .line-1 { display: block; }
  h1 .line-2, h1 .line-3 { display: block; color: var(--copper); font-size: 0.82em; padding-left: 0.04em; }
  .scramble-target { display: inline-block; transition: color 0.2s var(--ease); cursor: default; position: relative; }
  .scramble-target.state-syndrix { color: var(--ink); }
  .scramble-target::after { content: '|'; margin-left: 0.04em; color: currentColor; opacity: 0; display: inline-block; vertical-align: baseline; }
  .scramble-target.typing::after { opacity: 1; animation: cursor-blink 0.8s step-end infinite; }
  @keyframes cursor-blink { 50% { opacity: 0; } }
  .hero-copy { max-width: 560px; margin: 1.6rem 0 0; color: var(--muted); font-size: clamp(0.95rem, 1.5vw, 1.15rem); line-height: 1.7; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 0.85rem; margin-top: 2rem; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.65rem; min-height: 38px; padding: 0.35rem 1.5rem; border-radius: 999px; border: 1px solid rgba(232,223,206,0.12); text-decoration: none; font-weight: 900; letter-spacing: 0.03em; cursor: pointer; transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; font-size: 0.88rem; }
  .btn-primary { background: var(--copper); color: #0c0b09; border-color: var(--copper); }
  .btn-secondary { background: rgba(232,223,206,0.04); color: var(--ink); }
  .btn:hover { transform: translateY(-2px); }
  .btn-primary:hover { box-shadow: 0 10px 28px rgba(196,134,63,0.2); }
  .btn-secondary:hover { border-color: var(--line-strong); background: rgba(196,134,63,0.07); }
  .btn:active { transform: scale(0.96); }
  .hero-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin-top: 2.8rem; border: 1px solid var(--line); background: var(--line); max-width: 600px; border-radius: var(--radius-sm); overflow: hidden; }
  .stat-cell { background: rgba(12,11,9,0.8); padding: 1rem 1.1rem; }
  .stat-cell strong { display: block; color: var(--ink-pure); font-family: var(--font); font-size: clamp(1.3rem, 2.6vw, 1.9rem); letter-spacing: -0.05em; line-height: 1; }
  .stat-cell span { display: block; margin-top: 0.3rem; color: var(--faint); font-family: var(--font); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .hero-visual { position: relative; min-height: 500px; display: grid; place-items: center; }
  .node-ring { position: relative; width: 380px; height: 380px; }
  .node-ring::before { content: ""; position: absolute; inset: 14%; border-radius: 50%; border: 1px solid var(--line-strong); animation: pulse-ring 6s ease-in-out infinite; }
  .node-ring::after { content: ""; position: absolute; inset: 28%; border-radius: 50%; border: 1px dashed var(--electric-cyan); opacity: 0.2; }
  .ring-orbit { position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--electric-cyan); opacity: 0.1; animation: spin-slow 30s linear infinite; }
  .ring-orbit:nth-child(2) { border-color: var(--copper); opacity: 0.08; animation-duration: 40s; animation-direction: reverse; inset: 8%; }
  .orbit-arm { position: absolute; top: 50%; left: 50%; width: 0; height: 0; animation: planet-orbit 60s linear infinite; }
  .orbit-arm-1 { animation-delay: 0s; }
  .orbit-arm-2 { animation-delay: -20s; }
  .orbit-arm-3 { animation-delay: -40s; }
  .node { position: absolute; width: 112px; height: 112px; border-radius: 50%; border: 1px solid var(--line-strong); background: var(--bg-card); backdrop-filter: blur(16px) saturate(1.4); display: grid; place-items: center; text-align: center; box-shadow: 0 12px 40px rgba(0,0,0,0.45), inset 0 0 20px var(--accent-glow), inset 0 1px 0 0 var(--glass-edge); transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; top: -56px; left: -56px; transform: translateY(-134px); }
  .node:hover { border-color: var(--copper); background: var(--bg-card-solid); box-shadow: 0 16px 40px rgba(0,0,0,0.5), inset 0 0 20px var(--accent-soft), 0 0 24px var(--accent-glow), inset 0 1px 0 0 var(--glass-edge-light); }
  .orbit-arm-1 .label { animation: counter-orbit 60s linear infinite; animation-delay: 0s; }
  .orbit-arm-2 .label { animation: counter-orbit 60s linear infinite; animation-delay: -20s; }
  .orbit-arm-3 .label { animation: counter-orbit 60s linear infinite; animation-delay: -40s; }
  .node .label { font-family: var(--font); font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; line-height: 1.3; color: var(--muted); display: block; }
  .node .label strong { display: block; color: var(--ink-pure); font-size: 0.72rem; }
  .node-1 .label strong { color: var(--copper); }
  .node-2 .label strong { color: var(--cyan); }
  .node-3 .label strong { color: var(--ink-pure); }
  .glow-blob { position: absolute; border-radius: 50%; filter: blur(50px); pointer-events: none; }
  .glow-blob-1 { width: 280px; height: 280px; background: var(--accent-glow); top: 0; right: -60px; }
  .glow-blob-2 { width: 200px; height: 200px; background: rgba(94,197,189,0.05); bottom: 20px; left: -40px; }
  .hero-scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; font-family: var(--mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.5; animation: bob 2s ease-in-out infinite; }
  .hero-scroll-hint svg { animation: bobArrow 2s ease-in-out infinite; }
  @keyframes bob { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(4px); } }
  @keyframes bobArrow { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(3px); opacity: 1; } }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  @keyframes pulse-ring { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.04); opacity: 0.3; } }
  @keyframes planet-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes counter-orbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  @media (max-width: 1200px) { .hero-grid { grid-template-columns: 1.25fr 0.75fr; gap: 2rem; } h1 { font-size: clamp(3rem, 7vw, 6.5rem); } .node-ring { width: 320px; height: 320px; } .node { width: 96px; height: 96px; top: -48px; left: -48px; transform: translateY(-113px); } .node .label { font-size: 0.52rem; } .node .label strong { font-size: 0.65rem; } }
  @media (max-width: 880px) { .hero-grid { grid-template-columns: 1fr; gap: 3rem; } section { padding: 3.5rem 1rem 2.5rem; } .hero-visual { min-height: 350px; } .node-ring { width: 300px; height: 300px; } .node { width: 88px; height: 88px; top: -44px; left: -44px; transform: translateY(-106px); } .node .label { font-size: 0.5rem; } .node .label strong { font-size: 0.6rem; } }
  @media (max-width: 640px) { section { padding: 4rem 1rem 2rem; } h1 { font-size: clamp(2.8rem, 15vw, 4.2rem); } .hero-visual { min-height: 280px; } .node-ring { width: 240px; height: 240px; } .node { width: 80px; height: 80px; top: -40px; left: -40px; transform: translateY(-80px); } .hero-stats { grid-template-columns: 1fr; } }
  @media (max-width: 420px) { section { padding: 3.5rem 0.8rem 1.5rem; } .hero-visual { min-height: 240px; } .node-ring { width: 200px; height: 200px; } .node { width: 68px; height: 68px; top: -34px; left: -34px; transform: translateY(-66px); } .node .label { font-size: 0.48rem; } }
  @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; } }
  .reveal { opacity: 0; transform: translateY(36px) scale(0.98); will-change: transform, opacity; transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); transition-delay: var(--stagger-delay, 0ms); }
  .reveal.revealed, .reveal.is-visible { opacity: 1; transform: translateY(0) scale(1); }
  .delay-1 { transition-delay: 0.06s; } .delay-2 { transition-delay: 0.14s; } .delay-3 { transition-delay: 0.22s; }
  :host(.light) .hero-visual { opacity: 0; pointer-events: none; }
  :host(.light) .stat-cell { background: rgba(237,232,224,0.95); }
  :host(.light) .stat-cell strong { color: var(--ink); }
  :host(.light) .stat-cell span { color: var(--muted); }
  :host(.light) .hero-stats { border-color: rgba(0,0,0,0.1); background: rgba(0,0,0,0.1); }
</style>
<section id="hero" aria-labelledby="hero-title">
  <div class="hero-grid">
    <div class="hero-text">
      <h1 id="hero-title" class="reveal is-visible delay-1">
        <span class="line-1">Engineered</span>
        <span class="line-2">With</span>
        <span class="line-3"><span class="scramble-target" data-value="SYNDRIX">Intelligence</span></span>
      </h1>
      <p class="hero-copy reveal is-visible delay-2">SYNDRIX is an engineering-driven company specializing in custom electronic systems, embedded technologies, product development, PCB design, and intelligent hardware solutions. We bridge the gap between innovative ideas and reliable real-world products through precision engineering and intelligent problem-solving.</p>
      <div class="hero-actions reveal is-visible delay-3">
        <a href="#contact" class="btn btn-primary">Request a consultation</a>
        <a href="#services" class="btn btn-secondary">Explore our services</a>
      </div>
      <div class="hero-stats reveal is-visible delay-3">
        <div class="stat-cell"><strong>04</strong><span>Core disciplines</span></div>
        <div class="stat-cell"><strong>0→1</strong><span>Concept to deployment</span></div>
        <div class="stat-cell"><strong>Free</strong><span>Initial consultation</span></div>
      </div>
    </div>
    <div class="hero-visual reveal is-visible delay-2" aria-hidden="true">
      <div class="glow-blob glow-blob-1"></div>
      <div class="glow-blob glow-blob-2"></div>
      <div class="node-ring">
        <div class="ring-orbit"></div>
        <div class="ring-orbit"></div>
        <div class="orbit-arm orbit-arm-1"><div class="node node-1"><span class="label"><strong>Design</strong>Circuit & PCB</span></div></div>
        <div class="orbit-arm orbit-arm-2"><div class="node node-2"><span class="label"><strong>Develop</strong>Embedded & IoT</span></div></div>
        <div class="orbit-arm orbit-arm-3"><div class="node node-3"><span class="label"><strong>Validate</strong>Test & Ship</span></div></div>
      </div>
    </div>
  </div>
  <div class="hero-scroll-hint" aria-hidden="true">
    <span>Scroll</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
  </div>
</section>`;

class SyndraHero extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(t.content.cloneNode(true));

    this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    const themeObserver = new MutationObserver(() => {
      this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    this.initTypewriter(root);
    this.initReveal(root);
  }

  initTypewriter(root) {
    class Typewriter {
      constructor(el, delayBackspace = 30, delayType = 65, delayPause = 250) {
        this.el = el;
        this.delayBackspace = delayBackspace;
        this.delayType = delayType;
        this.delayPause = delayPause;
        this.timer = null;
        this.currentTarget = el.innerText;
        this.el.classList.add('typing');
      }
      async transitionTo(targetText, originalText) {
        if (this.currentTarget === targetText) return;
        this.currentTarget = targetText;
        this.stop();
        await this.erase();
        await this.pause(this.delayPause);
        if (targetText === 'SYNDRIX') {
          this.el.classList.add('state-syndrix');
        } else {
          this.el.classList.remove('state-syndrix');
        }
        await this.type(targetText);
      }
      stop() { clearTimeout(this.timer); }
      erase() {
        return new Promise((resolve) => {
          const step = () => {
            const current = this.el.innerText;
            if (current.length > 0) {
              this.el.innerText = current.slice(0, -1);
              this.timer = setTimeout(step, this.delayBackspace);
            } else { resolve(); }
          };
          step();
        });
      }
      type(text) {
        return new Promise((resolve) => {
          let index = 0;
          const step = () => {
            if (index < text.length) {
              this.el.innerText += text[index];
              index++;
              this.timer = setTimeout(step, this.delayType);
            } else { resolve(); }
          };
          step();
        });
      }
      pause(ms) {
        return new Promise((resolve) => { this.timer = setTimeout(resolve, ms); });
      }
    }

    const scrambleTarget = root.querySelector('.scramble-target');
    if (scrambleTarget) {
      const originalText = scrambleTarget.innerText;
      const targetText = scrambleTarget.getAttribute('data-value');
      const typewriter = new Typewriter(scrambleTarget);
      const startLoop = async () => {
        await typewriter.pause(3500);
        while (true) {
          await typewriter.transitionTo(targetText, originalText);
          await typewriter.pause(3000);
          await typewriter.transitionTo(originalText, originalText);
          await typewriter.pause(3500);
        }
      };
      startLoop();
    }
  }

  initReveal(root) {
    const els = root.querySelectorAll('.reveal');
    els.forEach((child, i) => {
      child.style.setProperty('--stagger-delay', `${i * 60}ms`);
      child.classList.add('revealed');
    });
  }
}

customElements.define('syndra-hero', SyndraHero);
