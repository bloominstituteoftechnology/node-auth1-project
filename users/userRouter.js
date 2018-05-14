const express = require('express');
const User = require('./userModel');
const router = express.Router();

const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) { next() }
  if (!username && pasword) { res.send("must provide a username") }
  if (username && !password) { res.send("must provide a password") }
}

router.route('/')
  .get((req, res) => {
    User
      .find()
      .then(users => res.status(200).json("here are some users"))
      .catch(err => res.status(500).json("error fetching users"))
  })

  .post(authenticateUser, (req, res) => {
    User
      .create(req.body)
      .then(user => res.status(201).json(user))
      .catch(err => res.status(400).json({ error: "There was a problem creating this user." }))
  })

module.exports = router;