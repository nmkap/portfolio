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


/* ── Safari detection ───────────────────────────────────────── */
/*
 * Targets Safari specifically — not all WebKit browsers.
 * Excludes Chrome/Edge/Brave (which include 'Chrome' in their UA)
 * and Android browsers. Desktop Chrome also contains 'Safari' in
 * its UA string, so the negative lookahead for 'chrome' is required.
 */
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);


/* ── Video setup ────────────────────────────────────────────── */
function setupScrollVideo(id) {
  const vid = document.getElementById(id);
  if (!vid) return;

  vid.muted       = true;
  vid.playsInline = true;
  vid.loop        = true;
  vid.setAttribute('playsinline', '');
  vid.setAttribute('webkit-playsinline', '');

  if (isSafari) {
    setupSafariPlayButton(vid);
  } else {
    setupAutoplay(vid);
  }
}


/* ── Safari path: tap-to-play overlay ──────────────────────── */
function setupSafariPlayButton(vid) {
  /*
   * Wrap the video in a positioned container so the play button
   * can be layered on top without touching the HTML markup.
   */
  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';
  vid.parentNode.insertBefore(wrapper, vid);
  wrapper.appendChild(vid);

  const btn = document.createElement('button');
  btn.className = 'video-play-btn';
  btn.setAttribute('aria-label', 'Play video');
  btn.innerHTML = `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="31" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.25"/>
      <polygon points="26,20 26,44 46,32" fill="currentColor"/>
    </svg>
  `;
  wrapper.appendChild(btn);

  btn.addEventListener('click', () => {
    btn.style.opacity       = '0';
    btn.style.pointerEvents = 'none';
    vid.play().catch(() => {});
  });
}


/* ── Non-Safari path: IntersectionObserver scroll-autoplay ─── */
function setupAutoplay(vid) {
  function isVisible() {
    const r = vid.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    return visible / r.height >= 0.3;
  }

  function tryPlay() {
    if (isVisible() && vid.paused)        vid.play().catch(() => {});
    else if (!isVisible() && !vid.paused) vid.pause();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) vid.play().catch(() => {});
      else                            vid.pause();
    }, { threshold: 0.3 }).observe(vid);
  }

  window.addEventListener('scroll',   tryPlay, { passive: true });
  window.addEventListener('touchend', tryPlay, { passive: true });
}


setupScrollVideo('keyFeatureVideo');
setupScrollVideo('finalDesignVideo');
