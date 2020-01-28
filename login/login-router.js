const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router({
  mergeParams: true
});

const Users = require("../dbModel/dbModel");

router.post("/", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
  .first()
  .then(user => {
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({ message: `Welcome ${user.username}` });
    } else if(user) {
      res.status(401).json({ message: "Please Enter Correct Password" });
    } else {
      res.status(401).json({
        message: "A User with this Username does not exist"
      })
    }
  });
});
module.exports = router;
