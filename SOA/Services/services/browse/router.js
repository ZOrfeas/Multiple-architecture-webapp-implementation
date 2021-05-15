const express = require('express');
const router = express.Router();
const browseServices = require('./services');

router.get('/questionsPerKeyword', (req, res, next) => {
  let keyword = req.query.id;
  // res.send('AMA Browse');
});

module.exports = router;
