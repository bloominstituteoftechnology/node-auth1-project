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

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
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
    .then(users => {
      if (users && bcrypt.compareSync(creds.password, users.password)) {
        // res.session.name = creds.username;
        res.status(200).send("Authenticated");
      } else {
        res.status(401).json({ message: "Access Denied" });
      }
    })
    .catch(err => res.status(500).send(err));
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
