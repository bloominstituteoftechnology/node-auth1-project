const express = require("express");
const knex = require("knex");
const bcrpyt = require("bcryptjs");
const knexConfig = require("../knexfile").development;

const db = knex(knexConfig);
const router = express.Router();

router.post("/register", (req, res) => {
  const creds = req.body;
  const saltAndHash = bcrpyt.hashSync(creds.password, 16);
  creds.password = saltAndHash;

  if (creds.password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  } else {
    db("users")
      .insert(creds)
      .then(ids => res.status(201).json(ids[0]))
      .catch(err => res.status(500).json(err));
  }
});

router.get("/users", (req, res) => {
  db.raw(`SELECT username as User, id as Identifier FROM users`)
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

router.post("/login", (req, res) => {
  const creds = req.body;
    db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
      if(user && bcrpyt.compareSync(creds.password, user.password)) {
        res.status(201).json({message: `Welome ${user.username[0].toUpperCase() + user.username.slice(1, user.username.length)}`});
      } else {
        res.status(400).json({message: "Invalid username or password"});
      }
    })
    .catch(err => res.status(500).message({message: err}));
});

module.exports = router;
