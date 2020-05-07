const express = require("express");
const configWare = require("./config-middleware");
const apiRouter = require("./api-router.js");
const authRouter = require("../auth/auth-router");

const server = express();

configWare(server);

server.use("/api/auth", authRouter);
server.use("/api", apiRouter);

module.exports = server;