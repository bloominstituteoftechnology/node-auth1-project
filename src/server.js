const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({ secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re' }));
server.use(cors({ origin: "http://localhost:3001", credentials: true }));

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
// brb set it up so you guys can see everything that's going on
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
server.post('/login', (req, res) => {
  const { username, passwordHash } = req.body;
  if (!username) {
    sendUserError('Must provide username', res);
    return;
  }
  if (!passwordHash) {
    sendUserError('Must provide password', res);
    return;
  }

  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    if (!user) {
      sendUserError('Bad credentials', res);
      return;
    }

    bcrypt.compare(passwordHash, user.passwordHash, (compareErr, valid) => {
      if (compareErr) {
        sendUserError(compareErr, res);
        return;
      }
      if (!valid) {
        sendUserError('Bad credentials', res);
        return;
      }
      req.session.username = user.username;
      res.json({ success: true });
    });
  });
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
      sendUserError('Must be logged in', res);
      return;
  }

  req.session.username = null;
  res.json({ success: true });
});

const ensureLoggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('Must be logged in', res);
    return;
  }

  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('Must be logged in', res);
    } else {
      req.user = user;
      next();
    }
  });
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
