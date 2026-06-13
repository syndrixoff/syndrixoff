let indicator, navLinks, navLinksContainer, navToggle, navElement;
let activeLink = null;
let isInitial = true;
let navClickLock = false;

export function initNav() {
  navElement = document.getElementById('navbar');
  navLinks = document.querySelectorAll('.nav-links a');
  navToggle = document.querySelector('.nav-toggle');
  navLinksContainer = document.querySelector('.nav-links');
  indicator = document.querySelector('.nav-indicator');

  // Mouse glow follower
  if (navElement) {
    navElement.addEventListener('mousemove', (e) => {
      const rect = navElement.getBoundingClientRect();
      navElement.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      navElement.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => updateIndicator(link));
    link.addEventListener('click', onNavClick);
  });

  if (navLinksContainer) {
    navLinksContainer.addEventListener('mouseleave', () => updateIndicator(activeLink));
  }

  window.addEventListener('resize', () => {
    if (activeLink && indicator) {
      indicator.style.transition = 'none';
      positionIndicator(activeLink);
    }
  });

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  initIntersectionObserver();
  initProgressBar();
}

let intersectionObserver;
let observedSections = [];
let activeSectionId = 'about';

export function getActiveSectionId() {
  return activeSectionId;
}

function initIntersectionObserver() {
  const sections = document.querySelectorAll('section[id]');
  observedSections = Array.from(sections);

  intersectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length === 1) {
      activeSectionId = visible[0].target.id;
    } else if (visible.length > 1) {
      const mid = window.innerHeight / 2;
      let closest = visible[0];
      let closestDist = Infinity;
      visible.forEach(e => {
        const dist = Math.abs(e.boundingClientRect.top + e.boundingClientRect.height / 2 - mid);
        if (dist < closestDist) { closestDist = dist; closest = e; }
      });
      activeSectionId = closest.target.id;
    }

    if (activeSectionId === 'hero') activeSectionId = 'about';
    if (!navClickLock) setActiveSection(activeSectionId);
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

  observedSections.forEach(s => intersectionObserver.observe(s));
}

export function setActiveSection(id, instant) {
  if (!navLinks) navLinks = document.querySelectorAll('.nav-links a');
  const next = document.querySelector(`.nav-links a[href="#${id}"]`);
  if (next) {
    navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    activeLink = next;
    updateIndicator(next);
  } else {
    activeLink = null;
    updateIndicator(null);
  }
}

export { activeLink, navClickLock };

function positionIndicator(link) {
  if (!link || !indicator) return;
  const parentWidth = navLinksContainer.offsetWidth;
  const left = link.offsetLeft;
  const right = parentWidth - (left + link.offsetWidth);
  indicator.style.left = `${left}px`;
  indicator.style.right = `${right}px`;
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
    return;
  }

  const currentLeft = parseFloat(indicator.style.left) || 0;
  const movingRight = targetLeft > currentLeft;

  if (movingRight) {
    indicator.style.transition = `
      left 0.38s cubic-bezier(0.25, 1, 0.5, 1) 0.05s,
      right 0.32s cubic-bezier(0.25, 1, 0.5, 1),
      opacity 0.25s ease,
      transform 0.25s ease
    `;
  } else {
    indicator.style.transition = `
      left 0.32s cubic-bezier(0.25, 1, 0.5, 1),
      right 0.38s cubic-bezier(0.25, 1, 0.5, 1) 0.05s,
      opacity 0.25s ease,
      transform 0.25s ease
    `;
  }

  indicator.style.left = `${targetLeft}px`;
  indicator.style.right = `${targetRight}px`;
  indicator.style.opacity = '1';
  indicator.style.transform = 'scale(1)';
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
    } else {
      navClickLock = false;
      const id = getActiveSectionId();
      if (id) setActiveSection(id);
    }
  });

  if (navLinksContainer) navLinksContainer.classList.remove('open');
  if (navToggle) navToggle.classList.remove('active');
}

let progressBar, nav;

function initProgressBar() {
  progressBar = document.getElementById('scrollProgress');
  nav = document.getElementById('nav');

  function updateProgress() {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.transform = `scaleX(${pct / 100})`;
  }

  function onScroll() {
    updateProgress();
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
