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

module.exports = router;
