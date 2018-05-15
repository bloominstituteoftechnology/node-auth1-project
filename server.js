const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('> connected to mongo ');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();

function authenticate(req, res, next) {
  if (req.body.password === 'mellon') {
    next();
  } else {
    res.status(401).send('You shall not pass!!!');
  }
}

server.use(express.json());
server.use

server.get('/', (req, res) => {
  res.send({ route: '/', message: req.message });
});

server.post('/api/register', function(req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        // compare the passwords
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username;
            res.send('have a cookie');
          } else {
            res.status(401).send('invalid credentials');
          }
        });
      } else {
        res.status(401).send('invalid credentials');
      }
    })
    .catch(err => res.send(err));
});

server.get('/api/users', authenticate, (req, res) => {
  User.find().then(users => res.send(users));
});

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.send('error');
      } else {
        res.send('good bye');
      }
    });
  }
});

server.listen(3333, () => console.log('> api running on 3333 '));
