const express = require('express');
const apiRputer = require('./api-router');
const configureMiddleWare = require('./configure-middleware');

const server = express();

configureMiddleWare(server);

server.use('/api', apiRputer);

module.exports = server;