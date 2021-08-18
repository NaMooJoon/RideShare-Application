$(function () {
    var socket = io.connect();
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

    $("#loginBtn").click(function (e) {
        e.preventDefault();
        $loginForm.show();
        $joinForm.hide();
    });

    $("#joinBtn").click(function (e) {
        e.preventDefault();
        $joinForm.show();
        $loginForm.hide();
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
    
    $joinForm.submit(function (e) {
        e.preventDefault();
        let id = $("#joinId");
        let pw = $("#joinPw");
        let name = $("#name");
        if (id.val() === "" || pw.val() === "" || name.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('join user', {id: id.val(), pw: pw.val(), name: name.val()}, function (res) {
                if (res.result) {
                    alert(res.data);
                    id.val("");
                    pw.val("");
                    $("#loginBtn").click();
                } else {
                    alert(res.data);
                    return false;
                }
            });
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
        var date = data[0].time.substring(8,11);
        $chatLog.append(`<div class="notice"><strong>----- ${data[0].time.substring(0,11)} -----</div>`);
        for(i = 0; i < data.length; i++) {
            if(date !== data[i].time.substring(8,11)){
                $chatLog.append(`<div class="notice"><strong>----- ${data[i].time.substring(0,11)} -----</div>`);
                date = data[i].time.substring(8,11);
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

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}