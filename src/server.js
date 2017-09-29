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
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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
  if (!username || !password) {
    sendUserError('Missing username or password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) return sendUserError(err, res);
    const newUser = new User({ username, passwordHash: hash });
    newUser.save()
    .then((user) => {
      res.json(user);
    })
    .catch((userErr) => {
      sendUserError(userErr, res);
    });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError('Missing username or password', res);
  User.findOne({ username })
  .exec()
  .then((user) => {
    if (!user) return sendUserError('Invalid user', res);
    bcrypt.compare(password, user.passwordHash, (errP, valid) => {
      if (errP || !valid) return sendUserError(errP, res);
      req.session.user = user;
      res.json({ success: true });
    });
  })
  .catch((err) => {
    if (err) return sendUserError(err, res);
  });
});

const isloggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) return sendUserError('Not logged in!', res);
  req.user = req.session.user;
  next();
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', isloggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
