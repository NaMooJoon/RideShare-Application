const body_screen = document.getElementById("body_screen");
console.log(body_screen);
var deg = 45;
body_screen.style.background = 'linear-gradient(45deg, var(--main-blue), rgb(135, 232, 200))';

playAlert = setInterval(function() {
    deg = deg + 1.44;
    body_screen.style.background = 'linear-gradient(' + deg%360 + 'deg, var(--main-blue),rgb(135, 232, 200))';
}, 10);

var host = window.location.protocol + "//" + window.location.host;

function sendAjax(url, method, call) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, url);

	var data = null;
    xhr.send(data);

    xhr.addEventListener('load', function(){
        const result = JSON.parse(xhr.responseText);
		console.log("Getting data success!", result);
		call(result);
    });
};


setTimeout(function() {
    sendAjax(host + '/data', "GET", function(result){
        if (result.user === undefined){
            window.location.href = "/login";
        }else{
            window.location.href = "/main"
        }
});
 }, 3300);
