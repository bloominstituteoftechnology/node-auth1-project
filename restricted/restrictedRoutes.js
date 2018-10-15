const express = require('express');

const router = express.Router();

const db = require('../database/dbConfig.js');

router.get('/users', (req, res) => {
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  module.exports = router;