import "./style.css";
import gsap from "gsap";

/* ─── DISABLE RIGHT CLICK ─── */
document.addEventListener("contextmenu", e => e.preventDefault());

/* ─── CUSTOM CURSOR ─── */
const cursor = document.getElementById("customCursor");
if (cursor && !("ontouchstart" in window)) {
  let cx = 0, cy = 0;
  document.addEventListener("mousemove", e => { cx = e.clientX; cy = e.clientY; });
  function tickCursor() {
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
    requestAnimationFrame(tickCursor);
  }
  requestAnimationFrame(tickCursor);
  document.addEventListener("mouseenter", () => cursor.classList.add("visible"));
  document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));
  document.querySelectorAll("a, button, .glass-card, .project-card, .team-card, .team-filter, .team-scroll-dots .tdot, .btn").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("expanded"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("expanded"));
  });
}

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

let lastActive = null;
let navClickLock = false;
let cachedSections = null;

/* ─── GSAP NAV BG GLOW PULSE ─── */
const navBgGlow = document.getElementById("navBgGlow");
if (navBgGlow) {
  gsap.to(navBgGlow, {
    opacity: 0.7,
    y: -1,
    duration: 2.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

/* ─── GSAP NAV GLOW PULSE ─── */
const navEl = document.getElementById("nav");
if (navEl) {
  gsap.to(navEl, {
    "--nav-glow-opacity": 1,
    duration: 2.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

function getActiveSectionId() {
  if (!cachedSections) cachedSections = document.querySelectorAll("section[id]");
  const sections = cachedSections;
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

function moveIndicator(el, instant) {
  if (!el || !navIndicator) return;
  const dur = instant ? 0 : 0.45;
  gsap.to(navIndicator, {
    x: el.offsetLeft,
    width: el.offsetWidth,
    duration: dur,
    ease: "power2.out",
    overwrite: "auto",
  });
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
  scrollTimer = setTimeout(syncActiveSection, 32);
}, { passive: true });

if ("onscrollend" in window) {
  window.addEventListener("scrollend", () => {
    clearTimeout(scrollTimer);
    syncActiveSection();
  }, { passive: true });
}

/* ─── INITIAL SYNC ─── */
window.addEventListener("load", () => requestAnimationFrame(syncActiveSection));

/* ─── MARQUEE PAUSE ─── */
document.querySelectorAll(".marquee-row").forEach(row => {
  row.addEventListener("mouseenter", () => row.classList.add("paused"));
  row.addEventListener("mouseleave", () => row.classList.remove("paused"));
});

/* ─── INITIALS AVATARS ─── */
document.querySelectorAll(".team-card").forEach(card => {
  const img = card.querySelector(".team-card-visual img");
  const placeholder = card.querySelector(".team-card-placeholder");
  if (placeholder && !img) {
    const nameEl = card.querySelector(".team-card-overlay h3");
    if (nameEl) {
      const name = nameEl.textContent.trim();
      const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
      placeholder.innerHTML = `<span style="font-family:var(--font);font-size:2rem;font-weight:700;color:var(--accent);opacity:0.9">${initials}</span>`;
      placeholder.style.background = "var(--bg-card-solid)";
    }
  }
  if (img) {
    img.addEventListener("error", () => {
      img.style.display = "none";
      const nameEl = card.querySelector(".team-card-overlay h3");
      const parent = img.parentElement;
      if (nameEl && parent) {
        const name = nameEl.textContent.trim();
        const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
        const div = document.createElement("div");
        div.className = "team-card-placeholder";
        div.innerHTML = `<span style="font-family:var(--font);font-size:2rem;font-weight:700;color:var(--accent);opacity:0.9">${initials}</span>`;
        parent.appendChild(div);
      }
    });
  }
});

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
const teamGrid = document.getElementById("teamGrid");
const teamDots = document.getElementById("teamScrollDots");

function rebuildTeamDots() {
  const containerW = teamGrid.clientWidth;
  if (!containerW) { teamDots.innerHTML = ""; return; }
  const pages = Math.max(1, Math.ceil(teamGrid.scrollWidth / containerW));

  teamDots.innerHTML = "";
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement("button");
    dot.className = "tdot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Page " + (i + 1));
    dot.addEventListener("click", () => {
      const maxScroll = teamGrid.scrollWidth - teamGrid.clientWidth;
      teamGrid.scrollTo({ left: (i / (pages - 1)) * maxScroll, behavior: "smooth" });
    });
    teamDots.appendChild(dot);
  }
}

function syncTeamDots() {
  const dots = teamDots.querySelectorAll(".tdot");
  if (!dots.length) return;
  const scrollL = teamGrid.scrollLeft;
  const maxScroll = teamGrid.scrollWidth - teamGrid.clientWidth;
  const pct = maxScroll > 0 ? scrollL / maxScroll : 0;
  const active = Math.min(dots.length - 1, Math.round(pct * (dots.length - 1)));
  dots.forEach((d, i) => d.classList.toggle("active", i === active));
}

teamGrid?.addEventListener("scroll", syncTeamDots, { passive: true });

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
    rebuildTeamDots();
    syncTeamDots();
  });
});

