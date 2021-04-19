const express = require('express');
const router = express.Router();
const axios = require('axios');
const bcrypt = require('bcrypt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// localhost axios calls for testing
axios.defaults.baseURL = 'http://localhost:3000';

passport.use(new LocalStrategy((username, password, done) => {
  //axios.get(`/user/${username}`)
  axios.get(`/user`)
    .then((response) => {
      if (!response.data) { // could not find user
        return done(null, false);
      }

      const hash = response.data.password;

      /*bcrypt.compare(password, hash)
        .then((result) => {
          if (!result) { // password hashes don't match
            return done(null, false);
          }
      });*/
      if (hash != 'secret') return done(null, false);

      return done(null, { username: response.data.username });
    })
    .catch((error) => {
      done(error); // done(error, false)?
    });
}));

const opts = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  //axios.get(`/user/${jwt_payload.username}`)
  axios.get(`/user`)
    .then((response) => {
      if (!response.data) { // could not find user
        return done(null, false);
      }
      return done(null, { username: response.data.username });
    })
    .catch((error) => {
      done(error);
    });
}));

/* POST signin. */
router.post('/signin',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.json({
      token: jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    });
  }
);

/* GET whoami. */
router.get('/whoami',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ user: req.user })
  }
);

module.exports = router;
