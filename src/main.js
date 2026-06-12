import "./style.css";

// ===== SYNDRIX LOGIC =====

/* ─── NAV TOGGLE ─── */
const navLinks = document.querySelectorAll('.nav-links a');
const navToggle = document.querySelector(".nav-toggle");
const navLinksContainer = document.querySelector(".nav-links");

/* ─── SLIDING NAV INDICATOR (Liquid Glass) ─── */
const indicator = document.querySelector('.nav-indicator');
let activeLink = null;
let isInitial = true;
let navClickLock = false;
let cachedSections = null;

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

function updateIndicator(link) {
  if (!indicator) return;

  if (!link) {
    indicator.style.transform = 'translateX(0px)';
    indicator.style.width = '0px';
    return;
  }

  indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  indicator.style.width = `${link.offsetWidth}px`;
}

function setActiveSection(id, instant) {
  const next = document.querySelector(`.nav-links a[href="#${id}"]`);
  if (next) {
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
    activeLink = next;
    updateIndicator(next);
  } else {
    activeLink = null;
    updateIndicator(null);
  }
  updateRail(id);
}

// Nav link events
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => { updateIndicator(link); });
  link.addEventListener('click', (e) => {
    const href = link.getAttribute("href");
    const target = href?.startsWith("#") ? document.querySelector(href) : null;
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

    if (navLinksContainer) navLinksContainer.classList.remove("open");
    if (navToggle) navToggle.classList.remove("active");
  });
});

if (navLinksContainer) {
  navLinksContainer.addEventListener('mouseleave', () => { updateIndicator(activeLink); });
}

// Handle resize to keep indicator in sync
window.addEventListener('resize', () => {
  if (activeLink && indicator) {
    indicator.style.transition = 'none';
    indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
    indicator.style.width = `${activeLink.offsetWidth}px`;
  }
});

if (navToggle && navLinksContainer) {
  navToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("open");
    navToggle.classList.toggle("active");
  });
}

/* ─── SECTION RAIL ─── */
const railCursor = document.querySelector('.rail-cursor');
const railLabels = document.querySelectorAll('.rail-labels span');
const sectionIds = ['hero', 'about', 'services', 'process', 'workbench', 'team', 'contact'];

function updateRail(id) {
  const idx = sectionIds.indexOf(id);
  if (idx < 0 || !railCursor) return;
  const track = railCursor.closest('.rail-track');
  if (!track) return;
  const sectionCount = sectionIds.length;
  const trackHeight = track.offsetHeight || 216;
  const step = trackHeight / (sectionCount - 1);
  railCursor.style.transform = `translateY(${idx * step}px)`;
  railLabels.forEach((span) => {
    span.classList.toggle('active', span.dataset.section === id);
  });
}

/* ─── ACTIVE SECTION TRACKING ─── */
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

window.addEventListener("load", () => requestAnimationFrame(syncActiveSection));

/* ─── SCROLL PROGRESS BAR ─── */
const progressBar = document.getElementById("scrollProgress");
const nav = document.getElementById("nav");

function updateProgress() {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.transform = `scaleX(${pct / 100})`;
}

