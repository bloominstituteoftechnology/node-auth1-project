// test
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
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
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
const userMiddleware = (req, res, next) => {};

// TODO: add local middleware to this route to ensure the user is logged in

server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/users', (req, res) => {
  const { userName, userPass } = req.body;
  const newUser = new User();

  bcrypt.hash(userPass, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError('Error!', res);
    }
  });
  res.json(newUser);

  if (!userName || !userPass) {
    sendUserError('Error: Invalid username or password', res);
  } else {
    res.json(newUser);
  }
});

module.exports = { server };
