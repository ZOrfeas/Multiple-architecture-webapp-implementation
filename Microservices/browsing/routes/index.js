const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); 
const my_uuid = uuidv4();
console.log("Redis uuid is:", my_uuid);
const cache = require('express-redis-cache')({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT || 6379,
  prefix: my_uuid, // used to enforce separate caches for each replica
  expire: 20, // default expire time in seconds
});
const { authenticate } = require('../authenticate');
const axios = require('axios');
const { BadRequest, InternalServerError } = require('http-errors');

const A_MNG_URL = 'http://' + process.env.A_MNG_HOSTNAME + 
                     ':' + process.env.A_MNG_PORT;
const Q_MNG_URL = 'http://' + process.env.Q_MNG_HOSTNAME + 
                     ':' + process.env.Q_MNG_PORT;
const AUTH_URL = 'http://' + process.env.AUTH_HOSTNAME + 
                     ':' + process.env.AUTH_PORT;

const QuestionUrl = Q_MNG_URL;
const QuestionsByUserUrl = Q_MNG_URL + '/by/user';
const QuestionPageUrl = Q_MNG_URL + '/page';
const QuestionPageByKeywordUrl = Q_MNG_URL + '/by/keywords';
const AnsCountUrl = A_MNG_URL + "/count/by/questions";
const AnswersOfQuestion = A_MNG_URL + '/by/question';
const AnswerByUserUrl = A_MNG_URL + '/by/user';
const UserDetsUrl = AUTH_URL + "/userDetails";

          
async function fillQuestionPageInfo(questions) {
  if (questions.length === 0) return;
  const qIds = questions.map((question) => question.id);
  const uIds = questions.map((question) => question.user_id);
  const paramWrapperAnsCount = { id: qIds.toString() };
  const paramWrapperUserDets = { id: uIds.toString() };
  await axios.get(AnsCountUrl, { params: paramWrapperAnsCount })
    .then((ansCounts) => {
      questions.forEach(question => {
        question.ansCount = ansCounts.data[question.id];
      });
    })
    .catch((err) => {
      console.log(err);
      throw new InternalServerError('Something went wrong :(');
    });
  await axios.get(UserDetsUrl, { params: paramWrapperUserDets })
    .then((userDetails) => {
      questions.forEach(question => {
        question.user = userDetails.data[question.user_id];
        delete question.user_id;
      })
    })
    .catch((err) => {
      console.log(err);
      throw new InternalServerError('Something went wrong :(');
    });
}

/* Attaches answer count and caches for near future */
router.get('/questions/page', authenticate, cache.route(), async (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Fetches a page of questions by most recent'
  try {
    const pagesize = +req.query.pagesize;
    const pagenr = +req.query.pagenr;
    if (isNaN(pagesize) || isNaN(pagenr)) throw new BadRequest('Invalid pagesize or pagenr query params');
    const paramWrapper = { pagesize: pagesize, pagenr: pagenr };
    const questionPage = (await axios.get(QuestionPageUrl, { params: paramWrapper })).data;
    await fillQuestionPageInfo(questionPage);
    res.status(200).json(questionPage);
  } catch (err) {
    next(err);
  }
});

router.get('/publicQuestions', cache.route(), async (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Gets 10 public questions, to be used by logged out users'
  try {
    const paramWrapper = { pagesize: 10, pagenr: 1 };
    const questionPage = (await axios.get(QuestionPageUrl, { params: paramWrapper })).data;
    await fillQuestionPageInfo(questionPage);
    res.status(200).json(questionPage);
  } catch (err) {
    next(err);
  }
})

router.get('/questions/byKeywords', authenticate,  cache.route(), async (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Fetches a page of questions that have the specified keywords'
  try {
    const pagesize = +req.query.pagesize;
    const pagenr = +req.query.pagenr;
    const ids = req.query.id;
    const keywordIds = ids.split(',').map((str) => {
      const nr = +str;
      if (isNaN(nr)) throw new BadRequest('Invalid keyword id query param');
      return nr;
    });
    if (isNaN(pagesize) || isNaN(pagenr)) throw new BadRequest('Invalid pagesize or pagenr query params');
    const paramWrapper = { pagesize: pagesize, pagenr: pagenr, id: ids };
    const questionPage = (await axios.get(QuestionPageByKeywordUrl, { params: paramWrapper })).data;
    await fillQuestionPageInfo(questionPage);
    res.status(200).json(questionPage);
  } catch (err) {
    next(err);
  }
});

async function fillQuestionInfo(question) {
  const paramWrapperAnswers = { id: question.id };
  const answers = (await axios.get(AnswersOfQuestion, {params: paramWrapperAnswers})).data;
  const paramWrapperUserDets = {
    id: question.user_id + ',' + answers.map((ans) => ans.user_id).toString(),
  }
  await axios.get(UserDetsUrl, { params: paramWrapperUserDets })
    .then((userDetails) => {
      question.user = userDetails.data[question.user_id];
      delete question.user_id;
      answers.forEach(answer => {
        answer.user = userDetails.data[answer.user_id];
        delete answer.user_id;
      });
      question.answers = answers;
    })
    .catch((err) => {
      console.log(err);
      throw new InternalServerError('Something went wrong :(');
    })
}

router.get('/question/:id', authenticate, cache.route(), async (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Fetches all info for a question'
  try {
    const id = +req.params.id;
    if (isNaN(id)) throw new BadRequest('Invalid question id path param');
    const question = (await axios.get(QuestionUrl + `/${id}`)).data;
    await fillQuestionInfo(question);
    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
});

async function fillAcountInfo(user) {
  const paramWrapperUId = { id: user.id };
  const questions = (await axios.get(QuestionsByUserUrl, { params: paramWrapperUId })).data;
  if (questions.length === 0 || questions.length === undefined) {
    user.questions = [];
  } else {
    user.questions = questions;
  }
  const realAnswers = (await axios.get(AnswerByUserUrl, { params: paramWrapperUId })).data;
  if (realAnswers.length === 0 || realAnswers.length === undefined) {
    user.answers = [];
  } else {
    const paramWrapperQids = { id: realAnswers.map(ans => ans.question_id).toString() };
    const respondedTo = (await axios.get(QuestionUrl + '/' + paramWrapperQids.id )).data;
    const answers = realAnswers.map(ans => { return {
      answer_id: ans.id,
      question_id: ans.question_id,
      createdAt: ans.createdAt,
      title: respondedTo[ans.question_id].title,
    }});
    user.answers = answers;
  }

}

router.get('/account/info', authenticate, async (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get account info of a user by their token'
  try {
    const id = req.user.id;
    const paramWrapper = { id: id };
    const user = (await axios.get(UserDetsUrl, { params: paramWrapper })).data[id];
    await fillAcountInfo(user);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/account/:id', cache.route(), async (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get account info of a user by id'
  try {
    const id = +req.params.id;
    if (isNaN(id)) throw new BadRequest('Invalid user id path param');
    const paramWrapper = { id: id };
    const user = (await axios.get(UserDetsUrl, { params: paramWrapper })).data[id];
    await fillAcountInfo(user);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
})
module.exports = router;
