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
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true,
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
const userAuthMiddleware = (req, res, next) => {
  if (req.session.user === undefined) {
    sendUserError('Must be logged in!', res);
  } else {
    req.user = req.session.user[0].username;
  }
  next();
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', userAuthMiddleware, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('Please enter a username!', res);
    return;
  }
  if (!password) {
    sendUserError('Please enter a password!', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) {
      sendUserError(err, res);
    } else {
      const newUser = new User({ username, passwordHash });
      newUser.save((error, user) => {
        if (error) {
          sendUserError(error, res);
        } else {
          res.json(user);
        }
      });
    }
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('Please enter a username!', res);
    return;
  }
  if (!password) {
    sendUserError('Please enter a password!', res);
    return;
  }
  User.find({ username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        sendUserError('Could not find user!', res);
      } else {
        bcrypt.compare(password, user[0].passwordHash, (error, isValid) => {
          if (error) {
            sendUserError(error, res);
            return;
          }
          if (!isValid) {
            sendUserError('Invalid password', res);
          } else {
            req.session.user = user;
            res.json({ success: true });
          }
        });
      }
    })
    .catch((err) => {
      sendUserError(err, res);
    });
});

module.exports = { server };
