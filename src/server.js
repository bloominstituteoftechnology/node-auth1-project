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
    }
  }
  next();
};
// "$2a$11$05DYl.2hVuLmMy8tKRIueeQJAepc37WRgY2Jhw.6b5y7s5El/Z6Ce"
// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!password || password === '') {
    res.status(STATUS_USER_ERROR).json({ error: 'You must enter a password' });
  }
  Bcrypt.hash(password, BCRYPT_COST, (err, passHash) => {
    if (err) {
      console.log({ error: err });
    }
    const newUser = new User();
    newUser.username = username;
    newUser.passwordHash = passHash;
    newUser
      .save()
      .then((savedUser) => {
        res.status(200).json(savedUser);
      })
      .catch((saveError) => {
        sendUserError(saveError, res);
      });
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
      Bcrypt.compare(password, user.passwordHash, (err, passCheck) => {
        if (err) {
          console.log({ error: err });
        } else if (passCheck) {
          req.session.user = user;
          res.status(200).json({ success: true });
        } else {
          res.status(422).json({ success: false });
        }
      });
    })
    .catch((dbSaveError) => {
      sendUserError(dbSaveError, res);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
