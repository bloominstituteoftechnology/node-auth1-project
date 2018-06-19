const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost:27017/cs10').then(() => {
  console.log('\n*** Connected to database ***\n');
});

const server = express();

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
}

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({
      message: 'you shall not pass!!'
    })
  }
}

server.use(express.json());
server.use(session(sessionOptions));

server.get('/api/users', protected, (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
})

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.status(200).json({ message: ` welcome back ${req.session.username}` })
  } else {
    res.status(401).json({message: 'speak friend and enter'})
  }
})

server.post('/api/register', (req, res) => {
  // save the user to the database
  User.create(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .validatePassword(password)
          .then(passwordsMatch => {
            // continue if password match
            if (passwordsMatch) {
              req.session.username = user.username;
              res.send('successful login. Have you a cookie.')
            } else {
              res.status(401).send('invalid credentials')
            }
          })  
          .catch(err => {
            res.send('error comparing passwords')
          });
      } else {
        res.status(401).send('invalid credentials')
      }
    })
    .catch(err => {
      res.send(err)
    })
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye')
      }
    });
  }
});



server.listen(8000, () => {
  console.log('API running on port 8000')
})

