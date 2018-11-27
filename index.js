// Imports
const express = require('express');
const config = require('./middleware/config.js');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
// Initializes the server
const server = express();
// Middleware
config(server);

const protected = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass' });
  }
};

// Endpoints
server.get('/', (req, res) => {
  res.json('alive');
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.send('error logging out');
      } else {
        res.send('Logged out');
      }
    });
  }
});

server.post('/api/register', (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 10);

  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => res.status(201).json(ids))
    .catch(error => json(error));
});

server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(error => json(error));
});

// LOGIN
server.post('/api/login', (req, res) => {
  const credentials = req.body;

  db('users')
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ message: 'Welcome!' });
      } else {
        res.status(401).json({ message: 'YOU SHALL NOT PASS!' });
      }
    })
    .catch(error => res.json(error));
});

// Sets server to listen on port 8000
server.listen(8000, () => console.log('==== Listening on port 8000 ===='));
