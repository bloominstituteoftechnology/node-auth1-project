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
  const { userName, password } = req.body;

  if (!userName) {
    sendUserError('Must provide a userName', res);
    return;
  } else if (!password) {
    sendUserError('Must provide a password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (bcryptErr, passwordHash) => {
    if (bcryptErr) return sendUserError(bcryptErr, res);
    if (!passwordHash) return sendUserError('The password is not valid', res);

    const user = new User({ userName, passwordHash });
    user.save((err) => {
      if (err) return sendUserError(err, res);
      res.json({ user });
    });
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
