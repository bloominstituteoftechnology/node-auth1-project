const express = require("express");
const helmet = require("helmet");
const session = require('express-session');
const bcrypt = require("bcryptjs");

const authRouter = require('/auth/auth-router.js');
const usersRouter = require('/users/users-router.js');

const server = express();

const sessionConfig = {
  name: "cookie monster", // session name to increase security
  secret: "mellon",
  cookie: {
    maxAge: 1000 * 60 * 10, // milliseconds, 10 min
    secure: false, // use cookie over https (development)
    httpOnly: true, // false means JS can access the cookie on the client
  },
  resave: false, // avoid recreating unchanged sessions
  saveUninitialized: true, // GDPR complicance, if user does not want cookies, then false
}

server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig))

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
server.use("/api/register", authRouter);
server.use("/api/login", authRouter);

// DNE MIDDLEWARE
server.use(function(req, res) {
  res
    .status(404)
    .send("This route does not exist. Return to the main directory");
});

module.exports = server;
