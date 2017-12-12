const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');

const middleWare = require('./middlewares');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

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

/* ************ MiddleWares ***************** */
const hashedPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    sendUserError('Gimme a password', res);
    return;
  }
  bcrypt
    .hash(password, BCRYPT_COST)
    .then((pw) => {
      req.password = pw;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('username undefined', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      sendUserError('No user found at that id', res);
      return;
    }
    const hashedPw = user.passwordHash;
    bcrypt
      .compare(password, hashedPw)
      .then((response) => {
        if (!response) throw new Error();
        req.loggedInUser = user;
        req.session.username = username;
        next();
      })
      .catch((error) => {
        return sendUserError('some message here', res);
      });
  });
};

const loggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('User is not logged in', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('User does not exist', res);
    } else {
      req.user = user;
      next();
    }
  });
};

// const restrictedPermissions = (req, res, next) => {
//   const path = req.path;
//   if(/restricted/.test(path)) {
    
//   }
// };

module.exports = {
  sendUserError,
  hashedPassword,
  authenticate,
  loggedIn
};
