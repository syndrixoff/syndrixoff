import { fetchTeamMembers } from '../supabase.js'

const t = document.createElement('template');
t.innerHTML = `
<style>
  :host { display: block; }
  section { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; padding: clamp(3.5rem, 6vh, 5rem) 0; scroll-margin-top: 100px; }
  .section-label { font-family: var(--mono); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .section-title { font-family: var(--font); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.05; letter-spacing: -0.04em; color: var(--ink-pure); margin: 0 0 1.5rem; }
  .section-title em { font-style: normal; color: var(--copper); }
  .team-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .team-filter { background: rgba(255,255,255,0.04); border: 1px solid rgba(232,223,206,0.15); border-radius: 999px; padding: 0.5rem 1.1rem; font-family: var(--font); font-size: 0.8rem; font-weight: 500; color: var(--muted); cursor: pointer; transition: all 0.25s ease; }
  .team-filter:hover { border-color: var(--copper); color: var(--ink); background: rgba(196,134,63,0.08); }
  .team-filter.active { border-color: var(--copper); color: #0c0b09; background: var(--copper); }
  .team-scroll-wrap { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .team-scroll-content { flex: 1; min-width: 0; }
  .team-grid { display: flex; gap: 20px; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 48px 32px 48px; margin-top: -20px; margin-bottom: -28px; scroll-padding-left: 32px; -webkit-mask-image: linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%); mask-image: linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%); }
  .team-grid::-webkit-scrollbar { display: none; }
  syndra-team-card { flex: 0 0 calc(25% - 12px); min-width: 0; max-width: calc(25% - 12px); scroll-snap-align: start; border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card); border: 1px solid var(--card-border); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); box-shadow: 0 1px 0 0 var(--glass-edge) inset, 0 8px 32px rgba(0,0,0,0.15); transition: transform 0.3s cubic-bezier(0.25,0.1,0.25,1), border-color 0.3s, background 0.6s, box-shadow 0.3s; }
  syndra-team-card:hover { transform: translateY(-6px); border-color: var(--border-hover); box-shadow: 0 1px 0 0 var(--glass-edge) inset, 0 12px 40px rgba(0,0,0,0.22), 0 0 24px var(--accent-glow); }
  syndra-team-card:active { transform: scale(0.98); }
  .team-scroll-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: var(--panel); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color 0.3s, border-color 0.3s, transform 0.2s; flex-shrink: 0; }
  .team-scroll-btn:hover { color: var(--copper); border-color: var(--line-strong); transform: scale(1.08); }
  .team-scroll-btn:active { transform: scale(0.95); }
  .team-scroll-btn svg { width: 18px; height: 18px; }
  .team-scroll-btn.hidden { opacity: 0 !important; pointer-events: none; }
  .team-scroll-dots { display: flex; justify-content: center; gap: 8px; margin-top: 10px; min-height: 8px; }
  .team-scroll-dots .tdot { width: 24px; height: 24px; border-radius: 50%; background: none; border: none; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.35s; pointer-events: auto; }
  .team-scroll-dots .tdot::after { content: ""; display: block; width: 6px; height: 6px; border-radius: 50%; background: color-mix(in srgb, var(--fg-muted) 20%, transparent); transition: background 0.35s, transform 0.35s; }
  .team-scroll-dots .tdot:hover::after { background: color-mix(in srgb, var(--fg-muted) 40%, transparent); }
  .team-scroll-dots .tdot.active::after { background: var(--copper); box-shadow: 0 0 6px var(--accent-glow); transform: scale(1.6); }
  .team-empty { display: none; padding: 2rem; text-align: center; color: var(--muted); font-size: 0.88rem; font-family: var(--mono); letter-spacing: 0.04em; }
  .team-empty.visible { display: block; }
  :host(.light) syndra-team-card { background: rgba(255,255,255,0.4); border-color: rgba(255,255,255,0.5); }
  :host(.light) .team-filter { background: rgba(0,0,0,0.02); border-color: rgba(0,0,0,0.12); color: var(--muted); }
  :host(.light) .team-filter:hover { border-color: var(--copper); color: var(--ink); background: rgba(196,134,63,0.08); }
  :host(.light) .team-filter.active { border-color: var(--copper); color: #fff; background: var(--copper); }
  :host(.light) .team-scroll-btn { background: rgba(255,255,255,0.85); border-color: rgba(0,0,0,0.1); }
  :host(.light) .team-scroll-btn:hover { color: var(--copper); border-color: var(--copper); }
  @media (max-width: 980px) { syndra-team-card { flex: 0 0 calc(50% - 10px); max-width: calc(50% - 10px); } }
  @media (max-width: 640px) { section { width: calc(100% - 1.6rem); padding: 3.5rem 0; } syndra-team-card { flex: 0 0 calc(50% - 10px); max-width: calc(50% - 10px); } }
  @media (max-width: 420px) { syndra-team-card { flex: 0 0 100%; max-width: 100%; } }
  @media (max-width: 900px) { .team-scroll-btn { display: none; } }
</style>
<section class="section" id="team" aria-labelledby="team-title">
  <div class="section-label">// CREW MANIFEST</div>
  <h2 id="team-title" class="section-title">Engineered by <em>Specialists</em>. <span style="color:var(--ink-pure)">Owned by you.</span></h2>
  <div class="team-filters" id="teamFilters">
    <button class="team-filter active" data-filter="all">All</button>
    <button class="team-filter" data-filter="leadership">Leadership</button>
    <button class="team-filter" data-filter="engineering-design">Engineering Design</button>
    <button class="team-filter" data-filter="embedded-product-engineering">Embedded & Product Engineering</button>
    <button class="team-filter" data-filter="software-engineering">Software Engineering</button>
  </div>
  <div class="team-scroll-wrap">
    <button class="team-scroll-btn team-scroll-prev" aria-label="Scroll team left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
    <div class="team-scroll-content">
      <div class="team-grid" id="teamGrid"></div>
      <div class="team-scroll-dots"></div>
      <div class="team-empty"><p>No team members match this filter.</p></div>
    </div>
    <button class="team-scroll-btn team-scroll-next" aria-label="Scroll team right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
  </div>
</section>`;

