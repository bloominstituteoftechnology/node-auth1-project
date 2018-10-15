const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
const port = 9000;

server.use(express.json());
server.use(cors());

server.get('/api/users', (req, res) => {
  db('users')
    .select('users.id', 'users.username', 'users.password')
    .then((response) => {
      res.status(200).json(response);
    });
});

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 13);
  creds.password = hash;
  db('users')
    .insert(creds)
    .then((ids) => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error creating password' });
    });
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send('Log in successful.');
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json(500).json({ errorMessage: 'Error logging in' });
    });
});

server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));
