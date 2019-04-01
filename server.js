const express = require("express");
const helmet = require("helmet");
const encrypt = require("bcryptjs");

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
  let credentials = req.body;

  const hash = encrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  // DB HELPER FILE HERE (Users.add(user))
  try {
    if (credentials.username && credentials.password) {
      // const newUser = await Users.add(credentials);
      res.status(201).json(credentials);
    } else {
      res.status(400).json({ error: "Please include a username and password." }) 
    }
  } catch (error) {
    res.status(500).json(error);
  }
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
