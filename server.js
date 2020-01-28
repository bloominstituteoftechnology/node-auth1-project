const express = require('express');
const router = require('./router');
const authRouter = require('./authRouter')
const configureMiddleware = require('./config-mid');

const server = express();

configureMiddleware(server);

server.use('/api', router);
server.use('/api', authRouter);

module.exports = server;