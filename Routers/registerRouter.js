const express = require("express");
const User = require("../User");
const router = express.Router();

router.route("/register").post((req, res) => {
  User.create(req.body)
    .then(newuser => {
      res.status(201).json(newuser);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
