const express = require('express');
const helmet = require('helmet');

const UsersRouter = require('./users/users-router.js');
const setupGlobalMiddleware = require('./setup-middleware.js');

const server = express();

setupGlobalMiddleware(server);

server.use(helmet());
server.use(express.json());
server.use('/api/users', UsersRouter);


module.exports = server;