const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js')

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

// const validateUserPassword = server.use((req, res, next) => {
//   const username = req.body.username;
//   const { password } = req.body;
//   console.log(req.body);
//   if (!username || !password) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'Provide both username and password' });
//     return;
//   }
//   next();
// });

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  // checking for a password
  if(!password || !username) {
    sendUserError('valid username/password required', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    const newuser = new User({ username, passwordHash });
    newuser.save((err, user) => {
      if (err) {
        sendUserError(err, res);
        return;
      }
      res.json(user);
    });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  const session = req.session;
  if (!username || !password) {
    sendUserError('valid username/password required', res);
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError('no username with that name found', res);
      return;
    }
    if(!user) {
      sendUserError('username required', res);
      return;
    }
    if(bcrypt.compare(password, user.passwordHash)) {
      session.login = user.username;
      res.json({ success: true });
      return;
    } else {
    sendUserError('password invalid', res);
  }
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
const localMiddleware = (req, res, next) => {
  const session = req.session;
  if (!session.login) {
    sendUserError('Login required', res);
    return;
  }
  User.find({ username: session.login }, (err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    req.user = user;
    next();
  });
}
server.get('/me', localMiddleware, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };