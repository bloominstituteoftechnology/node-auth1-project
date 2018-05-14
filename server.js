const express = require('express');
const mongoose = require('mongoose');

const User = require('./user/user');

mongoose.connect('mongodb://localhost/authdb')
.then(conn => {
    console.log('\n== Connected to DB ==\n')
})
.catch(err => {
    console.log('\n== Somethings not right...? ==\n')
})

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Running and RUnning')
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user
    .save()
    .then(user => {
        res.status(201).json({ user })
    })
    .catch(err => {
        res.status(500).send('Something went wrong brah');
    });
})

server.post('/login', function(req, res) {
  const { username, password } = req.body;
  if (!username) {
      res.status(500).send({err:'You shall not pass'})
  }
})

server.get('/users', function(req, res) {
    // .then()
    // .catch()
})

server.listen(5000, () => console.log('\n===We have lift off on port 5k===\n'));