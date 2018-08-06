const router = require('express')();
const db = require('../data/db');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'User routes' });
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
