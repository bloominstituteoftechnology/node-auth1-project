const express = require("express");
const helmet = require("helmet");

const server = express();

server.use(express.json());
server.use(helmet());

// LOGGER MIDDLEWARE
server.use(function(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
});

// ENDPOINTS
server.get("/", (req, res) => {
  res.send("Welcome to Web Authorization I Challenge API");
});

// DNE MIDDLEWARE
server.use(function(req, res) {
  res
    .status(404)
    .send("This route does not exist! Return to the main directory");
});

module.exports = server;