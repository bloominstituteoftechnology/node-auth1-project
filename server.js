const express = require('express');
const mongoose = require('mongoose');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n=== connected to mongo ===\n')
  })
  .catch(err => console.log("error connecting to mongo", err));

const server = express();

function authenticate(req, res, next) {
  if(req.body.password === 'infinity') {
    next();
} else {
  res.status(401).send('Sorry bub. Wrong password.');
  }
}

server.use(express.json());

server.get('/', (req, res) => {
  res.send({ route: '/', message: req.message });
});

server.get('/api/users', (req, res) => {
  res.send(username);
});

server.post('/api/register', function(req,res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
})

server.post('/api/login', authenticate, (req, res) => {
  res.send('Welcome to the Mines of Moria!');
});

server.listen(8000, () => console.log('\n=== api running on db ===\n'))