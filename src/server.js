const bodyParser = require('body-parser');
const express = require('express');

const session = require('express-session');

const server = express();
const bcrypt = require('bcrypt');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;


// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false
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

const authUser = (req, res, next) => {
  if (!req.session.user) {
    sendUserError('Authorization Denied', res);
  }
  req.user = req.session.user;
  res.status(req.user);
  next();
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!password || password === '') {
    res.status(STATUS_USER_ERROR).json({ error: 'Invalid password' });
  }
  const newUser = new User();
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      res.status({ error: err });
    }
    newUser.username = username;
    newUser.passwordHash = hash;
    newUser
      .save()
      .then((savedUser) => {
        res.status(200).json(savedUser);
      })
      .catch((saveError) => {
        sendUserError(saveError, res);
      });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    sendUserError('Password REQUIRED', res);
  }
  User.findOne({ username })
    .then((user) => {
      bcrypt.compare(password, user.passwordHash, (err, valid) => {
        if (err) {
          res.status({ error: err });
        } else if (valid) {
          req.session.user = user;
          res.status(200).json({ success: true });
        } else {
          res.status(422).json({ success: false });
        }
      });
    })
    .catch((saveError) => {
      sendUserError(saveError, res);
    });
});

module.exports = { server };
