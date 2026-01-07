// Animated particle background
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() { 
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight; 
}

window.addEventListener("resize", resize); 
resize();

const particles = Array.from({length: 200}, () => ({
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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p, i) => {
    // Mouse interaction
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 150) {
      const force = (150 - dist) / 150;
      p.vx -= (dx / dist) * force * 0.2;
      p.vy -= (dy / dist) * force * 0.2;
    }
    
    p.x += p.vx; 
    p.y += p.vy;
    
    // Damping
    p.vx *= 0.99;
    p.vy *= 0.99;
    
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    
    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(96,165,250,${p.opacity})`;
    ctx.fill();
    
    // Draw connections
    particles.slice(i + 1).forEach(p2 => {
      const d = Math.hypot(p2.x - p.x, p2.y - p.y);
      if (d < 120) {
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