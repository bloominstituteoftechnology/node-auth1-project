const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
    session({
      secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
      secure: false,
      name: 'auth'
    })
  );
//cross origin request sharing permissions
const corsOptions = {
  origin: `*`,
  methods: `GET, HEAD, PUT, PATCH, POST, DELETE`,
  preflightContinue: false,
  optionsSuccessStatus: 204,
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
const testUsername = function (req, res, next) {
    const { username } = req.body;
  
    if (!username || username.trim() === '') {
      return sendUserError('Error need username!', res);
    }
    next();
  };
  
  const testPassword = function (req, res, next) {
    const { password } = req.body;
  
    if (!password || password.trim() === '') {
      return sendUserError('Error need password!', res);
    }
    next();
  };
  
  server.get('/users', (req, res) => {
    User.find()
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

// TODO: implement routes
server.post('/users', (req, res) => {
    if (!req.body.username || !req.body.password) {
      res
        .status(422)
        .json({ message: 'Error: Username and Password required.' });
    } else {
      const { username, password } = req.body;
     
      const user = new User({ username, passwordHash: password });
  
      user
        .save()
        .then((savedUser) => {
          res.status(200).json(savedUser);
        })
        .catch((err) => {
          res.status(500).json(sendUserError(err, res));
        });
    }
  });
  
  server.post('/log-in', testUsername, testPassword, (req, res) => {
    const { username, password } = req.body;
      User.findOne({ username })
        .then((user) => {
            if (user) {
              user
              .isPasswordValid(password, res)
              .then((isValid) => {
                if (isValid) {
                  req.session.name = user.username;
                  res.status(200).json({ success: true });
              } 
                else {
                  res.status(422).json({ userError: 'You shall not pass!' });
              }
            })
        .catch((err) => {
          res.status(500).json(sendUserError(err, res));
        });
        }
         else {
          res.status(422).json({ errorMessage: 'Incorrect credentials.' });
        }
    })
        .catch((err) => {
          res.status(500).json(sendUserError(err, res));
         });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  const loginCheck = (req, res, next) => {
      if (req.session.name) {
        User.findOne({ username: req.session.name })
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((err) => {
            res.status(422).json(sendUserError(err, res));
          });
      } 
      else {
        return sendUserError({ errorMessage: 'User is not logged in!' }, res);
      }
};
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.use((err, req, res, next) => {
  if (err) {
      res.status(500).json(sendUserError(err, res));
    }
});

module.exports = { server };
