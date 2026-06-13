const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; position: fixed; left: 50%; top: 12px; z-index: 60; transform: translateX(-50%); width: min(1200px, calc(100% - 24px)); }
  .nav { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.3rem 0.5rem 0.3rem 1rem; border: none; border-radius: 999px; background: linear-gradient(135deg, rgba(232,223,206,0.07), rgba(232,223,206,0.02) 50%, rgba(12,11,9,0.6)); backdrop-filter: blur(28px) saturate(2.2); -webkit-backdrop-filter: blur(28px) saturate(2.2); box-shadow: 0 24px 60px -15px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(232,223,206,0.10), inset 0 1px 0 0 rgba(232,223,206,0.15), inset 0 -1px 0 0 rgba(0,0,0,0.5); transition: all 0.4s var(--ease, cubic-bezier(0.16,1,0.3,1)); position: relative; }
  .nav::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(232,223,206,0.12), transparent 80%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; z-index: 0; }
  .nav:hover::before { opacity: 1; }
  .nav:hover { box-shadow: 0 30px 70px -12px rgba(0,0,0,0.8), inset 0 0 0 1px var(--border-hover, rgba(232,223,206,0.15)), inset 0 1px 0 0 var(--glass-edge, rgba(232,223,206,0.12)), inset 0 -1px 0 0 rgba(0,0,0,0.6), inset 0 0 20px var(--hud, rgba(232,223,206,0.06)); transform: translateY(1px); }
  .brand { display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-family: var(--font); font-size: 0.88rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-pure); position: relative; z-index: 2; }
  .brand svg { width: 28px; height: 28px; flex-shrink: 0; }
  .brand svg .logo-bg { fill: #0c0b09; }
  .brand svg .logo-stroke { stroke: var(--copper); }
  .brand svg .logo-fill { fill: var(--cyan); }
  .nav-links { display: flex; align-items: center; gap: 0.2rem; position: relative; z-index: 2; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.5rem 0.85rem; border-radius: 999px; transition: color 0.3s ease; position: relative; z-index: 2; }
  .nav-links a:hover, .nav-links a.active { color: var(--ink); }
  .nav-indicator { position: absolute; top: 14%; height: 72%; border-radius: 999px; background: rgba(255,255,255,0.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 0 rgba(255,255,255,0.10), inset 0 -1px 0 0 rgba(0,0,0,0.3); pointer-events: none; z-index: 1; opacity: 0; transform: scale(0.9); will-change: left, right; }
  .nav-actions { display: flex; align-items: center; gap: 0.6rem; position: relative; z-index: 2; }
  .theme-toggle { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: rgba(255,255,255,0.06); border: 1px solid rgba(232,223,206,0.1); border-radius: 50%; cursor: pointer; color: var(--muted); transition: all 0.3s ease; position: relative; overflow: hidden; }
  .theme-toggle:hover { background: rgba(255,255,255,0.1); border-color: rgba(232,223,206,0.2); color: var(--ink); transform: scale(1.05); }
  .theme-toggle svg { width: 16px; height: 16px; }
  .theme-toggle .theme-icon-light { display: none; }
  .theme-toggle .theme-icon-dark { display: block; }
  :host(.light) .theme-toggle { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); color: var(--muted); }
  :host(.light) .theme-toggle:hover { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.12); color: var(--ink); }
  :host(.light) .theme-toggle .theme-icon-light { display: block; }
  :host(.light) .theme-toggle .theme-icon-dark { display: none; }
  :host(.light) .nav { background: linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.7) 50%, rgba(245,240,235,0.9)); }
  :host(.light) .nav-indicator { background: var(--panel); box-shadow: inset 0 0 0 1px var(--border), inset 0 1px 0 0 var(--glass-edge), inset 0 -1px 0 0 rgba(0,0,0,0.35), 0 0 16px var(--accent-glow); }
  :host(.light) .brand, :host(.light) .nav-links a:hover, :host(.light) .nav-links a.active { color: var(--ink); }
  :host(.light) .brand svg .logo-bg { fill: #f5f0eb; }
  :host(.light) .brand svg .logo-stroke { stroke: var(--copper); }
  :host(.light) .brand svg .logo-fill { fill: var(--cyan); }
  :host(.light) .nav-links a { color: var(--muted); }
  .nav-cta { background: var(--copper); color: #0c0b09; border-radius: 999px; padding: 0.45rem 1rem; font-weight: 900; font-size: 0.74rem; letter-spacing: 0.02em; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease; white-space: nowrap; position: relative; z-index: 2; line-height: 1.3; }
  .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(196,134,63,0.22); }
  .nav-cta:active, .nav-links a:active, .brand:active { transform: scale(0.96); }
  @media (max-width: 980px) { .nav-links { display: none; } .nav-cta { font-size: 0.74rem; padding: 0.5rem 0.95rem; } }
  @media (max-width: 640px) { :host { width: calc(100% - 14px); } .nav { padding: 0.45rem 0.55rem 0.45rem 0.75rem; } .brand { font-size: 0.8rem; letter-spacing: 0.06em; } .nav-cta { font-size: 0.68rem; padding: 0.45rem 0.75rem; } }
</style>
<nav class="nav" id="navbar" aria-label="Primary">
  <a href="#main" class="brand" id="wordmark" aria-label="SYNDRIX home"><svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="logo-bg" width="64" height="64" rx="14" fill="#0c0b09"/><path class="logo-stroke" d="M14 42 32 12l18 30H14Z" stroke="#c4863f" stroke-width="4"/><path class="logo-fill" d="M22 42h28L32 52 14 42h8Z" fill="#5ec5bd"/></svg>SYNDRIX</a>
  <div class="nav-links">
    <div class="nav-indicator"></div>
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#process">Process</a>
    <a href="#workbench">Workbench</a>
    <a href="#team">Team</a>
    <a href="#operations">Operations</a>
    <a href="#contact">Contact</a>
  </div>
  <div class="nav-actions">
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
      <svg class="theme-icon theme-icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <svg class="theme-icon theme-icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
    </button>
    <a class="nav-cta" href="#contact">Start a Project</a>
  </div>
</nav>`;

class SyndraNav extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(t.content.cloneNode(true));

    const nav = root.querySelector('.nav');
    const navLinks = root.querySelectorAll('.nav-links a');
    const navLinksContainer = root.querySelector('.nav-links');
    const indicator = root.querySelector('.nav-indicator');
    const themeToggle = root.querySelector('.theme-toggle');

    let activeLink = null;
    let isInitial = true;
    let navClickLock = false;
    let cachedSections = null;

    this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    const themeObserver = new MutationObserver(() => {
      this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    nav.addEventListener('mousemove', (e) => {
      const rect = nav.getBoundingClientRect();
      nav.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      nav.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => updateIndicator(link));
      link.addEventListener('click', onNavClick);
    });
    navLinksContainer.addEventListener('mouseleave', () => updateIndicator(activeLink));

    window.addEventListener('resize', () => {
      if (activeLink && indicator) {
        indicator.style.transition = 'none';
        positionIndicator(activeLink);
      }
    });

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      const t = document.documentElement;
      const rect = themeToggle.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      t.style.setProperty('--splash-x', `${x}%`);
      t.style.setProperty('--splash-y', `${y}%`);
      const apply = () => { t.setAttribute('data-theme', next); };
      if (document.startViewTransition) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    });

    function positionIndicator(link) {
      if (!link || !indicator) return;
      const parentWidth = navLinksContainer.offsetWidth;
      indicator.style.left = `${link.offsetLeft}px`;
      indicator.style.right = `${parentWidth - (link.offsetLeft + link.offsetWidth)}px`;
    }

    function updateIndicator(link) {
      if (!indicator) return;
      if (!link) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'scale(0.9)';
        return;
      }
      const parentWidth = navLinksContainer.offsetWidth;
      const targetLeft = link.offsetLeft;
      const targetRight = parentWidth - (targetLeft + link.offsetWidth);

      if (isInitial || indicator.style.opacity === '0') {
        indicator.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        indicator.style.left = `${targetLeft}px`;
        indicator.style.right = `${targetRight}px`;
        indicator.style.opacity = '1';
        indicator.style.transform = 'scale(1)';
        isInitial = false;
        indicator.offsetHeight;
        return;
      }

      const currentLeft = parseFloat(indicator.style.left) || 0;
      const movingRight = targetLeft > currentLeft;

      if (movingRight) {
        indicator.style.transition = `left 0.38s cubic-bezier(0.25, 1, 0.5, 1) 0.05s, right 0.32s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease, transform 0.25s ease`;
      } else {
        indicator.style.transition = `left 0.32s cubic-bezier(0.25, 1, 0.5, 1), right 0.38s cubic-bezier(0.25, 1, 0.5, 1) 0.05s, opacity 0.25s ease, transform 0.25s ease`;
      }

      indicator.style.left = `${targetLeft}px`;
      indicator.style.right = `${targetRight}px`;
      indicator.style.opacity = '1';
      indicator.style.transform = 'scale(1)';
    }

    const SECTION_IDS = ['hero', 'about', 'services', 'process', 'workbench', 'team', 'operations', 'contact'];

    function getActiveSectionId() {
      if (!cachedSections) cachedSections = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);
      const sections = cachedSections;
      let closestId = null;
      let closestDist = Infinity;
      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const viewMid = window.innerHeight / 2;
        const dist = Math.abs(mid - viewMid);
        if (dist < closestDist) { closestDist = dist; closestId = s.id; }
      });
      if (closestId === 'hero') return 'about';
      return closestId;
    }

    function setActiveSection(id) {
      const next = root.querySelector(`.nav-links a[href="#${id}"]`);
      if (next) {
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        activeLink = next;
        updateIndicator(next);
      } else {
        activeLink = null;
        updateIndicator(null);
      }
    }

    function onNavClick(e) {
      const link = e.currentTarget;
      const href = link.getAttribute('href');
      const target = href?.startsWith('#') ? document.querySelector(href) : null;
      if (!target) return;
      e.preventDefault();
      navClickLock = true;
      activeLink = link;
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      updateIndicator(link);

      const start = window.scrollY;
      const end = target.getBoundingClientRect().top + start - 80;
      const duration = Math.min(Math.abs(end - start) * 0.12 + 80, 200);
      const startTime = performance.now();
      const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      requestAnimationFrame(function scroll(now) {
        const p = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, start + (end - start) * ease(p));
        if (p < 1) {
          requestAnimationFrame(scroll);
        }
      });
    }

    function syncActiveSection() {
      if (!navClickLock) {
        const id = getActiveSectionId();
        if (id) setActiveSection(id);
      }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          syncActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', () => { syncActiveSection(); }, { passive: true });
    }

    window.addEventListener('load', () => requestAnimationFrame(syncActiveSection));

    const progressBar = document.getElementById('scrollProgress');
    function updateProgress() {
      if (!progressBar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.transform = `scaleX(${pct / 100})`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }
}

customElements.define('syndra-nav', SyndraNav);
