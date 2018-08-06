const router = require('express')();
const db = require('../data/db');
const bcrypt = require('bcryptjs');

router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login' });
});

router.post('/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  db('users')
    .insert(user)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
