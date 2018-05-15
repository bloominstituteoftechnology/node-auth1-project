const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);  // must be after session as it calls session

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authAppdb')
  .then(conn => {
    console.log('\n=== connected to mongodb ===\n');
  })
  .catch(err => console.log ('error connecting to mongodb', err));

  const server = express();

  function authenticate(req, res, next) {
    if(req.session && req.session.username) {
      next();
    } else {
      res.status(401).send('MENE MENE TEKEL UPHARSIN');
    }
  }

  server.use(express.json());
  server.use(
    session({
      secret: 'The goodness of God leadeth thee to repentence.',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
      },
      httpOnly: true,
      secure: false,
      resave: true,
      saveUnintialized: false,
      name: 'GodIsWatchingYou',
      store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
      })
    })
  );

  server.get('/', (req, res) => {
    if (req.session && req.session.username) {
      res.send(`welcome back, ${req.session.username}`);
    } else {
      res.send('Access Denied.  You must log in first.');
    };
  });

  server.get('/users', authenticate, (req, res) => {
    User.find().then(users => res.send(users));
  });

  server.post('/api/register', function(req, res) {
    const user = new User(req.body);
    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  });

  server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
      .then(user => {
        if (user) {
          user.isPasswordValid(password).then(isValid => {
            if (isValid) {
              req.session.username = user.username;
              res.send('Cookie created.');
            } else {
              res.status(401).send('You gave invalid credentials');
            }
          })
        }
      })
      .catch(err => res.send(err));
  });

  server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          res.send('error');
        } else {
          res.send('You have been logged out.');
        }
      })
    }
  })

  server.listen(5000, () => console.log('\n=== api running on port 5000 ===\n'));