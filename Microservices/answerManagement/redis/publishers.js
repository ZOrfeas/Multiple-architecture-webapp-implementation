const redis = require('redis');
const { EntityEnum, ActionEnum } = require('./listeners');

const publisher = redis.createClient({
  host: process.env.REDIS_HOSTNAME || 'localhost',
});

publisher.on("error", (error) => console.log(error));

function publish(entity, action, dto) {
  try {
    if (entity !== EntityEnum[entity]) throw new TypeError('Invalid entity provided to publisher');
    if (action !== ActionEnum[action]) throw new TypeError('Invalid action provided to publisher');
    const message = JSON.stringify(dto);
    const channel = `${entity}.${action}`;
    console.log("Attempting publish on channel", channel);
    publisher.publish(channel, message);
  } catch (e) {
    if (e instanceof TypeError) {
      console.log(e.message);
    } else {
      throw e;
    }
  }

}

module.exports = { EntityEnum, ActionEnum, publish };