/* ============================================
   TaskOS — Main Entry Point
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Smooth Scrolling (Lenis)
  initLenis();

  // 2. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 3. Initialize Accordion (FAQ)
  initAccordion();

  // 4. Initialize Custom App Modules
  if (typeof TaskTheme !== 'undefined') TaskTheme.init();
  if (typeof TaskNavigation !== 'undefined') TaskNavigation.init();
  if (typeof TaskTerminal !== 'undefined') TaskTerminal.init();
  if (typeof TaskDock !== 'undefined') TaskDock.init();
  if (typeof TaskSkills !== 'undefined') TaskSkills.init();
  if (typeof TaskGithub !== 'undefined') TaskGithub.init();
  if (typeof TaskContact !== 'undefined') TaskContact.init();
  if (typeof TaskBlog !== 'undefined') TaskBlog.init();
  if (typeof TaskAnimations !== 'undefined') TaskAnimations.init();

  // 5. Initialize Redesign Specific Additions
  init3DCube();
  initImageSlider();

  // Handle preloader transition end fallback
  const preloader = document.getElementById('preloader');
  if (preloader && typeof gsap === 'undefined') {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 1200);
  }
});

function initLenis() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    window.lenis = lenis;

    // Connect Lenis events to GSAP ScrollTrigger
    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    // Link GSAP ticker to Lenis requestAnimationFrame
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
}

function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

function init3DCube() {
  const cube = document.querySelector('.cube');
  if (!cube) return;

  let isDragging = false;
  let startX, startY;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.cube')) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      cube.style.animation = 'none';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    currentX += diffX * 0.5;
    currentY += diffY * 0.5;

    cube.style.transform = `rotateX(${-currentY}deg) rotateY(${currentX}deg)`;

    startX = e.clientX;
    startY = e.clientY;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.cube')) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      cube.style.animation = 'none';
    }
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - startX;
    const diffY = e.touches[0].clientY - startY;

    currentX += diffX * 0.5;
    currentY += diffY * 0.5;

    cube.style.transform = `rotateX(${-currentY}deg) rotateY(${currentX}deg)`;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });
}

function initImageSlider() {
  const sliders = document.querySelectorAll('.slider-container');
  sliders.forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slider-slide');
    const btnPrev = slider.querySelector('.slider-btn-prev');
    const btnNext = slider.querySelector('.slider-btn-next');
    const dotsContainer = slider.querySelector('.slider-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    // Create dots dynamically
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }
    };

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      updateSlider();
    };

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      });
    }
  });
}
