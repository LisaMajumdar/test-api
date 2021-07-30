var createError = require('http-errors');
var express = require('express');
global.pathModule = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var winston = require('./config/winston');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', global.pathModule.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//==================================SETTING UP CORS========================//
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));
//=========================================================================//


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(global.pathModule.join(__dirname, 'public')));

//------------Global Settings------------ //
global.CONFIG = require('./config/env/'+process.env.NODE_ENV);
global.logs = new winston(global.CONFIG.LOGGER_SETTINGS);
// SETTING UP COMMON HELPER CLASS
var CommonFunction = require('./helper/CommonHelper');
global.Helpers = new CommonFunction();

// SETTING UP CONNECTION OBJECT
const ConnectionC = require("./config/connection");
global.Connection_Obj = new ConnectionC;
global.Connection_Obj.connectDB();

app.use('/', indexRouter);
app.use('/admin', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Logger
app.use(logger('combined', { stream: global.logs.logger.stream }));

//Catch Unhandled Promise rejection error
process.on('unhandledRejection', (reason, promise) => {
  global.logs.logger.error(reason);
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
