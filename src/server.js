const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const BCRYPT_COST = 11;

const server = express();

// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

server.use(session({
  // We've also gone ahead and initialized the express-session middleware so you can
  // use the client-specific, persistent `req.session` object in your route handlers.
  resave: true,
  saveUninitialized: false,
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const sendServerError = (err, res) => {
  res.status(STATUS_SERVER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// Start middleware
const validateInfo = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    let err;
    if (!username) {
      err = "You're missing your username.";
    } else {
      err = "You're missing your password.";
    }
    sendUserError(err, res);
    return;
  }
  res.locals = { username, password };
  next();
};

const isLoggedIn = (req, res, next) => {
  if (!req.session.username) {
    sendUserError("You're not logged in, can't view your personal info.", res);
    return;
  }
  next();
};

server.use('/restricted', (req, res, next) => {
  isLoggedIn(req, res, next); // If this doesn't handle an error, we will continue onto wherever we were going as defined in isLoggedIn.
});
// End middleware


// Start routes
server.get('/DEBUG/:type', (req, res) => {
  // DEBUG, REMOVE BEFORE PRODUCTION.
  const { type } = req.params;
  if (type === 'show-all') {
    User.find({}, (err, user) => {
      if (err) {
        sendServerError(err, res);
      }
      res.json({ user, loggedIn: req.session.username });
    });
  }
  if (type === 'remove-all') {
    User.remove({}, (err, response) => {
      if (err) {
        sendServerError(err, res);
      }
      res.json(response);
    });
  }
});

server.post('/sign-up', validateInfo, (req, res) => {
  const { username, password } = res.locals;

  // Once I've used the middleware to validate my login info, I no longer need it.
  delete res.locals; // Security m8.

  // Use bcrypt to hash the password,
  bcrypt.hash(password, BCRYPT_COST, (berr, hash) => {
    if (berr) sendServerError(berr, res);
    // Then create a new user in MongoDB and save it.
    const user = new User({ username, passwordHash: hash });
    user.save((uerr) => {
      if (uerr) {
        if (uerr.code === 11000) {
          sendUserError('Username taken.', res);
        } else {
          sendServerError(uerr, res);
        }
      } else {
        res.json(user);
      }
    });
  });
});

server.post('/log-in', validateInfo, (req, res) => {
  const { username, password } = res.locals;
  delete res.locals;
  // Retrieve user by username, hash password, compare passwords.
  User.findOne({ username }, (ferr, user) => {
    if (ferr) sendUserError(ferr, res);
    if (!user) { // If someone who's not signed up tries to log in.
      sendUserError('User not found. Try signing up first?', res);
      // Not implicitly returning with the res.json in sendUserError?
      return;
    }

    bcrypt.compare(password, user.passwordHash, (berr, isValid) => {
      if (berr) sendServerError(berr, res);
      if (isValid) {
        // If the log-in info was valid, check if we're already logged in.
        if (!req.session.username) {
          // If we're not, log in.
          req.session.username = username;
          res.json({ success: true, user });
        } else {
          sendUserError(`${username} is already logged in.`, res);
        }
      } else {
        sendUserError('Wrong password!', res);
      }
    });
  });
});

server.get('/log-out', (req, res) => {
  if (!req.session.username) {
    sendUserError("You can't log out if you're not logged in dummy.", res);
  } else {
    const { username } = req.session;
    delete req.session.username;
    res.json({ success: `${username} logged out.` });
  }
});

server.get('/me', isLoggedIn, (req, res) => { // Extra credit.
  // Do NOT modify this route handler in any way.
  res.json(req.session.username);
});

server.get('/restricted/test', (req, res) => { // For extra credit testing purposes.
  res.json({ success: 'Ur hot shit m8 you made it to the restricted area.' });
});

// End routes
module.exports = { server };
