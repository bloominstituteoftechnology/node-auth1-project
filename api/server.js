// dependencies
const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);
const cors = require("cors");
const session = require("express-session");

// session config
const sessionConfig = require("../keys");

//  api route imports
const users = require("./users");
const register = require("./register");
const login = require("./login");

// server middleware
const server = express();
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

// Routes
server.use("/api/users", users);
server.use("/api/register", register);
server.use("/api/login", login);

// root api test route
server.get("/", (req, res) => {
  res.status(200).json({ message: "api on" });
});

module.exports = server;
