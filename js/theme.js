/* ============================================
   TaskOS — Theme Effects
   Cursor glow, magnetic buttons, background
   ============================================ */

const TaskTheme = {
  cursorGlow: null,

  init() {
    this.cursorGlow = document.getElementById('cursorGlow');
    if (this.cursorGlow) {
      this.initCursorGlow();
    }
    this.initMagneticButtons();
    this.initCanvasBackground();
  },

  initCursorGlow() {
    const glow = this.cursorGlow;
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let ringX = 0, ringY = 0;

    // Check if on desktop
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;

    let dot = null;
    let ring = null;

    if (isDesktop) {
      // Dynamically inject custom cursor elements
      dot = document.createElement('div');
      dot.className = 'cursor-dot';
      ring = document.createElement('div');
      ring.className = 'cursor-ring';
      document.body.appendChild(dot);
      document.body.appendChild(ring);
    }

    // Spawning trailing particles
    let lastParticleTime = 0;
    const particleColors = ['#2563EB', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'];

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (isDesktop && dot && ring) {
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';

        // Spawn trailing particle occasionally
        const now = Date.now();
        if (now - lastParticleTime > 35) { // Spawn rate
          lastParticleTime = now;
          spawnParticle(mouseX, mouseY);
        }
      }
    });

    const spawnParticle = (x, y) => {
      const p = document.createElement('div');
      p.className = 'cursor-particle';
      
      const size = Math.random() * 4 + 2; // 2px to 6px
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = color;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.boxShadow = `0 0 8px ${color}`;

      document.body.appendChild(p);

      // Random direction vectors
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 15 + 8;
      const targetX = x + Math.cos(angle) * velocity;
      const targetY = y + Math.sin(angle) * velocity;

      if (typeof gsap !== 'undefined') {
        gsap.to(p, {
          x: targetX - x,
          y: targetY - y,
          opacity: 0,
          scale: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => p.remove()
        });
      } else {
        setTimeout(() => p.remove(), 500);
      }
    };

    // Smooth follow with lerp
    const animate = () => {
      // Update large background glow
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      if (glow) {
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
      }

      // Update concentric ring with slightly slower lag follow
      if (isDesktop && ring) {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
      }

      requestAnimationFrame(animate);
    };
    animate();

    // Hover listeners to resize and style cursor active states
    if (isDesktop) {
      const updateHoverListeners = () => {
        const interactives = document.querySelectorAll('a, button, input, textarea, select, .cube, .project-card, .btn, .timeline-dot');
        interactives.forEach(el => {
          el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
          });
          el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
          });
        });
      };
      
      updateHoverListeners();
      // Keep selectors active if DOM structure shifts
      setTimeout(updateHoverListeners, 1500);
    }

    // Hide background glow on mobile
    if (glow && !isDesktop) {
      glow.style.display = 'none';
    }
  },

  initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic-wrap');

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.15s ease-out';
      });
    });
  },

  initCanvasBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bgCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-3';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(50, Math.floor((width * height) / 30000));
    const colors = ['rgba(37, 99, 235, 0.12)', 'rgba(124, 58, 237, 0.12)', 'rgba(6, 182, 212, 0.12)'];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection plexus lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.04;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }
};
