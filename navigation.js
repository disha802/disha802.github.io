/* ============================================================
   Editor chrome + command palette — "Frosted / VS Code" shell
   Injected once per page: window title bar (traffic lights +
   editor tabs = nav), breadcrumb, status bar, and a ⌘K/Ctrl-K
   command palette. Keeps all six pages in sync without editing
   their markup.
   ============================================================ */

const PAGES = [
  ['index.html', 'Home'],
  ['about.html', 'About'],
  ['experience.html', 'Experience'],
  ['projects.html', 'Projects'],
  ['skills.html', 'Skills'],
  ['contact.html', 'Contact'],
];

const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform);
const EMAIL = 'Disha.m.kataria@gmail.com';

/* Lucide v1 dropped its brand icons, so GitHub/LinkedIn ship as inline marks. */
const BRAND = {
  github: '<svg class="brand-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.91c.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>',
  linkedin: '<svg class="brand-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/></svg>',
};

function injectChrome() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  const nav = document.createElement('nav');
  nav.className = 'editor-chrome';
  nav.innerHTML = `
    <div class="tabs">
      ${PAGES.map(([file]) => `
        <a href="${file}" class="tab${file === current ? ' active' : ''}">
          <i data-lucide="file-code"></i><span>${file}</span><i data-lucide="x" class="tab-x"></i>
        </a>`).join('')}
      <a href="CV.pdf" target="_blank" class="tab nav-cv">
        <i data-lucide="file-down"></i><span>CV.pdf</span>
      </a>
    </div>
  `;
  document.body.prepend(nav);

  const content = document.querySelector('.content');
  if (content) {
    const bc = document.createElement('div');
    bc.className = 'breadcrumb';
    bc.innerHTML = `
      <i data-lucide="folder"></i><span>portfolio</span>
      <i data-lucide="chevron-right"></i><span class="crumb-file">${current}</span>
    `;
    content.prepend(bc);
  }

  const sb = document.createElement('div');
  sb.className = 'statusbar';
  sb.innerHTML = `
    <div class="sb-left">
      <span class="sb-item sb-accent"><i data-lucide="git-branch"></i>main</span>
      <span class="sb-item sb-hide"><i data-lucide="circle-check"></i>0<i data-lucide="triangle-alert" style="margin-left:8px"></i>0</span>
    </div>
    <div class="sb-right">
      <span class="sb-item sb-pos sb-hide">Ln 1, Col 1</span>
      <span class="sb-item sb-hide">UTF-8</span>
      <span class="sb-item">HTML</span>
      <span class="sb-item sb-cmdk" role="button" tabindex="0" title="Command palette">${IS_MAC ? '⌘K' : 'Ctrl K'}</span>
      <span class="sb-item sb-signal"><span class="sb-dot"></span>Open to roles</span>
    </div>
  `;
  document.body.appendChild(sb);

  // live Ln/Col driven by scroll position (editor flavour)
  const pos = sb.querySelector('.sb-pos');
  if (pos) {
    const maxLn = 240;
    let ticking = false;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      const ln = Math.max(1, Math.round(p * maxLn));
      const col = (Math.round(window.scrollY) % 90) + 1;
      pos.textContent = `Ln ${ln}, Col ${col}`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }
}

function injectPalette() {
  const commands = [
    ...PAGES.map(([file, label]) => ({
      label: `Go to ${label}`, hint: file, icon: 'file-code',
      run: () => { window.location.href = file; }
    })),
    { label: 'Download CV', hint: 'CV.pdf', icon: 'file-down', run: () => window.open('CV.pdf', '_blank') },
    { label: 'Copy email address', hint: EMAIL, icon: 'mail', run: copyEmail },
    { label: 'Open GitHub', hint: 'github.com/disha802', svg: BRAND.github, run: () => window.open('https://github.com/disha802', '_blank') },
    { label: 'Open LinkedIn', hint: 'linkedin.com/in/kataria-disha', svg: BRAND.linkedin, run: () => window.open('https://linkedin.com/in/kataria-disha', '_blank') },
  ];

  const overlay = document.createElement('div');
  overlay.className = 'cmdk';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="cmdk-panel" role="dialog" aria-label="Command palette">
      <div class="cmdk-input-row">
        <i data-lucide="search"></i>
        <input type="text" class="cmdk-input" placeholder="Go to a page or run a command…" aria-label="Command palette search" />
        <kbd>esc</kbd>
      </div>
      <ul class="cmdk-list" role="listbox"></ul>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.cmdk-input');
  const list = overlay.querySelector('.cmdk-list');
  let filtered = commands;
  let active = 0;
  let open = false;

  const render = () => {
    list.innerHTML = filtered.length
      ? filtered.map((c, i) => `
        <li class="cmdk-item${i === active ? ' active' : ''}" data-i="${i}" role="option">
          ${c.svg || `<i data-lucide="${c.icon}"></i>`}<span class="cmdk-label">${c.label}</span><span class="cmdk-hint">${c.hint}</span>
        </li>`).join('')
      : '<li class="cmdk-empty">No matching commands</li>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  const filter = (q) => {
    q = q.toLowerCase().trim();
    return q ? commands.filter(c => (c.label + ' ' + c.hint).toLowerCase().includes(q)) : commands;
  };

  const openPalette = () => {
    open = true;
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = ''; filtered = commands; active = 0; render();
    setTimeout(() => input.focus(), 20);
  };
  const closePalette = () => {
    open = false;
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
  };
  const run = (i) => { const c = filtered[i]; if (c) { closePalette(); c.run(); } };

  input.addEventListener('input', () => { filtered = filter(input.value); active = 0; render(); });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) return closePalette();
    const li = e.target.closest('.cmdk-item');
    if (li) run(+li.dataset.i);
  });
  overlay.addEventListener('mousemove', (e) => {
    const li = e.target.closest('.cmdk-item');
    if (li && +li.dataset.i !== active) { active = +li.dataset.i; render(); }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open ? closePalette() : openPalette(); return; }
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); render(); scrollActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); render(); scrollActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); run(active); }
  });

  const scrollActive = () => {
    const el = list.querySelector('.cmdk-item.active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  };

  // status-bar shortcut opens it too
  const trigger = document.querySelector('.sb-cmdk');
  if (trigger) {
    trigger.addEventListener('click', openPalette);
    trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPalette(); } });
  }
}

function copyEmail() {
  const done = () => showToast('Email copied to clipboard');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(EMAIL).then(done).catch(() => (window.location.href = 'mailto:' + EMAIL));
  } else {
    window.location.href = 'mailto:' + EMAIL;
  }
}

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('visible'), 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  injectChrome();
  injectPalette();
});
