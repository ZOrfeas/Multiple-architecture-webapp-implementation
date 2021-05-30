const express = require('express');
const router = express.Router();
const serviceManager = require('../serviceManager');

/* GET home page. */
router.get('/testadd', function(req, res, next) {
  // #swagger.tags = ["Test"]

  // serviceManager.addService("authenticator", "http://saas-15.ddns.net:3001/spec-json");
  // res.sendStatus(200);
  
});

router.get('/testremove', function(req, res, next) {
  // #swagger.tags = ["Test"]

  // serviceManager.removeService("authenticator");
  // res.sendStatus(200);
})

router.get('/testecho', function(req, res, next) {
  // #swagger.tags = ["Test"]

  // const exists = serviceManager.checkServiceEndpoint(
  //   'authenticator',
  //   '/authenticator/signup',
  //   'post');
  // console.log(exists);
  // res.send(exists);
})

// router.get('/:serviceName/:restUrl', function(req, res, next) {
//   // #swagger.tags = ["Test"]

//   // console.log("Requested serviceName is:", req.params.serviceName);
//   // const [endpoint, queryParams] = req.params.restUrl.split('?');
//   // console.log("Requested endpoint is:", endpoint);
//   // console.log("Query param string is:", queryParams);
//   // res.send(req.params);  
// })

module.exports = router;
