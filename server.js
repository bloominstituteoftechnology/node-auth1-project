const express = require('express');

const registerRouter = require('./auth/register_router');
const loginRouter = require('./auth/login_router');
const userRouter = require('./users/users-router');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send({server: 'up'});
});

server.use('/api/register', registerRouter);
server.use('/api/login', loginRouter);
server.use('/api/users', userRouter);

module.exports = server;
