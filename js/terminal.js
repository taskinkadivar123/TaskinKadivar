/* ============================================
   TaskOS — Terminal Typing Effect
   ============================================ */

const TaskTerminal = {
  init() {
    this.initHeroTerminal();
  },

  initHeroTerminal() {
    const outputEl = document.getElementById('terminalOutput');
    if (!outputEl) return;

    const lines = [
      { text: '✔ Django Expert', class: 'terminal-success' },
      { text: '✔ REST APIs', class: 'terminal-success' },
      { text: '✔ MySQL', class: 'terminal-success' },
      { text: '✔ Custom PHP', class: 'terminal-success' },
      { text: '✔ Responsive UI', class: 'terminal-success' },
      { text: '✔ Production Ready', class: 'terminal-success' },
      { text: '', class: '' },
      { text: '→ All systems operational.', class: 'terminal-output', style: 'color:var(--primary)' }
    ];

    // Build the HTML that Typed.js will type into
    const strings = lines.map(line => {
      if (!line.text) return '<br>';
      const style = line.style ? ` style="${line.style}"` : '';
      return `<span class="${line.class}"${style}>${line.text}</span>`;
    });

    // Type each line sequentially
    let currentLine = 0;
    const typeNextLine = () => {
      if (currentLine >= strings.length) return;

      const lineEl = document.createElement('div');
      lineEl.className = 'terminal-line';
      lineEl.style.paddingLeft = '0';
      outputEl.appendChild(lineEl);

      if (strings[currentLine] === '<br>') {
        lineEl.innerHTML = '&nbsp;';
        currentLine++;
        setTimeout(typeNextLine, 200);
        return;
      }

      // Use Typed.js for each line
      if (typeof Typed !== 'undefined') {
        new Typed(lineEl, {
          strings: [strings[currentLine]],
          typeSpeed: 25,
          showCursor: false,
          onComplete: () => {
            currentLine++;
            setTimeout(typeNextLine, 150);
          }
        });
      } else {
        // Fallback without Typed.js
        lineEl.innerHTML = strings[currentLine];
        currentLine++;
        setTimeout(typeNextLine, 150);
      }
    };

    // Delay start for hero animation
    setTimeout(typeNextLine, 1200);
  }
};