rebuildTeamDots();
syncTeamDots();

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

let currentProgress = 0;
let targetProgress = 0;

function setLoadTarget(p) {
  if (p > targetProgress) targetProgress = p;
  startTick();
}

function finishLoader() {
  currentProgress = 1;
  pctEl.textContent = "100%";
  loaderColored.style.clipPath = "inset(0% 0 0 0)";
  page.classList.add("page-visible");
  loader.classList.add("loader-hidden");
  // Sync nav after loader completes
  requestAnimationFrame(() => {
    const id = getActiveSectionId();
    if (id) setActiveSection(id, true);
  });
  // Choreographed entry animations
  requestAnimationFrame(() => {
    nav?.classList.add("animate-nav");
    document.querySelector(".section-rail")?.classList.add("animate-rail");
    document.querySelector(".hero-scroll-hint")?.classList.add("animate-scroll-hint");
    setTimeout(() => {
      document.querySelector(".hero-static-text")?.classList.add("animate-hero-text");
      // Flag intro as complete after the last animation finishes
      setTimeout(() => document.body.classList.add("hero-intro-complete"), 900);
    }, 80);
  });
}

function tick() {
  const diff = targetProgress - currentProgress;
  if (diff > 0.001) {
    currentProgress += diff * Math.min(0.18 + diff * 0.5, 1);
    if (currentProgress > targetProgress) currentProgress = targetProgress;
  }
  pctEl.textContent = Math.round(currentProgress * 100) + "%";
  loaderColored.style.clipPath = `inset(${(1 - currentProgress) * 100}% 0 0 0)`;
  if (currentProgress >= 0.999) {
    finishLoader();
    return;
  }
  requestAnimationFrame(tick);
}

/* ─── SCROLL REVEAL ─── */

window.setLoadTarget = setLoadTarget;

let milestones = { dom: false, fonts: false, win: false };
function checkComplete() {
  if (milestones.dom && milestones.fonts && milestones.win) setLoadTarget(1);
}

