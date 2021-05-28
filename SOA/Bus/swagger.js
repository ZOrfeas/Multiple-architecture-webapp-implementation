const swaggerAutogen = require('swagger-autogen')({
    openapi: "3.0.0",
    disableLogs: false,
});

const doc = {
    info: {
        title: 'Service Bus Available endpoints',
        description: 'Available endpoints provided by the Service Bus Component of the askMeAnything SOA implementation',
    },
    host: 'localhost:3000',
    basepath: '/',
    schemes: ['http'],
    tags: [],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www')
});
