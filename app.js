let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let favicon = require('serve-favicon');
let bodyParser = require('body-parser');

let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let trendRouter = require('./routes/trend');
// var interestRouter = require('./routes/interest');
// var messageRouter = require('./routes/message');
// var settingRouter = require('./routes/setting')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置请求头
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control_allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-custom');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next()
});

app.use('/index', indexRouter);
app.use('/login', loginRouter);
app.use('/trend', trendRouter);
// app.use('/interest', interestRouter);
// app.use('/message', messageRouter);
// app.use('/setting', settingRouter);

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
