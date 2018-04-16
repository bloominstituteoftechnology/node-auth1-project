/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

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
server.post('/users', (req, res) => {
  let { username, password } = req.body;
  
  console.log(req.body);
  
  if (!username || !password) {
    res.status(422).json({error: "provide username or password"})
  }
  
  const user = new User({ username, passwordHash: password });
  console.log(user);
  user
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => res.status(500).json(err));
});

server.get('/', (req, res) => {
  User.find({})
  .then(response => res.status(200).json(response))
  .catch(err => res.status(500).json(err));
});


// TODO: add local middleware to this route to ensure the user is logged in



server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
