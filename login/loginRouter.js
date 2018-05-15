const express = require("express");

const User = require("../users/User");

const router = express.Router();

// /api/login

// POST
router.route("/").post((req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password)
          .then(isValid => {
            if (isValid) {
              req.session.username = user.username;
              res.status(200).json({
                message: "Login success! Have a cookie."
              });
            } else {
              res.status(401).json({
                error: "You shall NOT pass!"
              });
            }
          })
          .catch(error => {
            res.status(500).json({
              error: "There was an error logging in."
            });
          });
      } else {
        res.status(401).json({
          error: "You shall not pass."
        });
      }
    });
  } else {
    res.status(400).json({
      error: "Please provide a USERNAME and PASSWORD."
    });
  }
});

module.exports = router;
