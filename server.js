const express = require('express');
const helmet = require('helmet');

const UsersRouter = require('./users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use('/api/users', UsersRouter);


module.exports = server;