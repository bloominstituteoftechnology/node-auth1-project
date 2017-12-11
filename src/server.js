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
server.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).json({ errorMessage: 'No User or pass' });
  }

  bcrypt.genSalt(BCRYPT_COST, (err, salt) => {
    bcrypt.hash(password, salt)
      .then((passwordHash) => {
        User.create({
          username,
          passwordHash,
        })
        .then((createdUser) => {
          res.status(200).json(createdUser);
        })
        .catch((noUserError) => {
          res
            .status(STATUS_USER_ERROR)
            .json({ errorMessage: noUserError.message });
        });
      });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).json({ errorMessage: 'No User or pass' });
  }

  User.findOne({ where: { username } })
    .then((user) => {
      bcrypt.compare(password, user.passwordHash)
        .then((check) => {
          res.status(200).json({ success: true });
        });
    })
    .catch((err) => {
      res.status(422).json({ errerMessage: err.message });
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
