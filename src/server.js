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
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true, 
  saveUninitialized: false
}));

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));


//==============================================================================
//                                MIDDLEWARE
//==============================================================================


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

// const hashedPwd = (req, res, next) => {
//   const { password } = req.body;
//   if (!password) {
//     res.status(STATUS_USER_ERROR).json(sendUserError('A password is required!', res));
//   }
//   bcrypt
//     .hash(password, BCRYPT_COST)
//     .then(password => {
//       req.password = password;
//       next();
//     })
//     .catch(err => {
//       res.status(STATUS_USER_ERROR).json(sendUserError('Fatal error!', res));
//     });
// };

const confirmLoggedIn = (req, res, next) => {
  const { username } = req.session;
  if (!username) {
    res.status(STATUS_USER_ERROR).json(sendUserError('Fatal error!', res));
  } else {
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(404).json(sendUserError('No such user found!', res));
        } else {
          req.user = user;
          next();
        };
      });
  };
};

const permissions = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      res.status(STATUS_USER_ERROR).json(sendUserError('You do not have permission!', res));
      return;
    }
  }
  next();
}

server.use(permissions);

//==============================================================================
//                                ROUTES
//==============================================================================

server.post('/users', (req, res) => {
  const { username } = req.body;
  // console.log("this is in the route: ", req.body);
  const passwordHash = req.body.password;
  const newUser = new User({ username, passwordHash });
  newUser
    .save()
    .then(user => {
      // console.log("this is after save..in the route: ", user)
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(STATUS_USER_ERROR).json(sendUserError('There was an error!', res));
    });
});

// server.post('/users', (req, res) => {
//   const { username, password } = req.body;
//   console.log(req.body)
//   const newUser = new User({ username, passwordHash: password });
//   newUser
//     .save()
//     .then(res => {
//       console.log(res);
//     }) 
// });

// server.post('/log-in', (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     res.status(STATUS_USER_ERROR).json(sendUserError('Must provide a username and a password!', res));
//   } else {
//     User.findOne({ username })
//     .then(user => {
//       user.checkPassword(password, (err, validated))
//     })
//     .catch( user => res.send({ error: "DB can't find user" }));
//   };       
// });

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(STATUS_USER_ERROR).json(sendUserError('Must provide a username and a password!', res));
  } else {
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(404).json(sendUserError('No such user found!', res));
        } else {
          const hashedPass = user.passwordHash;
          bcrypt
            .compare(password, hashedPass)
            .then(res => {
              if (res === false) throw new Error(); 
              req.session.username = username;
              req.user = user;
            })
            .then(() => {
              res.json({ success: true });
            })
            .catch(err => {
              res.status(500).json(sendUserError('There wasn an error!', res));
            });
        }         
      });
  };
});

server.post('/logout', (req, res) => {
  // req.session.username = null;
  // req.session.loggedIn = null;
  // console.log(req.session);
  // res.json({ success: true });
  if (req.session.username) {
    req.session.destroy(function (err, success) {
      if (err) {
        sendUserError(err);
      } else {
        res.json({ success: true });
      }
    });
  };
});


server.get('/restricted/:path', (req, res) => {
  res.status(200).json({ message: 'You have permission!' });
});

//==============================================================================
//                                SERVER INFORMATION
//==============================================================================


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', confirmLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };


