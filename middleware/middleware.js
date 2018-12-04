const express = require('express');
const logger = require('morgan');
const loginRouter = require('../middleware/loginRouter');
const registerRouter = require('../middleware/registerRouter');
const userRouter = require('../middleware/userRouter');
const cors = require('cors');
//const session = require('express-session');
//const sessionConfig = require('../data/sessionConfig')

module.exports = server => {
  server.use(cors());
 // server.use(session(sessionConfig));
  server.use(express.json());
  server.use(logger('combined'));
  server.use('/api/register', registerRouter);
  server.use('/api/login', loginRouter);
  server.use('/api/users', userRouter);
}