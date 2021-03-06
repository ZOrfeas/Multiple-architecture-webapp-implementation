const express = require('express');
const { BadRequest } = require('http-errors');
const { authenticate } = require('../authenticate');
const { Answer, sequelize, Op } = require('../database/utils');
const { publish, EntityEnum, ActionEnum } = require('../redis/publishers');
const router = express.Router();

/* GET home page. */
router.post('/', authenticate, async (req, res, next) => {
  // #swagger.tags = ['Answer']
  // #swagger.summary = 'Creates a new question'
  try {
    const dto = {
      question_id: req.body.question.id,
      ansContent: req.body.ansContent,
      user_id: req.user.id // from authentication
      // user_id: req.body.user.id,
    };
    const newAnswer = await Answer.create(dto);
    res.status(201).json(newAnswer);
    publish(EntityEnum.answer, ActionEnum.create, newAnswer);
  } catch (err) {
    next(err);
  }
});

router.get('/count/by/year', async (req, res, next) => {
  // #swagger.tags = ['Answer']
  // #swagger.summary = 'Get answer count per day by year'
  try {
    const year = +req.query.year;
    const id = +req.query.id;
    if (isNaN(year)) throw new BadRequest('Invalid year query param');
    const fromDate = year.toString() + '-01-01';
    const toDate = (year + 1).toString() + '-01-01';
    const queryString = `SELECT COUNT(*) as count, date_trunc('day', "createdAt") as day ` +
      `FROM "answers" WHERE "createdAt">='${fromDate}' AND "createdAt"<'${toDate}' ` +
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

router.get('/count/by/questions', async (req, res, next) => {
  // #swagger.tags = ['Answer']
  // #swagger.summary = 'Returns the answer count for questions provided'
  try {
    const qIdString = req.query.id;
    const ids = qIdString.split(',').map((idString)=>{
      const id = +idString;
      if (isNaN(id))
        throw new BadRequest('Invalid question id format');
      return id;
    });
    const queryIds = '(' + ids.toString() + ')';
    const queryString = `SELECT "question_id", count(*) FROM "answers" WHERE "question_id" IN ${queryIds} GROUP BY "question_id"`;
    const rawRetVal = (await sequelize.query(queryString))[0];
    const retVal = {};
    rawRetVal.forEach((row) => retVal[row.question_id] = row.count);
    res.status(200).json(retVal);
  } catch (err) {
    next(err);
  }
});

router.get('/by/question', async (req, res, next) => {
  // #swagger.tags = ['Answer']
  // #swagger.summary = 'Get all answers of a question'
  try {
    const id = +req.query.id;
    if (isNaN(id)) throw new BadRequest('Invalid question id query param');
    const retVal = await Answer.findAll({
      where: { question_id: id },
    });
    res.status(200).json(retVal);
  } catch (err) {
    next(err);
  }
});

router.get('/count/by/user', async (req, res, next) => {
  // #swagger.tags = ['Answer']
  // #swagger.summary = 'Returns the answer count for user specified'
  try {
    const id = +req.query.id;
    if (isNaN(id))
      throw new BadRequest('Invalid user id provided');
    const retVal = await Answer.count({
      where: { user_id: id },
    });
    res.status(200).send(retVal.toString());
  } catch (err) {
    next(err);
  }
});

router.get('/by/user', async (req, res, next) => {
  // #swagger.tags = ['Answer']
  // #swagger.summary = 'Get all answers of a question'
  try {
    const id = +req.query.id;
    if (isNaN(id)) throw new BadRequest('Invalid question id query param');
    const retVal = await Answer.findAll({
      where: { user_id: id },
    });
    res.status(200).json(retVal);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
