const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./User/user');
const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n=== connected to mongo ===\n');
  })
  .catch(err => console.log('error connecting to mongo', err));



function authenticate(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).send('You shall not pass!!!');
  }
}

const sessionConfig = {
  secret: 'Somebody Once told me..',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10,
  }),
};

app.use(express.json());
app.use(session(sessionConfig));

app.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back ${req.session.username}`);
  } else {
    res.send('who are you?');
  }
});

app.get('/api/users', authenticate, (req, res) => {
  User.find().then(users => res.send(users));
});

app.post('/api/register', function(req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {

        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username;
            res.send('');
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




app.listen(8000, ()=> console.log('\n=== api running on 8k ===\n'))
