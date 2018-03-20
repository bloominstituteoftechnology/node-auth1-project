const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user');

const STATUS_USER_ERROR = 422;

const server = express();
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

server.post('/users', (req, res) => {
  if (!(req.body.password && req.body.username)) {
    sendUserError({ message: 'Username and password required' }, res);
  } else {
    const userInfo = {
      username: req.body.username,
      passwordHash: req.body.password
    };
    const newUser = new User(userInfo);
    newUser.save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((catchErr) => {
      sendUserError(catchErr, res);
    });
  }
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    sendUserError({ message: 'Username and password required' }, res);
  } else {
    User
      .findOne({ username }, '_id passwordHash')
      .then((user) => {
        user.checkPassword(password, (err, resp) => {
          if (!resp) {
            sendUserError({ message: 'Password is INCORRECT' }, res);
          } else {
            req.session.user = user._id; // eslint-disable-line no-underscore-dangle
            res.status(200).json({ success: true });
          }
        });
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  }
});

const middleWare = (req, res, next) => {
  if (req.session.user) {
    User
      .findById(req.session.user)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  } else {
    sendUserError({ message: 'No user is currently logged in.' }, res);
  }
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', middleWare, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// stretch
const restrictedMw = (req, res, next) => {
  if (req.url.startsWith('/restricted')) {
    if (req.session.user) {
      User
        .findById(req.session.user)
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => {
          sendUserError(err, res);
        });
    } else {
      sendUserError({ message: 'No user is currently logged in.' }, res);
    }
  }
};

// server.use(restrictedMw);

server.get('/restricted/', restrictedMw, (req, res) => {
  res.send('You\'re accessing restricted content!');
});

module.exports = { server };
