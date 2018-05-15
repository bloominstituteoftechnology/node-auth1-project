const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./users/User');

mongoose.connect("mongodb://localhost/auth")
  .then(() => console.log("\n=== Database Connected ===\n"))
  .catch(err => console.log("\n*** No Connection to Database ***\n"));

const server = express();

const sessionConfig = {
  secret: 'zsdfgljzxhdfscvkrlfkjnsdfsd',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 10000
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'auth-testing',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 600
  })
}

server.use(express.json());
server.use(session(sessionConfig));

const authenticate = (req, res, next) => {
  if (req.session && req.session.username)
    next();
  else
    res.status(401).json({msg: 'Please login to proceed'});
}

server.get('/', (req, res) => res.send("API Connected"));

server.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err));
})

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username;
            res.status(200).json({msg: 'Login Successful'});
          } else {
            res.status(401).json({msg: 'Invalid Credentials'});
          }
        })
      } else {
        res.status(401).json({msg: 'Invalid Credentials'});
      }
    }).catch (err => res.status(500).json(err))
})

server.get('/users', authenticate, (req, res) => {
  User.find().then(users => res.json(users));
})

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) res.status(500).json(err);
      else res.status(200).json({msg: 'Successfully logged out'});
    })
  }
})

server.listen(5000, () => console.log("\n=== Server Active on Port 5000 ===\n"));