const express = require("express");

const authRouter = require("../auth/auth-router.js");
const usersRouter = require('../users/users-router.js');
const setupGlobalMiddleware = require('./setup-middleware');

const server = express();

setupGlobalMiddleware(server);

server.get("/", (req, res) => {
  res.send({ api: "up"});
});

server.use("/api/auth", authRouter);
server.use('/api/users', usersRouter);

module.exports = server;
