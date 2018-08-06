const express = require('express');
const db = require('../data/dbConfig.js');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', (req, res) => {
  const user = {...req.body};
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  db('users')
    .insert(user)
    .then(id => {
      return res.status(200).json({'message':`${user.username} added!`});
    })
    .catch(e => {
      return res.status(500).json(e);
    });
});

router.post('/login', (req, res) => {
  res.status(200).json('login');
});

router.get('/users', (req, res) => {
  res.status(200).json('users');
});

module.exports = router;