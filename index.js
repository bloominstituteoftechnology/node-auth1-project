const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./data/dbConfig.js");
const server = express();
const session = require('express-session');

const sessionConfig = {
    name: 'cookieSession',
    secret: 'a clock is right twice a day',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
  };

server.use(express.json());
server.use(cors());
server.get("/", (req, res) => {
  res.send("Okay, your server is running...");
});
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
server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send("Login Successful");
      } else {
        res.status(401).json({ message: "You are not authorized." });
      }
    })
    .catch(err => res.status(500).send(err));
});
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
server.listen(2000, () => console.log("\nServer running on port 2000\n"));
