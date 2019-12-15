const express = require("express");

const bcryptjs = require("bcryptjs");
const router = express.Router();

const Loginuser = require("./login-model");

router.post("/", (req, res) => {
  Loginuser.findUser(req.body)
    .then(user => {
      if (user && bcryptjs.compareSync(req.body.password, user.password))
        res.status(200).json({ message: "user Logged In", user });
      else {
        res.status(401).json({
          message: "You shall not pass!"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error Getting Data"
      });
    });
});

module.exports = router;
