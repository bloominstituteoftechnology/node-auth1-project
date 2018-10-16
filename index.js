const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
  secret: 'jason.is-a.punk!',
  name: 'kevin',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1
  },
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session(sessionConfig));

server.post('/api/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 16);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = credentials.username;
      res.status(201).json({ id: id });
    })
    .catch(() =>
      res.status(500).json({ error: 'Oops! User could not be created.' })
    );
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(201).json({ welcome: user.username });
      } else {
        res
          .status(500)
          .json({ error: 'Wrong Username and/or Password, please try again' });
      }
    });
});

server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.json(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json('You can not leave.');
      } else {
        res.json('goodbye');
      }
    });
  }
});

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized.' });
  }
}

const port = 6000;
server.listen(port, () => console.log(`API is listening on port ${port}.`));
