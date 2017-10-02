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

// Create Users
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('You need username or password', res);
    return;
  }
  bcrypt.hash(password, 11, (err, passwordHash) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    const newUser = new User({ username, passwordHash });
    newUser.save((savedError, user) => {
      if (savedError) {
        sendUserError(savedError, res);
        return;
      }
      res.json(user);
    });
  });
});

// User login
server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('You need username or password', res);
    return;
  }
  User.findOne({ username }, (userError, user) => {
    if (userError) {
      sendUserError(userError, res);
      return;
    }
    if (!user) {
      return sendUserError('Invalid username or password', res);
    }
    bcrypt.compare(password, user.passwordHash, (passwordError, valid) => {
      if (passwordError) {
        return sendUserError(passwordError, res);
      }
      if (valid === false) {
        return sendUserError('Invalid username or password', res);
      }
      req.session.username = user.username;
      res.json({ success: true });
    });
  });
});

//middleware session
const middleware = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    return sendUserError('User needs to be logged in', res);
  }
  User.findOne({ username }, (userError, user) => {
    if (userError) {
      return sendUserError(userError, res);
    }
    if (!user) {
      return sendUserError('No user found', res);
    }
    req.user = user;
    next();
  });
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', middleware, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
