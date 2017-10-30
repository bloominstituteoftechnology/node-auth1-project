const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
const User = require('./user');

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

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  let passwordHashed = '';
  if (!password || !username) {
    res.status(STATUS_USER_ERROR).json({ error: "must provide a username and password" });
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      res.status(STATUS_USER_ERROR).json(err);
      return;
    }
    passwordHashed = hash;
    const newUser = new User({ username, passwordHash: passwordHashed });
    newUser.save()
      .then((bloop) => {
        res.json(bloop);
      })
      .catch((err2) => {
        sendUserError(err2, res);
      });
  })
  return;
});
server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!password || !username) {
    res.status(STATUS_USER_ERROR).json({ error: "must provide a username and password" });
    return;
  }
  const sesh = req.session;
  User.findOne({ username })
    .exec()
    .then((userBack) => {
      bcrypt.compare(password, userBack.passwordHash).then(function(isValid) {
        if (!isValid) {
          res.status(STATUS_USER_ERROR).json({ error: 'invalid password'});
          return;
        }
        sesh.user = userBack.username;
        res.json({ success: true });
      });
    })
    .catch((err2) => {
      sendUserError(err2, res);
      return;
    });
  return;
});
// TODO: add local middleware to this route to ensure the user is logged in
server.use('/me', (req, res, next) => {
  const sesh = req.session;
  if (!sesh.user) {
    sendUserError('no user logged-in', res)
    return;
  }
  User.findOne({ username: sesh.user })
    .exec()
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      sendUserError(err, res)
      return;
    });
})

server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.use('/restricted', (req, res, next) => {
  const sesh = req.session;
  if (!sesh.user) {
    sendUserError('no user logged-in', res)
    return;
  }
  next();
})

module.exports = { server };
