const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./routes/users-route');
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use('/', usersRouter);

module.exports = server;
