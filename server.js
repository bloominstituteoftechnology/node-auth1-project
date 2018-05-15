const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./user/user');

mongoose.connect('mongodb://localhost/authdb')
.then(conn => {
    console.log('\n== Connected to DB ==\n')
})
.catch(err => {
    console.log('\n== Somethings not right...? ==\n')
})

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).send('You shall not pass!!!');
    }
  }
const server = express();

const sessionConfig = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    }, // 1 day in milliseconds
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'wouldnt you like to know',
    store: new MongoStore({
      url: 'mongodb://localhost/sessions',
      ttl: 60 * 10,
    }),
  };

server.use(express.json());
server.use(session(sessionConfig));


server.get('/', (req, res) => {
    res.send('Running and Running')
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user
    .save()
    .then(user => {
        res.status(201).json({ user })
    })
    .catch(err => {
        res.status(500).send('Something went wrong brah');
    });
})

server.post('/api/login', function(req, res) {
  const { username, password } = req.body;
  User.findOne({ username })
  .then(user => {
    if (user) {
      // compare the passwords
      user.isPasswordValid(password).then(isValid => {
        if (isValid) {
          req.session.username = user.username;
          res.send('logged in');
        } else {
          res.status(401).send('invalid password');
        }
      });
    } else {
      res.status(401).send('invalid username');
    }
  })
  .catch(err => res.send(err));
});

server.get('/api/users', authenticate, function(req, res) {
    User.find().then(users => res.send(users));
})
server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(function(err) {
        if (err) {
          res.send('error');
        } else {
          res.send('good bye');
        }
      });
    }
  });

server.listen(5000, () => console.log('\n===We have lift off on port 5k===\n'));