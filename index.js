const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

const sessionConfig = {
  name: 'apeapi',
  secret: 'this is bananas',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'kong',
    sidfieldname: 'donkey',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

// test api
server.get('/', (req, res) => {
  res.send('API UP!');
});

// return registered users
server.get('/api/users', (req, res) => {
  if(req.session && req.session.user){
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  } else {
    res.status(401).json({ you: 'shall not pass!!' });
  }
});

// register a user
server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => json(err));
});

// login - checks supplied user against database
server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.user = user.id;
        res.status(200).json({ message: 'logged in' });
      } else {
        res.status(401).json({ message: 'login failed' });
      }
    }).catch(err => res.json(err));
});

// logout - destroys session
server.get('/api/logout', (req,res) => {
  if(req.session) {
    req.session.destroy(err => {
      if(err) {
        res.send('Welcome to the Hotel California!');
      } else {
        res.send('l8r');
      }
    });
  } else {
    res.end();
  }
});

// protected middleware
// function protected = 

server.listen(8300, () => console.log('\nServer running on 8300\n'));