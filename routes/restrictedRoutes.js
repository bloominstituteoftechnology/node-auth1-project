const express = require('express');
const router = express.Router();
const db = require('../data/dbConfig');

router.get('/users', (req, res, next) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => res.status(200).json(users))
    .catch(next);
});

module.exports = router;
