export function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  let themeToggleInProgress = false;

  themeToggle.addEventListener("click", () => {
    if (themeToggleInProgress) return;
    themeToggleInProgress = true;
    const rect = themeToggle.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    const t = document.documentElement;
    t.style.setProperty("--splash-x", `${x}%`);
    t.style.setProperty("--splash-y", `${y}%`);
    const apply = () => {
      t.setAttribute("data-theme", next);
      themeToggleInProgress = false;
    };
    if (document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  });
}
