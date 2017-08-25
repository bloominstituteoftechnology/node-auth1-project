const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true,
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
// The GET /me route should only be accessible by logged in users. We've already implemented the route handler for you; your job is to add local middleware to ensure that only logged in users have access.
// Make sure to do proper validation and error checking. If there's any error, or if no user is logged in, respond with an appropriate status and error message using the sendUserError() helper function.
const userMiddleware = (req, res, next) => {
  if (!req.session.userID) {
    sendUserError('Must be logged in!', res)
    return;
  }
  req.user = req.session.userID;
  next();
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', userMiddleware, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('Please enter a username!', res);
  } else if (!password) {
    sendUserError('Please enter a password!', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) {
      sendUserError(err, res);
    } else {
      const newUser = new User({ username, passwordHash });
      newUser.save((error, user) => {
        if (error) {
          sendUserError(error, res);
        } else {
          res.json(user);
        }
      });
    }
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('Please enter a username!', res);
    return;
  }
  if (!password) {
    sendUserError('Please enter a password!', res);
    return;
  }
  User.findOne(username, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else {
      bcrypt.compare(password, user.passwordHash, (error, isValid) => {
        if (error) {
          sendUserError(error, res);
          return;
        }
        if (isValid) {
          req.session.userID = user._id;
          res.json({ success: true });
        } else {
          sendUserError('Invalid password', res);
        }
      });
    }
  });
});



module.exports = { server };
