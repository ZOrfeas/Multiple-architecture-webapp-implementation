const express = require('express');
const { BadRequest } = require('http-errors');
const router = express.Router();
const { authenticate } = require('../authenticate');
const { Question, Keyword, keywordsExist } = require('../database/utils');
const { publish, EntityEnum, ActionEnum } = require('../redis/publishers');

router.post('/', authenticate, async (req, res, next) => {
  // #swagger.tags = ['Question']
  // #swagger.summary = 'Creates a new question'
  const dto = {
    title: req.body.title,
    questContent: req.body.questContent,
    user_id: req.user.id,
  };
  const keywords = req.body.keywords.map((idObj) => idObj.id);
  let newQuestion;
  if (!keywords || await keywordsExist(keywords)) {
    newQuestion = await Question.create(dto); // insert new Question
    if (keywords) {
      await newQuestion.setKeywords(keywords);
    }
  } else {
    next(new BadRequest('Question keyword ids not existing'));
  }
  await newQuestion.reload({ include: Keyword });
  publish(EntityEnum.question, ActionEnum.create, newQuestion);
  res.status(201).json(newQuestion);
});

module.exports = router;
