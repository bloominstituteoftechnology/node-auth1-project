const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const corsOptions = {};

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false
  })
);

server.use(cors());

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

const restrictedPermissions = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      sendUserError('user not autorized', res);
      return;
    }
  }
  next();
};

/* ************ MiddleWare ***************** */
server.use(restrictedPermissions);

const hashPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    sendUserError('Please enter a password', res);
    return;
  }
  bcrypt
    .hash(password, BCRYPT_COST)
    .then((pw) => {
      if (!pw) throw new Error();
      req.password = pw;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('username undefined', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      sendUserError('No user found at that id', res);
      return;
    }
    const hashedPw = user.passwordHash;
    bcrypt
      .compare(password, hashedPw)
      .then((response) => {
        if (!response) throw new Error();
        req.session.username = username;
        req.user = user;
        next();
      })
      .catch((error) => {
        return sendUserError('Error', res);
      });
  });
};

const loggedIn = (req, res, next) => {
  const { username } = req.session;
  console.log(req.session);

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

/* ************ Routes ***************** */

server.post('/log-in', authenticate, (req, res) => {
  res.json({ success: true });
});

server.post('/log-out', (req, res) => {
  if (!req.session.username) {
    sendUserError('User not logged in', res);
  }

  const message = `${req.session.username} has been looged out`;
  req.session.username = null;
  res.json(message);
});

server.post('/users', hashPassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ username, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both Username/PW fields': err.message });
      return;
    }
    res.json(savedUser);
  });
});

server.get('/restricted/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      sendUserError('500', res);
      return;
    }
    res.json(users);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
