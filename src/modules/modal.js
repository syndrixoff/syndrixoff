export function initModal() {
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
  let previouslyFocused = null;

  const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

  function trapFocus(overlay) {
    const els = Array.from(overlay.querySelectorAll(FOCUSABLE));
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!activeModal) return;
    const overlay = activeModal;
    document.removeEventListener("keydown", onKeyDown);
    overlay.classList.remove("open");
    overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
    activeModal = null;
    if (previouslyFocused) { previouslyFocused.focus(); previouslyFocused = null; }
  }

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;
    if (activeModal) closeModal();
    previouslyFocused = document.activeElement;

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <span class="modal-tag">${data.tag}</span>
            <h2 id="modal-title">${data.title}</h2>
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
    requestAnimationFrame(() => {
      overlay.classList.add("open");
      trapFocus(overlay);
    });
  }

  function onKeyDown(e) {
    if (e.key === "Escape" && activeModal) closeModal();
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.project); } });
  });
}
