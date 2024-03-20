/** @format */

$(document).ready(() => {
  const domain = `${window.location.host}`;
  const [host, port] = domain.split(':');
  const path = port != 9000 ? `public/assets` : `public/assets`;
  const url = host.includes(`github.io`) ? `${domain}/${path}` : `http://${domain}/${path}`;

  $.getScript(`${url}/scripts/js/personal-function.js`, () => {
    DisableRightClickOnMouse();
    VerticalSwiper('.swiper.verticalSwiper');
    PerViewSwiper('.swiper.perViewSwiper');
  });

  $.getScript(`${url}/scripts/views/index.js`, () => {
    ModalRegistLoginUser();
    
    $('#loginUser').on('hidden.bs.modal', function (e) {
      $(this).find('input,textarea,select').val('').end().find('input[type=checkbox], input[type=radio]').prop('checked', '').end();
    });
    $('#registerUser').on('hidden.bs.modal', function (e) {
      $(this).find('input,textarea,select').val('').end().find('input[type=checkbox], input[type=radio]').prop('checked', '').end();
    });
  });

  if (host.includes(`github.io`) || port == 5500 || port == 9000) {
    $.getScript(`${url}/scripts/views/index.js`, async () => {
      await tes(domain);
    });
  }
});
