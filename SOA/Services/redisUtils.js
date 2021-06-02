const redis = require('redis');

const hostname = process.env.REDIS_HOSTNAME || 'localhost';
const REDIS_MAX_ATTEMPTS = +process.env.REDIS_MAX_ATTEMPTS || 10;
const serviceName = process.env.SERVICE_NAME || "ama-services";
const specDocUrl = process.env.SERVICE_DOC_URL || "http://localhost:3000/spec-json";
const retry_time = +process.env.RETRY_TIME || 30000; // 30 seconds

const client = redis.createClient({
  host: hostname,
  retry_strategy: (options) => {
    if (options.error && options.error.code === "ECONNREFUSED" && options.attempt > REDIS_MAX_ATTEMPTS) {
      return new Error(`REDIS: Redis connection failed ${REDIS_MAX_ATTEMPTS} times, won't attempt again.`);
    }
    console.log(`REDIS: Retrying in ${retry_time} ...`)
    return 
  }
});

client.on("error", (error) => {
  console.log(error);
});

let publish_delay = 10000;
// let publish_delay = 5000;
function publishServices() {
  if (client.connected) {
    client.publish("put." + serviceName, specDocUrl);
    publish_delay = Math.min(5 * publish_delay, 180000);
    console.log(`Publish succeeded, checking again in ${publish_delay}...`);
  } else {
    publish_delay = 2 * retry_time;
    console.log(`Publish attempt failed, attempting again in ${publish_delay}...`)
  }
  setTimeout(publishServices, publish_delay);
}
// set repeated service publishing
setTimeout(publishServices, publish_delay);

function closeHandler(code) {
  if (client.connected) {
    client.publish("pop." + serviceName, 'Goodbye');    
  } else {
    console.log("Redis connection not up");
  }
  console.log(`Exiting with code ${code} ...`);
  process.exit(code);
}

process.on("SIGINT", closeHandler);
process.on("SIGTERM", closeHandler);

module.exports = { client };