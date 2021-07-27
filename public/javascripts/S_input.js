

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//////////////////              S_input            //////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

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
    let week =$("#weekinput").val();
    let TextArea = $("#Comments_input").val();
    let Tinput = document.querySelector("#time");
    let TimeInput = Tinput.value;
    let Dinput = document.querySelector("#date");
    let DateInput = Dinput.value;
    let array1 = [TextArea,TimeInput,DateInput,PMValue,week,StartLocation,EndLocation,TransValue];
    let Sbutton = document.querySelector("#summitBT");
    // 공백있는지 확인
    let blank_TF = false;
    for (let element of array1) {
        if (element === ""){ blank_TF = true;  }
    } 
    
    console.log(TextArea,TimeInput,DateInput,PMValue,week,StartLocation,EndLocation,TransValue)

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
        Repeat_ornot: week,
        Start_date: DateInput,
        Limit_person: PMValue,
        transport_way: TransValue,
        comments: TextArea,
        li_id: Date.now(),
        label_id: Date.now() * 1000,
    }
    Sendarray.push(Send_OBJ);
    saveDATA();

      console.log("no blank",
      // window.location.href="../../views/Main.html"
      //window.location.href="/main/create_list"
      ); 
    } else {
      document.querySelector("#Blank_mes").innerHTML = "빈칸이 있습니다";
      alert("채우지 않은 빈칸이 있습니다.")
    }
   
    /* var xhr = new XMLHttpRequest();
    xhr.open('POST', '/main/create_list');
    xhr.onreadystatechange = function(){
         document.querySelector('#time').innerHTML = xhr.responseText; 
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var data = '';
    data += 'timezone='+"TESTDATA1";
    data += '&format='+"TESTDATA";
    data += 'Location_start='+ StartLocation;
    data += '&Location_end='+ StartLocation;
    data += '&Start_time='+ StartLocation;
    data += '&Repeat_ornot='+ StartLocation;
    data += '&Limit_person='+ StartLocation;
    data += '&transport_way='+ StartLocation;
    data += '&comments='+ StartLocation;
    data += '&li_id='+ StartLocation;
    data += '&label_id='+ StartLocation;
    Location_end:  EndLocation,
    Start_time: TimeInput,
    Repeat_ornot: week,
    Start_date: DateInput,
    Limit_person: PMValue,
    transport_way: TransValue,
    comments: TextArea,
    li_id: Date.now(),
    label_id: Date.now() * 1000,
    xhr.send(data);  */
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

// Data 서버에 보내기






/* JSON 형식으로 줄것 */
/* {
    Location_start: string으로 ex) 커피유야
    Location_end:  string으로 ex) 커피유야
    Start_time:  00:00 PM  형식으로 ex) 04:45 AM
    Repeat_ornot: 만약 월,화 선택시 - mon,tue / 한번실행 선택시 - Once 
    Start_date: 월(영어 3글자) 일(숫자 2글자) 년(2021) 형식으로 ex) Jul 08
    Limit_person: 숫자 ex) 3
    transport_way: 영어형식으로 ex) 탑승자면 rider 버스면 bus
    comments: string 형식으로 ex) 안녕하세요 신경식 입니다.
}
 */

/* Limit_person: "5"
Location_end: "하나로마트"
Location_start: "그랜드할인마트"
Repeat_ornot: "mon,tue"
Start_date: "Jul 08, 2021"
Start_time: "02:54 PM"
comments: "안녕하세요 카풀 구해요!!"
transport_way: "rider" */


/* let year = $('.datepicker').pickadate('picker').get('highlight', 'yyyy');
let day = $('.datepicker').pickadate('picker').get('highlight', 'dd');
let month = $('.datepicker').pickadate('picker').get('highlight', 'mm');
 console.log(year,day,month) */



