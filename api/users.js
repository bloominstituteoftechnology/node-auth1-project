const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);
const router = express.Router();

function protected(req, res, next) {
  if (req.session && req.session.user) {
    // they're logged in, go ahead and provide access
    next();
  } else {
    // bounce them
    res.status(401).json({ you: "shall not pass!!" });
  }
}
/* ----  GET ALL USERS  ---- */
router.get("/", protected, (req, res) => {
  db("users")
    .select("id", "username", "created_at", "updated_at")
    // .where({ id: req.session.user })
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
