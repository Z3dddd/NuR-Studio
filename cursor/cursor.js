const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
function animRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); }
animRing();
document.querySelectorAll('a, button, .service-card, .portfolio-item, .process-step').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width = '14px'; cursor.style.height = '14px'; ring.style.width = '54px'; ring.style.height = '54px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width = '8px'; cursor.style.height = '8px'; ring.style.width = '36px'; ring.style.height = '36px'; });
});
