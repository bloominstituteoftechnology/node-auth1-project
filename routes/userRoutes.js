const router = require('express')();
const db = require('../data/db');

router.get('/', (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
