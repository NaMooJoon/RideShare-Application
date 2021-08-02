
// 서버에서 DATA joson으로 받기


    // $.ajax({
    //     url:'/main',
    //     dataType:'json',
    //     success:function(data){
    //      console.log(data)
    //     } 
    // })
// var xhr = new XMLHttpRequest();
// xhr.addEventListener('load', function(){
//     var result = JSON.parse(xhr.responseText);
//     console.log(result);
//     // if(result.result !== "ok") { alert(result.message); }
//     // else { window.location.href="http://localhost:3000/main"}
// });
//$.getJSON( "http://localhost:3000/main/data", function( data ) {
//    console.log("Input data ",data);
//});

//var data;
//$(function () {
//    $.getJSON("/main", function(json){
//       data = json;
//       console.log(" data : "+JSON.stringify(data));
//       $('#table').bootstrapTable({
//          data: data
//       });
//    });
//});

// host -> 현재 창의 주소를 담고 있는 변수.
var host = window.location.protocol + "//" + window.location.host;
sendAjax(host + '/main/data', "GET", function(Data){
    Makehtml(Data);
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

>>>>>>> be6ce456adc9228318365103858d10b850cc3c6d
/* let SavedGetData = data; */
// 받아온 Data 불러오기 (localstorage)
// if (SavedGetData!==null){
//     Makehtml(SavedGetData);
// }



// html 만들기 1
function Makehtml(Data_obj){
    Data_short = [];
    Data_long = [];
    console.log(Data_obj,"Data_obj")
    Data_obj.forEach(function(item) {
        if (item.Repeat_ornot ===""){
            Data_long.push(item)
        } else{
            Data_short.push(item)
        }
    });

    let Short_list = document.querySelector('#short-List-part');
    let Long_list = document.querySelector('#long-List-part');

    Short_list.innerHTML = Data_short.map((item) => createHTML(item)).join('')
    Long_list.innerHTML = Data_long.map((item) => createHTML(item)).join('')
/*     Data_obj.map((item) => {

        if(item.Repeat_ornot===""){
            console.log("long"); return createHTML(item)
        }
        else{
            console.log("short"); return createHTML(item)
        }}).join('')
     */
    
    
    let remove = document.querySelectorAll('.Arrow');   
    
   
    remove.forEach(function(item) {
      //item.addEventListener("click",deleteList ); 
      item.addEventListener("click",next ); 
    });
}

// html 만들기 2
function createHTML(item){
  
     let LI_ID = item.li_id;
     let LABEL_ID = item.label_id;
     let S_TEXT = item.Location_start;
     let E_TEXT = item.Location_end;
     let TIME_TEXT = item.Start_time;
     let WEEk = item.Repeat_ornot;
     return`
     <li id="${LI_ID}" class="list">
            <div class="L_Text">
                <div class="L_Top_Text"><span>${S_TEXT}</span><i class="fas fa-arrow-right"></i><span >${E_TEXT}</span></div>
                <div class="L_bottom_Text"><span class="Time">${TIME_TEXT}</span><span>${WEEk}</span></div> 
            </div>
            <div class="bu_arrow_wrap">
            <div class="ON_OFF">
                <input class="tgl tgl-ios" id="${LABEL_ID}" type="checkbox"/>
                <label class="tgl-btn" for="${LABEL_ID}" onclick="SendTFData(this.id)"></label>
            </div>
            <div class="Arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
             </div>
        </li>
        `;
    
 }
//////////////////////// 임시 함수
function next(event){
    window.location.href=host + '/ride-share'
}
//////////////////////// 임시 함수

 // list 삭제하기

 function deleteList(event){
    /* let li2 = event.target.parentElement; */
    let li2 = event.currentTarget.parentElement.parentElement;
    console.log(li2,"li2")
    console.log("remove")
    SavedGetData = SavedGetData.filter((List)=>List.li_id !== parseInt(li2.id));

    li2.remove();
    saveDATA();
}

// Data를 loclastorage에 저장하기
function saveDATA(){
    
    localStorage.setItem("Datas",JSON.stringify(SavedGetData));
}


// button plus controls

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'top',
      hoverEnabled: false
    });
  });

  let IDS = "1627354198623000"

console.log($(`input:checkbox[id=${IDS}]`).is(":checked"),"this2")

const Checkbox = document.querySelectorAll("label");
console.log(Checkbox)
Checkbox.onclick = function(){
    alert("hi")
}

function SendTFData(C_ID){
    console.log(C_ID,"id")
    console.log("TF")
}
 






