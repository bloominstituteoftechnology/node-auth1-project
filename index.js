const express = require("express");
const cors = require("cors");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const bcrypt = require("bcryptjs");
const db = knex(knexConfig.development);
const server = express();
server.use(express.json());
server.use(cors());

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 4);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send("Logged in");
      } else {
        res.status(401).json({ message: "Username or password is incorrect" });
      }
    });
});
server.listen(3300, () => console.log("\nrunning on port 3300\n"));
