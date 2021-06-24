const express = require('express');
const { BadRequest } = require('http-errors');
const router = express.Router();
const { authenticate } = require('../authenticate');
const accountServices = require('./services');

function getAccount(req, res, next) {
  const id = req.user.id;
  accountServices.getAccountInfo(id)
    .then(async (dlres) => {
      const retObj = dlres.data;
      delete retObj.password;
      retObj.questCount = retObj.questions.length;
      retObj.ansCount = retObj.answers.length;
      if (retObj.questions.length !== 0) {
        retObj.questions = retObj.questions.sort((a, b) => {
          return new Date(b.askedOn).getTime()
               - new Date(a.askedOn).getTime();
        });
      }
      if (retObj.answers.length !== 0) {
        const idList = retObj.answers.map(answer => answer.id);
        const rawAnsInfo = (await accountServices.getQuestionsOfAnswers(idList)).data;
        const processedAnsInfo = [];
        const addedQuestionIds = new Set()
        rawAnsInfo.forEach((ansInfoObj) => {
          if (!addedQuestionIds.has(ansInfoObj.question_id)) {
            processedAnsInfo.push(ansInfoObj);
            addedQuestionIds.add(ansInfoObj.question_id);
          }
        });
        retObj.answers = processedAnsInfo;
      }
      res.status(200).json(retObj);
    })
    .catch(next);
}

function fillId(req, res, next) {
  const id = +req.params.id;
  if (isNaN(id)) {
    next(new BadRequest('Invalid user id provided'));
  } else {
    req.user = { id: id };
    next();
  }
}

router.get('/questionCountByYear', (req, res, next) => {
  // #swagger.tags = ['Account']
  // #swagger.summary = 'Get calendar view info for a user'
  const id = +req.query.id;
  const year = +req.query.year;
  if (isNaN(id) || isNaN(year)) throw new BadRequest('Invalid user_id or year provided');
  accountServices.getQuestionCountByYear(year, id)
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
});

router.get('/answerCountByYear', (req, res, next) => {
  // #swagger.tags = ['Account']
  // #swagger.summary = 'Get calendar view info for a user'
  const id = +req.query.id;
  const year = +req.query.year;
  if (isNaN(id) || isNaN(year)) throw new BadRequest('Invalid user_id or year provided');
  accountServices.getAnswerCountByYear(year, id)
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
});

router.get('/info', authenticate, getAccount);
router.get('/:id', fillId, getAccount);

module.exports = router;
