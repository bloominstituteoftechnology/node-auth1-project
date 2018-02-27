/* eslint-disable */

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
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    username: '',
    resave: true,
    saveUninitialized: true,
  }),
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

// TODO: implement routes
server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Must provide username and password', res);
    return;
  }
  User.find({username}).then(foundUser => {
    if (foundUser.length == 0) {
      sendUserError('User Not Found in Databade', res);
      return;
    }
    bcrypt.compare(password, foundUser[0].passwordHash, (err, isValid) => {
      if (err) {
        sendUserError(err, res);
        return;
      }
      if (isValid) {
        session.username = foundUser[0]._id;
        res.json({ success: true })
      } else {
        sendUserError('Password not Valid', res);
      }
    })
  })
})
server.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    sendUserError('Must provide username and password', res);
    return;
  }

  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError(err, res);
      return;
    }

    const newUser = new User({ username, passwordHash: hash });
    newUser.save((err, savedUser) => {
      if (err) {
        sendUserError(err, res);
      } else {
        res.json(savedUser);
      }
    });
  });
});
// TODO: add local middleware to this route to ensure the user is logged in
const checkIfLoggedIn = (req, res, next) => {
  if (!session.username) {
    sendUserError('Not logged in.', res);
    return;
  }

  User.findById(session.username).then(foundUser => {
    if (foundUser === null) {
      sendUserError('Logged in user not found in db.', res);
      return;
    }

    req.user = foundUser;
    next();
  });
};

server.get('/me', checkIfLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.send(req.user);
});

server.use((req, res, next) => {
  if (req.originalUrl.includes('/restricted')) {
    checkIfLoggedIn(req, res, next);

    if (!req.username) return;
  }

  next();
});

server.get('/restricted/something', (req, res) => {
  res.json({
    message: `something restricted accessed by ${req.user.username}`,
  });
});

server.get('/restricted/other', (req, res) => {
  res.json({ message: `other restricted accessed by ${req.user.username}` });
});
server.get('/restricted/a', (req, res) => {
  res.json({ message: `a restricted accessed by ${req.user.username}` });
});

module.exports = { server };