function onScroll() {
  updateProgress();
  nav?.classList.toggle("scrolled", window.scrollY > 60);
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
  page.classList.add("page-visible");
  loader.classList.add("loader-hidden");
  requestAnimationFrame(() => {
    const id = getActiveSectionId();
    if (id) setActiveSection(id, true);
  });
  requestAnimationFrame(() => {
    nav?.classList.add("animate-nav");
    document.querySelector(".section-rail")?.classList.add("animate-rail");
    document.querySelector(".hero-scroll-hint")?.classList.add("animate-scroll-hint");
    setTimeout(() => {
      document.querySelector(".hero-static-text")?.classList.add("animate-hero-text");
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
  if (currentProgress >= 0.999) {
    finishLoader();
    return;
  }
  requestAnimationFrame(tick);
}

window.setLoadTarget = setLoadTarget;

let milestones = { dom: false, fonts: false, win: false };
function checkComplete() {
  if (milestones.dom) setLoadTarget(1);
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
  if (!milestones.dom || !milestones.fonts) setLoadTarget(0.36);
  checkComplete();
});

let tickStarted = false;
function startTick() {
  if (tickStarted) return;
  tickStarted = true;
  requestAnimationFrame(tick);
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
  section.querySelectorAll(".section-label, .section-title, .section-subtitle, .tool-domain, .tools-pipeline, .glass-card, .tele-card, .project-card, .team-card, .contact-card, .team-filters, .team-scroll-dots, .about-text > p").forEach((el) => {
    if (!el.classList.contains("reveal")) el.classList.add("reveal");
  });
  revealObserver.observe(section);
});

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
          ${data.tech.map(t => `<div class="modal-spec-item">${t}</div>`).join("")}
        </div>
      </div>
    </div>
  `;
  const root = document.getElementById("modal-root");
  root.appendChild(overlay);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  document.addEventListener("keydown", onKeyDown);
  activeModal = overlay;
  requestAnimationFrame(() => overlay.classList.add("open"));
}

function onKeyDown(e) {
  if (e.key === "Escape" && activeModal) closeModal();
}

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
          div.innerHTML = `<span class="prompt">\u203a</span><span class="blink"></span>`;
          out.appendChild(div);
        } else {
          const div = document.createElement('div');
          div.className = 'line fade-in';
          if (s.type === 'cmd') {
            div.innerHTML = `<span class="prompt">\u203a</span><span class="cmd">${s.text}</span>`;
          } else {
            div.innerHTML = `<span class="${s.type}">${s.text}</span>`;
          }
          out.appendChild(div);
        }
        out.scrollTop = out.scrollHeight;
        next();
      }, s.delay);
    }
    setTimeout(next, 500);
  }
  runSequence(true);
}

// ===== SYNDRA ADDITIONS =====

document.addEventListener("DOMContentLoaded", () => {
  // Canvas particles
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, particles;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  function spawn() {
    const count = W < 720 ? 52 : 110;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: Math.random() * 1.6 + 0.5,
      copper: Math.random() > 0.55,
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const now = performance.now() / 1000;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 160) {
        p.vx -= dx * 0.00004;
        p.vy -= dy * 0.00004;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.994;
      p.vy *= 0.994;
      if (p.x < -10 || p.x > W + 10) p.vx *= -0.8;
      if (p.y < -10 || p.y > H + 10) p.vy *= -0.8;
      const glow = 0.5 + Math.sin(now * 0.8 + p.pulse) * 0.25;
      const base = p.copper ? 'rgba(196,134,63,' : 'rgba(94,197,189,';
      const alpha = (0.5 + glow * 0.35);
      ctx.beginPath();
      ctx.fillStyle = base + alpha + ')';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      if (p.copper) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(196,134,63,' + (0.04 * glow) + ')';
        ctx.fill();
      }
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const gap = Math.hypot(p.x - q.x, p.y - q.y);
        if (gap < 100) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(232,223,206,' + ((1 - gap / 100) * 0.08).toFixed(4) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  draw();

  // Form toast
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  if (form && toast) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      toast.classList.add('show');
      form.reset();
      setTimeout(() => toast.classList.remove('show'), 3600);
    });
  }

  // Orbit hover
  const nodeRing = document.querySelector('.node-ring');
  if (nodeRing) {
    const startOrbit = () => { nodeRing.classList.add('orbiting'); };
    nodeRing.addEventListener('mouseenter', startOrbit, { once: true });
    nodeRing.addEventListener('touchstart', startOrbit, { once: true, passive: true });
  }
});

// Typewriter (runs on DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
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

  const scrambleTarget = document.querySelector('.scramble-target');
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
});

/* ─── CURSOR GLOW ─── */
const cursorGlow = document.getElementById('cursorGlow');
let cx = -9999, cy = -9999;
let currentX = -9999, currentY = -9999;

window.addEventListener('mousemove', (e) => {
  cx = e.clientX;
  cy = e.clientY;
  cursorGlow.style.opacity = '1';
});

window.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});

function animateCursor() {
  currentX += (cx - currentX) * 0.12;
  currentY += (cy - currentY) * 0.12;
  cursorGlow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();
