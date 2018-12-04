const express = require('express');
const logger = require('morgan');
const loginRouter = require('../middleware/loginRouter');
const registerRouter = require('../middleware/registerRouter');
const userRouter = require('../middleware/userRouter');

module.exports = server => {
  server.use(express.json());
  server.use(logger('dev'));
  server.use('/api/register', registerRouter);
  server.use('/api/login', loginRouter);
  server.use('/api/users', userRouter);
}