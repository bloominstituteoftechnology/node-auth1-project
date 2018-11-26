const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("./database/dbConfig.js");
const server = express();

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Server is up!");
});

server.get("/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.status(500).json(err.message));
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
    .catch(err => res.status(500).json(err.message));
});

server.post("/login", (req, res) => {
  db("users");
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err.message));
});

server.listen(3000, () => console.log("\nrunning on port 3000\n"));
