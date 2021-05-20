const express = require('express');
const { BadRequest, InternalServerError } = require('http-errors');
const router = express.Router();
const browseServices = require('./services');

router.get('/questionsByKeywords', (req, res, next) => {
  const idList = req.query.id
  const pagesize = req.query.pagesize;
  const pagenr = req.query.pagenr;
  console.log(idList, pagesize, pagenr);
  browseServices.questionsByKeywords(idList, pagesize, pagenr)
    .then(dlres => res.status(200).json(dlres.data))
    .catch(next);
});

module.exports = router;
