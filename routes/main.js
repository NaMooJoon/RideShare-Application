var express = require('express');
var router = express.Router();

/* GET main listing. */
router.get('/', function(req, res, next) {
    console.log('main is loaded', req.user);
    var id = req.user;
    res.render('Main', {'id': id});
    //res.render('Main',);
});



module.exports = router;