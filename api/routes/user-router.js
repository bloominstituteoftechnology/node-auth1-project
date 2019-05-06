const router = require("express").Router();
const bcrypt = require("bcryptjs");

const db = require("../../data/dbConfig.js");
const users = require("../helpers/users-helpers.js");
const protected = require("../../auth/protected-middleware.js");

const error = "Invalid Login Credentials";

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 13);
  user.password = hash;
  users
    .add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  users
    .findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json(error);
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/users", protected, (req, res) => {
  users
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
