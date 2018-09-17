const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");

const dbConfig = require("./knexfile");

const db = knex(dbConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.post("/api/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 3);

  credentials.password = hash;

  db("users_table")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];

      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/users", (req, res) => {
  db("users_table")
    .select("id", "username", "password")
    .then(users => {
      res.join(users);
    })
    .catch(err => res.send(err));
});

server.listen(9000);
