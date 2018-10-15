const express = require("express");

const knex = require("knex");
const router = express.Router();
const bcrypt = require("bcryptjs");

const knexConfig = require("../knexfile.js");
const db = knex(knexConfig.development);

router.post("/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catchThrow(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: "Logged In!" });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    });
});

router.get("/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
