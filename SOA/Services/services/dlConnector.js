const dlUtils = require('../lib-datalayer')

module.exports = new dlUtils(
    process.env.DL_HOSTNAME || 'localhost',
    process.env.DL_PORT || '3000'
);