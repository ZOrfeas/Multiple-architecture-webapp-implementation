const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

axios.defaults.baseURL = process.env.DATA_LAYER_URL;

/**
 * -------------- SIGN UP --------------
 */

router.post('/signup', async (req, res, next) => {
  // hash password
  const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

  const user = { // create new user
    displayName: req.body.displayName,
    email: req.body.username,
    password: hash
  };

  axios.post('/user', user) // attempt to save user
      .then(response => { // store jwt in cookies (httpOnly)
        const { id, email } = response.data;
        const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('token', token, { httpOnly: true })
        res.status(200).json({ id, email });
      })
      .catch(error => {
        const { statusCode, message } = error.response.data;
        if (statusCode ===  400 && message === 'Email already exists') {
          res.status(statusCode).json({ message });
        }
        else {
          next(error);
        }
      });
});

/**
 * -------------- SIGN IN --------------
 */

router.post('/signin', passport.authenticate('local', { session: false }), (req, res) => {
  res.status(200).json({
    token: jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
  });
});

/**
 * -------------- PROTECTED --------------
 */

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
