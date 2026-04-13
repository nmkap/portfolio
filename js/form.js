/* ============================================================
   FORM.JS — Contact form submission via Formspree
   ============================================================ */

const form       = document.getElementById('contact-form');
const statusEl   = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');

    // Update UI to loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;
    statusEl.textContent  = '';
    statusEl.className    = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        statusEl.textContent = 'Message sent! I\'ll be in touch soon.';
        statusEl.classList.add('success');
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      statusEl.textContent = 'Something went wrong. Try emailing me directly.';
      statusEl.classList.add('error');
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled    = false;
    }
  });
}
