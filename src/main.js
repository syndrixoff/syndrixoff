import "./style.css";
import gsap from "gsap";
import { Application } from "@splinetool/runtime";
import * as THREE from "three";

window.THREE = THREE;

/* ─── DISABLE RIGHT CLICK ─── */
document.addEventListener("contextmenu", e => e.preventDefault());

/* ─── SCROLL PROGRESS BAR ─── */
const progressBar = document.getElementById("scrollProgress");

/* ─── NAV SCROLL STATE ─── */
const nav = document.getElementById("nav");

function updateProgress() {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = pct + "%";
}

function onScroll() {
  nav?.classList.toggle("scrolled", window.scrollY > 60);
  updateProgress();
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ─── ANIMATED COUNTERS ─── */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = "true";
        animateCounter(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".tele-card-value[data-target]").forEach((el) => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (!target) return;
  const suffix = el.dataset.target === "100" ? "%" : "+";
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current + suffix;
  }, 25);
}

/* ─── NAV TOGGLE ─── */
const navLinks = document.querySelectorAll('.nav-links a');
const navToggle = document.querySelector(".nav-toggle");
const navLinksContainer = document.querySelector(".nav-links");

/* ─── SLIDING NAV INDICATOR ─── */
const navIndicator = document.createElement("div");
navIndicator.className = "nav-indicator";
document.querySelector(".nav-links")?.appendChild(navIndicator);

function moveIndicator(link, instant) {
  if (!link) return;
  const rect = link.getBoundingClientRect();
  const parent = navIndicator.parentElement.getBoundingClientRect();
  gsap.to(navIndicator, {
    x: rect.left - parent.left,
    width: rect.width,
    y: rect.top - parent.top,
    height: rect.height,
    duration: instant ? 0 : 0.45,
    ease: "power2.out",
    overwrite: "auto",
  });
}

let lastActive = null;
let navClickLock = false;

function getActiveSectionId() {
  const sections = document.querySelectorAll("section[id]");
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
  return closestId;
}

function setActiveSection(id, instant) {
  navLinks.forEach((l) => {
    l.classList.toggle("active", l.getAttribute("href") === "#" + id);
  });
  const active = document.querySelector(".nav-links a.active");
  if (active && active !== lastActive) {
    lastActive = active;
    moveIndicator(active, instant);
  } else if (!active) {
    lastActive = null;
    gsap.to(navIndicator, {
      x: 0,
      width: 0,
      duration: instant ? 0 : 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
  updateRail(id);
}

/* ─── SECTION RAIL ─── */
const railCursor = document.querySelector('.rail-cursor');
const railLabels = document.querySelectorAll('.rail-labels span');

const sectionIds = ['hero', 'about', 'capabilities', 'tools', 'projects', 'team', 'contact'];

function updateRail(id) {
  const idx = sectionIds.indexOf(id);
  if (idx < 0 || !railCursor) return;

  const track = railCursor.closest('.rail-track');
  if (!track) return;

  const sectionCount = sectionIds.length;
  const trackHeight = track.offsetHeight || 216;
  const step = trackHeight / (sectionCount - 1);
  railCursor.style.top = idx * step + 'px';

  railLabels.forEach((span) => {
    span.classList.toggle('active', span.dataset.section === id);
  });
}

/* ─── ACTIVE SECTION TRACKING (scrollend + debounced fallback) ─── */
// With scroll-snap, the scroll always lands on a settled section.
// scrollend fires when scroll + snap fully settles.
// A longer debounce fallback handles browsers without scrollend support.
let scrollTimer;

function syncActiveSection() {
  if (!navClickLock) {
    const id = getActiveSectionId();
    if (id) setActiveSection(id);
  }
}

window.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(syncActiveSection, 250);
}, { passive: true });

if ("onscrollend" in window) {
  window.addEventListener("scrollend", () => {
    clearTimeout(scrollTimer);
    syncActiveSection();
  }, { passive: true });
}

/* ─── INITIAL SYNC ─── */
// Once loader hides, and again after first paint, sync to the active section
window.addEventListener("load", () => requestAnimationFrame(syncActiveSection));

/* ─── RAIL LABEL CLICK ─── */
railLabels.forEach((span) => {
  span.addEventListener("click", () => {
    const id = span.dataset.section;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
  });
});

/* ─── RE-SYNC ON RESIZE ─── */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!navClickLock) {
      const id = getActiveSectionId();
      if (id) setActiveSection(id, true);
    }
  }, 200);
}, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    const target = href?.startsWith("#") ? document.querySelector(href) : null;
    if (!target) return;
    e.preventDefault();

    // Lock observer during smooth-scroll to prevent mid-flight hijack
    navClickLock = true;
    moveIndicator(link);

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
        // Scroll complete — unlock and sync to final section
        navClickLock = false;
        const id = getActiveSectionId();
        if (id) setActiveSection(id);
      }
    });

    navLinksContainer.classList.remove("open");
    navToggle.classList.remove("active");
  });
});

navToggle.addEventListener("click", () => {
  navLinksContainer.classList.toggle("open");
  navToggle.classList.toggle("active");
});

