const express = require("express");

const User = require("../users/User");

const router = express.Router();

// /api/register

// POST
router.route("/").post((req, res) => {
  const { username, password } = req.body;
  const user = new User(req.body);

  if (username && password) {
    user
      .save()
      .then(newUser => {
        res.status(201).json(newUser);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error posting the new user."
        });
      });
  } else {
    res.status(400).json({
      error: "Please provide a USERNAME and PASSWORD."
    });
  }
});

module.exports = router;
