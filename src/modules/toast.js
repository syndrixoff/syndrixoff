export function initToast() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  if (!form || !toast) return;

  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    toast.classList.add('show');
    form.reset();
    setTimeout(() => toast.classList.remove('show'), 3600);
  });

  const nodeRing = document.querySelector('.node-ring');
  if (nodeRing) {
    const startOrbit = () => { nodeRing.classList.add('orbiting'); };
    nodeRing.addEventListener('mouseenter', startOrbit, { once: true });
    nodeRing.addEventListener('touchstart', startOrbit, { once: true, passive: true });
  }
}
