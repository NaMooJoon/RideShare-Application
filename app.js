var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var session = require('express-session')
var flash = require('connect-flash')
var MySQLStore = require('express-mysql-session')(session)
var options = require('./lib/db').options;
var db = require('./lib/db');
var sessionStore = new MySQLStore(options);


var onlineUsers = {};                     // 현재 온라인인 유저를 저장하는 곳

// Call routers
var indexRouter = require('./routes/index');
var rideRouter = require('./routes/ride-share');
var loginRouter = require('./routes/login');
var joinRouter = require('./routes/join');
var mainRouter = require('./routes/main');
var chatRouter = require('./routes/chat');
var logoutRouter = require('./routes/logout');
var profileRouter = require('./routes/profile');

var app = express();

/////////////////////////////////// www //////////////////////////////////////

// Listen on provided port, on all network interfaces.
var debug = require('debug')('rideshare-application:server');
var port = process.env.PORT || 3000;
app.set('port', port);

// Create HTTP server.
var server = require('http').createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
  
///////////////////////////////////////////////////////////////////////////
 
var io = require('socket.io')(server);
var moment = require('moment');
// io router setting
app.set('socketio', io);

// view engine setup
app.set('views', path.join(__dirname, 'views/ejs'));
app.set('view engine', 'ejs');
// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// passport setting
app.use(session({
  secret: 'keyboard dog',
  resave: false,            // session이 항상 저장될지 여부를 정하는 값
  saveUninitialized: true,   // Session이 필요할 때만 구동시킨다.
  store: sessionStore,
  expires: 300000
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/scripts', express.static(__dirname + '/node_modules/compressorjs/dist/'))
// Using routers.
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/join', joinRouter);
app.use('/main', mainRouter);
app.use('/ride-share', rideRouter);
app.use('/chat', chatRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);


// Use shared session middleware for socket.io
// setting autoSave:true
session = session({
  secret: 'keyboard dog',
  resave: false,            // session이 항상 저장될지 여부를 정하는 값
  saveUninitialized: true,   // Session이 필요할 때만 구동시킨다.
  store: sessionStore,
  expires: 300000
})
var sharedsession = require("express-socket.io-session");
io.use(sharedsession(session, {
	autoSave:true
}));

// Set sockets
io.sockets.on('connection', function(socket) {
  socket.on("alarm", function(data) {
    console.log(data);
  });

  console.log('----------------> socket id :',socket.id);
  socket.handshake.session.socketId = socket.id;
  socket.handshake.session.save();
  console.log("-->", socket.handshake.session);
  socket.on("send message", function(data) {
      // data -> roomId, msg
      console.log("send message 소켓이 실행됩니다...");
      console.log(Object.keys(onlineUsers));
      var userId = getUserIdBySocketId(socket.id);
      console.log('sending user:', userId);
      console.log('sending username:', onlineUsers[userId].username);
      var query = db.connection.query('INSERT INTO chat_message (roomID,stID,message,time) VALUES(?,?,?,NOW())', [data.roomId, onlineUsers[userId].userId, data.msg], function(err, rows){
          if(err) throw err;

          io.sockets.in('room' + data.roomId).emit('new message', {
              username: onlineUsers[userId].username,
              socketId: socket.id,
              msg: data.msg,
              time: moment().format('HH:mm')
          });
      });
  })


  // id 값과 pw 값이 data 안으로 값이 들어온다.
  socket.on('connect user', function(student, cb) {
      onlineUsers[student.id] = {roomId: student.roomId, socketId: socket.id, userId: student.id, username: student.name};
      socket.join('room' + student.roomId);
      var query = db.connection.query('SELECT chat_message.stID,name,message,time FROM chat_message LEFT JOIN user ON chat_message.stID=user.stID WHERE roomID=?', [onlineUsers[student.id].roomId], function(err, message){
        socket.emit('message history', message);
        updateUserList(0, 1, student.id);
      });
      cb({ data: '채팅방 접속에 성공하였습니다.'}); 
      // 모든 유저들의 user 리스트 최신화.
      io.emit("onlineUsers", onlineUsers);
      io.to('room' + student.roomId).emit('joined room', student.name);
  });
  
  //io.to(onlineUsers[21800000].socketId).emit('alarm', {data:"Hello"});


  /*
    main화면에서 chat list들을 쭉 띄우는데 일단 지금 거기 데이터 전송하는 곳(/main/chat_data)에서
    데이터를 메시지가 없으면 전송을 안하는 방식으로 처리했단 말이지.
    그렇다면 누군가가 방에 join하게 될 경우에는 join 된 순간에 chat_message라는 데이터베이스 안에서
    예를 들어 "XXX가 채팅방에 입장하였습니다." 이런식으로 문구를 적어야지.
    그렇다면 프론트 쪽에서 뭐가 바뀌어야 하는가.
      -> 프론트 쪽에서 지금 'message history'에서 받아오는 데이터의 author_id가 username과 같은지 아닌지를
      확인해서 자기 자신이면 자기 채팅으로 아니면 남이 말한 채팅으로 띄우도록 처리가 되어있음.(여기서 동명이인이 있을 수도 있으니까 이름 비교 말고 stID 처리로 해야 할 것 같음.)
      -> 위의 '->'에서 씨부린 것을 또하나 if else() 조건문을 다는 방식으로 구별 값이 server라면, server가 전송하는 메시지를 저장하고 띄울 수 있도록 로직을 짜야할 것 같음.
  */
  socket.on('join room', function(data) {
      let id = getUserIdBySocketId(socket.id);
      console.log('id: ',id);
      let prevRoomId = onlineUsers[id].roomId;
      let nextRoomId = data.roomId;
      socket.leave('room' + prevRoomId);
      socket.join('room' + nextRoomId);
      onlineUsers[id].roomId = data.roomId;
      var query = db.connection.query('SELECT userID,name,message,time FROM message LEFT JOIN user ON message.userID=user.id WHERE roomID=?', [data.roomId], function(err, message){
          socket.emit('message history', message);
          updateUserList(prevRoomId, nextRoomId, id);
      });
  });

  socket.on('logout', function() {
      if(!socket.id) return;
      let id = getUserIdBySocketId(socket.id);
      let roomId = onlineUsers[id].roomId;
      delete onlineUsers[getUserIdBySocketId(socket.id)];
      updateUserList(roomId, 0, id);
  });

  socket.on('disconnect', function(socket) {
      if(!socket.id) return;
      let id = getUserIdBySocketId(socket.id);
      if(id === undefined || id === null)
          return ;
      let roomId = onlineUsers[id].roomId || 0;
      delete onlineusers[getUserIdBySocketId(socket.id)];
      io.emit("onlineUsers", onlineUsers);
      updateUserList(roomId, 0, id);
  });


  function updateUserList(prev, next, id) {
      if(prev !== 0) {
          io.sockets.in('room' + prev).emit('userlist', getUsersByRoomId(prev));
          io.sockets.in('room' + prev).emit('lefted room', onlineUsers[id].username);
      }
      if(next !== 0) {
          io.sockets.in('room' + next).emit('userlist', getUsersByRoomId(next));
          io.sockets.in('room' + next).emit('joined room', onlineUsers[id].username);
      }
  }

  function getUsersByRoomId(roomId) {
      let userstemp = [];
      Object.keys(onlineUsers).forEach((el) => {
          if(onlineUsers[el].roomId === roomId) {
              userstemp.push({
                  socketId : onlineUsers[el].socketId,
                  name : onlineUsers[el].username
              });
          }
      });
      return userstemp;
  }
});

function getUserIdBySocketId(id) {
  return Object.keys(onlineUsers).find(key => onlineUsers[key].socketId === id);
}


//////////////////////////error///////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
