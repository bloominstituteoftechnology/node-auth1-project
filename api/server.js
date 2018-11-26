const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

// routes imports
const users = require("./users");
const register = require("./register");
const login = require("./login");

// server middleware
const server = express();
server.use(express.json());

// Routes
server.use("/api/users", users);
server.use("/api/register", register);
server.use("/api/login", login);

server.get("/", (req, res) => {
  res.status(200).json({ message: "api on" });
});

module.exports = server;
