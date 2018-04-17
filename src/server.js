const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
  })
);

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

// TODO: add local middleware to this route to ensure the user is logged in
const checkUser = function(req, res, next) {
  req.user = req.session.user;
  next();
};

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, passwordHash: password } = req.body;
  const user = new User({ username, passwordHash: password });

  user
    .save()
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      sendUserError(error, res);
    });
});
// ||||||||||||||||||||||||||||||||||
server.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
// ||||||||||||||||||||||||||||||||||

server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
