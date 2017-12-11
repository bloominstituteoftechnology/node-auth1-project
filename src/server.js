const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
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
const bcrypt = require('bcrypt');
const User = require('./user.js');

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!password) sendUserError({ error: 'no password' }, res);
  bcrypt
    .hash(password, BCRYPT_COST)
    .then((passwordHash) => {
      const newUser = new User({ username, passwordHash });

      newUser
        .save()
        .then(nUser => res.json(nUser))
        .catch(err => sendUserError(err, res));
    })
    .catch(err => sendUserError(err, res));
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    if (req.session.username) res.json({ success: true });
  }
  User
    .findOne({ username })
    .then((user) => {
      bcrypt
        .compare(password, user.passwordHash)
        .then((result) => {
          if (!result) sendUserError('incorrect username/password', res);
          req.session.username = username;
          res.json({ success: result });
        })
        .catch(err => sendUserError(err, res));
    })
    .catch(err => sendUserError(err, res));
});

// TODO: add local middleware to this route to ensure the user is logged in
const meMiddleWare = (req, res, next) => {
  const { username } = req.session;
  console.log(username);
  if (username === undefined) sendUserError('not logged in', res);

  User
    .findOne({ username })
    .then((fUser) => {
      req.user = fUser;
      next();
    })
    .catch(err => sendUserError(err, res));
};
server.get('/me', meMiddleWare, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
