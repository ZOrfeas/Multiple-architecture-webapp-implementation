const redis = require('redis');

/** Enum of available entities to attach listeners to. */
const EntityEnum = Object.freeze({
  user: 'user',
  question: 'question',
  answer: 'answer',
  keyword: 'keyword',
  qHasK: 'qHasK', // question has keyword relationship channel
});
/** Enum of available actions to listen for. */
const ActionEnum = Object.freeze({
  create: 'create',
  update: 'update',
  delete: 'delete',
});

/** Creates a custom error handler that outputs on which entity and action the error occured */
function errorHandlerFactory(entity, action) {
  return (error) => {
    console.log(`Error on listener for entity ${entity} and action ${action}:`);
    console.log(error);
  }
}

/**
 * Accepts a config object defining which entities and for which actions to do what   
 * e.g.:   
 * {   
 * &nbsp;EntityEnum.user: {   
 * &nbsp;&nbsp;ActionEnum.create: (message) => console.log(message)    
 * &nbsp;},   
 * &nbsp;EntityEnum.question: {    
 * &nbsp;&nbsp;ActionEnum.update: (message) => message + 'hello',    
 * &nbsp;&nbsp;ActionEnum.delete: (message) => ... ,   
 * &nbsp;},   
 * }
 */
class Listeners {
  constructor(configObj) {
    this.listeners = {}
    try {
      for (const [entity, actionsObj] of Object.entries(configObj)) {
        if (entity !== EntityEnum[entity]) throw new TypeError('Invalid entity provided to Listener constructor');
        for (const [action, callback] of Object.entries(actionsObj)) {
          if (action !== ActionEnum[action]) throw new TypeError('Invalid action provided to Listener constructor');
          if (typeof callback !== 'function') throw new TypeError('Invalid callback provided to Listener constructor, is not callable');
          // After all checks here you are safe to establish listeners or what have you.
          const listener = redis.createClient({
            host: process.env.REDIS_HOSTNAME || 'localhost',
          });
          listener.on("error", errorHandlerFactory(entity, action));
          listener.on("message", (channel, message) => {
            console.log(`${new Date().toISOString()}: Received message on channel ${channel}:`)
            callback(JSON.parse(message));
          });
          listener.subscribe(`${entity}.${action}`);
          this.listeners[entity] = { action: listener };
        }
      }
      // store the configObj for possible further use
      this.config = configObj;
    } catch (e) {
      if (e instanceof TypeError) {
        if (e.message === 'Cannot convert undefined or null to object') {
          console.log('Invalid argument provided to Listener constructor');
        } else {
          console.log(e.message);
        }
      } else {
        throw e;
      }
    }
  }
}

module.exports = {Listeners, EntityEnum, ActionEnum };