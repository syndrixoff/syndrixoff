class SyndraCanvas extends HTMLElement {
  connectedCallback() {
    const canvas = document.createElement('canvas');
    canvas.className = 'ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    this.appendChild(canvas);
    this.initCanvas(canvas);
  }
  initCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, particles = [];
    let maxParticles = 120;
    let isLight = document.documentElement.dataset.theme === 'light';
    new MutationObserver(() => { isLight = document.documentElement.dataset.theme === 'light'; }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mouse = { x: -9999, y: -9999 };
    const packets = [];
    const MAX_PACKETS = 6;
    let packetSpawnTimer = 0;
    let frameId = null;
    let started = false;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function spawn() {
      const count = W < 720 ? 60 : maxParticles;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.24, vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.6 + 0.5, copper: Math.random() > 0.55,
        phase: Math.random() * Math.PI * 2
      }));
      packets.length = 0;
    }

    function spawnPacket() {
      if (packets.length >= MAX_PACKETS) return;
      const candidates = [];
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400 && distSq > 400) candidates.push([i, j]);
        }
      }
      if (!candidates.length) return;
      const [ai, bi] = candidates[Math.floor(Math.random() * Math.min(candidates.length, 30))];
      const a = particles[ai], b = particles[bi];
      packets.push({ ax: a, bx: b, t: 0, speed: 0.006 + Math.random() * 0.006, copper: a.copper || b.copper });
    }

    function draw(now) {
      if (prefersReducedMotion) return;
      if (!started) { started = true; frameId = requestAnimationFrame(draw); return; }
      packetSpawnTimer += 1;
      if (packetSpawnTimer > 90) { packetSpawnTimer = 0; spawnPacket(); }
      ctx.clearRect(0, 0, W, H);
      const t = now / 1000;
      const lm = isLight ? 2.2 : 1;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 25600) { p.vx -= dx * 0.00004; p.vy -= dy * 0.00004; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.994; p.vy *= 0.994;
        if (p.x < -10 || p.x > W + 10) p.vx *= -0.8;
        if (p.y < -10 || p.y > H + 10) p.vy *= -0.8;
        const glow = 0.5 + Math.sin(t * 0.8 + p.phase) * 0.25;
        const alpha = Math.min((0.5 + glow * 0.35) * lm, 0.95);
        if (p.copper) {
          ctx.beginPath(); ctx.fillStyle = `rgba(160,100,40,${alpha})`; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = `rgba(160,100,40,${Math.min(0.06 * glow * lm, 0.18)})`; ctx.fill();
        } else {
          ctx.beginPath(); ctx.fillStyle = `rgba(40,160,150,${alpha})`; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 12100) {
            const dist = Math.sqrt(distSq);
            const fade = 1 - dist / 110;
            let r, g, b;
            if (isLight) {
              if (p.copper && q.copper) { r=140; g=85; b=30; }
              else if (!p.copper && !q.copper) { r=30; g=140; b=130; }
              else { r=120; g=100; b=80; }
            } else {
              if (p.copper && q.copper) { r=196; g=134; b=63; }
              else if (!p.copper && !q.copper) { r=94; g=197; b=189; }
              else { r=232; g=223; b=206; }
            }
            ctx.beginPath(); ctx.strokeStyle = `rgba(${r},${g},${b},${fade * 0.14 * lm})`; ctx.lineWidth = 0.6; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      for (let k = packets.length - 1; k >= 0; k--) {
        const pk = packets[k];
        pk.t += pk.speed;
        if (pk.t >= 1) { packets.splice(k, 1); continue; }
        const px = pk.ax.x + (pk.bx.x - pk.ax.x) * pk.t;
        const py = pk.ax.y + (pk.bx.y - pk.ax.y) * pk.t;
        const fadeT = Math.min(pk.t / 0.15, 1) * Math.min((1 - pk.t) / 0.15, 1);
        const col = isLight ? (pk.copper ? '140,85,30' : '30,140,130') : (pk.copper ? '196,134,63' : '94,197,189');
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fillStyle = `rgba(${col},${Math.min(0.12 * fadeT * lm, 0.35)})`; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(${col},${Math.min(0.9 * fadeT * lm, 0.95)})`; ctx.fill();
      }
      frameId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    resize();
    frameId = requestAnimationFrame(draw);
  }
}
customElements.define('syndra-canvas', SyndraCanvas);
