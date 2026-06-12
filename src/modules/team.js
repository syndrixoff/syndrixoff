export function initTeam() {
  initMarqueePause();
  initAvatars();
  initFilters();
}

function initMarqueePause() {
  document.querySelectorAll(".marquee-row").forEach(row => {
    row.addEventListener("mouseenter", () => row.classList.add("paused"));
    row.addEventListener("mouseleave", () => row.classList.remove("paused"));
  });
}

function initAvatars() {
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
}

function initFilters() {
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
}
