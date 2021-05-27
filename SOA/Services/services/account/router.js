const express = require('express');
const router = express.Router();
const auth = require('../authenticate');
const accountServices = require('./services');

router.get('/', (req, res, next) => {
  // #swagger.tags = ['Account']
  // res.send('AMA Account');
});

module.exports = router;
