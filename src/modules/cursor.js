export function initCursor() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;
  let cx = -9999, cy = -9999;
  let currentX = -9999, currentY = -9999;

  window.addEventListener('mousemove', (e) => {
    if (currentX === -9999) {
      currentX = e.clientX;
      currentY = e.clientY;
    }
    cx = e.clientX;
    cy = e.clientY;
    cursorGlow.style.opacity = '1';
  });

  window.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  function animateCursor() {
    if (currentX !== -9999) {
      currentX += (cx - currentX) * 0.25;
      currentY += (cy - currentY) * 0.25;
      cursorGlow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}
