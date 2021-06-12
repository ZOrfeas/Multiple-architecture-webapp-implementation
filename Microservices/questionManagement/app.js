const createError = require('http-errors')
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const fs = require('fs');

const { sequelize } = require('./database/utils');
sequelize.sync();

require('./redis/setListeners');

const indexRouter = require('./routes/index');

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * -------------- ROUTES --------------
 */
app.use('/spec', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/spec-json', (req, res) => {
  // #swagger.ignore = true
  fs.readFile('./swagger.json', 'utf8', (err, data) => {
    res.json(JSON.parse(data));
  });
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
  const status = err.status || 500;
  const message = status >= 500 ? "Something's wrong" : err.message;
  const expose = status >= 500 && req.app.get('env') === 'development';
  res.status(status).end(expose ? message + '\n\n' + err.stack : message);
});

module.exports = app;
