/* $('#Button').click(function(){
    $.ajax({
        url:'./time3.php',
        dataType:'json',
        success:function(data){
         console.log(data)
        } 
    })
})
// id name
if (data.id === "nope"){
    prompt("Can not login to withme")
} else{
    prompt("login 되었습니다")
    window.location.href="../../views/Main.html"
} */
/* 
document.querySelector('#sendtest').addEventListener('click', function(event){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './time2.php');
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var _tzs = xhr.responseText;
            var tzs = JSON.parse(_tzs);   
           console.log(tzs)

        }
    }
    xhr.send(); 
});  */


document.querySelector('#Button').addEventListener('click', function(event) {
    event.preventDefault();
    var inputdata = { "ID" : document.forms[0].elements[0].value ,
                      "password" : document.forms[0].elements[1].value 
                        }
    console.log(inputdata)
    sendAjax('http://localhost:3000/login', inputdata);
})

function sendAjax(url, data){
    data = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data); 
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        if(result.result !== "ok") { alert(result.message); }
        else { window.location.href="http://localhost:3000/main"}
    });
}

