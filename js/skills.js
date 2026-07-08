/* ============================================
   TaskOS — Skills & Progress Bars
   ============================================ */

const TaskSkills = {
  init() {
    this.initProgressAnimations();
  },

  initProgressAnimations() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const animateBars = () => {
      progressFills.forEach(fill => {
        const rect = fill.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if element is in viewport
        if (rect.top < windowHeight * 0.9 && rect.bottom > 0) {
          const targetWidth = fill.dataset.width;
          if (targetWidth) {
            fill.style.width = `${targetWidth}%`;
            fill.classList.add('animated');
          }
        }
      });
    };

    // Run on init and scroll
    animateBars();
    window.addEventListener('scroll', animateBars);
  }
};
