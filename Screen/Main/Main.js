let SavedGetData = JSON.parse(localStorage.getItem("Datas"));
    
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
     let ID = item.id;
     let S_TEXT = item.Start_text;
     let E_TEXT = item.End_text;
     return`
     <li id="${ID}" class="list">
            <div class="L_Text">
                <div class="L_Top_Text"><span>${S_TEXT}</span><i class="fas fa-arrow-right"></i><span >${E_TEXT}</span></div>
                <div class="L_bottom_Text"><span class="Time">08:50~09:10</span><span>MON,FRI</span></div>
            </div>
            <div class="bu_arrow_wrap">
            <div class="ON_OFF">
                <input class="tgl tgl-ios" id="cb1" type="checkbox"/>
                <label class="tgl-btn" for="cb1"></label>
            </div>
            <div class="Arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
             </div>
        </li>
        `;
    
 }

 function deleteList(event){
    /* let li2 = event.target.parentElement; */
    let li2 = event.currentTarget.parentElement.parentElement;
    console.log(li2)
    console.log("remove")
    SavedGetData = SavedGetData.filter((List)=>List.id !== parseInt(li2.id));

    li2.remove();
    saveDATA();
}

function saveDATA(){
    
    localStorage.setItem("Datas",JSON.stringify(SavedGetData));
}


