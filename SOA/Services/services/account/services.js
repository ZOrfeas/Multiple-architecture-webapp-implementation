const dlCon = require('../dlConnector');

class AccountServices {
  static getAccountInfo(id) {
    return dlCon.user.getOne(id);
  }
  static getQuestionsOfAnswers(idList) {
    return dlCon.question.getByAnswers(idList);
  }
};

module.exports = AccountServices;