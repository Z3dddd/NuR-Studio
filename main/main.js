// Ensure gallery link navigates (uses resolved URL; works for file:// and hosted sites).
(function () {
  const link = document.getElementById('view-all-projects');
  if (!link) return;
  link.addEventListener(
    'click',
    function (e) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      window.location.assign(link.href);
    },
    true
  );
})();

// Navbar scroll (rAF + hysteresis so the bar doesn’t flicker at the threshold)
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const ON = 88;
  const OFF = 18;
  let ticking = false;
  function update() {
    const y = window.scrollY || 0;
    if (navbar.classList.contains('scrolled')) {
      if (y < OFF) navbar.classList.remove('scrolled');
    } else {
      if (y > ON) navbar.classList.add('scrolled');
    }
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));
