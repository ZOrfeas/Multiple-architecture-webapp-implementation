const swaggerAutogen = require('swagger-autogen')({
  openapi: "3.0.0",
  disableLogs: false,
});

const doc = {
  info: {
    title: 'Authenticator endpoints',
    description: 'Endpoint capabilities of the Authenticator Component for the askMeAnything SOA implementation',
  },
  host: 'localhost:3000',
  basepath: '/',
  schemes: ['http'],
  tags: [
    { name: 'Sign up' },
    { name: 'Sign in' },
    { name: 'Check access' },
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => require('./bin/www'))