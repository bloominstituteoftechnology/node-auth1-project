const express = require("express");

const apiRouter = require("./api-router.js");

const server = express();

server.use("/api", apiRouter);

module.exports = server;
