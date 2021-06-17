const pgtools = require('pgtools');
require('dotenv').config();

// const hostname = process.env.DB_HOSTNAME || 'localhost';
// const port = +process.env.DB_PORT || 5432;
// const pass = +process.env.DB_PASSWORD;
process.env.PGDATABASE = process.env.PGDATABASE || 'ms-auth';

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
  
// pgtools.createdb(config, process.env.PGDATABASE)
// .then(() => {
//   require(nextReq);
// }).catch((err) => {
//   if (err.name === 'duplicate_database') {
//     require(nextReq);
//   } else {
//     console.log("======================================");
//     console.log(err.message);
//     console.log("======================================");
//   }
// });