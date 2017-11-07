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
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));

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
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    sendUserError('Must provide password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) return sendUserError(err, res);
    const newUser = new User({ username, passwordHash: hash });
    newUser.save()
    .then((user) => {
      res.json(user);
    })
    .catch((userErr) => {
      sendUserError(userErr, res);
    });
  });
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError('Missing username or password', res);
  User.findOne({ username })
  .exec()
  .then((user) => {
    if (!user) return sendUserError('Invalid user', res);
    bcrypt.compare(password, user.passwordHash, (errP, valid) => {
      if (errP || !valid) return sendUserError(errP, res);
      req.session.user = user;
      res.json({ success: true });
    });
  })
  .catch((err) => {
    if (err) return sendUserError(err, res);
  });
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
    sendUserError('Must be logged in', res);
    return;
  }

  req.session.username = null;
  res.json({ success: true });
});

const isloggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('Must be logged in', res);
    return;
  }

  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('Must be logged in', res);
    } else {
      req.user = user;
      next();
    }
  });
};

server.get('/me', isloggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

const checkRestricted = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      sendUserError('Must be logged in to access restricted path', res);
      return;
    }
  }
  next();
};

server.use(checkRestricted);

server.get('/restricted/users', (req, res) => {
  User.find({})
  .exec()
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    sendUserError(err, res);
    return;
  });
});

module.exports = { server };
