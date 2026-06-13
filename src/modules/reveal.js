export function initReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const children = entry.target.querySelectorAll(".reveal, .reveal-l, .reveal-r, .reveal-scale");
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            child.style.setProperty("--stagger-delay", `${i * 60}ms`);
            child.classList.add("revealed");
          });
        } else {
          const { top, bottom } = entry.boundingClientRect;
          if (top > entry.rootBounds.bottom) {
            children.forEach((child) => child.classList.remove("revealed"));
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: "-10% 0px -20% 0px" }
  );

  document.querySelectorAll("section[id]:not(#hero)").forEach((section) => {
    section.querySelectorAll(".section-label, .section-title, .section-subtitle, .tool-domain, .tools-pipeline, .glass-card, .tele-card, .project-card, .team-card, .contact-card, .team-filters, .team-scroll-dots, .about-text > p").forEach((el) => {
      if (!el.classList.contains("reveal")) el.classList.add("reveal");
    });
    revealObserver.observe(section);
  });

  document.querySelectorAll("section[id]:not(#hero)").forEach((section) => {
    const rect = section.getBoundingClientRect();
    const effectiveTop = window.innerHeight * 0.1;
    const effectiveBottom = window.innerHeight * 0.8;
    if (rect.top < effectiveBottom && rect.bottom > effectiveTop) {
      const children = section.querySelectorAll(".reveal, .reveal-l, .reveal-r, .reveal-scale");
      children.forEach((child, i) => {
        child.style.setProperty("--stagger-delay", `${i * 60}ms`);
        child.classList.add("revealed");
      });
    }
  });
}
