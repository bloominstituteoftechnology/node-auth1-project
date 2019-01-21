const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const dbHelper = require('./data/helpers/dbHelpers.js');

const server = express();
const port = 8000;

server.use(express.json());
server.use(session({
  name: 'session-name',
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
}));

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password);
  dbHelper.insert(user)
    .then(ids => res.status(201).json({ id: ids[0] }))
    .catch(err => res.status(500).json(err));
});

server.post('/api/login', (req, res) => {
  const user = req.body;
  dbHelper.findByUsername(user)
    .then((users) => {
      if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
        req.session.userId = users[0].id;
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'You shall not pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get('/api/users', (req, res) => {
  if (req.session && req.session.userId) {
    dbHelper.findUsers()
      .then(users => res.json(users))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(401).json({ error: 'You shall not pass!' });
  }
});

server.listen(port, console.log(`\nWeb API running on http://localhost:${port}\n`));
