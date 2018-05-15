
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const User = require('./users/User');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const cors = require('cors'); 


const Restricted = require('./restricted/Restricted');

mongoose.connect('mongodb://localhost/authdb')
  .then(resp => console.log('connected to mongodb'))
  .catch(err => console.log(err));

server.use(express.json());
server.use(cors()); 

server.use(session({
  secret: 'You shall not pass!',
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  secure: false,
  name: 'AuthAplicationProject',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10,
  })
}));

function authenticate(req, res, next) {

  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).send('You shall not pass!!');
  }
}


server.get('/api/users', authenticate, (req, res) => {
  User.find().then(users => {
    res.send(users)
  })


server.post('/api/register', function (req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});


server.get('/api/logout', (req, res) => {
  if (req.session) {
    console.log('Current Session logout, session:', req.session);
    req.session.destroy(function (err) {
      if (err) {
        res.send("error");
      } else {
        res.send('Goodbye');
      }
    });
  };


});

server.get('/api/', (req, res) => {

  if (req.session && req.session.username) {
    res.send(`Welcome back ${req.session.username}`)
  } else {
    res.send("Who are you, really? Don't lie to me!")
  }
});


server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const passBody = req.body.password;

  const userInfo = { username, password };
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username;
            res.send("Have a cookie");

          } else {
            res.status(401).send('Invalid user-name')
          }
        });
      } else {
        res.status(404).send("Invalid PASSWORD")
      }
    }).catch(err => res.send(err))


});


  server.use('/api/restricted/', authenticate, Restricted);


server.listen(8000, () => console.log("server running on port 8000"));