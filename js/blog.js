/* ============================================
   TaskOS — Blog Logic
   ============================================ */

const TaskBlog = {
  init() {
    this.calculateReadingTimes();
  },

  calculateReadingTimes() {
    const articles = document.querySelectorAll('.blog-card');
    articles.forEach(article => {
      // Just a mock setup for reading time calculation or metadata formatting
      const title = article.querySelector('.blog-card-title')?.innerText || '';
      const excerpt = article.querySelector('.blog-card-excerpt')?.innerText || '';
      
      const totalWords = title.split(/\s+/).length + excerpt.split(/\s+/).length + 300; // rough guess
      const wpm = 200; // average reading speed
      const readingTime = Math.ceil(totalWords / wpm);

      const timeEl = article.querySelector('.blog-card-meta span:last-child');
      if (timeEl && readingTime) {
        timeEl.innerHTML = `<i data-lucide="clock" style="display:inline-block;width:14px;height:14px;vertical-align:middle;margin-right:4px"></i> ${readingTime} min read`;
      }
    });
  }
};
// Add CSS rotation animation helper for loading indicators if not already defined
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
