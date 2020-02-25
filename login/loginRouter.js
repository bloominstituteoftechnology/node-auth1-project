const express = require("express");
const router = express.Router();
const Login = require("./loginModel");
const bcrypt = require('bcryptjs');

router.post("/", (req, res) => {
  const userCreds = req.body;

  Login.findUser(userCreds.username)
    .then(user => {
      // If user is in db and password matches, login.
      if (user && bcrypt.compareSync(userCreds.password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: " You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
