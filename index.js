const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");

const dbConfig = require("./knexfile");

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.post("/api/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 3);

  credentials.password = hash;
  console.log(credentials);
  db("users")
    .insert(credentials)
    .then(ids => {
      console.log(id);
      const id = ids[0];

      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "user", "password")
    .then(users => {
      res.join(users);
    })
    .catch(err => res.send(err));
});

server.listen(9000);
