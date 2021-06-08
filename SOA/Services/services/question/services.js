const dlCon = require('../dlConnector');

class QuestionServices {
  static addQuestion(questionDTO) {
    return dlCon.question.create(questionDTO);
  }
  static addKeyword(keywordDTO) {
    return dlCon.keyword.create(keywordDTO);
  }
  static getAllKeywords() {
    return dlCon.keyword.getAll();
  }
};

module.exports = QuestionServices;