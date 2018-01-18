const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const UserModel = require('./user');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true,
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

const authorization = (req, res, next) => {
  if (req.session.userInfo) {
    req.user = req.session.userInfo.userName;
    next();
  } else {
    sendUserError({ message: 'not authorized, please log in' }, res);
  }
};
server.use('/restricted/', authorization);

const hashPw = (req, res, next) => {
  const { password } = req.query;
  if (!password) {
    sendUserError({ message: 'Missing password' }, res);
  } else {
    bcrypt.hash(password, 10, (err, hashedPw) => {
      if (err) sendUserError(err, res);
      req.passwordHash = hashedPw;
      next();
    });
  }
};

// TODO: implement routes
server.post('/user', hashPw, (req, res) => {
  const { user } = req.query;
  const hashedPassword = req.passwordHash;

  if (!user) {
    // res.status(404).json({ message: 'provide user' });
    sendUserError({ message: 'not a user provided' }, res);
  } else {
    // userModel.find({username: user }).then(userInfo => console.log(userInfo)).catch(err => console.log(err))
    UserModel.findOne({ username: user }, (err, userInfo) => {
      if (err) sendUserError(err, res);
      if (userInfo) {
        sendUserError({ message: 'User already exist' }, res);
      } else {
        const newUser = new UserModel({
          username: user,
          passwordHash: hashedPassword
        });
        newUser.save();
        res.status(200).json({ msg: 'User Saved' });
      }
    });
  }
});

server.post('/log-in', (req, res) => {
  const { user, password } = req.query;

  if (!user || !password) {
    sendUserError({ message: 'please provide username and password' }, res);
    return;
    // res.status(422).json({ msg: 'provide username or pwd' });
  }

  UserModel.findOne({ username: user }, (err, userInfo) => {
    if (err) sendUserError({ message: 'No user found' }, res);
    bcrypt.compare(password, userInfo.passwordHash, (error, status) => {
      if (error) sendUserError({ message: 'password not provided' }, res);
      if (status) {
        req.session.userInfo = {
          userName: user,
          logged: true
        };

        res.status(200).json({ success: true });
      } else {
        sendUserError({ message: 'user or password invalid' }, res);
      }
    });
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authorization, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/restricted/books', (req, res) => {
  res.status(200).json({ success: true });
});

server.get('/restricted/something', (req, res) => {
  res.status(200).json({ success: true });
});
server.get('/restricted/other', (req, res) => {
  res.status(200).json({ success: true });
});


module.exports = { server };
