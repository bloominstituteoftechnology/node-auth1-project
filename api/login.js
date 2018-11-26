const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);
const router = express.Router();
const bcrypt = require("bcryptjs");

/* ----  LOG USER IN  ---- */
router.post("/", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: "Logged in" });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
