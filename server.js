const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./dbconfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("helo!");
});

server.post("/register", (req, res) => {
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

server.get("/users", (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post("/login", (req, res) => {
    const creds = req.body;
  db("users")
    .where("username", creds.username)
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send("welcome");
      } else {
        res.status(401).json({ message: "creds incorrect" });
      }
    })
    .catch(err => res.send(err));
});

server.listen(3000, () => console.log("\nrunning on port 3000\n"));
