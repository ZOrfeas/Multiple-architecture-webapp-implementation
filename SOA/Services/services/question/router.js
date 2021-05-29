const express = require('express');
const router = express.Router();
const keywordServices = require('./services');

router.get('/', (req, res, next) => {
  // #swagger.tags = ['Question']
});

module.exports = router;
