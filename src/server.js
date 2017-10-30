const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user.js');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

server.get('/', (req, res) => {
  User.find({})
    .exec()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR);
      sendUserError(err, res);
    });
});

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    res.status(STATUS_USER_ERROR);
    sendUserError('must provide a passowrd', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError('something went wrong', res);
      return;
    }
    const newUser = new User({ username, passwordHash: hash });
    newUser.save()
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        res.status(STATUS_USER_ERROR);
        sendUserError(error, res);
      });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      bcrypt.compare(password, user.passwordHash, (err, isValid) => {
        if (err) {
          res.status(STATUS_USER_ERROR);
          sendUserError(err, res);
          return;
        }
        if (isValid) {
          req.session.access = true;
          req.session.user = user;
          res.json({ success: true });
        } else {
          req.session.access = false;
          sendUserError('invalid password', res);
        }
      });
    })
    .catch((err) => {
      res.status(STATUS_USER_ERROR);
      sendUserError(err, res);
    });
});

const userMiddleware = (req, res, next) => {
  if (req.session.access) {
    req.user = req.session.user;
    next();
    return;
  }
  sendUserError('no access', res);
};

server.use((req, res, next) => {
  if (req.session.access) {
    req.user = req.session.user;
    next();
    return;
  }
  sendUserError('no access', res);
});

// server.get('/restricted/something', (req, res) => {
//   res.json({ attention: 'some important info' });
// });
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', userMiddleware, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
