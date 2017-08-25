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


server.post('/log-in', validateNameAndPass, (req, res) => {
  const passWordEntry = req.password;
  User.findOne({
    username: req.username,
    passwordHash: passWordEntry,

  }, (err, user) => {
    if (err) {
      sendUserError();
    } else {
      res.json(user);
    }
  });
});
  // user.password = passwordHash;

  // 39. validated
  // 40. create user w/ username & password
  // 41. hash password / hasing pass / saving user - which hasn't changed and sending back
  // 42. say user.password = passwordHash
  // 43. save user and send json response


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
