const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../data/dbConfig');

router.get('/', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => 
      res
        .json({errorMessag: "Sorry, we're having trouble getting the list of users..."}))
})

module.exports = router;