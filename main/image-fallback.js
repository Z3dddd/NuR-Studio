// Shared image extension fallback for all site pages.
// Tries png -> jpg -> jpeg for any img in assets/images.
(function () {
  if (window.__imageFallbackInitialized) return;
  window.__imageFallbackInitialized = true;

  const exts = ['.png', '.jpg', '.jpeg'];
  const placeholderSvg = 'assets/svg/missing-image-placeholder.svg';
  const imgs = document.querySelectorAll('img[src*="assets/images/"], img[data-src-base]');

  imgs.forEach((img) => {
    const explicitBase = img.getAttribute('data-src-base');
    const srcAttr = img.getAttribute('src') || '';
    const base = explicitBase || srcAttr.replace(/\.(png|jpg|jpeg)$/i, '');
    if (!base || base === srcAttr) return;

    const currentExtMatch = (srcAttr.match(/\.(png|jpg|jpeg)$/i) || [null])[0];
    const preferredExt = currentExtMatch ? currentExtMatch.toLowerCase() : '';
    const orderedExts = preferredExt && exts.includes(preferredExt)
      ? [preferredExt].concat(exts.filter((ext) => ext !== preferredExt))
      : exts.slice();

    let idx = 0;
    const tryNext = () => {
      if (idx >= orderedExts.length) {
        img.onerror = null;
        if (img.classList.contains('hero-img-placeholder')) {
          img.remove();
          return;
        }
        img.classList.add('is-missing-image-placeholder');
        img.src = placeholderSvg;
        return;
      }
      img.src = `${base}${orderedExts[idx++]}`;
    };

    img.onerror = tryNext;
    tryNext();
  });
})();
