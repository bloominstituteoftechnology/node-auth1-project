const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const User = require('./user');
const bcrypt = require('bcrypt');

const BCRYPT_COST = 11;

const STATUS_USER_ERROR = 422;

const server = express();
const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false,
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
const checkUserLoggedIn = (req, res, next) => {
  const thisSession = req.session;
  if (thisSession.user) {
    User.findOne({ username: thisSession.user })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  } else {
    sendUserError('You must first log in.', res);
  }
};

server.post('/users', (req, res) => {
  const { username, passwordHash } = req.body;
  if (!username || !passwordHash) {
    sendUserError('You will need to enter a username & password.', res);
  }
  const user = new User({ username, passwordHash });
  user.save()
  .then((newUser) => {
    res.status(200).json(newUser);
  })
  .catch((err) => {
    res.status(500).json({ error: 'There was a server error while signing up', err });
  });
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const thisSession = req.session;
  if (!username || !password) {
    sendUserError('You will need to enter a username & password.', res);
    return;
  }

  User.findOne({ username })
  .then((data) => {
    bcrypt
      .compare(password, data.passwordHash)
      .then((match, err) => {
        if (match) {
          thisSession.user = username;
          res.status(200).send({ success: true });
        } else {
          sendUserError({ success: false }, res);
        }
      })
      .catch((error) => {
        sendUserError({ error: 'Password was invalid.' });
      });
  })
  .catch((err) => {
    sendUserError({ error: 'Error when attempting to find user.' }, res);
  });
});


server.post('/logout', (req, res) => {
  if (!req.session.user) {
    sendUserError('User is not logged in', res);
    return;
  }
  req.session.user = null;
  res.json(req.session);
});

server.get('/restricted/users', checkUserLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      sendUserError('500', res);
      return;
    }
    res.json(users);
  });
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkUserLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
