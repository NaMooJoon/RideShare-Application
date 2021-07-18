$('#Button').click(function(){
    $.ajax({
        url:'./time3.php',
        dataType:'json',
        success:function(data){
         console.log(data)
        }
    })
})
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