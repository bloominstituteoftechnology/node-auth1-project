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
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    name: 'auth'
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

const authenticate = (req, res, next) => {
  if (req.session.name) {
    User.findOne({ username: req.session.name })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        sendUserError(err);
      });
  } else {
    sendUserError({ message: 'You are not logged in.' }, res);
  }
};

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
      if (err) {
        sendUserError(err, res);
      }
      const user = new User({ username, passwordHash: hash });
      user
        .save()
        .then((savedUser) => {
          res.status(200).json(savedUser);
        })
        .catch((error) => {
          sendUserError(error, res);
        });
    });
  } else {
    sendUserError(
      {
        message:
          'Please include a username and a password in your registration.'
      },
      res
    );
  }
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    User.findOne({ username })
      .then((user) => {
        user.checkPassword(password).then((response) => {
          if (response) {
            console.log('User: ', user);
            req.session.name = user.username;
            res.status(200).json({ success: true });
          } else {
            sendUserError({ message: 'Incorrect Credentials' }, res);
          }
        });
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  } else {
    sendUserError(
      {
        message: 'Please log-in with both a username and password.'
      },
      res
    );
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticate, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
