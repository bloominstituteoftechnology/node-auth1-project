const express = require("express");
const apiRouter = require("./api-router");
// const configureMiddleware = require("./configure-middleware");

const server = express();
server.use(express.json());

// configureMiddleware(server);

server.use("/api", apiRouter); // after the api endpoint is reached, activate "apiRouter"
module.exports = server;
