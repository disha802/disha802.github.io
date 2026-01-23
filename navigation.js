function injectNavigation() {
  const nav = document.createElement('nav');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  nav.innerHTML = `
    <a href="index.html" class="logo">DK</a>
    <div class="nav-links">
      <a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a>
      <a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a>
      <a href="experience.html" class="${currentPage === 'experience.html' ? 'active' : ''}">Experience</a>
      <a href="projects.html" class="${currentPage === 'projects.html' ? 'active' : ''}">Projects</a>
      <a href="skills.html" class="${currentPage === 'skills.html' ? 'active' : ''}">Skills</a>
      <a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}">Contact</a>
      <a href="CV.pdf" target="_blank" class="nav-cv" style="border: 1px solid #60a5fa; padding: 4px 12px; border-radius: 20px; color: #60a5fa; font-weight: 600;">CV ↓</a>
    </div>
  `;

  document.body.prepend(nav);

  // Secret buttons
  const secretMode = document.createElement('div');
  secretMode.className = 'secret-mode';
  secretMode.id = 'secretButtons';
  secretMode.innerHTML = `
    <div class="secret-button" id="starsButton" title="Toggle Stars">⭐</div>
    <div class="secret-button" id="snowButton" title="Toggle Snow">❄️</div>
    <div class="secret-button" id="bubblesButton" title="Toggle Bubbles">🫧</div>
  `;
  document.body.appendChild(secretMode);
}

document.addEventListener('DOMContentLoaded', injectNavigation);
