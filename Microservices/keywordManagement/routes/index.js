const express = require('express');
const { BadRequest } = require('http-errors');
const router = express.Router();
const { authenticate } = require('../authenticate');
const { Keyword, sequelize } = require('../database/utils');
const { publish, EntityEnum, ActionEnum } = require('../redis/publishers');

/* GET home page. */
router.post('/', authenticate, async (req, res, next) => {
  // #swagger.tags = ['Keyword']
  // #swagger.summary = 'Creates a new keyword'
  try {
    const dto = {
      name: req.body.name,
    };
    const newKeyword = await Keyword.create(dto);
    publish(EntityEnum.keyword, ActionEnum.create, newKeyword);
    res.status(201).json(newKeyword);
  } catch (err) {
    if (err?.errors[0]?.message === 'name must be unique') {
      next(new BadRequest(`Keyword with name ${req.body.name} already exists`));
    } else {
      next(err);
    }
  }
});

router.get('/all', async (req, res, next) => {
  // #swagger.tags = ['Keyword']
  // #swagger.summary = 'Gets all keywords'
  try {
    const allKeywords = await Keyword.findAll({
      order: [['name', 'DESC']],
    });
    res.status(200).json(allKeywords);
  } catch (err) {
    next(err);
  }
});

router.get('/count', async (req, res, next) => {
  // #swagger.tags = ['Keyword']
  // #swagger.summary = 'Counts the number of existing keywords'
  const count = await Keyword.count();
  res.status(200).send(count.toString());

})

router.get('/by/popularity', async (req, res, next) => {
  // #swagger.tags = ['Keyword']
  // #swagger.summary = 'Fetches a page of keywords, by popularity'
  try {
    const pagesize = +req.query.pagesize;
    const pagenr = +req.query.pagenr;
    if (isNaN(pagesize) || isNaN(pagenr))
      throw new BadRequest('Invalid pagesize or pagenr query params');
    const queryString = `SELECT "keywords"."name", "rel"."keywordId", COUNT("rel"."questionId") as "occurencies"
      FROM "question_keywords_keywords" as "rel" JOIN "keywords" ON "rel"."keywordId" = "keywords"."id"
      GROUP BY "rel"."keywordId", "keywords"."name" ORDER BY "occurrencies" DESC
      LIMIT ${pagesize} OFFSET ${(pagenr-1) * pagesize}`;
    const retList = await sequelize.query(queryString);
    res.status(200).json(retList[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
