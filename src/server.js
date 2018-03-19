const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));


server.use((req, res, next) => {
  const check = req.originalUrl.split('/restricted');
  if (check.length > 1 && req.session.user) {
    next();
  } else if (check.length > 1 && !req.session.user) {
    res.status(500).send({ error: 'Cannot access your user if you are not logged in' });
  } else {
    next();
  }
});
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
const checkLogin = (req, res, next) => {
  const sessionID = req.session;
  if (sessionID.user) {
    User.findOne({ username: sessionID.user })
      .then((user) => {
        req.user = user;
        next();
      }).catch((err) => {
        sendUserError(err, res);
      });
  } else {
    sendUserError('You cannot proceed unless you login', res);
  }
};


server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('You need both the username and the password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST)
    .then((data) => {
      const user = new User({ username, passwordHash: data });
      user.save()
        .then((newUser) => {
          res.status(200).send(newUser);
        }).catch((err) => {
          sendUserError('Not able to save new user', res);
        });
    });
});
// restricted users
server.get('/restricted/users', (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).send(user);
    }).catch((error) => {
      res.status(500).send({ error: 'Cannot get users' });
    });
});

// Now adding login method to post to users

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sessionID = req.sessionID;
  if (!username || !password) {
    sendUserError('Must input both the username and password', res);
    return;
  }
  User.findOne({ username })
    .then((data) => {
      bcrypt.compare(password, data.passwordHash)
        .then((match, err) => {
          if (match) {
            session.user = username;
            res.status(200).send({ success: true });
          } else {
            sendUserError({ success: false }, res);
          }
        }).catch((error) => {
          sendUserError({ error: 'Password is incorrect.' });
        });
    }).catch((err) => {
      sendUserError({ error: 'Unable to find a user by that name.' }, res);
    });
});


server.post('/logout', (req, res) => {
  req.session.user = undefined;
  res.status(200).json({ successMessage: 'You were logged out' });
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
