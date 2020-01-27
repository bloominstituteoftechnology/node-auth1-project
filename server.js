const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./users/user-router');

const server = express();

server.use(helmet());
server.use(logger);
server.use(express.json());
server.use(cors());

server.use('/', usersRouter);

function logger(req, res, next) {
  console.log(req.method, req.url, Date.now())
  next();
};

module.exports = server;