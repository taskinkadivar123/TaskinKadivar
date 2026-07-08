/* ============================================
   TaskOS — GSAP & ScrollTrigger Animations
   ============================================ */

const TaskAnimations = {
  init() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      this.fallbackReveal();
      this.fallbackCounters();
      return;
    }

    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const isHome = document.querySelector('.hero') !== null;
    if (isHome) {
      this.initHeroEntrance();
    } else {
      // Simple fade out preloader for sub-pages
      const tl = gsap.timeline();
      tl.to('#preloader', {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        onComplete: () => {
          const preloader = document.getElementById('preloader');
          if (preloader) preloader.style.display = 'none';
        }
      });
      // Ensure header and dock are statically visible
      if (document.querySelector('.header')) {
        gsap.set('.header', { opacity: 1, y: 0 });
      }
      if (document.querySelector('.dock-container')) {
        gsap.set('.dock-container', { opacity: 1, y: 0 });
      }
    }

    this.initScrollReveals();
    this.initCounters();
    this.initInteractiveCards();
  },

  initHeroEntrance() {
    const tl = gsap.timeline();
    const subtext = document.getElementById('preloaderSubtext');
    
    if (subtext) {
      tl.to(subtext, {
        duration: 0.4,
        delay: 0.3,
        onStart: () => { subtext.textContent = "Loading Projects..."; }
      });
      tl.to(subtext, {
        duration: 0.4,
        delay: 0.3,
        onStart: () => { subtext.textContent = "Loading Experience..."; }
      });
    }

    tl.to('#preloader', {
      opacity: 0,
      duration: 0.5,
      delay: 0.4,
      onComplete: () => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
      }
    });

    if (document.querySelector('.header')) {
      tl.from('.header', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }
    tl.from('.hero-badge', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    tl.from('.hero-name', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    tl.from('.hero-role', { opacity: 0, x: -20, stagger: 0.15, duration: 0.4, ease: 'power2.out' }, '-=0.3');
    tl.from('.hero-tagline', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    tl.from('.hero-cta .btn', { opacity: 0, y: 15, stagger: 0.1, duration: 0.4, ease: 'power2.out' }, '-=0.3');
    tl.from('.hero-editor', { opacity: 0, scale: 0.95, duration: 0.8, ease: 'power3.out' }, '-=0.6');
    tl.from('.hero-terminal', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.5');
    tl.from('.dock-container', { opacity: 0, y: 50, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3');
  },

  initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      // Avoid doubling reveals on careerTimeline items
      if (el.id === 'careerTimeline') return;
      
      gsap.fromTo(el, 
        { opacity: 0, y: 35 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Horizontal timeline staggered reveal animation
    const timelineItems = document.querySelectorAll('.horizontal-timeline-item');
    if (timelineItems.length > 0) {
      gsap.from(timelineItems, {
        opacity: 0,
        y: 35,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#careerTimeline',
          start: 'top 80%'
        }
      });
    }

    // Development process horizontal stagger reveal
    const steps = document.querySelectorAll('.process-step');
    if (steps.length > 0) {
      gsap.from(steps, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#processTimeline',
          start: 'top 80%'
        }
      });
    }
  },

  initCounters() {
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10) || 0;
      
      gsap.fromTo(counter, 
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%'
          }
        }
      );
    });
  },

  initInteractiveCards() {
    // Disable card tilt parallax on mobile/tablet to avoid stutter and scrolling interference
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    if (!isDesktop) return;

    const cards = document.querySelectorAll('.project-card, .skill-card, .service-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        const angleX = (yc - y) / 15;
        const angleY = (x - xc) / 15;
        
        card.style.transform = `perspective(600px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  },

  fallbackReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
    
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 1000);
    }
  },

  fallbackCounters() {
    const counters = document.querySelectorAll('.count-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target, 10) || 0;
          let count = 0;
          const duration = 1500;
          const stepTime = Math.max(Math.floor(duration / target), 15);
          
          const timer = setInterval(() => {
            count += Math.ceil(target / (duration / stepTime));
            if (count >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = count;
            }
          }, stepTime);
          
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.1 });

    counters.forEach(c => observer.observe(c));
  }
};
