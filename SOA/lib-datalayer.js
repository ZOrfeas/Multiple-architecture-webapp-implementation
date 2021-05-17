// const api = require('axios');
// const axios = api.create({ timeout: 1000 })
// axios.interceptors.request.use(request => {
//   console.log('Starting Request', JSON.stringify(request, null, 2));
//   return request;
// });
// axios.interceptors.response.use(response => {
//   console.log('Response:', JSON.stringify(response, null, 2));
//   return response;
// });

const axios = require('axios')

/**
 * Wrapper class grouping all methods supported by the data layer
 * Create an instance before use.
 */
class DataLayer {
  /**
   * DataLayer interface constructor
   */
  constructor(url = 'localhost', port = '3000') {
    this.user = new User(url, port);
    this.question = new Question(url, port);
    this.answer = new Answer(url, port);
    this.keyword = new Keyword(url, port);
  }

}
/**
 * Wrapper of data layer calls refering to User
 */
class User {
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/user';
  }

  /** creates a user with the given creation dto */
  create(userDTO) { return axios.post(this.src, userDTO); }
  /** returns all users */
  getAll() { return axios.get(this.src); }
  /** returns one user by id */
  getOne(id) { return axios.get(this.src + id); }
  /** Updates a user by id, with given update object */
  update(id, userUpdateDTO) { 
    return axios.patch(this.src + id, userUpdateDTO);
  }
  /** Deletes a user by id */
  delete(id) { return axios.delete(this.src + id); }
  /** Fetches a user by email */
  getOneByEmail(emailDTO) { 
    return axios.post(this.src + '/by-email', emailDTO);
  }
}
/**
 * Wrapper of data layer calls refering to Answer
 */
class Answer {
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/answer';
  }

  /** creates a answer with the given creation dto */
  create(answerDTO) { return axios.post(this.src, answerDTO); }
  /** returns all answers */
  getAll() { return axios.get(this.src); }
  /** returns one answer by id */
  getOne(id) { return axios.get(this.src + id); }
  /** Updates a answer by id, with given update object */
  update(id, answerUpdateDTO) { 
    return axios.patch(this.src + id, answerUpdateDTO);
  }
  /** Deletes a answer by id */
  delete(id) { return axios.delete(this.src + id); }

}
/**
 * Wrapper of data layer calls refering to Question
 */
class Question {
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/question';
  }
  /** creates a question with the given creation dto */
  create(questionDTO) { return axios.post(this.src, questionDTO); }
  /** returns all questions */
  getAll() { return axios.get(this.src); }
  /** returns one question by id */
  getOne(id) { return axios.get(this.src + id); }
  /** Updates a question by id, with given update object */
  update(id, questionUpdateDTO) { 
    return axios.patch(this.src + id, questionUpdateDTO);
  }
  /** Deletes a question by id */
  delete(id) { return axios.delete(this.src + id); }
  /**
   * Gets all questions having the specified keywords (all of them).  
   * Supports pagination
   * @param {number[]} idList list containing the ids of the keywords 
   * @param {number} pageNr (optional) page nr, positive integer
   * @param {number} pageSize (optional) page size, positive integer
   */
  getAllByKeywords(idList, pageNr, pageSize) {
    let paramWrapper;
    if (pageNr === undefined && pageSize === undefined) {
      paramWrapper = { id: idList.toString() };
    } else {
      paramWrapper = {
        id: idList.toString(),
        pagesize: pageSize,
        pagenr: pageNr,
      };
    }
    return axios.get(this.src + '/by/keyword', { 
      params: paramWrapper
    });
  }
}
/**
 * Wrapper of data layer calls refering to Keyword
 */
class Keyword {
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/keyword';
  }
  /** creates a keyword with the given creation dto */
  create(keywordDTO) { return axios.post(this.src, keywordDTO); }
  /** returns all keywords */
  getAll() { return axios.get(this.src); }
  /** returns one keyword by id */
  getOne(id) { return axios.get(this.src + id); }
  /** Updates a keyword by id, with given update object */
  update(id, keywordUpdateDTO) { 
    return axios.patch(this.src + id, keywordUpdateDTO);
  }
  /** Deletes a keyword by id */
  delete(id) { return axios.delete(this.src + id); }

}

module.exports = DataLayer;