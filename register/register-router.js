const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router({
  mergeParams: true
});

const Users = require("../dbModel/dbModel");

router.post("/", (req, res) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 12);
  password = hash;
  Users.add({ username, password })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(400).json({
        message: "Provide User please"
      });
    });
});

module.exports = router;
