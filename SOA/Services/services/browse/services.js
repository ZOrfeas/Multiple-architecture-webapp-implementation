const { BadRequest } = require('http-errors');
const dlCon = require('../dlConnector');

class BrowseServices {
  /**
   * Fetches all questions containing the provided keywords, supports pagination
   * @param {number[]} idList Array containing ids of keywords
   * @param {*} pagesize (optional) size of page
   * @param {*} pagenr (optional) page number
   */
  static questionsByKeywords(idListRaw, pagesize, pagenr) {
    if (idListRaw === undefined)
      throw new BadRequest(`Empty keyword id list given`);
    const idList = idListRaw.split(',').map((str) => {
      const tempId = +str;
      if (isNaN(tempId)) 
        throw new BadRequest(`Invalid query param string id provided: ${req.query.id}`);
      else
        return tempId;
    });
    let promiseRes;
    if (pagesize === undefined && pagenr === undefined) {
      promiseRes = dlCon
        .question.getAllByKeywords(idList);
    } else if (pagesize === undefined || pagenr === undefined) {
        throw new BadRequest(``)
    } else {
      promiseRes = dlCon
        .question.getAllByKeywords(idList, pagenr, pagesize);
    }  
    return promiseRes;
  };

  /**
   * Counts all questions containing the provided keywords
   * @param {number[]} idList Array containing ids of keywords
   */
  static countQuestionsByKeywords(idListRaw) {
    const idList = idListRaw.split(',').map((str) => {
      const tempId = +str;
      if (isNaN(tempId)) 
        throw new BadRequest(`Invalid query param string id provided: ${req.query.id}`);
      else
        return tempId;
    });
    return dlCon.question.getCountByKeywords(idList);
  };

  static countQuestions() {
    return dlCon.question.getCount();
  };
  static countAnswers() {
    return dlCon.answer.getCount();
  };
  static countUsers() {
    return dlCon.user.getCount();
  };
  static countKeywords() {
    return dlCon.keyword.getCount();
  };

  static getPage(pageNr, pageSize) {
    return dlCon.question.getPage(pageNr, pageSize);
  };

  static getQuestionInfo(id) {
    return dlCon.question.getInfo(id);
  }
};

module.exports = BrowseServices;