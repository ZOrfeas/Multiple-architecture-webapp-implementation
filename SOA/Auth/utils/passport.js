const passport = require('passport');
const bcrypt = require('bcrypt');
const axios = require('axios');

/**
 * -------------- SIGN IN LOCAL STRATEGY --------------
 */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // check if user exists
    const response = await axios.post('/user/by-email', { email: username })

    if (Object.keys(response.data).length === 0) { // could not find user
      return done(null, false);
    }
    // compare password hashes
    const match = await bcrypt.compare(password, response.data.password);

    if (!match) { // hashes don't match
      return done(null, false);
    }

    const { id, displayName, email } = response.data;
    return done(null, { id, displayName, email });
  } catch(error) {
    done(error);
  }
}));

/**
 * -------------- PROTECTED JWT STRATEGY --------------
 */

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  axios.get(`/user/${jwt_payload.id}`) // check if user exists
      .then(response => {
        if (Object.keys(response.data).length === 0) { // could not find user
          return done(null, false);
        }

        const { id, email } = response.data;
        return done(null, { id, email });
      })
      .catch(error => {
        done(error);
      });
}));
