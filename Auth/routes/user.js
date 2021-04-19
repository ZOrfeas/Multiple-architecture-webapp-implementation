const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(
      {
        "id": 0,
        "displayName": "John",
        "username": "john@mail.com",
        "password": "secret"
      }
  )
})

module.exports = router;
