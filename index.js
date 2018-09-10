const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

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
  db('users').where({ username: creds.username}).first().then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      res.send(200).send('Welcome! You\'ve made it!');
    }
    else {
      res.status(401).send('You shall not passsss!');
    }
  }).catch(err => {
    res.status(500).send(err);
  })
});

server.listen(5000);
