var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const LoginHisnet = require('../lib/LoginHisnet.js');
var mysql = require('mysql')
var option = require('../config/option');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const app = require('../app.js');

const bcrypt = require('bcrypt');
const saltRounds = option.saltRounds;


// DATABASE SETTING
var connection = mysql.createConnection({
    port: 3306,
    user: option.storageConfig.username,
    password: option.storageConfig.password,
    database: option.storageConfig.database,
    host: option.storageConfig.host
})
connection.connect();

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
 

passport.use('local-login', new LocalStrategy({
    usernameField: 'ID',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, ID, password, done) {
    var query = connection.query('SELECT * FROM user WHERE email=?', [ID], function(err, rows){
        if(err) return done(err);

        if(rows.length) {
            bcrypt.compare(password, rows[0].pwd, function(err1, isLogin){
                if(isLogin){
                    console.log('login success');
                    return done(null, {'result': "ok", 'message': 'login success!', 'id': rows[0].stID});
                } else {
                    console.log('wrong password');
                    return done(null, false, {'result': 'nope', 'message' : 'Error: your password is wrong'})
                }
            })
        } else {
            return done(null, false, {'result': 'nope', 'message' : 'Error: unregistered ID'})
        }
    });
  }
));

router.get('/', function(req, res, next) {
    res.render('Login');
});

router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if(err) res.status(500).json(err);
        if(!user) return res.status(401).json(info); 
        req.logIn(user, function(err) {
            if(err) return next(err);
            return res.json(user);
        });
    })(req, res, next);
})



passport.use('local-join', new LocalStrategy({
    usernameField: 'joinID',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, joinID, password, done) {
    var query = connection.query('SELECT * FROM user WHERE email=?', [joinID], function(err, rows){
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
                        var query = connection.query('INSERT INTO user SET ?', sql, function(err2, rows) {
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



router.get('/join', function(req, res){
    var msg;
    var errMsg = req.flash('error');
    if(errMsg) msg = errMsg;
    res.render('join2', {'message' : msg});
})

router.post('/join', passport.authenticate('local-join', {
    successRedirect: '/main',
    failureRedirect: '/login/join',
    failureFlash: true })
);

/*
router.post("/", function(req, res) {
    var email = req.body.ID;
    var password = req.body.password;
    var responseData = {};

    var query = connection.query('SELECT pwd FROM user WHERE email="' + email +'"', function(err, rows) {
        if(err) throw err;
        if(rows[0]) {
            if(rows[0].pwd === password){
                responseData.result = "ok";
                responseData.message = "Login success!";
            } else {
                responseData.result = "nope";
                responseData.message = "Wrong password";
            }
        } else {
            console.log('none ' +  rows[0]);
            responseData.result = "nope";
            responseData.message = "Unregistered ID";
        }  
        res.json(responseData);
    })
});
*/

router.post('/process', function(req, res, next) {
    var post = req.body;
    const hisnet_id = post.ID;
    const hisnet_pw = post.Password;
    console.log('Hisnet ID: ', hisnet_id);
    console.log('Hisnet PW: ', hisnet_pw);
    LoginHisnet.GoHisnet(hisnet_id, hisnet_pw, function(student){
        console.log('Web crawling success!');
        console.log('name: ', student.name);
        console.log('StID: ', student.id);

        res.json(student);
    }).catch(err => { 
        console.log('Web crawling is failed'); 
        res.redirect('/')
    });
});




/*
router.post('/join', function(req, res){
    var body = req.body;
    var email = body.email;
    var name = body.name;
    var password = body.password;

    var sql = {email: email, name: name, pwd: password};
    var query = connection.query('INSERT INTO user SET ?', sql, function(err,rows){
        if(err) throw err;
        console.log("ok db insert : ", rows.insertId, name);
    });
})
*/
  
module.exports = router;