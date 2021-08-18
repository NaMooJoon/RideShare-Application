// host -> 현재 창의 주소를 담고 있는 변수.
var host = window.location.protocol + "//" + window.location.host;
document.querySelector('#Button').addEventListener('click', function(event) {
    event.preventDefault();
    var inputdata = { "ID" : document.forms[0].elements[0].value ,
                      "password" : document.forms[0].elements[1].value 
                        }
    console.log(inputdata)
    sendAjax(host + '/login', inputdata);
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
        else { window.location.href=host + '/main'}
    });
}