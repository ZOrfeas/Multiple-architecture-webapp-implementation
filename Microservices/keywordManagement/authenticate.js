const axios = require('axios');
const { Unauthorized } = require('http-errors');

const authenticatorBaseURL = 'http://' + 
                             process.env.AUTH_HOSTNAME + 
                             ':' + 
                             process.env.AUTH_PORT;

/**
 * Authentication callback for use in routes requiring authentication  
 * All arguments are provided by the express router.  
 * Should be used before the route handler.
 */
async function authenticate(req, res, next) {
  const token = req.headers.authorization;
  let authResponse;
  try {
    authResponse = await axios.get(
      authenticatorBaseURL + '/protected', 
      { 
          headers: {
          'Authorization': token,
          }
    });
    req.user = authResponse.data;
  } catch {
    next(new Unauthorized('Invalid token'));
  }
  // reaching here means user was authorized succesfully
  next();
}

module.exports = { authenticate };
