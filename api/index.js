const router = require('express').Router();
const db = require('knex')(require('../knexfile').development);
const bcrypt = require('bcryptjs');

const protect = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(403).json({ message: 'You shall not pass!' });
  }
};

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
        res.status(303).json({ message: 'Logged in', id: user.id });
      }
    })
    .catch(err => res.status(500).json({ error: 'Something went wrong when logging in.' }));
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) res.status(409).json({ message: 'An error occured while logging out.' });
      else res.status(203).json({ message: 'Your logout was successful!' });
    });
  }
});

router.get('/users', protect, (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: 'Something went wrong fetching the users.' }));
});

router.get('/restricted', protect, (req, res) => {
  db('users').where({ id: req.session.userId }).first()
    .then(user => {
      res.status(200).json({ message: `You, ${user.name}, have access!` });
    })
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
