const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../lib/db');


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
 
// passport login
passport.use('local-login', new LocalStrategy({
    usernameField: 'ID',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, ID, password, done) {
    var query = db.connection.query('SELECT * FROM user WHERE email=?', [ID], function(err, rows){
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

// GET  /login
router.get('/', function(req, res, next) {
    res.render('Login');
});
// POST /login
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



module.exports = router;
