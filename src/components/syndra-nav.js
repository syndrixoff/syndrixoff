const style = `
.nav {
  position: fixed; left: 50%; top: 12px; z-index: 60;
  transform: translateX(-50%);
  width: min(1200px, calc(100% - 24px));
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  padding: 0.3rem 0.5rem 0.3rem 1rem;
  border: none; border-radius: 999px;
  background: linear-gradient(135deg, rgba(232, 223, 206, 0.07), rgba(232, 223, 206, 0.02) 50%, rgba(12, 11, 9, 0.6));
  backdrop-filter: blur(28px) saturate(2.2);
  -webkit-backdrop-filter: blur(28px) saturate(2.2);
  box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.75), inset 0 0 0 1px rgba(232, 223, 206, 0.10), inset 0 1px 0 0 rgba(232, 223, 206, 0.15), inset 0 -1px 0 0 rgba(0, 0, 0, 0.5);
  transition: all 0.4s var(--ease);
}
.nav.scrolled { background: rgba(12, 11, 9, 0.82); }
.nav::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(232, 223, 206, 0.12), transparent 80%);
  opacity: 0; transition: opacity 0.4s ease; pointer-events: none; z-index: 0;
}
.nav:hover::before { opacity: 1; }
.nav:hover {
  box-shadow: 0 30px 70px -12px rgba(0, 0, 0, 0.8), inset 0 0 0 1px var(--border-hover), inset 0 1px 0 0 var(--glass-edge), inset 0 -1px 0 0 rgba(0, 0, 0, 0.6), inset 0 0 20px var(--hud);
  transform: translateX(-50%) translateY(1px);
}
.brand {
  display: inline-flex; align-items: center; text-decoration: none;
  font-family: var(--font); font-size: 0.88rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-pure);
  position: relative; z-index: 2;
}
.nav-links { display: flex; align-items: center; gap: 0.2rem; position: relative; z-index: 2; }
.nav-links a {
  color: var(--muted); text-decoration: none; font-size: 0.78rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35rem 0.85rem;
  border-radius: 999px; transition: color 0.3s ease; position: relative; z-index: 2;
}
.nav-links a:hover, .nav-links a.active { color: var(--ink); }
.nav-indicator {
  position: absolute; top: 14%; height: 72%; border-radius: 999px;
  background: rgba(255,255,255,0.08);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 0 rgba(255,255,255,0.10), inset 0 -1px 0 0 rgba(0,0,0,0.3);
  pointer-events: none; z-index: 1; opacity: 0; transform: scale(0.9); will-change: left, right;
}
.nav-actions { display: flex; align-items: center; gap: 0.6rem; position: relative; z-index: 2; }
.nav-cta {
  background: var(--copper); color: #0c0b09; border-radius: 999px;
  padding: 0.45rem 1rem; font-weight: 900; font-size: 0.74rem;
  letter-spacing: 0.02em; text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap; position: relative; z-index: 2; line-height: 1.3;
}
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(196, 134, 63, 0.22); }
.theme-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(232, 223, 206, 0.1);
  border-radius: 50%; cursor: pointer; color: var(--muted);
  transition: all 0.3s ease; position: relative; overflow: hidden;
}
.theme-toggle:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(232, 223, 206, 0.2); color: var(--ink); transform: scale(1.05); }
.theme-toggle svg { width: 16px; height: 16px; }
.theme-toggle .light-icon { display: none; }
.theme-toggle .dark-icon { display: block; }
:host-context([data-theme="light"]) .theme-toggle { background: rgba(0, 0, 0, 0.04); border-color: rgba(0, 0, 0, 0.08); color: var(--muted); }
:host-context([data-theme="light"]) .theme-toggle:hover { background: rgba(0, 0, 0, 0.06); border-color: rgba(0, 0, 0, 0.12); color: var(--ink); }
:host-context([data-theme="light"]) .theme-toggle .light-icon { display: block; }
:host-context([data-theme="light"]) .theme-toggle .dark-icon { display: none; }
`;

const template = document.createElement('template');
template.innerHTML = `
<style>${style}</style>
<a href="#main" class="brand" id="wordmark" aria-label="SYNDRIX home">SYNDRIX</a>
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
      <svg class="dark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <svg class="light-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
  </button>
  <a class="nav-cta" href="#contact">Start a Project</a>
</div>
`;

