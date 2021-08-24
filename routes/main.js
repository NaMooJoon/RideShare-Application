var express = require('express');
var router = express.Router();
var db = require('../lib/db').connection;


/* GET main listing. */
router.get('/', function(req, res, next) {
    if(req.user === undefined)
        res.redirect('/login');
    // 유저 정보 Main.ejs로 
    var io = req.app.get('socketio');
    var query = db.query('SELECT email,stID,name FROM user WHERE stID=?', [req.user],function(err, rows){
        if(err) throw err;  
        console.log('router안에서 소켓의 아이디는 ... ', req.session.socketId);
        res.render('Main', rows[0]);   
    });
});

// GET /main/data
router.get('/data', function(req, res, next) {
    console.log(req.user, '/data is called!');
    var query = db.query('SELECT * FROM RideList WHERE author_id=?', [req.user],function(err, rows){
        if(err) throw err;  
		res.json(rows);
    });
});


// GET /main/chat_data
router.get('/chat_data', function(req, res, next) {
    // 채팅창의 데이터를 res.json() 방법으로 보내줘야 함.
    // 데이터의 형식? 
    // req.user의 학번을 가지고 그 사람이 들어가 있는 채팅방의 roomID들을 불러온다.
    var data = [];
    var query = db.query('SELECT roomID FROM chat_participants WHERE stID=?', [req.user],function(err, user){
        console.log('참가하고 있는 방들');
        console.log('roomID', user);
        var value;
        // 해당되는 roomID를 통해서
        // 1. 해당 RideList안에 (출발지, 목적지)
        for(let i = 0; i < user.length; i++){
            var query1 = db.query('SELECT Location_start, Location_end FROM RideList WHERE li_id=?', [user[i].roomID], function(err, list) {
                if(err) throw err;
                //console.log('출발지 목적지');
                //console.log(list[i]);
                // 2. 해당 roomID의 참가자들
                var query2 = db.query('SELECT chat_participants.stID,name FROM chat_participants LEFT JOIN user ON chat_participants.stID=user.stID WHERE roomID=?', [user[i].roomID], function(err, participants) {
                    if(err) throw err;
                    //console.log('참가자들');
                    var chat_participants = participants[0].name;
                    for(let j = 1; j < participants.length; j++) {
                        chat_participants += ', ' + participants[j].name;
                    }
                    //console.log(chat_participants);
                    // 3. 해당 room의 마지막 메시지.
                    var query3 = db.query('SELECT message,time FROM chat_message WHERE roomID=? ORDER BY id DESC LIMIT 1', [user[i].roomID], function(err, messages) {
                        if(err) throw err;
                        if(messages.length) {
                            value = {
                                roomID : user[i].roomID,
                                Location_start : list[0].Location_start,
                                Location_end : list[0].Location_end,
                                participants : chat_participants,
                                message : messages[0].message,
                                time :  messages[0].time
                            };
                            data.push(value);
                        }
                        if(i === user.length - 1) {
                            res.json(data);
                        }
                    })
                })
            })
        }
    });
});


// POST /main/toggle
router.post('/toggle', function(req, res, next) {
	console.log('/toggle', req.user);
	var post = req.body;
    console.log("post는 ", post, "입니다.");
    var { li_id, label_onoff } = post;
	var query = db.query('SELECT * FROM RideList WHERE li_id=?', [li_id],function(err, rows){
		if(label_onoff){
			var query2 = db.query('UPDATE RideList SET label_onoff=? WHERE li_id=?', [true, li_id]);
		} else {
			var query2 = db.query('UPDATE RideList SET label_onoff=? WHERE li_id=?', [false, li_id]);
		}		
	});
});



// GET /main/short
router.get('/short', function(req, res, next) {
    res.render('S_input');
});

// GET /main/long
router.get('/long', function(req, res, next) {
    res.render('L_input');
});

// GET 으로 하면 안된다.
router.delete('/:listID', function(req, res, next) {
    console.log("DELETE method로 데이터 수신...");
    console.log(`리스트 ${req.params.listID}`);
    var data = {};
    var query = db.query('DELETE FROM RideList WHERE li_id=?', [req.params.listID], function(err, rows){
        if(err) {
            data.result = 0;
            data.msg = '에러가 발생했습니다. 새로고침을 해주세요'
        } {
            data.result = 1;
            data.msg = '삭제되었습니다.'
        }
        res.json(data);
    });
});

// POST /main/create_list
router.post('/create_list', function(req, res, next) {
    console.log("create_list 입니다");
    var post = req.body;
    console.log('create_list에 도착한 정보', post);
    var sql = {
		Location_start: post.Location_start,
		Location_end: post.Location_end,
		Start_time: post.Start_time,
		Repeat_ornot: post.Repeat_ornot,
        Start_date: post.Start_date,
		Current_person: 1,
        Limit_person: post.Limit_person,
        transport_way: post.transport_way,
        comments: post.comments,
        label_onoff: true,
		author_id: req.user,
    };

    var query = db.query('INSERT INTO RideList SET ?', sql, function(err, rows){
        if(err) throw err;
        console.log('list is added!', rows.insertId);
        var query2 = db.query('INSERT INTO chat_participants (stID,roomID) VALUES(?,?)', [req.user, rows.insertId], function(err2, rows2){
            res.json({"result":"ok"});
        });
    });
});


module.exports = router;
