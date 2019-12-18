const express = require("express");

const bcryptjs = require("bcryptjs");
const router = express.Router();

const Loginuser = require("./login-model");

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    Loginuser.findUser(req.body)
      .then(user => {
        if (user && bcryptjs.compareSync(req.body.password, user.password)) {
          req.session.user = user;
          res.status(200).json({ message: "user Logged In", user });
        } else {
          res.status(404).json({
            message: "You shall not pass!"
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Error Getting Data"
        });
      });
  } else {
    res.status(404).json({
      message: "please Provide Username and Password"
    });
  }
});

module.exports = router;
