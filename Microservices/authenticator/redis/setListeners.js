const { Listeners, EntityEnum, ActionEnum } = require('./listeners');
const { User } = require('../database/utils');

const listenerConfig = {
  [EntityEnum.user]: {
    [ActionEnum.update]: (message)=>console.log("placeholder 1:", message),
  },
}
const listeners = new Listeners(listenerConfig);

module.exports = { listeners };