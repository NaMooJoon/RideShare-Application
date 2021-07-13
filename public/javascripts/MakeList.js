const StartForm = document.getElementById("StartLocation_form");
const StartInput = StartForm.querySelector("#StartLocation_form #start");
const EndInput = StartForm.querySelector("#StartLocation_form #end");

let Sendarray = [];

// input 받고 객체로 저장
function HandleStart(event){
    event.preventDefault();
    StartInput_TEXT = StartInput.value;
    EndInput_TEXT = EndInput.value;
    EndInput.value = "";
    StartInput.value = "";
    const Send_OBJ = {
        Start_text: StartInput_TEXT,
        End_text:EndInput_TEXT,
        li_id: Date.now(),
        label_id: Date.now() * 1000,
     };

    Sendarray.push(Send_OBJ);
    saveDATA();
}

StartForm.addEventListener("submit",HandleStart);



// Data 화면 넘어갈때 초기화 안되도록 array update하기
const savedupdate = JSON.parse(localStorage.getItem("Datas"));
if (savedupdate!==null){
    Sendarray = savedupdate;
    console.log(parsedToDos)
}
// Data를 localstorage에 저장 하기
function saveDATA(){
    
    localStorage.setItem("Datas",JSON.stringify(Sendarray));
}

