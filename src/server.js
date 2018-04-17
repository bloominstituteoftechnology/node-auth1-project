/*eslint-disable*/
const express = require('express');
const session = require('express-session');
// const bodyParser = require('body-parser');
const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
// server.use(bodyParser.json());
server.use(express.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: false,
    saveUninitialized: true,
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

const authenticated = (req, res, next) => {
  // do some checks here??? then assign user
  // can use id or username, no strategy yet
  req.user = req.query.username;
  const test = false;
  if (test) {
    return res.json('opted out');
  }
  next();
};

// TODO: implement routes
server.post('/users', (req, res) => {
  if (req.body.username === undefined) {
    const err = {message: 'Please provide a username!'};
    return sendUserError(err, res);
  }
  if (req.body.password === undefined) {
    const err = { message: 'Please provide a password!' };
    return sendUserError(err, res);
  }
  const { username, password } = req.body;
  const user = new User({username: username, passwordHash: password});

  user
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post('/login-in', (req, res) => {
  const { username, password } = req.body;
  if (username === undefined) {
    const err = { message: 'Please provide a username!' };
    return sendUserError(err, res);
  }
  if (password === undefined) {
    const err = { message: 'Please provide a password!' };
    return sendUserError(err, res);
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        user
          .isPasswordValid(password)
          .then(response => {
            if (response === true) {
              return res.status(200).json({ success: true });
            }
            return res.status(400).json({ error: 'something failed' });
          })
          .catch(err => {
            return res.status(400).json({ err: 'Useranme/Password incorrect' });
          });
      }
    })
    .catch(err => res.status(500).json(err));
});
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticated, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
