const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
const port = 4400;

server.use(express.json(), helmet());

server.get('/api/users', (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

server.post('/api/register', (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 12);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => res.status(500).json(err));
});

server.post('/api/login', (req, res) => {
  const login = req.body;

  db('users')
    .where({ username: login.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(login.password, user.password)) {
        res.status(200).json({ login: `Welcome ${user.username}` });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.listen(port, () => console.log(`===API running on ${port} port===\n`));
