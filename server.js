const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
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

// DATA SECURITY, BODY PARSER, CORS, SESSION
server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session({
  secret: "U>:vt5r]U{_s]`c].}rED,>fK*d/omM_DG2H2<S2psBW<C/S.wLPEk@SY]F)",
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  httpOnly: true,
  secure: false,
  name: "anon",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ url: "mongodb://localhost/sessions" })
}))

// LOCAL MIDDLEWARE // validate username and password input
const authenticateUserInput = (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    User
      .find({ username })
      .then(user => user ? next() : res.send("username is already in use."))
      .catch(err => res.send("error authenticating username"))
  } else { res.send("must provide a username and password") }
}

// LOCAL MIDDLEWARE // check if a user is loggen in
const isLoggedIn = (req, res, next) => {
  req.session && req.session.username ? next() : res.status(401).json({ error: 'you shall not pass!' })
}

// applies specified middleware to all matching routes 
server.all('/restricted/*', isLoggedIn);

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
  User.findOne({ username }).then(user => {
    if (user) {
      user.isPasswordValid(password).then(isValid => {
        if (isValid) {
          req.session.username = user.username;
          res.send('have a cookie');
        } else {
          res.send('invalid login credentials') // invalid password
        }
      })
    } else {
      res.send('invalid login credentials') // invald username - dons't exist in database
    }
  })
})

// GET LIST OF ALL USERS IF LOGGED IN ~ remove "/restricted" for react app
server.get('/restricted/users', (req, res) => {
  User
    .find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: "error fetching users" }))
})

// LOGOUT 
server.get('/logout', (req, res) => {
  req.session ?
    req.session.destroy(err => {
      err ? res.send('error logging out') : res.send('goodbye')
    }) : null
})

// TEST IF SERVER IS CONNECTED
server.get('/', (req, res) => res.send("server is running"))

server.listen(5000, () => console.log("server is listening on port 5k"))