const express = require('express');
const helmet = require('helmet');

const usersRouter = require('../users/user-router');
const authRouter = require('../auth/auth-router');

const server = express();

server.use(helmet());
server.use(express.json());

server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter);

module.exports = server;