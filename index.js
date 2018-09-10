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

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
