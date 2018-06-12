const express = require("express");
const User = require("../User");
const router = express.Router();

router.route("/login").post((req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .isPasswordValid(password)
          .then(passwordGuess => {
            if (passwordGuess) {
              req.session.username = user.username;
              res.json("Logged in");
            } else {
              return res.status(401).json({ error: "You shall not pass!" });
            }
          })
          .catch(err => res.status(401).json({ error: err.message }));
      } else {
        res.status(401).json({ error: "You shall not pass!" });
      }
    })
    .catch(err => res.status(401).json({ error: err.message }));
});

module.exports = router;
