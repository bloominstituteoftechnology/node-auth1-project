const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/db');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
  db('users')
    .then(response => {
      res
        .status(200)
        .json(response)
        .end()
    })
    .catch(err => {
      res
        .status(500)
        .json(err)
        .end()
    })
})

server.post('/api/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  if(!(credentials.user || credentials.password)) {
    res
      .status(401)
      .json({ error: 'Please enter a username and password.' })
      .end()
  } else {
    db('users')
      .insert(credentials)
      .then(response => {
        res
          .status(200)
          .json(response)
          .end()
      })
      .catch(err => {
        res
          .status(500)
          .json(err)
          .end()
      })
  }
})

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  const username = credentials.username;
  db('users')
    .where({ username })
    .then(response => {
      const password = response[0].password;
      const passwordMatch = bcrypt.compareSync(credentials.password, password);
      if (!passwordMatch) {
        res
          .status(401)
          .json({ error: 'Please enter valid credentials' })
          .end()
      } else {
        res
          .status(200)
          .json({ success: true })
          .end()
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'Operation could not be performed.' })
        .end()
    })
})

server.listen(8000, () => console.log('API running on Port 8000'));