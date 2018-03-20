const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user.js');

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

server.get('/', (req, res) => {
  res.status(200).send({ status: req.session.loggedn });
});

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('You must provide a valid username and password to sign up', res);
  }
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) {
      res.status(500).json({ error: 'There was an error encrypting your password' });
      return;
    }
    const user = new User({ username, passwordHash });
    user.save()
      .then((newUser) => {
        res.status(200).json(newUser);
      })
      .catch((ERROR) => {
        res.status(500).json({ error: 'There was a server error while signing up', ERROR });
      });
  });
});

server.post('/log-in', (req, res) => {
  let { username } = req.body;
  const { password } = req.body;
  username = username.toLowerCase();
  if (!username || !password) {
    sendUserError('You must provide a username and password to sign in', res);
    return;
  }
  User.find({ username })
    .exec((err, found) => {
      if (found.length === 0) {
        res.status(404).json({ error: 'No user found for that username' });
        return;
      }
      if (err) {
        res.status(500).json({ message: 'Internal server error while processing', err });
        return;
      }
      bcrypt.compare(password, found[0].passwordHash, (error, verified) => {
        if (error) {
          res.status(500).json({ error: 'There was in internal error while logging in' });
        } else if (verified) {
          res.status(200).json({ success: true, found });
          // eslint-disable-next-line no-underscore-dangle
          req.session.loggedIn = found[0]._id;
          console.log(req.session);
        } else sendUserError('The password you entered is invalid', res);
      });
    });
});

const authenticate = (req, res, next) => {
  if (req.session.loggedIn) {
    User.find({ _id: req.session.loggedIn })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        res.status(500).json({ error: 'There was an internal error while processing' });
      });
  } else {
    sendUserError('You must be logged in to the system', res);
  }
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticate, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
