const connector = require('../lib-datalayer')

module.exports = new connector.DataLayer(
    process.env.DL_HOSTNAME || 'localhost',
    process.env.DL_PORT || '3000'
);