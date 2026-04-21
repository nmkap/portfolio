document.getElementById('footer-year').textContent = new Date().getFullYear();

(function () {
  const carousel = document.getElementById('personaCarousel');
  const track = carousel.querySelector('.persona-carousel-track');
  const hint = carousel.querySelector('.persona-scroll-hint');
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

  // Hide hint once user has scrolled
  track.addEventListener('scroll', () => {
    if (track.scrollLeft > 40) hint.style.opacity = '0';
    else hint.style.opacity = '';
  }, { passive: true });
})();

(function () {
  const vid = document.getElementById('keyFeatureVideo');

  function inView() {
    const r = vid.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  // Scroll handler is a synchronous user gesture — Safari allows play() here
  document.addEventListener('scroll', function () {
    if (inView()) { if (vid.paused) vid.play().catch(() => {}); }
    else           { vid.pause(); }
  }, { passive: true });

  // Chrome / Firefox: IntersectionObserver doesn't need a gesture
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) vid.play().catch(() => {});
      else vid.pause();
    }, { threshold: 0.1 }).observe(vid);
  }
})();

(function () {
  const vid = document.getElementById('finalDesignVideo');

  function inView() {
    const r = vid.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  document.addEventListener('scroll', function () {
    if (inView()) { if (vid.paused) vid.play().catch(() => {}); }
    else           { vid.pause(); }
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) vid.play().catch(() => {});
      else vid.pause();
    }, { threshold: 0.1 }).observe(vid);
  }
})();
