const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n=== connected to mongo ===');
  })
  .catch(err => {
    console.log('error connecting to mongo', err);
  });

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('API running on port 5000.');
});

server.post('/register', function(req, res) {
  const user = new User(req.body);

  user
  .save()
  .then(user => {
    res.status(201).send(user);
  })
  .catch(err => {
    res.status(500).send(err);
  });
})

server.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .isPasswordValid(password)
          .then(isValid => {
            if (isValid) {
              res.send('Login successful.');
            } else {
              res.status(401).send('Invalid credentials.');
            }
          });
      } else {
        res.status(401).send('Invalid credentials.');
      }
    })
    .catch();
})

server.listen(5000, () => console.log('\n=== api running on port 5000 ==='));