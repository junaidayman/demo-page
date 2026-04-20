import { loadCSS, loadScript } from '../../scripts/aem.js';

export default async function decorate(block) {
  // ✅ Activate only for custom-card-carousel
  const section = block.closest('.custom-card-carousel');
  if (!section) return;

  const list = block.querySelector('ul');
  if (!list) return;

  /* Load Swiper */
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  /* Build Swiper DOM */
  const swiper = document.createElement('div');
  swiper.className = 'swiper cards-swiper';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  [...list.children].forEach((li) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide cards-slide';
    slide.append(li);
    wrapper.append(slide);
  });

  swiper.append(
    wrapper,
    createDiv('swiper-button-prev'),
    createDiv('swiper-button-next'),
  );

  block.innerHTML = '';
  block.append(swiper);

  /* Init Swiper */
  new window.Swiper(swiper, {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,

    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    breakpoints: {
      0: { slidesPerView: 1 },
      600: { slidesPerView: 2 },
      900: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  });
}

function createDiv(className) {
  const div = document.createElement('div');
  div.className = className;
  return div;
}