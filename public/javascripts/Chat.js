$(function () {
    var socket = io();
    var roomId = (window.location.pathname).substring(6);
    var socketId = "";
    var username = "";
    var $userWrap = $('#userWrap');
    var $contentWrap = $('#contentWrap');
    var $loginForm = $('#loginForm');
    var $joinForm = $('#joinForm');
    var $chatForm = $('#chatForm');
    var $roomSelect = $('#roomSelect');
    var $memberSelect = $('#memberSelect');
    var $chatLog = $('#chatLog');

    // 여기에서? 백쪽에서 유저에 대한 정보를 가져와야 하는 것이낙?
    // host -> 현재 창의 주소를 담고 있는 변수.
    var host = window.location.protocol + "//" + window.location.host;
    sendAjax(host + '/profile/user', "POST", function(data){
        console.log(data);
        username = data[0].name;
        socketId = socket.id;
        socket.emit('connect user', {id: data[0].stID, name: data[0].name, roomId : roomId}, function(res) {
            console.log('socket emit "connect user"가 성공하였습니다.');
            alert(res.data);
            $chatLog.html("");
            $('#chatHeader').html("Open chat room");
        });
    });
    

    $roomSelect.on('click', 'div', function() {
        if(roomId !== $(this).data('id')) {
            roomId = $(this).data('id');
        }
        $(this).parents().children().removeClass('active');
        $(this).addClass('active');
        $chatLog.html("");
        $('#chatHeader').html(`${$(this).html()}`);
        socket.emit('join room', {
            "roomId" : roomId
        });
    })

    $chatForm.submit(function(e){
        e.preventDefault();
        let msg = $('#message');
        if(msg.val() === "") {
            return false;
        } else {
            let data = {
                roomId: roomId,
                msg: msg.val()
            };
            socket.emit("send message", data);
            msg.val("");
            msg.focus();
        }
    })

    socket.on('new message', function(data) {
        if(data.username === username) {
            $chatLog.append(`<div class="myMsg msgEl"><span class='msgTime'>${data.time}   </span><span class="msg">${data.msg}</span></div>`)
        } else {
            $chatLog.append(`<div class="anotherMsg msgEl"><span class="anotherName">${data.username}</span><span class="msg">${data.msg}</span><span class='msgTime'>  ${data.time}</span></div>`)
        }
        $chatLog.scrollTop($chatLog[0].scrollHeight - $chatLog[0].clientHeight);
    });


    socket.on('message history', function(data) {
        if(!data.length) return false;
        var i;
        var date = data[0].time.substring(8,10);
        printDate(data[0].time);
        for(i = 0; i < data.length; i++) {
            if(date !== data[i].time.substring(8,10)){
                printDate(data[i].time);
                date = data[i].time.substring(8,10);
            }

            data[i].time = data[i].time.substring(11,16);
            if(data[i].name === username) {
                $chatLog.append(`<div class="myMsg msgEl"><span class='msgTime'>${data[i].time}   </span><span class="msg">${data[i].message}</span></div>`)
            } else {
                $chatLog.append(`<div class="anotherMsg msgEl"><span class="anotherName">${data[i].name}</span><span class="msg">${data[i].message}</span><span class='msgTime'>  ${data[i].time}</span></div>`)
            }
        }
        $chatLog.scrollTop($chatLog[0].scrollHeight - $chatLog[0].clientHeight);
    });

    
    socket.on('userlist', function(data) {
        let html = "";
        data.forEach((el) => {
            if(el.socketId === socketId) {
                html += `<div class="memberEl">${el.name} (me)</div>`
            } else {
                html += `<div class="memberEl">${el.name}</div>`
            }
        });
        $memberSelect.html(html);
    })

    socket.on('lefted room', function(data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> lefted the room</div>`);
    });
    socket.on('joined room', function (data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> joined the room</div>`)
    });
});

function printDate(time) {
    $('#chatLog').append(`<div class="notice"><strong><   ${time.substring(0,10)}   ></div>`);
}

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
