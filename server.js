const express = require('express');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const helpers = require('./data/helpers');

const server = express();
const db = require('./data/dbConfig');
const mw = require('./middleware');

server.use(express.json());
server.use(cookieParser());
server.use(morgan('dev'));

server.use(
  session({
    secret: 'nobody tosses a dwarf!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: true,
    resave: false,
    saveUninitialized: false,
  }),
);

server.use(mw.errorHandler);

server.get('/', (req, res) => {
  res.send(req.session.name);
});

server.post('/api/register', (req, res, next) => {
  helpers
    .register(req.body)
    .then(response => res.status(201).json(response))
    .catch(next);
});

server.post('/api/login', (req, res, next) => {
  let body = req.body;
  helpers
    .login(body)
    .then(response => {
      if (response) {
        req.session.name = body.username;
        res.status(200).json(`Welcome ${req.session.name}`);
      } else next({ code: 400 });
    })
    .catch(next);
});

server.get('/api/users', mw.isLoggedIn, (req, res, next) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(next);
});

server.use(mw.errorHandler);
server.listen(7000, () => console.log('ya made it to port 7000 mon'));
