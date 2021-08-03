const body_screen = document.getElementById("body_screen");
console.log(body_screen)
var deg = 45;

playAlert = setInterval(function() {
    deg = deg + 1;
    body_screen.style.background = 'linear-gradient(' + deg%360 + 'deg, var(--main-blue), rgb(150, 255, 220))';
}, 30);
