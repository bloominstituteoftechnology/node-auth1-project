/*eslint-disable*/

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;
const server = express();

//sends user error when one is generated
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

//validates whether user has a session
const validate = function(req, res, next) {
  if (req && req.session) {
    User.findById(req.session.user_id)
    .then(res => {
      req.user = res;
      next();
    }).catch(console.log('No user could be found.'));
  } else {
    sendUserError({ error: "You are not logged in." }, res);
    return;
  } 
};

//middleware for restricted base url
const restricted = (req, res, next) => {
  if(req.url.includes('/restricted')) {
    if(req) {
      next();
    } else {
      sendUserError({message: 'You are not currently logged in.'}, res);
      return;
    }
  } else {
    next();
  }
}

mongoose
  .connect('mongodb://localhost/authdb')
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  })
  .catch(err => console.log('database connection failed', err));

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true,
};

server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  secure: false,
  name: 'auth',
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));
server.use(restricted);



// TODO: implement routes

server.get('/restricted/users', (req, res) => {
  User
    .find()
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => res.json);
});

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, passwordHash: password });

  user
    .save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    User
      .findOne({ username })
      .then((user) => {
        user.isPasswordValid(password, user.passwordHash)
          .then(isValid => {
            if(isValid) {
              req.session.user_id = user._id;
              res.status(200).json({success: true});
            } else {
              sendUserError({message: "Username/password match not found."}, res);
            }
          })
          .catch(err => sendUserError(err, res));
        }).catch(err => sendUserError(err, res));
    } else {
      sendUserError({message: "You must enter both a username and a password."}, res);
  }
});

server.post('/logout', (req, res) => {
  if(req.session.user_id) {
    req.session.destroy();
    res.status(200).json({ message: 'See you soon!' });
  } else {
    sendUserError({ message: 'You aren\'t logged in!' }, res);
  }
})


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', validate, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
