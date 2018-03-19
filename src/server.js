const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');
const middleWare = require('./middlewares');
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
    saveUninitialized: true,
  }),
);
server.use(cors());
server.use(middleWare.restrictedPermissions);

const corsOptions = {
  'origin': 'http://localhost:3000',
  'credentials': true
};
server.use(cors(corsOptions));

/* ************ Routes ***************** */

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    middleWare.sendUserError('username undefined', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      middleWare.sendUserError('No user found at that id', res);
      return;
    }

    server.post('/logout', (req, res) => {
      req.session.user = null;
      res.status(200).json({ success: true });
    });

    const hashedPw = user.passwordHash;
    bcrypt
      .compare(password, hashedPw)
      .then((response) => {
        if (!response) throw new Error();
        req.session.username = username;
        req.user = user;
      })
      .then(() => {
        res.json({ success: true });
      })
      .catch((error) => {
        return middleWare.sendUserError('some message here', res);
      });
  });
});

server.post('/users', middleWare.hashedPassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ username, passwordHash });
  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both username/PW fields': err.message });
      return;
    }

    res.json(savedUser);
  });
});

server.post('/logout', (req, res) => {
  if (!req.session.username) {
    middleWare.sendUserError('User is not logged in', res);
    return;
  }
  req.session.username = null;
  res.json(req.session);
});

server.get('/restricted/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      middleWare.sendUserError('500', res);
      return;
    }
    res.json(users);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', middleWare.loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way
  res.send({ user: req.user, session: req.session });
});

module.exports = { server };
