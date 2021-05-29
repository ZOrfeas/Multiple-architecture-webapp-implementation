const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

require('./utils/passport');
app.use(passport.initialize());

/**
 * -------------- ROUTES --------------
 */

app.use('/', cors(), indexRouter);

/**
 * -------------- ERROR HANDLER --------------
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// log errors
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500 && req.app.get('env') === 'development') {
    console.error(err.stack);
  }
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status;
  res.status(status);
  const message = status >= 500 ? "Something's wrong" : err.message;
  const expose = status >= 500 && req.app.get('env') === 'development';
  res.end(expose ? message + '\n\n' + err.stack : message);
});

module.exports = app;
