export function initMagnetic() {
  const RADIUS = 80;
  const STRENGTH = 0.28;

  const targets = document.querySelectorAll('.btn, .nav-cta, .project-card .card-arrow');

  targets.forEach((el) => {
    let animId = null;
    let ox = 0, oy = 0;
    let tx = 0, ty = 0;
    let cachedRect = null;
    let needsRectUpdate = true;

    function refreshRect() {
      cachedRect = el.getBoundingClientRect();
      needsRectUpdate = false;
    }

    function onMove(e) {
      if (needsRectUpdate) refreshRect();
      const cx = cachedRect.left + cachedRect.width / 2;
      const cy = cachedRect.top + cachedRect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        tx = dx * STRENGTH * (1 - dist / RADIUS);
        ty = dy * STRENGTH * (1 - dist / RADIUS);
      } else {
        tx = 0; ty = 0;
      }
    }

    function onLeave() { tx = 0; ty = 0; }

    function animate() {
      ox = lerp(ox, tx, 0.14);
      oy = lerp(oy, ty, 0.14);
      el.style.transform = `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`;
      animId = requestAnimationFrame(animate);
    }

    el.addEventListener('mouseenter', () => {
      refreshRect();
      if (!animId) animId = requestAnimationFrame(animate);
    });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', () => {
      onLeave();
      setTimeout(() => {
        if (Math.abs(ox) < 0.1 && Math.abs(oy) < 0.1) {
          cancelAnimationFrame(animId);
          animId = null;
          el.style.transform = '';
        }
      }, 600);
    });
  });

  window.addEventListener('scroll', () => { needsRectUpdate = true; }, { passive: true });
  window.addEventListener('resize', () => { needsRectUpdate = true; }, { passive: true });
}

function lerp(a, b, t) { return a + (b - a) * t; }
