/** @format */

const BannerSwiper = () => {
  const progressCircle = document.querySelector(".autoplay-progress svg");
  const progressContent = document.querySelector(".autoplay-progress span");
  const banner_swiper = new Swiper("#banner-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 7500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      autoplayTimeLeft(s, time, progress) {
        progressCircle.style.setProperty("--progress", 1 - progress);
        progressContent.textContent = `${Math.ceil(time / 1000)}s`;
      },
    },
  });
};

const CertificateSwiper = () => {
  const certificate_swiper = new Swiper("#certificate-swiper", {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
  });

  const certificate_swiper1 = new Swiper("#certificate-swiper1", {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: certificate_swiper,
    },
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
  });
};

let isHamburgerMenuOpen = false;
function TogglerMainMenuHamburger() {
  if (isHamburgerMenuOpen) {
    $("#main-menu").removeClass("active");
    $("#hamburger-menu").html("<i class='fa-solid fa-bars'></i>");
    isHamburgerMenuOpen = false;
  } else {
    $("#main-menu").attr("class", "active");
    $("#hamburger-menu").html("<i class='fa-solid fa-xmark'></i>");
    isHamburgerMenuOpen = true;
  }
}

function DisableRightClickOnMouse() {
  function disableselect(e) {
    return false;
  }

  function reEnable() {
    return true;
  }

  document.onselectstart = new Function("return false");

  if (window.sidebar) {
    document.onmousedown = disableselect;
    document.onclick = reEnable;
  }
}

function ModalBootstrap() {
  const exampleModal = document.getElementById("exampleModal");
  if (exampleModal) {
    exampleModal.addEventListener("show.bs.modal", (event) => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      const recipient = button.getAttribute("data-bs-whatever");
      // If necessary, you could initiate an Ajax request here
      // and then do the updating in a callback.

      // Update the modal's content.
      const modalTitle = exampleModal.querySelector(".modal-title");
      const modalBodyInput = exampleModal.querySelector(".modal-body input");

      modalTitle.textContent = `New message to ${recipient}`;
      modalBodyInput.value = recipient;
    });
  }
}
