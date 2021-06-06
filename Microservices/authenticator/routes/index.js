const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../database/utils');

axios.defaults.baseURL = "http://" +
                          process.env.DL_HOSTNAME + ":" +
                          process.env.DL_PORT + "/";

/**
 * -------------- SIGN UP --------------
 */

router.post('/signup', async (req, res, next) => {
  // #swagger.tags = ['Sign up']
  // #swagger.summary = 'Signs a new user up'
  try {
    // hash password
    const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

    const userDetails = { // new user
      email: req.body.username,
      password_hash: hash
    };

    const user = await User.create(userDetails);

    const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ email: user.email , token });
  } catch(error) {
    console.log(error.errors[0]?.message);
    // const status = error.response?.status;
    const message = error.errors[0]?.message;
    if (message === 'email must be unique') {
      res.status(400).json({ message: 'Email already exists' });
    }
    else {
      next(error);
    }
  }
});

/**
 * -------------- SIGN IN --------------
 */

router.post('/signin', passport.authenticate('local', { session: false }), (req, res) => {
  // #swagger.tags = ['Sign in']
  // #swagger.summary = 'Signs an existing user in'
  const { email } = req.user;

  const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({ email: email, token });
});

/**
 * -------------- PROTECTED --------------
 */

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  // #swagger.tags = ['Check access']
  // #swagger.summary = 'Authenticates a user by token'
  res.status(200).json(req.user);
});

module.exports = router;
