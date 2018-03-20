const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const Bcrypt = require('bcrypt');
const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false
  })
);

/* ************ Middleware ***************** */

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const checkUser = (req, res, next) => {
  if (!req.session.user) {
    sendUserError('User is not authorized', res);
  }
  req.user = req.session.user;
  // console.log(req.user);
  next();
};

const restricted = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      sendUserError('User not authorized');
      return;
    }
  }
  next();
};

/* ************ Routes ***************** */

server.post('/users', (req, res) => {
  const { username, passwordHash } = req.body;
  if (!passwordHash || passwordHash === '') {
    res.status(STATUS_USER_ERROR).json({ error: 'You must enter a password' });
  }
  //   User.create({ username, passwordHash })
  const newUser = new User({ username, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both Email/PW fields': err.message });
    }
    res.json(savedUser);
  });
});

// server.get('/', (req, res) => {
//   const sesh = req.session;
//   res.json({ sesh });
// });

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    sendUserError('Please provide and ID and a password');
  }
  User.findOne({ username })
    .then((user) => {
      user.checkPassword(password, (err, validated) => {
        if (err) {
          console.log(err, res);
        } else if (validated) {
          req.session.user = user;
          res.status(200).json({ success: true });
        } else {
          res.status(422).json({ success: false });
        }
      });
    })
    .catch((dbSaveError) => {
      sendUserError('User Does not exist in our system', res);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
