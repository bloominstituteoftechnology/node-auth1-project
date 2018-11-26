const express = require("express");
const knex = require("knex");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");

const knexConfig = require("./knexfile.js");

const server = express();

const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

server.get("/", (req, res) => res.send("Welcome!"));

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 12);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(id => res.status(201).json(id))
    .catch(err => res.status(500).json(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: "Logged in!" });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

const port = 8000;
server.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);
