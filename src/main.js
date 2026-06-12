import "./style.css";
import { initNav } from './modules/nav.js';
import { initLoader } from './modules/loader.js';
import { initCanvas } from './modules/canvas.js';
import { initCursor } from './modules/cursor.js';
import { initTerminal } from './modules/terminal.js';
import { initTypewriter } from './modules/typewriter.js';
import { initTeam } from './modules/team.js';
import { initTheme } from './modules/theme.js';
import { initModal } from './modules/modal.js';
import { initReveal } from './modules/reveal.js';
import { initToast } from './modules/toast.js';
import { initCounters } from './modules/counters.js';

initNav();
initLoader();
initReveal();
initCounters();
initTeam();
initTheme();
initModal();
initCursor();

document.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  initToast();
  setTimeout(initTerminal, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
});
