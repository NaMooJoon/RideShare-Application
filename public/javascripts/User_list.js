const locname = "포항역"
const locimage = "https://railwaynomad.com/wp-content/uploads/2015/04/Pohong_station03.jpg"


document.querySelector("div.loc_and_image span").innerHTML=locname
document.querySelector("div.loc_and_image img").src=locimage

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

/*
"user_name":"신경식",
"profile_img":"https://www.fnnews.com/resource/media/image/2020/11/20/202011200752197268_l.jpg",
"Limit_person": 4,
"Current_person" : 2,
"Location_end": "서울",
"Location_start": "포항",
"Repeat_ornot": "wed,thu,sat",
"Start_date": "Jul 14, 2021",
"Start_time": "05:34 PM",
"comments": "코로나 천국 서울로 떠나실 분~",
"label_id": 1627284879581000,
"li_id": 1627284879581,
"transport_way": "ktx"
*/ 
sendAjax( window.location.href , "POST", function(users){
	console.log(users);
    iterate_createitem(users);
});


var goUserinfo = function(li_id) {
    window.location.href=host + '/ride-share/list/' + li_id;
}

function iterate_createitem(users){
    for (var i = 0; i < users.length; i++) { //받아온 JSON을 리스트에 띄우는 for문
        setProperties(users[i].stID,users[i].name, users[i].profile_img, users[i].transport_way, users[i].Location_start, users[i].Location_end, users[i].comments, users[i].Current_person, users[i].Limit_person, users[i].li_id);
        
        const layout = document.getElementsByClassName("user_item_layout");
        const userlist = document.getElementsByClassName("screen");
        let newitem = document.createElement('div');
        newitem.className ="useritem";
        newitem.innerHTML = layout[0].innerHTML;
        userlist[0].append(newitem);
    }
}


//아이템 속성설정 함수 시작
function setProperties(stID,name, img, way, startloc, destination, message, usernum, maxnum, li_id) {
    document.querySelector("div.user_item_layout span.nametext").innerHTML=name
    document.querySelector("div.user_item_layout img.profile").src='/images/profile/'+stID
    document.querySelector("div.user_item_layout div.svgico img").src="/images/"+way+".svg"
    document.querySelector("div.user_item_layout span.loctext").innerHTML=startloc + " ➔ " + destination
    document.querySelector("div.user_item_layout span.message").innerHTML=message
    document.querySelector("div.user_item_layout  span.peoplenum").innerHTML="("+usernum+"/"+maxnum+")"
    document.querySelector("div.user_item_layout .findbutton").setAttribute('onclick','goUserinfo('+li_id+')')
    console.log(li_id, message);
    if(message.length >= 50){
        document.querySelector("div.user_item_layout span.message").innerHTML= message.substr(0,50)+"...";
    }
    if (!img) {
        document.querySelector("div.user_item_layout img.profile").src="/images/profile_null.png"
    }
} //아이템 속성설정 함수 종료


function chatButtonClick(){
    location.href="Main.html";
}


function refreshClick(){
    location.reload();  
}


var strCook = document.cookie;//저장된 쿠키 값을 받아온다.
if(strCook.indexOf("!~")!=0) {
var intS = strCook.indexOf("!~");
var intE = strCook.indexOf("~!");
var strPos = strCook.substring(intS+2, intE);//스크롤 위치를 구한다.
document.body.scrollTop = strPos;//스크롤 위치를 적용시킨다.
}

// document.plan6.resizeFrame(this);
// function SetDivPosition(){
//  var intY = document.body.scrollTop;
//  document.cookie = "yPos=!~"+intY+"~!";
// }


refbtn = document.querySelector(".refresh_btn");

refbtn.addEventListener("click", function(e) {
  e.preventDefault;
  refbtn.classList.remove("jello");
  refbtn.offsetWidth = refbtn.offsetWidth;
  refbtn.classList.add("jello");
}, false);



