const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
server.use(cors(corsOptions));

// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    secure: false,
    name: 'auth',
    resave: false,
    saveUninitialized: true,
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
  })
);

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message });
  } else {
    res.json({ error: err });
  }
};

const checkLogedIn = (req, res, next) => {
  if (req.session.name) {
    User.findOne({ username: req.session.name })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => { res.status(500).json(err); });
  } else {
    sendUserError('user not signed in', res);
  }
};

/* const hashPass = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    sendUserError({ message: 'password is required' }, res);
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
}; */

// TODO: implement routes

server.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((savedUser) => {
      res.status(200).json(savedUser);
    })
    .catch((error) => {
      sendUserError(error, res);
    });
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    sendUserError('A password is needed', res);
    return;
  }
  if (!username) {
    sendUserError('A username is required', res);
    return;
  }
  User.findOne({ username })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((validation) => {
          if (validation) {
            req.session.name = user.username;
            res.status(200).json({ response: 'You can pass' });
          } else {
            sendUserError({ message: 'Password didn\'nt mutch' }, res);
          }
        });
    })
    .catch((err) => {
      sendUserError(err, res);
    })
    .catch((err) => {
      sendUserError(err, res);
    });
});

server.post('/logout', (req, res) => {
  if (!req.session.name) {
    sendUserError('User is not logged in', res);
    return;
  }
  req.session.name = null;
  res.json('You logged out');
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkLogedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
