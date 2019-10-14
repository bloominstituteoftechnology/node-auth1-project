const express = require('express');
const helmet = require('helmet');

const db = require('./data/db-config');

const UsersRouter = require('./users/users-router');

const server = express();

server.use(helmet());
server.use(express.json());
server.use('/api/users', UsersRouter)

module.exports = server;