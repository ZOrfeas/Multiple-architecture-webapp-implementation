const axios = require('axios');

const authenticatorBaseURL = 'http://' + 
                             process.env.AUTH_HOSTNAME + 
                             ':' + 
                             process.env.AUTH_PORT;

/**
 * Authentication wrapper for use in routes requiring authentication
 * @param {*} req The request object provided from the router
 * @param {*} func A 'ready to call' function callback for after successfull authentication
 * @returns the return value of the callback provided
 */
async function checkToken(req, func) {
    const token = req.headers.authorization
    let authResponse;
    try {
         authResponse = await axios.get(
            authenticatorBaseURL + '/protected', 
            { 
                headers: {
                'Authorization': token,
                }
            });
    } catch (error) {
        return error;
    }
    // reaching here means user was authorized succesfully
    return func();
}

module.exports = { checkToken };