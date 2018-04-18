const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./user');
const cors = require('cors');
const morgan = require('morgan');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const server = express();
server.use(cors(corsOptions));
server.use(morgan('dev'));
// to enable parsing of json bodies for post requests

const authenticate = function(req, res, next) {};

const protected = function(msg) {
  return function(req, res, next) {
    if (req.session && req.session.name) {
      next();
    } else {
      res.status(401).json({ msg });
    }
  };
};
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    secure: false,
    name: 'auth',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      url: 'mongodb://localhost/sessions',
      ttl: 10 * 60
    })
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

// TODO: implement routes

server.get('/', (req, res) => res.send('API Running...'));

server.get('/greet', (req, res) => {
  const { name } = req.session;
  res.send(`hello ${name}`);
});

server.get('/users', (req, res) => {
  User.find({})
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post('/users', (req, res) => {
  const user = new User(req.body);
  // const { username, password } = req.body;

  user
    .save()
    .then(newUser => res.status(200).json(newUser))
    .catch(err => res.status(500).json(err));
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);
  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .isPasswordValid(password)
          .then(isValid => {
            if (isValid) {
              console.log('before');
              req.session.name = user.username;

              res.status(200).json({ response: 'Logged In' });
            } else {
              res.status(401).json({ msg: 'Access Denied' });
            }
          })

          .catch(err => {
            console.log('inside catch');
            return res.status(502).json(err);
          });
      } else {
        res.status(400).json('The username or password is not valid');
      }
    })
    .catch(err => res.status(501).json(err));
});

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.status(500).json({ msg: 'could not log you out' });
      } else {
        res.status(200).json({ msg: 'good bye, come back soon' });
      }
    });
  }
});

server.get(
  '/restricted/users',
  protected('please login before proceeding'),
  checkPass('12'),
  (req, res) => {
    res.send({ greeting: `welcome back ${req.session.name}` });
  }
);

function checkPass(password) {
  return function(req, res, next) {
    if (password === '12') {
      next();
    } else {
      res.send('You shall not pass!');
    }
  };
}

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', protected('please login before proceeding'), (req, res) => {
  // Do NOT modify this route handler in any way.
  const { name } = req.session;
  res.json(req.user);
});

server.use((err, req, res, next) => {
  if (err) {
    err => res.json(err);
  }
});

module.exports = { server };
