export function initCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, particles;
  let maxParticles = 110;
  let currentMax = 110;
  const mouse = { x: -9999, y: -9999 };
  const packets = [];
  const MAX_PACKETS = 6;
  let packetSpawnTimer = 0;

  const perf = {
    frameTimes: [],
    sampleCount: 0,
    lowPerfCount: 0,
    highPerfCount: 0,
    degraded: false,
    lastFrame: performance.now()
  };

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
    const base = W < 720 ? 52 : maxParticles;
    currentMax = W < 720 ? Math.min(52, base) : base;
    particles = Array.from({ length: currentMax }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: Math.random() * 1.6 + 0.5,
      copper: Math.random() > 0.55,
      pulse: Math.random() * Math.PI * 2
    }));
    packets.length = 0;
  }

  function monitorFPS(now) {
    const delta = now - perf.lastFrame;
    perf.lastFrame = now;
    perf.frameTimes.push(delta);
    perf.sampleCount++;
    if (perf.sampleCount >= 15) {
      const avg = perf.frameTimes.reduce((a, b) => a + b, 0) / perf.frameTimes.length;
      const fps = 1000 / avg;
      perf.frameTimes = [];
      perf.sampleCount = 0;
      if (fps < 30) {
        perf.lowPerfCount++;
        perf.highPerfCount = 0;
      } else if (fps > 45) {
        perf.highPerfCount++;
        perf.lowPerfCount = 0;
      } else {
        perf.lowPerfCount = 0;
        perf.highPerfCount = 0;
      }
      if (perf.lowPerfCount >= 2 && !perf.degraded) {
        perf.degraded = true;
        maxParticles = Math.max(20, Math.floor(maxParticles * 0.4));
        spawn();
        if (maxParticles <= 20) paused = true;
      }
      if (perf.highPerfCount >= 5 && perf.degraded) {
        perf.degraded = false;
        const restored = W < 720 ? 52 : 110;
        if (maxParticles < restored) { maxParticles = restored; spawn(); }
        paused = false;
      }
    }
  }

  function spawnPacket() {
    if (packets.length >= MAX_PACKETS) return;
    const candidates = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const gap = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (gap < 120 && gap > 20) candidates.push([i, j, gap]);
      }
    }
    if (!candidates.length) return;
    const [ai, bi] = candidates[Math.floor(Math.random() * Math.min(candidates.length, 30))];
    const a = particles[ai], b = particles[bi];
    packets.push({ ax: a, bx: b, t: 0, speed: 0.006 + Math.random() * 0.006, copper: a.copper || b.copper });
  }

  let paused = false;

  function draw(now) {
    if (prefersReducedMotion) return;
    if (paused) { requestAnimationFrame(draw); return; }

    monitorFPS(now);
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;

    packetSpawnTimer += 1;
    if (packetSpawnTimer > 90) { packetSpawnTimer = 0; spawnPacket(); }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 160) { p.vx -= dx * 0.00004; p.vy -= dy * 0.00004; }
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.994; p.vy *= 0.994;
      if (p.x < -10 || p.x > W + 10) p.vx *= -0.8;
      if (p.y < -10 || p.y > H + 10) p.vy *= -0.8;
      const glow = 0.5 + Math.sin(t * 0.8 + p.pulse) * 0.25;
      const alpha = (0.5 + glow * 0.35);
      if (p.copper) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(196,134,63,${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,134,63,${(0.06 * glow).toFixed(4)})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.fillStyle = `rgba(94,197,189,${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const gap = Math.hypot(p.x - q.x, p.y - q.y);
        if (gap < 110) {
          const fade = 1 - gap / 110;
          let r, g, b;
          if (p.copper && q.copper)      { r=196; g=134; b=63; }
          else if (!p.copper && !q.copper){ r=94;  g=197; b=189; }
          else                            { r=232; g=223; b=206; }
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${(fade * 0.14).toFixed(4)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
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
      const col = pk.copper ? '196,134,63' : '94,197,189';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${(0.12 * fadeT).toFixed(4)})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${(0.9 * fadeT).toFixed(4)})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  requestAnimationFrame(draw);
}
