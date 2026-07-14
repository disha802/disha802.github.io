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

function injectChrome() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  const nav = document.createElement('nav');
  nav.className = 'editor-chrome';
  nav.innerHTML = `
    <div class="traffic" aria-hidden="true">
      <span class="tl red"></span><span class="tl yellow"></span><span class="tl green"></span>
    </div>
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
    { label: 'Open GitHub', hint: 'github.com/disha802', icon: 'github', run: () => window.open('https://github.com/disha802', '_blank') },
    { label: 'Open LinkedIn', hint: 'linkedin.com/in/kataria-disha', icon: 'linkedin', run: () => window.open('https://linkedin.com/in/kataria-disha', '_blank') },
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
          <i data-lucide="${c.icon}"></i><span class="cmdk-label">${c.label}</span><span class="cmdk-hint">${c.hint}</span>
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
