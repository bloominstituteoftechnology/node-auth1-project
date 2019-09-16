const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const UserRouter = require('./users/userRouter.js');

const server = express();

server.use(helmet());

server.use(cors());

server.use(express.json());
server.use('/api/schemes', UserRouter);

module.exports = server;