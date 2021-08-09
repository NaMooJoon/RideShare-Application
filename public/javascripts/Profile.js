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
    window.location.href="../../views/Main.html" // 이 페이지 뛰어넘는 코드
    /*  After.classList.remove("hidden"); */ // 신경식 유저님 환영합니다
                                      
}

function MovePage(){
    
    window.location.href="../../views/Main.html"
}
BT.addEventListener("click",MovePage);
//버튼 눌렀을시 다른 screen으로 가는 기능
//if onclik

const display = document.getElementById("canvas_display");
const canvas = document.getElementById("profile_canvas");

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
			var ctx = document.getElementById("profile_canvas").getContext("2d");
            ctx.fillStyle = 'white'
            ctx.fillRect(0,0,250,250);
			ctx.drawImage(img,0,0,250,250);
		}
		img.src = e.target.result;
        display.src = e.target.result;
	}
	reader.readAsDataURL(file);
}
