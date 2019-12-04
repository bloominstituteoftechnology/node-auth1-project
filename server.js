const express = require("express");
const helmet = require("helmet");
const server = express();

const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

server.use(helmet());
server.use(express.json());

server.use("/api/", authRouter);
server.use("/api/", usersRouter);

module.exports = server;
