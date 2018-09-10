const router = require('express').Router();
const db = require('knex')(require('../knexfile').development);
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  let { name, pass } = req.body;
  if (!name || !pass) {
    res.status(404).json({ message: 'You need to provide a unique username and password!' }).end();
  }
  pass = bcrypt.hashSync(pass, 10);
  db('users').insert({ name, pass })
    .then(id => res.status(201).json({ id: id[0], message: 'User has been created.' }))
    .catch(err => res.status(500).json({ error: 'Something went wrong when registering.' }));
});

router.post('/login', (req, res) => {
  let { name, pass } = req.body;
  if (!name || !pass) {
    res.status(404).json({ message: 'You need to provide a username and password!' }).end();
  }
  db('users').where({ name })
    .then(user => {
      if (!user[0] || !bcrypt.compareSync(pass, user[0].pass)) {
        res.status(401).json({ message: 'You shall not pass!' });
      } else {
        res.status(303).json({ message: 'Logged in', id: user[0].id });
      }
    })
    .catch(err => res.status(500).json({ error: 'Something went wrong when logging in.' }));
});

router.get('/users', (req, res) => {
  // if logged in
    db('users')
      .then(users => res.status(200).json(users))
      .catch(err => res.status(500).json({ error: 'Something went wrong fetching the users.' }))
});

module.exports = router;
