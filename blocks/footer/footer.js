import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  const fragment = await loadFragment(footerPath);

  // Clear existing content
  block.textContent = '';

  const footer = document.createElement('div');
  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  block.append(footer);

  // ✅ Add semantic footer column classes
  decorateFooterColumns(block);
}

/**
 * ✅ Adds correct semantic classes to footer columns
 */
function decorateFooterColumns(block) {
  const columnsBlock = block.querySelector('.columns');
  if (!columnsBlock) return;

  columnsBlock.classList.add('footer-columns');

  // Each column
  const cols = columnsBlock.querySelectorAll(':scope > div > div');

  cols.forEach((col) => {
    col.classList.add('footer-col');

    const heading = col.querySelector('h2, h3, h4');

    // ✅ Column without heading = brand column
    if (!heading) {
      col.classList.add('footer-brand');
      return;
    }

    const headingText = heading.textContent.trim().toLowerCase();

    if (headingText.includes('service')) {
      col.classList.add('footer-services');
    } else if (headingText.includes('contact')) {
      col.classList.add('footer-contact');
    } else if (headingText.includes('gallery')) {
      col.classList.add('footer-gallery');
    } else {
      // Fallback (safe default)
      col.classList.add('footer-brand');
    }
  });
}