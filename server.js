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

server.post("/api/register", async (req, res) => {
  let user = req.body;

  // DB HELPER FILE HERE (Users.add(user))

});

server.post("/api/login", (req, res) => {});

server.get("/api/users", (req, res) => {});

// DNE MIDDLEWARE
server.use(function(req, res) {
  res
    .status(404)
    .send("This route does not exist! Return to the main directory");
});

module.exports = server;
