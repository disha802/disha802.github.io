/* Aurora backdrop: three huge, blurred washes of light that drift slowly
   and shift with scroll, under a fine film grain. */
function initBackground() {
  if (document.querySelector(".aurora")) return;

  const aurora = document.createElement("div");
  aurora.className = "aurora";
  aurora.setAttribute("aria-hidden", "true");
  aurora.innerHTML =
    '<span class="ab a1"><i></i></span>' +
    '<span class="ab a2"><i></i></span>' +
    '<span class="ab a3"><i></i></span>';
  document.body.prepend(aurora);

  const grain = document.createElement("div");
  grain.className = "grain";
  grain.setAttribute("aria-hidden", "true");
  document.body.prepend(grain);

  const root = document.documentElement;
  let ticking = false;
  const update = () => {
    const h = root.scrollHeight - window.innerHeight;
    const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    root.style.setProperty("--sy", window.scrollY.toFixed(0));
    root.style.setProperty("--sp", p.toFixed(3));
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  initBackground();
  if (typeof lucide !== "undefined") lucide.createIcons();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* cursor spotlight + scroll reveal for content blocks */
(function () {
  const SEL = ".card, .skill-category, .timeline-item, .pipeline-widget, .contact-form-container";
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest && e.target.closest(SEL);
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  document.addEventListener("DOMContentLoaded", () => {
    if (!("IntersectionObserver" in window)) return;
    const items = document.querySelectorAll(".card, .skill-category, .pipeline-widget, .hero-stats, .project-image, .timeline-item, .contact-form-container, .stat-badge");
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => {
      if (el.closest(".h-track") || el.classList.contains("no-reveal")) return;
      const sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", Math.min(sib, 6) * 0.07 + "s");
      el.classList.add("reveal");
      io.observe(el);
    });
  });
})();
