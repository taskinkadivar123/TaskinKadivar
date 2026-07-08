/* ============================================
   TaskOS — GitHub Activity
   Renders contribution graph & repo cards
   ============================================ */

const TaskGithub = {
  init() {
    this.renderContributionGraph();
  },

  renderContributionGraph() {
    const graphContainer = document.getElementById('contributionGraph');
    if (!graphContainer) return;

    // Generate contribution data for the last 52 weeks (approx 364 days)
    // 0 = none, 1-4 = intensity levels
    const days = 364;
    let html = '';

    for (let i = 0; i < days; i++) {
      // Create a nice distribution of activity (some weekends empty, peak on weekdays)
      let level = 0;
      const dayOfWeek = i % 7;
      const rand = Math.random();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Weekday
        if (rand > 0.85) level = 4;
        else if (rand > 0.6) level = 3;
        else if (rand > 0.3) level = 2;
        else if (rand > 0.1) level = 1;
      } else {
        // Weekend
        if (rand > 0.8) level = 1;
        else if (rand > 0.95) level = 2;
      }

      let tooltipDate = new Date();
      tooltipDate.setDate(tooltipDate.getDate() - (days - i));
      const dateString = tooltipDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const contribs = level === 0 ? 'No' : level * 2 + Math.floor(Math.random() * 2);
      const tooltipText = `${contribs} contributions on ${dateString}`;

      html += `<div class="contrib-day level-${level}" data-tooltip="${tooltipText}"></div>`;
    }

    graphContainer.innerHTML = html;
  }
};
