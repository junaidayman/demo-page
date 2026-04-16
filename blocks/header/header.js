import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;

    const expanded = navSections.querySelector('[aria-expanded="true"]');
    if (expanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      expanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;

    const expanded = navSections.querySelector('[aria-expanded="true"]');
    if (expanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  if (focused.className === 'nav-drop' && (e.code === 'Enter' || e.code === 'Space')) {
    const expanded = focused.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.default-content-wrapper > ul > li')
    .forEach((section) => section.setAttribute('aria-expanded', expanded));
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';

  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';

  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  const navDrops = navSections?.querySelectorAll('.nav-drop') || [];
  navDrops.forEach((drop) => {
    if (isDesktop.matches) {
      drop.setAttribute('tabindex', 0);
      drop.addEventListener('focus', focusNavSection);
    } else {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    }
  });

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta
    ? new URL(navMeta, window.location).pathname
    : '/nav';

  const fragment = await loadFragment(navPath);

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  ['brand', 'sections', 'tools'].forEach((c, i) => {
    if (nav.children[i]) nav.children[i].classList.add(`nav-${c}`);
  });

  /* =====================================================
   ✅ EXTRACT HEADER TOP TEXT
   ===================================================== */

  let headerTopContent;
  const navSections = nav.querySelector('.nav-sections');
  const contentWrapper = navSections?.querySelector('.default-content-wrapper');

  if (contentWrapper) {
    const paragraphs = contentWrapper.querySelectorAll(':scope > p');
    if (paragraphs.length) {
      headerTopContent = paragraphs[paragraphs.length - 1];
      headerTopContent.remove();
    }
  }

  /* =====================================================
   ✅ BUILD HEADER TOP BANNER
   ===================================================== */

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  if (headerTopContent) {
    const banner = document.createElement('div');
    banner.className = 'header-top-banner';

    const inner = document.createElement('div');
    inner.className = 'header-top-banner-wrapper';

    inner.append(headerTopContent);
    banner.append(inner);
    navWrapper.append(banner);
  }

  /* =====================================================
   ✅ NAV SECTION LOGIC (UNCHANGED)
   ===================================================== */

  navSections?.querySelectorAll('.default-content-wrapper > ul > li')
    .forEach((li) => {
      if (li.querySelector('ul')) li.classList.add('nav-drop');
      li.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = li.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          li.setAttribute('aria-expanded', !expanded);
        }
      });
    });

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () =>
    toggleMenu(nav, navSections, isDesktop.matches)
  );

  navWrapper.append(nav);
  block.append(navWrapper);
}