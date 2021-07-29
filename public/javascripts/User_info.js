// const username = document.querySelector(".username")
// const profile = document.querySelector(".profile_image_src")
// const message = document.querySelector(".message_text")
// const path1 = document.querySelector(".start")
// const path2 = document.querySelector(".destination")



// host -> 현재 창의 주소를 담고 있는 변수.
var host = window.location.protocol + "//" + window.location.host;


sendAjax(host + '/ride-share/info/data', "GET", function(data){
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

// username.innerHTML = "김한동"
// message.innerHTML = "메세지는 여기에 표시됩니다."
// profile.src = "../public/images/nodata.png"
// path1.src = "../public/images/nodata.png"
// path2.src = "../public/images/nodata.png"
