const express = require("express");
const cors = require("cors");
const knex = require("knex");

const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
const server = express();
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.get("/users", (req, res) => {
  db("users")
    .select("id", "username") // ***************************** added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
