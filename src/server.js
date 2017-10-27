const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');

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

// TODO: implement route
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError('Must provide a username and password', res);
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) return sendUserError(res);
    const newUser = new User({ username, passwordHash: hash });
    newUser.save()
    .then(user => res.json(user))
    .catch(err2 => sendUserError(res));
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError('Must provide a username and password', res);
  User.findOne({ username })
  .exec()
  .then((user) => {
    if (!user) return sendUserError('User not found', res);
    bcrypt.compare(password, user.passwordHash, (err, status) => {
      if (err || !status) return sendUserError(err, res);
      req.session.user = user;
      res.json({ success: true });
    });
  })
  .catch(err => sendUserError(res));
});

const isLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) return sendUserError('Not logged in', res);
  req.user = req.session.user;
  next();
};

server.use('/me', isLoggedIn);

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
