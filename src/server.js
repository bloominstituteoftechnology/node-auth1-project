/* eslint-disable */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

// mongoose
//   .connect('mongodb://localhost/authproj')
//   .then(() => {
//     console.log('\n === Mangos === \n')
//   })
//   .catch(err = console.log('no mangos', err));

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
  const { username, password } = req.body;
  const newUser = new User({ username, passwordHash: password });

  // if (!username || !password) { 
  //   res.status(422).json({message: 'User missing username or password.'})
  // }

  if (!username) {
    res.status(422).json({message:'Missing Username.'})
  }
  if (!password ) {
    res.status(422).json({message:'Missing Password.'})
  }
  else{
  newUser
    .save()
    .then((saved) => res.status(200).json(saved))
    .catch((err) => {sendUserError(err, res)})
  }
})

server.post('/log-in', (req, res) => {

  if(!username) {
    res.status(404).json({message:'Enter Your Username.'})
  }
  if(!password){
    res.status(400).json({message:'Enter Your Password.'})
  }
  
})

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
})

module.exports = { server };
