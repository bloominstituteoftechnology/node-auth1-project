/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const User = require('./src/userModel'); // model

mongoose
  .connect('mongodb://localhost/users')
  .then(() => {
    console.log('\ Hello Mongo :) \n');
  })
  .catch(err => console.log('No Mongo :( ', err));

const server = express();

const greet = function(name) {
  return function(req, res, next) {
    req.hello = `Greetings, Commander ${name}!`;

    next();
  };
};

server.use(express.json());

server.use(
  session({
    secret: 'The man with the plan!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    secure: false,
    name: 'Test',
  })
);

server.get('/', (req, res) => {
  User.find()
    .then(users => {
      if (users) {
        req.session.name = users[0].username;
      }
      res.json(users);
    })
    .catch(err => {
      res.send('n/a');
    });
});

server.get('/greet', (req, res) => {
  const { name } = req.session;
  res.send(`Greetings, Commander ${name}!`);
});

server.post('/register', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => res.status(500).json(err));
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then(user => {
    if (user) {
      user.isPasswordValid(password).then(isValid => {
        if (isValid) {
          req.session.name = user.username;
          res.status(200).json({ response: 'Welcome Back' });
        } else {
          res.status(401).json({ msg: 'Incorrect' });
        }
      });
    }
  });
});

module.exports = { server };