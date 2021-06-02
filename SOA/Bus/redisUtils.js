const redis = require('redis');
const serviceManager = require('./serviceManager');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',  
});
client.on("error", (error) => {
  console.log(error);
});

client.on("pmessage", (pattern, channel, message) => {
  console.log("Received message");
  const [action, serviceName] = channel.split('.');
  console.log("Service", serviceName, "requested", action);
  // console.log("Message was:", message);
  console.log("Beginning action processing ...");
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

client.psubscribe("p[uo][tp].*");

module.exports = client;