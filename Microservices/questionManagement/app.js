const createError = require('http-errors')
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const fs = require('fs');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * -------------- ROUTES --------------
 */

app.use('/', indexRouter);

/**
 * -------------- ERROR HANDLER --------------
 */

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// log errors
app.use((err, req, res, next) => {
  const status = err.response?.status || 500;
  if (status >= 500 && req.app.get('env') === 'development') {
    console.error(err.stack);
  }
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  const status = err.response?.status || 500;
  const message = status >= 500 ? "Something's wrong" : err.message;
  const expose = status >= 500 && req.app.get('env') === 'development';
  res.status(status).end(expose ? message + '\n\n' + err.stack : message);
});

module.exports = app;
