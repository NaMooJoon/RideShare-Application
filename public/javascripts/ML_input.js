


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//////////////////       MMMMMLLLLL_input            //////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// host -> 현재 창의 주소를 담고 있는 변수.
var host = window.location.protocol + "//" + window.location.host;
sendAjax(host + '/profile/user', "POST", function(data){
    let testdata ={
    Limit_person: "3",
    Location_end: "하나로마트",
    Location_start: "하나로마트",
    Repeat_ornot: "tue",
    Start_date: "",
    Start_time: "04:28 PM",
    comments: "dgsdg",
    label_id: 1628839690807000,
    li_id: 1628839690807,
    transport_way: "driver",
    }
    // 시작 input
      $('#Search-Cate-start')
      .dropdown('set selected',testdata.Location_start );
    // 도착 input
      $('#Search-Cate-end')
      .dropdown('set selected', testdata.Location_end);
      // 시간
      $(".timepicker").val(testdata.Start_time);
      // 요일 선택
      $('#week')
      .dropdown('set selected', [testdata.Repeat_ornot]);
      // 날짜
      $(".datepicker").val(testdata.Start_date);
      // 제한 인원
       document.querySelector("#mid").value = testdata.Limit_person;
      // 이용수단
      $('#Trans')
      .dropdown('set selected', testdata.transport_way);
    // comments
      document.querySelector("#Comments_input").value =testdata.comments;
});


var SavedGetData; 
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
// 출발지 검색 드롭다운 활성화
$('#Search-Cate-start')
  .dropdown({
    action: 'activate',
  

  })
;

// 도착지 검색 드롭다운 활성화
$('#Search-Cate-end')
  .dropdown({
    action: 'activate',
    

  })
;

// 타임 픽커 활성화
const timer = document.querySelector(".timepicker");
M.Timepicker.init(timer,{});

// 요일 선택 활성화
$('#week')
  .dropdown({
    maxSelections: 7
  })
;

// 날짜 픽커 활성화
const date = document.querySelector(".datepicker");
M.Datepicker.init(date,{});

// plus-minus 활성화
$(function(){
    $('input[type="number"]').niceNumber();
  });

// 이용 수단 활성화
  $('#Trans')
  .dropdown({
  })
;

let Sendarray = [];

// Submit button 클릭시 데이터 변수화 
$("#summitBT").click(function () {
    let PMValue = $("#mid").val();
    let StartLocation = $('#Search-Cate-start').dropdown('get value');
    let EndLocation = $('#Search-Cate-end').dropdown('get value');
    let TransValue = $('#Trans').dropdown('get value');
    
    let TextArea = $("#Comments_input").val();
    let Tinput = document.querySelector("#time");
    let TimeInput = Tinput.value;
    let Dinput = document.querySelector("#date");
    let DateInput = Dinput.value;
    let array1 = [TextArea,TimeInput,DateInput,PMValue,StartLocation,EndLocation,TransValue];
    let Sbutton = document.querySelector("#summitBT");
    // 공백있는지 확인
    let blank_TF = false;
    for (let element of array1) {
        if (element === ""){ blank_TF = true;  }
    } 
    
    console.log(TextArea,TimeInput,DateInput,PMValue,StartLocation,EndLocation,TransValue)

  /*   let Send_OBJ = {
        
        Location_start: StartLocation,
        Location_end:  EndLocation,
        Start_time: TimeInput,
        Repeat_ornot: week,
        Start_date: DateInput,
        Limit_person: PMValue,
        transport_way: TransValue,
        comments: TextArea,
        li_id: Date.now(),
        label_id: Date.now() * 1000,
    }
    Sendarray.push(Send_OBJ);
    saveDATA(); */

    // 버튼 눌렀을시 화면 넘기기
    if (blank_TF === false ){
      let Send_OBJ = {
        
        Location_start: StartLocation,
        Location_end:  EndLocation,
        Start_time: TimeInput,
        Repeat_ornot: "long", //because this json is from Long-distance, there is no Repeat
        Start_date: DateInput,
        Limit_person: PMValue,
        transport_way: TransValue,
        comments: TextArea,
        li_id: Date.now(),
        label_id: Date.now() * 1000,
    }
    Sendarray.push(Send_OBJ);
    saveDATA();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/main/create_list');
    xhr.onreadystatechange = function(){
      if(ResText.result === "ok"){
        window.location.href="/main"
       } else{
         console.log("오류! 서버로부터 ok받지 못함")
       }
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var data = '';
    data += 'Location_start='+ StartLocation;
    data += '&Location_end='+ EndLocation;
    data += '&Start_time='+ TimeInput;
    data += '&Repeat_ornot='+ "long";
    data += '&Limit_person='+ PMValue;
    data += '&transport_way='+ TransValue;
    data += '&comments='+ TextArea;
   

    xhr.send(data); 
      console.log("no blank"); 
      /* window.location.href="../../views/Main.html";  */
    } else {
      document.querySelector("#Blank_mes").innerHTML = "빈칸이 있습니다";
      alert("채우지 않은 빈칸이 있습니다.")
    }
     
}); 




// Data 화면 넘어갈때 초기화 안되도록 array update하기
const savedupdate = JSON.parse(localStorage.getItem("Datas"));
if (savedupdate!==null){
    Sendarray = savedupdate;
    
}
// Data를 localstorage에 저장 하기
function saveDATA(){
    
    localStorage.setItem("Datas",JSON.stringify(Sendarray));
}



