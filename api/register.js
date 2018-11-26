const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);
const router = express.Router();

/* ----  REGISTER NEW USER  ---- */
router.post("/", (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 10);

  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => res.status(201).json(ids))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
