const dlCon = require('../dlConnector');

class AccountServices {
  static getAccountInfo(id) {
    return dlCon.user.getOne(id);
  }
  static getQuestionsOfAnswers(idList) {
    return dlCon.question.getByAnswers(idList);
  }
  static getQuestionCountByYear(year, id) {
    return dlCon.question.getCountByYear(year, id);
  }
  static getAnswerCountByYear(year, id) {
    return dlCon.answer.getCountByYear(year, id);
  }
};

module.exports = AccountServices;