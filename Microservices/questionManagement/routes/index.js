const express = require('express');
const { BadRequest, NotFound } = require('http-errors');
const router = express.Router();
const { authenticate } = require('../authenticate');
const { Question, Keyword, keywordsExist, sequelize, Op } = require('../database/utils');
const { publish, EntityEnum, ActionEnum } = require('../redis/publishers');

router.post('/', /**authenticate,*/ async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Creates a new question'
  try {
    const dto = {
      title: req.body.title,
      questContent: req.body.questContent,
      // user_id: req.user.id // from authentication
      user_id: req.body.user.id,
    };
    const keywords = req.body.keywords === [] ?
                     req.body.keywords.map((idObj) => idObj.id):
                     undefined;
    let newQuestion;
    if (!keywords || await keywordsExist(keywords)) {
      newQuestion = await Question.create(dto); // insert new Question
      if (keywords) {
        await newQuestion.setKeywords(keywords);
      }
    } else {
      throw new BadRequest('Question keyword ids not existing');
    }
    await newQuestion.reload({ include: {
      model: Keyword, through: { attributes: [] }
    }});
    publish(EntityEnum.question, ActionEnum.create, newQuestion);
    res.status(201).json(newQuestion);
  } catch (err) {
    next(err);
  }
});

router.get('/page', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Fetches a page of questions by most recent'
  try {
    const pagesize = +req.query.pagesize;
    const pagenr = +req.query.pagenr;
    if (isNaN(pagesize) || isNaN(pagenr))
    throw new BadRequest('Invalid pagesize or pagenr query params');
    const questions = await Question.findAll({
      order: [['createdAt', 'DESC']],
      offset: (pagenr - 1) * pagesize,
      limit: pagesize,
      include: { model: Keyword, through: { attributes: [] }},
    });
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
});

router.get('/count', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Counts the number of existing questions'
  const count = await Question.count();
  res.status(200).send(count.toString());
});

router.get('/by/keyword', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Fetches all questions that have the specified keywords'
  try {
    const ids = req.query.ids; // could use a regexp to check here
    const pagenr = req.query.pagenr;
    const pagesize = req.query.pagesize;
    if (isNaN(pagesize) || isNaN(pagenr) || !ids)
      throw new BadRequest('Invalid query params');
    const keywordIds = ids.split(',').map((str) => {
      const nr = +str;
      if (isNaN(nr)) throw new BadRequest('Invalid keyword id query param');
      return nr;
    });
    const retVal = await sequelize.transaction(async (t) => {
      if (await keywordsExist(keywordIds, t)) {
        const keywordString = '(' + keywordIds.toString() + ')';
        const keywordCount = keywordIds.length;
        const queryString = `SELECT "rel"."questionId"
        FROM "question_keywords_keyword" "rel"
        WHERE "rel"."keywordId" IN ${keywordString}
        GROUP BY "rel"."questionId"
        HAVING COUNT(DISTINCT "rel"."keywordId") = ${keywordCount}
        LIMIT ${pagesize}
        OFFSET ${(pagenr - 1) * pagesize}`;
        const questionIdObjs = await sequelize.query(queryString);
        const questionIds = questionIdObjs[0].map((idObj) => idObj.questionId);
        console.log("QuestionIdObjs:", questionIdObjs);
        console.log("QuestionIds:",questionIds);
        return Question.findAll({
          where: {id: { [Op.or]: questionIds }},
          include: { model: Keyword, through: { attributes: [] }}
        });
      } else {
        throw new BadRequest('Question keyword ids not existing');
      }
    });
    res.status(200).json(retVal);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Fetches all available info about a question'
  try {
    const id = req.params.id;
    const question = await Question.findByPk(id, { include: {
      model: Keyword, through: { attributes: [] }
    }});
    if (!question) {
      throw new NotFound(`Question with id ${id} not found`);
    }
    res.status(200).json(question);  
  } catch(err) {
    next(err);
  }
});

module.exports = router;
