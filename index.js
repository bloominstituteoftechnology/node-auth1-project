const express = require("express");
const db = require("./data/db");
const bcrypt = require("bcryptjs");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("up and running...");
});

//* GET authentications

server.get("/register", (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
});

//* POST register

server.post("/register", (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 14);

  user.password = hash;

  db("users")
    .insert(user)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ id, ...user });
    })
    .catch(err => res.status(500).json(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
