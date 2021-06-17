const pgtools = require('pgtools');
require('dotenv').config();

process.env.PGDATABASE = process.env.PGDATABASE || 'ms-questions';

const config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
};
const nextReq = '../swagger';
const connErrMessage = "Postgres error. Cause: Connection terminated unexpectedly";
const retryTime = 5 * 1000;

async function attemptDbCreation() {
  try {
    await pgtools.createdb(config, process.env.PGDATABASE);
  } catch (err) {
    if (err.name === 'duplicate_database') {
      require(nextReq);
    } else if (err.message === connErrMessage) {
      console.log("Connection failed, retrying in", retryTime.toString());
      setTimeout(attemptDbCreation, retryTime);
    } else {
      console.log(err);
    }
  }
}

attemptDbCreation();
