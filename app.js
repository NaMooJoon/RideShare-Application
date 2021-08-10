var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var session = require('express-session')
var flash = require('connect-flash')
var MySQLStore = require('express-mysql-session')(session)
var option = require('./config/option');
var options = {
  host: option.storageConfig.host,
  port: 3306,
  user: option.storageConfig.username,
  password: option.storageConfig.password,
  database: option.storageConfig.database,
};
var sessionStore = new MySQLStore(options);

var indexRouter = require('./routes/index');
var rideRouter = require('./routes/ride-share');
var loginRouter = require('./routes/login');
var mainRouter = require('./routes/main');
var chatRouter = require('./routes/chat');
var logoutRouter = require('./routes/logout');
var profileRouter = require('./routes/profile');
const { profile } = require('console');

var app = express();

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

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/main', mainRouter);
app.use('/ride-share', rideRouter);
app.use('/chat-share', chatRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);



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
