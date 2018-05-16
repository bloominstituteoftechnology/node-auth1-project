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

server.use(
  session({
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
  })
);

server.use(express.json());

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`Welcome back, ${req.session.username}!`);
  } else {
    res.send('You must first log in.');
  }
})

server.get('/api/users', (req, res) => {
  if (req.session && req.session.username) {
    User
      .find()
      .then(users => {
        res.send(users);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  } else {
    res.send('You must first log in.');
  }
})

server.post('/api/register', function(req, res) {
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

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .isPasswordValid(password)
          .then(isValid => {
            if (isValid) {
              req.session.username = user.username;
              res.send('A cookie has been saved.');
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

server.get('/api/users', (req, res) => {

})

server.listen(5000, () => console.log('\n=== api running on port 5000 ==='));