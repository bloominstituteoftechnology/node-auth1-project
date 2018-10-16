const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./data/dbConfig.js');

const server = express();
const port = 4400;

sessionConfig = {
  secret: 'Run.you.FOOLS!',
  name: 'yum',
  httpOnly: false,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 3,
  },
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};
server.use(session(sessionConfig));

server.use(express.json(), helmet());

server.get('/api/users', protected, (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

server.post('/api/register', (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 12);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = credentials.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => res.status(500).json(err));
});

server.post('/api/login', (req, res) => {
  const login = req.body;

  db('users')
    .where({ username: login.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(login.password, user.password)) {
        req.session.username = user.username;
        res
          .status(200)
          .json({ login: `${user.username} make your way to Mount Doom.` });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).json('You shall not leave!');
      } else {
        res.status(200).json('You shall pass!');
      }
    });
  }
});

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
}

server.listen(port, () => console.log(`===API running on ${port} port===\n`));
