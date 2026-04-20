import { loadCSS, loadScript } from '../../scripts/aem.js';

export default async function decorate(block) {
  const wrapper = block.closest('.custom-card-carousel-wrapper');
  if (!wrapper) return;

  /* Load Swiper */
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  /* Create Swiper structure */
  const swiper = document.createElement('div');
  swiper.className = 'swiper custom-card-swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  [...block.children].forEach((item) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide custom-card-slide';
    slide.append(item);
    swiperWrapper.append(slide);
  });

  swiper.append(
    swiperWrapper,
    arrow('swiper-button-prev'),
    arrow('swiper-button-next'),
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

function arrow(className) {
  const btn = document.createElement('div');
  btn.className = className;
  return btn;
}