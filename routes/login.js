var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const LoginHisnet = require('../lib/LoginHisnet.js');
var mysql = require('mysql')
var option = require('../config/option');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const app = require('../app.js');


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

router.get('/', function(req, res, next) {
    res.render('Login');
});

router.post("/", function(req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var responseData = {};

    var query = connection.query('SELECT name FROM user WHERE email="' + email +'"', function(err, rows) {
        if(err) throw err;
        if(rows[0]) {
            console.log(rows[0]);
            responseData.result = "ok";
            responseData.message = rows[0].name;
        } else {
            console.log('none ' +  rows[0]);
            responseData.result = "none";
            responseData.name = "";
        }  
        res.json(responseData);
    })
});

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



router.get('/join', function(req, res){
    var msg;
    var errMsg = req.flash('error');
    if(errMsg) msg = errMsg;
    res.render('join2', {'message' : msg});
})

//passport.serialize
passport.serializeUser(function(user, done) {
    console.log('passport session save : ', user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    console.log('passport session get id : ', id);
    done(null, id);
  });
 

passport.use('local-join', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {
    var query = connection.query('SELECT * FROM user WHERE email=?', [email], function(err, rows){
        if(err) return done(err);

        if(rows.length) {
            console.log('existed user');
            return done(null, false, {message : 'your email is already used'})
        } else {
            var sql = {email: email, pwd: password};
            var query = connection.query('INSERT INTO user SET ?', sql, function(err, rows) {
                if(err) throw err;
                return done(null, {'email': email, 'id': rows.insertId});
            });
        }
    });
  }
));

router.post('/join', passport.authenticate('local-join', {
        successRedirect: '/main',
        failureRedirect: '/login/join',
        failureFlash: true })
);

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