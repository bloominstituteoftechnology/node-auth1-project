

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user.js');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false,
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

// Implement hashing function use in both POST Routes
// Had in route but too difficult to follow
const hashingFunction = (req, res, next) => {
  const { password, username } = req.body;
  if (!password || !username) {
    sendUserError('Password or Username incorrect', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, pass) => {
    req.hashedPassword = pass;
    next();
  });
};

// User Logged in Middleware
const userLoggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('User not logged in', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      sendUserError(err, res);
      return;
    }
    req.user = user;
    next();
  });
};

// TODO: implement routes
server.post('/users', hashingFunction, (req, res, next) => {
  const { username } = req.body;
  const { hashedPassword } = req;
  User.create({ username, passwordHash: hashedPassword })
    .then((newUser) => {
      res.status(200).json(newUser);
    })
    .catch((error) => {
      sendUserError(error, res);
    });
});

server.post('/log-in', hashingFunction, (req, res) => {
  const { username, password } = req.body;
  const { hashedPassword } = req;
  if (!username) {
    sendUserError('Username Incorrect', res);
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!bcrypt.compareSync(password, user.passwordHash)) {
        sendUserError('Passowrd Incorrect', res);
        return;
      } else {
        req.session.user = user;
        res.status(200).json({ success: true });
      }
    }).catch((error) => {
      sendUserError(error, res);
    });
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', userLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
