const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
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

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, passwordHash: password });
  newUser.save((err, savedUser) => {
    if (err) {
      return sendUserError(err, res);
    }
    res.json(savedUser);
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  const UA = req.headers['cookie'];
  req.session.UA = UA;
  User.findOne({ username })
    .then((user) => {
      user.checkPassword(password, (err, validated) => {
        if (err) {
          return sendUserError(err, res);
        } else if (username === null) {
          return sendUserError(`user does not exist`, res);
        } else {
          req.session.userId = user._id;
          //res.json({ success: true });
          return res.redirect('/me');
        }
      });
    })
    .catch((err) => {
      return sendUserError('User does not exist in system', res);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
