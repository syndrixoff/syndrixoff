import { getActiveSectionId, setActiveSection } from './nav.js';

const loader = document.getElementById("loader");
const pctEl = document.getElementById("loaderPct");
const page = document.getElementById("page");

let currentProgress = 0;
let targetProgress = 0;
let tickStarted = false;

export function initLoader() {
  const milestones = { dom: false, fonts: false, win: false };

  window.setLoadTarget = setLoadTarget;

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
    if (!milestones.dom || !milestones.fonts) setLoadTarget(0.36);
    checkComplete();
  });

  function checkComplete() {
    if (milestones.dom) setLoadTarget(1);
  }
}

function setLoadTarget(p) {
  if (p > targetProgress) targetProgress = p;
  startTick();
}

function startTick() {
  if (tickStarted) return;
  tickStarted = true;
  requestAnimationFrame(tick);
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
    const nav = document.getElementById("nav");
    nav?.classList.add("animate-nav");
    document.querySelector(".hero-scroll-hint")?.classList.add("animate-scroll-hint");
    setTimeout(() => {
      document.querySelector(".hero-static-text")?.classList.add("animate-hero-text");
      setTimeout(() => document.body.classList.add("hero-intro-complete"), 900);
    }, 80);
  });
}
