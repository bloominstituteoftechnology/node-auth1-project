const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => console.log('=== connected to mongo ==='))
  .catch(err => console.log('error connecting to mongo', err));

const server = express();

// Global middleware to authenticate login
function authenticate(req, res, next) {
  if (req.session && req.session.username) next();
  else res.status(401).send('You shall not pass!!!');
}

const sessionConfig = {
  secret: 'nobody tosses a dwarf!',
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'COOKIES!!!',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10,
  }),
};

server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back ${req.session.username}`);
  } else res.send('who are you?');
});

// Register new user
server.post('/api/register', (req, res) => {
  // Create new user from req body and save
  const newUser = new User(req.body);
  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => {
      res.status(500).json({
        error: 'Could not complete registration'
      })
    });
});

// Login exsiting user
server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then(user => {
      // If user is not found then return error
      if(!user) res.status(401).json('Invalid credentials');
      // Check if password matches hash
      user.isPasswordValid(password).then(isValid => {
        if(isValid) { // Create session cookie
          req.session.username = user.username;
          res.json(`Logged in as ${username}`);
        } else res.status(401).send('invalid password');
      });
    })
    .catch(err => {
      res.status(500).json({
        error: 'Something went wrong while logginh in'
      })
    });
});

// Retrieve users
server.get('/api/users', authenticate, (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => {
      res.status(500).json({
        error: 'Could not retrieve users',
      });
    });
});

// Logout current user
server.get('/api/logout', (req, res) => {
  console.log(req.session);
  if(req.session) {
    const username = req.session.username;
    req.session.destroy(err => {
      console.log(req.session);
      if (err) res.json('Error')
      else res.json(`Good Bye`);
    });
  }
});

server.listen(8000, () => {
  console.log('=== api running on port 8000 ===')
});
