const express = require('express');
const mongoose = require('mongoose')
const User = require('./users/user');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const server = express()


mongoose
  .connect('mongodb://localhost/authdb')
  .then(mongo => {
    console.log('connected to database');
  })
  .catch(err => {
    console.log('Error connecting to database', err);
  });
  function authenticate(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).send('You shall not pass!!!');
    }
  }


const sessionConfig={
    secret: 'nobody tosses a dwarf!',
    cookie:{
      maxAge: 1 * 24 * 60 * 60 * 1000,

    },
    httpOnly: true,
    secure: false,
    resave:true,
    saveUninitialized: false,
    name:'noname',
    store: new MongoStore({
      url:'mongodb://localhost/sessions',
      ttl: 60 * 10,

    })
  }
  server.use(express.json())
  server.use(session(sessionConfig));

  server.get('/', (req, res) => {
    if (req.session && req.session.username) {
      res.send(`welcome back ${req.session.username}`);
    } else {
      res.send('who are you? who, who?');
    }
  });

  server.post('/register', function(req, res) {
    const user = new User(req.body);
  
    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  });
  server.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
      .then(user => {
        if (user) {
          user.isPasswordValid(password).then(isValid => {
            if (isValid) {
              req.session.username = user.username
              res.send('have a cookie');
            } else {
              res.status(401).send('invalid password');
            }
          });
        } else {
          res.status(401).send('invalid username');
        }
      })
      .catch(err => res.send(err));
  })
server.get('/users', authenticate, (req, res) => {
  User.find().select('username -_id').then(users => res.send(users));
});
server.get('/logout', (req, res) => {
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

  const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
