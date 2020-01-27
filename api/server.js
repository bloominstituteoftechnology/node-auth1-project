const express = require("express");

// this router actually aggregates several other router
const apiRouter = require("./api-router.js");

// this function aggregates all the plugging in of middlewares
const configureMiddleware = require("./configure-middleware.js");

const server = express();

configureMiddleware(server); // connecting all middlewares in 1 fell swoop

server.use("/api", apiRouter); // connecting all routers in 1 fell swoop

module.exports = server;
