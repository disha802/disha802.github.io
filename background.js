// PARTICLES with enhanced visual effects
function initBackground() {
  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  function resize(){ 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
  }
  
  window.addEventListener("resize", resize); 
  resize();

  const particles = Array.from({length:200},()=>({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.5 + 0.3
  }));

  let mouse = {x: 0, y: 0};
  
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if(dist < 150) {
        const force = (150 - dist) / 150;
        p.vx -= (dx / dist) * force * 0.2;
        p.vy -= (dy / dist) * force * 0.2;
      }
      
      p.x += p.vx; 
      p.y += p.vy;
      
      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.opacity})`;
      ctx.fill();
      
      // Draw connections
      particles.slice(i + 1).forEach(p2 => {
        const d = Math.hypot(p2.x - p.x, p2.y - p.y);
        if(d < 120){
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(96,165,250,${(1 - d / 120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// SECRET EASTER EGGS 🎮⭐❄️🫧
let starsActive = false;
let snowActive = false;
let bubblesActive = false;
let stars = [];
let snowflakes = [];
let bubbles = [];

function initEasterEggs() {
  const starsButton = document.getElementById('starsButton');
  const snowButton = document.getElementById('snowButton');
  const bubblesButton = document.getElementById('bubblesButton');
  if (!starsButton || !snowButton || !bubblesButton) return;

  // KONAMI CODE: ↑↑↓↓←→←→BA
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  let konamiUnlocked = false;

  // TEXT CODES
  let textCode = '';

  document.addEventListener('keydown', (e) => {
    // Check Konami Code
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        unlockSecretButtons();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }

    // Check text codes
    textCode += e.key.toLowerCase();
    if (textCode.length > 10) {
      textCode = textCode.slice(-10);
    }

    if (textCode.includes('stars')) {
      unlockSecretButtons();
      toggleStars();
      textCode = '';
    } else if (textCode.includes('snow')) {
      unlockSecretButtons();
      toggleSnow();
      textCode = '';
    } else if (textCode.includes('bubbles')) {
      unlockSecretButtons();
      toggleBubbles();
      textCode = '';
    }
  });

  function unlockSecretButtons() {
    if (!konamiUnlocked) {
      konamiUnlocked = true;
      starsButton.classList.add('visible');
      snowButton.classList.add('visible');
      bubblesButton.classList.add('visible');
      console.log('🎮 Secret modes unlocked! Click the buttons or type: stars, snow, bubbles');
    }
  }

  // STARS EFFECT ⭐
  function toggleStars() {
    starsActive = !starsActive;
    if (starsActive) {
      createShootingStars();
      console.log('⭐ Shooting stars activated!');
    } else {
      removeStars();
      console.log('⭐ Shooting stars deactivated');
    }
  }

  function createShootingStars() {
    const colors = ['#60a5fa', '#a78bfa', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ffffff'];
    const shootInterval = setInterval(() => {
      if (!starsActive) { clearInterval(shootInterval); return; }
      const star = document.createElement('div');
      star.className = 'star';
      const color = colors[Math.floor(Math.random() * colors.length)];
      star.style.color = color;
      const startFromTop = Math.random() > 0.5;
      if (startFromTop) {
        star.style.left = Math.random() * 100 + '%';
        star.style.top = '0px';
      } else {
        star.style.left = '100%';
        star.style.top = Math.random() * 50 + '%';
      }
      const trailLength = Math.random() * 80 + 40;
      const beforeStyle = document.createElement('style');
      beforeStyle.textContent = `.star::before { width: ${trailLength}px; } .star::after { width: ${trailLength * 0.6}px; }`;
      document.head.appendChild(beforeStyle);
      const duration = Math.random() * 1 + 1.5;
      star.style.animation = `shoot ${duration}s ease-out forwards`;
      document.body.appendChild(star);
      stars.push(star);
      setTimeout(() => {
        star.remove();
        beforeStyle.remove();
        stars = stars.filter(s => s !== star);
      }, duration * 1000);
    }, 800);
  }

  function removeStars() {
    stars.forEach(star => star.remove());
    stars = [];
  }

  // SNOW EFFECT ❄️
  function toggleSnow() {
    snowActive = !snowActive;
    if (snowActive) {
      createSnow();
      console.log('❄️ Snow activated!');
    } else {
      removeSnow();
      console.log('❄️ Snow deactivated');
    }
  }

  function createSnow() {
    const snowInterval = setInterval(() => {
      if (!snowActive) { clearInterval(snowInterval); return; }
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.textContent = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
      snowflake.style.left = Math.random() * 100 + '%';
      snowflake.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
      snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
      snowflake.style.opacity = Math.random() * 0.6 + 0.4;
      document.body.appendChild(snowflake);
      snowflakes.push(snowflake);
      setTimeout(() => {
        snowflake.remove();
        snowflakes = snowflakes.filter(s => s !== snowflake);
      }, 8000);
    }, 200);
  }

  function removeSnow() {
    snowflakes.forEach(snowflake => snowflake.remove());
    snowflakes = [];
  }

  // BUBBLES EFFECT 🫧
  function toggleBubbles() {
    bubblesActive = !bubblesActive;
    if (bubblesActive) {
      createBubbles();
      console.log('🫧 Bubbles activated! Click them to pop!');
    } else {
      removeBubbles();
      console.log('🫧 Bubbles deactivated');
    }
  }

  function createBubbles() {
    const bubbleInterval = setInterval(() => {
      if (!bubblesActive) { clearInterval(bubbleInterval); return; }
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 40 + 30;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.animationDuration = (Math.random() * 4 + 6) + 's';
      bubble.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      bubble.addEventListener('click', () => {
        bubble.classList.add('pop');
        setTimeout(() => bubble.remove(), 300);
        bubbles = bubbles.filter(b => b !== bubble);
      });
      document.body.appendChild(bubble);
      bubbles.push(bubble);
      setTimeout(() => {
        if (bubble.parentNode) {
          bubble.remove();
          bubbles = bubbles.filter(b => b !== bubble);
        }
      }, 10000);
    }, 500);
  }

  function removeBubbles() {
    bubbles.forEach(bubble => bubble.remove());
    bubbles = [];
  }

  starsButton.addEventListener('click', toggleStars);
  snowButton.addEventListener('click', toggleSnow);
  bubblesButton.addEventListener('click', toggleBubbles);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initBackground();
  initEasterEggs();
  lucide.createIcons();
  
  if (document.getElementById("year")) {
    document.getElementById("year").textContent = new Date().getFullYear();
  }
});
