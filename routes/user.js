var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Here is User page');
});

router.get('/User_info', function(req, res, next) {
  console.log(__dirname);
  res.render('User_info');
});

module.exports = router;
