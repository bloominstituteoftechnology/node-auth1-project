const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const server = express();

// MODEL/COLLECTION REFERENCE
const User = require('./users/userModel');

// CONNECT TO MONGO
mongoose
  .connect('mongodb://localhost/auth')
  .then(connected => console.log("connected to mongo"))
  .catch(error => console.log("error connecting to mongo"))

// DATA SECURITY AND BODY PARSER 
server.use(helmet())
server.use(express.json())

// LOCAL MIDDLEWARE //
const authenticateUserInput = (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    User
      .find({ username })
      .then(user => user ? next() : res.send("username is already in use."))
      .catch(err => res.send("error authenticating username"))
  } else { res.send("must provide a username and password") }
}

// DISPLAY ALL USERS - for development purposes
server.get('/users', (req, res) => {
  User
    .find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: "error fetching users" }))
})

// CREATE NEW USER
server.post('/register', authenticateUserInput, (req, res) => {
  User
  .create(req.body)
  .then(user => res.status(201).json(user))
  .catch(err => res.status(500).json({ error: "Unable to register new user." }))
})

// LOGIN WITH EXISTING USER
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  User
    .findOne({ username })
    .then(user => {
      user ? (
        user.isPasswordValid(password).then(isValid => {
          isValid ? res.send('login success') : res.send('invalid login attempt')
          // isValid ? req.session.username = user.username : res.send('invalid login credentials') // invalid password
        })) : ( res.send('invalid login credentials') ) // invald username - dons't exist in database
    })
})

// TEST IF SERVER IS CONNECTED
server.get('/', (req, res) => res.send("server is running"))

server.listen(5000, () => console.log("server is listening on port 5k"))

// server.use(session({ secret: "U>:vt5r]U{_s]`c].}rED,>fK*d/omM_DG2H2<S2psBW<C/S.wLPEk@SY]F)" }))