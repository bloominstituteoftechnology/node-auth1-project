const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./data/db');
const server = express();
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
server.use(session(sessionOptions));
server.use(express.json());

function protected(req, res, next) {
  //console.log(req.session)
  console.log(req.session.username)
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({
      message: 'You are not authorized'
    })
  }
}

server.get('/api/users', protected, (req, res) => {
  db('User')
    .then(users => res.json(users))
    .catch(err => res.json(err));
})

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.status(200).json({ message: ` welcome back ${req.session.username}` })
  } else {
    res.status(401).json({message: ''})
  }
})

server.post('/api/register', (req, res) => {
  // save the user to the database
  console.log(req.body)
  db    
    .insert(req.body)
    .into('User')
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const { id } = req.params;
  db
    ('User')
    .where({ id })
    .then(user => {
      console.log(id)
      if (user) {
        user
          .validatePassword(password)
          .then(passwordsMatch => {
            // continue if password match
            if (passwordsMatch) {
              req.session.username = user.username;
              res.send('You are logged in')
            } else {
              res.status(401).send('invalid password')
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

server.listen(8000, () => {
  console.log('API running on port 8000')
})

