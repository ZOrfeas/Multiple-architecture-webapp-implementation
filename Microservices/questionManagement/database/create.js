const pgtools = require('pgtools');
require('dotenv').config();

process.env.PGDATABASE = process.env.PGDATABASE || 'ms-questions';

const config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
};
const nextReq = '../swagger.js';
pgtools.createdb(config, process.env.PGDATABASE)
.then(() => {
    require(nextReq);
}).catch((err) => {
    if (err.name === 'duplicate_database') {
        require(nextReq);
    } else {
        console.log(err);
    }
});