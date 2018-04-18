const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();

server.use(express.json());
server.use(
  session({
    name: 'auth',
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
  })
);

const loggedIn = function(check) {
  return function(req, res, next) {
    if (req.session && req.session.name) {
      next();
    } else {
      res.status(401).json({ error: err });
    }
  };
};

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
// const sendUserError = (err, res) => {
//   res.status(STATUS_USER_ERROR);
//   if (err && err.message) {
//     res.json({ message: err.message, stack: err.stack });
//   } else {
//     res.json({ error: err });
//   }
// };

server.get('/users', (req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const user = new User(req.body);

  if (!username || !password) {
    res.status(STATUS_USER_ERROR).json({ Error: 'Enter a username and password' });
  } else {
    user
      .save()
      .then(newUser => res.status(201).json(newUser))
      .catch(err => res.status(401).json(err));
  }
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(STATUS_USER_ERROR).json({ Error: 'Enter a username and password' });
  } else {
    User.findOne({ username })
      .then(user => {
        if (user) {
          user.isPasswordValid(password).then(response => {
            if (response) {
              req.session.name = user.username;
            }
            res.status(200).json({ success: true });
          });
        } else {
          res
            .status(401)
            .json({ Error: 'The username/password combination you entered is invalid' });
        }
      })
      .catch(err => res.status(500).json(err));
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedIn(), (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/', (req, res) => res.send('API Running...'));

module.exports = { server };
