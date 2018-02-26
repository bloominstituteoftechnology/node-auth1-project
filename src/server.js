/* eslint-disable */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

// const salt = 'DH2AEXrEat732718a0LDWOCE4uJutpyEAPzHXxoLUDoj5oKjq8'

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
        console.log(session.username);
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
        // res.status(422);
        // res.json({ 'username/PW required': err.message });
        sendUserError(err, res);
      } else {
        res.json(savedUser);
      }
    });
  });
});
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
