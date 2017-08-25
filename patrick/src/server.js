const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const User = require('./user'); // <~~~ I put this here
const bcrypt = require('bcrypt');  // <~~~ I put this here

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
// express-session deprecated undefined resave option; provide resave option src/server.js:15:12
// express-session deprecated undefined saveUninitialized option; provide saveUninitialized option src/server.js:15:12
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  // https://github.com/expressjs/session/issues/56
  // https://github.com/expressjs/session#options
  resave: true,
  saveUninitialized: false,
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

// GLOBAL MIDDLEWARE

// LOCAL MIDDLEWARE
const validateNameAndPassword = ((req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Please enter BOTH a USERNAME and a PASSWORD.', res);
    return;
  }
  next();
});

// ROUTES
// LOCAL MIDDLEWARE IMPLEMENTATION
server.post('/users', validateNameAndPassword, (req, res) => {
  const { username, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError({ 'There is omething weird with that password': err.message, 'ERROR STACK': err.stack }, res);
      return;
    }
  });
  const newUser = new User({ username, passwordHash });
  newUser.save((error, user) => {
    if (error) {
      sendUserError(error, res);
      return;
    }
    res.json(user);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/view-counter', (req, res) => {
  const sehShun = req.session;
  if (!sehShun.viewCount) {
    sehShun.viewCount = 0;
  }
  sehShun.viewCount++;
  res.json({ viewCount: sehShun.viewCount });
});

module.exports = { server };
