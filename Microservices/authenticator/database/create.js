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
pgtools.createdb(config, process.env.PGDATABASE)
.then(() => {
  require(nextReq);
})
.catch((err) => {
  if (err.name === 'duplicate_database') {
    require(nextReq);
  } else {
    console.log(err);
  }
});