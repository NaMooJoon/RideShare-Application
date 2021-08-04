// const username = document.querySelector(".username")
// const profile = document.querySelector(".profile_image_src")
// const message = document.querySelector(".message_text")
// const path1 = document.querySelector(".start")
// const path2 = document.querySelector(".destination")



// host -> 현재 창의 주소를 담고 있는 변수.
var host = window.location.protocol + "//" + window.location.host;

var result = window.location.pathname;
const path = result.split('/');
const id = path[path.length-1];


sendAjax(host + `/ride-share/${id}/data`, "GET", function(data){
	console.log(data);
	const username = data.name;
	const message = data.comments;
	const path1 = data.Location_start;
	const path2 = data.Location_end;
	document.getElementById('name').innerHTML = username;
	document.getElementById('message').innerHTML = message;
});



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


const body_screen = document.querySelector(".screen");

console.log(body_screen)
var deg = 45;

playAlert = setInterval(function() {
    deg = deg + 1;
    body_screen.style.background = 'linear-gradient(' + deg%360 + 'deg, var(--main-blue), rgb(150, 240, 220))';
}, 30);
