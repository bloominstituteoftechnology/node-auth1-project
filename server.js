const express = require('express');
const authRouter = require('./auth/register_router');
const userRouter = require('./users/users-router');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send({server: 'up'});
});

server.use('/api/register', authRouter);
server.use('/api/users', userRouter);

module.exports = server;
