const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; scroll-margin-top: 100px; }
  .section-head { display: grid; grid-template-columns: 1fr minmax(240px, 0.42fr); gap: 2.5rem; align-items: end; margin-bottom: 3rem; }
  .section-head p { margin: 0; color: var(--muted); line-height: 1.7; }
  .kicker { margin: 0 0 0.8rem; color: var(--copper); font-family: var(--font); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
  h2 { margin: 0; font-family: var(--font); font-size: clamp(2.2rem, 5vw, 5rem); line-height: 0.92; letter-spacing: -0.06em; max-width: 800px; }
  .mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem; }
  .mission-card { border: 1px solid rgba(232,223,206,0.1); border-radius: var(--radius); background: rgba(18,16,14,0.45); backdrop-filter: blur(16px) saturate(1.4); padding: 2rem 1.8rem; position: relative; overflow: hidden; box-shadow: 0 12px 36px -8px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(232,223,206,0.08); transition: border-color 0.3s ease, box-shadow 0.3s ease; }
  .mission-card:hover { border-color: var(--copper); box-shadow: 0 0 0 1px var(--copper) inset, 0 0 20px rgba(196,134,63,0.08); }
  .mission-card h3 { margin: 0 0 0.8rem; font-family: var(--font); font-size: 1.35rem; letter-spacing: -0.03em; }
  .mission-card p { margin: 0; color: var(--muted); font-size: 0.95rem; line-height: 1.7; }
  .values-grid { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 1rem; }
  .value-card { border: 1px solid rgba(232,223,206,0.09); border-radius: var(--radius-sm); background: rgba(18,16,14,0.4); backdrop-filter: blur(12px) saturate(1.3); padding: 1.4rem 1.2rem; text-align: center; box-shadow: 0 8px 28px -6px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(232,223,206,0.06); transition: border-color 0.3s ease, transform 0.3s var(--ease), background-color 0.3s ease, box-shadow 0.3s ease; }
  .value-card:hover { border-color: var(--copper) !important; box-shadow: 0 0 0 1px var(--copper) inset, 0 0 20px rgba(196,134,63,0.08); }
  .value-icon { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; margin: 0 auto 1rem; background: linear-gradient(135deg, rgba(196,134,63,0.15), rgba(94,197,189,0.08)); border: 1px solid var(--line); }
  .value-icon svg { width: 22px; height: 22px; }
  .value-card h4 { margin: 0 0 0.5rem; font-family: var(--font); font-size: 1rem; color: var(--ink-pure); letter-spacing: -0.02em; }
  .value-card p { margin: 0; color: var(--muted); font-size: 0.82rem; line-height: 1.5; }
  .promise-banner { margin-top: 3rem; border: 1px solid rgba(196,134,63,0.2); border-radius: var(--radius); background: radial-gradient(ellipse at 20% 50%, rgba(196,134,63,0.08), transparent 20rem), radial-gradient(ellipse at 80% 50%, rgba(94,197,189,0.06), transparent 18rem), rgba(18,16,14,0.5); backdrop-filter: blur(20px) saturate(1.4); padding: 2.5rem 2rem; text-align: center; position: relative; overflow: hidden; box-shadow: 0 16px 40px -12px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(232,223,206,0.1); transition: border-color 0.3s ease, box-shadow 0.3s ease; }
  .promise-banner:hover { border-color: var(--copper); box-shadow: 0 0 0 1px var(--copper) inset, 0 0 20px rgba(196,134,63,0.08); }
  .promise-banner .bg-grid { position: absolute; inset: 0; background-image: linear-gradient(90deg, rgba(196,134,63,0.04) 1px, transparent 1px), linear-gradient(rgba(94,197,189,0.03) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; opacity: 0.5; }
  .promise-banner blockquote { margin: 0; position: relative; z-index: 2; font-family: var(--font); font-size: clamp(1.15rem, 2.2vw, 1.6rem); font-weight: 600; color: var(--ink-pure); line-height: 1.5; letter-spacing: -0.02em; max-width: 700px; margin-inline: auto; }
  .promise-banner .promise-label { margin: 0.8rem 0 0; position: relative; z-index: 2; color: var(--copper); font-family: var(--font); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
  .reveal { opacity: 0; transform: translateY(36px) scale(0.98); will-change: transform, opacity; transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); transition-delay: var(--stagger-delay, 0ms); }
  .reveal.revealed, .reveal.is-visible { opacity: 1; transform: translateY(0) scale(1); }
  .delay-1 { transition-delay: 0.06s; } .delay-2 { transition-delay: 0.14s; } .delay-3 { transition-delay: 0.22s; } .delay-4 { transition-delay: 0.3s; } .delay-5 { transition-delay: 0.38s; }
  :host(.light) .mission-card, :host(.light) .value-card { background: rgba(255,255,255,0.7); border-color: rgba(0,0,0,0.08); }
  :host(.light) .promise-banner { background: radial-gradient(ellipse at 20% 50%, rgba(196,134,63,0.06), transparent 20rem), radial-gradient(ellipse at 80% 50%, rgba(94,197,189,0.04), transparent 18rem), rgba(255,255,255,0.75); border-color: rgba(0,0,0,0.08); }
  :host(.light) .promise-banner .bg-grid { background-image: linear-gradient(90deg, rgba(196,134,63,0.03) 1px, transparent 1px), linear-gradient(rgba(94,197,189,0.02) 1px, transparent 1px); }
  @media (max-width: 980px) { .section-head { grid-template-columns: 1fr; gap: 1rem; } .mission-grid { grid-template-columns: 1fr; } .values-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @media (max-width: 640px) { section { width: calc(100% - 1.6rem); padding: 3.5rem 0; } .values-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  @media (max-width: 420px) { .values-grid { grid-template-columns: 1fr; } }
</style>
<section class="section" id="about" aria-labelledby="about-title">
  <div class="section-head">
    <div>
      <p class="kicker">Brand Foundation</p>
      <h2 id="about-title">Intelligence meets engineering.</h2>
    </div>
    <p>We engineer intelligent electronic systems tailored to real-world requirements. From concept to deployment, every solution is designed with precision and purpose.</p>
  </div>
  <div class="mission-grid">
    <div class="mission-card"><h3>Mission</h3><p>To transform ideas into reliable electronic systems through intelligent engineering and precision execution.</p></div>
    <div class="mission-card"><h3>Vision</h3><p>To become a trusted engineering partner for innovators, startups, research organizations, and industries seeking advanced electronic solutions.</p></div>
  </div>
  <div class="values-grid">
    <div class="value-card"><div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" color="#c4863f"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07-2.83 2.83m-8.48 8.48-2.83 2.83m0-14.14 2.83 2.83m8.48 8.48 2.83 2.83"/></svg></div><h4>Precision</h4><p>Every design decision is based on accuracy, engineering rigor, and technical excellence.</p></div>
    <div class="value-card"><div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" color="#5ec5bd"><path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z"/></svg></div><h4>Intelligence</h4><p>We solve complex challenges through thoughtful engineering and innovation.</p></div>
    <div class="value-card"><div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" color="#c4863f"><path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg></div><h4>Reliability</h4><p>Products and systems are designed to perform consistently in real-world environments.</p></div>
    <div class="value-card"><div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" color="#5ec5bd"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/></svg></div><h4>Innovation</h4><p>We continuously explore new technologies and smarter approaches.</p></div>
    <div class="value-card"><div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" color="#c4863f"><path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg></div><h4>Partnership</h4><p>We work closely with clients throughout the development journey.</p></div>
  </div>
  <div class="promise-banner">
    <div class="bg-grid"></div>
    <blockquote>"We engineer custom electronic solutions that combine innovation, reliability, and technical excellence."</blockquote>
    <p class="promise-label">— Brand Promise</p>
  </div>
</section>`;

class SyndraAbout extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('eager')) {
      this.render();
    } else {
      this.observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          this.observer.disconnect();
          this.render();
        }
      }, { rootMargin: '400px' });
      this.observer.observe(this);
    }
  }
  render() {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(t.content.cloneNode(true));
    this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    new MutationObserver(() => {
      this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.initReveal(root);
  }
  initReveal(root) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const children = entry.target.querySelectorAll('.reveal');
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            child.style.setProperty('--stagger-delay', `${i * 60}ms`);
            child.classList.add('revealed');
          });
        }
      });
    }, { threshold: 0.1, rootMargin: '-10% 0px -20% 0px' });
    const section = root.querySelector('section[id]');
    if (section) observer.observe(section);
    const rect = section.getBoundingClientRect();
    const effectiveTop = window.innerHeight * 0.1;
    const effectiveBottom = window.innerHeight * 0.8;
    if (rect.top < effectiveBottom && rect.bottom > effectiveTop) {
      const children = section.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        child.style.setProperty('--stagger-delay', `${i * 60}ms`);
        child.classList.add('revealed');
      });
    }
  }
}

customElements.define('syndra-about', SyndraAbout);
