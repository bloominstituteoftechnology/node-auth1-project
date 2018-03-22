const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user.js');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
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

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));

const restrictedMW = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      sendUserError('Please login to access this area', res);
      return;
    }
  }
  next();
};
server.use(restrictedMW);
const loggedInMw = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    sendUserError('User is not logged in', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('Error!', res);
    } else {
      req.user = user;
      next();
    }
  });
};

// TODO: implement routes

// TODO: add local middleware to this route to ensure the user is logged in
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password: password });
  newUser.save((err, savedUser) => {
    if (err) {
      return sendUserError(err, res);
    }
    res.json(savedUser);
  });
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('Username undefined', res);
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (user === null) {
        sendUserError({ Error: 'username or pass incorrect' }, res);
      } else {
        user
          .checkPassword(password)
          .then((validation) => {
            if (validation) {
              req.session.username = username;
              res.status(200).send(user);
            }
            sendUserError({ Error: 'username or pass incorrect' }, res);
          })
          .catch((error) => {
            return sendUserError(error, res);
          });
      }
    })
    .catch((error) => {
      return sendUserError(error, res);

      // (err, user) => {
      // if (err || user === null) {
      //   sendUserError('No user found at that id', res);
      //   return;
      // }
      // const hashedPw = user.passwordHash;
      // bcrypt
      //   .compare(password, hashedPw)
      //   .then(response => {
      //     if (!response) throw new Error();
      //     req.session.username = username;
      //     req.user = user;
      //   })
      //   .then(() => {
      //     res.json({ success: true });
      //   })
      //   .catch(error => {
      //     return sendUserError('Errortyujhguikjnbhui!', res);
      //   });
    });
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
    sendUserError('Not logged in',res)
    return;
  }
  res.json({ message: 'You are now logged out' });
  req.session.username = null;
  //res.json(req.session);
})



server.get('/me', loggedInMw, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/restricted/users', (req, res) => {
  User.find({}, (err, user) => {
    if (err) {
      sendUserError('500', res);
      return;
    }
    res.json(user);
  });
});

module.exports = { server };
