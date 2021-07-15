let SavedGetData = JSON.parse(localStorage.getItem("Datas"));

// 받아온 Data 불러오기
if (SavedGetData!==null){
    Makehtml(SavedGetData);
}


// html 만들기 1
function Makehtml(Data_obj){
    console.log(Data_obj,"Data_obj")
    let container = document.querySelector('#List-part');
    console.log(container,"container");
    container.innerHTML = Data_obj.map((item) => createHTML(item)).join('')
    let remove = document.querySelectorAll('.Arrow');   
    
   
    remove.forEach(function(item) {
      item.addEventListener("click",deleteList ); 
    });
}

// html 만들기 2
function createHTML(item){
    console.log(item)
     let LI_ID = item.li_id;
     let LABEL_ID = item.label_id;
     let S_TEXT = item.Start_text;
     let E_TEXT = item.End_text;
     return`
     <li id="${LI_ID}" class="list">
            <div class="L_Text">
                <div class="L_Top_Text"><span>${S_TEXT}</span><i class="fas fa-arrow-right"></i><span >${E_TEXT}</span></div>
                <div class="L_bottom_Text"><span class="Time">08:50~09:10</span><span>MON,FRI</span></div>
            </div>
            <div class="bu_arrow_wrap">
            <div class="ON_OFF">
                <input class="tgl tgl-ios" id="${LABEL_ID}" type="checkbox"/>
                <label class="tgl-btn" for="${LABEL_ID}"></label>
            </div>
            <div class="Arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
             </div>
        </li>
        `;
    
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
const PlusButton = document.querySelector(".Circle_test");
const C1 = document.querySelector(".c1");
const C2 = document.querySelector(".c2");
const SPAN1 = document.querySelector(".Short_button_span");
const SPAN2 = document.querySelector(".Short_button_long");
console.log(PlusButton)
function ShowTwobuttons(){
    PlusButton.classList.toggle("act")
    C1.classList.toggle("hidden")
    C1.classList.toggle("display")
    C2.classList.toggle("hidden2")
    SPAN1.classList.toggle("hidden_text")
    SPAN2.classList.toggle("hidden_text2")
}

function Test(){
    console.log("login")
}


PlusButton.addEventListener('click',ShowTwobuttons)
C1.addEventListener('click',Test)


