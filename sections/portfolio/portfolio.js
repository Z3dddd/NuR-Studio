(function () {
  const GRID_SELECTOR = '.portfolio-grid, .portfolio-all-grid';
  // Must be `.portfolio-grid .portfolio-item` (comma binds looser than space — the old
  // `.portfolio-grid, .portfolio-all-grid .portfolio-item` matched the grid div itself).
  const PORTFOLIO_ITEM_SELECTOR = '.portfolio-grid .portfolio-item, .portfolio-all-grid .portfolio-item';
  const DEBUG_CLICK_MARKER = false;
  let lb;
  let imgEl;
  let capEl;
  let btnClose;
  let btnPrev;
  let btnNext;
  let prevFocus;
  let built;
  let currentIndex = -1;
  let navigableItems = [];
  let debugMarker;

  function getNavigableItems() {
    return Array.from(document.querySelectorAll(PORTFOLIO_ITEM_SELECTOR)).filter(function (item) {
      return Boolean(item.querySelector('img.gallery-img'));
    });
  }

  function build() {
    if (built) return;
    built = true;
    lb = document.createElement('div');
    lb.id = 'portfolio-lightbox';
    lb.className = 'portfolio-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-hidden', 'true');
    lb.setAttribute('aria-label', 'Enlarged project image');
    lb.innerHTML =
      '<button type="button" class="portfolio-lightbox__nav portfolio-lightbox__nav--prev" aria-label="Previous image">‹</button>' +
      '<button type="button" class="portfolio-lightbox__nav portfolio-lightbox__nav--next" aria-label="Next image">›</button>' +
      '<button type="button" class="portfolio-lightbox__close" aria-label="Close">×</button>' +
      '<div class="portfolio-lightbox__inner">' +
      '<img class="portfolio-lightbox__img" alt="" decoding="async" />' +
      '<p class="portfolio-lightbox__caption"></p>' +
      '</div>';

    document.body.appendChild(lb);
    imgEl = lb.querySelector('.portfolio-lightbox__img');
    capEl = lb.querySelector('.portfolio-lightbox__caption');
    btnClose = lb.querySelector('.portfolio-lightbox__close');
    btnPrev = lb.querySelector('.portfolio-lightbox__nav--prev');
    btnNext = lb.querySelector('.portfolio-lightbox__nav--next');

    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    btnClose.addEventListener('click', function (e) {
      e.stopPropagation();
      close();
    });
    btnPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(currentIndex - 1);
    });
    btnNext.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(currentIndex + 1);
    });
  }

  function showDebugMarker(message) {
    if (!DEBUG_CLICK_MARKER) return;
    if (!debugMarker) {
      debugMarker = document.createElement('div');
      debugMarker.id = 'portfolio-debug-marker';
      debugMarker.style.position = 'fixed';
      debugMarker.style.left = '12px';
      debugMarker.style.bottom = '12px';
      debugMarker.style.zIndex = '10002';
      debugMarker.style.padding = '8px 12px';
      debugMarker.style.border = '1px solid rgba(201, 169, 110, 0.45)';
      debugMarker.style.background = 'rgba(10, 10, 10, 0.9)';
      debugMarker.style.color = '#e8d5b0';
      debugMarker.style.fontSize = '11px';
      debugMarker.style.fontFamily = 'Outfit, sans-serif';
      debugMarker.style.letterSpacing = '0.08em';
      debugMarker.style.textTransform = 'uppercase';
      debugMarker.style.pointerEvents = 'none';
      document.body.appendChild(debugMarker);
    }
    debugMarker.textContent = message;
    debugMarker.style.display = 'block';
    window.clearTimeout(showDebugMarker._t);
    showDebugMarker._t = window.setTimeout(function () {
      if (debugMarker) debugMarker.style.display = 'none';
    }, 1800);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(currentIndex - 1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(currentIndex + 1);
    }
  }

  function render(item) {
    const thumb = item.querySelector('img.gallery-img');
    if (!thumb) return;
    const src = thumb.currentSrc || thumb.getAttribute('src');
    if (!src) return;

    build();

    imgEl.src = src;
    imgEl.alt = thumb.getAttribute('alt') || '';

    const info = item.querySelector('.portfolio-info');
    if (info) {
      const h3 = info.querySelector('h3');
      const p = info.querySelector('p');
      const parts = [h3 && h3.textContent.trim(), p && p.textContent.trim()].filter(Boolean);
      capEl.textContent = parts.join(' · ');
      capEl.hidden = !capEl.textContent;
    } else {
      capEl.textContent = '';
      capEl.hidden = true;
    }
  }

  function goTo(index) {
    if (!navigableItems.length) return;
    const total = navigableItems.length;
    currentIndex = ((index % total) + total) % total;
    const currentItem = navigableItems[currentIndex];
    if (!currentItem) return;
    render(currentItem);
  }

  function open(item) {
    build();
    navigableItems = getNavigableItems();
    const foundIndex = navigableItems.indexOf(item);
    if (foundIndex < 0) return;

    prevFocus = document.activeElement;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('portfolio-lightbox-open');
    document.addEventListener('keydown', onKeydown);
    goTo(foundIndex);
    requestAnimationFrame(function () {
      btnClose.focus();
    });
  }

  function close() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('portfolio-lightbox-open');
    document.removeEventListener('keydown', onKeydown);
    imgEl.removeAttribute('src');
    currentIndex = -1;
    navigableItems = [];
    if (prevFocus && typeof prevFocus.focus === 'function') {
      try {
        prevFocus.focus();
      } catch (_) {}
    }
    prevFocus = null;
  }

  function openFromItem(item, e) {
    if (!item || !item.closest(GRID_SELECTOR)) return;
    if (!item.querySelector('img.gallery-img')) return;
    e.preventDefault();
    showDebugMarker('Portfolio click detected');
    open(item);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#portfolio-lightbox')) return;
    const item = e.target.closest(PORTFOLIO_ITEM_SELECTOR);
    if (!item) return;
    openFromItem(item, e);
  });
})();
