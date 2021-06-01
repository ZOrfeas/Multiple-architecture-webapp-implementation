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

router.get('/questions', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get a page of questions, sorted by date'
  const pagesize = req.query.pagesize;
  const pagenr = req.query.pagenr;
  browseServices.getPage(pagenr, pagesize)
    .then(dlres => {
      const retList = [];
      dlres.data.forEach((element) => {
        const retObj = element.question;
        retObj.ansCount = element.ansCount;
        // delete password if question.user exists
        !retObj.user || delete retObj.user.password;
        retList.push(retObj);
      });
      res
        .status(200)
        .json(retList)
    })
    .catch(next);
})

router.get('/question', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get all details of a question'

  console.log(process.env.DL_HOSTNAME);
  const id = req.query.id;
  browseServices.getQuestionInfo(id)
    .then(dlres => {
      const retObj = dlres.data;
      !retObj.user || delete retObj.user.password;
      res.status(200).json(retObj);
    })
    .catch(next);
})

module.exports = router;
