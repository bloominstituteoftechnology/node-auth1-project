/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');


const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  saveUninitialized: false,
  resave: true
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

/* TODO: implement routes
bcrypt.hash(pswd, cost, (err, hash))
bcrypt.compare('wrong', hashedPswd)
*/

// additional middleware

// hashpassword
const hashPassword = (req, res, next) => {
  bcrypt.hash(req.body.passwordHash, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError(err, res)
      return;
    }
    req.body.passwordHash = hash;
    next();
  })
}
// restrictpermissions
// authenticate
// loggedIn

server.post('/users', hashPassword, (req, res) => {
  const { username, passwordHash } = req.body;
  if (username && passwordHash) {
    let user = new User({username, passwordHash})
    user.save()
      .then(newUser => {
        res.status(200).json(newUser)
      })
      .catch(err => {
        res.status(500).json(err);
      })
  }
});



// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.listen(3000);

module.exports = { server };
