/*eslint-disable*/

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;
const server = express();

mongoose
  .connect('mongodb://localhost/authdb')
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  })
  .catch(err => console.log('database connection failed', err));

server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  secure: false,
  name: 'auth',
}));

/* Sends the given err, a string or an object, to the client. Sets the status
   code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes

server.get('/users', (req, res) => {
  User
    .find()
    .then(users => res.status(200).json(users))
    .catch(err => sendUserError(err, res));
});

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, passwordHash: password });

  user
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    User
      .findOne({ username })
      .then((user) => {
        user.isPasswordValid(password)
          .then(isValid => {
            if(isValid) {
              req.session.id = user._id;
              res.status(200).json({success: true});
            } else {
              sendUserError({message: "Username/password match not found."}, res);
            }
          })
          .catch(err => sendUserError(err, res));
        }).catch(err => sendUserError(err, res));
    } else {
      sendUserError({message: "You must enter both a username and a password."}, res);
  }
});

const validate = function() {
  return function(req, res, next) {
    console.log("req.id: ", req);
    console.log("session: ", req.session.id);
    if (req.session.id === req._id) {
      next();
    } else {
      sendUserError({ error: "wrong user" }, res);
      return;
    }
  };
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', validate(), (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
