// Shared image extension fallback for all site pages.
// Tries png -> jpg -> jpeg (preferred order follows the extension in `src` when present).
(function () {
  if (window.__imageFallbackInitialized) return;
  window.__imageFallbackInitialized = true;

  const exts = ['.png', '.jpg', '.jpeg'];
  const imgs = document.querySelectorAll('img[src*="assets/images/"], img[data-src-base]');

  imgs.forEach((img) => {
    const explicitBase = img.getAttribute('data-src-base');
    const srcAttr = img.getAttribute('src') || '';
    const base = explicitBase || srcAttr.replace(/\.(png|jpg|jpeg)$/i, '');
    if (!base) return;
    if (!explicitBase && base === srcAttr) return;
    if (srcAttr.trim() && img.complete && img.naturalWidth > 0) {
      return;
    }

    const currentExtMatch = (srcAttr.match(/\.(png|jpg|jpeg)$/i) || [null])[0];
    const preferredExt = currentExtMatch ? currentExtMatch.toLowerCase() : '';
    const orderedExts =
      preferredExt && exts.includes(preferredExt)
        ? [preferredExt].concat(exts.filter((ext) => ext !== preferredExt))
        : exts.slice();

    let idx = 0;

    const tryNext = () => {
      while (idx < orderedExts.length) {
        const candidate = `${base}${orderedExts[idx++]}`;
        const current = img.getAttribute('src') || '';
        if (candidate !== current) {
          img.src = candidate;
          return;
        }
      }
      img.onerror = null;
      img.remove();
    };

    img.onerror = tryNext;
    img.addEventListener(
      'load',
      function () {
        img.onerror = null;
      },
      { once: true }
    );

    if (!srcAttr.trim()) {
      idx = 0;
      tryNext();
    } else if (img.complete && img.naturalWidth === 0) {
      idx = 0;
      tryNext();
    }
  });
})();
