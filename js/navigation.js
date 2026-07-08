/* ============================================
   TaskOS — Navigation
   Smooth scroll & active section tracking (Multi-Page Support)
   ============================================ */

const TaskNavigation = {
  sections: [],
  dockItems: [],

  init() {
    this.sections = document.querySelectorAll('section[id], .hero[id]');
    this.dockItems = document.querySelectorAll('.dock-item');
    this.setActivePage();
    this.initIntersectionObserver();
    this.initSmoothScroll();
  },

  setActivePage() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    const allLinks = document.querySelectorAll('.dock-item, .header-nav-link');

    allLinks.forEach(item => {
      const href = item.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('//')) {
        const itemPage = href.split("/").pop();
        if (itemPage === page || (page === "index.html" && itemPage === "") || (page === "" && itemPage === "index.html")) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      } else {
        item.classList.remove('active');
      }
    });
  },

  initIntersectionObserver() {
    // Only run intersection observer for in-page anchors if there are any
    if (this.sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Only toggle active state if we are on a single page with hashes
            const hash = `#${entry.target.id}`;
            const activeItem = document.querySelector(`.dock-item[href="${hash}"]`);
            if (activeItem) {
              this.dockItems.forEach(item => item.classList.remove('active'));
              activeItem.classList.add('active');
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px -60% 0px'
      }
    );

    this.sections.forEach(section => observer.observe(section));
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 20;

          if (window.lenis) {
            window.lenis.scrollTo(target, { offset: -20, duration: 1.2 });
          } else {
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }
      });
    });
  }
};
