const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);
const router = express.Router();

/* ----  GET ALL USERS  ---- */
router.get("/", (req, res) => {
  db("users")
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
