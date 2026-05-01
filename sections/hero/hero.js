(function () {
  const section = document.querySelector('.marquee-section');
  const track = document.querySelector('.marquee-track');
  if (!section || !track) return;

  const templateEl = track.querySelector('.marquee-group');
  if (!templateEl) return;
  const marqueeTemplate = templateEl.cloneNode(true);

  function layoutMarquee() {
    track.innerHTML = '';
    track.appendChild(marqueeTemplate.cloneNode(true));

    requestAnimationFrame(() => {
      const minW = section.getBoundingClientRect().width * 2.5;
      let guard = 0;
      while (track.scrollWidth < minW && guard < 48) {
        const g = marqueeTemplate.cloneNode(true);
        g.setAttribute('aria-hidden', 'true');
        track.appendChild(g);
        guard++;
      }
      if (track.children.length < 2) {
        const g = marqueeTemplate.cloneNode(true);
        g.setAttribute('aria-hidden', 'true');
        track.appendChild(g);
      }
      const total = track.children.length;
      track.style.setProperty('--marquee-shift', `-${100 / total}%`);
    });
  }

  layoutMarquee();

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(layoutMarquee, 120);
  });
})();
