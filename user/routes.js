const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./User');

const router = express.Router();

router.get('/', (req, res) => {
    User.find()
      .then(users => {
          res.status(200).json(users);
      })
      .catch(err => {
          res.status(500).json(err);
      })
})

router.post('/', (req, res) => {
    const newUser = req.body;
    const { username, password } = req.body;
    const user = new User(newUser);
    user.save()
      .then(user => {
          res.status(201).json(user);
      })
      .catch(err => {
          res.status(500).json(err);
      })
})

module.exports = router;