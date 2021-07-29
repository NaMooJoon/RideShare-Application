var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET main listing. */
router.get('/', function(req, res, next) {
    console.log('main is loaded', req.user);
    res.render('Main');    
});

router.get('/data', function(req, res, next) {
    console.log('/data is called!', req.user);
    var query = db.connection.query('SELECT * FROM RideList', function(err, rows){
        if(err) throw err;
        // res.render('Main');    
		res.json(rows);
    });
});

router.get('/short', function(req, res, next) {
    res.render('S_input');
});

router.get('/long', function(req, res, next) {
    //res.render('Main.html', {'id': id});
    res.render('L_input');
});

router.get('/delete/:listID', function(req, res, next) {
    //res.render('Main.html', {'id': id});
    res.redirect('/main');
});


router.post('/create_list', function(req, res, next) {
    console.log("create_list 입니다");
    var post = req.body;
    var sql = {
        li_id: post.li_id,
        label_id: post.label_id,
		Location_start: post.Location_start,
		Location_end: post.Location_end,
		Start_time: post.Start_time,
		Repeat_ornot: post.Repeat_ornot,
        Start_date: post.Start_date,
		Current_person: post.Current_person,
        Limit_person: post.Limit_person,
        transport_way: post.transport_way,
        comments: post.comments,
        label_onoff: post.label_onoff,
		author_id: req.user,
    };
    var query = db.connection.query('INSERT INTO RideList SET ?', sql, function(err, rows){
        if(err) throw err;
        console.log('list is added!', rows.insertId);
        res.redirect('/main')    
    });
});


router.get('/profile', function(req, res, next) {
    console.log('profile is loaded', req.user);

    res.render('Profile');
    //res.render('Main',);
});

module.exports = router;
