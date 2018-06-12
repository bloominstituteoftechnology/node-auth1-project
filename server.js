const express = require('express');
const session = require('express-session')
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
const MongoStore = require('connect-mongo')(session);

const User = require('./users/userModel')

mongoose.connect('mongodb://localhost/user')
  .then(() => {
    console.log('connected to database')
  })
  .catch(err => {
    console.log('database connection failed')
  })

// middleware
const sessionOptions = {
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1000 * 60 * 60 // an hour
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
  store: new MongoStore({
    url: 'mongodb://localhost/session',
    ttl: 60 * 10
  })
};

server.use(express.json());
server.use(session(sessionOptions));

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.json({ message: `welcome back ${req.session.username}` });
  } else {
    res.json({ api: 'is running' });
  }
})

server.post('/register', (req, res) => {
  const newUser = new User(req.body);
  if (!newUser.username || !newUser.password) {
    res.status(400).json({ error: "Please provide both username and password for the user." });
    return;
  }
  User.create(newUser)
    .then(user => {
      // console.log(user.password)
      res.status(201).json(user)
    })
    .catch(err => {
      console.log('database connection failed')
    })
})

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username
            res.send('have a cookie')
          } else {
            res.status(401).send('invalid credentials');
          }
        })
      } else {
        res.status(401).send('invalid credentials')
      }
    })
    .catch(err => res.status(500).send(err));
})

server.get("/users", (req, res, next) => {
  if (req.session.username) {
    User.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ error: "You shall not pass" });
  }
});

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('Goodbye!');
      }
    })
  }
})

server.listen(5000, () => {
  console.log('api running on port 5000')
})