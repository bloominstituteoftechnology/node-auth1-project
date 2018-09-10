const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./dbConfig");

const server = express();
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Working");
});

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.join(users);
    })
    .catch(err => res.status(500).send(err));
});

const port = 8000;
server.listen(port, () => console.log(`\n Listening on port ${port} \n`));
