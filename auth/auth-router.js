const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(addedUser => {
      res.status(201).json(addedUser);
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot create account" });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res
          .status(200)
          .json({ message: `Welcome to Claire's API, ${user.username}` });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Try again!" });
    });
});

router.delete("/", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.status(200).json({ message: "bye" });
});

module.exports = router;
