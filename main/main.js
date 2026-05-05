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

// Mobile menu toggle (hamburger)
(() => {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!navbar || !toggle || !menu) return;

  function setOpen(open) {
    navbar.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function closeMenu() {
    setOpen(false);
  }

  function openMenu() {
    setOpen(true);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navbar.classList.contains('nav-open');
    setOpen(!isOpen);
  });

  // Close when tapping outside the navbar.
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) closeMenu();
  });

  // Close when the user chooses a menu link.
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) closeMenu();
  });

  // Close when tapping other navbar links too (e.g., CTA).
  navbar.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => closeMenu());
  });

  // Close on Escape.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Ensure it’s closed when resizing to desktop widths.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeMenu();
  });

  // Auto-close menu when user scrolls.
  window.addEventListener(
    'scroll',
    () => {
      if (navbar.classList.contains('nav-open')) closeMenu();
    },
    { passive: true }
  );
})();
