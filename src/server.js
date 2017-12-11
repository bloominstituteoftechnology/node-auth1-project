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

const hashingMiddleware = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError({ message: 'must provide a username' }, res);
    return;
  } else if (!password) {
    sendUserError({ message: 'must provide a password' }, res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) throw err;
    req.username = username;
    req.passwordHash = hash; // better name it pw
    next();
  });
};

// TODO: implement routes
server.post('/users', hashingMiddleware, (req, res) => {
  const { username, passwordHash } = req;
  const newUser = new User({ username, passwordHash });
  newUser.save().then((createdUser) => {
    res.status(200).json(createdUser);
  })
  .catch((err) => {
    res.status(500).json({ err });
    return;
  });
});

const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError({ message: 'must provide a username' }, res);
    return;
  } else if (!password) {
    sendUserError({ message: 'must provide a password' }, res);
    return;
  }
  User.findOne({ username })
    .exec()
    .then((user) => {
      const userPassword = user.passwordHash;
      bcrypt.compare(password, userPassword, (error, isValid) => {
        if (error) throw error;
        if (!isValid) {
          res.status(STATUS_USER_ERROR).json({ success: false });
        }
        req.session.loggedIn = isValid;
        req.session.username = user.username;
        next();
      });
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR).json({ errorMessage: err.message }); // user not found;
      return;
    });
};

server.post('/log-in', authenticate, (req, res) => {
  if (req.session.loggedIn) {
    res.status(200).json({ success: true });
  }
});

const isUserLoggedIn = (req, res, next) => {
  if (!req.session.loggedIn) {
    sendUserError({ message: 'you are not logged in' }, res);
    return;
  }
  User.findOne({ username: req.session.username })
    .exec()
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      sendUserError(err, res);
      return;
    });
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', isUserLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
