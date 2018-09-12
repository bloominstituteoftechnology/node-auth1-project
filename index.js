const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const KnexSessionStore = require('connect-session-knex')(session);
const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

const sessionConfig = {
  name: 'monkey', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(sessionConfig));

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;

  db('users').insert(creds).then(ids => {
    res.status(201).json({ message: 'You have successfully registered!'})
  }).catch(err => {
    res.status(500).send(err);
  })
});

server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users').where({ name: creds.name}).first().then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      req.session.name = creds.name;
      res.status(200).json({message: 'Welcome! You\'ve made it!'});
    }
    else {
      res.status(401).send('You shall not passsss!');
    }
  }).catch(err => {
    res.status(500).send(err);
  })
});

server.get('/api/users', (req, res) => {
  if (req.session && req.session.name) {
    db('users').select('id', 'name').then(users => {
      res.status(200).json(users);
    }).catch(err => {
      res.status(500).json(err);
    })
  }
  else {
    res.status(401).json({ message: 'You shall not pass!'})
  }
})

server.listen(5000);
