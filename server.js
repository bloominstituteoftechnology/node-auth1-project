const express = require('express');
const router = require('./router');
const configureMiddleware = require('./config-mid');

const server = express();

configureMiddleware(server);

server.use('/api', router);

module.exports = server;