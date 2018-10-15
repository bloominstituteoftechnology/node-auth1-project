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
server.get("/", (req, res) => {
  res.send("its aliveeeee");
});

server.get("/users", (req, res) => {
  console.log(db("users"));
  db("users")
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

server.post("/register", (req, res) => {
  const creds = req.body;
});

server.listen(9000, () => {
  console.log("API is running");
});
