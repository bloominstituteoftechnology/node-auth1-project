const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

mongoose
.connect('mongodb://localhost/usersdb')
.then(()=> {
  console.log('\n==== connected to mongo ====\n');
})
.catch(err => console.log('database connection failed'));

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

const userLog = function(req, res, next) {
  req.user = req.session.user;
  next();
};

// TODO: implement routes
// POST ROUTE ||||||||||||||||||||||||||||||||||||||||||||
server.post('/users', (req, res) => {
  const { username, passwordHash } = req.body;
  const user = new User(req.body);
  if (!username || !passwordHash) {
    res.status(STATUS_USER_ERROR).json({ message: 'error' });
  } else {
    user.save().then((doc) => {
      res.status(201).json(doc);
    });
  }
});
// GET /users |||||||||||||||||||||||||||||||||||||||||||||
server.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in

server.get('/me', userLog, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
