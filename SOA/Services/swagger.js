const swaggerAutogen = require('swagger-autogen')({
  openapi: "3.0.0",
  disableLogs: false,
});

const doc = {
  info: {
    title: 'Service endpoints',
    description: 'Endpoint capabilities of the Services Component for the askMeAnything SOA implementation',
  },
  host: 'localhost:3000',
  basepath: '/',
  schemes: ['http'],
  tags: [
    { name: 'Account' },
    { name: 'Answer' },
    { name: 'Question' },
    { name: 'Browse' },
  ],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./bin/www');
});
