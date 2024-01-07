/** @format */
$(document).ready(() => {
  const domain = `${window.location.host}`;
  const [host, port] = domain.split(":");
  const path = port == 9000 ? `/assets` : `/public/assets`;
  const url = host.includes(`github.io`) ? `${domain}/${path}` : `http://${domain}/${path}`;

  $.getScript(`${url}/scripts/js/personal-function.js`, () => {
    DisableRightClickOnMouse();
    BannerSwiper();
    CertificateSwiper();
    ModalBootstrap();
  });

  if (host.includes(`github.io`) || port == 5500) {
    $.getScript(`${url}/views/home.js`, async () => {
      await CommunityDisplay(url);
      await ProjectsDisplay(url);
    });
  }
});