/* 테스트용 함수
function testclick(){
    const a = document.querySelector("input#test1");
    const b = document.querySelector("input#test2");
    const c = document.querySelector("input#test3");
    const d = document.querySelector("input#test4");
    const e = document.querySelector("input#test5");
    const f = document.querySelector("input#test6");
    const g = document.querySelector("input#test7");
    const h = document.querySelector("input#test8");
    createitem(a.value, b.value, c.value, d.value, e.value, f.value, g.value, h.value);
}
*/
/*
const users = [ //임시 JSON
    {
        "user_name":"정예준",
        "profile_img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLnYEyAaorqDHlLxKkZs6DModPkdH3uYIUCg&usqp=CAU",
        "Limit_person": 4,
        "Current_person" : 1,
        "Location_end": "그랜드할인마트",
        "Location_start": "커피유야",
        "Repeat_ornot": "wed,thu,sat",
        "Start_date": "Jul 14, 2021",
        "Start_time": "05:34 PM",
        "comments": "그할마 가시는분 있나요",
        "label_id": 1627284879581000,
        "li_id": 1627284879581,
        "transport_way": "rider"
    },
    {
        "user_name":"신경식",
        "profile_img":"https://www.fnnews.com/resource/media/image/2020/11/20/202011200752197268_l.jpg",
        "Limit_person": 4,
        "Current_person" : 2,
        "Location_end": "서울",
        "Location_start": "포항",
        "Repeat_ornot": "wed,thu,sat",
        "Start_date": "Jul 14, 2021",
        "Start_time": "05:34 PM",
        "comments": "코로나 천국 서울로 떠나실 분~",
        "label_id": 1627284879581000,
        "li_id": 1627284879581,
        "transport_way": "ktx"
    },
    {
        "user_name":"김준현",
        "profile_img":"https://i.pinimg.com/236x/dd/5b/5c/dd5b5cda2e670c25f9c81b35d1e2ee59.jpg",
        "Limit_person": 4,
        "Current_person" : 1,
        "Location_end": "그랜드할인마트",
        "Location_start": "한동대학교",
        "Repeat_ornot": "wed,thu,sat",
        "Start_date": "Jul 14, 2021",
        "Start_time": "05:34 PM",
        "comments": "비벤오흡 -> 그할마 1000원",
        "label_id": 1627284879581000,
        "li_id": 1627284879581,
        "transport_way": "driver"
    },
    {
        "user_name":"강신엽",
        "profile_img":"http://www.topstarnews.net/news/photo/201903/605643_291152_4633.jpg",
        "Limit_person": 4,
        "Current_person" : 1,
        "Location_end": "대구",
        "Location_start": "포항",
        "Repeat_ornot": "wed,thu,sat",
        "Start_date": "Jul 14, 2021",
        "Start_time": "05:34 PM",
        "comments": "마 시외버스 타고 대구갈 아 있나?마 시외버스 타고 대구갈 아 있나?마 시외버스 타고 대구갈 아 있나?마 시외버스 타고 대구갈 아 있나?마 시외버스 타고 대구갈 아 있나?마 시외버스 타고 대구갈 아 있나?마 시외버스 타고 대구갈 아 있나?",
        "label_id": 1627284879581000,
        "li_id": 1627284879581,
        "transport_way": "bus"
    },
    {
        "user_name":"엄준식",
        "profile_img":"data:image/jpeg;base64,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",
        "Limit_person": 4,
        "Current_person" : 2,
        "Location_end": "서울",
        "Location_start": "포항",
        "Repeat_ornot": "wed,thu,sat",
        "Start_date": "Jul 14, 2021",
        "Start_time": "05:34 PM",
        "comments": "택시타고 서울까지 flex할 사람 구함",
        "label_id": 1627284879581000,
        "li_id": 1627284879581,
        "transport_way": "taxi"
    },
    {
        "user_name":"이한동",
        "profile_img":"https://fimg3.pann.com/new/download.jsp?FileID=34266676",
        "Limit_person": 4,
        "Current_person" : 3,
        "Location_end": "그랜드할인마트",
        "Location_start": "커피유야",
        "Repeat_ornot": "wed,thu,sat",
        "Start_date": "Jul 14, 2021",
        "Start_time": "05:34 PM",
        "comments": "그할마가는분?",
        "label_id": 1627284879581000,
        "li_id": 1627284879581,
        "transport_way": "rider"
    },
    {
        "user_name":"김한동",
        "profile_img":"https://newsimg.sedaily.com/2019/05/22/1VJ8PU7XCR_5.jpg",
        "Limit_person": 4,
        "Current_person" : 1,
        "Location_end": "대전",
        "Location_start": "포항",
        "Repeat_ornot": "wed,thu,sat",
        "Start_date": "Jul 14, 2021",
        "Start_time": "05:34 PM",
        "comments": "대전갈사람~~",
        "label_id": 1627284879581000,
        "li_id": 1627284879581,
        "transport_way": "ktx"
    }
]
*/