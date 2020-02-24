const express = require('express');
const router = express.Router()
const bcrypt = require("bcryptjs");
const restricted = require('./auth/restMiddleware')
const Users = require("./users/users-model")

router.post("/register", (req, res) => {
    const user = req.body;
  
    const hash = bcrypt.hashSync(user.password, 13);
  
    user.password = hash;
  
    Users.addUser(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  router.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ errorMessage: "invalid credntials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  router.get('/', restricted, (req, res) => {
      Users.find()
      .then(users => {
          res.json(users);
      })
      .catch(err => res.send(err));
  });
  
  module.exports = router