const express = require('express');
const router = express.Router();
const passport = require('passport');
const joi = require('../config/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:3000';

/**
 * -------------- SIGN UP --------------
 */

router.post('/signup', async (req, res) => {
  const {error} = joi.validate(req.body); // validate signup data format
  if (error) {
    return res.json({ message: error.details[0].message });
  }
  /*axios.get(`/user/${req.body.username}`) // check if user already exists
      .then((response) => {
        if (response) {
          return res.json({ message: 'email already exists' });
        }
      })
      .catch((error) => {
        next(error);
      })*/

  // hash password
  const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

  const user = { // create new user
    displayName: req.body.displayName,
    email: req.body.username,
    password: hash
  };

  /*axios.post('/user', user) // save user
      .then((response) => {
        if (response) {
          res.redirect('/some_page');
        }
      })
      .catch((error) => {
        next(error);
      })*/

  return res.json(user);
});

/**
 * -------------- SIGN IN --------------
 */

router.post('/signin', passport.authenticate('local', { session: false }), (req, res) => {
  res.json({
    token: jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
  });
});

/**
 * -------------- PROTECTED --------------
 */

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
