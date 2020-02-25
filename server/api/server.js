const express = require('express');
const cors = require('cors');
const server = express();
const usersRouter = require('./users/usersRouter.js');
const userActions = require('./users/userActions.js');

server.use(express.json());
server.use('/api', userActions);
server.use('/api/users', usersRouter);

module.exports = server;