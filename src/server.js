const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    saveUninitialized: false,
    resave: false,
  }));

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

const usernameTest = function (req, res, next) {
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return sendUserError('Username needs to be filled out', res);
  }
  next();
};

const passwordTest = function (req, res, next) {
  const { password } = req.body;

  if (!password || password.trim() === '') {
    return sendUserError('Password needs to be filled out', res);
  }
  next();
};

// TODO: implement routes

server.post('/users', usernameTest, passwordTest, (req, res) => {
  const { username, password } = req.body;
  const passwordHash = password;

  const user = new User({ username, passwordHash });

  user
    .save()
    .then((savedUser) => {
      res.status(200).json(savedUser);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

server.post('/log-in', usernameTest, passwordTest, (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => user.isPasswordValid(password))
    .then((result) => {
      if (!result) {
        return sendUserError('Provide a Valid Password', res);
      }
      req.session.name = username;
      return res.status(200).json({ success: true });
    })
    .catch((err) => {
      sendUserError('Provide a valid username', res);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
const checkIfLoggedIn = function (req, res, next) {
  const username = req.session.name;

  if (username) {
    User.findOne({ username })
      .then((user) => {
        req.user = user;
        next();
      });
  } else {
    return sendUserError('Must be logged in to gain access', res);
  }
};

server.get('/me', checkIfLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
