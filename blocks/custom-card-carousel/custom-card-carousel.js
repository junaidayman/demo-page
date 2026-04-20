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

  const cards = [...block.children];
  const totalSlides = cards.length;

  cards.forEach((card) => {
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

  /**
   * ✅ KEY FIXES
   * - slidesPerGroup: 1 → move ONE card per slide
   * - loopedSlides → base duplication
   * - loopAdditionalSlides → EXTRA buffer to avoid gaps
   */
  new window.Swiper(swiper, {
    loop: true,
    centeredSlides: true,

    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 30,

    loopedSlides: totalSlides,
    loopAdditionalSlides: totalSlides * 2,

    watchSlidesProgress: true,
    grabCursor: true,
    speed: 800,

    autoplay: {
      delay: 3800,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      stretch: -40,
      depth: 120,
      modifier: 1,
      slideShadows: false,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        centeredSlides: false,
      },
      600: {
        slidesPerView: 2,
        centeredSlides: false,
      },
      900: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

function navArrow(cls) {
  const el = document.createElement('div');
  el.className = cls;
  return el;
}