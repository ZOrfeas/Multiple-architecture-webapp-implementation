const express = require('express');
const { authenticate } = require('../authenticate');
const router = express.Router();
const questionServices = require('./services');

router.post('/create', authenticate, (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Creates a new question'
  // #swagger.description = 'example: {"title":"a title","questContent":"Some question content","keywords":[{"id":some_number},{"id":some_number}]}'
  const dto = req.body;
  dto.user = { id: req.user.id };
  questionServices.addQuestion(dto)
    .then(dlres => res.status(200).json(dlres.data))
    .catch(next);
});

router.post('/create/keyword', authenticate, (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Creates a new keyword'
  const dto = req.body;
  questionServices.addKeyword(dto)
    .then(dlres => res.status(200).json(dlres.data))
    .catch(next);
})

router.get('/getAllKeywords', (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Gets all keywords'
  questionServices.getAllKeywords()
    .then(dlres => {
      const retObj = dlres.data;
      retObj.sort((a, b) => {
        return ('' + a.name).localeCompare(b.name);
      })
      res.status(200).json(retObj);
    })
    .catch(next);
})

module.exports = router;
