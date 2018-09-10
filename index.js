const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;

  db('users').insert(creds).then(ids => {
    res.status(201).json({ message: 'You have successfully registered!'})
  }).catch(err => {
    res.status(500).send(err);
  })
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users').where({ name: creds.name}).first().then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      res.status(200).json({message: 'Welcome! You\'ve made it!'});
    }
    else {
      res.status(401).send('You shall not passsss!');
    }
  }).catch(err => {
    res.status(500).send(err);
  })
});

server.listen(5000);
