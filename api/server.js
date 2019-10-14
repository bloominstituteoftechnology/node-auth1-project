const express = require("express");
const helmet = require("helmet");

const UsersRouter = require('../users/users.js')

const server = express();
const cors = require('cors');

server.use(helmet());
server.use(express.json());
server.use(cors());



server.use('/api/auth', UsersRouter);



module.exports = server;