const express = require('express');
const helmet = require('helmet');
const server = express();
const UsersRouter = require('./users/users-router.js');

server.use(helmet());
server.use(express.json());

server.use('/api/', UsersRouter );




module.exports = server;