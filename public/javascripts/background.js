const body_screen = document.querySelector(".background");
var deg = 45;
body_screen.style.position = "fixed"
body_screen.style.top = "0px"
body_screen.style.width = "100vw"
body_screen.style.height = "100vh"
body_screen.style.zIndex = -10000;
playAlert = setInterval(function() {
    deg = deg + 1;
    body_screen.style.background = 'linear-gradient(' + deg%360 + 'deg, var(--main-blue-20), rgba(160, 250, 230,0.3))';
}, 20);