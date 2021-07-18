var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const app = require('../app');
const LoginHisnet = require('../lib/LoginHisnet.js');
var mysql = require('mysql')
var option = require('../config/option');


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

router.post("/ajax", function(req, res) {
    var email = req.body.email;
    var responseData = {};

    var query = connection.query('SELECT name FROM user WHERE email="' + email +'"', function(err, rows) {
        if(err) throw err;
        if(rows[0]) {
            responseData.result = "ok";
            responseData.name = rows[0].name;
        } else {
            responseData.result = "none";
            responseData.name = "";
        }  
        res.json(responseData);
    })
});
  
module.exports = router;