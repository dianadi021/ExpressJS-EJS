/** @format */

function DisableRightClickOnMouse() {
  function disableselect(e) {
    return false;
  }

  function reEnable() {
    return true;
  }

  document.onselectstart = new Function('return false');

  if (window.sidebar) {
    document.onmousedown = disableselect;
    document.onclick = reEnable;
  }
}

const VerticalSwiper = () => {
  const progressCircle = document.querySelector('.autoplay-progress svg');
  const progressContent = document.querySelector('.autoplay-progress span');
  var swiper = new Swiper('.verticalSwiper', {
    direction: 'vertical',
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      autoplayTimeLeft(s, time, progress) {
        progressCircle.style.setProperty('--progress', 1 - progress);
        progressContent.textContent = `${Math.ceil(time / 1000)}s`;
      },
    },
  });
};

const PerViewSwiper = () => {
  var swiper = new Swiper('.swiper.perViewSwiper', {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,
    centeredSlides: true,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};

const AutoProgressSwiperPerView = () => {
  var swiper = new Swiper('.swiper.autoProgressSwiper', {
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
    },
  });
};
