const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/dbConfig');

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(helmet());
app.use(logger('dev'));
app.use(session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  }));

app.get('/', (req, res) => {
  res.json({message: 'your app is running!'});
});

app.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 14);
  console.log('user', user);
  db('users').insert(user)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

app.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users').where('username', creds.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(creds.password, users[0].password)) {
        req.session.userId = users[0].id;
        console.log('session', req.session);
        res.json({message: 'Logged in'});
      } else {
        res.status(404).json({err: 'invalid username or password'});
      }
    })
    .catch(err => {
      res.status(500).json({err});
    });
});

app.listen(PORT, () => {
  console.log(`app is running on PORT: ${PORT}`);
});
