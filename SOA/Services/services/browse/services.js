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
};

module.exports = BrowseServices;