document.addEventListener("DOMContentLoaded", () => {
  milestones.dom = true;
  setLoadTarget(0.12);
  checkComplete();
  setTimeout(initTerminal, 1000);
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

let tickStarted = false;
function startTick() {
  if (tickStarted) return;
  tickStarted = true;
  requestAnimationFrame(tick);
}

/* ─── PROJECT MODAL ─── */
const projectData = {
  atlas: {
    tag: "Autonomous Systems",
    title: "Project ATLAS",
    overview: "Autonomous drone platforms operating in GPS-denied environments face a fundamental challenge: how to combine real-time flight control with on-board AI reasoning under strict compute constraints. This project developed a simulated hierarchical drone swarm — one mother, two children — controlled entirely over MAVLink without ROS, integrating visual odometry for position estimation and an on-board large language model for mission-level decision-making. The architecture separates low-level flight control (PX4 at 250 Hz) from vision-based perception (YOLO object detection at 30 FPS) and LLM-based mission reasoning, mirroring production autonomous systems. The mother drone coordinates child agents via a custom MAVLink protocol, with leader election for fault tolerance. The entire pipeline was validated in NVIDIA Isaac Sim with hardware-in-the-loop PX4 SITL, demonstrating end-to-end autonomous mission execution from camera input to flight action.",
    architecture: [
      "The system addresses the control-to-cognition gap inherent in autonomous drones: flight controllers operate at millisecond timescales, while AI reasoning requires seconds. Rather than forcing an LLM into the real-time loop, the architecture implements three decoupled layers. A PX4 flight controller handles attitude stabilization and waypoint navigation at 250 Hz. A vision layer runs YOLOv26 at 30 FPS on a simulated downward-facing camera, writing structured detection data to shared memory. An LLM reasoner (Qwen3.5 4B, quantized, running locally via llama.cpp) operates at the mission level, reading telemetry and detections to issue high-level commands via tool-calling function interfaces.",
      "The mother-child swarm protocol uses distributed MAVLink routing: the mother maintains state for two child drones, broadcasts heartbeat messages, and executes leader election if the mother is lost. The simulation environment (Isaac Sim + Pegasus + PX4 SITL) provides photorealistic rendering and physics-accurate flight dynamics, enabling realistic camera feeds and sensor noise. The entire stack runs on a single NVIDIA RTX 4060 laptop GPU, demonstrating that production-grade autonomous drone software can be developed and validated on consumer hardware. The system achieves 19.74 Hz vision-to-action latency on embedded-class compute (Jetson AGX Orin equivalent), aligning with published research on dual-rate VLA architectures for aerial systems."
    ],
    tech: ["NVIDIA Isaac Sim", "PX4 Autopilot SITL", "MAVSDK", "MAVLink", "YOLOv26", "Qwen3.5 4B (llama.cpp)", "Pegasus Simulator", "Python", "NVIDIA Jetson"]
  },
  aetherforge: {
    tag: "AI + EDA",
    title: "AetherForge",
    overview: "Hardware engineers face significant productivity bottlenecks when translating specifications into verified RTL. AetherForge eliminates this by providing an AI-native copilot that generates synthesizable HDL from natural language descriptions, compiles against industry-standard EDA toolchains, and automatically produces self-checking testbenches with functional pass/fail verification. The system ingests high-level design intent, produces SystemVerilog or VHDL, invokes Verilator or GHDL for compilation and simulation, and reports verification outcomes — all within a single streamlined interface. This dramatically reduces the design-verify iteration cycle from hours to seconds while maintaining strict equivalence between specification and implementation.",
    architecture: [
      "AetherForge is an AI-native hardware engineering copilot that generates RTL from natural language, compiles with Verilator/GHDL, produces self-checking testbenches, and runs functional verification — all within a single web interface. The backend orchestrates LLM inference, testbench generation, EDA compilation, and simulation result parsing; the frontend provides real-time streaming of generated code, build output, and pass/fail verdicts. Designed to integrate with local or NVIDIA NIM-hosted LLM backends, it operates entirely offline-capable and requires no cloud dependency. The tool targets professional RTL designers, FPGA engineers, and embedded systems architects seeking to accelerate the specification-to-verified-RTL pipeline."
    ],
    tech: ["Rust", "SystemVerilog", "VHDL", "Verilator", "GHDL", "TypeScript", "React"]
  }
};

let activeModal = null;

function closeModal() {
  if (!activeModal) return;
  const overlay = activeModal;
  document.removeEventListener("keydown", onKeyDown);
  overlay.classList.remove("open");
  overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
  activeModal = null;
}

function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;
  if (activeModal) closeModal();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div>
          <span class="modal-tag">${data.tag}</span>
          <h2>${data.title}</h2>
        </div>
        <button class="modal-close" aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <h4>Project Overview</h4>
        <p class="modal-text">${data.overview}</p>

        <div class="modal-section-divider"></div>

        <h4>Architecture</h4>
        ${data.architecture.map(p => `<p class="modal-text">${p}</p>`).join("")}

        <div class="modal-section-divider"></div>

        <h4>Key Specs</h4>
        <div class="modal-specs-grid">
          ${data.tech.map(t => `
            <div class="modal-spec-item">${t}</div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  const root = document.getElementById("modal-root");
  root.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.querySelector(".modal-close").addEventListener("click", closeModal);

  document.addEventListener("keydown", onKeyDown);

  activeModal = overlay;

  requestAnimationFrame(() => overlay.classList.add("open"));
}

function onKeyDown(e) {
  if (e.key === "Escape" && activeModal) closeModal();
}

/* ─── SCROLL-DRIVEN SECTION REVEALS ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const children = entry.target.querySelectorAll(".reveal");
      if (entry.isIntersecting) {
        children.forEach((child, i) => {
          child.style.setProperty("--stagger-delay", `${i * 60}ms`);
          child.classList.add("revealed");
        });
      } else {
        /* Directional hysteresis: only strip revealed if section
           exits through the bottom (user scrolling up past it).
           Exiting through top (scrolling down past it) preserves state. */
        const { top, bottom } = entry.boundingClientRect;
        if (top > entry.rootBounds.bottom) {
          children.forEach((child) => child.classList.remove("revealed"));
        }
      }
    });
  },
  { threshold: 0.1, rootMargin: "-10% 0px -20% 0px" }
);

document.querySelectorAll("section[id]:not(#hero)").forEach((section) => {
  section.querySelectorAll(".section-label, .section-title, .section-subtitle, .tool-domain, .tools-pipeline, .glass-card, .tele-card, .project-card, .team-card, .contact-card, .about-text > p").forEach((el) => {
    el.classList.add("reveal");
  });
  revealObserver.observe(section);
});

// Sync-reveal sections already in view (matches observer's rootMargin: -10% 0px -20% 0px)
document.querySelectorAll("section[id]:not(#hero)").forEach((section) => {
  const rect = section.getBoundingClientRect();
  const effectiveTop = window.innerHeight * 0.1;
  const effectiveBottom = window.innerHeight * 0.8;
  if (rect.top < effectiveBottom && rect.bottom > effectiveTop) {
    const children = section.querySelectorAll(".reveal");
    children.forEach((child, i) => {
      child.style.setProperty("--stagger-delay", `${i * 60}ms`);
      child.classList.add("revealed");
    });
  }
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
});

/* ─── TERMINAL TYPEWRITER ─── */
function initTerminal() {
  const out = document.getElementById('termOutput');
  if (!out) return;

  function runSequence(loop) {
    out.innerHTML = "";
    const sequence = [
      { type: 'cmd', text: 'connect --to=your-project', delay: 600 },
      { type: 'gap', delay: 400 },
      { type: 'out-cyan', text: 'Initiating handshake...', delay: 0 },
      { type: 'out', text: 'Connection ready. Reach out at syndrixoff@gmail.com', delay: 600 },
      { type: 'gap', delay: 300 },
      { type: 'cursor', delay: 0 },
    ];
    let i = 0;
    function next() {
      if (i >= sequence.length) {
        if (loop) setTimeout(() => runSequence(true), 4000);
        return;
      }
      const s = sequence[i++];
      setTimeout(() => {
        if (s.type === 'gap') {
          const br = document.createElement('div');
          br.style.height = '6px';
          out.appendChild(br);
        } else if (s.type === 'cursor') {
          const div = document.createElement('div');
          div.className = 'line fade-in';
          div.innerHTML = `<span class="prompt">›</span><span class="blink"></span>`;
          out.appendChild(div);
        } else {
          const div = document.createElement('div');
          div.className = 'line fade-in';
          if (s.type === 'cmd') {
            div.innerHTML = `<span class="prompt">›</span><span class="cmd">${s.text}</span>`;
          } else {
            div.innerHTML = `<span class="${s.type}">${s.text}</span>`;
          }
        }
        out.scrollTop = out.scrollHeight;
        next();
      }, s.delay);
    }
    setTimeout(next, 500);
  }
  runSequence(true);
}
