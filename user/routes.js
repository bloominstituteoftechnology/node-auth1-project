const express = require('express');
const User = require('./User');

const router = express.Router();

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

module.exports = Router;