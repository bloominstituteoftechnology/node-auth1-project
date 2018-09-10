const router = require('express').Router();
const db = require('knex')(require('../knexfile').development);
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  let { name, pass } = req.body;
  if (!name || !pass) {
    res.status(404).json({ message: 'You need to provide a username and password!' }).end();
  }
  pass = bcrypt.hashSync(pass, 10);
  db('users').insert({ name, pass })
    .then(id => res.status(201).json({ id: id[0], message: 'User has been created.' }))
    .catch(err => res.status(500).json(err));
});

router.post('/login', (req, res) => {
  // authenticate user ? 'Logged in' : 'You shall not pass!'
});

router.get('/users', (req, res) => {
  // logged in ? users arr : 'You shall not pass!'
});

module.exports = router;
