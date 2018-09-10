// dependencies
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
// vars
const db = require("./database/dbConfig.js");
const server = express();
const PORT = 7000;
// middleware
server.use(express.json());
server.use(cors());
// requests
// get start
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// post start
// register stores the username and pass in the db
server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

// login checks to make sure the correct pass has been applied
server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send("working");
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => res.status(500).send(err));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
