const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile.js');
// const db = require('./database/dbConfig.js');
const db = knex(knexConfig.development)

const server = express();

server.use(express.json());
server.use(cors());

server.get('/users', (req, res) => {
  db('users')
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.error(err.message)
      res.status(500).json(err)
    })
})

server.post('/register', (req, res) => {
  creds = req.body

  const hash = bcrypt.hashSync(creds.password, 12)
  creds.password = hash

  db('users')
    .insert(creds)
    .then(user => {
      console.log(user);
      res.status(201).json(user)
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).json(err)
    })
})

server.post('/login', (req, res) => {
  creds = req.body

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ welcome: user.username })
      } else {
        res.status(401).json({ message: 'You shall not pass!'})
      }
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).json(err)
    })
})


const port = 9000;

server.listen(port, function() {
  console.log(`\n Listening on Port:${port}\n`);
})
