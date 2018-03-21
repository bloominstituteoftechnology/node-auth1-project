const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;

const server = express();
server.use(cors());


// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
  })
);

// I used the test() function that Ryan showed us this morning to test for a url containing "restricted", ignoring case sensitivity
const routeCheck = (req,res,next) => {
  const restrictURL = new RegExp("/restricted", "i");
  let url = req.path;
  if (restrictURL.test(url)) {
  if (!req.session.ID) return res.status(400).json({err: "Failed to log in."})
  next();
  }
  else next();
};

server.use(routeCheck);

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

// got rid of the password hashing function from here, since it is now embedded in the user schema
server.post('/users', (req, res) => {
  console.log("Post Requsest Received: ", req.body);
  if (!req.body.username || !req.body.password) {
    res.status(422).json({ error: 'Need username and password' });
  }
  const {username, password} = req.body;
  const newUser = new User({ username, passwordHash: password });
  newUser
    .save()
    .then(user => {
      res.status(200).json({ message: 'User Created', user });
    })
    .catch(error => {
      sendUserError(error, res);
    });
});

// changed the session to use the ._id instead of the username to get exact session matches
server.post('/log-in', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(422).json({ error: 'Need username and password' });
  }
  let { username, password } = req.body;
  username = username.toLowerCase();
  User.findOne({ username })
    .then(userFound => {
      bcrypt.compare(password, userFound.passwordHash)
        .then(result => {
          if (result) {
            req.session.ID = userFound._id;
            res.status(200).json({ success: true });
          }
        })
        .catch(err => {
          sendUserError(err,res);
      });
    })
    .catch(err => {
      sendUserError(err,res);
    });
});

// Since we are using the ID instead of the username, we have to search for the username with findByID and the session user's ID
const loggedIn = (req,res,next) => {
  if (!req.session.ID) return res.status(400).json({err: "You are not logged in"})
  userID = req.session.ID;
  User.findById(userID)
  .then((user) => {
    req.user = user.username;
    next();
  }).catch((err) => {
    sendUserError(err, res);
  });
}

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/', (req, res) => {
  User.find()
  .then(users => {
    res.json(users);
  });

})

// to test the routeCheck functionality
server.get('/restricted/', (req,res) => {
  res.status(200).json('Restricted Working, you are logged in');
});
module.exports = { server };
