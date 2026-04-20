import { loadCSS, loadScript } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = block.closest('.custom-card-carousel-container');
  if (!container) return;

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  const swiper = document.createElement('div');
  swiper.className = 'swiper whaet-card-swiper';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  [...block.children].forEach((card) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide whaet-slide';
    slide.append(card);
    wrapper.append(slide);
  });

  swiper.append(
    wrapper,
    navArrow('swiper-button-prev'),
    navArrow('swiper-button-next')
  );

  block.innerHTML = '';
  block.append(swiper);

  const instance = new window.Swiper(swiper, {
    loop: true,
    centeredSlides: true,
    slidesPerView: 4,
    spaceBetween: 30,
    grabCursor: true,
    speed: 800,

    autoplay: {
      delay: 3800,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    coverflowEffect: {
      rotate: 0,
      stretch: -40,
      depth: 120,
      modifier: 1,
      slideShadows: false,
    },

    effect: 'coverflow',

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

function navArrow(cls) {
  const el = document.createElement('div');
  el.className = cls;
  return el;
}