const passport = require('passport');
const bcrypt = require('bcrypt');
const axios = require('axios');

/**
 * -------------- LOCAL STRATEGY --------------
 */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, done) => {
  //axios.get(`/user/${username}`)
  axios.get(`/user`)
      .then((response) => {
        if (!response.data) { // could not find user
          return done(null, false);
        }

        const hash = response.data.password;

        bcrypt.compare(password, hash, (error, result) => {
          if (error) {
            return done(error);
          }
          return done(null, result ? { username: response.data.username } : false);
        });
      })
      .catch((error) => {
        done(error);
      });
}));

/**
 * -------------- JWT STRATEGY --------------
 */

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
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
