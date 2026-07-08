/* ============================================
   TaskOS — Contact Module
   Terminal form handling and form submission
   ============================================ */

const TaskContact = {
  form: null,
  successMsg: null,

  init() {
    this.form = document.getElementById('contactForm');
    this.successMsg = document.getElementById('formSuccess');
    if (this.form) {
      this.initFormSubmit();
    }
  },

  initFormSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent standard page reload

      const submitBtn = document.getElementById('btn-contact-submit');
      
      // Visual feedback in button
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Executing...';
      if (window.lucide) window.lucide.createIcons();

      // Collect form data
      const formData = new FormData(this.form);

      // Google Form ID and Response URL
      const googleFormId = '1FAIpQLScU_Bwtkrlbq1bZ7cVZXgg1YoEYg3lHhcqVoBaPMR7athYN9g';
      const googleFormURL = `https://docs.google.com/forms/d/e/${googleFormId}/formResponse`;

      // Map clean HTML form fields to Google Form parameters
      const formBody = new URLSearchParams();
      formBody.append('entry.2008577113', formData.get('name') || '');
      formBody.append('entry.1328540369', formData.get('email') || '');
      formBody.append('entry.910370079', formData.get('subject') || '');
      formBody.append('entry.1016571749', formData.get('message') || '');

      try {
        await fetch(googleFormURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formBody
        });

        // Show success animation
        this.form.style.display = 'none';
        this.successMsg.classList.add('show');
      } catch (error) {
        console.error('Submission error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="alert-circle"></i> Error. Retry';
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }
};
