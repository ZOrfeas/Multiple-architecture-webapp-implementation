const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
require('dotenv').config();
const serviceManager = require('./serviceManager');
/* const redisCon = */ require('./redisUtils');

const pokeRouter = require('./routes/poke');
const httpRouter = require('./routes/httpRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

/**
 * -------------- ROUTES --------------
 */
app.use('/spec', function(req,res,next) {
  // #swagger.ignore = true
  req.swaggerDoc = serviceManager.doc;
  next();
}, swaggerUi.serve, swaggerUi.setup());
app.get('/spec-json', (req, res) => {
  // #swagger.ignore = true
  fs.readFile('./swagger.json', 'utf8', (err, data) => {
    res.json(JSON.parse(data))
  })
})
app.use('/', httpRouter);

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
