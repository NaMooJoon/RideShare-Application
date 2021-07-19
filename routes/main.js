var express = require('express');
var router = express.Router();

/* GET main listing. */
router.get('/', function(req, res, next) {
    res.render('Main');
});



module.exports = router;