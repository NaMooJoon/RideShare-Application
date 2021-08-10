//const { registerCustomQueryHandler } = require("puppeteer");
const UserForm = document.querySelector("#formTAG");
const UsernameInput = document.querySelector("#input1");
const UserInfoInput = document.querySelector("#input2");
const WHOLE = document.querySelector('#Whole');
const After = document.querySelector('#after')
const BT = document.querySelector('#Button')
//
function StopAndSave(event){
    event.preventDefault();
    const DBusername = UsernameInput.value;
    const DBuserinfo = UserInfoInput.value;
    localStorage.setItem("username", DBusername);
    localStorage.setItem("userinfo", DBuserinfo);
}


const SavedUsername = localStorage.getItem("username");
const SavedUserinfo = localStorage.getItem("userinfo");

if (SavedUsername === null && SavedUserinfo===null){
    WHOLE.classList.remove("hidden");
    UserForm.addEventListener("submit",StopAndSave)
}
else{
    //window.location.href="../views/Main.html" // 이 페이지 뛰어넘는 코드
    /*  After.classList.remove("hidden"); */ // 신경식 유저님 환영합니다
                                
}

// host -> 현재 창의 주소를 담고 있는 변수.
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

sendAjax( host + '/profile/user' , "POST", function(users){
    console.log(users);
	UsernameInput.value = users[0].name;
    UserInfoInput.value = users[0].stID;

    BT.addEventListener("click", e => {
        e.preventDefault();
        saveImage(users[0].stID);
    });
});

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}


function saveImage(stID) {
    var $canvas = document.createElement('canvas');
    var imgDataUrl = $canvas.toDataURL('image/png');
    
    var blobBin = atob(imgDataUrl.split(',')[1]);	// base64 데이터 디코딩
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], {type: 'image/png'});	// Blob 생성
    var formdata = new FormData();	// formData 생성
    console.log(file);
    formdata.append("file", file, `${stID}`);	// file data 추가
    var png = blobToFile(file, 'test.png');
    console.log(png);

    console.log("폼데이터 쉬불", formdata.get("file"));
    // const test = document.querySelector("#testimg");
    // test.src = formdata;
    // console.dir(test);

    $.ajax({
        type : 'post',
        url : '/profile',
        data : formdata,
        //data: png,
        processData : false,	// data 파라미터 강제 string 변환 방지!!
        contentType : false,	// application/x-www-form-urlencoded; 방지!!
        success : function (data){
            alert("프로필 정보가 등록되었습니다.");
            window.location.href="/main";
        }
    })
    
}




//버튼 눌렀을시 다른 screen으로 가는 기능
//if onclik

const display = document.getElementById("canvas_display");
const canvas = document.getElementById("canvas");

function handleImageView(files){		
	var file = files[0];
	if(!file.type.match(/image.*/)){
		alert("not image file!");
        display.src="../public/images/profile_null.png"
	}			
	var reader = new FileReader();
	
	reader.onload = function(e){
		var img = new Image();
		img.onload = function(){
			var ctx = document.getElementById("canvas").getContext("2d");
            ctx.fillStyle = 'white'
            ctx.fillRect(0,0,250,250);
			ctx.drawImage(img,0,0,250,250);
		}
		img.src = e.target.result;
        display.src = e.target.result;
	}
	reader.readAsDataURL(file);
}
