const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/user', { useMongoClient: true });

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: false,
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

// TODO: implement routes
const hashPasswordMiddle = (req, res, next) => {
  const { password } = req.body;
  if (!password) return sendUserError(new Error('Please provide the password'), res);
  bcrypt.hash(password, BCRYPT_COST)
    .then((hash) => {
      req.passwordHash = hash;
      next();
    })
    .catch((error) => {
      sendUserError(error, res);
    });
};

const loginMiddle = (req, res, next) => {
  if (!req.session.username) return sendUserError(new Error('No user logged in'), res);
  const username = req.session.username;
  User.findOne({ username })
    .then((user) => {
      if (!user) return sendUserError(new Error('User not found'), res);
      req.user = user;
      next();
    })
    .catch((error) => {
      sendUserError(error, res);
    });
};

server.use('/restricted/*', (req, res, next) => {
  if (!req.session.username) return sendUserError(new Error('No user logged in'), res);
  const username = req.session.username;
  User.findOne({ username })
    .then((user) => {
      if (!user) return sendUserError(new Error('No user found'), res);
      req.user = user;
      next();
    })
    .catch((error) => {
      sendUserError(error, res);
    });
});

server.post('/users', hashPasswordMiddle, (req, res) => {
  const { username } = req.body;
  if (!username) return sendUserError(new Error('Please provide username'), res);
  const { passwordHash } = req;
  const newUser = new User({ username, passwordHash });
  newUser.save()
    .then((user) => {
      if (!user) sendUserError(new Error('User created failed'), res);
      res.status(200).json(user);
    })
    .catch((error) => {
      sendUserError(error, res);
    });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError(new Error('Please provide both username and password'), res);
  User.findOne({ username })
    .then((user) => {
      if (!user) return sendUserError(new Error('User not found'), res);
      if (!bcrypt.compareSync(password, user.passwordHash)) return sendUserError(new Error('Invalid password'), res);
      req.session.username = username;
      req.user = user;
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      sendUserError(error, res);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loginMiddle, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