customElements.define('syndra-nav', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.indicator = this.shadowRoot.querySelector('.nav-indicator');
    this.navLinks = this.shadowRoot.querySelectorAll('.nav-links a');
    this.navLinksContainer = this.shadowRoot.querySelector('.nav-links');
    this.navElement = this.shadowRoot.querySelector('.nav');
    this.themeToggle = this.shadowRoot.getElementById('themeToggle');

    this.activeLink = null;
    this.isInitial = true;
    this.navClickLock = false;
    this.cachedSections = null;
    this.progressBar = null;
  }

  connectedCallback() {
    this.progressBar = document.getElementById('scrollProgress');

    this.navElement.addEventListener('mousemove', (e) => {
      const rect = this.navElement.getBoundingClientRect();
      this.navElement.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      this.navElement.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });

    this.navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => this.updateIndicator(link));
      link.addEventListener('click', (e) => this.onNavClick(e));
    });

    this.navLinksContainer.addEventListener('mouseleave', () => this.updateIndicator(this.activeLink));

    window.addEventListener('resize', () => {
      if (this.activeLink && this.indicator) {
        this.indicator.style.transition = 'none';
        this.positionIndicator(this.activeLink);
      }
    });

    this.themeToggle?.addEventListener('click', () => this.toggleTheme());

    this.initScrollTracking();
    this.initProgressBar();
  }

  getActiveSectionId() {
    if (!this.cachedSections) this.cachedSections = document.querySelectorAll('section[id]');
    const sections = this.cachedSections;
    let closestId = null;
    let closestDist = Infinity;
    sections.forEach((s) => {
      const rect = s.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const viewMid = window.innerHeight / 2;
      const dist = Math.abs(mid - viewMid);
      if (dist < closestDist) {
        closestDist = dist;
        closestId = s.id;
      }
    });
    if (closestId === 'hero') return 'about';
    return closestId;
  }

  setActiveSection(id, instant) {
    const next = this.shadowRoot.querySelector(`.nav-links a[href="#${id}"]`);
    if (next) {
      this.navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      this.activeLink = next;
      this.updateIndicator(next);
    } else {
      this.activeLink = null;
      this.updateIndicator(null);
    }
  }

  positionIndicator(link) {
    if (!link || !this.indicator) return;
    const parentWidth = this.navLinksContainer.offsetWidth;
    const left = link.offsetLeft;
    const right = parentWidth - (left + link.offsetWidth);
    this.indicator.style.left = `${left}px`;
    this.indicator.style.right = `${right}px`;
  }

  updateIndicator(link) {
    if (!this.indicator) return;
    if (!link) {
      this.indicator.style.opacity = '0';
      this.indicator.style.transform = 'scale(0.9)';
      return;
    }
    const parentWidth = this.navLinksContainer.offsetWidth;
    const targetLeft = link.offsetLeft;
    const targetRight = parentWidth - (targetLeft + link.offsetWidth);

    if (this.isInitial || this.indicator.style.opacity === '0') {
      this.indicator.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      this.indicator.style.left = `${targetLeft}px`;
      this.indicator.style.right = `${targetRight}px`;
      this.indicator.style.opacity = '1';
      this.indicator.style.transform = 'scale(1)';
      this.isInitial = false;
      this.indicator.offsetHeight;
      return;
    }

    const currentLeft = parseFloat(this.indicator.style.left) || 0;
    const movingRight = targetLeft > currentLeft;

    if (movingRight) {
      this.indicator.style.transition = `left 0.38s cubic-bezier(0.25, 1, 0.5, 1) 0.05s, right 0.32s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease, transform 0.25s ease`;
    } else {
      this.indicator.style.transition = `left 0.32s cubic-bezier(0.25, 1, 0.5, 1), right 0.38s cubic-bezier(0.25, 1, 0.5, 1) 0.05s, opacity 0.25s ease, transform 0.25s ease`;
    }
    this.indicator.style.left = `${targetLeft}px`;
    this.indicator.style.right = `${targetRight}px`;
    this.indicator.style.opacity = '1';
    this.indicator.style.transform = 'scale(1)';
  }

  onNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    const target = href?.startsWith('#') ? document.querySelector(href) : null;
    if (!target) return;
    e.preventDefault();
    this.navClickLock = true;
    this.activeLink = link;
    this.navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    this.updateIndicator(link);

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
      } else {
        this.navClickLock = false;
        const id = this.getActiveSectionId();
        if (id) this.setActiveSection(id);
      }
    }.bind(this));
  }

  syncActiveSection() {
    if (!this.navClickLock) {
      const id = this.getActiveSectionId();
      if (id) this.setActiveSection(id);
    }
  }

  initScrollTracking() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.syncActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', () => {
        this.syncActiveSection();
      }, { passive: true });
    }

    window.addEventListener('load', () => requestAnimationFrame(() => this.syncActiveSection()));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!this.navClickLock) {
          const id = this.getActiveSectionId();
          if (id) this.setActiveSection(id, true);
        }
      }, 200);
    }, { passive: true });
  }

  initProgressBar() {
    const updateProgress = () => {
      if (!this.progressBar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      this.progressBar.style.transform = `scaleX(${pct / 100})`;
    };

    const onScroll = () => {
      updateProgress();
      this.navElement?.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  toggleTheme() {
    if (this.themeToggleInProgress) return;
    this.themeToggleInProgress = true;
    const rect = this.themeToggle.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    const t = document.documentElement;
    t.style.setProperty("--splash-x", `${x}%`);
    t.style.setProperty("--splash-y", `${y}%`);
    const apply = () => {
      t.setAttribute("data-theme", next);
      this.themeToggleInProgress = false;
    };
    if (document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }
});
