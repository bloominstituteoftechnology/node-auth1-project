/* eslint-disable */

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
  saveUninitialized: false
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

const restrictAccess = (req, res, next) => {
  if(req.url.startsWith('/restricted')) {
    if(req.session.loggedIn) {
      next();
    } else {
      res.status(STATUS_USER_ERROR).send({ message: 'Access Denied: You are not logged in'});
    }
  } else {
    next();
  }
  // res.json(req.url)
};
server.use(restrictAccess);

server.get('/restricted', (req, res) => {
  res.send('top secret restricted access');
});

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if(username && password) {
    bcrypt.hash(password, BCRYPT_COST)
      .then(passwordHash => {
        const newUser = new User({username, passwordHash});
        newUser.save()
          .then(user => {
            res.send(user);
          })
          .catch(err => {
            sendUserError(err);
          });
      })
      .catch(err => {
        sendUserError(err);
      });
  } else {
    res.status(STATUS_USER_ERROR).send({ message: 'Please send both a username and password'});
  }
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if(username && password) {
    User.findOne({ username: username })
      .then(user => {
        if(user) {
          bcrypt.compare(password, user.passwordHash)
            .then(result => {
              if(result) {
                req.session.loggedIn = user._id;
                res.send({ success: true });
              } else {
                res.status(STATUS_USER_ERROR).send({ message: 'Username or password does not match'});
              }
            })
            .catch(err => {
              sendUserError(err);
            });
        } else {
          res.status(STATUS_USER_ERROR).send({ message: 'Please send both a username and password'});        }
      })
      .catch(err => {
        sendUserError(err);
      });
  } else {
    res.status(STATUS_USER_ERROR).send({ message: 'Please send both a username and password'});
  }
});

const auth = (req, res, next) => {
  const UA = req.headers['cookie'];
  req.session.UA = UA;
  if(req.session.loggedIn) {
    User.findById(req.session.loggedIn)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        console.error(err);
      });
    // req.user = req.session.loggedIn;
  } else {
    res.status(STATUS_USER_ERROR).send({ message: 'You are not logged in'});
  }
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', auth, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
