const todoForm = document.getElementById("todo_form");
const todoInput = todoForm.querySelector("#todo_form input");
const todoLists = document.querySelector("#todo-list");

let Todoarray = [];

// list 저장
function saveToDos(){
    
    localStorage.setItem("todos",JSON.stringify(Todoarray));
}

// list 제거
function deleteToDo(event){
    let li2 = event.target.parentElement;
    console.log(li2)
    console.log("remove")
    console.log(Todoarray)
    Todoarray = Todoarray.filter((toDo)=>toDo.id !== parseInt(li2.id));
    console.log(Todoarray)
    li2.remove();
    saveToDos();
}

// html 만들기 1
function MakehtmlTODO(Todoarray){
  
         const container = document.querySelector('#todo-list');
         TKeyOFArray = []
        
         container.innerHTML = Todoarray.map((item) => createHTML(item)).join('')
         let button = document.querySelectorAll('.bt');   
         console.log(button)
        
         button.forEach(function(item) {
           item.addEventListener("click",deleteToDo ); 
         });
    }
// html 만들기 2
    function createHTML(item){
        console.log(item)
         let ID = item.id
         let TEXT = item.text
         console.log(ID,TEXT)
         return `
         <li id="${ID}">
         <div class="innerlist">${TEXT}</div>
         <button class="bt"></button>
         </li>
         `;
        
     } 
// submit handle 하기
     function HandleTODO(event){
        event.preventDefault();
        const newTODO = todoInput.value;
        todoInput.value = "";
        const newTODO_OBJ = {
           text: newTODO,
           id: Date.now(),
        };
        Todoarray.push(newTODO_OBJ);
        console.log(Todoarray)
        saveToDos();
        MakehtmlTODO(Todoarray);
       
    }

    todoForm.addEventListener("submit",HandleTODO);


    const savedToDos = localStorage.getItem("todos");
// list  불러오기
if (savedToDos!==null){
    const parsedToDos = JSON.parse(savedToDos);
    Todoarray = parsedToDos;
    console.log(parsedToDos)
    MakehtmlTODO(parsedToDos);

}