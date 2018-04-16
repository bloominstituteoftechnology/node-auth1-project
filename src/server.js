const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const STATUS_SERVER_ERROR = 500;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
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
  const user = new User(req.body);
  const { username, passwordHash } = req.body;

  if (!username || !passwordHash) {
    return sendUserError('Must include both username and password', res);
  }
  user.save((err, saved) => {
    if (err) {
      return sendUserError(err, res);
    }
    res.status(200).json(saved);
  });
});

server.post('/log-in', (req, res) => {
  const { username, passwordHash } = req.body;
  console.log(req.session);
  if (!req.session.viewCount) {
    req.session.viewCount = 0;
  }
  req.session.viewCount++;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(passwordHash);
        res.json({ viewCount: req.session.viewCount, success: true });
      } else {
        res
          .status(404)
          .json({ message: 'Please provide valid username and password.' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
