/** @format */
$(document).ready(() => {
  const serverURL = `http://${window.location.host}/assets`;
  // const serverURL = 'https://dianadi021.github.io/assets';

  $.getScript(serverURL + '/scripts/js/personal-function.js', () => {
    DisableRightClickOnMouse();
    BannerSwiper();
    CertificateSwiper();
  });

  $.getScript(serverURL + '/views/home.js', async () => {
    // await CommunityDisplay(serverURL);
    // await ProjectsDisplay(serverURL);
  });
});
