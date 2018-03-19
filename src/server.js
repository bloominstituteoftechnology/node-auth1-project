const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./user.js');
const { hashPw, compareHashPw, verifyLogin, } = require('./middlewares.js');


const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// ###### CORS IMPLEMENTATION BEGINS ###########

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));
// ###### CORS IMPLEMENTATION END ###########

server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true
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

// Personal Implementation of a root acess for debugging.
server.get('/', (req, res) => {
  res.json({ message: 'Api Running' });
});

// Register User and add in.
server.post('/users', hashPw, (req, res) => {
  const { username, hashedPw } = req.body;
  const user = new User({ username, passwordHash: hashedPw });
  user.save((err, savedUser) => {
    if (err || !savedUser) {
      sendUserError('No user was saved', res);
    } else {
      req.session.username = savedUser.username;
      res.json(savedUser);
    }
  });
});

// Login Users and Authenticate.
server.post('/login', compareHashPw, (req, res) => {
  const { authenticatedUser } = req.body;
  req.session.username = authenticatedUser;
  res.json({ success: true });
});

server.post('/logout', (req, res) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('The is not logged in, and cant be logged out');
  } else {
    req.session.username = '';
    res.json({ success: `${username} has been sucessfuly logged out` });
  }
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', verifyLogin, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// Stretch
server.get('/restricted/*', verifyLogin, (req, res) => {
  const { username } = req.session;
  res.json({ message: `Hello ${username} this area is only accesible to users authenticated` });
});

module.exports = { server };
