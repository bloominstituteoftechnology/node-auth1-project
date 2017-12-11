const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');
const colors = require('colors');

const STATUS_USER_ERROR = 422;
const STATUS_CREATED = 201;
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
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};
/* eslint-disable no-console */
server.use((req, res, next) => {
  // console.log('req url', req.url);
  const route = req.url;
  if (route.length >= 12 && route.substring(0, 12) === '/restricted/' && session.user === undefined) {
    sendUserError('restricted to signed in users', res);
    return;
  }
  next();
});
/* eslint-disable no-console, no-throw-literal */
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('bad username or password', res);
    return;
  }
  User.findOne({ username })
    .exec()
    .then(user => {
      // console.log(`dup user in post/users: ${user}`.red);
      if (user) {
        sendUserError('username already exists', res);
        return;
      }
      throw { success: 'user not found' };
    })
    .catch(findErr => {
      // console.log('findErr', findErr);
      bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
        if (err) {
          sendUserError(err, res);
          return;
        }
        const newUser = new User({ username, passwordHash });
        newUser
          .save()
          .then(createdUser => {
            // session.user = createdUser.username;
            res.json(createdUser);
          })
          .catch(bcryptErr => {
            sendUserError(bcryptErr, res);
          });
      });
    });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  console.log(`log-in username: ${username} password: ${password}`.green);
  User.findOne({ username })
    .exec()
    .then(user => {
      bcrypt.compare(password, user.passwordHash, (bcryptErr, isValid) => {
        if (bcryptErr || !isValid) {
          console.log(`bcrypterr: ${bcryptErr}`.yellow);
          sendUserError(bcryptErr, res);
          return;
        }

        console.log(`user keys: ${Object.keys(user)}`.black);

        session.user = user.username;
        console.log(`log-in success user: ${user}`.black);
        res.json({ success: true });
      });
    })
    .catch(userErr => {
      console.log(`not found or error userErr: ${userErr}`.yellow);
      sendUserError(userErr, res);
    });
});

server.get(
  '/me',
  (req, res, next) => {
    // const { username } = req.body;
    // console.log(`req.body keys ${Object.keys(req.body)}`.red);
    if (session.user !== undefined) {
      User.findOne({ username: session.user })
        .exec()
        .then(user => {
          req.user = user;
          session.user = undefined;
          next();
        })
        .catch(err => {
          sendUserError(err, res);
          return;
        });
    } else {
      sendUserError('user not logged in', res);
      return;
    }
  },
  (req, res) => {
    // Do NOT modify this route handler in any way.
    res.json(req.user);
  }
);

module.exports = { server };
