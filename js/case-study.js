document.getElementById('footer-year').textContent = new Date().getFullYear();

/* ── Persona carousel (unchanged) ──────────────────────────── */
(function () {
  const carousel = document.getElementById('personaCarousel');
  const track    = carousel.querySelector('.persona-carousel-track');
  const hint     = carousel.querySelector('.persona-scroll-hint');
  let isDragging = false;
  let startX, startScrollLeft;

  carousel.addEventListener('mouseenter', () => {
    hint.classList.add('persona-scroll-hint--visible');
  });
  carousel.addEventListener('mouseleave', () => {
    hint.classList.remove('persona-scroll-hint--visible');
    isDragging = false;
    track.style.cursor = '';
  });
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    track.style.cursor = '';
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    track.scrollLeft = startScrollLeft - (e.clientX - startX);
  });
  track.addEventListener('scroll', () => {
    hint.style.opacity = track.scrollLeft > 40 ? '0' : '';
  }, { passive: true });
})();


/* ── Video scroll-play helper ───────────────────────────────── */
/*
 * Safari's autoplay policy blocks HTMLMediaElement.play() unless it
 * originates from a direct user interaction (tap / click).
 * A scroll event does NOT count as a user gesture in Safari — even
 * though it does in Chrome/Firefox — so IntersectionObserver-triggered
 * play() calls silently fail.
 *
 * Fix: use touchend (which IS a user gesture in Safari on iOS/iPadOS)
 * as the primary trigger on touch devices, with IntersectionObserver
 * as the fallback for pointer devices. We also check visibility on
 * DOMContentLoaded so videos already in view on load aren't missed.
 */
function setupScrollVideo(id) {
  const vid = document.getElementById(id);
  if (!vid) return;

  /* Ensure the element is fully prepared for Safari inline playback */
  vid.muted        = true;
  vid.playsInline  = true;
  vid.loop         = true;
  vid.setAttribute('playsinline', '');
  vid.setAttribute('webkit-playsinline', '');

  function isVisible() {
    const r = vid.getBoundingClientRect();
    const visibleHeight = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    return visibleHeight / r.height >= 0.3;
  }

  function tryPlay() {
    if (isVisible() && vid.paused) {
      vid.play().catch(() => {});
    } else if (!isVisible() && !vid.paused) {
      vid.pause();
    }
  }

  /* 1. Check on load (handles videos already in the viewport) */
  document.addEventListener('DOMContentLoaded', tryPlay);

  /* 2. IntersectionObserver — reliable on Chrome, Firefox, modern Safari */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) vid.play().catch(() => {});
      else                            vid.pause();
    }, { threshold: 0.3 }).observe(vid);
  }

  /* 3. scroll — covers desktop Safari */
  window.addEventListener('scroll', tryPlay, { passive: true });

  /* 4. touchend — direct user gesture in Safari on iOS/iPadOS.
        Fires after every swipe, giving Safari permission to call play(). */
  window.addEventListener('touchend', tryPlay, { passive: true });
}

setupScrollVideo('keyFeatureVideo');
setupScrollVideo('finalDesignVideo');
