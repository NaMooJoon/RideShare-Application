var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('First_screen');
});

router.get('/data', function(req, res, next) {
  if(req.user){
    res.json({user: req.user});
  } else {
    res.json({user: undefined});
  }
})

module.exports = router;

