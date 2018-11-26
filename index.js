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

// Endpoints
server.get('/', (req, res) => {
  res.json('alive');
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

server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => res.json(users))
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
        res.status(200).json({ message: 'Welcome!' });
      } else {
        res.status(401).json({ message: 'YOU SHALL NOT PASS!' });
      }
    })
    .catch(error => json(error));
});

// Sets server to listen on port 8000
server.listen(8000, () => console.log('==== Listening on port 8000 ===='));
