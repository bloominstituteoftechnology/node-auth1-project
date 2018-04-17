/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

// TODO: implement routes
server.post('/users', (req, res) => {
  let { username, password } = req.body;
  //console.log(req.body);
  
  if (username && password) {
    bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
      if (err) {
        sendUserError(err, res);
        return;
      }
      
      password = hash;
      
      const user = new User({ username, passwordHash: password});
      //console.log('user: ', user);
      user
      .save()
      .then(savedUser => res.status(200).json(savedUser))
      .catch(err => {
        sendUserError(err, res);
      });
    });
    
  } else {
    sendUserError({error: "provide username and password"}, res);
  }
});

server.get('/', (req, res) => {
  User.find({})
  .then(response => res.status(200).json(response))
  .catch(err => res.status(500).json(err));
});


// TODO: add local middleware to this route to ensure the user is logged in
server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  //console.log("req.body:", req.body);
  
  if (username && password) {
    if (!req.session.user) {
      req.session.user = username;
    }
    if (!req.session.password) {
      req.session.password = password;
    }
    
    User.findOne({ username })
    .then(response => {
      console.log('response: ', response);
      let isValidPassword;
      
      bcrypt.compare(req.session.password, response.passwordHash, (err, isValid) => {
        if (err) {
          throw err;
        }
        if (isValid) {
          isValidPassword = true;
          console.log("isValid :", isValidPassword);
        } else {
          isValidPassword = false;
          console.log("isValid :", isValidPassword);
          res.status(422).json({ error: "wrong password" });
        }
      });
      
      console.log('isValidPassword :', isValidPassword);
      
      if (req.session.user === response.username && isValidPassword) {
  
        res.status(200).json({ success: true });
        
      } else {
        sendUserError(err, res);
      }
    })
    .catch(err => {
      sendUserError(err, res);
    });
  } else {
    sendUserError({error: "provide username and password"}, res);
  }
});


server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
