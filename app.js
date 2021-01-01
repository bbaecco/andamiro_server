var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketio = require('socket.io');
// var io = socketio.listen('andamiro-was:server');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memRouter = require('./routes/mem');
var bankRouter = require('./routes/bank');
var rewardRouter = require('./routes/reward');
var planetRouter = require('./routes/planet');
var itemRouter = require('./routes/item');
var mainRouter = require('./routes/main');



var sequelize = require('./models').sequelize;   // mysql 시퀄라이저 모델

var app = express();

sequelize.sync({
  force: false  //true: 테이블이 있는 경우 삭제하고 다시 작성 / false: 기존 테이블 삭제x 새 테이블이 작성되면 삭제됨
});  //서버 실행시 시퀄라이저가 mysql을 연결시켜 줌

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mem', memRouter);
app.use('/bank', bankRouter);
app.use('/reward', rewardRouter);
app.use('/planet', planetRouter);
app.use('/item', itemRouter);
app.use('/main', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //res.locals.error = req.app.get('env') === 'test' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
