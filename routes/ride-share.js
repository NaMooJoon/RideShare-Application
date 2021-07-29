var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('User_list');
});

router.get('/info/data', function(req, res, next) {
    var query = db.connection.query('SELECT R.li_id, R.Location_start, R.Location_end, R.comments, user.stID, user.name FROM RideList AS R LEFT JOIN user ON author_id=stID WHERE R.li_id=1234', function(err, rows){
		console.log(rows);
        if(err) throw err;
		res.json(rows[0]);
    });
})

router.get('/info/:infoID', function(req, res, next) {
  res.render('User_info');
});

module.exports = router;
