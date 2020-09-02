const express = require('express');
const server = express();
// const taskRouter = require('./routers/taskRouter');

server.use(express.json());
// server.use('/tasks', taskRouter);

module.exports = server;