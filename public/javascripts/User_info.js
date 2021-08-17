const profile = document.querySelector(".profile_image_src");

// host -> 현재 창의 주소를 담고 있는 변수.
var host = window.location.protocol + "//" + window.location.host;

var result = window.location.pathname;
const path = result.split('/');
const id = path[path.length-1];


sendAjax(window.location.href, "POST", function(data){
	console.log(data);
	const username = data.name;
	const message = data.comments;
	const path1 = data.Location_start;
	const path2 = data.Location_end;
	const stID = data.stID;
	document.getElementById('name').innerHTML = username;
	document.getElementById('message').innerHTML = message;
	imageLoad('/images/profile/'+ stID +'.png');
	path1.src = "/image/nodata.png"
	path2.src = "/image/nodata.png"
});

function imageLoad(urlToFile) {
	console.log(urlToFile);
    $.ajax({
        url: urlToFile,
        type: 'HEAD',
        success: function () {
            profile.src = urlToFile;
        },
        error: function () {
            profile.src = `/images/profile_null.png`;
        }
   });
}

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


const body_screen = document.querySelector("body");

console.log(body_screen)
var deg = 45;

playAlert = setInterval(function() {
    deg = deg + 1;
    body_screen.style.background = 'linear-gradient(' + deg%360 + 'deg, var(--main-blue-40), rgba(150, 240, 220,0.4))';
}, 30);
