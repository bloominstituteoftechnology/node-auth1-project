const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');

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

function hashPassword(req, res, next) {
  const { password } = req.body;
  if (!password) {
    return sendUserError(new Error('Password not provided'), res);
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    req.hashedPassword = hash;
    next();
  });
}

function loggedIn(req, res, next) {
  if (!req.session.user) {
    return sendUserError(new Error('Not logged in'), res);
  }
  req.user = req.session.user;
  next();
}

// TODO: implement routes
server.post('/users', hashPassword, (req, res, next) => {
  const { username } = req.body;
  const { hashedPassword } = req;
  User.create({ username, passwordHash: hashedPassword })
  .then((savedUser) => {
    res.status(200).json(savedUser);
  })
  .catch((err) => {
    sendUserError(err, res);
  });
});

server.post('/log-in', hashPassword, (req, res) => {
  const { username, password } = req.body;
  const { hashedPassword } = req;
  User.findOne({ username }).then((foundUser) => {
    if (!foundUser) {
      sendUserError(new Error('Username not found.'), res);
    } else if (!bcrypt.compareSync(password, foundUser.passwordHash)) {
      sendUserError(new Error('Password is incorrect'), res);
    } else {
      req.session.user = foundUser;
      res.status(200).json({ success: true });
    }
  }).catch((err) => {
    sendUserError(err);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.all('/restricted/*', loggedIn, (req, res, next) => {
  next();
});

module.exports = { server };
