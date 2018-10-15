const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");

const server = express();

//set up db
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
// apply middleware
server.use(express.json());
server.use(cors());

//Routes
server.get("/api/users", (req, res) => {
  db("users")
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

server.post("/api/register", (req, res) => {
  const creds = req.body;
  console.log(creds);
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;
  console.log(creds);

  db("users")
    .insert(creds)
    .then(id => res.send(id))
    .catch(err => res.status(500).json(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;
  console.log(creds);
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      console.log(user);
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        console.log("exists");
        res.status(200).json({ message: "Access granted" });
      } else res.status(401).json({ message: "You shall not pass" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

server.listen(9000, () => {
  console.log("API is running");
});
