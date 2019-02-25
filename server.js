const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const server = express();

server.use(logger());
server.use(helmet());
server.use(express.json());


module.exports = server;
