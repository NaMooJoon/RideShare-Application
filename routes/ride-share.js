var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET users listing. */
router.get('/:liID', function(req, res, next) {
	var query1 = db.connection.query('SELECT * FROM RideList WHERE li_id=?', [req.params.liID], function(err, rows) {
		if(err) throw err;
		console.log(rows[0].Location_end);
		res.render('User_list',{location: rows[0].Location_end});
	});
});

// GET /ride-share/1234/
router.post('/:liID', function(req, res, next) {
	var query1 = db.connection.query('SELECT * FROM RideList WHERE author_id=?', [req.params.liID], function(err1, rows1) {
		if(err1) throw err1;
		var query2 = db.connection.query('SELECT * FROM RideList LEFT JOIN user ON author_id=stID WHERE label_onoff=?', [true], function(err2, rows2) {
			if(err2) throw err2;
			res.json(rows2);
		});
	});
});

// GET /ride-share/list/1234
router.get('/list/:infoID', function(req, res, next) {
  res.render('User_info');
});

// POST /ride-share/list/1234
router.post('/list/:infoID', function(req, res, next) {
    var query = db.connection.query('SELECT R.li_id, R.Location_start, R.Location_end, R.comments, user.stID, user.name FROM RideList AS R LEFT JOIN user ON author_id=stID WHERE R.li_id=?',[req.params.infoID], function(err, rows){
        if(err) throw err;
		res.json(rows[0]);
    });
})


module.exports = router;
