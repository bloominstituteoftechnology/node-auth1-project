/* eslint no-console: 0 */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const STATUS_USER_ERROR = 422;

const User = require('./user.js');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
  })
);

// Stretch problem global middleware
const restrictedAccess = (req, res, next) => {
  if (req.session.username) next();
  else res.status(404).send({ msg: 'You must log in to view this page.' });
};

// Stretch problem solution line which pairs with restrictedAccess on line 22
server.use('/restricted', restrictedAccess);

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

const authenticateUserMW = (req, res, next) => {
  if (req.session.username) {
    User.findOne({ username: req.session.username })
      .then(foundUser => {
        req.user = foundUser;
        res.status(200);
        next();
      })
      .catch(err => sendUserError(err, res));
  } else {
    sendUserError({ Error: 'User must be logged in.' }, res);
  }
};

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, passwordHash: password });
  newUser
    .save()
    .then(user => res.status(200).send(user))
    .catch(err => sendUserError(err, res));
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || username === '' || username === null)
    sendUserError({ Error: 'Must enter username' }, res);
  if (!password || password === '' || password === null)
    sendUserError({ Error: 'Must enter password' }, res);
  const lowerCaseUsername = username.toLowerCase();
  User.findOne({ username: lowerCaseUsername })
    .then(foundUser => {
      if (foundUser === null) {
        sendUserError({ Error: 'Must use valid username/password' }, res);
      } else {
        foundUser.checkPassword(password, (err, validated) => {
          if (err) {
            return sendUserError(err);
          } else if (!validated) {
            sendUserError({ Error: 'Must use valid username/password' }, res);
          } else if (validated) {
            req.session.username = foundUser.username;
            res.status(200).send({ success: true });
          }
        });
      }
    })
    .catch(err => sendUserError(err, res));
});

server.get('/dev', (req, res) => {
  User.find({})
    .then(results => res.status(200).send(results))
    .catch(err => sendUserError(err, res));
});

server.get('/restricted/hello', (req, res) => {
  res.send('Hello world');
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticateUserMW, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
