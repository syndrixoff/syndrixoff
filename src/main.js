import "./style.css";

// ===== SYNDRA LOGIC =====
document.addEventListener("DOMContentLoaded", () => {
// SYNDRA LOGIC

    const canvas = document.getElementById('ambientCanvas');
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

    // Scroll reveals
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal:not(.is-visible), .reveal-l:not(.is-visible), .reveal-r:not(.is-visible), .reveal-scale:not(.is-visible)')
      .forEach((el) => obs.observe(el));

    // Nav background on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 60 ? 'rgba(12, 11, 9, 0.82)' : 'rgba(12, 11, 9, 0.64)';
    }, { passive: true });

    // Form toast
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      toast.classList.add('show');
      form.reset();
      setTimeout(() => toast.classList.remove('show'), 3600);
    });

    // Orbit activation on hover or touch (persists in motion once started)
    const nodeRing = document.querySelector('.node-ring');
    if (nodeRing) {
      const startOrbit = () => {
        nodeRing.classList.add('orbiting');
      };
      nodeRing.addEventListener('mouseenter', startOrbit, { once: true });
      nodeRing.addEventListener('touchstart', startOrbit, { once: true, passive: true });
    }

    // Typewriter and Backspace Effect
    class Typewriter {
      constructor(el, delayBackspace = 30, delayType = 65, delayPause = 250) {
        this.el = el;
        this.delayBackspace = delayBackspace;
        this.delayType = delayType;
        this.delayPause = delayPause;
        this.timer = null;
        this.currentTarget = el.innerText;
        this.el.classList.add('typing'); // keep blinking cursor active
      }
      async transitionTo(targetText, originalText) {
        if (this.currentTarget === targetText) return;
        this.currentTarget = targetText;
        this.stop();
        await this.erase();
        await this.pause(this.delayPause);
        
        // Dynamically shift color before typing
        if (targetText === 'SYNDRIX') {
          this.el.classList.add('state-syndrix');
        } else {
          this.el.classList.remove('state-syndrix');
        }
        
        await this.type(targetText);
      }
      stop() {
        clearTimeout(this.timer);
      }
      erase() {
        return new Promise((resolve) => {
          const step = () => {
            const current = this.el.innerText;
            if (current.length > 0) {
              this.el.innerText = current.slice(0, -1);
              this.timer = setTimeout(step, this.delayBackspace);
            } else {
              resolve();
            }
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
            } else {
              resolve();
            }
          };
          step();
        });
      }
      pause(ms) {
        return new Promise((resolve) => {
          this.timer = setTimeout(resolve, ms);
        });
      }
    }

    const scrambleTarget = document.querySelector('.scramble-target');
    if (scrambleTarget) {
      const originalText = scrambleTarget.innerText;
      const targetText = scrambleTarget.getAttribute('data-value');
      const typewriter = new Typewriter(scrambleTarget);
      
      const startLoop = async () => {
        // Wait 3.5 seconds initial delay on page load before starting
        await typewriter.pause(3500);
        while (true) {
          // Transition to SYNDRIX
          await typewriter.transitionTo(targetText, originalText);
          // Wait at SYNDRIX state for 3 seconds
          await typewriter.pause(3000);
          // Transition to Intelligence
          await typewriter.transitionTo(originalText, originalText);
          // Wait at Intelligence state for 3.5 seconds
          await typewriter.pause(3500);
        }
      };
      startLoop();
    }

    // Liquid Glass Navigation sliding pill & mouse shine
    const navElement = document.getElementById('navbar');
    const navLinks = document.querySelector('.nav-links');
    const indicator = document.querySelector('.nav-indicator');
    const links = document.querySelectorAll('.nav-links a');
    let activeLink = null;
    let isInitial = true;

    // Mouse glow follower coordinates
    if (navElement) {
      navElement.addEventListener('mousemove', (e) => {
        const rect = navElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        navElement.style.setProperty('--mouse-x', `${x}px`);
        navElement.style.setProperty('--mouse-y', `${y}px`);
      });
    }

    function updateIndicator(link) {
      if (!link || !indicator) {
        if (indicator) {
          indicator.style.opacity = '0';
          indicator.style.transform = 'scale(0.9)';
        }
        return;
      }

      const parentWidth = navLinks.offsetWidth;
      const targetLeft = link.offsetLeft;
      const targetRight = parentWidth - (targetLeft + link.offsetWidth);

      if (isInitial || indicator.style.opacity === '0') {
        // Instant update without delay/stretch when first showing up
        indicator.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        indicator.style.left = `${targetLeft}px`;
        indicator.style.right = `${targetRight}px`;
        indicator.style.opacity = '1';
        indicator.style.transform = 'scale(1)';
        isInitial = false;
        // force reflow
        indicator.offsetHeight;
        return;
      }

      // Read current left position to detect direction
      const currentLeft = parseFloat(indicator.style.left) || 0;
      const movingRight = targetLeft > currentLeft;

      // Asymmetric spring-like delays to create the liquid stretching effect
      if (movingRight) {
        // Moving right: right edge stretches first, left edge follows
        indicator.style.transition = `
          left 0.38s cubic-bezier(0.25, 1, 0.5, 1) 0.05s,
          right 0.32s cubic-bezier(0.25, 1, 0.5, 1),
          opacity 0.25s ease,
          transform 0.25s ease
        `;
      } else {
        // Moving left: left edge stretches first, right edge follows
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

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        updateIndicator(link);
      });
      link.addEventListener('click', () => {
        activeLink = link;
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        updateIndicator(link);
      });
    });

    if (navLinks) {
      navLinks.addEventListener('mouseleave', () => {
        updateIndicator(activeLink);
      });
    }

    // Set active link based on current section viewport
    const sections = document.querySelectorAll('section[id]');
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('id');
          const href = `#${id}`;
          const matched = Array.from(links).find(l => l.getAttribute('href') === href);
          
          links.forEach(l => l.classList.remove('active'));
          if (matched) {
            matched.classList.add('active');
            activeLink = matched;
            updateIndicator(matched);
          } else {
            activeLink = null;
            updateIndicator(null);
          }
        }
      });
    }, { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' });

    sections.forEach(s => navObs.observe(s));

    // Handle window resize to keep position in sync
    window.addEventListener('resize', () => {
      if (activeLink && indicator) {
        indicator.style.transition = 'none';
        const parentWidth = navLinks.offsetWidth;
        const targetLeft = activeLink.offsetLeft;
        const targetRight = parentWidth - (targetLeft + activeLink.offsetWidth);
        indicator.style.left = `${targetLeft}px`;
        indicator.style.right = `${targetRight}px`;
      }
    });
});

// ===== SYNDRIX LOGIC =====

/* ─── SCROLL PROGRESS BAR ─── */
const progressBar = document.getElementById("scrollProgress");



/* ─── NAV SCROLL STATE ─── */
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
  railCursor.style.transform = `translateY(${idx * step}px)`;

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
