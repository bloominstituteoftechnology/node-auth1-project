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

  try {
    if (credentials.username && credentials.password) {
      // const newUser = await Users.add(credentials);
      res.status(201).json(credentials);
    } else {
      res.status(400).json({ error: "Please include a username and password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  try {
    if (username && password) {
      // const user = await Users.findBy({ username });
      if (user && encrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(401).jason({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "Please include a username and password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// This endpoint needs to be restricted unless user provides
// the right credentials in the headers
server.get("/api/users", restricted, (req, res) => {
  try {
    // users = Users.find()
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// RESTRICTED MIDDLEWARE
function restricted(req, res, next) {
  const { username, password } = req.headers;

  try {
    if (username && password) {
      // const user = await Users.findBy({ username });
      if (user && encrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).jason({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "Please include a username and password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// DNE MIDDLEWARE
server.use(function(req, res) {
  res
    .status(404)
    .send("This route does not exist! Return to the main directory");
});

module.exports = server;
