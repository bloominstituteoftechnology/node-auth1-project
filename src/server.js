// const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const User = require('./user');

const STATUS_USER_ERROR = 422;
const STATUS_OK = 200;
const USERS_PATH = '/users';
const LOG_IN_PATH = '/log-in';
const LOG_OUT_PATH = '/logout';
const ME_PATH = '/me';

const server = express();
// to enable parsing of json bodies for post requests
// server.use(bodyParser.json());
server.use(express.json());

server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // milliseconds
    secure: false,
    name: 'auth',
    /* store: new MongoStore({
      url: 'mongodb://localhost/sessions',
      ttl: 10 * 60, // seconds
    }),
    */
  })
);
/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    return res.json({ message: err.message, stack: err.stack });
  }
  return res.json({ error: err });
};
const checkUsernameAndPassword = (req, res, next) => {
  if (req.body.username === undefined && req.body.password === undefined) {
    sendUserError({ message: 'Please provide a username and password' }, res);
  }
  next();
};

const checkUsername = (req, res, next) => {
  if (req.body.username === undefined) {
    sendUserError({ message: 'Please provide a username' }, res);
  }
  next();
};

const checkPassword = (req, res, next) => {
  if (req.body.password === undefined) {
    sendUserError({ message: 'Please provide a password' }, res);
  }
  next();
};

const auntheticated = (req, res, next) => {
  if (req.session && req.session.name) {
    req.user = req.session.name;
  } else {
    sendUserError({ message: 'Please login!' }, res);
  }
  next();
};
// TODO: implement routes
server.get(USERS_PATH, (req, res) => {
  User.find()
    .then(users => res.status(STATUS_OK).json(users))
    .catch(err => sendUserError(err, res));
});

server.post(USERS_PATH, checkUsernameAndPassword, checkUsername, checkPassword, (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, passwordHash: password });

  user
    .save()
    .then(savedUser => res.status(STATUS_OK).json(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post(
  LOG_IN_PATH,
  checkUsernameAndPassword,
  checkUsername,
  checkPassword,
  (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }).then((user) => {
      if (user) {
        user
          .isPasswordValid(password)
          .then((isValid) => {
            if (isValid) {
              req.session.name = user;
              res.status(STATUS_OK).json({ success: true });
            } else {
              sendUserError({ message: 'Password/ Username is incorrect' }, res);
            }
          })
          .catch(err => sendUserError(err, res));
      } else {
        sendUserError({ message: 'Password/ Username is incorrect' }, res); // not found user but don't tell the bad guy that the user doesn't exist
      }
    }).catch(err => sendUserError(err, res));
  }
);

server.get(LOG_OUT_PATH, auntheticated, (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'could not log you out' });
      }
      return res.status(200).json({ message: 'Logged you out!' });
    });
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get(ME_PATH, auntheticated, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
