const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(
      {
        "displayName": "Darkwing Duck",
        "username": "dd@mail.com",
        "password": "$2b$10$TVDziN/A.PHajChFQComiO0o7/RjiO.KpORwkVUS5/IJox.VlDxES"
      }
  )
})

module.exports = router;
