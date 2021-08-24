var express = require('express');
var router = express.Router();
const db = require('../lib/db').connection;

/* GET home page. */
router.post('/participants/:roomID', function(req, res, next) {
  var query = db.query('SELECT name FROM chat_participants LEFT JOIN user ON chat_participants.stID=user.stID WHERE roomID=?', [req.params.roomID],function(err, rows){
    console.log(rows);

    var data = rows[0].name;
    console.log(data);
    for(let i=1; i < rows.length; i++) {
      data += ', ' + rows[i].name;
    }
    res.json({users : data});
  });
})

router.get('/:roomID', function(req, res, next) {
  console.log(req.params.roomID);
  if(req.params.roomID == 1) {
    res.render('Chat');
  } else {
    var query = db.query('SELECT * FROM chat_participants WHERE stID=? AND roomID=?', [req.user, req.params.roomID],function(err, rows){
      if(rows.length) {
        res.render('Chat');
      } else {
        res.redirect('/chat/1');
      }
    });
  }
});    

module.exports = router;
