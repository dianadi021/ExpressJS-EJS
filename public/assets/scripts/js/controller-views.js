/** @format */

$(document).ready(() => {
  const domain = `${window.location.host}`;
  const [host, port] = domain.split(':');
  const path = port != 9000 ? `public/assets` : `public/assets`;
  const url = host.includes(`github.io`) ? `${domain}/${path}` : `http://${domain}/${path}`;

  $.getScript(`${url}/scripts/js/personal-function.js`, () => {
    DisableRightClickOnMouse();
    VerticalSwiper();
    PerViewSwiper();
  });

  if (host.includes(`github.io`) || port == 5500 || port == 9000) {
    $.getScript(`${url}/scripts/views/index.js`, async () => {
      await tes(domain);
    });
  }
});
