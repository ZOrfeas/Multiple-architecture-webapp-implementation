const Joi = require('joi');

const schema = Joi.object({
  displayName: Joi.string()
      .pattern(new RegExp('^[a-zA-Z]+(?: [a-zA-Z]+)*$')),
  username: Joi.string()
      .email(),
  password: Joi.string()
      .pattern(new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')),
  re_password: Joi.ref('password')
});

module.exports = schema;
