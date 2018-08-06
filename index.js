const express = require('express');
const db = require('./data/db.js');
const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());

// Endpoints Here
server.get('/users', (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({error: 'GET USERS'}))
})
server.post('/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  db('users')
    .insert(user)
    .then(function(ids) {
      db('users')
        .where({ id: ids[0] })
        .first()
        .then(user => {
          res.status(201).json(user);
        })
    })
    .catch(err => {
      res.status(500).json({ error });
    })
})
server.post('/login', (req, res) => {
  const credentials = req.body;
  db('users')
    .where({ username: credentials.username })
    .first()
    .then(function(user) {
      if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({ error: 'Incorrect credentials' });
      } res.status(200).json('Hello, welcome')
    })
    .catch(err => {
      res.status(500).json({ error });
    })
})

server.listen(3300, function () { console.log('API is running on 3300') });