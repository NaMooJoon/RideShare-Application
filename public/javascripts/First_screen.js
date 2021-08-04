const body_screen = document.getElementById("body_screen");
console.log(body_screen);
var deg = 45;
body_screen.style.background = 'linear-gradient(45deg, var(--main-blue), rgb(170, 210, 200))';

playAlert = setInterval(function() {
    deg = deg + 1.44;
    body_screen.style.background = 'linear-gradient(' + deg%360 + 'deg, var(--main-blue), rgb(170, 210, 200))';
}, 10);
