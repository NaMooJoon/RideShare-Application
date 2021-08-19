$(function () {
    var socket = io();
    var roomId = 1;
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
        socket.emit('connect user', {id: data[0].stID, name: data[0].name}, function(res) {
            console.log('socket emit "connect user"가 성공하였습니다.');
            alert(res.data);
            roomId = 1;
            $chatLog.html("");
            $('#chatHeader').html("Open chat room");
        });
    });
    

    $loginForm.submit(function(e) {
        e.preventDefault();
        let id = $("#loginId");
        let pw = $("#loginPw");
        if(id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('login user', {id: id.val(), pw: pw.val()}, function(res) {
                if(res.result) {
                    alert(res.data);
                    socketId = socket.id;
                    username = res.username;
                    roomId = 1;
                    id.val("");
                    pw.val("");
                    $userWrap.hide();
                    $contentWrap.show();
                    $chatLog.html("");
                    $('#chatHeader').html("Everyone");
                } else {
                    alert(res.data);
                    id.val("");
                    id.val("");
                    $("#joinBtn").click();
                }
            })
        }
    })
    

    $("#logoutBtn").click(function(e) {
        e.preventDefault();
        socket.emit('logout');
        username = "";
        username = "";
        alert('로그아웃되었습니다.');
        $("#userWrap").show();
        $("#contentWrap").hide();
    })

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
        console.log('data.username: ', data.username);
        console.log('username     :', username);
        if(data.username === username) {
            $chatLog.append(`<div class="myMsg msgEl"><span class='msgTime'>${data.time}   </span><span class="msg">${data.msg}</span></div>`)
        } else {
            $chatLog.append(`<div class="anotherMsg msgEl"><span class="anotherName">${data.username}</span><span class="msg">${data.msg}</span><span class='msgTime'>  ${data.time}</span></div>`)
        }
        $chatLog.scrollTop($chatLog[0].scrollHeight - $chatLog[0].clientHeight);
    });


    socket.on('message history', function(data) {
        console.log(data);
        var i;
        var date = data[0].time.substring(8,10);
        printDate(data[0].time);
        for(i = 0; i < data.length; i++) {
            if(date !== data[i].time.substring(8,10)){
                //$chatLog.append(`<div class="notice"><strong>----- ${data[i].time.substring(0,11)} -----</div>`);
                printDate(data[i].time);
                date = data[i].time.substring(8,10);
            }

            data[i].time = data[i].time.substring(10,16);
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
