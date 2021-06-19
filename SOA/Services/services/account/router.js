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
      retObj.ansCount = retObj.answers.length;
      retObj.questCount = retObj.questions.length;
      retObj.questions = retObj.questions.sort((a, b) => {
        return new Date(b.askedOn).getTime()
             - new Date(a.askedOn).getTime();
      });
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

router.get('/info', authenticate, getAccount);
router.get('/:id', fillId, getAccount);

module.exports = router;
