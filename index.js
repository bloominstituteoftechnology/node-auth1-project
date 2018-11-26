const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");

const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
const server = express();
server.use(express.json());
server.use(cors());

server.post("/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: "Authentication succesful" });
      } else {
        res.status(401).json({ message: "Failed to authenticate" });
      }
    })
    .catch(err => res.json(err));
});

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
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
