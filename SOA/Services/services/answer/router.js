const express = require('express');
const { authenticate } = require('../authenticate');
const router = express.Router();
const answerServices = require('./services');

router.post('/create', authenticate, (req, res, next) => {
  // #swagger.tags = ['Answer']
  // #swagger.summary = 'Creates a new answer'
  const dto = req.body;
  dto.user = { id: req.user.id };
  answerServices.addAnswer(dto)
    .then(dlres => res.status(200).json(dlres.data))
    .catch(next);
});

module.exports = router;
