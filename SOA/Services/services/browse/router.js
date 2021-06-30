const express = require('express');
const router = express.Router();
const browseServices = require('./services');
const { authenticate } = require('../authenticate');

router.get('/questionsByKeywords', authenticate, (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Returns all questions containing the specified keywords'
  const idList = req.query.id
  const pagesize = req.query.pagesize;
  const pagenr = req.query.pagenr;
  // console.log(idList, pagesize, pagenr);
  browseServices.questionsByKeywords(idList, pagesize, pagenr)
    .then(dlres => {
      const retList = [];
      dlres.data.forEach((element) => {
        const retObj = element.question;
        retObj.ansCount = element.ansCount;
        // delete password if question.user exists
        !retObj.user || delete retObj.user.password;
        retList.push(retObj);
      });
      res.status(200).json(retList);
    })
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

router.get('/publicQuestions', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get 10 public questions, to be used by logged out users'
  browseServices.getPage(1, 10)
    .then(dlres => {
      const retList = [];
      dlres.data.forEach((element) => {
        const retObj = element.question;
        retObj.ansCount = element.ansCount;
        // delete password if question.user exists
        !retObj.user || delete retObj.user.password;
        retList.push(retObj);
      });
      res.status(200).json(retList);
    })
    .catch(next);
})

router.get('/questions', authenticate, (req, res, next) => {
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
      res.status(200).json(retList);
    })
    .catch(next);
})

router.get('/question', authenticate, (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get all details of a question'
  const id = req.query.id;
  browseServices.getQuestionInfo(id)
    .then(dlres => {
      const retObj = dlres.data;
      !retObj.user || delete retObj.user.password;
      res.status(200).json(retObj);
    })
    .catch(next);
})

router.get('/publicQuestion', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get all details of a public question'
  const id = req.query.id;
  browseServices.getQuestionInfo(id)
    .then(dlres => {
      const retObj = dlres.data;
      !retObj.user || delete retObj.user.password;
      res.status(200).json(retObj);
    })
    .catch(next);
}

router.get('/keywordsByPopularity', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get a page of keywords sorted by popularity'
  const pagenr = req.query.pagenr;
  const pagesize = req.query.pagesize;
  // console.log(pagenr, pagesize)
  browseServices.getKeywordsByPopularity(pagenr, pagesize)
    .then(dlres => res.status(200).json(dlres.data))
    .catch(next);
})

router.get('/questionCountByYear', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get question count per day by year'
  const year = req.query.year;
  browseServices.getQuestionCountByYear(year)
  .then(dlres => {
    const retObj = {}
    // console.log('hey');
    dlres.data.forEach(({day, count}) => {
        const date = new Date(day);
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const key = [date.getFullYear(),
                     (mm>9 ? '' : '0') + mm,
                     (dd>9 ? '' : '0') + dd
                    ].join('-');
        retObj[key] = count;
      });
      res.status(200).json(retObj);
    })
    .catch(next);
})

router.get('/answerCountByYear', (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get answer count per day by year'
  const year = req.query.year;
  browseServices.getAnswerCountByYear(year)
  .then(dlres => {
    const retObj = {}
    // console.log('hey');
    dlres.data.forEach(({day, count}) => {
        const date = new Date(day);
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const key = [date.getFullYear(),
                     (mm>9 ? '' : '0') + mm,
                     (dd>9 ? '' : '0') + dd
                    ].join('-');
        retObj[key] = count;
      });
      res.status(200).json(retObj);
    })
    .catch(next);
})

module.exports = router;
