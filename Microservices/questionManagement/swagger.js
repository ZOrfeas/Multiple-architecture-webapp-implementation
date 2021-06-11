const swaggerAutogen = require('swagger-autogen')({
  openapi: "3.0.0",
  disableLogs: false,
});

const doc = {
  info: {
    title: 'Question Management endpoints',
    description: 'Endpoint capabilities of the Question Management microservices for the askMeAnything MS implementation',
  },
  host: 'localhost:3000',
  basepath: '/',
  schemes: ['http'],
  tags: [],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => require('./bin/www'));
