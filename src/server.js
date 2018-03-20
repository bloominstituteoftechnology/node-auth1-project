/* eslint-disable func-names, prefer-arrow-callback */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;

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

const restrictedAccess = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.isAuth) {
      sendUserError('User is not authorized.', res);
      return;
    }
  }
  next();
};

server.use(restrictedAccess);

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Username and password required', res);
  } else {
    const createdUser = { username, passwordHash: password };
    const newUser = new User(createdUser);
    newUser.save()
      .then(savedUser => res.json(savedUser))
      .catch(err => sendUserError(err, res));
  }
});

server.post('/log-in', (req, res) => {
  let username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    sendUserError('Username and password required', res);
  } else {
    username = username.toLowerCase();
    User.findOne({ username }).then((user) => {
      user.checkPassword(password, function (err, validated) {
        if (!validated) return sendUserError('Password does not match', res);
        req.session.username = username;
        req.session.isAuth = true;
        res.json({ success: validated });
      });
    })
    .catch(err => sendUserError('User does not exist in the system.', res));
  }
});

const validUser = (req, res, next) => {
  if (!req.session.isAuth) sendUserError('Not logged in.', res);
  else {
    User.findOne({ username: req.session.username })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
};

server.get('/me', validUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/restricted/test', (req, res) => {
  res.json('Hey there buddy');
});

module.exports = { server };
