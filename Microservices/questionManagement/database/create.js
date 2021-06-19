const { Client } = require('pg');
require('dotenv').config();

function print(msg) {
  process.stdout.write(msg);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const savedDbName = process.env.PGDATABASE || 'ms-questions';
process.env.PGDATABASE = 'postgres';

const nextReq = '../swagger';
const retryTime = 5 * 1000;

async function attemptConnection() {
  const creator = new Client();
  print('Connecting...');
  try {
    await creator.connect()
    console.log('Connected');
    return creator;
  } catch (err) {
    return;
  }
}

async function setupDb(maxAttempts = 10) {
  let attempt = 0;
  let connection;
  while (!(print(`Try ${attempt}: `), connection = await attemptConnection()) 
       && (attempt++ < maxAttempts)) {
    print("Failed to connect, ");
    console.log('Retrying in', (retryTime/1000).toString() + 's');
    await sleep(retryTime);
  }
  if (!connection) {
    console.log("Failed to many times. Exiting...");
    process.exit(1);
  }
  try {
    const res = await connection.query(`CREATE DATABASE "${savedDbName}"`);
    console.log("Created the database");
  } catch (err) {
    if (err.message === `database "${savedDbName}" already exists`) {
      console.log("Database already exists");
    } else {
      console.log(err);
      process.exit(1);
    }
  }
  process.env.PGDATABASE = savedDbName;
  await connection.end();
  require(nextReq);
}

setupDb();