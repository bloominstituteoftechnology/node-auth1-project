const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true, //! What should this be?
    saveUninitialized: true //! What should this be?
  })
);
const restrictedAccess = (req, res, next) => {
  const { username } = req.session;
  if (username) {
    next();
  }
  return sendUserError('restricted access', res);
};

server.use('/restricted*', restrictedAccess); //! sketchy stretch code

const sendUserError = (err, res) => {
  //! Why do we pass res?
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const checkUsername = (req, res, next) => {
  const { username } = req.body;
  if (!username || !username.trim()) {
    return sendUserError('Must enter a username', res); //! which  way is preferred?
  }
  next(); // ? All good ... continue to next middleware
};

const checkPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || !password.trim()) {
    sendUserError('Must enter a password', res);
    return; //! Is return necessary? Looks like yes ...
  }
  next(); // ? All good ... continue to next middleware
};

const authenticateUser = (req, res, next) => {
  const { username } = req.session;

  if (username) {
    User.findOne({ username })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        return sendUserError(err, res);
      });
  } else {
    res.status(500).json({ message: 'you must be logged in to access route' });
  }
};
/* Sends the given err, a string or an object, to the client. Sets the status */
/* code appropriately. */

// TODO: implement routes

server.post('/users', checkUsername, checkPassword, (req, res) => {
  const { username, password } = req.body;

  // if (username && password) {
  // TODO *** put this in local middleware

  const user = new User({ username, passwordHash: password }); //! refactored to work with UserSchema.pre lifecylce hook
  user
    .save()
    .then((savedUser) => {
      res.status(201).json(savedUser);
    })
    .catch((err) => {
      sendUserError(err, res); //! What should be the error here?
      return;
    });
  // } else {
  //   sendUserError('username and password field are required.', res);
  // }
});

server.post('/log-in', checkUsername, checkPassword, (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      user.isPasswordValid(password).then((isValid) => {
        if (isValid) {
          req.session.username = username;
          res.status(200).json({ success: true });
        } else {
          return sendUserError('password is not valid', res);
        }
      });
    })
    .catch((err) => {
      return sendUserError('username not in database', res);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticateUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(err => sendUserError(err, res)); //! lack of return okay here? Nowhere else to go
});

module.exports = { server };
