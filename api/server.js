const express = require("express");

const configureMiddleware = require("./configure-middleware.js");
const apiRouter = require("./api-router.js");

const server = express();

configureMiddleware(server);

server.use("/api", apiRouter);

// server.get("/", (req, res) => {
//   res.send("Authentication Week Let's Get It!");
// });

module.exports = server;
