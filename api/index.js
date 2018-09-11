const router = require('express').Router();
const db = require('knex')(require('../knexfile').development);
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  let { name, pass } = req.body;
  if (!name || !pass) {
    res.status(404).json({ message: 'You need to provide a unique username and password!' }).end();
  }
  pass = bcrypt.hashSync(pass, 10);
  db('users').insert({ name, pass }).first()
    .then(id => res.status(201).json({ id: id, message: 'User has been created.' }))
    .catch(err => res.status(500).json({ error: 'Something went wrong when registering.' }));
});

router.post('/login', (req, res) => {
  let { name, pass } = req.body;
  if (!name || !pass) {
    res.status(404).json({ message: 'You need to provide a username and password!' }).end();
  }
  db('users').where({ name }).first()
    .then(user => {
      if (!user || !bcrypt.compareSync(pass, user.pass)) {
        res.status(401).json({ message: 'You shall not pass!' });
      } else {
        req.session.userId = user.id;
        res.status(303).json({ message: 'Logged in', id: req.session.userId });
      }
    })
    .catch(err => res.status(500).json({ error: 'Something went wrong when logging in.' }));
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) res.send('An error occured while logging out.');
      else res.send('goodbye');
    });
  }
});

router.get('/users', (req, res) => {
  if (req.session && req.session.userId) {
    db('users')
      .then(users => res.status(200).json(users))
      .catch(err => res.status(500).json({ error: 'Something went wrong fetching the users.' }));
  } else {
    res.status(403).json({ message: 'You shall not pass!' });
  }
});

module.exports = router;
