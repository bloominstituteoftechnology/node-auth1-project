const express = require('express');
const middleware = require('../middleware');
const db = require('../data/dbConfig');

const router = express.Router();

router.get('/', middleware.protected, (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
