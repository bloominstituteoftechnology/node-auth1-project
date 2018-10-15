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

server.get('/', (req, res) => {
  res.send('Server test.');
});

// GET users information

server.get('/users', (req, res) => {
  db('users')
    .then(users => res.json(users));
    .catch(err => res.status(500).json(err));
});

// POST a user via register

server.post('/register', (req, res) => {
const credentials = req.body;
});

// server instantiation

const port = 8000;
server.listen(port, () => console.log('Server listening on port 8000.'));
