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

/* ================= MiddleWares =============== */
const hashpassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    sendUserError('Gimme a password', res);
    return;
  }
  bcrypt
    .hash(password, BCRYPT_COST)
    .then((pw) => {
      req.password = pw;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const handleLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('needs user name', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || !user === null) {
      sendUserError('No user found', res);
      return;
    }
    const hashpw = user.passwordHash;
    bcrypt
      .compare(password, hashpw)
      .then((response) => {
        if (!response) throw new Error();
        req.loogedInUser = user;
        req.session.username = username;
        next();
      })
      .catch((error) => {
        return sendUserError('some message here', res);
      });
  });
};

const loggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('User is not logged in', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('User does not exist', res);
    } else {
      req.user = user;
      next();
    }
  });
};
// TODO: implement routes


server.post('/log-in', handleLogin, (req, res) => {
  res.json({ success: true });
});

server.post('/users', hashpassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ username, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      return sendUserError('username and password is required', res);
    }
    res.json(savedUser);
  });
});

// server.post('/logout', (req, res) => {
//   if (!req.session.username) {
//     sendUserError('User is not logged in', res);
//     return;
//   }
//   req.session.username = null;
//   res.json(req.session.username);
// });
// TODO: add local middleware to this route to ensure the user is logged in

server.get('/me', loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
