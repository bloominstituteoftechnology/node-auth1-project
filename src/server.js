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

const validateNameAndPass = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide username and password' });
    return;
  }
  req.username = username;
  req.password = password;
  next();
};

// TODO: implement routes

// User signup
server.post('/users', validateNameAndPass, (req, res) => {
  bcrypt.hash(req.password, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError();
    } else {
      const user = new User({
        username: req.username,
        passwordHash: hash,
      });
      user.save();
      res.json(user);
    }
  });
});

// User login
server.post('/log-in', validateNameAndPass, (req, res) => {
  // here we hash the password that the client inputs
  const passWordEntry = bcrypt.hash(req.password, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError();
    } else {
      // here we search for a user with the same username that the client inputs
      const tempUser = User.findOne({ username: req.username });
      if (tempUser.passWordHash === passWordEntry) {
        res.json({ success: true });
      } else {
        sendUserError();
      }
    }
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
