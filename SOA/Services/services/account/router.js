const express = require('express');
const router = express.Router();
const auth = require('../authenticate');
const ansService = requre

router.get('/', (req, res, next) => {
  res.send('AMA Account');
  // createAnswer
  // const res =  auth.checkToken(req, () => {
  //   return ansService.createAnswer(req.body);
  // });

});

module.exports = router;
