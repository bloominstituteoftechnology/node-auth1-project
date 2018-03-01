const bodyParser = require('body-parser');
const express = require('express');
const expSession = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(expSession({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
server.use(cors(corsOptions));

server.use((req, res, next) => {
  const check = req.originalUrl.split('/restricted');
  if (check.length > 1 && req.session.user) {
    next();
  } else if (check.length > 1 && !req.session.user) {
    res.status(500).send({ error: 'You shall not pass! (Unless you log in.)' });
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

const logInCheck = (req, res, next) => {
  const session = req.session;
  if (session.user) {
    User.findOne({ username: session.user })
      .then((user) => {
        req.user = user;
        next();
      }).catch((err) => {
        sendUserError(err, res);
      });
  } else {
    sendUserError('You shall not pass! (Unless you log in.)', res);
  }
};


server.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    sendUserError('Must provide both username & password.', res);
    return;
  }

  bcrypt.hash(password, BCRYPT_COST)
    .then((data) => {
      const user = new User({ username, passwordHash: data });
      user.save()
        .then((newUser) => {
          res.status(200).send(newUser);
        }).catch((err) => {
          sendUserError('Could not save new user.', res);
        });
    });
});

// to test stretch problem
server.get('/restricted/users', (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).send(user);
    }).catch((error) => {
      res.status(500).send({ error: 'Unable to retrieve users.' });
    });
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const session = req.session;

  if (!username || !password) {
    sendUserError('Must provide both username & password.', res);
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
  res.status(200).json({ successMessage: 'User logged out.' });
});

server.get('/me', logInCheck, (req, res) => {
  res.json(req.user);
});

module.exports = { server };
