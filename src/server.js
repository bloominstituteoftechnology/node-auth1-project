// import { constants } from 'fs';

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  saveUninitialized: false,
  resave: true,
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

const checkIfLoggedIn = (req, res, next) => {
  if (!req.session.loggedIn) sendUserError({ message: 'user not logged in' }, res);
  req.user = req.session.user;
  next();
};

// const restricted = (req, res, next) => {
//   if (req.url.startsWith('/restricted) {
//     if (req.session.loggedIn) {
//       next();
//     } else {
//       sendUserError('Access Denied: You are not logged in', res);
//     }
//   } else next();
// };
// server.use(restricted);

server.use('/restricted', checkIfLoggedIn);

server.get('/restricted', (req, res) => {
  res.json('go go go');
});

// TODO: implement routes
server.post('/users', (req, res) => {
  const pass = req.body.password;
  const userN = req.body.username;
  if (!userN) sendUserError({ message: 'username not given' }, res);
  if (pass === '') sendUserError({ message: 'password not given' }, res);
  if (userN && pass) {
    bcrypt.hash(pass, BCRYPT_COST, (err, hashedPw) => {
      if (err) sendUserError({ message: 'error hashing password' }, res);
      const user = new User({ username: userN, passwordHash: hashedPw });
      user.save().then((savedUser) => {
        res.status(200).json(savedUser);
      }).catch(error => sendUserError(error));
    });
  } else sendUserError({ message: 'error' }, res);
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    User.find({ username }).then((record) => {
      if (record[0]) {
        bcrypt.compare(password, record[0].passwordHash, (err, isValid) => {
          if (isValid) {
            if (!req.session.loggedIn) req.session.loggedIn = true;
            req.session.user = record[0];
            res.status(200).json({ success: true });
          } else sendUserError({ message: 'Not authenticated' }, res);
        });
      } else sendUserError('username not found', res);
    }).catch(error => sendUserError({ message: 'username was not found' }), res);
  } else sendUserError({ message: 'incorrect username and/or password' }, res);
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkIfLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
