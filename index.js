const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const server = express();
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

server.use(express.json());
server.use(cors();

// server functions

// test GET function

server.get('/api', (req, res) => {
  res.send('Server test.');
});

// GET users information

server.get('/api/users', (req, res) => {
  db('users')
    .then(users => res.json(users));
    .catch(err => res.status(500).json(err));
});

// POST a user via register

server.post('/register', (req, res) => {
const credentials = req.body;
// console.log(credentials);
const hash = bcrypt.hashSync(credentials.password, 14);
credentials.password = hash;
// console.log(credentials); <- check if there is a change

db('users')
  .insert(credentials)
  .then(id => res.send(id))
  .catch(err => res.status(500).json(err));
});

// authenticate login via POST

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  db('users')
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        res.status(200).json({ message: "Login successful!" });
      } else res.status(401).json({ message: "Access denied. Please try again. "});
    })
    .catch(err => res.status(500).send(err));
  });
  
// server instantiation

const port = 8000;
server.listen(port, () => console.log('Server listening on port 8000.'));
