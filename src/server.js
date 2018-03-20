/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;

const User = require('./user.js');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    authed: false,
    resave: true,
    saveUninitialized: false,
  })
);

const authenticateUserMW = (req, res, next) => {
  const session = req.session;
  if (session.UA === req.headers['cookie']) {
    User.findOne({ username: session.username })
      .then(foundUser => {
        req.user = foundUser;
        console.log('The value of req.user is:', req.user);
        next();
      })
      .catch(err => sendUserError(err, res));
  } else {
    res.status(500).send({ errorMessage: 'Ya dun goofed' });
  }
};

const restrictedAccess = (req, res, next) => {
  const path = req.path.split('/');
  if (path[1] === 'restricted') {
    if (req.session.UA === req.headers['cookie']) {
      next();
    } else {
      res.status(403).send({ message: "You're not logged in" });
    }
  } else {
    next();
  }
};

server.use(restrictedAccess);

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
server.post('/users/:username&:password', (req, res) => {
  const { username, password } = req.params;
  const newUser = new User({ username, passwordHash: password });
  newUser
    .save()
    .then(savedUser => res.status(201).send(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post('/log-in/:username&:password', (req, res) => {
  const { username, password } = req.params;
  User.findOne({ username: username })
    .then(foundUser => {
      foundUser
        .checkPassword(password)
        .then(isMatching => {
          if (isMatching) {
            const session = req.session;
            session.username = username;
            session.UA = req.headers['cookie'];
            res.status(500).send({ success: true });
          } else {
            res.status(406).send({ message: "Passwords don't match" });
          }
        })
        .catch(error => {
          sendUserError(error, res);
        });
    })
    .catch(err => sendUserError(err, res));
});

//.then(isMatching => {
//   const session = req.session;
//   session.username = username;
//   session.UA = req.headers['cookie'];
//   res.status(500).send({ success: true });
// }).catch(error => {
//   res.status(406).send({ message: 'Passwords don\'t match'});
// })

server.get('/dev', (req, res) => {
  // res.send(req.session);
  User.find({})
    .then(results => res.status(200).send(results))
    .catch(err => sendUserError(err, res));
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticateUserMW, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
