// import { constants } from 'fs';

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
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
  const pass = req.body.password;
  const userN = req.body.username;
  if (!userN) sendUserError({ message: 'username not given' }, res);
  if (pass === '') sendUserError({ message: 'password not given' }, res);
  bcrypt.hash(pass, BCRYPT_COST, (err, hashedPw) => {
    if (err) sendUserError({ message: 'error hashing password' }, res);
    const user = new User({ username: userN, passwordHash: hashedPw });
    user.save().then((savedUser) => {
      res.status(200).json(savedUser);
    }).catch(error => sendUserError(error));
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
