const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const questionRouter = require('./services/question/router');
const answerRouter = require('./services/answer/router');
const browseRouter = require('./services/browse/router');
const accountRouter = require('./services/account/router');

const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

/**
 * -------------- ROUTES --------------
 */

app.use('/spec', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/spec-json', (req, res) => {
  // #swagger.ignore = true
  fs.readFile('./swagger.json', 'utf8', (err, data) => {
    res.json(JSON.parse(data))
  })
})
app.use('/question', questionRouter);
app.use('/answer', answerRouter);
app.use('/browse', browseRouter);
app.use('/account', accountRouter);

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
