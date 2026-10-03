/* Hidden surprises. Nothing here runs unless you go looking for it. */
(function () {
  const say = (msg) => { if (typeof showToast === 'function') showToast(msg); };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* console greeting for the curious */
  try {
    console.log('%cDK', 'font: italic 700 40px Georgia, serif; color: #d6c4a0;');
    console.log('%cLooking under the hood? Good instinct.\nSay hello: ' + (typeof EMAIL !== 'undefined' ? EMAIL : ''), 'color: #9b988f; font-size: 12px; line-height: 1.6;');
  } catch (e) {}

  /* little burst of champagne sparks */
  function sparks(x, y) {
    if (reduce) return;
    for (let i = 0; i < 26; i++) {
      const d = document.createElement('i');
      d.className = 'egg-spark';
      const a = (i / 26) * Math.PI * 2 + Math.random() * 0.4, r = 50 + Math.random() * 110;
      d.style.left = x + 'px'; d.style.top = y + 'px';
      document.body.appendChild(d);
      d.animate(
        [{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
         { transform: 'translate(calc(-50% + ' + Math.cos(a) * r + 'px), calc(-50% + ' + Math.sin(a) * r + 'px)) scale(0)', opacity: 0 }],
        { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.2,1)' }
      ).onfinish = () => d.remove();
    }
  }

  /* 1. Konami code: the aurora goes technicolour for a few seconds */
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kPos = 0;

  /* 2. type a word anywhere (outside form fields) */
  const WORDS = {
    hello: 'Hello. Nice to meet you.',
    sudo: 'Nice try. Permission granted anyway.',
    agent: 'Agents all the way down.',
    hire: 'Bold. I like it. The Contact page is one click away.',
  };
  let typed = '';

  document.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kPos = k === KONAMI[kPos] ? kPos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kPos === KONAMI.length) {
      kPos = 0;
      document.documentElement.classList.add('party');
      say('Konami code accepted. Enjoy the colours.');
      setTimeout(() => document.documentElement.classList.remove('party'), 9000);
    }

    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      typed = (typed + e.key.toLowerCase()).slice(-8);
      for (const w in WORDS) {
        if (typed.endsWith(w)) {
          typed = '';
          say(WORDS[w]);
          if (w === 'hire') { const f = document.querySelector('.hire-fab'); if (f) { f.classList.add('show', 'wiggle'); setTimeout(() => f.classList.remove('wiggle'), 1200); } }
          break;
        }
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    /* 3. click the logo dot five times */
    const brand = document.querySelector('.pn-brand');
    if (brand) {
      let n = 0, timer, go;
      brand.addEventListener('click', (e) => {
        e.preventDefault();
        n++; clearTimeout(timer); clearTimeout(go);
        timer = setTimeout(() => { n = 0; }, 900);
        if (n >= 5) {
          n = 0;
          const r = brand.getBoundingClientRect();
          sparks(r.left + 14, r.top + r.height / 2);
          say('You found the secret handshake.');
        } else {
          go = setTimeout(() => { n = 0; window.location.href = brand.href; }, 450);
        }
      });
    }

    /* 4. click the headline's accent word to cycle it */
    const em = document.querySelector('.hero-text h1 em');
    if (em) {
      const alts = ['agentic', 'autonomous', 'reliable', 'curious', 'thoughtful'];
      let i = 0;
      em.style.cursor = 'pointer';
      em.addEventListener('click', () => {
        i = (i + 1) % alts.length;
        const target = em.querySelector('.w') || em;
        target.textContent = alts[i];
        if (i === 0) say('Back to agentic. Old habits.');
      });
    }

    /* 5. click the photo three times */
    const photo = document.querySelector('.profile');
    if (photo) {
      let n = 0, timer;
      photo.addEventListener('click', () => {
        n++; clearTimeout(timer); timer = setTimeout(() => { n = 0; }, 800);
        if (n >= 3) {
          n = 0;
          photo.classList.remove('spin'); void photo.offsetWidth; photo.classList.add('spin');
          say('Hi there.');
        }
      });
    }
  });
})();
