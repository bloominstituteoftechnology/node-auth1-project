const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false,
}));

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const restricted = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.loggedIn) {
      sendUserError('You are not authorized to access this path', res);
      return;
    }
  }
  next();
};

server.use(restricted);

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('You must provide a valid username and password to sign up', res);
  }
  const passwordHash = password;
  const user = new User({ username, passwordHash });
  user.save()
    .then((newUser) => {
      res.status(200).json(newUser);
    })
    .catch((err) => {
      res.status(500).json({ error: 'There was a server error while signing up', err });
    });
});

server.post('/log-in', (req, res) => {
  let { username } = req.body;
  const { password } = req.body;
  if (!username || !password) {
    sendUserError('You must provide a username and password to sign in', res);
    return;
  }
  username = username.toLowerCase();
  User.findOne({ username })
    .exec((err, found) => {
      if (err || found === null) {
        sendUserError('No user found for that ID', res);
        return;
      }
      bcrypt.compare(password, found.passwordHash, (error, verified) => {
        if (error) {
          res.status(500).json({ error: 'There was in internal error while logging in' });
        } else if (verified) {
          req.session.loggedIn = found.id;
          res.status(200).json({ success: true });
        } else sendUserError('The password you entered is invalid', res);
      });
    });
});

server.get('/restricted', (req, res) => {
  res.status(200).json({ message: 'You have accessed the restricted content' });
});

const authenticate = (req, res, next) => {
  if (req.session.loggedIn) {
    User.findOne({ _id: req.session.loggedIn })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        res.status(500).json({ error: 'There was an internal error while processing' });
      });
  } else {
    sendUserError('You must be logged in to the system', res);
  }
};

server.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

module.exports = { server };
