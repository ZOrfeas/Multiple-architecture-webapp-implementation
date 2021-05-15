const express = require('express');
const router = express.Router();
const answerServices = require('./services');

router.get('/', (req, res, next) => {
  res.send('AMA Answer');
});

module.exports = router;
