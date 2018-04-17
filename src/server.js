const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: true
  })
);
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const authenticateUser = (req, res, next) => {
  const { username } = req.session;

  if (username) {
    User.findOne({ username })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  } else {
    res.status(500).json({ message: 'you must be logged in to access route' });
  }
};
/* Sends the given err, a string or an object, to the client. Sets the status */
/* code appropriately. */

// TODO: implement routes

server.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
      if (err) {
        sendUserError(err, res);
      }
      const user = new User({ username, passwordHash: hash });
      user
        .save()
        .then((savedUser) => {
          res.status(200).json(savedUser);
        })
        .catch((error) => {
          sendUserError(error, res);
        });
    });
  } else {
    sendUserError(
      { message: 'username and password field are required.' },
      res
    );
  }
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    User.findOne({ username })
      .then((user) => {
        user.checkPassword(password).then((isValid) => {
          if (isValid) {
            req.session.username = username;
            res.status(200).json({ success: true });
          } else {
            sendUserError({ message: 'username/password invalid' }, res);
          }
        });
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticateUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(err => sendUserError(err, res));
});

module.exports = { server };
