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
  saveUninitialized: true
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

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Must provide a username and a password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST)
    .then((passwordHash) => {
      const newUser = new User({ username, passwordHash });
      newUser.save()
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          sendUserError(err, res);
        });
    })
    .catch((err) => {
      sendUserError(err, res);
    });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Must provide a username and a password', res);
    return;
  }
  User.findOne({ username })
    .exec()
    .then((user) => {
      if (!user) {
        return sendUserError('No account with that username exists', res);
      }
      if (!bcrypt.compareSync(password, user.passwordHash)) {
        return sendUserError('Wrong password', res);
      }
      req.session.username = user.username;
      res.json({ success: true });
    })
    .catch((err) => {
      sendUserError(err, res);
    });
});

const isLoggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('User is not logged in ', res);
    return;
  }
  User.findOne({ username })
    .exec()
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      sendUserError(err, res);
    });
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', isLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// Extra credit

server.use('/restricted', isLoggedIn);

server.get('/restricted/something', (req, res) => {
  res.json({ success: 'Welcome to the restricted area' });
});

server.get('/restricted/other', (req, res) => {
  res.json({ success: 'Welcome to the restricted area' });
});

module.exports = { server };
