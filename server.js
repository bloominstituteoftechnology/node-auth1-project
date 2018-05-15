const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(connection => {
    console.log('connection success!');
  })
  .catch(error => {
    console.log(error)
  });

const port = 3000;
const server = express();
server.use(express.json());
server.use(session(sessionConfig));

const sessionConfig = {
  cookie: {
    key: value,
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitalized: false,
  name: 'notExpressSession',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10 * 10,
  }),
};

function authenticate(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401);
    res.send('Login failed, please try again');
  };
}

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`welcome back ${req.session.username}`);
  } else {
    res.send('Login failed, please try again');
  }
})

server.post('/register', function (req, res) {
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
        user.isPasswordValid(password).then(validPassword => {
          if (validPassword) {
            req.session.username = user.username;
            res.send('have a cookie!');
          } else {
            res.status(401).send('invalid password');
          }
        });
      } else {
        res.status(401).send('invalid password');
      }
    })
    .catch(err => res.send(err));
});

server.listen(port, () => console.log(`\n == HOMIE YOU ARE NOW listening on port ${port}`));