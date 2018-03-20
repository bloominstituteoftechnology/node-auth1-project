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
  saveUninitialized: false,
  resave: true
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

const checkUser = (req, res, next) => {
  console.log('sdfk');
  if (!req.session.user) {
    sendUserError('User is not authorized', res);
  }
  req.user = req.session.user;
  next();
};

const restricted = (req, res, next) => {
  // do something that only apply to restricted route
  next();
};

server.use('/restricted', restricted);

server.get('/restricted/test', (req, res) => {
  res.json('from test restricted route');
});

server.get('/restricted/another', (req, res) => {
  res.json('from another restricted route');
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/users', (req, res) => {
  console.log('sdfklj');
  const { username, password } = req.body;
  if (!password || password === '') {
    res.status(STATUS_USER_ERROR).json({ error: 'You must enter a password' });
  }
  const newUser = new User();
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      console.log({ error: err });
    }
    newUser.username = username;
    newUser.passwordHash = hash;
    newUser
      .save()
      .then((savedUser) => {
        res.status(200).json(savedUser);
      })
      .catch((saveError) => {
        sendUserError(saveError, res);
      });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    sendUserError('Missing Password!', res);
  }
  User.findOne({ username })
    .then((user) => {
      user.checkPassword(password).then((valid, err) => {
        if(err){
          sendUserError(err);
        }
        if(!valid) {
         res.status(422).json({ success: false });
      } else if (valid) {
         req.session.user = user;
         res.status(200).json({ success: true });
      }
    });

      
    })
    .catch((saveError) => {
      sendUserError(saveError, res);
    });
});

module.exports = { server };