/* ─── TEAM FILTERS ─── */
const filterBtns = document.querySelectorAll(".team-filter");
const teamCards = document.querySelectorAll(".team-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    teamCards.forEach((card) => {
      if (filter === "all" || (card.dataset.category || "").split(" ").includes(filter)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
    // Re-evaluate scroll hint — filter might remove overflow
    requestAnimationFrame(updateTeamHint);
  });
});

/* ─── TEAM SCROLL HINT ─── */
const teamGrid = document.querySelector(".team-grid");
const teamHint = document.getElementById("teamScrollHint");

function updateTeamHint() {
  if (!teamGrid || !teamHint) return;
  const atEnd = teamGrid.scrollLeft + teamGrid.clientWidth >= teamGrid.scrollWidth - 8;
  teamHint.classList.toggle("hidden", atEnd);
}

if (teamGrid) {
  teamGrid.addEventListener("scroll", updateTeamHint, { passive: true });
  updateTeamHint();
}

/* ─── THEME SPLASH (View Transition API) ─── */
const themeToggle = document.getElementById("themeToggle");
let themeToggleInProgress = false;

themeToggle.addEventListener("click", (e) => {
  if (themeToggleInProgress) return;
  themeToggleInProgress = true;

  const rect = themeToggle.getBoundingClientRect();
  const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
  const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  const t = document.documentElement;
  t.style.setProperty("--splash-x", `${x}%`);
  t.style.setProperty("--splash-y", `${y}%`);

  const apply = () => {
    t.setAttribute("data-theme", next);
    themeToggleInProgress = false;
  };

  if (document.startViewTransition) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
});

/* ─── LOADER (tracks real load progress) ─── */
const loader = document.getElementById("loader");
const pctEl = document.getElementById("loaderPct");
const loaderColored = document.getElementById("loaderColored");
const page = document.getElementById("page");

document.body.style.overflow = "hidden";

let currentProgress = 0;
let targetProgress = 0;

function setLoadTarget(p) {
  if (p > targetProgress) targetProgress = p;
}

function finishLoader() {
  currentProgress = 1;
  pctEl.textContent = "100%";
  loaderColored.style.clipPath = "inset(0% 0 0 0)";
  page.classList.add("page-visible");
  loader.classList.add("loader-hidden");
  document.body.style.overflow = "";
  // Sync nav after loader completes
  requestAnimationFrame(() => {
    const id = getActiveSectionId();
    if (id) setActiveSection(id, true);
  });
}

function tick() {
  const diff = targetProgress - currentProgress;
  if (diff > 0.001) {
    currentProgress += diff * Math.min(0.06 + diff * 0.3, 1);
    if (currentProgress > targetProgress) currentProgress = targetProgress;
  }
  pctEl.textContent = Math.round(currentProgress * 100) + "%";
  loaderColored.style.clipPath = `inset(${(1 - currentProgress) * 100}% 0 0 0)`;
  if (currentProgress >= 0.999) {
    finishLoader();
  }
  requestAnimationFrame(tick);
}

/* ─── HERO SPLINE 3D LOGO ─── */
const heroSplineCanvas = document.getElementById("heroSplineCanvas");
if (heroSplineCanvas) {
  const heroSpline = new Application(heroSplineCanvas);
  heroSpline.load("/3D_LOGO.splinecode").catch(() => {
    heroSplineCanvas.style.display = "none";
  });
}

/* ─── SPLINE CONTACT SCENE ─── */
const splineCanvas = document.getElementById("splineCanvas");
if (splineCanvas) {
  const spline = new Application(splineCanvas);
  spline
    .load("/contact_us.splinecode")
    .then(() => {
      splineCanvas.style.opacity = "1";
      spline.setZoom(0.7);
      milestones.spline = true;
      setLoadTarget(0.75);
      checkComplete();
    })
    .catch((err) => {
      console.warn("Spline scene failed to load:", err);
      splineCanvas.style.display = "none";
      milestones.spline = true;
      checkComplete();
    });

  let splineInView = false;
  const contactSection = document.getElementById("contact");
  if (contactSection && IntersectionObserver) {
    new IntersectionObserver(([e]) => {
      splineInView = e.isIntersecting;
    }, { threshold: 0 }).observe(contactSection);
  }

  document.addEventListener("pointermove", (e) => {
    if (!splineInView) return;
    splineCanvas.dispatchEvent(new PointerEvent("pointermove", {
      clientX: e.clientX, clientY: e.clientY
    }));
  });

} else {
  milestones.spline = true;
  checkComplete();
}

window.setLoadTarget = setLoadTarget;

let milestones = { dom: false, fonts: false, win: false, three: false, spline: false };
function checkComplete() {
  if (milestones.dom && milestones.fonts && milestones.win && milestones.three && milestones.spline) setLoadTarget(1);
}

window.onThreeReady = function () {
  milestones.three = true;
  setLoadTarget(0.52);
  checkComplete();
};

document.addEventListener("DOMContentLoaded", () => {
  milestones.dom = true;
  setLoadTarget(0.12);
  checkComplete();
});
document.fonts.ready.then(() => {
  milestones.fonts = true;
  setLoadTarget(0.24);
  checkComplete();
});
window.addEventListener("load", () => {
  milestones.win = true;
  setLoadTarget(0.36);
  checkComplete();
});

requestAnimationFrame(tick);
