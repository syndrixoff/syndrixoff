import "./style.css";

import "./components/syndra-nav.js";
import "./components/syndra-hero.js";
import "./components/syndra-canvas.js";

const lazyComponents = [
  'syndra-about',
  'syndra-services',
  'syndra-process',
  'syndra-workbench',
  'syndra-team',
  'syndra-operations',
  'syndra-contact',
  'syndra-footer',
];

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      import(`./components/${entry.target.tagName.toLowerCase()}.js`);
    }
  });
}, { rootMargin: '400px' });

addEventListener('DOMContentLoaded', () => {
  for (const tag of lazyComponents) {
    const el = document.querySelector(tag);
    if (el) observer.observe(el);
  }
});
