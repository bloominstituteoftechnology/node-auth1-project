const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const helpers = require('./data/helpers');

const server = express();
const db = require('./data/dbConfig');
const mw = require('./middleware');

server.use(express.json());
server.use(morgan('dev'));
// server.use(
//   session({
//     name: 'notsession', // default is connect.sid
//     secret: 'nobody tosses a dwarf!',
//     cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
//     httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
//     secure: true, // only set cookies over https. Server will not send back a cookie over http.
//     resave: false,
//     saveUninitialized: false,
//   })
// );

server.use(mw.errorHandler);

server.get('/', (req, res) => {
  res.send('Sup fam');
});

server.post('/api/register', (req, res, next) => {
  helpers
    .register(req.body)
    .then(response => res.status(201).json(response))
    .catch(next);
});

server.post('/api/login', (req, res, next) => {
  helpers
    .login(req.body)
    .then(response => {
      if (response) {
        res.status(200).json('Welcome');
      } else next({ code: 400 });
    })
    .catch(next);
});

server.get('/api/users', (req, res) => {
  db('users')
    .then(users => res.json(users))
    .catch(next);
});

server.use(mw.errorHandler);
server.listen(7000, () => console.log('ya made it to port 7000 mon'));
