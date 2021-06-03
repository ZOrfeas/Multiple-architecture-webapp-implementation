const express = require('express');
const router = express.Router();
const serviceManager = require('../serviceManager');

const matchAllPattern = '*';

router.get(matchAllPattern, (req, res, next) => {
  // #swagger.ingore = true

  const headers = req.headers;
  const [fullUrl, queryParams] = req.url.split('?');
  const [,serviceName] = fullUrl.split('/',2);
  const exists = serviceManager.checkServiceEndpoint(
    serviceName,
    fullUrl,
    'get',
  );
  if (exists) {
    serviceManager.doGet(serviceName, fullUrl, queryParams, headers)
      .then(callRes => {
        // console.log("Hello", callRes.data);
        res.status(callRes.status).json(callRes.data);
      })
      .catch((err) => {
        res.status(err.response.status).send(
          err.response.data ? err.response.data : err.response.statusText
        );
      })
      .catch(() => {
        console.log("GET Failed"); res.sendStatus(500);
      });
  } else {
    res.status(404).json({ message: "Service not found" });
  }
})

router.post(matchAllPattern, (req, res, next) => {
  // #swagger.ingore = true

  const headers = req.headers;
  const body = req.body;
  const [fullUrl, queryParams] = req.url.split('?');
  const [,serviceName] = fullUrl.split('/',2);
  const exists = serviceManager.checkServiceEndpoint(
    serviceName,
    fullUrl,
    'post',
  );
  if (exists) {
    serviceManager.doPost(serviceName, fullUrl, queryParams, headers, body)
      .then(callRes => {
        res.status(callRes.status).json(callRes.data);
      })
      .catch((err) => {
        res.status(err.response.status).send(
          err.response.data ? err.response.data : err.response.statusText
        );
      })
      .catch(() => {
        console.log("POST Failed"); res.sendStatus(500);
      });
  } else {
    res.status(404).json({ message: "Service not found" });
  }
})

module.exports = router;