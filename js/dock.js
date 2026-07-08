/* ============================================
   TaskOS — macOS Dock
   Magnification effect on hover
   ============================================ */

const TaskDock = {
  dock: null,
  items: [],

  init() {
    this.dock = document.querySelector('.dock');
    if (!this.dock) return;

    this.items = this.dock.querySelectorAll('.dock-item');
    this.initMagnification();
  },

  initMagnification() {
    const dock = this.dock;
    const items = this.items;

    dock.addEventListener('mousemove', (e) => {
      const dockRect = dock.getBoundingClientRect();
      const mouseX = e.clientX;

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(mouseX - itemCenterX);
        const maxDist = 120;

        if (distance < maxDist) {
          const scale = 1 + 0.3 * (1 - distance / maxDist);
          const translateY = -8 * (1 - distance / maxDist);
          item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        } else {
          item.style.transform = 'scale(1) translateY(0)';
        }
      });
    });

    dock.addEventListener('mouseleave', () => {
      items.forEach(item => {
        item.style.transform = 'scale(1) translateY(0)';
      });
    });
  }
};
