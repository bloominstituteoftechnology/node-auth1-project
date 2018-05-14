const express = require('express');
const mongoose = require('mongoose');
const User = require('./users/User.js');
const port = 3333;

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('> connected to mongo');
  })
  .catch(err => console.log('error connecting to mongo'));

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send({ api: 'running' });
});

server.post('/api/register', function(req, res) {
  const user = new User(req.body);
  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.listen(port, () => console.log(' > API running on 3333.'));
