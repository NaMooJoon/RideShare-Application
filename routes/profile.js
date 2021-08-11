var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require('../lib/db');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // const ext = path.extname(file.originalname);
    // cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
    console.log('profile screen on!');
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        // const ext = path.extname(file.originalname);
        // cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
        cb(null, req.user);
      },
    });
    upload = multer({ storage: storage });
    res.render('Profile');
})


// POST /profile
router.post('/', upload.single('file'), function(req, res, next) {
    console.log('이미지를 받아오는 곳');
    console.log(req.file);
});

// POST /profile/user
router.post('/user', function(req, res, next) {
  var query = db.connection.query('SELECT stID,name FROM user WHERE stID=?', [req.user],function(err, rows){
      if(err) throw err;  
      res.json(rows);
  });
})

module.exports = router;
