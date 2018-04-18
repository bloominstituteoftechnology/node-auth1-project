/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();

let counter = 0;
const validate = function(req, res, next) {
  //console.log(`=== ${++counter} ===`);
    if (req.session && req.session.user_id) {
      User.findById(req.session.user_id).then(res => {
        console.log(res);
        req.user = res;
        next();
      })
      .catch(err => console.log("it didnt"));
    } else {
      sendUserError({ error: "wrong user" }, res);
      return;
    }
  };


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
    User.findOne({ username })
    .then(user => {
      //console.log('user: ', user);
      user.passwordCheck(password).then(isValid => {
        if (isValid) {
          console.log(!!req.session.user_id);
          req.session.user_id = user._id;
          //console.log("session from log: ", req.session.id);
          res.status(200).json({ success: true });
        } else {
          sendUserError({message: "you no enter!"}, res);
        }
      })
      .catch(err => sendUserError(err, res));
    })
    .catch(err => sendUserError(err, res));
  } else {
    sendUserError({ message: "MUST! MUST!!! provide username or password" }, res);
    //res.status(422).json({ message: "please provide username or password" });
  }
});





server.get('/me', validate, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };

