const e = require('express');
const express = require('express');
const { BadRequest, NotFound } = require('http-errors');
const router = express.Router();
const { authenticate } = require('../authenticate');
const { Question, Keyword, keywordsExist, sequelize, Op } = require('../database/utils');
const { publish, EntityEnum, ActionEnum } = require('../redis/publishers');

router.post('/', authenticate, async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Creates a new question'
  try {
    const dto = {
      title: req.body.title,
      questContent: req.body.questContent,
      user_id: req.user.id // from authentication
      // user_id: req.body.user.id,
    };
    const keywords = req.body.keywords !== [] ?
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
    const newRels = await sequelize.query(`SELECT * FROM "question_keywords_keyword" WHERE "questionId"=${newQuestion.id}`);
    publish(EntityEnum.question, ActionEnum.create, newQuestion);
    publish(EntityEnum.qHasK, ActionEnum.create, newRels[0]);
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

router.get('/count/by/keywords', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Counts all questions that have the specified keywords'
  try {
    const ids = req.query.id;
    if (!ids)
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
        const queryString = `SELECT COUNT(*) FROM
          (SELECT "rel"."questionId" FROM "question_keywords_keyword" "rel"
          WHERE "rel"."keywordId" IN ${keywordString}
          GROUP BY "rel"."questionId"
          HAVING COUNT(DISTINCT "rel"."keywordId") = ${keywordCount}) AS "ids"`;
        const questionCountObj = await sequelize.query(queryString, { transaction: t });
        return questionCountObj[0][0].count;
      } else {
        throw new BadRequest('Question keyword ids not existing');
      }
    })
    res.status(200).send(retVal.toString());
  } catch (err) {
    next(err);
  }
});

router.get('/by/keywords', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Fetches a page of questions that have the specified keywords'
  try {
    const ids = req.query.id; // could use a regexp to check here
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
        const questionIdObjs = await sequelize.query(queryString, { transaction: t });
        const questionIds = questionIdObjs[0].map((idObj) => idObj.questionId);
        return Question.findAll({
          where: {id: { [Op.in]: questionIds }},
          include: { model: Keyword, through: { attributes: [] }},
          transaction: t
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

router.get('/count/by/year', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Get question count per day by year'
  try {
    const year = +req.query.year;
    const id = +req.query.id;
    if (isNaN(year)) throw new BadRequest('Invalid year query param');
    const fromDate = year.toString() + '-01-01';
    const toDate = (year + 1).toString() + '-01-01';
    const queryString = 
      `SELECT COUNT(*) as count, date_trunc('day', "createdAt") as day ` +
      `FROM "questions" WHERE "createdAt">='${fromDate}' AND "createdAt"<'${toDate}' ` +
      (isNaN(id) ? '' : `AND "user_id" = ${id} `) +
      `GROUP BY day`;
    const retVal = await sequelize.query(queryString);
    const processed = {};
    retVal[0].forEach(({count, day}) => {
      const date = new Date(day);
      const mm = date.getMonth() + 1;
      const dd = date.getDate();
      const key = [date.getFullYear(),
                   (mm>9 ? '' : '0') + mm,
                   (dd>9 ? '' : '0') + dd,
                  ].join('-');
      processed[key] = count;
    });
    res.status(200).send(processed);
  } catch (err) {
    next(err);
  }
});

router.get('/by/user', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Get all questions submitted by a user'
  try {
    const id = +req.query.id;
    if (isNaN(id)) throw new BadRequest('Invalid user id query param');
    const questions = await Question.findAll({
      where: { user_id: id },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Fetches all available info about a question'
  try {
    const ids = req.params.id;
    const questionIds = ids.split(',').map((str) => {
      const nr = +str;
      if (isNaN(nr)) throw new BadRequest('Invalid keyword id query param');
      return nr;
    });
    if (questionIds.length === 1) {
      const question = await Question.findByPk(questionIds[0], { include: {
        model: Keyword, through: { attributes: [] }
      }});
      if (!question) {
        throw new NotFound(`Question with id ${id} not found`);
      }
      res.status(200).json(question);  
    } else {
      const questions = await Question.findAll({
        where: { id: { [Op.in]: questionIds } }
      });
      const retVal = {}
      questions.forEach(question => retVal[question.id] = question);
      res.status(200).json(retVal);
    }
  } catch(err) {
    next(err);
  }
});

module.exports = router;
