/* eslint-disable */
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false
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

const restrictAccess = (req, res, next) => {
  if(req.url.startsWith('/restricted')) {
    if(req.session.loggedIn) {
      next();
    } else {
      sendUserError('Access Denied: You are not logged in', res);
    }
  } else {
    next();
  }
  // res.json(req.url)
};
server.use(restrictAccess);

server.get('/restricted/users', (req, res) => {
  User.find()
    .then((Users) => {
      res
        .send(Users)
    })
    .catch((err) => {
      sendUserError(err, res);
    })
});

// server.post('/users', (req, res) => {
//   const { username, password } = req.body;
//   if(username && password) {
//     bcrypt.hash(password, BCRYPT_COST)
//       .then(passwordHash => {
//         const newUser = new User({username, passwordHash});
//         newUser.save()
//           .then(user => {
//             res.send(user);
//           })
//           .catch(err => {
//             sendUserError(err);
//           });
//       })
//       .catch(err => {
//         sendUserError(err);
//       });
//   } else {
//     res.status(STATUS_USER_ERROR).send({ message: 'Please send both a username and password'});
//   }
// });

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if(username && password) {
    const newUser = new User({username, passwordHash: password });
    newUser.save()
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        sendUserError(err, res);
      });
  } else {
    sendUserError('Please send both a username and password', res);
  }
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(username && password) {
    User.findOne({ username: username })
      .then(user => {
        if(user) {
          user.checkPassword(password,  (err, matched) => {
            if(matched) {
              req.session.loggedIn = user._id;
              res.send({ success: true });
            } else {
              sendUserError('Username or password does not match', res);
            }
          });
        } else {
          sendUserError('Please send both a username and password', res);
        }
      })
      .catch(err => {
        sendUserError(err, res);
      });
  } else {
    sendUserError('Please send both a username and password', res);
  }
});

server.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.loggedIn = false;
    res
      .status(200)
      .json({MESSAGE: 'You logged out correctly'})
  } else {
    sendUserError('Trouble logging out, might not be logged in', res);
  }

})

const auth = (req, res, next) => {
  const UA = req.headers['cookie'];
  req.session.UA = UA;
  if(req.session.loggedIn) {
    User.findById(req.session.loggedIn)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        console.error(err);
      });
    // req.user = req.session.loggedIn;
  } else {
    sendUserError('You are not logged in', res);
  }
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', auth, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
