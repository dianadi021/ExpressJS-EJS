/** @format */
$(document).ready(() => {
  // EXPRESS.JS SECTION
  const serverURL = `http://${window.location.host}/assets`;
  // FOR GITHUB SECTION
  // const serverURL = `http://${window.location.host}/public/assets`;
  // const serverURL = 'https://dianadi021.github.io/public/assets';

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
