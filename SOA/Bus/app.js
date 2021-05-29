const createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
require('dotenv').config();

var indexRouter = require('./routes/index');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

/**
 * -------------- ROUTES --------------
 */
app.use('/spec', function(req,res,next) {
  // #swagger.ignore = true
  const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json'));
  req.swaggerDoc = swaggerDocument;
  next();
}, swaggerUi.serve, swaggerUi.setup());
app.get('/spec-json', (req, res) => {
  // #swagger.ignore = true
  res.sendFile('./swagger.json', { root: __dirname })
})
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
  const status = err.status || 500;
  if (status >= 500 && req.app.get('env') === 'development') {
    console.error(err.stack);
  }
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status;
  res.status(status);
  const message = status >= 500 ? "Something's wrong" : err.message;
  const expose = status >= 500 && req.app.get('env') === 'development';
  res.end(expose ? message + '\n\n' + err.stack : message);
});

module.exports = app;
