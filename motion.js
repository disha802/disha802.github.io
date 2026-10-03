/* Scroll choreography: smooth scroll (Lenis), pinned hero reveal,
   horizontal Projects showcase, animated stat counters. */
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);

  /* ---------- smooth, weighted scrolling ---------- */
  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.__lenis = lenis;
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll(".stat-number, .big-num");
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target, m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
        if (!m) return;
        const to = parseFloat(m[1]), dec = (m[1].split(".")[1] || "").length, suf = m[2], t0 = performance.now(), dur = 1400;
        const step = (now) => {
          const p = ease((now - t0) / dur);
          el.textContent = (to * p).toFixed(dec) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => io.observe(el));
  }

  /* ---------- pinned hero: words reveal, then the hero recedes ---------- */
  const hero = document.getElementById("hero");
  if (hero && !reduce && window.innerWidth > 720) {
    const track = document.createElement("div");
    track.className = "hero-track";
    hero.parentNode.insertBefore(track, hero);
    track.appendChild(hero);
    hero.classList.add("pinned");

    const h1 = hero.querySelector("h1");
    const words = [];
    const wrap = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const s = document.createElement("span");
            s.className = "w"; s.textContent = part;
            frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(h1);
    const rest = Array.from(hero.querySelectorAll(".profile, .tagline, .hero-stats, .subtitle, .hero-cta, .core-toolbox, .socials"));
    rest.forEach((el) => el.classList.add("hero-rest"));
    const t0 = performance.now();

    const update = (now) => {
      const timeQ = clamp((now - t0 - 250) / 2200);
      const trackH = track.offsetHeight - window.innerHeight;
      const sq = trackH > 0 ? clamp(-track.getBoundingClientRect().top / trackH) : 0;
      const q = clamp(timeQ + sq * 2);
      words.forEach((w, k) => {
        const v = ease((q - (k / words.length) * 0.5) / 0.14);
        w.style.opacity = v;
        w.style.transform = "translateY(" + ((1 - v) * 22).toFixed(1) + "px)";
        w.style.filter = "blur(" + ((1 - v) * 7).toFixed(1) + "px)";
      });
      rest.forEach((el, k) => {
        const v = ease((q - 0.4 - k * 0.04) / 0.16);
        el.style.opacity = v;
        el.style.transform = "translateY(" + ((1 - v) * 16).toFixed(1) + "px)";
      });
      const r = clamp((sq - 0.15) / 0.85);
      hero.style.setProperty("--recede", r.toFixed(3));
      return timeQ < 1;
    };
    const loop = (now) => { if (update(now)) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  }

  /* ---------- horizontal projects showcase ---------- */
  const grid = document.querySelector(".project-images + .grid");
  if (grid && !reduce && window.innerWidth > 900) {
    const track = document.createElement("div");
    track.className = "h-track";
    const sticky = document.createElement("div");
    sticky.className = "h-sticky";
    grid.parentNode.insertBefore(track, grid);
    sticky.appendChild(grid);
    track.appendChild(sticky);
    grid.classList.add("h-row");
    grid.querySelectorAll(".card").forEach((c) => c.classList.add("no-reveal", "in"));

    let maxX = 0;
    const measure = () => {
      grid.style.transform = "none";
      maxX = Math.max(0, grid.scrollWidth - window.innerWidth);
      track.style.height = (maxX + window.innerHeight) + "px";
    };
    const cards = Array.from(grid.querySelectorAll(".card"));
    const update = () => {
      const top = track.getBoundingClientRect().top;
      const span = track.offsetHeight - window.innerHeight;
      const p = span > 0 ? clamp(-top / span) : 0;
      grid.style.transform = "translate3d(" + (-p * maxX).toFixed(1) + "px,0,0)";
      const mid = window.innerWidth / 2;
      cards.forEach((c) => {
        const r = c.getBoundingClientRect(), d = clamp(Math.abs(r.left + r.width / 2 - mid) / (window.innerWidth * 0.55));
        c.style.transform = "scale(" + (1 - 0.07 * d).toFixed(3) + ")";
        c.style.opacity = (1 - 0.5 * d).toFixed(3);
      });
    };
    measure(); update();
    window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", () => { measure(); update(); });
    window.addEventListener("load", () => { measure(); update(); });
  }
});
