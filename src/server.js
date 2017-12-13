const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false,
}));

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

  if (!password) {
    sendUserError('no password', res);
    return;
  }

  bcrypt
    .hash(password, BCRYPT_COST)
    .then((passwordHash) => {
      const newUser = new User({ username, passwordHash });

      newUser
        .save()
        .then(nUser => res.json(nUser))
        .catch(err => sendUserError(err, res));
    })
    .catch(err => sendUserError(err, res));
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    if (req.session.username) {
      res.json({ success: true });
      return;
    }
  }
  User
    .findOne({ username })
    .then((user) => {
      bcrypt
        .compare(password, user.passwordHash)
        .then((result) => {
          if (!result) {
            sendUserError('incorrect username/password', res);
            return;
          }

          req.session.username = username;
          res.json({ success: true });
        })
        .catch(err => sendUserError(err, res));
    })
    .catch(err => sendUserError(err, res));
});

// TODO: add local middleware to this route to ensure the user is logged in
const meMiddleWare = (req, res, next) => {
  const { username } = req.session;
  if (username === undefined) {
    sendUserError('not logged in', res);
    return;
  }

  User
    .findOne({ username })
    .then((fUser) => {
      req.user = fUser;
      next();
    })
    .catch(err => sendUserError(err, res));
};

server.use('/restricted', meMiddleWare);
server.get('/restricted', (req, res) => {
  res.json({ success: 'restricted is open' });
});
server.get('/restricted/users', (req, res) => {
  User
    .find({})
    .then(users => res.json(users))
    .catch(err => sendUserError(err, res));
});

server.get('/me', meMiddleWare, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
    sendUserError('not logged in', res);
    return;
  }
  req.session.username = undefined;
  res.json({ success: true });
});

module.exports = { server };
