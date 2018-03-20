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

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Username and password required', res);
  } else {
    bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
      const createdUser = { username, passwordHash };
      const newUser = new User(createdUser);
      newUser.save()
      .then(savedUser => res.json({ username: savedUser.username, passwordHash: savedUser.passwordHash }))
      .catch(error => sendUserError(error, res));
    });
  }
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Username and password required', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      sendUserError('No user found with this username.', res);
      return;
    }
    bcrypt.compare(password, user.passwordHash)
      .then((response) => {
        if (!response) throw new Error();
        req.session.username = username;
        req.session.isAuth = true;
      })
      .then(() => {
        res.json({ success: true });
      })
      .catch((error) => {
        return sendUserError('Invalid login attempt.', res);
      });
  });
});

const validUser = (req, res, next) => {
  if (!req.session.isAuth) sendUserError('Not logged in.', res);
  else {
    User.findOne({ username: req.session.username })
      .select('username passwordHash -_id')
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
};

server.get('/me', validUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
