const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
const userController = require('./userController');
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

const passwordHasher = (req, res, next) => {
  const { password } = req.body;
  if (!password) return sendUserError('password field must not be left blank', res);
  bcrypt.hash(password, BCRYPT_COST, async (err, hash) => {
    if (err) return sendUserError(err, res);
    const passwordHash = await hash;
    req.body.passwordHash = passwordHash;
    next();
  });
};

const isUserLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) return sendUserError('Must be logged in', res);
  User.findById(req.session.user, (err, user) => {
    if (err) return sendUserError(err);
    req.user = user;
    next();
  });
};

server.all('/restricted/*', isUserLoggedIn);

server.route('/users')
  .post(passwordHasher, userController.createNewUser);
server.route('/log-in')
  .post(passwordHasher, userController.logIn);

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', isUserLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
