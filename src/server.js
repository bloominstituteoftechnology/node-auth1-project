const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const BCRYPT_COST = 11;

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
const sendUserError = (msg, res) => {
  if (typeof msg === 'object') {
    res.status(STATUS_SERVER_ERROR);
    res.json(msg);
    return;
  }
  res.status(STATUS_SERVER_ERROR);
  res.json({ error: msg });
  return;
};
// TODO: implement routes

const hashedPassword = (req, res, next) => {
  const { password } = req.body;
  bcrypt
    .hash(password, 11)
    .then((pw) => {
      req.password = pw;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both Username/PW fields': err.message });
      return;
    }
    const hashedPw = user.password;
    bcrypt
      .compare(password, hashedPw)
      .then((response) => {
        if (!response) throw new Error();
        req.loggedInUser = user;
        next();
      })
      .catch((error) => {
        return sendUserError('some message here', res);
      });
  });
};

// ************* routes ***********
server.post('/users', hashedPassword, (req, res) => {
  const { username } = req.body;
  const password = req.password;
  const newUser = new User({ username, password });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both Username/PW fields': err.message });
      return;
    }
    res.json({ savedUser });
  });
});

server.post('/user/login', authenticate, (req, res) => {
  res.json({ success: `${req.loggedInUser.username} logged in` });
});

// TODO: add local middleware to this route to ensure the user is logged in
// server.get('/me', checkLoggedIn, (req, res) => {
//   // Do NOT modify this route handler in any way.
//   res.json(req.user);
// });

module.exports = { server };
