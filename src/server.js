const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');

const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;

const server = express();
server.use(express.json());
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

// TODO: implement routes
server.post('/login', (req, res) => {
  const { username, passwordHash } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        user.isPasswordValid(passwordHash);
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get('/', (req, res) => {
  User.find().then(users => res.json(users));
});

server.post('/users', (req, res) => {
  const passwordHash = req.password;
  const { username } = req.username;
  const user = User({ username, passwordHash });

  User.save()
    .then(savedUser => res.stataus(200).json(savedUser))

    .catch(err => res.status(500).json(err));
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
