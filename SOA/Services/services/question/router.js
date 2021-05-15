const express = require('express');
const router = express.Router();
const keywordServices = require('./services');

router.get('/perKeyword', (req, res, next) => {
  // let keyword = req.query.id;
  // res.send('AMA Question');
});

module.exports = router;
