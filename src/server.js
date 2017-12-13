const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');
const middleWare = require('./middlewares');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

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
server.use(middleWare.restrictedPermissions);

/* ************ Routes ***************** */

server.post('/log-in', middleWare.handleLogin, (req, res) => {
  res.json({ success: true });
});

server.post('/users', middleWare.hashedPassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ username, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both username/PW fields': err.message });
      return;
    }
    res.json(savedUser);
  });
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
    middleWare.sendUserError('User is not logged in', res);
    return;
  }
  req.session.username = null;
  res.json(req.session);
});

server.get('/restricted/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      middleWare.sendUserError('500', res);
      return;
    }
    res.json(users);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', middleWare.loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
