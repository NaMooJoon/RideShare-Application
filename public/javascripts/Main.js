// host -> 현재 창의 주소를 담고 있는 변수.
//이거 다시 회복
var host = window.location.protocol + "//" + window.location.host;
sendAjax(host + '/main/data', "GET", function(Data){
    Makehtml(Data, function(){
      swipe();
    });
});  
// 이거 다시 회복

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

// 토글 버튼 클릭시 서버로 데이터 전송
//https://ourcstory.tistory.com/161 블로그 주소

/* let params = {Test1: "data1",Test2:"data2"};
$("#Serch")
$.ajax({ 
    url:"/main/toggle", 
         type:"POST", data:JSON.stringify(params), 
         contentType: "application/json", 
         success: function(result) {
              if (result) 
              { console.log("저장되었습니다."); } 
              else { console.log("잠시 후에 시도해주세요."); } 
            }, 
            error: function() { console.log("에러 발생"); } 
        }) */



// let SavedGetData = data; 
// let SavedGetData = JSON.parse(localStorage.getItem("Datas"));
// /* 받아온 Data 불러오기 (localstorage) */
// if (SavedGetData!==null){
//     Makehtml(SavedGetData);
// }
 

// html 만들기 1
function Makehtml(Data_obj, callback){
    Data_short = [];
    Data_long = [];
    console.log(Data_obj,"Data_obj")
    Data_obj.forEach(function(item) {
        if (item.Repeat_ornot === "long"){
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
    
    
    let arrow = document.querySelectorAll('.Arrow');   
    
   // Arrow 클릭시 AJAX함수 실행
    arrow.forEach(function(item) {
      /* item.addEventListener("click",deleteList );  */
      item.addEventListener("click",next );  //서버's 코드
    });

    // toggle 버튼 클릭시 AJAX함수 실행
   
    let toggle_bt = document.querySelectorAll(".ON_OFF input");
    console.log(toggle_bt,"toggle_bt")
    toggle_bt.forEach(function(item){
    item.addEventListener("click", CheckToggle)
    });

    // 삭제 버튼 클릭시 AJAX함수 실행
    let remove = document.querySelectorAll('.deleteBT'); 
    console.log("remove!!!",remove)
    remove.forEach(function(item) {
        item.addEventListener("click",removeAjax );  
      });

    // 수정 버튼 클릭시 AJAX 함수 실행
    let revise = document.querySelectorAll('.reviseBT'); 
    console.log("수정!!",revise)
    revise.forEach(function(item) {
        item.addEventListener("click",reviseAjax );  
      });
    
    callback();
}

// html 만들기 2
function createHTML(item){
  
     let LI_ID = item.li_id;
     /* let LABEL_ID = item.label_id; */
     let LABEL_ID = "Label" + String(item.li_id) 
     let S_TEXT = item.Location_start;
     let E_TEXT = item.Location_end;
     let TIME_TEXT = item.Start_time;
     let WEEk = item.Repeat_ornot;
     let TO_TF_SEVER = item.label_onoff;
     if (TO_TF_SEVER===1){
         TO_TF = "checked"
     } else{
         TO_TF = ""
     }
    /*  return`
     <li id="${LI_ID}" class="list">
            <div class="L_Text">
                <div class="L_Top_Text"><span>${S_TEXT}</span><i class="fas fa-arrow-right"></i><span >${E_TEXT}</span></div>
                <div class="L_bottom_Text"><span class="Time">${TIME_TEXT}</span><span>${WEEk}</span></div> 
            </div>
            <div class="bu_arrow_wrap">
            <div class="ON_OFF">
                <input class="tgl tgl-ios" id="${LABEL_ID}" type="checkbox" ${TO_TF} />
                <label class="tgl-btn" for="${LABEL_ID}"></label>
            </div>
            <div class="Arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
             </div>
        </li>
        `; */
        return`
        <div id="${LI_ID}" class="test-wrapper">
          <ul id="test" class="list">
            <li class="list__item">
              <div class="list__item-text">
                <li  class="swiper-slide" >
                    <div class="L_Text">
                        <div class="L_Top_Text"><span>${S_TEXT}</span><i class="fas fa-arrow-right"></i><span >${E_TEXT}</span></div>
                        <div class="L_bottom_Text"><span class="Time">${TIME_TEXT}</span><span>${WEEk}</span></div>
                    </div>
                    <div class="bu_arrow_wrap">
                    <div class="ON_OFF">
                        <input class="tgl tgl-ios" id="${LABEL_ID}" type="checkbox" ${TO_TF}/>
                        <label class="tgl-btn" for="${LABEL_ID}"></label>
                    </div>
                    <div class="Arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                     </div>
                     <div class="list__item-action">
                       <span class="deleteBT" >삭제</span>
                       <span class="reviseBT">수정</span>
                     </div>
                    
                    </li>
              </div>
            </li>
        </ul>
      </div>
    `;
 }
 //onclick="SendTFData(this.id)




// toggle 버튼 눌렀을때 AJAX함수: 
function CheckToggle(event){
   let List_tog = event.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement;
    console.log(List_tog,"pick");
   let LIST_ID_to = List_tog.id;
   let toggle_bt_ID = event.currentTarget.id;
   let toggle_TF = event.currentTarget.checked;
   console.log("ForEach-LI_ID:",LIST_ID_to);
   console.log("ForEach-toggle_ID:",toggle_bt_ID);
   console.log("ForEach-toggle_TF:",toggle_TF);
   TO_DATA = {li_id:LIST_ID_to,
            label_onoff:toggle_TF}
   $.ajax({ 
    url:"/main/toggle", 
         type:"POST", data:JSON.stringify(TO_DATA), 
         contentType: "application/json", 
         success: function(result) {
              if (result) 
              { console.log("저장되었습니다."); } 
              else { console.log("잠시 후에 시도해주세요."); } 
            }, 
            error: function() { console.log("에러 발생"); } 
        })
 };
 // Arrow 눌렀을때 AJAX함수: 서버에게 lI_id 전송 
function next(event){
    let li_pick = event.currentTarget.parentElement.parentElement.parentElement.parentElement;
    console.log("LIST_PICK",li_pick.id)
    window.location.href = host + '/ride-share/' + li_pick.id;
    // $.ajax({ 
    //     url:"/main/toggle", 
    //          type:"POST", data:JSON.stringify(LI_ID_ARROW_JOSON), 
    //          contentType: "application/json", 
    //          success: function(result) {
    //               if (result) 
    //               { console.log("저장되었습니다."); } 
    //               else { console.log("전달실패"); } 
    //             }, 
    //             error: function() { console.log("에러 발생"); } 
    //         })

}
// 삭제 버튼 눌렀을때 AJAX 함수
function removeAjax(event){
    let li_from_de = event.currentTarget.parentElement.parentElement.parentElement.parentElement;
    console.log("delete",li_from_de)
    $.ajax({ 
          url:`/main/${li_from_de.id}`, 
               type:"delete", data:null, 
             
               success: function(result) {
                    if (result) 
                    { console.log("저장되었습니다.",result);  } 
                    else { console.log("전달실패",result); } 
                  }, 
                  error: function() { console.log("에러 발생"); } 
              })
}
// 수정 버튼 눌렀을때 AJAX함수
function reviseAjax(event){
  let li_from_vi = event.currentTarget.parentElement.parentElement.parentElement.parentElement;
  console.log("update",li_from_vi)
  $.ajax({ 
        url:`/main/${li_from_vi.id}`, 
             type:"update", data:null, 
           
             success: function(result) {
                  if (result) 
                  { console.log("저장되었습니다.",result);  } 
                  else { console.log("전달실패",result); } 
                }, 
                error: function() { console.log("에러 발생"); } 
            })
}

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







// 스와이프 코드
console.log($('#test li'),"swipe")
function swipe(){
  $(function () {
      $('#test li').swipe({
        swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
          if (direction === 'right') {
            if (!$(this).hasClass('active')) {console.log("active true"); return;}  //.hasClass() 메서드는 선택한 요소에 클래스가 있는지 확인합니다. 리턴값:불린

            $(this)
              .stop(true)
              .css({
                transition: 'all .1s ease-out',
                transform: `translate3d(-${200 - distance}px, 0px, 0px)`,
              });

            if ((phase === 'cancel' || phase === 'end') && distance >= 200) {
              console.log("cancel or end dis>=200")
              $(this).stop(true).css({
                  transform: `translate3d(0px, 0px, 0px)`,
                  
                })
                .removeClass('active');

              setTimeout(() => {
                $(this).stop(true).css({
                  transition: 'all 0s ease-out',
                });
              }, 300);
            } else if ((phase === 'cancel' || phase === 'end') && distance < 200) {
              $(this).stop(true).css({
                transition: 'all .1s ease-out',
                transform: `translate3d(-200px, 0px, 0px)`,
              });
            }
          } else if (direction === 'left') {
            if ($(this).hasClass('active')) {console.log("left: active=true/return:0"); return;}
            else {
              console.log("left,active=false/translate3d(-${distance}px ")
              $(this)
                .stop(true)
                .css({
                  transition: 'all 0s ease-out',
                  transform: `translate3d(-${distance}px, 0px, 0px)`,
                });
            }

            if (phase === 'cancel' && distance < 200) {
              console.log("cancel && distance < 200/3d  000")
              $(this).stop(true).css({
                transition: 'all .1s ease-out',
              });

              setTimeout(() => {
                $(this).stop(true).css({
                  transform: `translate3d(0px, 0px, 0px)`,
                });
              }, 0);
            } else if ((phase === 'cancel' || phase === 'end') && distance >= 200) {
              console.log("cancel,end && distance >= 200/tran3d -200")
              $(this).addClass('active');
              $(this).stop(true).css({
                transition: 'all .1s ease-out',
                transform: `translate3d(-200px, 0px, 0px)`,
              });
            }
          }
        },
        threshold: 200,
      });
    });
  }

  /* $(function () {
    $('#test li').swipe({
      swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
        if (direction === 'right') {
          if (!$(this).hasClass('active')) return;

          $(this)
            .stop(true)
            .css({
              transition: 'all .3s ease-out',
              transform: `translate3d(-${200 - distance}px, 0px, 0px)`,
            });

          if ((phase === 'cancel' || phase === 'end') && distance >= 120) {
            $(this)
              .stop(true)
              .css({
                transform: `translate3d(0px, 0px, 0px)`,
              })
              .removeClass('active');

            setTimeout(() => {
              $(this).stop(true).css({
                transition: 'all 0s ease-out',
              });
            }, 300);
          } else if ((phase === 'cancel' || phase === 'end') && distance < 120) {
            $(this).stop(true).css({
              transition: 'all .3s ease-out',
              transform: `translate3d(-200px, 0px, 0px)`,
            });
          }
        } else if (direction === 'left') {
          if ($(this).hasClass('active')) return;
          else {
            $(this)
              .stop(true)
              .css({
                transition: 'all 0s ease-out',
                transform: `translate3d(-${distance}px, 0px, 0px)`,
              });
          }

          if (phase === 'cancel' && distance < 200) {
            $(this).stop(true).css({
              transition: 'all .3s ease-out',
            });

            setTimeout(() => {
              $(this).stop(true).css({
                transform: `translate3d(0px, 0px, 0px)`,
              });
            }, 0);
          } else if ((phase === 'cancel' || phase === 'end') && distance >= 200) {
            $(this).addClass('active');
            $(this).stop(true).css({
              transition: 'all .3s ease-out',
              transform: `translate3d(-200px, 0px, 0px)`,
            });
          }
        }
      },
      threshold: 200,
    });
  }); */

// sidebar materilize 시작
  $(document).ready(function(){
    $('.sidenav').sidenav();
  });

  // modal 창(materilize) 시작
  $(document).ready(function(){
    $('.modal').modal();
  });
          
