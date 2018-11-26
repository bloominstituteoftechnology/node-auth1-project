const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");

const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
const server = express();
server.use(express.json());
server.use(cors());

server.post("/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => json(err));
});

server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.get("/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
