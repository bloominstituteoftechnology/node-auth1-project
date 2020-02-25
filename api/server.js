const express = require("express");

const apiRouter = require("./routers.js");
const configureMiddleware = require("./configMiddleware");

const server = express();

configureMiddleware(server);

server.use("/api", apiRouter);

module.exports = server;