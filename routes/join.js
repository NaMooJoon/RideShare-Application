const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const LoginHisnet = require('../lib/LoginHisnet.js');
const option = require('../config/option');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = option.saltRounds;
const db = require('../lib/db').connection;

//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//passport.serialize
passport.serializeUser(function(user, done) {
    console.log('passport session save : ', user.id);
    done(null, user.id);
});
  passport.deserializeUser(function(id, done) {
    console.log('passport session get id : ', id);
    done(null, id);
});
 

// passport join
passport.use('local-join', new LocalStrategy({
    usernameField: 'joinID',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, joinID, password, done) {
    var query = db.query('SELECT * FROM user WHERE email=?', [joinID], function(err, rows){
        if(err) return done(err);
        // 기존에 아이디가 존재한다면
        if(rows.length) {
            console.log('Registered user');
            return done(null, false, {message : 'your hisnet id is already regitered'})
        } else {
            LoginHisnet.GoHisnet(joinID, password, function(student){
                console.log('Web crawling success!');
                if(student.name === 'nope') throw err;
                console.log('name: ', student.name);
                console.log('StID: ', student.id);
                bcrypt.genSalt(saltRounds, function(err1, salt){
                    if(err1) throw err1;
                    bcrypt.hash(password, salt, function(err2, hash){
                        if(err2) throw err2;
                        var sql = {stID: student.id, email: joinID, name:student.name, pwd: hash};
                        var query = db.query('INSERT INTO user SET ?', sql, function(err2, rows) {
                            if(err2) throw err;
                            console.log(rows.insertId);
                            return done(null, {'result': "ok", 'id': student.id});
                        });
                    })
                })
            }).catch(err => { 
                return done(null, false, {message : 'authentication failure'});
            });
        }
    });
  }
));


// GET  /join
router.get('/', function(req, res){
    var msg;
    var errMsg = req.flash('error');
    if(errMsg) msg = errMsg;
    res.render('Join', {'message' : msg});
})
// POST /join
router.post('/', passport.authenticate('local-join', {
    successRedirect: '/main',
    failureRedirect: '/join',
    failureFlash: true })
);

/////////////테스트 유저 만들기 위한 임시 코드//////////////////
router.get('/test', function(req, res) {
    var msg;
    var errMsg = req.flash('error');
    if(errMsg) msg = errMsg;
    res.render('Join_test', {'message' : msg});
})
router.post('/test', function(req, res) {
    console.log("test login창이 정상적으로 작동합니다.");
    var data = req.body;

    var query = db.query('SELECT * FROM user WHERE email=?', [data.email], function(err, rows){
        if(err) return done(err);
        // 기존에 아이디가 존재한다면
        if(rows.length) {
            console.log('Registered user');
            res.json({ result: "no" });
        } else {
            bcrypt.genSalt(saltRounds, function(err1, salt){
                if(err1) throw err1;
                bcrypt.hash(data.password, salt, function(err2, hash){
                    if(err2) throw err2;
                    var sql = {stID: data.stID, email: data.email, name:data.name, pwd: hash};
                    var query = db.query('INSERT INTO user SET ?', sql, function(err2, rows) {
                        if(err2) throw err;
                        console.log(rows.insertId);
                        res.json({ result: "ok", name: data.name });
                    });
                })
            })
        }
    });
});
////////////////////////////////////////////////////////
module.exports = router;
