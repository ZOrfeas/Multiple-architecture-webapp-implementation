const express = require('express');
const router = express.Router();
const browseServices = require('./services');

router.get('/questionsByKeywords', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Returns all questions containing the specified keywords'
  const idList = req.query.id
  const pagesize = req.query.pagesize;
  const pagenr = req.query.pagenr;
  // console.log(idList, pagesize, pagenr);
  browseServices.questionsByKeywords(idList, pagesize, pagenr)
    .then(dlres => res.status(200).json(dlres.data))
    .catch(next);
});

router.get('/count/questionsByKeywords', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Returns the number of questions containing the specified keywords'
  const idList = req.query.id;
  browseServices.countQuestionsByKeywords(idList)
    .then(dlres => res.status(200).send(dlres.data.toString()))
    .catch(next);
});

router.get('/count/questions', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Return the number of questions'
  browseServices.countQuestions()
    .then(dlres => res.status(200).send(dlres.data.toString()))
    .catch(next);
});

router.get('/count/answers', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Return the number of answers'
  browseServices.countAnswers()
    .then(dlres => res.status(200).send(dlres.data.toString()))
    .catch(next);
});

router.get('/count/keywords', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Return the number of keywords'
  browseServices.countKeywords()
    .then(dlres => res.status(200).send(dlres.data.toString()))
    .catch(next);
});

router.get('/count/users', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Return the number of users'
  browseServices.countUsers()
    .then(dlres => res.status(200).send(dlres.data.toString()))
    .catch(next);
});


module.exports = router;
