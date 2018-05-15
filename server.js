const mongoose = require('mongoose');
const express = require('express');
const User = require ('./User.js');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('n\ ===connected to mongo === \n')
  })
  .catch(error => console.log('issues connecting to mongo', error));

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send({api: 'running'})
})

server.post('/api/register', (req, res) => {
  const user = new User (req.body);
  user
    .save()
    .then(user => {
      res.status(201).json({ user })
    })
    .catch(error => {
      res.status(500).send('error')
    });
})

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(500).send({ error: 'invalid info'})
  }
})

server.listen(5000, () => console.log('n\ === API Running! === \n'))