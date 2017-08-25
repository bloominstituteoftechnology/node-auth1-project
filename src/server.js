/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const BCRYPT_COST = 11;

const User = require('./user');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false,
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

// global middleware to handle request to '/restricted/'
server.use((req, res, next) => {
  // matches anthing after /restricted/
  const regEx = /restricted\/[\S]/;
  if (req.path.match(regEx)) {
    const { userId } = req.session;
    if (!userId) {
      const err = 'please log-in to acces this content';
      sendUserError(err, res);
      return;
    }
    res.json({ success: 'you now have access to restricted content enjoy' });
    return;
  }
  next();
});

// middleware used to verify a user is logged in
const verifyUserLoggedIn = (req, res, next) => {
  const { userId } = req.session;
  if (!userId) {
    const err = 'please log-in to access this content';
    sendUserError(err, res);
    return;
  }
  User.findById(userId, (err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    req.user = user;
    next();
  });
};

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(STATUS_USER_ERROR);
    res.json({ err: 'please provide username and password' });
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR);
      res.json(err);
      return;
    }
    const newUser = new User({ username, passwordHash: hash });
    newUser.save((error) => {
      if (error) {
        sendUserError(error, res);
        return;
      }
      res.json(newUser);
    });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const error = 'please provide a username and password';
    sendUserError(error, res);
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    if (!user) {
      const usernameNotValid = 'username is not valid';
      sendUserError(usernameNotValid, res);
      return;
    }
    bcrypt.compare(password, user.passwordHash, (error, isValid) => {
      if (error) {
        sendUserError(err, res);
        return;
      }
      if (!isValid) {
        const passNotValid = 'password is not valid';
        sendUserError(passNotValid, res);
        return;
      }
      req.session.userId = user._id;
      res.send({ success: true });
    });
  });
});

// used to logout the user
server.get('/log-out', (req, res) => {
  delete req.session.userId;
  res.json({ success: 'you have been logged out' });
  return;
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', verifyUserLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