class SyndraTeam extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('eager')) { this.render(); }
    else { this.observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { this.observer.disconnect(); this.render(); } }, { rootMargin: '400px' }); this.observer.observe(this); }
  }
  render() {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(t.content.cloneNode(true));
    this.classList.toggle('light', document.documentElement.dataset.theme === 'light');
    new MutationObserver(() => { this.classList.toggle('light', document.documentElement.dataset.theme === 'light'); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.initTeam(root);
  }
  async initTeam(root) {
    const grid = root.getElementById('teamGrid');
    try {
      let members = await fetchTeamMembers();

      members.sort((a, b) => {
        const catsA = (a.category || '').split(' ');
        const catsB = (b.category || '').split(' ');
        const isCLevelA = catsA.includes('leadership');
        const isCLevelB = catsB.includes('leadership');

        if (isCLevelA && !isCLevelB) return -1;
        if (!isCLevelA && isCLevelB) return 1;
        if (isCLevelA && isCLevelB) return (a.sort_order ?? 99) - (b.sort_order ?? 99);

        if (a.is_lead && !b.is_lead) return -1;
        if (!a.is_lead && b.is_lead) return 1;

        return a.name.localeCompare(b.name);
      });

      members.forEach(member => {
        const card = document.createElement('syndra-team-card');
        card.setAttribute('name', member.name);
        card.setAttribute('jobrole', member.role);
        card.setAttribute('category', member.category);
        card.setAttribute('bio', member.bio || '');
        if (member.image) card.setAttribute('image', member.image);
        if (member.linkedin) card.setAttribute('linkedin', member.linkedin);
        if (member.github) card.setAttribute('github', member.github);
        grid.appendChild(card);
      });
    } catch {
      const empty = root.querySelector('.team-empty');
      if (empty) { empty.textContent = 'Failed to load team members.'; empty.classList.add('visible'); }
    }
    this.initFilters(root);
  }
  initFilters(root) {
    const filterBtns = root.querySelectorAll('.team-filter');
    const teamCards = root.querySelectorAll('syndra-team-card');
    const teamGrid = root.getElementById('teamGrid');
    const teamDots = root.querySelector('.team-scroll-dots');
    const prevBtn = root.querySelector('.team-scroll-prev');
    const nextBtn = root.querySelector('.team-scroll-next');
    const emptyState = root.querySelector('.team-empty');

    function rebuildTeamDots() {
      if (!teamGrid) return;
      const containerW = teamGrid.clientWidth;
      if (!containerW) { if (teamDots) teamDots.innerHTML = ''; return; }
      const pages = Math.max(1, Math.ceil(teamGrid.scrollWidth / containerW));
      if (teamDots) {
        teamDots.innerHTML = '';
        for (let i = 0; i < pages; i++) {
          const dot = document.createElement('button');
          dot.className = 'tdot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Page ' + (i + 1));
          dot.addEventListener('click', () => {
            const maxScroll = teamGrid.scrollWidth - teamGrid.clientWidth;
            teamGrid.scrollTo({ left: (i / (pages - 1)) * maxScroll, behavior: 'smooth' });
          });
          teamDots.appendChild(dot);
        }
      }
    }

    function syncChevrons() {
      if (!teamGrid) return;
      const maxScroll = teamGrid.scrollWidth - teamGrid.clientWidth;
      if (maxScroll <= 1) { prevBtn?.classList.add('hidden'); nextBtn?.classList.add('hidden'); return; }
      prevBtn?.classList.toggle('hidden', teamGrid.scrollLeft < 8);
      nextBtn?.classList.toggle('hidden', teamGrid.scrollLeft > maxScroll - 8);
    }

    function syncTeamDots() {
      if (!teamDots || !teamGrid) return;
      const dots = teamDots.querySelectorAll('.tdot');
      if (!dots.length) return;
      const scrollL = teamGrid.scrollLeft;
      const maxScroll = teamGrid.scrollWidth - teamGrid.clientWidth;
      const pct = maxScroll > 0 ? scrollL / maxScroll : 0;
      const active = Math.min(dots.length - 1, Math.round(pct * (dots.length - 1)));
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
    }

    function scrollByPage(dir) {
      if (!teamGrid) return;
      const w = teamGrid.clientWidth;
      teamGrid.scrollTo({ left: teamGrid.scrollLeft + w * dir, behavior: 'smooth' });
    }

    prevBtn?.addEventListener('click', () => scrollByPage(-1));
    nextBtn?.addEventListener('click', () => scrollByPage(1));
    teamGrid?.addEventListener('scroll', () => { syncTeamDots(); syncChevrons(); }, { passive: true });

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        let visibleCount = 0;
        teamCards.forEach((card) => {
          const show = filter === 'all' || (card.getAttribute('category') || '').split(' ').includes(filter);
          card.classList.toggle('hidden', !show);
          if (show) visibleCount++;
        });
        if (emptyState) emptyState.classList.toggle('visible', visibleCount === 0);
        rebuildTeamDots();
        syncTeamDots();
        syncChevrons();
      });
    });

    rebuildTeamDots();
    syncTeamDots();
    syncChevrons();
  }
}
customElements.define('syndra-team', SyndraTeam);
