const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

// TODO: implement routes
// POST /users
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Must provide Username and Password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (hashErr, hash) => {
    if (hashErr) sendUserError(hashErr, res);
    const newUser = new User({ username, passwordHash: hash });
    newUser.save((userErr, user) => {
      if (userErr) sendUserError(userErr, res);
      res.json(user);
    });
  });
});

// POST /log-in
server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Must provide Username and Password', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      sendUserError('Cannot find user', res);
      return;
    }
    bcrypt.compare(password, user.passwordHash, (hashErr, result) => {
      if (hashErr) {
        sendUserError(hashErr, res);
      } else if (result) {
        req.session.loggedInUser = user.id;
        res.json({ success: true });
      } else {
        sendUserError('Invalid username or password', res);
      }
    });
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
const checkLoggedIn = (req, res, next) => {
  const { loggedInUser } = req.session;
  if (!loggedInUser) {
    sendUserError('Must be logged in', res);
    return;
  } else {
    User.findById(loggedInUser)
        .exec((err, user) => {
          if (err) {
            sendUserError(err, res);
            return;
          }
          req.user = user;
          next();
        });
  }
};

server.post('/log-out', checkLoggedIn, (req, res) => {
  req.session.loggedInUser = null;
  res.json('User successfully logged out');
});

server.get('/me', checkLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
