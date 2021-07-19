var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash')

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var loginRouter = require('./routes/login');
var mainRouter = require('./routes/main');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/ejs'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// passport setting
app.use(session({
  secret: 'keyboard dog',
  resave: false,            // session이 항상 저장될지 여부를 정하는 값
  saveUninitialized: true   // Session이 필요할 때만 구동시킨다.
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//app.use('/', indexRouter);
app.get('/', function(req, res) {
  res.send('Home');
});
app.use('/login', loginRouter);
app.use('/main', mainRouter);
app.use('/user', userRouter);











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
