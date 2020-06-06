const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const usersRouter = require("../users/usersRouter");
const authRouter = require("../auth/authRouter");

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter );
server.use('/api/register', authRouter);

module.exports = server;
