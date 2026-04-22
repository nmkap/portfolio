/* ============================================================
   MAIN.JS — Navbar scroll behaviour, smooth scroll, reveal
   ============================================================ */

// ------------------------------------------------------------
// Navbar: add .scrolled class after user scrolls past 20px
// ------------------------------------------------------------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ------------------------------------------------------------
// Active nav link highlighting based on scroll position
// ------------------------------------------------------------
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link.scroll-to');

const observerOptions = {
  root: null,
  rootMargin: `-${getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-height')} 0px -60% 0px`,
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));


// ------------------------------------------------------------
// Scroll reveal — fade elements up as they enter viewport
// ------------------------------------------------------------
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after reveal so it only triggers once
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

revealElements.forEach(el => revealObserver.observe(el));


// ------------------------------------------------------------
// Footer: auto-update copyright year
// ------------------------------------------------------------
const yearEl = document.getElementById('footer-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// ------------------------------------------------------------
// Resume: fixed-width PDF-style scaling
// Lock the document at 1100px and scale proportionally to fit
// any viewport, mirroring how PDF viewers render pages.
// ------------------------------------------------------------
const resumeWrapper = document.querySelector('.resume-wrapper');
const resumeViewport = document.querySelector('.resume-viewport');

if (resumeWrapper && resumeViewport) {
  const DOC_WIDTH = 1100;

  function scaleResume() {
    const vw = window.innerWidth;
    const scale = Math.min(1, vw / DOC_WIDTH);
    const offsetX = (vw - DOC_WIDTH * scale) / 2;

    resumeWrapper.style.transform = `translateX(${offsetX}px) scale(${scale})`;
    // Add a fixed 64px bottom gap that doesn't shrink with the document
    resumeViewport.style.height = Math.ceil(resumeWrapper.scrollHeight * scale + 64) + 'px';
  }

  scaleResume();
  window.addEventListener('resize', scaleResume, { passive: true });
}
