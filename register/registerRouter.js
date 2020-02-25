const express = require("express");
const router = express.Router();
const Register = require("./registerModel");
const bcrypt = require("bcryptjs");

router.post("/", (req, res) => {
  const newUser = req.body;

  const hash = bcrypt.hashSync(newUser.password, 8);
  newUser.password = hash;

  Register.addUser(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
module.exports = router;
