//const { registerCustomQueryHandler } = require("puppeteer");
const UserForm = document.querySelector("#formTAG");
const UsernameInput = document.querySelector("#input1");
const UserInfoInput = document.querySelector("#input2");
const WHOLE = document.querySelector('#Whole');
const After = document.querySelector('#after');
const BT = document.querySelector('#Button');
const display = document.querySelector('#profile_display');
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


document.getElementById('inputfile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    new Compressor(file, options);
    })


sendAjax( host + '/profile/user' , "POST", function(users){
    console.log(users);
	UsernameInput.innerHTML = users[0].name;
    UserInfoInput.innerHTML = users[0].stID;
    BT.addEventListener("click", e => {
        e.preventDefault();
        saveImage(users[0].stID, new File([result], result.name, { type: result.type }));
    });
});

const options = { maxWidth: 500, maxHeight: 500, success: function (result) { if (result.size > 5*1024*1024) {
    // 리사이징 했는데도 용량이 큰 경우
    alert("파일 용량이 초과되어 업로드가 불가 합니다."); return; } 
    const _URL = window.URL || window.webkitURL;
    if (_URL) {display.src = _URL.createObjectURL(result)} 
  }, error: function (err) { console.log(err)}}

function saveImage(stID, file){
    console.log("저장된 이미지",file)
    var formdata = new FormData();	// formData 생성
    formdata.append("file", file, `${stID}`+'.png');
    $.ajax({
        type : 'post',
        url : '../public/images/profile',
        data : formdata,
        processData : false,	// data 파라미터 강제 string 변환 방지!!
        contentType : false,	// application/x-www-form-urlencoded; 방지!!
        success : function (data){
            alert("프로필 정보가 등록되었습니다.");
        }
    })
}