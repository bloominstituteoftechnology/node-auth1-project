// imports
const express = require("express");
const bcrypt = require("bcryptjs");

// instantiate server
const server = express();
server.use(express.json());

// endpoints
server.post("/api/register", (req, res) => {
  const credentials = req.body;
  // hash the password
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  // save the user
  db("users")
    .insert(credentials)
    .then(ids => res.status(201).json(ids[0]))
    .catch(err => express.status(500).json(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: "Could not login" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get("/api/users", (req, res) => {
  db("users")
    .then(users => res.status(201).json(users))
    .catch(err => express.status(500).json(err));
});

// server port
server.listen(9000, () => {
  console.log("Server is running on port 9000");
});

// knex
const knex = require("knex");
const knexConfig = require("./knexfile");
const db = knex(knexConfig.development);
