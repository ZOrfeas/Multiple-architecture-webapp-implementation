const dlCon = require('../dlConnector');

class AnswerServices {
  static addAnswer(answerDTO) {
    return dlCon.answer.create(answerDTO);
  }
};

module.exports = AnswerServices;