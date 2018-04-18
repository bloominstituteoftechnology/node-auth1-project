const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const restricted = (req, res, next) => {
  if (req.path.includes('/restricted')) {
    if (req.session && req.session.username) {
      return next();
    }
    res.status(522).json({ message: 'User not logged in.' });
  } else {
    return next();
  }
};

const server = express();
// to enable parsing of json bodies for post requests

server.use(helmet());
server.use(cors(corsOptions));

server.use(bodyParser.json());
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    secure: false,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    store: new MongoStore({
      url: 'mongodb://localhost/sessions',
      ttl: 10 * 60,
    }),
  })
);
server.use(restricted);
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
server.get('/', (req, res) => {
  res.json({ message: 'running' });
});

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, passwordHash: password });

  user
    .save()
    .then(savedUser => res.json(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(422).json({ errorMessage: 'Username and Password required' });
  } // eslint-disable-next-line
  User.findOne({ username }).then(user => {
    if (user) {
      // eslint-disable-next-line
      user.isPasswordValid(password).then(isValid => {
        if (isValid) {
          req.session.username = user.username;

          res.json({ success: true });
        } else {
          res.status(422).json({ message: 'Invalid password' });
        }
      });
    } else if (user === null) {
      res.status(422).json({ message: 'User does not exist' });
    }
  });
});

server.post('/logout', (req, res) => {
  if (req.session) {
    const { username } = req.session;
    req.session.destroy();
    res.json({ message: `${username} has been logged out!` });
  } else {
    res
      .status(404)
      .json({ message: "Can't log out if you aren't logged in..." });
  }
});

const isLoggedIn = (req, res, next) => {
  if (req.session.username) {
    // eslint-disable-next-line
    User.findOne({ username: req.session.username }).then(user => {
      req.user = user;
      return next();
    });
  } else {
    res.status(422).json({ message: 'User not logged in.' });
  }
};

server.get('/restricted/users', (req, res) => {
  User.find()
    .select('username -_id')
    // eslint-disable-next-line
    .then(user => {
      res.json(user);
    })
    .catch(err => sendUserError(err, res));
});

server.get('/restricted/:info', (req, res) => {
  res.status({ info: req.params });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', isLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
