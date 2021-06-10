const express = require('express');
const router = express.Router();
const { authenticate } = require('../authenticate');
const accountServices = require('./services');

router.get('/info', authenticate, (req, res, next) => {
  // #swagger.tags = ['Account']
  // #swagger.summary = 'Return all account info of a user'
  const id = req.user.id;
  accountServices.getAccountInfo(id)
    .then(dlres => {
      const retObj = dlres.data;
      delete retObj.password;
      retObj.ansCount = retObj.answers.length;
      retObj.questCount = retObj.questions.length;
      res.status(200).json(retObj);
    })
    .catch(next);
});

module.exports = router;
