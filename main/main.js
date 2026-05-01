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

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); });

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));
