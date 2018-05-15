const express = require("express");

const User = require("./User");

const router = express.Router();

// /api/users

// GET
router.route("/").get((req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error getting users."
      });
    });
});

module.exports = router;
