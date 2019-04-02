const express = require("express");
const helmet = require("helmet");
const session = require("express-session");

const authRouter = require("../auth/auth-router.js");
// const usersRouter = require('../users/users-router.js');
const sessionConfig = require('../auth/session-config.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig));

// LOGGER MIDDLEWARE
server.use(function(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
});

// ENDPOINTS
server.get("/", (req, res) => {
  res.send("Welcome to Web Authorization I Challenge API");
});

// ROUTE HANDLERS
server.use("/api/auth", authRouter);
// server.use('/api/users', usersRouter);

// DNE MIDDLEWARE
server.use(function(req, res) {
  res
    .status(404)
    .send("This route does not exist. Return to the main directory");
});

module.exports = server;
