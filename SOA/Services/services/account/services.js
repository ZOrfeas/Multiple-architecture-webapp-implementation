const dlCon = require('../dlConnector');

class AccountServices {
  static getAccountInfo(id) {
    return dlCon.user.getOne(id);
  }
};

module.exports = AccountServices;