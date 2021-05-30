const redis = require('redis');

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
})

module.exports = client;