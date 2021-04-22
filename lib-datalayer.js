const axios = require('axios');

/**
 * Wrapper class grouping all methods supported by the data layer
 * Create an instance before use.
 */
 export class DataLayer {
  /**
   * DataLayer constructor
   */
  constructor(url = 'localhost', port = '3000') {
    this.user = new User(url, port);
    this.user.awaiter = this.awaiter;
    this.question = new Question(url, port);
    this.question.awaiter = this.awaiter;
    this.answer = new Answer(url, port);
    this.answer.awaiter = this.awaiter;
    this.keyword = new Keyword(url, port);
    this.keyword.awaiter = this.awaiter;
  }

  /**
   * Utility method
   * @param {*} retval the return value of an axios call
   * @returns a Promise with the return value or its contents
   */
  async awaiter(retval) {
    try {
      return await retval;
    } catch (error) {
      return error;
    }
  }  
}

/**
 * Wrapper of data layer calls refering to User
 */
class User {
  awaiter(retval) { return retval; }
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/user';
  }

  /** creates a user with the given creation dto */
  create(userDTO) { return this.awaiter(axios.post(this.src, userDTO)); }
  /** returns all users */
  getAll() { return this.awaiter(axios.get(this.src)); }
  /** returns one user by id */
  getOne(id) { return this.awaiter(axios.get(this.src + id)); }
  /** Updates a user by id, with given update object */
  update(id, userUpdateDTO) { 
    return this.awaiter(
      axios.patch(this.src + id, userUpdateDTO)
    );
  }
  /** Deletes a user by id */
  delete(id) { return this.awaiter(axios.delete(this.src + id)); }
}
/**
 * Wrapper of data layer calls refering to Answer
 */
class Answer {
  awaiter(retval) { return retval; }
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/answer';
  }

  /** creates a answer with the given creation dto */
  create(answerDTO) { return this.awaiter(axios.post(this.src, answerDTO)); }
  /** returns all answers */
  getAll() { return this.awaiter(axios.get(this.src)); }
  /** returns one answer by id */
  getOne(id) { return this.awaiter(axios.get(this.src + id)); }
  /** Updates a answer by id, with given update object */
  update(id, answerUpdateDTO) { 
    return this.awaiter(
      axios.patch(this.src + id, answerUpdateDTO)
    );
  }
  /** Deletes a answer by id */
  delete(id) { return this.awaiter(axios.delete(this.src + id)); }

}
/**
 * Wrapper of data layer calls refering to Question
 */
class Question {
  awaiter(retval) { return retval; }
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/question';
  }
  /** creates a question with the given creation dto */
  create(questionDTO) { return this.awaiter(axios.post(this.src, questionDTO)); }
  /** returns all questions */
  getAll() { return this.awaiter(axios.get(this.src)); }
  /** returns one question by id */
  getOne(id) { return this.awaiter(axios.get(this.src + id)); }
  /** Updates a question by id, with given update object */
  update(id, questionUpdateDTO) { 
    return this.awaiter(
      axios.patch(this.src + id, questionUpdateDTO)
    );
  }
  /** Deletes a question by id */
  delete(id) { return this.awaiter(axios.delete(this.src + id)); }
}
/**
 * Wrapper of data layer calls refering to Keyword
 */
class Keyword {
  awaiter(retval) { return retval; }
  constructor(url, port) {
    this.src = 'http://' + url + ':' + port + '/keyword';
  }
  /** creates a keyword with the given creation dto */
  create(keywordDTO) { return this.awaiter(axios.post(this.src, keywordDTO)); }
  /** returns all keywords */
  getAll() { return this.awaiter(axios.get(this.src)); }
  /** returns one keyword by id */
  getOne(id) { return this.awaiter(axios.get(this.src + id)); }
  /** Updates a keyword by id, with given update object */
  update(id, keywordUpdateDTO) { 
    return this.awaiter(
      axios.patch(this.src + id, keywordUpdateDTO)
    );
  }
  /** Deletes a keyword by id */
  delete(id) { return this.awaiter(axios.delete(this.src + id)); }

}

