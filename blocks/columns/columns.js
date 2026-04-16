export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns and text feature lists
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {

      // 1. Existing Logic: Handle Image Columns
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }

      // 2. Existing Feature Logic (UNCHANGED)
      const children = [...col.children];
      let featuresContainer = null;
      let currentContentWrapper = null;

      children.forEach((el) => {
        const isButton = el.classList.contains('button-wrapper');
        const hasIcon = el.querySelector('.icon') && !isButton;

        if (hasIcon) {
          if (!featuresContainer) {
            featuresContainer = document.createElement('div');
            featuresContainer.classList.add('columns-feature-list');
            el.before(featuresContainer);
          }

          const featureItem = document.createElement('div');
          featureItem.classList.add('columns-feature-item');

          const iconWrapper = document.createElement('div');
          iconWrapper.classList.add('columns-feature-icon');
          iconWrapper.append(el);

          currentContentWrapper = document.createElement('div');
          currentContentWrapper.classList.add('columns-feature-content');

          featureItem.append(iconWrapper, currentContentWrapper);
          featuresContainer.append(featureItem);

        } else if (currentContentWrapper && !isButton) {
          currentContentWrapper.append(el);

          if (el.querySelector('strong') || el.tagName.match(/^H[1-6]$/i)) {
            el.classList.add('columns-feature-title');
          } else {
            el.classList.add('columns-feature-desc');
          }

        } else if (isButton) {
          currentContentWrapper = null;
        }
      });
    });
  });

  /* =====================================================
     ✅ COUNT‑UP ANIMATION (SAFE ADDITION)
     ===================================================== */

  const counters = block.querySelectorAll('h3');

  const animateCounter = (el) => {
    const originalText = el.textContent.trim();
    const match = originalText.match(/([\d.]+)/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = originalText.replace(match[1], '');

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = originalText; // ensure final value exactly matches authoring
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}