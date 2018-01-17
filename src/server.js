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
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true
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

// ####################### Middleware ############################
// Encrypt Passwords
const hashPw = (req, res, next) => {
  const { password } = req.body;
  if (!password || password.length === 0) {
    sendUserError('Please Provide a Password', res);
  } else {
    bcrypt.hash(password, BCRYPT_COST, (err, hashedPw) => {
      if (err) sendUserError(err, res);
      req.body.hashedPw = hashedPw;
      next();
    });
  }
};

// Authenticate users.
const compareHashPw = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, foundUser) => {
    if (err || !foundUser) {
      sendUserError('did not find any users with the specifications', res);
    } else {
      const hashedPw = foundUser.passwordHash;
      bcrypt.compare(password, hashedPw)
        .then(() => {
          if (!res) sendUserError(err, res);
          req.body.authenticatedUser = foundUser.username;
          next();
        })
        .catch(() => {
          sendUserError(err, res);
        });
    }
  });
};

const verifyLogin = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('User Not Authenticated', res);
    next();
  } else {
    User.findOne({ username }, (err, foundUser) => {
      if (err || !foundUser) sendUserError(err, res);
      req.user = foundUser;
      next();
    });
  }
};

// ####################### Routes ############################
// Personal Implementation of a root acess for debugging.
server.get('/', (req, res) => {
  res.json({ message: 'Api Running' });
});

// Register User and add in.
server.post('/users', hashPw, (req, res) => {
  const { username, hashedPw } = req.body;
  const user = new User({ username, passwordHash: hashedPw });
  user.save((err, savedUser) => {
    if (err || !savedUser) {
      sendUserError('No user was saved', res);
    } else {
      req.session.username = savedUser.username;
      res.json(savedUser);
    }
  });
});

// Login Users and Authenticate.
server.post('/log-in', compareHashPw, (req, res) => {
  const { authenticatedUser } = req.body;
  req.session.username = authenticatedUser;
  res.json(authenticatedUser);
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', verifyLogin, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// Stretch
server.get('/restricted/*', verifyLogin, (req, res) => {
  const { username } = req.session;
  res.json({ message: `Hello ${username} this area is only accesible to users authenticated` });
});

module.exports = { server };
