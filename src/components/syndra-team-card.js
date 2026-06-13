const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  :host(.hidden) { display: none; }
  .team-card-visual { position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; }
  .team-card-visual img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; transition: transform 0.6s cubic-bezier(0.25,0.1,0.25,1); }
  :host(:hover) .team-card-visual img { transform: scale(1.04); }
  .team-card-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--bg-card); color: var(--muted); transition: transform 0.6s cubic-bezier(0.25,0.1,0.25,1); }
  .team-card-placeholder svg { width: 48%; height: 48%; opacity: 0.35; }
  :host(:hover) .team-card-placeholder { transform: scale(1.04); }
  .team-card-overlay { padding: 14px 16px 2px; }
  .team-card-overlay h3 { font-size: 0.9rem; font-weight: 600; color: var(--ink-pure); line-height: 1.2; margin-bottom: 2px; margin: 0 0 2px; }
  .team-card-overlay .team-role { display: block; font-size: 0.6rem; font-family: var(--mono); color: var(--muted); font-weight: 500; letter-spacing: 0.03em; }
  .team-card-bio { font-size: 0.65rem; line-height: 1.5; color: var(--ink-pure); opacity: 0.7; padding: 6px 16px 0; margin: 0; }
  .team-social { display: flex; gap: 8px; padding: 8px 16px 12px; }
  .team-social a { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; color: var(--muted); border: 1px solid var(--border); transition: color 0.25s, border-color 0.25s, background 0.25s, transform 0.25s; }
  .team-social a:hover { color: var(--copper); border-color: var(--copper); background: rgba(196,134,63,0.12); transform: translateY(-2px); }
  .team-social svg { width: 13px; height: 13px; }
  :host(.light) .team-card-overlay h3 { color: var(--ink-pure); }
  :host(.light) .team-social a { color: var(--muted); border-color: rgba(0,0,0,0.1); background: rgba(228,228,231,0.5); }
</style>
<div class="team-card-visual" id="visual">
  <img id="cardImage" alt="" />
  <div id="cardPlaceholder" class="team-card-placeholder">
    <span id="initialsSpan"></span>
  </div>
</div>
<div class="team-card-overlay">
  <h3 id="nameEl"></h3>
  <span class="team-role" id="roleEl"></span>
</div>
<p class="team-card-bio" id="bioEl"></p>
<div class="team-social">
  <a id="linkedinEl" href="#" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
  <a id="githubEl" href="#" aria-label="GitHub" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
</div>`;

class SyndraTeamCard extends HTMLElement {
  static get observedAttributes() { return ['name', 'jobrole', 'image', 'bio', 'linkedin', 'github']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(t.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
    this.renderTheme();
    new MutationObserver(() => this.renderTheme()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  attributeChangedCallback() {
    this.render();
  }

  renderTheme() {
    this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
  }

  render() {
    const shadow = this.shadowRoot;
    shadow.getElementById('nameEl').textContent = this.getAttribute('name') || '';
    shadow.getElementById('roleEl').textContent = this.getAttribute('jobrole') || '';
    shadow.getElementById('bioEl').textContent = this.getAttribute('bio') || '';

    const imageUrl = this.getAttribute('image');
    const imgEl = shadow.getElementById('cardImage');
    const placeholderEl = shadow.getElementById('cardPlaceholder');
    const initialsSpan = shadow.getElementById('initialsSpan');

    if (imageUrl) {
      imgEl.src = imageUrl;
      imgEl.alt = this.getAttribute('name') || '';
      imgEl.style.display = 'block';
      placeholderEl.style.display = 'none';
      imgEl.onerror = () => this.showInitials();
    } else {
      imgEl.style.display = 'none';
      placeholderEl.style.display = 'flex';
      this.showInitials();
    }

    const linkedin = this.getAttribute('linkedin');
    const github = this.getAttribute('github');
    const linkedinEl = shadow.getElementById('linkedinEl');
    const githubEl = shadow.getElementById('githubEl');
    linkedinEl.href = linkedin || '#';
    linkedinEl.style.display = linkedin ? 'inline-flex' : 'none';
    githubEl.href = github || '#';
    githubEl.style.display = github ? 'inline-flex' : 'none';
  }

  showInitials() {
    const shadow = this.shadowRoot;
    const name = this.getAttribute('name') || '';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const initialsSpan = shadow.getElementById('initialsSpan');
    const placeholderEl = shadow.getElementById('cardPlaceholder');
    const imgEl = shadow.getElementById('cardImage');

    imgEl.style.display = 'none';
    placeholderEl.style.display = 'flex';
    placeholderEl.style.background = 'var(--bg-card-solid)';
    initialsSpan.textContent = initials;
    initialsSpan.style.cssText = 'font-family:var(--font);font-size:2rem;font-weight:700;color:var(--copper);opacity:0.9';
  }
}

customElements.define('syndra-team-card', SyndraTeamCard);
