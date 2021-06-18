const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); 
const my_uuid = uuidv4();
console.log("Redis uuid is:", my_uuid);
const cache = require('express-redis-cache')({
  host: process.env.REDIS_HOSTNAME,
  prefix: my_uuid, // used to enforce separate caches for each replica
  expire: 30, // default expire time in seconds
});
const { authenticate } = require('../authenticate');

/* Attaches answer count and caches for near future */
router.get('/questions/page', cache.route(), (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Fetches a page of questions by most recent'

});

router.get('/questions/byKeywords', cache.route(), (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Fetches a page of questions that have the specified keywords'

});

router.get('/question/:id', cache.route(), (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Fetches all info for a question'

});

router.get('/account/info', authenticate, (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get account info of a user by their token'
});

router.get('/account/:id', cache.route(), (req, res, next) => {
  // #swagger.tags = ['Browse']
  // #swagger.summary = 'Get account info of a user by id'
})
module.exports = router;
