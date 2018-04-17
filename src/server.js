const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const UserModel = require('./user');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

mongoose
  .connect('mongodb://localhost/Users')
  .then(() => console.log('\n=== Connected to Users Database ===\n'))
  .catch(() => console.log('\n=== Error Connecting to Users Database ===\n'));

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

const checkLoginStatus = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.status(400).json({ errMsg: 'User Not Logged In.' });
  } else {
    res.status(200).json({ msg: 'User logged in.' });

    next();
  }
};

// TODO: implement routes

server
  .post('/users', (req, res) => {
    const { username, password } = req.body;
    const credentials = { username, passwordHash: password };
    const user = new UserModel(credentials);

    if (!username || !password) {
      res.status(STATUS_USER_ERROR).json({ errMsg: 'Please provide username and password.' });
    } else {
      user

        .save()
        .then(response => {
          res.status(200).json(response);
        })
        .catch(err => {
          res.status(500).json({ errMsg: 'Invalid username and/or password.' });
        })
    }
  })
  
  server
    .post('/log-in', (req, res) => {
      const loggedUser = req.body.username;
      const loggedPswd = req.body.password;
      
      if (!loggedUser || !loggedPswd) {
        res.status(422).json({ errMsg: 'Please provide the correct username and password.' });
      } else {

        UserModel

          .findOne({ username: loggedUser })
          .then(response => {
            if(!response) {
              res.status(404).json({ errMsg: 'Invalid username.' });
            } else {
              
              response

                .isValidLogin(loggedPswd, (isAMatch) => {
                  if( !isAMatch ) {
                    res.status(400).json({ errMsg: 'Invalid password. Please try again.' });
                  } else {
                    req.session.loggedIn = true;
                    res.status(200).json({ success: true });
                  }
                })
                
            }
          })
          .catch(err => {
            res.status(500).json({ errMsg: 'There was an error on the server.' });
          });
      }
    });

// TODO: add local middleware to this route to ensure the user is logged in


server.get('/me', checkLoginStatus, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
