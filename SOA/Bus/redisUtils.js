const redis = require('redis');
const serviceManager = require('./serviceManager');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',  
});
client.on("error", (error) => {
  console.log(error);
});
client.psubscribe("p[uo][tp].*");

client.on("pmessage", (pattern, channel, message) => {
  console.log("Received message");
  console.log("On pattern:", pattern);
  const [action, serviceName] = channel.split('.');
  console.log("On postfix:", action);
  console.log("And prefix", serviceName);
  console.log("Message was:", message);
  console.log("attempting action requested...");
  switch (action) {
    case 'put':
      serviceManager.addService(serviceName, message);
      break;
    case 'pop':
      serviceManager.removeService(serviceName);
      break;
    default:
      console.log('Invalid message queue prefix');
      return;
  }
})

module.exports = client;